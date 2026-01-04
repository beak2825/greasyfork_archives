// ==UserScript==
// @name         识别并替换新的tracking-page
// @namespace    http://yournamespace.example.com
// @version      1.3
// @description  当URL中包含'test=true'时执行操作
// @author       Your Name
// @include     *
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479934/%E8%AF%86%E5%88%AB%E5%B9%B6%E6%9B%BF%E6%8D%A2%E6%96%B0%E7%9A%84tracking-page.user.js
// @updateURL https://update.greasyfork.org/scripts/479934/%E8%AF%86%E5%88%AB%E5%B9%B6%E6%9B%BF%E6%8D%A2%E6%96%B0%E7%9A%84tracking-page.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const isFresh = true;

  // 获取当前页面的URL
  let currentURL = window.location.href;
  // 检查URL是否包含'preview=parcelpanel'

  if (currentURL.includes('test=true')) {
    if (isFresh) {
      function showTheme(params) {
        // 创建一个 div 元素
        const newDiv = document.createElement('div');

        // 设置 div 的样式
        newDiv.style.position = 'fixed';
        newDiv.style.top = '0';
        newDiv.style.left = '40px';
        newDiv.style.zIndex = 999;
        newDiv.style.transform = 'translateX(-50%)';
        newDiv.style.backgroundColor = '#f00'; // 你可以设置其他样式
        function getThemeName() {
          // 获取所有的 <link> 标签
          const linkTags = document.querySelectorAll('link');

          // 用于存储包含特定字符串的第一个 <link> 标签
          let name = '';

          // 遍历所有 <link> 标签
          for (const linkTag of linkTags) {
            // 获取 href 属性的值
            const hrefValue = linkTag.getAttribute('href');

            // 检查 href 是否包含特定字符串
            if (hrefValue && hrefValue.includes('/wp-content/themes/')) {
              // 找到第一个符合条件的 <link> 标签
              name = hrefValue.match(/\/wp-content\/themes\/([^\/]+)\//)?.[1];
              // 停止循环
              return name;
            }
          }

          let scriptTags = document.querySelectorAll('script');
          // 遍历所有 <script> 标签
          for (const scTag of scriptTags) {
            // 获取 src 属性的值
            const scValue = scTag.getAttribute('src');

            // 检查 href 是否包含特定字符串
            if (scValue && scValue.includes('/wp-content/themes/')) {
              // 找到第一个符合条件的 <link> 标签
              name = scValue.match(/\/wp-content\/themes\/([^\/]+)\//)?.[1];
              // 停止循环
              return name;
            }
          }
        }
        // 添加内容到 div 中
        newDiv.textContent = getThemeName();

        // 将 div 插入到文档的 body 中
        document.body.appendChild(newDiv);
      }
      // 创建并附加外部CSS文件
      // let linkElement = document.createElement('link');
      // linkElement.rel = 'stylesheet';
      // linkElement.type = 'text/css';
      // linkElement.href = 'http://127.0.0.1:5501/dist/index.css';
      // document.head.appendChild(linkElement);
      showTheme();
      let section = document.querySelector('.pp-tracking-section');

      const newDiv = document.createElement('div');
      newDiv.id = 'pp-root';
      if (section) {
        section.insertAdjacentElement('afterend', newDiv);
        section.remove();
      } else {
        // 获取所有的 <p> 标签
        var paragraphs = document.getElementsByTagName('p');
        var findP = null;

        // 遍历每个 <p> 标签，查找内容为 [pp-track-page]
        for (var i = 0; i < paragraphs.length; i++) {
          if (paragraphs[i].textContent.includes('[pp-track-page]')) {
            // 找到匹配的 <p> 标签，执行相应操作
            findP = paragraphs[i];
            break;
          }
        }
        (findP || document.body).appendChild(newDiv);
      }
      document.querySelectorAll('#pp-user-track-page-css')?.forEach(dom=>dom.remove())

      let scriptElement = document.createElement('script');
      scriptElement.src =
        'https://dev.pw-wc-tracking.pages.dev/index.js' +
        '?ver=' +
        Date.now();
      document.head.appendChild(scriptElement);
    }
  }
})();
