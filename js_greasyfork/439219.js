// ==UserScript==
// @name         pdf.js 自动切换横向滚动
// @namespace    https://userscript.snomiao.com/
// @version      0.3
// @description  自用, 功能rt，使用页面 https://mozilla.github.io/pdf.js/web/viewer.html
// @author       snomiao@gmail.com
// @match        https://mozilla.github.io/pdf.js/web/viewer.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439219/pdfjs%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439219/pdfjs%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  var 睡 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  var 异步选择元素 = async (sel, p = document) => {
    let e;
    while (!(e = p.querySelector(sel))) await 睡(1);
    return e;
  };
  var 更改值 = (元素, 值) => (
    (元素.value = 值), 元素.dispatchEvent(new Event("change"))
  );
  document.addEventListener("resize", async () => {
    (await 异步选择元素("#scrollHorizontal")).click();
    更改值(await 异步选择元素("#scaleSelect"), "page-fit");
  });
})();
