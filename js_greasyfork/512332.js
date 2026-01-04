// ==UserScript==
// @name         夸克网盘标题修改
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace the page title with the content of elements with class "file-tit" on https://pan.quark.cn/.
// @match        https://pan.quark.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512332/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/512332/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const fileTitElements = document.querySelectorAll('.file-tit');
                if (fileTitElements.length > 0) {
                    const newTitle = fileTitElements[0].textContent;
                    document.title = newTitle + "- 夸克网盘";
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
})();