// ==UserScript==
// @name         Xiami Music(虾米音乐) Homepage Auto Signer
// @description  虾米音乐-首页-自动签到
// @version      1.0.17012101
// @author       DanoR
// @namespace    http://weibo.com/zheung
// @grant        none
// @include      *://www.xiami.com/
// @include      *://www.xiami.com/?*
// @downloadURL https://update.greasyfork.org/scripts/26732/Xiami%20Music%28%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%29%20Homepage%20Auto%20Signer.user.js
// @updateURL https://update.greasyfork.org/scripts/26732/Xiami%20Music%28%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%29%20Homepage%20Auto%20Signer.meta.js
// ==/UserScript==

(function() {
	const itr = setInterval(function() {
		if(document.querySelector('b.icon.tosign.done'))
			clearInterval(itr);
		else
			document.querySelector('b.icon.tosign').click();
	}, 2014);
})();