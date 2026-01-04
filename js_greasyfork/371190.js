// ==UserScript==
// @name         知乎去广告展开所有回答
// @namespace    https://www.zhihu.com/
// @version      1.0
// @description  去除知乎广告,自动展开所有回答
// @author       老胡
// @match        https://www.zhihu.com
// @match        https://www.zhihu.com/question/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371190/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/371190/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    clearAdvert();

    if(document.URL.indexOf("https://www.zhihu.com/question/") != -1) {
        autoExpandQuestionInfo();
    }

    //自动展开问题全部信息,同时展示所有回答
    function autoExpandQuestionInfo() {
        $('.Button.QuestionRichText-more.Button--plain').click();
        var moreAnswers = $('.QuestionMainAction');
        if(moreAnswers.length > 0) {
            moreAnswers[0].click();
        }
    }

    //去除首页广告
    function clearAdvert() {
        $('.Card.Banner').remove();
    }
})();