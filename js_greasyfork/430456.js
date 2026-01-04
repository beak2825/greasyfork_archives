// ==UserScript==
// @name         south+vimium
// @version      0.11.4
// @description  vimium 翻页
// @author       ayase
// @match        https://*.summer-plus.net/*
// @match        https://*.level-plus.net/*
// @match        https://*.white-plus.net/*
// @match        https://*.south-plus.net/*
// @match        https://*.imoutolove.me/*
// @match        https://summer-plus.net/*
// @match        https://level-plus.net/*
// @match        https://white-plus.net/*
// @match        https://south-plus.net/*
// @match        https://imoutolove.me/*
// @run-at document-end
// @namespace https://greasyfork.org/zh-CN/scripts/382722-page
// @downloadURL https://update.greasyfork.org/scripts/430456/south%2Bvimium.user.js
// @updateURL https://update.greasyfork.org/scripts/430456/south%2Bvimium.meta.js
// ==/UserScript==

(() => {
  const main = () => {
    const currPage = parseInt(
      document.querySelector(".pages b").textContent,
      10
    );
    const prePage = currPage === 1 ? 1 : currPage - 1;
    const nextPage = currPage + 1;


    for (const node of queryTextAll(".pages a", "»")) {
      const href = node.getAttribute("href");
      node.setAttribute("href", href.replace(/\bpage-\d+/i, `page-${nextPage}`));
    }

    for (const node of queryTextAll(".pages a", "«")) {
      const href = node.getAttribute("href");
      node.setAttribute("href", href.replace(/\bpage-\d+/i, `page-${prePage}`));
    }
  };



  /**
   * 选择所有包含指定字符串的节点
   * @param {string} selector
   * @param {string} text
   */
  const queryTextAll = (selector, text) => {
    const r = [];
    for (const node of Array.from(document.querySelectorAll(selector))) {
      if (node.textContent.includes(text)) {
        r.push(node);
      }
    }
    return r;
  };

  main();
})();
