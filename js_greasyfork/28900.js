// ==UserScript==
// @name         魔法卡片放入指定卡
// @author       星雨燃烧
// @namespace    None
// @version      0.15
// @description  魔法卡片文字版自动刷新,并自动取卡,在卖卡链接上自动添加确认标志一键卖出大面值卡
// @author       BloodMoshe
// @match        http://mfkp.qzapp.z.qq.com/qshow/cgi-bin/wl_card*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28900/%E9%AD%94%E6%B3%95%E5%8D%A1%E7%89%87%E6%94%BE%E5%85%A5%E6%8C%87%E5%AE%9A%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/28900/%E9%AD%94%E6%B3%95%E5%8D%A1%E7%89%87%E6%94%BE%E5%85%A5%E6%8C%87%E5%AE%9A%E5%8D%A1.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//移除魔法屋前置标识
ReMoveSE();

//移除3GQQ
ReMove3GQQ();

//指定卡放入保险箱
SaveCard();

//一键抽卡
RandomCard();

//主程序结束

//Xpath查询函数
function xpath(query) {
    return document.evaluate(query, document, null,
                             XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}
//指定卡放入保险箱,其余卡卖出
function SaveCard() {
    var Temp;
    var CardStart=9320;//指定卡开始编号
    var CardEnd=9328;//指定卡结束编号
    var URInodes=xpath('//a[@href]');
    
    if (URInodes.snapshotLength>=30)  //链接过多,先一键卖卡
    {
        window.setTimeout(function() { location.href="http://mfkp.qzapp.z.qq.com/qshow/cgi-bin/wl_card_sell?sid=c&all=1&enforce=1"},10);
    }
    
    for (var i = 0; i < URInodes.snapshotLength; i++) {
        if(URInodes.snapshotItem(i).href.indexOf("wl_card_move")>0)
        {
            Temp=URInodes.snapshotItem(i).href; 
            Temp=Temp.substr(Temp.indexOf("card=")+5,Temp.lenth);
            if  ((Temp>=CardStart) && (Temp <=CardEnd)) {
                URInodes.snapshotItem(i).click();
            }
        }
        if(URInodes.snapshotItem(i).href.indexOf("wl_card_sell")>0)
        {
            Temp=URInodes.snapshotItem(i).href; 
            Temp=Temp.match(/\d+/);
            if(Temp>20)
            {
                if  ((Temp < CardStart) || (Temp >CardEnd)) {
                    //alert(URInodes.snapshotItem(i).href);
                    URInodes.snapshotItem(i).href+="&enforce=1";
                    URInodes.snapshotItem(i).click();
                }
            }
        }
    }
}
//一键抽卡
function RandomCard(){
    window.setTimeout(function() { location.href="http://mfkp.qzapp.z.qq.com/qshow/cgi-bin/wl_card_random?sid=c"},1000);
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
    //alert(InnerEnd);
    if (InnerEnd>10)
    {
        document.body.innerHTML=TempInner.substr(0,InnerEnd+2);
    }
}
