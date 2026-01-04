// ==UserScript==
// @name        ニコニコ動画/生放送 - Firefox Nightly OffscreenCanvas workaround
// @namespace   https://rinsuki.net
// @match       https://www.nicovideo.jp/*
// @match       https://live.nicovideo.jp/*
// @grant       none
// @version     1.0.1
// @author      rinsuki
// @description Firefox Nightly で OffscreenCanvas が有効化されたことによってニコニコ動画/生放送のコメントが描画されなくなった不具合を修正するためのパッチです。
// @run-at      document-idle
// @license     public domain
// @downloadURL https://update.greasyfork.org/scripts/437408/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E7%94%9F%E6%94%BE%E9%80%81%20-%20Firefox%20Nightly%20OffscreenCanvas%20workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/437408/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E7%94%9F%E6%94%BE%E9%80%81%20-%20Firefox%20Nightly%20OffscreenCanvas%20workaround.meta.js
// ==/UserScript==

if ("OffscreenCanvas" in window) {
    try {
        const canvas = new OffscreenCanvas(1, 1)
        const ctx = canvas.getContext("2d")
        if (ctx.measureText("text").width < 1) throw new Error("measureText not working")
    } catch(e) {
      	console.log("try to remove OffscreenCanvas...")
        delete window.OffscreenCanvas
      	try {
          	// for Greasemonkey
          	delete unsafeWindow.OffscreenCanvas
        } catch(e) {
        }
    }
}