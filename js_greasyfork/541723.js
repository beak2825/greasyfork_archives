// ==UserScript==
// @name         Trakt Modifier makes it simpler
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modify elements on Trakt.tv only on /movies or /movies/{idk} and /shows or /shows/{slug} only
// @author       DK
// @match        https://trakt.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541723/Trakt%20Modifier%20makes%20it%20simpler.user.js
// @updateURL https://update.greasyfork.org/scripts/541723/Trakt%20Modifier%20makes%20it%20simpler.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function simulateUserClick(el) {
        ['pointerdown', 'pointerup', 'click'].forEach(type => {
            const event = new PointerEvent(type, { bubbles: true, cancelable: true, view: window });
            el.dispatchEvent(event);
        });
    }

    function triggerSidebarWatchButton() {
        const sidebarBtn = document.querySelector('.posters.sticky.sidebar > .btn-watch-now');
        if (sidebarBtn) {
            simulateUserClick(sidebarBtn);
        } else {
            console.log('Sidebar watch button not found');
        }
    }

    function attachClickHandler() {
        document.querySelectorAll('img[src*="walter-r2.trakt.tv/images/"]').forEach(img => {
            if (!img.dataset.watchHandlerAttached) {
                img.dataset.watchHandlerAttached = 'true';
                img.style.cursor = 'pointer';
                img.addEventListener('click', e => {
                    e.preventDefault();
                    triggerSidebarWatchButton();
                });
            }
        });
    }

    attachClickHandler();

    new MutationObserver(attachClickHandler).observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    function unhideButtons() {
        const selectors = [
            '.selected.watch-now > .fa-play.fa-solid',
            'div.col-sm-6.col-md-4.col-xlg-3.grid-item > .quick-icons > .actions > .selected.watch-now > .fa-play.fa-solid'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'inline-block';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
        });
    }

    unhideButtons();

    const observer = new MutationObserver(unhideButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();
(function () {
    'use strict';

    function getPathSegments() {
        return window.location.pathname.split('/').filter(Boolean);
    }

    const segments = getPathSegments();

    // Allowed:
    // 1 segment: ['movies'] or ['shows']
    // 2 segments: ['movies', 'slug'] or ['shows', 'slug']
    // Anything else is disallowed
    const allowed =
        (segments.length === 1 && (segments[0] === 'movies' || segments[0] === 'shows')) ||
        (segments.length === 2 && (segments[0] === 'movies' || segments[0] === 'shows'));

    if (!allowed) return;

    function onElementReady(selector, callback) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.dataset.modified) {
                    el.dataset.modified = 'true';
                    callback(el);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Initial run
        document.querySelectorAll(selector).forEach(el => {
            if (!el.dataset.modified) {
                el.dataset.modified = 'true';
                callback(el);
            }
        });
    }

    onElementReady('.balance-text.no-hide.under-info', el => {
        el.style.color = 'gray';
        el.textContent += ' + 3 Services';
    });

    onElementReady('.no-links', el => {
        el.style.fontStyle = 'italic';
        el.textContent = 'Unoffical Sources Only';
    });

})();
