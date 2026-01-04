// ==UserScript==
// @name         观察者网全文链接
// @namespace    undefined
// @version      0.2
// @description  替换网站里所有连接为直达全文连接，不需要点击阅读全文
// @author       belowfrog
// @match        http*://www.guancha.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36250/%E8%A7%82%E5%AF%9F%E8%80%85%E7%BD%91%E5%85%A8%E6%96%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/36250/%E8%A7%82%E5%AF%9F%E8%80%85%E7%BD%91%E5%85%A8%E6%96%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';
    const links = document.querySelectorAll('a');
    links.forEach((l) => {
        l.href = l.href.replace(/.shtml$/, '_s.shtml');
    });
})();