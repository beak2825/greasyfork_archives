// ==UserScript==
// @name         More Tabs
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        GM_info
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/410068/More%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/410068/More%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    if ( randomInt(50) == 0 ) {
        const urls = [location.href,`https://mytec.executivecentre.com/`, `https://www.executivecentre.com/`];
        GM_openInTab(urls[randomInt(urls.length)], {
            active: false,
            insert: true,
            setParent: true,
            incognito: GM_info.isIncognito
        });
    }
})();