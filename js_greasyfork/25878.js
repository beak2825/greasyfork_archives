// ==UserScript==
// @name        前程无忧薪资统计原始数据生成
// @author      Sean@FindiX
// @description 生成统计用的前程无忧薪资原始数据，需配合统计脚本使用
// @license     MIT
// @encoding    utf-8
// @date        21/12/2016
// @modified    04/04/2017
// @include     *://search.51job.com/jobsearch/search_result.php*
// @include     *://search.51job.com/list/*
// @grant       GM_setClipboard
// @run-at      document-end
// @version     0.0.2
// @namespace   https://greasyfork.org/users/88522
// @downloadURL https://update.greasyfork.org/scripts/25878/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E8%96%AA%E8%B5%84%E7%BB%9F%E8%AE%A1%E5%8E%9F%E5%A7%8B%E6%95%B0%E6%8D%AE%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/25878/%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E8%96%AA%E8%B5%84%E7%BB%9F%E8%AE%A1%E5%8E%9F%E5%A7%8B%E6%95%B0%E6%8D%AE%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var div = $(document.createElement("div"));
    var p = $(document.createElement("p"));
    var button = $(document.createElement("button"));

    button.text("Copy");
    button.click(function(){
        GM_setClipboard(p.html().replace(/<br>/g,"\n"));
    });

    div.css({
        position:"absolute",
        left:"20px",
        top:"100px",
    });

    $("#resultList > .el:not(.title)").each(function(i,e){
        var element = "";
        element+=($(e).find(".t1 a").text().replace(/^\s+|\s+$/g,"")+"<br>");
        element+=($(e).find(".t3").text()+"<br>");
        element+=(formatSalary($(e).find(".t4").text())+"<br>");
        element+=($(e).find(".t5").text()+"<br>");
        element+=("<br>");
        p.append(element);
    });
    button.appendTo(div);
    p.appendTo(div);
    div.appendTo($("body"));

    function formatSalary(salaryText){
        return salaryText;
    }
})();