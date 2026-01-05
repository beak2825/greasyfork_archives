// ==UserScript==
// @name        HuanXiao NO Reminder
// @name:zh-CN  欢校网 (huanxiao.cc) 隐藏无货商品
// @description 在欢校网的商品列表中隐藏无货仅可“添加到货提醒”的商品
// @namespace   https://greasyfork.org/zh-CN/users/20524
// @include     http://huanxiao.cc/mall/*
// @version     1.0
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/14032/HuanXiao%20NO%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/14032/HuanXiao%20NO%20Reminder.meta.js
// ==/UserScript==

(function hideProductsByDefault() {
  GM_addStyle('.sTitleUl li:not([data-product-available]), ul.channelAd li:not([data-product-available]) { display: none; }');
}());

var showAvailableProducts = function showAvailableProducts() {
  Array.from(document.querySelectorAll('.sTitleUl li, ul.channelAd li'))
    .forEach(li => li.querySelector('.cart[onclick^="add_reminder"]') ||
      li.setAttribute('data-product-available', ''));
};

var main = function main() {
  showAvailableProducts();
  (new MutationObserver(showAvailableProducts))
    .observe(document.body, { 'childList': true, 'subtree': true });
};

if (document.body) main();
else window.addEventListener('DOMContentLoaded', main);
