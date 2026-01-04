// ==UserScript==
// @name         网道文档助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0-2024-05-22
// @description  文档滚动时目录悬浮
// @author       cshaptx4869
// @match        https://wangdoc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wangdoc.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495753/%E7%BD%91%E9%81%93%E6%96%87%E6%A1%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495753/%E7%BD%91%E9%81%93%E6%96%87%E6%A1%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tocElement = document.querySelector('.article-toc');
    var fixedElement = tocElement.cloneNode(true);
    var panelInfoElement = document.querySelector('.panel-info');
    fixedElement.style.display = 'none';
    fixedElement.style.position = 'sticky';
    fixedElement.style.top = '1.5rem';
    panelInfoElement.after(fixedElement);
    window.addEventListener('scroll', function() {
        var rect = panelInfoElement.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            fixedElement.style.display = 'block';
        } else {
            fixedElement.style.display = 'none';
        }
    });
})();