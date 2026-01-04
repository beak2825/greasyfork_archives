// ==UserScript==
// @name         手机知乎电脑网页优化 适合手机查看(mobile zhihu)
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  do a little thing
// @author       asutorufa
// @match        https://www.zhihu.com/question/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377756/%E6%89%8B%E6%9C%BA%E7%9F%A5%E4%B9%8E%E7%94%B5%E8%84%91%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%20%E9%80%82%E5%90%88%E6%89%8B%E6%9C%BA%E6%9F%A5%E7%9C%8B%28mobile%20zhihu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377756/%E6%89%8B%E6%9C%BA%E7%9F%A5%E4%B9%8E%E7%94%B5%E8%84%91%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%20%E9%80%82%E5%90%88%E6%89%8B%E6%9C%BA%E6%9F%A5%E7%9C%8B%28mobile%20zhihu%29.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    $(".AppHeader").remove();
    $(".QuestionHeader-follow-status").remove();
    $(".Question-sideColumn").remove();
    $(".Question-sideColumn--sticky").remove();
    $(".CornerButtons").remove();
    $("#sp-ac-container").remove();
    $(".ShareMenu").remove();

    GM_addStyle(`
.Entry-body{font-size: 16px;}
.Question-main, .Question-mainColumn{width: auto;margin: 0;padding: 0;}
.QuestionHeader, .QuestionHeader-side, .QuestionHeader-main, .QuestionHeader-footer-inner, .QuestionHeader-content, .QuestionHeader-footer{
width: auto;
padding: 0;
padding-right: 0;
padding-left: 0;
margin-bottom: 0;
min-width: 0;
justify-content: flex-start;
}
.Question-main{display: block;}
.List-item{padding: 0;}
.ContentItem-actions{margin: 0;font-size: 16px;}
.QuestionHeader{font-size: 16px;}
.QuestionHeader-footer{margin-bottom: auto;}
.Button--grey, .QuestionHeader-Comment {min-width: 60%;}
.ShareMenu-toggler{min-width: 60px;}
.QuestionHeader-title{margin-top: 0px;font-size: 16px;}
.List-header{font-size: 16px;}
//.QuestionHeader-detail{min-width: 300%}
.Button{line-height: 100%;padding: 0px;}
.Question-sideColumn, .Question-sideColumn--sticky{display:none;}
.Modal--fullPage{margin: 10%;width:auto;}
.QuestionButtonGroup, .QuestionHeaderActions{width: 30%;}
`)
})();