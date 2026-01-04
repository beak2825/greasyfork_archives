// ==UserScript==
// @name         隐藏知乎标题
// @namespace    http://tampermonkey.net/
// @version      2024-11-05
// @description  摸鱼看知乎时，不想让别人看到自己正在看的知乎问题
// @author       Dingning
// @license      MIT
// @include      *://*.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523254/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/523254/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const titleDom = document.querySelector('.QuestionHeader-title')
    if (titleDom) {
        document.querySelector('.QuestionHeader-title').innerText = ''
    }
})();