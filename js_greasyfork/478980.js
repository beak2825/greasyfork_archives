// ==UserScript==
// @name         测试脚本1
// @namespace    https://www.vmall.com/*
// @version      0.1
// @description  测试脚本测试
// @author       Wind_DSA
// @match        https://m.vmall.com/portal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlasinfo.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478980/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC1.user.js
// @updateURL https://update.greasyfork.org/scripts/478980/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC1.meta.js
// ==/UserScript==

  setTimeout(() => {
    // 获取页面中所有的div元素
    const divElements = document.getElementsByTagName("div");
    const divsWithHeight76px = [];
    for (let i = 0; i < divElements.length; i++) {
      const div = divElements[i];
      const divHeight = div.offsetHeight;
      if (divHeight === 74) {
        divsWithHeight76px.push(div);
      }
    }
    setInterval(() => {
      divsWithHeight76px[1].click();
    }, 500);
  }, 2000);