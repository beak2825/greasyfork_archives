// ==UserScript==
// @name         Steam Bug-buy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Steam Cloudsave for store webpage.
// @description:zh-cn Steam 商店页面添加快速临时工结账按钮
// @description:zh-tw Steam 商店頁面添加快速臨時工結帳按鈕
// @author       WK
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519772/Steam%20Bug-buy.user.js
// @updateURL https://update.greasyfork.org/scripts/519772/Steam%20Bug-buy.meta.js
// ==/UserScript==

// How to use: 1.Add your games to the cart. 2.Press "Bug-buy" button. 3.Go to the cart and pay.
// 使用方法：1.添加你的游戏到购物车 2.点击“临时工”按钮 3.前往购物车付款
// 使用方法：1.添加你的遊戲到購物車 2.點擊“臨時工”按鈕 3.前往購物車付款

(function() {
  function prepend(element,id) {
      var firstChild = document.body.firstChild;
      document.getElementById(id).insertBefore(element, document.getElementById(id).children[0]);
  }

var url = location.href;
var match = url.match(/app\/(\d+)\//);

if (match) {
  var appId = match[1];
  console.log(appId);
}

function getBrowserLanguage() {
  let language = navigator.language || navigator.userLanguage;
  if (!language) {
    language = 'en-US';
  }
  return language;
}

const language = getBrowserLanguage();

var text = "💵 Bug-buy";
    if(language=="zh-CN"){
        text = "💵 临时工";
    }else if(language=="zh-TW"){
        text = "💵 臨時工";
    }

var element = document.createElement("div");

element.innerHTML = '<a href="javascript:addToCart(150442);" class="btnv6_blue_hoverfade btn_medium es_app_btn" target="_self"><span>'+text+'</span></a>';

prepend(element,"shareEmbedRow");

var element2 = document.createElement("div");

element2.innerHTML = '<div class="store_header_btn_gray store_header_btn"><div class="store_header_btn_caps store_header_btn_leftcap"></div><div class="store_header_btn_caps store_header_btn_rightcap"></div><a id="bug_buy_btn" class="store_header_btn_content" href="javascript:addToCart(150442);" target="_self">'+text+'</a></div>';

prepend(element2,"cart_status_data");

})();