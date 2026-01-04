// ==UserScript==
// @name                Bilibili Live Banned Danmaku Marker daiyufix20250415
// @name:zh-CN          哔哩哔哩直播 被吞敏感弹幕 标记提示 带鱼修复版20250415
// @name:zh-TW          嗶哩嗶哩直播 烙賽封鎖彈幕 標記小幫手 daiyufix20250415
// @description         You sent banned danmakus will be add strikethrough line.
// @description:zh-CN   在B站直播发送弹幕时，被吞的弹幕会被划线，蜀黍吞的会变红，主播吞的会变黄。
// @description:zh-TW   在B站直播發送彈幕時，被封鎖的彈幕會被劃線。
// @version             0.4.1
// @author              Yulon
// @namespace           https://github.com/yulon
// @icon                https://www.bilibili.com/favicon.ico
// @license             MIT
// @match               *://live.bilibili.com/*
// @grant               unsafeWindow
// @run-at              document-start
// @inject-into   page
// @downloadURL https://update.greasyfork.org/scripts/532939/Bilibili%20Live%20Banned%20Danmaku%20Marker%20daiyufix20250415.user.js
// @updateURL https://update.greasyfork.org/scripts/532939/Bilibili%20Live%20Banned%20Danmaku%20Marker%20daiyufix20250415.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function parseJson(t) {
        // console.log("will parseJson", t);
		if (!t || t.length === 0) {
			return null
		}
		try {
			return JSON.parse(t)
		} catch (e) {
			return null
		}
	}

	function hookHttpRequests(onResp, urlFilter, gThis) {
		if (!gThis) {
			gThis = window
		}

		const xhrPt = gThis.XMLHttpRequest.prototype
		const xhrPtOpen = xhrPt.open
		const xhrPtSend = xhrPt.send

		xhrPt.open = function(method, url, async, user, password) {
			if ((typeof url === 'string' && urlFilter(url)) || !urlFilter) {
				this._hookHttpRequestUrl = url
				this._hookHttpRequestAsync = async
			}
			return xhrPtOpen.apply(this, arguments)
		}

		const onreadystatechangeHook = function() {
			if (this.readyState === 4 && this.status === 200) {
				onResp(this.responseText, this._hookHttpRequestUrl)
			}
			return this._hookHttpRequestOnreadystatechange.apply(this, arguments)
		}

		xhrPt.send = function() {
			if (!('_hookHttpRequestUrl' in this)) {
				return xhrPtSend.apply(this, arguments)
			}
			if (this._hookHttpRequestAsync) {
				this._hookHttpRequestOnreadystatechange = this.onreadystatechange
				this.onreadystatechange = onreadystatechangeHook
				return xhrPtSend.apply(this, arguments)
			}
			const r = xhrPtSend.apply(this, arguments)
			if (this.status === 200) {
				onResp(this.responseText, this._hookHttpRequestUrl)
			}
			return r
		}

		const realFetch = gThis.fetch

		gThis.fetch = function(url) {
			const prm = realFetch.apply(this, arguments)
			if (urlFilter && (typeof url !== 'string' || !urlFilter(url))) {
				return prm
			}
			return prm.then((resp) => {
				return resp.text().then((t) => {
					onResp(t, url)
					resp.json = function() {
						try {
							return Promise.resolve(JSON.parse(t))
						} catch (e) {
							return Promise.reject(e)
						}
					}
					resp.text = function() {
						return Promise.resolve(t)
					}
					return resp
				})
			})
		}
	}

	function getContent(r) {
		if (
			r &&
			(('msg' in r && (r.msg === 'f' || r.msg === 'k')) || ('message' in r && (r.message === 'f' || r.message === 'k'))) &&
			'data' in r && 'mode_info' in r.data && 'extra' in r.data.mode_info
		) {
			const extra = parseJson(r.data.mode_info.extra)
			if (extra && 'content' in extra) {
				return extra.content
			}
		}
		return null
	}

	function checkContent(r) {
        // console.log('checkContent will getContent', r);
		const cont = getContent(r)
        // console.log('checkContent cont', cont);
		if (!cont) {
			return
		}
		;(function lineThrough() {
			const danmakus = document.querySelectorAll('#chat-items .danmaku-item-right')
			for (let danmaku of danmakus) {
                // console.log("danmaku.innerText", danmaku.innerText);
				if (danmaku.innerText === cont && !('_isMarked' in danmaku)) {
					let danmakuItem = danmaku.parentElement
					danmakuItem.style.textDecoration = 'line-through'
					let clr = ((('msg' in r && r.msg === 'f') || ('message' in r && r.message === 'f'))) ? 'red' : '#f09300'
					danmakuItem.style.color = clr
					let userName = danmakuItem.querySelector('.user-name')
					if (userName) {
						userName.style.color = clr
					}
                    danmaku._isMarked = true
					return
				}
			}
			setTimeout(lineThrough, 500)
		})()
	}

	hookHttpRequests(
		(t) => checkContent(parseJson(t)),
		(url) => {
  const s = url instanceof Request ? url.url : String(url);
  return /\/msg\/send(?:\?|$)/.test(s);
},
		unsafeWindow
	)
})();
