// ==UserScript==
// @name         Edge Translator Fix Code/Kbd Tag
// @name:en      Edge Translator Fix Code/Kbd Tag
// @name:vi      Sửa lỗi dịch các thẻ code và kbd trong Edge Translator
// @name:zh-CN   Edge翻译器代码和键盘标签修复
// @name:ru      Исправление тегов code и kbd в Edge Translator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fix Edge Translator bug with code and kbd tags
// @description:en  Fix Edge Translator bug with code and kbd tags
// @description:vi  Sửa lỗi dịch các thẻ code và kbd 
// @description:zh-CN 修复Edge翻译器代码和键盘标签的翻译错误
// @description:ru  Исправление ошибок перевода тегов code и kbd в Edge Translator
// @author       Yuusei
// @match        *://*/*
// @license      GPL-3.0-only
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @copyright    2024, Yuusei
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520193/Edge%20Translator%20Fix%20CodeKbd%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/520193/Edge%20Translator%20Fix%20CodeKbd%20Tag.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let isTranslationActive = false;

	function replaceTagToSpan(node) {
		if ((node.tagName === 'CODE' || node.tagName === 'KBD') && node.nodeType === 1 && node.children.length === 0) {
			const spanNode = document.createElement('span');
			const computedStyle = window.getComputedStyle(node);

			const requiredStyles = ['background-color', 'border-radius', 'border', 'box-shadow', 'color', 'display', 'font-size', 'font-family', 'font-weight', 'line-height', 'padding', 'margin', 'color', 'white-space'];

			requiredStyles.forEach(style => {
				spanNode.style[style] = computedStyle.getPropertyValue(style);
			});

			spanNode.innerHTML = node.innerHTML;

			if (node.tagName === 'KBD') {
				spanNode.style.whiteSpace = 'nowrap';
				spanNode.style.width = 'auto';
				spanNode.style.maxWidth = '100%';
			}

			node.parentNode.replaceChild(spanNode, node);
		}
	}

	function processNodeAndChild(node) {
		if (node.nodeType === 1) {
			node.querySelectorAll('code, kbd').forEach(replaceTagToSpan);
		}
	}

	const titleObserver = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.type === 'attributes' && mutation.attributeName === '_msttexthash') {
				const isCurrentlyTranslated = mutation.target.hasAttribute('_msttexthash');
				if (isCurrentlyTranslated && !isTranslationActive) {
					isTranslationActive = true;
					processNodeAndChild(document.body);

					const contentObserver = new MutationObserver(function (mutations) {
						mutations.forEach(function (mutation) {
							if (mutation.type === 'childList' || mutation.type === 'characterData') {
								if (mutation.target.querySelector && (mutation.target.querySelector('code') || mutation.target.querySelector('kbd'))) {
									processNodeAndChild(mutation.target);
								}
							}
						});
					});

					contentObserver.observe(document.body, {
						childList: true,
						subtree: true,
						characterData: true,
					});

					const stopTranslationObserver = new MutationObserver(function (stopMutations) {
						stopMutations.forEach(function (stopMutation) {
							if (!mutation.target.hasAttribute('_msttexthash')) {
								contentObserver.disconnect();
								stopTranslationObserver.disconnect();
								isTranslationActive = false;
								titleObserver.disconnect();
							}
						});
					});

					stopTranslationObserver.observe(mutation.target, {
						attributes: true,
						attributeFilter: ['_msttexthash'],
					});
				}
			}
		});
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initObserver);
	} else {
		initObserver();
	}

	function initObserver() {
		const titleTag = document.querySelector('head > title');
		if (titleTag) {
			titleObserver.observe(titleTag, {
				attributes: true,
			});
		}
	}
})();
