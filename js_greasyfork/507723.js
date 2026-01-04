// ==UserScript==
// @name         修改 bad.news good.news 网站样式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修改标题并删除特定DOM节点
// @match        *://*.bad.news/*
// @match        *://good.news/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507723/%E4%BF%AE%E6%94%B9%20badnews%20goodnews%20%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/507723/%E4%BF%AE%E6%94%B9%20badnews%20goodnews%20%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //---good.news---
    // 隐藏或删除 class 为 menu-area 和 panel-area 的元素
    const menuArea = document.querySelector('.menu-area');
    if (menuArea) {
        menuArea.style.display = 'none'; // 或者使用 menuArea.remove(); 来直接删除元素
    }

    const panelArea = document.querySelector('.panel-area');
    if (panelArea) {
        panelArea.style.display = 'none'; // 或者使用 panelArea.remove(); 来直接删除元素
    }

    // 调整 class 为 main-area 下的 .media-gallery__image 的样式
    const images = document.querySelectorAll('.main-area .media-gallery__image');
    if (images.length) {
      images.forEach(image => {
          image.style.objectFit = 'contain';
          image.style.height = '500px !important';
      });
    }
    // 修改color
    const layout = document.querySelector('.layout');
    if(layout){
      layout.style.color = '#fff';
      layout.style.backgroundColor = '#333';
      const tweetItem = document.querySelector('.tweet-item');

      tweetItem.addEventListener('mouseover', () => {
          tweetItem.style.backgroundColor = '#111';
      });

      tweetItem.addEventListener('mouseout', () => {
          tweetItem.style.backgroundColor = '';
      });
    }


    //---bad.news---
    // 修改 <title> 内容
    document.title = "百度搜索";

    // 删除 id="sr-header-area" 的DOM节点
    let headerArea = document.getElementById('sr-header-area');
    if (headerArea) {
        headerArea.remove();
    }

    // 删除 class="side" 的DOM节点
    let sideElements = document.getElementsByClassName('side');
    while (sideElements.length > 0) {
        sideElements[0].remove();
    }
    // 修改 .coverimg img 的 max-width 为默认值
    let style = document.createElement('style');
    style.textContent = `
        .coverimg img {
            max-height: 500px !important;
        }
        .content, .wrap-content {
            background-color: #333 !important;
        }
    `;


    document.head.appendChild(style);
    // 修改网站图标(favicon)
    let icon = document.querySelector('link[rel="shortcut icon"]');
    if (icon) {
        icon.href = 'https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/wikipedia/baidu.ico';
    } else {
        icon = document.createElement('link');
        icon.rel = 'shortcut icon';
        icon.href = 'https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/wikipedia/baidu.ico';
        document.head.appendChild(icon);
    }
})();