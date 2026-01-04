// ==UserScript==
// @name         aicnn oaifree 筛选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  aicnn 公益站 oaifree 筛选类型
// @author       Yearly
// @match        https://aicnn.cn/oaifree
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://aicnn.cn/oaifree.
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/509784/aicnn%20oaifree%20%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/509784/aicnn%20oaifree%20%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==


(function() {
  'use strict';

  //no animation
  GM_addStyle(`
      #app > div.oarfree-container > div.apply_content > div.card_content > div.child_content {
           animation: none !important;
      }
      #app > div.oarfree-container > div.apply_content > div.card_content > div.child_content > div[class^=lightning] {
           display: none !important;
      }`);

  // 自定义日志函数
  function customLog(...args) {
    let timenow = new Date().getTime();
    let logs = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    GM_setValue(timenow, logs);
  }

  // 函数: 创建多选组件
  function createMultiSelect(imageSources) {
    customLog("createMultiSelect");

    const multiSelect = document.createElement('div');
    multiSelect.style.cssText = 'display: flex; gap: 20px; margin: 10px;';

    imageSources.forEach((src, index) => {
      const option = document.createElement('label');
      option.style.cssText = 'display: flex; align-items: center; cursor: pointer;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.style.marginRight = '5px';

      const img = document.createElement('img');
      img.src = src;
      img.style.width = '32px';
      img.style.height = '32px';

      option.appendChild(checkbox);
      option.appendChild(img);
      multiSelect.appendChild(option);

      checkbox.addEventListener('change', () => filterContent());
    });

    return multiSelect;
  }

  // 函数: 过滤内容
  function filterContent() {
    const checkboxes = document.querySelectorAll('#userFilterMultiSelect input[type="checkbox"]');
    const childContents = document.querySelectorAll("div.apply_content > div.card_content > div.child_content");

    childContents.forEach(child => {
      const img = child.querySelector("div.card_title > div.titleAppName > div > img[src]");
      if (img) {
        const checkbox = Array.from(checkboxes).find(cb => cb.nextElementSibling.src === img.src);
        if (checkbox) {
          child.style.display = checkbox.checked ? '' : 'none';
        }
      }
    });
  }


  // MutationObserver
  let observer;
  function initObserver() {
    const targetNode = document.querySelector("div.apply_content > div.card_content");
    if (!targetNode) return;

    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          filterContent();
          break;
        }
      }
    };
    observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  // 主函数
  function init() {
    customLog("init");
    const childContents = document.querySelectorAll("div.apply_content > div.card_content > div.child_content");

    if (childContents.length < 3) {
      setTimeout(() => {init();}, 1500);
      return;
    }

    customLog("init done: " + childContents.length );

    const imageSources = new Set();

    childContents.forEach(child => {
      const img = child.querySelector("div.card_title > div.titleAppName > div > img[src]");
      if (img && img.src) {
        imageSources.add(img.src);
      }
    });

    const header = document.querySelector("#app > div.oarfree-container > div.flex-header");
    if (header && !header.querySelector("#userFilterMultiSelect")) {
      const multiSelect = createMultiSelect(Array.from(imageSources));
      multiSelect.id = 'userFilterMultiSelect';
      header.appendChild(multiSelect);
    }

    filterContent(); // 初始调用以设置初始状态

    initObserver();
  }

  init();

})();