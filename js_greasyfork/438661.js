// ==UserScript==
// @name         aibtba搜索结果按照年份倒序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  aibtba.com的搜索结果按照年份倒序
// @author       tcatche
// @match        so.aibtba.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aibtba.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438661/aibtba%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8C%89%E7%85%A7%E5%B9%B4%E4%BB%BD%E5%80%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/438661/aibtba%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%8C%89%E7%85%A7%E5%B9%B4%E4%BB%BD%E5%80%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const listUlEles = document.querySelector('.lists ul');
    const liEles = [...listUlEles.children];
    listUlEles.textContent = '';
    liEles.sort(function(ele1, ele2) {
        const year1Text = ele1.querySelector('div > p:nth-child(5) > i').textContent;
        const year2Text = ele2.querySelector('div > p:nth-child(5) > i').textContent;
        return year1Text > year2Text ? -1 : 1;
    }).forEach(function(ele) {
        listUlEles.appendChild(ele);
    })
})();