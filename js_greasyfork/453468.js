// ==UserScript==
// @name                Bilibili Live Banned Danmaku Marker
// @name:zh-CN          哔哩哔哩直播 被吞弹幕标记
// @name:zh-TW          嗶哩嗶哩直播 烙賽彈幕標記
// @description         You sent banned danmakus will be add strikethrough line.
// @description:zh-CN   在B站直播发送弹幕时，被吞的弹幕会被划线，蜀黍吞的会变红，主播吞的会变黄。
// @description:zh-TW   在B站直播發送彈幕時，被封鎖的彈幕會被劃線。
// @version             0.5
// @author              Yulon
// @namespace           https://github.com/yulon
// @icon                https://www.bilibili.com/favicon.ico
// @license             MIT
// @match               *://live.bilibili.com/*
// @grant               unsafeWindow
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/453468/Bilibili%20Live%20Banned%20Danmaku%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/453468/Bilibili%20Live%20Banned%20Danmaku%20Marker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function parseJson(t) {
		if (!t || t.length === 0) {
			return null
		}
		try {
			return JSON.parse(t)
		} catch (e) {
			return null
		}
	}

	function FetchHook(onResp, urlFilter, gThis) {
        if (!gThis) {
            gThis = window
        }

        const th1s = this

        this.fetch = gThis.fetch

        gThis.fetch = function (url) {
            const prm = th1s.fetch.apply(this, arguments)
            if (urlFilter && (typeof url !== 'string' || !urlFilter(url))) {
                return prm
            }
            return prm.then((resp) => resp.text().then((t) => {
                t = onResp(t, url, th1s.fetch)
                resp.json = function () {
                    try {
                        return Promise.resolve(JSON.parse(t))
                    } catch (e) {
                        return Promise.reject(e)
                    }
                }
                resp.text = function () {
                    return Promise.resolve(t)
                }
                return resp
            }))
        }

        const xhrPt = gThis.XMLHttpRequest.prototype
        const xhrOpen = xhrPt.open
        const xhrSend = xhrPt.send

        this.newXMLHttpRequest = function () {
            let xhr = new XMLHttpRequest()
            xhr.open = xhrOpen
            xhr.send = xhrSend
            return xhr
        }

        xhrPt.open = function (method, url, async, user, password) {
            if ((typeof url === 'string' && urlFilter(url)) || !urlFilter) {
                this._fetchHookUrl = url
                this._fetchHookAsync = async
            }
            return xhrOpen.apply(this, arguments)
        }

        const onreadystatechangeHook = function () {
            if (this.readyState === 4 && this.status === 200) {
                let newVal = onResp(this.responseText, this._fetchHookUrl, this.fetch)
                if (newVal !== this.responseText) {
                    Object.defineProperty(this, 'responseText', {
                        value: newVal
                    })
                }
            }
            if (!this._fetchHookOnreadystatechange) {
                return
            }
            return this._fetchHookOnreadystatechange.apply(this, arguments)
        }

        xhrPt.send = function () {
            if (!('_fetchHookUrl' in this)) {
                return xhrSend.apply(this, arguments)
            }
            if (this._fetchHookAsync) {
                this._fetchHookOnreadystatechange = this.onreadystatechange
                this.onreadystatechange = onreadystatechangeHook
                return xhrSend.apply(this, arguments)
            }
            const r = xhrSend.apply(this, arguments)
            if (this.status === 200) {
                let newVal = onResp(this.responseText, this._fetchHookUrl, this.fetch)
                if (newVal !== this.responseText) {
                    Object.defineProperty(this, 'responseText', {
                        value: newVal
                    })
                }
            }
            return r
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
		const cont = getContent(r)
		if (!cont) {
			return
		}
		;(function lineThrough() {
			const danmakus = document.querySelectorAll('#chat-items .danmaku-item-right')
			for (let danmaku of danmakus) {
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

	new FetchHook(
		(t) => {
            checkContent(parseJson(t))
            return t
        },
		(url) => url.indexOf('api.live.bilibili.com/msg/send') >= 0,
		unsafeWindow
	)
})();
