// ==UserScript==
// @name        Youtube停用直播聊天室
// @namespace   https://greasyfork.org/scripts/459718
// @version     1.2
// @description 停用Youtube直播聊天室功能
// @author      fmnijk
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459718/Youtube%E5%81%9C%E7%94%A8%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/459718/Youtube%E5%81%9C%E7%94%A8%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==

/*main function*/
(function() {
    'use strict';
	const $ = s => document.querySelector(s)
	const $$ = s => [...document.querySelectorAll(s)]
    function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 50)).observe(document.body, { childList: true });
	}
	function disableLivechat() {
		let btn = $('#show-hide-button > ytd-toggle-button-renderer > yt-button-shape > button.yt-spec-button-shape-next--text');
        if(btn?.ariaPressed === "false"){
            btn.click();
        }
	}
	onDomChange(disableLivechat);
    setInterval(disableLivechat, 1000);

    const styles = `
        /*隱藏開關直播聊天室按鈕*/
        #show-hide-button{
	        display: none !important;
        }
        `
    GM_addStyle(styles);
})();
