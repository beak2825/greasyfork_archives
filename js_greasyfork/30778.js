// ==UserScript==
// @name         ico helper
// @namespace    https://nailuogg.me
// @version      0.1.1
// @description  try to take over the world!
// @author       nailuoGG
// @match        https://tampermonkey.net/faq.php?version=4.3.6&ext=dhdg
// @include      http*://btc9.com/*
// @include      http*://www.btc9.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30778/ico%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30778/ico%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var priceTable = $(".project-list table tbody");
    var firstLineElement = $("<tr> <td>状态</td> <td>名字</td> <td>报价</td><td>数量</td><td>进度</td> <td>操作</td> </tr>");
    var trList = $("div.project-list > table > tbody > tr");
    firstLineElement.insertBefore(".project-list table tbody tr:first-child");
    function addTicketNumber(){
        trList.each(function(){
            var target =  $(this).find('a.ajax-dialog');
            var that = $(this);
            var url = target.data("url");
            getData(url,that);
        });
    }
    function getData(url,that){
        $.get(url,function(data){
            var num = $(data).find('#max_num').val();
            if(num){
                  $("<td>共"+num+"个</td>").insertAfter(that.find("td:nth-child(3)"));
            }else{
                 $("<td>无法查询</td>").insertAfter(that.find("td:nth-child(3)"));
            }
        });
    }
    addTicketNumber();
})();