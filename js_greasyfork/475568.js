// ==UserScript==
// @name         即時保存
// @namespace    https://tanbatu.github.io/
// @version      0.1
// @description  読み込んだ瞬間保存ボタン設置する歯科内科
// @author       tanbatu
// @license      MIT License
// @match        https://www.nicovideo.jp/watch/sm*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/475568/%E5%8D%B3%E6%99%82%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/475568/%E5%8D%B3%E6%99%82%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==



console.group("%cこれもう三倍速モード歯科内科…", "font-family: Noto Sans JP; font-size: 4em; font-style: italic; font-weight: 700;");

(() => {
    document.getElementsByClassName("VideoTitle")[0].insertAdjacentHTML("afterend","<a id='sokuji'>お待ち下さい</a>")
	const isTarget = response => response.url.startsWith("https://nvcomment.nicovideo.jp/v1/threads");
	const changeJson = json => {
        console.log(json)
        const blob = new Blob([JSON.stringify(json, null, '  ')], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.getElementById("sokuji")
        a.innerText = "コメントを保存する"
        const sm = location.href.split("/")[4].split("?")[0]
        a.download = sm+'.json';
        a.href = url;
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
