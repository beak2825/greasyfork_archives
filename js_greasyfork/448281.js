// ==UserScript==
// @name         csdn不关注展开全部
// @namespace    csdn
// @version      0.2
// @description  csdn不需要关注 就展开全部
// @author       huzhen
// @match        *://blog.csdn.net/*
// @match        *://*.blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448281/csdn%E4%B8%8D%E5%85%B3%E6%B3%A8%E5%B1%95%E5%BC%80%E5%85%A8%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448281/csdn%E4%B8%8D%E5%85%B3%E6%B3%A8%E5%B1%95%E5%BC%80%E5%85%A8%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('article_content').setAttribute('style','');
    document.getElementsByClassName('hide-article-box hide-article-pos text-center')[0].setAttribute('style',' display: none;');
})();