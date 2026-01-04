// ==UserScript==
// @name         Discourse Base64 Helper
// @icon         https://raw.githubusercontent.com/XavierBar/Discourse-Base64-Helper/refs/heads/main/discourse.svg
// @namespace    http://tampermonkey.net/
// @version      1.3.13
// @description  Base64编解码工具 for Discourse论坛
// @author       Xavier
// @match        *://linux.do/*
// @match        *://clochat.com/*
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531532/Discourse%20Base64%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531532/Discourse%20Base64%20Helper.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 常量定义
	const Z_INDEX = 2147483647;
	const SELECTORS = {
		POST_CONTENT: '.cooked, .post-body',
		DECODED_TEXT: '.decoded-text',
	};
	const STORAGE_KEYS = {
		BUTTON_POSITION: 'btnPosition',
	};
	const BASE64_REGEX = /(?<!\w)([A-Za-z0-9+/]{6,}?={0,2})(?!\w)/g;
	// 样式常量
	const STYLES = {
		GLOBAL: `
            /* 基础内容样式 */
            .decoded-text {
                cursor: pointer;
                transition: all 0.2s;
                padding: 1px 3px;
                border-radius: 3px;
                background-color: #fff3cd !important;
                color: #664d03 !important;
            }
            .decoded-text:hover {
                background-color: #ffe69c !important;
            }
            /* 通知动画 */
            @keyframes slideIn {
                from {
                    transform: translate(-50%, -20px);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            /* 暗色模式全局样式 */
            @media (prefers-color-scheme: dark) {
                .decoded-text {
                    background-color: #332100 !important;
                    color: #ffd54f !important;
                }
                .decoded-text:hover {
                    background-color: #664d03 !important;
                }
            }
        `,
		NOTIFICATION: `
            .base64-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                z-index: ${Z_INDEX};
                animation: slideIn 0.3s forwards, fadeOut 0.3s 2s forwards;
                font-family: system-ui, -apple-system, sans-serif;
                pointer-events: none;
                backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                max-width: 80vw;
                text-align: center;
                line-height: 1.5;
                background: rgba(255, 255, 255, 0.95);
                color: #2d3748;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .base64-notification[data-type="success"] {
                background: rgba(72, 187, 120, 0.95) !important;
                color: #f7fafc !important;
            }
            .base64-notification[data-type="error"] {
                background: rgba(245, 101, 101, 0.95) !important;
                color: #f8fafc !important;
            }
            .base64-notification[data-type="info"] {
                background: rgba(66, 153, 225, 0.95) !important;
                color: #f7fafc !important;
            }
            @media (prefers-color-scheme: dark) {
                .base64-notification {
                    background: rgba(26, 32, 44, 0.95) !important;
                    color: #e2e8f0 !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .base64-notification[data-type="success"] {
                    background: rgba(22, 101, 52, 0.95) !important;
                }
                .base64-notification[data-type="error"] {
                    background: rgba(155, 28, 28, 0.95) !important;
                }
                .base64-notification[data-type="info"] {
                    background: rgba(29, 78, 216, 0.95) !important;
                }
            }
        `,
		SHADOW_DOM: `
            :host {
                all: initial !important;
                position: fixed !important;
                z-index: ${Z_INDEX} !important;
                pointer-events: none !important;
            }
            .base64-helper {
                position: fixed;
                z-index: ${Z_INDEX} !important;
                transform: translateZ(100px);
                cursor: move;
                font-family: system-ui, -apple-system, sans-serif;
                opacity: 0.5;
                transition: opacity 0.3s ease, transform 0.2s;
                pointer-events: auto !important;
                will-change: transform;
            }
            .base64-helper:hover {
                opacity: 1 !important;
            }
            .main-btn {
                background: #ffffff;
                color: #000000 !important;
                padding: 8px 16px;
                border-radius: 6px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                font-weight: 500;
                user-select: none;
                transition: all 0.2s;
                font-size: 14px;
                cursor: pointer;
                border: none !important;
            }
            .menu {
                position: absolute;
                bottom: calc(100% + 5px);
                right: 0;
                background: #ffffff;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: none;
                min-width: auto !important;
                width: max-content !important;
                overflow: hidden;
            }
            .menu-item {
                padding: 8px 12px !important;
                color: #333 !important;
                transition: all 0.2s;
                font-size: 13px;
                cursor: pointer;
                position: relative;
                border-radius: 0 !important;
                isolation: isolate;
                white-space: nowrap !important;
            }
            .menu-item:hover::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: currentColor;
                opacity: 0.1;
                z-index: -1;
            }
            @media (prefers-color-scheme: dark) {
                .main-btn {
                    background: #2d2d2d;
                    color: #fff !important;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                }
                .menu {
                    background: #1a1a1a;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }
                .menu-item {
                    color: #e0e0e0 !important;
                }
                .menu-item:hover::before {
                    opacity: 0.08;
                }
            }
        `,
	};

	// 样式初始化
	const initStyles = () => {
		GM_addStyle(STYLES.GLOBAL + STYLES.NOTIFICATION);
	};

	class Base64Helper {
		constructor() {
			this.originalContents = new Map();
			this.isDragging = false;
			this.menuVisible = false;
			this.resizeTimer = null;
			this.initUI();
			this.eventListeners = []; // 用于存储事件监听器以便后续清理
			this.initEventListeners();
			this.addRouteListeners();
		}

		// UI 初始化
		initUI() {
			if (document.getElementById('base64-helper-root')) return;

			this.container = document.createElement('div');
			this.container.id = 'base64-helper-root';
			document.body.append(this.container);

			this.shadowRoot = this.container.attachShadow({ mode: 'open' });
			this.shadowRoot.appendChild(this.createShadowStyles());
			this.shadowRoot.appendChild(this.createMainUI());

			this.initPosition();
		}

		createShadowStyles() {
			const style = document.createElement('style');
			style.textContent = STYLES.SHADOW_DOM;
			return style;
		}

		createMainUI() {
			const uiContainer = document.createElement('div');
			uiContainer.className = 'base64-helper';

			this.mainBtn = this.createButton('Base64', 'main-btn');
			this.menu = this.createMenu();

			uiContainer.append(this.mainBtn, this.menu);
			return uiContainer;
		}

		createButton(text, className) {
			const btn = document.createElement('button');
			btn.className = className;
			btn.textContent = text;
			return btn;
		}

		createMenu() {
			const menu = document.createElement('div');
			menu.className = 'menu';

			this.decodeBtn = this.createMenuItem('解析本页 Base64', 'decode');
			this.encodeBtn = this.createMenuItem('文本转 Base64');

			menu.append(this.decodeBtn, this.encodeBtn);
			return menu;
		}

		createMenuItem(text, mode) {
			const item = document.createElement('div');
			item.className = 'menu-item';
			item.textContent = text;
			if (mode) item.dataset.mode = mode;
			return item;
		}

		// 位置管理
		initPosition() {
			const pos = this.positionManager.get() || {
				x: window.innerWidth - 120,
				y: window.innerHeight - 80,
			};

			const ui = this.shadowRoot.querySelector('.base64-helper');
			ui.style.left = `${pos.x}px`;
			ui.style.top = `${pos.y}px`;
		}

		get positionManager() {
			return {
				get: () => {
					const saved = GM_getValue(STORAGE_KEYS.BUTTON_POSITION);
					if (!saved) return null;

					const ui = this.shadowRoot.querySelector('.base64-helper');
					const maxX = window.innerWidth - ui.offsetWidth - 20;
					const maxY = window.innerHeight - ui.offsetHeight - 20;

					return {
						x: Math.min(Math.max(saved.x, 20), maxX),
						y: Math.min(Math.max(saved.y, 20), maxY),
					};
				},
				set: (x, y) => {
					const ui = this.shadowRoot.querySelector('.base64-helper');
					const pos = {
						x: Math.max(
							20,
							Math.min(x, window.innerWidth - ui.offsetWidth - 20)
						),
						y: Math.max(
							20,
							Math.min(y, window.innerHeight - ui.offsetHeight - 20)
						),
					};

					GM_setValue(STORAGE_KEYS.BUTTON_POSITION, pos);
					return pos;
				},
			};
		}

		// 初始化事件监听器
		initEventListeners() {
			const listeners = [
				{
					element: this.mainBtn,
					event: 'click',
					handler: (e) => this.toggleMenu(e),
				},
				{
					element: document,
					event: 'click',
					handler: (e) => this.handleDocumentClick(e),
				},
				{
					element: this.mainBtn,
					event: 'mousedown',
					handler: (e) => this.startDrag(e),
				},
				{ element: document, event: 'mousemove', handler: (e) => this.drag(e) },
				{ element: document, event: 'mouseup', handler: () => this.stopDrag() },
				{
					element: this.decodeBtn,
					event: 'click',
					handler: () => this.handleDecode(),
				},
				{
					element: this.encodeBtn,
					event: 'click',
					handler: () => this.handleEncode(),
				},
				{
					element: window,
					event: 'resize',
					handler: () => this.handleResize(),
				},
			];

			listeners.forEach(({ element, event, handler }) => {
				element.addEventListener(event, handler);
				this.eventListeners.push({ element, event, handler });
			});
		}

		// 清理事件监听器和全局引用
		destroy() {
			// 清理所有事件监听器
			this.eventListeners.forEach(({ element, event, handler }) => {
				element.removeEventListener(event, handler);
			});
			this.eventListeners = [];

			// 清理全局引用
			if (window.__base64HelperInstance === this) {
				delete window.__base64HelperInstance;
			}

			// 清理 Shadow DOM 和其他 DOM 引用
			if (this.container?.parentNode) {
				this.container.parentNode.removeChild(this.container);
			}

			history.pushState = this.originalPushState; // 恢复原始方法
			history.replaceState = this.originalReplaceState; // 恢复原始方法

			//清理 resize 定时器
			clearTimeout(this.resizeTimer);
			clearTimeout(this.notificationTimer); // 清理通知定时器
			clearTimeout(this.routeTimer); // 清理路由定时器
		}

		// 菜单切换
		toggleMenu(e) {
			if (this.clickDebounce) return;
			this.clickDebounce = true;
			setTimeout(() => (this.clickDebounce = false), 200); // 防抖
			e.stopPropagation();
			this.menuVisible = !this.menuVisible;
			this.menu.style.display = this.menuVisible ? 'block' : 'none';
		}

		handleDocumentClick(e) {
			if (this.menuVisible && !this.shadowRoot.contains(e.target)) {
				this.menuVisible = false;
				this.menu.style.display = 'none';
			}
		}

		// 拖拽功能
		startDrag(e) {
			this.isDragging = true;
			this.startX = e.clientX;
			this.startY = e.clientY;
			const rect = this.shadowRoot
				.querySelector('.base64-helper')
				.getBoundingClientRect();
			this.initialX = rect.left;
			this.initialY = rect.top;
			this.shadowRoot.querySelector('.base64-helper').style.transition = 'none';
		}

		drag(e) {
			if (!this.isDragging) return;
			requestAnimationFrame(() => {
				// 🎯 使用动画帧优化
				// 位置计算逻辑
				const dx = e.clientX - this.startX;
				const dy = e.clientY - this.startY;

				const newX = this.initialX + dx;
				const newY = this.initialY + dy;

				const pos = this.positionManager.set(newX, newY);
				const ui = this.shadowRoot.querySelector('.base64-helper');
				ui.style.left = `${pos.x}px`;
				ui.style.top = `${pos.y}px`;
			});
			
		}

		stopDrag() {
			this.isDragging = false;
			this.shadowRoot.querySelector('.base64-helper').style.transition =
				'opacity 0.3s ease';
		}

		// 窗口resize处理
		handleResize() {
			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(() => {
				const pos = this.positionManager.get();
				if (pos) {
					const ui = this.shadowRoot.querySelector('.base64-helper');
					ui.style.left = `${pos.x}px`;
					ui.style.top = `${pos.y}px`;
				}
			}, 100);
		}
		// 路由监听
		addRouteListeners() {
			this.handleRouteChange = () => {
				clearTimeout(this.routeTimer);
				this.routeTimer = setTimeout(() => this.resetState(), 100); // 延迟 100ms 确保 DOM 更新完成
			};
			const routeEvents = [
				// 原生事件必须绑定到 window
				{ event: 'popstate', target: window },
				{ event: 'hashchange', target: window },

				// Discourse自定义事件必须绑定到 document
				{ event: 'routeDidChange', target: document },
				{ event: 'post:added', target: document },
				{ event: 'posts:inserted', target: document },
				{ event: 'post:highlighted', target: document },
				{ event: 'topic:refreshed', target: document },
				{ event: 'discourse:changed', target: document },
				{ event: 'post-stream:posted', target: document },
				{ event: 'post-stream:refresh', target: document },
				{ event: 'composer:opened', target: document },
			];

			routeEvents.forEach(({ event, target }) => {
				target.addEventListener(event, this.handleRouteChange);
				this.eventListeners.push({
					element: target,
					event,
					handler: this.handleRouteChange,
				});
			});

			// 重写 history 方法
			this.originalPushState = history.pushState;
			this.originalReplaceState = history.replaceState;
			history.pushState = (...args) => {
				this.originalPushState.apply(history, args);
				this.handleRouteChange();
			};

			history.replaceState = (...args) => {
				this.originalReplaceState.apply(history, args);
				this.handleRouteChange();
			};
		}

		// 核心功能
		handleDecode() {
			if (this.decodeBtn.dataset.mode === 'restore') {
				this.restoreContent();
				return;
			}

			this.originalContents.clear();
			let hasValidBase64 = false;

			try {
				document.querySelectorAll(SELECTORS.POST_CONTENT).forEach((element) => {
					let newHtml = element.innerHTML;
					let modified = false;

					Array.from(newHtml.matchAll(BASE64_REGEX))
						.reverse()
						.forEach((match) => {
							const original = match[0];
							if (!this.validateBase64(original)) return;

							try {
								const decoded = this.decodeBase64(original);
								this.originalContents.set(element, element.innerHTML);

								newHtml = `${newHtml.substring(
									0,
									match.index
								)}<span class="decoded-text">${decoded}</span>${newHtml.substring(
									match.index + original.length
								)}`;

								hasValidBase64 = modified = true;
							} catch {}
						});

					if (modified) element.innerHTML = newHtml;
				});

				if (!hasValidBase64) {
					this.showNotification('本页未发现有效 Base64 内容', 'info');
					this.originalContents.clear();
					return;
				}

				document.querySelectorAll(SELECTORS.DECODED_TEXT).forEach((el) => {
					el.addEventListener('click', (e) => this.copyToClipboard(e));
				});

				this.decodeBtn.textContent = '恢复本页 Base64';
				this.decodeBtn.dataset.mode = 'restore';
				this.showNotification('解析完成', 'success');
			} catch (e) {
				this.showNotification(`解析失败: ${e.message}`, 'error');
				this.originalContents.clear();
			}

			this.menuVisible = false;
			this.menu.style.display = 'none';
		}

		handleEncode() {
			const text = prompt('请输入要编码的文本：');
			if (text === null) return;

			try {
				const encoded = this.encodeBase64(text);
				GM_setClipboard(encoded);
				this.showNotification('Base64 已复制', 'success');
			} catch (e) {
				this.showNotification('编码失败: ' + e.message, 'error');
			}
			this.menu.style.display = 'none';
		}

		// 工具方法
		validateBase64(str) {
			return (
				typeof str === 'string' &&
				str.length >= 6 &&
				str.length % 4 === 0 &&
				/^[A-Za-z0-9+/]+={0,2}$/.test(str) &&
				str.replace(/=+$/, '').length >= 6
			);
		}

		decodeBase64(str) {
			return decodeURIComponent(
				atob(str)
					.split('')
					.map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
					.join('')
			);
		}

		encodeBase64(str) {
			return btoa(
				encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
					String.fromCharCode(`0x${p1}`)
				)
			);
		}

		restoreContent() {
			this.originalContents.forEach((html, element) => {
				element.innerHTML = html;
			});
			this.originalContents.clear();
			this.decodeBtn.textContent = '解析本页 Base64';
			this.decodeBtn.dataset.mode = 'decode';
			this.showNotification('已恢复原始内容', 'success');
			this.menu.style.display = 'none';
		}

		copyToClipboard(e) {
			GM_setClipboard(e.target.innerText);
			this.showNotification('内容已复制', 'success');
			e.stopPropagation();
		}

		resetState() {
			if (this.decodeBtn.dataset.mode === 'restore') {
				this.restoreContent();
			}
		}
		showNotification(text, type) {
			const notification = document.createElement('div');
			notification.className = 'base64-notification';
			notification.setAttribute('data-type', type);
			notification.textContent = text;
			document.body.appendChild(notification);
			this.notificationTimer = setTimeout(() => notification.remove(), 2300);
		}
	}

	// 防冲突处理
	if (window.__base64HelperInstance) {
		return window.__base64HelperInstance;
	}

	// 初始化
	initStyles();
	const instance = new Base64Helper();
	window.__base64HelperInstance = instance;

	// 页面卸载时清理
	window.addEventListener('unload', () => {
		instance.destroy();
		delete window.__base64HelperInstance;
	});
})();
