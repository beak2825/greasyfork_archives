// ==UserScript==
// @name         雪球个股调研备注
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为雪球的每个个股页面增加备注，保存到浏览器本地
// @author       Xirtam
// @match        https://xueqiu.com/S/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueqiu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466139/%E9%9B%AA%E7%90%83%E4%B8%AA%E8%82%A1%E8%B0%83%E7%A0%94%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/466139/%E9%9B%AA%E7%90%83%E4%B8%AA%E8%82%A1%E8%B0%83%E7%A0%94%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 获取当前页面的 URL
  const currentUrl = location.origin + location.pathname;
  // 从本地存储中获取与当前 URL 相关联的备注
  const note = localStorage.getItem(`note:${currentUrl}`);

  // 将按钮添加到页面上
  const div = document.createElement('div');
  div.style.display = 'block';
  div.style.position = 'fixed';
  div.style.top = '50%';
  div.style.left = '10px'; // 将 left 设为 auto
  div.style.right = 'auto'; // 将 right 设为 10px
  div.style.width = '280px'; // 宽度
  div.style.transform = 'translate(0%, -50%)';
  div.style.zIndex = 10000;

  // 创建一个对话框元素
  const dialog = document.createElement('dialog');


  // 创建一个文本输入框元素
  const input = document.createElement('textarea');
  input.rows = 5;
  input.style.width = '250px';// 宽度
  input.style.height = '380px';
  input.value = note;
  div.appendChild(input);

  // 创建一个“保存”按钮
  const saveButton = document.createElement('button');
  saveButton.textContent = '保存';
  saveButton.onclick = () => {
    const newNote = input.value;
    localStorage.setItem(`note:${currentUrl}`, newNote);
    alert('保存成功！');
    div.close();
  };
  div.appendChild(saveButton);

document.body.appendChild(div);

})();