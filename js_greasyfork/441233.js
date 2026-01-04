// ==UserScript==
// @name         Imagus instagram channel fix.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove blocking elements to make Imagus work.
// @author       You
// @license MIT 
// @match        https://www.instagram.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441233/Imagus%20instagram%20channel%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/441233/Imagus%20instagram%20channel%20fix.meta.js
// ==/UserScript==

async function removeElems() {
    const elems = document.querySelectorAll('.JB3Yj');
    elems.forEach(elem => {
        elem.remove();
    });
}

const config = {subtree: true, childList: true};
function watchVideoList() {
    const elem = document.getElementsByClassName('Gx7Kn')[0];
    new MutationObserver(() => {
        removeElems();
    }).observe(elem, config);
}

(function() {
    'use strict';
    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            setTimeout(() => {
                removeElems();
                watchVideoList();
            }, 2000);
        }
    });
    observer.observe(document, config);
})();