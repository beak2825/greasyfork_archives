// ==UserScript==
// @name         衝堂過濾腳本
// @namespace    https://gist.github.com/supersonictw/81535219f2505a29b4787935c851d6ed
// @version      0.1.3
// @description  把衝堂的課程變成透明
// @author       SuperSonic (https://github.com/supersonictw)
// @include      /^https://aais[0-9].nkust.edu.tw/selcrs_std/FirstSelect/SelectPage*/
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420807/%E8%A1%9D%E5%A0%82%E9%81%8E%E6%BF%BE%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420807/%E8%A1%9D%E5%A0%82%E9%81%8E%E6%BF%BE%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
  "use strict";
  function datetimeExporter(item) {
    const [day, time] = item.split(".");
    const [minTime, maxTime] = time.split("-").map((value) => parseInt(value));
    return { day, time, minTime, maxTime };
  }
  function filter() {
    if (!("fixData" in window)) {
      const rawData = prompt("請輸入基本課表資料：");
      window.fixData = JSON.parse(rawData);
    }
    if (window.fixData === null) {
      document.removeEventListener("click", executor);
      return;
    }
    document.querySelectorAll("tr.odd, tr.even").forEach((dom) =>
      Array.from(dom.childNodes)
        .filter((node) =>
          node.textContent.match(/[A-Z][a-z][a-z].[0-9]\-[0-9]/)
        )
        .forEach((node) => {
          const dateData = datetimeExporter(node.textContent);
          if (dateData.day in window.fixData) {
            window.fixData[dateData.day].forEach((item) => {
              if (
                  (item[0] <= dateData.minTime && item[1] >= dateData.maxTime) ||
                  (item.includes(dateData.minTime) || item.includes(dateData.maxTime))
              ) {
                dom.style.opacity = "0.5";
              }
            });
          }
        })
    );
  }
  function executor() {
    setTimeout(filter, 500);
  }
  document.addEventListener("click", executor);
})();