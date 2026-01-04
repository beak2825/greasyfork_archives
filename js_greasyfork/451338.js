// ==UserScript==
// @name         屏蔽查看知乎答案时自动浮现的标题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  查看问题时浮现的标题很社死很烦人，故屏蔽之。
// @author       You
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451338/%E5%B1%8F%E8%94%BD%E6%9F%A5%E7%9C%8B%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E6%97%B6%E8%87%AA%E5%8A%A8%E6%B5%AE%E7%8E%B0%E7%9A%84%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451338/%E5%B1%8F%E8%94%BD%E6%9F%A5%E7%9C%8B%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E6%97%B6%E8%87%AA%E5%8A%A8%E6%B5%AE%E7%8E%B0%E7%9A%84%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.QuestionHeader-title').innerHTML='';
})();