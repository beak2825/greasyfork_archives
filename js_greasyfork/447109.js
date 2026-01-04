// ==UserScript==
// @name         echarts属性快速复制
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  用于快速echarts配置文档中的默认属性到代码中修改.
// @license      MIT
// @author       You
// @match        https://echarts.apache.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apache.org
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447109/echarts%E5%B1%9E%E6%80%A7%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447109/echarts%E5%B1%9E%E6%80%A7%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

/* eslint-disable */
(function () {
  window.onload = function () {
    document.querySelectorAll('.doc-content-item-card h4').forEach((item) => {
      item.querySelectorAll('.path-parent')?.forEach((title) => {
        title.textContent = title.textContent.replace(/\./g, ':{');
        if (item.querySelector('.default-value')) {
          item.querySelector('.default-value').textContent = `${
            item.querySelector('.default-value').textContent
          }}`.replace(/\=/g, ':');
        }
      });
    });
  };
})();
