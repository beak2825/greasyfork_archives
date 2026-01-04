// ==UserScript==
// @name         MTean 苹果壳 - 图片预览
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  MT 增加开关选项和图片预览
// @author       Yo
// @match        http*://xp.m-team.io/*/*
// @match        http*://xp.m-team.io/*
// @match        http*://kp.m-team.cc/*/*
// @match        http*://kp.m-team.cc/*
// @match        http*://zp.m-team.io/*/*
// @match        http*://zp.m-team.io/*
// @match        http*://next.m-team.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.io
// @grant        GM_addStyle
// @connect      *
// @require      http://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490711/MTean%20%E8%8B%B9%E6%9E%9C%E5%A3%B3%20-%20%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/490711/MTean%20%E8%8B%B9%E6%9E%9C%E5%A3%B3%20-%20%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 定义 localStorage 的键名
	const STORAGE_KEY_HOVER = 'isHoverEnabled';
	const STORAGE_KEY_SEARCH_API = 'isSearchApiEnabled';
	const STORAGE_KEY_IGNORE_TIME = 'isIgnoreTimeEnabled';
	const STORAGE_KEY_PAGE_SIZE = 'pageSize';
	const STORAGE_KEY_PANEL_COLLAPSED = 'isPanelCollapsed';

	// 从 localStorage 中读取用户的选择，如果没有则使用默认值
	let isHoverEnabled = localStorage.getItem(STORAGE_KEY_HOVER) !== 'false'; // 默认值为 true
	let isSearchApiEnabled = localStorage.getItem(STORAGE_KEY_SEARCH_API) !== 'false'; // 默认值为 true
	let isIgnoreTimeEnabled = localStorage.getItem(STORAGE_KEY_IGNORE_TIME) === 'true'; // 默认值为 false
	let pageSize = localStorage.getItem(STORAGE_KEY_PAGE_SIZE) || '50'; // 默认值为 50
	let isPanelCollapsed = localStorage.getItem(STORAGE_KEY_PANEL_COLLAPSED) === 'true'; // 默认值为 false

	// 全局滚动监听器引用，用于管理事件监听器
	let globalScrollListener = null;

	// 处理接口数据的方法
	const _XMLHttpRequest = unsafeWindow.XMLHttpRequest;
	function newXHR() {
		const xhr = new _XMLHttpRequest();

		// 保存原始的 send 方法
		const originalSend = xhr.send;

		// 保存原始的 onreadystatechange
		const originalOnReadyStateChange = xhr.onreadystatechange;

		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					let response = this.response;
					let url = this.responseURL; // 使用 responseURL 替代 url
					if (url.indexOf('/api/torrent/search') !== -1 && response !== '') {
						try {
							const dataParse = JSON.parse(response);
							if (isSearchApiEnabled && Array.isArray(dataParse.data.data) && dataParse.data.data.length > 0) {

								let tempData;

								if (isIgnoreTimeEnabled) {
									// 忽略时间，全部按 sum 值降序排序
									tempData = dataParse.data.data.map(item => {
										let sum = 0;
										if (item.status) {
											const seeders = parseInt(item.status.seeders, 10) || 0;
											const leechers = parseInt(item.status.leechers, 10) || 0;
											sum = seeders + leechers;
										}
										return { ...item, sum };
									}).sort((a, b) => b.sum - a.sum);
								} else {
									// 原有逻辑：24小时内优先，然后按活跃度排序
									let now = new Date(); // 当前时间
									let previous24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 当前时间往前推24小时

									// 分离过去24小时内和非过去24小时的数据，并为每一项添加 sum 值
									let { within24HoursData, otherData } = dataParse.data.data.reduce((acc, item) => {
										let sum = 0;
										if (item.status) {
											// 修复：确保数据转换为数字类型
											const seeders = parseInt(item.status.seeders, 10) || 0;
											const leechers = parseInt(item.status.leechers, 10) || 0;
											sum = seeders + leechers;
										}

										// 判断是否在当前时间和过去24小时之间
										let createdDate = new Date(item.createdDate);
										if (createdDate >= previous24Hours && createdDate <= now) {
											acc.within24HoursData.push({ ...item, sum });
										} else {
											acc.otherData.push({ ...item, sum });
										}
										return acc;
									}, { within24HoursData: [], otherData: [] });

									// 过去24小时内的数据按 createdDate 时间降序排序（最新的在前面）
									within24HoursData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

									// 其他数据按 sum 值降序排序（活跃度高的在前面）
									otherData.sort((a, b) => b.sum - a.sum);

									// 合并 24小时内的数据和其他数据
									tempData = [...within24HoursData, ...otherData];
								}

								const modifiedResponse = JSON.stringify({
									...dataParse,
									data: {
										...dataParse.data,
										data: tempData,
									}
								});
								Object.defineProperty(this, 'response', {
									get: function () {
										return modifiedResponse;
									}
								});
								Object.defineProperty(this, 'responseText', {
									get: function () {
										return modifiedResponse;
									}
								});
							}
						} catch (error) {
							console.error('Error parsing or modifying response:', error);
						}
					}
				}
				if (originalOnReadyStateChange) {
					originalOnReadyStateChange.apply(this, arguments);
				}
			}
		};

		// 重写 send 方法，处理每页条数
		xhr.send = function (data) {
			// 如果是搜索请求，修改每页条数
			if (this.responseURL && this.responseURL.indexOf('/api/torrent/search') !== -1) {
				try {
					if (data && typeof data === 'string') {
						const requestData = JSON.parse(data);
						// 修改每页条数
						if (requestData && typeof requestData === 'object') {
							requestData.pageSize = parseInt(pageSize, 10);
							data = JSON.stringify(requestData);
						}
					}
				} catch (error) {
					console.error('Error modifying request data:', error);
				}
			}
			return originalSend.call(this, data);
		};

		// 添加辅助方法来获取请求头
		xhr.getRequestHeader = function (name) {
			return this.requestHeaders ? this.requestHeaders[name] : null;
		};

		// 重写 setRequestHeader 方法
		const originalSetRequestHeader = xhr.setRequestHeader;
		xhr.requestHeaders = {};
		xhr.setRequestHeader = function (name, value) {
			this.requestHeaders[name] = value;
			return originalSetRequestHeader.apply(this, arguments);
		};

		return xhr;
	}

	// 替换为新的 XMLHttpRequest
	unsafeWindow.XMLHttpRequest = newXHR;

	// 创建控制面板
	function createControlPanel() {
		const panel = document.createElement('div');
		panel.style.position = 'fixed';
		panel.style.top = '10px';
		panel.style.right = '10px';
		panel.style.zIndex = '10000';
		panel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
		panel.style.borderRadius = '8px';
		panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
		panel.style.minWidth = '200px';
		panel.style.fontSize = '14px';
		panel.style.overflow = 'hidden';
		panel.style.transition = 'all 0.3s ease';

		// 标题栏（可点击收起/展开）
		const titleBar = document.createElement('div');
		titleBar.style.display = 'flex';
		titleBar.style.justifyContent = 'space-between';
		titleBar.style.alignItems = 'center';
		titleBar.style.padding = '12px 15px';
		titleBar.style.backgroundColor = '#f8f9fa';
		titleBar.style.borderBottom = '1px solid #e9ecef';
		titleBar.style.cursor = 'pointer';
		titleBar.style.userSelect = 'none';

		const title = document.createElement('div');
		title.style.fontWeight = 'bold';
		title.style.color = '#333';
		title.textContent = 'MTean 控制面板';

		const toggleIcon = document.createElement('div');
		toggleIcon.style.fontSize = '12px';
		toggleIcon.style.color = '#666';
		toggleIcon.style.transition = 'transform 0.3s ease';
		toggleIcon.textContent = isPanelCollapsed ? '▼' : '▲';

		titleBar.appendChild(title);
		titleBar.appendChild(toggleIcon);

		// 内容区域
		const content = document.createElement('div');
		content.style.padding = '15px';
		content.style.display = 'flex';
		content.style.flexDirection = 'column';
		content.style.gap = '12px';
		content.style.transition = 'all 0.3s ease';

		if (isPanelCollapsed) {
			content.style.height = '0';
			content.style.padding = '0 15px';
			content.style.overflow = 'hidden';
			toggleIcon.style.transform = 'rotate(180deg)';
		}

		// 收起/展开功能
		titleBar.addEventListener('click', () => {
			isPanelCollapsed = !isPanelCollapsed;
			localStorage.setItem(STORAGE_KEY_PANEL_COLLAPSED, isPanelCollapsed);

			if (isPanelCollapsed) {
				content.style.height = '0';
				content.style.padding = '0 15px';
				content.style.overflow = 'hidden';
				toggleIcon.style.transform = 'rotate(180deg)';
				toggleIcon.textContent = '▼';
			} else {
				content.style.height = 'auto';
				content.style.padding = '15px';
				content.style.overflow = 'visible';
				toggleIcon.style.transform = 'rotate(0deg)';
				toggleIcon.textContent = '▲';
			}
		});

		// 悬停显示图片开关
		const hoverLabel = document.createElement('label');
		hoverLabel.style.display = 'flex';
		hoverLabel.style.alignItems = 'center';
		hoverLabel.style.gap = '8px';
		hoverLabel.style.cursor = 'pointer';

		const hoverCheckbox = document.createElement('input');
		hoverCheckbox.type = 'checkbox';
		hoverCheckbox.checked = isHoverEnabled;
		hoverCheckbox.onchange = (e) => {
			isHoverEnabled = e.target.checked;
			localStorage.setItem(STORAGE_KEY_HOVER, isHoverEnabled);
			if (!isHoverEnabled) {
				clearDom();
			}
		};

		hoverLabel.appendChild(hoverCheckbox);
		hoverLabel.appendChild(document.createTextNode('开启悬停显示图片'));

		// 处理 /api/torrent/search 开关
		const searchApiLabel = document.createElement('label');
		searchApiLabel.style.display = 'flex';
		searchApiLabel.style.alignItems = 'center';
		searchApiLabel.style.gap = '8px';
		searchApiLabel.style.cursor = 'pointer';

		const searchApiCheckbox = document.createElement('input');
		searchApiCheckbox.type = 'checkbox';
		searchApiCheckbox.checked = isSearchApiEnabled;
		searchApiCheckbox.onchange = (e) => {
			isSearchApiEnabled = e.target.checked;
			localStorage.setItem(STORAGE_KEY_SEARCH_API, isSearchApiEnabled);
		};

		searchApiLabel.appendChild(searchApiCheckbox);
		searchApiLabel.appendChild(document.createTextNode('开启搜索数据处理'));

		// 忽略时间排序开关
		const ignoreTimeLabel = document.createElement('label');
		ignoreTimeLabel.style.display = 'flex';
		ignoreTimeLabel.style.alignItems = 'center';
		ignoreTimeLabel.style.gap = '8px';
		ignoreTimeLabel.style.cursor = 'pointer';

		const ignoreTimeCheckbox = document.createElement('input');
		ignoreTimeCheckbox.type = 'checkbox';
		ignoreTimeCheckbox.checked = isIgnoreTimeEnabled;
		ignoreTimeCheckbox.onchange = (e) => {
			isIgnoreTimeEnabled = e.target.checked;
			localStorage.setItem(STORAGE_KEY_IGNORE_TIME, isIgnoreTimeEnabled);
		};

		ignoreTimeLabel.appendChild(ignoreTimeCheckbox);
		ignoreTimeLabel.appendChild(document.createTextNode('忽略时间按活跃度排序'));

		// 每页条数选择
		const pageSizeContainer = document.createElement('div');
		pageSizeContainer.style.display = 'flex';
		pageSizeContainer.style.flexDirection = 'column';
		pageSizeContainer.style.gap = '6px';

		const pageSizeLabel = document.createElement('div');
		pageSizeLabel.style.color = '#666';
		pageSizeLabel.style.fontSize = '13px';
		pageSizeLabel.textContent = '每页条数:';

		const pageSizeSelect = document.createElement('select');
		pageSizeSelect.style.padding = '4px 8px';
		pageSizeSelect.style.borderRadius = '4px';
		pageSizeSelect.style.border = '1px solid #ddd';
		pageSizeSelect.style.fontSize = '14px';
		pageSizeSelect.style.cursor = 'pointer';

		const pageSizeOptions = [
			{ value: '50', text: '50 条/页' },
			{ value: '100', text: '100 条/页' },
			{ value: '200', text: '200 条/页' }
		];

		pageSizeOptions.forEach(option => {
			const optionElement = document.createElement('option');
			optionElement.value = option.value;
			optionElement.textContent = option.text;
			optionElement.selected = pageSize === option.value;
			pageSizeSelect.appendChild(optionElement);
		});

		pageSizeSelect.onchange = (e) => {
			pageSize = e.target.value;
			localStorage.setItem(STORAGE_KEY_PAGE_SIZE, pageSize);
		};

		pageSizeContainer.appendChild(pageSizeLabel);
		pageSizeContainer.appendChild(pageSizeSelect);

		// 将所有控件添加到内容区域
		content.appendChild(hoverLabel);
		content.appendChild(searchApiLabel);
		content.appendChild(ignoreTimeLabel);
		content.appendChild(pageSizeContainer);

		// 组装面板
		panel.appendChild(titleBar);
		panel.appendChild(content);
		document.body.appendChild(panel);
	}

	// 清除显示的图片
	function clearDom() {
		var elements = document.getElementsByClassName('imgdom');
		var elementsArray = Array.from(elements);
		elementsArray.forEach(function (element) {
			element.parentNode.removeChild(element);
		});
	}

	// 设置全局滚动监听器
	function setupScrollListener() {
		// 移除之前的滚动监听器（如果存在）
		if (globalScrollListener) {
			document.removeEventListener('scroll', globalScrollListener, true);
			window.removeEventListener('scroll', globalScrollListener, true);

			// 也尝试从可能的滚动容器中移除
			const appContent = document.getElementById('app-content');
			if (appContent) {
				appContent.removeEventListener('scroll', globalScrollListener);
			}
			const body = document.body;
			if (body) {
				body.removeEventListener('scroll', globalScrollListener);
			}
		}

		// 创建新的滚动监听器
		globalScrollListener = function(e) {
			console.log('滚动事件触发:', e.target); // 调试用
			clearDom();
		};

		// 在多个位置添加滚动监听器，确保能够捕获到滚动事件
		// 1. 使用捕获阶段监听 document 的滚动事件（这样能捕获所有子元素的滚动）
		document.addEventListener('scroll', globalScrollListener, true);

		// 2. 监听 window 的滚动事件
		window.addEventListener('scroll', globalScrollListener, true);

		// 3. 如果 app-content 存在，也监听它的滚动事件
		const appContent = document.getElementById('app-content');
		if (appContent) {
			appContent.addEventListener('scroll', globalScrollListener);
		}

		// 4. 监听 body 的滚动事件
		if (document.body) {
			document.body.addEventListener('scroll', globalScrollListener);
		}

		console.log('MTean脚本: 滚动监听器设置完成');
	}

	// 加载悬停显示图片功能
	function loadScript() {
		// 先清除之前的事件监听器，避免重复绑定
		const existingImages = document.querySelectorAll('.ant-image[data-mtean-loaded]');
		existingImages.forEach(img => {
			img.removeAttribute('data-mtean-loaded');
		});

		const hoverableImages = document.querySelectorAll('.ant-image');
		hoverableImages.forEach((image) => {
			// 避免重复绑定事件
			if (image.hasAttribute('data-mtean-loaded')) {
				return;
			}
			image.setAttribute('data-mtean-loaded', 'true');

			image.addEventListener('mouseover', (event) => {
				if (isHoverEnabled && event && event.target && event.target.previousElementSibling && event.target.previousElementSibling.src && event.target.previousElementSibling.src !== '') {
					clearDom();
					const div = document.createElement('div');
					div.classList.add('imgdom');
					let img = document.createElement('img');
					img.src = event.target.previousElementSibling.src;
					img.alt = '18x';
					img.style.cssText = 'width: 70%;object-position: center;object-fit: contain';
					img.id = 'imgProId';
					div.style.cssText = 'position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);max-width: 100%;z-index: 9999;';
					div.appendChild(img);
					document.body.appendChild(div);
				}
			});
		});

		// 每次 loadScript 时都重新设置滚动监听器
		setupScrollListener();

		console.log(`MTean脚本: 已为 ${hoverableImages.length} 个图片元素绑定悬停事件`);
	}

	// 初始化
	function init() {
		if (location.pathname.indexOf('/browse') !== -1) {
			// 使用多次尝试的方式确保页面内容加载完成
			let attempts = 0;
			const maxAttempts = 10;
			const checkInterval = 500; // 每500ms检查一次

			function tryLoadScript() {
				attempts++;
				const table = document.querySelector('table');
				const hoverableImages = document.querySelectorAll('.ant-image');

				if (table && hoverableImages.length > 0) {
					// 页面元素都存在，执行loadScript
					loadScript();
					console.log(`MTean脚本初始化成功，尝试次数: ${attempts}`);
					return true;
				} else if (attempts < maxAttempts) {
					// 继续尝试
					setTimeout(tryLoadScript, checkInterval);
					return false;
				} else {
					// 达到最大尝试次数，记录失败但不影响其他功能
					console.warn('MTean脚本: 初始化超时，某些功能可能不可用');
					// 即使图片元素不存在，也要设置滚动监听器
					setupScrollListener();
					return false;
				}
			}

			// 开始尝试
			tryLoadScript();
		}
	}

	// 监听DOM变化，用于检测分页等动态内容更新
	function observePageChanges() {
		const targetNode = document.getElementById('app-content') || document.body;

		const observer = new MutationObserver((mutations) => {
			let shouldReinit = false;

			mutations.forEach((mutation) => {
				// 检测是否有新的表格或图片元素添加
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							// 检查是否添加了表格或包含ant-image的元素
							if (node.querySelector && (
								node.querySelector('table') ||
								node.querySelector('.ant-image') ||
								node.tagName === 'TABLE' ||
								node.classList.contains('ant-image')
							)) {
								shouldReinit = true;
							}
						}
					});
				}
			});

			if (shouldReinit && location.pathname.indexOf('/browse') !== -1) {
				console.log('MTean脚本: 检测到页面内容变化，重新初始化...');
				// 延迟一点时间确保DOM完全更新
				setTimeout(() => {
					init();
				}, 200);
			}
		});

		observer.observe(targetNode, {
			childList: true,
			subtree: true
		});

		return observer;
	}

	// 监听页面变化
	let oldPushState = history.pushState;
	history.pushState = function () {
		setTimeout(() => {
			init();
		}, 500);
		return oldPushState.apply(history, arguments);
	};

	window.addEventListener('popstate', () => {
		setTimeout(() => {
			init();
		}, 500);
	});

	// 启动MutationObserver监听DOM变化
	let pageObserver = null;

	// 初始化控制面板和功能
	createControlPanel();
	init();

	// 启动页面变化监听
	if (location.pathname.indexOf('/browse') !== -1) {
		pageObserver = observePageChanges();
	}
})();