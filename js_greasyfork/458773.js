// ==UserScript==
// @name         香书小说网去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉性感的广告
// @author       HooHeHa
// @match        https://wap.ibiquge.la/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458773/%E9%A6%99%E4%B9%A6%E5%B0%8F%E8%AF%B4%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458773/%E9%A6%99%E4%B9%A6%E5%B0%8F%E8%AF%B4%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //获取所有：有id属性的div标签
    let olddivList = document.querySelectorAll("div[id]");
    console.log(olddivList[1].innerText);
    //判断书籍页是否有广告
    if(!olddivList[3])return;


    let divList;
    //判断是否是书籍页或阅读页
    if(olddivList[1].innerText=="关灯"){
        //取出要屏蔽的div标签，放进新的数组里面
        divList =[olddivList[6],olddivList[9],olddivList[10]];
        console.log(divList);
    }else{
        divList=[olddivList[1]];
    }
    //循环要屏蔽的div标签数组
    divList.forEach(function(currentValue){
        //将div隐藏
        currentValue.style.display="none";
    })
    //头部缩进
    document.querySelector("body").style.marginTop="-120px";
    // Your code here...
})();