// ==UserScript==
// @name         博彦工时一键填报
// @namespace    https://greasyfork.org/zh-CN/users/156652-liubiantao
// @version      0.2
// @description  点击填写工时按钮, 一键将所有工作日工时填写为8小时
// @author       liubiantao
// @match        https://e9-cology.beyondsoft.com/*
// @icon         https://www.google.com/s2/favicons?domain=beyondsoft.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429885/%E5%8D%9A%E5%BD%A6%E5%B7%A5%E6%97%B6%E4%B8%80%E9%94%AE%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/429885/%E5%8D%9A%E5%BD%A6%E5%B7%A5%E6%97%B6%E4%B8%80%E9%94%AE%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (window.top != window.self) {
    //don't run on frames or iframes
    return;
  }

  GM_addStyle(`
      #fillworktime {
          position: fixed;
          bottom: 20%;
          left: 1px;
          border: 1px solid #00b5ff;
          padding: 3px;
          width: 20px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 3px;
          z-index: 111;
          color: #00b5ff;
          background: #00b5ff1f;
      }
    `);

  function fillWorkTime() {
    const workDays =
      document.querySelectorAll(
        ".excelDetailTable .td_textalign_center input.wf-input:not([readonly])"
      ) || [];

    workDays.forEach((input) => {
      $(input).val('8');
    });
  }

  function addButton() {
    const btn = document.createElement("div");
    btn.innerText = "填写工时";
    btn.id = "fillworktime";
    document.body.append(btn);
    document
      .querySelector("#fillworktime")
      .addEventListener("click", fillWorkTime);
  }

  addButton();
})();
