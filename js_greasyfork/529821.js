// ==UserScript==
// @name         Bilibili导航栏Logo替换为MikuFans（自用）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  同步动态替换主Logo和小电视内联SVG Logo为MikuFans，尺寸统一样式精准
// @author       Jinyou
// @license      MIT
// @match        *://www.bilibili.com/*
// @match        *://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529821/Bilibili%E5%AF%BC%E8%88%AA%E6%A0%8FLogo%E6%9B%BF%E6%8D%A2%E4%B8%BAMikuFans%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529821/Bilibili%E5%AF%BC%E8%88%AA%E6%A0%8FLogo%E6%9B%BF%E6%8D%A2%E4%B8%BAMikuFans%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 🔧 配置区：图标链接与尺寸策略
  const config = {
    mainLogo: {
      selector: 'svg.mini-header__logo', // 主Logo选择器
      imgUrl: 'https://pic1.imgdb.cn/item/67d43df388c538a9b5bdb408.png', // 建议Base64
      width: 140, // 主Logo显示宽度
      height: 64 // 主Logo显示高度
    },
    tvIcon: {
      selector: 'svg.zhuzhan-icon', // 小电视选择器
      imgUrl: 'https://pic1.imgdb.cn/item/67d43df388c538a9b5bdb408.png', // 与主Logo同尺寸
      useMainLogoSize: true // 同步主Logo尺寸
    }
  };

  // 🛠️ 核心替换函数
  function replaceElement(targetConfig) {
    const element = document.querySelector(targetConfig.selector);
    if (!element) return;

    // 创建新图片并设置属性
    const newImg = new Image();
    newImg.src = targetConfig.imgUrl;
    newImg.alt = 'custom-icon';
    newImg.style.cssText = getComputedStyle(element).cssText; // 继承原始样式

    // 尺寸策略
    if (targetConfig === config.mainLogo) {
      newImg.style.width = `${config.mainLogo.width}px`;
      newImg.style.height = `${config.mainLogo.height}px`;
    } else if (config.tvIcon.useMainLogoSize) {
      newImg.style.width = `${config.mainLogo.width}px`;
      newImg.style.height = `${config.mainLogo.height}px`;
    }

    // 精确还原布局
    newImg.style.display = 'block';
    newImg.style.margin = '0 10px'; // 调整边距
    newImg.style.objectFit = 'contain'; // 防止拉伸变形
    newImg.style.verticalAlign = 'middle'; // 垂直居中

    // 替换元素并保留父容器结构
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.appendChild(newImg);
    element.parentNode.replaceChild(wrapper, element);
  }

  // 🔄 批量替换 + 动态监听
  function replaceAllIcons() {
    replaceElement(config.mainLogo);
    replaceElement(config.tvIcon);
  }

  // 🚀 启动监听
  const observer = new MutationObserver(replaceAllIcons);
  observer.observe(document, { subtree: true, childList: true });
  replaceAllIcons();
})();