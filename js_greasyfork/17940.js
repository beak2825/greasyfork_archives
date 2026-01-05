// ==UserScript==
// @name           Infinite scroll for YouTube
// @name:ja        YouTubeで無限スクロール
// @namespace      https://twitter.com/sititou70
// @description    Implementation infinite scroll at youtube.com's search result page.
// @description:ja YouTube.comの検索結果で無限スクロールを実現します。
// @include        /https*:\/\/www\.youtube\.com\/.*/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @version        1.1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/17940/Infinite%20scroll%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/17940/Infinite%20scroll%20for%20YouTube.meta.js
// ==/UserScript==

jQuery.noConflict();
(function($){
	//exclude iframe document
	if ($("html").attr("lang") === "")return;
	
	//get scroll value
	var get_scroll_value = function(){
		return $(window).scrollTop();
	};
	
	//get and set next page
	var get_next_page = function(){
		if(now_loading)return;
		if(next_page_url == "last_page" || next_page_url == "undefined")return;
		
		now_loading = true;
		
		$(result_list_selector).append("<div style='text-align: center;' id='infinite_scroll_for_youyube_loading_massage'>loading next page...</div>");
		
		$.ajax({
			type: "GET",
			url: next_page_url,
			dataType: "html",
		}).done(function(res){
			now_loading = false;
			$(result_list_selector).append($(res).find(result_list_selector + " > li"));
			$("#infinite_scroll_for_youyube_loading_massage").remove();
			next_page_url = get_next_page_url($(res));
			if(next_page_url == "last_page"){
				$(result_list_selector).append("<div style='text-align: center;' id='infinite_scroll_for_youyube_loading_massage'>loaded last page</div>");
			}
		}).fail(function(){
			console.log("fail ajax");
		});
	};
	
	//get next page url from page dom jquery object
	var get_next_page_url = function(dom){
		var url = dom.find(".branded-page-box > a").last().attr("href");
		if(typeof url == "undefined")return "undefined";
		if(url == next_page_url)return "last_page";
		return url;
	};
	
	//it is called when the scrolls
	$(window).scroll(function(){
		if(next_page_url == "undefined")next_page_url = get_next_page_url($("html"));
		if($(".branded-page-box").offset().top - $(window).height() < get_scroll_value() + adjust_scroll_px){
			get_next_page();
		}
	});
	
	var now_loading = false;
	var next_page_url = get_next_page_url($("html"));
	var result_list_selector = "#results > ol > li:nth-child(2) > ol";
	var adjust_scroll_px = 300;
})(jQuery);
