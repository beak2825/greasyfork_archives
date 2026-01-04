// ==UserScript==
// @name         Coze页面深色主题切换
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Ctrl+i+i 切换深色主题，适合大多数不提供深色模式的网站。Toggle light/dark mode across all sites with Ctrl+I (double press).
// @author       Movelocity
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491398/Coze%E9%A1%B5%E9%9D%A2%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/491398/Coze%E9%A1%B5%E9%9D%A2%E6%B7%B1%E8%89%B2%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sitesAndRules = {
    'https://www.coze.com': [
      `img{
        filter: invert(70%) brightness(1.8) contrast(1);
      }
      .code-block-element_93cd4 {
        filter: invert(100%) brightness(1) contrast(1);
      }
      .chat-uikit-message-box-inner--primary{
        filter: invert(0.8) brightness(1.5) contrast(0.75);
      }/*chatbox颜色*/
      .chat-uikit-message-box-container__message{
          max-width: calc(100% - 40px) !important;
      }/*chatbox尺寸*/
      `
      // Add more rules as needed
    ]
    // You can add more sites and their rules here
  };

  let top_elem = document.documentElement;
  let global_css = 'invert(90%) brightness(1.8) contrast(1.2)';
  let site_css = "img{filter: invert(70%) brightness(1.8) contrast(1);}";
  let style_elem = document.createElement('style');

  const currentUrl = window.location.href;
  // Iterate over the sites in the map
  for (const site in sitesAndRules) {
    if (currentUrl.startsWith(site)) {
      // 匹配站点，使用对应的 css 集合
      site_css = sitesAndRules[site];
      break; // No need to check other sites if a match is found
    }
  }

  function applyFilter(){
    const inverted = localStorage.getItem('tm-inverted') === 'true';
    if (inverted) {
      style_elem.innerHTML = site_css;
      top_elem.style.filter = global_css;
    } else {
      style_elem.innerHTML = '';
      top_elem.style.filter = '';
    }
  }

  // Function to toggle the inversion
  function toggleInversion() {
    const inverted = localStorage.getItem('tm-inverted') === 'true';
    if (inverted) {
      localStorage.setItem('tm-inverted', 'false');
    } else {
      localStorage.setItem('tm-inverted', 'true');
    }
    applyFilter();
  }

  // 实现按键双击
  let lastPressTime = 0;
  document.addEventListener('keydown', function (event) {
    const currentTime = new Date().getTime();
    if (event.ctrlKey && event.key === 'i') {
      if (currentTime - lastPressTime < 400) { // 400 ms for double press
        toggleInversion();
      }
      lastPressTime = currentTime;
    }
  });

  // Apply the inversion filter if it was previously set
  setTimeout(() => {
    try{
      top_elem = document.documentElement;
      document.head.appendChild(style_elem);
      applyFilter();
    }catch(e){}
  }, 200);
  // Double check
  setTimeout(() => {
    top_elem = document.documentElement;
    document.head.appendChild(style_elem);
    applyFilter();
  }, 1000);
})();
