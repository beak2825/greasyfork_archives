// ==UserScript==
// @name         底部ad
// @namespace    none
// @version      1
// @description  Removes all code containing the href attribute from the page
// @match        http://www.htmanga3.top/*
// @match        *://www.htmanga3.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464893/%E5%BA%95%E9%83%A8ad.user.js
// @updateURL https://update.greasyfork.org/scripts/464893/%E5%BA%95%E9%83%A8ad.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const elements = document.querySelectorAll('*[alt][style]');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        fragment.appendChild(element);
    }

    // 一次性插入到文档中
    elements[0].parentNode.appendChild(fragment);
})();
