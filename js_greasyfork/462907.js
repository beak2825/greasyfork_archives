// ==UserScript==
// @name         Arxiv-Vanity in
// @namespace    http://tampermonkey.net/
// @version      Arxiv
// @description  Just add a link toward Arxiv-Vanity. Below the 'Download:' label.
// @author       sexydove
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462907/Arxiv-Vanity%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/462907/Arxiv-Vanity%20in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const fullTextList = document.querySelector('.full-text').querySelector('ul');
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.textContent = 'Arxiv-Vanity';
    link.href = `https://www.arxiv-vanity.com/convert/?query=${encodeURIComponent(window.location.href)}`;
    link.target = '_blank';

    listItem.appendChild(link);
    fullTextList.insertBefore(listItem, fullTextList.firstChild);
})();