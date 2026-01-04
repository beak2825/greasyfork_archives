// ==UserScript==
// @name         mokyBox辅助小工具 网页截图、csdn复制代码、查看密码、电影天堂直通豆瓣详情页看评分
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网页截图、csdn复制代码、查看密码、电影天堂直通豆瓣详情页看评分 https://github.com/booms21/mokyBox.git
// @author       naje
// @match http://*/*
// @match https://*/*
// @license MIT
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant unsafeWindow
// @require https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js

// @downloadURL https://update.greasyfork.org/scripts/457396/mokyBox%E8%BE%85%E5%8A%A9%E5%B0%8F%E5%B7%A5%E5%85%B7%20%E7%BD%91%E9%A1%B5%E6%88%AA%E5%9B%BE%E3%80%81csdn%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E3%80%81%E6%9F%A5%E7%9C%8B%E5%AF%86%E7%A0%81%E3%80%81%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%9B%B4%E9%80%9A%E8%B1%86%E7%93%A3%E8%AF%A6%E6%83%85%E9%A1%B5%E7%9C%8B%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/457396/mokyBox%E8%BE%85%E5%8A%A9%E5%B0%8F%E5%B7%A5%E5%85%B7%20%E7%BD%91%E9%A1%B5%E6%88%AA%E5%9B%BE%E3%80%81csdn%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E3%80%81%E6%9F%A5%E7%9C%8B%E5%AF%86%E7%A0%81%E3%80%81%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%9B%B4%E9%80%9A%E8%B1%86%E7%93%A3%E8%AF%A6%E6%83%85%E9%A1%B5%E7%9C%8B%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

;(function () {  
  "use strict";
  unsafeWindow.html2canvas = html2canvas;

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/booms21/mokyBox/cdn/app.bundle.js";
  document.body.appendChild(script);
})();
