// ==UserScript==
// @name         自动跳转网站外链接-狂野版
// @namespace    http://problem.pengyuyan.plus/
// @version      0.1
// @description  全网安全链接跳转提醒一刀切，凡是地址栏带外链的都进行自动跳转，所以对于类似的回调地址目前想到好的办法。若出现频繁跳转的可进行更改代码或提交反馈，将需要屏蔽的加入的排斥链接中。
// @author       假寐
// @include      *://*

// @exclude      *://accounts.google.com/*
// @exclude      *ali*

// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoFJREFUWEfFlkuoTlEUx393Qhl4jRQTz25MDAwwEOVm4l03eUxEBm5IN88JtwjllcfAgJSUCIUMEDPKozwGDCR1S5SByEAG9Nfa96779d199v7s09216/vO2Wv9f2fttdbebQzxaCuk3w68a8VXKYBHwFLgRy5ESYD5wDDgdw5EaQBpjwG+pULUASDt8cCnFIjSAPuAHhOeCryvgigBMAk4DygH5G8vcNCEZwKvYhCtAkwB1gGzgTnASBMJ/nYCR+zZXODJYBC5APNMeC0wwpw+A94CL4ETTqgbOGr/O4AHzSBSASYCx4AV5uQncM3m3UiItwEn7f0y4Fbj2hSAxSY+zWpcIOeAj1UJZu+7gDP2ezVwxdtVAewCDpuBDCX+PFHYL9tk0Hq20ZL23/sYwCXbbyWQhK+3IOxN1gMX7MFW4HQMQCEWtQw2/KewN1fl6MM09ii6zSJwH1gI3ARWFhQPrla5POhqBLgMrLEOpk5Wx+gEroYE9QBbgFPAV2AC8KsGdS++CLgXACZbt9JJplq/U4O4IqsIa8wCXvgkPAtsBra7xlGSYTdwyByqqfX1EEVguSXcbbvVlBSWL22rtldjFPDdCwhA1ymdZEtqCL2STfvuoz3gAwWgBdPdOR6LgNbNsKkT0M/hwAJnXCk+KJVzompQ3aofSFghjI2Q1EniMQB9iYQ1R5tir2XuU+AzoP8fbP5xYU4WbwYwDjjg2u9j4IbqFXgT+fQAoCM6uueNPnwjUjVIXKFWv74IPEwsiQAQlledsn1uw0J/j9vhbjKJ+niAZPGwBcetAb0GJK5w5w6fA1m2ot0PjLWb7Jcs6/7FuqSovWaPrHBle08wGHKAv7NbbvU4U1L4AAAAAElFTkSuQmCC
// @grant        none
// @note.        2021/09/18 外链安全提示跳转
// @downloadURL https://update.greasyfork.org/scripts/432588/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E7%AB%99%E5%A4%96%E9%93%BE%E6%8E%A5-%E7%8B%82%E9%87%8E%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/432588/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E7%AB%99%E5%A4%96%E9%93%BE%E6%8E%A5-%E7%8B%82%E9%87%8E%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 router param 参数
    let query = window.location.search.substring(1);
    let queryArr = query.split("&") || [];

     if(queryArr.length == 0){
         return;
     }
     queryArr.forEach(q=>{
         let value = q.split("=")[1]
         // 检验是否url
         if(checkUrl(value)){
            // 添加按钮
            appendTarget(decodeURIComponent(value))
            return
         }
     })

    // 校验是否是url
    function checkUrl(url){
        return url && url.startsWith("http")
    }

    // 添加跳转按钮并点击
    function appendTarget(url){
        let btn = document.createElement('a');
        btn.href = url;
        document.body.append(btn);
        btn.click();
    }

})();