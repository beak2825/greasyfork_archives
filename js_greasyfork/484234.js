// ==UserScript==
// @name         EPIC土区货币TRY转换CNY
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  把EPIC土区货币TRY转换为CNY
// @author       You
// @match        https://store.epicgames.com/*
// @icon         https://epicgames.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484234/EPIC%E5%9C%9F%E5%8C%BA%E8%B4%A7%E5%B8%81TRY%E8%BD%AC%E6%8D%A2CNY.user.js
// @updateURL https://update.greasyfork.org/scripts/484234/EPIC%E5%9C%9F%E5%8C%BA%E8%B4%A7%E5%B8%81TRY%E8%BD%AC%E6%8D%A2CNY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 汇率
const EXCHANGE_RATE = 0.2376;

// 折扣率
const DISCOUNT_RATE = 0.33;

// 转换所有包含 "TRY" 的 <span> 元素为CNY
function convertAllTRYToCNY() {
  var allSpans = document.getElementsByTagName("span");

  for (var i = 0; i < allSpans.length; i++) {
    var spanText = allSpans[i].textContent || allSpans[i].innerText;

    if (spanText.toUpperCase().includes("TRY")) {
      var matchResult = spanText.match(/(\d+(,\d{3})*(\.\d+)?|\.\d+)/);

      if (matchResult) {
        var tryAmount = parseFloat(matchResult[0].replace(/,/g, ''));
        var cnyAmount = (tryAmount * EXCHANGE_RATE).toFixed(2);

        allSpans[i].innerHTML += '<br>CNY ' + cnyAmount;
      }
    }
  }
}

// 在具有 data-testid="cart-layout-main" 的 <div> 中的 <span> 后面添加特价优惠
function applyDiscountToCart() {
  // 只有在折扣率大于 0 时才执行
  if (DISCOUNT_RATE > 0) {
    var cartDivs = document.querySelectorAll('[data-testid="cart-layout-main"]');

    cartDivs.forEach(function(cartDiv) {
      var cartSpans = cartDiv.querySelectorAll('span');

      cartSpans.forEach(function(cartSpan) {
        var spanText = cartSpan.textContent || cartSpan.innerText;

        if (spanText.includes("CNY") && !spanText.includes("特价优惠")) {
          var matchResult = spanText.match(/(\d+(\.\d+)?)/);

          if (matchResult) {
            var originalPrice = parseFloat(matchResult[0]);
            var discountedPrice = (originalPrice * (1 - DISCOUNT_RATE) * EXCHANGE_RATE).toFixed(2);

            cartSpan.innerHTML += '<br>特价优惠-'+DISCOUNT_RATE+'%: CNY ' + discountedPrice;
          }
        }
      });
    });
  }
}

      // 创建按钮
var circularButton = document.createElement("button");

// 设置按钮样式
circularButton.style.position = "fixed";
circularButton.style.top = "150px"; // 调整上边距
circularButton.style.right = "10px";
circularButton.style.width = "50px";
circularButton.style.height = "50px";
circularButton.style.borderRadius = "50%";
circularButton.style.backgroundColor = "rgb(0, 116, 228)";
circularButton.style.color = "#fff";
circularButton.style.border = "none";
circularButton.style.fontSize = "16px";
circularButton.style.zIndex = "9999";
circularButton.style.display = "flex";
circularButton.style.alignItems = "center";
circularButton.style.justifyContent = "center";
circularButton.innerHTML = "CNY";

// 定义按钮点击事件
circularButton.addEventListener("click", function() {
    // 在这里执行你的事件处理逻辑（do事件）
    convertAllTRYToCNY();
        applyDiscountToCart();
});

document.body.appendChild(circularButton);
})();