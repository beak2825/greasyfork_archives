// ==UserScript==
// @name         Gitblit地址复制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用户复制git地址到剪贴板
// @author       kanglujie
// @match        http://yykjgit.sdyyst.com/summary/*.git
// @connect      *
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/500679/Gitblit%E5%9C%B0%E5%9D%80%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500679/Gitblit%E5%9C%B0%E5%9D%80%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {
  'use strict';
  
  // 定义常量
  const ORIGINAL_ADDRESS = '121.36.50.67:8888';
  const NEW_ADDRESS = 'yykjgit.sdyyst.com';
  // 找到目标位置的父元素
  let parentElement = document.querySelector('body > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.hidden-tablet > td > div > div:nth-child(2) > div');

  // 创建新的div元素
  let newDiv = document.createElement('div');

  // 设置新div的内容或属性
  newDiv.className = 'btn-group';
  newDiv.innerHTML = `
    <a class="btn btn-mini btn-appmenu" data-toggle="dropdown" href="#" id="copyButton">
        <span>复制</span>
    </a>
`;

  // 将新的div添加到目标位置的父元素中
  parentElement.appendChild(newDiv);

  // 获取需要复制的文本元素
  let textToCopy = document.querySelector('body > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > table > tbody > tr.hidden-tablet > td > div > div.btn-toolbar > div > ul > li:nth-child(2) > span').innerText;
  textToCopy = textToCopy.replace(/\s+/g, "");
  textToCopy = textToCopy.substring(3);
  // 替换textToCopy中的121.36.50.67:8888为yykjgit.sdyyst.com
  textToCopy = textToCopy.replace(ORIGINAL_ADDRESS, NEW_ADDRESS);

  console.log(textToCopy);
  // 添加点击事件监听器
  document.getElementById('copyButton').addEventListener('click', function (event) {
    event.preventDefault(); // 阻止默认的跳转行为

    // 创建一个临时文本区域来存放要复制的文本
    let tempTextarea = document.createElement('textarea');
    tempTextarea.value = textToCopy; // 设置为要复制的文本内容
    document.body.appendChild(tempTextarea);

    // 选择文本
    tempTextarea.select();

    // 执行复制命令
    document.execCommand('copy');

    // 移除临时文本区域
    document.body.removeChild(tempTextarea);

  });

})();
