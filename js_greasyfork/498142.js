// ==UserScript==
// @name         正方教务系统首页证件照优化
// @namespace    https://www.klaio.top/
// @version      1.0.7
// @description  将正方教务管理系统首页的证件照由入学后拍摄的证件照改为入学前拍摄的证件照。并删除证件照的圆角、边距，以及恢复证件照的原始比例。
// @author       NianBroken
// @match        *://*/*index_initMenu.html*
// @run-at       document-start
// @grant        none
// @icon         https://www.zfsoft.com/img/zf.ico
// @homepageURL  https://github.com/NianBroken/ZFImageOptimize
// @supportURL   https://github.com/NianBroken/ZFImageOptimize/issues
// @copyright    Copyright © 2024 NianBroken. All rights reserved.
// @license      Apache-2.0 license
// @downloadURL https://update.greasyfork.org/scripts/498142/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%A6%96%E9%A1%B5%E8%AF%81%E4%BB%B6%E7%85%A7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/498142/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%A6%96%E9%A1%B5%E8%AF%81%E4%BB%B6%E7%85%A7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// ================= 常量定义 =================

	/**
	 * 目标 IMG 元素的 CSS 选择器，用于 document.querySelector() 定位
	 */
	const IMG_SELECTOR = '#yhxxIndex > div > a > img';

	/**
	 * 隐藏用于隐藏 IMG 的 <style> 标签 ID
	 */
	const STYLE_ID_HIDE = 'tmImgHide';

	/**
	 * 基础样式的 <style> 标签 ID
	 */
	const STYLE_ID_BASE = 'tmImgBase';

	/**
	 * 原始 URL 参数名和值
	 */
	const PARAM_OLD = 'zplx=rxhzp';

	/**
	 * 替换后的 URL 参数名和值
	 */
	const PARAM_NEW = 'zplx=rxqzp';

	/**
	 * 恢复可见的延迟时间（毫秒）
	 */
	const UNHIDE_DELAY = 100;


	// ================= 工具函数 =================

	/**
	 * 将 <style> 标签插入到页面 <head> 中。如果指定 ID 的样式已存在，则跳过插入。
	 * @param {string} styleId - 要插入或检查的样式标签 ID
	 * @param {string} cssText - <style> 标签的 CSS 内容
	 */
	function insertStyle(styleId, cssText) {
		// 如果页面中已存在相同 ID 的 <style>，则避免重复插入
		if (document.getElementById(styleId)) {
			return;
		}
		// 创建新的 <style> 元素并设置 ID 和 CSS 内容
		const styleEl = document.createElement('style');
		styleEl.id = styleId;
		styleEl.textContent = cssText;

		// 安全地将 <style> 插入到 <head> 中，如果 <head> 不存在，则回退到 <html> 根节点
		const parent = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
		parent.appendChild(styleEl);
	}

	/**
	 * 初始化全局样式，包括隐藏目标 IMG 以及统一高度、圆角和外边距。
	 */
	function initGlobalStyles() {
		// 1. 隐藏目标 IMG，但保留其在布局中的占位，防止页面布局闪动
		const hideCSS = `
            ${IMG_SELECTOR} {
                visibility: hidden !important;
            }
        `;
		insertStyle(STYLE_ID_HIDE, hideCSS);

		// 2. 强制设置高度自适应、无圆角、无外边距，确保样式统一
		const baseCSS = `
            ${IMG_SELECTOR} {
                height: auto !important;
                border-radius: 0 !important;
                margin: 0 !important;
            }
        `;
		insertStyle(STYLE_ID_BASE, baseCSS);
	}

	/**
	 * 无限期等待指定元素出现在 DOM 中。使用 MutationObserver 而非简单的轮询，
	 * 当元素出现时立即停止监听并返回该元素。
	 * @param {string} selector - 需要等待的 CSS 选择器
	 * @returns {Promise<Element>} 找到元素后通过 Promise 返回该元素
	 */
	function waitForElement(selector) {
		return new Promise(resolve => {
			// 先同步检测一次，避免监听延迟
			const existing = document.querySelector(selector);
			if (existing) {
				resolve(existing);
				return;
			}
			// 若未找到，则设置 MutationObserver 监听整个页面的子节点变动
			const observer = new MutationObserver((mutations, obs) => {
				const found = document.querySelector(selector);
				if (found) {
					obs.disconnect(); // 找到后断开监听，释放资源
					resolve(found);
				}
			});
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		});
	}

	/**
	 * 替换目标 IMG 的 src 属性中的指定 URL 参数。
	 * @param {HTMLImageElement} img - 要操作的 IMG 元素
	 * @param {string} oldParam - 需要替换的旧参数
	 * @param {string} newParam - 替换成的新参数
	 */
	function replaceImageParam(img, oldParam, newParam) {
		// 获取当前 src 属性，若不存在则使用空字符串
		const currentSrc = img.getAttribute('src') || '';
		// 只替换指定的参数部分，其它部分保持不变
		const newSrc = currentSrc.replace(oldParam, newParam);
		img.setAttribute('src', newSrc);
	}

	/**
	 * 移除指定 ID 的 <style> 标签，通常用于取消隐藏状态，恢复元素可见性。
	 * @param {string} styleId - 要移除的 <style> 标签 ID
	 */
	function removeStyle(styleId) {
		const styleEl = document.getElementById(styleId);
		if (styleEl && styleEl.parentNode) {
			styleEl.parentNode.removeChild(styleEl);
		}
	}


	// ================= 脚本主逻辑 =================

	// 1. 初始化并插入用于隐藏和统一样式的全局 <style> 标签
	initGlobalStyles();

	// 2. 无限等待目标 IMG 元素出现，一旦找到则执行后续替换和恢复可见性操作
	waitForElement(IMG_SELECTOR).then(img => {
		// 2.1 替换 src 参数
		replaceImageParam(img, PARAM_OLD, PARAM_NEW);

		// 2.2 延迟 UNHIDE_DELAY 毫秒后移除隐藏样式，恢复图片可见
		setTimeout(() => {
			removeStyle(STYLE_ID_HIDE);
		}, UNHIDE_DELAY);
	});

})();