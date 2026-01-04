// ==UserScript==
// @name         PR 默认显示 Active Comments
// @version      0.1.3
// @description  默认显示 active comments，不用每次都点一下
// @namespace    https://dev.azure.com/
// @match        https://dev.azure.com/*/pullrequest/*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @author       bowencool
// @license      MIT
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475334/PR%20%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%20Active%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/475334/PR%20%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%20Active%20Comments.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const button = await waitForElementToExist(
    ".repos-activity-filter-dropdown button"
  );
  for (let i = 0; i < 10; i++) {
    button.click();
    const isActive = button.classList.contains("active");
    if (isActive) {
      break;
    }
    await sleep(500);
  }
  const dropDownId = button.getAttribute("aria-controls");
  const dropDownOption = await waitForElementToExist(`#${dropDownId} #__bolt-active_comments`);
  dropDownOption.click();
})();
