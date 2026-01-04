// ==UserScript==
// @name         常州继续教育考试查题
// @namespace    http://www.52love1.cn/
// @version      0.2
// @description  常州继续教育学习考试页面查题搜答案
// @author       G魂帅X
// @match        https://www.czpx.cn/examUserProcessServlet.do?*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423538/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E6%9F%A5%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/423538/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E6%9F%A5%E9%A2%98.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Your code here...
    // 查询网站接口页面
    var queryUrl = 'https://so.kaoshibao.com/search/question?keyword=';// 考试宝
    var queryUrl2 = 'https://www.baidu.com/s?ie=UTF-8&wd=';// 百度
    var queryUrl3 = 'https://wenku.baidu.com/search?word=';// 百度文库
    var queryUrl4 = 'https://www.shangxueba.com/ask/search.aspx?key=';// 上学吧
    // 定时器检测试卷是否初始化完成
    var timer = setInterval(function(){
        if ($('#sinItems>tr').length > 0 && $('#mulItems>tr').length > 0 && $('#judItems>tr').length > 0) {
            clearInterval(timer);
            timer = null;
            initQuery();
        }
    }, 300);

    function initQuery() {
        // 单选
        var $sin_trs = $('#sinItems>tr');
        $sin_trs.each(function(){
            var $td = $(this).find('>td.colright>table>tbody>tr>td:eq(1)');
            var str = $td.contents().filter(function(){return this.nodeType === 3;}).text();
            var $p = $td.find('>p');
            $('<a href="' + queryUrl + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #fb5b5b;color: #FFF;padding: 0 10px;border-radius: 10px;">搜答案</a>').insertBefore($p);
            $('<a href="' + queryUrl2 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #5b7dfb;color: #FFF;padding: 0 10px;border-radius: 10px;">百度</a>').insertBefore($p);
            $('<a href="' + queryUrl3 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #30a921;color: #FFF;padding: 0 10px;border-radius: 10px;">百度文库</a>').insertBefore($p);
            $('<a href="' + queryUrl4 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #16bfb7;color: #FFF;padding: 0 10px;border-radius: 10px;">上学吧</a>').insertBefore($p);
        });
        // 多选
        var $mul_trs = $('#mulItems>tr');
        $mul_trs.each(function(){
            var $td = $(this).find('>td.colright>table>tbody>tr>td:eq(1)');
            var $p = $td.find('>p');
            var str = $p.eq(0).text();
            $('<a href="' + queryUrl + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #fb5b5b;color: #FFF;padding: 0 10px;border-radius: 10px;">搜答案</a>').appendTo($p.eq(0));
            $('<a href="' + queryUrl2 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #5b7dfb;color: #FFF;padding: 0 10px;border-radius: 10px;">百度</a>').appendTo($p.eq(0));
            $('<a href="' + queryUrl3 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #30a921;color: #FFF;padding: 0 10px;border-radius: 10px;">百度文库</a>').appendTo($p.eq(0));
            $('<a href="' + queryUrl4 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #16bfb7;color: #FFF;padding: 0 10px;border-radius: 10px;">上学吧</a>').appendTo($p.eq(0));
        });
        // 判断
        var $jud_trs = $('#judItems>tr');
        $jud_trs.each(function(){
            var $td = $(this).find('>td.colright>table>tbody>tr>td:eq(1)');
            var $p = $td.find('>p');
            var str = $p.eq(0).text();
            $('<a href="' + queryUrl + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #fb5b5b;color: #FFF;padding: 0 10px;border-radius: 10px;">搜答案</a>').appendTo($p.eq(0));
            $('<a href="' + queryUrl2 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #5b7dfb;color: #FFF;padding: 0 10px;border-radius: 10px;">百度</a>').appendTo($p.eq(0));
            $('<a href="' + queryUrl3 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #30a921;color: #FFF;padding: 0 10px;border-radius: 10px;">百度文库</a>').appendTo($p.eq(0));
            $('<a href="' + queryUrl4 + str + '" target="_black" style="margin: 0 0 0 15px;text-decoration: none;background-color: #16bfb7;color: #FFF;padding: 0 10px;border-radius: 10px;">上学吧</a>').appendTo($p.eq(0));
        });
    }
})();