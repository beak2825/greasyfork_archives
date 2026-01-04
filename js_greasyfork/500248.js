// ==UserScript==
// @name    屏蔽b站直播的游戏和礼物元素
// @include https://live.bilibili.com/*
// @version 1.0
// @grant   none
// @license MIT
// @description 屏蔽元素
// @namespace https://greasyfork.org/users/1331571
// @downloadURL https://update.greasyfork.org/scripts/500248/%E5%B1%8F%E8%94%BDb%E7%AB%99%E7%9B%B4%E6%92%AD%E7%9A%84%E6%B8%B8%E6%88%8F%E5%92%8C%E7%A4%BC%E7%89%A9%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/500248/%E5%B1%8F%E8%94%BDb%E7%AB%99%E7%9B%B4%E6%92%AD%E7%9A%84%E6%B8%B8%E6%88%8F%E5%92%8C%E7%A4%BC%E7%89%A9%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

// ==UserScript==
// @name    屏蔽b站直播的游戏和礼物元素
// @include https://live.bilibili.com/*
// @version 1.0
// @grant   none
// @license MIT
// @description 屏蔽元素
// @namespace https://greasyfork.org/users/1331571
// @downloadURL https://update.greasyfork.org/scripts/500248/%E5%B1%8F%E8%94%BDb%E7%AB%99%E7%9B%B4%E6%92%AD%E7%9A%84%E6%B8%B8%E6%88%8F%E5%92%8C%E7%A4%BC%E7%89%A9%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/500248/%E5%B1%8F%E8%94%BDb%E7%AB%99%E7%9B%B4%E6%92%AD%E7%9A%84%E6%B8%B8%E6%88%8F%E5%92%8C%E7%A4%BC%E7%89%A9%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    var elementToHide = document.querySelector('#game-id'); // 替换为需要隐藏的元素的选择器
    if (elementToHide) {
        elementToHide.style.display = 'none';
    }
// 获取所有匹配的元素
var elements = document.querySelectorAll('.gift-panel.base-panel.live-skin-coloration-area.gift-corner-mark-ui');

// 遍历并删除每个元素
elements.forEach(function(element) {
    element.parentNode.removeChild(element);
});


})();

