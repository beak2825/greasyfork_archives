// ==UserScript==
// @name            为駿河屋增加跳转查询功能
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @homepageURL     https://greasyfork.org/users/2805-myimagination
// @version			0.8.4
// @description     駿河屋页面添加至doujinshi\E绅士\数字商店的查询跳转
// @include         http://www.suruga-ya.jp/search*
// @include         http://www.suruga-ya.jp/product/detail*
// @include         https://www.suruga-ya.jp/search*
// @include         https://www.suruga-ya.jp/product/detail*
// @include         https://www.suruga-ya.jp/pcmypage/action_favorite_list*
// @include         https://www.suruga-ya.jp/pcmypage/action_nyuka_search/list*
// @include         https://www.suruga-ya.jp/pcmypage/action_nyuka_search/bolist*

// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/2637/%E4%B8%BA%E9%A7%BF%E6%B2%B3%E5%B1%8B%E5%A2%9E%E5%8A%A0%E8%B7%B3%E8%BD%AC%E6%9F%A5%E8%AF%A2%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/2637/%E4%B8%BA%E9%A7%BF%E6%B2%B3%E5%B1%8B%E5%A2%9E%E5%8A%A0%E8%B7%B3%E8%BD%AC%E6%9F%A5%E8%AF%A2%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function(){
	if (window.location.href.indexOf('/search') > 0) {
	$(".item_detail").each(function(){
	    //$(this).find("td.text1 img").attr('src', $(this).find("td.text1 img").attr("src").replace(/size=ss/,"size=s"));
		var xc = $(this).find("p:eq(1) a").text();
		xc=xc.replace(/\([^\)]*\)/g,"");
		xc=xc.replace(/\（[^\）]*\）/g,"");
		xc=xc.replace(/\【[^\】]*\】/g,"");
		xc=xc.replace(/\<[^\>]*\>>/g,"");
		if(xc.split("/").length-1 > 1)
		{
			xc=xc.substr(0,xc.lastIndexOf("/")-1);
		}else{
				xc=xc.replace(/[/].*/g,"");
			}
		$(this).find("p:eq(0)").append(' | <a href="http://www.doujinshi.org/search/simple/?T=objects&sn=' + xc + '" target="_blank" > [搜索标题] </a>');
	//	$(this).find("tr:eq(0) td:eq(3) div a").attr('href', 'http://www.doujinshi.org/search/simple/?T=objects&sn=' + xc);
	//	$(this).find("tr:eq(0) td:eq(3) div a").attr('target', '_blank');
		var xv = $(this).find("p:eq(2)").text().replace(/(^[\s]*)|([\s]*$)/g,"");
		$(this).find("p:eq(2)").html('<a href="http://www.suruga-ya.jp/search?category=&search_word=&restrict[]=brand(text)=' + xv + '" target="_blank" >' + xv + '</a>' + ' | <a href="http://www.doujinshi.org/search/simple/?T=circle&sn=' + xv + '" target="_blank" > [搜索] </a> | <a href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + xv + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>' + ' | <a href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + xc + '&f_apply=Apply+Filter" target="_blank" > [标题E搜索]' + ' | <a href="http://www.dlsite.com/maniax/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/' + xc + '/per_page/30/from/fs.header" target="_blank" > [DLsite] </a>' + ' | <a href="http://www.dmm.co.jp/search/=/searchstr=' + xc + '/analyze=V1EBD1YHUgM_/limit=120/n1=FgRCTw9VBA4GAV5NWV8I/n2=Aw1fVhQKX1ZRAlhMUlo5Uw4QXF9e/sort=ranking/" target="_blank" > [DMM] </a>' + ' | <a href="http://www.melonbooks.com/index.php?main_page=search&page=1&order=release&sort=desc&query=' + xc + '&tab=keyword" target="_blank" > [Melonbooks] </a>');
		$(this).find("p:eq(2)").before('<p style="border-bottom: 1px solid #cccccc;"></p>');

	}); 
	}else if(window.location.href.indexOf('/product') > 0){
		//$("#item_title").remove("span");
		var xc = $("#item_title").text();
		xc=xc.replace(/\([^\)]*\)/g,"");
		xc=xc.replace(/\（[^\）]*\）/g,"");
		xc=xc.replace(/\【[^\】]*\】/g,"");
		xc=xc.replace(/\<[^\>]*\>>/g,"");
		if(xc.split("/").length-1 > 1)
		{
			xc=xc.substr(0,xc.lastIndexOf("/")-1);
		}else{
				xc=xc.replace(/[/].*/g,"");
			}
		xc=xc.replace($("#item_title span").text(), "");
    $('#item_title span').append(' | <a href="http://www.doujinshi.org/search/simple/?T=objects&sn=' + xc + '" target="_blank" > [搜索标题] </a>' + ' | <a href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + xc + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>' + ' | <a href="http://www.dlsite.com/maniax/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/' + xc + '/per_page/30/from/fs.header" target="_blank" > [DLsite] </a>' + ' | <a href="http://www.dmm.co.jp/search/=/searchstr=' + xc + '/analyze=V1EBD1YHUgM_/limit=120/n1=FgRCTw9VBA4GAV5NWV8I/n2=Aw1fVhQKX1ZRAlhMUlo5Uw4QXF9e/sort=ranking/" target="_blank" > [DMM] </a>' + ' | <a href="http://www.melonbooks.com/index.php?main_page=search&page=1&order=release&sort=desc&query=' + xc + '&tab=keyword" target="_blank" > [Melonbooks] </a>' + ' | <a href' + '="' + 'https://order.mandarake.co.jp/order/listPage/serchKeyWord?categoryCode=03&keyword=' + xc + '" target="_blank" > [mandarake] </a>' + ' | <a href' + '="' + 'https://auctions.yahoo.co.jp/search/search?p=' + xc + '&auccat=26146&aq=-1&oq=&ei=UTF-8&slider=0&n=100&tab_ex=commerce" target="_blank" > [yahoo] </a>');
		$("#datasheet tr:eq(1) td:eq(1)").append(' | <a href="http://www.doujinshi.org/search/simple/?T=circle&sn=' + $("#datasheet tr:eq(1) td:eq(1) a").text() + '" target="_blank" > [搜索] </a>' + ' | <a href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + $("#datasheet tr:eq(1) td:eq(1) a").text() + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>');
		$(".t_title:contains('画')").each(function(){
		$(this).next().append(' | <a href' + '="' + 'http://www.doujinshi.org/search/simple/?T=author&sn=' + $(this).next().find('a').text() + '" target="_blank" > [搜索] </a>' + ' | <a href' + '="' + 'https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + $(this).next().find('a').text() + '&f_apply=Apply+Filter" target="_blank" > [E搜索] </a>');}
			);		 
}else{
$("div.text2").each(function(){
		var xc = $(this).find("a:eq(0)").text();
		xc=xc.replace(/\([^\)]*\)/g,"");
		xc=xc.replace(/\（[^\）]*\）/g,"");
		xc=xc.replace(/\【[^\】]*\】/g,"");
		xc=xc.replace(/\<[^\>]*\>>/g,"");
		if(xc.split("/").length-1 > 1)
		{
			xc=xc.substr(0,xc.lastIndexOf("/")-1);
		}else{
				xc=xc.replace(/[/].*/g,"");
			}
			$(this).append(' <br /> <a href' + '="' + 'https://order.mandarake.co.jp/order/listPage/serchKeyWord?categoryCode=03&keyword=' + xc + '" target="_blank" > [mandarake] </a>' + ' | <a href' + '="' + 'https://auctions.yahoo.co.jp/search/search?p=' + xc + '&auccat=26146&aq=-1&oq=&ei=UTF-8&slider=0&n=100&tab_ex=commerce" target="_blank" > [yahoo] </a>');
});
}   
})();