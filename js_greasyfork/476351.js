// ==UserScript==
// @name         知乎隐藏标题
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在浏览知乎时隐藏知乎的标题
// @author       chaizz
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/476351/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/476351/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('QuestionHeader-title')[0].style.display = 'none'
})();
