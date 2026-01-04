// ==UserScript==
// @name         Aizex增强插件
// @namespace    https://www.klaio.top/
// @version      1.0.2
// @description  Aizex Booster 是一款专门为 Aizex 镜像站 开发的浏览器扩展插件。它提供了一系列实用的增强功能，包括界面元素的显示与隐藏控制、整体界面布局优化及自定义头像等。这些功能能够有效提升用户的浏览体验，让界面使用更加流畅、高效且富有个性化特色。
// @author       NianBroken
// @match        *://*.mana-x.aizex.net/*
// @match        *://*.a.memofun.net/*
// @match        *://*.leopard-x.memofun.net/*
// @match        *://*.arc-c.aizex.me/*
// @match        *://*.mana-c.aizex.net/*
// @match        *://*.leopard-c.aizex.me/*
// @match        *://*.stug-c.memofun.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://aizex.me/favicon.ico
// @homepageURL  https://github.com/NianBroken/Aizex-Booster
// @supportURL   https://github.com/NianBroken/Aizex-Booster/issues
// @copyright    Copyright © 2025 NianBroken. All rights reserved.
// @license      Apache-2.0 license
// @downloadURL https://update.greasyfork.org/scripts/537453/Aizex%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/537453/Aizex%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
	"use strict";

	/**
	 * @file Aizex增强插件
	 * @author NianBroken
	 *
	 * @description
	 * 本脚本采用了一种高鲁棒性、高优先级的架构，以确保在动态内容网站上实现持久且稳定的DOM修改。
	 *
	 * --- 核心架构 ---
	 * 1.  **即时执行 (@run-at document-start):** 脚本在文档元素开始创建之前就已运行，为注入最高优先级的CSS和启动监听器提供了时间窗口。
	 * 2.  **配置驱动 (CONFIG):** 所有的目标元素和操作都被定义在一个集中的配置对象中，实现了逻辑与数据的分离，便于维护。
	 * 3.  **CSS优先策略:** 对于元素隐藏，脚本不直接操作元素的style属性。而是在启动时注入一个带有`!important`规则的`<style>`标签。后续的JS代码仅负责为目标元素添加一个特定的“标记”属性，从而触发预设的CSS规则。这种方式性能更高，且能有效防止样式被覆盖。
	 * 4.  **全时域监控 (MutationObserver):** 脚本的核心是一个`MutationObserver`实例，它监控整个文档的任何变化（元素增删、属性修改）。一旦发生变化，它会重新运行所有检查和处理函数，确保我们的修改在页面整个生命周期内（包括AJAX加载、框架更新等）都持续有效，以此对抗网站自身的DOM恢复行为。
	 */

	/**
	 * ===================================================================================
	 * ============================ 全局配置模块 (Configuration) ===========================
	 * ===================================================================================
	 *
	 * @description
	 * 此对象是本脚本的唯一配置源。所有定制化需求，如隐藏元素、替换文本或图片，
	 * 都应在此处进行修改。请勿直接修改下方的核心逻辑代码。
	 *
	 */
	const CONFIG = {
		/**
		 * @property {boolean} enableLogging - 调试日志开关。
		 * @description 设置为 `true` 将在浏览器的开发者工具控制台中输出详细的操作日志，便于调试和追踪脚本行为。
		 *              在生产环境中建议设置为 `false` 以保持控制台清洁。
		 */
		enableLogging: true,

		/**
		 * @property {Array<Object>} hideElements - 元素隐藏规则配置。
		 * @description 一个包含多个规则对象的数组，用于定义需要隐藏的元素。
		 * @property {string} hideElements[].selector - 目标的CSS选择器。此选择器将用于 `document.querySelectorAll` 来定位一个或多个元素。
		 * @property {string} hideElements[].hideMethod - 隐藏方式。
		 *           - 'remove': 彻底隐藏元素，不占用任何空间 (CSS: `display: none !important;`)。
		 *           - 'hide':   隐藏元素，但保留其原始占位空间 (CSS: `visibility: hidden !important;`)。
		 */
		hideElements: [
			{
				selector: `#toggleButton`,
				hideMethod: "remove",
			},
			{
				selector: `#StatusSidebar`,
				hideMethod: "remove",
			},
			{
				selector: `button.text-token-text-secondary.border-token-border-default`,
				hideMethod: "remove",
			},
		],

		/**
		 * @property {Array<Object>} replaceText - 文本内容替换规则配置。
		 * @description 定义需要被替换文本内容的元素。
		 * @property {string} replaceText[].selector - 目标的CSS选择器。
		 * @property {string} replaceText[].newContent - 用于替换原始文本的新字符串。
		 */
		replaceText: [
			{
				selector: `[data-testid="accounts-profile-button"] .truncate`,
				newContent: `NianBroken`,
			},
			{
				selector: `.text-page-header .text-pretty.whitespace-pre-wrap`,
				newContent: `您好，NianBroken。`,
			},
			{
				selector: `.text-token-text-secondary .pointer-events-auto`,
				newContent: `ChatGPT 也可能会犯错。请核查重要信息。`,
			},
		],

		/**
		 * @property {Array<Object>} replaceImage - 图片源(src)替换规则配置。
		 * @description 定义需要被替换 `src` 属性的 `<img>` 元素。
		 * @property {string} replaceImage[].selector - 目标的CSS选择器。
		 * @property {string} replaceImage[].newSrc - 用于替换原始 `src` 的新图片URL。
		 */
		replaceImage: [
			{
				selector: `[alt="个人资料图片"].object-cover`,
				newSrc: `https://www.klaio.top/images/avatar.jpg`,
			},
		],
	};

	/**
	 * ===================================================================================
	 * ========================== 核心逻辑实现 (Core Implementation) =======================
	 * ===================================================================================
	 */

	/**
	 * @class Logger
	 * @description 一个简单的日志记录器，其输出行为由 `CONFIG.enableLogging` 控制。
	 *              封装了 `console.log` 和 `console.error` 以便统一添加脚本名前缀。
	 */
	const logger = {
		log: (message, ...args) => {
			if (CONFIG.enableLogging) {
				console.log(`[Aizex增强插件] ${message}`, ...args);
			}
		},
		error: (message, ...args) => {
			if (CONFIG.enableLogging) {
				console.error(`[Aizex增强插件] [错误] ${message}`, ...args);
			}
		},
	};

	/**
	 * @function injectPermanentStyles
	 * @description 初始化并注入高优先级的CSS样式规则。
	 * @purpose 在文档的任何内容被渲染之前，预先定义好所有隐藏元素的CSS规则。
	 * @strategy 遍历`CONFIG.hideElements`配置，为每条规则生成一个唯一的HTML属性选择器（例如 `[data-aizex-booster-hide-0]`)，
	 *           并将其与对应的隐藏样式 (`display: none !important;` 或 `visibility: hidden !important;`) 关联。
	 *           最后，将所有生成的规则作为一个单独的`<style>`块，通过`GM_addStyle`注入到文档中。
	 * @rationale 这种方法可以有效避免“内容闪烁”(FOUC)，并通过`!important`确保样式规则的最高优先级，防止被页面自身的CSS覆盖。
	 *            它将复杂的元素定位问题（由JS处理）与高效的样式渲染问题（由CSS引擎处理）解耦，实现了稳定性和性能的最佳平衡。
	 */
	function injectPermanentStyles() {
		let cssString = "";
		CONFIG.hideElements.forEach((rule, index) => {
			// 为每个规则生成一个唯一的、可追踪的属性，作为CSS选择器。
			const uniqueAttrName = `data-aizex-booster-hide-${index}`;
			let style;
			if (rule.hideMethod === "remove") {
				style = "display: none !important;";
			} else if (rule.hideMethod === "hide") {
				style = "visibility: hidden !important;";
			} else {
				logger.error(`配置项 "hideElements" 中存在未知的 hideMethod: "${rule.hideMethod}"`);
				return; // 跳过无效的规则
			}
			cssString += `[${uniqueAttrName}] { ${style} }\n`;
		});

		if (cssString) {
			// 使用 GM_addStyle API 注入样式表。这是Tampermonkey推荐的标准做法，兼容性好。
			GM_addStyle(cssString);
			logger.log("高优先级隐藏CSS已成功注入。");
		}
	}

	/**
	 * @function processHideElements
	 * @description 查找并标记需要隐藏的元素。
	 * @purpose 作为`MutationObserver`的回调任务之一，持续在DOM中寻找并标记目标元素以应用隐藏样式。
	 * @strategy 使用`document.querySelectorAll`根据配置中的选择器查找元素。对找到的每个元素，
	 *           检查其是否已拥有对应的唯一标记属性（如 `data-aizex-booster-hide-0`）。
	 *           如果尚未标记，则通过`setAttribute`为其添加该属性，从而激活`injectPermanentStyles`中注入的CSS规则。
	 * @rationale 此函数具有幂等性（重复执行无副作用）和自愈性。即使页面脚本通过某种方式移除了我们的标记属性，
	 *            下一次DOM变动也会触发此函数，重新完成标记。这确保了隐藏效果的持久性。
	 *            使用`try...catch`可以捕获无效的选择器语法错误，防止整个脚本因单个错误配置而崩溃。
	 */
	function processHideElements() {
		CONFIG.hideElements.forEach((rule, index) => {
			try {
				const elements = document.querySelectorAll(rule.selector);
				if (elements.length > 0) {
					const uniqueAttrName = `data-aizex-booster-hide-${index}`;
					elements.forEach((el) => {
						// 仅在元素未被标记时才进行操作，避免不必要的DOM写操作。
						if (!el.hasAttribute(uniqueAttrName)) {
							el.setAttribute(uniqueAttrName, "true");
							logger.log(`已应用隐藏规则于元素:`, el);
						}
					});
				}
			} catch (e) {
				// 捕获并报告无效的选择器，增强脚本的健壮性。
				logger.error(`处理隐藏规则时发生错误，选择器可能无效: "${rule.selector}"`, e);
			}
		});
	}

	/**
	 * @function processTextReplacements
	 * @description 查找并替换指定元素的文本内容。
	 * @purpose 作为`MutationObserver`的回调任务之一，确保持续地将目标元素的文本内容维持在配置的状态。
	 * @strategy 查找目标元素，并将其`textContent`与配置中的`newContent`进行比较。
	 * @rationale 关键在于**条件性写入**：只有当当前内容与目标内容不符时，才执行替换操作。
	 *            这不仅提高了效率（避免在内容已正确时重复写入），更重要的是实现了对抗性。
	 *            如果页面的前端框架（如React）试图恢复原始文本，此函数会在下一次DOM检查中检测到不一致，并立即将其修正回来。
	 */
	function processTextReplacements() {
		CONFIG.replaceText.forEach((rule) => {
			try {
				const elements = document.querySelectorAll(rule.selector);
				elements.forEach((el) => {
					// 仅当内容不匹配时才更新，这是实现持久化和对抗恢复的关键。
					if (el.textContent !== rule.newContent) {
						el.textContent = rule.newContent;
						logger.log(`已将元素 "${rule.selector}" 的文本内容替换为: "${rule.newContent}"`);
					}
				});
			} catch (e) {
				logger.error(`处理文本替换时发生错误，选择器可能无效: "${rule.selector}"`, e);
			}
		});
	}

	/**
	 * @function processImageReplacements
	 * @description 查找并替换指定`<img>`元素的图片源。
	 * @purpose 作为`MutationObserver`的回调任务之一，确保持续地将目标图片的`src`属性维持在配置的状态。
	 * @strategy 查找目标图片元素，并将其`src`属性与配置中的`newSrc`进行比较。
	 * @rationale 与文本替换同理，通过**条件性写入**来保证效率和对抗性。确保即使图片`src`被动态修改，
	 *            脚本也能迅速地将其恢复为我们指定的值。
	 */
	function processImageReplacements() {
		CONFIG.replaceImage.forEach((rule) => {
			try {
				const elements = document.querySelectorAll(rule.selector);
				elements.forEach((el) => {
					// 确保操作的是一个IMG元素，并且其src与目标不一致。
					if (el.tagName === "IMG" && el.src !== rule.newSrc) {
						el.src = rule.newSrc;
						logger.log(`已将图片 "${rule.selector}" 的源地址替换为: "${rule.newSrc}"`);
					}
				});
			} catch (e) {
				logger.error(`处理图片替换时发生错误，选择器可能无效: "${rule.selector}"`, e);
			}
		});
	}

	/**
	 * @function initializeObserver
	 * @description 创建并启动`MutationObserver`，作为脚本的持久化引擎。
	 * @purpose 建立一个能够响应页面任何DOM变化的机制，从而驱动所有处理函数的持续执行。
	 * @strategy 创建一个`MutationObserver`实例，并将其配置为监视整个文档（`document.documentElement`）的
	 *           所有后代节点（`subtree: true`）、子节点列表变化（`childList: true`）和属性变化（`attributes: true`）。
	 *           该观察者的回调函数会统一调用所有处理任务（隐藏、文本替换、图片替换）。
	 * @rationale 这是应对现代动态网页技术的终极解决方案。无论是初始加载、异步请求（fetch/XHR）更新内容，
	 *            还是前端框架（React, Vue, Angular等）对DOM的精细操作，都会被此观察者捕获。
	 *            这保证了我们的脚本规则在页面的整个生命周期中都能被严格执行，实现了真正的“无限等待”和“自动恢复对抗”。
	 */
	function initializeObserver() {
		// 定义一个统一的任务执行器，每次DOM变动时，按顺序执行所有处理函数。
		const masterTaskRunner = () => {
			processHideElements();
			processTextReplacements();
			processImageReplacements();
		};

		// 创建观察器实例，将任务执行器作为回调。
		const observer = new MutationObserver(masterTaskRunner);

		// 定义观察器的配置，以实现最广泛的监控范围。
		const observerConfig = {
			childList: true,
			subtree: true,
			attributes: true,
		};

		// 将观察器附加到文档的根元素(`<html>`)上。
		// 在`@run-at document-start`阶段，`document.documentElement`是可用的最早的稳定节点。
		observer.observe(document.documentElement, observerConfig);

		// 在观察器启动后，立即手动执行一次所有任务。
		// 这是为了处理在观察器开始监视之前就已经存在于静态HTML中的元素。
		masterTaskRunner();

		logger.log("MutationObserver已启动，开始全时域监控页面变化。");
	}

	// ===================================================================================
	// ========================== 脚本执行入口 (Execution Entry Point) =====================
	// ===================================================================================

	logger.log("脚本启动");

	// 步骤 1: 立即注入CSS样式。
	// 这是在`document-start`阶段执行的关键操作，目的是在任何元素被浏览器渲染之前，
	// 就准备好隐藏规则，从而彻底杜绝目标元素的闪烁。
	injectPermanentStyles();

	// 步骤 2: 初始化并启动MutationObserver。
	// 此步骤建立了脚本的持续监控和修正机制，确保所有规则在页面加载和后续的
	// 所有动态变化中都能被强制执行。
	initializeObserver();
})();
