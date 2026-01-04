// ==UserScript==
// @name         微博主题模式自动切换
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  根据浏览器的暗或亮主题设置自动切换微博的主题模式。
// @author       hugepower
// @match        *://weibo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512633/%E5%BE%AE%E5%8D%9A%E4%B8%BB%E9%A2%98%E6%A8%A1%E5%BC%8F%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/512633/%E5%BE%AE%E5%8D%9A%E4%B8%BB%E9%A2%98%E6%A8%A1%E5%BC%8F%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 监听浏览器的主题变化事件
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // 监控浏览器的主题变化并执行切换函数
  mediaQuery.addEventListener('change', (e) => {
	toggleNightMode(e.matches);
  });

  // 初始检查并切换模式
  toggleNightMode(mediaQuery.matches);

  // 根据当前的主题设置进行夜间模式切换
  function toggleNightMode(isDarkMode) {
	// 查找页面上的夜间模式按钮
	const nightModeButton = document.querySelector('div.Dark_box_2i4rW > div > span > button');

	// 如果找不到夜间/日间模式按钮，直接返回
	if (!nightModeButton) {
	  console.log('未找到夜间模式按钮');
	  return;
	}

	// 查找按钮内的 <use> 元素
	const iconUseElement = nightModeButton.querySelector('use');
	if (!iconUseElement) {
	  console.log('未找到图标元素');
	  return;
	}

	// 检查当前的夜间模式状态（#woo_svg_nav_sun 代表夜间模式启用）
	const isNightModeOn = iconUseElement.getAttribute('xlink:href') === '#woo_svg_nav_sun';
	console.log('当前是否是夜间模式:', isNightModeOn);

	// 如果需要切换到夜间模式且当前不是夜间模式，则点击按钮
	if (isDarkMode && !isNightModeOn) {
	  console.log('切换到夜间模式');
	  nightModeButton.click();
	}
	// 如果需要切换到日间模式且当前是夜间模式，则点击按钮
	else if (!isDarkMode && isNightModeOn) {
	  console.log('切换到日间模式');
	  nightModeButton.click();
	} else {
	  console.log('无需切换模式');
	}
  }

})();