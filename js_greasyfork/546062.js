// ==UserScript==
// @name         Animate Emoji on the web --Q
// @namespace    Violentmonkey Scripts
// @version      2025-08-26_12-45
// @description  Animate emoji on the web using the noto animated emoji from Google.
// @author       Quarrel
// @homepage     https://github.com/quarrel/animate-web-emoji
// @match        *://*/*
// @exclude      https://news.ycombinator.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=emojicopy.com
// @noframes
// @resource     DOTLOTTIE_PLAYER_URL https://cdn.jsdelivr.net/gh/quarrel/dotlottie-web-standalone@2133618935be739f13dd3b5b8d9a35d9ea47f407/build/dotlottie-web-iife.js
// @resource     WASM_PLAYER_URL https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.50.1/dist/dotlottie-player.wasm
// @resource     LOTTIE_BACKUP_PUREJS_PLAYER_URL https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.13.0/lottie_canvas.min.js
// @grant        GM.xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @grant        GM.addElement
// @grant        GM.getResourceURL
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546062/Animate%20Emoji%20on%20the%20web%20--Q.user.js
// @updateURL https://update.greasyfork.org/scripts/546062/Animate%20Emoji%20on%20the%20web%20--Q.meta.js
// ==/UserScript==

'use strict';

const config = {
    DEBUG_MODE: false,
    EMOJI_DATA_URL:
        'https://googlefonts.github.io/noto-emoji-animation/data/api.json',
    LOTTIE_URL_PATTERN:
        'https://fonts.gstatic.com/s/e/notoemoji/latest/{codepoint}/lottie.json',
    UNIQUE_EMOJI_CLASS: 'animated-emoji-q',
    EMOJI_DATA_CACHE_KEY: 'animated-emoji-q-noto-emoji-data-cache',
    LOTTIE_CACHE_KEY: 'animated-emoji-q-lottie',
    CACHE_EXPIRATION_MS: 14 * 24 * 60 * 60 * 1000, // 14 days
    DEBOUNCE_DELAY_MS: 10,
    DEBOUNCE_THRESHOLD: 25,
    MAX_CONCURRENT_REQUESTS: 8,
    SCALE_FACTOR: 1.1,
};

(async () => {
    const scriptStartTime = Date.now();
    const emojiRegex = /\p{RGI_Emoji}/gv;

    let WA_ALLOWED = true;
    let unUsedWasmURL = null;
    let requestQueue = [];
    let activeRequests = 0;

    let emojiDataPromise = null;
    let pendingLottieRequests = {};
    const emojiToCodepoint = new Map();

    try {
        // A no-op WASM module - we need to understand if we're allowed to load WAsm modules early.
        const module = new WebAssembly.Module(
            Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
        );
        new WebAssembly.Instance(module);
    } catch (e) {
        if (e.message.includes('Content Security Policy')) {
            if (config.DEBUG_MODE) {
                console.warn(
                    '🇦🇺: ',
                    'Script using old pure JS animations on this page due to Content Security Policy.'
                );
            }
            const lottieJs = GM.getResourceURL(
                'LOTTIE_BACKUP_PUREJS_PLAYER_URL'
            );
            GM.addElement('script', {
                src: lottieJs,
                type: 'text/javascript',
            });

            WA_ALLOWED = false;
        }
    }
    if (WA_ALLOWED) {
        const wasmUrl = GM.getResourceURL('WASM_PLAYER_URL');
        unUsedWasmURL = wasmUrl;

        const dotLottieJs = GM.getResourceURL('DOTLOTTIE_PLAYER_URL');
        GM.addElement('script', {
            src: dotLottieJs,
            type: 'text/javascript',
        });
    }

    const getEmojiData = () => {
        return new Promise(async (resolve, reject) => {
            const cachedData = JSON.parse(
                await GM.getValue(config.EMOJI_DATA_CACHE_KEY, null)
            );
            if (
                cachedData &&
                cachedData.timestamp > Date.now() - config.CACHE_EXPIRATION_MS
            ) {
                resolve(cachedData.data);
                return;
            }
            GM.xmlhttpRequest({
                method: 'GET',
                url: config.EMOJI_DATA_URL,
                responseType: 'json',
                onload: (response) => {
                    if (response.status === 200) {
                        const dataToCache = {
                            data: response.response,
                            timestamp: Date.now(),
                        };
                        GM.setValue(
                            config.EMOJI_DATA_CACHE_KEY,
                            JSON.stringify(dataToCache)
                        );
                        resolve(response.response);
                    } else {
                        reject('Failed to load emoji data');
                    }
                },
                onerror: reject,
            });
        });
    };

    function processAnimationRequestQueue() {
        if (
            requestQueue.length === 0 ||
            activeRequests >= config.MAX_CONCURRENT_REQUESTS
        ) {
            return;
        }

        activeRequests++;
        const { codepoint, resolve, reject } = requestQueue.shift();

        GM.xmlhttpRequest({
            method: 'GET',
            url: config.LOTTIE_URL_PATTERN.replace('{codepoint}', codepoint),
            responseType: 'json',
            onload: async (response) => {
                if (response.status === 200) {
                    const data = response.response;
                    const uniqueCacheKey = `${config.LOTTIE_CACHE_KEY}_${codepoint}`;
                    const dataToCache = {
                        data,
                        timestamp: Date.now(),
                    };
                    await GM.setValue(
                        uniqueCacheKey,
                        JSON.stringify(dataToCache)
                    );
                    resolve(data);
                } else {
                    reject('Failed to load Lottie animation: ' + codepoint);
                }
            },
            onerror: reject,
            onloadend: () => {
                activeRequests--;
                processAnimationRequestQueue();
            },
        });
    }

    const getLottieAnimationData = async (codepoint) => {
        // if we've got the promise, it is either resolved or we need to wait on it - serves a runtime cache to avoid hitting GM.getValue too
        if (pendingLottieRequests[codepoint]) {
            return pendingLottieRequests[codepoint];
        }

        const uniqueCacheKey = `${config.LOTTIE_CACHE_KEY}_${codepoint}`;

        const cached = JSON.parse(await GM.getValue(uniqueCacheKey, null));
        if (
            cached &&
            cached.timestamp > Date.now() - config.CACHE_EXPIRATION_MS
        ) {
            if (config.DEBUG_MODE) {
                //console.log(`Lottie cache hit for ${codepoint}`);
            }

            return cached.data;
        }

        if (config.DEBUG_MODE) {
            console.log(`Lottie cache miss for ${codepoint}, fetching...`);
        }
        const promise = new Promise((resolve, reject) => {
            requestQueue.push({ codepoint, resolve, reject });
            processAnimationRequestQueue();
        });

        pendingLottieRequests[codepoint] = promise;
        return promise;
    };

    const allDotLotties = new Set();

    const renderCfg = {
        devicePixelRatio: 1.5, // dottie can't be trusted, at least if you have changes in DPI during the page
        freezeOnOffscreen: true,
        autoResize: false,
    };
    const layoutCfg = {
        //fit: 'fill',
        align: [0.5, 0.5],
    };

    function initializePlayer(span, animationData) {
        const canvas = document.createElement('canvas');
        // Set bitmap size
        canvas.width = Math.round(span.finalSize * 0.9); // widths are mostly 90% of height, but feels weird to use it .. ???
        canvas.height = Math.round(span.finalSize);
        // Set CSS size
        canvas.style.width = `${Math.round(span.finalSize * 0.9)}px`;
        canvas.style.height = `${Math.round(span.finalSize)}px`;

        // Clear the text placeholder before adding the canvas
        span.textContent = '';
        span.appendChild(canvas);

        let player;

        const retryMax = 100;
        const initPlayer = (retries = retryMax) => {
            const libraryLoaded = WA_ALLOWED
                ? typeof DotLottie !== 'undefined'
                : typeof lottie !== 'undefined';
            const libraryName = WA_ALLOWED ? 'DotLottie' : 'lottie';

            if (libraryLoaded) {
                if (WA_ALLOWED) {
                    if (unUsedWasmURL) {
                        DotLottie.setWasmUrl(unUsedWasmURL);
                        unUsedWasmURL = null;
                    }
                    player = new DotLottie({
                        canvas,
                        data: animationData,
                        loop: true,
                        autoplay: true,
                        renderConfig: renderCfg,
                        layout: layoutCfg,
                    });
                } else {
                    player = lottie.loadAnimation({
                        renderer: 'canvas',
                        loop: true,
                        autoplay: true,
                        progressiveLoad: false,
                        animationData: animationData,
                        rendererSettings: {
                            context: canvas.getContext('2d'),
                            preserveAspectRatio: 'xMidYMid meet',
                            clearCanvas: true,
                            hideOnTransparent: true,
                        },
                    });
                }
                span.dotLottiePlayer = player;
                allDotLotties.add(player);
            } else if (retries > 0) {
                if (config.DEBUG_MODE) {
                    console.info(
                        '🇦🇺: ',
                        `${libraryName} not yet loaded, trying again.`
                    );
                }
                setTimeout(() => initPlayer(retries - 1), retryMax - retries); // back off each time we fail
            } else {
                if (config.DEBUG_MODE) {
                    console.error(
                        '🇦🇺: ',
                        `${libraryName} failed to load in time.`
                    );
                }
                sharedIO.unobserve(span);
            }
        };
        initPlayer();
    }

    async function loadAnimationForSpan(span) {
        if (span.dotLottiePlayer) {
            span.dotLottiePlayer.play();
            return;
        }

        try {
            const animationData = await getLottieAnimationData(
                span.dataset.codepoint
            );
            initializePlayer(span, animationData);
        } catch (err) {
            if (config.DEBUG_MODE) {
                console.error(
                    '🇦🇺: ',
                    'Failed to load emoji animation, leaving as text.',
                    err
                );
            }
            sharedIO.unobserve(span);
        }
    }

    const sharedIO = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    loadAnimationForSpan(entry.target);
                } else {
                    if (entry.target.dotLottiePlayer) {
                        entry.target.dotLottiePlayer.pause();
                    }
                }
            }
        },
        { rootMargin: '100px' }
    );

    // Pause/play all animations when tab visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            allDotLotties.forEach((p) => p.pause());
        } else {
            allDotLotties.forEach((p) => p.play());
        }
    });

    function createLazyEmojiSpan(emoji, referenceNode) {
        const span = document.createElement('span');
        span.className = config.UNIQUE_EMOJI_CLASS;
        span.dataset.emoji = emoji;
        span.dataset.codepoint = emojiToCodepoint.get(emoji);
        span.title = `${emoji} (emoji u${emoji.codePointAt(0).toString(16)})`;

        let finalSize;
        if (referenceNode && referenceNode.parentNode) {
            const parentStyle = getComputedStyle(referenceNode.parentNode);
            const fontSizePx = parseFloat(parentStyle.fontSize);
            let blockSizePx = parseFloat(parentStyle.blockSize);

            if (isNaN(blockSizePx)) {
                blockSizePx = fontSizePx;
            }

            // If blockSize is significantly larger than fontSize, it's likely due to
            // line-height or padding. In such cases, fontSize is a more reliable measure.
            if (blockSizePx > fontSizePx * 1.2) {
                finalSize = Math.round(fontSizePx * config.SCALE_FACTOR);
            } else {
                finalSize = Math.round(blockSizePx);
            }
        } else {
            finalSize = 16; // Fallback size
        }

        span.finalSize = finalSize;

        span.textContent = emoji;

        sharedIO.observe(span);

        return span;
    }

    async function processMatches(textNode, matches) {
        await emojiDataPromise;

        const emojisToProcess = matches
            .map((match) => {
                const emojiStr = match[0];
                const codepoint = emojiToCodepoint.get(emojiStr);
                if (codepoint && config.DEBUG_MODE) {
                    console.log('🇦🇺: ', emojiStr, codepoint);
                }
                return codepoint ? { match, codepoint } : null;
            })
            .filter(Boolean);

        if (emojisToProcess.length === 0) return null;

        // Pre-fetch animations
        emojisToProcess.forEach((emoji) =>
            getLottieAnimationData(emoji.codepoint).catch(() => {})
        );

        const frag = document.createDocumentFragment();
        let lastIndex = 0;

        emojisToProcess.forEach(({ match }) => {
            if (match.index > lastIndex) {
                frag.appendChild(
                    document.createTextNode(
                        textNode.nodeValue.slice(lastIndex, match.index)
                    )
                );
            }
            frag.appendChild(createLazyEmojiSpan(match[0], textNode));
            lastIndex = match.index + match[0].length;
        });

        if (lastIndex < textNode.nodeValue.length) {
            frag.appendChild(
                document.createTextNode(textNode.nodeValue.slice(lastIndex))
            );
        }

        return frag;
    }

    async function replaceEmojiInTextNode(node) {
        const SKIP = new Set([
            'SCRIPT',
            'STYLE',
            'NOSCRIPT',
            'TEXTAREA',
            'INPUT',
            'CODE',
            'PRE',
            'SVG',
            'CANVAS',
        ]);

        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode(textNode) {
                const parent = textNode.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (SKIP.has(parent.nodeName)) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (
                    parent.closest(
                        '[contenteditable=""]',
                        '[contenteditable="true"]'
                    )
                ) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.closest('.' + config.UNIQUE_EMOJI_CLASS)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            },
        });

        const replacements = [];

        while (walker.nextNode()) {
            const textNode = walker.currentNode;
            const text = textNode.nodeValue;
            if (!text) continue;

            const matches = [...text.matchAll(emojiRegex)];
            if (matches.length === 0) continue;

            const frag = await processMatches(textNode, matches);
            if (frag) {
                replacements.push({ textNode, frag });
            }
        }

        for (const { textNode, frag } of replacements) {
            const parent = textNode.parentNode;
            if (!parent) {
                if (config.DEBUG_MODE) {
                    console.error(
                        '🇦🇺: ',
                        'No parent node for text node, I do not think this should happen. Node: ' +
                            textNode.nodeValue
                    );
                }
                continue;
            }

            // move a single new span, in a span, up a level, with the correct styling.
            if (
                parent.tagName === 'SPAN' &&
                parent.childNodes.length === 1 &&
                frag.childNodes.length === 1
            ) {
                const newEmojiEl = frag.firstChild;

                // Preserve original attributes (like title, aria-label)
                for (const attr of Array.from(parent.attributes)) {
                    if (!newEmojiEl.hasAttribute(attr.name)) {
                        newEmojiEl.setAttribute(attr.name, attr.value);
                    }
                }

                // Swap parent span with our emoji span
                parent.replaceWith(newEmojiEl);
            } else {
                textNode.parentNode.replaceChild(frag, textNode);
            }
        }
    }

    const processAddedNode = async (node) => {
        if (!document.body || !document.body.contains(node)) return;
        replaceEmojiInTextNode(node);
    };

    let observerCount = 0;
    let debouncedNodes = new Set();
    let debouncedTimeout = null;

    function processDebouncedNodes() {
        if (debouncedNodes.size === 0) {
            debouncedTimeout = null;
            return;
        }
        const node = debouncedNodes.values().next().value;
        debouncedNodes.delete(node);

        processAddedNode(node);

        // Re-schedule the processing for the next node in the queue - timeslice it
        debouncedTimeout = setTimeout(processDebouncedNodes, 0);
    }

    const observer = new MutationObserver((mutationsList) => {
        observerCount++;
        const newNodes = new Set();
        for (const mutation of mutationsList) {
            if (
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0
            ) {
                mutation.addedNodes.forEach((node) => newNodes.add(node));
            } else if (
                ['characterData', 'attributes'].includes(mutation.type)
            ) {
                newNodes.add(mutation.target);
            }

            // Handle removed nodes
            if (
                mutation.type === 'childList' &&
                mutation.removedNodes.length > 0
            ) {
                mutation.removedNodes.forEach((node) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.classList.contains(config.UNIQUE_EMOJI_CLASS)
                    ) {
                        if (node.dotLottiePlayer) {
                            node.dotLottiePlayer.destroy();
                            allDotLotties.delete(node.dotLottiePlayer);
                            delete node.dotLottiePlayer;
                        }
                    }
                });
            }
        }

        if (observerCount <= config.DEBOUNCE_THRESHOLD) {
            newNodes.forEach(processAddedNode);
            return;
        }

        newNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                debouncedNodes.add(node);
                return;
            }
            for (const existing of debouncedNodes) {
                if (
                    existing.nodeType === Node.ELEMENT_NODE &&
                    existing.contains(node)
                )
                    return;
            }
            for (const existing of [...debouncedNodes]) {
                if (
                    existing.nodeType === Node.ELEMENT_NODE &&
                    node.contains(existing)
                ) {
                    debouncedNodes.delete(existing);
                }
            }
            debouncedNodes.add(node);
        });

        if (debouncedTimeout) return;

        debouncedTimeout = setTimeout(
            processDebouncedNodes,
            config.DEBOUNCE_DELAY_MS
        );
    });

    const initializeEmojiData = async () => {
        const emojiData = await getEmojiData();
        for (const icon of emojiData.icons) {
            const chars = icon.codepoint
                .split('_')
                .map((hex) => String.fromCodePoint(parseInt(hex, 16)))
                .join('');
            emojiToCodepoint.set(chars, icon.codepoint);
        }
        if (config.DEBUG_MODE) {
            console.log(
                '🇦🇺: ',
                'Emoji cache loaded ' + (Date.now() - scriptStartTime) + 'ms'
            );
        }
    };

    const startObserver = () => {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false,
        });
        if (document.body) {
            processAddedNode(document.body);
        }
    };

    const main = () => {
        try {
            emojiDataPromise = initializeEmojiData();

            startObserver();

            // defer adding these until we've got a bunch of other processing done
            GM.addStyle(`
                span.${config.UNIQUE_EMOJI_CLASS} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    vertical-align: middle;
                    line-height: 1;
                    overflow: hidden;
                }
                
                span.${config.UNIQUE_EMOJI_CLASS} > canvas {
                    object-fit: contain;
                    image-rendering: crisp-edges;
                }
            `);

            if (config.DEBUG_MODE) {
                console.log(
                    '🇦🇺: ',
                    'Script startup time: ' +
                        (Date.now() - scriptStartTime) +
                        'ms'
                );
            }
        } catch (error) {
            if (config.DEBUG_MODE) {
                console.error(
                    '🇦🇺: ',
                    'Failed to initialize emoji animation script:',
                    error
                );
            }
        }
    };

    main();
})();
