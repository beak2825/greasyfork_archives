// ==UserScript==
// @name         奇漫屋(小黑猫)页面净化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除页面中ID为__nuxt的div
// @author       你的名字
// @match        https://www.mqzjw.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525840/%E5%A5%87%E6%BC%AB%E5%B1%8B%28%E5%B0%8F%E9%BB%91%E7%8C%AB%29%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/525840/%E5%A5%87%E6%BC%AB%E5%B1%8B%28%E5%B0%8F%E9%BB%91%E7%8C%AB%29%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll('div[style*="background-color:#fdd100"]');
    elements.forEach(function(element) {
        element.parentNode.removeChild(element);
    });


    // 获取ID为__nuxt的div元素
    var divToRemove = document.getElementById('xiazai');
    // 如果找到了该元素，则删除它
    if (divToRemove) {
        divToRemove.parentNode.removeChild(divToRemove);
    }

    var elementsToRemove = document.getElementsByClassName('next_chapter');
    // 将HTMLCollection转换为数组
    var elementsArray = Array.from(elementsToRemove);
    // 遍历数组并删除每个元素
    elementsArray.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    var divs = document.getElementsByTagName('div');
    // 遍历所有div元素
    for (var i = divs.length - 1; i >= 0; i--) {
        var div = divs[i];
        // 检查div元素的文本内容是否包含特定文本
        if (div.textContent.includes('下载APP阅读内容更流畅！')) {
            // 删除该div元素
            div.parentNode.removeChild(div);
        }

        if (div.textContent.includes('请集美集帅们去下载观看吧！')) {
            // 删除该div元素
            //console.log(div);
            div.parentNode.removeChild(div);
        }
        if (div.textContent.includes('投诉邮箱：toushu@165jm.com')) {
            // 删除该div元素
            div.parentNode.removeChild(div);
        }

    }
    var links = document.getElementsByTagName('a');
    // 遍历所有a元素
    //for (var i = links.length - 1; i >= 0; i--) {
        //var link = links[i];
        // 检查a元素的文本内容是否包含特定文本
       // if (link.textContent.includes('下载APP，免费观看1')) {
            // 删除该a元素
          //  link.parentNode.removeChild(link);
       // }
    //}
})();