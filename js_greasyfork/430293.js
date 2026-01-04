// ==UserScript==
// @name         vimium support for kf
// @version      0.1
// @description  为绯月添加 vimium 支持
// @author       ayase
// @match        https://bbs.365gal.com/*
// @namespace https://greasyfork.org/users/298898
// @downloadURL https://update.greasyfork.org/scripts/430293/vimium%20support%20for%20kf.user.js
// @updateURL https://update.greasyfork.org/scripts/430293/vimium%20support%20for%20kf.meta.js
// ==/UserScript==

(() => {
  const menus = document.querySelectorAll(".topmenuo2");

  for (const ele of Array.from(menus)) {
    ele.previousElementSibling.onclick = () => {
      const style = window.getComputedStyle(ele);
      if (style.display !== "none") {
        ele.style.cssText = "";
      } else {
        menus.forEach((ele, i) => {
          ele.style.cssText = "";
        });
        Object.assign(ele.style, {
          "display": "block",
          "background-color": "#ffffff",
        });
      }
    };
  }
})();
