// ==UserScript==
// @name         浙江理工大学教评系统 一键选择“非常满意”选项
// @namespace    http://tampermonkey.net/
// @version      beta-0.3
// @description  点击出现的按钮就可以自动勾选当前页面全部的非常满意选项！~
// @author       Null -
// @match        http://jwglxt.zstu.edu.cn/jwglxt/xspjgl/*
// @match        https://jwglxt.webvpn.zstu.edu.cn/jwglxt/xspjgl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456654/%E6%B5%99%E6%B1%9F%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E8%AF%84%E7%B3%BB%E7%BB%9F%20%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9%E2%80%9C%E9%9D%9E%E5%B8%B8%E6%BB%A1%E6%84%8F%E2%80%9D%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/456654/%E6%B5%99%E6%B1%9F%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E8%AF%84%E7%B3%BB%E7%BB%9F%20%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9%E2%80%9C%E9%9D%9E%E5%B8%B8%E6%BB%A1%E6%84%8F%E2%80%9D%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const button = document.createElement("button");

  button.style = `
  z-index: 1000;
  font-size: 16px;
  width: 7em;
  height: 2.5em;
  position: fixed;
  bottom: 5vh;
  right: 3vw;
  box-shadow: #00000044 0 .1em 1em 0;
  `;

  button.innerText = "√ 非常满意";

  button.addEventListener("click", () => {
    const inputList = Array.from(document.querySelectorAll("label>input"));
    inputList.forEach(element => {
      if (element.parentNode.innerHTML.search(/非常满意/) != -1) {
        element.checked = "checked";
      }
    })
  });

  document.body.appendChild(button);
})();