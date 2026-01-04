// ==UserScript==
// @name         中文bootstrapVue链接补全
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  中文网bootstrapVue组件页跳转链接补全
// @author       syczuan
// @match        *://code.z01.com/bootstrap-vue/docs/components/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446455/%E4%B8%AD%E6%96%87bootstrapVue%E9%93%BE%E6%8E%A5%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/446455/%E4%B8%AD%E6%96%87bootstrapVue%E9%93%BE%E6%8E%A5%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 去除广告
  let ads = document.querySelector(".carbonads");
  ads.style.display = "none";

  // 处理跳转链接404
  let linkArr = document.getElementsByTagName("a");
  let targetLink = "https://code.z01.com/bootstrap-vue/docs/components/";
  linkArr = Array.prototype.map.call(linkArr, (e) => {
    return e;
  });
  for (let a = 0; a < linkArr.length; a++) {
    const ele = linkArr[a];
    const eleLink = ele.href;
    // 有效链接
    let isValid = eleLink.includes(".html");
    // 目标链接
    let isTargetLink = eleLink.includes(targetLink);
    if (!isValid) {
      if (
        isTargetLink &&
        eleLink != targetLink &&
        eleLink != targetLink + "#" &&
        eleLink != targetLink + "#content"
      ) {
        ele.target = "_blank";
        let strArr = eleLink.split("#");
        strArr[0] = strArr[0] + ".html";
        switch (strArr.length) {
          case 1:
            ele.href = strArr[0];
            break;
          case 2:
            ele.href = strArr.join("#");
            break;
          default:
            break;
        }
      }
    }
  }
})();
