// ==UserScript==
// @name         remove the zhihu title
// @namespace    https://github.com/woodongwong/
// @version      0.1
// @description  将知乎的醒目标题移除掉！
// @author       woodong wong
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34868/remove%20the%20zhihu%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/34868/remove%20the%20zhihu%20title.meta.js
// ==/UserScript==

(function() {
    var pageHeader = window.document.getElementsByClassName('PageHeader');
    if (pageHeader.length > 0) {
         pageHeader[0].getElementsByClassName('QuestionHeader-title')[0].innerHTML = '';
    }
})();