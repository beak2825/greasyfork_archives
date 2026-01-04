// ==UserScript==
// @name         取得基本課表資料
// @namespace    https://gist.github.com/supersonictw/81535219f2505a29b4787935c851d6ed
// @version      0.1.7
// @description  把高科課表轉為JSON資料型態
// @author       SuperSonic (https://github.com/supersonictw)
// @match        https://mobile.nkust.edu.tw/Student/Course*
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420806/%E5%8F%96%E5%BE%97%E5%9F%BA%E6%9C%AC%E8%AA%B2%E8%A1%A8%E8%B3%87%E6%96%99.user.js
// @updateURL https://update.greasyfork.org/scripts/420806/%E5%8F%96%E5%BE%97%E5%9F%BA%E6%9C%AC%E8%AA%B2%E8%A1%A8%E8%B3%87%E6%96%99.meta.js
// ==/UserScript==
(function () {
  function exporter() {
    const translation = {
      "(一)": "Mon",
      "(二)": "Tue",
      "(三)": "Wed",
      "(四)": "Thu",
      "(五)": "Fri",
    };
    const storage = {};
    document.querySelectorAll("tr.odd, tr.even").forEach((dom) =>
      Array.from(dom.childNodes)
        .filter(
          (node) =>
            node.textContent.match(/([1-9])[\-]([1-9])/gm) &&
            node.textContent.trim().length === 6
        )
        .forEach((node) => {
          const dayName = node.textContent.trim();
          const itemKey = translation[dayName.substring(0, 3)];
          if (!(itemKey in storage)) {
            storage[itemKey] = [];
          }
          storage[itemKey].push(
            dayName
              .substring(3)
              .split("-")
              .map((value) => parseInt(value))
          );
        })
    );
    prompt("您的基本課表資料：", JSON.stringify(storage));
  }
  const notice = document.createTextNode("輸出基本課表資料");
  const trigger = document.createElement("div");
  trigger.style.background = "#fff";
  trigger.style.boxShadow = "0 0 3px #777";
  trigger.style.borderRadius = "50px";
  trigger.style.position = "absolute";
  trigger.style.padding = "10px 5px";
  trigger.style.zIndex = "36";
  trigger.style.cursor = "pointer";
  trigger.style.right = "33px";
  trigger.style.top = "70px";
  trigger.appendChild(notice);
  trigger.addEventListener("click", exporter);
  document.body.appendChild(trigger);
})();
