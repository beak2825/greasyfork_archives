// ==UserScript==
// @name         luogu-查看个人介绍
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  luogu 查看个人介绍
// @author       JiaY19
// @match        https://www.luogu.com.cn/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489341/luogu-%E6%9F%A5%E7%9C%8B%E4%B8%AA%E4%BA%BA%E4%BB%8B%E7%BB%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/489341/luogu-%E6%9F%A5%E7%9C%8B%E4%B8%AA%E4%BA%BA%E4%BB%8B%E7%BB%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';
  async function change() {
    document.querySelector(".introduction.marked").style.display = "block";
    var x = document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)").textContent
    if (x.indexOf("系统维护，该内容暂不可见") != -1) {
      document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)").style.display = "none";
    }
  };
  async function update() {
    const url = window.location.href;
    if (url.indexOf("user") != -1) {
      if (url.indexOf("activity") == -1) {
        if (url.indexOf("article") == -1) {
          if (url.indexOf("practice") == -1) {
            if (url.indexOf("following") == -1) {
              change();
            }
          }
        }
      }
    }
  }
  update();
  var t = window.setInterval(update, 1000);
  // Your code here...
})();