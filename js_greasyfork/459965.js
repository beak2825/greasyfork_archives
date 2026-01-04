// ==UserScript==
// @name         HV 训练助手 (Training Helper)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  持续训练 (Hentaiverse Continuous Training)
// @author       ssnangua
// @match        *://hentaiverse.org/?s=Character&ss=tr
// @match        *://alt.hentaiverse.org/?s=Character&ss=tr
// @icon         https://hentaiverse.org/y/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459965/HV%20%E8%AE%AD%E7%BB%83%E5%8A%A9%E6%89%8B%20%28Training%20Helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459965/HV%20%E8%AE%AD%E7%BB%83%E5%8A%A9%E6%89%8B%20%28Training%20Helper%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.querySelector("#mainpane").style.overflow = "auto";

  console.log("[HV 训练助手]", localStorage.ngTrain);

  document
    .querySelectorAll("#train_table tr>td:last-child>img")
    .forEach((el, index) => {
      const isCur = String(index) === localStorage.ngTrain;
      if (isCur && el.onclick) el.click();

      const btn = document.createElement("div");
      btn.style.cssText =
        "white-space: nowrap; font-weight: bold;" +
        (!localStorage.ngTrain || isCur || el.onclick
          ? "text-shadow: 0 0 2px orange; cursor: pointer;"
          : "color: #454543;");
      btn.innerHTML = "持续训练";
      if (isCur) {
        btn.innerHTML = "持续中…";
        btn.onmouseover = () => (btn.innerHTML = "不再持续");
        btn.onmouseout = () => (btn.innerHTML = "持续中…");
        btn.onclick = () => {
          delete localStorage.ngTrain;
          location.reload();
        };
      } else if (!localStorage.ngTrain) {
        btn.onclick = () => {
          localStorage.ngTrain = String(index);
          if (el.onclick) el.click();
          else location.reload();
        };
      }
      el.parentNode.appendChild(btn);
    });
})();
