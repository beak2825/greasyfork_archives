// ==UserScript==
// @name         考试星开启复制答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修正考试星助手0.1复制答案失效的问题
// @author       You
// @match        https://exam.kaoshixing.com/exam/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468618/%E8%80%83%E8%AF%95%E6%98%9F%E5%BC%80%E5%90%AF%E5%A4%8D%E5%88%B6%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/468618/%E8%80%83%E8%AF%95%E6%98%9F%E5%BC%80%E5%90%AF%E5%A4%8D%E5%88%B6%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
.questions {
    -webkit-touch-callout: auto;
    -webkit-user-select: auto;
    -khtml-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
}`;

    GM_addStyle(style);
})();