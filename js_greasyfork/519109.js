// ==UserScript==
// @name         Hide Zhihu Title
// @name:zh-CN   隐藏知乎标题
// @name:zh-TW   隱藏知乎標題
// @name:en      Hide Zhihu Title
// @namespace    http://tampermonkey.net/
// @version      2024.11.28
// @description  Hide Zhihu question title
// @description:zh-CN  隐藏知乎问题标题
// @description:zh-TW  隱藏知乎問題標題
// @description:en     Hide Zhihu question title
// @author       Myth
// @match        https://www.zhihu.com/question/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519109/Hide%20Zhihu%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/519109/Hide%20Zhihu%20Title.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.getElementsByClassName('QuestionHeader-title')[0].style.display = 'none'
})();