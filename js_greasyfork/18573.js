// ==UserScript==
// @name        agqr_collapse_twitter
// @namespace   http://catherine.v0cyc1pp.com/agqr_collapse_twitter.user.js
// @include     http://www.uniqueradio.jp/agplayerf/*
// @version     1.0
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @run-at      document-end
// @description 超A&G+のツイッターを折りたたみ表示します。
// @downloadURL https://update.greasyfork.org/scripts/18573/agqr_collapse_twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/18573/agqr_collapse_twitter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);


console.log("agqr_collapse_twitter start");






function main() {
	console.log("main() start");
	var attr = $("iframe#twitter-widget-0").attr("abcde");
	console.log("attr="+attr);
	if( typeof attr !== 'undefined' && attr !== false ){
		return; // もうabcdeがあるのでなにもしない
	}
	/*
	var attr2 = $("iframe#twitter-widget-0").attr("style");
	console.log("attr2="+attr2);
	if ( ! attr2.match( /inline-block/ ) ) {
		return;
	}

	var new = attr2.replace( "inline-block", "none");
	console.log("new="+new);
	*/
	$("iframe#twitter-widget-0").attr("abcde","agqr_collapse_twitter");
	$("iframe#twitter-widget-0").before('<div onclick="obj=document.getElementById(\'twitter-widget-0\').style; obj.display=(obj.display==\'none\')?\'block\':\'none\';"><center><a style="cursor:pointer; color:white;">ツイッター領域（クリックで展開）</a></center></div>');
	//$("iframe#twitter-widget-0").attr( "style", new);
	$("iframe#twitter-widget-0").attr("style","display:none; clear:both;");

};


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});
 
var config = { attributes: false, childList: true, characterData: false, subtree:true }
 
observer.observe( document, config);



/*
function main2() {
	console.log("main2() start");
	var attr = $("iframe#twitter-widget-0").attr("style");
	if ( attr.match( /inline-block/ ) ) {
		console.log("inline-block found");
		$("iframe#twitter-widget-0")[0].diplay='none';
		observer2.disconnect();
	}
};

var observer2 = new MutationObserver(function(mutations) {
    observer2.disconnect();
    main2();
    observer2.observe( document, config);
});

var config2 = { attributes: true, childList: false, characterData: false, subtree:false }
 
observer2.observe( $("iframe#twitter-widget-0")[0], config);

*/
