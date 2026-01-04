// ==UserScript==
// @name         [IGPSPORT/迹驰] 轨迹地图放大
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       想努力的蜗牛
// @description  修改页面的宽度为浏览器宽度的96%，地图高度为浏览器高度的80%,并自动放大两级地图,禁用地图扩展按钮
// @match        https://my.igpsport.com/profile/activity/*
// @icon         http://kodo.codersnail.top/note/avator.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507915/%5BIGPSPORT%E8%BF%B9%E9%A9%B0%5D%20%E8%BD%A8%E8%BF%B9%E5%9C%B0%E5%9B%BE%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/507915/%5BIGPSPORT%E8%BF%B9%E9%A9%B0%5D%20%E8%BD%A8%E8%BF%B9%E5%9C%B0%E5%9B%BE%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改页面宽度为浏览器宽度的 96%
    var divElement = document.evaluate('/html/body/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (divElement) {
        divElement.style.width = '96vw'; // 90% of the viewport width
    }

    // 修改地图高度为浏览器高度的 80%
    var mapElement = document.evaluate('//*[@id="map"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (mapElement) {
        mapElement.style.height = '80vh'; // 80% of the viewport height
    }

    // 点击下方曲线图的位置按钮,重置曲线图的宽度
    var labelElement = document.evaluate('//label[contains(@class, "distance")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (labelElement) {
        labelElement.click(); // 模拟点击操作
    } else {
        console.log('element not found.');
    }

    // 两次点击地图缩放按钮放大两级
    var zoom = document.evaluate('//div[contains(@class, "amap-zoom-plus")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (zoom) {
        zoom.click(); // 模拟点击操作
        zoom.click(); // 模拟点击操作
    } else {
        console.log('element not found.');
    }


    // 禁用地图扩展按钮的js事件
    var iElement = document.evaluate("//i[contains(@class, 'fa-expand')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (iElement) {
        // 获取 <i> 标签的父级 <a> 标签
        var aElement = iElement.closest('a');
        aElement.removeAttribute('href');
    } else {
        console.log("未找到符合条件的 <i> 标签");
    }

})();
