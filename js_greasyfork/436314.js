// ==UserScript==
// @name        Youtube停用迷你播放器
// @namespace   https://greasyfork.org/scripts/436314
// @version     1.5
// @description 停用Youtube迷你播放器功能
// @author      fmnijk
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436314/Youtube%E5%81%9C%E7%94%A8%E8%BF%B7%E4%BD%A0%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/436314/Youtube%E5%81%9C%E7%94%A8%E8%BF%B7%E4%BD%A0%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

/*main function*/
(function() {
    'use strict';
	const $ = s => document.querySelector(s)
	const $$ = s => [...document.querySelectorAll(s)]
    function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 200)).observe(document.body, { childList: true });
	}
	function disableMiniplayer() {
        if($('.ytp-miniplayer-ui')?.style.display === ""){
            $('.ytp-miniplayer-close-button')?.click();
        }
	}
	onDomChange(disableMiniplayer);

    const styles = `
        /*屏蔽迷你播放器*/
        body > ytd-app > ytd-miniplayer{
	        display: none !important;
	        pointer-events:none !important;
        }
        /*屏蔽開啟迷你撥放器按鈕*/
        #movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-miniplayer-button.ytp-button{
            display: none !important;
	        pointer-events:none !important;
        }
        /*屏蔽加入待播清單按鈕*/
		#hover-overlays > ytd-thumbnail-overlay-toggle-button-renderer:nth-child(2){
			display: none !important;
		}
        `
    GM_addStyle(styles);
})();

