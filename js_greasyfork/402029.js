// ==UserScript==
// @name				HTML5 video player enhanced script (EN)
// @name:ru				HTML5 видео плеер улучшенный скрипт (RUS)
// @namespace			https://github.com/xxxily/h5player
// @homepage			https://github.com/xxxily/h5player
// @version				4.0.7 (3.3.0)
// @description			Translated from Chinese to English!
// @description:ru		Переведён с Китайского на Русский язык!
// @author				https://greasyfork.org/scripts/381682
// @icon				https://raw.githubusercontent.com/xxxily/h5player/master/logo.png
// @match				http://*/*
// @match				https://*/*
// @grant				unsafeWindow
// @grant				GM_addStyle
// @grant				GM_setValue
// @grant				GM_getValue
// @grant				GM_deleteValue
// @grant				GM_listValues
// @grant				GM_addValueChangeListener
// @grant				GM_removeValueChangeListener
// @grant				GM_registerMenuCommand
// @grant				GM_unregisterMenuCommand
// @grant				GM_getTab
// @grant				GM_saveTab
// @grant				GM_getTabs
// @grant				GM_openInTab
// @grant				GM_download
// @grant				GM_xmlhttpRequest
// @run-at				document-start
// @require				https://unpkg.com/vue@2.6.11/dist/vue.min.js
// @require				https://unpkg.com/element-ui@2.13.0/lib/index.js
// @resource			elementUiCss https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css
// @connect				127.0.0.1
// @license				GPL
// @downloadURL https://update.greasyfork.org/scripts/402029/HTML5%20video%20player%20enhanced%20script%20%28EN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402029/HTML5%20video%20player%20enhanced%20script%20%28EN%29.meta.js
// ==/UserScript==
(function (w) {
	if (w) {
		w.name = 'h5player';
	}
})();

function getType(obj) {
	if (obj == null) {
		return String(obj)
	}
	return typeof obj === 'object' || typeof obj === 'function' ? (obj.constructor && obj.constructor.name && obj.constructor.name.toLowerCase()) || /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase() : typeof obj
}
// SET LANGUAGE / ПОМЕНЯЙТЕ ЯЗЫК
var set_lang = "ru"; // en = english ( Default ) / ru = русский язык
var set_fontsize = 16; // Font size (Default 12) / Размер шрифта (Дефолт 12)
var skipstep1 = 5; // Skip step 5 sec / Перекрутка на 5 секунд
var skipstep2 = 30; // Skip step 30 sec / Перекрутка на 30 секунд

const isType = (obj, typeName) => getType(obj) === typeName;
const isObj = obj => isType(obj, 'object');
class TCC {
	constructor(taskConf, doTaskFunc) {
		this.conf = taskConf || {
			'demo.demo': {
				fullScreen: '.fullscreen-btn',
				exitFullScreen: '.exit-fullscreen-btn',
				webFullScreen: function () {},
				exitWebFullScreen: '.exit-fullscreen-btn',
				autoPlay: '.player-start-btn',
				pause: '.player-pause',
				play: '.player-play',
				switchPlayStatus: '.player-play',
				playbackRate: function () {},
				currentTime: function () {},
				addCurrentTime: '.add-currenttime',
				subtractCurrentTime: '.subtract-currenttime',
				shortcuts: {
					register: [
						'ctrl+shift+alt+c',
						'ctrl+shift+c',
						'ctrl+alt+c',
						'ctrl+c',
						'c'
					],
					callback: function (h5Player, taskConf, data) {
						const {
							event,
							player
						} = data;
						console.log(event, player);
					}
				},
				include: /^.*/,
				exclude: /\t/
			}
		};
		this.doTaskFunc = doTaskFunc instanceof Function ? doTaskFunc : function () {};
	}
	getDomain() {
		const host = window.location.host;
		let domain = host;
		const tmpArr = host.split('.');
		if (tmpArr.length > 2) {
			tmpArr.shift();
			domain = tmpArr.join('.');
		}
		return domain
	}
	formatTCC(isAll) {
		const t = this;
		const keys = Object.keys(t.conf);
		const domain = t.getDomain();
		const host = window.location.host;

		function formatter(item) {
			const defObj = {
				include: /^.*/,
				exclude: /\t/
			};
			item.include = item.include || defObj.include;
			item.exclude = item.exclude || defObj.exclude;
			return item
		}
		const result = {};
		keys.forEach(function (key) {
			let item = t[key];
			if (isObj(item)) {
				if (isAll) {
					item = formatter(item);
					result[key] = item;
				} else {
					if (key === host || key === domain) {
						item = formatter(item);
						result[key] = item;
					}
				}
			}
		});
		return result
	}
	isMatch(taskConf) {
		const url = window.location.href;
		let isMatch = false;
		if (!taskConf.include && !taskConf.exclude) {
			isMatch = true;
		} else {
			if (taskConf.include && taskConf.include.test(url)) {
				isMatch = true;
			}
			if (taskConf.exclude && taskConf.exclude.test(url)) {
				isMatch = false;
			}
		}
		return isMatch
	}
	getTaskConfig() {
		const t = this;
		if (!t._hasFormatTCC_) {
			t.formatTCC();
			t._hasFormatTCC_ = true;
		}
		const domain = t.getDomain();
		const taskConf = t.conf[window.location.host] || t.conf[domain];
		if (taskConf && t.isMatch(taskConf)) {
			return taskConf
		}
		return {}
	}
	doTask(taskName, data) {
		const t = this;
		let isDo = false;
		if (!taskName) return isDo
		const taskConf = isObj(taskName) ? taskName : t.getTaskConfig();
		if (!isObj(taskConf) || !taskConf[taskName]) return isDo
		const task = taskConf[taskName];
		if (task) {
			isDo = t.doTaskFunc(taskName, taskConf, data);
		}
		return isDo
	}
}

function ready(selector, fn, shadowRoot) {
	const listeners = [];
	const win = window;
	const doc = shadowRoot || win.document;
	const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
	let observer;

	function $ready(selector, fn) {
		listeners.push({
			selector: selector,
			fn: fn
		});
		if (!observer) {
			observer = new MutationObserver(check);
			observer.observe(shadowRoot || doc.documentElement, {
				childList: true,
				subtree: true
			});
		}
		check();
	}

	function check() {
		for (let i = 0; i < listeners.length; i++) {
			var listener = listeners[i];
			var elements = doc.querySelectorAll(listener.selector);
			for (let j = 0; j < elements.length; j++) {
				var element = elements[j];
				if (!element._isMutationReady_) {
					element._isMutationReady_ = true;
					listener.fn.call(element, element);
				}
			}
		}
	}
	$ready(selector, fn);
}

function hackAttachShadow() {
	if (window._hasHackAttachShadow_) return
	try {
		window._shadowDomList_ = [];
		window.Element.prototype._attachShadow = window.Element.prototype.attachShadow;
		window.Element.prototype.attachShadow = function () {
			const arg = arguments;
			if (arg[0] && arg[0].mode) {
				arg[0].mode = 'open';
			}
			const shadowRoot = this._attachShadow.apply(this, arg);
			window._shadowDomList_.push(shadowRoot);
			const shadowEvent = new window.CustomEvent('addShadowRoot', {
				shadowRoot,
				detail: {
					shadowRoot,
					message: 'addShadowRoot',
					time: new Date()
				},
				bubbles: true,
				cancelable: true
			});
			document.dispatchEvent(shadowEvent);
			return shadowRoot
		};
		window._hasHackAttachShadow_ = true;
	} catch (e) {
		console.error('hackAttachShadow error by h5player plug-in');
	}
}

function hackEventListener(config) {
	config = config || {
		debug: false,
		proxyAll: false,
		proxyNodeType: []
	};
	let proxyNodeType = Array.isArray(config.proxyNodeType) ? config.proxyNodeType : [config.proxyNodeType];
	const tmpArr = [];
	proxyNodeType.forEach(type => {
		if (typeof type === 'string') {
			tmpArr.push(type.toUpperCase());
		}
	});
	proxyNodeType = tmpArr;
	const EVENT = window.EventTarget.prototype;
	if (EVENT._addEventListener) return
	EVENT._addEventListener = EVENT.addEventListener;
	EVENT._removeEventListener = EVENT.removeEventListener;
	window._listenerList_ = window._listenerList_ || {};
	EVENT.addEventListener = function () {
		const t = this;
		const arg = arguments;
		const type = arg[0];
		const listener = arg[1];
		if (!listener) {
			return false
		}
		try {
			const listenerSymbol = Symbol.for(listener);
			let listenerProxy = null;
			if (config.proxyAll || proxyNodeType.includes(t.nodeName)) {
				try {
					listenerProxy = new Proxy(listener, {
						apply(target, ctx, args) {
							if (t._listenerProxyApplyHandler_ instanceof Function) {
								const handlerResult = t._listenerProxyApplyHandler_(target, ctx, args, arg);
								if (handlerResult !== undefined) {
									return handlerResult
								}
							}
							return target.apply(ctx, args)
						}
					});
					listener[listenerSymbol] = listenerProxy;
					arg[1] = listenerProxy;
				} catch (e) {}
			}
			t._addEventListener.apply(t, arg);
			t._listeners = t._listeners || {};
			t._listeners[type] = t._listeners[type] || [];
			const listenerObj = {
				target: t,
				type,
				listener,
				listenerProxy,
				options: arg[2],
				addTime: new Date()
					.getTime()
			};
			t._listeners[type].push(listenerObj);
			if (config.debug) {
				window._listenerList_[type] = window._listenerList_[type] || [];
				window._listenerList_[type].push(listenerObj);
			}
		} catch (e) {
			t._addEventListener.apply(t, arg);
		}
	};
	EVENT.removeEventListener = function () {
		const arg = arguments;
		const type = arg[0];
		const listener = arg[1];
		if (!listener) {
			return false
		}
		try {
			const listenerSymbol = Symbol.for(listener);
			arg[1] = listener[listenerSymbol] || listener;
			this._removeEventListener.apply(this, arg);
			this._listeners = this._listeners || {};
			this._listeners[type] = this._listeners[type] || [];
			const result = [];
			this._listeners[type].forEach(listenerObj => {
				if (listenerObj.listener !== listener) {
					result.push(listenerObj);
				}
			});
			this._listeners[type] = result;
			if (config.debug) {
				const result = [];
				const listenerTypeList = window._listenerList_[type] || [];
				listenerTypeList.forEach(listenerObj => {
					if (listenerObj.listener !== listener) {
						result.push(listenerObj);
					}
				});
				window._listenerList_[type] = result;
			}
		} catch (e) {
			this._removeEventListener.apply(this, arg);
			console.error(e);
		}
	};
	try {
		if (document.addEventListener !== EVENT.addEventListener) {
			document.addEventListener = EVENT.addEventListener;
		}
		if (document.removeEventListener !== EVENT.removeEventListener) {
			document.removeEventListener = EVENT.removeEventListener;
		}
	} catch (e) {
		console.error(e);
	}
}
const quickSort = function (arr) {
	if (arr.length <= 1) {
		return arr
	}
	var pivotIndex = Math.floor(arr.length / 2);
	var pivot = arr.splice(pivotIndex, 1)[0];
	var left = [];
	var right = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] < pivot) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quickSort(left)
		.concat([pivot], quickSort(right))
};

function hideDom(selector, delay) {
	setTimeout(function () {
		const dom = document.querySelector(selector);
		if (dom) {
			dom.style.opacity = 0;
		}
	}, delay || 1000 * 5);
}

function eachParentNode(dom, fn) {
	let parent = dom.parentNode;
	while (parent) {
		const isEnd = fn(parent, dom);
		parent = parent.parentNode;
		if (isEnd) {
			break
		}
	}
}

function isEditableTarget(target) {
	const isEditable = target.getAttribute && target.getAttribute('contenteditable') === 'true';
	const isInputDom = /INPUT|TEXTAREA|SELECT/.test(target.nodeName);
	return isEditable || isInputDom
}

function fakeUA(ua) {
	Object.defineProperty(navigator, 'userAgent', {
		value: ua,
		writable: false,
		configurable: false,
		enumerable: true
	});
}
const userAgentMap = {
	android: {
		chrome: 'Mozilla/5.0 (Linux; Android 9; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
		firefox: 'Mozilla/5.0 (Android 7.0; Mobile; rv:57.0) Gecko/57.0 Firefox/57.0'
	},
	iPhone: {
		safari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
		chrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/74.0.3729.121 Mobile/15E148 Safari/605.1'
	},
	iPad: {
		safari: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
		chrome: 'Mozilla/5.0 (iPad; CPU OS 12_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/74.0.3729.155 Mobile/15E148 Safari/605.1'
	}
};

function isInIframe() {
	return window !== window.top
}

function isInCrossOriginFrame() {
	let result = true;
	try {
		if (window.top.localStorage || window.top.location.href) {
			result = false;
		}
	} catch (e) {
		result = true;
	}
	return result
}

function throttle(fn, interval = 80) {
	let timeout = null;
	return function () {
		if (timeout) return false
		timeout = setTimeout(() => {
			timeout = null;
		}, interval);
		fn.apply(this, arguments);
	}
}
const taskConf = {
	'demo.demo': {
		fullScreen: '.fullscreen-btn',
		exitFullScreen: '.exit-fullscreen-btn',
		webFullScreen: function () {},
		exitWebFullScreen: '.exit-fullscreen-btn',
		autoPlay: '.player-start-btn',
		pause: '.player-pause',
		play: '.player-play',
		switchPlayStatus: '.player-play',
		playbackRate: function () {},
		currentTime: function () {},
		addCurrentTime: '.add-currenttime',
		subtractCurrentTime: '.subtract-currenttime',
		shortcuts: {
			register: [
				'ctrl+shift+alt+c',
				'ctrl+shift+c',
				'ctrl+alt+c',
				'ctrl+c',
				'c'
			],
			callback: function (h5Player, taskConf, data) {
				const {
					event,
					player
				} = data;
				console.log(event, player);
			}
		},
		include: /^.*/,
		exclude: /\t/
	},
	'youtube.com': {
		webFullScreen: 'button.ytp-size-button',
		fullScreen: 'button.ytp-fullscreen-button',
		next: '.ytp-next-button',
		shortcuts: {
			register: [
				'escape'
			],
			callback: function (h5Player, taskConf, data) {
				const {
					event
				} = data;
				if (event.keyCode === 27) {
					if (document.querySelector('.ytp-upnext')
						.style.display !== 'none') {
						document.querySelector('.ytp-upnext-cancel-button')
							.click();
					}
				}
			}
		}
	},
	'netflix.com': {
		fullScreen: 'button.button-nfplayerFullscreen',
		addCurrentTime: 'button.button-nfplayerFastForward',
		subtractCurrentTime: 'button.button-nfplayerBackTen'
	},
	'bilibili.com': {
		// fullScreen: '[data-text="进入全屏"]',
		// webFullScreen: '[data-text="网页全屏"]',
		fullScreen: '.bilibili-player-video-btn-fullscreen',
		webFullScreen: function () {
			const webFullscreen = document.querySelector('.bilibili-player-video-web-fullscreen');
			if (webFullscreen) {
				webFullscreen.click();
				setTimeout(function () {
					document.querySelector('.bilibili-player-video-danmaku-input')
						.blur();
				}, 1000 * 0.1);
				return true
			}
		},
		// autoPlay: '.bilibili-player-video-btn-start',
		switchPlayStatus: '.bilibili-player-video-btn-start',
		next: '.bilibili-player-video-btn-next',
		init: function (h5Player, taskConf) {},
		shortcuts: {
			register: [
				'escape'
			],
			callback: function (h5Player, taskConf, data) {
				const {
					event
				} = data;
				if (event.keyCode === 27) {
					const webFullscreen = document.querySelector('.bilibili-player-video-web-fullscreen');
					if (webFullscreen.classList.contains('closed')) {
						webFullscreen.click();
					}
				}
			}
		}
	},
	't.bilibili.com': {
		fullScreen: 'button[name="fullscreen-button"]'
	},
	'live.bilibili.com': {
		fullScreen: '.bilibili-live-player-video-controller-fullscreen-btn button',
		webFullScreen: '.bilibili-live-player-video-controller-web-fullscreen-btn button',
		switchPlayStatus: '.bilibili-live-player-video-controller-start-btn button'
	},
	'acfun.cn': {
		fullScreen: '[data-bind-key="screenTip"]',
		webFullScreen: '[data-bind-key="webTip"]',
		switchPlayStatus: function (h5player) {
			const player = h5player.player();
			const status = player.paused;
			setTimeout(function () {
				if (status === player.paused) {
					if (player.paused) {
						player.play();
					} else {
						player.pause();
					}
				}
			}, 200);
		}
	},
	'iqiyi.com': {
		fullScreen: '.iqp-btn-fullscreen',
		webFullScreen: '.iqp-btn-webscreen',
		next: '.iqp-btn-next',
		init: function (h5Player, taskConf) {
			hideDom('.iqp-logo-box');
			window.GM_addStyle(`
          div[templatetype="common_pause"]{ display:none }
          .iqp-logo-box{ display:none !important }
      `);
		}
	},
	'youku.com': {
		fullScreen: '.control-fullscreen-icon',
		next: '.control-next-video',
		init: function (h5Player, taskConf) {
			hideDom('.youku-layer-logo');
		}
	},
	'ted.com': {
		fullScreen: 'button.Fullscreen'
	},
	'qq.com': {
		pause: '.container_inner .txp-shadow-mod',
		play: '.container_inner .txp-shadow-mod',
		shortcuts: {
			register: ['c', 'x', 'z', '1', '2', '3', '4'],
			callback: function (h5Player, taskConf, data) {
				const {
					event
				} = data;
				const key = event.key.toLowerCase();
				const speedItems = document.querySelectorAll('.container_inner txpdiv[data-role="txp-button-speed-list"] .txp_menuitem');
				if (window.sessionStorage.playbackRate && /(c|x|z|1|2|3|4)/.test(key)) {
					const curSpeed = Number(window.sessionStorage.playbackRate);
					const perSpeed = curSpeed - 0.1 >= 0 ? curSpeed - 0.1 : 0.1;
					const nextSpeed = curSpeed + 0.1 <= 4 ? curSpeed + 0.1 : 4;
					let targetSpeed = curSpeed;
					switch (key) {
						case 'z':
							targetSpeed = 1;
							break
						case 'c':
							targetSpeed = nextSpeed;
							break
						case 'x':
							targetSpeed = perSpeed;
							break
						default:
							targetSpeed = Number(key);
							break
					}
					window.sessionStorage.playbackRate = targetSpeed;
					h5Player.setCurrentTime(0.01, true);
					h5Player.setPlaybackRate(targetSpeed, true);
					return true
				}
				if (speedItems.length >= 3 && /(c|x|z)/.test(key)) {
					let curIndex = 1;
					speedItems.forEach((item, index) => {
						if (item.classList.contains('txp_current')) {
							curIndex = index;
						}
					});
					const perIndex = curIndex - 1 >= 0 ? curIndex - 1 : 0;
					const nextIndex = curIndex + 1 < speedItems.length ? curIndex + 1 : speedItems.length - 1;
					let target = speedItems[1];
					switch (key) {
						case 'z':
							target = speedItems[1];
							break
						case 'c':
							target = speedItems[nextIndex];
							break
						case 'x':
							target = speedItems[perIndex];
							break
					}
					target.click();
					const speedNum = Number(target.innerHTML.replace('x'));
					h5Player.setPlaybackRate(speedNum);
					return true
				}
			}
		},
		fullScreen: 'txpdiv[data-report="window-fullscreen"]',
		webFullScreen: 'txpdiv[data-report="browser-fullscreen"]',
		next: 'txpdiv[data-report="play-next"]',
		init: function (h5Player, taskConf) {
			hideDom('.txp-watermark');
			hideDom('.txp-watermark-action');
		},
		include: /(v.qq|sports.qq)/
	},
	'pan.baidu.com': {
		fullScreen: function (h5Player, taskConf) {
			h5Player.player()
				.parentNode.querySelector('.vjs-fullscreen-control')
				.click();
		}
	},
	'facebook.com': {
		fullScreen: function (h5Player, taskConf) {
			const actionBtn = h5Player.player()
				.parentNode.querySelectorAll('button');
			if (actionBtn && actionBtn.length > 3) {
				actionBtn[actionBtn.length - 2].click();
				return true
			}
		},
		webFullScreen: function (h5Player, taskConf) {
			const actionBtn = h5Player.player()
				.parentNode.querySelectorAll('button');
			if (actionBtn && actionBtn.length > 3) {
				actionBtn[actionBtn.length - 2].click();
				return true
			}
		},
		shortcuts: {
			register: [
				'escape'
			],
			callback: function (h5Player, taskConf, data) {
				eachParentNode(h5Player.player(), function (parentNode) {
					if (parentNode.getAttribute('data-fullscreen-container') === 'true') {
						const goBackBtn = parentNode.parentNode.querySelector('div>a>i>u');
						if (goBackBtn) {
							goBackBtn.parentNode.parentNode.click();
						}
						return true
					}
				});
			}
		}
	},
	'douyu.com': {
		fullScreen: function (h5Player, taskConf) {
			const player = h5Player.player();
			const container = player._fullScreen_.getContainer();
			if (player._isFullScreen_) {
				container.querySelector('div[title="退出窗口全屏"]')
					.click();
			} else {
				container.querySelector('div[title="窗口全屏"]')
					.click();
			}
			player._isFullScreen_ = !player._isFullScreen_;
			return true
		},
		webFullScreen: function (h5Player, taskConf) {
			const player = h5Player.player();
			const container = player._fullScreen_.getContainer();
			if (player._isWebFullScreen_) {
				container.querySelector('div[title="退出网页全屏"]')
					.click();
			} else {
				container.querySelector('div[title="网页全屏"]')
					.click();
			}
			player._isWebFullScreen_ = !player._isWebFullScreen_;
			return true
		}
	},
	'open.163.com': {
		init: function (h5Player, taskConf) {
			const player = h5Player.player();
			player.setAttribute('crossOrigin', 'anonymous');
		}
	},
	'agefans.tv': {
		init: function (h5Player, taskConf) {
			h5Player.player()
				.setAttribute('crossOrigin', 'anonymous');
		}
	},
	'chaoxing.com': {
		fullScreen: '.vjs-fullscreen-control'
	},
	'yixi.tv': {
		init: function (h5Player, taskConf) {
			h5Player.player()
				.setAttribute('crossOrigin', 'anonymous');
		}
	}
};

function h5PlayerTccInit(h5Player) {
	return new TCC(taskConf, function (taskName, taskConf, data) {
		const task = taskConf[taskName];
		const wrapDom = h5Player.getPlayerWrapDom();
		if (taskName === 'shortcuts') {
			if (isObj(task) && task.callback instanceof Function) {
				return task.callback(h5Player, taskConf, data)
			}
		} else if (task instanceof Function) {
			try {
				return task(h5Player, taskConf, data)
			} catch (e) {
				console.error('TCC Custom function task execution failed: ', h5Player, taskConf, data);
				return false
			}
		} else {
			if (wrapDom && wrapDom.querySelector(task)) {
				wrapDom.querySelector(task)
					.click();
				return true
			} else if (document.querySelector(task)) {
				document.querySelector(task)
					.click();
				return true
			}
		}
	})
}
const fakeConfig = {
	// 'tv.cctv.com': userAgentMap.iPhone.chrome,
	// 'v.qq.com': userAgentMap.iPad.chrome,
	'open.163.com': userAgentMap.iPhone.chrome,
	'm.open.163.com': userAgentMap.iPhone.chrome
};
class FullScreen {
	constructor(dom, pageMode) {
		this.dom = dom;
		this.pageMode = pageMode || false;
		const fullPageStyle = `
      ._webfullscreen_ {
        display: block !important;
				position: fixed !important;
				width: 100% !important;
				height: 100% !important;
				top: 0 !important;
				left: 0 !important;
				background: #000 !important;
				z-index: 999999 !important;
			}
			._webfullscreen_zindex_ {
				z-index: 999999 !important;
			}
		`;
		if (!window._hasInitFullPageStyle_) {
			window.GM_addStyle(fullPageStyle);
			window._hasInitFullPageStyle_ = true;
		}
		window.addEventListener('keyup', (event) => {
			const key = event.key.toLowerCase();
			if (key === 'escape') {
				if (this.isFull()) {
					this.exit();
				} else if (this.isFullScreen()) {
					this.exitFullScreen();
				}
			}
		}, true);
		this.getContainer();
	}
	eachParentNode(dom, fn) {
		let parent = dom.parentNode;
		while (parent && parent.classList) {
			const isEnd = fn(parent, dom);
			parent = parent.parentNode;
			if (isEnd) {
				break
			}
		}
	}
	getContainer() {
		const t = this;
		if (t._container_) return t._container_
		const d = t.dom;
		const domBox = d.getBoundingClientRect();
		let container = d;
		t.eachParentNode(d, function (parentNode) {
			const noParentNode = !parentNode || !parentNode.getBoundingClientRect;
			if (noParentNode || parentNode.getAttribute('data-fullscreen-container')) {
				container = parentNode;
				return true
			}
			const parentBox = parentNode.getBoundingClientRect();
			const isInsideTheBox = parentBox.width <= domBox.width && parentBox.height <= domBox.height;
			if (isInsideTheBox) {
				container = parentNode;
			} else {
				return true
			}
		});
		container.setAttribute('data-fullscreen-container', 'true');
		t._container_ = container;
		return container
	}
	isFull() {
		return this.dom.classList.contains('_webfullscreen_')
	}
	isFullScreen() {
		const d = document;
		return !!(d.fullscreen || d.webkitIsFullScreen || d.mozFullScreen || d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement)
	}
	enterFullScreen() {
		const c = this.getContainer();
		const enterFn = c.requestFullscreen || c.webkitRequestFullScreen || c.mozRequestFullScreen || c.msRequestFullScreen;
		enterFn && enterFn.call(c);
	}
	enter() {
		const t = this;
		if (t.isFull()) return
		const container = t.getContainer();
		let needSetIndex = false;
		if (t.dom === container) {
			needSetIndex = true;
		}
		this.eachParentNode(t.dom, function (parentNode) {
			parentNode.classList.add('_webfullscreen_');
			if (container === parentNode || needSetIndex) {
				needSetIndex = true;
				parentNode.classList.add('_webfullscreen_zindex_');
			}
		});
		t.dom.classList.add('_webfullscreen_');
		const fullScreenMode = !t.pageMode;
		if (fullScreenMode) {
			t.enterFullScreen();
		}
	}
	exitFullScreen() {
		const d = document;
		const exitFn = d.exitFullscreen || d.webkitExitFullscreen || d.mozCancelFullScreen || d.msExitFullscreen;
		exitFn && exitFn.call(d);
	}
	exit() {
		const t = this;
		t.dom.classList.remove('_webfullscreen_');
		this.eachParentNode(t.dom, function (parentNode) {
			parentNode.classList.remove('_webfullscreen_');
			parentNode.classList.remove('_webfullscreen_zindex_');
		});
		const fullScreenMode = !t.pageMode;
		if (fullScreenMode || t.isFullScreen()) {
			t.exitFullScreen();
		}
	}
	toggle() {
		this.isFull() ? this.exit() : this.enter();
	}
}
var videoCapturer = {
	capture(video, download, title) {
		if (!video) return false
		const t = this;
		const currentTime = `${Math.floor(video.currentTime / 60)}'${(video.currentTime % 60).toFixed(3)}''`;
		const captureTitle = title || `${document.title}_${currentTime}`;
		video.setAttribute('crossorigin', 'anonymous');
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		if (download) {
			t.download(canvas, captureTitle, video);
		} else {
			t.previe(canvas, captureTitle);
		}
		return canvas
	},
	previe(canvas, title) {
		canvas.style = 'max-width:100%';
		const previewPage = window.open('', '_blank');
		previewPage.document.title = `capture previe - ${title || 'Untitled'}`;
		previewPage.document.body.style.textAlign = 'center';
		previewPage.document.body.style.background = '#000';
		previewPage.document.body.appendChild(canvas);
	},
	download(canvas, title, video) {
		title = title || 'videoCapturer_' + Date.now();
		try {
			canvas.toBlob(function (blob) {
				const el = document.createElement('a');
				el.download = `${title}.jpg`;
				el.href = URL.createObjectURL(blob);
				el.click();
			}, 'image/jpeg', 0.99);
		} catch (e) {
			window.alert('The video source is restricted by the CORS logo and cannot download screenshots.\nYou can give feedback to the author to improve the website compatibility logic');
			console.log('video object:', video);
			console.error('video crossorigin:', video.getAttribute('crossorigin'));
			console.error(e);
		}
	}
};
class MouseObserver {
	constructor(observeOpt) {
		// eslint-disable-next-line no-undef
		this.observer = new IntersectionObserver((infoList) => {
			infoList.forEach((info) => {
				info.target.IntersectionObserverEntry = info;
			});
		}, observeOpt || {});
		this.observeList = [];
	}
	_observe(target) {
		let hasObserve = false;
		for (let i = 0; i < this.observeList.length; i++) {
			const el = this.observeList[i];
			if (target === el) {
				hasObserve = true;
				break
			}
		}
		if (!hasObserve) {
			this.observer.observe(target);
			this.observeList.push(target);
		}
	}
	_unobserve(target) {
		this.observer.unobserve(target);
		const newObserveList = [];
		this.observeList.forEach((el) => {
			if (el !== target) {
				newObserveList.push(el);
			}
		});
		this.observeList = newObserveList;
	}
	on(target, type, listener, options) {
		const t = this;
		t._observe(target);
		if (!target.MouseObserverEvent) {
			target.MouseObserverEvent = {};
		}
		target.MouseObserverEvent[type] = true;
		if (!t._mouseObserver_) {
			t._mouseObserver_ = {};
		}
		if (!t._mouseObserver_[type]) {
			t._mouseObserver_[type] = [];
			window.addEventListener(type, (event) => {
				t.observeList.forEach((target) => {
					const isVisibility = target.IntersectionObserverEntry && target.IntersectionObserverEntry.intersectionRatio > 0;
					const isReg = target.MouseObserverEvent[event.type] === true;
					if (isVisibility && isReg) {
						const bound = target.getBoundingClientRect();
						const offsetX = event.x - bound.x;
						const offsetY = event.y - bound.y;
						const isNeedTap = offsetX <= bound.width && offsetX >= 0 && offsetY <= bound.height && offsetY >= 0;
						if (isNeedTap) {
							const listenerList = t._mouseObserver_[type];
							listenerList.forEach((listener) => {
								if (listener instanceof Function) {
									listener.call(t, event, {
										x: offsetX,
										y: offsetY
									}, target);
								}
							});
						}
					}
				});
			}, options);
		}
		if (listener instanceof Function) {
			t._mouseObserver_[type].push(listener);
		}
	}
	off(target, type, listener) {
		const t = this;
		if (!target || !type || !listener || !t._mouseObserver_ || !t._mouseObserver_[type] || !target.MouseObserverEvent || !target.MouseObserverEvent[type]) return false
		const newListenerList = [];
		const listenerList = t._mouseObserver_[type];
		let isMatch = false;
		listenerList.forEach((listenerItem) => {
			if (listenerItem === listener) {
				isMatch = true;
			} else {
				newListenerList.push(listenerItem);
			}
		});
		if (isMatch) {
			t._mouseObserver_[type] = newListenerList;
			if (newListenerList.length === 0) {
				delete target.MouseObserverEvent[type];
			}
			if (JSON.stringify(target.MouseObserverEvent[type]) === '{}') {
				t._unobserve(target);
			}
		}
	}
}
class I18n {
	constructor(config) {
		this._languages = {};
		this._locale = this.getClientLang();
		this._defaultLanguage = '';
		this.init(config);
	}
	init(config) {
		if (!config) return false
		const t = this;
		t._locale = config.locale || t._locale;
		t._languages = config.languages || t._languages;
		t._defaultLanguage = config.defaultLanguage || t._defaultLanguage;
	}
	use() {}
	t(path) {
		const t = this;
		let result = t.getValByPath(t._languages[t._locale] || {}, path);
		if (!result && t._locale !== t._defaultLanguage) {
			result = t.getValByPath(t._languages[t._defaultLanguage] || {}, path);
		}
		return result || ''
	}
	language() {
		return this._locale
	}
	languages() {
		return this._languages
	}
	changeLanguage(locale) {
		if (this._languages[locale]) {
			this._languages = locale;
			return locale
		} else {
			return false
		}
	}
	getValByPath(obj, path) {
		path = path || '';
		const pathArr = path.split('.');
		let result = obj;
		for (let i = 0; i < pathArr.length; i++) {
			if (!result) break
			result = result[pathArr[i]];
		}
		return result
	}
	getClientLang() {
		return navigator.languages ? navigator.languages[0] : navigator.language
	}
}

function getId() {
	let gID = window.GM_getValue('_global_id_');
	if (!gID) gID = 0;
	gID = Number(gID) + 1;
	window.GM_setValue('_global_id_', gID);
	return gID
}
let curTabId = null;

function getTabId() {
	return new Promise((resolve, reject) => {
		window.GM_getTab(function (obj) {
			if (!obj.tabId) {
				obj.tabId = getId();
				window.GM_saveTab(obj);
			}
			curTabId = obj.tabId;
			resolve(obj.tabId);
		});
	})
}
getTabId();
const monkeyMenu = {
	on(title, fn, accessKey) {
		return window.GM_registerMenuCommand && window.GM_registerMenuCommand(title, fn, accessKey)
	},
	off(id) {
		return window.GM_unregisterMenuCommand && window.GM_unregisterMenuCommand(id)
	},
	switch (title, fn, defVal) {
		const t = this;
		t.on(title, fn);
	}
};

function extractDatafromOb(obj, deep) {
	deep = deep || 1;
	if (deep > 3) return {}
	const result = {};
	if (typeof obj === 'object') {
		for (const key in obj) {
			const val = obj[key];
			const valType = typeof val;
			if (valType === 'number' || valType === 'string' || valType === 'boolean') {
				Object.defineProperty(result, key, {
					value: val,
					writable: true,
					configurable: true,
					enumerable: true
				});
			} else if (valType === 'object' && Object.prototype.propertyIsEnumerable.call(obj, key)) {
				result[key] = extractDatafromOb(val, deep + 1);
			} else if (valType === 'array') {
				result[key] = val;
			}
		}
	}
	return result
}
const monkeyMsg = {
	send(name, data, throttleInterval = 80) {
		const oldMsg = window.GM_getValue(name);
		if (oldMsg && oldMsg.updateTime) {
			const interval = Math.abs(Date.now() - oldMsg.updateTime);
			if (interval < throttleInterval) {
				return false
			}
		}
		const msg = {
			data,
			tabId: curTabId || 'undefined',
			title: document.title,
			referrer: extractDatafromOb(window.location),
			updateTime: Date.now()
		};
		if (typeof data === 'object') {
			msg.data = extractDatafromOb(data);
		}
		window.GM_setValue(name, msg);
	},
	set: (name, data) => monkeyMsg.send(name, data),
	get: (name) => window.GM_getValue(name),
	on: (name, fn) => window.GM_addValueChangeListener(name, fn),
	off: (listenerId) => window.GM_removeValueChangeListener(listenerId)
};
class Debug {
	constructor(msg) {
		const t = this;
		msg = msg || 'debug message:';
		t.log = t.createDebugMethod('log', null, msg);
		t.error = t.createDebugMethod('error', null, msg);
		t.info = t.createDebugMethod('info', null, msg);
	}
	create(msg) {
		return new Debug(msg)
	}
	createDebugMethod(name, color, tipsMsg) {
		name = name || 'info';
		const bgColorMap = {
			info: '#2274A5',
			log: '#95B46A',
			error: '#D33F49'
		};
		return function () {
			if (!window._debugMode_) {
				return false
			}
			const curTime = new Date();
			const H = curTime.getHours();
			const M = curTime.getMinutes();
			const S = curTime.getSeconds();
			const msg = tipsMsg || 'debug message:';
			const arg = Array.from(arguments);
			arg.unshift(`color: white; background-color: ${color || bgColorMap[name] || '#95B46A'}`);
			arg.unshift(`%c [${H}:${M}:${S}] ${msg} `);
			window.console[name].apply(window.console, arg);
		}
	}
	isDebugMode() {
		return Boolean(window._debugMode_)
	}
}
var Debug$1 = new Debug();
var debug = Debug$1.create('h5player message:');
const hasUseKey = {
	keyCodeList: [13, 16, 17, 18, 27, 32, 37, 38, 39, 40, 49, 50, 51, 52, 67, 68, 69, 70, 73, 74, 75, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 97, 98, 99, 100, 220],
	keyList: ['enter', 'shift', 'control', 'alt', 'escape', ' ', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', '1', '2', '3', '4', 'c', 'd', 'e', 'f', 'i', 'j', 'k', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z', '\\', '|'],
	keyMap: {
		enter: 13,
		shift: 16,
		ctrl: 17,
		alt: 18,
		esc: 27,
		space: 32,
		'←': 37,
		'↑': 38,
		'→': 39,
		'↓': 40,
		1: 49,
		2: 50,
		3: 51,
		4: 52,
		c: 67,
		d: 68,
		e: 69,
		f: 70,
		i: 73,
		j: 74,
		k: 75,
		n: 78,
		o: 79,
		p: 80,
		q: 81,
		r: 82,
		s: 83,
		t: 84,
		u: 85,
		w: 87,
		x: 88,
		y: 89,
		z: 90,
		pad1: 97,
		pad2: 98,
		pad3: 99,
		pad4: 100,
		'\\': 220
	}
};

function isRegisterKey(event) {
	const keyCode = event.keyCode;
	const key = event.key.toLowerCase();
	return hasUseKey.keyCodeList.includes(keyCode) || hasUseKey.keyList.includes(key)
}
async function getPageWindow() {
	return new Promise(function (resolve, reject) {
		if (window._pageWindow) {
			return resolve(window._pageWindow)
		}
		const listenEventList = ['load', 'mousemove', 'scroll', 'get-page-window-event'];

		function getWin(event) {
			window._pageWindow = this;
			listenEventList.forEach(eventType => {
				window.removeEventListener(eventType, getWin, true);
			});
			resolve(window._pageWindow);
		}
		listenEventList.forEach(eventType => {
			window.addEventListener(eventType, getWin, true);
		});
		window.dispatchEvent(new window.Event('get-page-window-event'));
	})
}
getPageWindow();
const crossTabCtl = {
	updatePictureInPictureInfo() {
		setInterval(function () {
			if (document.pictureInPictureElement) {
				monkeyMsg.send('globalPictureInPictureInfo', {
					hasGlobalPictureInPictureElement: true
				});
			}
		}, 1000 * 1.5);
	},
	hasOpenPictureInPicture() {
		const data = monkeyMsg.get('globalPictureInPictureInfo');
		return data && Math.abs(Date.now() - data.updateTime) < 1000 * 3
	},
	isNeedSendCrossTabCtlEvent() {
		const t = crossTabCtl;
		if (t.hasOpenPictureInPicture()) {
			const data = monkeyMsg.get('globalPictureInPictureInfo');
			if (data.tabId !== curTabId) {
				return true
			}
		}
	},
	crossTabKeydownEvent(event) {
		const t = crossTabCtl;
		if (isEditableTarget(event.target)) return
		if (t.isNeedSendCrossTabCtlEvent() && isRegisterKey(event)) {
			event.stopPropagation();
			event.preventDefault();
			monkeyMsg.send('globalKeydownEvent', event);
			debug.log('Cross-tab key control information has been sent: ', event);
			return true
		}
	},
	bindCrossTabEvent() {
		const t = crossTabCtl;
		if (t._hasBindEvent_) return
		document.removeEventListener('keydown', t.crossTabKeydownEvent);
		document.addEventListener('keydown', t.crossTabKeydownEvent, true);
		t._hasBindEvent_ = true;
	},
	init() {
		const t = crossTabCtl;
		t.updatePictureInPictureInfo();
		t.bindCrossTabEvent();
	}
};
var en = {
	setting: 'Settings',
	tipsMsg: {
		playspeed: 'Speed: ',
		forward: 'Forward: ',
		backward: 'Backward: ',
		seconds: ' sec',
		volume: 'Volume: ',
		nextframe: 'Next frame',
		previousframe: 'Previous frame',
		stopframe: 'Stopframe: ',
		play: 'Play',
		pause: 'Pause',
		arpl: 'Allow auto resume playback progress',
		drpl: 'Disable auto resume playback progress',
		brightness: 'Brightness: ',
		contrast: 'Contrast: ',
		saturation: 'Saturation: ',
		hue: 'HUE: ',
		blur: 'Blur: ',
		imgattrreset: 'Attributes: reset',
		imgrotate: 'Picture rotation: ',
		onplugin: 'ON h5Player plugin',
		offplugin: 'OFF h5Player plugin',
		globalmode: 'Global mode: ',
		playbackrestored: 'Restored the last playback progress for you',
		playbackrestoreoff: 'The function of restoring the playback progress is disabled. Press SHIFT+R to turn on the function',
		horizontal: 'Horizontal displacement: ',
		vertical: 'Vertical displacement: ',
		videozoom: 'Video zoom: '
	},
	demo: 'demo-test'
};
var ru = {
	setting: 'Настройки',
	tipsMsg: {
		playspeed: 'Скорость: ',
		forward: 'Вперёд: ',
		backward: 'Назад: ',
		seconds: ' сек',
		volume: 'Громкость: ',
		nextframe: 'Следующий кадр',
		previousframe: 'Предыдущий кадр',
		stopframe: 'Стоп-кадр: ',
		play: 'Запуск',
		pause: 'Пауза',
		arpl: 'Разрешить автоматическое возобновление прогресса воспроизведения',
		drpl: 'Запретить автоматическое возобновление прогресса воспроизведения',
		brightness: 'Яркость: ',
		contrast: 'Контраст: ',
		saturation: 'Насыщенность: ',
		hue: 'Оттенок: ',
		blur: 'Размытие: ',
		imgattrreset: 'Атрибуты: сброс',
		imgrotate: 'Поворот изображения: ',
		onplugin: 'ВКЛ: плагин воспроизведения',
		offplugin: 'ВЫКЛ: плагин воспроизведения',
		globalmode: 'Глобальный режим:',
		playbackrestored: 'Восстановлен последний прогресс воспроизведения',
		playbackrestoreoff: 'Функция восстановления прогресса воспроизведения отключена. Нажмите SHIFT + R, чтобы включить функцию',
		horizontal: 'Горизонтальное смещение: ',
		vertical: 'Вертикальное смещение: ',
		videozoom: 'Увеличить видео: '
	}
};
const messages = {
	en: en,
	ru: ru
};
(async function () {
	debug.log('h5Player init');
	const i18n = new I18n({
		defaultLanguage: set_lang,
		languages: messages
	});
	const mouseObserver = new MouseObserver();
	hackAttachShadow();
	hackEventListener({
		proxyNodeType: ['video'],
		debug: debug.isDebugMode()
	});
	let TCC = null;
	const h5Player = {
		fontSize: set_fontsize,
		enable: true,
		globalMode: true,
		playerInstance: null,
		scale: 1,
		translate: {
			x: 0,
			y: 0
		},
		playbackRate: 1,
		lastPlaybackRate: 1,
		skipStep: skipstep1,
		skipStep2: skipstep2,
		player: function () {
			const t = this;
			return t.playerInstance || t.getPlayerList()[0]
		},
		getPlayerList: function () {
			const list = [];

			function findPlayer(context) {
				context.querySelectorAll('video')
					.forEach(function (player) {
						list.push(player);
					});
			}
			findPlayer(document);
			if (window._shadowDomList_) {
				window._shadowDomList_.forEach(function (shadowRoot) {
					findPlayer(shadowRoot);
				});
			}
			return list
		},
		getPlayerWrapDom: function () {
			const t = this;
			const player = t.player();
			if (!player) return
			let wrapDom = null;
			const playerBox = player.getBoundingClientRect();
			eachParentNode(player, function (parent) {
				if (parent === document || !parent.getBoundingClientRect) return
				const parentBox = parent.getBoundingClientRect();
				if (parentBox.width && parentBox.height) {
					if (parentBox.width === playerBox.width && parentBox.height === playerBox.height) {
						wrapDom = parent;
					}
				}
			});
			return wrapDom
		},
		async mountToGlobal() {
			try {
				const pageWindow = await getPageWindow();
				if (pageWindow) {
					pageWindow._h5Player = h5Player || 'null';
					if (window.top !== window) {
						pageWindow._h5PlayerInFrame = h5Player || 'null';
					}
					pageWindow._window = window || '';
					debug.log('h5Player The object has been successfully mounted globally');
				}
			} catch (e) {
				debug.error(e);
			}
		},
		initPlayerInstance(isSingle) {
			const t = this;
			if (!t.playerInstance) return
			const player = t.playerInstance;
			t.initPlaybackRate();
			t.isFoucs();
			t.proxyPlayerInstance(player);
			player._fullScreen_ = new FullScreen(player);
			player._fullPageScreen_ = new FullScreen(player, true);
			player._listenerProxyApplyHandler_ = t.playerEventHandler;
			if (!player._hasCanplayEvent_) {
				player.addEventListener('canplay', function (event) {
					t.initAutoPlay(player);
				});
				player._hasCanplayEvent_ = true;
			}
			if (!player._hasPlayingInitEvent_) {
				let setPlaybackRateOnPlayingCount = 0;
				player.addEventListener('playing', function (event) {
					if (setPlaybackRateOnPlayingCount === 0) {
						t.setPlaybackRate();
						if (isSingle === true) {
							t.setPlayProgress(player);
							setTimeout(function () {
								t.playProgressRecorder(player);
							}, 1000 * 3);
						}
					} else {
						t.setPlaybackRate(null, true);
					}
					setPlaybackRateOnPlayingCount += 1;
				});
				player._hasPlayingInitEvent_ = true;
			}
			const taskConf = TCC.getTaskConfig();
			if (taskConf.init) {
				TCC.doTask('init', player);
			}
			mouseObserver.on(player, 'click', function (event, offset, target) {});
			debug.isDebugMode() && t.mountToGlobal();
		},
		proxyPlayerInstance(player) {
			if (!player) return
			const proxyList = [
				'play',
				'pause'
			];
			proxyList.forEach(key => {
				const originKey = 'origin_' + key;
				if (Reflect.has(player, key) && !Reflect.has(player, originKey)) {
					player[originKey] = player[key];
					const proxy = new Proxy(player[key], {
						apply(target, ctx, args) {
							debug.log(key + 'Called');
							const hangUpInfo = player._hangUpInfo_ || {};
							const hangUpDetail = hangUpInfo[key] || hangUpInfo['hangUp_' + key];
							const needHangUp = hangUpDetail && hangUpDetail.timeout >= Date.now();
							if (needHangUp) {
								debug.log(key + 'Has been suspended, this call will be ignored');
								return false
							}
							return target.apply(ctx || player, args)
						}
					});
					player[key] = proxy;
				}
			});
			if (!player._hangUp_) {
				player._hangUpInfo_ = {};
				player._hangUp_ = function (name, timeout) {
					timeout = Number(timeout) || 200;
					debug.log('_hangUp_', name, timeout);
					player._hangUpInfo_[name] = {
						timeout: Date.now() + timeout
					};
				};
			}
		},
		initPlaybackRate() {
			const t = this;
			t.playbackRate = t.getPlaybackRate();
		},
		getPlaybackRate() {
			const t = this;
			let playbackRate = t.playbackRate;
			if (!isInCrossOriginFrame()) {
				playbackRate = window.localStorage.getItem('_h5_player_playback_rate_') || t.playbackRate;
			}
			return Number(Number(playbackRate)
				.toFixed(1))
		},
		setPlaybackRate: function (num, notips) {
			const taskConf = TCC.getTaskConfig();
			if (taskConf.playbackRate) {
				TCC.doTask('playbackRate');
				return
			}
			const t = this;
			const player = t.player();
			let curPlaybackRate;
			if (num) {
				num = Number(num);
				if (Number.isNaN(num)) {
					debug.error('h5player: Error in playback speed conversion');
					return false
				}
				if (num <= 0) {
					num = 0.1;
				} else if (num > 16) {
					num = 16;
				}
				num = Number(num.toFixed(1));
				curPlaybackRate = num;
			} else {
				curPlaybackRate = t.getPlaybackRate();
			}!isInCrossOriginFrame() && window.localStorage.setItem('_h5_player_playback_rate_', curPlaybackRate);
			t.playbackRate = curPlaybackRate;
			player.playbackRate = curPlaybackRate;
			if (!num && curPlaybackRate === 1) {
				return
			} else {
				!notips && t.tips(i18n.t('tipsMsg.playspeed') + player.playbackRate);
			}
		},
		resetPlaybackRate: function (player) {
			const t = this;
			player = player || t.player();
			const oldPlaybackRate = Number(player.playbackRate);
			const playbackRate = oldPlaybackRate === 1 ? t.lastPlaybackRate : 1;
			if (oldPlaybackRate !== 1) {
				t.lastPlaybackRate = oldPlaybackRate;
			}
			player.playbackRate = playbackRate;
			t.setPlaybackRate(player.playbackRate);
		},
		initAutoPlay: function (p) {
			const t = this;
			const player = p || t.player();
			if (!player || (p && p !== t.player()) || document.hidden) return
			const taskConf = TCC.getTaskConfig();
			if (player && taskConf.autoPlay && player.paused) {
				TCC.doTask('autoPlay');
				if (player.paused) {
					if (!player._initAutoPlayCount_) {
						player._initAutoPlayCount_ = 1;
					}
					player._initAutoPlayCount_ += 1;
					if (player._initAutoPlayCount_ >= 10) {
						return false
					}
					setTimeout(function () {
						t.initAutoPlay(player);
					}, 200);
				}
			}
		},
		setWebFullScreen: function () {
			const t = this;
			const player = t.player();
			const isDo = TCC.doTask('webFullScreen');
			if (!isDo && player && player._fullPageScreen_) {
				player._fullPageScreen_.toggle();
			}
		},
		setCurrentTime: function (num, notips) {
			if (!num) return
			num = Number(num);
			const _num = Math.abs(Number(num.toFixed(1)));
			const t = this;
			const player = t.player();
			const taskConf = TCC.getTaskConfig();
			if (taskConf.currentTime) {
				TCC.doTask('currentTime');
				return
			}
			if (num > 0) {
				if (taskConf.addCurrentTime) {
					TCC.doTask('addCurrentTime');
				} else {
					player.currentTime += _num;
					!notips && t.tips(i18n.t('tipsMsg.forward') + _num + i18n.t('tipsMsg.seconds'));
				}
			} else {
				if (taskConf.subtractCurrentTime) {
					TCC.doTask('subtractCurrentTime');
				} else {
					player.currentTime -= _num;
					!notips && t.tips(i18n.t('tipsMsg.backward') + _num + i18n.t('tipsMsg.seconds'));
				}
			}
		},
		setVolume: function (num) {
			if (!num) return
			const t = this;
			const player = t.player();
			num = Number(num);
			const _num = Math.abs(Number(num.toFixed(2)));
			const curVol = player.volume;
			let newVol = curVol;
			if (num > 0) {
				newVol += _num;
				if (newVol > 1) {
					newVol = 1;
				}
			} else {
				newVol -= _num;
				if (newVol < 0) {
					newVol = 0;
				}
			}
			player.volume = newVol;
			player.muted = false;
			t.tips(i18n.t('tipsMsg.volume') + parseInt(player.volume * 100) + '%');
		},
		setTransform(scale, translate) {
			const t = this;
			const player = t.player();
			scale = t.scale = typeof scale === 'undefined' ? t.scale : Number(scale)
				.toFixed(1);
			translate = t.translate = translate || t.translate;
			player.style.transform = `scale(${scale}) translate(${translate.x}px, ${translate.y}px) rotate(${t.rotate}deg)`;
			let tipsMsg = i18n.t('tipsMsg.videozoom') + `${scale * 100}%`;
			if (translate.x) {
				tipsMsg += ` ${i18n.t('tipsMsg.horizontal')}${t.translate.x}px`;
			}
			if (translate.y) {
				tipsMsg += ` ${i18n.t('tipsMsg.vertical')}${t.translate.y}px`;
			}
			t.tips(tipsMsg);
		},
		freezeFrame(perFps) {
			perFps = perFps || 1;
			const t = this;
			const player = t.player();
			player.currentTime += Number(perFps / t.fps);
			if (!player.paused) player.pause();
			player._hangUp_ && player._hangUp_('play', 400);
			if (perFps === 1) {
				t.tips(i18n.t('tipsMsg.nextframe'));
			} else if (perFps === -1) {
				t.tips(i18n.t('tipsMsg.previousframe'));
			} else {
				t.tips(i18n.t('tipsMsg.stopframe') + perFps);
			}
		},
		setNextVideo() {
			const isDo = TCC.doTask('next');
			if (!isDo) {
				debug.log('The current webpage does not support the function of playing the next video with one click');
			}
		},
		setFakeUA(ua) {
			ua = ua || userAgentMap.iPhone.safari;
			!isInCrossOriginFrame() && window.localStorage.setItem('_h5_player_user_agent_', ua);
			fakeUA(ua);
		},
		switchFakeUA(ua) {
			const customUA = isInCrossOriginFrame() ? null : window.localStorage.getItem('_h5_player_user_agent_');
			if (customUA) {
				!isInCrossOriginFrame() && window.localStorage.removeItem('_h5_player_user_agent_');
			} else {
				this.setFakeUA(ua);
			}
			debug.log('ua', navigator.userAgent);
		},
		switchPlayStatus() {
			const t = this;
			const player = t.player();
			const taskConf = TCC.getTaskConfig();
			if (taskConf.switchPlayStatus) {
				TCC.doTask('switchPlayStatus');
				return
			}
			if (player.paused) {
				if (taskConf.play) {
					TCC.doTask('play');
				} else {
					player.play();
					t.tips(i18n.t('tipsMsg.play'));
				}
			} else {
				if (taskConf.pause) {
					TCC.doTask('pause');
				} else {
					player.pause();
					t.tips(i18n.t('tipsMsg.pause'));
				}
			}
		},
		isAllowRestorePlayProgress: function () {
			const keyName = '_allowRestorePlayProgress_' + window.location.host;
			const allowRestorePlayProgressVal = window.GM_getValue(keyName);
			return !allowRestorePlayProgressVal || allowRestorePlayProgressVal === 'true'
		},
		switchRestorePlayProgressStatus: function () {
			const t = h5Player;
			let isAllowRestorePlayProgress = t.isAllowRestorePlayProgress();
			isAllowRestorePlayProgress = !isAllowRestorePlayProgress;
			const keyName = '_allowRestorePlayProgress_' + window.location.host;
			window.GM_setValue(keyName, String(isAllowRestorePlayProgress));
			if (isAllowRestorePlayProgress) {
				t.tips(i18n.t('tipsMsg.arpl'));
				t.setPlayProgress(t.player());
			} else {
				t.tips(i18n.t('tipsMsg.drpl'));
			}
		},
		tipsClassName: 'html_player_enhance_tips',
		getTipsContainer: function () {
			const t = h5Player;
			const player = t.player();
			// const _tispContainer_ = player._tispContainer_  ||  getContainer(player);
			let tispContainer = player._tispContainer_ || player.parentNode;
			const containerBox = tispContainer.getBoundingClientRect();
			if ((!containerBox.width || !containerBox.height) && tispContainer.parentNode) {
				tispContainer = tispContainer.parentNode;
			}
			if (!player._tispContainer_) {
				player._tispContainer_ = tispContainer;
			}
			return tispContainer
		},
		tips: function (str) {
			const t = h5Player;
			const player = t.player();
			if (!player) {
				debug.log('h5Player Tips:', str);
				return true
			}
			const parentNode = t.getTipsContainer();
			const defStyle = parentNode.getAttribute('style') || '';
			let backupStyle = parentNode.getAttribute('style-backup') || '';
			if (!backupStyle) {
				parentNode.setAttribute('style-backup', defStyle || 'style-backup:none');
				backupStyle = defStyle;
			}
			const newStyleArr = backupStyle.split(';');
			const oldPosition = parentNode.getAttribute('def-position') || window.getComputedStyle(parentNode)
				.position;
			if (parentNode.getAttribute('def-position') === null) {
				parentNode.setAttribute('def-position', oldPosition || '');
			}
			if (['static', 'inherit', 'initial', 'unset', ''].includes(oldPosition)) {
				newStyleArr.push('position: relative');
			}
			const playerBox = player.getBoundingClientRect();
			const parentNodeBox = parentNode.getBoundingClientRect();
			if (!parentNodeBox.width || !parentNodeBox.height) {
				newStyleArr.push('min-width:' + playerBox.width + 'px');
				newStyleArr.push('min-height:' + playerBox.height + 'px');
			}
			parentNode.setAttribute('style', newStyleArr.join(';'));
			const tipsSelector = '.' + t.tipsClassName;
			let tipsDom = parentNode.querySelector(tipsSelector);
			if (!tipsDom) {
				t.initTips();
				tipsDom = parentNode.querySelector(tipsSelector);
				if (!tipsDom) {
					debug.log('init h5player tips dom error...');
					return false
				}
			}
			const style = tipsDom.style;
			tipsDom.innerText = str;
			for (var i = 0; i < 3; i++) {
				if (this.on_off[i]) clearTimeout(this.on_off[i]);
			}

			function showTips() {
				style.display = 'block';
				t.on_off[0] = setTimeout(function () {
					style.opacity = 1;
				}, 50);
				t.on_off[1] = setTimeout(function () {
					style.opacity = 0;
					style.display = 'none';
					if (backupStyle && backupStyle !== 'style-backup:none') {
						parentNode.setAttribute('style', backupStyle);
					}
				}, 2000);
			}
			if (style.display === 'block') {
				style.display = 'none';
				clearTimeout(this.on_off[3]);
				t.on_off[2] = setTimeout(function () {
					showTips();
				}, 100);
			} else {
				showTips();
			}
		},
		initTips: function () {
			const t = h5Player;
			const parentNode = t.getTipsContainer();
			if (parentNode.querySelector('.' + t.tipsClassName)) return
			// top: 50%;
			// left: 50%;
			// transform: translate(-50%,-50%);
			const tipsStyle = `
        position: absolute;
        z-index: 999999;
        font-size: ${t.fontSize}px;
        padding: 5px 10px;
        background: rgba(0,0,0,0.4);
        color:white;
        top: 0;
        left: 0;
        transition: all 500ms ease;
        opacity: 0;
        border-bottom-right-radius: 5px;
        display: none;
        -webkit-font-smoothing: subpixel-antialiased;
        font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;
        -webkit-user-select: none;
      `;
			const tips = document.createElement('div');
			tips.setAttribute('style', tipsStyle);
			tips.setAttribute('class', t.tipsClassName);
			parentNode.appendChild(tips);
		},
		on_off: new Array(3),
		rotate: 0,
		fps: 30,
		filter: {
			key: [1, 1, 1, 0, 0],
			setup: function () {
				var view = 'brightness({0}) contrast({1}) saturate({2}) hue-rotate({3}deg) blur({4}px)';
				for (var i = 0; i < 5; i++) {
					view = view.replace('{' + i + '}', String(this.key[i]));
					this.key[i] = Number(this.key[i]);
				}
				h5Player.player()
					.style.filter = view;
			},
			reset: function () {
				this.key[0] = 1;
				this.key[1] = 1;
				this.key[2] = 1;
				this.key[3] = 0;
				this.key[4] = 0;
				this.setup();
			}
		},
		_isFoucs: false,
		isFoucs: function () {
			const t = h5Player;
			const player = t.player();
			if (!player) return
			player.onmouseenter = function (e) {
				h5Player._isFoucs = true;
			};
			player.onmouseleave = function (e) {
				h5Player._isFoucs = false;
			};
		},
		palyerTrigger: function (player, event) {
			if (!player || !event) return
			const t = h5Player;
			const keyCode = event.keyCode;
			const key = event.key.toLowerCase();
			if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
				if (key === 'enter') {
					t.setWebFullScreen();
				}
				if (key === 'p') {
					if (window._isPictureInPicture_) {
						document.exitPictureInPicture()
							.then(() => {
								window._isPictureInPicture_ = null;
							})
							.catch(() => {
								window._isPictureInPicture_ = null;
							});
					} else {
						player.requestPictureInPicture && player.requestPictureInPicture()
							.then(() => {
								window._isPictureInPicture_ = true;
							})
							.catch(() => {
								window._isPictureInPicture_ = null;
							});
					}
				}
				if (key === 's') {
					videoCapturer.capture(player, true);
				}
				if (key === 'r') {
					t.switchRestorePlayProgressStatus();
				}
				const allowKeys = ['x', 'c', 'z', 'arrowright', 'arrowleft', 'arrowup', 'arrowdown'];
				if (!allowKeys.includes(key)) return
				t.scale = Number(t.scale);
				switch (key) {
					case 'x':
						t.scale -= 0.1;
						break
					case 'c':
						t.scale += 0.1;
						break
					case 'z':
						t.scale = 1;
						t.translate = {
							x: 0,
							y: 0
						};
						break
					case 'arrowright':
						t.translate.x += 10;
						break
					case 'arrowleft':
						t.translate.x -= 10;
						break
					case 'arrowup':
						t.translate.y -= 10;
						break
					case 'arrowdown':
						t.translate.y += 10;
						break
				}
				t.setTransform(t.scale, t.translate);
				event.stopPropagation();
				event.preventDefault();
				return true
			}
			if (event.ctrlKey && keyCode === 39) {
				t.setCurrentTime(t.skipStep2);
			}
			if (event.ctrlKey && keyCode === 37) {
				t.setCurrentTime(-t.skipStep2);
			}
			if (event.ctrlKey && keyCode === 38) {
				t.setVolume(0.2);
			}
			if (event.ctrlKey && keyCode === 40) {
				t.setVolume(-0.2);
			}
			if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return
			if (keyCode === 39) {
				t.setCurrentTime(t.skipStep);
			}
			if (keyCode === 37) {
				t.setCurrentTime(-t.skipStep);
			}
			if (keyCode === 38) {
				t.setVolume(0.1);
			}
			if (keyCode === 40) {
				t.setVolume(-0.1);
			}
			if (keyCode === 32) {
				t.switchPlayStatus();
			}
			if (keyCode === 88) {
				t.setPlaybackRate(player.playbackRate - 0.1);
			}
			if (keyCode === 67) {
				t.setPlaybackRate(player.playbackRate + 0.1);
			}
			if (keyCode === 90) {
				t.resetPlaybackRate();
			}
			if ((keyCode >= 49 && keyCode <= 52) || (keyCode >= 97 && keyCode <= 100)) {
				t.setPlaybackRate(event.key);
			}
			if (keyCode === 70) {
				if (window.location.hostname === 'www.netflix.com') {
					return
				}
				t.freezeFrame(1);
			}
			if (keyCode === 68) {
				t.freezeFrame(-1);
			}
			if (keyCode === 69) {
				t.filter.key[0] += 0.1;
				t.filter.key[0] = t.filter.key[0].toFixed(2);
				t.filter.setup();
				t.tips(i18n.t('tipsMsg.brightness') + parseInt(t.filter.key[0] * 100) + '%');
			}
			if (keyCode === 87) {
				if (t.filter.key[0] > 0) {
					t.filter.key[0] -= 0.1;
					t.filter.key[0] = t.filter.key[0].toFixed(2);
					t.filter.setup();
				}
				t.tips(i18n.t('tipsMsg.brightness') + parseInt(t.filter.key[0] * 100) + '%');
			}
			if (keyCode === 84) {
				t.filter.key[1] += 0.1;
				t.filter.key[1] = t.filter.key[1].toFixed(2);
				t.filter.setup();
				t.tips(i18n.t('tipsMsg.contrast') + parseInt(t.filter.key[1] * 100) + '%');
			}
			if (keyCode === 82) {
				if (t.filter.key[1] > 0) {
					t.filter.key[1] -= 0.1;
					t.filter.key[1] = t.filter.key[1].toFixed(2);
					t.filter.setup();
				}
				t.tips(i18n.t('tipsMsg.contrast') + parseInt(t.filter.key[1] * 100) + '%');
			}
			if (keyCode === 85) {
				t.filter.key[2] += 0.1;
				t.filter.key[2] = t.filter.key[2].toFixed(2);
				t.filter.setup();
				t.tips(i18n.t('tipsMsg.saturation') + parseInt(t.filter.key[2] * 100) + '%');
			}
			if (keyCode === 89) {
				if (t.filter.key[2] > 0) {
					t.filter.key[2] -= 0.1;
					t.filter.key[2] = t.filter.key[2].toFixed(2);
					t.filter.setup();
				}
				t.tips(i18n.t('tipsMsg.saturation') + parseInt(t.filter.key[2] * 100) + '%');
			}
			if (keyCode === 79) {
				t.filter.key[3] += 1;
				t.filter.setup();
				t.tips(i18n.t('tipsMsg.hue') + t.filter.key[3] + '°');
			}
			if (keyCode === 73) {
				t.filter.key[3] -= 1;
				t.filter.setup();
				t.tips(i18n.t('tipsMsg.hue') + t.filter.key[3] + '°');
			}
			if (keyCode === 75) {
				t.filter.key[4] += 1;
				t.filter.setup();
				t.tips(i18n.t('tipsMsg.blur') + t.filter.key[4] + 'PX');
			}
			if (keyCode === 74) {
				if (t.filter.key[4] > 0) {
					t.filter.key[4] -= 1;
					t.filter.setup();
				}
				t.tips(i18n.t('tipsMsg.blur') + t.filter.key[4] + 'PX');
			}
			if (keyCode === 81) {
				t.filter.reset();
				t.tips(i18n.t('tipsMsg.imgattrreset'));
			}
			if (keyCode === 83) {
				t.rotate += 90;
				if (t.rotate % 360 === 0) t.rotate = 0;
				player.style.transform = `scale(${t.scale}) translate(${t.translate.x}px, ${t.translate.y}px) rotate( ${t.rotate}deg)`;
				t.tips(i18n.t('tipsMsg.imgrotate') + t.rotate + '°');
			}
			if (keyCode === 13) {
				const isDo = TCC.doTask('fullScreen');
				if (!isDo && player._fullScreen_) {
					player._fullScreen_.toggle();
				}
			}
			if (key === 'n') {
				t.setNextVideo();
			}
			event.stopPropagation();
			event.preventDefault();
			return true
		},
		runCustomShortcuts: function (player, event) {
			if (!player || !event) return
			const key = event.key.toLowerCase();
			const taskConf = TCC.getTaskConfig();
			const confIsCorrect = isObj(taskConf.shortcuts) && Array.isArray(taskConf.shortcuts.register) && taskConf.shortcuts.callback instanceof Function;

			function isRegister() {
				const list = taskConf.shortcuts.register;
				const combineKey = [];
				if (event.ctrlKey) {
					combineKey.push('ctrl');
				}
				if (event.shiftKey) {
					combineKey.push('shift');
				}
				if (event.altKey) {
					combineKey.push('alt');
				}
				if (event.metaKey) {
					combineKey.push('command');
				}
				combineKey.push(key);
				let hasReg = false;
				list.forEach((shortcut) => {
					const regKey = shortcut.split('+');
					if (combineKey.length === regKey.length) {
						let allMatch = true;
						regKey.forEach((key) => {
							if (!combineKey.includes(key)) {
								allMatch = false;
							}
						});
						if (allMatch) {
							hasReg = true;
						}
					}
				});
				return hasReg
			}
			if (confIsCorrect && isRegister()) {
				const isDo = TCC.doTask('shortcuts', {
					event,
					player,
					h5Player
				});
				if (isDo) {
					event.stopPropagation();
					event.preventDefault();
				}
				return isDo
			} else {
				return false
			}
		},
		keydownEvent: function (event) {
			const t = h5Player;
			const keyCode = event.keyCode;
			const player = t.player();
			if (isEditableTarget(event.target)) return
			if (event.shiftKey && keyCode === 70) {
				t.switchFakeUA();
			}
			if (!isRegisterKey(event)) return
			monkeyMsg.send('globalKeydownEvent', event);
			if (!player) {
				return
			}
			if (event.ctrlKey && keyCode === 32) {
				t.enable = !t.enable;
				if (t.enable) {
					t.tips(i18n.t('tipsMsg.onplugin'));
				} else {
					t.tips(i18n.t('tipsMsg.offplugin'));
				}
			}
			if (!t.enable) {
				debug.log('h5Player disabled');
				return false
			}
			if (event.ctrlKey && keyCode === 220) {
				t.globalMode = !t.globalMode;
				if (t.globalMode) {
					t.tips(i18n.t('tipsMsg.globalmode') + ' ON');
				} else {
					t.tips(i18n.t('tipsMsg.globalmode') + ' OFF');
				}
			}
			if (!t.globalMode && !t._isFoucs) return
			if (t.runCustomShortcuts(player, event) === true) return
			t.palyerTrigger(player, event);
		},
		getPlayProgress: function (player) {
			let progressMap = isInCrossOriginFrame() ? null : window.localStorage.getItem('_h5_player_play_progress_');
			if (!progressMap) {
				progressMap = {};
			} else {
				progressMap = JSON.parse(progressMap);
			}
			if (!player) {
				return progressMap
			} else {
				let keyName = window.location.href || player.src;
				keyName += player.duration;
				if (progressMap[keyName]) {
					return progressMap[keyName].progress
				} else {
					return player.currentTime
				}
			}
		},
		playProgressRecorder: function (player) {
			const t = h5Player;
			clearTimeout(player._playProgressTimer_);

			function recorder(player) {
				player._playProgressTimer_ = setTimeout(function () {
					if (!t.isAllowRestorePlayProgress()) {
						recorder(player);
						return true
					}
					const progressMap = t.getPlayProgress() || {};
					const list = Object.keys(progressMap);
					let keyName = window.location.href || player.src;
					keyName += player.duration;
					if (list.length > 10) {
						let timeList = [];
						list.forEach(function (keyName) {
							progressMap[keyName] && progressMap[keyName].t && timeList.push(progressMap[keyName].t);
						});
						timeList = quickSort(timeList);
						const timestamp = timeList[0];
						list.forEach(function (keyName) {
							if (progressMap[keyName].t === timestamp) {
								delete progressMap[keyName];
							}
						});
					}
					progressMap[keyName] = {
						progress: player.currentTime,
						t: new Date()
							.getTime()
					};
					!isInCrossOriginFrame() && window.localStorage.setItem('_h5_player_play_progress_', JSON.stringify(progressMap));
					recorder(player);
				}, 1000 * 2);
			}
			recorder(player);
		},
		setPlayProgress: function (player, time) {
			const t = h5Player;
			if (!player) return
			const curTime = Number(t.getPlayProgress(player));
			if (!curTime || Number.isNaN(curTime)) return
			if (t.isAllowRestorePlayProgress()) {
				player.currentTime = curTime || player.currentTime;
				if (curTime > 3) {
					t.tips(i18n.t('tipsMsg.playbackrestored'));
				}
			} else {
				t.tips(i18n.t('tipsMsg.playbackrestoreoff'));
			}
		},
		detecH5Player: function () {
			const t = this;
			const playerList = t.getPlayerList();
			if (playerList.length) {
				debug.log('HTML5 video detected!');
				if (playerList.length === 1) {
					t.playerInstance = playerList[0];
					t.initPlayerInstance(true);
				} else {
					playerList.forEach(function (player) {
						if (player._hasMouseRedirectEvent_) return
						player.addEventListener('mouseenter', function (event) {
							t.playerInstance = event.target;
							t.initPlayerInstance(false);
						});
						player._hasMouseRedirectEvent_ = true;
						if (player._hasPlayingRedirectEvent_) return
						player.addEventListener('playing', function (event) {
							t.playerInstance = event.target;
							t.initPlayerInstance(false);
							t.setPlaybackRate();
						});
						player._hasPlayingRedirectEvent_ = true;
					});
				}
			}
		},
		_hangUpPlayerEventList_: [],
		hangUpPlayerEvent(eventType, timeout) {
			const t = h5Player;
			t._hangUpPlayerEventList_ = t._hangUpPlayerEventList_ || [];
			eventType = Array.isArray(eventType) ? eventType : [eventType];
			timeout = timeout || 200;
			eventType.forEach(type => {
				if (!t._hangUpPlayerEventList_.includes(type)) {
					t._hangUpPlayerEventList_.push(type);
				}
			});
			clearTimeout(t._hangUpPlayerEventTimer_);
			t._hangUpPlayerEventTimer_ = setTimeout(function () {
				const newList = [];
				t._hangUpPlayerEventList_.forEach(cancelType => {
					if (!eventType.includes(cancelType)) {
						newList.push(cancelType);
					}
				});
				t._hangUpPlayerEventList_ = newList;
			}, timeout);
		},
		playerEventHandler(target, ctx, args, listenerArgs) {
			const t = h5Player;
			const eventType = listenerArgs[0];
			if (t._hangUpPlayerEventList_.includes(eventType) || t._hangUpPlayerEventList_.includes('all')) {
				debug.log(`Player [${eventType}] event was cancelled`);
				return false
			}
		},
		bindEvent: function () {
			const t = this;
			if (t._hasBindEvent_) return
			document.removeEventListener('keydown', t.keydownEvent);
			document.addEventListener('keydown', t.keydownEvent, true);
			if (isInIframe() && !isInCrossOriginFrame()) {
				window.top.document.removeEventListener('keydown', t.keydownEvent);
				window.top.document.addEventListener('keydown', t.keydownEvent, true);
			}
			monkeyMsg.on('globalKeydownEvent', async(name, oldVal, newVal, remote) => {
				const tabId = await getTabId();
				const triggerFakeEvent = throttle(function () {
					const player = t.player();
					if (player) {
						const fakeEvent = newVal.data;
						fakeEvent.stopPropagation = () => {};
						fakeEvent.preventDefault = () => {};
						t.palyerTrigger(player, fakeEvent);
						debug.log('Simulation trigger operation succeeded');
					}
				}, 80);
				if (remote) {
					if (isInCrossOriginFrame()) {
						if (newVal.tabId === tabId && document.visibilityState === 'visible') {
							triggerFakeEvent();
						}
					} else if (crossTabCtl.hasOpenPictureInPicture() && document.pictureInPictureElement) {
						if (tabId !== newVal.tabId) {
							triggerFakeEvent();
							debug.log('Cross-tab key control information has been received:', newVal);
						}
					}
				}
			});
			t._hasBindEvent_ = true;
		},
		init: function (global) {
			var t = this;
			if (global) {
				t.bindEvent();
				const host = window.location.host;
				if (fakeConfig[host]) {
					t.setFakeUA(fakeConfig[host]);
				}
			} else {
				t.detecH5Player();
			}
		},
		load: false
	};
	TCC = h5PlayerTccInit(h5Player);
	try {
		h5Player.init(true);
		ready('video', function () {
			h5Player.init();
		});
		document.addEventListener('addShadowRoot', function (e) {
			const shadowRoot = e.detail.shadowRoot;
			ready('video', function (element) {
				h5Player.init();
			}, shadowRoot);
		});
		if (isInCrossOriginFrame()) {
			debug.log('Currently in an Iframe with limited cross-domain, h5Player related functions may not be enabled normally');
		}
		crossTabCtl.init();
	} catch (e) {
		debug.error(e);
	}
})();