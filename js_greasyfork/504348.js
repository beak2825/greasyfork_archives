// ==UserScript==
// @name         复制退款单详情字段(订单编号、旺旺、退款编号)到剪切板中
// @namespace    http://gywl.net/copyRefundOrder
// @version      1.0.2
// @description  复制退款单详情相关字段到剪切板中（订单编号、旺旺、退款编号）
// @author       liuyj
// @include https://refund2.taobao*
// @include https://refund2.tmall*
// @include https://www.gugeerp.email:9090/afterSale/returnManage
// @include http://106.55.103.216:7002/afterSale/returnManage
// @include https://www.gugeerp.email:9090/afterSale/refundNew

// @grant GM_setClipboard
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/504348/%E5%A4%8D%E5%88%B6%E9%80%80%E6%AC%BE%E5%8D%95%E8%AF%A6%E6%83%85%E5%AD%97%E6%AE%B5%28%E8%AE%A2%E5%8D%95%E7%BC%96%E5%8F%B7%E3%80%81%E6%97%BA%E6%97%BA%E3%80%81%E9%80%80%E6%AC%BE%E7%BC%96%E5%8F%B7%29%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/504348/%E5%A4%8D%E5%88%B6%E9%80%80%E6%AC%BE%E5%8D%95%E8%AF%A6%E6%83%85%E5%AD%97%E6%AE%B5%28%E8%AE%A2%E5%8D%95%E7%BC%96%E5%8F%B7%E3%80%81%E6%97%BA%E6%97%BA%E3%80%81%E9%80%80%E6%AC%BE%E7%BC%96%E5%8F%B7%29%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wanwan="";
    var orderId="";
    var disputeId="";
    //const tbRefundDetailRe  = /(http|https):\/\/refund2\.*\.com\/dispute\/detail/g;
    const tbRefundDetailRe = /^https?:\/\/[^\/]+\/dispute\/detail\.htm*?/g;

    //淘宝退货详情开始
    if (tbRefundDetailRe.exec(document.URL)) {
        console.log("进入退货详情界面");
        wanwan=document.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$rightContainer_1.$nickRowWithWangwangContainer_1.$nickContainer_1.0.$nickRow4OrderDetail_1.1.$1']").textContent;
        orderId=document.querySelector(".value-options .link[href]").getAttribute('href');
        console.log("href="+orderId);
        const urls = orderId.split('=');
        orderId=urls[1];
        //退款单号
        for(var i=16;i<=26;i+= 2){
            let element=document.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$rightContainer_1.$refundDetailRows_"+i+"@2.1.$1']");
            if(element){
                disputeId=element.textContent;
                console.log("for disputeId="+disputeId);
                if(disputeId.length==18) break;
            }
        }
        //let params=document.URL.split('&');
        //disputeId=params[1].replace('disputeId=','');
        console.log("disputeId="+disputeId);

        let json={};
        json.wanwan=wanwan;
        json.orderId=orderId;
        console.log("json="+JSON.stringify(json));
        console.log("wanwan="+wanwan+",orderId="+orderId+",disputeId="+disputeId);
        //复制值到剪切板
        GM_setClipboard(wanwan+","+orderId+","+disputeId);
        //GM_setClipboard(JSON.stringify(json));
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