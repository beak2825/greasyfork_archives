// ==UserScript==
// @name           Redirects Instagram to an open source alternative
// @name:es        Redirige Instagram a una alternativa de código abierto
// @namespace      https://greasyfork.org/es/users/1228259-tivp
// @version        11-01-2026
// @description    Stays on Instagram by default. Press the switch to jump to Imginn.
// @description:es Por defecto te quedas en Instagram. Presiona el switch para saltar a Imginn.
// @author         tivp
// @license        Unlicensed
// @icon           https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.instagram.com&size=48
// @icon64         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.instagram.com&size=64
// @include        *instagram.com*
// @include        *imginn.com*
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/522737/Redirects%20Instagram%20to%20an%20open%20source%20alternative.user.js
// @updateURL https://update.greasyfork.org/scripts/522737/Redirects%20Instagram%20to%20an%20open%20source%20alternative.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_DOMAIN = 'imginn.com';
    const COOKIE_NAME = 'alt_redirect_active';

    const RE_PATTERNS = {
        igReelsTab: /^\/([^/]+)\/reels\/$/,
        igReelUser: /^\/([^/]+)\/reel\/([^/]+)\/?$/,
        igReelDirect: /^\/reel\/([^/]+)\/?$/,
        igReelsPlural: /^\/reels\/([^/]+)\/?$/,
        igTagged: /^\/([^/]+)\/tagged\/$/,
        altStories: /^\/stories\/([^/]+)\/$/,
        altPost: /^\/p\/([^/]+)\/?$/,
        altTagged: /^\/tagged\/([^/]+)\/?$/
    };

    let isNavigating = false;
    let uiContainer = null;
    let uiCheckbox = null;

    function isRestrictedPage() {
        const { host, href, pathname } = window.location;
        const restrictedHosts = [
            'accountscenter.instagram.com',
            'familycenter.instagram.com',
            'help.instagram.com',
            'about.instagram.com'
        ];

        if (restrictedHosts.includes(host)) return true;

        return href.includes('/direct/t/') ||
               href.includes('/direct/inbox/') ||
               href.includes('/accounts/') ||
               href.includes('/saved/') ||
               href.includes('/stories/highlights/') ||
               href.includes('/explore/') ||
               href.includes('/your_activity/') ||
               pathname === '/reels/';
    }

    function setCookie(value) {
        const date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = `${COOKIE_NAME}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    function getCookie() {
        const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function transformToImginn(url) {
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        let destPath = path;
        let hash = '';

        const mReelUser = path.match(RE_PATTERNS.igReelUser);
        const mReelDirect = path.match(RE_PATTERNS.igReelDirect);
        const mReelsPlural = path.match(RE_PATTERNS.igReelsPlural);
        const mReelsTab = path.match(RE_PATTERNS.igReelsTab);
        const mTagged = path.match(RE_PATTERNS.igTagged);

        if (mReelUser) {
            destPath = `/p/${mReelUser[2]}/`;
            hash = '#reel';
        } else if (mReelDirect) {
            destPath = `/p/${mReelDirect[1]}/`;
            hash = '#reel';
        } else if (mReelsPlural) {
            destPath = `/p/${mReelsPlural[1]}/`;
        } else if (mReelsTab) {
            destPath = `/${mReelsTab[1]}/`;
        } else if (mTagged) {
            destPath = `/tagged/${mTagged[1]}/`;
        }

        return `https://${TARGET_DOMAIN}${destPath}${hash}`;
    }

    function transformToInstagram() {
        const { pathname, hash } = window.location;
        let destPath = pathname;

        const mStories = pathname.match(RE_PATTERNS.altStories);
        const mPost = pathname.match(RE_PATTERNS.altPost);
        const mTagged = pathname.match(RE_PATTERNS.altTagged);

        if (mStories) {
            destPath = `/${mStories[1]}/`;
        } else if (mPost && hash === '#reel') {
            destPath = `/reel/${mPost[1]}/`;
        } else if (mTagged) {
            destPath = `/${mTagged[1]}/tagged/`;
        }

        return `https://www.instagram.com${destPath}`;
    }

    function injectStyles() {
        if (document.getElementById('alt-ui-css')) return;
        const style = document.createElement('style');
        style.id = 'alt-ui-css';
        style.textContent = `
            .alt-switch-box {
                position: fixed; bottom: 20px; left: 20px; z-index: 9999999;
                display: flex; align-items: center; background: #fff;
                padding: 10px 16px; border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                border: 1px solid #e0e0e0; transition: opacity 0.3s;
            }
            .alt-label { margin-right: 12px; font-size: 13px; font-weight: 600; color: #262626; }
            .alt-toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
            .alt-toggle input { opacity: 0; width: 0; height: 0; }
            .alt-slider { position: absolute; cursor: pointer; inset: 0; background-color: #ccc; transition: .3s; border-radius: 34px; }
            .alt-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            input:checked + .alt-slider { background-color: #0095f6; }
            input:checked + .alt-slider:before { transform: translateX(20px); }
        `;
        document.head.appendChild(style);
    }

    function renderUI() {
        if (!document.body) return;

        if (uiContainer && !document.body.contains(uiContainer)) {
            document.body.appendChild(uiContainer);
            return;
        }
        if (uiContainer) return;

        injectStyles();

        uiContainer = document.createElement('div');
        uiContainer.className = 'alt-switch-box';
        uiContainer.innerHTML = `
            <span class="alt-label">Modo Alternativo</span>
            <label class="alt-toggle">
                <input type="checkbox">
                <span class="alt-slider"></span>
            </label>
        `;

        uiCheckbox = uiContainer.querySelector('input');
        uiCheckbox.addEventListener('change', (e) => {
            isNavigating = true;
            if (e.target.checked) {
                setCookie('true');
                window.location.href = transformToImginn(window.location.href);
            } else {
                setCookie('false');
                window.location.href = transformToInstagram();
            }
        });

        document.body.appendChild(uiContainer);
        syncCheckboxState();
    }

    function syncCheckboxState() {
        if (!uiCheckbox || isNavigating) return;
        uiCheckbox.checked = window.location.host.includes(TARGET_DOMAIN);
    }

    function updateVisibility() {
        if (isRestrictedPage()) {
            if (uiContainer) uiContainer.style.display = 'none';
        } else {
            renderUI();
            if (uiContainer) {
                uiContainer.style.display = 'flex';
                syncCheckboxState();
            }
        }
    }

    function initHistoryHook() {
        const wrap = (type) => {
            const orig = history[type];
            return function () {
                const rv = orig.apply(this, arguments);
                window.dispatchEvent(new Event('statechange'));
                return rv;
            };
        };
        history.pushState = wrap('pushState');
        history.replaceState = wrap('replaceState');

        window.addEventListener('popstate', () => window.dispatchEvent(new Event('statechange')));
        window.addEventListener('hashchange', () => window.dispatchEvent(new Event('statechange')));

        window.addEventListener('statechange', updateVisibility);
    }

    function checkAutoRedirect() {
        if (!window.location.host.includes('instagram.com')) return;
        if (isRestrictedPage()) return;

        if (getCookie() === 'true') {
            window.location.replace(transformToImginn(window.location.href));
        }
    }

    checkAutoRedirect();
    initHistoryHook();

    window.addEventListener('DOMContentLoaded', updateVisibility);
    window.addEventListener('load', updateVisibility);

    let lastUrl = location.href;
    setInterval(() => {
        const currUrl = location.href;
        if (currUrl !== lastUrl) {
            lastUrl = currUrl;
            updateVisibility();
        } else if (!isRestrictedPage() && document.body && (!uiContainer || !document.body.contains(uiContainer))) {
            updateVisibility();
        }
    }, 1000);

})();