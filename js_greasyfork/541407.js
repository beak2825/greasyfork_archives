// ==UserScript==
// @name        GitHub Collapse Markdown
// @version     3.3.0
// @description 🚀 简洁高效的GitHub Markdown标题折叠脚本：智能嵌套🧠+快捷键⌨️+目录📑+搜索🔍+状态记忆💾+简约GUI🔘
// @license     MIT
// @author      Xyea
// @namespace   https://github.com/XyeaOvO/GitHub-Collapse-Markdown
// @homepageURL https://github.com/XyeaOvO/GitHub-Collapse-Markdown
// @supportURL  https://github.com/XyeaOvO/GitHub-Collapse-Markdown/issues
// @match       https://github.com/*
// @match       https://gist.github.com/*
// @match       https://help.github.com/*
// @match       https://docs.github.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @noframes
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/541407/GitHub%20Collapse%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/541407/GitHub%20Collapse%20Markdown.meta.js
// ==/UserScript==

(() => {
	"use strict";

	// 配置常量
	const CONFIG = {
		debug: GM_getValue("ghcm-debug-mode", false), // 调试模式开关
		colors: GM_getValue("ghcm-colors", [
			"#6778d0", "#ac9c3d", "#b94a73", "#56ae6c", "#9750a1", "#ba543d"
		]),
		animation: {
			duration: 200,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)",
			maxAnimatedElements: GM_getValue("ghcm-performance-mode", false) ? 0 : 20, // 根据用户设置
			batchSize: 10 // 批量处理大小
		},
		selectors: {
			markdownContainers: [
				".markdown-body",
				".comment-body"
			],
			headers: ["H1", "H2", "H3", "H4", "H5", "H6"],
			excludeClicks: [".anchor", ".octicon-link", "a", "img"]
		},
		classes: {
			collapsed: "ghcm-collapsed",
			hidden: "ghcm-hidden",
			hiddenByParent: "ghcm-hidden-by-parent",
			noContent: "ghcm-no-content",
			tocContainer: "ghcm-toc-container",
			searchContainer: "ghcm-search-container",
			menuContainer: "ghcm-menu-container",
			menuButton: "ghcm-menu-button",
			bookmarked: "ghcm-bookmarked",
			activeHeading: "ghcm-active-heading",
			hoverHeading: "ghcm-hover-heading"
		},
		hotkeys: {
			enabled: GM_getValue("ghcm-hotkeys-enabled", true),
			toggleAll: "ctrl+shift+a", // 切换所有折叠
			collapseAll: "ctrl+shift+c", // 折叠所有
			expandAll: "ctrl+shift+e", // 展开所有
			showToc: "ctrl+shift+l", // 显示目录
			search: "ctrl+shift+f", // 搜索
			menu: "ctrl+shift+m", // 显示菜单
			bookmark: GM_getValue('ghcm-hotkey-bookmark', 'ctrl+shift+b'),
			nextHeading: 'j',
			prevHeading: 'k',
			navEnabled: GM_getValue('ghcm-nav-enabled', false)
		},
		memory: {
			enabled: GM_getValue("ghcm-memory-enabled", true),
			key: "ghcm-page-states"
		},
		bookmarks: {
			key: 'ghcm-bookmarks'
		},
		ui: {
			showLevelNumber: GM_getValue('ghcm-show-level-number', true),
		arrowSize: GM_getValue('ghcm-arrow-size', '0.8em')
		},
		colorSchemes: {
			default: ["#6778d0", "#ac9c3d", "#b94a73", "#56ae6c", "#9750a1", "#ba543d"],
			pastel:  ["#7aa2f7", "#e6a23c", "#f48fb1", "#9ccc65", "#b39ddb", "#ffab91"],
			vibrant: ["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#f97316"],
		mono:    ["#6b7280", "#6b7280", "#6b7280", "#6b7280", "#6b7280", "#6b7280"]
		}
	};

	const storedCustomColors = GM_getValue('ghcm-custom-colors', null);
	if (Array.isArray(storedCustomColors) && storedCustomColors.length) {
		CONFIG.colorSchemes.custom = storedCustomColors;
	}

	// 日志控制函数
	const Logger = {
		log: (...args) => {
			if (CONFIG.debug) {
				console.log(...args);
			}
		},
		warn: (...args) => {
			console.warn(...args);
		},
		error: (...args) => {
			console.error(...args);
		}
	};

	// GUI菜单管理器
	class MenuManager {
		constructor(app) {
			this.app = app;
			this.isVisible = false;
			this.menuContainer = null;
			this.menuButton = null;
			this.init();
		}

		init() {
			this.createMenuButton();
			this.addMenuStyles();
			// 根据页面是否有 markdown 容器显示/隐藏按钮
			this.updateButtonVisibility();
			['pjax:end','turbo:load','turbo:render','pageshow'].forEach(evt => {
				try { document.addEventListener(evt, () => this.updateButtonVisibility()); } catch {}
			});
		}

		addMenuStyles() {
			GM_addStyle(`
				/* 菜单按钮 */
				.${CONFIG.classes.menuButton} {
					position: fixed;
					bottom: 20px;
					right: 20px;
					width: 50px;
					height: 50px;
					background: #6b7280;
					border: none;
					border-radius: 50%;
					cursor: pointer;
					z-index: 9999;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
					transition: all 0.2s ease;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 18px;
					color: white;
					user-select: none;
				}

				.${CONFIG.classes.menuButton}:hover {
					background: #4b5563;
					transform: translateY(-1px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
				}

				.${CONFIG.classes.menuButton}:active {
					transform: translateY(0) scale(0.95);
				}

				.${CONFIG.classes.menuButton}.menu-open {
					background: #374151;
					transform: rotate(45deg);
				}

				/* 菜单容器 */
				.${CONFIG.classes.menuContainer} {
					position: fixed;
					bottom: 80px;
					right: 20px;
					width: 300px;
					background: rgba(255, 255, 255, 0.98);
					backdrop-filter: blur(10px);
					border: 1px solid #e5e7eb;
					border-radius: 12px;
					box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
					z-index: 9998;
					opacity: 0;
					transform: translateY(10px) scale(0.95);
					transition: all 0.25s ease;
					overflow: hidden;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
				}

				.${CONFIG.classes.menuContainer}.show {
					opacity: 1;
					transform: translateY(0) scale(1);
				}

				/* 菜单头部 */
				.ghcm-menu-header {
					padding: 16px 20px 12px;
					background: #f9fafb;
					color: #374151;
					text-align: center;
					border-bottom: 1px solid #e5e7eb;
				}

				.ghcm-menu-title {
					font-size: 16px;
					font-weight: 600;
					margin: 0 0 4px;
				}

				.ghcm-menu-subtitle {
					font-size: 11px;
					opacity: 0.7;
					margin: 0;
				}

				/* 菜单内容 */
				.ghcm-menu-content {
					padding: 0;
					max-height: 400px;
					overflow-y: auto;
				}

				/* 菜单分组 */
				.ghcm-menu-group {
					padding: 12px 0;
					border-bottom: 1px solid #f3f4f6;
				}

				.ghcm-menu-group:last-child {
					border-bottom: none;
				}

				.ghcm-menu-group-title {
					font-size: 10px;
					font-weight: 600;
					color: #9ca3af;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					margin: 0 20px 8px;
				}

				/* 菜单项 */
				.ghcm-menu-item {
					display: flex;
					align-items: center;
					padding: 10px 20px;
					cursor: pointer;
					transition: background-color 0.15s ease;
					color: #374151;
					text-decoration: none;
					font-size: 13px;
					line-height: 1.4;
				}

				.ghcm-menu-item:hover {
					background: #f3f4f6;
					color: #1f2937;
				}

				.ghcm-menu-item:active {
					background: #e5e7eb;
				}

				.ghcm-menu-item-icon {
					width: 20px;
					height: 20px;
					margin-right: 12px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 16px;
					flex-shrink: 0;
				}

				.ghcm-menu-item-text {
					flex: 1;
					font-weight: 500;
				}

				.ghcm-menu-item-shortcut {
					font-size: 10px;
					color: #9ca3af;
					background: #f3f4f6;
					padding: 2px 6px;
					border-radius: 3px;
					font-family: Monaco, 'Courier New', monospace;
				}

				.ghcm-menu-item-note {
					margin-left: auto;
					font-size: 11px;
					color: #9ca3af;
				}

				.ghcm-menu-item-badge {
					background: #6b7280;
					color: white;
					font-size: 10px;
					padding: 2px 6px;
					border-radius: 6px;
					font-weight: 500;
				}

				/* 切换开关 */
				.ghcm-menu-toggle {
					position: relative;
					width: 36px;
					height: 18px;
					background: #d1d5db;
					border-radius: 9px;
					transition: background 0.2s ease;
					cursor: pointer;
				}

				.ghcm-menu-toggle.active {
					background: #6b7280;
				}

				.ghcm-menu-toggle::after {
					content: '';
					position: absolute;
					top: 2px;
					left: 2px;
					width: 14px;
					height: 14px;
					background: white;
					border-radius: 50%;
					transition: transform 0.2s ease;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				}

				.ghcm-menu-toggle.active::after {
					transform: translateX(18px);
				}

				/* 统计信息 */
				.ghcm-menu-stats {
					padding: 12px 20px;
					background: #f9fafb;
					font-size: 11px;
					color: #6b7280;
					line-height: 1.5;
				}

				.ghcm-menu-stats-item {
					display: flex;
					justify-content: space-between;
					margin-bottom: 3px;
				}

				.ghcm-menu-stats-item:last-child {
					margin-bottom: 0;
				}

				.ghcm-menu-stats-value {
					font-weight: 600;
					color: #374151;
				}

				.ghcm-bookmark-list {
					padding: 6px 10px;
					max-height: 160px;
					overflow-y: auto;
				}

				.ghcm-bookmark-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.ghcm-bookmark-info {
					display: flex;
					flex: 1;
					align-items: center;
					gap: 6px;
				}

				.ghcm-bookmark-level {
					font-size: 10px;
					font-weight: 600;
					color: #6b7280;
				}

				.ghcm-bookmark-text {
					flex: 1;
					font-size: 12px;
					color: #374151;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.ghcm-bookmark-remove {
					background: none;
					border: none;
					color: #9ca3af;
					cursor: pointer;
					padding: 4px;
					border-radius: 4px;
					font-size: 12px;
				}

				.ghcm-bookmark-remove:hover {
					background: rgba(148, 163, 184, 0.18);
					color: #4b5563;
				}

				.ghcm-bookmark-empty {
					padding: 6px 0;
					text-align: center;
					font-size: 12px;
					color: #9ca3af;
				}

				/* 深色主题适配 */
				@media (prefers-color-scheme: dark) {
					.${CONFIG.classes.menuContainer} {
						background: rgba(31, 41, 55, 0.98);
						border-color: #374151;
					}

					.ghcm-menu-header {
						background: #1f2937;
						color: #f9fafb;
						border-bottom-color: #374151;
					}

					.ghcm-menu-item {
						color: #e5e7eb;
					}

					.ghcm-menu-item:hover {
						background: #374151;
						color: #f9fafb;
					}

					.ghcm-menu-group {
						border-bottom-color: #374151;
					}

					.ghcm-menu-group-title {
						color: #9ca3af;
					}

					.ghcm-menu-item-shortcut {
						background: #374151;
						color: #9ca3af;
					}

					.ghcm-menu-stats {
						background: #1f2937;
						color: #9ca3af;
					}

					.ghcm-menu-stats-value {
						color: #e5e7eb;
					}

					.${CONFIG.classes.bookmarked} {
						background: rgba(202, 138, 4, 0.38);
					}

					.ghcm-bookmark-text {
						color: #e5e7eb;
					}

					.ghcm-bookmark-remove:hover {
						background: rgba(75, 85, 99, 0.35);
						color: #f3f4f6;
					}

					.${CONFIG.classes.hoverHeading} {
						background: rgba(75, 85, 99, 0.32);
					}
				}

				/* 响应式设计 */
				@media (max-width: 480px) {
					.${CONFIG.classes.menuContainer} {
						right: 15px;
						width: calc(100vw - 30px);
						max-width: 320px;
					}

					.${CONFIG.classes.menuButton} {
						right: 15px;
						bottom: 15px;
					}
				}
			`);
		}

		createMenuButton() {
			this.menuButton = document.createElement('button');
			this.menuButton.className = CONFIG.classes.menuButton;
			this.menuButton.innerHTML = '⚙️';
			this.menuButton.title = 'GitHub Collapse Markdown 设置';
			this.menuButton.setAttribute('aria-label', '打开设置');
			this.menuButton.setAttribute('aria-expanded', 'false');
			this.menuButton.setAttribute('aria-controls', 'ghcm-menu-panel');

			this.menuButton.addEventListener('click', (e) => {
				e.stopPropagation();
				this.toggle();
			});

			document.body.appendChild(this.menuButton);
		}

		shouldShowButton() {
			try {
				return DOMUtils.hasMarkdownHeadings();
			} catch {
				return true;
			}
		}

		updateButtonVisibility() {
			if (!this.menuButton) return;
			const visible = this.shouldShowButton();
			this.menuButton.style.display = visible ? 'flex' : 'none';
		}

		createMenuContainer() {
			const container = document.createElement('div');
			container.className = CONFIG.classes.menuContainer;
			container.id = 'ghcm-menu-panel';
			container.setAttribute('role', 'dialog');
			container.setAttribute('aria-modal', 'true');
			container.setAttribute('aria-label', 'Collapse Markdown 设置');

			container.innerHTML = `
				<div class="ghcm-menu-header">
					<h3 class="ghcm-menu-title">📝 Collapse Markdown</h3>
					<p class="ghcm-menu-subtitle">智能标题折叠工具</p>
				</div>
				<div class="ghcm-menu-content">
					${this.generateMenuContent()}
				</div>
			`;

			this.setupMenuEvents(container);
			return container;
		}

		generateMenuContent() {
			const stats = this.getStatistics();

				return `
					<div class="ghcm-menu-stats">
						<div class="ghcm-menu-stats-item">
							<span>总标题数</span>
							<span class="ghcm-menu-stats-value" data-stat="total">${stats.total}</span>
						</div>
						<div class="ghcm-menu-stats-item">
							<span>已折叠</span>
							<span class="ghcm-menu-stats-value" data-stat="collapsed">${stats.collapsed}</span>
						</div>
						<div class="ghcm-menu-stats-item">
							<span>可见</span>
							<span class="ghcm-menu-stats-value" data-stat="visible">${stats.visible}</span>
						</div>
					</div>

					<div class="ghcm-menu-group">
						<div class="ghcm-menu-group-title">快速书签</div>
						<div class="ghcm-menu-item" data-action="bookmark-add">
							<div class="ghcm-menu-item-icon">⭐</div>
							<div class="ghcm-menu-item-text">收藏当前标题</div>
							<div class="ghcm-menu-item-shortcut">${CONFIG.hotkeys.bookmark}</div>
						</div>
						<div class="ghcm-menu-item" data-action="bookmark-clear">
							<div class="ghcm-menu-item-icon">🗂️</div>
							<div class="ghcm-menu-item-text">清空本页书签</div>
						</div>
						<div class="ghcm-bookmark-list">
							${this.renderBookmarkListItems()}
						</div>
					</div>

				<div class="ghcm-menu-group">
					<div class="ghcm-menu-group-title">基础操作</div>
					<div class="ghcm-menu-item" data-action="collapseAll">
						<div class="ghcm-menu-item-icon">📁</div>
						<div class="ghcm-menu-item-text">折叠所有</div>
						<div class="ghcm-menu-item-shortcut">${CONFIG.hotkeys.collapseAll}</div>
					</div>
					<div class="ghcm-menu-item" data-action="expandAll">
						<div class="ghcm-menu-item-icon">📂</div>
						<div class="ghcm-menu-item-text">展开所有</div>
						<div class="ghcm-menu-item-shortcut">${CONFIG.hotkeys.expandAll}</div>
					</div>
					<div class="ghcm-menu-item" data-action="toggleAll">
						<div class="ghcm-menu-item-icon">🔄</div>
						<div class="ghcm-menu-item-text">智能切换</div>
						<div class="ghcm-menu-item-shortcut">${CONFIG.hotkeys.toggleAll}</div>
					</div>
				</div>

				<div class="ghcm-menu-group">
					<div class="ghcm-menu-group-title">工具功能</div>
					<div class="ghcm-menu-item" data-action="showToc">
						<div class="ghcm-menu-item-icon">📑</div>
						<div class="ghcm-menu-item-text">目录导航</div>
						<div class="ghcm-menu-item-shortcut">${CONFIG.hotkeys.showToc}</div>
					</div>
					<div class="ghcm-menu-item" data-action="showSearch">
						<div class="ghcm-menu-item-icon">🔍</div>
						<div class="ghcm-menu-item-text">搜索标题</div>
						<div class="ghcm-menu-item-shortcut">${CONFIG.hotkeys.search}</div>
					</div>
				</div>

				<div class="ghcm-menu-group">
					<div class="ghcm-menu-group-title">按级别操作</div>
					<div class="ghcm-menu-item" data-action="collapseLevel-2">
						<div class="ghcm-menu-item-icon">➖</div>
						<div class="ghcm-menu-item-text">仅折叠 H2</div>
					</div>
					<div class="ghcm-menu-item" data-action="expandLevel-2">
						<div class="ghcm-menu-item-icon">➕</div>
						<div class="ghcm-menu-item-text">仅展开 H2</div>
					</div>
					<div class="ghcm-menu-item" data-action="collapseLevel-3">
						<div class="ghcm-menu-item-icon">➖</div>
						<div class="ghcm-menu-item-text">仅折叠 H3</div>
					</div>
					<div class="ghcm-menu-item" data-action="expandLevel-3">
						<div class="ghcm-menu-item-icon">➕</div>
						<div class="ghcm-menu-item-text">仅展开 H3</div>
					</div>
				</div>

					<div class="ghcm-menu-group">
						<div class="ghcm-menu-group-title">设置选项</div>
						<div class="ghcm-menu-item" data-action="togglePerformance">
							<div class="ghcm-menu-item-icon">⚡</div>
							<div class="ghcm-menu-item-text">性能模式</div>
							<div class="ghcm-menu-toggle ${CONFIG.animation.maxAnimatedElements === 0 ? 'active' : ''}" data-toggle="performance"></div>
						</div>
						<div class="ghcm-menu-item" data-action="toggleMemory">
							<div class="ghcm-menu-item-icon">💾</div>
							<div class="ghcm-menu-item-text">状态记忆</div>
							<div class="ghcm-menu-toggle ${CONFIG.memory.enabled ? 'active' : ''}" data-toggle="memory"></div>
						</div>
						<div class="ghcm-menu-item" data-action="toggleHotkeys">
							<div class="ghcm-menu-item-icon">⌨️</div>
							<div class="ghcm-menu-item-text">快捷键</div>
							<div class="ghcm-menu-toggle ${CONFIG.hotkeys.enabled ? 'active' : ''}" data-toggle="hotkeys"></div>
						</div>
						<div class="ghcm-menu-item" data-action="toggleVimNav">
							<div class="ghcm-menu-item-icon">🧭</div>
							<div class="ghcm-menu-item-text">Vim 导航热键</div>
							<div class="ghcm-menu-toggle ${CONFIG.hotkeys.navEnabled ? 'active' : ''}" data-toggle="vimNav"></div>
						</div>
						<div class="ghcm-menu-item" data-action="toggleDebug">
							<div class="ghcm-menu-item-icon">🐛</div>
							<div class="ghcm-menu-item-text">调试模式</div>
							<div class="ghcm-menu-toggle ${CONFIG.debug ? 'active' : ''}" data-toggle="debug"></div>
						</div>
				</div>

					<div class="ghcm-menu-group">
						<div class="ghcm-menu-group-title">样式设置</div>
						<div class="ghcm-menu-item" data-action="toggleShowLevelNumber">
							<div class="ghcm-menu-item-icon">🔽</div>
							<div class="ghcm-menu-item-text">仅显示箭头</div>
							<div class="ghcm-menu-toggle ${CONFIG.ui.showLevelNumber ? '' : 'active'}" data-toggle="showLevel"></div>
						</div>
						<div class="ghcm-menu-item" data-action="customColors">
							<div class="ghcm-menu-item-icon">🖌️</div>
							<div class="ghcm-menu-item-text">自定义配色</div>
						</div>
						<div class="ghcm-menu-item" data-action="adjustArrowSize">
							<div class="ghcm-menu-item-icon">🔠</div>
							<div class="ghcm-menu-item-text">箭头大小</div>
							<div class="ghcm-menu-item-note" data-arrow-size-value>${CONFIG.ui.arrowSize}</div>
						</div>
						<div class="ghcm-menu-item" data-action="setColors-default">
							<div class="ghcm-menu-item-icon">🎨</div>
							<div class="ghcm-menu-item-text">默认配色</div>
						</div>
					<div class="ghcm-menu-item" data-action="setColors-pastel">
						<div class="ghcm-menu-item-icon">🎨</div>
						<div class="ghcm-menu-item-text">柔和 Pastel</div>
					</div>
					<div class="ghcm-menu-item" data-action="setColors-vibrant">
						<div class="ghcm-menu-item-icon">🎨</div>
						<div class="ghcm-menu-item-text">鲜艳 Vibrant</div>
					</div>
					<div class="ghcm-menu-item" data-action="setColors-mono">
						<div class="ghcm-menu-item-icon">🎨</div>
						<div class="ghcm-menu-item-text">单色 Mono</div>
					</div>
				</div>

				<div class="ghcm-menu-group">
					<div class="ghcm-menu-group-title">重置功能</div>
					<div class="ghcm-menu-item" data-action="resetStates">
						<div class="ghcm-menu-item-icon">🔄</div>
						<div class="ghcm-menu-item-text">重置状态</div>
					</div>
					<div class="ghcm-menu-item" data-action="clearMemory">
						<div class="ghcm-menu-item-icon">🗑️</div>
						<div class="ghcm-menu-item-text">清除记忆</div>
					</div>
				</div>

				<div class="ghcm-menu-group">
					<div class="ghcm-menu-group-title">帮助信息</div>
					<div class="ghcm-menu-item" data-action="showHelp">
						<div class="ghcm-menu-item-icon">ℹ️</div>
						<div class="ghcm-menu-item-text">使用说明</div>
					</div>
				</div>
			`;
		}

		setupMenuEvents(container) {
			// 点击菜单项事件
			container.addEventListener('click', (e) => {
				const removeBtn = e.target.closest('[data-remove-bookmark]');
				if (removeBtn) {
					const index = parseInt(removeBtn.getAttribute('data-remove-bookmark'), 10);
					this.app.bookmarkManager.removeBookmarkByIndex(index);
					this.updateBookmarkList();
					e.stopPropagation();
					return;
				}

				const item = e.target.closest('.ghcm-menu-item');
				if (!item) return;

				const action = item.getAttribute('data-action');
				const toggle = e.target.closest('.ghcm-menu-toggle');

				if (toggle) {
					this.handleToggle(toggle);
					return;
				}

				if (action) {
					const shouldClose = this.handleAction(action);
					if (shouldClose !== false) {
						this.hide();
					}
				}
			});

			// 阻止菜单容器内的点击事件冒泡
			container.addEventListener('click', (e) => {
				e.stopPropagation();
			});
		}

		handleAction(action) {
			let shouldClose = true;
			switch (action) {
				case 'collapseAll':
					this.app.collapseManager.collapseAll();
					break;
				case 'expandAll':
					this.app.collapseManager.expandAll();
					break;
				case 'toggleAll':
					this.app.collapseManager.toggleAll();
					break;
				case 'showToc':
					this.app.tocGenerator.toggle();
					break;
				case 'showSearch':
					this.app.searchManager.toggle();
					break;
				case 'togglePerformance':
					this.app.togglePerformanceMode();
					this.refreshMenu();
					break;
				case 'toggleMemory':
					this.app.toggleMemory();
					this.refreshMenu();
					break;
				case 'toggleHotkeys':
					this.app.toggleHotkeys();
					this.refreshMenu();
					break;
				case 'toggleVimNav':
					this.app.toggleVimNav();
					this.refreshMenu();
					break;
				case 'toggleDebug':
					this.app.toggleDebug();
					this.refreshMenu();
					break;
				case 'bookmark-add':
					this.app.bookmarkManager.addBookmarkFromViewport();
					this.refreshMenu();
					shouldClose = false;
					break;
				case 'bookmark-clear':
					this.app.bookmarkManager.clearPageBookmarks();
					this.refreshMenu();
					shouldClose = false;
					break;
				case 'customColors':
					this.app.promptCustomColors();
					this.refreshMenu();
					shouldClose = false;
					break;
				case 'adjustArrowSize':
					this.app.promptArrowSize();
					this.refreshMenu();
					shouldClose = false;
					break;
				case 'resetStates':
					if (confirm('确定要重置当前页面的所有折叠状态吗？')) {
						this.app.resetAllStates();
						this.refreshMenu();
					}
					break;
				case 'clearMemory':
					if (confirm('确定要清除所有页面的记忆数据吗？')) {
						this.app.clearAllMemory();
						this.refreshMenu();
					}
					break;
				case 'showHelp':
					this.app.showHotkeyHelp();
					break;
				default:
					if (action.startsWith('bookmark-open-')) {
						const idx = parseInt(action.split('-')[2], 10);
						if (!Number.isFinite(idx)) {
							shouldClose = false;
							break;
						}
						this.app.bookmarkManager.openBookmarkByIndex(idx);
						break;
					}
					if (action.startsWith('collapseLevel-')) {
						const lvl = parseInt(action.split('-')[1], 10);
						this.app.collapseManager.collapseLevel(lvl);
						break;
					}
					if (action.startsWith('expandLevel-')) {
						const lvl = parseInt(action.split('-')[1], 10);
						this.app.collapseManager.expandLevel(lvl);
						break;
					}
					if (action === 'toggleShowLevelNumber') {
						this.app.toggleShowLevelNumber();
						this.refreshMenu();
						break;
					}
					if (action.startsWith('setColors-')) {
						const scheme = action.split('-')[1];
						this.app.setColorScheme(scheme);
						this.refreshMenu();
						break;
					}
			}
			return shouldClose;
		}

		handleToggle(toggle) {
			const toggleType = toggle.getAttribute('data-toggle');
			const isActive = toggle.classList.contains('active');

			toggle.classList.toggle('active', !isActive);

			switch (toggleType) {
				case 'performance':
					this.app.togglePerformanceMode();
					break;
				case 'memory':
					this.app.toggleMemory();
					break;
				case 'hotkeys':
					this.app.toggleHotkeys();
					break;
				case 'vimNav':
					this.app.toggleVimNav();
					break;
				case 'debug':
					this.app.toggleDebug();
					break;
				case 'showLevel':
					this.app.toggleShowLevelNumber();
					break;
			}
		}

		getStatistics() {
			const headers = this.app.collapseManager.getAllHeaders();
			const collapsed = headers.filter(h => h.classList.contains(CONFIG.classes.collapsed));
			const visible = headers.filter(h =>
				!h.classList.contains(CONFIG.classes.collapsed) &&
				!h.classList.contains(CONFIG.classes.noContent)
			);

			return {
				total: headers.length,
				collapsed: collapsed.length,
				visible: visible.length
			};
		}

		refreshMenu() {
			if (!this.menuContainer || !this.isVisible) return;
			const stats = this.getStatistics();
			this.updateMenuStats(stats);
			this.syncToggleState('performance', CONFIG.animation.maxAnimatedElements === 0);
			this.syncToggleState('memory', CONFIG.memory.enabled);
			this.syncToggleState('hotkeys', CONFIG.hotkeys.enabled);
			this.syncToggleState('vimNav', CONFIG.hotkeys.navEnabled);
			this.syncToggleState('debug', CONFIG.debug);
			// showLevel toggle active 代表仅显示箭头
			this.syncToggleState('showLevel', !CONFIG.ui.showLevelNumber);
			this.updateBookmarkList();
			this.updateArrowSizeValue();
		}

		updateMenuStats(stats) {
			if (!this.menuContainer) return;
			const mapping = {
				total: stats.total,
				collapsed: stats.collapsed,
				visible: stats.visible
			};
			Object.entries(mapping).forEach(([key, value]) => {
				const el = this.menuContainer.querySelector(`.ghcm-menu-stats-value[data-stat="${key}"]`);
				if (el) el.textContent = String(value);
			});
		}

			syncToggleState(toggleType, isActive) {
			if (!this.menuContainer) return;
			const toggle = this.menuContainer.querySelector(`.ghcm-menu-toggle[data-toggle="${toggleType}"]`);
			if (toggle) {
				toggle.classList.toggle('active', !!isActive);
			}
		}

		updateBookmarkList() {
			if (!this.menuContainer) return;
			const list = this.menuContainer.querySelector('.ghcm-bookmark-list');
			if (list) {
				list.innerHTML = this.renderBookmarkListItems();
			}
		}

		updateArrowSizeValue() {
			if (!this.menuContainer) return;
			const value = this.menuContainer.querySelector('[data-arrow-size-value]');
			if (value) value.textContent = CONFIG.ui.arrowSize;
		}

		renderBookmarkListItems() {
			const bookmarks = this.app.bookmarkManager?.getBookmarksForCurrentPage?.() || [];
			if (!bookmarks.length) {
				return `<div class="ghcm-bookmark-empty">暂无书签</div>`;
			}
			return bookmarks.map((bookmark, index) => {
				const levelLabel = typeof bookmark.level === 'number' ? `H${bookmark.level}` : 'H?';
				return `
					<div class="ghcm-menu-item ghcm-bookmark-item" data-action="bookmark-open-${index}">
						<div class="ghcm-bookmark-info">
							<span class="ghcm-bookmark-level">${levelLabel}</span>
							<span class="ghcm-bookmark-text">${this.escapeHtml(bookmark.text || '未命名标题')}</span>
						</div>
						<button class="ghcm-bookmark-remove" type="button" data-remove-bookmark="${index}" aria-label="移除书签">✕</button>
					</div>
				`;
			}).join('');
		}

		escapeHtml(text) {
			return String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
		}

		show() {
			if (this.isVisible) return;

			if (this.menuContainer) {
				this.menuContainer.remove();
			}

			// 打开菜单前关闭其他浮层
			try { this.app.tocGenerator.hideToc(); } catch {}
			try { this.app.searchManager.hideSearch(); } catch {}

			this.menuContainer = this.createMenuContainer();
			document.body.appendChild(this.menuContainer);

			// 动画显示
			requestAnimationFrame(() => {
				this.menuContainer.classList.add('show');
			});

			this.menuButton.classList.add('menu-open');
			this.menuButton.setAttribute('aria-expanded', 'true');
			this.isVisible = true;

			// 点击外部关闭
			setTimeout(() => {
				document.addEventListener('click', this.hideOnClickOutside);
			}, 100);

			// ESC 关闭
			this._keyHandler = (e) => {
				if (e.key === 'Escape') this.hide();
			};
			document.addEventListener('keydown', this._keyHandler);

			// 初始焦点
			try { this.menuContainer.setAttribute('tabindex','-1'); this.menuContainer.focus(); } catch {}
		}

		hide() {
			if (!this.isVisible || !this.menuContainer) return;

			this.menuContainer.classList.remove('show');
			this.menuButton.classList.remove('menu-open');
			this.menuButton.setAttribute('aria-expanded', 'false');

			setTimeout(() => {
				if (this.menuContainer) {
					this.menuContainer.remove();
					this.menuContainer = null;
				}
			}, 300);

			this.isVisible = false;
			document.removeEventListener('click', this.hideOnClickOutside);
			if (this._keyHandler) {
				document.removeEventListener('keydown', this._keyHandler);
				this._keyHandler = null;
			}
		}

		toggle() {
			if (this.isVisible) {
				this.hide();
			} else {
				this.show();
			}
		}

		hideOnClickOutside = (e) => {
			if (!this.menuContainer?.contains(e.target) &&
				!this.menuButton?.contains(e.target)) {
				this.hide();
			}
		}
	}

	class HelpModal {
		constructor(app) {
			this.app = app;
			this.overlay = null;
			this.modal = null;
			this.contentContainer = null;
			this.content = null;
			this.closeButton = null;
			this.previousActive = null;
			this.handleOverlayClick = this.handleOverlayClick.bind(this);
			this.handleKeydown = this.handleKeydown.bind(this);
		}

		ensureElements() {
			if (this.overlay) return;

			this.overlay = document.createElement('div');
			this.overlay.className = 'ghcm-help-overlay';

			this.modal = document.createElement('div');
			this.modal.className = 'ghcm-help-modal';
			this.modal.setAttribute('role', 'dialog');
			this.modal.setAttribute('aria-modal', 'true');
			this.modal.setAttribute('aria-label', 'GitHub Collapse Markdown 使用说明');
			this.modal.setAttribute('tabindex', '-1');

			const header = document.createElement('div');
			header.className = 'ghcm-help-header';

			const title = document.createElement('div');
			title.className = 'ghcm-help-title';

			const titleText = document.createElement('span');
			titleText.className = 'ghcm-help-title-text';
			titleText.textContent = 'GitHub Collapse Markdown';

			const titleSub = document.createElement('span');
			titleSub.className = 'ghcm-help-title-sub';
			titleSub.textContent = '使用说明';

			title.append(titleText, titleSub);

			this.closeButton = document.createElement('button');
			this.closeButton.type = 'button';
			this.closeButton.className = 'ghcm-help-close';
			this.closeButton.setAttribute('aria-label', '关闭使用说明弹窗');
			this.closeButton.textContent = '✕';
			this.closeButton.addEventListener('click', () => this.hide());

			header.append(title, this.closeButton);

			this.contentContainer = document.createElement('div');
			this.contentContainer.className = 'ghcm-help-content';

			this.content = document.createElement('article');
			this.content.className = 'markdown-body';
			this.contentContainer.appendChild(this.content);

			this.modal.append(header, this.contentContainer);
			this.overlay.appendChild(this.modal);
		}

		show() {
			this.ensureElements();
			this.previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;

			this.updateContent();

			try { this.app.menuManager?.hide(); } catch {}
			try { this.app.tocGenerator?.hideToc?.(); } catch {}
			try { this.app.searchManager?.hideSearch?.(); } catch {}

			if (!this.overlay.isConnected) {
				document.body.appendChild(this.overlay);
			}

			requestAnimationFrame(() => {
				this.overlay.classList.add('show');
			});

			document.addEventListener('keydown', this.handleKeydown, true);
			this.overlay.addEventListener('click', this.handleOverlayClick);

			try { this.modal.focus(); } catch {}
		}

		hide() {
			if (!this.overlay) return;
			this.overlay.classList.remove('show');
			document.removeEventListener('keydown', this.handleKeydown, true);
			this.overlay.removeEventListener('click', this.handleOverlayClick);

			setTimeout(() => {
				if (this.overlay?.parentNode) {
					this.overlay.parentNode.removeChild(this.overlay);
				}
			}, 220);

			if (this.previousActive) {
				try { this.previousActive.focus(); } catch {}
			}
		}

		handleOverlayClick(event) {
			if (event.target === this.overlay) {
				this.hide();
			}
		}

		handleKeydown(event) {
			if (event.key === 'Escape') {
				event.stopPropagation();
				event.preventDefault();
				this.hide();
			}
		}

		updateContent() {
			if (!this.content) return;
			this.content.innerHTML = this.generateContentHTML();
			this.contentContainer.scrollTop = 0;
		}

		generateContentHTML() {
			const hotkeys = CONFIG.hotkeys;
			const navHint = hotkeys.navEnabled ? '（Vim 导航已启用）' : '（默认关闭，可在设置中开启）';
			return `
<h1>🚀 GitHub Collapse Markdown 使用指南</h1>
<p>脚本为 GitHub 上的 Markdown、Issue、PR 与 Gist 页面提供标题折叠、目录导航、搜索、书签与状态记忆等增强功能。本指南涵盖快速入门、快捷键、界面操作、设置项与进阶技巧。</p>

<section class="ghcm-help-section">
	<h2>⚡ 快速开始</h2>
	<ol>
		<li>打开任意支持的 GitHub 页面，脚本会在右下角生成浮动菜单按钮。</li>
		<li>点击任意标题即可折叠/展开对应内容，嵌套标题会智能保持层级状态。</li>
		<li>使用右下角菜单或快捷键 ${this.wrapHotkey(hotkeys.menu)} 呼出设置面板，探索目录、搜索和自定义选项。</li>
		<li>折叠状态与书签会针对当前页面自动保存，刷新后仍保持。</li>
	</ol>
</section>

<section class="ghcm-help-section">
	<h2>⌨️ 快捷键速查</h2>
	<div class="ghcm-help-grid">
		<div class="ghcm-help-card">
			<h3>折叠与视图</h3>
			${this.renderShortcut('折叠全部', hotkeys.collapseAll)}
			${this.renderShortcut('展开全部', hotkeys.expandAll)}
			${this.renderShortcut('智能切换', hotkeys.toggleAll)}
			${this.renderShortcut('显示菜单', hotkeys.menu)}
		</div>
		<div class="ghcm-help-card">
			<h3>导航工具</h3>
			${this.renderShortcut('打开目录', hotkeys.showToc)}
			${this.renderShortcut('搜索标题', hotkeys.search)}
			${this.renderShortcut('收藏当前标题', hotkeys.bookmark)}
		</div>
		<div class="ghcm-help-card">
			<h3>高级导航 ${this.escapeHtml(navHint)}</h3>
			${this.renderShortcut('下一标题', hotkeys.nextHeading)}
			${this.renderShortcut('上一标题', hotkeys.prevHeading)}
		</div>
	</div>
	<p class="ghcm-help-footnote">快捷键可在设置菜单中整体开关；收藏、导航键位均支持自定义（Tampermonkey 菜单）。</p>
</section>

<section class="ghcm-help-section">
	<h2>🖱️ 鼠标手势</h2>
	<ul class="ghcm-help-list">
		<li><strong>单击标题</strong><span>折叠或展开对应内容块。</span></li>
		<li><strong>Shift + 单击</strong><span>同步折叠/展开当前层级所有标题。</span></li>
		<li><strong>悬停标题</strong><span>查看当前层级高亮，配合目录定位更直观。</span></li>
		<li><strong>右下角菜单按钮</strong><span>打开现代化 GUI，集中管理所有功能。</span></li>
	</ul>
</section>

<section class="ghcm-help-section">
	<h2>🎛️ 主要界面</h2>
	<div class="ghcm-help-grid">
		<div class="ghcm-help-card">
			<h3>目录导航</h3>
			<p>以树形结构展示页面所有标题，支持自动折叠同步、快速跳转与当前标题高亮。</p>
		</div>
		<div class="ghcm-help-card">
			<h3>标题搜索</h3>
			<p>即时索引当前页面标题，支持模糊匹配、键盘上下键切换结果以及 Tab/Shift+Tab 在输入框与结果间移动。</p>
		</div>
		<div class="ghcm-help-card">
			<h3>书签面板</h3>
			<p>为常用段落添加收藏，支持从视窗捕获、列表跳转与一键清除，跨会话持久保存。</p>
		</div>
	</div>
</section>

<section class="ghcm-help-section">
	<h2>⚙️ 设置选项</h2>
	<ul class="ghcm-help-list">
		<li><strong>性能模式</strong><span>在长篇文档中禁用动画，提升滚动与切换响应。</span></li>
		<li><strong>状态记忆</strong><span>按页面保存折叠状态与展开偏好，可随时清空。</span></li>
		<li><strong>快捷键总开关</strong><span>与 Vim 导航独立控制，满足不同编辑习惯。</span></li>
		<li><strong>箭头外观</strong><span>可切换显示级别数字、调整箭头尺寸并自定义配色。</span></li>
	</ul>
</section>

<section class="ghcm-help-section">
	<h2>💡 实用技巧</h2>
	<ul class="ghcm-help-list">
		<li><strong>智能嵌套</strong><span>展开父级标题不会强制展开子级，保持阅读上下文。</span></li>
		<li><strong>哈希定位</strong><span>访问含锚点链接时自动展开相关标题并滚动到视图。</span></li>
		<li><strong>跨页面记忆</strong><span>Issue / PR / Wiki / 文档页面均以 URL 为键保存状态。</span></li>
		<li><strong>调试模式</strong><span>启用后在控制台输出内部状态，便于排查自定义冲突。</span></li>
	</ul>
</section>

<p class="ghcm-help-footnote">如遇折叠异常，可在菜单中清空记忆数据或刷新页面重新加载脚本；欢迎在 GitHub Issues 提交反馈与建议。</p>
`.trim();
		}

		renderShortcut(label, hotkey) {
			return `
		<div class="ghcm-help-shortcut">
			<span>${this.escapeHtml(label)}</span>
			${this.wrapHotkey(hotkey)}
		</div>
		`.trim();
		}

		wrapHotkey(hotkey) {
			return `<span class="ghcm-help-kbd"><span>${this.escapeHtml(hotkey || '未设置')}</span></span>`;
		}

		escapeHtml(text) {
			return String(text ?? '').replace(/[&<>"']/g, char => ({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;'
			}[char] || char));
		}
	}

	// 状态管理
	class StateManager {
		constructor() {
			this.headerStates = new Map();
			this.observers = [];
			this.pageUrl = this.getPageKey();
			this._saveTimer = null;
			this._pendingSave = false;
			this._saveDelay = 200;
			try {
				window.addEventListener('beforeunload', () => this.flushPendingSave());
			} catch {}
		}

		getPageKey() {
			try {
				return `${window.location.origin}${window.location.pathname}`;
			} catch (e) {
				return window.location.href;
			}
		}

		updatePageKey() {
			const newKey = this.getPageKey();
			if (newKey !== this.pageUrl) {
				this.headerStates.clear();
				this.pageUrl = newKey;
			}
		}

		setHeaderState(headerKey, state) {
			this.headerStates.set(headerKey, state);
			this.scheduleSave();
		}

		getHeaderState(headerKey) {
			return this.headerStates.get(headerKey);
		}

		generateHeaderKey(element) {
			// 优先使用稳定的 DOM id/锚点，避免文本或位置变化导致状态错配
			try {
				const normalize = value => (typeof value === 'string' ? value.trim() : '');
				const isSynthetic = id => /^ghcm-(?:bookmark|h)-/i.test(id || '');
				const stableId = (() => {
					const directId = normalize(element.getAttribute?.('id') || element.id);
					if (directId && !isSynthetic(directId)) return directId;

					const anchor = element.querySelector?.('.anchor');
					if (anchor) {
						const anchorId = normalize(anchor.getAttribute('id'));
						if (anchorId && !isSynthetic(anchorId)) return anchorId;
						const hrefId = normalize(anchor.getAttribute('href')?.replace(/^#/, ''));
						if (hrefId && !isSynthetic(hrefId)) return hrefId;
					}

					const anyWithId = element.querySelector?.('[id]');
					const childId = normalize(anyWithId?.getAttribute('id'));
					if (childId && !isSynthetic(childId)) return childId;
					return null;
				})();

				if (stableId) return `id:${stableId}`;
			} catch {}

			// 回退到基于 level+文本+位置 的键
			const level = this.getHeaderLevel(element);
			const text = element.textContent?.trim() || "";
			const position = Array.from(element.parentElement?.children || []).indexOf(element);
			return `${level}-${text}-${position}`;
		}

		getHeaderLevel(element) {
			return DOMUtils.getHeadingLevel(element);
		}

		clear() {
			this.headerStates.clear();
			this.scheduleSave({ force: true });
		}

		// 状态记忆功能
		scheduleSave({ force = false } = {}) {
			if (!CONFIG.memory.enabled) {
				this.cancelScheduledSave();
				return;
			}

			this._pendingSave = true;
			if (force) {
				this.flushPendingSave();
				return;
			}

			if (this._saveTimer) return;
			this._saveTimer = setTimeout(() => {
				this.flushPendingSave();
			}, this._saveDelay);
		}

		cancelScheduledSave() {
			if (this._saveTimer) {
				clearTimeout(this._saveTimer);
				this._saveTimer = null;
			}
			this._pendingSave = false;
		}

		flushPendingSave() {
			if (!this._pendingSave) return;
			this._pendingSave = false;
			if (this._saveTimer) {
				clearTimeout(this._saveTimer);
				this._saveTimer = null;
			}
			if (!CONFIG.memory.enabled) return;

			try {
				const pageStates = GM_getValue(CONFIG.memory.key, {});
				const currentStates = {};

				this.headerStates.forEach((state, key) => {
					currentStates[key] = state.isCollapsed;
				});

				pageStates[this.pageUrl] = currentStates;
				GM_setValue(CONFIG.memory.key, pageStates);
			} catch (e) {
				Logger.warn("[GHCM] 保存状态失败:", e);
			}
		}

		loadFromMemory() {
			if (!CONFIG.memory.enabled) return;

			try {
				const pageStates = GM_getValue(CONFIG.memory.key, {});
				const currentStates = pageStates[this.pageUrl];

				if (currentStates) {
					Object.entries(currentStates).forEach(([key, isCollapsed]) => {
						this.headerStates.set(key, { isCollapsed });
					});
					Logger.log(`[GHCM] 已加载 ${Object.keys(currentStates).length} 个已保存的状态`);
				}
			} catch (e) {
				Logger.warn("[GHCM] 加载状态失败:", e);
			}
		}

		clearMemory() {
			try {
				const pageStates = GM_getValue(CONFIG.memory.key, {});
				delete pageStates[this.pageUrl];
				GM_setValue(CONFIG.memory.key, pageStates);
				Logger.log("[GHCM] 已清除当前页面的记忆状态");
			} catch (e) {
				Logger.warn("[GHCM] 清除状态失败:", e);
			}
		}
	}

	// 快捷键管理器
	const EVENT_HANDLED_FLAG = '__ghcmHotkeyHandled__';

	class HotkeyManager {
		constructor(collapseManager) {
			this.collapseManager = collapseManager;
			this._boundHandler = null;
			this._isBound = false;
			this.app = null;
			this._listenerOptions = { capture: true, passive: false };
			const nativeWindow = (() => {
				try { return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window; }
				catch { return window; }
			})();
			this._listenerTargets = Array.from(new Set([nativeWindow, document]));
			this.setupHotkeys();
		}

		setApp(app) {
			this.app = app;
		}

		setupHotkeys() {
			if (!CONFIG.hotkeys.enabled || this._isBound) return;

			if (!this._boundHandler) {
				this._boundHandler = this.handleKeyDown.bind(this);
			}
			this._listenerTargets.forEach(target => {
				try { target.addEventListener('keydown', this._boundHandler, this._listenerOptions); } catch {}
			});
			this._isBound = true;
			Logger.log("[GHCM] 快捷键已启用:", Object.entries(CONFIG.hotkeys)
				.filter(([k]) => k !== 'enabled' && k !== 'navEnabled')
				.map(([k, v]) => `${k}: ${v}`)
				.join(', '));
		}

		teardownHotkeys() {
			if (this._isBound && this._boundHandler) {
				this._listenerTargets.forEach(target => {
					try { target.removeEventListener('keydown', this._boundHandler, this._listenerOptions); } catch {}
				});
				this._isBound = false;
			}
		}

		blockEvent(event) {
			try {
				event.preventDefault();
				event.stopPropagation();
				if (typeof event.stopImmediatePropagation === 'function') {
					event.stopImmediatePropagation();
				}
			} catch {}
		}

		handleKeyDown(event) {
			if (event[EVENT_HANDLED_FLAG]) return;
			event[EVENT_HANDLED_FLAG] = true;

			if (!CONFIG.hotkeys.enabled) return;
			// 在输入/可编辑区域内不触发全局快捷键
			try {
				const t = event.target;
				if (t && (t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]')))
					return;
			} catch {}

			const combo = this.getKeyCombo(event);

			switch (combo) {
				case CONFIG.hotkeys.collapseAll:
					this.blockEvent(event);
					this.collapseManager.collapseAll();
					break;
				case CONFIG.hotkeys.expandAll:
					this.blockEvent(event);
					this.collapseManager.expandAll();
					break;
				case CONFIG.hotkeys.toggleAll:
					this.blockEvent(event);
					this.collapseManager.toggleAll();
					break;
				case CONFIG.hotkeys.showToc:
					this.blockEvent(event);
					this.collapseManager.toggleToc();
					break;
				case CONFIG.hotkeys.search:
					this.blockEvent(event);
					this.collapseManager.toggleSearch();
					break;
				case CONFIG.hotkeys.menu:
					this.blockEvent(event);
					if (this.collapseManager.menuManager) {
						this.collapseManager.menuManager.toggle();
					}
					break;
				case CONFIG.hotkeys.bookmark:
					this.blockEvent(event);
					this.app?.bookmarkManager?.toggleBookmarkForActiveHeader();
					break;
			}

			if (CONFIG.hotkeys.navEnabled) {
				if (combo === CONFIG.hotkeys.nextHeading) {
					this.blockEvent(event);
					this.collapseManager.focusNextHeading();
					return;
				}
				if (combo === CONFIG.hotkeys.prevHeading) {
					this.blockEvent(event);
					this.collapseManager.focusPreviousHeading();
					return;
				}
			}
		}

		getKeyCombo(event) {
			const keys = [];
			const isMac = (() => { try { return /mac/i.test(navigator.platform || navigator.userAgent || ''); } catch { return false; } })();
			if (event.ctrlKey || (isMac && event.metaKey)) keys.push('ctrl');
			if (event.shiftKey) keys.push('shift');
			if (event.altKey) keys.push('alt');
			if (event.metaKey && !isMac) keys.push('meta');

			const key = event.key.toLowerCase();
			if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
				keys.push(key);
			}

			return keys.join('+');
		}
	}

	// 目录生成器
	class TocGenerator {
		constructor() {
			this.tocContainer = null;
			this.isVisible = false;
			this._keyHandler = null;
			this._idSeed = 0;
			this._scrollHandler = null;
			this._raf = null;
		}

		generateToc() {
			const headers = this.getAllHeaders();
			if (headers.length === 0) return null;

			const toc = document.createElement('div');
			toc.className = CONFIG.classes.tocContainer;
			toc.setAttribute('role', 'dialog');
			toc.setAttribute('aria-modal', 'false');
			toc.setAttribute('aria-label', '目录导航');
			toc.innerHTML = `
				<div class="ghcm-toc-header">
					<h3 id="ghcm-toc-title">📑 目录导航</h3>
					<button class="ghcm-toc-close" title="关闭目录" aria-label="关闭目录">✕</button>
				</div>
				<div class="ghcm-toc-content">
					${this.generateTocItems(headers)}
				</div>
			`;

			this.setupTocEvents(toc);
			return toc;
		}

		getAllHeaders() {
			// 复用 CollapseManager 的收集以减少重复遍历
			const source = (this.collapseManager && typeof this.collapseManager.getAllHeaders === 'function')
				? this.collapseManager.getAllHeaders()
				: DOMUtils.collectHeadings();

			const list = source.map(el => ({
				element: el,
				level: DOMUtils.getHeadingLevel(el),
				text: el.textContent.trim(),
				id: this.getHeaderId(el)
			}));

			return this.dedupeById(list);
		}

		// 以 header id 去重，避免部分页面 DOM 结构重复扫描
		dedupeById(items) {
			try {
				const map = new Map();
				for (const it of items) {
					if (!it || !it.id) continue;
					if (!map.has(it.id)) map.set(it.id, it);
				}
				return Array.from(map.values());
			} catch {
				return items;
			}
		}

		generateTocItems(headers) {
			return headers.map(header => {
				const indent = (header.level - 1) * 20;
				const element = header.element;
				const isCollapsed = element?.classList?.contains(CONFIG.classes.collapsed);
				let isNavigable = true;
				try {
					if (element && this.collapseManager && typeof this.collapseManager.isHeaderNavigable === 'function') {
						isNavigable = this.collapseManager.isHeaderNavigable(element);
					}
				} catch {}
				const shouldShowCollapsed = Boolean(isCollapsed || !isNavigable);
				const collapseIcon = shouldShowCollapsed ? '▶' : '▼';
				const collapsedClass = shouldShowCollapsed ? ' ghcm-toc-item-collapsed' : '';

				return `
					<div class="ghcm-toc-item${collapsedClass}" style="padding-left: ${indent}px;" data-level="${header.level}" data-header-id="${header.id}" tabindex="0">
						<span class="ghcm-toc-collapse-icon">${collapseIcon}</span>
						<a href="#${header.id}" class="ghcm-toc-link" data-header-id="${header.id}">
							${header.text}
						</a>
					</div>
				`;
			}).join('');
		}

		getHeaderId(element) {
			// 尝试获取已有的ID
			const anchor = element.querySelector('.anchor');
			if (anchor) return anchor.getAttribute('href')?.slice(1) || '';

			const id = element.id || element.getAttribute('id');
			if (id) return id;

			// 无现成ID，则赋予一个稳定、唯一的ID
			const newId = `ghcm-h-${++this._idSeed}`;
			try { element.setAttribute('id', newId); } catch {}
			return newId;
		}

		getElementPosition(element) {
			let position = 0;
			let current = element;
			while (current && current.parentNode) {
				const siblings = Array.from(current.parentNode.children);
				position += siblings.indexOf(current);
				current = current.parentNode;
			}
			return position;
		}

		setupTocEvents(toc) {
			// 关闭按钮
			toc.querySelector('.ghcm-toc-close').addEventListener('click', () => {
				this.hideToc();
			});

			// 整行可点击：事件委托在容器上处理
			toc.addEventListener('click', (e) => {
				const item = e.target.closest('.ghcm-toc-item');
				if (!item) return;
				e.preventDefault();
				const headerId = item.getAttribute('data-header-id') || item.querySelector('.ghcm-toc-link')?.getAttribute('data-header-id');
				if (headerId) this.scrollToHeader(headerId);
			});

			// 键盘回车/空格激活整行
			toc.addEventListener('keydown', (e) => {
				if (e.key !== 'Enter' && e.key !== ' ') return;
				const item = e.target.closest('.ghcm-toc-item');
				if (!item) return;
				e.preventDefault();
				const headerId = item.getAttribute('data-header-id') || item.querySelector('.ghcm-toc-link')?.getAttribute('data-header-id');
				if (headerId) this.scrollToHeader(headerId);
			});
		}

		scrollToHeader(headerId) {
			const element = document.getElementById(headerId) ||
							document.querySelector(`[id="${headerId}"]`) ||
							document.querySelector(`#user-content-${headerId}`);

			if (element) {
				// 如果标题被折叠，自动展开其父级
				this.expandParentHeaders(element);
				// 使用统一滚动函数，避免重复滚动与抖动
				requestAnimationFrame(() => {
					this.collapseManager.scrollToElement(element);
					this.collapseManager.setActiveHeading(element);
				});
				// 更新目录显示状态
				setTimeout(() => {
					this.refreshTocStates();
				}, 300);
			}
		}

		// 刷新目录中的折叠状态显示
		refreshTocStates() {
			if (!this.tocContainer) return;

			const tocItems = this.tocContainer.querySelectorAll('.ghcm-toc-item');
			tocItems.forEach(item => {
				const link = item.querySelector('.ghcm-toc-link');
				const icon = item.querySelector('.ghcm-toc-collapse-icon');
				if (!link || !icon) return;

				const headerId = link.getAttribute('data-header-id');
				if (!headerId) return;

				const safeId = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') ? CSS.escape(headerId) : headerId;
				let headerElement = document.getElementById(headerId);
				if (!headerElement) {
					try { headerElement = document.querySelector(`[id="${headerId}"]`); } catch {}
				}
				if (!headerElement && safeId) {
					try { headerElement = document.querySelector(`#${safeId}`); } catch {}
				}
				if (!headerElement && safeId) {
					try { headerElement = document.querySelector(`#user-content-${safeId}`); } catch {}
				}
				if (!headerElement) {
					try { headerElement = document.querySelector(`#user-content-${headerId}`); } catch {}
				}

				if (!headerElement) {
					icon.textContent = '▼';
					item.classList.remove('ghcm-toc-item-collapsed');
					return;
				}

				const isCollapsed = headerElement.classList.contains(CONFIG.classes.collapsed);
				let isNavigable = true;
				try {
					if (this.collapseManager && typeof this.collapseManager.isHeaderNavigable === 'function') {
						isNavigable = this.collapseManager.isHeaderNavigable(headerElement);
					}
				} catch {}

				const shouldShowCollapsed = Boolean(isCollapsed || !isNavigable);
				icon.textContent = shouldShowCollapsed ? '▶' : '▼';
				item.classList.toggle('ghcm-toc-item-collapsed', shouldShowCollapsed);
			});
		}

		expandParentHeaders(targetElement) {
			// 找到对应的collapseManager实例并展开到该标题
		if (window.ghcmInstance && window.ghcmInstance.collapseManager) {
			window.ghcmInstance.collapseManager.expandToHeader(targetElement, { scroll: false, setActive: false });
		}
		}

		showToc() {
			if (this.tocContainer) {
				this.tocContainer.remove();
			}

			this.tocContainer = this.generateToc();
			if (this.tocContainer) {
				// 打开目录前关闭其他浮层
				try { this.collapseManager?.menuManager?.hide(); } catch {}
				try { this.collapseManager?.searchManager?.hideSearch(); } catch {}
				document.body.appendChild(this.tocContainer);
				this.isVisible = true;

				// ESC 关闭
				this._keyHandler = (e) => {
					if (e.key === 'Escape') this.hideToc();
				};
				document.addEventListener('keydown', this._keyHandler);

				// 初始焦点
				try { this.tocContainer.setAttribute('tabindex', '-1'); this.tocContainer.focus(); } catch {}

				// 确保状态正确显示
				setTimeout(() => {
					this.refreshTocStates();
				}, 100);

				// 启动滚动监听（Scroll Spy）
				this.startScrollSpy();
			}
		}

		hideToc() {
			if (this.tocContainer) {
				this.tocContainer.remove();
				this.tocContainer = null;
				this.isVisible = false;
				if (this._keyHandler) {
					document.removeEventListener('keydown', this._keyHandler);
					this._keyHandler = null;
				}
				this.stopScrollSpy();
			}
		}

		toggle() {
			if (this.isVisible) {
				this.hideToc();
			} else {
				this.showToc();
			}
		}

		// ========= Scroll Spy =========
		startScrollSpy() {
			if (this._scrollHandler) return;
			this._scrollHandler = () => {
				if (this._raf) return;
				this._raf = requestAnimationFrame(() => {
					this._raf = null;
					this.updateActiveFromScroll();
				});
			};
			window.addEventListener('scroll', this._scrollHandler, { passive: true });
			window.addEventListener('resize', this._scrollHandler, { passive: true });
			// 初次计算
			this.updateActiveFromScroll();
		}

		stopScrollSpy() {
			if (!this._scrollHandler) return;
			window.removeEventListener('scroll', this._scrollHandler);
			window.removeEventListener('resize', this._scrollHandler);
			this._scrollHandler = null;
			if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
		}

		updateActiveFromScroll() {
			try {
				const headers = this.getAllHeaders();
				if (!headers.length || !this.tocContainer) return;
				const headerEl = document.querySelector('header[role="banner"], .Header, .AppHeader-globalBar');
				const headerOffset = (headerEl?.offsetHeight || 80) + 20;
				const pos = window.scrollY + headerOffset + 1;
				let active = null;
				let firstNavigable = null;

				for (const h of headers) {
					const element = h.element;
					if (!element) continue;

					let isNavigable = true;
					try {
						if (this.collapseManager && typeof this.collapseManager.isHeaderNavigable === 'function') {
							isNavigable = this.collapseManager.isHeaderNavigable(element);
						}
					} catch {}

					if (isNavigable && !firstNavigable) {
						firstNavigable = h;
					}

					if (!isNavigable) {
						continue;
					}

					const rect = element.getBoundingClientRect();
					const top = rect.top + window.pageYOffset;
					if (top <= pos) {
						active = h;
					} else {
						break;
					}
				}

				if (!active) {
					active = firstNavigable;
				}

				if (active) {
					if (active.id) {
						this.highlightTocById(active.id);
					}
					this.collapseManager?.setActiveHeading(active.element);
				}
			} catch {}
		}

		highlightTocById(id) {
			if (!this.tocContainer) return;
			this.tocContainer.querySelectorAll('.ghcm-toc-item').forEach(el => el.classList.remove('active'));
			const link = this.tocContainer.querySelector(`.ghcm-toc-link[data-header-id="${CSS.escape(id)}"]`);
			if (link) {
				const item = link.closest('.ghcm-toc-item');
				if (item) item.classList.add('active');
			}
		}
	}

	// 搜索功能
	class SearchManager {
		constructor(collapseManager) {
			this.collapseManager = collapseManager;
			this.searchContainer = null;
			this.isVisible = false;
			this.activeIndex = -1;
			this._keyHandler = null;
			this._headerIndex = [];
			this._indexDirty = true;
			this._indexSeed = 0;
			this._idMap = new WeakMap();
		}

		invalidateIndex() {
			if (this._headerIndex.length) {
				try {
					this._headerIndex.forEach(item => {
						item?.element?.removeAttribute?.('data-search-id');
					});
				} catch {}
			}
			this._headerIndex = [];
			this._indexDirty = true;
			this._idMap = new WeakMap();
		}

		ensureIndex() {
			if (!this._indexDirty && this._headerIndex.length) {
				return this._headerIndex;
			}

			const elements = DOMUtils.collectHeadings();
			const index = elements.map(el => {
				const existingId = this._idMap.get(el);
				const id = existingId || `search-header-${++this._indexSeed}`;
				this._idMap.set(el, id);
				try { el.setAttribute('data-search-id', id); } catch {}
				return {
					element: el,
					level: DOMUtils.getHeadingLevel(el),
					text: el.textContent.trim(),
					id
				};
			});

			this._headerIndex = index;
			this._indexDirty = false;
			return this._headerIndex;
		}

		createSearchUI() {
			const container = document.createElement('div');
			container.className = CONFIG.classes.searchContainer;
			container.setAttribute('role', 'dialog');
			container.setAttribute('aria-modal', 'true');
			container.setAttribute('aria-label', '搜索标题');
			container.innerHTML = `
				<div class="ghcm-search-header">
					<h3 id="ghcm-search-title">🔍 搜索标题</h3>
					<button class="ghcm-search-close" title="关闭搜索" aria-label="关闭搜索">✕</button>
				</div>
				<div class="ghcm-search-content">
					<input type="text" class="ghcm-search-input" placeholder="输入关键词搜索标题..." autocomplete="off">
					<div class="ghcm-search-filters">
						<div class="ghcm-level-filters" aria-label="过滤级别">
							<label><input type="checkbox" data-level="1" checked> H1</label>
							<label><input type="checkbox" data-level="2" checked> H2</label>
							<label><input type="checkbox" data-level="3" checked> H3</label>
							<label><input type="checkbox" data-level="4" checked> H4</label>
							<label><input type="checkbox" data-level="5" checked> H5</label>
							<label><input type="checkbox" data-level="6" checked> H6</label>
						</div>
						<div class="ghcm-search-hint-row">Enter 跳转，Shift+Enter 上一个</div>
					</div>
					<div class="ghcm-search-results"></div>
				</div>
			`;

			this.setupSearchEvents(container);
			return container;
		}

		setupSearchEvents(container) {
			const input = container.querySelector('.ghcm-search-input');
			const results = container.querySelector('.ghcm-search-results');
			const closeBtn = container.querySelector('.ghcm-search-close');
            const levelBox = container.querySelector('.ghcm-level-filters');

            // 级别过滤默认全部启用
            this.levelFilter = new Set([1,2,3,4,5,6]);

			// 实时搜索
			let searchTimeout;
			input.addEventListener('input', () => {
				clearTimeout(searchTimeout);
				searchTimeout = setTimeout(() => {
					this.performSearch(input.value.trim(), results);
				}, 300);
			});

			// 级别过滤变更
			levelBox.addEventListener('change', (e) => {
				const cb = e.target.closest('input[type="checkbox"][data-level]');
				if (!cb) return;
				const lvl = parseInt(cb.getAttribute('data-level'), 10);
				if (cb.checked) this.levelFilter.add(lvl); else this.levelFilter.delete(lvl);
				this.performSearch(input.value.trim(), results);
			});

			// 关闭搜索
			closeBtn.addEventListener('click', () => {
				this.hideSearch();
			});

			// 搜索结果点击委托
			results.addEventListener('click', (event) => {
				const item = event.target.closest('.ghcm-search-result');
				if (!item) return;
				const headerId = item.getAttribute('data-header-element');
				if (headerId) {
					this.jumpToHeader(headerId);
				}
			});

			results.addEventListener('focusin', (event) => {
				const item = event.target.closest('.ghcm-search-result');
				if (!item) return;
				const items = Array.from(results.querySelectorAll('.ghcm-search-result'));
				const idx = items.indexOf(item);
				if (idx !== -1) {
					this.activeIndex = idx;
					this.updateActiveResult(items);
				}
			});

			// 键盘导航与 ESC 关闭
			this._keyHandler = (e) => {
				if (e.key === 'Escape') {
					this.hideSearch();
					return;
				}
				if (e.key === 'Tab') {
					const focusables = this.getSearchFocusables(container);
					const current = document.activeElement;
					const idx = focusables.indexOf(current);
					if (idx !== -1 && focusables.length > 0) {
						e.preventDefault();
						const nextIndex = (idx + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
						const target = focusables[nextIndex];
						target?.focus();
						if (target?.classList?.contains('ghcm-search-result')) {
							const items = Array.from(results.querySelectorAll('.ghcm-search-result'));
							const focusIdx = items.indexOf(target);
							if (focusIdx !== -1) {
								this.activeIndex = focusIdx;
								this.updateActiveResult(items);
							}
						}
					}
					return;
				}
				const items = Array.from(results.querySelectorAll('.ghcm-search-result'));
				if (items.length === 0) return;
				if (e.key === 'ArrowDown') {
					e.preventDefault();
					this.activeIndex = (this.activeIndex + 1) % items.length;
					this.updateActiveResult(items);
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
					this.updateActiveResult(items);
				} else if (e.key === 'Enter') {
					if (this.activeIndex >= 0 && this.activeIndex < items.length) {
						if (e.shiftKey) {
							// Shift+Enter 上一个
							this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
							this.updateActiveResult(items);
						} else {
							items[this.activeIndex].click();
						}
					}
				}
			};
			container.addEventListener('keydown', this._keyHandler);

			// 自动聚焦
			setTimeout(() => input.focus(), 100);
		}

		updateActiveResult(items) {
			items.forEach((el, i) => el.classList.toggle('active', i === this.activeIndex));
			if (this.activeIndex >= 0 && items[this.activeIndex]) {
				items[this.activeIndex].scrollIntoView({ block: 'nearest' });
			}
		}

		getSearchFocusables(container) {
			const focusables = [];
			const input = container.querySelector('.ghcm-search-input');
			if (input) focusables.push(input);
			focusables.push(...Array.from(container.querySelectorAll('.ghcm-level-filters input[type="checkbox"]')));
			focusables.push(...Array.from(container.querySelectorAll('.ghcm-search-result')));
			const closeBtn = container.querySelector('.ghcm-search-close');
			if (closeBtn) focusables.push(closeBtn);
			return focusables;
		}

		performSearch(query, resultsContainer) {
			if (!query) {
				resultsContainer.innerHTML = '<div class="ghcm-search-hint">请输入搜索关键词</div>';
				this.activeIndex = -1;
				return;
			}

			const headers = this.getAllSearchableHeaders();
			// 级别过滤
			const filtered = headers.filter(h => this.levelFilter?.has(h.level));
			// 模糊匹配 + 打分
			const q = query.trim();
			const matches = [];
			for (const h of filtered) {
				const res = this.fuzzyMatch(h.text, q);
				if (res.matched) {
					matches.push({ h, score: res.score, indices: res.indices });
				}
			}
			matches.sort((a,b) => b.score - a.score);

			if (matches.length === 0) {
				resultsContainer.innerHTML = '<div class="ghcm-search-no-results">未找到匹配的标题</div>';
				this.activeIndex = -1;
				return;
			}

			const resultHtml = matches.map(({h, indices}) => `
				<div class="ghcm-search-result" data-header-element="${h.id}" tabindex="0">
					<span class="ghcm-search-level">H${h.level}</span>
					<span class="ghcm-search-text">${this.safeHighlightByIndices(h.text, indices)}</span>
				</div>
			`).join('');

			resultsContainer.innerHTML = resultHtml;
			const items = Array.from(resultsContainer.querySelectorAll('.ghcm-search-result'));
			if (items.length) {
				this.activeIndex = 0;
				this.updateActiveResult(items);
			} else {
				this.activeIndex = -1;
			}
		}

		// 简单模糊匹配：
		// 1) 连续子串匹配给高分；2) 按字符顺序匹配有惩罚；3) 记录命中索引用于高亮
		fuzzyMatch(text, query) {
			const t = (text || '').toLowerCase();
			const q = (query || '').toLowerCase();
			if (!q) return { matched: true, score: 0, indices: [] };
			const i = t.indexOf(q);
			if (i !== -1) {
				const indices = Array.from({length: q.length}, (_,k)=> i+k);
				const score = 1000 - i; // 越靠前越高分
				return { matched: true, score, indices };
			}
			// 顺序子序列匹配
			let ti = 0; const indices = [];
			for (let qi = 0; qi < q.length; qi++) {
				const ch = q[qi];
				ti = t.indexOf(ch, ti);
				if (ti === -1) return { matched: false, score: -Infinity, indices: [] };
				indices.push(ti);
				ti++;
			}
			// 评分：越连续、跨度越小得分越高
			let gaps = 0; for (let k=1;k<indices.length;k++){ gaps += (indices[k]-indices[k-1]-1); }
			const span = indices[indices.length-1] - indices[0] + 1;
			const score = 500 - gaps*5 - span;
			return { matched: true, score, indices };
		}

		safeHighlightByIndices(text, indices) {
			try {
				if (!indices || !indices.length) return this.safeHighlightMatch(text, '');
				let out = '';
				let last = 0;
				const set = new Set(indices);
				for (let i=0;i<text.length;i++) {
					if (set.has(i)) {
						// 开始标记连续段
						let j = i;
						while (set.has(j)) j++;
						out += this.escapeHtml(text.slice(last, i)) + '<mark>' + this.escapeHtml(text.slice(i, j)) + '</mark>';
						last = j; i = j-1;
					}
				}
				out += this.escapeHtml(text.slice(last));
				return out;
			} catch { return this.escapeHtml(String(text||'')); }
		}

		escapeHtml(s){
			return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
		}

		getAllSearchableHeaders() {
			return this.ensureIndex();
		}

		highlightMatch(text, query) {
			const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(`(${escaped})`, 'gi');
			return text.replace(regex, '<mark>$1</mark>');
		}

		safeHighlightMatch(text, query) {
			try {
				const escaped = String(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const regex = new RegExp(`(${escaped})`, 'gi');
				return String(text).replace(regex, '<mark>$1</mark>');
			} catch (e) {
				return text;
			}
		}

		jumpToHeader(headerId) {
			const element = document.querySelector(`[data-search-id="${headerId}"]`);
			if (element) {
				// 展开到该标题
				this.collapseManager.expandToHeader(element, { scroll: false, setActive: false });
				this.collapseManager.scrollToElement(element);
				this.collapseManager.setActiveHeading(element);
				// 隐藏搜索界面
				this.hideSearch();
			}
		}

		showSearch() {
			if (this.searchContainer) {
				this.searchContainer.remove();
			}

			// 打开搜索前关闭其他浮层
			try { this.collapseManager?.menuManager?.hide(); } catch {}
			try { this.collapseManager?.tocGenerator?.hideToc(); } catch {}

			this.searchContainer = this.createSearchUI();
			document.body.appendChild(this.searchContainer);
			this.isVisible = true;
		}

		hideSearch() {
			if (this.searchContainer) {
				this.searchContainer.remove();
				this.searchContainer = null;
				this.isVisible = false;
				// 清理键盘事件
				if (this._keyHandler) {
					// 绑定在容器上，容器已移除即可
					this._keyHandler = null;
				}
				this.activeIndex = -1;
			}
		}

		toggle() {
			if (this.isVisible) {
				this.hideSearch();
			} else {
				this.showSearch();
			}
		}
	}

	class BookmarkManager {
		constructor(app) {
			this.app = app;
			this.storageKey = CONFIG.bookmarks.key;
			this.bookmarksByPage = this.normalizeStoredBookmarks(GM_getValue(this.storageKey, null));
			this._applyRetryTimer = null;
			this._applyRetryAttempts = 0;
			this._applyRetryMax = 6;
			this._applyRetryDelay = 300;
			this.ensurePageEntry();
			setTimeout(() => this.applyBookmarks(), 200);
		}

		getPageKey() {
			return this.app.stateManager.pageUrl;
		}

		normalizeStoredBookmarks(raw) {
			if (!raw) return {};
			let data = raw;
			if (typeof raw === 'string') {
				try {
					data = JSON.parse(raw);
				} catch {
					return {};
				}
			}
			if (!data || typeof data !== 'object') return {};
			const normalized = {};
			Object.entries(data).forEach(([pageKey, entries]) => {
				if (!Array.isArray(entries)) return;
				const cleaned = entries
					.map(entry => this.cloneBookmark(entry))
					.filter(Boolean);
				if (cleaned.length) {
					normalized[pageKey] = cleaned;
				}
			});
			return normalized;
		}

		sanitizeBookmark(entry) {
			if (!entry || typeof entry !== 'object') return null;
			const key = typeof entry.key === 'string' ? entry.key.trim() : '';
			if (!key) return null;
			const sanitized = { key };
			if (typeof entry.id === 'string' && entry.id.trim()) {
				sanitized.id = entry.id.trim();
			}
			if (typeof entry.text === 'string') {
				sanitized.text = entry.text;
			}
			if (typeof entry.level === 'number' && entry.level >= 1 && entry.level <= 6) {
				sanitized.level = entry.level;
			}
			return sanitized;
		}

		cloneBookmark(entry) {
			const sanitized = this.sanitizeBookmark(entry);
			return sanitized ? { ...sanitized } : null;
		}

		serializeBookmarks() {
			const snapshot = {};
			Object.entries(this.bookmarksByPage).forEach(([pageKey, entries]) => {
				if (!Array.isArray(entries) || entries.length === 0) return;
				const cleaned = entries
					.map(entry => this.sanitizeBookmark(entry))
					.filter(Boolean);
				if (cleaned.length) {
					snapshot[pageKey] = cleaned;
				}
			});
			return JSON.stringify(snapshot);
		}

		ensurePageEntry() {
			const key = this.getPageKey();
			if (!Array.isArray(this.bookmarksByPage[key])) {
				this.bookmarksByPage[key] = [];
			}
			this.bookmarksByPage[key] = this.bookmarksByPage[key]
				.map(entry => this.cloneBookmark(entry))
				.filter(Boolean);
			return this.bookmarksByPage[key];
		}

		getBookmarksForCurrentPage() {
			return this.ensurePageEntry().map(entry => this.cloneBookmark(entry)).filter(Boolean);
		}

		save() {
			try {
				GM_setValue(this.storageKey, this.serializeBookmarks());
			} catch (e) {
				Logger.warn('[GHCM] 保存书签失败:', e);
			}
		}

		getHeaderElement(node) {
			if (!node) return null;
			if (DOMUtils.isHeader(node)) return node;
			let header = null;
			try {
				if (typeof node.closest === 'function') {
					header = node.closest(DOMUtils.getUpperHeadingSelector());
				}
			} catch {}
			if (header && DOMUtils.isHeader(header)) return header;
			try {
				const wrapper = node.closest?.('.markdown-heading');
				if (wrapper) {
					header = wrapper.querySelector(DOMUtils.getUpperHeadingSelector());
				}
			} catch {}
			return (header && DOMUtils.isHeader(header)) ? header : null;
		}

		ensureHeaderId(element) {
			const header = this.getHeaderElement(element) || element;
			if (!header) return null;
			const normalize = value => (typeof value === 'string' ? value.trim() : '');

			const directId = normalize(header.getAttribute?.('id') || header.id);
			if (directId && !/^ghcm-(?:bookmark|h)-/i.test(directId)) {
				return directId;
			}

			try {
				if (this.app.tocGenerator && typeof this.app.tocGenerator.getHeaderId === 'function') {
					const tocId = normalize(this.app.tocGenerator.getHeaderId(header));
					if (tocId) return tocId;
				}
			} catch {}

			let anchorId = '';
			let hrefId = '';
			try {
				const anchor = header.querySelector?.('.anchor');
				if (anchor) {
					anchorId = normalize(anchor.getAttribute('id'));
					hrefId = normalize(anchor.getAttribute('href')?.replace(/^#/, ''));
				}
			} catch {}
			if (anchorId) return anchorId;
			if (hrefId) return hrefId;

			let childId = '';
			try {
				const anyWithId = header.querySelector?.('[id]');
				childId = normalize(anyWithId?.getAttribute('id'));
			} catch {}
			if (childId) return childId;

			const generated = `ghcm-bookmark-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			try { header.setAttribute('id', generated); } catch {}
			return generated;
		}

		addBookmarkForElement(element, { notify = true } = {}) {
			const header = this.getHeaderElement(element) || element;
			if (!header || !DOMUtils.isHeader(header)) return;
			const pageBookmarks = this.ensurePageEntry();
			const key = this.app.stateManager.generateHeaderKey(header);
			const existingIndex = pageBookmarks.findIndex(item => item.key === key);
			if (existingIndex !== -1) {
				if (notify) this.app.collapseManager.showNotification('⭐ 该标题已在书签中');
				return;
			}
			const id = this.ensureHeaderId(header);
			this.app.collapseManager.setActiveHeading(header);
			const entry = {
				id,
				key,
				text: header.textContent?.trim() || '未命名标题',
				level: DOMUtils.getHeadingLevel(header)
			};
			pageBookmarks.push(entry);
			this.save();
			this.applyBookmarks();
			if (notify) this.app.collapseManager.showNotification('⭐ 已收藏当前标题');
			this.app.menuManager?.updateBookmarkList();
		}

			toggleBookmarkForElement(element) {
				const header = this.getHeaderElement(element) || element;
				if (!header || !DOMUtils.isHeader(header)) return;
				this.app.collapseManager.setActiveHeading(header);
				const pageBookmarks = this.ensurePageEntry();
				const key = this.app.stateManager.generateHeaderKey(header);
			const existingIndex = pageBookmarks.findIndex(item => item.key === key);
			if (existingIndex !== -1) {
				pageBookmarks.splice(existingIndex, 1);
				this.save();
				this.applyBookmarks();
				this.app.collapseManager.showNotification('🗑️ 已移除书签');
				this.app.menuManager?.updateBookmarkList();
				return;
			}
			this.addBookmarkForElement(header);
		}

			toggleBookmarkForActiveHeader() {
				let header = DOMUtils.getHeaderFromSelection();
				if (!header) {
					header = this.app.collapseManager.getActiveHeaderElement();
				}
				if (!header) {
					header = this.app.collapseManager.getActiveHeaderElement(true);
				}
				if (!header) {
					this.app.collapseManager.showNotification('⚠️ 未找到可收藏的标题');
					return;
				}
				this.app.collapseManager.setActiveHeading(header);
				this.toggleBookmarkForElement(header);
			}

			addBookmarkFromViewport() {
				let header = DOMUtils.getHeaderFromSelection();
				if (!header) {
					header = this.app.collapseManager.getActiveHeaderElement();
				}
				if (!header) {
					header = this.app.collapseManager.getActiveHeaderElement(true);
				}
				if (!header) {
					this.app.collapseManager.showNotification('⚠️ 当前视图未找到标题');
					return;
			}
			this.app.collapseManager.setActiveHeading(header);
			this.addBookmarkForElement(header);
		}

		removeBookmarkByIndex(index) {
			const pageBookmarks = this.ensurePageEntry();
			if (index < 0 || index >= pageBookmarks.length) return;
			pageBookmarks.splice(index, 1);
			this.save();
			this.applyBookmarks();
			this.app.collapseManager.showNotification('🗑️ 已移除书签');
			this.app.menuManager?.updateBookmarkList();
		}

		clearPageBookmarks() {
			const key = this.getPageKey();
			this.bookmarksByPage[key] = [];
			this.save();
			this.applyBookmarks();
			this.app.collapseManager.showNotification('🗂️ 已清空本页书签');
			this.app.menuManager?.updateBookmarkList();
		}

			openBookmarkByIndex(index) {
				const pageBookmarks = this.ensurePageEntry();
				if (index < 0 || index >= pageBookmarks.length) return;
				const bookmark = pageBookmarks[index];
				const element = this.resolveBookmarkElement(bookmark);
			if (element) {
				this.app.collapseManager.expandToHeader(element, { scroll: false, setActive: false });
				this.app.collapseManager.scrollToElement(element);
				this.app.collapseManager.setActiveHeading(element);
				this.highlightTemporarily(element);
			}
		}

		resolveBookmarkElement(bookmark) {
			if (!bookmark) return null;
			const candidates = [];
			if (typeof bookmark.id === 'string' && bookmark.id.trim()) {
				const trimmed = bookmark.id.trim();
				candidates.push(trimmed);
				if (!trimmed.startsWith('user-content-')) {
					candidates.push(`user-content-${trimmed}`);
				}
			}

			let element = null;
			for (const candidate of candidates) {
				if (!candidate) continue;
				let found = null;
				try { found = document.getElementById(candidate); } catch {}
				if (!found) continue;
				const header = this.getHeaderElement(found);
				if (header) {
					element = header;
					break;
				}
			}

			if (!element) {
				const headers = this.app.collapseManager.getAllHeaders();
				for (const header of headers) {
					const key = this.app.stateManager.generateHeaderKey(header);
					if (key === bookmark.key) {
						element = header;
						break;
					}
				}
			}

			if (!element) return null;

			const newId = this.ensureHeaderId(element);
			if (newId && newId !== bookmark.id) {
				bookmark.id = newId;
				this.save();
			}
			return element;
		}

		applyBookmarks({ attempt = 0 } = {}) {
			const headers = this.app.collapseManager.getAllHeaders();
			headers.forEach(header => header.classList.remove(CONFIG.classes.bookmarked));
			const pageKey = this.getPageKey();
			const pageBookmarks = this.ensurePageEntry();
			let unresolved = 0;
			pageBookmarks.forEach(bookmark => {
				const element = this.resolveBookmarkElement(bookmark);
				if (element) {
					element.classList.add(CONFIG.classes.bookmarked);
				} else {
					unresolved++;
				}
			});

			if (unresolved > 0 && attempt < this._applyRetryMax) {
				if (this._applyRetryTimer) clearTimeout(this._applyRetryTimer);
				const nextAttempt = attempt + 1;
				this._applyRetryAttempts = nextAttempt;
				this._applyRetryTimer = setTimeout(() => {
					this._applyRetryTimer = null;
					this.applyBookmarks({ attempt: nextAttempt });
				}, this._applyRetryDelay);
			} else if (unresolved === 0) {
				this._applyRetryAttempts = 0;
				if (this._applyRetryTimer) {
					clearTimeout(this._applyRetryTimer);
					this._applyRetryTimer = null;
				}
			} else if (unresolved > 0) {
				this._applyRetryAttempts = 0;
				if (this._applyRetryTimer) {
					clearTimeout(this._applyRetryTimer);
					this._applyRetryTimer = null;
				}
			}

			this.app.menuManager?.updateBookmarkList();
		}

			highlightTemporarily(element) {
			if (!element) return;
			try {
				element.classList.add('ghcm-temp-highlight');
				setTimeout(() => element.classList.remove('ghcm-temp-highlight'), 600);
			} catch {}
		}
	}

	// DOM 工具类
	class DOMUtils {
		static getHeadingTagsLower() {
			if (!DOMUtils._headingTagsLower) {
				DOMUtils._headingTagsLower = CONFIG.selectors.headers.map(tag => tag.toLowerCase());
			}
			return DOMUtils._headingTagsLower;
		}

		static getUpperHeadingSelector() {
			if (!DOMUtils._upperHeadingSelector) {
				DOMUtils._upperHeadingSelector = CONFIG.selectors.headers.join(',');
			}
			return DOMUtils._upperHeadingSelector;
		}

		static getHeadingTags({ level, upToLevel } = {}) {
			const tags = DOMUtils.getHeadingTagsLower();
			if (typeof level === 'number') {
				const tag = tags[level - 1];
				return tag ? [tag] : [];
			}
			if (typeof upToLevel === 'number') {
				return tags.slice(0, upToLevel);
			}
			return tags;
		}

		static getCachedSelector(key, builder) {
			if (!DOMUtils._selectorCache) {
				DOMUtils._selectorCache = new Map();
			}
			if (!DOMUtils._selectorCache.has(key)) {
				DOMUtils._selectorCache.set(key, builder());
			}
			return DOMUtils._selectorCache.get(key);
		}

		static buildSelector(tags, { scopedTo, includeWrapper } = {}) {
			if (!tags || !tags.length) return '';
			const selectors = [];
			tags.forEach(tag => {
				const base = scopedTo ? `${scopedTo} ${tag}` : tag;
				selectors.push(base);
				if (includeWrapper) {
					selectors.push(`${base}.heading-element`);
				}
			});
			return selectors.join(', ');
		}

		static getHeadingSelector() {
			return DOMUtils.getCachedSelector('all-headings', () =>
				DOMUtils.buildSelector(DOMUtils.getHeadingTags())
			);
		}

		static getHeadingSelectorUpToLevel(level) {
			return DOMUtils.getCachedSelector(`upto-${level}`, () =>
				DOMUtils.buildSelector(DOMUtils.getHeadingTags({ upToLevel: level }))
			);
		}

		static getScopedHeadingSelector(container, { includeWrapper = false, level, upToLevel } = {}) {
			if (!container) return '';
			const key = `scope-${container}|wrap:${includeWrapper}|level:${level ?? 'all'}|upto:${upToLevel ?? 'na'}`;
			return DOMUtils.getCachedSelector(key, () =>
				DOMUtils.buildSelector(
					DOMUtils.getHeadingTags({ level, upToLevel }),
					{ scopedTo: container, includeWrapper }
				)
			);
		}

		static collectHeadings(containers = CONFIG.selectors.markdownContainers) {
			const useCache = containers === CONFIG.selectors.markdownContainers;
			if (useCache && DOMUtils._headingCache) {
				return DOMUtils._headingCache.slice();
			}

			const selectors = containers
				.map(container => DOMUtils.getScopedHeadingSelector(container))
				.filter(Boolean);
			if (!selectors.length) return [];
			try {
				const list = DOMUtils.$$(selectors.join(', '))
					.filter(element => DOMUtils.shouldIncludeHeading(element));
				if (useCache) {
					DOMUtils._headingCache = list;
					return list.slice();
				}
				return list;
			} catch {
				return [];
			}
		}

		static hasMarkdownHeadings() {
			return CONFIG.selectors.markdownContainers.some(container => {
				try {
					const selector = DOMUtils.getScopedHeadingSelector(container);
					return selector ? !!document.querySelector(selector) : false;
				} catch {
					return false;
				}
			});
		}

		static getHeadingLevel(element) {
			if (!element || !element.nodeName) return 0;
			const match = element.nodeName.match(/h([1-6])/i);
			return match ? parseInt(match[1], 10) : 0;
		}

		static $(selector, parent = document) {
			return parent.querySelector(selector);
		}

		static $$(selector, parent = document) {
			return Array.from(parent.querySelectorAll(selector));
		}

		static isHeader(element) {
			return CONFIG.selectors.headers.includes(element.nodeName);
		}

		static isInMarkdown(element) {
			return CONFIG.selectors.markdownContainers.some(selector =>
				element.closest(selector)
			);
		}

		static getHeaderContainer(header) {
			return header.closest('.markdown-heading') || header;
		}

		static clearSelection() {
			const selection = window.getSelection?.() || document.selection;
			if (selection) {
				if (selection.removeAllRanges) {
					selection.removeAllRanges();
				} else if (selection.empty) {
					selection.empty();
				}
			}
		}

		static blurActiveElement() {
			try {
				const active = document.activeElement;
				if (!active || active === document.body) return;
				if (typeof active.blur === 'function') {
					active.blur();
				}
			} catch {}
		}

		static getHeaderFromSelection() {
			try {
				const selection = window.getSelection?.();
				if (!selection || selection.rangeCount === 0) return null;
				const node = selection.focusNode || selection.anchorNode;
				if (!node) return null;
				const isElementNode = typeof Node !== 'undefined' && node.nodeType === Node.ELEMENT_NODE;
				const element = (isElementNode ? node : node.parentElement) || null;
				if (!element) return null;
				const direct = element.closest(DOMUtils.getUpperHeadingSelector());
				if (direct && DOMUtils.shouldIncludeHeading(direct)) {
					return direct;
				}
				const wrapper = element.closest('.markdown-heading');
				if (wrapper) {
					const header = wrapper.querySelector(DOMUtils.getUpperHeadingSelector());
					if (header && DOMUtils.shouldIncludeHeading(header)) {
						return header;
					}
				}
			} catch {}
			return null;
		}

		// 仅收录页面中可见且非辅助导航区域的标题
		static isVisible(el) {
			try {
				if (!el || el.getAttribute('aria-hidden') === 'true' || el.hidden) return false;
				// 常见 SR-only 类
				const cls = el.className || '';
				if (typeof cls === 'string' && /(sr-only|visually-hidden)/i.test(cls)) return false;
				// 计算可见性
				const rects = el.getClientRects?.();
				if (!rects || rects.length === 0) return false;
				return (el.offsetWidth + el.offsetHeight) > 0;
			} catch { return true; }
		}

		static inIgnoredRegion(el) {
			try {
				return !!el.closest('nav, header, footer, aside, [role="navigation"], [role="menu"], [role="menubar"], [role="toolbar"]');
			} catch { return false; }
		}

		static shouldIncludeHeading(el) {
			if (!DOMUtils.isHeader(el)) return false;
			if (!DOMUtils.isInMarkdown(el)) return false;
			if (DOMUtils.inIgnoredRegion(el)) return false;
			if (!DOMUtils.isVisible(el)) return false;
			return true;
		}

		static invalidateHeadingCache() {
			DOMUtils._headingCache = null;
		}
	}

	// 样式管理器
	class StyleManager {
		constructor() {
			this.arrowColors = document.createElement("style");
			this.arrowContentOverride = document.createElement("style");
			this.init();
		}

			init() {
				this.addBaseStyles();
				this.addColorStyles();
				document.head.appendChild(this.arrowColors);
				// 初始箭头内容覆盖（用于“仅显示箭头”开关）
				document.head.appendChild(this.arrowContentOverride);
				this.updateArrowContentOverride();
				this.applyArrowSize(CONFIG.ui.arrowSize);
			}

		addBaseStyles() {
			const headerSelectors = this.generateHeaderSelectors();

	GM_addStyle(`
				/* 基础样式 */
				${headerSelectors.base} {
			position: relative;
			padding-right: 3em;
			cursor: pointer;
					transition: all ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
				}

				/* 箭头指示器 */
				${headerSelectors.after} {
			display: inline-block;
				position: absolute;
			right: 0.5em;
						top: 50%;
						transform: translateY(-50%);
				font-size: var(--ghcm-arrow-size, 0.8em);
						font-weight: bold;
						pointer-events: none;
						transition: transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
				}

				/* 各级标题的箭头内容 */
				${this.generateArrowContent()}

					/* 折叠状态的箭头旋转 */
					.${CONFIG.classes.collapsed}:after {
						transform: translateY(-50%) rotate(-90deg);
					}

					/* 书签标记 */
					.${CONFIG.classes.bookmarked} {
						background: rgba(252, 211, 77, 0.35);
						border-radius: 4px;
					}

					.${CONFIG.classes.bookmarked}::before {
						content: none;
					}

					/* 当前激活标题 */
					.${CONFIG.classes.activeHeading} {
						background: rgba(191, 219, 254, 0.55);
						border-radius: 4px;
					}

					.${CONFIG.classes.bookmarked}.${CONFIG.classes.activeHeading} {
						background: rgba(224, 231, 255, 0.6);
					}

					.${CONFIG.classes.hoverHeading} {
						background: rgba(107, 114, 128, 0.12);
						border-radius: 4px;
					}

					.ghcm-temp-highlight {
						background: rgba(191, 219, 254, 0.4);
						transition: background 0.4s ease;
					}

					/* 隐藏元素 */
				.${CONFIG.classes.hidden},
				.${CONFIG.classes.hiddenByParent} {
					display: none !important;
					opacity: 0 !important;
				}

				/* 无内容标题 */
				.${CONFIG.classes.noContent}:after {
					display: none !important;
				}

				/* 保留 GitHub 标题锚点交互，不禁止点击 */

				/* 平滑动画 */
				.ghcm-transitioning {
					transition: opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing},
					           transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
				}

				/* 目录容器样式 */
				.${CONFIG.classes.tocContainer} {
					position: fixed;
					top: 20px;
					right: 20px;
					width: 300px;
					max-height: 70vh;
					background: var(--color-canvas-default, #ffffff);
					border: 1px solid var(--color-border-default, #d0d7de);
					border-radius: 8px;
					box-shadow: 0 8px 24px rgba(0,0,0,0.12);
					z-index: 10000;
					overflow: hidden;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
				}

				.ghcm-toc-header {
					padding: 8px 12px;
					background: var(--color-canvas-subtle, #f6f8fa);
					border-bottom: 1px solid var(--color-border-default, #d0d7de);
					display: flex;
					justify-content: space-between;
					align-items: center;
					min-height: 36px;
				}

				.ghcm-toc-header h3 {
					margin: 0;
					font-size: 13px;
					font-weight: 600;
					color: var(--color-fg-default, #24292f);
					line-height: 1.2;
				}

				.ghcm-toc-close {
					background: none;
					border: none;
					font-size: 14px;
					cursor: pointer;
					padding: 2px 4px;
					border-radius: 3px;
					color: var(--color-fg-muted, #656d76);
					line-height: 1;
				}

				.ghcm-toc-close:hover {
					background: var(--color-danger-subtle, #ffebe9);
					color: var(--color-danger-fg, #cf222e);
				}

				.ghcm-toc-content {
					max-height: calc(70vh - 44px);
					overflow-y: auto;
					padding: 6px 0;
				}

				.ghcm-toc-item {
					display: flex;
					align-items: center;
					padding: 4px 16px;
					border-radius: 4px;
					margin: 1px 8px;
					cursor: pointer;
				}

				.ghcm-toc-item.ghcm-toc-item-collapsed {
					opacity: 0.78;
				}

				.ghcm-toc-item.ghcm-toc-item-collapsed .ghcm-toc-link {
					color: var(--color-fg-muted, #656d76);
				}

				.ghcm-toc-item:hover {
					background: var(--color-neutral-subtle, #f6f8fa);
				}

				/* TOC 活动高亮 */
				.ghcm-toc-item.active {
					background: var(--color-accent-subtle, #ddf4ff);
				}
				.ghcm-toc-item.active .ghcm-toc-link {
					color: var(--color-accent-fg, #0969da);
					font-weight: 600;
				}

				.ghcm-toc-collapse-icon {
					font-size: 10px;
					margin-right: 8px;
					color: var(--color-fg-muted, #656d76);
					min-width: 12px;
				}

				.ghcm-toc-link {
					text-decoration: none;
					color: var(--color-fg-default, #24292f);
					font-size: 13px;
					line-height: 1.4;
					flex: 1;
				}

				.ghcm-toc-link:hover {
					color: var(--color-accent-fg, #0969da);
				}

				/* 搜索容器样式 */
				.${CONFIG.classes.searchContainer} {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 480px;
					max-width: 90vw;
					max-height: 80vh;
					background: var(--color-canvas-default, #ffffff);
					border: 1px solid var(--color-border-default, #d0d7de);
					border-radius: 12px;
					box-shadow: 0 16px 32px rgba(0,0,0,0.24);
					z-index: 10001;
					overflow: hidden;
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
				}

				.ghcm-search-header {
					padding: 16px 20px;
					background: var(--color-canvas-subtle, #f6f8fa);
					border-bottom: 1px solid var(--color-border-default, #d0d7de);
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.ghcm-search-header h3 {
					margin: 0;
					font-size: 16px;
					font-weight: 600;
					color: var(--color-fg-default, #24292f);
				}

				.ghcm-search-close {
					background: none;
					border: none;
					font-size: 18px;
					cursor: pointer;
					padding: 6px;
					border-radius: 6px;
					color: var(--color-fg-muted, #656d76);
				}

				.ghcm-search-close:hover {
					background: var(--color-danger-subtle, #ffebe9);
					color: var(--color-danger-fg, #cf222e);
				}

				.ghcm-search-content {
					padding: 20px;
				}

				.ghcm-search-input {
					width: 100%;
					padding: 12px 16px;
					border: 2px solid var(--color-border-default, #d0d7de);
					border-radius: 8px;
					font-size: 16px;
					background: var(--color-canvas-default, #ffffff);
					color: var(--color-fg-default, #24292f);
					outline: none;
					transition: border-color 0.2s;
				}

				.ghcm-search-input:focus {
					border-color: var(--color-accent-emphasis, #0969da);
				}

				.ghcm-search-results {
					margin-top: 16px;
					max-height: 400px;
					overflow-y: auto;
				}

				/* 搜索过滤栏 */
				.ghcm-search-filters {
					margin-top: 10px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-wrap: wrap;
					gap: 8px;
				}
				.ghcm-level-filters label {
					margin-right: 8px;
					font-size: 12px;
					color: var(--color-fg-muted, #656d76);
				}
				.ghcm-search-hint-row {
					font-size: 12px;
					color: var(--color-fg-muted, #656d76);
				}

				.ghcm-search-result {
					display: flex;
					align-items: center;
					padding: 12px 16px;
					border-radius: 8px;
					cursor: pointer;
					margin: 4px 0;
					border: 1px solid transparent;
				}

				.ghcm-search-result:hover {
					background: var(--color-neutral-subtle, #f6f8fa);
					border-color: var(--color-border-default, #d0d7de);
				}

				/* 键盘导航高亮 */
				.ghcm-search-result.active {
					background: var(--color-neutral-subtle, #f6f8fa);
					border-color: var(--color-border-default, #d0d7de);
				}

				.ghcm-search-level {
					background: var(--color-accent-subtle, #ddf4ff);
					color: var(--color-accent-fg, #0969da);
					padding: 2px 6px;
					border-radius: 4px;
					font-size: 11px;
					font-weight: 600;
					margin-right: 12px;
					min-width: 24px;
					text-align: center;
				}

				.ghcm-search-text {
					flex: 1;
					font-size: 14px;
					color: var(--color-fg-default, #24292f);
				}

				.ghcm-search-text mark {
					background: var(--color-attention-subtle, #fff8c5);
					color: var(--color-attention-fg, #9a6700);
					padding: 1px 2px;
					border-radius: 2px;
				}

				.ghcm-search-hint, .ghcm-search-no-results {
					text-align: center;
					padding: 40px 20px;
					color: var(--color-fg-muted, #656d76);
					font-style: italic;
				}

				/* 帮助弹窗 */
				.ghcm-help-overlay {
					position: fixed;
					inset: 0;
					background: rgba(17, 24, 39, 0.45);
					backdrop-filter: blur(4px);
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 24px;
					opacity: 0;
					transition: opacity 180ms ease;
					z-index: 10001;
				}

				.ghcm-help-overlay.show {
					opacity: 1;
				}

				.ghcm-help-modal {
					position: relative;
					width: min(720px, 90vw);
					max-height: min(90vh, 720px);
					background: var(--color-canvas-default, #ffffff);
					border-radius: 16px;
					border: 1px solid var(--color-border-default, #d0d7de);
					box-shadow: 0 24px 48px rgba(15, 23, 42, 0.26);
					display: flex;
					flex-direction: column;
					overflow: hidden;
					transform: translateY(10px) scale(0.96);
					transition: transform 200ms ease, opacity 200ms ease;
					opacity: 0;
				}

				.ghcm-help-modal:focus,
				.ghcm-help-modal:focus-visible {
					outline: none;
					box-shadow: 0 24px 48px rgba(15, 23, 42, 0.26), 0 0 0 3px rgba(99, 102, 241, 0.22);
				}

				.ghcm-help-overlay.show .ghcm-help-modal {
					transform: translateY(0) scale(1);
					opacity: 1;
				}

				.ghcm-help-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 20px 24px 16px;
					background: var(--color-canvas-subtle, #f6f8fa);
					border-bottom: 1px solid var(--color-border-default, #d0d7de);
					gap: 12px;
				}

				.ghcm-help-title {
					display: flex;
					flex-direction: column;
					gap: 4px;
				}

				.ghcm-help-title-text {
					font-size: 1.15rem;
					font-weight: 600;
					color: var(--color-fg-default, #1f2329);
				}

				.ghcm-help-title-sub {
					font-size: 0.85rem;
					color: var(--color-fg-muted, #4c566a);
				}

				.ghcm-help-close {
					width: 36px;
					height: 36px;
					border: none;
					border-radius: 50%;
					background: transparent;
					color: var(--color-fg-muted, #4c566a);
					cursor: pointer;
					transition: background 160ms ease, color 160ms ease, transform 160ms ease;
					font-size: 18px;
					line-height: 1;
				}

				.ghcm-help-close:hover {
					background: rgba(99, 102, 241, 0.08);
					color: var(--color-fg-default, #1f2329);
					transform: scale(1.05);
				}

				.ghcm-help-close:focus {
					outline: 2px solid rgba(99, 102, 241, 0.35);
					outline-offset: 2px;
				}

				.ghcm-help-content {
					padding: 20px 24px 28px;
					overflow: auto;
					scrollbar-width: thin;
				}

				.ghcm-help-content::-webkit-scrollbar {
					width: 8px;
				}

				.ghcm-help-content::-webkit-scrollbar-thumb {
					background: rgba(148, 163, 184, 0.5);
					border-radius: 999px;
				}

				.ghcm-help-content > .markdown-body {
					font-size: 14px;
					line-height: 1.65;
					color: var(--color-fg-default, #1f2329);
				}

				.ghcm-help-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
					gap: 16px;
				}

				.ghcm-help-card {
					padding: 16px;
					border-radius: 12px;
					border: 1px solid rgba(99, 102, 241, 0.15);
					background: rgba(99, 102, 241, 0.05);
				}

				.ghcm-help-card h3 {
					margin-top: 0;
					margin-bottom: 8px;
					font-size: 0.95rem;
				}

				.ghcm-help-shortcut {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					padding: 8px 0;
					border-bottom: 1px solid rgba(148, 163, 184, 0.2);
				}

				.ghcm-help-shortcut:last-child {
					border-bottom: none;
				}

				.ghcm-help-kbd {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					min-width: 82px;
					padding: 6px 10px;
					border-radius: 8px;
					background: rgba(15, 23, 42, 0.05);
					border: 1px solid rgba(148, 163, 184, 0.4);
					font-family: ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
					font-size: 0.85rem;
					color: var(--color-fg-default, #1f2329);
				}

				.ghcm-help-kbd span {
					white-space: nowrap;
				}

				.ghcm-help-list {
					display: grid;
					gap: 10px;
					padding-left: 0;
					list-style: none;
				}

				.ghcm-help-list li {
					display: flex;
					gap: 8px;
				}

				.ghcm-help-list strong {
					color: rgba(79, 70, 229, 1);
				}

				.ghcm-help-section + .ghcm-help-section {
					margin-top: 24px;
				}

				.ghcm-help-footnote {
					margin-top: 12px;
					font-size: 0.85rem;
					color: var(--color-fg-muted, #4c566a);
				}

				/* 深色主题适配 */
				@media (prefers-color-scheme: dark) {
					.${CONFIG.classes.tocContainer},
					.${CONFIG.classes.searchContainer} {
						background: var(--color-canvas-default, #0d1117);
						border-color: var(--color-border-default, #30363d);
					}

					.ghcm-help-overlay {
						background: rgba(15, 23, 42, 0.6);
					}

					.ghcm-help-modal {
						background: var(--color-canvas-default, #0d1117);
						border-color: var(--color-border-default, #30363d);
						box-shadow: 0 24px 48px rgba(8, 13, 23, 0.6);
					}

					.ghcm-help-modal:focus,
					.ghcm-help-modal:focus-visible {
						box-shadow: 0 24px 48px rgba(8, 13, 23, 0.6), 0 0 0 3px rgba(129, 140, 248, 0.35);
					}

					.ghcm-help-header {
						background: var(--color-canvas-subtle, #161b22);
						border-color: var(--color-border-default, #30363d);
					}

					.ghcm-help-title-text {
						color: var(--color-fg-default, #e6edf3);
					}

					.ghcm-help-title-sub,
					.ghcm-help-footnote {
						color: var(--color-fg-muted, #8b949e);
					}

					.ghcm-help-close {
						color: var(--color-fg-muted, #8b949e);
					}

					.ghcm-help-close:hover {
						background: rgba(99, 102, 241, 0.18);
						color: var(--color-fg-default, #e6edf3);
					}

					.ghcm-help-content > .markdown-body {
						color: var(--color-fg-default, #e6edf3);
					}

					.ghcm-help-card {
						background: rgba(79, 70, 229, 0.12);
						border-color: rgba(129, 140, 248, 0.45);
					}

					.ghcm-help-kbd {
						background: rgba(148, 163, 184, 0.12);
						border-color: rgba(148, 163, 184, 0.35);
						color: var(--color-fg-default, #e6edf3);
					}
				}
			`);
		}

		generateHeaderSelectors() {
			const containers = CONFIG.selectors.markdownContainers;
			const headers = DOMUtils.getHeadingTagsLower();

			const baseSelectors = [];
			const afterSelectors = [];

			containers.forEach(container => {
				if (container) {
					headers.forEach(header => {
						baseSelectors.push(`${container} ${header}`);
						baseSelectors.push(`${container} ${header}.heading-element`);
						afterSelectors.push(`${container} ${header}:after`);
						afterSelectors.push(`${container} ${header}.heading-element:after`);
					});
				}
			});

			return {
				base: baseSelectors.join(", "),
				after: afterSelectors.join(", ")
			};
		}

		generateArrowContent() {
			const headers = DOMUtils.getHeadingTagsLower();
			return headers.map((header, index) => {
				const level = index + 1;
				const containers = CONFIG.selectors.markdownContainers;
				const selectors = [];

				containers.forEach(container => {
					if (container) {
						selectors.push(`${container} ${header}:after`);
						selectors.push(`${container} ${header}.heading-element:after`);
					}
				});

				return `${selectors.join(", ")} { content: "${level}▼"; }`;
			}).join("\n");
		}

		addColorStyles() {
			const headers = DOMUtils.getHeadingTagsLower();
			const styles = headers.map((header, index) => {
				const containers = CONFIG.selectors.markdownContainers;
				const selectors = [];

				containers.forEach(container => {
					if (container) {
						selectors.push(`${container} ${header}:after`);
						selectors.push(`${container} ${header}.heading-element:after`);
					}
				});

				return `${selectors.join(", ")} { color: ${CONFIG.colors[index]}; }`;
			}).join("\n");

			this.arrowColors.textContent = styles;
		}

			updateColors(newColors) {
				CONFIG.colors = newColors;
				GM_setValue("ghcm-colors", newColors);
				this.addColorStyles();
		}

		applyArrowSize(size) {
			try {
				document.documentElement.style.setProperty('--ghcm-arrow-size', size || '0.8em');
			} catch {}
		}

		updateArrowSize(size) {
			if (!size) return;
			CONFIG.ui.arrowSize = size;
			GM_setValue('ghcm-arrow-size', size);
			this.applyArrowSize(size);
		}

		updateArrowContentOverride() {
			const headerSelectors = this.generateHeaderSelectors();
			const after = headerSelectors.after;
			const showNum = !!CONFIG.ui.showLevelNumber;
			if (!showNum) {
				// 仅显示箭头（覆盖初始带数字的内容）
				this.arrowContentOverride.textContent = `${after} { content: "\\25BC" !important; }`;
			} else {
				// 显示级别数字 + 箭头，覆盖以确保与当前设置一致
				const headers = DOMUtils.getHeadingTagsLower();
				const rules = headers.map((header, index) => {
					const level = index + 1;
					const containers = CONFIG.selectors.markdownContainers;
					const selectors = [];
					containers.forEach(container => {
						if (container) {
							selectors.push(`${container} ${header}:after`);
							selectors.push(`${container} ${header}.heading-element:after`);
						}
					});
					return `${selectors.join(", ")} { content: "${level}\\25BC" !important; }`;
				}).join("\n");
				this.arrowContentOverride.textContent = rules;
			}
		}
	}

	// 折叠功能核心类
class CollapseManager {
	constructor(stateManager) {
		this.stateManager = stateManager;
		// Map<headerKey, Set<timeoutId>> to track and cancel animations per header
		this.animationQueue = new Map();
		// 单一滚动校准定时器，防止快速点击产生来回滚动
		this._scrollEnsureTimeout = null;
		this.activeHeading = null;
		this._activeNotification = null;
	}

	// Track a timeout for a header key
	trackTimeout(headerKey, timeoutId) {
		if (!this.animationQueue.has(headerKey)) {
			this.animationQueue.set(headerKey, new Set());
		}
		this.animationQueue.get(headerKey).add(timeoutId);
	}

	// Cancel all pending timeouts for a header key
	cancelTimeouts(headerKey) {
		const set = this.animationQueue.get(headerKey);
		if (!set) return;
		set.forEach(id => clearTimeout(id));
		this.animationQueue.delete(headerKey);
	}

	// Cancel all pending animations (used on navigation)
	clearAllAnimations() {
		for (const set of this.animationQueue.values()) {
			set.forEach(id => clearTimeout(id));
		}
		this.animationQueue.clear();
	}

		toggle(header, isShiftClicked = false) {
			if (!header || header.classList.contains(CONFIG.classes.noContent)) {
				return;
			}

			const startTime = performance.now();
			const level = this.stateManager.getHeaderLevel(header);
			const isCollapsed = !header.classList.contains(CONFIG.classes.collapsed);

			Logger.log("[GHCM] Toggle:", header, "Level:", level, "Will collapse:", isCollapsed);

			if (isShiftClicked) {
				this.toggleAllSameLevel(level, isCollapsed);
			} else {
				this.toggleSingle(header, isCollapsed);
			}

			// 性能监控
			const endTime = performance.now();
			const duration = endTime - startTime;

			if (duration > 100 && CONFIG.animation.maxAnimatedElements > 0) {
				Logger.warn(`[GHCM] 检测到性能问题 (${duration.toFixed(1)}ms)，建议启用性能模式`);

				// 自动降级性能设置
				if (!GM_getValue("ghcm-auto-performance-warned", false)) {
					CONFIG.animation.maxAnimatedElements = Math.max(5, CONFIG.animation.maxAnimatedElements / 2);
					Logger.log(`[GHCM] 自动调整动画阈值为: ${CONFIG.animation.maxAnimatedElements}`);
					GM_setValue("ghcm-auto-performance-warned", true);
				}
			}

			this.setActiveHeading(header);
			DOMUtils.clearSelection();
			DOMUtils.blurActiveElement();
			this.dispatchToggleEvent(header, level, isCollapsed);
		}

		toggleSingle(header, isCollapsed) {
			header.classList.toggle(CONFIG.classes.collapsed, isCollapsed);
			this.updateAriaExpanded(header);
			this.updateContent(header, isCollapsed);
		}

		toggleAllSameLevel(level, isCollapsed) {
			const selectors = CONFIG.selectors.markdownContainers
				.map(container => DOMUtils.getScopedHeadingSelector(container, {
					level,
					includeWrapper: true
				}))
				.filter(Boolean)
				.join(', ');

			if (!selectors) return;

			DOMUtils.$$(selectors).forEach(header => {
				if (DOMUtils.isHeader(header)) {
					header.classList.toggle(CONFIG.classes.collapsed, isCollapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, isCollapsed);
				}
			});
		}

		updateAriaExpanded(header) {
			try {
				const expanded = !header.classList.contains(CONFIG.classes.collapsed);
				header.setAttribute('aria-expanded', String(expanded));
			} catch {}
		}

		updateContent(header, isCollapsed) {
			const level = this.stateManager.getHeaderLevel(header);
			const headerKey = this.stateManager.generateHeaderKey(header);
			const elements = this.getContentElements(header, level);

			// 分析元素：区分普通内容和子标题
			const analyzedElements = elements.map(el => {
				const childHeader = DOMUtils.isHeader(el) ? el : el.querySelector(DOMUtils.getUpperHeadingSelector());
				return {
					element: el,
					isHeader: !!childHeader,
					childHeader: childHeader,
					childHeaderCollapsed: childHeader ? childHeader.classList.contains(CONFIG.classes.collapsed) : false
				};
			});

		// 更新状态（仅存折叠布尔，避免 DOM 引用常驻）
		this.stateManager.setHeaderState(headerKey, { isCollapsed });

			// 执行智能动画（考虑子标题状态）
			this.animateElementsIntelligent(analyzedElements, isCollapsed, headerKey);
		}

		getContentElements(header, level) {
			const container = DOMUtils.getHeaderContainer(header);
			const elements = [];
			let nextElement = container.nextElementSibling;

			// 构建同级和更高级别的选择器
			const higherLevelSelectors = DOMUtils.getHeadingSelectorUpToLevel(level);

			while (nextElement) {
				// 如果遇到同级或更高级别的标题，停止
				if (nextElement.matches(higherLevelSelectors) ||
					(nextElement.classList?.contains('markdown-heading') &&
					nextElement.querySelector(higherLevelSelectors))) {
				break;
			}

				elements.push(nextElement);
				nextElement = nextElement.nextElementSibling;
			}

			return elements;
		}

		animateElements(elements, isCollapsed, headerKey) {
		// 取消之前的动画
		this.cancelTimeouts(headerKey);

			// 性能优化：如果元素太多，直接切换而不做动画
			if (elements.length > CONFIG.animation.maxAnimatedElements) {
				this.toggleElementsInstantly(elements, isCollapsed);
				return;
			}

			// 对于适量元素，使用优化的批量动画
			this.animateElementsBatch(elements, isCollapsed, headerKey);
		}

		// 新的智能动画方法，考虑子标题状态
		animateElementsIntelligent(analyzedElements, isCollapsed, headerKey) {
		// 取消之前的动画
		this.cancelTimeouts(headerKey);

			Logger.log(`[GHCM] 智能动画: ${analyzedElements.length} 个元素, 阈值: ${CONFIG.animation.maxAnimatedElements}`);

			// 性能优化：如果元素太多，直接切换
			if (analyzedElements.length > CONFIG.animation.maxAnimatedElements) {
				Logger.log(`[GHCM] 元素过多，使用即时切换模式`);
				this.toggleElementsIntelligentInstantly(analyzedElements, isCollapsed);
				return;
			}

			// 使用智能批量动画
			Logger.log(`[GHCM] 使用批量动画模式`);
			this.animateElementsIntelligentBatch(analyzedElements, isCollapsed, headerKey);
		}

		// 智能即时切换（性能模式）
		toggleElementsIntelligentInstantly(analyzedElements, isCollapsed) {
			Logger.log(`[GHCM] 性能模式：即时切换 ${analyzedElements.length} 个元素`);

			analyzedElements.forEach(({ element, isHeader, childHeader, childHeaderCollapsed }) => {
				if (isCollapsed) {
					// 折叠：隐藏所有内容
					element.classList.add(CONFIG.classes.hiddenByParent);
					element.style.removeProperty('display');
				} else {
					// 展开：根据子标题状态决定是否显示
					element.classList.remove(CONFIG.classes.hiddenByParent);
					element.style.removeProperty('display');

					// 如果是子标题且原本是折叠的，需要保持其内容隐藏
					if (isHeader && childHeaderCollapsed) {
						setTimeout(() => {
							this.ensureChildHeaderContentHidden(childHeader);
						}, 10);
					}

					// 清理动画样式
					element.style.removeProperty('opacity');
					element.style.removeProperty('transform');
					element.style.removeProperty('transition');
					element.classList.remove('ghcm-transitioning');
				}
			});
		}

				// 智能批量动画
		animateElementsIntelligentBatch(analyzedElements, isCollapsed, headerKey) {
			// 检查是否应该使用动画
			if (CONFIG.animation.maxAnimatedElements === 0) {
				this.toggleElementsIntelligentInstantly(analyzedElements, isCollapsed);
				return;
			}

			const batches = this.createIntelligentBatches(analyzedElements, CONFIG.animation.batchSize);

			const processBatch = (batchIndex) => {
				if (batchIndex >= batches.length) return;

				const batch = batches[batchIndex];

			if (isCollapsed) {
				this.collapseIntelligentBatch(batch, headerKey);
			} else {
				this.expandIntelligentBatch(batch, headerKey);
			}

				// 处理下一个批次
			if (batchIndex < batches.length - 1) {
				const timeout = setTimeout(() => {
					processBatch(batchIndex + 1);
				}, 30); // 减少延迟，让动画更流畅
				this.trackTimeout(headerKey, timeout);
			}
		};

			processBatch(0);
		}

		createIntelligentBatches(analyzedElements, batchSize) {
			const batches = [];
			for (let i = 0; i < analyzedElements.length; i += batchSize) {
				batches.push(analyzedElements.slice(i, i + batchSize));
			}
			return batches;
		}

	collapseIntelligentBatch(batch, headerKey) {
			Logger.log(`[GHCM] 折叠动画批次: ${batch.length} 个元素`);

			// 折叠批次：先设置初始状态和过渡效果
			batch.forEach(({ element }) => {
				element.style.opacity = '1';
				element.style.transform = 'translateY(0)';
				element.style.transition = `opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}, transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
			});

			// 使用requestAnimationFrame确保样式已应用
			requestAnimationFrame(() => {
				batch.forEach(({ element }) => {
					element.style.opacity = '0';
					element.style.transform = 'translateY(-8px)';
				});

				// 动画完成后隐藏元素
								const t = setTimeout(() => {
					batch.forEach(({ element }) => {
						element.classList.add(CONFIG.classes.hiddenByParent);
						element.style.removeProperty('display');
						element.style.removeProperty('opacity');
						element.style.removeProperty('transform');
						element.style.removeProperty('transition');
					});
					Logger.log(`[GHCM] 折叠动画批次完成`);
				}, CONFIG.animation.duration);
				this.trackTimeout(headerKey, t);
			});
		}

	expandIntelligentBatch(batch, headerKey) {
			Logger.log(`[GHCM] 展开动画批次: ${batch.length} 个元素`);

			// 展开批次：先显示元素但设为初始动画状态
			batch.forEach(({ element, isHeader, childHeader, childHeaderCollapsed }) => {
				element.classList.remove(CONFIG.classes.hiddenByParent);
				element.style.removeProperty('display');
				element.style.opacity = '0';
				element.style.transform = 'translateY(-8px)';
				element.style.transition = `opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}, transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
			});

			// 使用requestAnimationFrame确保DOM更新完成
			requestAnimationFrame(() => {
				batch.forEach(({ element, isHeader, childHeader, childHeaderCollapsed }) => {
					element.style.opacity = '1';
					element.style.transform = 'translateY(0)';

					// 如果是子标题且原本是折叠的，确保其内容保持隐藏
					if (isHeader && childHeaderCollapsed) {
						// 延迟执行，确保动画和DOM更新完成
                        setTimeout(() => {
							this.ensureChildHeaderContentHidden(childHeader);
						}, CONFIG.animation.duration + 50);
					}
				});

				// 清理样式
				const t = setTimeout(() => {
					batch.forEach(({ element }) => {
						element.style.removeProperty('opacity');
						element.style.removeProperty('transform');
						element.style.removeProperty('transition');
					});
					Logger.log(`[GHCM] 展开动画批次完成`);
				}, CONFIG.animation.duration);
				this.trackTimeout(headerKey, t);
			});
		}

		// 确保子标题的内容保持隐藏状态
		ensureChildHeaderContentHidden(childHeader) {
			if (!childHeader || !childHeader.classList.contains(CONFIG.classes.collapsed)) {
				return;
			}

			const childLevel = this.stateManager.getHeaderLevel(childHeader);
			const childElements = this.getContentElements(childHeader, childLevel);

			// 立即隐藏子标题的内容，不使用动画
			childElements.forEach(element => {
				element.classList.add(CONFIG.classes.hiddenByParent);
				element.style.removeProperty('display');
				element.style.removeProperty('opacity');
				element.style.removeProperty('transform');
				element.classList.remove('ghcm-transitioning');
			});

			Logger.log(`[GHCM] 已恢复子标题的折叠状态:`, childHeader.textContent.trim());
		}

		// 即时切换，无动画
		toggleElementsInstantly(elements, isCollapsed) {
			// 批量DOM操作，减少重排

			elements.forEach(element => {
				if (isCollapsed) {
					element.classList.add(CONFIG.classes.hiddenByParent);
					element.style.removeProperty('display');
            } else {
					element.classList.remove(CONFIG.classes.hiddenByParent);
					element.style.removeProperty('display');
					// 清理可能存在的动画样式
					element.style.removeProperty('opacity');
					element.style.removeProperty('transform');
					element.classList.remove('ghcm-transitioning');
				}
			});
		}

		// 批量动画处理
		animateElementsBatch(elements, isCollapsed, headerKey) {
			const batches = this.createBatches(elements, CONFIG.animation.batchSize);
			let completedBatches = 0;

			const processBatch = (batchIndex) => {
				if (batchIndex >= batches.length) return;

				const batch = batches[batchIndex];

				// 为每个批次准备DOM变更
			if (isCollapsed) {
				this.collapseBatch(batch, headerKey);
			} else {
				this.expandBatch(batch, headerKey);
			}

				completedBatches++;

				// 处理下一个批次
				if (batchIndex < batches.length - 1) {
					const timeout = setTimeout(() => {
						processBatch(batchIndex + 1);
					}, 50); // 批次间短暂延迟
					this.trackTimeout(headerKey, timeout);
				}
		};

			processBatch(0);
		}

		createBatches(elements, batchSize) {
			const batches = [];
			for (let i = 0; i < elements.length; i += batchSize) {
				batches.push(elements.slice(i, i + batchSize));
			}
			return batches;
		}

	collapseBatch(batch, headerKey) {
			// 先设置初始状态
			batch.forEach(element => {
				element.style.transition = `opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
				element.style.opacity = '1';
			});

			// 触发动画
			requestAnimationFrame(() => {
				batch.forEach(element => {
					element.style.opacity = '0';
				});

				// 动画完成后隐藏
					const t = setTimeout(() => {
					batch.forEach(element => {
						element.classList.add(CONFIG.classes.hiddenByParent);
						element.style.removeProperty('display');
						element.style.removeProperty('opacity');
						element.style.removeProperty('transition');
					});
				}, CONFIG.animation.duration);
				this.trackTimeout(headerKey, t);
			});
		}

	expandBatch(batch, headerKey) {
			// 先显示元素但设为透明
			batch.forEach(element => {
				element.classList.remove(CONFIG.classes.hiddenByParent);
				element.style.removeProperty('display');
				element.style.opacity = '0';
				element.style.transition = `opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
			});

			// 触发淡入动画
			requestAnimationFrame(() => {
				batch.forEach(element => {
					element.style.opacity = '1';
				});

				// 清理样式
						const t = setTimeout(() => {
					batch.forEach(element => {
						element.style.removeProperty('opacity');
						element.style.removeProperty('transition');
					});
					}, CONFIG.animation.duration);
					this.trackTimeout(headerKey, t);
			});
		}

		// 展开到指定标题（用于hash导航）
		expandToHeader(targetHeader, { scroll = true, setActive = true } = {}) {
			if (!targetHeader) return;

			const level = this.stateManager.getHeaderLevel(targetHeader);
			let current = targetHeader;

			// 向上查找所有父级标题并展开
			while (current) {
				const container = DOMUtils.getHeaderContainer(current);
				let previous = container.previousElementSibling;
				let foundParent = false;

				// 查找更高级别的父标题
				while (previous) {
					const parentHeader = this.findHeaderInElement(previous, level - 1);
					if (parentHeader) {
						if (parentHeader.classList.contains(CONFIG.classes.collapsed)) {
							this.toggleSingle(parentHeader, false);
						}
						current = parentHeader;
						foundParent = true;
						break;
					}
					previous = previous.previousElementSibling;
				}

				if (!foundParent) break;
			}

			// 滚动到目标位置
			if (scroll) {
				this.scrollToElement(targetHeader);
			}
			if (setActive) {
				this.setActiveHeading(targetHeader, { scroll: false });
			}
		}

		findHeaderInElement(element, maxLevel) {
			if (DOMUtils.isHeader(element)) {
				const elementLevel = this.stateManager.getHeaderLevel(element);
				if (elementLevel <= maxLevel) return element;
			}

			// 查找容器内的标题
			for (let i = 1; i < maxLevel; i++) {
				const headerName = CONFIG.selectors.headers[i - 1].toLowerCase();
				const header = element.querySelector(headerName) ||
							  element.querySelector(`${headerName}.heading-element`);
				if (header) return header;
			}

			return null;
		}

		scrollToElement(element) {
			if (!element) return;

			// 顶部偏移考虑 GitHub 顶栏高度
			const headerEl = document.querySelector('header[role="banner"], .Header, .AppHeader-globalBar');
			const headerOffset = (headerEl?.offsetHeight || 80) + 20; // 额外留白
			const rect = element.getBoundingClientRect();
			const targetPosition = Math.max(0, rect.top + window.pageYOffset - headerOffset);

			// 平滑滚动
			window.scrollTo({ top: targetPosition, behavior: 'smooth' });

			// 延迟再次确保位置正确
			if (this._scrollEnsureTimeout) clearTimeout(this._scrollEnsureTimeout);
			this._scrollEnsureTimeout = setTimeout(() => {
				if (Math.abs(window.scrollY - targetPosition) > 50) {
					window.scrollTo({ top: targetPosition, behavior: 'smooth' });
				}
			}, 500);
		}

		setActiveHeading(element, { scroll = false } = {}) {
			if (!element) return;
			let header = element;
			if (!DOMUtils.isHeader(header)) {
				header = header.querySelector(DOMUtils.getUpperHeadingSelector());
			}
			if (!header) return;
			if (this.activeHeading && this.activeHeading !== header) {
				try { this.activeHeading.classList.remove(CONFIG.classes.activeHeading); } catch {}
			}
			this.activeHeading = header;
			try { header.classList.add(CONFIG.classes.activeHeading); } catch {}
			try {
				const id = this.tocGenerator?.getHeaderId?.(header) || header.id || header.getAttribute('id');
				if (id && this.tocGenerator?.tocContainer) {
					this.tocGenerator.highlightTocById(id);
				}
			} catch {}
			if (scroll) {
				this.scrollToElement(header);
			}
		}

		getActiveHeaderElement(force = false) {
			if (!force && this.activeHeading && document.contains(this.activeHeading)) {
				return this.activeHeading;
			}
			const headers = this.getAllHeaders();
			if (!headers.length) return null;
			const headerEl = document.querySelector('header[role="banner"], .Header, .AppHeader-globalBar');
			const headerOffset = (headerEl?.offsetHeight || 80) + 20;
			const position = window.scrollY + headerOffset + 1;
			let active = headers[0];
			for (const header of headers) {
				const top = header.getBoundingClientRect().top + window.pageYOffset;
				if (top <= position) {
					active = header;
				} else {
					break;
				}
			}
			if (active) {
				this.setActiveHeading(active);
			}
			return active;
		}

		isHeaderNavigable(header) {
			if (!header) return false;
			if (header.classList?.contains(CONFIG.classes.hidden) ||
				header.classList?.contains(CONFIG.classes.hiddenByParent)) {
				return false;
			}
			try {
				if (header.closest(`.${CONFIG.classes.hiddenByParent}`)) {
					return false;
				}
			} catch {}
			try {
				const style = window.getComputedStyle(header);
				if (style.display === 'none' || style.visibility === 'hidden') {
					return false;
				}
			} catch {}
			return true;
		}

		findNavigableIndex(headers, startIndex, step) {
			for (let i = startIndex; i >= 0 && i < headers.length; i += step) {
				const candidate = headers[i];
				if (this.isHeaderNavigable(candidate)) {
					return i;
				}
			}
			return -1;
		}

		focusNextHeading() {
			DOMUtils.blurActiveElement();
			const headers = this.getAllHeaders();
			if (!headers.length) return;
			const current = this.getActiveHeaderElement();
			const currentIndex = headers.indexOf(current);
			const startIndex = currentIndex === -1 ? 0 : currentIndex + 1;
			const targetIndex = this.findNavigableIndex(headers, startIndex, 1);
			if (targetIndex === -1) {
				this.showNotification('📌 已是最后一个可见标题');
				return;
			}
			const target = headers[targetIndex];
			this.expandToHeader(target, { scroll: false, setActive: false });
			this.scrollToElement(target);
			this.setActiveHeading(target);
		}

		focusPreviousHeading() {
			DOMUtils.blurActiveElement();
			const headers = this.getAllHeaders();
			if (!headers.length) return;
			const current = this.getActiveHeaderElement();
			const currentIndex = headers.indexOf(current);
			const startIndex = currentIndex === -1 ? headers.length - 1 : currentIndex - 1;
			const targetIndex = this.findNavigableIndex(headers, startIndex, -1);
			if (targetIndex === -1) {
				this.showNotification('📌 已是第一个可见标题');
				return;
			}
			const target = headers[targetIndex];
			this.expandToHeader(target, { scroll: false, setActive: false });
			this.scrollToElement(target);
			this.setActiveHeading(target);
		}

		dispatchToggleEvent(header, level, isCollapsed) {
			document.dispatchEvent(new CustomEvent("ghcm:toggle-complete", {
				detail: { header, level, isCollapsed }
			}));

			// 如果是展开操作，检查并恢复子标题状态
			if (!isCollapsed) {
				setTimeout(() => {
					this.checkAndRestoreChildHeaderStates(header, level);
				}, CONFIG.animation.duration + 100);
			}
		}

		// 检查并恢复子标题的折叠状态
		checkAndRestoreChildHeaderStates(parentHeader, parentLevel) {
			const container = DOMUtils.getHeaderContainer(parentHeader);
			let nextElement = container.nextElementSibling;

			// 查找所有子标题并恢复其状态
			const higherLevelSelectors = DOMUtils.getHeadingSelectorUpToLevel(parentLevel);
			while (nextElement) {
				// 停止条件：遇到同级或更高级别的标题
				if (nextElement.matches(higherLevelSelectors) ||
					(nextElement.classList?.contains('markdown-heading') &&
					nextElement.querySelector(higherLevelSelectors))) {
					break;
				}

				// 检查是否是子标题
				const childHeader = DOMUtils.isHeader(nextElement) ?
					nextElement : nextElement.querySelector(DOMUtils.getUpperHeadingSelector());

				if (childHeader && childHeader.classList.contains(CONFIG.classes.collapsed)) {
					// 确保这个子标题的内容保持隐藏
					this.ensureChildHeaderContentHidden(childHeader);
				}

				nextElement = nextElement.nextElementSibling;
			}
		}

		// 批量操作方法
		getAllHeaders() {
			return DOMUtils.collectHeadings();
		}

		syncAriaExpandedForAll() {
			try {
				this.getAllHeaders().forEach(h => {
					const expanded = !h.classList.contains(CONFIG.classes.collapsed);
					h.setAttribute('aria-expanded', String(expanded));
				});
			} catch {}
		}

		collapseAll() {
			const headers = this.getAllHeaders();
			let count = 0;

			headers.forEach(header => {
				if (!header.classList.contains(CONFIG.classes.collapsed) &&
					!header.classList.contains(CONFIG.classes.noContent)) {
					header.classList.add(CONFIG.classes.collapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, true);
					count++;
				}
			});

			Logger.log(`[GHCM] 已折叠 ${count} 个标题`);
			this.showNotification(`📁 已折叠 ${count} 个标题`);
		}

		expandAll() {
			const headers = this.getAllHeaders();
			let count = 0;

			headers.forEach(header => {
				if (header.classList.contains(CONFIG.classes.collapsed)) {
					header.classList.remove(CONFIG.classes.collapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, false);
					count++;
				}
			});

			Logger.log(`[GHCM] 已展开 ${count} 个标题`);
			this.showNotification(`📂 已展开 ${count} 个标题`);
		}

		toggleAll() {
			const headers = this.getAllHeaders();
			const collapsedCount = headers.filter(h =>
				h.classList.contains(CONFIG.classes.collapsed)
			).length;
			const totalCount = headers.filter(h =>
				!h.classList.contains(CONFIG.classes.noContent)
			).length;

			// 如果超过一半已折叠，则全部展开；否则全部折叠
			if (collapsedCount > totalCount / 2) {
				this.expandAll();
			} else {
				this.collapseAll();
			}
		}

		// 按级别批量操作
		collapseLevel(level) {
			const selectors = CONFIG.selectors.markdownContainers
				.map(container => DOMUtils.getScopedHeadingSelector(container, { level }))
				.filter(Boolean)
				.join(', ');
			if (!selectors) return;

			const headers = DOMUtils.$$(selectors).filter(el => DOMUtils.isHeader(el));

			let count = 0;
			headers.forEach(header => {
				if (!header.classList.contains(CONFIG.classes.collapsed) &&
					!header.classList.contains(CONFIG.classes.noContent)) {
					header.classList.add(CONFIG.classes.collapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, true);
					count++;
				}
			});

			Logger.log(`[GHCM] 已折叠 ${count} 个 H${level} 标题`);
			this.showNotification(`📁 已折叠 ${count} 个 H${level} 标题`);
		}

		expandLevel(level) {
			const selectors = CONFIG.selectors.markdownContainers
				.map(container => DOMUtils.getScopedHeadingSelector(container, { level }))
				.filter(Boolean)
				.join(', ');
			if (!selectors) return;

			const headers = DOMUtils.$$(selectors).filter(el => DOMUtils.isHeader(el));

			let count = 0;
			headers.forEach(header => {
				if (header.classList.contains(CONFIG.classes.collapsed)) {
					header.classList.remove(CONFIG.classes.collapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, false);
					count++;
				}
			});

			Logger.log(`[GHCM] 已展开 ${count} 个 H${level} 标题`);
			this.showNotification(`📂 已展开 ${count} 个 H${level} 标题`);
		}

		// 通知功能
		showNotification(message) {
			if (this._activeNotification) {
				try { this._activeNotification.remove(); } catch {}
				this._activeNotification = null;
			}

			// 创建通知元素
			const notification = document.createElement('div');
			notification.style.cssText = `
				position: fixed;
				top: 20px;
				left: 50%;
				transform: translateX(-50%);
				background: var(--color-canvas-default, #ffffff);
				border: 1px solid var(--color-border-default, #d0d7de);
				border-radius: 8px;
				padding: 12px 20px;
				box-shadow: 0 4px 12px rgba(0,0,0,0.15);
				z-index: 10002;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
				font-size: 14px;
				color: var(--color-fg-default, #24292f);
				opacity: 0;
				transition: opacity 0.3s ease;
			`;
			notification.textContent = message;

			document.body.appendChild(notification);
			this._activeNotification = notification;

			// 显示动画
			requestAnimationFrame(() => {
				notification.style.opacity = '1';
			});

			// 自动消失
			setTimeout(() => {
				notification.style.opacity = '0';
				setTimeout(() => {
					if (notification.parentNode) {
						notification.parentNode.removeChild(notification);
					}
					if (this._activeNotification === notification) {
						this._activeNotification = null;
					}
				}, 300);
			}, 2000);
		}

		// 加载已保存的状态
		loadSavedStates() {
			this.stateManager.loadFromMemory();

			// 分层应用已保存的状态（从高级别到低级别）
			for (let level = 1; level <= 6; level++) {
				this.applyStatesForLevel(level);
			}
		}

		applyStatesForLevel(level) {
			const headers = this.getAllHeaders().filter(h =>
				this.stateManager.getHeaderLevel(h) === level
			);

			headers.forEach(header => {
				const headerKey = this.stateManager.generateHeaderKey(header);
				const savedState = this.stateManager.getHeaderState(headerKey);

				if (savedState && savedState.isCollapsed) {
					Logger.log(`[GHCM] 恢复 H${level} 标题状态:`, header.textContent.trim());
					header.classList.add(CONFIG.classes.collapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, true);
			}
		});
	}

		applyStateToElement(headerKey, state) {
			// 保留原方法作为备用
			const headers = this.getAllHeaders();
			headers.forEach(header => {
				const currentKey = this.stateManager.generateHeaderKey(header);
				if (currentKey === headerKey && state.isCollapsed) {
					header.classList.add(CONFIG.classes.collapsed);
					this.updateAriaExpanded(header);
					this.updateContent(header, true);
				}
			});
		}

		// 代理目录和搜索功能
		toggleToc() {
			if (this.tocGenerator) {
				this.tocGenerator.toggle();
			}
		}

		toggleSearch() {
			if (this.searchManager) {
				this.searchManager.toggle();
			}
		}

		// 检查标题是否有内容
		markEmptyHeaders() {
			CONFIG.selectors.markdownContainers.forEach(containerSelector => {
				const selector = DOMUtils.getScopedHeadingSelector(containerSelector, { includeWrapper: true });
				if (!selector) return;

				DOMUtils.$$(selector).forEach(header => {
					const level = this.stateManager.getHeaderLevel(header);
					const elements = this.getContentElements(header, level);

					if (elements.length === 0) {
						header.classList.add(CONFIG.classes.noContent);
					} else {
						header.classList.remove(CONFIG.classes.noContent);
					}
				});
			});
		}
	}

	// 事件管理器
	class EventManager {
	constructor(collapseManager) {
		this.collapseManager = collapseManager;
		this.hoverHeader = null;
		this.setupEventListeners();
	}

		setupEventListeners() {
			// 点击事件
			document.addEventListener("click", this.handleClick.bind(this), true);
			// Hover 高亮
			this._hoverHandler = this.handleHover.bind(this);
			this._hoverLeaveHandler = this.handleHoverLeave.bind(this);
			document.addEventListener('mouseover', this._hoverHandler, true);
			document.addEventListener('mouseout', this._hoverLeaveHandler, true);

			// Hash 变化事件
			window.addEventListener("hashchange", this.handleHashChange.bind(this));

			// DOM 变化监听（如果有其他脚本修改DOM）
			if (window.ghmo) {
				window.addEventListener("ghmo:dom", this.handleDOMChange.bind(this));
			}

			// GitHub 导航事件（PJAX/Turbo）
			document.addEventListener("pjax:end", this.handleNavigation.bind(this));
			document.addEventListener("turbo:load", this.handleNavigation.bind(this));
			document.addEventListener("turbo:render", this.handleNavigation.bind(this));
			window.addEventListener("pageshow", this.handleNavigation.bind(this));

			// 页面加载完成后初始化
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', this.handleDOMChange.bind(this));
			} else {
				setTimeout(() => this.handleDOMChange(), 200);
			}
		}

		handleClick(event) {
			let target = event.target;

			// 仅处理左键
			if (event.button !== 0) return;

			// 文本选择时不触发
			try {
				const sel = window.getSelection?.();
				if (sel && sel.toString && sel.toString().trim().length > 0) return;
			} catch {}

			// 处理SVG点击
			if (target.nodeName === "path") {
				target = target.closest("svg");
			}

			// 跳过排除的元素与自身UI
			if (!target || this.shouldSkipElement(target) || target.closest('.ghcm-menu-container, .ghcm-search-container, .ghcm-toc-container, .ghcm-menu-button')) {
				return;
			}

			// 查找最近的标题元素
			const header = target.closest(DOMUtils.getHeadingSelector());

			if (header && DOMUtils.isHeader(header) && DOMUtils.isInMarkdown(header)) {
				// 仅在真正执行折叠时处理，避免干扰默认链接等行为
				Logger.log("[GHCM] Header clicked:", header);
			this.collapseManager.toggle(header, event.shiftKey);
		}
			}

		handleHover(event) {
			const header = event.target.closest(DOMUtils.getHeadingSelector());
			if (!header || !DOMUtils.isHeader(header)) return;
			if (this.hoverHeader === header) return;
			try {
				if (this.hoverHeader) {
					this.hoverHeader.classList.remove(CONFIG.classes.hoverHeading);
				}
				header.classList.add(CONFIG.classes.hoverHeading);
				this.hoverHeader = header;
			} catch {}
		}

		handleHoverLeave(event) {
			const header = event.target.closest(DOMUtils.getHeadingSelector());
			if (!header || !DOMUtils.isHeader(header)) return;
			const related = event.relatedTarget;
			if (related && (related === header || related.closest?.(DOMUtils.getHeadingSelector()) === header)) {
				return;
			}
			if (this.hoverHeader === header) {
				header.classList.remove(CONFIG.classes.hoverHeading);
				this.hoverHeader = null;
			}
		}

		shouldSkipElement(element) {
			const nodeName = element.nodeName?.toLowerCase();
			// 表单/可编辑区域内的交互不触发折叠
			try {
				if (element.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]')) {
					return true;
				}
			} catch {}

			return CONFIG.selectors.excludeClicks.some(selector => {
				if (selector.startsWith('.')) {
					return element.classList.contains(selector.slice(1));
				}
				return nodeName === selector;
			});
		}

		handleHashChange() {
			const hash = window.location.hash.replace(/#/, "");
			if (hash) {
				this.openHashTarget(hash);
			}
		}

		handleDOMChange() {
			DOMUtils.invalidateHeadingCache();
			try { this.collapseManager.searchManager?.invalidateIndex?.(); } catch {}
			try { this.collapseManager.bookmarkManager?.applyBookmarks?.(); } catch {}
			// 重新标记空标题
			this.collapseManager.markEmptyHeaders();

			// 处理当前hash
			this.handleHashChange();
			try {
				const active = this.collapseManager.getActiveHeaderElement();
				if (active) this.collapseManager.setActiveHeading(active);
			} catch {}
		}

		handleNavigation() {
			DOMUtils.invalidateHeadingCache();
			try { this.collapseManager.searchManager?.invalidateIndex?.(); } catch {}
			try { this.collapseManager.bookmarkManager?.applyBookmarks?.(); } catch {}
			// 先清理任何挂起的动画/定时器
			try { this.collapseManager.clearAllAnimations(); } catch {}
			// 更新页面键，适配单页导航
			try { this.collapseManager.stateManager.updatePageKey(); } catch (e) {}
			// 重建标记并按需恢复状态
			this.handleDOMChange();
			if (CONFIG.memory.enabled) {
				setTimeout(() => {
					try { this.collapseManager.loadSavedStates(); } catch (e) {}
				}, 300);
			}
		}

		openHashTarget(id) {
			// 尝试多种ID格式
			const possibleSelectors = [
				`#user-content-${id}`,
				`#${id}`,
				`[id="${id}"]`
			];

			let targetElement = null;
			for (const selector of possibleSelectors) {
				targetElement = DOMUtils.$(selector);
				if (targetElement) break;
			}

			if (!targetElement) return;

			// 查找对应的标题
			let header = targetElement;
			if (!DOMUtils.isHeader(header)) {
				header = targetElement.closest(DOMUtils.getHeadingSelector());
			}

			if (header && DOMUtils.isHeader(header)) {
				this.collapseManager.expandToHeader(header, { scroll: false, setActive: false });
				this.collapseManager.scrollToElement(header);
				this.collapseManager.setActiveHeading(header);
			}
		}
	}

	// 主应用类
	class GitHubCollapseMarkdown {
		constructor() {
			this.stateManager = new StateManager();
			this.styleManager = new StyleManager();
			this.collapseManager = new CollapseManager(this.stateManager);
			this.tocGenerator = new TocGenerator();
			this.searchManager = new SearchManager(this.collapseManager);
			this.bookmarkManager = new BookmarkManager(this);
			this.menuManager = new MenuManager(this);
			this.helpModal = new HelpModal(this);
			this.hotkeyManager = new HotkeyManager(this.collapseManager);
			this.hotkeyManager.setApp(this);
			this.eventManager = new EventManager(this.collapseManager);

			// 将附加功能关联到折叠管理器
			this.collapseManager.tocGenerator = this.tocGenerator;
			this.collapseManager.searchManager = this.searchManager;
			this.collapseManager.menuManager = this.menuManager;
			this.collapseManager.bookmarkManager = this.bookmarkManager;
			this.tocGenerator.collapseManager = this.collapseManager;

			this.init();
		}

		init() {
			const performanceMode = GM_getValue("ghcm-performance-mode", false);
			const memoryEnabled = CONFIG.memory.enabled;
			const hotkeysEnabled = CONFIG.hotkeys.enabled;

			const animationStatus = (CONFIG.animation.maxAnimatedElements === 0) ? "性能模式 (无动画)" : "标准模式 (有动画)";

			Logger.log(`[GHCM] Initializing GitHub Collapse Markdown (Optimized v3.2.4) - ${animationStatus}`);
			Logger.log(`[GHCM] 🧠 智能嵌套状态管理: 启用`);
			Logger.log(`[GHCM] 🎨 现代GUI界面: 启用`);
			Logger.log(`[GHCM] 动画阈值: ${CONFIG.animation.maxAnimatedElements} 个元素`);
			Logger.log(`[GHCM] 状态记忆: ${memoryEnabled ? "启用" : "禁用"}`);
			Logger.log(`[GHCM] 快捷键: ${hotkeysEnabled ? "启用" : "禁用"}`);

			// 添加菜单命令
			this.setupMenuCommands();

			// 初始检查和状态加载
				setTimeout(() => {
				this.collapseManager.markEmptyHeaders();

				// 加载已保存的折叠状态
				if (memoryEnabled) {
					this.collapseManager.loadSavedStates();
				}
				// 同步所有标题的无障碍状态
				this.collapseManager.syncAriaExpandedForAll();
				this.bookmarkManager.applyBookmarks();
				}, 500);

			// 监听折叠状态变化，更新目录显示和菜单统计
			document.addEventListener('ghcm:toggle-complete', () => {
				if (this.tocGenerator.isVisible) {
					setTimeout(() => {
						this.tocGenerator.refreshTocStates();
					}, CONFIG.animation.duration + 150);
				}
				// 如果菜单打开，刷新统计信息
				if (this.menuManager.isVisible) {
					setTimeout(() => {
						this.menuManager.refreshMenu();
					}, CONFIG.animation.duration + 150);
				}
			});
		}

		setupMenuCommands() {
			try {
				// === 基础操作 ===
				GM_registerMenuCommand("📁 折叠所有标题", () => {
					this.collapseManager.collapseAll();
				});

				GM_registerMenuCommand("📂 展开所有标题", () => {
					this.collapseManager.expandAll();
				});

				GM_registerMenuCommand("🔄 智能切换", () => {
					this.collapseManager.toggleAll();
				});

				// === 工具功能 ===
				GM_registerMenuCommand("📑 目录导航", () => {
					this.tocGenerator.toggle();
				});

					GM_registerMenuCommand("🔍 搜索标题", () => {
						this.searchManager.toggle();
					});

					GM_registerMenuCommand("⭐ 收藏当前标题", () => {
						this.bookmarkManager.addBookmarkFromViewport();
					});

					GM_registerMenuCommand("🗂️ 清空本页书签", () => {
						this.bookmarkManager.clearPageBookmarks();
					});

				// === 设置选项 ===
				GM_registerMenuCommand("⚡ 性能模式", () => {
					this.togglePerformanceMode();
				});

				GM_registerMenuCommand("💾 状态记忆", () => {
					this.toggleMemory();
				});

				GM_registerMenuCommand("⌨️ 快捷键", () => {
					this.toggleHotkeys();
				});

				GM_registerMenuCommand("🐛 调试模式", () => {
					this.toggleDebug();
				});

				// === 重置功能 ===
				GM_registerMenuCommand("🔄 重置折叠状态", () => {
					this.resetAllStates();
				});

				GM_registerMenuCommand("🗑️ 清除记忆数据", () => {
					this.clearAllMemory();
				});

				// === 信息帮助 ===
				GM_registerMenuCommand("📊 当前统计", () => {
					this.showStatistics();
				});

				GM_registerMenuCommand("ℹ️ 使用说明", () => {
					this.showHotkeyHelp();
				});

			} catch (e) {
				Logger.warn("[GHCM] 菜单功能不可用:", e);
			}
		}

		toggleMemory() {
			const newState = !CONFIG.memory.enabled;
			CONFIG.memory.enabled = newState;
			GM_setValue("ghcm-memory-enabled", newState);

			const status = newState ? "启用" : "禁用";
			Logger.log(`[GHCM] 状态记忆已${status}`);
			this.collapseManager.showNotification(`💾 状态记忆已${status}`);
			if (newState) {
				this.stateManager.scheduleSave({ force: true });
			} else {
				this.stateManager.cancelScheduledSave();
			}
		}

		toggleHotkeys() {
			const newState = !CONFIG.hotkeys.enabled;
			CONFIG.hotkeys.enabled = newState;
			GM_setValue("ghcm-hotkeys-enabled", newState);

			const status = newState ? "启用" : "禁用";
			Logger.log(`[GHCM] 快捷键已${status}`);
			this.collapseManager.showNotification(`⌨️ 快捷键已${status}`);

			if (newState) {
				// 重新绑定快捷键
				this.hotkeyManager.setupHotkeys();
			} else {
				// 解除绑定，避免重复与多次触发
				this.hotkeyManager.teardownHotkeys();
			}
		}

		toggleVimNav() {
			const newState = !CONFIG.hotkeys.navEnabled;
			CONFIG.hotkeys.navEnabled = newState;
			GM_setValue('ghcm-nav-enabled', newState);

			const status = newState ? '启用' : '禁用';
			Logger.log(`[GHCM] Vim 导航热键已${status}`);
			this.collapseManager.showNotification(`🧭 Vim 导航热键已${status}`);
		}

		toggleShowLevelNumber() {
			CONFIG.ui.showLevelNumber = !CONFIG.ui.showLevelNumber;
			GM_setValue('ghcm-show-level-number', CONFIG.ui.showLevelNumber);
			try { this.styleManager.updateArrowContentOverride(); } catch {}
			this.collapseManager.showNotification(CONFIG.ui.showLevelNumber ? '🔢 显示级别数字' : '🔽 仅显示箭头');
		}

		setColorScheme(name) {
			const scheme = CONFIG.colorSchemes[name];
			if (!scheme) {
				this.collapseManager.showNotification('⚠️ 未找到指定的配色方案');
				return;
			}
			this.styleManager.updateColors(scheme);
			if (name === 'custom') {
				this.collapseManager.showNotification('🎨 已应用自定义配色');
			} else {
				this.collapseManager.showNotification(`🎨 已应用配色：${name}`);
			}
		}

		promptCustomColors() {
			const current = (CONFIG.colorSchemes.custom || CONFIG.colors).join(', ');
			const input = prompt('请输入新的配色（可用逗号或空格分隔，至少 1 个色值）', current);
			if (input === null) return;
			const parts = input.split(/[\s,]+/).map(part => part.trim()).filter(Boolean);
			if (!parts.length) {
				this.collapseManager.showNotification('⚠️ 未输入有效的颜色');
				return;
			}
			while (parts.length < 6) {
				parts.push(parts[parts.length - 1] || parts[0]);
			}
			const colors = parts.slice(0, 6);
			CONFIG.colorSchemes.custom = colors;
			GM_setValue('ghcm-custom-colors', colors);
			this.setColorScheme('custom');
			this.menuManager.refreshMenu();
		}

		promptArrowSize() {
			const current = CONFIG.ui.arrowSize || '0.8em';
			const input = prompt('设置箭头字号（如 0.8em、12px）', current);
			if (input === null) return;
			const value = input.trim();
			if (!value) {
				this.collapseManager.showNotification('⚠️ 请输入有效的尺寸');
				return;
			}
			CONFIG.ui.arrowSize = value;
			this.styleManager.updateArrowSize(value);
			this.collapseManager.showNotification(`🔠 已更新箭头大小：${value}`);
			this.menuManager.refreshMenu();
		}

		toggleDebug() {
			const newState = !CONFIG.debug;
			CONFIG.debug = newState;
			GM_setValue("ghcm-debug-mode", newState);

			const status = newState ? "启用" : "禁用";
			Logger.log(`[GHCM] 调试模式已${status}`);
			this.collapseManager.showNotification(`🐛 调试模式已${status}`);
		}

		togglePerformanceMode() {
			const isPerformanceMode = CONFIG.animation.maxAnimatedElements === 0;
			const newState = !isPerformanceMode;

			if (newState) {
				// 启用性能模式（禁用动画）
				CONFIG.animation.maxAnimatedElements = 0;
				GM_setValue("ghcm-performance-mode", true);
				Logger.log("[GHCM] 已启用性能模式 - 动画已禁用");
				this.collapseManager.showNotification("⚡ 性能模式已启用");
			} else {
				// 禁用性能模式（启用动画）
				CONFIG.animation.maxAnimatedElements = 20;
				GM_setValue("ghcm-performance-mode", false);
				Logger.log("[GHCM] 已禁用性能模式 - 动画已启用");
				this.collapseManager.showNotification("🎬 动画效果已启用");
			}
		}

		clearAllMemory() {
			if (confirm("确定要清除所有页面的折叠状态记忆吗？")) {
				GM_setValue(CONFIG.memory.key, {});
				this.stateManager.clear();
				Logger.log("[GHCM] 已清除所有记忆数据");
				this.collapseManager.showNotification("🗑️ 已清除所有记忆数据");
			}
		}

		showHotkeyHelp() {
			this.helpModal?.show();
		}

		showStatistics() {
			const headers = this.collapseManager.getAllHeaders();
			const collapsed = headers.filter(h => h.classList.contains(CONFIG.classes.collapsed));
			const visible = headers.filter(h =>
				!h.classList.contains(CONFIG.classes.collapsed) &&
				!h.classList.contains(CONFIG.classes.noContent)
			);

			const levelStats = {};
			for (let i = 1; i <= 6; i++) {
				const levelHeaders = headers.filter(h =>
					this.stateManager.getHeaderLevel(h) === i
				);
				if (levelHeaders.length > 0) {
					levelStats[`H${i}`] = {
						total: levelHeaders.length,
						collapsed: levelHeaders.filter(h => h.classList.contains(CONFIG.classes.collapsed)).length
					};
				}
			}

			const levelStatsText = Object.entries(levelStats)
				.map(([level, stats]) =>
					`${level}: ${stats.total}个 (${stats.collapsed}个已折叠)`
				).join(', ');

			const statsContent = `
📊 当前页面统计

📝 标题概况：
• 总计：${headers.length} 个标题
• 已折叠：${collapsed.length} 个
• 可见：${visible.length} 个

📋 级别分布：${levelStatsText || '无标题'}

⚙️ 功能状态：
• 性能模式：${CONFIG.animation.maxAnimatedElements === 0 ? '🟢 启用' : '🔴 禁用'}
• 状态记忆：${CONFIG.memory.enabled ? '🟢 启用' : '🔴 禁用'}
• 快捷键：${CONFIG.hotkeys.enabled ? '🟢 启用' : '🔴 禁用'}
			`.trim();

			alert(statsContent);
		}

		resetAllStates() {
			// 移除所有折叠状态
			DOMUtils.$$(".ghcm-collapsed").forEach(element => {
				element.classList.remove(CONFIG.classes.collapsed);
				try { element.setAttribute('aria-expanded', 'true'); } catch {}
			});

			// 显示所有隐藏的内容
			DOMUtils.$$(".ghcm-hidden-by-parent").forEach(element => {
				element.classList.remove(CONFIG.classes.hiddenByParent);
				element.style.removeProperty('display');
				element.style.opacity = '';
				element.style.transform = '';
			});

			// 清空状态
			this.stateManager.clear();

			Logger.log("[GHCM] 已重置所有折叠状态");
		}
	}

	// 启动应用
	window.ghcmInstance = new GitHubCollapseMarkdown();

})();
