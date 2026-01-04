// ==UserScript==
// @name         f*ck 微博t.cn
// @namespace    https://m.weibo.cn/
// @version      0.1
// @description  t.cn直接跳转
// @author       Yonjar
// @match        http://t.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411826/f%2Ack%20%E5%BE%AE%E5%8D%9Atcn.user.js
// @updateURL https://update.greasyfork.org/scripts/411826/f%2Ack%20%E5%BE%AE%E5%8D%9Atcn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.href = document.querySelector('.link').textContent;
})();