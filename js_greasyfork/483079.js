// ==UserScript==
// @name         把他妈的QQ空间说说全删了！
// @namespace    https://pen-yo.github.io/
// @version      2024-02-24
// @description  本脚本可以帮您快速移除大量说说：它们可能是您尴尬的黑历史。
// @author       Penyo
// @match        https://user.qzone.qq.com/*
// @icon         https://qzonestyle.gtimg.cn/aoi/img/logo/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483079/%E6%8A%8A%E4%BB%96%E5%A6%88%E7%9A%84QQ%E7%A9%BA%E9%97%B4%E8%AF%B4%E8%AF%B4%E5%85%A8%E5%88%A0%E4%BA%86%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/483079/%E6%8A%8A%E4%BB%96%E5%A6%88%E7%9A%84QQ%E7%A9%BA%E9%97%B4%E8%AF%B4%E8%AF%B4%E5%85%A8%E5%88%A0%E4%BA%86%EF%BC%81.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const button = document.createElement("button");
  button.innerText = "屠杀，启动！（多点几次）";
  new Map([
    ["position", "fixed"],
    ["z-index", "2077"],
    ["top", "0"],
    ["left", "0"],
  ]).forEach((v, k) => {
    button.style.setProperty(k, v, "important");
  });
  button.addEventListener("click", async () => {
    document.querySelector(".menu_item_311").querySelector("a").click();
    await delay(1500);
    const iframe =
      document.querySelector(".app_canvas_frame").contentWindow.document;
    const posts = iframe.querySelectorAll(".del_btn");
    if (posts.length > 0) {
      posts.forEach((ss) => {
        ss.click();
      });
      await delay(500);
      document.querySelectorAll(".qz_dialog_layer_sub").forEach((yesButton) => {
        yesButton.click();
      });
    } else alert("似乎根本就没他妈什么要删的");
  });

  await delay(1000);

  try {
    document.querySelector(".bg-body").appendChild(button);
  } catch (e) {}
})();
