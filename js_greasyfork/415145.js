// ==UserScript==
// @name         语雀小屏幕适配，笔记详情页添加返回笔记目录按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.yuque.com/rockykwok/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415145/%E8%AF%AD%E9%9B%80%E5%B0%8F%E5%B1%8F%E5%B9%95%E9%80%82%E9%85%8D%EF%BC%8C%E7%AC%94%E8%AE%B0%E8%AF%A6%E6%83%85%E9%A1%B5%E6%B7%BB%E5%8A%A0%E8%BF%94%E5%9B%9E%E7%AC%94%E8%AE%B0%E7%9B%AE%E5%BD%95%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/415145/%E8%AF%AD%E9%9B%80%E5%B0%8F%E5%B1%8F%E5%B9%95%E9%80%82%E9%85%8D%EF%BC%8C%E7%AC%94%E8%AE%B0%E8%AF%A6%E6%83%85%E9%A1%B5%E6%B7%BB%E5%8A%A0%E8%BF%94%E5%9B%9E%E7%AC%94%E8%AE%B0%E7%9B%AE%E5%BD%95%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // get url
    var url = window.location.href;
    url = url.split('/', 5).join('/');
    // insert before lark-editor-header-action
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('class', 'backtotoc')
    a.appendChild(document.createTextNode('回到笔记目录 > '))
    var el = document.getElementsByClassName('header-crumb')[0]
    el.insertBefore(a, document.getElementsByClassName('lark-breadcrumb')[0])
    console.log(url, a, el)
})();