// ==UserScript==
// @name         1688获取产品链接
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  轻松输出1688产品链接
// @author       You
// @license MIT
// @include      *://s.1688.com/*
// @icon         https://re.1688.com/%3Fkeywords%3D%7Bkeywords%7D%26cosite%3Dbaidujj_pz%26location%3Dre%26trackid%3D%7Btrackid%7D%26keywordid%3D%7Bkeywordid%7D%26format%3Dnormal
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441642/1688%E8%8E%B7%E5%8F%96%E4%BA%A7%E5%93%81%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/441642/1688%E8%8E%B7%E5%8F%96%E4%BA%A7%E5%93%81%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建一个按钮元素
  const button = document.createElement("button");
  button.innerHTML = "下载产品链接";
  button.style.cssText = "position:fixed;top:50px;right:10px;z-index:9999;display: inline-block;width: 152px;height: 32px;font: 14px/26px PingFangSC-Regular;text-align: center;color: #fff;border-radius: 4px;letter-spacing: 0;text-decoration: none;border: 1px solid #ff4000;background-image: linear-gradient(90deg, #FF7E3E 0%, #FF4000 100%);";
  document.body.appendChild(button);

  // 添加按钮的点击事件
  button.addEventListener("click", () => {
    const hrefsSet = new Set();
    document.querySelectorAll('a').forEach((a) => {
      const href = a.href;
      if (href.includes('detail.1688.com')) {
        hrefsSet.add(href);
      }
    });
    const hrefsArray = Array.from(hrefsSet);
    const csvContent = "data:text/csv;charset=utf-8," + hrefsArray.map(href => href + '\r\n').join("");
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "hrefs.csv");
    link.click();
  });
})();
