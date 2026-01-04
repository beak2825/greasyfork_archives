// ==UserScript==
// @name         luogu-复制专栏源码
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  luogu 复制专栏源码
// @author       JiaY19
// @match        https://www.luogu.com/article/*
// @match        https://www.luogu.com.cn/article/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489299/luogu-%E5%A4%8D%E5%88%B6%E4%B8%93%E6%A0%8F%E6%BA%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/489299/luogu-%E5%A4%8D%E5%88%B6%E4%B8%93%E6%A0%8F%E6%BA%90%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const url = window.location.href;
  async function clickBotton_blog() {
    var x = document.querySelector("#lentille-context").text
    var y = JSON.parse(x)
    var z = y.data.article.content
    navigator.clipboard.writeText(z);
  };
  if (url.includes("article")) {
    document.onkeydown = function (e) {
      if (e.keyCode == 67 && e.ctrlKey && e.altKey) {
        clickBotton_blog();
        alert("复制成功！");
      }
    }
  }
  // Your code here...
})();