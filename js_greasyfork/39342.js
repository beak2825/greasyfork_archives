// ==UserScript==
// @name           futaba favicon changer
// @namespace      https://github.com/akoya-tomo
// @description    レスページのファビコンを変更
// @author         akoya_tomo
// @include        http://*.2chan.net/*/res/*.htm
// @include        https://*.2chan.net/*/res/*.htm
// @version        1.0.1
// @grant          none
// @run-at         document-idle
// @license        MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/39342/futaba%20favicon%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/39342/futaba%20favicon%20changer.meta.js
// ==/UserScript==

(function () {
	/*
	 *	設定
	 */
	var USE_CATALOG_THUMBNAIL = true;	// カタログのサムネを使用する

	setFavicon();

	// ファビコンを設定する
	function setFavicon() {
		var head = document.querySelector("head");
		var imgSrc = getThreadImageSrc();
		if (head && imgSrc) {
			var link = document.createElement("link");
			link.type = "image/x-icon";
			link.rel = "shortcut icon";
			if (USE_CATALOG_THUMBNAIL) {
				link.href = imgSrc.replace("/thumb/","/cat/");
			} else {
				link.href = imgSrc;
			}
			head.appendChild(link);
		}
	}

	// スレ画像アドレスを取得
	function getThreadImageSrc() {
		var img = document.querySelector(".thre > a > img");
		if (img) {
			return img.src;
		} else {
			return;
		}
	}

})();
