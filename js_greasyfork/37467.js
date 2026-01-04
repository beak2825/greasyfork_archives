// ==UserScript==
// @name        Selection Search
// @namespace   phodra
// @description 選択範囲を検索する
// @version     0.1
// @include     *
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/37467/Selection%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/37467/Selection%20Search.meta.js
// ==/UserScript==

(function(){
	const KEY = "x";
    const ENGINE = "http://www.google.co.jp/search?q=";

	// キー入力を取得
	document.addEventListener(
		'keyup', function(e)
		{
            var press = String.fromCharCode(e.which).toLowerCase();
            if( press == KEY ) DynamicOpen();
		}, false
	);

	var DynamicOpen = function()
	{
        console.log(gBrowser.treeStyleTab);
		var strs = [];
//		// 選択範囲を取得
//		var sel = window.getSelection().toString();
//		// 改行で分割
//		var splited = sel.split(/[\r\n]+/g);
//		splited.forEach(
//			elm => {
//				// 空行は除去
//                if( /\S/.test(elm) )
//				{
//					strs.push( elm.trim() );
//				}
//			}
//		);
		var sel = window.getSelection();
		console.log(sel);
		var ranges=[];
		for( var i=0; i<sel.rangeCount; i++)
		{
//			ranges.push(sel.getRangeAt(i).toString());
			var str = sel.getRangeAt(i).toString();
			str.split(/[\r\n]+/g).forEach(
				elm => {
	                if( /\S/.test(elm) )
					{
						strs.push( elm.trim() );
					}
				}
			);
		}
//		console.log(ranges)
//		ranges.forEach(
//			item=>{
//				item.split(/[\r\n]+/g).forEach(
//					elm=>{
//		                if( /\S/.test(elm) )
//						{
//							strs.push( elm.trim() );
//						}
//					}
//				);
//			}
//		);
        console.log(strs);

		var isMany = strs.length>1;
		var prm;
		strs.forEach(
			elm => {
				var isUrl = /^(https?|ftp|file):\/\/.?/.test(elm);
				console.log(elm, isMany, isUrl);
				GM_openInTab( isUrl? elm: ENGINE+elm, isMany );
//				if( /^(https?|ftp|file):\/\/.?/.test(elm) )
//				{
//					GM_openInTab( elm, many);
//				}
//				else
//				{
//					GM_openInTab( ENGINE + elm, many );
//				}
			}
		);
	};
})();