// ==UserScript==
// @name         Tumblr Old Favicon: 2014
// @namespace    https://greasyfork.org/en/scripts/538227-tumblr-old-favicon-2014
// @version      1.0.1
// @description  Replaces the current Tumblr favicon with the one from 2014.
// @author       Valerie moon
// @match        https://www.tumblr.com/*
// @grant        none
// @icon         https://web.archive.org/web/20140723164326im_/http://assets.tumblr.com/images/favicons/favicon.ico?_v=0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538227/Tumblr%20Old%20Favicon%3A%202014.user.js
// @updateURL https://update.greasyfork.org/scripts/538227/Tumblr%20Old%20Favicon%3A%202014.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldFaviconUrl = "https://web.archive.org/web/20140723164326im_/http://assets.tumblr.com/images/favicons/favicon.ico?_v=0";
    let lastKnownFaviconElement = null;

    function changeFavicon() {
        let head = document.head;
        if (!head) {
            setTimeout(changeFavicon, 100);
            return;
        }

        let link = document.querySelector("link[rel~='icon'], link[rel='shortcut icon']");

        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            head.appendChild(link);
            lastKnownFaviconElement = link;
        } else {
            lastKnownFaviconElement = link;
        }

        if (link.href !== oldFaviconUrl) {
            link.href = oldFaviconUrl;
            link.type = 'image/x-icon';
        } else if (link.type !== 'image/x-icon') {
            link.type = 'image/x-icon';
        }
    }

    if (document.head) {
        changeFavicon();
    } else {
        const initialObserver = new MutationObserver((mutations, obs) => {
            if (document.head) {
                obs.disconnect();
                changeFavicon();
                startMainObservers();
            }
        });
        initialObserver.observe(document.documentElement, { childList: true });
    }

    function startMainObservers() {
        if (!document.head) {
            return;
        }

        const headObserver = new MutationObserver(function(mutationsList) {
            let needsUpdate = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    let currentFavicon = document.querySelector("link[rel~='icon'], link[rel='shortcut icon']");
                    if (!currentFavicon || (currentFavicon === lastKnownFaviconElement && currentFavicon.href !== oldFaviconUrl) || (currentFavicon !== lastKnownFaviconElement)) {
                        needsUpdate = true;
                        break;
                    }
                } else if (mutation.type === 'attributes') {
                    if (mutation.target === lastKnownFaviconElement && (mutation.attributeName === 'href' || mutation.attributeName === 'rel')) {
                        if (lastKnownFaviconElement.href !== oldFaviconUrl) {
                            needsUpdate = true;
                            break;
                        }
                    } else if (mutation.target.matches("link[rel~='icon'], link[rel='shortcut icon']") && mutation.target !== lastKnownFaviconElement) {
                        needsUpdate = true;
                        break;
                    }
                }
            }

            if (needsUpdate) {
                setTimeout(changeFavicon, 50);
            } else {
                let currentFavicon = document.querySelector("link[rel~='icon'], link[rel='shortcut icon']");
                if (!currentFavicon || currentFavicon.href !== oldFaviconUrl) {
                    setTimeout(changeFavicon, 50);
                }
            }
        });

        headObserver.observe(document.head, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href', 'rel', 'type', 'sizes']
        });

        const titleElement = document.querySelector('head > title');
        if (titleElement) {
            const titleObserver = new MutationObserver(function() {
                setTimeout(changeFavicon, 50);
            });
            titleObserver.observe(titleElement, { childList: true });
        }
    }

    if (document.head) {
        startMainObservers();
    }

    function handleNavigationEvent() {
        setTimeout(changeFavicon, 150);
    }

    window.addEventListener('popstate', handleNavigationEvent);
    window.addEventListener('hashchange', handleNavigationEvent);

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);
        handleNavigationEvent();
        return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        const result = originalReplaceState.apply(this, args);
        handleNavigationEvent();
        return result;
    };
})();