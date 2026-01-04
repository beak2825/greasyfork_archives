// ==UserScript==
// @name         Block Some AD
// @version      0.3
// @description  block some ad
// @match        https://www.zhangxinxu.com/*
// @grant        none

// @namespace https://mp.weixin.qq.com/s/*
// @downloadURL https://update.greasyfork.org/scripts/432326/Block%20Some%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/432326/Block%20Some%20AD.meta.js
// ==/UserScript==
const childNodes = document.querySelector(".silebar_inner.slide_list")?.children || [];

for (const node of childNodes) {
  if (node.nodeName.indexOf('-') !== -1) {
    // 自定义元素
    node.style.display = 'none';
    break;
  }
}