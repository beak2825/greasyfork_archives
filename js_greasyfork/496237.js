// ==UserScript==
// @name         复制退款单详情相关字段到剪切板中
// @namespace    http://gywl.net/copyRefund
// @version      1.0.9
// @description  复制退款单详情相关字段到剪切板中（订单编号、旺旺、收货地址、物流单号）
// @author       liuyj
// @include https://refund2.taobao*
// @include https://refund2.tmall*
// @include https://www.gugeerp.email:9090/afterSale/returnManage
// @include http://106.55.103.216:7002/afterSale/returnManage
// @include https://www.gugeerp.email:9090/afterSale/refundNew

// @grant GM_setClipboard
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/496237/%E5%A4%8D%E5%88%B6%E9%80%80%E6%AC%BE%E5%8D%95%E8%AF%A6%E6%83%85%E7%9B%B8%E5%85%B3%E5%AD%97%E6%AE%B5%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/496237/%E5%A4%8D%E5%88%B6%E9%80%80%E6%AC%BE%E5%8D%95%E8%AF%A6%E6%83%85%E7%9B%B8%E5%85%B3%E5%AD%97%E6%AE%B5%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wanwan="";
    var orderId="";
    var receiverAddr="";
    var expressId="";
    //const tbRefundDetailRe  = /(http|https):\/\/refund2\.*\.com\/dispute\/detail/g;
    const tbRefundDetailRe = /^https?:\/\/[^\/]+\/dispute\/detail\.htm*?/g;
    const erpReg = /\/returnManage/g;    
    //erp退货管理开始
    if(erpReg.exec(document.URL)) {        
        setInterval(async() => {
            let orderId = GM_getValue('orderId', true);
            let wanwan = GM_getValue('wanwan', true);
            let receiverAddr = GM_getValue('receiverAddr', true);
            let expressId = GM_getValue('expressId', true);
            let jsonObj;
            //从剪切板获取数据
            /**
            navigator.clipboard.readText().then(value=>{
                jsonObj=JSON.parse(value);
                wanwan=jsonObj.wanwan;
                orderId=jsonObj.orderId;
                receiverAddr=jsonObj.receiverAddr;
                expressId=jsonObj.expressId;
                console.log("jsonObj="+jsonObj);
                console.log("剪切板获取数据="+value);
            });
            */
            let text=await getClipboard();
            jsonObj=JSON.parse(text);
            wanwan=jsonObj.wanwan;
            orderId=jsonObj.orderId;
            receiverAddr=jsonObj.receiverAddr;
            expressId=jsonObj.expressId;
            console.log("jsonObj="+jsonObj);
            let value=wanwan+","+orderId;
            console.log("赋值="+value);
            if(orderId=="") return;
            //判断是否有弹窗，如果弹窗没有显示，则不继续执行，返回
            let boxWrap=document.querySelector('.el-message-box__wrapper');
            if(!boxWrap) return;
            let styleAttr=boxWrap.getAttribute('style');
            if(styleAttr.indexOf('display: none')>-1) return;//隐藏的弹窗
            var textarea = document.querySelector('.editPName_class');//采购商家名
            //采购商家名赋新值
            changInputValue(textarea,value);
            //自动点击保存
            var elementName=document.querySelector('.editPName_confirm_class');
            if(elementName){
                elementName.click();
                 //设置值到油猴存储区(清空)
                GM_setValue('orderId',"");
                GM_setValue('wanwan',"");
            }
            //退货地址赋新值
            if(receiverAddr=="") return;
            var edittextarea = document.querySelector('.editAddr_class');//退货地址
            //退货地址赋新值
            changInputValue(edittextarea,receiverAddr+",.@"+expressId);
            //自动点击保存
            var elementAddr=document.querySelector('.editAddr_confirm_class');
            if(elementAddr){
                elementAddr.click();
                GM_setValue('receiverAddr',"");
                GM_setValue('expressId',"");
            }
            //清空剪切板
            GM_setClipboard("");
            //设置值到油猴存储区(清空)
            GM_setValue('orderId',"");
            GM_setValue('wanwan',"");
            GM_setValue('receiverAddr',"");
            GM_setValue('expressId',"");
        }, 3000);
    }
    //淘宝退货详情开始
    if (tbRefundDetailRe.exec(document.URL)) {
        console.log("进入退货详情界面");
        wanwan=document.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$rightContainer_1.$nickRowWithWangwangContainer_1.$nickContainer_1.0.$nickRow4OrderDetail_1.1.$1']").textContent;
        orderId=document.querySelector(".value-options .link[href]").getAttribute('href');
        console.log("href="+orderId);
        const urls = orderId.split('=');
        orderId=urls[1];
        //收货(退货)地址
        for(let i=6;i<=14;i+= 2){
            //receiverAddr=document.querySelector("pre[data-reactid='.0.$root_1.1:$rootContainer_1.$leftContainer_1.0.$negotiationInfoItem_"+i+"@1.1.1.1']").textContent;
            let receiverElement=document.querySelector("pre[data-reactid='.0.$root_1.1:$rootContainer_1.$leftContainer_1.0.$negotiationInfoItem_"+i+"@1.1.1.1']");
            if(receiverElement){
                receiverAddr=receiverElement.textContent;
            }
            if(receiverAddr.indexOf('收货地址', 0)>-1 || receiverAddr.indexOf('退货地址', 0)>-1){//是收货地址
                break;
            }
        }
        if(receiverAddr.indexOf('收货地址', 0)<0 && receiverAddr.indexOf('退货地址', 0)<0){//商家还没确认退货地址，则receiverAddr设为空
                receiverAddr="";
        }
        let shortAddr="";
        let isTmall=true;
        if(receiverAddr.indexOf('默认退货地址')>-1){//淘宝有2种 -收货地址  --默认退货地址
            receiverAddr=receiverAddr.substring(receiverAddr.indexOf('默认退货地址')+7,receiverAddr.length);
            isTmall=false;
        }else if(receiverAddr.indexOf('收货地址')>-1){
            if(receiverAddr.indexOf('说明：')>-1){
                receiverAddr=receiverAddr.substring(receiverAddr.indexOf('收货地址')+5,receiverAddr.indexOf('说明：'));
            }else{
                receiverAddr=receiverAddr.substring(receiverAddr.indexOf('收货地址')+5,receiverAddr.length);
            }
        }
        if(receiverAddr.indexOf('退货地址')>-1 && isTmall){//天猫
            var addrArry=receiverAddr.split('\n');
            for(let i=0;i<addrArry.length;i++){
                if(addrArry[i].startsWith('退货地址')){
                    shortAddr=addrArry[i];
                    break;
                }
            }
            receiverAddr=shortAddr.replace("退货地址：","");
            console.log("addrArry="+addrArry);
            console.log("shortAddr="+shortAddr);
        }
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
        json.wanwan=wanwan;
        json.orderId=orderId;
        json.receiverAddr=receiverAddr;
        json.expressId=expressId;
        console.log("json="+JSON.stringify(json));
        console.log("wanwan="+wanwan+",orderId="+orderId+",receiverAddr="+receiverAddr+",expressId="+expressId);
        //复制值到剪切板
        //GM_setClipboard(wanwan+","+orderId);
        GM_setClipboard(JSON.stringify(json));
        //设置值到油猴存储区
        GM_setValue('orderId',orderId);
        GM_setValue('wanwan',wanwan);
        GM_setValue('receiverAddr',receiverAddr);
        GM_setValue('expressId',expressId);
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