// ==UserScript==
// @name         豆瓣小分
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  显示豆瓣评分，保留3位小数，使用折算加权平均，更准确。
// @match        https://*.douban.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460092/%E8%B1%86%E7%93%A3%E5%B0%8F%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/460092/%E8%B1%86%E7%93%A3%E5%B0%8F%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取包含总评分人数的元素
    var totalElement = document.querySelector(".rating_people span");
    // 如果元素存在，解析总评分人数
    if (totalElement) {
        var total = parseInt(totalElement.innerText);
        // 获取包含各星级评分百分比的元素
        var percentElements = document.querySelectorAll(".rating_wrap .rating_per");
        // 创建一个变量来存储加权平均评分
        var weightedRating = 0;
        // 创建一个变量来存储各星级评分人数的总和
        var sum = 0;
        // 遍历每个元素
        for (var i = 0; i < percentElements.length; i++) {
            var percentElement = percentElements[i];
            // 获取当前星级评分的百分比
            var percent = parseFloat(percentElement.innerText);
            // 计算当前星级评分的分数
            var score = (5 - i) * 2;
            // 计算当前星级评分的人数
            var count = Math.round(total * percent / 100);
            // 更新加权平均评分
            weightedRating += score * count;
            // 更新各星级评分人数的总和
            sum += count;
        }
        // 用各星级评分人数的总和来除以加权平均评分，得到更准确的结果
        weightedRating = weightedRating / sum;
        // 将加权平均评分四舍五入到三位小数
        weightedRating = weightedRating.toFixed(3);
        // 获取包含原始平均评分的元素
        var ratingElement = document.querySelector(".rating_self strong");
        // 如果元素存在，将加权平均评分用括号括起来附在原始平均评分后面
        if (ratingElement) {
            ratingElement.innerText += " (" + weightedRating + ")";
        }
    }
})();