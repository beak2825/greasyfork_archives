// ==UserScript==
// @name         清除TAPD弹窗
// @namespace    http://tampermonkey.net/
// @version      2024-05-22-2
// @description  清除TAPD人员上限弹窗
// @author       Awen
// @match        https://www.tapd.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495754/%E6%B8%85%E9%99%A4TAPD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/495754/%E6%B8%85%E9%99%A4TAPD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("清除tapd弹窗！");

  setInterval(() => {
    var elModal = document.querySelector(".v-modal");
    var elDialog = document.querySelector(".company-renew-dialog");
    if (elModal) {
      elModal.parentNode.removeChild(elModal);
    }
    if (elDialog) {
      elDialog.parentNode.removeChild(elDialog);
    }
  }, 200);
})();
