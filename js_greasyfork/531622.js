// ==UserScript==
// @name         QoL Update: Neopets Userlookup Skip ReCaptcha
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Converts randomfriend links to userlookup and places &place=999999 before user= for all formats (user= or randomfriend=)
// @author       Fatal
// @match        *.neopets.com/*
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531622/QoL%20Update%3A%20Neopets%20Userlookup%20Skip%20ReCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/531622/QoL%20Update%3A%20Neopets%20Userlookup%20Skip%20ReCaptcha.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function modifyUserUrl(url) {
        const base = 'https://www.neopets.com/userlookup.phtml';

        // Match user or randomfriend params
        const match = url.match(/[?&](user|randomfriend)=([^&]+)/);
        if (url.includes('randomfriend.phtml') && match) {
            const username = match[2];
            return `${base}?place=999999&user=${username}`;
        }

        // Handle existing userlookup links
        if (url.includes('userlookup.phtml') && match) {
            const username = match[2];

            // Clean the URL from existing user/place parameters
            let cleanUrl = url.replace(/[?&]place=[^&]*/g, '').replace(/[?&]user=[^&]*/g, '');
            cleanUrl = cleanUrl.split('?')[0]; // remove remaining query string

            return `${base}?place=999999&user=${username}`;
        }

        return url;
    }

    function modifyAllLinks() {
        const links = document.getElementsByTagName('a');
        for (let link of links) {
            const originalHref = link.href;
            const modifiedHref = modifyUserUrl(originalHref);

            if (modifiedHref !== originalHref) {
                link.href = modifiedHref;
            }
        }
    }

    modifyAllLinks();

    const observer = new MutationObserver(modifyAllLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();