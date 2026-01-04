// ==UserScript==
// @name         CSDN复制解禁
// @name:en      CSDN enable code copy
// @namespace    http://blog.csdn.net/
// @version      0.1
// @description  随意在CSDN复制带样式的文本,不受到其自身版权限制脚本的影响
// @description:en  Copy styled text on CSDN,do whatever you want, without being affected by its own copyright-restricted scripts.
// @author       AIUSoft
// @license      MIT
// @supportURL   https://gist.github.com/LiuQixuan/7a8683ede4b885a6df834ceeb933d1c5
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/448414/CSDN%E5%A4%8D%E5%88%B6%E8%A7%A3%E7%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/448414/CSDN%E5%A4%8D%E5%88%B6%E8%A7%A3%E7%A6%81.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    document.getElementById('content_views')?.setAttribute('id','')
    document.getElementById('article_content')?.setAttribute('id','')
    document.querySelectorAll('.set-code-hide').forEach(el=>el.classList.remove('set-code-hide'))
    document.querySelectorAll('.hide-preCode-box').forEach(el=>el.remove())
    document.querySelectorAll('.signin').forEach(el=>el.remove())
    let contentEl = document.querySelector('main .blog-content-box')
    contentEl.parentNode.replaceChild(contentEl.cloneNode(1), contentEl)
})();