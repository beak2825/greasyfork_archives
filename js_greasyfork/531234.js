// ==UserScript==
// @license MIT
// @name         tonybai-adb
// @name:zh-CN   tonybai去广告
// @name:zh-TW   tonybai去廣告
// @name:zh-HK   tonybai去廣告
// @name:zh-MO   tonybai去廣告
// @namespace   Violentmonkey Scripts
// @match       https://tonybai.com/*
// @grant       none
// @version     1.5
// @author      ddatsh
// @description         A script to remove tonybai ads
// @description:zh-CN   脚本用于移除tonybai广告
// @description:zh-TW   腳本用於移除 tonybai 廣告
// @description:zh-HK   腳本用於移除 tonybai 廣告
// @description:zh-MO   腳本用於移除 tonybai 廣告
// @downloadURL https://update.greasyfork.org/scripts/531234/tonybai-adb.user.js
// @updateURL https://update.greasyfork.org/scripts/531234/tonybai-adb.meta.js
// ==/UserScript==

(function() {
    `use strict`;

document.getElementById('footer').remove();
  // 获取所有的<article>元素
const articles = document.querySelectorAll('article');

articles.forEach(article => {
    // 查找<article>中所有的<hr>元素
    const hrs = article.querySelectorAll('hr');

    if (hrs.length > 0) {
        // 获取最后一个<hr>元素
        const lastHr = hrs[hrs.length - 1];

        // 从最后一个<hr>元素开始，删除到<article>结束的所有内容
        while (lastHr.nextSibling) {
            lastHr.parentNode.removeChild(lastHr.nextSibling);
        }
        // 删除最后一个<hr>元素
        lastHr.parentNode.removeChild(lastHr);
    }
});

// 获取包含section元素的父容器
var parentDiv = document.getElementById('secondary');
parentDiv.style.paddingTop = '0';

var firstWidgetSection = parentDiv.querySelector('section.widget');

// 如果找到该元素，从DOM中移除
if (firstWidgetSection) {
  firstWidgetSection.parentNode.removeChild(firstWidgetSection);
}

// 单独查找并移除具有特定ID的section元素
var sectionText4 = document.getElementById('text-4');
if (sectionText4) {
  sectionText4.parentNode.removeChild(sectionText4);
}

var sectionText3 = document.getElementById('text-3');
if (sectionText3) {
  sectionText3.parentNode.removeChild(sectionText3);
}
var wpm_subscribe_widget = document.getElementById('wpm_subscribe_widget-3');
if (sectionText3) {
  wpm_subscribe_widget.parentNode.removeChild(wpm_subscribe_widget);
}
})();