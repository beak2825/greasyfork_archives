// ==UserScript==
// @name         Facebook Recommands Removal
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Remove Facebook recommands
// @author       PoH98
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485255/Facebook%20Recommands%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/485255/Facebook%20Recommands%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = '[data-pagelet] { visibility: hidden; animation: .1s fadeIn .2s linear forwards; } @keyframes fadeIn { 99% { visibility: hidden; } 100% { visibility: visible; }}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    setInterval(() => {
        const els = document.querySelectorAll(".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x6prxxf.xvq8zen.x1s688f.x1fey0fg");
        els.forEach((el) => {
            const parent = el.closest("[data-pagelet]");
            parent?.remove();
        });
        const recommands = document.querySelectorAll("[aria-label='Reels']");
        recommands.forEach((el) => {
            const parent = el.closest("[data-pagelet]");
            parent?.remove();
        });
    }, 100);
})();