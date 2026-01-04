// ==UserScript==
// @name         奥鹏在线作业助手
// @namespace    https://github.com/ousui/
// @version      0.1
// @description  在题目后面生成搜索按钮，方便的使用 baidu 等搜索引擎搜索答案
// @author       shuai.w
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377901/%E5%A5%A5%E9%B9%8F%E5%9C%A8%E7%BA%BF%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377901/%E5%A5%A5%E9%B9%8F%E5%9C%A8%E7%BA%BF%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 页面执行完执行
    var check = setInterval(init, 250);

    function init() {
        if ($ == null) {return};
        requestMonitoring();
        setTimeout(function(){document.oncontextmenu = null;}, 3000);
        clearInterval(check);
    }

    function requestMonitoring() {
        $(document).ajaxComplete(
            function(event, xhr, settings) {

                if (settings.url.indexOf('OnlineJob/DoHomework') <= 0) {
                    return;
                }
                $('.qestitle').each(function(i, e){
                    var question = $(e).text();
                    var equestion = encodeURIComponent(question);
                    var td = $(e).attr('style', '');
                    td.parent().prepend('<td><a href="http://www.baidu.com/s?wd='+ question +'" target="_blank">Q</a></td>');
                    var height = td.height();

                    td.html('<textarea readonly style="width: 100%; border:0; font-weight:400;">'+question+'</textarea>').find('textarea').height(height);
                    // 太丑
                    // var squestion = question.replace(' ）', ' ').replace('（', '').replace('。', '');
                    // td.parent().parent().append('<tr><td colspan="3"><input style="width: 100%; height:20px; font-size: 14px;font-weight:100;" value="' + squestion + '" /></td></tr>');
                });
            }
        );
    }
})();