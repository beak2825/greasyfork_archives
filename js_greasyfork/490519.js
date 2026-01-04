// ==UserScript==
// @license      MIT
// @name         CSDN增强插件
// @namespace    http://forhot2000.cn/
// @version      0.1.2
// @description  CSDN增强插件，允许复制网页内容
// @author       forhot2000@qq.com
// @match        https://blog.csdn.net/*
// @match        https://wenku.csdn.net/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAZlBMVEX8VTH////9vrD9pZL8knv8Wjf8XTv9sJ/+6+f8VzT+z8X8Xz3+8u/+7+z8f2T+0sn8hGr8dFf9xLf9uar+29P+9vX+4tz8ZUX+1878iG/9mYT8b1H8jnb8aUr9sqL9nYj9qpn8el57eGjIAAAA1ElEQVQ4jc2S2RaDIAxEjRuKgFbFpdbt/3+ygbZqQXns6TyFM9cxCXje3+kWlDmtwvjCLmp4SZLoxI582NW0lh93ykh84nNV+KafUmX3urxLAGoCwTF3SOBh+C1+xMbtmA1mwIQB88Vw+rcMgJ+N9pHAgMnh6xZ7F6B2ZK/mILWE1AXkCLh8nXB1hVoVAqsLCBFYXECGADuOMZpDqzm7bDsKCeQbaJm67VkjqSjVqzIiCqlfUlLnzbsy2xAcjuLCbpSw3V4yy0dFxVJSfPbB6lz7z/UEIzIHM01uU70AAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490519/CSDN%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/490519/CSDN%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 允许复制
  var node1 = document.querySelector("#content_views");
  if (node1) {
    var clone = node1.cloneNode(true);
    node1.parentNode.insertBefore(clone, node1);
    node1.remove();
  }

  // 展开全部文章
  var node2 = document.querySelector("#article_content");
  if (node2) {
    node2.style.height = "auto";
    node2.style.overflow = "auto";
  }

  if (/\/\/wenku\.csdn\.net/g.test(window.location.href)) {
    const style = document.createElement("style");
    style.innerHTML = `
    .forbid {
      user-select: auto !important;
    }
    .first-show {
      max-height: none !important;
    }
    .open {
      display: none !important;
    }`;
    document.head.appendChild(style);
  }
})();
