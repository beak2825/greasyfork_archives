// ==UserScript==
// @name        uniqlo_hide_item
// @namespace   uniqlo_hide_item.user.js
// @include     http://www.uniqlo.com/*
// @run-at      document-end
// @author      greg10
// @license     GPL 3.0
// @version     1.0
// @grant       none
// @description 指定したユニクロのアイテムを非表示にする。
// @downloadURL https://update.greasyfork.org/scripts/16961/uniqlo_hide_item.user.js
// @updateURL https://update.greasyfork.org/scripts/16961/uniqlo_hide_item.meta.js
// ==/UserScript==

console.log("test start");

///////////////////////////////////////////////////////////////
// 設定：非表示にするアイテムの画像リスト
///////////////////////////////////////////////////////////////
ignore_list = [
"http://im.uniqlo.com/images/jp/pc/goods/15135500002/item/68_15135500002_middles.jpg",
"http://im.uniqlo.com/images/jp/pc/goods/161142/item/69_161142_middles.jpg",
"http://im.uniqlo.com/images/jp/pc/goods/15142500001/item/15_15142500001_middles.jpg",
];

$("img").each(function() {
	var src = $(this).attr("src");
	console.log("src="+src);
	for (var i = 0, len = ignore_list.length; i < len; i++) {
		if ( src == ignore_list[i]) {
			$(this).parents("div.unit").hide();
		}
	}
});
