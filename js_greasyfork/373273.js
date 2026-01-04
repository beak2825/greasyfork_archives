// ==UserScript==
// @name        Niconico Link Modifier
// @namespace   knoa.jp
// @description ニコニコのリンク先URLを改変して快適にニコニコします。
// @include     http*://www.nicovideo.jp/*
// @include     http*://dic.nicovideo.jp/*
// @include     http*://live.nicovideo.jp/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373273/Niconico%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/373273/Niconico%20Link%20Modifier.meta.js
// ==/UserScript==

(function(){
	const SCRIPTNAME = 'NiconicoLinkModifier';
	function modify(as){
		let href;
		for(let i = 0; i<as.length; i++){
			switch(true){
				// 連続再生ボタンはいじらない(けど機能しない…)
				case as[i].id === 'BTN_playlist_play_all':
					break;
				// CSSのVisitedを活用するため、アンカーURLからクエリ文字列を取り除いて正規化
				case (href = as[i].href.match(/^(https?:\/\/[a-z]+\.nicovideo\.jp\/watch\/[a-z]+\d+)\?/)) !== null:
				case (href = as[i].href.match(/^(https?:\/\/live\.nicovideo\.jp\/searchresult\?v=[a-z]+\d+)/)) !== null:
					as[i].href = href[1];
					break;
				// タグのデフォルト並び替えを「マイリスト数が多い順」にする
				case (href = as[i].href.match(/^(https?:\/\/www\.nicovideo\.jp\/tag\/[^\?]+)$/)) !== null:
				case (href = as[i].href.match(/^(https?:\/\/www\.nicovideo\.jp\/tag\/[^\?]+)\?ref=tagconcerned$/)) !== null:
					as[i].href = href[1] + '?sort=m';
					break;
				// お便りの投稿を通常リンクにすべき?
			}
			as[i].classList.add(SCRIPTNAME);
		}
	}
	//window.addEventListener('load', function(){modify(document.getElementsByTagName('a'))}, false);
	//document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(e){modify(e.target.getElementsByTagName('a'))}, false);
	//ロード数秒後のタイミングで書き換わったりするからいっそのことIntervalでいいや。
	//select要素のchangeでAjaxで書き換えられる場合にも対応できて一石二鳥。
	setInterval(function(){modify(document.querySelectorAll(`a:not(.${SCRIPTNAME})`))}, 1000);
})();
