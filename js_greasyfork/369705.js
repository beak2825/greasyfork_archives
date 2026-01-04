// ==UserScript==
// @name         移除知乎跟随标题，展示所有回答！
// @description  remove zhihu title, unfold all the answers
// @version      1.0
// @author       TM
// @match        https://www.zhihu.com/question/*

// @namespace https://greasyfork.org/users/192511
// @downloadURL https://update.greasyfork.org/scripts/369705/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%B7%9F%E9%9A%8F%E6%A0%87%E9%A2%98%EF%BC%8C%E5%B1%95%E7%A4%BA%E6%89%80%E6%9C%89%E5%9B%9E%E7%AD%94%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/369705/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%B7%9F%E9%9A%8F%E6%A0%87%E9%A2%98%EF%BC%8C%E5%B1%95%E7%A4%BA%E6%89%80%E6%9C%89%E5%9B%9E%E7%AD%94%EF%BC%81.meta.js
// ==/UserScript==

(
    function() {
    var pageHeader = window.document.getElementsByClassName('PageHeader');
    if (pageHeader.length > 0) {
         pageHeader[0].getElementsByClassName('QuestionHeader-title')[0].innerHTML = '';
    }
    var isall=document.querySelector(".QuestionMainAction");
    if(isall){
        isall.click();
    }
}

)();