// ==UserScript==
// @name        Weibo No Ad
// @namespace   Violentmonkey Scripts
// @match       *://m.weibo.cn/*
// @grant       none
// @version     0.01
// @author      T4Tea
// @description Hide ad on Weibo mobile
// @downloadURL https://update.greasyfork.org/scripts/392706/Weibo%20No%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/392706/Weibo%20No%20Ad.meta.js
// ==/UserScript==

function hideAd() {
  var wbItems = document.querySelectorAll("div.wb-item-wrap");
  for (i = 0; i < wbItems.length; i++) {
    try {
      cardTitle = wbItems[i].querySelector("div.m-ctrl-box").innerText;
    }
    catch (err) {
      cardTitle = "No title";
    }
    if (cardTitle == "广告") {
      wbItems[i].hidden = true;
    }
  }
}

setInterval(hideAd, 16);