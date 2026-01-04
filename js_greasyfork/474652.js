// ==UserScript==
// @name         [千醉的自用脚本]爱恋动漫BT下载去除部分（带大图的）黄油小广告，别的没去除，问就是懒，经常不更新
// @namespace    https://space.bilibili.com/73801726
// @version      0.5
// @description  爱恋动漫BT下载去除部分（带大图的）黄油小广告，别的没去除，问就是懒，经常不更新
// @author       千醉
// @license      本脚本仅供开发者自己使用，任何人不得转发本脚本，产生的于一切法律后果自负
// @match        https://www.kisssub.org/*
// @match        http://www.kisssub.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kisssub.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474652/%5B%E5%8D%83%E9%86%89%E7%9A%84%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC%5D%E7%88%B1%E6%81%8B%E5%8A%A8%E6%BC%ABBT%E4%B8%8B%E8%BD%BD%E5%8E%BB%E9%99%A4%E9%83%A8%E5%88%86%EF%BC%88%E5%B8%A6%E5%A4%A7%E5%9B%BE%E7%9A%84%EF%BC%89%E9%BB%84%E6%B2%B9%E5%B0%8F%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%88%AB%E7%9A%84%E6%B2%A1%E5%8E%BB%E9%99%A4%EF%BC%8C%E9%97%AE%E5%B0%B1%E6%98%AF%E6%87%92%EF%BC%8C%E7%BB%8F%E5%B8%B8%E4%B8%8D%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/474652/%5B%E5%8D%83%E9%86%89%E7%9A%84%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC%5D%E7%88%B1%E6%81%8B%E5%8A%A8%E6%BC%ABBT%E4%B8%8B%E8%BD%BD%E5%8E%BB%E9%99%A4%E9%83%A8%E5%88%86%EF%BC%88%E5%B8%A6%E5%A4%A7%E5%9B%BE%E7%9A%84%EF%BC%89%E9%BB%84%E6%B2%B9%E5%B0%8F%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%88%AB%E7%9A%84%E6%B2%A1%E5%8E%BB%E9%99%A4%EF%BC%8C%E9%97%AE%E5%B0%B1%E6%98%AF%E6%87%92%EF%BC%8C%E7%BB%8F%E5%B8%B8%E4%B8%8D%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取要删除的HTML标签
//    var tagToRemove = document.querySelector('div.gg_canvas.gg_canvas-hidden');

//    if (tagToRemove) {
        // 删除标签
//        tagToRemove.remove();
//    }
//    var tagToRemove2 = document.querySelector('div.gg_canvas.gg_canvas-hidden.gg_model1-container2');//div.gg_canvas.gg_canvas-hidden.gg_model1-container2

//    if (tagToRemove2) {
        // 删除标签
//        tagToRemove2.remove();
//    }


    // Define the class name of the divs you want to remove
    var targetClassName = "gg_canvas gg_canvas-hidden";

    // Get all div elements with the specified class name
    var divsToRemove = document.getElementsByClassName(targetClassName);

    // Loop through the divs and remove them one by one
    for (var i = 0; i < divsToRemove.length; i++) {
        var div = divsToRemove[i];
        div.parentNode.removeChild(div);
    }



    var tagToRemove0 = document.querySelector('div.gg_canvas.gg_canvas-hidden.gg_model1-container2');//div.gg_canvas.gg_canvas-hidden.gg_model1-container2

    if (tagToRemove0) {
        // 删除标签
        tagToRemove0.remove();
    }
    var tagToRemove = document.querySelector('div.gg_canvas.gg_canvas-hidden');

    if (tagToRemove) {
        // 删除标签
        tagToRemove.remove();
    }
    var tagToRemove1 = document.querySelector('div.gg_canvas.gg_canvas-hidden');

    if (tagToRemove1) {
        // 删除标签
        tagToRemove1.remove();
    }
    //详情页标签
    // 删除左2广告
    var tagToRemove2 = document.querySelector('div.c1>div+div');
    if (tagToRemove2) {
        tagToRemove2.remove();
    }
    // 删除左3广告
    var tagToRemove3 = document.querySelector('div.c1>div+div');
    if (tagToRemove3) {
        tagToRemove3.remove();
    }
    // 删除左5广告
    var tagToRemove4 = document.querySelector('div.c1>div+div+div');
    if (tagToRemove4) {
        tagToRemove4.remove();
    }
    // 删除详情栏和标签栏中间的广告
    var tagToRemove5 = document.querySelector('div.c2>div.clear');
    if (tagToRemove5) {
        tagToRemove5.remove();
    }






})();