// ==UserScript==
// @name         防止使用必应搜索时误触copilot!
// @name:zh         防止使用必应搜索时误触copilot!
// @name:en         To prevent accidental activation of Copilot when using Bing search!
// @name:ja         Bing検索を使用しているときにCopilotが誤って起動しないようにするために！
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  防止使用必应搜索时,使用滚轮上滑时误触copilot
// @description:zh  防止使用必应搜索时,使用滚轮上滑时误触copilot
// @description:en  To prevent accidental activation of Copilot when using Bing search, disable it when scrolling up.
// @description:ja  必应検索を使用する際に、スクロールしているときに Copilot が誤って起動しないようにするために、上にスクロールするときに無効にします。
// @author       aotmd
// @match        https://*.bing.com/*
// @noframes
// @license MIT
// @run-at document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490407/%E9%98%B2%E6%AD%A2%E4%BD%BF%E7%94%A8%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%97%B6%E8%AF%AF%E8%A7%A6copilot%21.user.js
// @updateURL https://update.greasyfork.org/scripts/490407/%E9%98%B2%E6%AD%A2%E4%BD%BF%E7%94%A8%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%97%B6%E8%AF%AF%E8%A7%A6copilot%21.meta.js
// ==/UserScript==

( function() {
	// 等待网页完成加载
	window.addEventListener( 'load', function() {
		document.addEventListener( 'wheel', event => {
			event.stopImmediatePropagation();
		}, {
			capture: true,
			passive: false
		} );

	}, false );
} )();