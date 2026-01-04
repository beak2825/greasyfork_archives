// ==UserScript==
// @name         自动领取oat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安装脚本之后，打开待领取OAT的galxe界面，会自动领取oat
// @author       @xiabing88
// @match        https://galxe.com/*/campaign/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galxe.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/454130/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96oat.user.js
// @updateURL https://update.greasyfork.org/scripts/454130/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96oat.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  let interval = setInterval(() => {
    //【推特自动转发】 暴力循环检测按钮 检测到就自动点击
    var list = document.querySelector(
        "#app > div > main > div > div > div > div > div.d-md-flex > div.media-container.flex-all-center.mr-md-15.mr-0 > div.media-container-main > div.op-btn.flex-all-center > div > div:nth-child(1) > div > div > button"
    );

    console.log('in ', list)

    if (list) {
        setTimeout(() => {
            list.click();
            console.log("click");
            clearInterval(interval);
        }, 0)
    }
  }, 500);
})();
