// ==UserScript==
// @name         ACGN測試機-保管庫自動投資腳本
// @namespace    http://tampermonkey.net/
// @version      1.00.0005
// @description  姉様♪
// @author       sup初音姐姐
// @match        https://test.acgn-stock.com/companyArchive/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35637/ACGN%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E4%BF%9D%E7%AE%A1%E5%BA%AB%E8%87%AA%E5%8B%95%E6%8A%95%E8%B3%87%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/35637/ACGN%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E4%BF%9D%E7%AE%A1%E5%BA%AB%E8%87%AA%E5%8B%95%E6%8A%95%E8%B3%87%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

/*
    ver1.00.0000 啟用
    ver1.00.0001 轉跳下一頁、未找到element時會自動重新嘗試
    ver1.00.0002 避開已投資過的公司
    ver1.00.0003 改寫判斷undefined的寫法(?)
    ver1.00.0004 改寫判斷undefined的寫法，修正錯誤...，嘗試過多次後自動停止嘗試(但不通知)
    ver1.00.0005 考慮「原本4/5，投完後公司消失」的情況，並會在投資失敗時自動嘗試
*/

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    var page = parseInt(url.substring(url.indexOf('companyArchive/')+'companyArchive/'.length));
    setTimeout(function()
    {
        invest(0, function(){window.location = 'https://test.acgn-stock.com/companyArchive/'+(page+1);});
    }, 2390);
})();

var companyPerPage = 12;
var retryTime = 0;
var maxRetryTime = 12;
var invest = function(index, callback)
{
    //end
    if(index==companyPerPage)
    {
        if(callback !== undefined) callback();
        return;
    }
    //check if have invested
    var divCards = document.getElementsByClassName("col-12 col-md-6 col-lg-4 col-xl-3");
    if(divCards.length<=index)
    {
        retryTime++;
        if(retryTime>maxRetryTime)
        {
            console.log('retry too many times');
            return; //retry too many time->end
        }
        setTimeout(function(){invest(index, callback);}, 239);
        return;
    }
    retryTime = 0;
    if(divCards[index].innerHTML.indexOf('company-card company-card-default')==-1)
    {
        invest(index+1, callback);
        return;
    }
    //click, invest
    document.getElementsByClassName("btn btn-tab btn-block")[index].click();
    //click, confirm
    setTimeout(function()
    {
        var vs = document.getElementsByClassName("btn btn-primary");
        vs[vs.length-1].click();
        setTimeout(function(){invest(index, callback);}, 1750);
    }, 495);
};