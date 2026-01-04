// ==UserScript==
// @name         自动关闭抖音直播弹幕和礼物,开启原画
// @namespace    douyin
// @version      1.0
// @description  在抖音直播网页上自动关闭弹幕和礼物,开启原画
// @author       claud32
// @match        *://live.douyin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484170/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%92%8C%E7%A4%BC%E7%89%A9%2C%E5%BC%80%E5%90%AF%E5%8E%9F%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/484170/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%92%8C%E7%A4%BC%E7%89%A9%2C%E5%BC%80%E5%90%AF%E5%8E%9F%E7%94%BB.meta.js
// ==/UserScript==


(function () {
  'use strict';

  function closeDanmu() {
    var closeDanmuButton = document.querySelector('.danmu-icon');
    if (closeDanmuButton) {
      closeDanmuButton.click();
      console.log("Closed Danmu");
    }
  }

//<xg-icon data-index="1" classname="sLHkIpHN"><div class="psKR9RS0"><div class="WoNKVQmY Z20k_Nsy">屏蔽礼物特效</div><div><svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29 10.29a2 2 0 012-2h10.693a2 2 0 012 2v5.404a5.55 5.55 0 00-2.414-.55c-.64 0-1.254.108-1.826.306V11a.75.75 0 00-1.5 0v5.245a5.602 5.602 0 00-1.417 1.546V15.95a.75.75 0 00-1.5 0v1.8a.75.75 0 001.195.605 5.55 5.55 0 00-.524 2.361c0 .76.152 1.484.428 2.144h-5.136a2 2 0 01-2-2V10.29zm4.85-.04a.75.75 0 01.75.75v.6h.883c.926 0 1.232 1.088.694 1.652l-1.576 1.653.01 5.094a.75.75 0 01-1.5.002l-.007-3.526-.851.893a.75.75 0 01-1.086-1.036l2.092-2.194a.76.76 0 01.102-.107l.889-.931h-2.112a.75.75 0 010-1.5h.962V11a.75.75 0 01.75-.75z" fill="#fff"></path><path d="M24.423 20.715a3.857 3.857 0 11-7.714 0 3.857 3.857 0 017.714 0z" fill="#fff"></path><path d="M18.802 20.5l1.384 1.502 2.214-2.38" stroke="#FE2C55" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div></xg-icon>
    function closeGifts() {
    var closeGiftsButton = document.querySelector(".xg-right-grid xg-icon[data-index='1'] div.psKR9RS0 div:nth-child(2)");
    if (closeGiftsButton) {
      closeGiftsButton.click();
      //console.log(closeGiftsButton);
      console.log("Closed Gifts");
    }
  }

  function highRes() {
    var highResButton = document.querySelector('.NsCkThfl');
    if (highResButton) {
      highResButton.click();
      console.log("Clicked HighRes");
    }
  }


  var timer = setTimeout(closeDanmu, 3000);
  var timer0 = setTimeout(closeGifts, 3000);
  var timer1 = setTimeout(highRes, 3000);

})();
