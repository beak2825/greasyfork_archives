// ==UserScript==
// @name         GitHub Passkey Redirector
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Redirects GitHub login page so that Passkey logon is enabled.
// @author       DanTheMan827
// @license MIT
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474298/GitHub%20Passkey%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/474298/GitHub%20Passkey%20Redirector.meta.js
// ==/UserScript==
// Special thanks to ChatGPT.
(function() {
    'use strict';
    function checkPage() {
        const currentURL = window.location.href;

        if (currentURL.startsWith("https://github.com/login?") || currentURL == "https://github.com/login") {
            const urlSearchParams = new URLSearchParams(currentURL.split('?')[1]);

            if (!urlSearchParams.has('passkey') || urlSearchParams.get('passkey') !== 'true') {
                urlSearchParams.set('passkey', 'true');
                history.replaceState(null, null, `https://github.com/login?${urlSearchParams.toString()}`);
                location.reload();
            }
        }
    }

    var _wr = function(type) {
        var orig = history[type];
        return function() {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };

    history.replaceState = _wr('replaceState');

    // Use it like this:
    window.addEventListener('replaceState', () => checkPage());
})();