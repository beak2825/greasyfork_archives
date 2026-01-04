// ==UserScript==
// @name         将开发环境内嵌到线上页面中
// @namespace    http://yournamespace.example.com
// @version      1.0
// @description  当URL中匹配到某个标志后将开发环境内嵌到页面内
// @author       liliangrong777
// @include     *
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482072/%E5%B0%86%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%86%85%E5%B5%8C%E5%88%B0%E7%BA%BF%E4%B8%8A%E9%A1%B5%E9%9D%A2%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/482072/%E5%B0%86%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%86%85%E5%B5%8C%E5%88%B0%E7%BA%BF%E4%B8%8A%E9%A1%B5%E9%9D%A2%E4%B8%AD.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // 检测标识
  const MATCH_FLAG = 'env=dev'
  // 本地环境地址
  const LOCAL_URL = 'http://localhost:5173';
  // react挂载节点
  const ROOT_ID = 'root';
  // 要替换元素的选择器或返回dom节点的函数，如果未匹配上会挂载到document.body上
  const SELECTOR = `#${ROOT_ID}`



  // 获取当前页面的URL
  const currentURL = window.location.href;
  // 检查URL是否包含'env=dev'
  if (currentURL.includes(MATCH_FLAG)) {
      const newDiv = document.createElement('div'); newDiv.id = ROOT_ID;

      const isStrSelector = typeof SELECTOR === 'string' 
      const section = isStrSelector ? document.querySelector(SELECTOR) : SELECTOR()
      if (section) {
        section.insertAdjacentElement('afterend', newDiv);
        section.remove();
      } else {
        document.body.appendChild(newDiv);
      }
  

      // 创建第一个 script 元素
      const script1 = document.createElement('script');
      script1.type = 'module';
      script1.text = `
          import RefreshRuntime from '${LOCAL_URL}/@react-refresh';
          RefreshRuntime.injectIntoGlobalHook(window);
          window.$RefreshReg$ = () => {};
          window.$RefreshSig$ = () => (type) => type;
          window.__vite_plugin_react_preamble_installed__ = true;
      `;
      document.head.appendChild(script1);

      // 创建第二个 script 元素
      const script2 = document.createElement('script');
      script2.type = 'module';
      script2.src = `${LOCAL_URL}/@vite/client`;
      document.head.appendChild(script2);

      // 创建第三个 script 元素
      const script3 = document.createElement('script');
      script3.type = 'module';
      script3.src = `${LOCAL_URL}/src/main.tsx`;
      document.head.appendChild(script3);
  }
})();
