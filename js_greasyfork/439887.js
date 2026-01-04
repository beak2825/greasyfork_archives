// ==UserScript==
// @name        Comment Smoother for niconico live
// @description ニコニコ生放送のコメントをぬるぬるにします
// @namespace   https://rinsuki.net/
// @match       https://live.nicovideo.jp/watch/*
// @grant       none
// @version     1.0
// @author      rinsuki
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439887/Comment%20Smoother%20for%20niconico%20live.user.js
// @updateURL https://update.greasyfork.org/scripts/439887/Comment%20Smoother%20for%20niconico%20live.meta.js
// ==/UserScript==

(() => {
    if (!navigator.userAgent.includes("Firefox/")) return
    const origGetter = HTMLVideoElement.prototype.__lookupGetter__("currentTime")
    const origSetter = HTMLVideoElement.prototype.__lookupSetter__("currentTime")
    class Smoother {
        lastCurrentTime = 0
        lastNow = 0
        /**
         * @param {HTMLVideoElement} elm 
         */
        currentTime(elm) {
            const currentTime = origGetter.call(elm)
            if (elm.paused) {
                return currentTime
            }
            if (this.lastCurrentTime !== currentTime) {
                // 更新された
                this.lastCurrentTime = currentTime
                this.lastNow = performance.now()
                return currentTime
            }
            const now = performance.now()
            const diff = now - this.lastNow
            if (diff > 1000) {
                // 一秒ずれてるというのはおかしい…ので帰る
                return currentTime
            }
            const currentNow = this.lastCurrentTime + (diff / 1000)
            return currentNow
        }
    }
    if (origGetter != null && origSetter != null) {
        HTMLVideoElement.prototype.__defineGetter__("currentTime", function() {
            if (!("__userjs_smoother" in this)) {
                console.log("new smoother", this)
                this.__userjs_smoother = new Smoother()
            }
            return this.__userjs_smoother.currentTime(this)
        })
        HTMLVideoElement.prototype.__defineSetter__("currentTime", function() {
            origSetter.apply(this, arguments)
        })
    } else {
        console.log("[nicolive-comment-smoother]", "origGetter/origSetter is not available", origGetter, origSetter)
    }
})()
