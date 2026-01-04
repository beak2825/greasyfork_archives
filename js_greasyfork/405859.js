// ==UserScript==
// @name                Baidu Zhidao - Remove redundant strings in answers
// @name:zh-CN          百度知道 - 移除答案中多余的字符
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.0.0
// @description         Remove redundant strings in answers, make the copy result tidy
// @description:zh-CN   移除答案中多余的字符,让复制的结果更干净
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://zhidao.baidu.com/question/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/405859/Baidu%20Zhidao%20-%20Remove%20redundant%20strings%20in%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/405859/Baidu%20Zhidao%20-%20Remove%20redundant%20strings%20in%20answers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        document.querySelectorAll('.answer-text span, .best-text span').forEach((item) => {
            if (item.textContent.match(/^\d+$/)) {
                item.parentNode.removeChild(item);
            }
        });
    }
    init();
})();
