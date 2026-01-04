// ==UserScript==
// @name         展开文档
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @license      MIT
// @description  展开文档 study
// @include           *://interview2.poetries.top/*
// @original-script   https://greasyfork.org/zh-CN/scripts/447245-%E5%BF%AB%E9%80%9F%E8%A7%A3%E6%9E%90
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==、
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448779/%E5%B1%95%E5%BC%80%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/448779/%E5%B1%95%E5%BC%80%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==
(function () {
  "use strict";

  function myFunction() {
    // 存在子元素
    let container = document.querySelector(".content__default");
    if (container && container.childNodes) {
      Array.from(container.childNodes).forEach((n) => {
        if (n.style) {
          if (n.style.display == "block") {
              console.log(true)
            return;
          }
          n.style.display = "block";
        }
      });
    }
    // 展开全文按钮
    let btnNode = document.querySelector(".readMore-wrapper");
    if (btnNode) {
      btnNode.remove();
    }
  }

  window.onload = () => {
    myFunction();
  };
})();
