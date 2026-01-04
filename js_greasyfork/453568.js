// ==UserScript==
// @name        nicolive_onair_filter5
// @namespace   http://catherine.v0cyc1pp.com/
// @match       http://live.nicovideo.jp/
// @match       http://live.nicovideo.jp/recent*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     5.0
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @grant       none
// @description ニコ生トップの興味のないサムネイルを削除する。
// @downloadURL https://update.greasyfork.org/scripts/453568/nicolive_onair_filter5.user.js
// @updateURL https://update.greasyfork.org/scripts/453568/nicolive_onair_filter5.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

//================================
// Configurations
//   - 表示させたくないコミュニティを指定してください。
var g_text = "co1268146, co3618802";
//================================


console.log("nicolive_onair_filter5 start");

var nglist = g_text.split(",");

function nico_ranking() {
	//console.log("nico_ranking() start");



	$("#onair > li").each(function() {
		var aaa = $(this).children("a");
		//console.log("aaa="+aaa);
		//var href= $(aaa).attr("href");
		//console.log("href="+href);
		var img = aaa.children("img");
		//console.log("img="+img);
		var str = img.attr("src");
		//console.log("str="+str);
		if ( str == null || str == undefined ) {
			str = "";
		}
		//console.log("str="+str);
		for ( var i = 0; i < nglist.length; ++i) {
			var ngword = nglist[i];
			ngword = ngword.replace(/^\s+|\s+$/g, "");
            if ( ngword == "" ) {
                continue;
            }

			var obj = new RegExp( ngword, "i");
			var index = str.search( obj );
			//var index = str.indexOf( ngword );
			if ( index != -1 ) {
				$(this).remove();
				console.log("nico_ranking(): hide: index="+index+", community="+ngword);
			}
		}


	});
}
function nico_search() {
	//console.log("nico_search() start");



	$("li.user-program-item").each(function() {
		var aaa = $(this).children("a");
		//console.log("aaa="+aaa);
		//var href= $(aaa).attr("href");
		//console.log("href="+href);
		var img = aaa.children(".user-program-item-body-area").children(".thumbnail-area").children("img");
		//console.log("img="+img);
		var str = img.attr("src");
		//console.log("str="+str);
		if ( str == null || str == undefined ) {
			str = "";
		}
		//console.log("str="+str);
		for ( var i = 0; i < nglist.length; ++i) {
			var ngword = nglist[i];
			ngword = ngword.replace(/^\s+|\s+$/g, "");
            if ( ngword == "" ) {
                continue;
            }

			var obj = new RegExp( ngword, "i");
			var index = str.search( obj );
			//var index = str.indexOf( ngword );
			if ( index != -1 ) {
				$(this).remove();
				console.log("nico_search(): hide: index="+index+", community="+ngword);
			}
		}


	});
}
function nico_osusume() {
	//console.log("nico_osusume() start");



	$("ul[class^='___program-card-list'] > li").each(function() {
		var aaa = $(this).children("div[class^='___program-card']").children("a");
		//console.log("aaa="+aaa);
		//var href= $(aaa).attr("href");
		//console.log("href="+href);
		var img = aaa.children("div[class^='___program-detail']").children("h3").children("span").children("img");
		//console.log("img="+img);
		var str = img.attr("src");
		//console.log("str="+str);
		if ( str == null || str == undefined ) {
			str = "";
		}
		//console.log("str="+str);
		for ( var i = 0; i < nglist.length; ++i) {
			var ngword = nglist[i];
			ngword = ngword.replace(/^\s+|\s+$/g, "");
            if ( ngword == "" ) {
                continue;
            }

			var obj = new RegExp( ngword, "i");
			var index = str.search( obj );
			//var index = str.indexOf( ngword );
			if ( index != -1 ) {
				$(this).remove();
				console.log("nico_osusume(): hide: index="+index+", community="+ngword);
			}
		}


	});
}

function main() {
	nico_ranking();
	nico_search();
	nico_osusume();
}

main();


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: true, childList: true, characterData: true, subtree:true };

observer.observe( document, config);
