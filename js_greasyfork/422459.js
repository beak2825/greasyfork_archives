// ==UserScript==
// @name         downdoubanpage
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  豆瓣日記頁添加下載按鈕
// @author       You
// @match        https://www.douban.com/note/*
// @match        https://www.douban.com/group/topic/*
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/422459/downdoubanpage.user.js
// @updateURL https://update.greasyfork.org/scripts/422459/downdoubanpage.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //自动下载
  const autodown = true;

  function down() {
    const r = document.querySelector("#link-report");
    if (r) {
      let header = document.querySelector(".note-header");
      if (!header)
        header = document.querySelector(".article > h1:nth-child(1)");
      if (!header) alert("下载失败 header is null");

      var blob = new Blob([header.innerText, "\r\n", r.innerText], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${header.innerText}.txt`);
    }
  }

  const t = document.querySelector(".article");
  if (t) {
    let e = document.createElement("button");
    e.id = "TDownBtn";
    e.textContent = "下载";
    e.className = "btn btn-md btn-default";
    e.onclick = down;
    t.parentNode.insertBefore(e, t);
  }

  if (autodown) {
    setTimeout(down, 200);
  }

  // Your code here...
})();
