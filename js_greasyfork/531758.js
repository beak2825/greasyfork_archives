// ==UserScript==
// @name         Websites Base64 Helper
// @icon         https://raw.githubusercontent.com/XavierBar/Discourse-Base64-Helper/refs/heads/main/discourse.svg
// @namespace    http://tampermonkey.net/
// @version      1.4.60
// @description  Base64编解码工具 for all websites
// @author       Xavier
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/531758/Websites%20Base64%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531758/Websites%20Base64%20Helper.meta.js
// ==/UserScript==

(function () {
	('use strict');

	// 常量定义
	const Z_INDEX = 2147483647;
	const STORAGE_KEYS = {
		BUTTON_POSITION: 'btnPosition',
		SHOW_NOTIFICATION: 'showNotification',
		HIDE_BUTTON: 'hideButton',
		AUTO_DECODE: 'autoDecode',
	};

	// 存储管理器
	const storageManager = {
		get: (key, defaultValue) => {
			try {
				// 优先从 GM 存储获取
				const value = GM_getValue(`base64helper_${key}`);
				if (value !== undefined) {
					return value;
				}

				// 尝试从 localStorage 迁移数据（兼容旧版本）
				const localValue = localStorage.getItem(`base64helper_${key}`);
				if (localValue !== null) {
					const parsedValue = JSON.parse(localValue);
					// 迁移数据到 GM 存储
					GM_setValue(`base64helper_${key}`, parsedValue);
					// 清理 localStorage 中的旧数据
					localStorage.removeItem(`base64helper_${key}`);
					return parsedValue;
				}

				return defaultValue;
			} catch (e) {
				console.error('Error getting value from storage:', e);
				return defaultValue;
			}
		},
		set: (key, value) => {
			try {
				// 存储到 GM 存储
				GM_setValue(`base64helper_${key}`, value);
				return true;
			} catch (e) {
				console.error('Error setting value to storage:', e);
				return false;
			}
		},
		// 添加删除方法
		remove: (key) => {
			try {
				GM_deleteValue(`base64helper_${key}`);
				return true;
			} catch (e) {
				console.error('Error removing value from storage:', e);
				return false;
			}
		},
		// 添加监听方法
		addChangeListener: (key, callback) => {
			return GM_addValueChangeListener(`base64helper_${key}`,
				(_, oldValue, newValue, remote) => {
					callback(newValue, oldValue, remote);
				}
			);
		},
		// 移除监听方法
		removeChangeListener: (listenerId) => {
			if (listenerId) {
				GM_removeValueChangeListener(listenerId);
			}
		}
	};
	const BASE64_REGEX = /([A-Za-z0-9+/]+={0,2})(?!\w)/g;
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
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
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
            @keyframes slideUpOut {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-30px) scale(0.95);
                    opacity: 0;
                }
            }
            .base64-notifications-container {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: ${Z_INDEX};
                display: flex;
                flex-direction: column;
                gap: 0;
                pointer-events: none;
                align-items: center;
                width: fit-content;
            }
            .base64-notification {
                transform-origin: top center;
                white-space: nowrap;
                padding: 12px 24px;
                border-radius: 8px;
                margin-bottom: 10px;
                animation: slideIn 0.3s ease forwards;
                font-family: system-ui, -apple-system, sans-serif;
                backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
                line-height: 1.5;
                background: rgba(255, 255, 255, 0.95);
                color: #2d3748;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                opacity: 1;
                transform: translateY(0);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, opacity;
                position: relative;
                height: auto;
                max-height: 100px;
            }
            .base64-notification.fade-out {
                animation: slideUpOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                margin-bottom: 0 !important;
                max-height: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                border-width: 0 !important;
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
                cursor: drag;
                font-family: system-ui, -apple-system, sans-serif;
                opacity: 0.5;
                transition: opacity 0.3s ease, transform 0.2s;
                pointer-events: auto !important;
                will-change: transform;
            }
            .base64-helper.dragging {
                cursor: grabbing;
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
                cursor: drag;
                border: none !important;
            }
            .main-btn.dragging {
                cursor: grabbing;
            }
            .menu {
                position: absolute;
                background: #ffffff;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: none;
                min-width: auto !important;
                width: max-content !important;
                overflow: hidden;
            }

            /* 菜单弹出方向 */
            .menu.popup-top {
                bottom: calc(100% + 5px);
            }
            .menu.popup-bottom {
                top: calc(100% + 5px);
            }

            /* 新增: 左对齐样式 */
            .menu.align-left {
                left: 0;
            }
            .menu.align-left .menu-item {
                text-align: left;
            }

            /* 新增: 右对齐样式 */
            .menu.align-right {
                right: 0;
            }
            .menu.align-right .menu-item {
                text-align: right;
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
                // 新增以下样式防止文本被选中
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
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

	// 全局变量存储所有菜单命令ID
	let menuIds = {
		decode: null,
		encode: null,
		reset: null,
		notification: null,
		hideButton: null,
		autoDecode: null
	};

	// 更新菜单命令
	const updateMenuCommands = () => {
		// 取消注册所有菜单命令
		Object.values(menuIds).forEach(id => {
			if (id !== null) {
				try {
					GM_unregisterMenuCommand(id);
				} catch (e) {
					console.error('Failed to unregister menu command:', e);
				}
			}
		});

		// 重置菜单ID对象
		menuIds = {
			decode: null,
			encode: null,
			reset: null,
			notification: null,
			hideButton: null,
			autoDecode: null
		};

		// 检查当前状态，决定解析菜单文本
		const hasDecodedContent = document.querySelectorAll('.decoded-text').length > 0;
		const decodeMenuText = hasDecodedContent ? '恢复本页 Base64' : '解析本页 Base64';

		// 注册解析菜单命令 - 放在第一位
		try {
			menuIds.decode = GM_registerMenuCommand(decodeMenuText, () => {
				if (window.__base64HelperInstance) {
					// 直接调用实例方法
					window.__base64HelperInstance.handleDecode();
					// 操作完成后更新菜单命令
					setTimeout(updateMenuCommands, 100);
				}
			});
			console.log('Registered decode menu command with ID:', menuIds.decode);
		} catch (e) {
			console.error('Failed to register decode menu command:', e);
		}

		// 文本转 Base64
		try {
			menuIds.encode = GM_registerMenuCommand('文本转 Base64', () => {
				if (window.__base64HelperInstance) window.__base64HelperInstance.handleEncode();
			});
			console.log('Registered encode menu command with ID:', menuIds.encode);
		} catch (e) {
			console.error('Failed to register encode menu command:', e);
		}

		// 重置按钮位置
		try {
			menuIds.reset = GM_registerMenuCommand('重置按钮位置', () => {
				if (window.__base64HelperInstance) {
					// 使用 storageManager 存储按钮位置
					storageManager.set(STORAGE_KEYS.BUTTON_POSITION, {
						x: window.innerWidth - 120,
						y: window.innerHeight - 80,
					});
					window.__base64HelperInstance.initPosition();
					window.__base64HelperInstance.showNotification('按钮位置已重置', 'success');
				}
			});
			console.log('Registered reset menu command with ID:', menuIds.reset);
		} catch (e) {
			console.error('Failed to register reset menu command:', e);
		}

		// 显示解析通知开关
		const showNotificationEnabled = storageManager.get(STORAGE_KEYS.SHOW_NOTIFICATION, true);
		try {
			menuIds.notification = GM_registerMenuCommand(`${showNotificationEnabled ? '✅' : '❌'} 显示通知`, () => {
				const newValue = !showNotificationEnabled;
				storageManager.set(STORAGE_KEYS.SHOW_NOTIFICATION, newValue);
				// 使用通知提示用户设置已更改
				if (window.__base64HelperInstance) {
					window.__base64HelperInstance.showNotification(
						`显示通知已${newValue ? '开启' : '关闭'}`,
						'success'
					);
				}
				// 更新菜单文本
				setTimeout(updateMenuCommands, 100);
			});
			console.log('Registered notification menu command with ID:', menuIds.notification);
		} catch (e) {
			console.error('Failed to register notification menu command:', e);
		}

		// 隐藏按钮开关
		const hideButtonEnabled = storageManager.get(STORAGE_KEYS.HIDE_BUTTON, false);
		try {
			menuIds.hideButton = GM_registerMenuCommand(`${hideButtonEnabled ? '✅' : '❌'} 隐藏按钮`, () => {
				const newValue = !hideButtonEnabled;
				storageManager.set(STORAGE_KEYS.HIDE_BUTTON, newValue);
				// 使用通知提示用户设置已更改
				if (window.__base64HelperInstance) {
					window.__base64HelperInstance.showNotification(
						`按钮已${newValue ? '隐藏' : '显示'}`,
						'success'
					);
				}
				// 更新菜单文本
				setTimeout(updateMenuCommands, 100);
			});
			console.log('Registered hideButton menu command with ID:', menuIds.hideButton);
		} catch (e) {
			console.error('Failed to register hideButton menu command:', e);
		}

		// 自动解码开关
		const autoDecodeEnabled = storageManager.get(STORAGE_KEYS.AUTO_DECODE, false);
		try {
			menuIds.autoDecode = GM_registerMenuCommand(`${autoDecodeEnabled ? '✅' : '❌'} 自动解码`, () => {
				const newValue = !autoDecodeEnabled;
				storageManager.set(STORAGE_KEYS.AUTO_DECODE, newValue);

				// 如果启用了自动解码，立即解析页面
				if (newValue) {
					// 检查是否是通过菜单命令触发的变更
					// 如果是通过菜单命令触发，则不再显示确认对话框
					// 因为菜单命令处理程序中已经处理了这些确认

					// 立即解析页面
					this.hasAutoDecodedOnLoad = true; // 标记已执行过自动解码
					setTimeout(() => {
						this.handleDecode();
						// 同步按钮和菜单状态
						setTimeout(() => {
							this.syncButtonAndMenuState();
							// 更新油猴菜单命令
							updateMenuCommands();
						}, 200);
					}, 100);
				} else {
					// 如果关闭了自动解码，也需要同步状态
					setTimeout(() => {
						this.syncButtonAndMenuState();
						// 更新油猴菜单命令
						updateMenuCommands();
					}, 200);
				}
			});
			console.log('Registered autoDecode menu command with ID:', menuIds.autoDecode);
		} catch (e) {
			console.error('Failed to register autoDecode menu command:', e);
		}
	};

	// 菜单命令注册
	const registerMenuCommands = () => {
		// 注册所有菜单命令
		updateMenuCommands();

		// 添加 DOMContentLoaded 事件监听器，确保在页面加载完成后注册菜单命令
		document.addEventListener('DOMContentLoaded', () => {
			console.log('DOMContentLoaded 事件触发，更新菜单命令');
			updateMenuCommands();
		});
	};

	class Base64Helper {
		/**
		 * Base64 Helper 类的构造函数
		 * @description 初始化所有必要的状态和UI组件,仅在主窗口中创建实例
		 * @throws {Error} 当在非主窗口中实例化时抛出错误
		 */
		constructor() {
			// 确保只在主文档中创建实例
			if (window.top !== window.self) {
				throw new Error(
					'Base64Helper can only be instantiated in the main window'
				);
			}

			// 初始化配置
			this.config = {
				showNotification: storageManager.get(STORAGE_KEYS.SHOW_NOTIFICATION, true),
				hideButton: storageManager.get(STORAGE_KEYS.HIDE_BUTTON, false),
				autoDecode: storageManager.get(STORAGE_KEYS.AUTO_DECODE, false)
			};

			this.originalContents = new Map();
			this.isDragging = false;
			this.hasMoved = false;
			this.startX = 0;
			this.startY = 0;
			this.initialX = 0;
			this.initialY = 0;
			this.startTime = 0;
			this.menuVisible = false;
			this.resizeTimer = null;
			this.notifications = [];
			this.notificationContainer = null;
			this.notificationEventListeners = [];
			this.eventListeners = new Map(); // 使用 Map 替代数组，便于管理

			// 添加缓存对象
			this.base64Cache = new Map();
			this.MAX_CACHE_SIZE = 1000; // 最大缓存条目数
			this.MAX_TEXT_LENGTH = 10000; // 最大文本长度限制
			this.cacheHits = 0;
			this.cacheMisses = 0;

			// 添加DOM节点处理跟踪
			this.processedNodes = new WeakSet(); // 使用WeakSet跟踪已处理的节点，避免内存泄漏
			this.decodedTextNodes = new WeakMap(); // 存储节点及其解码状态
			this.processedMutations = new Set(); // 跟踪已处理的mutation记录
			this.nodeReferences = new WeakMap(); // 存储节点引用

			// 初始化配置监听器
			this.configListeners = {
				showNotification: null,
				hideButton: null,
				autoDecode: null,
				buttonPosition: null
			};

			// 添加初始化标志
			this.isInitialLoad = true;
			this.lastDecodeTime = 0;
			this.lastNavigationTime = 0; // 添加前进后退时间记录
			this.isShowingNotification = false; // 添加通知显示标志
			this.hasAutoDecodedOnLoad = false; // 添加标志，跟踪是否已在页面加载时执行过自动解码
			this.isPageRefresh = true; // 添加页面刷新标志，初始加载视为刷新
			this.pageRefreshCompleted = false; // 添加页面刷新完成标志
			this.isRestoringContent = false; // 添加内容恢复标志
			this.isDecodingContent = false; // 添加内容解码标志
			this.lastPageUrl = window.location.href; // 记录当前页面URL
			this.currentMutations = []; // 存储当前的DOM变化记录
			const MIN_DECODE_INTERVAL = 1000; // 最小解码间隔（毫秒）

			// 初始化统一的页面稳定性跟踪器
			this.pageStabilityTracker = {
				// 状态管理
				lastChangeTime: Date.now(),
				changeCount: 0,
				isStable: false,
				pendingDecode: false,
				lastRouteChange: 0,
				lastDomChange: 0,
				stabilityTimer: null,
				decodePendingTimer: null,
				stabilityThreshold: 800, // 降低稳定性阈值，从2000ms降低到800ms
				maxChangeCount: 5,

				// 检查稳定性
				checkStability() {
					const currentTime = Date.now();
					return (currentTime - this.lastRouteChange > this.stabilityThreshold) &&
						   (currentTime - this.lastDomChange > this.stabilityThreshold);
				},

				// 记录变化
				recordChange(type) {
					const currentTime = Date.now();
					this.lastChangeTime = currentTime;

					// 更新对应类型的最后变化时间
					if (type === 'Route') {
						this.lastRouteChange = currentTime;
					} else if (type === 'Dom') {
						this.lastDomChange = currentTime;
					}

					this.isStable = false;
					this.changeCount++;

					if (this.changeCount > this.maxChangeCount) {
						this.changeCount = 1;
					}

					// 清除之前的定时器
					clearTimeout(this.stabilityTimer);
					clearTimeout(this.decodePendingTimer);

					console.log(`记录${type}变化，重置稳定性定时器`);
				},

				// 重置状态
				reset() {
					this.changeCount = 0;
					this.isStable = false;
					this.pendingDecode = false;
					clearTimeout(this.stabilityTimer);
					clearTimeout(this.decodePendingTimer);
				}
			};

			// 添加配置监听
			this.setupConfigListeners();

			// 初始化UI
			this.initUI();
			this.initEventListeners();
			this.addRouteListeners();

			// 优化自动解码的初始化逻辑
			// 在构造函数中不直接执行自动解码，而是通过 resetState 方法处理
			if (this.config.autoDecode) {
				const currentTime = Date.now();
				// 确保足够的时间间隔
				if (currentTime - this.lastDecodeTime > MIN_DECODE_INTERVAL) {
					this.lastDecodeTime = currentTime;
					console.log('构造函数中准备执行 resetState');
					// 使用 requestIdleCallback 在浏览器空闲时执行
					if (window.requestIdleCallback) {
						requestIdleCallback(() => this.resetState(), { timeout: 2000 });
					} else {
						// 降级使用 setTimeout
						setTimeout(() => this.resetState(), 800);
					}
				}
			}

			// 添加DOM加载完成后的一次性解析
			const handleDOMReady = () => {
				// 重置标志
				this.isInitialLoad = false;
				this.isPageRefresh = false; // 重置页面刷新标志
				this.pageRefreshCompleted = true; // 设置页面刷新完成标志

				// 检查页面上是否已有解码内容
				const hasDecodedContent = document.querySelectorAll('.decoded-text').length > 0;

				// 如果页面上已有解码内容，更新菜单状态
				if (hasDecodedContent) {
					console.log('页面上已有解码内容，更新菜单状态');
					if (this.decodeBtn) {
						this.decodeBtn.textContent = '恢复本页 Base64';
						this.decodeBtn.dataset.mode = 'restore';
					}
					setTimeout(updateMenuCommands, 100);
				}
				// 注意：我们在这里不执行解码，而是依赖resetState中的解码逻辑
				// 这样可以避免刷新页面时解码两次导致的文本抖动
			};

			// 如果文档已经加载完成，直接执行
			if (document.readyState === 'complete') {
				console.log('文档已加载完成，直接执行解析');
				handleDOMReady();
			} else {
				// 否则等待文档加载完成
				console.log('等待文档加载完成后执行解析');
				window.addEventListener('load', handleDOMReady, { once: true });
			}

			// 添加防抖相关的变量
			this.decodeDebounceTimer = null;
			this.notificationDebounceTimer = null;
			this.lastDecodeTime = 0;
			this.lastNotificationTime = 0;
			this.DECODE_DEBOUNCE_DELAY = 2000; // 解码防抖延迟时间（毫秒）
			this.NOTIFICATION_DEBOUNCE_DELAY = 3000; // 通知防抖延迟时间（毫秒）
		}

		/**
		 * 设置配置监听器
		 * @description 为各个配置项添加监听器，实现配置变更的实时响应
		 */
		setupConfigListeners() {
			// 清理现有监听器
			Object.values(this.configListeners).forEach(listenerId => {
				if (listenerId) {
					storageManager.removeChangeListener(listenerId);
				}
			});

			// 监听显示通知设置变更
			this.configListeners.showNotification = storageManager.addChangeListener(
				STORAGE_KEYS.SHOW_NOTIFICATION,
				(newValue) => {
					console.log('显示通知设置已更改:', newValue);
					this.config.showNotification = newValue;
				}
			);

			// 监听隐藏按钮设置变更
			this.configListeners.hideButton = storageManager.addChangeListener(
				STORAGE_KEYS.HIDE_BUTTON,
				(newValue) => {
					console.log('隐藏按钮设置已更改:', newValue);
					this.config.hideButton = newValue;

					// 实时更新UI显示状态
					const ui = this.shadowRoot?.querySelector('.base64-helper');
					if (ui) {
						ui.style.display = newValue ? 'none' : 'block';
					}
				}
			);

			// 监听自动解码设置变更
			this.configListeners.autoDecode = storageManager.addChangeListener(
				STORAGE_KEYS.AUTO_DECODE,
				(newValue) => {
					console.log('自动解码设置已更改:', newValue);
					this.config.autoDecode = newValue;

					// 如果启用了自动解码，立即解析页面
					if (newValue) {
						// 检查是否是通过菜单命令触发的变更
						// 如果是通过菜单命令触发，则不再显示确认对话框
						// 因为菜单命令处理程序中已经处理了这些确认

						// 立即解析页面
						this.hasAutoDecodedOnLoad = true; // 标记已执行过自动解码
						setTimeout(() => {
							this.handleDecode();
							// 同步按钮和菜单状态
							setTimeout(() => {
								this.syncButtonAndMenuState();
								// 更新油猴菜单命令
								updateMenuCommands();
							}, 200);
						}, 100);
					} else {
						// 如果关闭了自动解码，也需要同步状态
						setTimeout(() => {
							this.syncButtonAndMenuState();
							// 更新油猴菜单命令
							updateMenuCommands();
						}, 200);
					}
				}
			);

			// 监听按钮位置变更
			this.configListeners.buttonPosition = storageManager.addChangeListener(
				STORAGE_KEYS.BUTTON_POSITION,
				(newValue) => {
					console.log('按钮位置已更改:', newValue);
					// 更新按钮位置
					this.initPosition();
				}
			);
		}

		// 添加正则常量
		static URL_PATTERNS = {
			URL: /^(?:(?:https?|ftp):\/\/)?(?:(?:[\w-]+\.)+[a-z]{2,}|localhost)(?::\d+)?(?:\/[^\s]*)?$/i,
			EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			DOMAIN_PATTERNS: {
				POPULAR_SITES:
					/(?:google|youtube|facebook|twitter|instagram|linkedin|github|gitlab|bitbucket|stackoverflow|reddit|discord|twitch|tiktok|snapchat|pinterest|netflix|amazon|microsoft|apple|adobe)/i,
				VIDEO_SITES:
					/(?:bilibili|youku|iqiyi|douyin|kuaishou|nicovideo|vimeo|dailymotion)/i,
				CN_SITES:
					/(?:baidu|weibo|zhihu|taobao|tmall|jd|qq|163|sina|sohu|csdn|aliyun|tencent)/i,
				TLD: /\.(?:com|net|org|edu|gov|mil|biz|info|io|cn|me|tv|cc|uk|jp|ru|eu|au|de|fr)(?:\/|\?|#|$)/i,
			},
		};

		// UI 初始化
		initUI() {
			if (
				window.top !== window.self ||
				document.getElementById('base64-helper-root')
			) {
				return;
			}

			this.container = document.createElement('div');
			this.container.id = 'base64-helper-root';
			document.body.append(this.container);

			this.shadowRoot = this.container.attachShadow({ mode: 'open' });
			this.shadowRoot.appendChild(this.createShadowStyles());

			// 创建 UI 容器
			const uiContainer = document.createElement('div');
			uiContainer.className = 'base64-helper';
			uiContainer.style.cursor = 'grab';

			// 创建按钮和菜单
			this.mainBtn = this.createButton('Base64', 'main-btn');
			this.menu = this.createMenu();
			this.decodeBtn = this.menu.querySelector('[data-mode="decode"]');
			this.encodeBtn = this.menu.querySelector('.menu-item:not([data-mode])');

			// 添加到 UI 容器
			uiContainer.append(this.mainBtn, this.menu);
			this.shadowRoot.appendChild(uiContainer);

			// 初始化位置
			this.initPosition();

			// 如果配置为隐藏按钮，则设置为不可见
			if (this.config.hideButton) {
				uiContainer.style.display = 'none';
			}
		}

		createShadowStyles() {
			const style = document.createElement('style');
			style.textContent = STYLES.SHADOW_DOM;
			return style;
		}

		// 不再需要 createMainUI 方法，因为我们直接在 initUI 中创建 UI

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

			// 新增: 初始化时更新菜单对齐
			this.updateMenuAlignment();
		}
		updateMenuAlignment() {
			const ui = this.shadowRoot.querySelector('.base64-helper');
			const menu = this.menu;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const uiRect = ui.getBoundingClientRect();
			const centerX = uiRect.left + uiRect.width / 2;
			const centerY = uiRect.top + uiRect.height / 2;

			// 判断按钮是在页面左半边还是右半边
			if (centerX < windowWidth / 2) {
				// 左对齐
				menu.classList.remove('align-right');
				menu.classList.add('align-left');
			} else {
				// 右对齐
				menu.classList.remove('align-left');
				menu.classList.add('align-right');
			}

			// 判断按钮是在页面上半部分还是下半部分
			if (centerY < windowHeight / 2) {
				// 在页面上方，菜单向下弹出
				menu.classList.remove('popup-top');
				menu.classList.add('popup-bottom');
			} else {
				// 在页面下方，菜单向上弹出
				menu.classList.remove('popup-bottom');
				menu.classList.add('popup-top');
			}
		}
		get positionManager() {
			return {
				get: () => {
					// 使用 storageManager 获取按钮位置
					const saved = storageManager.get(STORAGE_KEYS.BUTTON_POSITION, null);
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

					// 使用 storageManager 存储按钮位置
					storageManager.set(STORAGE_KEYS.BUTTON_POSITION, pos);
					return pos;
				},
			};
		}

		// 初始化事件监听器
		initEventListeners() {
			this.addUnifiedEventListeners();
			this.addGlobalClickListeners();

			// 核心编解码事件监听
			const commonListeners = [
				{
					element: this.decodeBtn,
					events: [
						{
							name: 'click',
							handler: (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.handleDecode();
							},
						},
					],
				},
				{
					element: this.encodeBtn,
					events: [
						{
							name: 'click',
							handler: (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.handleEncode();
							},
						},
					],
				},
			];

			commonListeners.forEach(({ element, events }) => {
				events.forEach(({ name, handler }) => {
					element.addEventListener(name, handler, { passive: false });
					this.eventListeners.set(name, { element, event: name, handler });
				});
			});
		}

		addUnifiedEventListeners() {
			const ui = this.shadowRoot.querySelector('.base64-helper');
			const btn = this.mainBtn;

			// 统一的开始事件处理
			const startHandler = (e) => {
				e.preventDefault();
				e.stopPropagation();
				const point = e.touches ? e.touches[0] : e;
				this.isDragging = true;
				this.hasMoved = false;
				this.startX = point.clientX;
				this.startY = point.clientY;
				const rect = ui.getBoundingClientRect();
				this.initialX = rect.left;
				this.initialY = rect.top;
				this.startTime = Date.now();
				ui.style.transition = 'none';
				ui.classList.add('dragging');
				btn.style.cursor = 'grabbing';
			};

			// 统一的移动事件处理
			const moveHandler = (e) => {
				if (!this.isDragging) return;
				e.preventDefault();
				e.stopPropagation();

				const point = e.touches ? e.touches[0] : e;
				const moveX = Math.abs(point.clientX - this.startX);
				const moveY = Math.abs(point.clientY - this.startY);

				if (moveX > 5 || moveY > 5) {
					this.hasMoved = true;
					const dx = point.clientX - this.startX;
					const dy = point.clientY - this.startY;
					const newX = Math.min(
						Math.max(20, this.initialX + dx),
						window.innerWidth - ui.offsetWidth - 20
					);
					const newY = Math.min(
						Math.max(20, this.initialY + dy),
						window.innerHeight - ui.offsetHeight - 20
					);
					ui.style.left = `${newX}px`;
					ui.style.top = `${newY}px`;
				}
			};

			// 统一的结束事件处理
			const endHandler = (e) => {
				if (!this.isDragging) return;
				e.preventDefault();
				e.stopPropagation();

				this.isDragging = false;
				ui.classList.remove('dragging');
				btn.style.cursor = 'grab';
				ui.style.transition = 'opacity 0.3s ease';

				const duration = Date.now() - this.startTime;
				if (duration < 200 && !this.hasMoved) {
					this.toggleMenu(e);
				} else if (this.hasMoved) {
					const rect = ui.getBoundingClientRect();
					const pos = this.positionManager.set(rect.left, rect.top);
					ui.style.left = `${pos.x}px`;
					ui.style.top = `${pos.y}px`;
					// 新增: 拖动结束后更新菜单对齐
					this.updateMenuAlignment();
				}
			};

			// 统一收集所有事件监听器
			const listeners = [
				{
					element: ui,
					event: 'touchstart',
					handler: startHandler,
					options: { passive: false },
				},
				{
					element: ui,
					event: 'touchmove',
					handler: moveHandler,
					options: { passive: false },
				},
				{
					element: ui,
					event: 'touchend',
					handler: endHandler,
					options: { passive: false },
				},
				{ element: ui, event: 'mousedown', handler: startHandler },
				{ element: document, event: 'mousemove', handler: moveHandler },
				{ element: document, event: 'mouseup', handler: endHandler },
				{
					element: this.menu,
					event: 'touchstart',
					handler: (e) => e.stopPropagation(),
					options: { passive: false },
				},
				{
					element: this.menu,
					event: 'mousedown',
					handler: (e) => e.stopPropagation(),
				},
				{
					element: window,
					event: 'resize',
					handler: () => this.handleResize(),
				},
			];

			// 注册事件并保存引用
			listeners.forEach(({ element, event, handler, options }) => {
				element.addEventListener(event, handler, options);
				this.eventListeners.set(event, { element, event, handler, options });
			});
		}

		toggleMenu(e) {
			e?.preventDefault();
			e?.stopPropagation();

			// 如果正在拖动或已移动，不处理菜单切换
			if (this.isDragging || this.hasMoved) return;

			this.menuVisible = !this.menuVisible;
			if (this.menuVisible) {
				// 在显示菜单前更新位置
				this.updateMenuAlignment();
			}
			this.menu.style.display = this.menuVisible ? 'block' : 'none';

			// 重置状态
			this.hasMoved = false;
		}

		addGlobalClickListeners() {
			const handleOutsideClick = (e) => {
				const ui = this.shadowRoot.querySelector('.base64-helper');
				const path = e.composedPath();
				if (!path.includes(ui) && this.menuVisible) {
					this.menuVisible = false;
					this.menu.style.display = 'none';
				}
			};

			// 将全局点击事件添加到 eventListeners 数组
			const globalListeners = [
				{
					element: document,
					event: 'click',
					handler: handleOutsideClick,
					options: true,
				},
				{
					element: document,
					event: 'touchstart',
					handler: handleOutsideClick,
					options: { passive: false },
				},
			];

			globalListeners.forEach(({ element, event, handler, options }) => {
				element.addEventListener(event, handler, options);
				this.eventListeners.set(event, { element, event, handler, options });
			});
		}

		// 路由监听
		addRouteListeners() {
			// 统一的路由变化处理函数
			this.handleRouteChange = () => {
				console.log('路由变化被检测到');
				// 使用防抖，避免短时间内多次触发
				clearTimeout(this.routeTimer);

				// 添加时间检查，避免短时间内多次触发
				const currentTime = Date.now();
				if (currentTime - this.lastDecodeTime < 1000) {
					console.log('距离上次解码时间太短，跳过这次路由变化');
					return;
				}

				// 如果启用了自动解码，直接执行全页解码
				if (this.config.autoDecode) {
					console.log('路由变化，执行全页解码');
					// 确保没有正在进行的处理
					if (!this.isProcessing && !this.isDecodingContent && !this.isRestoringContent) {
						// 使用延时确保页面内容已更新
						setTimeout(() => {
							this.handleAutoDecode(true, true);
						}, 500);
					}
				}
			};

			// 添加路由相关事件到 eventListeners 数组
			const routeListeners = [
				{
					element: window,
					event: 'popstate',
					handler: (e) => {
						console.log('检测到popstate前进后退事件');
						// 重置页面状态标志
						this.isInitialLoad = false;
						this.isPageRefresh = false;
						this.pageRefreshCompleted = true;

						// 创建一个临时的MutationObserver来监听页面内容变化
						const tempObserver = new MutationObserver((mutations) => {
							// 检查是否有显著的DOM变化
							const hasSignificantChanges = mutations.some(mutation => {
								// 忽略文本节点的变化
								if (mutation.type === 'characterData') return false;

								// 忽略样式相关的属性变化
								if (mutation.type === 'attributes' &&
									(mutation.attributeName === 'style' ||
									 mutation.attributeName === 'class')) {
									return false;
								}

								// 检查是否是重要的DOM变化
								const isImportantNode = (node) => {
									return node.nodeType === 1 && // 元素节点
										(node.tagName === 'DIV' ||
										 node.tagName === 'ARTICLE' ||
										 node.tagName === 'SECTION' ||
										 node.tagName === 'MAIN');
								};

								return Array.from(mutation.addedNodes).some(isImportantNode) ||
									   Array.from(mutation.removedNodes).some(isImportantNode);
							});

							if (hasSignificantChanges) {
								console.log('检测到新页面内容加载完成');
								// 停止观察
								tempObserver.disconnect();
								// 执行解码
								if (this.config.autoDecode) {
									setTimeout(() => {
										this.handleAutoDecode(true, true);
									}, 500);
								}
							}
						});

						// 开始观察页面变化
						tempObserver.observe(document.body, {
							childList: true,
							subtree: true,
							attributes: false,
							characterData: false
						});

						// 设置超时，防止页面变化检测失败
						setTimeout(() => {
							tempObserver.disconnect();
							if (this.config.autoDecode) {
								this.handleAutoDecode(true, true);
							}
						}, 3000);
					}
				},
				{
					element: window,
					event: 'hashchange',
					handler: this.handleRouteChange,
				},
				{
					element: window,
					event: 'DOMContentLoaded',
					handler: this.handleRouteChange,
				},
				{
					element: document,
					event: 'readystatechange',
					handler: () => {
						if (document.readyState === 'complete') {
							this.handleRouteChange();
						}
					},
				},
				{
					element: window,
					event: 'pageshow',
					handler: (e) => {
						console.log('检测到pageshow事件');
						// 重置页面状态标志
						this.isInitialLoad = false;
						this.isPageRefresh = false;
						this.pageRefreshCompleted = true;

						// 创建一个临时的MutationObserver来监听页面内容变化
						const tempObserver = new MutationObserver((mutations) => {
							// 检查是否有显著的DOM变化
							const hasSignificantChanges = mutations.some(mutation => {
								// 忽略文本节点的变化
								if (mutation.type === 'characterData') return false;

								// 忽略样式相关的属性变化
								if (mutation.type === 'attributes' &&
									(mutation.attributeName === 'style' ||
									 mutation.attributeName === 'class')) {
									return false;
								}

								// 检查是否是重要的DOM变化
								const isImportantNode = (node) => {
									return node.nodeType === 1 && // 元素节点
										(node.tagName === 'DIV' ||
										 node.tagName === 'ARTICLE' ||
										 node.tagName === 'SECTION' ||
										 node.tagName === 'MAIN');
								};

								return Array.from(mutation.addedNodes).some(isImportantNode) ||
									   Array.from(mutation.removedNodes).some(isImportantNode);
							});

							if (hasSignificantChanges) {
								console.log('检测到新页面内容加载完成');
								// 停止观察
								tempObserver.disconnect();
								// 执行解码
								if (this.config.autoDecode) {
									setTimeout(() => {
										this.handleAutoDecode(true, true);
									}, 500);
								}
							}
						});

						// 开始观察页面变化
						tempObserver.observe(document.body, {
							childList: true,
							subtree: true,
							attributes: false,
							characterData: false
						});

						// 设置超时，防止页面变化检测失败
						setTimeout(() => {
							tempObserver.disconnect();
							if (this.config.autoDecode) {
								this.handleAutoDecode(true, true);
							}
						}, 3000);
					},
				},
				{
					element: window,
					event: 'pagehide',
					handler: this.handleRouteChange,
				},
			];

			// 确保在页面加载完成后添加事件监听器
			if (document.readyState === 'complete') {
				routeListeners.forEach(({ element, event, handler }) => {
					element.addEventListener(event, handler);
					this.eventListeners.set(event, { element, event, handler });
				});
			} else {
				window.addEventListener('load', () => {
					routeListeners.forEach(({ element, event, handler }) => {
							element.addEventListener(event, handler);
							this.eventListeners.set(event, { element, event, handler });
					});
				}, { once: true });
			}

			// 修改 history 方法
			this.originalPushState = history.pushState;
			this.originalReplaceState = history.replaceState;
			history.pushState = (...args) => {
				this.originalPushState.apply(history, args);
				console.log('history.pushState 被调用');
				this.handleRouteChange();
			};
			history.replaceState = (...args) => {
				this.originalReplaceState.apply(history, args);
				console.log('history.replaceState 被调用');
				this.handleRouteChange();
			};

			// 优化 MutationObserver 配置
			this.observer = new MutationObserver((mutations) => {
				// 如果正在处理中或正在显示通知，跳过这次变化
				if (this.isProcessing || this.isShowingNotification || this.isDecodingContent || this.isRestoringContent) {
					console.log('正在处理中或显示通知，跳过 DOM 变化检测');
					return;
				}

				// 添加防止短时间内重复触发的防抖
				const currentTime = Date.now();
				if (currentTime - this.lastDecodeTime < 1500) {
					console.log('距离上次解码时间太短，跳过这次 DOM 变化检测');
					return;
				}

				// 存储mutations供后续使用
				this.currentMutations = mutations;

				// 检查是否有显著的 DOM 变化
				const significantChanges = mutations.some(mutation => {
					// 忽略文本节点的变化
					if (mutation.type === 'characterData') return false;

					// 忽略样式相关的属性变化
					if (mutation.type === 'attributes' &&
						(mutation.attributeName === 'style' ||
						 mutation.attributeName === 'class')) {
						return false;
					}

					// 排除通知容器的变化
					if (mutation.target &&
						(mutation.target.classList?.contains('base64-notifications-container') ||
						 mutation.target.classList?.contains('base64-notification'))) {
						return false;
					}

					// 检查添加的节点是否与通知相关
					const isNotificationNode = (node) => {
						if (node.nodeType !== 1) return false; // 非元素节点
						return node.classList?.contains('base64-notifications-container') ||
							   node.classList?.contains('base64-notification') ||
							   node.closest('.base64-notifications-container') !== null;
					};

					// 如果添加的节点是通知相关的，则忽略
					if (Array.from(mutation.addedNodes).some(isNotificationNode)) {
						return false;
					}

					// 如果有大量节点添加或删除，可能是路由变化
					if (mutation.addedNodes.length > 5 || mutation.removedNodes.length > 5) {
						return true;
					}

					// 检查是否是重要的 DOM 变化
					const isImportantNode = (node) => {
						return node.nodeType === 1 && // 元素节点
							(node.tagName === 'DIV' ||
							 node.tagName === 'ARTICLE' ||
							 node.tagName === 'SECTION');
					};

					return Array.from(mutation.addedNodes).some(isImportantNode) ||
						   Array.from(mutation.removedNodes).some(isImportantNode);
				});

				if (significantChanges && this.config.autoDecode) {
					console.log('检测到显著的 DOM 变化，可能是路由变化');
					this.handleRouteChange();
				}
			});

			// 优化 MutationObserver 观察选项
			this.observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: false, // 不观察属性变化
				characterData: false // 不观察文本变化
			});

			// 监听路由变化
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList' || mutation.type === 'subtree') {
						// 检查是否是路由变化
						if (window.location.href !== this.lastUrl) {
							this.lastUrl = window.location.href;
							console.log('检测到路由变化，准备执行解码');

							// 重置状态
							this.resetState();

							// 如果启用了自动解码，等待页面稳定后执行
							if (this.config.autoDecode) {
								setTimeout(() => {
									const { nodesToReplace, validDecodedCount } = this.processTextNodes();
									if (validDecodedCount > 0) {
										this.replaceNodes(nodesToReplace);
										setTimeout(() => {
											this.addClickListenersToDecodedText();
											this.debouncedShowNotification(`解码成功，共找到 ${validDecodedCount} 个 Base64 内容`, 'success');
											this.syncButtonAndMenuState();
										}, 100);
									}
								}, 500);
							}
						}
					}
				});
			});
		}

		/**
		 * 处理自动解码
		 * @description 根据不同场景选择全页解码或增量解码
		 * @param {boolean} [forceFullDecode=false] - 是否强制全页面解码
		 * @param {boolean} [showNotification=false] - 是否显示通知
		 */
		handleAutoDecode(forceFullDecode = false, showNotification = false) {
			// 防止重复处理
			if (this.isProcessing || this.isShowingNotification || this.isDecodingContent || this.isRestoringContent) {
				console.log('正在处理中，跳过自动解码请求');
				return;
			}

			// 控制通知显示
			this.suppressNotification = !showNotification;

			// 更新最后解码时间
			this.lastDecodeTime = Date.now();

			console.log('执行全页面解码');
			// 使用processTextNodes方法进行解码
			const { nodesToReplace, validDecodedCount } = this.processTextNodes();

			if (validDecodedCount > 0) {
				// 分批处理节点替换
				const BATCH_SIZE = 50;
				const processNodesBatch = (startIndex) => {
					const endIndex = Math.min(startIndex + BATCH_SIZE, nodesToReplace.length);
					const batch = nodesToReplace.slice(startIndex, endIndex);

					this.replaceNodes(batch);

					if (endIndex < nodesToReplace.length) {
						setTimeout(() => processNodesBatch(endIndex), 0);
					} else {
						setTimeout(() => {
							this.addClickListenersToDecodedText();
							if (showNotification) {
								this.showNotification(`解码成功，共找到 ${validDecodedCount} 个 Base64 内容`, 'success');
							}
							// 同步按钮和菜单状态
							this.syncButtonAndMenuState();
							// 更新油猴菜单命令
							updateMenuCommands();
						}, 100);
					}
				};

				processNodesBatch(0);
			}

			// 同步按钮和菜单状态
			setTimeout(() => {
				this.syncButtonAndMenuState();
				// 更新油猴菜单命令
				updateMenuCommands();
			}, 200);
		}

		/**
		 * 处理页面中的Base64解码操作
		 * @description 根据当前模式执行解码或恢复操作
		 * 如果当前模式是restore则恢复原始内容,否则查找并解码页面中的Base64内容
		 * @fires showNotification 显示操作结果通知
		 */
		handleDecode() {
			// 检查当前模式
			const hasDecodedContent = document.querySelectorAll('.decoded-text').length > 0;
			const currentMode = this.decodeBtn?.dataset.mode === 'restore' || hasDecodedContent ? 'restore' : 'decode';

			// 如果是恢复模式
			if (currentMode === 'restore') {
				this.restoreContent();
				return;
			}

			// 防止重复处理或在显示通知时触发
			if (this.isProcessing || this.isShowingNotification || this.isDecodingContent || this.isRestoringContent) {
				console.log('正在处理中，跳过解码请求');
				return;
			}

			try {
				// 隐藏菜单
				if (this.menu && this.menu.style.display !== 'none') {
					this.menu.style.display = 'none';
					this.menuVisible = false;
				}

				// 执行解码
				this.isDecodingContent = true;
				const { nodesToReplace, validDecodedCount } = this.processTextNodes();

				if (validDecodedCount === 0) {
					this.showNotification('本页未发现有效 Base64 内容', 'info');
					this.menuVisible = false;
					this.menu.style.display = 'none';
					// 重置处理标志
					this.isProcessing = false;
					this.isDecodingContent = false;
					// 更新最后解码时间
					this.lastDecodeTime = Date.now();
					return;
				}

				// 分批处理节点替换，避免大量 DOM 操作导致界面冻结
				const BATCH_SIZE = 50;
				const processNodesBatch = (startIndex) => {
					const endIndex = Math.min(startIndex + BATCH_SIZE, nodesToReplace.length);
					const batch = nodesToReplace.slice(startIndex, endIndex);

					this.replaceNodes(batch);

					if (endIndex < nodesToReplace.length) {
						// 还有更多节点需要处理，安排下一批
						setTimeout(() => processNodesBatch(endIndex), 0);
					} else {
						// 所有节点处理完成，添加点击监听器
						setTimeout(() => {
							this.addClickListenersToDecodedText();
						}, 100);

						// 更新按钮状态
						if (this.decodeBtn) {
							this.decodeBtn.textContent = '恢复本页 Base64';
							this.decodeBtn.dataset.mode = 'restore';
						}

						// 显示通知，除非被抑制
						if (!this.suppressNotification) {
							this.showNotification(
								`解码成功，共找到 ${validDecodedCount} 个 Base64 内容`,
								'success'
							);
						}

						// 操作完成后同步按钮和菜单状态
						this.syncButtonAndMenuState();
						// 更新油猴菜单命令
						updateMenuCommands();

						// 重置处理标志
						this.isProcessing = false;
						this.isDecodingContent = false;

						// 更新最后解码时间
						this.lastDecodeTime = Date.now();
					}
				};

				// 开始分批处理
				processNodesBatch(0);
			} catch (e) {
				console.error('Base64 decode error:', e);
				// 显示错误通知
				this.showNotification(`解析失败: ${e.message}`, 'error');
				this.menuVisible = false;
				this.menu.style.display = 'none';
				// 重置处理标志
				this.isProcessing = false;
				this.isDecodingContent = false;
				// 更新最后解码时间
				this.lastDecodeTime = Date.now();
			}
		}

		/**
		 * 处理文本节点中的Base64内容
		 * @description 遍历文档中的文本节点,查找并处理其中的Base64内容
		 * 注意: 此方法包含性能优化措施，如超时检测和节点过滤
		 * @returns {Object} 处理结果
		 * @property {Array} nodesToReplace - 需要替换的节点数组
		 * @property {number} validDecodedCount - 有效的Base64解码数量
		 */
		processTextNodes() {
			const startTime = Date.now();
			const TIMEOUT = 5000;

			const excludeTags = new Set([
				'script',
				'style',
				'noscript',
				'iframe',
				'img',
				'input',
				'textarea',
				'svg',
				'canvas',
				'template',
				'pre',
				'code',
				'button',
				'meta',
				'link',
				'head',
				'title',
				'select',
				'form',
				'object',
				'embed',
				'video',
				'audio',
				'source',
				'track',
				'map',
				'area',
				'math',
				'figure',
				'picture',
				'portal',
				'slot',
				'data',
				'a',
				'base', // 包含href属性的base标签
				'param', // object的参数
				'applet', // 旧版Java小程序
				'frame', // 框架
				'frameset', // 框架集
				'marquee', // 滚动文本
				'time', // 时间标签
				'wbr', // 可能的换行符
				'bdo', // 文字方向
				'dialog', // 对话框
				'details', // 详情
				'summary', // 摘要
				'menu', // 菜单
				'menuitem', // 菜单项
				'[hidden]', // 隐藏元素
				'[aria-hidden="true"]', // 可访问性隐藏
				'.base64', // 自定义class
				'.encoded', // 自定义class
			]);

			const excludeAttrs = new Set([
				'src',
				'data-src',
				'href',
				'data-url',
				'content',
				'background',
				'poster',
				'data-image',
				'srcset',
				'data-background', // 背景图片
				'data-thumbnail', // 缩略图
				'data-original', // 原始图片
				'data-lazy', // 懒加载
				'data-defer', // 延迟加载
				'data-fallback', // 后备图片
				'data-preview', // 预览图
				'data-avatar', // 头像
				'data-icon', // 图标
				'data-base64', // 显式标记的base64
				'style', // 内联样式可能包含base64
				'integrity', // SRI完整性校验
				'crossorigin', // 跨域属性
				'rel', // 关系属性
				'alt', // 替代文本
				'title', // 标题属性
			]);

			const walker = document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT,
				{
					acceptNode: (node) => {
						const isExcludedTag = (parent) => {
							const tagName = parent.tagName?.toLowerCase();
							return excludeTags.has(tagName);
						};

						const isHiddenElement = (parent) => {
							if (!(parent instanceof HTMLElement)) return false;
							const style = window.getComputedStyle(parent);
							return (
								style.display === 'none' ||
								style.visibility === 'hidden' ||
								style.opacity === '0' ||
								style.clipPath === 'inset(100%)' ||
								(style.height === '0px' && style.overflow === 'hidden')
							);
						};

						const isOutOfViewport = (parent) => {
							if (!(parent instanceof HTMLElement)) return false;
							const rect = parent.getBoundingClientRect();
							return rect.width === 0 || rect.height === 0;
						};

						const hasBase64Attributes = (parent) => {
							if (!parent.hasAttributes()) return false;
							for (const attr of parent.attributes) {
								if (excludeAttrs.has(attr.name)) {
									const value = attr.value.toLowerCase();
									if (
										value.includes('base64') ||
										value.match(/^[a-z0-9+/=]+$/i)
									) {
										return true;
									}
								}
							}
							return false;
						};

						let parent = node.parentNode;
						while (parent && parent !== document.body) {
							if (
								isExcludedTag(parent) ||
								isHiddenElement(parent) ||
								isOutOfViewport(parent) ||
								hasBase64Attributes(parent)
							) {
								return NodeFilter.FILTER_REJECT;
							}
							parent = parent.parentNode;
						}

						const text = node.textContent?.trim();
						if (!text) {
							return NodeFilter.FILTER_SKIP;
						}

						return /[A-Za-z0-9+/]+/.exec(text)
							? NodeFilter.FILTER_ACCEPT
							: NodeFilter.FILTER_SKIP;
					},
				},
				false
			);

			let nodesToReplace = [];
			let processedMatches = new Set();
			let validDecodedCount = 0;

			while (walker.nextNode()) {
				if (Date.now() - startTime > TIMEOUT) {
					console.warn('Base64 processing timeout');
					break;
				}

				const node = walker.currentNode;
				const { modified, newHtml, count } = this.processMatches(
					node.nodeValue,
					processedMatches
				);
				if (modified) {
					nodesToReplace.push({ node, newHtml });
					validDecodedCount += count;
				}
			}

			return { nodesToReplace, validDecodedCount };
		}

		/**
		 * 收集变化的节点
		 * @description 从变化记录中收集需要处理的节点
		 * @param {MutationRecord[]} mutations - 变化记录数组
		 * @returns {Node[]} 需要处理的节点数组
		 */
		collectChangedNodes(mutations) {
			const changedNodes = [];
			const excludeTags = new Set([
				'script', 'style', 'noscript', 'iframe', 'img', 'input', 'textarea',
				'svg', 'canvas', 'template', 'pre', 'code', 'button', 'meta', 'link'
			]);

			// 遍历所有变化记录
			for (const mutation of mutations) {
				// 跳过通知相关的变化
				if (mutation.target && (
					mutation.target.classList?.contains('base64-notifications-container') ||
					mutation.target.classList?.contains('base64-notification') ||
					mutation.target.closest?.('.base64-notifications-container')
				)) {
					continue;
				}

				// 处理新添加的节点
				if (mutation.addedNodes.length > 0) {
					for (const node of mutation.addedNodes) {
						// 跳过已处理过的节点
						if (this.processedNodes.has(node)) {
							continue;
						}

						// 跳过非元素节点和排除的标签
						if (node.nodeType === 1 && excludeTags.has(node.tagName.toLowerCase())) {
							continue;
						}

						// 跳过已解码的文本节点
						if (node.classList?.contains('decoded-text')) {
							continue;
						}

						// 添加到待处理节点列表
						changedNodes.push(node);
						// 标记为已处理
						this.processedNodes.add(node);
					}
				}

				// 处理变化的目标节点
				if (mutation.type === 'childList' && !this.processedNodes.has(mutation.target)) {
					// 跳过非元素节点和排除的标签
					if (mutation.target.nodeType === 1 &&
						!excludeTags.has(mutation.target.tagName?.toLowerCase()) &&
						!mutation.target.classList?.contains('decoded-text')) {
						changedNodes.push(mutation.target);
						this.processedNodes.add(mutation.target);
					}
				}
			}

			return changedNodes;
		}

		/**
		 * 处理增量解码
		 * @description 只对变化的节点进行解码处理
		 * @param {Node[]} changedNodes - 需要处理的节点数组
		 */
		async handleIncrementalDecode(changedNodes) {
			console.log(`开始增量解码，处理 ${changedNodes.length} 个变化节点`);

			// 设置处理标志
			this.isProcessing = true;
			this.isDecodingContent = true;

			try {
				// 处理每个变化节点
				let validDecodedCount = 0;
				const nodesToReplace = [];
				const processedMatches = new Set();

				// 递归处理节点及其子节点
				const processNode = (node) => {
					// 如果是文本节点，处理其内容
					if (node.nodeType === 3 && node.nodeValue?.trim()) {
						const { modified, newHtml, count } = this.processMatches(node.nodeValue, processedMatches);
						if (modified) {
							nodesToReplace.push({ node, newHtml });
							validDecodedCount += count;
						}
					} else if (node.nodeType === 1) {
						// 如果是元素节点，递归处理其子节点
						const excludeTags = new Set([
							'script', 'style', 'noscript', 'iframe', 'img', 'input', 'textarea',
							'svg', 'canvas', 'template', 'pre', 'code', 'button', 'meta', 'link'
						]);

						// 跳过排除的标签和已解码的元素
						if (excludeTags.has(node.tagName.toLowerCase()) ||
							node.classList?.contains('decoded-text') ||
							node.closest?.('.decoded-text')) {
							return;
						}

						// 递归处理子节点
						for (const child of node.childNodes) {
							processNode(child);
						}
					}
				};

				// 处理所有变化节点
				for (const node of changedNodes) {
					processNode(node);
				}

				// 如果没有找到有效的解码内容
				if (validDecodedCount === 0) {
					console.log('增量解码未发现有效 Base64 内容');
					// 重置处理标志
					this.isProcessing = false;
					this.isDecodingContent = false;
					return;
				}

				// 分批处理节点替换，避免大量 DOM 操作导致界面冻结
				const BATCH_SIZE = 50;
				const processNodesBatch = async (startIndex) => {
					const endIndex = Math.min(startIndex + BATCH_SIZE, nodesToReplace.length);
					const batch = nodesToReplace.slice(startIndex, endIndex);

					this.replaceNodes(batch);

					if (endIndex < nodesToReplace.length) {
						// 还有更多节点需要处理，安排下一批
						setTimeout(() => processNodesBatch(endIndex), 0);
					} else {
						// 所有节点处理完成，添加点击监听器
						await this.addClickListenersToDecodedText();

						// 更新按钮状态
						if (this.decodeBtn) {
							this.decodeBtn.textContent = '恢复本页 Base64';
							this.decodeBtn.dataset.mode = 'restore';
						}

						// 显示通知，除非被抑制
						if (!this.suppressNotification) {
							this.showNotification(
								`解码成功，共找到 ${validDecodedCount} 个 Base64 内容`,
								'success'
							);
						}

						// 操作完成后同步按钮和菜单状态
						this.syncButtonAndMenuState();

						// 重置处理标志
						this.isProcessing = false;
						this.isDecodingContent = false;

						// 更新最后解码时间
						this.lastDecodeTime = Date.now();
					}
				};

				// 开始分批处理
				await processNodesBatch(0);
			} catch (e) {
				console.error('增量解码处理错误:', e);
				// 检查是否有成功解码的内容
				const hasDecodedContent = document.querySelectorAll('.decoded-text').length > 0;
				// 更新按钮状态
				if (hasDecodedContent) {
					// 如果有成功解码的内容，更新按钮状态但不显示通知
					// 在自动解码模式下，静默处理部分解码失败的情况
					if (this.decodeBtn) {
						this.decodeBtn.textContent = '恢复本页 Base64';
						this.decodeBtn.dataset.mode = 'restore';
					}
					// 操作完成后同步按钮和菜单状态
					this.syncButtonAndMenuState();
				} else {
					// 如果没有成功解码的内容，不显示失败通知
					// 在自动解码模式下，静默处理解码失败的情况
					console.log('自动解码未发现有效内容，静默处理');
				}
				// 重置处理标志
				this.isProcessing = false;
				this.isDecodingContent = false;
				// 更新最后解码时间
				this.lastDecodeTime = Date.now();
			}
		}

		/**
		 * 处理文本中的Base64匹配项
		 * @description 查找并处理文本中的Base64编码内容
		 * @param {string} text - 要处理的文本内容
		 * @param {Set} processedMatches - 已处理过的匹配项集合
		 * @returns {Object} 处理结果
		 * @property {boolean} modified - 文本是否被修改
		 * @property {string} newHtml - 处理后的HTML内容
		 * @property {number} count - 处理的Base64数量
		 */
		processMatches(text, processedMatches) {
			const matches = Array.from(text.matchAll(BASE64_REGEX));
			if (!matches.length) return { modified: false, newHtml: text, count: 0 };

			let modified = false;
			let newHtml = text;
			let count = 0;

			for (const match of matches.reverse()) {
				const original = match[0];

				// 使用 validateBase64 进行验证
				if (!this.validateBase64(original)) {
					console.log('Skipped: invalid Base64 string');
					continue;
				}

				try {
					const decoded = this.decodeBase64(original);
					console.log('Decoded:', decoded);

					if (!decoded) {
						console.log('Skipped: decode failed');
						continue;
					}

					// 将原始Base64和位置信息添加到已处理集合中，防止重复处理
					const matchKey = `${original}-${match.index}`;
					processedMatches.add(matchKey);

					// 创建解码文本节点
					const span = document.createElement('span');
					span.className = 'decoded-text';
					span.title = '点击复制';
					span.dataset.original = original;
					span.textContent = decoded;

					// 直接添加点击事件监听器
					span.addEventListener('click', async (e) => {
						e.preventDefault();
						e.stopPropagation();
						const success = await this.copyToClipboard(decoded);
						this.debouncedShowNotification(
							success ? '已复制文本内容' : '复制失败，请手动复制',
							success ? 'success' : 'error'
						);
					});

					// 构建新的HTML内容
					const beforeMatch = newHtml.substring(0, match.index);
					const afterMatch = newHtml.substring(match.index + original.length);
					newHtml = beforeMatch + span.outerHTML + afterMatch;

					// 标记内容已被修改
					modified = true;
					// 增加成功解码计数
					count++;

					// 记录日志
					console.log('成功解码: 发现有意义的文本或中文字符');
				} catch (e) {
					console.error('Error processing:', e);
					continue;
				}
			}

			return { modified, newHtml, count };
		}

		/**
		 * 判断文本是否有意义
		 * @description 通过一系列规则判断解码后的文本是否具有实际意义
		 * @param {string} text - 要验证的文本
		 * @returns {boolean} 如果文本有意义返回true,否则返回false
		 */
		isMeaningfulText(text) {
			// 1. 基本字符检查
			if (!text || typeof text !== 'string') return false;

			// 2. 长度检查
			if (text.length < 2 || text.length > 10000) return false;

			// 3. 文本质量检查
			const stats = {
				printable: 0, // 可打印字符
				control: 0, // 控制字符
				chinese: 0, // 中文字符
				letters: 0, // 英文字母
				numbers: 0, // 数字
				punctuation: 0, // 标点符号
				spaces: 0, // 空格
				other: 0, // 其他字符
			};

			// 统计字符分布
			for (let i = 0; i < text.length; i++) {
				const char = text.charAt(i);
				const code = text.charCodeAt(i);

				if (/[\u4E00-\u9FFF]/.test(char)) {
					stats.chinese++;
					stats.printable++;
				} else if (/[a-zA-Z]/.test(char)) {
					stats.letters++;
					stats.printable++;
				} else if (/[0-9]/.test(char)) {
					stats.numbers++;
					stats.printable++;
				} else if (/[\s]/.test(char)) {
					stats.spaces++;
					stats.printable++;
				} else if (/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(char)) {
					stats.punctuation++;
					stats.printable++;
				} else if (code < 32 || code === 127) {
					stats.control++;
				} else {
					stats.other++;
				}
			}

			// 4. 质量评估规则
			const totalChars = text.length;
			const printableRatio = stats.printable / totalChars;
			const controlRatio = stats.control / totalChars;
			const meaningfulRatio =
				(stats.chinese + stats.letters + stats.numbers) / totalChars;

			// 判断条件：
			// 1. 可打印字符比例必须大于90%
			// 2. 控制字符比例必须小于5%
			// 3. 有意义字符(中文、英文、数字)比例必须大于30%
			// 4. 空格比例不能过高(小于50%)
			// 5. 其他字符比例必须很低(小于10%)
			return (
				printableRatio > 0.9 &&
				controlRatio < 0.05 &&
				meaningfulRatio > 0.3 &&
				stats.spaces / totalChars < 0.5 &&
				stats.other / totalChars < 0.1
			);
		}

		/**
		 * 替换页面中的节点
		 * @description 使用新的HTML内容替换原有节点
		 * @param {Array} nodesToReplace - 需要替换的节点数组
		 * @param {Node} nodesToReplace[].node - 原始节点
		 * @param {string} nodesToReplace[].newHtml - 新的HTML内容
		 */
		replaceNodes(nodesToReplace) {
			nodesToReplace.forEach(({ node, newHtml }) => {
				if (node && node.parentNode) {
					// 创建临时容器
					const temp = document.createElement('div');
					temp.innerHTML = newHtml;

					// 替换节点
					while (temp.firstChild) {
						node.parentNode.insertBefore(temp.firstChild, node);
					}
					node.parentNode.removeChild(node);
				}
			});
		}

		/**
		 * 为解码后的文本添加点击复制功能
		 * @description 为所有解码后的文本元素添加点击事件监听器
		 * @fires copyToClipboard 点击时触发复制操作
		 * @fires showNotification 显示复制结果通知
		 */
		async addClickListenersToDecodedText() {
			// 等待 DOM 更新完成
			await this.waitForDOMUpdate();

			// 获取所有解码文本节点
			const decodedTextNodes = document.querySelectorAll('.decoded-text');
			console.log('找到解码文本节点数量:', decodedTextNodes.length);

			decodedTextNodes.forEach((el) => {
				// 检查是否已经有事件监听器
				if (!el.hasAttribute('data-has-listener')) {
					// 添加新的事件监听器
					el.addEventListener('click', async (e) => {
						e.preventDefault();
						e.stopPropagation();
						const success = await this.copyToClipboard(e.target.textContent);
						this.debouncedShowNotification(
							success ? '已复制文本内容' : '复制失败，请手动复制',
							success ? 'success' : 'error'
						);
					});

					// 标记节点已添加事件监听器
					el.setAttribute('data-has-listener', 'true');
					console.log('已为节点添加点击事件监听器');
				}
			});
		}

		/**
		 * 处理文本编码为Base64
		 * @description 提示用户输入文本并转换为Base64格式
		 * @async
		 * @fires showNotification 显示编码结果通知
		 * @fires copyToClipboard 复制编码结果到剪贴板
		 */
		async handleEncode() {
			// 隐藏菜单
			if (this.menu && this.menu.style.display !== 'none') {
				this.menu.style.display = 'none';
				this.menuVisible = false;
			}

			const text = prompt('请输入要编码的文本：');
			if (text === null) return; // 用户点击取消

			// 添加空输入检查
			if (!text.trim()) {
				this.debouncedShowNotification('请输入有效的文本内容', 'error');
				return;
			}

			try {
				// 处理输入文本：去除首尾空格和多余的换行符
				const processedText = text.trim().replace(/[\r\n]+/g, '\n');
				const encoded = this.encodeBase64(processedText);
				const success = await this.copyToClipboard(encoded);
				this.debouncedShowNotification(
					success
						? 'Base64 已复制'
						: '编码成功但复制失败，请手动复制：' + encoded,
					success ? 'success' : 'info'
				);
			} catch (e) {
				this.debouncedShowNotification('编码失败: ' + e.message, 'error');
			}
		}

		/**
		 * 验证Base64字符串
		 * @description 检查字符串是否为有效的Base64格式
		 * @param {string} str - 要验证的字符串
		 * @returns {boolean} 如果是有效的Base64返回true,否则返回false
		 * @example
		 * validateBase64('SGVsbG8gV29ybGQ=') // returns true
		 * validateBase64('Invalid-Base64') // returns false
		 */
		validateBase64(str) {
			if (!str) return false;

			// 使用缓存避免重复验证
			if (this.base64Cache.has(str)) {
				return this.base64Cache.get(str);
			}

			// 检查缓存大小并在必要时清理
			if (this.base64Cache.size >= this.MAX_CACHE_SIZE) {
				// 删除最早添加的缓存项
				const oldestKey = this.base64Cache.keys().next().value;
				this.base64Cache.delete(oldestKey);
			}

			// 1. 基本格式检查
			// - 长度必须是4的倍数
			// - 只允许包含合法的Base64字符
			// - =号只能出现在末尾，且最多2个
			if (
				!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
					str
				)
			) {
				this.base64Cache.set(str, false);
				return false;
			}

			// 2. 长度检查
			// 过滤掉太短的字符串(至少8个字符)和过长的字符串(最多10000个字符)
			if (str.length < 8 || str.length > 10000) {
				this.base64Cache.set(str, false);
				return false;
			}

			// 3. 特征检查
			// 过滤掉可能是图片、视频等二进制数据的Base64
			if (/^(?:data:|iVBOR|R0lGO|\/9j\/4|PD94bW|JVBER)/.test(str)) {
				this.base64Cache.set(str, false);
				return false;
			}

			// 添加到 validateBase64 方法中
			const commonPatterns = {
				// 常见的二进制数据头部特征
				binaryHeaders:
					/^(?:data:|iVBOR|R0lGO|\/9j\/4|PD94bW|JVBER|UEsDB|H4sIA|77u\/|0M8R4)/,

				// 常见的文件类型标识
				fileSignatures: /^(?:UEs|PK|%PDF|GIF8|RIFF|OggS|ID3|ÿØÿ|8BPS)/,

				// 常见的编码标识
				encodingMarkers:
					/^(?:utf-8|utf-16|base64|quoted-printable|7bit|8bit|binary)/i,

				// 可疑的URL模式
				urlPatterns: /^(?:https?:|ftp:|data:|blob:|file:|ws:|wss:)/i,

				// 常见的压缩文件头部
				compressedHeaders: /^(?:eJw|H4s|Qk1Q|UEsD|N3q8|KLUv)/,
			};

			// 在验证时使用这些模式
			if (
				commonPatterns.binaryHeaders.test(str) ||
				commonPatterns.fileSignatures.test(str) ||
				commonPatterns.encodingMarkers.test(str) ||
				commonPatterns.urlPatterns.test(str) ||
				commonPatterns.compressedHeaders.test(str)
			) {
				this.base64Cache.set(str, false);
				return false;
			}

			try {
				const decoded = this.decodeBase64(str);
				if (!decoded) {
					this.base64Cache.set(str, false);
					return false;
				}

				// 4. 解码后的文本验证
				// 检查解码后的文本是否有意义
				if (!this.isMeaningfulText(decoded)) {
					this.base64Cache.set(str, false);
					return false;
				}

				this.base64Cache.set(str, true);
				return true;
			} catch (e) {
				console.error('Base64 validation error:', e);
				this.base64Cache.set(str, false);
				return false;
			}
		}

		/**
		 * Base64解码
		 * @description 将Base64字符串解码为普通文本
		 * @param {string} str - 要解码的Base64字符串
		 * @returns {string|null} 解码后的文本,解码失败时返回null
		 * @example
		 * decodeBase64('SGVsbG8gV29ybGQ=') // returns 'Hello World'
		 */
		decodeBase64(str) {
			try {
				// 优化解码过程
				const binaryStr = atob(str);
				const bytes = new Uint8Array(binaryStr.length);
				for (let i = 0; i < binaryStr.length; i++) {
					bytes[i] = binaryStr.charCodeAt(i);
				}
				return new TextDecoder().decode(bytes);
			} catch (e) {
				console.error('Base64 decode error:', e);
				return null;
			}
		}

		/**
		 * Base64编码
		 * @description 将普通文本编码为Base64格式
		 * @param {string} str - 要编码的文本
		 * @returns {string|null} Base64编码后的字符串,编码失败时返回null
		 * @example
		 * encodeBase64('Hello World') // returns 'SGVsbG8gV29ybGQ='
		 */
		encodeBase64(str) {
			try {
				// 优化编码过程
				const bytes = new TextEncoder().encode(str);
				let binaryStr = '';
				for (let i = 0; i < bytes.length; i++) {
					binaryStr += String.fromCharCode(bytes[i]);
				}
				return btoa(binaryStr);
			} catch (e) {
				console.error('Base64 encode error:', e);
				return null;
			}
		}

		/**
		 * 复制文本到剪贴板
		 * @description 尝试使用现代API或降级方案将文本复制到剪贴板
		 * @param {string} text - 要复制的文本
		 * @returns {Promise<boolean>} 复制是否成功
		 * @example
		 * await copyToClipboard('Hello World') // returns true
		 */
		async copyToClipboard(text) {
			if (navigator.clipboard && window.isSecureContext) {
				try {
					await navigator.clipboard.writeText(text);
					return true;
				} catch (e) {
					return this.fallbackCopy(text);
				}
			}

			return this.fallbackCopy(text);
		}

		/**
		 * 降级复制方案
		 * @description 当现代复制API不可用时的备选复制方案
		 * @param {string} text - 要复制的文本
		 * @returns {boolean} 复制是否成功
		 * @private
		 */
		fallbackCopy(text) {
			if (typeof GM_setClipboard !== 'undefined') {
				try {
					GM_setClipboard(text);
					return true;
				} catch (e) {
					console.debug('GM_setClipboard failed:', e);
				}
			}

			try {
				// 注意: execCommand 已经被废弃，但作为降级方案仍然有用
				const textarea = document.createElement('textarea');
				textarea.value = text;
				textarea.style.cssText = 'position:fixed;opacity:0;';
				document.body.appendChild(textarea);

				if (navigator.userAgent.match(/ipad|iphone/i)) {
					textarea.contentEditable = true;
					textarea.readOnly = false;

					const range = document.createRange();
					range.selectNodeContents(textarea);

					const selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					textarea.setSelectionRange(0, 999999);
				} else {
					textarea.select();
				}

				// 使用 try-catch 包裹 execCommand 调用，以防将来完全移除
				let success = false;
				try {
					// @ts-ignore - 忽略废弃警告
					success = document.execCommand('copy');
				} catch (copyError) {
					console.debug('execCommand copy operation failed:', copyError);
				}

				document.body.removeChild(textarea);
				return success;
			} catch (e) {
				console.debug('Fallback copy method failed:', e);
				return false;
			}
		}

		/**
		 * 恢复原始内容
		 * @description 将所有解码后的内容恢复为原始的Base64格式
		 * @fires showNotification 显示恢复结果通知
		 */
		restoreContent() {
			// 设置恢复内容标志，防止重复处理
			if (this.isRestoringContent) {
				console.log('已经在恢复内容中，避免重复操作');
				return;
			}

			this.isRestoringContent = true;

			try {
				// 获取所有需要恢复的元素
				const elementsToRestore = Array.from(document.querySelectorAll('.decoded-text'));
				if (elementsToRestore.length === 0) {
					this.showNotification('没有需要恢复的内容', 'info');
					this.isRestoringContent = false;
					return;
				}

				// 分批处理节点替换，避免大量 DOM 操作导致界面冻结
				const BATCH_SIZE = 50;
				const processBatch = (startIndex) => {
					const endIndex = Math.min(startIndex + BATCH_SIZE, elementsToRestore.length);
					const batch = elementsToRestore.slice(startIndex, endIndex);

					batch.forEach((el) => {
						if (el && el.parentNode && el.dataset.original) {
							const textNode = document.createTextNode(el.dataset.original);
							el.parentNode.replaceChild(textNode, el);
						}
					});

					if (endIndex < elementsToRestore.length) {
						// 还有更多元素需要处理
						setTimeout(() => processBatch(endIndex), 0);
					} else {
						// 所有元素处理完成
						this.originalContents.clear();

						// 如果按钮存在，更新按钮状态
						if (this.decodeBtn) {
							this.decodeBtn.textContent = '解析本页 Base64';
							this.decodeBtn.dataset.mode = 'decode';
						}

						// 获取已恢复元素的数量
						const restoredCount = elementsToRestore.length;
						// 显示通知，除非被抑制
						if (!this.suppressNotification) {
							this.showNotification(`已恢复 ${restoredCount} 个 Base64 内容`, 'success');
						}

						// 只有当按钮可见时才隐藏菜单
						if (!this.config.hideButton && this.menu) {
							this.menu.style.display = 'none';
						}

						// 操作完成后同步按钮和菜单状态
						this.syncButtonAndMenuState();
						// 更新油猴菜单命令
						updateMenuCommands();

						// 重置恢复内容标志
						this.isRestoringContent = false;
					}
				};

				// 开始处理第一批
				processBatch(0);
			} catch (e) {
				console.error('恢复内容时出错:', e);
				this.showNotification(`恢复失败: ${e.message}`, 'error');
				this.isRestoringContent = false;
			}
		}

		/**
		 * 同步按钮和菜单状态
		 * @description 根据页面上是否有解码内容，同步按钮和菜单状态
		 */
		syncButtonAndMenuState() {
			// 检查页面上是否有解码内容
			const hasDecodedContent = document.querySelectorAll('.decoded-text').length > 0;

			// 同步按钮状态
			if (this.decodeBtn) {
				if (hasDecodedContent) {
					this.decodeBtn.textContent = '恢复本页 Base64';
					this.decodeBtn.dataset.mode = 'restore';
				} else {
					this.decodeBtn.textContent = '解析本页 Base64';
					this.decodeBtn.dataset.mode = 'decode';
				}
			}

			// 更新菜单命令
			setTimeout(updateMenuCommands, 100);
		}

		/**
		 * 重置插件状态
		 * @description 重置所有状态变量并在必要时恢复原始内容
		 * 如果启用了自动解码，则在路由变化后自动解析页面
		 * @fires restoreContent 如果当前处于restore模式则触发内容恢复
		 * @fires handleDecode 如果启用了自动解码则触发自动解码
		 */
		resetState() {
			console.log('执行 resetState，自动解码状态:', this.config.autoDecode);

			// 如果正在处理中，跳过这次重置
			if (this.isProcessing || this.isDecodingContent || this.isRestoringContent) {
				console.log('正在处理中，跳过这次状态重置');
				return;
			}

			// 检查URL是否变化，如果变化了，可能是新页面
			const currentUrl = window.location.href;
			const urlChanged = currentUrl !== this.lastPageUrl;
			// 检查是否是前进后退事件
			const isNavigationEvent = this.lastNavigationTime && (Date.now() - this.lastNavigationTime < 500);

			if (urlChanged || isNavigationEvent) {
				console.log('URL已变化或检测到前进后退事件，从', this.lastPageUrl, '到', currentUrl);
				this.lastPageUrl = currentUrl;
				// URL变化或前进后退时重置自动解码标志
				this.hasAutoDecodedOnLoad = false;
			}

			// 页面刷新时的特殊处理
			if (this.isPageRefresh && this.config.autoDecode) {
				console.log('页面刷新且自动解码已启用');

				// 如果页面刷新尚未完成，不执行任何操作，等待页面完全加载
				if (!this.pageRefreshCompleted) {
					console.log('页面刷新尚未完成，等待页面加载完成后再处理');
					return;
				}

				// 检查是否已经执行过解码，避免重复解码
				if (this.hasAutoDecodedOnLoad || document.querySelectorAll('.decoded-text').length > 0) {
					console.log('页面已经执行过解码或已有解码内容，跳过重复解码');
					return;
				}

				// 页面上没有已解码内容，执行自动解码
				console.log('页面刷新时未发现已解码内容，执行自动解码');
				this.hasAutoDecodedOnLoad = true;
				// 增加延时，确保页面内容已完全加载
				setTimeout(() => {
					if (!this.isProcessing && !this.isDecodingContent && !this.isRestoringContent) {
						// 使用processTextNodes方法进行解码
						const { nodesToReplace, validDecodedCount } = this.processTextNodes();

						if (validDecodedCount > 0) {
							// 分批处理节点替换
							const BATCH_SIZE = 50;
							const processNodesBatch = (startIndex) => {
								const endIndex = Math.min(startIndex + BATCH_SIZE, nodesToReplace.length);
								const batch = nodesToReplace.slice(startIndex, endIndex);

								this.replaceNodes(batch);

								if (endIndex < nodesToReplace.length) {
									setTimeout(() => processNodesBatch(endIndex), 0);
								} else {
									setTimeout(() => {
										this.addClickListenersToDecodedText();
										this.debouncedShowNotification(`解码成功，共找到 ${validDecodedCount} 个 Base64 内容`, 'success');
										this.syncButtonAndMenuState();
									}, 100);
								}
							};

							processNodesBatch(0);
						}
					}
				}, 1000);
				return;
			}

			// 如果启用了自动解码，且尚未在页面加载时执行过，则在路由变化后自动解析页面
			if (this.config.autoDecode && !this.hasAutoDecodedOnLoad) {
				console.log('自动解码已启用，准备解析页面');
				// 标记已执行过自动解码
				this.hasAutoDecodedOnLoad = true;

				// 使用统一的页面稳定性跟踪器
				const tracker = this.pageStabilityTracker;

				// 记录路由变化
				tracker.recordChange('Route');

				// 标记有待处理的解码请求
				if (this.config.autoDecode) {
					tracker.pendingDecode = true;
				}

				// 设置页面稳定性定时器
				tracker.stabilityTimer = setTimeout(() => {
					// 检查页面是否真正稳定（路由和DOM都稳定）
					if (tracker.checkStability()) {
						console.log('页面已稳定（路由和DOM都稳定），准备在 resetState 中执行自动解码');

						// 标记页面已稳定
						tracker.isStable = true;

						// 如果有待处理的解码请求，则执行解码
						if (tracker.pendingDecode && this.config.autoDecode) {
							// 使用延时确保页面内容已更新
							tracker.decodePendingTimer = setTimeout(() => {
								// 重置待处理标志
								tracker.pendingDecode = false;

								console.log('resetState 中执行自动解码');
								if (
									!this.isProcessing &&
									!this.isDecodingContent &&
									!this.isRestoringContent
								) {
									// 使用自动解码方法，强制全页面解码并显示通知
									console.log('在resetState中强制执行全页面解码');
									this.handleAutoDecode(true, true);
									// 同步按钮和菜单状态
									setTimeout(() => this.syncButtonAndMenuState(), 200);
								}

							}, 500); // 页面稳定后再等待500毫秒再执行解码
						}
					} else {
						console.log('页面尚未完全稳定，继续等待');
					}
				}, tracker.stabilityThreshold); // 等待页面稳定的时间
			}
		}

		/**
		 * 为通知添加动画效果
		 * @param {HTMLElement} notification - 通知元素
		 */
		animateNotification(notification) {
			const currentTransform = getComputedStyle(notification).transform;
			notification.style.transform = currentTransform;
			notification.style.transition = 'all 0.3s ease-out';
			notification.style.transform = 'translateY(-100%)';
		}

		/**
		 * 处理通知淡出效果
		 * @description 为通知添加淡出效果并处理相关动画
		 * @param {HTMLElement} notification - 要处理的通知元素
		 * @fires animateNotification 触发其他通知的位置调整动画
		 */
		handleNotificationFadeOut(notification) {
			notification.classList.add('fade-out');
			const index = this.notifications.indexOf(notification);

			this.notifications.slice(0, index).forEach((prev) => {
				if (prev.parentNode) {
					prev.style.transform = 'translateY(-100%)';
				}
			});
		}

		/**
		 * 清理通知容器
		 * @description 移除所有通知元素和相关事件监听器
		 * @fires removeEventListener 移除所有通知相关的事件监听器
		 */
		cleanupNotificationContainer() {
			// 清理通知相关的事件监听器
			this.notificationEventListeners.forEach(({ element, event, handler }) => {
				element.removeEventListener(event, handler);
			});
			this.notificationEventListeners = [];

			// 移除所有通知元素
			while (this.notificationContainer.firstChild) {
				this.notificationContainer.firstChild.remove();
			}

			this.notificationContainer.remove();
			this.notificationContainer = null;
		}

		/**
		 * 处理通知过渡结束事件
		 * @description 处理通知元素的过渡动画结束后的清理工作
		 * @param {TransitionEvent} e - 过渡事件对象
		 * @fires animateNotification 触发其他通知的位置调整
		 */
		handleNotificationTransitionEnd(e) {
			if (
				e.propertyName === 'opacity' &&
				e.target.classList.contains('fade-out')
			) {
				const notification = e.target;
				const index = this.notifications.indexOf(notification);

				this.notifications.forEach((notif, i) => {
					if (i > index && notif.parentNode) {
						this.animateNotification(notif);
					}
				});

				if (index > -1) {
					this.notifications.splice(index, 1);
					notification.remove();
				}

				if (this.notifications.length === 0) {
					this.cleanupNotificationContainer();
				}
			}
		}

		/**
		 * 显示通知消息
		 * @description 创建并显示一个通知消息,包含自动消失功能
		 * @param {string} text - 通知文本内容
		 * @param {string} type - 通知类型 ('success'|'error'|'info')
		 * @fires handleNotificationFadeOut 触发通知淡出效果
		 * @example
		 * showNotification('操作成功', 'success')
		 */
		showNotification(text, type) {
			// 如果禁用了通知，则不显示
			if (this.config && !this.config.showNotification) {
				console.log(`[Base64 Helper] ${type}: ${text}`);
				return;
			}

			// 设置通知显示标志，防止 MutationObserver 触发自动解码
			this.isShowingNotification = true;

			if (!this.notificationContainer) {
				this.notificationContainer = document.createElement('div');
				this.notificationContainer.className = 'base64-notifications-container';
				document.body.appendChild(this.notificationContainer);

				const handler = (e) => this.handleNotificationTransitionEnd(e);
				this.notificationContainer.addEventListener('transitionend', handler);
				this.notificationEventListeners.push({
					element: this.notificationContainer,
					event: 'transitionend',
					handler,
				});
			}

			const notification = document.createElement('div');
			notification.className = 'base64-notification';
			notification.setAttribute('data-type', type);
			notification.textContent = text;

			this.notifications.push(notification);
			this.notificationContainer.appendChild(notification);

			// 使用延时来清除通知标志，确保 DOM 变化已完成
			setTimeout(() => {
				this.isShowingNotification = false;
			}, 100);

			setTimeout(() => {
				if (notification.parentNode) {
					this.handleNotificationFadeOut(notification);
				}
			}, 2000);
		}

		/**
		 * 销毁插件实例
		 * @description 清理所有资源,移除事件监听器,恢复原始状态
		 * @fires restoreContent 如果需要则恢复原始内容
		 * @fires removeEventListener 移除所有事件监听器
		 */
		destroy() {
			// 清理所有事件监听器
			this.eventListeners.forEach(({ element, event, handler, options }) => {
				element.removeEventListener(event, handler, options);
			});
			this.eventListeners = [];

			// 清理配置监听器
			if (this.configListeners) {
				Object.values(this.configListeners).forEach(listenerId => {
					if (listenerId) {
						storageManager.removeChangeListener(listenerId);
					}
				});
				// 重置配置监听器
				this.configListeners = {
					showNotification: null,
					hideButton: null,
					autoDecode: null,
					buttonPosition: null
				};
			}

			// 清理定时器
			if (this.resizeTimer) clearTimeout(this.resizeTimer);
			if (this.routeTimer) clearTimeout(this.routeTimer);
			if (this.domChangeTimer) clearTimeout(this.domChangeTimer);

			// 清理 MutationObserver
			if (this.observer) {
				this.observer.disconnect();
				this.observer = null;
			}

			// 清理通知相关资源
			if (this.notificationContainer) {
				this.cleanupNotificationContainer();
			}
			this.notifications = [];

			// 恢复原始的 history 方法
			if (this.originalPushState) history.pushState = this.originalPushState;
			if (this.originalReplaceState)
				history.replaceState = this.originalReplaceState;

			// 恢复原始状态
			if (this.decodeBtn?.dataset.mode === 'restore') {
				this.restoreContent();
			}

			// 移除 DOM 元素
			if (this.container) {
				this.container.remove();
			}

			// 清理缓存
			if (this.base64Cache) {
				this.base64Cache.clear();
			}

			// 清理节点跟踪相关资源
			this.processedNodes = null;
			this.decodedTextNodes = null;
			this.processedMutations = null;
			this.currentMutations = null;

			// 清理引用
			this.shadowRoot = null;
			this.mainBtn = null;
			this.menu = null;
			this.decodeBtn = null;
			this.encodeBtn = null;
			this.container = null;
			this.originalContents.clear();
			this.originalContents = null;
			this.isDragging = false;
			this.hasMoved = false;
			this.menuVisible = false;
			this.base64Cache = null;
			this.configListeners = null;
		}

		/**
		 * 防抖处理解码
		 * @param {boolean} [forceFullDecode=false] - 是否强制全页面解码
		 * @param {boolean} [showNotification=false] - 是否显示通知
		 */
		debouncedHandleAutoDecode(forceFullDecode = false, showNotification = false) {
			// 清除之前的定时器
			clearTimeout(this.decodeDebounceTimer);

			// 检查距离上次解码的时间
			const currentTime = Date.now();
			if (currentTime - this.lastDecodeTime < this.DECODE_DEBOUNCE_DELAY) {
				console.log('距离上次解码时间太短，跳过这次解码');
				return;
			}

			// 设置新的定时器
			this.decodeDebounceTimer = setTimeout(() => {
				this.handleAutoDecode(forceFullDecode, showNotification);
				this.lastDecodeTime = Date.now();
			}, 500); // 添加500ms的延迟，确保页面内容已更新
		}

		/**
		 * 防抖处理通知
		 * @param {string} text - 通知文本
		 * @param {string} type - 通知类型
		 */
		debouncedShowNotification(text, type) {
			this.showNotification(text, type);
		}

		/**
		 * 等待 DOM 更新完成后再添加事件监听器
		 * @description 使用 MutationObserver 监听 DOM 变化，确保在节点真正被添加到 DOM 后再添加事件监听器
		 * @private
		 */
		waitForDOMUpdate() {
			return new Promise((resolve) => {
				// 先检查是否已经有解码文本节点
				const existingNodes = document.querySelectorAll('.decoded-text');
				if (existingNodes.length > 0) {
					resolve();
					return;
				}

				const observer = new MutationObserver((mutations) => {
					// 检查是否有新的 decoded-text 节点
					const hasNewNodes = document.querySelectorAll('.decoded-text').length > 0;
					if (hasNewNodes) {
						observer.disconnect();
						resolve();
					}
				});

				observer.observe(document.body, {
					childList: true,
					subtree: true
				});

				// 设置超时，防止无限等待
				setTimeout(() => {
					observer.disconnect();
					resolve();
				}, 1000);
			});
		}

		/**
		 * 添加事件监听器
		 * @param {HTMLElement} element - 目标元素
		 * @param {string} event - 事件名称
		 * @param {Function} handler - 事件处理函数
		 * @param {Object} options - 事件选项
		 * @returns {string} - 监听器ID
		 */
		addEventListener(element, event, handler, options = {}) {
			const listenerId = `${element.id || 'global'}_${event}_${Date.now()}`;
			element.addEventListener(event, handler, options);
			this.eventListeners.set(listenerId, { element, event, handler, options });
			return listenerId;
		}

		/**
		 * 移除事件监听器
		 * @param {string} listenerId - 监听器ID
		 */
		removeEventListener(listenerId) {
			const listener = this.eventListeners.get(listenerId);
			if (listener) {
				const { element, event, handler, options } = listener;
				element.removeEventListener(event, handler, options);
				this.eventListeners.delete(listenerId);
			}
		}

		/**
		 * 清理所有事件监听器
		 */
		cleanupEventListeners() {
			for (const [listenerId, listener] of this.eventListeners) {
				const { element, event, handler, options } = listener;
				element.removeEventListener(event, handler, options);
			}
			this.eventListeners.clear();
		}

		/**
		 * 添加缓存项
		 * @param {string} key - 缓存键
		 * @param {string} value - 缓存值
		 */
		addToCache(key, value) {
			// 检查缓存大小，如果超过限制则清理最旧的条目
			if (this.base64Cache.size >= this.MAX_CACHE_SIZE) {
				const oldestKey = this.base64Cache.keys().next().value;
				this.base64Cache.delete(oldestKey);
			}

			// 只缓存长度在限制范围内的文本
			if (value.length <= this.MAX_TEXT_LENGTH) {
				this.base64Cache.set(key, value);
			}
		}

		/**
		 * 从缓存中获取值
		 * @param {string} key - 缓存键
		 * @returns {string|undefined} - 缓存值或undefined
		 */
		getFromCache(key) {
			const value = this.base64Cache.get(key);
			if (value !== undefined) {
				this.cacheHits++;
				return value;
			}
			this.cacheMisses++;
			return undefined;
		}

		/**
		 * 清理缓存
		 */
		clearCache() {
			this.base64Cache.clear();
			this.cacheHits = 0;
			this.cacheMisses = 0;
		}

		/**
		 * 获取缓存统计信息
		 * @returns {Object} - 缓存统计信息
		 */
		getCacheStats() {
			return {
				size: this.base64Cache.size,
				hits: this.cacheHits,
				misses: this.cacheMisses,
				hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
			};
		}

		/**
		 * 处理文本节点
		 * @param {Text} node - 文本节点
		 * @returns {boolean} - 是否处理成功
		 */
		processTextNode(node) {
			if (this.processedNodes.has(node)) {
				return false;
			}

			// 检查节点是否已经被处理过
			const cachedResult = this.decodedTextNodes.get(node);
			if (cachedResult !== undefined) {
				return cachedResult;
			}

			// 处理节点
			const result = this.processNodeContent(node);
			this.processedNodes.add(node);
			this.decodedTextNodes.set(node, result);

			// 存储节点引用
			this.nodeReferences.set(node, {
				parent: node.parentNode,
				nextSibling: node.nextSibling
			});

			return result;
		}

		/**
		 * 清理节点引用
		 * @param {Text} node - 要清理的节点
		 */
		cleanupNodeReferences(node) {
			this.processedNodes.delete(node);
			this.decodedTextNodes.delete(node);
			this.nodeReferences.delete(node);
		}

		/**
		 * 批量清理节点引用
		 * @param {Array<Text>} nodes - 要清理的节点数组
		 */
		cleanupNodeReferencesBatch(nodes) {
			nodes.forEach(node => this.cleanupNodeReferences(node));
		}

		/**
		 * 恢复节点状态
		 * @param {Text} node - 要恢复的节点
		 */
		restoreNodeState(node) {
			const reference = this.nodeReferences.get(node);
			if (reference) {
				const { parent, nextSibling } = reference;
				if (parent && nextSibling) {
					parent.insertBefore(node, nextSibling);
				}
				this.cleanupNodeReferences(node);
			}
		}
	}

	// 确保只初始化一次
	if (window.__base64HelperInstance) {
		return;
	}

	// 只在主窗口中初始化
	if (window.top === window.self) {

		initStyles();

		window.__base64HelperInstance = new Base64Helper();

		// 注册油猴菜单命令
		registerMenuCommands();

		// 确保在页面完全加载后更新菜单命令
		window.addEventListener('load', () => {
			console.log('页面加载完成，更新菜单命令');
			updateMenuCommands();
		});
	}

	// 使用 { once: true } 确保事件监听器只添加一次
	window.addEventListener(
		'unload',
		() => {
			if (window.__base64HelperInstance) {
				window.__base64HelperInstance.destroy();
				delete window.__base64HelperInstance;
			}
		},
		{ once: true }
	);
})();
