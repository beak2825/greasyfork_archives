// ==UserScript==
// @name         AWD货件状态着色
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  把亚马逊卖家后台花花绿绿的AWD货件状态着色改回来
// @match        https://sellercentral.amazon.com/gp/ssof/shipping-queue.html*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/543768/AWD%E8%B4%A7%E4%BB%B6%E7%8A%B6%E6%80%81%E7%9D%80%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/543768/AWD%E8%B4%A7%E4%BB%B6%E7%8A%B6%E6%80%81%E7%9D%80%E8%89%B2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const colormap = {
    'grey': '#757575',
    'light_grey': '#b7b7b7',
    'green': '#00b426',
    'cyan': '#00a4b4',
    'red': '#b43700'
  }

  // 用于更新颜色的函数
  function updateBadgeColor(badge) {
    if (!badge || !badge.hasAttribute) return;
    const label = badge.getAttribute('label').toLowerCase();

    // if (label === '已登记') {
    //   badge.style.setProperty('--kat-badge-background', colormap.green);
    // } else {
    //   badge.style.setProperty('--kat-badge-background', colormap.grey);
    // }

    // 应用对应颜色
    if (label === 'closed' || label === '已完成') {
        badge.style.setProperty('--kat-badge-background', colormap.grey);
    } else if (label === 'receiving' || label === '正在接收') {
        badge.style.setProperty('--kat-badge-background', colormap.green);
    } else if (label === 'checked in' || label === '已登记') {
        badge.style.setProperty('--kat-badge-background', colormap.green);
    } else if (label === 'in transit' || label === '运输中') {
        badge.style.setProperty('--kat-badge-background', colormap.cyan);
    } else if (label === 'shipped' || label === '已发货') {
        badge.style.setProperty('--kat-badge-background', colormap.cyan);
    } else if (label === 'created' || label === '已创建') {
        badge.style.setProperty('--kat-badge-background', colormap.light_grey);
    } else if (label === 'cancelled' || label === '已取消') {
        badge.style.setProperty('--kat-badge-background', colormap.light_grey);
    } else {
        badge.style.setProperty('--kat-badge-background', colormap.cyan);
    }
  }

  // 初始化时处理页面现有的 kat-badge
  function handleAllBadges() {
    document.querySelectorAll('kat-badge').forEach(updateBadgeColor);
  }

  handleAllBadges();

  // 监听 DOM 变化，处理后续新增的 kat-badge
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.matches && node.matches('kat-badge')) {
            updateBadgeColor(node);
          }
          // 如果新增节点里还有子节点
          node.querySelectorAll && node.querySelectorAll('kat-badge').forEach(updateBadgeColor);
        }
      });
      // 属性变化时也处理
      if (mutation.type === 'attributes' && mutation.target.matches && mutation.target.matches('kat-badge')) {
        updateBadgeColor(mutation.target);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['label'] // 只关心 label 属性变化
  });
})();
