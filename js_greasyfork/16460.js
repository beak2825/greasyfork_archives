// ==UserScript==
// @name        twitcasting_collapse_comment
// @namespace   http://catherine.v0cyc1pp.com/twitcasting_collapse_comment.user.js
// @match       http://twitcasting.tv/*
// @match       https://twitcasting.tv/*
// @match       https://ssl.twitcasting.tv/*
// @exclude     https://twitcasting.tv/
// @exclude     https://twitcasting.tv/?*
// @version     1.8
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @grant       none
// @run-at      document-end
// @description ツイキャスのコメント欄を非表示にする。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/16460/twitcasting_collapse_comment.user.js
// @updateURL https://update.greasyfork.org/scripts/16460/twitcasting_collapse_comment.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);


console.log("twitcasting_collapse_comment start");



function main() {
    //console.log("main() start");

    // すでに処理済ならなにもしない
    /*
    var tmp = $(".header_twitcasting_collapse_comment");
    console.log("tmp="+tmp);
    if (tmp != null) {
        return;
    }
    */
    if ( $(".header_twitcasting_collapse_comment").length ) {
        return;
    }


	// 隠すブロックの前に「コメントエリア (クリックで展開)」のヘッダをつける。
	$("div.tw-player-page__comment__list").before("<div class=\"header_twitcasting_collapse_comment\" style=\"text-align: center;cursor: hand; cursor: pointer;\"><span>コメントエリア (クリックで展開)</span>");

	// 隠すブロックをデフォルトで非表示にする。
	$("div.tw-player-page__comment__list").attr("style","display:none;clear:both;");

	$(".header_twitcasting_collapse_comment").click(function () {

		var $header = $(this);
		//getting the next element
		var $content = $header.next();
		//open up the content needed - toggle the slide- if visible, slide up, if not slidedown.


		$content.slideToggle(200);


		/* ヘッダのテキストを変更する場合
		$content.slideToggle(500, function () {
			//execute this after slideToggle is done
			//change text of header based on visibility of content div
			$header.text(function () {
				//change text based on condition
				return $content.is(":visible") ? "Collapse" : "Expand";
			});
		});
		*/
	});
}

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});
 
var config = { attributes: false, childList: true, characterData: false, subtree:true };
 
observer.observe( document, config);
