// ==UserScript==
// @name         chaoxing_pdf_download
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  安装后"Tampermonkey-管理面板-chaoxing_pdf_download-设置-运行时期-context-menu",进入学习或资料的详情页后,"右键单击-Tampermonkey-chaoxing_pdf_download",即可打开pdf,用不了就刷新一下
// @author       dxluo
// @match        http://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454503/chaoxing_pdf_download.user.js
// @updateURL https://update.greasyfork.org/scripts/454503/chaoxing_pdf_download.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  let source;
  if (window.location.pathname == "/mycourse/studentstudy") {
    source = document
      .querySelectorAll("iframe")[0]
      .contentDocument.querySelectorAll("iframe")[0]
      .contentDocument.querySelectorAll("iframe")[0]
      .contentDocument.querySelectorAll("img")[0]
      .src.split("/");
  } else if (window.location.pathname == "/coursedata/toPreview") {
    source = document
      .querySelectorAll("iframe")[0]
      .contentDocument.querySelectorAll("iframe")[0]
      .contentDocument.querySelectorAll("img")[0]
      .src.split("/");
  }
  let n = source.length - 2;
  source.length = n;
  let id = source.reverse()[0];
  source.reverse();
  source[n] = "pdf";
  source[n + 1] = id;
  let target = source.join("/") + ".pdf";
  window.open(target);
})();
