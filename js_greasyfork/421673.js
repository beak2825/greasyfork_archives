// ==UserScript==
// @name         Get All Links
// @name:zh-CN   获取网页中的全部链接
// @name:zh-HK   獲取網頁中的全部鏈接
// @name:zh-TW   獲取網頁中的全部鏈接
// @namespace    https://tdl3.com/
// @version      0.3.1
// @description  Get all links from a website. right-click -> tampermonkey -> "Get All Links".
// @description:zh-CN  获取网页中的全部链接。鼠标右键 -> tampermonkey -> "Get All Links"。
// @description:zh-HK  獲取網頁中的全部鏈接。滑鼠右鍵 -> tampermonkey -> "Get All Links" 。
// @description:zh-TW  獲取網頁中的全部鏈接。滑鼠右鍵 -> tampermonkey -> "Get All Links"。
// @author       TDL3
// @match        https://tdl3.com/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/421673/Get%20All%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/421673/Get%20All%20Links.meta.js
// ==/UserScript==

const filter_results = false;
const filter_regex = new RegExp(/png|jpg/g);

function make_table(results) {
  let table = "<table><thead><th>Names</th><th>Links</th></thead><tbody>";
  results.forEach(result => {
    table += `<tr><td> ${result.name} </td><td> ${result.url} </td></tr>`;
  });
  table += "</table>";
  window.open("").document.write(table);
}

function make_list(results) {
  let list = "";
  results.forEach(result => {
    list += `<div>${result.url}</div>`;
  });

  window.open("").document.write(list);
}

function filter_link(link) {
  if (!!link.match(filter_regex)) {
    return true;
  }
  return false;
}

function get_links() {
  let urls = document.querySelectorAll("a");
  let results = [];
    urls.forEach(url => {
    let link_name = url.textContent.replace(/\t|\s+/g, "").trim();
    let link = url.href;
    if (!filter_results) {
      results.push({
        name: link_name,
        url: link
      });
    } else if (filter_link(link)) {
      results.push({
        name: link_name,
        url: link
      });
    }
  });
  // make_list(results);
  make_table(results);
}

(function () {
  "use strict";
  get_links();
})();