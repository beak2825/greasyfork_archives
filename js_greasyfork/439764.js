// ==UserScript==
// @name         online-timers cleaner
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world
// @author       skrishtofenko
// @match        https://www.online-timers.com/
// @icon         https://www.google.com/s2/favicons?domain=online-timers.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439764/online-timers%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/439764/online-timers%20cleaner.meta.js
// ==/UserScript==

function clearPage() {
    ['h3', 'header', '#page div.acc.deco', 'div.block-minutes', 'ul.oups', '#page > div > a', 'ul.partage', '#block-comment', '#tt'].forEach(selector => {
        let elems = document.querySelectorAll(selector);
 
        if (elems.length) {
            elems.forEach(elem => {
                elem.parentNode.removeChild(elem)
            })
        }
    });
}
 
(function() {
    'use strict';
 
    setTimeout(clearPage, 100);
})();