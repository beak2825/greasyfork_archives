// ==UserScript==
// @name         古战场FA通知
// @namespace    无
// @version      1.0
// @description  古战场FA结束自动通知,点击跳转友召选择界面;团灭提醒
// @author       Calpis
// @match        *://game.granbluefantasy.jp/*
// @icon         https://prd-game-a-granbluefantasy.akamaized.net/assets/img/sp/assets/item/article/s/10116.jpg
// @license MIT
// @run-at       document-body
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/451143/%E5%8F%A4%E6%88%98%E5%9C%BAFA%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/451143/%E5%8F%A4%E6%88%98%E5%9C%BAFA%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //通知持续时间(s),0为永久
  const TIME = 0;

  let audio = new Audio(
    "https://game-a5.granbluefantasy.jp/assets/sound/se/help_se_2.mp3"
  );

  const notice = (flag) => {
    audio.play();
    GM_notification({
      title: "古战场小助手提醒您",
      text: flag ? "点我开始下一场坐牢" : "翻车了,救一救啊",
      timeout: 1000 * TIME,
      ondone: () => {
        audio.pause();
      },
      onclick: () => {
        if (flag) {
          //水团200HL
          location.hash = "quest/supporter/794101/1";
        }
        window.focus();
        audio.pause();
      },
    });
  };

  const diedHandler = () => {
    if (/^#raid_multi\/\d/.test(location.hash)) {
      const cnt = document.querySelector(".contents");
      const cntConfig = {
        childList: true,
      };
      const cb = function (mutations, observer) {
        const tip = document.querySelector(".prt-tips");
        const tipConfig = {
          attributes: true,
        };
        const cb2 = function (mutations2, observer2) {
          console.log(mutations2);
          if (tip.style.display == "block") {
            notice(0);
          }
        };
        const o2 = new MutationObserver(cb2);
        o2.observe(tip, tipConfig);
      };
      const o1 = new MutationObserver(cb);
      o1.observe(cnt, cntConfig);
    }
  };

  const completedHandler = () => {
    if (/^#result_multi\/\d/.test(location.hash)) {
      notice(1);
    }
  };

  window.addEventListener("load", diedHandler);
  window.addEventListener("hashchange", completedHandler);
})();
