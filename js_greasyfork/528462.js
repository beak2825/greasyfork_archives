// ==UserScript==
// @name         PixAI show hidden tags
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Show tags despite being hidden by author
// @author       @marcelbrode
// @match        https://pixai.art/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixai.art
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528462/PixAI%20show%20hidden%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/528462/PixAI%20show%20hidden%20tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const interval = setInterval(showTags, 2000);
})();

function showTags() {
    const formerHiddenElement = document.querySelector('.absolute.inset-0.flex.items-center.justify-center.font-medium.select-none');

    if (!formerHiddenElement) {
        return;
    }

    formerHiddenElement.remove();

    const meta = document.head.querySelectorAll('meta[name="description"]');
    let tags = meta[meta.length-1].content;
    tags = tags.split(' AI Artwork')[0];

    const hiddenElement = document.createElement('div');
    hiddenElement.classList = 'flex justify-end select-none';
    hiddenElement.style = 'margin: -15px 0; font-size: 12px; font-style: italic;';
    hiddenElement.innerText = 'Hidden by author';

    const promptsElement = document.querySelector('.blur.line-clamp-2.select-none');
    promptsElement.classList = [];
    promptsElement.innerText = tags;
    promptsElement.parentNode.insertAdjacentElement('afterend', hiddenElement);
}