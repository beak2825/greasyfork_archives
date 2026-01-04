// ==UserScript==
// @name         Multiplayer Piano Optimizations [Emotes]
// @namespace    https://tampermonkey.net/
// @version      1.7.0
// @description  Display emoticons and colors in chat!
// @author       zackiboiz, ccjit
// @match        *://multiplayerpiano.com/*
// @match        *://*.multiplayerpiano.net/*
// @match        *://dev.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
// @match        *://piano.mpp.community/*
// @match        *://mpp.7458.space/*
// @match        *://qmppv2.qwerty0301.repl.co/*
// @match        *://mpp.8448.space/*
// @match        *://mpp.hri7566.info/*
// @match        *://mpp.autoplayer.xyz/*
// @match        *://mpp.hyye.xyz/*
// @match        *://lmpp.hyye.xyz/*
// @match        *://mpp.hyye.tk/*
// @match        *://mpp.smp-meow.net/*
// @match        *://piano.ourworldofpixels.com/*
// @match        *://mpp.lapishusky.dev/*
// @match        *://staging-mpp.sad.ovh/*
// @match        *://mpp.terrium.net/*
// @match        *://mpp.yourfriend.lv/*
// @match        *://mpp.l3m0ncao.wtf/*
// @match        *://beta-mpp.csys64.com/*
// @match        *://fleetway-mpp.glitch.me/*
// @match        *://mpp.totalh.net/*
// @match        *://mpp.meowbin.com/*
// @match        *://mppfork.netlify.app/*
// @match        *://better.mppclone.me/*
// @match        *://*.openmpp.tk/*
// @match        *://*.mppkinda.com/*
// @match        *://*.augustberchelmann.com/piano/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiplayerpiano.net
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542677/Multiplayer%20Piano%20Optimizations%20%5BEmotes%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/542677/Multiplayer%20Piano%20Optimizations%20%5BEmotes%5D.meta.js
// ==/UserScript==

(async () => {
    const dl = GM_info.script.downloadURL || GM_info.script.updateURL || GM_info.script.homepageURL || "";
    const match = dl.match(/greasyfork\.org\/scripts\/(\d+)/);
    if (!match) {
        console.warn("Could not find Greasy Fork script ID in downloadURL/updateURL/homepageURL:", dl);
    } else {
        const scriptId = match[1];
        const localVersion = GM_info.script.version;
        const apiUrl = `https://greasyfork.org/scripts/${scriptId}.json?_=${Date.now()}`;

        fetch(apiUrl, {
            mode: "cors",
            headers: {
                Accept: "application/json"
            }
        }).then(r => {
            if (!r.ok) throw new Error("Failed to fetch Greasy Fork data.");
            return r.json();
        }).then(data => {
            const remoteVersion = data.version;
            if (compareVersions(localVersion, remoteVersion) < 0) {
                new MPP.Notification({
                    "m": "notification",
                    "duration": 15000,
                    "title": "Update Available",
                    "html": "<p>A new version of this script is available!</p>" +
                        `<p style='margin-top: 10px;'>Script: ${GM_info.script.name}</p>` +
                        `<p>Local: v${localVersion}</p>` +
                        `<p>Latest: v${remoteVersion}</p>` +
                        `<a href='https://greasyfork.org/scripts/${scriptId}' target='_blank' style='position: absolute; right: 0;bottom: 0; margin: 10px; font-size: 0.5rem;'>Open Greasy Fork to update?</a>`
                })
            }
        }).catch(err => console.error("Update check failed:", err));
    }

    function compareVersions(a, b) {
        const pa = a.split(".").map(n => parseInt(n, 10) || 0);
        const pb = b.split(".").map(n => parseInt(n, 10) || 0);
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i++) {
            if ((pa[i] || 0) < (pb[i] || 0)) return -1;
            if ((pa[i] || 0) > (pb[i] || 0)) return 1;
        }
        return 0;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await sleep(1000);
    const BASE_URL = "https://raw.githubusercontent.com/ZackiBoiz/Multiplayer-Piano-Optimizations/refs/heads/main";

    class EmotesManager {
        constructor(version, baseUrl) {
            this.version = version;
            this.baseUrl = baseUrl;
            this.emotes = {};
            this.emoteUrls = {};
            this.emotePromises = {};
            this.tokenRegex = null;
            this.overlayRegex = null;
            this.combinedRegex = null;
            this.DROPDOWN_OFFSET_PX = 10;

            this.dropdown = document.createElement("div");
            this.dropdown.id = "emote-suggestions";
            Object.assign(this.dropdown.style, {
                position: "absolute",
                backgroundColor: "#3c3c3c",
                border: "1px solid #555",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                zIndex: "9999",
                maxHeight: "200px",
                overflowY: "auto",
                display: "none",
                fontFamily: "Ubuntu, Arial",
                color: "#ffffff",
                fontSize: "0.75rem"
            });
            document.body.appendChild(this.dropdown);

            const style = document.createElement("style");
            style.textContent = `
                #emote-suggestions .dropdown-item:hover {
                    background-color: #4c4c4c;
                }

                .emote-stack {
                    display: inline-flex;
                    position: relative;
                    vertical-align: middle;
                    overflow: visible;
                    line-height: 0;
                    height: 0.75rem;
                    justify-content: center;
                    align-items: center;
                }

                .emote-stack img {
                    image-rendering: auto !important;
                    cursor: pointer;
                    height: 0.75rem;
                    width: auto;
                    max-width: none;
                    max-height: none;
                    display: inline-block;
                }

                .emote-stack.stacked img.overlay {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: auto;
                    z-index: 2;
                    height: 100%;
                    width: auto;
                }

                .emote-stack img.base {
                    position: relative;
                    z-index: 1;
                    display: block;
                }
            `;
            document.head.appendChild(style);

            this.suggestionsObserver = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const name = img.dataset.emote;
                        if (name) {
                            this._setImgSrc(img, name);
                        }
                        try {
                            this.suggestionsObserver.unobserve(img);
                        } catch (e) { }
                    }
                }
            }, {
                root: this.dropdown,
                rootMargin: "300px",
                threshold: 0.01
            });
        }

        async init() {
            try {
                await this._loadEmotesMeta();
                this._buildTokenRegex();
                this._initChatObserver();
                this._replaceExistingMessages();
                this._initSuggestionListeners();
            } catch (err) {
                console.error("EmotesManager failed:", err);
            }
        }

        async _loadEmotesMeta() {
            const res = await fetch(`${this.baseUrl}/emotes/meta.jsonc?_=${Date.now()}`);
            if (!res.ok) throw new Error(`Failed to load emote metadata: ${res.status}`);

            const raw = await res.text();
            const cleaned = raw.replace(/(\/\*[\s\S]*?\*\/|\/\/.*?$)/gm, "").trim();
            this.emotes = JSON.parse(cleaned);
        }

        _buildTokenRegex() {
            const tokens = Object.keys(this.emotes)
                .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                .sort((a, b) => b.length - a.length);

            if (tokens.length === 0) {
                this.tokenRegex = this.overlayRegex = this.combinedRegex = null;
                return;
            }

            const tokenList = tokens.join("|");
            this.tokenRegex = new RegExp(`:(${tokenList}):`, "g");
            this.overlayRegex = new RegExp(`;(${tokenList});`, "g");
            this.combinedRegex = new RegExp(`:(${tokenList}):|;(${tokenList});`, "g");
        }

        _tokenizeSegment(seg) {
            const tokens = [];
            let lastIndex = 0;
            this.combinedRegex.lastIndex = 0;
            let m;
            while ((m = this.combinedRegex.exec(seg)) !== null) {
                const matchIndex = m.index;
                // check escaping
                let k = matchIndex - 1, backCount = 0;
                while (k >= 0 && seg[k] === "\\") {
                    backCount++;
                    k--;
                }
                if (backCount % 2 === 1) {
                    const upTo = this.combinedRegex.lastIndex;
                    if (upTo > lastIndex) tokens.push({ type: "text", text: seg.slice(lastIndex, upTo) });
                    lastIndex = upTo;
                    continue;
                }

                if (matchIndex > lastIndex) tokens.push({ type: "text", text: seg.slice(lastIndex, matchIndex) });
                if (m[1]) tokens.push({ type: "normal", name: m[1] });
                else if (m[2]) tokens.push({ type: "overlay", name: m[2] });
                lastIndex = this.combinedRegex.lastIndex;
            }
            if (lastIndex < seg.length) tokens.push({ type: "text", text: seg.slice(lastIndex) });
            return tokens;
        }

        _assignOverlays(tokens) {
            const assigned = {};
            const overlayConsumed = new Set();
            for (let i = 0; i < tokens.length; i++) {
                const t = tokens[i];
                if (t.type !== "overlay") continue;
                let assignedTo = -1;
                for (let j = i + 1; j < tokens.length; j++)
                    if (tokens[j].type === "normal") { assignedTo = j; break; }
                if (assignedTo === -1)
                    for (let j = i - 1; j >= 0; j--)
                        if (tokens[j].type === "normal") { assignedTo = j; break; }
                if (assignedTo !== -1) {
                    assigned[assignedTo] = assigned[assignedTo] || [];
                    assigned[assignedTo].push({ name: t.name, pos: i });
                    overlayConsumed.add(i);
                } else {
                    assigned[`standalone-${i}`] = assigned[`standalone-${i}`] || [];
                    assigned[`standalone-${i}`].push({ name: t.name, pos: i, standalone: true });
                }
            }
            return { assigned, overlayConsumed };
        }

        async _getEmoteUrl(key) {
            if (this.emoteUrls[key]) return this.emoteUrls[key];
            if (this.emotePromises[key]) return this.emotePromises[key];

            const promise = (async () => {
                const ext = this.emotes[key];
                try {
                    const resp = await fetch(`${this.baseUrl}/emotes/assets/${key}.${ext}?_=${Date.now()}`);
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const blob = await resp.blob();
                    const url = URL.createObjectURL(blob);
                    this.emoteUrls[key] = url;
                    return url;
                } catch (e) {
                    console.warn(`Failed to load emote "${key}":`, e);
                    return "";
                } finally {
                    delete this.emotePromises[key];
                }
            })();

            this.emotePromises[key] = promise;
            return promise;
        }

        _createEmoteImg(token, { isBase = false, overlayClass = false, stack } = {}) {
            const img = document.createElement("img");
            img.alt = img.title = (isBase ? `:${token}:` : `;${token};`);
            img.dataset.emote = token;
            img.className = (isBase ? "base" : (overlayClass ? "overlay" : ""));
            img.style.height = "0.75rem";
            img.style.width = "auto";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";
            img.addEventListener("click", (e) => {
                if (stack && stack.title) navigator.clipboard.writeText(stack.title);
                else navigator.clipboard.writeText(img.title);
                e.stopPropagation();
            });
            img.addEventListener("mouseenter", () => {
                img.title = stack ? stack.title : img.title;
            });
            img.addEventListener("mouseleave", () => {
                img.title = stack ? stack.title : img.title;
            });

            return img;
        }

        _setImgSrc(img, name) {
            this._getEmoteUrl(name).then(url => {
                if (url) img.src = url;
            }).catch(() => {});
        }

        _tryObserveOrSet(img, name) {
            try {
                this.suggestionsObserver.observe(img);
            } catch (e) {
                this._setImgSrc(img, name);
            }
        }

        async _fitImgsToStack(imgs, stack) {
            await this._waitForImgs(imgs);
            try {
                const computedImgHeights = imgs.map(img => {
                    const h = parseFloat(getComputedStyle(img).height);
                    if (!isNaN(h) && h > 0) return h;
                    const rect = img.getBoundingClientRect();
                    if (rect && rect.height > 0) return rect.height;
                    return (img.naturalHeight ? img.naturalHeight : 0);
                });

                const targetHeight = computedImgHeights.find(h => h > 0) || 12;

                const widths = imgs.map(img => {
                    const rect = img.getBoundingClientRect();
                    if (rect && rect.width > 0) return rect.width;
                    if (img.naturalWidth && img.naturalHeight) {
                        return (img.naturalWidth / img.naturalHeight) * targetHeight;
                    }
                    return 0;
                });

                const maxWidth = Math.max(...widths, 0);
                if (maxWidth > 0) {
                    stack.style.width = `${Math.ceil(maxWidth)}px`;
                }
                stack.style.height = `${Math.ceil(targetHeight)}px`;
            } catch (e) {}
        }

        _waitForImgs(imgs, timeout = 1200) {
            return Promise.all(imgs.map(img => new Promise(resolve => {
                if (img.complete && (img.naturalWidth || img.naturalHeight)) return resolve();
                const to = setTimeout(resolve, timeout);
                img.addEventListener("load", () => {
                    clearTimeout(to);
                    resolve();
                }, { once: true });
                img.addEventListener("error", () => {
                    clearTimeout(to);
                    resolve();
                }, { once: true });
            })));
        }

        _initChatObserver() {
            const chatList = document.querySelector("#chat > ul");
            if (!chatList) return;
            const observer = new MutationObserver(mutations => {
                observer.disconnect();
                mutations.forEach(m => m.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === "LI") {
                        const msgEl = node.querySelector(".message");
                        this._replaceEmotesInElement(msgEl);
                        if (chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight < 30) {
                            chatList.scrollTop = chatList.scrollHeight;
                        }
                    }
                }));
                observer.observe(chatList, { childList: true });
            });
            observer.observe(chatList, { childList: true });
        }

        _replaceExistingMessages() {
            document.querySelectorAll("#chat > ul li .message").forEach(el => this._replaceEmotesInElement(el));
        }

        _replaceEmotesInElement(el) {
            if (!el) return;
            const walk = node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "code") return;

                if (node.nodeType === Node.TEXT_NODE) {
                    const frag = this._processTextSegment(node.textContent);
                    node.replaceWith(frag);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    Array.from(node.childNodes).forEach(walk);
                }
            };
            walk(el);
        }

        _processTextSegment(rawText) {
            const frag = document.createDocumentFragment();

            const segments = rawText.split(/(?<!\\)(?:\\\\)*\\n/);

            for (let segIdx = 0; segIdx < segments.length; segIdx++) {
                const seg = segments[segIdx];

                if (!this.combinedRegex) {
                    this._appendTextWithColors(frag, seg);
                    if (segIdx < segments.length - 1) frag.appendChild(document.createElement("br"));
                    continue;
                }

                const tokens = this._tokenizeSegment(seg);

                if (!tokens.some(t => t.type === "normal" || t.type === "overlay")) {
                    this._appendTextWithColors(frag, seg);
                    if (segIdx < segments.length - 1) frag.appendChild(document.createElement("br"));
                    continue;
                }

                const { assigned, overlayConsumed } = this._assignOverlays(tokens);

                const emittedNormals = new Set();

                for (let i = 0; i < tokens.length; i++) {
                    const t = tokens[i];
                    if (t.type === "text") {
                        frag.appendChild(document.createTextNode(t.text));
                    } else if (t.type === "normal") {
                        if (emittedNormals.has(i)) continue;
                        emittedNormals.add(i);

                        const baseName = t.name;
                        const overlays = (assigned[i] || []).slice();
                        overlays.sort((a, b) => a.pos - b.pos);

                        const stack = document.createElement("span");
                        stack.className = "emote-stack";
                        if (overlays.length > 0) stack.classList.add("stacked");
                        stack.title = this._stackTitleFor(baseName, overlays);

                        const baseImg = this._createEmoteImg(baseName, {
                            isBase: true,
                            stack
                        });
                        baseImg.classList.add("base");

                        const overlayImgs = overlays.map(o => {
                            const img = this._createEmoteImg(o.name, {
                                isBase: false,
                                overlayClass: true,
                                stack
                            });
                            img.classList.add("overlay");

                            return {
                                img,
                                name: o.name
                            };
                        });

                        stack.appendChild(baseImg);
                        for (const oi of overlayImgs) stack.appendChild(oi.img);

                        const imgsToWait = [baseImg, ...overlayImgs.map(x => x.img)];

                        // set image sources (use cached fetch)
                        this._setImgSrc(baseImg, baseName);
                        for (const oi of overlayImgs) this._setImgSrc(oi.img, oi.name);

                        // fit sizes via shared helper
                        this._fitImgsToStack(imgsToWait, stack).catch(() => {});

                        frag.appendChild(stack);
                    } else if (t.type === "overlay") {
                        if (overlayConsumed.has(i)) continue;

                        const key = `standalone-${i}`;
                        if (assigned[key] && assigned[key].length) {
                            for (const ov of assigned[key]) {
                                const wrapper = document.createElement("span");
                                wrapper.className = "emote-stack";
                                wrapper.title = `;${ov.name};`;

                                const img = this._createEmoteImg(ov.name, {
                                    isBase: true,
                                    stack: wrapper
                                });
                                img.classList.add("base"); // lone overlay behaves like a base
                                wrapper.appendChild(img);

                                this._setImgSrc(img, ov.name);
                                this._fitImgsToStack([img], wrapper).catch(() => {});

                                wrapper.addEventListener("click", () => navigator.clipboard.writeText(wrapper.title));
                                frag.appendChild(wrapper);
                            }
                        } else {
                            frag.appendChild(document.createTextNode(`;${t.name};`));
                        }
                    }
                }

                if (segIdx < segments.length - 1) frag.appendChild(document.createElement("br"));
            }

            return frag;
        }

        _stackTitleFor(baseName, overlays) {
            const parts = [];
            for (const ov of overlays) parts.push(`;${ov.name};`);
            parts.push(`:${baseName}:`);
            return parts.join(" ");
        }

        _appendColor(frag, r, g, b, raw) {
            const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0").toUpperCase();
            const span = document.createElement("span");
            span.style.display = "inline-block";
            span.style.width = "0.75rem";
            span.style.height = "0.75rem";
            span.style.verticalAlign = "middle";
            span.style.backgroundColor = `#${hex}`;
            span.style.cursor = "pointer";
            span.title = `#${hex}`;
            span.addEventListener("click", () => navigator.clipboard.writeText(raw));
            frag.appendChild(span);
        }

        _appendTextWithColors(frag, text) {
            let buf = "";
            for (let i = 0; i < text.length;) {
                const cp = text.codePointAt(i);
                const chLen = cp > 0xFFFF ? 2 : 1;
                if (cp >= 0xE000 && cp <= 0xEFFF) {
                    if (buf.length) { frag.appendChild(document.createTextNode(buf)); buf = ""; }
                    const nib = cp & 0x0FFF;
                    const r = ((nib >> 8) & 0xF) * 17;
                    const g = ((nib >> 4) & 0xF) * 17;
                    const b = (nib & 0xF) * 17;
                    const raw = text.slice(i, i + chLen);
                    this._appendColor(frag, r, g, b, raw);
                    i += chLen;
                } else {
                    buf += String.fromCodePoint(cp);
                    i += chLen;
                }
            }
            if (buf.length) frag.appendChild(document.createTextNode(buf));
        }

        _initSuggestionListeners() {
            const input = document.querySelector("#chat > input");
            const dd = this.dropdown;
            const OFFSET = this.DROPDOWN_OFFSET_PX;
            const emoteKeys = Object.keys(this.emotes);
            let selectedIndex = -1;

            const wrapChar = ch => `<strong style="color: #ff007f;">${ch}</strong>`;

            const showSuggestions = (q, rect, mode) => {
                const qLow = q.toLowerCase();
                const buckets = [[], [], [], []];
                for (const name of emoteKeys) {
                    const nameLow = name.toLowerCase();
                    if (nameLow === qLow) {
                        buckets[0].push(name);
                    } else if (qLow && nameLow.startsWith(qLow)) {
                        buckets[1].push(name);
                    } else if (qLow && nameLow.includes(qLow)) {
                        buckets[2].push(name);
                    } else if (!qLow || isSubsequence(qLow, nameLow)) {
                        buckets[3].push(name);
                    }
                }

                for (let i = 0; i < buckets.length; i++) {
                    if (i >= 2 && qLow) {
                        buckets[i].sort((a, b) => {
                            const ia = a.toLowerCase().indexOf(qLow[0]);
                            const ib = b.toLowerCase().indexOf(qLow[0]);
                            if (ia !== ib) return ia - ib;
                            return a.length - b.length || a.localeCompare(b);
                        });
                    } else {
                        buckets[i].sort((a, b) => a.length - b.length || a.localeCompare(b));
                    }
                }
                const matches = buckets.flat();
                if (!matches.length) {
                    dd.style.display = "none";
                    return;
                }

                dd.innerHTML = "";
                dd.style.display = "block";
                dd.style.left = `${rect.left}px`;
                dd.style.bottom = `${window.innerHeight - rect.top + OFFSET}px`;

                const hdr = document.createElement("div");
                const modeNote = mode === "overlay" ? " (overlay)" : " (normal)";
                hdr.innerHTML = `<em>Showing top <strong>${matches.length}</strong> suggestion${matches.length === 1 ? "" : "s"}${modeNote}...</em>`;
                hdr.style.cssText = "font-size: 10px; color: #cccccc; padding: 6px; position: sticky; top: 0; background: #2c2c2c;";
                dd.appendChild(hdr);

                matches.forEach((name, idx) => {
                    const item = document.createElement("div");
                    item.className = "dropdown-item";
                    item.dataset.index = idx;
                    item.style.cssText = "padding: 6px; cursor: pointer;";

                    const tokenText = mode === "overlay" ? `;${name};` : `:${name}:`;
                    const img = this._createEmoteImg(name, { isBase: true });
                    img.style.height = "1rem";
                    img.style.verticalAlign = "middle";
                    img.style.marginRight = "4px";
                    img.style.imageRendering = "auto";
                    img.alt = img.title = tokenText;
                    img.dataset.emote = name;
                    img.src = "";
                    item.appendChild(img);

                    let label = "";

                    // lazy load or direct load
                    this._tryObserveOrSet(img, name);
                    let qi = 0;
                    for (const ch of name) {
                        if (qi < qLow.length && ch.toLowerCase() === qLow[qi]) {
                            label += wrapChar(ch);
                            qi++;
                        }
                        else label += ch;
                    }
                    item.insertAdjacentHTML("beforeend", tokenText[0] + label + tokenText[tokenText.length - 1]);

                    item.addEventListener("click", () => {
                        const caret = input.selectionStart ?? input.value.length;
                        const before = input.value.slice(0, caret);
                        let after = input.value.slice(caret);
                        const rightFragMatch = after.match(/^([^:\s;]*)/);
                        const rightFrag = rightFragMatch ? rightFragMatch[1] : "";
                        if (rightFrag) after = after.slice(rightFrag.length);

                        let insertion = tokenText;
                        const delim = mode === "overlay" ? ";" : ":";
                        if (after.length > 0 && after[0] === delim) {
                            const next = after[1] || "";
                            if (next && !/[\s:;]/.test(next)) insertion += " ";
                            else {
                                after = after.slice(1);
                                if (!(after.length > 0 && /\s/.test(after[0]))) insertion += " ";
                            }
                        } else {
                            if (!(after.length > 0 && /\s/.test(after[0]))) {
                                insertion += " ";
                            }
                        }

                        const escPrefix = `(?<![\\w])${delim}([^\\s${delim}]*)$`;
                        const re = new RegExp(escPrefix);
                        const newBefore = before.replace(re, insertion);

                        input.value = newBefore + after;
                        let newCaretPos = newBefore.length;
                        if (!insertion.endsWith(" ") && after.length > 0 && /\s/.test(after[0])) {
                            newCaretPos++;
                        }
                        input.setSelectionRange(newCaretPos, newCaretPos);

                        dd.style.display = "none";
                        input.focus();
                    });



                    dd.appendChild(item);
                });
                setSelected(0);
            };

            const isSubsequence = (q, name) => {
                let qi = 0;
                for (const ch of name) {
                    if (qi < q.length && ch === q[qi]) qi++;
                }
                return qi === q.length;
            };

            const clearSelection = () => {
                dd.querySelectorAll(".dropdown-item.selected").forEach(el => {
                    el.classList.remove("selected");
                    el.style.backgroundColor = "#3c3c3c";
                });
            };

            const setSelected = (idx) => {
                clearSelection();
                if (idx >= 0) {
                    const el = dd.querySelector(`.dropdown-item[data-index="${idx}"]`);
                    if (el) {
                        el.classList.add("selected");
                        el.style.backgroundColor = "#4c4c4c";
                        el.scrollIntoView({
                            block: "nearest"
                        });
                        selectedIndex = idx;
                    }
                } else {
                    selectedIndex = -1;
                }
            };

            const beforeReNormal = /(?<![\\\w]):([^:\s]*)$/;
            const beforeReOverlay = /(?<![\\\w]);([^;\s]*)$/;

            input.addEventListener("input", () => {
                const val = input.value;
                const caret = input.selectionStart;
                const before = val.slice(0, caret);
                const after = val.slice(caret);

                let beforeMatch = beforeReNormal.exec(before);
                let mode = "normal";
                if (!beforeMatch) {
                    beforeMatch = beforeReOverlay.exec(before);
                    mode = "overlay";
                }
                if (!beforeMatch) {
                    dd.style.display = "none";
                    return;
                }

                const afterFragMatch = after.match(/^([^:\s;]*)/);
                const afterFrag = afterFragMatch ? afterFragMatch[1] : "";
                const combinedQuery = beforeMatch[1] + afterFrag;

                if (mode === "normal" && /:(?:[^:\s]+):$/.test(before)) {
                    dd.style.display = "none";
                    return;
                }
                if (mode === "overlay" && /;(?:[^;\s]+);$/.test(before)) {
                    dd.style.display = "none";
                    return;
                }

                showSuggestions(combinedQuery, input.getBoundingClientRect(), mode);
            });

            input.addEventListener("keydown", e => {
                if (dd.style.display === "block") {
                    const items = dd.querySelectorAll(".dropdown-item");
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSelected((selectedIndex + 1) % items.length);
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSelected((selectedIndex - 1 + items.length) % items.length);
                    } else if (e.key === "Tab") {
                        if (selectedIndex >= 0) {
                            e.preventDefault();
                            items[selectedIndex].click();
                        }
                    } else {
                        dd.style.display = "none";
                    }
                }
            });

            document.addEventListener("click", e => {
                if (!e.target.closest("#chat-input") && !e.target.closest("#emote-suggestions")) {
                    dd.style.display = "none";
                }
            });
        }
    }

    const manager = new EmotesManager(GM_info.script.version, BASE_URL);
    manager.init();
})();