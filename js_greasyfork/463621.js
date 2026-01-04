// ==UserScript==
// @name         Open unread topics with number keys
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  use numbers to open topics with unread messages in a new tab
// @author       Milan
// @match        https://*.websight.blue/threads/*
// @match        https://websight.blue
// @icon         https://lore.delivery/static/blueshi.png
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/463621/Open%20unread%20topics%20with%20number%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/463621/Open%20unread%20topics%20with%20number%20keys.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function(e) {
        const topics = [...document.querySelectorAll('.thread-unread')].filter(span=> span.style.display != "none").map(span=>span.children[0].href);
        if (e.key == '0') {
            GM_openInTab(topics[9]);
        }
        else {
            if(parseInt(e.key)) {
                GM_openInTab(topics[(parseInt(e.key) - 1)]);
            }
        }
    });
})();