// ==UserScript==
// @name         publink-shb-chat-beautify
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  shb-chat 样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485445/publink-shb-chat-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/485445/publink-shb-chat-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

const hostName = window.location.hostname

let styleElement = document.createElement('style')
    styleElement.textContent = `
    .no-scroll-bar::-webkit-scrollbar {
      display: none;
    }
    `

document.body.append(styleElement)


setTimeout(() => {

    // 获取所有元素
    const elements = document.querySelectorAll('*');

    // 遍历每个元素
    elements.forEach(element => {

      const classList = element.classList;
      // 检查元素的class是否以"home_sidebar-body"为前缀
      const isHomeSidebarBody = classList.value.startsWith('home_sidebar-body');

      if (isHomeSidebarBody) {
          // 隐藏元素的滚动条
          element.classList.add('no-scroll-bar')
      }

    });

}, 500)


})();