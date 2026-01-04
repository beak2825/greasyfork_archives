// ==UserScript==
// @name        uniqlo_hide_item2
// @namespace   uniqlo_hide_item2.user.js
// @include     https://www.uniqlo.com/*
// @run-at      document-end
// @author      greg10
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description 指定したユニクロのアイテムを非表示にする。
// @downloadURL https://update.greasyfork.org/scripts/377788/uniqlo_hide_item2.user.js
// @updateURL https://update.greasyfork.org/scripts/377788/uniqlo_hide_item2.meta.js
// ==/UserScript==

console.log("uniqlo_hide_item2 start");

///////////////////////////////////////////////////////////////
// 設定：非表示にするアイテムの画像リスト
///////////////////////////////////////////////////////////////
var ignore_list = [
"https://im.uniqlo.com/images/jp/pc/goods/408117/item/08_408117_middles.jpg",
"https://im.uniqlo.com/images/jp/pc/goods/408116/item/08_408116_middles.jpg",
];

// https://www.uniqlo.com/jp/store/feature/uq/sale/men/
function proc() {
	document.querySelectorAll(".unit").forEach( function(elem) {
		var img = elem.querySelector("dd.thumb > a > img");
		var img_src = img.getAttribute("src");
		for (var i = 0, len = ignore_list.length; i < len; i++) {
			if ( img_src == ignore_list[i]) {
				console.log("img_src="+img_src);
				elem.style.display = "none";
			}
		}
	});

}

function main() {
	proc();
}
main();


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: false, childList: true, characterData: false, subtree:true };

observer.observe( document, config);

