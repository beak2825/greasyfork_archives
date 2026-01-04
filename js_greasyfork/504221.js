// ==UserScript==
// @name         巴哈圖片預覽
// @description  pixiv/twitter網址開圖
// @namespace    https://smilin.net
// @author       smilin
// @version      0.01
// @license MIT
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=a33073307
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @icon         https://forum.gamer.com.tw/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      pixiv.net
// @connect      www.pixiv.net
// @connect      i.pximg.net
// @connect      twitter.com
// @connect      x.com
// @connect      api.fxtwitter.com
// @downloadURL https://update.greasyfork.org/scripts/504221/%E5%B7%B4%E5%93%88%E5%9C%96%E7%89%87%E9%A0%90%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/504221/%E5%B7%B4%E5%93%88%E5%9C%96%E7%89%87%E9%A0%90%E8%A6%BD.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const SCRIPT_NAME = "bahamut-pic-preview";

	//#region  注入 CSS 樣式
	GM_addStyle(`
		.bpp-settings {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: var(--f1-bg);
			border: 1px solid #ccc;
			border-radius: 4px;
			padding: 10px;
			width: 200px;
			box-shadow: 0 2px 5px var(--secondary-text);
			z-index: 1000;
			display: none;
        	opacity: 0;
			animation: fadeIn 0.3s ease-out forwards;
		}
		.bpp-settings.active {
			display: block;
			opacity: 1;
		}
		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: translate(-50%, -60%);
			}
			to {
				opacity: 1;
				transform: translate(-50%, -50%);
			}
		}
		.bpp-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 999;
			display: none;
		}
		.bpp-overlay.active {
			display: block;
		}
		.bpp-option {
			margin-bottom: 8px;
		}
		.bpp-option label {
			display: flex;
			align-items: center;
			font-size: 14px;
		}
		.bpp-option input[type="checkbox"] {
			margin-right: 8px;
		}
        .bpp-photo-box {
            margin: 15px 0;
			border: 1px solid var(--quaternary-text);
            border-radius: 4px;
            padding: 10px;
			background-color: var(--b1-bg);
        }
        .bpp-photo-container {
            position: relative;
            width: 100%;
            height: 400px;
            overflow: hidden;
        }
        .bpp-photo {
            width: 100%;
            height: 100%;
            object-fit: contain;
			cursor: pointer;
			transition: opacity 0.3s ease;
        }
		.bpp-photo:hover {
			opacity: 0.8;
		}
        .bpp-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
			display: flex;
			align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 15px;
            cursor: pointer;
			transition: transform 0.3s ease;
			font-weight: 800;
        }
		.bpp-nav:hover {
			transform: translateY(-50%) scale(1.1);
		}
        .bpp-nav-left { left: 0px; }
        .bpp-nav-right { right: 0px; }
        .bpp-info {
            display: flex;
            justify-content: space-between;
			margin-top: 10px;
            padding-top: 10px;
			border-top: 1px solid var(--quaternary-text);
        }
        .bpp-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .bpp-fullscreen-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        .bpp-close-fullscreen {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }
    `);
	//#endregion

	//#region  獲取與保存設置
	// 設置默認配置
	const defaultSettings = {
		enabled: true,
		showNSFW: false,
	};

	// 從 localStorage 中獲取設置
	function getSettings() {
		const storedSettings = localStorage.getItem(SCRIPT_NAME);
		return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
	}

	// 將設置保存到 localStorage
	function saveSettings(settings) {
		localStorage.setItem(SCRIPT_NAME, JSON.stringify(settings));
	}

	let settings = getSettings();
	//#endregion

	//#region  創建控制按鈕和設置面板
	function createUI() {
		const maxAttempts = 10; // 最大嘗試次數
		const delayBetweenAttempts = 500; // 每次嘗試之間的延遲（毫秒）
		let attempts = 0;

		function attemptCreate() {
			const navbar = document.querySelector(
				".BH-menu.box-shadow__soft .BH-menuE"
			);
			if (navbar) {
				// Navbar 已找到，執行創建 UI 的邏輯
				const containerLi = document.createElement("li");
				containerLi.innerHTML = `
					<a href="javascript:void(0)" id="bpp-toggle">圖片預覽設置</a>
				`;
				navbar.appendChild(containerLi);

				// 創建設置面板和遮罩
				const settingsPanel = document.createElement("div");
				settingsPanel.className = "bpp-settings";
				settingsPanel.id = "bpp-settings";
				settingsPanel.innerHTML = `
					<div class="bpp-option">
						<label>
							<input type="checkbox" id="bpp-enable" ${settings.enabled ? "checked" : ""}>
							啟用功能
						</label>
					</div>
					<div class="bpp-option">
						<label>
							<input type="checkbox" id="bpp-nsfw" ${settings.showNSFW ? "checked" : ""}>
							顯示限制級內容
						</label>
					</div>
				`;
				document.body.appendChild(settingsPanel);

				const overlay = document.createElement("div");
				overlay.className = "bpp-overlay";
				document.body.appendChild(overlay);

				// 添加事件監聽器
				document
					.getElementById("bpp-toggle")
					.addEventListener("click", toggleSettings);
				document
					.getElementById("bpp-enable")
					.addEventListener("change", updateSettings);
				document
					.getElementById("bpp-nsfw")
					.addEventListener("change", updateSettings);

				// 點擊遮罩關閉設置面板
				overlay.addEventListener("click", closeSettings);

				console.log("圖片預覽設置 UI 已成功創建");
			} else {
				// Navbar 未找到，如果未達到最大嘗試次數，則再次嘗試
				attempts++;
				if (attempts < maxAttempts) {
					setTimeout(attemptCreate, delayBetweenAttempts);
				} else {
					console.log("無法找到 navbar，圖片預覽設置 UI 創建失敗");
				}
			}
		}

		// 開始第一次嘗試
		attemptCreate();
	}

	// 切換設置面板顯示
	function toggleSettings(event) {
		event.preventDefault();
		event.stopPropagation();
		const settingsPanel = document.getElementById("bpp-settings");
		const overlay = document.querySelector(".bpp-overlay");
		settingsPanel.classList.toggle("active");
		overlay.classList.toggle("active");
	}

	// 關閉設置面板
	function closeSettings() {
		const settingsPanel = document.getElementById("bpp-settings");
		const overlay = document.querySelector(".bpp-overlay");
		settingsPanel.classList.remove("active");
		overlay.classList.remove("active");
	}

	// 更新設置
	function updateSettings() {
		settings.enabled = document.getElementById("bpp-enable").checked;
		settings.showNSFW = document.getElementById("bpp-nsfw").checked;
		saveSettings(settings);
	}
	//#endregion

	//#region 照片盒子
	function createPhotoBox(imagesData) {
		const photoBox = document.createElement("div");
		photoBox.className = "bpp-photo-box";

		console.log("ssss", imagesData);

		let currentIndex = 0;
		const totalImages = imagesData.reduce(
			(sum, data) => sum + data.urls.length,
			0
		);

		const createPhotoContainer = () => {
			const currentData = imagesData.find((data, index) => {
				const prevCount = imagesData
					.slice(0, index)
					.reduce((sum, d) => sum + d.urls.length, 0);
				return (
					currentIndex >= prevCount &&
					currentIndex < prevCount + data.urls.length
				);
			});
			const currentImageIndex =
				currentIndex -
				imagesData
					.slice(0, imagesData.indexOf(currentData))
					.reduce((sum, d) => sum + d.urls.length, 0);

			return `
            <div class="bpp-photo-container">
                <img class="bpp-photo" src="${currentData.urls[currentImageIndex]}" alt="Preview">
                <div class="bpp-source-tag">${currentData.name}</div>
                <div class="bpp-nav bpp-nav-left">❮</div>
                <div class="bpp-nav bpp-nav-right">❯</div>
            </div>
        `;
		};

		const createInfoPanel = () => {
			const currentData = imagesData.find((data, index) => {
				const prevCount = imagesData
					.slice(0, index)
					.reduce((sum, d) => sum + d.urls.length, 0);
				return (
					currentIndex >= prevCount &&
					currentIndex < prevCount + data.urls.length
				);
			});
			const currentImageIndex =
				currentIndex -
				imagesData
					.slice(0, imagesData.indexOf(currentData))
					.reduce((sum, d) => sum + d.urls.length, 0);

			return `
            <div class="bpp-info">
                <span>${currentIndex + 1} / ${totalImages} - 標題: ${
				currentData.title
			}</span>
                <span>作者: <a href="${
									currentData.authorUrl
								}" target="_blank">${currentData.author}</a></span>
                <a href="${currentData.sourceUrl}" target="_blank">在 ${
				currentData.name
			} 上查看</a>
            </div>
        `;
		};

		const updatePhotoBox = () => {
			photoBox.innerHTML = createPhotoContainer() + createInfoPanel();
			setupNavigation();
		};

		const setupNavigation = () => {
			photoBox.querySelector(".bpp-nav-left").addEventListener("click", () => {
				currentIndex = (currentIndex - 1 + totalImages) % totalImages;
				updatePhotoBox();
			});

			photoBox.querySelector(".bpp-nav-right").addEventListener("click", () => {
				currentIndex = (currentIndex + 1) % totalImages;
				updatePhotoBox();
			});

			photoBox.querySelector(".bpp-photo").addEventListener("click", () => {
				const currentData = imagesData.find((data, index) => {
					const prevCount = imagesData
						.slice(0, index)
						.reduce((sum, d) => sum + d.urls.length, 0);
					return (
						currentIndex >= prevCount &&
						currentIndex < prevCount + data.urls.length
					);
				});
				const currentImageIndex =
					currentIndex -
					imagesData
						.slice(0, imagesData.indexOf(currentData))
						.reduce((sum, d) => sum + d.urls.length, 0);
				openFullscreen(currentData.urls[currentImageIndex]);
			});
		};

		updatePhotoBox();

		return photoBox;
	}

	function openFullscreen(imageUrl) {
		const fullscreen = document.createElement("div");
		fullscreen.className = "bpp-fullscreen";
		fullscreen.innerHTML = `
            <img class="bpp-fullscreen-image" src="${imageUrl}" alt="Fullscreen">
            <div class="bpp-close-fullscreen">×</div>
        `;

		fullscreen
			.querySelector(".bpp-close-fullscreen")
			.addEventListener("click", () => {
				document.body.removeChild(fullscreen);
			});

		document.body.appendChild(fullscreen);
	}
	//#endregion

	//#region handlers
	const siteHandlers = [
		{
			name: "pixiv",
			enabled: true,
			selector: 'a[href*="ref.gamer.com.tw/redir.php"]',
			extractId: (url) => {
				const decodedUrl = decodeURIComponent(url);
				const match = decodedUrl.match(/pixiv\.net\/artworks\/(\d+)/);
				return match ? match[1] : null;
			},
			fetchImage: (id) => {
				return new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: "GET",
						url: `https://www.pixiv.net/ajax/illust/${id}`,
						onload: function (response) {
							if (response.status === 200) {
								const data = JSON.parse(response.responseText);
								if (data.body) {
									const pageCount = data.body.pageCount || 1;
									const urls = [];
									for (let i = 0; i < pageCount; i++) {
										if (data.body.urls && data.body.urls.regular) {
											urls.push(
												data.body.urls.regular
													.replace("i.pximg.net", "pixiv.canaria.cc")
													.replace("_p0", `_p${i}`)
											);
										}
									}
									if (urls.length > 0) {
										resolve({
											name: "pixiv",
											urls: urls,
											sourceUrl: "https://www.pixiv.net/artworks/" + id,
											nsfw: data.body?.xRestrict > 0,
											title: data.body?.title,
											userId: data.body?.userId,
											author: data.body?.userName,
											authorUrl: `https://www.pixiv.net/users/${data.body?.userId}`,
										});
									} else {
										reject("Image URLs not found");
									}
								} else {
									reject("Invalid response data");
								}
							} else {
								reject("Failed to fetch image data");
							}
						},
						onerror: function (error) {
							reject(error);
						},
					});
				});
			},
		},
		{
			name: "twitter",
			enabled: true,
			selector: 'a[href*="ref.gamer.com.tw/redir.php"]',
			extractId: (url) => {
				const decodedUrl = decodeURIComponent(url);
				const match = decodedUrl.match(
					/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
				);
				return match ? match[1] : null;
			},
			fetchImage: (id) => {
				return new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: "GET",
						url: `https://api.fxtwitter.com/i/status/${id}`,
						onload: function (response) {
							if (response.status === 200) {
								try {
									const data = JSON.parse(response.responseText);
									if (
										data.tweet &&
										data.tweet.media &&
										data.tweet.media.all.length > 0
									) {
										const imageUrls = data.tweet.media.all
											.filter((media) => media.type === "photo")
											.map((photo) => photo.url);

										if (imageUrls.length > 0) {
											resolve({
												name: "twitter",
												urls: imageUrls,
												sourceUrl: data.tweet.url,
												nsfw: data.tweet.possibly_sensitive,
												title: data.tweet.text,
												userId: data.tweet.author.screen_name,
												author: data.tweet.author.name,
												authorUrl: `https://x.com/${data.tweet.author.screen_name}`,
											});
										} else {
											reject("No photos found in tweet");
										}
									} else {
										reject("No media found in tweet");
									}
								} catch (error) {
									reject("Error parsing tweet data: " + error.message);
								}
							} else {
								reject("Failed to fetch tweet data");
							}
						},
						onerror: function (error) {
							reject(error);
						},
					});
				});
			},
		},
		// 可以在這裡添加其他站點的處理器...
	];
	//#endregion

	function processLinks() {
		if (!settings.enabled) return;
		const posts = document.querySelectorAll(".c-post__body");
		posts.forEach((post) => {
			const imageDataPromises = [];
			siteHandlers.forEach((handler) => {
				if (handler.enabled) {
					if (post.dataset.processed) return;
					const links = post.querySelectorAll(handler.selector);

					links.forEach((link) => {
						if (!link.closest(".bpp-photo-box") && !link.dataset.processed) {
							const id = handler.extractId(link.href);
							if (id) {
								imageDataPromises.push(
									handler
										.fetchImage(id)
										.then((data) => {
											link.dataset.processed = "true";
											return data;
										})
										.catch((error) => {
											console.error(
												`Error fetching ${handler.name} image:`,
												error
											);
											return null;
										})
								);
							}
						}
					});
				}
			});
			if (imageDataPromises.length > 0) {
				Promise.all(imageDataPromises).then((imagesData) => {
					const validImagesData = imagesData.filter(
						(data) =>
							data !== null && (!data.nsfw || (data.nsfw && settings.showNSFW))
					);
					if (validImagesData.length > 0) {
						const photoBoxId = `bpp-photo-box-${
							post.id || Math.random().toString(36).substr(2, 9)
						}`;
						if (!post.querySelector(`#${photoBoxId}`)) {
							const photoBox = createPhotoBox(validImagesData);
							const buttonBar = post.querySelector(".c-post__body__buttonbar");
							if (buttonBar) {
								buttonBar.parentNode.insertBefore(photoBox, buttonBar);
							}
						}
					}
					post.dataset.processed = "true";
				});
			} else {
				// 如果沒有需要處理的鏈接，也標記這個 post 為已處理
				post.dataset.processed = "true";
			}
		});
	}
	// 初始化
	createUI();
	processLinks();

	// 使用防抖函數來限制 processLinks 的調用頻率
	function debounce(func, wait) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	// 監聽頁面變化
	const debouncedProcessLinks = debounce(processLinks, 1000);
	const observer = new MutationObserver(debouncedProcessLinks);
	observer.observe(document.body, { childList: true, subtree: true });
})();
