// ==UserScript==
// @name         巴哈姆特寶拉標題自動劃線提醒 腳本
// @namespace    http://your-namespace.com
// @version      1.0
// @description  自動劃線特定文字
// @author       Your Name
// @match        https://*.forum.gamer.com.tw/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474646/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%AF%B6%E6%8B%89%E6%A8%99%E9%A1%8C%E8%87%AA%E5%8B%95%E5%8A%83%E7%B7%9A%E6%8F%90%E9%86%92%20%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474646/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%AF%B6%E6%8B%89%E6%A8%99%E9%A1%8C%E8%87%AA%E5%8B%95%E5%8A%83%E7%B7%9A%E6%8F%90%E9%86%92%20%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 在這裡設定要檢查的文字
    var targetText = "寶拉";

    // 獲取所有具有 class "b-list__main__title" 的元素
    var titleElements = document.querySelectorAll(".b-list__main__title");

    // 遍歷所有這些元素，檢查是否包含目標文字，並設置橫線效果和紅色字體
    for (var i = 0; i < titleElements.length; i++) {
        var titleText = titleElements[i].innerText;
        if (titleText.includes(targetText)) {
            // 將目標文字設置為紅色
            titleText = titleText.replace(targetText, '<span style="color: red;">' + targetText + '</span>');
            titleElements[i].innerHTML = titleText;
            // 設置橫線效果
            titleElements[i].style.setProperty("text-decoration", "line-through");
        }
    }
})();