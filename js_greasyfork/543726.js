// ==UserScript==
// @name         coom & keem enhance (supports new domains
// @namespace    http://minoa.cat/
// @version      1.4
// @description  Adds infinite scroll to user/post/popular pages, an auto-random post feature, removes sidebar ads, and adds various UI tweaks on coomer/kemono.
// @author       minoa.cat & Gemini
// @match        https://coomer.su/*
// @match        https://coomer.party/*
// @match        https://coomer.st/*
// @match        https://kemono.su/*
// @match        https://kemono.party/*
// @match        https://kemono.cr/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/543726/coom%20%20keem%20enhance%20%28supports%20new%20domains.user.js
// @updateURL https://update.greasyfork.org/scripts/543726/coom%20%20keem%20enhance%20%28supports%20new%20domains.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // 1. STYLES
    //================================================================================
    GM_addStyle(`
        .global-sidebar { width: 12.8rem !important; }
        #ar-wrapper {}
        #ar-main-link { display: flex !important; justify-content: space-between; align-items: center; width: 100%; }
        #ar-main-link.ar-active, #ar-main-link.ar-active:hover { color: #4CAF50 !important; font-weight: bold; }
        #ar-button-content { display: flex; align-items: center; flex-grow: 1; }
        #ar-expand-arrow { padding: 0 8px 0 0; font-size: 16px; line-height: 1; transform: rotate(0deg); transition: transform 0.2s ease-in-out; cursor: pointer; }
        #ar-expand-arrow.ar-expanded { transform: rotate(90deg); }
        #ar-settings-panel { display: none; padding: 10px 16px; background-color: #2d2d2d; border-top: 1px solid #444; }
        #ar-settings-panel.ar-visible { display: block; }
        #ar-settings-panel label { display: block; margin-bottom: 5px; color: #eee; font-size: 14px; }
        #ar-settings-panel input, #ar-settings-panel textarea { width: 100%; padding: 8px; margin-bottom: 10px; background-color: #1a1a1a; border: 1px solid #555; color: #ddd; border-radius: 4px; box-sizing: border-box; }
        .ar-standard-video { width: 100%; max-height: 80vh; border-radius: 4px; background-color: #000; }
        #infinite-scroll-loader { text-align: center; padding: 20px; font-size: 1.2em; color: #888; display: none; }
        body.coom-enhance-post-page .post__info > * { margin: 0.45rem 0; }
        body.coom-enhance-post-page .post__actions { font-size: 1.2em; display: grid; }
    `);

    //================================================================================
    // 2. CONFIG & STATE
    //================================================================================
    const Config = {
        KEY: 'autoRandomConfig_v1',
        DEFAULTS: { isEnabled: false, speed: 8, blacklist: 'man, cock, dick, male, yaoi, hairy, bear' },
        load: () => {
            const saved = GM_getValue(Config.KEY);
            try { return saved ? { ...Config.DEFAULTS, ...JSON.parse(saved) } : Config.DEFAULTS; }
            catch (e) { console.error("coom enhance: Failed to parse saved config.", e); return Config.DEFAULTS; }
        },
        save: (config) => GM_setValue(Config.KEY, JSON.stringify(config))
    };

    let config = Config.load();
    let countdownInterval = null;
    let debounceTimer = null;
    let lastProcessedURL = '';

    let infiniteScrollState = {
        isLoading: false, allLoaded: false, offset: 0, total: Infinity,
        apiEndpoint: null, intersectionObserver: null
    };

    //================================================================================
    // 3. UTILITY FUNCTIONS
    //================================================================================
    function buildThumbnailURL(filePath) {
        const domain = window.location.hostname;
        if (domain.includes('coomer.su') || domain.includes('coomer.party')) {
            return `//img.coomer.su/thumbnail/data${filePath}`;
        }
        return `//img.kemono.su/thumbnail${filePath}`;
    }

    //================================================================================
    // 4. UI & AUTO-RANDOM MODULE
    //================================================================================
    function injectUI() {
        if (document.getElementById('ar-wrapper')) return;
        const randomPostLink = document.querySelector('a.global-sidebar-entry-item[href="/posts/random"]');
        if (!randomPostLink) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'ar-wrapper';
        const mainLink = document.createElement('a');
        mainLink.id = 'ar-main-link';
        mainLink.className = 'global-sidebar-entry-item';
        mainLink.href = '#';
        mainLink.innerHTML = `
            <span id="ar-button-content">
                <span id="ar-expand-arrow">▶</span>
                <span id="ar-main-button-text"></span>
            </span>`;
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'ar-settings-panel';
        settingsPanel.innerHTML = `
            <label for="ar-speed">Speed (seconds)</label>
            <input type="number" id="ar-speed" min="1">
            <label for="ar-blacklist">Blacklist (comma-separated)</label>
            <textarea id="ar-blacklist" rows="3"></textarea>`;

        wrapper.appendChild(mainLink);
        wrapper.appendChild(settingsPanel);
        randomPostLink.parentNode.insertBefore(wrapper, randomPostLink.nextSibling);

        document.getElementById('ar-speed').value = config.speed;
        document.getElementById('ar-blacklist').value = config.blacklist;

        mainLink.addEventListener('click', (e) => {
            e.preventDefault();
            config.isEnabled = !config.isEnabled;
            Config.save(config);
            updateButtonState();
            if (config.isEnabled) {
                if (window.location.pathname.match(/\/user\/[^\/]+\/post\//)) {
                    runAutoRandom();
                } else {
                    window.location.href = '/posts/random';
                }
            } else {
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
            }
        });

        document.getElementById('ar-expand-arrow').addEventListener('click', (e) => {
            e.stopPropagation();
            e.currentTarget.classList.toggle('ar-expanded');
            document.getElementById('ar-settings-panel').classList.toggle('ar-visible');
        });

        document.getElementById('ar-speed').addEventListener('change', (e) => {
            const newSpeed = parseInt(e.target.value, 10);
            if (newSpeed > 0) { config.speed = newSpeed; Config.save(config); }
        });
        document.getElementById('ar-blacklist').addEventListener('input', (e) => {
            config.blacklist = e.target.value;
            Config.save(config);
        });

        updateButtonState();
    }

    function updateButtonState() {
        const mainLink = document.getElementById('ar-main-link');
        const buttonText = document.getElementById('ar-main-button-text');
        if (!mainLink || !buttonText) return;
        if (countdownInterval && config.isEnabled) return;
        mainLink.classList.toggle('ar-active', config.isEnabled);
        buttonText.textContent = `Auto-Random (${config.isEnabled ? 'ON' : 'OFF'})`;
    }

    function runAutoRandom() {
        if (countdownInterval) return;
        if (!config.isEnabled || !window.location.pathname.match(/\/user\/[^\/]+\/post\//)) {
            if (countdownInterval) clearInterval(countdownInterval);
            countdownInterval = null;
            return;
        }

        const contentElement = document.querySelector('.post__content pre, .post__content div');
        const titleElement = document.querySelector('.post__title h1');
        let textToScan = (contentElement?.textContent || '') + ' ' + (titleElement?.textContent || '');

        if (textToScan.trim()) {
            textToScan = textToScan.toLowerCase();
            const blacklist = config.blacklist.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            if (blacklist.some(term => textToScan.includes(term))) {
                window.location.href = '/posts/random';
                return;
            }
        }

        let countdown = config.speed;
        const buttonText = document.getElementById('ar-main-button-text');
        const updateTimerDisplay = () => { if (buttonText) buttonText.textContent = `Next in ${countdown}s...`; };
        updateTimerDisplay();
        countdownInterval = setInterval(() => {
            countdown--;
            updateTimerDisplay();
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                window.location.href = '/posts/random';
            }
        }, 1000);
    }

    //================================================================================
    // 5. CORE PAGE MODULES
    //================================================================================
    function removeSidebarAd() {
        const adLink = document.querySelector('a.sidebar-extra-style[href*="tsyndicate.com"]');
        if (adLink) {
            adLink.parentElement.remove();
        }
    }

    function replaceVideoPlayers() {
        document.querySelectorAll('div.fluid_video_wrapper:not([data-ar-replaced])').forEach(playerWrapper => {
            playerWrapper.setAttribute('data-ar-replaced', 'true');
            const sourceElement = playerWrapper.querySelector('video > source');
            if (!sourceElement?.src) return;
            const newVideo = document.createElement('video');
            newVideo.src = sourceElement.src;
            newVideo.controls = true;
            newVideo.preload = 'metadata';
            newVideo.className = 'ar-standard-video';
            playerWrapper.parentNode.replaceChild(newVideo, playerWrapper);
        });
    }

    //================================================================================
    // 6. INFINITE SCROLL SYSTEM
    //================================================================================
    function getApiConfig() {
        const { pathname, search } = window.location;
        const userPageMatch = pathname.match(/\/(\w+)\/user\/([\w-]+)/);

        if (userPageMatch) {
            const [, service, userId] = userPageMatch;
            return {
                type: 'user',
                endpoint: `/api/v1/${service}/user/${userId}/posts-legacy${search}${search ? '&' : '?'}o=`
            };
        }

        // CRITICAL FIX: Add specific handler for the popular posts page
        if (pathname.startsWith('/posts/popular')) {
            const query = search || '?period=recent'; // Default to 'recent' if no params
            return {
                type: 'posts',
                endpoint: `/api/v1/posts/popular${query}${query.includes('?') ? '&' : '?'}o=`
            };
        }

        if (pathname.startsWith('/posts')) {
            return {
                type: 'posts',
                endpoint: `/api/v1/posts${search}${search ? '&' : '?'}o=`
            };
        }

        return null;
    }

    function createPostCardHTML(post) {
        const sanitizedTitle = post.title ? post.title.replace(/</g, "<").replace(/>/g, ">") : '';
        const imageHTML = post.file?.path ? `<div class="post-card__image-container"><img class="post-card__image" src="${buildThumbnailURL(post.file.path)}"></div>` : '';
        return `<article class="post-card post-card--preview co-parsed card--nevermet" data-id="${post.id}" data-service="${post.service}" data-user="${post.user}"><a class="fancy-link fancy-link--kemono" href="/${post.service}/user/${post.user}/post/${post.id}" data-discover="true"><header class="post-card__header">${sanitizedTitle}</header>${imageHTML}<footer class="post-card__footer"><div>${post.user}</div></footer></a></article>`;
    }

    async function fetchMorePosts() {
        if (infiniteScrollState.isLoading || infiniteScrollState.allLoaded) return;
        infiniteScrollState.isLoading = true;
        const loader = document.getElementById('infinite-scroll-loader');
        if (loader) loader.style.display = 'block';

        try {
            const response = await fetch(infiniteScrollState.apiEndpoint + infiniteScrollState.offset);
            if (!response.ok) throw new Error(`API request failed: ${response.status}`);
            const data = await response.json();
            const posts = data.posts || data.results;
            const cardListItems = document.querySelector('.card-list__items');

            if (posts?.length > 0 && cardListItems) {
                cardListItems.insertAdjacentHTML('beforeend', posts.map(createPostCardHTML).join(''));
                infiniteScrollState.offset += posts.length;
                if (infiniteScrollState.offset >= infiniteScrollState.total) {
                    infiniteScrollState.allLoaded = true;
                }
            } else {
                infiniteScrollState.allLoaded = true;
            }
        } catch (error) {
            console.error('[coom enhance] Failed to fetch more posts:', error);
            if (loader) loader.textContent = 'Error loading posts.';
        } finally {
            infiniteScrollState.isLoading = false;
            if (infiniteScrollState.allLoaded && loader) {
                loader.textContent = 'End of results.';
                if (infiniteScrollState.intersectionObserver) infiniteScrollState.intersectionObserver.disconnect();
            }
        }
    }

    function initInfiniteScroll() {
        const cardList = document.querySelector('.card-list__items');
        if (!cardList || document.getElementById('infinite-scroll-loader')) return;

        const apiConfig = getApiConfig();
        if (!apiConfig) return;

        infiniteScrollState = {
            isLoading: false,
            allLoaded: false,
            offset: cardList.children.length,
            total: window.__NEXT_DATA__?.props?.pageProps?.count || Infinity,
            apiEndpoint: apiConfig.endpoint,
            intersectionObserver: null
        };

        const paginator = document.querySelector('.paginator');
        if (paginator) {
            const paginationLinks = paginator.querySelectorAll('.pagination, .page-count, nav');
            paginationLinks.forEach(link => link.remove());
        }

        const loader = document.createElement('div');
        loader.id = 'infinite-scroll-loader';
        cardList.parentNode.appendChild(loader);

        infiniteScrollState.intersectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) fetchMorePosts();
        }, { rootMargin: '1500px 0px' });

        infiniteScrollState.intersectionObserver.observe(loader);
        fetchMorePosts();
    }

    function cleanupInfiniteScroll() {
        if (infiniteScrollState.intersectionObserver) {
            infiniteScrollState.intersectionObserver.disconnect();
            infiniteScrollState.intersectionObserver = null;
        }
        const loader = document.getElementById('infinite-scroll-loader');
        if (loader) loader.remove();
    }

    //================================================================================
    // 7. MAIN EXECUTION & OBSERVERS
    //================================================================================
    function onPageChange() {
        const currentURL = window.location.href;
        if (currentURL === lastProcessedURL) {
            return;
        }
        lastProcessedURL = currentURL;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            injectUI();
            removeSidebarAd();
            replaceVideoPlayers();
            runAutoRandom();

            const { pathname } = window.location;
            document.body.className = document.body.className.replace(/coom-enhance-\w+-page/g, '');

            cleanupInfiniteScroll();

            if (pathname.match(/\/[^/]+\/user\/[^/]+\/post\//)) {
                document.body.classList.add('coom-enhance-post-page');
            }

            const apiConfig = getApiConfig();
            if (apiConfig) {
                initInfiniteScroll();
            }

        }, 300);
    }

    if (window.coomEnhanceLoaded) return;
    window.coomEnhanceLoaded = true;

    const observer = new MutationObserver(onPageChange);
    const attachObserverInterval = setInterval(() => {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            clearInterval(attachObserverInterval);
            observer.observe(rootElement, { childList: true, subtree: true });
            onPageChange();
            console.log('[coom enhance] Observer attached.');
        }
    }, 100);

})();