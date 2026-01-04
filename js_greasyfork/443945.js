// ==UserScript==
// @name         虎扑社区移动版网页自动跳转PC版
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  虎扑社区移动版网页自动跳转PC版。比如https://m.hupu.com/bbs/53224454.html 自动跳转到 https://bbs.hupu.com/53224454.html
// @author       huaji
// @match        https://m.hupu.com/bbs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443945/%E8%99%8E%E6%89%91%E7%A4%BE%E5%8C%BA%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/443945/%E8%99%8E%E6%89%91%E7%A4%BE%E5%8C%BA%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Url = window.location.href;
    var xxx = Url.match(/\/bbs\/(\d*)\.(html|htm|shtm|shtml)/);
    var id= xxx[1];
    const href = `https://bbs.hupu.com/${id}.html`

  window.location.replace(href);
    // Your code here...
})();