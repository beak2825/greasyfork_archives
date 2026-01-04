// ==UserScript==
// @name         微信读书增减宽度（带记忆功能）
// @namespace    https://github.com/qdchenyixuan/Userscript-JS
// @version      0.11
// @description  微信读书增减宽度改编版（带记忆功能）
// @author       clear
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_log
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/449205/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%A2%9E%E5%87%8F%E5%AE%BD%E5%BA%A6%EF%BC%88%E5%B8%A6%E8%AE%B0%E5%BF%86%E5%8A%9F%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/449205/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%A2%9E%E5%87%8F%E5%AE%BD%E5%BA%A6%EF%BC%88%E5%B8%A6%E8%AE%B0%E5%BF%86%E5%8A%9F%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==

// 改编原作者 https://greasyfork.org/zh-CN/scripts/418878-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%BA%A6

(function () {
  'use strict';
  // 基础方法
  function getCurrentMaxWidth(element) {
    let currentValue = window.getComputedStyle(element).maxWidth;
    currentValue = currentValue.substring(0, currentValue.indexOf('px'));
    currentValue = parseInt(currentValue);
    return currentValue;
  }
  function changeWidth(increse) {
    const step = 100;
    const item = document.querySelector('.readerContent .app_content');
    const currentValue = getCurrentMaxWidth(item);
    let changedValue;
    if (increse) {
      changedValue = currentValue + step;
      localStorage.setItem('changedValue', changedValue);
    } else {
      changedValue = currentValue - step;
      localStorage.setItem('changedValue', changedValue);
    }
    item.style['max-width'] = changedValue + 'px';
    const myEvent = new Event('resize');
    window.dispatchEvent(myEvent);

    const readerTopBar = document.querySelector('.readerTopBar');
    readerTopBar.style['max-width'] = changedValue + 'px';
  }
  // 添加内容
  const menus = `
  <div style="position:fixed; top:0; right:0; z-index:100">
      <button id='lv-button1'>增宽</button>
      <button id='lv-button2'>减宽</button>
  </div>
`;
  const mybody = document.getElementsByTagName('body');
  mybody[0].insertAdjacentHTML('afterbegin', menus);
  // 添加样式
  GM_addStyle(`
      #lv-button1, #lv-button2 {
          // border: 1px solid;
          color:#333333;
      }
      .readerControls{
        right:30px;
        left:auto
      }
  `);
  // 添加监听
  document.getElementById('lv-button1').addEventListener('click', () => changeWidth(true));
  document.getElementById('lv-button2').addEventListener('click', () => changeWidth(false));

  // 添加记忆位置
  if (localStorage.getItem('changedValue') != null) {
    const item = document.querySelector('.readerContent .app_content');
    item.style['max-width'] = localStorage.getItem('changedValue') + 'px';
    const readerTopBar = document.querySelector('.readerTopBar');
    readerTopBar.style['max-width'] = localStorage.getItem('changedValue') + 'px';
  }
})();
