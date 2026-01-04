// ==UserScript==
// @name         簡易コメ率
// @namespace    tanbatsu
// @version      0.1
// @author       You
// @grant        unsafeWindow
// @description  かんたんコメント率を表示
// @license      MIT
// @match        https://www.nicovideo.jp/watch/sm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466349/%E7%B0%A1%E6%98%93%E3%82%B3%E3%83%A1%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/466349/%E7%B0%A1%E6%98%93%E3%82%B3%E3%83%A1%E7%8E%87.meta.js
// ==/UserScript==

(() => {
	const isTarget = response => response.url.startsWith("https://nvcomment.nicovideo.jp/v1/threads");
	const changeJson = json => {
        console.log(json.data.threads[2].commentCount)
        document.getElementsByClassName("FormattedNumber")[1].innerHTML+="<small>(簡易コメ率:"+Math.floor(json.data.threads[2].commentCount/json.data.globalComments[0].count*100 * Math.pow( 10, 1 ) ) / Math.pow( 10, 1 )+ "%)</small>"
		return json;
	};

	const originalJson = window.Response.prototype.json;

	window.Response.prototype.json = function (...args) {
		const response = this;
		return originalJson.apply(this, args).then(json => {
			if (isTarget(response)) {
				return changeJson(json);
			}
			return json;
		});
	};
})();