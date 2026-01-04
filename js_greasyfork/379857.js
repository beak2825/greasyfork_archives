// ==UserScript==
// @name         菜鸟果果兑换奖品 By Tony
// @namespace    http://www.abmbio.xin/
// @version      1.0
// @description  菜鸟果果兑换奖品助手
// @author       Tony
// @match        https://page.cainiao.com/mcn/queenDay/index.html?__webview_options__=fullScreen%3DYES&ttid=201200@cainiao_iphone_5.2.0
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/379857/%E8%8F%9C%E9%B8%9F%E6%9E%9C%E6%9E%9C%E5%85%91%E6%8D%A2%E5%A5%96%E5%93%81%20By%20Tony.user.js
// @updateURL https://update.greasyfork.org/scripts/379857/%E8%8F%9C%E9%B8%9F%E6%9E%9C%E6%9E%9C%E5%85%91%E6%8D%A2%E5%A5%96%E5%93%81%20By%20Tony.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dotimer = setInterval(function(){
        if(document.readyState == 'complete'){
            console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
            console.log("%c  温馨提示    %c","background:#f26522; color:#ffffff","","页面加载完毕");

            dothat();
            clearInterval(dotimer);
        }else{
            console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","等待网页加载完全。。。");
        }
    },100);

    function dothat(){
        var canbyObj = document.getElementsByClassName('skbtn___1oiau');
        var canbuyNum = document.getElementsByClassName('skbtn___1oiau').length;
        if(canbuyNum){
            for(var k=0;k<50;k++){
                for(var i=0;i<canbuyNum;i++){
                    canbyObj[i].click();
                }
                console.log('自动兑换第'+k+'次');
            }

        }else{
            console.log('没有可兑换的');
            location.reload();

        }
    }

})();