// ==UserScript==
// @name             		Magnet Copy & Preview
// @namespace        	    http://tampermonkey.net/
// @version          		2025.09.19
// @description      		Enhanced magnet link handling with copy, preview, and image URL features//Add buttons to copy magnet links and preview on magnet.pics, works on 1cili.com and other sites
// @author           		庄引
// @icon             		data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAwFBMVEX///8AAAD/XV2nxf//X1//YWGsy//k5ORlZWXx8fGoqKjIyMg4ODhtbW2pyP9ZWVlBQUGAgIC+vr5fX1+urq69RUUTExPq6ura2tqKioqRq910dHRPT0/4+PguLi63t7c3QVI9SFuVlZUmJiZGUmgbGxsXGyNYaIWgvfN7kbuKo9IOExxzh69jJSWenp5bIiJhc5Oz0/8tNUSVNDMlDg57REREGhrPTEw3FBTvV1ekNjbRhYX/oqN4LCyKMzPiU1PPfiQiAAACfElEQVRIiY2VC3eiMBCFcxUFxReCPKqoq7a17Wq3q6vW3W3//7/qTIKAEqpzDgcOfJnc3EwGIXRhWz66E+0nTVhAq0fXbbSDUUOIeIjRLXTAaWM5iX0D3kRfjGAKYcK5SYsp+mD+JjUzhEJMABHDugG3pQbbI1XNq0o8IeYkniIE4is0Od4ka+B6kyGuGmPBnTM/AsU4lO/i0t210BUNzi+C/sRUC6H5SnimRcLLCGY+0PPKaOVbw094hxRFZqkStNWTTZ5ztDEvk030YgGXn8LUEqVOT0/r9R/MhzkDhye+77Sj8JyuVom3zBwddoGA7sE9G5tNpWjJZ7RJ7lu80gavuEFjk/PSTuhq/S6Xm/ZW2eJK52OSJj2daeioK+xEbIPq2AXXG3rSiYdOIXeUeWJjzfXvB6LLBo9x1ykoycU5PsFj/Ts6FeNJMS0sme5oadNvZkt1aESAhVqnlgbXmzQyDl02coInVl5/1Jw0oj2uNzPbJgdLxjvwdXQ/qee0CFywls4zZlr6rP4pei8S/6mOc5Em/h7ZCek9JLhdoE9txsnV8UiJeYJ3SQ9Wqv6dfCseQtq4VJ/ydM145ZdntFjjWRo5hXlBVyrEt6PzNh/iV2LN+JImflX4KcCXu/r2G+NAvbFPdMXYFH4hkdzW+gJbagX9MPToEA0MRVf+9C5o2oaXDtO72v4g9xqr94Q+/r2EBR+mxzeiCal9DjabwbsSQoGhBqcSnkqaE1IkrFH5p+/XVBWHNOMpav9R1u/IuI80azLLKwqrzPKPsd3X0gFG5Zg2TH1EJOj4aRg1GrT/QGlTP0UwZA8Pu92W7+vvYRl25I7ht6x1WIp8AXxjKOd1DpCTAAAAAElFTkSuQmCC
// @match            		*://u3c3.com/*
// @match            		*://hjd2048.com/*
// @match            		*://*.cctv10.cc/*
// @match            		*://*.cctv12.cc/*
// @match            		*://*.1cili.com/!*
// @match            		*://sukebei.nyaa.si/*
// @match           		*://btdig.com/*
// @match            		*://whatslink.info*
// @match            		*://btsow.pics/*
// @match            		*://*.sis001.com/*
// @grant            		GM_setClipboard
// @grant           		GM_openInTab
// @grant           		GM_xmlhttpRequest
// @grant            		GM_addElement
// @grant            		GM_addStyle
// @run-at           		document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539216/Magnet%20Copy%20%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/539216/Magnet%20Copy%20%20Preview.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Debug flag to reduce noisy logs in production
	const DEBUG = false;

	// Schedule DOM writes safely to avoid ResizeObserver loops
	const schedule = (callback) => {
		return requestAnimationFrame(() => {
			try { callback(); } catch (error) { console.error(error); }
		});
	};

	/**
	* 创建并添加HTML元素到指定父节点
	* @param {string} tagName - HTML标签名称，默认为'button'
	* @param {string} innerHTML - 元素的内部HTML内容
	* @param {Object} options - 要应用到元素上的属性
	* @param {HTMLElement} parentNode - 父节点元素
	* @param {boolean} flag - 是否添加到父节点末尾，true使用append，false使用prepend
	*/
	const addElement = (tagName = `button`, innerHTML, options, parentNode, flag = true) => {
		if (!parentNode) {
			console.warn('addElement: parentNode is null or undefined');
			return;
		}

		const el = document.createElement(tagName);
		el.innerHTML = innerHTML;
		Object.assign(el, options);

		// 使用 requestAnimationFrame 来避免 ResizeObserver 循环问题
		schedule(() => {
			try {
				parentNode[flag ? 'prepend' : 'append'](el);
				if (DEBUG) console.log(parentNode);
			} catch (error) {
				console.error('addElement error:', error);
			}
		});
	};

	/**
	 * 监听并复制图片URL
	 * @param {string} parentDiv - 父元素选择器
	 * @param {string} targetNode - 图片元素选择器
	 * @param {string} attribute - 要监听的属性名
	 * @param {string} displayDiv - 显示元素选择器
	 * @returns {boolean} 是否成功设置监听
	 */
	const monitorAndCopyImageUrls = (parentDiv, targetNode, attribute, displayDiv) => {
		const searchDiv = document.querySelector(parentDiv);
		if (!searchDiv) {
			console.error(`找不到父元素: ${parentDiv}`);
			return false;
		}

		// 防抖函数，避免频繁更新
		let debounceTimer;
		const debounce = (fn, delay) => {
			return function (...args) {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => fn.apply(this, args), delay);
			};
		};

		// 处理图片URL的函数
		const processImages = () => {
			try {
				const images = document.querySelectorAll(targetNode);
				if (images.length === 0) {
					return;
				}

				// 收集所有图片URL
				const urls = Array.from(images).map((img) => img[attribute]);
				const displayElement = document.querySelector(displayDiv);
				if (!displayElement) {
					return;
				}

				// 使用 DocumentFragment 来批量操作 DOM，减少重排
				const fragment = document.createDocumentFragment();

				// 创建或更新显示区域
				let section = displayElement.querySelector('section');
				if (!section) {
					section = document.createElement("section");
					fragment.appendChild(section);
				}

				// 更新URL列表
				section.innerHTML = '';
				urls.forEach((url) => {
					const p = document.createElement("p");
					p.textContent = url;
					section.appendChild(p);
				});

				// 如果section是新创建的，添加到fragment
				if (!displayElement.querySelector('section')) {
					displayElement.appendChild(fragment);
				}

				// 添加或更新复制按钮
				let copyButton = displayElement.querySelector('.copy-urls-button');
				if (!copyButton) {
					// 使用 setTimeout 来延迟按钮创建，避免在 MutationObserver 回调中直接修改 DOM
					setTimeout(() => {
						addElement(
							'button',
							'复制所有URL',
							{
								className: 'copy-urls-button',
								onclick: (e) => {
									try {
										const currentImages = document.querySelectorAll(targetNode);
										const currentUrls = Array.from(currentImages).map((img) => img[attribute]);
										GM_setClipboard(currentUrls.join("\n"), "text");
										e.target.textContent = '已复制所有URL';
										setTimeout(() => {
											e.target.textContent = '复制所有URL';
										}, 3000);
									} catch (error) {
										console.error("复制到剪贴板时出错:", error);
										e.target.textContent = '复制失败';
										setTimeout(() => {
											e.target.textContent = '复制所有URL';
										}, 3000);
									}
								}
							},
							displayElement
						);
					}, 0);
				}
			} catch (error) {
				console.error("处理图片时出错:", error);
			}
		};

		// 使用防抖处理图片更新
		const debouncedProcessImages = debounce(processImages, 1000);

		// 创建MutationObserver监听DOM变化
		const observer = new MutationObserver((mutations) => {
			const hasRelevantChanges = mutations.some((mutation) => {
				return (
					(mutation.type === "attributes" &&
						mutation.attributeName === attribute) ||
					mutation.type === "childList"
				);
			});

			if (hasRelevantChanges) {
				// 使用 requestAnimationFrame 来避免 ResizeObserver 循环问题
				schedule(() => {
					debouncedProcessImages();
				});
			}
		});

		// 配置观察选项
		const config = {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [attribute],
		};

		// 开始观察
		observer.observe(searchDiv, config);

		// 初始处理
		processImages();

		return true;
	};



	// Function to extract hash from magnet URL
	function extractHashFromMagnet(magnetUrl) {
		const btihMatch = magnetUrl.match(/urn:btih:([a-zA-Z0-9]+)/i);
		if (btihMatch && btihMatch[1]) {
			return btihMatch[1].toLowerCase();
		}
		return '';
	}
	class Drawer {
		static instance = null;

		constructor(options = {}) {
			this.direction = options.direction || 'left';
			this.width = options.width || '300px';
			this.title = options.title || 'Drawer';
			this.init();
		}

		init() {
			// 如果存在之前的实例，先移除它
			if (Drawer.instance) {
				document.body.removeChild(Drawer.instance.drawer);
			}

			// Create drawer container
			this.drawer = document.createElement('div');
			this.drawer.style.cssText = `
                position: fixed;
                top: 0;
                ${this.direction}: 0;
                width: ${this.width};
                height: 100vh;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                transform: translateX(${this.direction === 'left' ? '-100%' : '100%'});
                transition: transform 0.3s ease;
                z-index: 1000;
            `;

			// Create header
			const header = document.createElement('div');
			header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-bottom: 1px solid #eee;
            `;

			// Create title
			const title = document.createElement('h5');
			title.textContent = this.title;
			title.style.margin = '0';

			// Create close button
			const closeBtn = document.createElement('button');
			closeBtn.textContent = '×';
			closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                color: #666;
            `;
			closeBtn.onclick = () => this.close();

			// Create content container
			this.content = document.createElement('div');
			this.content.style.cssText = `
                padding: 16px;
                height: calc(100vh - 60px);
                overflow-y: auto;
            `;

			// Assemble drawer
			header.appendChild(title);
			header.appendChild(closeBtn);
			this.drawer.appendChild(header);
			this.drawer.appendChild(this.content);
			document.body.appendChild(this.drawer);

			// 保存当前实例
			Drawer.instance = this;
		}

		open() {
			this.drawer.style.transform = 'translateX(0)';
		}

		close() {
			this.drawer.style.transform = `translateX(${this.direction === 'left' ? '-100%' : '100%'})`;
			// Clear content after animation completes
			setTimeout(() => {
				this.content.innerHTML = '';
			}, 300); // Match the transition duration
		}

		setContent(content) {
			this.content.innerHTML = content;
		}
	}

	// Usage example
	function openDrawer(url, title, width = '40vw', direction = 'right') {
		// 如果已经存在drawer实例，先清空内容
		const existingDrawer = document.querySelector('.drawer-container');
		if (existingDrawer) {
			const content = existingDrawer.querySelector('.drawer-content');
			if (content) {
				content.innerHTML = '';
			}
		}

		const drawer = new Drawer({
			direction: direction,
			width: `${width}`,
			title: `${title} `
		});
		drawer.setContent(`<iframe width='100%;' height='100%' src=${url}></iframe>`);
		drawer.open();
	}
	// Special handling for 1cili.com
	function handle1CiliSite() {
		const magnetBoxes = document.querySelectorAll('.magnet-box');

		if (magnetBoxes.length > 0) {
			// For each magnet box
			magnetBoxes.forEach(box => {
				const inputField = box.querySelector('#input-magnet');
				if (!inputField) return;

				const magnetUrl = inputField.value;
				const hash = extractHashFromMagnet(magnetUrl);

				if (!hash) return;

				// Get title from page
				const pageTitle = document.querySelector('.magnet-title')?.textContent || 'Magnet Preview';

				// Find the input-group-btn div where the existing buttons are
				const btnGroup = box.querySelector('.input-group-btn');

				if (btnGroup) {
					// 使用 requestAnimationFrame 来避免 ResizeObserver 循环问题
					requestAnimationFrame(() => {
						try {
							// Create a new preview button
							const previewBtn = document.createElement('a');
							previewBtn.className = 'btn preview-button-1cili';
							previewBtn.innerHTML = '<svg class="svg-icon"><use xlink:href="/assets/icons.svg#icon-search"></use></svg>';
							previewBtn.title = '预览 Preview';
							previewBtn.href = 'javascript:void(0);';

							// Add click event for preview
							previewBtn.addEventListener('click', function (e) {
								e.preventDefault();
								e.stopPropagation();

								// Open preview in side panel
								openDrawer(`https://magnet.pics/m/${hash}`, pageTitle);
							});

							// Add the button to the button group
							btnGroup.appendChild(previewBtn);
						} catch (error) {
							console.error('handle1CiliSite error:', error);
						}
					});
				}
			});
		}
	}

	/**
	 * 处理常规网站的磁力链接功能
	 * @param {string} datalist - 要处理的元素列表选择器
	 * @param {string} hash - 包含磁力链接hash的元素选择器
	 * @param {string} title - 标题元素选择器
	 * @param {string} size - 文件大小元素选择器
	 * @param {string} date - 日期元素选择器
	 * @param {string} magnet - 磁力链接元素选择器
	 * @param {boolean} flag - 是否将按钮添加到元素末尾，true使用append，false使用prepend
	 */
	const handleRegularSites = (datalist, hash, title, size, date, magnet, flag) => {
		if (DEBUG) console.log(datalist, hash, title, size, date, magnet, flag);
		if (DEBUG) console.log(document.querySelectorAll(datalist));
		//在磁力链接详情页面（.fa-magnet）也添加预览按钮
		if (/[0-9a-fA-F]{40}/.test(window.location.href)) {
			// 使用 requestAnimationFrame 来避免 ResizeObserver 循环问题
			schedule(() => {
				try {
					// 构建完整的磁力链接，包含标题、大小和日期信息
					const link = `magnet:?xt=urn:btih:${window.location.href.match(/[0-9a-fA-F]{40}/)[0].toLowerCase()}&dn=${document.querySelector('tbody > tr:nth-child(5) > td:nth-child(2)').innerText}🔞Size=${document.querySelector('tbody > tr:nth-child(6) > td:nth-child(2)').innerText}🔞Date=${document.querySelector(' tbody > tr:nth-child(7) > td:nth-child(2)').innerText}`;
					document.querySelector('tbody > tr:nth-child(4) > td:nth-child(2) > div > a').textContent = link;

					// 添加复制按钮（幂等）
					const detailContainer = document.querySelector('.fa-magnet');
					if (!detailContainer) return;
					if (!detailContainer.querySelector('.magnet-btn.copy-btn')) {
						addElement('a', '📋',
							{
								className: 'magnet-btn copy-btn',
								title: 'Copy Magnet Link',
								onclick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									GM_setClipboard(decodeURIComponent(link));
								},
							},
							detailContainer
						)
					}
					// 添加预览按钮（幂等）
					if (!detailContainer.querySelector('.magnet-btn.preview-btn')) {
						addElement('a', '👁️',
							{
								className: 'magnet-btn preview-btn',
								title: 'Preview on magnet.pics',
								onclick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									openDrawer(`https://magnet.pics/m/${window.location.href.match(/[0-9a-fA-F]{40}/)[0].toLowerCase()}`, document.querySelector('.fa-folder-open').innerText);
								},
							},
							detailContainer
						)
					}
				} catch (error) {
					console.error('磁力链接详情页面处理错误:', error);
				}
			});
		};
		// 遍历所有匹配的元素
		document.querySelectorAll(datalist).forEach((element, index) => {
			if (DEBUG) console.log(element);

			const hashElement = element.querySelector(hash);
			if (!hashElement) return;

			// 从链接中提取40位的磁力链接hash
			const hashMatch = hashElement.href.match(/[0-9a-fA-F]{40}/);
			if (!hashMatch) return;

			// 构建完整的磁力链接，包含标题、大小和日期信息
			const link = `magnet:?xt=urn:btih:${hashMatch[0].toLowerCase()}&dn=${element.querySelector(title).innerText}🔞Size=${element.querySelector(size).innerText}🔞Date=${element.querySelector(date).innerText}`;

			// 使用 schedule 来避免 ResizeObserver 循环问题
			schedule(() => {
				try {
					const magnetContainer = element.querySelector(magnet);
					if (!magnetContainer) return;
					magnetContainer.textContent = link;

					// 添加复制按钮（幂等）
					if (!magnetContainer.querySelector('.magnet-btn.copy-btn')) {
						addElement('a', '📋',
							{
								className: 'magnet-btn copy-btn',
								title: 'Copy Magnet Link',
								onclick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									GM_setClipboard(decodeURIComponent(link));
								},
							},
							magnetContainer
						)
					}

					// 添加预览按钮（幂等）
					if (!magnetContainer.querySelector('.magnet-btn.preview-btn')) {
						addElement('a', '👁️',
							{
								className: 'magnet-btn preview-btn',
								title: 'Preview on magnet.pics',
								onclick: (e) => {
									e.preventDefault();
									e.stopPropagation();
									openDrawer(`https://magnet.pics/m/${hashMatch[0].toLowerCase()}`, element.querySelector(title).innerText);
								},
							},
							magnetContainer
						)
					}
				} catch (error) {
					console.error('handleRegularSites error:', error);
				}
			});
		})
	}
	const isIncludes = (str) => window.location.hostname.includes(str);
	switch (true) {
		case isIncludes('1cili'):
			handle1CiliSite();
			break;
		case isIncludes('whatslink.info'):
			// 自定义样式和图片URL复制功能
			GM_addStyle(`.img {flex-shrink: 0;height: auto;width: auto;margin-right: 12px;}
        .banner-title,.banner,.disc,div.wrapper:nth-child(5), #app > div > div:nth-child(7),#app > div > div.footer {display:none}
        #app {max-width: 100vw !important; padding: 5px !important;}
        .content {padding: 5px !important;}
        .wrapper {margin: 0 !important;}
        .el-input-group {width: 100vw;}
        body {place-items: baseline !important;}`);
			monitorAndCopyImageUrls(
				"div.search",
				".image-list .img img",
				"src",
				"div.search"
			);
			break;
		case isIncludes('u3c3'):
		case isIncludes("sukebei.nyaa.si"):
			GM_addStyle(`/*u9a9*/
                .container .ad,.hdr-link,tr td:nth-child(1),tr td:nth-child(3),tr td:nth-child(6),tr td:nth-child(7),.text-center{display:none !important;}
                .table {width: 100%;}
                .torrent-list>tbody>tr>td { white-space: normal;}
                .torrent-list > tbody > tr > td {max-width:90vw;white-space: normal !important;}
                .data-list .row {padding: 0;}
                .navbar-form .input-group {position: fixed; left:0;width: 100vw;}`
			);
			handleRegularSites("tbody tr",
				"td:nth-child(3) a:last-child",
				"td:nth-child(2) a",
				"td:nth-child(4)",
				"td:nth-child(5)",
				"td:nth-child(2) a:last-child");
			break;
		case isIncludes('btdig.com'):
			// GM_addStyle(`center div div {width: 100vw;}`);
			handleRegularSites(
				".one_result > div",
				".torrent_name a",
				".torrent_name a",
				".torrent_size",
				".torrent_age",
				".torrent_magnet");
			break;
		case isIncludes('btsow.pics'):
			// GM_addStyle(`center div div {width: 100vw;}`);
			GM_addStyle(`/*btsow*/
                .search {position: sticky !important;top: 80px !important;}
                .form-inline .input-group {width: 100%;}
                .hidden-xs:not(.tags-box,.text-right,.search,.search-container),.data-list:not(.detail) .size,.data-list:not(.detail)  .date{ display: none !important;}`);

			// 为 btsow.pics 添加等待机制，确保内容加载完成
			const waitForBtsowContent = () => {
				const elements = document.querySelectorAll(".q-infinite-scroll .row");
				if (elements.length > 0) {
					console.log("btsow.pics 内容已加载，找到元素数量:", elements.length);
					// 使用 requestAnimationFrame 来避免 ResizeObserver 循环问题
					requestAnimationFrame(() => {
						handleRegularSites(
							".q-infinite-scroll .row",
							"a",
							"a",
							".size",
							".date",
							"a"
						);
					});
				} else {
					console.log("btsow.pics 内容未加载，等待中...");
					setTimeout(waitForBtsowContent, 3000); // 每2秒检查一次
				}
			};

			// 开始等待内容加载
			waitForBtsowContent();
			break;
		case isIncludes('hjd2048.com'):
		case isIncludes('cctv10.cc'):
		case isIncludes('cctv12.cc'):
			break;
		// case isIncludes('javdb'):
		// 	GM_addStyle(`.container:not(.is-max-desktop):not(.is-max-widescreen) {max-width: 100%;}
		//     .movie-list .item .video-title {white-space: normal;}`);
		// 	replaceImg();
		// 	break;
		// case isIncludes('javbus'):
		// 	GM_addStyle(`.masonry #waterfall {display: grid; grid-template-columns: repeat(auto-fill, minmax(465px, 1fr)); gap: 0px; padding: 0px;}
        //     .movie-box{width:465px !important;height:400px !important;margin:0 !important;}
        //     #waterfall .masonry-brick{position:relative !important; top: 0px !important;  left: 0 !important;margin:5px}
        //     .item-tag {display: inline-block;}.movie-box .photo-frame {height: auto !important;margin:0 !important;}.movie-box img {height: auto !important;}`);
		// 	break;
		default:
			GM_addStyle(`* {-webkit-touch-callout: text;-webkit-user-select: text !important;-moz-user-select: text;user-select: text;}`);;
	}

})();
