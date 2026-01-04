// ==UserScript==
// @name        4chan Ø
// @namespace   4chan-ø
// @version     1.3
// @grant       none
// @match       http*://boards.4chan.org/*
// @include     http*://boards.4chan.org/*
// @description:en norgetraaden 
// @description norgetraaden
// @downloadURL https://update.greasyfork.org/scripts/30464/4chan%20%C3%98.user.js
// @updateURL https://update.greasyfork.org/scripts/30464/4chan%20%C3%98.meta.js
// ==/UserScript==
 
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
 
window.onload = function() {
        window.onkeyup = function(e) {
                if (e.target.tagName.toLowerCase() === 'textarea') {
                        if (isFirefox) {
                                if (e.key.toLowerCase() !== 'ø') {
                                        return;
                                }
                        } else {
                                if (e.keyCode !== 186 && e.keyCode !== 192) {
                                        return;
                                }
                        }
 
                        var elem = e.target;
 
                        var pos = elem.selectionStart;
 
                        elem.value = elem.value
                                .replace(/Ø/g, 'Ǿ')
                                .replace(/ø/g, 'ǿ');
 
                        elem.setSelectionRange(pos, pos);
                }
        };
};// ==UserScript==
// @name New Script
// @namespace Violentmonkey Scripts
// @grant none
// ==/UserScript==
