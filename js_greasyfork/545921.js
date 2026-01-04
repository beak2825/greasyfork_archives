// ==UserScript==
// @name         悬浮字幕面板(B站跟youtube)
// @namespace    http://tampermonkey.net/
// @version      20250904.1
// @description  在播放器左侧显示悬浮字幕面板，支持拖拽; 支持点击、左右键跳转；
// @author       atakhalo
// @match        *://*.bilibili.com/video/*
// @match        *://*.youtube.com/watch*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545921/%E6%82%AC%E6%B5%AE%E5%AD%97%E5%B9%95%E9%9D%A2%E6%9D%BF%28B%E7%AB%99%E8%B7%9Fyoutube%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545921/%E6%82%AC%E6%B5%AE%E5%AD%97%E5%B9%95%E9%9D%A2%E6%9D%BF%28B%E7%AB%99%E8%B7%9Fyoutube%29.meta.js
// ==/UserScript==

// https://unpkg.com/ajax-hook@latest/dist/ajaxhook.min.js
// 修改支持 unsafeWindow
!function (t, e) { for (var r in e) t[r] = e[r] }(unsafeWindow, function (t) { function e(n) { if (r[n]) return r[n].exports; var o = r[n] = { i: n, l: !1, exports: {} }; return t[n].call(o.exports, o, o.exports, e), o.l = !0, o.exports } var r = {}; return e.m = t, e.c = r, e.i = function (t) { return t }, e.d = function (t, r, n) { e.o(t, r) || Object.defineProperty(t, r, { configurable: !1, enumerable: !0, get: n }) }, e.n = function (t) { var r = t && t.__esModule ? function () { return t.default } : function () { return t }; return e.d(r, "a", r), r }, e.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, e.p = "", e(e.s = 3) }([function (t, e, r) { "use strict"; function n(t, e) { var r = {}; for (var n in t) r[n] = t[n]; return r.target = r.currentTarget = e, r } function o(t, e) { function r(e) { return function () { var r = this[u][e]; if (v) { var n = this.hasOwnProperty(e + "_") ? this[e + "_"] : r, o = (t[e] || {}).getter; return o && o(n, this) || n } return r } } function o(e) { return function (r) { var o = this[u]; if (v) { var i = this, s = t[e]; if ("on" === e.substring(0, 2)) i[e + "_"] = r, o[e] = function (s) { s = n(s, i), t[e] && t[e].call(i, o, s) || r.call(i, s) }; else { var a = (s || {}).setter; r = a && a(r, i) || r, this[e + "_"] = r; try { o[e] = r } catch (t) { } } } else o[e] = r } } function a(e) { return function () { var r = [].slice.call(arguments); if (t[e] && v) { var n = t[e].call(this, r, this[u]); if (n) return n } return this[u][e].apply(this[u], r) } } function c() { v = !1, e.XMLHttpRequest === h && (e.XMLHttpRequest = f, h.prototype.constructor = f, f = void 0) } e = e || unsafeWindow; var f = e.XMLHttpRequest, v = !0, h = function () { for (var t = new f, e = 0; e < s.length; ++e) { var n = "on" + s[e]; void 0 === t[n] && (t[n] = null) } for (var c in t) { var v = ""; try { v = i(t[c]) } catch (t) { } "function" === v ? this[c] = a(c) : c !== u && Object.defineProperty(this, c, { get: r(c), set: o(c), enumerable: !0 }) } var h = this; t.getProxy = function () { return h }, this[u] = t }; return h.prototype = f.prototype, h.prototype.constructor = h, e.XMLHttpRequest = h, Object.assign(e.XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 }), { originXhr: f, unHook: c } } Object.defineProperty(e, "__esModule", { value: !0 }); var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t }; e.configEvent = n, e.hook = o; var s = e.events = ["load", "loadend", "timeout", "error", "readystatechange", "abort"], u = "__origin_xhr" }, function (t, e, r) { "use strict"; function n(t, e) { return e = e || unsafeWindow, c(t, e) } function o(t) { return t.replace(/^\s+|\s+$/g, "") } function i(t) { return t.watcher || (t.watcher = document.createElement("a")) } function s(t, e) { var r = t.getProxy(), n = "on" + e + "_", o = (0, f.configEvent)({ type: e }, r); r[n] && r[n](o); var s; "function" == typeof Event ? s = new Event(e, { bubbles: !1 }) : (s = document.createEvent("Event"), s.initEvent(e, !1, !0)), i(t).dispatchEvent(s) } function u(t) { this.xhr = t, this.xhrProxy = t.getProxy() } function a(t) { function e(t) { u.call(this, t) } return e[x] = Object.create(u[x]), e[x].next = t, e } function c(t, e) { function r(t) { var e = t.responseType; if (!e || "text" === e) return t.responseText; var r = t.response; if ("json" === e && !r) try { return JSON.parse(t.responseText) } catch (t) { console.warn(t) } return r } function n(t, e) { var n = new b(t), i = { response: r(e), status: e.status, statusText: e.statusText, config: t.config, headers: t.resHeader || t.getAllResponseHeaders().split("\r\n").reduce(function (t, e) { if ("" === e) return t; var r = e.split(":"); return t[r.shift()] = o(r.join(":")), t }, {}) }; if (!x) return n.resolve(i); x(i, n) } function u(t, e, r, n) { var o = new w(t); r = { config: t.config, error: r, type: n }, E ? E(r, o) : o.next(r) } function a() { return !0 } function c(t) { return function (e, r) { return u(e, this, r, t), !0 } } function v(t, e) { return 4 === t.readyState && 0 !== t.status ? n(t, e) : 4 !== t.readyState && s(t, l), !0 } var h = t.onRequest, x = t.onResponse, E = t.onError, m = (0, f.hook)({ onload: a, onloadend: a, onerror: c(d), ontimeout: c(p), onabort: c(y), onreadystatechange: function (t) { return v(t, this) }, open: function (t, e) { var r = this, n = e.config = { headers: {} }; n.method = t[0], n.url = t[1], n.async = t[2], n.user = t[3], n.password = t[4], n.xhr = e; var o = "on" + l; if (e[o] || (e[o] = function () { return v(e, r) }), h) return !0 }, send: function (t, e) { var r = e.config; if (r.withCredentials = e.withCredentials, r.body = t[0], h) { var n = function () { h(r, new g(e)) }; return !1 === r.async ? n() : setTimeout(n), !0 } }, setRequestHeader: function (t, e) { if (e.config.headers[t[0].toLowerCase()] = t[1], h) return !0 }, addEventListener: function (t, e) { var r = this; if (-1 !== f.events.indexOf(t[0])) { var n = t[1]; return i(e).addEventListener(t[0], function (e) { var o = (0, f.configEvent)(e, r); o.type = t[0], o.isTrusted = !0, n.call(r, o) }), !0 } }, getAllResponseHeaders: function (t, e) { var r = e.resHeader; if (r) { var n = ""; for (var o in r) n += o + ": " + r[o] + "\r\n"; return n } }, getResponseHeader: function (t, e) { var r = e.resHeader; if (r) return r[(t[0] || "").toLowerCase()] } }, e); return { originXhr: m.originXhr, unProxy: m.unHook } } Object.defineProperty(e, "__esModule", { value: !0 }), e.proxy = n; var f = r(0), v = f.events[0], h = f.events[1], p = f.events[2], d = f.events[3], l = f.events[4], y = f.events[5], x = "prototype"; u[x] = Object.create({ resolve: function (t) { var e = this.xhrProxy, r = this.xhr; e.readyState = 4, r.resHeader = t.headers, e.response = e.responseText = t.response, e.statusText = t.statusText, e.status = t.status, s(r, l), s(r, v), s(r, h) }, reject: function (t) { this.xhrProxy.status = 0, s(this.xhr, t.type), s(this.xhr, h) } }); var g = a(function (t) { var e = this.xhr; t = t || e.config, e.withCredentials = t.withCredentials, e.open(t.method, t.url, !1 !== t.async, t.user, t.password); for (var r in t.headers) e.setRequestHeader(r, t.headers[r]); e.send(t.body) }), b = a(function (t) { this.resolve(t) }), w = a(function (t) { this.reject(t) }) }, , function (t, e, r) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }), e.ah = void 0; var n = r(0), o = r(1); e.ah = { proxy: o.proxy, hook: n.hook } }]));
//# sourceMappingURL=ajaxhook.min.js.map

(function () {
	'use strict';

	// 在脚本开头添加平台检测
	const isBilibili = window.location.hostname.includes('bilibili.com');
	const isYouTube = window.location.hostname.includes('youtube.com');
	if (!isBilibili && !isYouTube) return;

	let ytbSubtitleDefault = null;
	let ytbSubtitlePerfer = null;
	let ytbVideoContainer = null;
	let ytbVideo = null;
	let subPanel = null;

	let showRange = 5;
	let panelPosition = 'left'; // 'left' 或 'right'

	// 字幕获取模块
	const SubtitleFetcher = {
		// 获取视频信息
		async getVideoInfo() {
			console.log('Getting video info...');

			const info = {
				aid: unsafeWindow.aid || unsafeWindow.__INITIAL_STATE__?.aid,
				bvid: unsafeWindow.bvid || unsafeWindow.__INITIAL_STATE__?.bvid,
				cid: unsafeWindow.cid
			};

			if (!info.cid) {
				const state = unsafeWindow.__INITIAL_STATE__;
				info.cid = state?.videoData?.cid || state?.epInfo?.cid;
			}

			if (!info.cid && unsafeWindow.player) {
				try {
					const playerInfo = unsafeWindow.player.getVideoInfo();
					info.cid = playerInfo.cid;
					info.aid = playerInfo.aid;
					info.bvid = playerInfo.bvid;
				} catch (e) {
					console.log('Failed to get info from player:', e);
				}
			}

			console.log('Video info:', info);
			return info;
		},

		// 获取字幕配置
		async getSubtitleConfig(info) {
			console.log('Getting subtitle config...');

			const apis = [
				`//api.bilibili.com/x/player/v2?cid=${info.cid}&bvid=${info.bvid}`,
				`//api.bilibili.com/x/v2/dm/view?aid=${info.aid}&oid=${info.cid}&type=1`,
				`//api.bilibili.com/x/player/wbi/v2?cid=${info.cid}`
			];

			for (const api of apis) {
				try {
					console.log('Trying API:', api);
					const res = await fetch(api);
					const data = await res.json();
					console.log('API response:', data);
					if (data.code === 0 && data.data?.subtitle?.subtitles?.length > 0) {
						return data.data.subtitle;
					}
				} catch (e) {
					console.log('API failed:', e);
				}
			}

			return null;
		},

		// 获取字幕内容
		async getSubtitleContent(subtitleUrl) {
			console.log('Getting subtitle content from:', subtitleUrl);

			try {
				const url = subtitleUrl.replace(/^http:/, 'https:');
				console.log('Using HTTPS URL:', url);

				const res = await fetch(url);
				const data = await res.json();
				console.log('Subtitle content:', data);
				return data;
			} catch (e) {
				console.error('Failed to get subtitle content:', e);
				return null;
			}
		}


	};
	async function LoadSubtitle() {
		let subtitles = null;

		const videoInfo = await SubtitleFetcher.getVideoInfo();
		if (!videoInfo.cid) {
			console.log('无法获取视频信息');
			return null;
		}

		const subtitleConfig = await SubtitleFetcher.getSubtitleConfig(videoInfo);
		if (!subtitleConfig) {
			console.log('该视频没有CC字幕');
			return null;
		}
		const allSubtitles = subtitleConfig.subtitles;
		let perferSubtitle = allSubtitles[0];
		if (allSubtitles.length > 1) {
			for (let i = 0; i < allSubtitles.length; i++) {
				const s = allSubtitles[i];
				if (s.lan.includes('zh'))// 找出中文
				{
					perferSubtitle = s;
					break;
				}
			}
		}

		subtitles = await SubtitleFetcher.getSubtitleContent(perferSubtitle.subtitle_url);
		if (!subtitles) {
			console.log('获取字幕内容失败');
			return null;
		}
		return subtitles;
	}

	async function LoadSubtitleYtb() {
		let ytbSubtitles = ytbSubtitlePerfer;
		// console.log('LoadSubtitleYtb')
		// console.log(ytbSubtitleDefault)
		// console.log(ytbSubtitlePerfer)
		let ytbSubtitlesBody = []
		for (var i = 0; i < ytbSubtitles.events.length; i++)
		// for (const jsonEvent of ytbSubtitles.events)
		{
			const jsonEvent = ytbSubtitles.events[i]
			// 跳过一些只有换行的
			if (jsonEvent.aAppend === 1 || !jsonEvent.segs) {
				continue;
			}
			let ontLine = '';
			for (const seg of jsonEvent.segs) {
				ontLine += seg.utf8;
			}
			// youtube 是两行字幕滚动，这里判断持续时间跟下一行的时间，选近的作为结束
			let timeDur = jsonEvent.tStartMs + jsonEvent.dDurationMs
			if (i + 1 < ytbSubtitles.events.length) {
				const timeNext = ytbSubtitles.events[i + 1].tStartMs;
				if (timeNext < timeDur)
					timeDur = timeNext;
			}

			ytbSubtitlesBody.push(
				{
					from: jsonEvent.tStartMs / 1000,
					to: timeDur / 1000,
					content: ontLine
				}
			)
		}
		console.log(ytbSubtitlesBody)
		return ytbSubtitlesBody;
	}

	const TimeFormatter = {
		formatTime(seconds) {
			const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
			const ss = String(Math.floor(seconds % 60)).padStart(2, '0');
			return `${mm}:${ss}`;
		},
	}

	// 添加自定义样式
	GM_addStyle(`
        #subtitle-panel {
            position: absolute;
            left: 20px;
            top: 60%;
            transform: translateY(-50%);
            width: 300px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            padding: 2px;
            color: white;
            font-family: 'Microsoft YaHei', sans-serif;
            z-index: 1000;
            backdrop-filter: blur(2px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            cursor: move;
        }

        #subtitle-panel.right-side {
            left: auto;
            right: 20px;
        }

        #subtitle-panel.collapsed {
            width: 80px;
            height: 40px;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
        }

        #subtitle-panel.collapsed .subtitle-content {
            display: none;
        }
        #subtitle-panel.collapsed .key-hint {
            display: none;
        }
        #subtitle-panel.collapsed .panel-header {
            margin-bottom: 0;
            border-bottom: none;
            padding: 5px;
            width: 100%;
            justify-content: space-between;
        }
        #subtitle-panel.collapsed .panel-title {
            display: block;
            font-size: 14px;
            color: #ffb7c5;
        }
        #subtitle-panel.collapsed .toggle-btn {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            font-size: 12px;
        }

        #subtitle-panel.collapsed .collapsed-text {
            display: block;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
        }

        .collapsed-text {
            display: none;
        }

        .subtitle-content {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 5px;
        }

        .subtitle-content::-webkit-scrollbar {
            width: 6px;
        }

        .subtitle-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }

        .subtitle-item {
            margin: 3px 0;
            padding: 4px 6px;
            border-radius: 2px;
            transition: all 0.3s ease;
            line-height: 1;
            cursor: pointer;
        }

        .subtitle-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .subtitle-prev, .subtitle-next {
            font-size: 14px;
			opacity: 0.9;
            color: #FCF200;
        }

        .subtitle-current {
            font-size: 16px;
            font-weight: bold;
			color: #ffb7c5;

        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1px;
            padding-bottom: 1px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            cursor: move;
        }

        .panel-title {
			padding: 5px;
            font-size: 12px;
            font-weight: bold;
            color: #ffb7c5;
        }

        .toggle-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            transition: all 0.3s ease;
            z-index: 1001;
        }

        .toggle-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .status-indicator {
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-top: 10px;
            opacity: 0.7;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status-connected {
            background: #3af172;
        }

        .status-loading {
            background: #ffd166;
        }

        .status-error {
            background: #ff6b6b;
        }

		.key-hint {
            background: rgba(255, 255, 255, 0.1);
            padding: 1px 2px;
            border-radius: 2px;
            font-size: 14px;
            margin-top: 5px;
        }
    `);

	// 主函数
	function initSubtitlePanel(subtitles) {
		// 创建字幕面板
		const panel = document.createElement('div');
		panel.id = 'subtitle-panel';

		// 创建面板头部
		const panelHeader = document.createElement('div');
		panelHeader.className = 'panel-header';

		const panelTitle = document.createElement('div');
		panelTitle.className = 'panel-title';
		panelTitle.textContent = '字幕面板';

		const toggleBtn = document.createElement('button');
		toggleBtn.className = 'toggle-btn';
		toggleBtn.textContent = '−'; // 减号字符

		panelHeader.appendChild(panelTitle);
		panelHeader.appendChild(toggleBtn);

		// 创建字幕内容区域
		const subtitleContent = document.createElement('div');
		subtitleContent.className = 'subtitle-content';

		const statusIndicator = document.createElement('div');
		statusIndicator.className = 'status-indicator';

		const statusDot = document.createElement('div');
		statusDot.className = 'status-dot status-loading';

		const statusText = document.createElement('span');
		statusText.textContent = '需要打开字幕';

		statusIndicator.appendChild(statusDot);
		statusIndicator.appendChild(statusText);
		subtitleContent.appendChild(statusIndicator);

		// 创建快捷键提示
		const keyHint = document.createElement('div');
		keyHint.className = 'key-hint';
		keyHint.textContent = '← → 跳转字幕 | Shift + ← → 切换位置';

		// 组装所有元素
		panel.appendChild(panelHeader);
		panel.appendChild(subtitleContent);
		panel.appendChild(keyHint);

		// 最终得到的 panel 可以直接使用
		subPanel = panel;


		// 添加到播放器区域
		let playerContainer;
		if (isYouTube)
			playerContainer = ytbVideoContainer;
		else
			playerContainer = document.querySelector('.bpx-player-container');
		if (playerContainer) {
			playerContainer.appendChild(panel);
		} else {
			document.body.appendChild(panel);
		}

		// 获取视频元素
		let video = document.querySelector('video');
		console.log('video')
		console.log(video)
		if (!video) video = ytbVideo;
		if (!video) {
			updateStatus('未找到视频元素', 'error');
			return;
		}

		if (isBilibili) {
			setupSubtitleDisplay(subtitles, video, panel);
		}

		// 收起/展开功能
		// const toggleBtn = panel.querySelector('.toggle-btn');
		toggleBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			panel.classList.toggle('collapsed');
			toggleBtn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
		});

		// 拖拽功能 (修复版)
		let isDragging = false;
		let startX, startY, startLeft, startTop;

		const header = panel.querySelector('.panel-header');
		header.addEventListener('mousedown', (e) => {
			if (e.target !== toggleBtn) {
				isDragging = true;
				startX = e.clientX;
				startY = e.clientY;
				startLeft = panel.offsetLeft;
				startTop = panel.offsetTop;
				panel.style.cursor = 'grabbing';
				panel.style.userSelect = 'none';
				e.preventDefault();
			}
		});

		document.addEventListener('mousemove', (e) => {
			if (isDragging) {
				const dx = e.clientX - startX;
				const dy = e.clientY - startY;

				// 计算新位置
				let newLeft = startLeft + dx;
				let newTop = startTop + dy;

				// 限制在可视区域内
				const maxLeft = window.innerWidth - panel.offsetWidth - 10;
				const maxTop = window.innerHeight - panel.offsetHeight - 10;

				newLeft = Math.max(10, Math.min(newLeft, maxLeft));
				newTop = Math.max(10, Math.min(newTop, maxTop));

				panel.style.left = `${newLeft}px`;
				panel.style.top = `${newTop}px`;
				panel.style.transform = 'none';
			}
		});

		document.addEventListener('mouseup', () => {
			if (isDragging) {
				isDragging = false;
				panel.style.cursor = 'move';
				panel.style.userSelect = 'auto';
			}
		});

		// 切换面板位置功能
		function togglePanelPosition() {
			panelPosition = panelPosition === 'left' ? 'right' : 'left';
			panel.classList.toggle('right-side', panelPosition === 'right');
		}

		// 添加快捷键监听
		document.addEventListener('keydown', function (e) {
			// Shift + 左箭头：切换到左侧
			if (e.shiftKey && e.key === 'ArrowLeft') {
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				togglePanelPosition()
				panel.classList.remove('right-side');
			}
			// Shift + 右箭头：切换到右侧
			else if (e.shiftKey && e.key === 'ArrowRight') {
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				togglePanelPosition()
				panel.classList.add('right-side');
			}
		}, true);
	}

	// 更新状态指示器
	function updateStatus(message, status) {
		const statusEl = document.querySelector('.status-indicator');
		if (statusEl) {
			const dot = statusEl.querySelector('.status-dot');
			dot.className = 'status-dot';
			dot.classList.add(`status-${status}`);
			statusEl.querySelector('span').textContent = message;
		}
	}

	// 设置字幕显示
	function setupSubtitleDisplay(subtitles, video, panel) {
		const contentEl = panel.querySelector('.subtitle-content');
		// contentEl.innerHTML = '';

		// 存储字幕数据
		window.subtitleList = subtitles;
		window.currentSubIndex = -1;

		// 创建全部字幕项
		const subtitleItems = [];
		for (let i = 0; i < subtitles.length; i++) {
			const item = document.createElement('div');
			item.className = 'subtitle-item';
			item.textContent = TimeFormatter.formatTime(subtitles[i].from) + ' ' + subtitles[i].content;
			item.dataset.index = i;
			subtitleItems.push(item);
			contentEl.appendChild(item);
		}

		// 更新字幕显示
		function updateSubtitles() {
			const time = video.currentTime;
			let currentIndex = -1;

			if (time < subtitles[0].from) {
				currentIndex = 0;
			}

			// 找到当前时间对应的字幕索引
			for (let i = 0; i < subtitles.length; i++) {
				if (time >= subtitles[i].from && time < subtitles[i].to) {
					currentIndex = i;
					break;
				}
			}

			if (currentIndex === -1) {
				for (let i = 0; i < subtitles.length; i++) {
					if (time < subtitles[i].from) {
						currentIndex = i - 1;
						break;
					}
				}

				if (currentIndex === -1 && subtitles.length > 0) {
					currentIndex = subtitles.length - 1;
				}
			}

			if (currentIndex !== window.currentSubIndex) {
				window.currentSubIndex = currentIndex;

				// 高亮当前字幕，移除其他高亮
				subtitleItems.forEach((item, idx) => {
					item.classList.remove('subtitle-current', 'subtitle-prev', 'subtitle-next');
					if (idx === currentIndex) {
						item.classList.add('subtitle-current');
					} else if (idx < currentIndex) {
						item.classList.add('subtitle-prev');
					} else {
						item.classList.add('subtitle-next');
					}
				});

				// 始终将当前字幕滚动到面板中间
				const currentItem = subtitleItems[currentIndex];
				if (currentItem) {
					contentEl.scrollTop = currentItem.offsetTop - contentEl.clientHeight / 2 - currentItem.offsetHeight / 2;
				}
			}
		}

		// 添加点击字幕跳转功能
		subtitleItems.forEach(item => {
			item.addEventListener('click', function () {
				const index = parseInt(this.dataset.index);
				if (!isNaN(index) && subtitles[index]) {
					video.currentTime = subtitles[index].from;
					video.play();
				}
			});
		});

		// 添加时间更新监听
		video.addEventListener('timeupdate', updateSubtitles);

		// 添加快捷键监听
		document.addEventListener('keydown', function (e) {
			// 左箭头：上一句 或 2s
			if (e.key === 'ArrowLeft' && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				jumpToPreviousSubtitle();
			}
			// 右箭头：下一句 或 2s
			else if (e.key === 'ArrowRight' && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				jumpToNextSubtitle();
			}
		}, true);

		// 跳转到上一句
		function jumpToPreviousSubtitle() {
			if (window.currentSubIndex > 0) {
				const prevIndex = window.currentSubIndex - 1;
				const prevTime = subtitles[prevIndex].from;
				const curTime = video.currentTime;
				if (curTime - prevTime > 10) {
					video.currentTime = Math.max(curTime - 2, 0);
				} else {
					video.currentTime = prevTime;
				}
				video.play();
			}
			else {
				const curTime = video.currentTime;
				video.currentTime = Math.max(curTime - 2, 0);
				video.play();
			}
		}

		// 跳转到下一句
		function jumpToNextSubtitle() {
			if (window.currentSubIndex < subtitles.length - 1) {
				const nextIndex = window.currentSubIndex + 1;
				const nextTime = subtitles[nextIndex].from;
				const curTime = video.currentTime;
				if (nextTime - curTime > 10) {
					video.currentTime = Math.min(curTime + 2, video.duration || curTime + 2);
				} else {
					video.currentTime = nextTime;
				}
				video.play();
			}
			else {
				const curTime = video.currentTime;
				video.currentTime = Math.min(curTime + 2, video.duration || curTime + 2);
				video.play();
			}
		}

		// 初始更新
		updateSubtitles();
	}

	async function YoutubeShow() {
		const subs = await LoadSubtitleYtb();
		ytbVideo = document.querySelector('video');
		ytbVideoContainer = document.querySelector('.style-scope ytd-player');
		initSubtitlePanel()
		setupSubtitleDisplay(subs, ytbVideo, subPanel);
	}

	function HookUrl() {
		// console.log('HookUrl');
		// console.log('HookUrl' + ah);
		ah.proxy({
			onRequest: (config, handler) => {
				handler.next(config); // 处理下一个请求
			},
			onResponse: (response, handler) => {
				if (ytbSubtitleDefault != null) {

				}
				// 如果请求的 URL 包含 '/api/timedtext' 并且没有 '&translate_h00ked'，则表示请求双语字幕
				else if (response.config.url.includes('/api/timedtext') && !response.config.url.includes('&translate_h00ked')) {
					// console.log('Hook res')
					// 检测浏览器首选语言，如果没有，设置为英语
					const preferredLanguage = navigator.language.split('-')[0] || 'en';

					let xhr = new XMLHttpRequest(); // 创建新的 XMLHttpRequest
					// 使用 RegExp 清除我们的 xhr 请求参数中的 '&tlang=...'，同时使用 Y2B 自动翻译
					let url = response.config.url.replace(/(^|[&?])tlang=[^&]*/g, '');
					url = `${url}&tlang=${preferredLanguage}&translate_h00ked`;
					xhr.open('GET', url, false); // 打开 xhr 请求
					xhr.send(); // 发送 xhr 请求

					if (response.response) {
						const jsonResponse = JSON.parse(response.response);
						if (jsonResponse.events) {
							ytbSubtitleDefault = jsonResponse;
						}
					}
					ytbSubtitlePerfer = JSON.parse(xhr.response);
					setTimeout(YoutubeShow, 500)
				}
				handler.resolve(response); // 处理响应
			}
		});
	}

	async function main() {
		if (isBilibili) {
			const subtitle = await LoadSubtitle();
			if (subtitle)
				initSubtitlePanel(subtitle.body);
		}
		else {
			// console.log("youtube hook")
			let p = document.querySelector('.html5-video-player');
			if (p == null) { // 不知道为什么会执行两次，null的时候不管
				return;
			}
			// console.log("youtube hook2")
			HookUrl();
		}
	}

	// 等待页面加载完成后执行
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', main);
	} else {
		main();
	}
})();
