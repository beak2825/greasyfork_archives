// ==UserScript==
// @name         Disable Google Optimize page-hiding CSS
// @name:ja      Google Optimize page-hiding CSSの無効化
// @description  Disable Google Optimize page-hiding CSS.The homepage using Google Optimize will show up quickly.
// @description:ja Google Optimize page-hiding CSSを無効にします。Google Optimizeを使用しているホームページが、素早く表示されるようになります。
// @namespace    masshiro.blog
// @version      20200412
// @author       masshiro
// @license      MIT License
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-body
// @noframes     
// @downloadURL https://update.greasyfork.org/scripts/376184/Disable%20Google%20Optimize%20page-hiding%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/376184/Disable%20Google%20Optimize%20page-hiding%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const node = document.getElementsByTagName('html');
    for (const elm of node) {
        const attr = elm.getAttribute('style') || '';
        elm.setAttribute('style', attr + ';opacity:1 !important;');
        elm.classList.remove('async-hide');
    }
})();