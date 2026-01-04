// ==UserScript==
// @name         aicu体验优化
// @namespace    https://www.aicu.cc/
// @version      1.1
// @description  优化aicu
// @author       Darknights
// @match        *.aicu.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aicu.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513530/aicu%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/513530/aicu%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

'use strict';

setInterval(function () {
    const content = document.querySelector("#content");
    if (content) {
        content.style.display = 'flex';
        content.style.flexWrap = 'wrap';
        content.style.width = '70%';
        content.style.marginLeft = '15%';
    }

    const cards = document.querySelectorAll("#content > .card");
    for (const card of cards) {
        card.style.width = '30%';
        card.style.maxWidth = 'auto';
        card.style.minWidth = '400px';
    }
}, 500);

function removeBackground() {
    document.body.style.backgroundImage = 'url("#")';
    document.body.style.backgroundColor = '#767d72';
}

let rbId = setInterval(function () {
    if (location.search.split('&')[0].indexOf('uid') > -1) {
        clearInterval(rbId);
        return;
    }
    if (document.body.style.backgroundImage === 'url("#")') {
        clearInterval(rbId);
        return;
    }
    removeBackground();
}, 10);