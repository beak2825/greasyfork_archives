// ==UserScript==
// @name         第一后裔突破之机抽奖脚本
// @namespace    @TFD-TICKET-SCRIPT
// @version      0.0.2
// @author       TFD
// @description  第一后裔突破之机抽奖脚本，进入网页后等待 5 秒自动开抽
// @license      GPL-3.0-or-later
// @match        https://tfd.nexon.com/*/events/2025/*/draw
// @downloadURL https://update.greasyfork.org/scripts/543523/%E7%AC%AC%E4%B8%80%E5%90%8E%E8%A3%94%E7%AA%81%E7%A0%B4%E4%B9%8B%E6%9C%BA%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/543523/%E7%AC%AC%E4%B8%80%E5%90%8E%E8%A3%94%E7%AA%81%E7%A0%B4%E4%B9%8B%E6%9C%BA%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const url = location.href;
  if (url.indexOf("https://tfd.nexon.com/") !== -1 && url.indexOf("/draw") !== -1) {
    const startBtn = document.querySelector(".btn_event_start");
    const remaining = document.querySelector(".info_remaining");
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const main = async () => {
      let shouldClickAgain = true;
      await wait(5e3);
      while (shouldClickAgain) {
        const remainingNumberArr = remaining.querySelector("dd").innerHTML.split(">");
        const remainingNumber = remainingNumberArr[remainingNumberArr.length - 1];
        console.log("Remaining Number:", remainingNumber);
        if (remainingNumber > 0) {
          startBtn.click();
          console.log("Clicked start button");
          shouldClickAgain = false;
          await wait(1e3);
          if (document.querySelector(".btn_confirm")) {
            document.querySelector(".btn_confirm").click();
            console.log("Clicked confirm button");
            await wait(3e3);
            if (document.querySelector(".modal__container")) {
              document.querySelector(".btn__close").click();
              console.log("Clicked close button");
              await wait(1e3);
              shouldClickAgain = true;
            }
          }
        } else {
          console.log("No Remaining Tickets");
          shouldClickAgain = false;
        }
      }
    };
    main();
  }

})();