// ==UserScript==
// @name         Contract Viewer Extension
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extension for VS Code Extension Contract Viewer
// @author       EndureBlaze
// @match        https://etherscan.io/address/*
// @match        https://bscscan.com/address/*
// @icon         https://raw.githubusercontent.com/MetaplasiaTeam/vscode-contract-viewer/main/image/logo.png
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439253/Contract%20Viewer%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/439253/Contract%20Viewer%20Extension.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function () {
  "use strict";

  // 插入下载按钮
  GM_addStyle(".download-btn:hover { color: #3498db; }");
  let downloadBtn = document.createElement("div");
  downloadBtn.innerHTML =
    '<a class="download-btn" href="javascript:;" style="color: #000">Download Contract   </a>';
  downloadBtn.addEventListener("click", downloadContract);
  let navBar = document.querySelector(
    "div.flex-wrap:nth-child(1) > div:nth-child(2)"
  );
  navBar.insertBefore(downloadBtn, navBar.firstChild);

  function downloadContract() {
    if (document.domain === "etherscan.io") {
      console.log(parserLink("eth"));
      window.open(parserLink("eth"));
    }
    if (document.domain === "bscscan.com") {
      window.open(parserLink("bsc"));
    }
  }

  function parserLink(type) {
    let url = document.location.toString();
    let addr = url.substring(url.lastIndexOf("/"), url.length);
    return `vscode://Metaplasia.contract-viewer/download?type=${type}&addr=${addr}`;
  }
})();
