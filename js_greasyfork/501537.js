// ==UserScript==
// @name         Pornhub 助手
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAABorAAACAwAAwP8AAG+5AAA0VgAAUYkAAInkAAA/aQAAMFEAAJf/AABZlAAAmv8AAGSnAAAaLAAAERwAAKP/AABHZAAABAcAAC0xAACp/wAArP8AALL/AABDcAAAbowAAI/uAAAKEAAAht4AALv/AAAtSwAAiOEAAI3sAACV/wAAmP8AAJv/AAABAQAAnv8AAHrHAABlpwAA//8AAND/AACh/wAAiOIAAC9PAABqsgAApP8AAEVkAABJegAAp/8AADFSAACq/wAAGSoAAAECAACt/wAAM1UAAIjjAAA+aAAAfcgAALb/AAAdMAAAT4MAADpjAABAawAAuf8AAAsQAAC//wAAAAYAAML/AAADBgAACQ4AAMX/AACW/wAAmf8AADdcAACc/wAAn/8AABAcAABRhwAAov8AAIXdAADX/wAAqP8AAKv/AACQ8AAAWI0AAC5NAACx/wAAIEMAALT/AACF3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISAxISEhISCIiSEgMIkhICkpWLSBIIUg1MEcgEDUiCk4ZCAQUSCQiMTwUNQ0xHxBSTwAvQ0sQSgAzWBw4AFkyUSoABjpOPykANihQCwA3UVEHAjRCRVQyD0wuETs0B1FRNyNVGAkAJh0CGkASAgdRUR4ALCdOAD0BVUFGTQA3UVIbAEQTAAA5AA4/Az4AWTJOUxcFV0klNSs8FDUNMR8QCkoWFhZYNSEVMEcgEDUiCkhIDAwMSEhIIiJISAwiSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @namespace    github.com/hmjz100
// @version      1.0.0
// @description  《也许同类型中最好用？》系列 - Pornhub 视频播放器替换 Artplayer，无视频广告，支持进度条热力图，显示视频多分辨率 m3u8/mp4 下载链接，可直接下载 免费/付费/禁下 的视频，并且过滤页面 iframe 广告。
// @author       hmjz100
// @license      AGPL-3.0-or-later
// @match        *://*.pornhub.org/*
// @match        *://*.pornhub.com/*
// @match        *://*.pornhubpremium.com/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_xmlHttpRequest
// @grant        GM.xmlHttpRequest
// @connect      pornhub.org
// @connect      pornhub.com
// @connect      pornhubpremium.com
// @connect      phncdn.com
// @require      https://unpkg.com/jquery@3.6.3/dist/jquery.min.js
// @require      https://unpkg.com/hls.js@1.6.7/dist/hls.min.js
// @require      https://unpkg.com/artplayer@5.2.3/dist/artplayer.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501537/Pornhub%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/501537/Pornhub%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function PornhubHelper() {
	// 严格模式，确保代码安全执行
	'use strict';

	// unsafeWindow 检测
	if (typeof unsafeWindow === 'undefined') {
		window.unsafeWindow = window;
	}

	/*
	防止代码因其他原因被执行多次
	代码出自 “Via 轻插件”，作者谷花泰
	*/
	const key = encodeURIComponent('Pornhub 助手:主代码');
	if (window[key]) return;
	window[key] = true;

	let temp = {
		doc: $(document),
		ins: 0,
		maxQuality: null,
		qualityMap: new Map(),
		promises: []
	}

	let base = {
		/**
		 * 可跨域 xmlhttpRequest 请求
		 * @author hmjz100
		 * @description 封装 `GreaseMonkey-Compatible_xmlhttpRequest` 实现的跨域请求，与原始函数参数相同
		 * @param {Object} option - 请求配置对象
		 * @returns {XMLHttpRequest} 请求对象实例
		 */
		xmlHttpRequest(option) {
			let request = (typeof GM_xmlhttpRequest !== "undefined") ? GM_xmlhttpRequest : GM.xmlHttpRequest;
			if (request && typeof request === 'function') {
				return request(option);
			}
		},
		/**
		 * 发送 GET 请求
		 * @author 油小猴
		 * @author hmjz100
		 * @description 支持进度监控、文件下载和自动重试，可处理被下载工具捕获特殊逻辑
		 * @param {string} url - 请求地址
		 * @param {Object} headers - 请求头配置
		 * @param {string} [type='json'] - 响应类型
		 * @param {Object} [extra] - 附加参数（需包含 `filename` 和 `index` 属性）
		 * @returns {Promise} 包含响应数据的 `Promise` 对象
		 */
		get(url, headers, type, extra) {
			let newHeaders = {};
			for (let key in headers) {
				newHeaders[key.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')] = headers[key];
			}
			headers = { "User-Agent": navigator.userAgent, "Origin": location.origin, "Referer": `${location.origin}/`, "Cookie": document.cookie, "DNT": "1", ...newHeaders };
			return new Promise((resolve, reject) => {
				let sendRequest = () => {
					let requestObj = base.xmlHttpRequest({
						method: "GET", url, headers,
						responseType: type || 'json',
						onload: function (res) {
							if (res.status === 204) {
								console.log('【Pornhub 助手】Get(load)\n\x1B[31m该请求已被某个下载工具捕获。' + (res.statusText ? ("\n\x1B[0m工具提示：\x1B[31m" + res.statusText) : "") + '\x1B[0m\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								requestObj.abort();
								temp.idm[extra.index] = true;
								return;
							}
							if (type === 'blob') {
								console.log('【Pornhub 助手】Get(load) Blob\n请求地址：' + url, '\n请求结果：', res);
								res.status === 200 && base.blobDownload(res.response, extra.filename);
								resolve(res);
							} else {
								console.log('【Pornhub 助手】Get(load)\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								resolve(res.response || res.responseText);
							}
						},
						onprogress: function (res) {
							if (res.status === 204) {
								console.log('【Pornhub 助手】Get(progress)\n\x1B[31m该请求已被某个下载工具捕获。' + (res.statusText ? ("\n\x1B[0m工具提示：\x1B[31m" + res.statusText) : "") + '\x1B[0m\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								requestObj.abort();
								temp.idm[extra.index] = true;
								return;
							}
							if (extra && extra.filename && extra.index) {
								res.total > 0 ? temp.progress[extra.index] = (res.loaded * 100 / res.total) : temp.progress[extra.index] = 0.00;
							}
						},
						onloadstart(res) {
							if (res.status === 204) {
								console.log('【Pornhub 助手】Get(start)\n\x1B[31m该请求已被某个下载工具捕获。' + (res.statusText ? ("\n\x1B[0m工具提示：\x1B[31m" + res.statusText) : "") + '\x1B[0m\n请求地址：' + url + '\n请求头部：', headers, '\n请求结果：', res);
								requestObj.abort();
								temp.idm[extra.index] = true;
								return;
							}
							console.log('【Pornhub 助手】Get(start)\n请求地址：' + url + '\n请求头部：', headers);
							if (extra && extra.filename && extra.index) temp.request[extra.index] = requestObj;
						},
						onerror: async function (err) {
							console.error('【Pornhub 助手】Get(error)\n请求出现错误，可能是网络问题。', err);
							reject(err);
						},
					});
				};

				sendRequest(); // 初始请求
			});
		},
		/**
		 * 等待指定元素加载完成并执行回调
		 * @author hmjz100
		 * @description 监听 DOM 元素是否出现，若未出现则每隔一段时间重试，直到找到为止。
		 * 支持在 iframe 内部查找元素，适用于异步加载场景。
		 * @param {string} selectorElem - 要等待的目标元素选择器
		 * @param {Function} actionFunction - 找到元素后执行的回调函数，接收 jQuery 元素作为参数，返回 true 可以不再继续寻找
		 * @param {boolean} [bWaitOnce=false] - 是否只执行一次回调，默认为 false，如果不设置为 true 的话需要自行判断是否对元素进行操作
		 * @param {string} [iframeSelector] - 若目标元素位于 iframe 中，传入 iframe 的选择器
		 * @param {string} [controlKey] - 控制唯一性的键名，用于避免重复处理
		 */
		waitForKeyElements(selectorElem, actionFunction, bWaitOnce, iframeSelector, controlKey) {
			// 初始化管理器
			const manager = this.waitForKeyElements.manager || (
				this.waitForKeyElements.manager = {
					observers: new WeakMap(),
					tasks: new Map(),
					instanceCounter: 0
				}
			);

			const targetDoc = iframeSelector
				? $(iframeSelector).get(0)?.contentDocument
				: document;

			if (!targetDoc) return; // 无效文档直接返回

			// 生成唯一控制键
			controlKey = controlKey || `wkfe_${manager.instanceCounter++}`;

			// 清理重复任务
			const existingTask = manager.tasks.get(controlKey);
			if (existingTask) {
				existingTask.observer.disconnect();
				manager.tasks.delete(controlKey);
			}

			// 创建MutationObserver回调
			const processElements = () => {
				const elements = $(selectorElem, targetDoc);
				let foundActive = false;

				elements.each((i, el) => {
					const jEl = $(el);
					const isProcessed = jEl.data(controlKey);

					if (isProcessed) return true; // 跳过已处理元素

					const cancelAction = actionFunction(jEl);
					if (cancelAction) {
						foundActive = true;
					} else if (bWaitOnce) {
						jEl.data(controlKey, true); // 标记已处理
					}
				});

				// 一次性任务且找到有效元素时清理
				if (bWaitOnce && foundActive) {
					observer.disconnect();
					manager.tasks.delete(controlKey);
				}
			};

			// 创建Observer实例
			const observer = new MutationObserver(processElements);

			// 配置并启动观察
			observer.observe(targetDoc.documentElement, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true
			});

			// 注册任务
			manager.tasks.set(controlKey, {
				observer,
				targetDoc
			});

			// 立即执行初始检查
			processElements();
		},
		preparePlayer(flashvars) {
			let video = {
				id: new URL(flashvars.link_url).searchParams.get("viewkey"),
				title: flashvars.video_title,
				url: null,
				qualitys: {},
				title: flashvars.video_title,
				cover: flashvars.image_url,
				hotspots: flashvars.hotspots
			}

			flashvars.mediaDefinitions.forEach(item => {
				let format = item.format;
				let quality = Number(item.quality);
				let url = new URL(item.videoUrl);
				let hasMap = temp.qualityMap.has(quality);
				if (format === 'hls' && quality > 0 && !hasMap) temp.qualityMap.set(quality, { mp4: null, hls: url.href })
				else if (format === 'hls' && quality > 0 && hasMap) temp.qualityMap.get(quality).hls = url.href;

				if (format === 'mp4') {
					url.host = location.host;
					let promise = base.get(url.href).then(res => {
						res.forEach(item => {
							let format = item.format;
							let quality = Number(item.quality);
							let url = new URL(item.videoUrl);
							//url.host = 'dv1.phncdn.com';
							let hasMap = temp.qualityMap.has(quality);
							if (format === 'mp4' && quality > 0 && !hasMap) temp.qualityMap.set(quality, { mp4: url.href, hls: null })
							else if (format === 'mp4' && quality > 0 && hasMap) temp.qualityMap.get(quality).mp4 = url.href;
						});
					});
					temp.promises.push(promise);
				}
			});

			[...temp.qualityMap.keys()].sort((a, b) => b - a).forEach(quality => {
				video.qualitys[quality] = temp.qualityMap.get(quality);
				// 更新最高清晰度
				if (quality > temp.maxQuality) {
					temp.maxQuality = quality;
					video.url = video.qualitys[quality].hls || video.qualitys[quality].mp4;
				}
			});

			console.log(`【Pornhub 助手】Info\n视频信息：\n`, video, Object.keys(video.qualitys).map(Number).sort((a, b) => b - a).filter(q => video.qualitys[q].hls).map(q => ({ url: video.qualitys[q].hls, html: base.getQualityName(q), quality: q, default: q === temp.maxQuality })));

			base.waitForKeyElements("div.video-wrapper div#player", function (element) {
				let player = $('<div class="index-module_art-player" style="overflow: hidden; aspect-ratio: 16/9; border-radius: 10px;"></div>')
				element.after(player);
				element.fadeOut();
				base.artPlay(video.id, video.url, Object.keys(video.qualitys).map(Number).sort((a, b) => b - a).filter(q => video.qualitys[q].hls).map(q => ({ url: video.qualitys[q].hls, html: base.getQualityName(q), quality: q, default: q === temp.maxQuality })), video.cover, (art) => {
					art.controls.add({
						name: 'hideList',
						index: 50,
						position: 'right',
						html: '<i class="art-icon"><svg width="18" height="18" viewBox="0 0 1152 1024"><path fill="#fff" d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4a76.8 76.8 0 0 0 76.8 76.8h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zm-576"></path></svg></i>',
						tooltip: '宽屏模式',
						click: function () {
							if ($('#vpContentContainer .topSectionGrid').attr("style")) {
								$('#vpContentContainer .topSectionGrid').removeAttr("style");
								$('#vpContentContainer .sideColumn').removeAttr("style");
								$('.container.videoPageGrid').removeAttr("style");
							} else {
								$('#vpContentContainer .topSectionGrid').css({ "display": "block" });
								$('#vpContentContainer .sideColumn').css({ "display": "none" });
								$('.wrapper .container').css({ "max-width": "80%" });
							}
						}
					})
					art.on('fullscreen', () => {
						$('header').fadeToggle();
						$(art.controls.fullscreenWeb).toggle();
						$(art.controls.hideList).toggle();
					});
					art.on('fullscreenWeb', () => {
						$(art.controls.fullscreen).toggle();
						$(art.controls.hideList).toggle();
					});
					if (video.hotspots) base.addHeatMap(art, video.hotspots);
				});
				return true;
			}, true)
			base.waitForKeyElements("div.playerWrapper", function (element) {
				let player = $('<div class="index-module_art-player" style="overflow: hidden; aspect-ratio: 16/9; margin-top: 60px;"></div>')
				element.after(player);
				element.fadeOut();
				base.artPlay(video.id, video.url, Object.keys(video.qualitys).map(Number).sort((a, b) => b - a).filter(q => video.qualitys[q].hls).map(q => ({ url: video.qualitys[q].hls, html: base.getQualityName(q), quality: q, default: q === temp.maxQuality })), video.cover, (art) => {
					art.on('fullscreen', () => {
						$('header').fadeToggle();
						$(art.controls.fullscreenWeb).toggle();
						$(art.controls.hideList).toggle();
					});
					art.on('fullscreenWeb', () => {
						$(art.controls.fullscreen).toggle();
						$(art.controls.hideList).toggle();
					});
					if (video.hotspots) base.addHeatMap(art, video.hotspots);
				});
			}, true)

			base.waitForKeyElements("div.video-wrapper div.video-actions-container div.video-actions-tabs div.video-action-tab.about-tab,div.categoryTags div.tooltipWrapper", function (element) {
				let downloadContent = $(`<div class="helper"><ul class="links"></ul><li class="tips"><span>小贴士：MP4 总是提示 Unauthorized？复制 HLS 链接到猫抓插件（需单独安装）的 M3U8 解析器里再下载吧~</span></li></div>`);
				element.before(downloadContent);

				Object.keys(video.qualitys).map(Number).sort((a, b) => b - a).filter(q => video.qualitys[q].hls).map(q => ({ url: video.qualitys[q].hls, html: base.getQualityName(q), quality: q, default: q === temp.maxQuality })).forEach(item => {
					let downloadItem = $(`<li>
						<span class="name">HLS ${item.html}</span>
						<input class="link" value="${item.url}" />
						<span class="more"><a class="copy" href="javascript:void(0)" data-copy="${item.url}">复制</a></span>
					</li>`);
					downloadContent.find("ul").append(downloadItem);
				});
				Promise.all(temp.promises).then(() => {
					Object.keys(video.qualitys).map(Number).sort((a, b) => b - a).filter(q => video.qualitys[q].mp4).map(q => ({ url: video.qualitys[q].mp4, html: base.getQualityName(q), quality: q, default: q === temp.maxQuality })).forEach(item => {
						let downloadItem = $(`<li>
							<span class="name">MP4 ${item.html}</span>
							<input class="link" value="${item.url}" />
							<span class="more">
								<a class="download" href="${item.url}" target="_blank">直链</a>
								<a class="copy" href="javascript:void(0)" data-copy="${item.url}">复制</a>
							</span>
						</li>`);
						downloadContent.find("ul").append(downloadItem);
					});
				})
			}, true);
		},
		artPlay(id, url, urls, cover, actionFunction) {
			let options = {
				id: id,
				container: '.index-module_art-player',
				volume: 1,
				autoPlayback: true,
				theme: '#ff9000',
				customType: {
					m3u8: function (video, url, art) {
						if (Hls.isSupported()) {
							if (art.hls) art.hls.destroy();
							let hls = new Hls();
							hls.loadSource(url);
							hls.attachMedia(video);
							art.hls = hls;
							art.on('destroy', () => hls.destroy());
						} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
							video.src = url;
						} else {
							art.notice.show = '不支持的格式: m3u8';
						}
					},
				},
				controls: [
					{
						name: 'star',
						index: 21,
						position: 'right',
						html: '<i class="art-icon"><svg width="18" height="18" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg></i>',
						tooltip: '来点个 Star ？',
						click: function () {
							GM_openInTab('https://github.com/hmjz100/PornhubHelper', { active: true });
						},
					}
				],
				icons: {
					state: '<svg width="100" height="100" fill="none"><g opacity=".9"><path opacity=".5" d="M50 4.167C24.687 4.167 4.167 24.687 4.167 50c0 25.314 20.52 45.834 45.833 45.834 25.314 0 45.834-20.52 45.834-45.834 0-25.313-20.52-45.833-45.834-45.833Z" fill="#000"/><path d="M69.194 53.043 43.153 70.231a3.646 3.646 0 0 1-5.653-3.043V32.816a3.646 3.646 0 0 1 5.654-3.043l26.042 17.188c2.183 1.44 2.183 4.645 0 6.086-2.184 1.44 6.51-4.3-.002-.004Z" fill="#fff"/></g></svg>',
					indicator: '<img width="16" heigth="16" style="border-radius:50px" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAABorAAACAwAAwP8AAG+5AAA0VgAAUYkAAInkAAA/aQAAMFEAAJf/AABZlAAAmv8AAGSnAAAaLAAAERwAAKP/AABHZAAABAcAAC0xAACp/wAArP8AALL/AABDcAAAbowAAI/uAAAKEAAAht4AALv/AAAtSwAAiOEAAI3sAACV/wAAmP8AAJv/AAABAQAAnv8AAHrHAABlpwAA//8AAND/AACh/wAAiOIAAC9PAABqsgAApP8AAEVkAABJegAAp/8AADFSAACq/wAAGSoAAAECAACt/wAAM1UAAIjjAAA+aAAAfcgAALb/AAAdMAAAT4MAADpjAABAawAAuf8AAAsQAAC//wAAAAYAAML/AAADBgAACQ4AAMX/AACW/wAAmf8AADdcAACc/wAAn/8AABAcAABRhwAAov8AAIXdAADX/wAAqP8AAKv/AACQ8AAAWI0AAC5NAACx/wAAIEMAALT/AACF3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISAxISEhISCIiSEgMIkhICkpWLSBIIUg1MEcgEDUiCk4ZCAQUSCQiMTwUNQ0xHxBSTwAvQ0sQSgAzWBw4AFkyUSoABjpOPykANihQCwA3UVEHAjRCRVQyD0wuETs0B1FRNyNVGAkAJh0CGkASAgdRUR4ALCdOAD0BVUFGTQA3UVIbAEQTAAA5AA4/Az4AWTJOUxcFV0klNSs8FDUNMR8QCkoWFhZYNSEVMEcgEDUiCkhIDAwMSEhIIiJISAwiSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=">',
					play: '<svg width="13" height="13" viewBox="0 0 87.5 100"><path d="m0 0v100l87.5-50z"></path></svg>',
					pause: '<svg width="13" height="13" viewBox="0 0 81.75 100"><path d="m56.596 100v-100h25.154v100zm-56.596-100h25.154v100h-25.154z"></path></svg>',
					volume: '<svg width="18" height="18" viewBox="0 0 120 100" fill="none"><path d="m30 25 39.999-25v100l-39.999-25zm-30 50h20v-50h-20zm101.32-66.32-7.4851 7.485c9.2351 8.915 14.915 20.785 14.915 33.835s-5.6752 24.92-14.915 33.83l7.4899 7.49c11.525-10.765 18.676-25.275 18.676-41.32 0-16.046-7.1498-30.55-18.68-41.32zm-2.4453 41.32c0-10.42-4.5747-19.835-11.919-26.954l-7.5146 7.515c5.0547 5.245 8.1845 12.005 8.1845 19.44 0 7.44-3.1146 14.205-8.1697 19.456l7.515 7.5147c7.34-7.12 11.904-16.544 11.904-26.97z" stroke-width="1.1995"></path></svg>',
					volumeClose: '<svg width="18" height="18" viewBox="0 0 120 100" fill="none"><path d="m83.949 30.656v65.176l-42.579-20.834v-3.2712zm7.9837-25.393-7.1156-5.2669-15.84 17.697-27.608 15.637v15.192l-9.1933 10.267v-25.459h-18.387v41.668h3.8749l-17.664 19.734 7.1156 5.267z" stroke-width="1.0504"></path></svg>',
					setting: '<svg width="18" height="18" viewBox="0 0 97.3 100"><path d="m85.822 54.9c0.19964-1.6004 0.35-3.2002 0.35-4.9002s-0.15036-3.3-0.35-4.9l10.553-8.2497c0.95018-0.75 1.2004-2.1 0.60018-3.2l-10.003-17.3c-0.60018-1.1-1.9509-1.5-3.0515-1.1l-12.453 5c-2.601-2-5.4016-3.65-8.4525-4.9l-1.901-13.25c-0.14973-1.2-1.2004-2.1-2.4506-2.1h-20.006c-1.2504 0-2.3007 0.9-2.4508 2.1l-1.9006 13.25c-3.051 1.25-5.8518 2.95-8.4525 4.9l-12.453-5c-1.1503-0.45-2.4508 0-3.051 1.1l-10.003 17.3c-0.65022 1.1-0.35013 2.45 0.60018 3.2l10.553 8.2497c-0.20008 1.6-0.35013 3.25-0.35013 4.9 0 1.65 0.15005 3.2998 0.35013 4.9002l-10.553 8.2497c-0.95031 0.75032-1.2004 2.1-0.60018 3.2002l10.003 17.3c0.60018 1.0996 1.9506 1.5 3.051 1.0996l12.453-4.9996c2.6008 1.9996 5.4016 3.6499 8.4525 4.8998l1.9006 13.25c0.15004 1.2 1.2004 2.1 2.4508 2.1h20.006c1.2503 0 2.3009-0.9 2.4506-2.1l1.901-13.25c3.0508-1.2499 5.8515-2.9501 8.4525-4.8998l12.453 4.9996c1.1505 0.45032 2.4513 0 3.0515-1.0996l10.003-17.3c0.60018-1.1002 0.35-2.4499-0.60018-3.2002zm-37.161 12.6c-9.6528 0-17.505-7.8499-17.505-17.5 0-9.6499 7.8523-17.5 17.505-17.5 9.6528 0 17.505 7.8499 17.505 17.5 0 9.6506-7.8523 17.5-17.505 17.5z"></path></svg>',
				},
				setting: true,
				hotkey: true,
				flip: true,
				playbackRate: true,
				aspectRatio: true,
				miniProgressBar: true,
				fullscreen: true,
				fullscreenWeb: true,
				fastForward: true,
				autoOrientation: true,
				lock: true,
				moreVideoAttr: {
					'preload': 'none'
				},
			}
			if (cover) options.poster = cover;
			if (url) options.url = url;
			if (urls) options.plugins = [artplayPluginQuality(urls)];
			function artplayPluginQuality(option) {
				return art => {
					let storageQuality = art.storage.get('quality');
					if (storageQuality) {
						let quality = option.find(item => item.html === storageQuality);
						if (quality) {
							option.forEach(item => delete item.default);
							quality.default = true;
						} else if (!option.find(item => item.default)) {
							option[0].default = true;
						}
					}

					art.controls.add({
						name: 'quality',
						position: 'right',
						html: option.find(item => item.default).html,
						selector: option,
						style: { "margin-right": '10px' },
						onSelect: function (item) {
							art.switchQuality(item.url, item.html);
							art.storage.set('quality', item.html);
							return item.html
						},
					});

					if (storageQuality) {
						let quality = option.find(item => item.html === storageQuality);
						if (quality) {
							art.url = quality.url;
						} else {
							art.url = option[0].url;
						}
					} else {
						art.url = option[0].url;
					}
				}
			}

			var art = new Artplayer(options)
			art.on('fullscreen', () => {
				$('header').toggle();
				$(art.controls.goodRing).toggle();
				if (!$('body').hasClass('no-scroll')) {
					$('body').addClass('no-scroll');
				} else {
					$('body').removeClass('no-scroll');
				}
			});
			art.on('fullscreenWeb', () => {
				$('header').toggle();
				$(art.controls.goodRing).toggle();
				if (!$('body').hasClass('no-scroll')) {
					$('body').addClass('no-scroll');
				} else {
					$('body').removeClass('no-scroll');
				}
			});
			var contextmenuStyle = {
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"border-bottom": "none"
			}
			art.contextmenu.add({
				name: 'appTitle',
				index: 1,
				html: `<img width="16" heigth="16" src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAABorAAACAwAAwP8AAG+5AAA0VgAAUYkAAInkAAA/aQAAMFEAAJf/AABZlAAAmv8AAGSnAAAaLAAAERwAAKP/AABHZAAABAcAAC0xAACp/wAArP8AALL/AABDcAAAbowAAI/uAAAKEAAAht4AALv/AAAtSwAAiOEAAI3sAACV/wAAmP8AAJv/AAABAQAAnv8AAHrHAABlpwAA//8AAND/AACh/wAAiOIAAC9PAABqsgAApP8AAEVkAABJegAAp/8AADFSAACq/wAAGSoAAAECAACt/wAAM1UAAIjjAAA+aAAAfcgAALb/AAAdMAAAT4MAADpjAABAawAAuf8AAAsQAAC//wAAAAYAAML/AAADBgAACQ4AAMX/AACW/wAAmf8AADdcAACc/wAAn/8AABAcAABRhwAAov8AAIXdAADX/wAAqP8AAKv/AACQ8AAAWI0AAC5NAACx/wAAIEMAALT/AACF3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISAxISEhISCIiSEgMIkhICkpWLSBIIUg1MEcgEDUiCk4ZCAQUSCQiMTwUNQ0xHxBSTwAvQ0sQSgAzWBw4AFkyUSoABjpOPykANihQCwA3UVEHAjRCRVQyD0wuETs0B1FRNyNVGAkAJh0CGkASAgdRUR4ALCdOAD0BVUFGTQA3UVIbAEQTAAA5AA4/Az4AWTJOUxcFV0klNSs8FDUNMR8QCkoWFhZYNSEVMEcgEDUiCkhIDAwMSEhIIiJISAwiSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=">Pornhub 增强`,
				style: contextmenuStyle,
				click: function () {
					GM_openInTab('https://github.com/hmjz100/PornhubHelper', { active: true });
				},
			})
			art.contextmenu.update({
				name: 'version',
				index: 2,
				html: `<img width="15" heigth="15" src="https://artplayer.org/assets/img/logo.png"/>Artplayer Ultra ${Artplayer.version}`,
				click: function () {
					GM_openInTab('https://artplayer.org/', { active: true });
				},
				style: contextmenuStyle
			})
			art.contextmenu.update({
				name: 'info',
				index: 40,
				html: `${art.i18n.language["Video Info"]}`,
				style: contextmenuStyle
			})
			art.contextmenu.update({
				name: 'close',
				index: 50,
				html: `${art.i18n.language["Close"]}`,
				style: contextmenuStyle
			})
			unsafeWindow.art = art
			$(art.template.$container).find(".icon").removeClass("icon")
			actionFunction ? actionFunction(art) : ""
		},
		addHeatMap(art, hotspots) {
			function smoothData(data, windowSize) {
				var smoothed = [];
				for (let i = 0; i < data.length; i++) {
					let sum = 0;
					let count = 0;
					for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
						sum += data[j];
						count++;
					}
					smoothed.push(sum / count);
				}
				return smoothed;
			}

			// 应用平滑处理
			hotspots = smoothData(hotspots.slice(5), 2);

			// 使用新版本的控件系统实现随进度条效果
			const { query } = art.constructor.utils;
			art.controls.add({
				name: 'heatmap',
				position: 'top',
				html: '',
				style: {
					position: 'absolute',
					top: '-30px',
					left: '0px',
					right: '0px',
					height: '30px',
					width: '100%',
					pointerEvents: 'none',
				},
				mounted($heatmap) {
					let $start = null;
					let $stop = null;

					function update() {
						$heatmap.innerHTML = '';
						if (!art.duration || art.option.isLive) return;

						const svg = {
							w: $heatmap.offsetWidth,
							h: $heatmap.offsetHeight,
						};

						const options = {
							opacity: 0.2,
							minHeight: Math.floor(svg.h * 0.05),
						};

						// 使用点计算逻辑（确保平滑）
						let points = [];
						const svgWidth = svg.w;
						const svgHeight = svg.h;
						const max = Math.max(...hotspots);

						// 添加左下角作为起点
						points.push([0, svgHeight]);

						// 添加数据点
						hotspots.forEach((value, index) => {
							const x = (index / (hotspots.length - 1)) * svgWidth;
							const y = svgHeight - (value / max) * svgHeight;
							points.push([x, y]);
						});

						// 添加右下角作为终点
						points.push([svgWidth, svgHeight]);

						// 闭合路径
						points.push([0, svgHeight]);

						// 生成路径字符串
						let pathD = '';
						points.forEach((point, index) => {
							if (index === 0) {
								pathD += `M ${point[0]},${point[1]} `;
							} else {
								pathD += `L ${point[0]},${point[1]} `;
							}
						});
						pathD += 'Z';

						// 创建SVG
						$heatmap.innerHTML = `<svg viewBox="0 0 ${svg.w} ${svg.h}" preserveAspectRatio="none">
							<defs>
								<linearGradient id="heatmap-solids" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" />
									<stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" id="heatmap-start" />
									<stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
									<stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
								</linearGradient>
							</defs>
							<path fill="url(#heatmap-solids)" d="${pathD}"></path>
						</svg>`;

						$start = query('#heatmap-start', $heatmap);
						$stop = query('#heatmap-stop', $heatmap);

						if ($start && $stop) {
							$start.setAttribute('offset', `${art.played * 100}%`);
							$stop.setAttribute('offset', `${art.played * 100}%`);
						}
					}

					// 更新渐变位置
					art.on('video:timeupdate', () => {
						if ($start && $stop) {
							$start.setAttribute('offset', `${art.played * 100}%`);
							$stop.setAttribute('offset', `${art.played * 100}%`);
						}
					});

					art.on('setBar', (type, percentage) => {
						if ($start && $stop && type === 'played') {
							$start.setAttribute('offset', `${percentage * 100}%`);
							$stop.setAttribute('offset', `${percentage * 100}%`);
						}
					});

					// 初始化和响应式更新
					art.on('ready', () => update());
					art.on('resize', () => update());
					art.on('setBar', () => update());
					update();
				},
			});
		},
		/**
		 * 根据垂直分辨率返回视频质量的标准命名
		 * @param {number} quality 视频的垂直分辨率（像素高度）
		 * @returns {string} 标准分辨率命名
		 */
		getQualityName(quality) {
			if (typeof (quality) !== "number") quality = Number(quality);
			if (quality <= 144) return '144P 低清';
			if (quality <= 240) return '240P 低清';
			if (quality <= 360) return '360P 低清'; // 低清 - Low Definition
			if (quality <= 480) return '480P 标清'; // 标清 - Standard Definition
			if (quality <= 540) return '540P 半高清'; // 半高清 - Extended Definition
			if (quality <= 720) return '720P 高清'; // 高清 - High Definition
			if (quality <= 1080) return '1080P 全高清'; // 全高清 - Full High Definition
			if (quality < 1440) return '~2K 高清';
			if (quality === 1440) return '2K 高清'; // 2K 高清 - Quad High Definition
			if (quality < 1600) return '~2.5K 高清';
			if (quality === 1600) return '2.5K 高清';
			if (quality < 2160) return '~4K 超高清';
			if (quality === 2160) return '4K 超高清'; // 超高清 - Ultra High Definition
			if (quality < 4320) return '~8K 超高清';
			if (quality === 4320) return '8K 超高清'; // 8K 超高清 - 8K Ultra High Definition
			return `${Math.round(quality / 1000)}K 超高清`;
		},
		greenPage() {
			// 页面样式
			base.waitForKeyElements("head", (element) => {
				element.after(`<style>
					a, button, ul li, ui, label, input, select {
						transition: all 0.25s !important;
						-webkit-transition: all 0.25s !important;
					}
					.art-contextmenu svg, .art-contextmenu img {
						vertical-align: top;
						margin-right: 5px
					}
					.no-scroll {
						overflow: hidden !important;
					}
					div.helper {
						width: 100%;
						margin: 0 0 3%;
					}
					div.helper > ul.links > li {
						display: flex;
						gap: 1%;
						margin: 0 0 5px;
					}
					div.helper > ul.links > li > .link {
						border: 1px solid #767676;
						flex: 1;
					}
					/* Pornhub Modern Design */ html,body{background:#0e0e0e!important}.tab-menu-item{display:flex;align-items:center}.tab-menu-item{display:flex;align-items:center}.tab-menu-wrapper-cell:nth-child(n+2){background:red;display:none!important}.userActions{margin:0 0 0 16px!important}.userActions>.subscribeButton>button{min-width:0!important;line-height:40px!important;padding:0 16px!important;border:none!important;background-color:#ff9000!important;color:#fff!important;border-radius:32px!important;margin:0!important;font-weight:400!important}.userActions>.videoFanClubButton a{min-width:0!important;line-height:40px!important;padding:0 16px!important;border:none!important;background-color:#6b3d75!important;color:#fff!important;border-radius:32px!important;margin:0!important;font-weight:400!important}button>i.ph-icon-rss-feed{display:none}button>.buttonLabel{margin:0!important}.video-info-row.userRow{display:flex!important}.userAvatar>img{width:40px!important;height:40px!important}.categoriesWrapper>a.item{border-radius:32px!important}.title>span{font-weight:600;font-size:16px!important}#topRightProfileMenu{width:auto!important;display:flex!important}#headerSignupLink{display:none!important}#headerLoginLink{padding:8px 16px!important;border-radius:32px;border:1px solid rgba(255,255,255,.1)}#headerWrapper{background-color:#0f0f0f!important}.logoWrapper>a{padding:16px 14px 16px 16px}.logo img{min-height:auto!important;max-height:none!important;height:24px!important;width:auto}#searchBarContainer{height:32px!important;align-items:center;border-radius:48px!important}#searchInput{padding:0!important;border-radius:48px!important}.headerBtnsWrapper{display:none!important}#headerSearchWrapperFree{flex:0 1 578px}#searchBarContainer{padding:0 8px}#searchesWrapper{position:absolute;top:48px;margin:0!important}#header{grid-template-rows:56px!important}#headerContainer{display:flex!important;justify-content:space-between}#recommendedVideosVPage>.section_bar_sidebar{display:none}#hd-rightColVideoPage>div:not(#recommendedVideosVPage){display:none!important}.more_recommended_btn{border-radius:48px!important;width:100%;padding:8px 0}.phimage{border-radius:10px}.sectionWrapper{margin:20px 0}.rating-container{display:none}.cookiesBanner{display:none}#header{position:sticky;top:0}.networkBarWrapper{display:none}.title-container,.video-actions-container,.video-wrapper{background:0 0!important}.nestedBlock{padding-left:48px!important}#hd-leftColVideoPage{display:flex;flex-direction:column}#hd-leftColVideoPage>.video-wrapper{order:1}#hd-leftColVideoPage>#under-player-comments{order:2}#hd-leftColVideoPage>.relatedVideos{order:3}#hd-leftColVideoPage>#under-player-playlists{order:4}.title-container{padding:8px 0!important}.video-actions-menu{margin:0!important}.video-actions-container{padding:16px 0!important}.ratingInfo{display:flex;gap:8px;align-items:center}.views{padding-left:0!important}.commentLogMessage{display:none!important}.cmtHeader{gap:16px;padding:0!important}#cmtContent{padding:0!important}#cmtWrapper .taggablePlaceholder{border-radius:0 10px 10px!important;-moz-border-radius:0 10px 10px!important;-webkit-border-radius:0 10px 10px!important;-ms-border-radius:0 10px 10px!important;-o-border-radius:0 10px 10px!important}.abovePlayer,.favorites-message{display:none}.video-actions-menu>.reset{display:none}.video-actions-menu{display:flex;justify-content:space-between;align-items:center}#hd-rightColVideoPage.wide{margin-top:748px!important}
				</style>`);
			}, true)

			// 空白间距
			base.waitForKeyElements("li.emptyBlockSpace", (tag) => {
				if (tag.attr('removed')) return;
				tag.attr('removed', true);
				tag.fadeOut()
			}, true)

			// 顶栏广告
			base.waitForKeyElements("#headerUpgradePremiumBtn", (tag) => {
				if (tag.parent().attr('removed')) return;
				tag.parent().attr('removed', true);
				tag.parent().fadeOut()
			}, true)

			// 年龄认证
			base.waitForKeyElements('[id^="age-verification"]', (tag) => {
				if (tag.attr('removed')) return;
				tag.attr('removed', true);
				tag.fadeOut()
			}, true)

			// 页面 iframe 广告
			base.waitForKeyElements('iframe[allowtransparency][data-embeddedads][data-spot-id], ins[class*="adsby"]', (tag) => {
				function findParentWithClass(el) {
					if (el.length > 0) {
						if (el.parent().attr("class")) {
							if (el.parent().attr('removed') || el.parent().parent().parent().attr('removed')) return;
							if (el.parent().parent().parent().prop('tagName') === "LI") {
								el.parent().parent().parent().attr('removed', true);
								console.log(`【Pornhub 助手】AD\n`, el.parent().parent().parent().attr("class"), "有class且有li，隐藏！")
								el.parent().parent().parent().fadeOut();
							} else {
								if (el.parent().attr("id") && el.parent().attr("id").includes("playerDiv_")) return;
								el.parent().attr('removed', true);
								console.log(`【Pornhub 助手】AD\n`, el.parent().attr("class"), "有class，隐藏！")
								el.parent().fadeOut();
							}
						} else {
							console.log(`【Pornhub 助手】AD\n`, "没有class，继续查找...")
							findParentWithClass(el.parent());
						}
					}
				}
				findParentWithClass(tag);
			}, true)

			// 视频卡片广告
			base.waitForKeyElements('.bg-spice-badge', (tag) => {
				function findParentWithClass(el) {
					if (el.length > 0) {
						if (el.parent().prop('tagName') === "LI") {
							if (el.parent().attr('removed')) return;
							el.parent().attr('removed', true);
							console.log(`【Pornhub 助手】AD\n`, el.parent().attr("class"), "有li，隐藏！")
							el.parent().fadeOut();
						} else {
							console.log(`【Pornhub 助手】AD\n`, "没有class，继续查找...")
							findParentWithClass(el.parent());
						}
					}
				}
				findParentWithClass(tag);
			}, true)

			// 广告被屏蔽提示
			base.waitForKeyElements("body div.bottomNav, div#js-abContainterMain", (tag) => {
				tag.fadeOut()
			}, true)

			// 暂停原始播放器的播放，避免替换后没法暂停
			base.waitForKeyElements("div.mgp_videoWrapper video", function (video) {
				let ins = 0;
				let waitPause = setInterval(() => {
					if (video[0].readyState === 0) return;
					video[0].pause();
					if (ins++ >= 1000) clearInterval(waitPause);
				}, 100)
			}, true)

			temp.doc.on('click', '.helper .copy', function (e) {
				e.preventDefault();
				let element = $(this);
				GM_setClipboard(element.data('copy'));
				element.text("成功");
				setTimeout(() => element.text("复制"), 1000);
			});
		}
	}

	base.greenPage();

	let waitArt = setInterval(() => {
		if (typeof (Artplayer) === "undefined") return;
		Artplayer.LOG_VERSION = false;
		Artplayer.PLAYBACK_RATE = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];
		if (temp.ins++ >= 100) clearInterval(waitArt);
	}, 1)

	let waitForFlashvars = setInterval(async () => {
		let flashvars = {};
		for (let prop in unsafeWindow) {
			if (prop.startsWith('flashvars_')) {
				flashvars = unsafeWindow[prop];
				clearInterval(waitForFlashvars);
			} else continue;
		}
		if (!flashvars.length && !flashvars.mediaDefinitions) return;
		console.log(`【Pornhub 助手】Info\n页面信息：\n`, flashvars);
		base.preparePlayer(flashvars);
	}, 1)
})();