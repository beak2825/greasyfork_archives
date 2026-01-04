// ==UserScript==
// @name        nico_search_filter2
// @namespace   http://catherine.v0cyc1pp.com/nico_search_filter2.user.js
// @include     https://www.nicovideo.jp/search/*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description ニコニコ動画の検索結果にNGフィルターをかけて消去する
// @downloadURL https://update.greasyfork.org/scripts/378586/nico_search_filter2.user.js
// @updateURL https://update.greasyfork.org/scripts/378586/nico_search_filter2.meta.js
// ==/UserScript==


//================================
// コンフィグ
//   - ＮＧワードを設定してください
var g_text = "しゃけみー,くっきーたん,おちゃめ機能";
//================================




var nglist = g_text.split(",");


function main() {
	//$(".item").each(function() {
	document.querySelectorAll(".item").forEach(function(elem){
		//var str = $(this).text();
		var str = elem.innerText;

		for ( var i = 0; i < nglist.length; ++i) {
			var ngword = nglist[i];
			if ( ngword == "" ) continue;

			ngword = ngword.replace(/^\s+|\s+$/g, "");

			var obj = new RegExp( ngword, "i");
			var index = str.search( obj );
			//var index = str.indexOf( ngword );
			if ( index != -1 ) {
				//$(this).hide();
				elem.style.display = "none";
				console.log("str="+str);
			}
		}
	});
}

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

//var config = { attributes: true, childList: true, characterData: true, subtree:true }
var config = { childList: true, characterData: true, subtree:true }

observer.observe( document, config);