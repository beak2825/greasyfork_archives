// ==UserScript==
// @name         魔法卡片文字版功能加强
// @author       星雨燃烧
// @namespace    None
// @version      0.15
// @description  魔法卡片文字版自动刷新,并自动取卡,在卖卡链接上自动添加确认标志一键卖出大面值卡
// @author       BloodMoshe
// @match        http://mfkp.qzapp.z.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17619/%E9%AD%94%E6%B3%95%E5%8D%A1%E7%89%87%E6%96%87%E5%AD%97%E7%89%88%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/17619/%E9%AD%94%E6%B3%95%E5%8D%A1%E7%89%87%E6%96%87%E5%AD%97%E7%89%88%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//移除魔法屋前置标识
ReMoveSE();

//移除3GQQ
ReMove3GQQ();

//存在已练成的卡片,自动取卡
GetCard();

//卖卡链接自动添加确认标识
ForceSell();


//设置自动刷新
window.setTimeout(function() { location.href="http://mfkp.qzapp.z.qq.com/qshow/cgi-bin/wl_card_mainpage"},10000);
//主程序结束

//Xpath查询函数
function xpath(query) {
    return document.evaluate(query, document, null,
                             XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

//自动取卡
function GetCard() {
    var URInodes=xpath('//a[@href]') ;
    for (var i = 0; i < URInodes.snapshotLength; i++) {
        if(URInodes.snapshotItem(i).href.indexOf("wl_card_refinedcard_get")>0)
        {
            URInodes.snapshotItem(i).click();
        }
    }
}

//卖卡链接自动添加确认标识
function ForceSell(){
    var URInodes=xpath('//a[@href]') ;
    for (var i = 0; i < URInodes.snapshotLength; i++) {

        if(URInodes.snapshotItem(i).href.indexOf("wl_card_sell")>0)
        {
            URInodes.snapshotItem(i).href+="&enforce=1";
        }
    }
}

//移除3GQQ
function ReMove3GQQ(){
    var URInodes=xpath('//a[@href]') ;
    for (var i = 0; i < URInodes.snapshotLength; i++) {
        if(URInodes.snapshotItem(i).href.indexOf("3g.qq.com")>0)
        {
            URInodes.snapshotItem(i).parentNode.removeChild(URInodes.snapshotItem(i));
        }
    }
}

//移除魔法屋前置标识
function ReMoveSE(){
    var InnerStart,InnerEnd,TempInner;
    TempInner=document.body.innerHTML;
    if (document.URL.indexOf("wl_card_mainpage")>0)
    {
        //移除前置无用信息
        InnerStart=TempInner.indexOf("我的魔法屋");
        TempInner=TempInner.substr(InnerStart,TempInner.lenth);
    }

    //移除所有页面商店后置的标识
    InnerEnd=TempInner.lastIndexOf("商店");
    if (InnerEnd>10)
    {
        document.body.innerHTML=TempInner.substr(0,InnerEnd+2);
    }
}