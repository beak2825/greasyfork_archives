// ==UserScript==
// @name         Steam库存增强插件
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  一个Steam库存增强脚本, 支持以下功能：在鼠标悬停在饰品时在console打印assetid信息，点击饰品卡片打印饰品详细信息
// @author       吃鱼怪
// @match        https://steamcommunity.com/profiles/*/inventory/
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/tradeoffer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473174/Steam%E5%BA%93%E5%AD%98%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/473174/Steam%E5%BA%93%E5%AD%98%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[extension] Steam库存增强插件 已启用");

    // 创建一个 Set 来存储已经打印过的 asset_id
    const printedAssetIds = new Set();

    // 获取 a 标签的 href 属性并从中截取 asset_id
    const getAssetId = (element) => {
      const inventoryItemLink = element.getElementsByClassName('inventory_item_link');
      if (inventoryItemLink.length > 0) {
        const href = inventoryItemLink[0].getAttribute('href');
        return href.split('_').pop();
      }
      return null; // 或者返回其他值，表示不存在 inventory_item_link
    };

    // 鼠标悬停事件处理函数
    const mouseoverHandler = function() {
      const code = getAssetId(this);
      // 如果 asset_id 为空、undefined或者已经被打印过，那么就不进行打印和添加到Set中的操作
      if (!code || code === 'undefined' || printedAssetIds.has(code)) {
        return;
      }
      console.log('asset_id: ' + code);
      printedAssetIds.add(code);
    };

    // 点击事件处理函数
    const clickHandler = function() {
      const code = getAssetId(this);
      // 如果asset_id是空，就不进行后续操作
      if (!code) {
        return;
      }
      setTimeout(function() {
        // 获取饰品的名称并打印
        let nameElement;
        if (document.getElementById('hover_content')) {
          nameElement = document.getElementById('hover_content');
        } else if (document.getElementById('iteminfo0')) {
          nameElement = document.getElementById(document.getElementById('iteminfo0').style.display === 'none' ? 'iteminfo1' : 'iteminfo0');
        }
        if (nameElement) {
          const itemDescDescriptions = nameElement.getElementsByClassName('item_desc_description');
          if (itemDescDescriptions.length > 0) {
            const name = itemDescDescriptions[0].innerText;
            console.log('Clicked asset_id: ' + code);
            console.log('Clicked 饰品名称: ' + name);
          } else {
            console.log('Clicked asset_id: ' + code);
          }
        }
      }, 600); // 等待0.6秒后再获取信息
    };

    // 为每个元素添加鼠标悬停和点击监听器
    const addListener = (element) => {
        element.removeEventListener('mouseover', mouseoverHandler);
        element.removeEventListener('click', clickHandler);
        element.addEventListener('mouseover', mouseoverHandler);
        element.addEventListener('click', clickHandler);
    };

    // 获取元素并添加监听器
    const addListeners = () => {
        const elements = document.getElementsByClassName('itemHolder');
        for (let i = 0; i < elements.length; i++) {
            addListener(elements[i]);
        }
    };

    // 创建一个新的 MutationObserver 来监听 inventory_page 的变化
    const pageObserver = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 页面发生变化，重新获取元素并添加监听器
                addListeners();
            }
        }
    });

    addListeners();
    pageObserver.observe(document.body, { childList: true, subtree: true });
})();