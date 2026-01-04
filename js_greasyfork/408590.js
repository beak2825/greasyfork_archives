// ==UserScript==
// @name         zhenbuka
// @namespace    zhenbuka.com
// @version      0.4
// @description  真不卡去视频广告
// @author       pq
// @match        *.zhenbuka.com/vodplay/*
// @match        *.nixingle.com*
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/408590/zhenbuka.user.js
// @updateURL https://update.greasyfork.org/scripts/408590/zhenbuka.meta.js
// ==/UserScript==

'use strict';

let value = ''

function hook() {
	let _MacPlayer = window.MacPlayer
	Object.defineProperty(_MacPlayer, 'Html', {
		set: (e)=>{
			value = e.replace('player', 'bPlayer/player')
			return value
		},
		get: (e)=>{
			return value
		}
	})
}

function zbkTools() {
    setTimeout(function findPlayer(){
		let _MacPlayer = window.MacPlayer
		if (!_MacPlayer) {
			setTimeout(findPlayer, 100)
			return
		}
		hook()
    })
}

(()=>{
 zbkTools()
})();