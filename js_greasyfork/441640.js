// ==UserScript==
// @name         Hypothesis导出为markdown文件
// @namespace    https://coycs.com/
// @version      1.0.0
// @description  导出Hypothesis高亮和注释为markdown文件
// @author       coycs
// @match        *://hypothes.is/users/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441640/Hypothesis%E5%AF%BC%E5%87%BA%E4%B8%BAmarkdown%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441640/Hypothesis%E5%AF%BC%E5%87%BA%E4%B8%BAmarkdown%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
 
  window.onload = function () {
    // 添加全部导出按钮
    let exportAllBtn = document.createElement("span");
    exportAllBtn.textContent = "导出全部";
    exportAllBtn.style.cssText = "margin-left: 8px;font-weight: bold;cursor: pointer;";
    document.querySelector(".search-results__total").appendChild(exportAllBtn);
    exportAllBtn.addEventListener("click", function () {
      let exportBtns = document.querySelectorAll("#exportBtn");
      exportBtns.forEach(n => {
        n.click();
      });
    });
 
    // 添加导出按钮
    const listitems = document.querySelectorAll('li[role="listitem"]');
    listitems.forEach(function (e) {
      e.style.cssText = "display: flex;";
      let bucket = e.querySelector(".search-result-bucket.js-search-bucket");
      bucket.style.cssText = "flex: 1;";
      let exportBtn = document.createElement("div");
      exportBtn.id = "exportBtn";
      exportBtn.textContent = "导出";
      exportBtn.style.cssText =
        "display: flex;align-items: center;justify-content: center;font-weight: bold;color: inherit;cursor: pointer;";
      let that = e;
      exportBtn.addEventListener("click", function () {
        ExportListItem(that);
      });
      e.appendChild(exportBtn);
    });
  };
 
  // 导出单个项目
  function ExportListItem(listitem) {
    const title = listitem.querySelector('a[data-ref="title"]').innerText;
    const url_a = listitem.querySelector(
      "div.search-bucket-stats__val.search-bucket-stats__url > a"
    );
    let outcome = new String();
    if (url_a) {
      const url = url_a.href;
      outcome = outcome.concat(`> 来自：${url}\n`);
    } else {
      outcome = outcome.concat("> 来自：本地文件\n");
    }
    const annotations = listitem.querySelectorAll("li.annotation-card");
    for (let i = annotations.length - 1; i > -1; i--) {
      const quote = annotations[i]
        .querySelector("blockquote.annotation-card__quote")
        .innerText.trim();
      const text = annotations[i].querySelector("div.annotation-card__text").innerText.trim();
      if (text) {
        outcome = outcome + "\n" + "> " + quote + "\n" + "\n" + text + "\n";
      } else {
        outcome = outcome + "\n" + "> " + quote + "\n";
      }
    }
    // 导出为markdown文件
    let blob = new Blob([outcome], { type: "application/md" });
    let aTag = document.createElement("a");
    aTag.download = title + ".md";
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
  }
})();