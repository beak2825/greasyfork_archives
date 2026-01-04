// ==UserScript==
// @name         旅法师营地套牌广场复制卡组代码
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  按 ctrl+c 直接复制卡组代码
// @author       mission522
// @match        https://www.iyingdi.com/web/tools/hearthstone/userdecks*
// @icon         https://pic.iyingdi.com/yingdi_pc/logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511742/%E6%97%85%E6%B3%95%E5%B8%88%E8%90%A5%E5%9C%B0%E5%A5%97%E7%89%8C%E5%B9%BF%E5%9C%BA%E5%A4%8D%E5%88%B6%E5%8D%A1%E7%BB%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/511742/%E6%97%85%E6%B3%95%E5%B8%88%E8%90%A5%E5%9C%B0%E5%A5%97%E7%89%8C%E5%B9%BF%E5%9C%BA%E5%A4%8D%E5%88%B6%E5%8D%A1%E7%BB%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

document.addEventListener("keydown", async function (event) {
  const codeNode = document.querySelector(".deck-info-box .staticCode");
  if (event.ctrlKey && event.key === "c" && codeNode) {
    try {
      const codeValue = codeNode.textContent.split("：")[1];
      if (!codeValue) throw new Error("未找到卡组代码");

      await navigator.clipboard.writeText(codeValue);

      web.utility.showBasicPrompt({
        content: "代码复制成功",
        style: "alert-success",
      });
    } catch (error) {
      console.error("复制卡组代码时出错:", error);
      web.utility.showBasicPrompt({
        content: `复制卡组代码失败`,
        style: "alert-error",
      });
    }
  }
});
