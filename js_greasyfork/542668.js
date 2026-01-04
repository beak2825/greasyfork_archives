// ==UserScript==
// @name         GitHub Tab Avatar
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.0.2
// @description  Use each GitHub repository’s avatar as the browser tab icon.
// @author       TheSina
// @match        *://github.com/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542668/GitHub%20Tab%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/542668/GitHub%20Tab%20Avatar.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function () {
    'use strict';

    const CACHE_TTL = 24 * 3600 * 1000;
    const STORAGE_KEY = 'githubTabAvatarCache';
    const DEBUG = false;
    const LOG = (...args) => DEBUG && console.log('[GTU]', ...args);

    let iconEls = [];
    let originalIcon = null;
    let lastOwner = null;
    // load cache from localStorage
    let iconCache = new Map();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            JSON.parse(raw).forEach(([owner, entry]) => {
                if (Date.now() - entry.ts < CACHE_TTL) {
                    iconCache.set(owner, entry);
                }
            });
        }
    } catch {}
    let isUpdating = false;

    function getOwnerName() {
        const pathSegments = location.pathname.split('/').filter(s => s);
        // We need at least two segments to determine the owner
        if (pathSegments.length < 2) return null;

        const [segment1, segment2] = pathSegments;

        // If the first segment is 'orgs', the owner is the second segment
        if (segment1 === 'orgs') {
            return segment2;
        }

        // If the first segment is a known non-target, or just a user page, return null
        const nonTargetSegments = new Set([
            'settings',
            'notifications',
            'pulls',
            'issues',
            'marketplace',
            'explore',
            'organizations',
            'account',
        ]);
        if (nonTargetSegments.has(segment1)) {
            return null;
        }

        // Otherwise, the owner is the first segment
        return segment1;
    }

    function setFavicon(url) {
        if (!iconEls.length || !document.contains(iconEls[0])) {
            initFaviconTags();
        }
        iconEls.forEach(el => {
            if (el && document.contains(el)) {
                el.href = url;
            }
        });
    }

    function resetFavicon() {
        if (originalIcon) setFavicon(originalIcon);
    }

    function initFaviconTags() {
        if (!iconEls.length || !document.contains(iconEls[0])) {
            iconEls = Array.from(
                document.querySelectorAll('link[rel*="icon"]'),
            );
            if (!iconEls.length) {
                const link = document.createElement('link');
                link.rel = 'shortcut icon';
                document.head.appendChild(link);
                iconEls = [link];
            }
            if (!originalIcon && iconEls[0]) {
                originalIcon =
                    iconEls[0].href || 'https://github.com/favicon.ico';
            }
        }
    }

    // try DOM first (new method)
    async function getAvatarFromAPI(owner) {
        try {
            LOG('🚀 Using GitHub API to find avatar for:', owner);
            const res = await fetch(`https://api.github.com/users/${owner}`, {
                headers: {Accept: 'application/vnd.github.v3+json'},
            });
            if (!res.ok) throw new Error('API response not OK');
            const data = await res.json();
            if (data?.avatar_url) {
                const urlObj = new URL(data.avatar_url);
                urlObj.searchParams.set('s', '32');
                return urlObj.href;
            }
        } catch (err) {
            LOG('⚠️ API lookup failed:', err);
        }
        return null;
    }

    async function updateFavicon() {
        if (isUpdating) return;
        isUpdating = true;
        try {
            const owner = getOwnerName();
            if (!owner) {
                resetFavicon();
                lastOwner = null;
                return;
            }
            // cached?
            if (owner === lastOwner && iconCache.has(owner)) {
                const cached = iconCache.get(owner);
                if (Date.now() - cached.ts < CACHE_TTL) {
                    setFavicon(cached.url);
                    return;
                }
            }
            lastOwner = owner;

            const avatarUrl = await getAvatarFromAPI(owner);
            if (avatarUrl) {
                iconCache.set(owner, {url: avatarUrl, ts: Date.now()});
                try {
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify([...iconCache]),
                    );
                } catch {}
                setFavicon(avatarUrl);
                LOG('✅ Favicon updated successfully');
            } else {
                LOG('⚠️ No avatar found, using default');
                resetFavicon();
            }
        } finally {
            isUpdating = false;
        }
    }

    function debounce(fn, ms) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    const debouncedUpdate = debounce(updateFavicon, 300);

    function handleNavigation() {
        LOG('🧭 Navigation detected');
        lastOwner = null; // Invalidate cache on navigation
        debouncedUpdate();
    }

    function start() {
        LOG('🚀 Starting GitHub Tab Avatar');
        initFaviconTags();
        debouncedUpdate();

        document.addEventListener('turbo:load', handleNavigation);
        document.addEventListener('turbo:render', () =>
            setTimeout(handleNavigation, 200),
        );

        const originalPushState = history.pushState;
        history.pushState = function (...args) {
            originalPushState.apply(history, args);
            handleNavigation();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function (...args) {
            originalReplaceState.apply(history, args);
            handleNavigation();
        };

        window.addEventListener('popstate', handleNavigation);

        setInterval(() => {
            const currentOwner = getOwnerName();
            if (currentOwner && currentOwner !== lastOwner) {
                LOG('🔄 Polling detected change');
                handleNavigation();
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
