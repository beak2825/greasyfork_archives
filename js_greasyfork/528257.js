// ==UserScript==
// @name         Německá házená
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Odstranění & z live URL
// @author       Michal
// @match        https://www.daikin-hbl.de/de/match/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528257/N%C4%9Bmeck%C3%A1%20h%C3%A1zen%C3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528257/N%C4%9Bmeck%C3%A1%20h%C3%A1zen%C3%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixUrl() {
        let url = window.location.href;
        let fixedUrl = url.replace(/\?&/g, '?');

        if (url !== fixedUrl) {
            history.replaceState(null, '', fixedUrl);
            console.log('Live URL upravena:', fixedUrl);
            alert('Live URL upravena'); // Alert se zobrazí pouze při skutečné změně
        }
    }

    function observeUrlChange() {
        let lastUrl = location.href;

        function checkUrlChange() {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('Detected URL change:', lastUrl);
                fixUrl();
            }
        }

        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
            originalPushState.apply(history, arguments);
            setTimeout(checkUrlChange, 50);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(state, title, url) {
            originalReplaceState.apply(history, arguments);
            setTimeout(checkUrlChange, 50);
        };

        window.addEventListener('popstate', checkUrlChange);
        window.addEventListener('hashchange', checkUrlChange);

        setInterval(checkUrlChange, 500);
    }

    window.addEventListener('load', () => {
        fixUrl();
        observeUrlChange();
    });
})();

