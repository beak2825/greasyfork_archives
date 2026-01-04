// ==UserScript==
// @name         Boss直聘+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Boss 直聘删除已沟通的用户
// @author       Kiwi
// @match        *://www.zhipin.com/chat/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/387510/Boss%E7%9B%B4%E8%81%98%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/387510/Boss%E7%9B%B4%E8%81%98%2B.meta.js
// ==/UserScript==

$.noConflict();
(($) => {
    'use strict';
    // Your code here...
    setInterval(() => {$($("iframe.frame-container")[0].contentWindow.document).find(".icon-coop").parents("div.candidateList-Content,div.candidate-card-list").remove()}, 2000);
})(jQuery);