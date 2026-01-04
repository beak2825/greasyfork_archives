// ==UserScript==
// @name         acfun直播艾米莉专用版
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  安装前请注意：进入小镇后，礼物会自动转换成等额狗粮，没有背景图！离开小镇会恢复正常，此脚本仅在艾米莉直播间生效,【现在为测试版，现在为测试版，现在为测试版】
// @author       乌贼·tentacles
// @homepage     https://www.acfun.cn/u/205408
// @match        https://live.acfun.cn/live/40656720
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442095/acfun%E7%9B%B4%E6%92%AD%E8%89%BE%E7%B1%B3%E8%8E%89%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/442095/acfun%E7%9B%B4%E6%92%AD%E8%89%BE%E7%B1%B3%E8%8E%89%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

//专属配置 40656720
var config={
    logo:"https://tx-free-imgs.acfun.cn/newUpload/205408_fb03682076af4fbe97f994a9981ebfc2.png.png",
    bgUrl:"https://tx-free-imgs2.acfun.cn/kimg/EC4qPgoFYWNmdW4SBWltYWdlGi42MjA4Njc2NV9mMzE0NzEzZWFlMTY0ZjE0YWJhODY1YmE4YzllMTQ0Yy5qcGVn.webp",
    orgLogo:""
};
if(config.bgUrl.indexOf('acfun') != -1){
    var css=".MossBtn{display: block;position: absolute;padding: 4px 8px;color: black;border-radius: 4px;font-size: 10px;cursor: pointer;top:0;background:white;margin:4px} .fou{background:black;color:white }.headD{display:none !important} .wrapper:before{background-image: url("+config.bgUrl+")!important ";
    GM_addStyle(css);
    console.log("css");
}

let div2 = document.createElement("div");//专属按钮
div2.append("进入MOSS");
div2.classList.add("MossBtn");
var isMode = false;

let hd = document.getElementById("header");//
let wp = document.getElementsByClassName("player-outer-wrapper outer-wrapper")[0];

document.getElementsByClassName('main')[0].append(div2);

//艾米莉专属版（狗粮特化版
var Emily = function(){
    div2.classList.toggle("fou");
    //hd.classList.toggle("headD");
    wp.classList.toggle("wrapper");
    isMode = !isMode;
    if(isMode){
        console.log("moss mode");
        document.getElementsByClassName('logo')[0].getElementsByTagName('img')[0].setAttribute('src',config.logo);
        div2.innerHTML="离开MOSS";
        EmilyGift();

    }else{
     console.log("mode out");
        div2.innerHTML="进入MOSS";
        document.getElementsByClassName('logo')[0].getElementsByTagName('img')[0].setAttribute('src',config.orgLogo);
        ResetGift();
    }
}

var EmilyGift = function(){
 var acbi = document.getElementsByClassName('item-gift');
    for(var i = 1;i<acbi.length;i++){
        var item = acbi[i];
        var pri = item.getAttribute('data-gift-price');
        var pid = item.getAttribute('data-gift-id');
        item.setAttribute('data-total-price',1);//礼物价格
        item.setAttribute('data-gift-id',34);//狗粮ID
        item.setAttribute('data-batch-size',pri);
        item.setAttribute('data-org-id',pid);
        //item.setAttribute('data-gift-price',1);
    }
}

var ResetGift = function(){
    var acbi = document.getElementsByClassName('item-gift');
    for(var i = 1;i<acbi.length;i++){
        var item = acbi[i];
        var pri = item.getAttribute('data-batch-size');
        var pid = item.getAttribute('data-org-id');
        item.setAttribute('data-total-price',pri);//礼物价格
        item.setAttribute('data-gift-id',pid);//ID
        item.setAttribute('data-batch-size',1);
    }
}

var ChangeCss = function(){
    document.getElementsByClassName('logo')[0].getElementsByTagName('img')[0].setAttribute('src',config.logo);
}

//初始化
let Init = function(){
    div2.addEventListener("click", Emily, false);
    config.orgLogo = document.getElementsByClassName('logo')[0].getElementsByTagName('img')[0].getAttribute('src');
}
Init();