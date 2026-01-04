// ==UserScript==
// @name         京东转单系统复制单号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快捷复制KK单号和JDKA单号
// @author       You
// @match        http://120.133.139.113:8350/*
// @icon         https://icons.duckduckgo.com/ip2/139.113.ico
// @grant    GM_registerMenuCommand
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/462886/%E4%BA%AC%E4%B8%9C%E8%BD%AC%E5%8D%95%E7%B3%BB%E7%BB%9F%E5%A4%8D%E5%88%B6%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/462886/%E4%BA%AC%E4%B8%9C%E8%BD%AC%E5%8D%95%E7%B3%BB%E7%BB%9F%E5%A4%8D%E5%88%B6%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand("复制快递单号",function(){
        copyNumber();
    });
    // Your code here...
    function copyNumber(){
        let innerDoc = document.querySelector("iframe").contentWindow.document;
        let rows = innerDoc.querySelectorAll("tr.mini-grid-row-selected");
        console.log("订单数："+rows.length);
        if (rows.length>0){
            console.log("here"+rows.length);
            let result = "";
            for (let i =0;i<rows.length;i++){
                result += `${innerDoc.querySelector(`#\\3${i+1}\\$cell\\$4`).innerText}\t${innerDoc.querySelector(`#\\3${i+1}\\$cell\\$5`).innerText}\n`;
            }
            console.log("result："+result);
            GM_setClipboard(result);
            alert("复制成功");
        }else{
            alert("没有/未选中订单");
        }
    }
})();