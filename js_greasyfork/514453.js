// ==UserScript==
// @name         商汤教育 / SenseStudy / 人工智能基础素养 / 202.192.143.160 允许复制
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.6
// @description  商汤教育 / SenseStudy / 人工智能基础素养 / 202.192.143.160 允许复制工具、点击code控件可自动复制，若无效请尝试刷新页面
// @author       mcitem
// @match        https://202.192.143.160/student/experiment/*
// @match        https://csvpn.lingnan.edu.cn/https/77726476706e69737468656265737421a2a713d276693a1e2f5cdae2c90373/student/experiment/*
// @downloadURL https://update.greasyfork.org/scripts/514453/%E5%95%86%E6%B1%A4%E6%95%99%E8%82%B2%20%20SenseStudy%20%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%9F%BA%E7%A1%80%E7%B4%A0%E5%85%BB%20%20202192143160%20%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/514453/%E5%95%86%E6%B1%A4%E6%95%99%E8%82%B2%20%20SenseStudy%20%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E5%9F%BA%E7%A1%80%E7%B4%A0%E5%85%BB%20%20202192143160%20%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  function use() {
    const elements = document.querySelectorAll(
      "[class*='ExpSteps_myCollapse']"
    );
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.userSelect = "auto";
      const codes = elements[0].getElementsByTagName("pre");
      for (let i = 0; i < codes.length; i++) {
        let code = codes[i];
        if (!code.hasAttribute("data-copy-bound")) {
          code.addEventListener("click", function () {
            console.log(code.innerText);
            navigator.clipboard.writeText(code.innerText);
          });
          code.setAttribute("data-copy-bound", "true");
        }
      }
    }
  }
  window.addEventListener("load", function () {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.key === "r") {
        event.preventDefault();
        const buttons = document.querySelectorAll(
          "[class*='ExpRunControl_btn']"
        );
        buttons.forEach((button) => {
          button.click();
        });
      }
    });
  });
  setInterval(use, 1000);
})();
