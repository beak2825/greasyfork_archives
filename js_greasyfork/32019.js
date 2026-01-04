// ==UserScript==
// @name        ShindanmakerHashtag"SoT"Script
// @namespace   https://twitter.com/KamakuraChannel
// @description	診断メーカー内のハッシュタグ検索に加えTwitterの検索ボタンを追加します。長期間のエゴサ用に。
// @match       https://shindanmaker.com/*
// @author      カマクラ (Kamakura)
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32019/ShindanmakerHashtag%22SoT%22Script.user.js
// @updateURL https://update.greasyfork.org/scripts/32019/ShindanmakerHashtag%22SoT%22Script.meta.js
// ==/UserScript==
// スクリプト名の"SoT"とはSearch on Twitterのことです。

(function () {
	let links = document.querySelectorAll('a.hashtaglabel');
	if (links) {
		let tag = [];
		const newButton = function(tagname) {
			return '<a class="hashtaglabel" href="https://www.twitter.com/hashtag/' + tagname + '?src=hash" target="_blank">SoT</a>';
		};

		links.forEach(function(v,i) {
			tag[i] = v.getAttribute('href').split('?sw=%23')[1];
			v.outerHTML += newButton(tag[i]);
		});
	}
}) ();
