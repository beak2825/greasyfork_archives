// ==UserScript==
// @name        我图网消除登录弹窗
// @description 我图网消除登录弹窗在没登录的时候
// @namespace    http://tampermonkey.net/
// @version      2024-05-10
// @description  try to take over the world!
// @author       dreamlove
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match https://weili.ooopic.com/*
// @supportURL   https://dreamlove.top
// @grant        unsafeWindow
// @license MIT
// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/494566/%E6%88%91%E5%9B%BE%E7%BD%91%E6%B6%88%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/494566/%E6%88%91%E5%9B%BE%E7%BD%91%E6%B6%88%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(async function() {
	'use strict';
	const sleep = (timeout) => {
		return new Promise((resolve) => {
			setTimeout(resolve, timeout);
		});
	};
	while (true) {
        if(unsafeWindow.obj){
           unsafeWindow.obj.every2TimesLoginPopup = 0 ;
            break;
        }
		await sleep(1)
	}
})();