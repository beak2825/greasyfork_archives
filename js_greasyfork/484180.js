// ==UserScript==
// @name         Unblur workshop
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Unblur steam workshop items in China.
// @author       Remiliacn
// @match        https://steamcommunity.com/id/*/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/484180/Unblur%20workshop.user.js
// @updateURL https://update.greasyfork.org/scripts/484180/Unblur%20workshop.meta.js
// ==/UserScript==

function work() {
    const censoredNodes = Array.from(document.querySelectorAll('.ugc.has_adult_content'));
    censoredNodes.forEach(node => {
       const child = node ? node.children[0] : null;
       if (child) {
           child.style.filter = 'none';
       }
    });
}

(function() {
    'use strict';

    setInterval(work, 10000);
})();