// ==UserScript==
// @name Force Flash Wmode GPU
// @namespace edsgerlin.com
// @description Force flash video playback to use wmode=gpu to allow hardware acceleration, based on Mikhoul's userscripts. 
// @author      Chin-Yuan Lin
// @version     0.0.2
// @include *
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/27341/Force%20Flash%20Wmode%20GPU.user.js
// @updateURL https://update.greasyfork.org/scripts/27341/Force%20Flash%20Wmode%20GPU.meta.js
// ==/UserScript==

(() => {
    'use strict';
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
            const matches = (this.document || this.ownerDocument).querySelectorAll(s);
            let i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
    }
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const addedNodes = Array.from(mutation.addedNodes||[]);
            addedNodes.forEach(addedNode => {
                if (addedNode.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                if (addedNode.matches('object[type=\'application/x-shockwave-flash\']')) {
                    addedNode.querySelector("object>param[name='wmode']").value = 'gpu';
                }
            });
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();