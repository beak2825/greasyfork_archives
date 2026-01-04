// ==UserScript==
// @name         复制退款单详情相关字段(物流单号)到剪切板中
// @namespace    http://gywl.net/copyRefundExpressId
// @version      1.0.0
// @description  复制退款单详情相关字段到剪切板中（物流单号）
// @author       liuyj
// @include https://refund2.taobao*
// @include https://refund2.tmall*
// @include https://www.gugeerp.email:9090/afterSale/returnManage
// @include http://106.55.103.216:7002/afterSale/returnManage
// @include https://www.gugeerp.email:9090/afterSale/refundNew

// @grant GM_setClipboard
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/504349/%E5%A4%8D%E5%88%B6%E9%80%80%E6%AC%BE%E5%8D%95%E8%AF%A6%E6%83%85%E7%9B%B8%E5%85%B3%E5%AD%97%E6%AE%B5%28%E7%89%A9%E6%B5%81%E5%8D%95%E5%8F%B7%29%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/504349/%E5%A4%8D%E5%88%B6%E9%80%80%E6%AC%BE%E5%8D%95%E8%AF%A6%E6%83%85%E7%9B%B8%E5%85%B3%E5%AD%97%E6%AE%B5%28%E7%89%A9%E6%B5%81%E5%8D%95%E5%8F%B7%29%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var expressId="";
    //const tbRefundDetailRe  = /(http|https):\/\/refund2\.*\.com\/dispute\/detail/g;
    const tbRefundDetailRe = /^https?:\/\/[^\/]+\/dispute\/detail\.htm*?/g;

    //淘宝退货详情开始
    if (tbRefundDetailRe.exec(document.URL)) {
        console.log("进入退货详情界面");
        //物流单号
        for(let i=6;i<=12;i+= 2){
            //expressId=document.querySelector("pre[data-reactid='.0.$root_1.1:$rootContainer_1.$leftContainer_1.0.$negotiationInfoItem_"+i+"@1.1.1.1']").textContent;
            let expressIdElement=document.querySelector("pre[data-reactid='.0.$root_1.1:$rootContainer_1.$leftContainer_1.0.$negotiationInfoItem_"+i+"@1.1.1.1']");
            if(expressIdElement){
                expressId=expressIdElement.textContent;
            }
            if(expressId.indexOf('退货单号', 0)>-1 || expressId.indexOf('物流单号', 0)>-1){//是物流单号
                break;
            }
        }
        if(expressId.indexOf('退货单号', 0)>-1){//天猫
            let addrs=expressId.split('：');
            let addr=addrs[2];
            expressId=addr.replace("退货说明","");
        }else if(expressId.indexOf('物流单号', 0)>-1){//淘宝-物流单号
            let addrs=expressId.split('，');
            expressId=addrs[1].substring(addrs[1].indexOf('：')+1,addrs[1].length);
        }else{
            expressId="";
        }
        let json={};
        json.expressId=expressId;
        console.log("json="+JSON.stringify(json));
        console.log("expressId="+expressId);
        //复制值到剪切板
        GM_setClipboard(expressId);

    }





    // Your code here...
})();

//改变vue之类控件输入框的值
function changInputValue(inputDom,newText){
    if(inputDom==null) return;
    let lastValue = inputDom.value;
    inputDom.value = newText;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    inputDom.dispatchEvent(event);
}

async function getClipboard(){
     let text=navigator.clipboard.readText();
    console.log("getClipboard="+text);
    return text;
}