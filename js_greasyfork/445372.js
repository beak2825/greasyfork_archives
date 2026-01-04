// ==UserScript==
// @namespace yunyuyuan
// @name 微信读书护眼模式
// @description 给微信读书增加护眼模式
// @match *://*.weread.qq.com/web/reader/*
// @version 0.0.1.3
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445372/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/445372/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const epClass = '.epTheme';
  const epColor = '#f1e5c9';
  const style = document.createElement("style");
  style.innerHTML = `
    html body${epClass},${epClass} .readerContent .app_content, ${epClass} .readerTopBar, ${epClass} .readerControls_fontSize, ${epClass} .readerControls_item, ${epClass} .readerChapterContent_container, ${epClass} .readerChapterContent {
      background: ${epColor} !important;
    }
    ${epClass} .readerFooter_button {
      background-color: ${epColor};
      color: black;
      border: 1px solid black;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    const controlContainer = document.querySelector('.readerControls');
    const getInEP = document.createElement('button');
    getInEP.className = 'readerControls_item';
    getInEP.onclick = () => {
      document.body.classList.toggle(epClass.substring(1));
    }
    getInEP.innerHTML = '<span>护眼</span>';
    controlContainer.appendChild(getInEP);
  },1000)
})()