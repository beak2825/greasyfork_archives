// ==UserScript==
// @name           Douban Download Search
// @namespace      https://github.com/ywzhaiqi
// @description    增加豆瓣电影、图书的下载搜索链接
// @author         wyc
// @version        1.3.1
// @include        http://movie.douban.com/subject/*
// @include        http://book.douban.com/subject/*
// @include        https://movie.douban.com/subject/*
// @include        https://book.douban.com/subject/*
// @grunt          none
// @downloadURL https://update.greasyfork.org/scripts/14029/Douban%20Download%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/14029/Douban%20Download%20Search.meta.js
// ==/UserScript==

function run () {
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace( '(豆瓣)', '' ).trim();
	var keyword2 = encodeURIComponent( keyword1 );
	var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");
//下载链接
	var Movie_links = [
		{ html: "百度盘", href: "http://www.panduoduo.net/s?k=" + movieTitle},
		{ html: "人人影视", href: "http://www.zimuzu.tv/search/index?keyword=" + movieSimpleTitle },
		{ html: "torrentkitty", href: "http://www.torrentkitty.me/search/" + movieTitle },
		{ html: "bt天堂", href: "http://www.bttiantang.com/s.php?q=" + movieTitle },
		{ html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
		{ html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle }
	];

	var Book_links = [
		{ html: "百度盘", href: "http://www.panduoduo.net/s?k=" + keyword1+"txt "},
//		{ html: "mLook", href: "http://www.mlook.mobi/search?q=" + keyword2 },
		{ html: "Google", href: "https://www.google.com/search?ie=UTF-8&q=" + keyword1+"txt "},
	];

	var link = $("<div>").append(
		$("<span>").attr("class", "pl").html("下载链接:")
	);
//字幕链接
	switch(location.host){
		case "movie.douban.com":
			appendLinks(Movie_links, link)
      //Sub HD
			link.append('<br>')
				.append('<span class="pl">字幕链接:</span>')
				.append(
					$("<a>").attr({
						href: "http://www.subhd.com/search/" + movieTitle,
						target: "_blank"
					}).html("Sub HD")
				);
				 //zimuku
				link.append(' / ')
				.append()
				.append(
					$("<a>").attr({
						href: "http://www.zimuku.net/search?ad=1&q=" + movieTitle,
						target: "_blank"
					}).html("zimuku")
				);
				 //subom
				link.append(' / ')
				.append()
				.append(
					$("<a>").attr({
						href: "http://www.subom.net/search/" + movieTitle,
						target: "_blank"
					}).html("subom")
				);
				 //第三楼
				link.append(' / ')
				.append()
				.append(
					$("<a>").attr({
						href: "http://www.disanlou.org/search.php",
						target: "_blank"
					}).html("第三楼")
				);
				//163sub
				link.append(' / ')
				.append()
				.append(
					$("<a>").attr({
						href: "http://www.163sub.com/Search?id=" + movieTitle,
						target: "_blank"
					}).html("163sub")
				);
			break;
			
		case "book.douban.com":
			appendLinks(Book_links, link)
			break;
	}

	$('#info').append(link);


	function appendLinks(items, appendTo){
		items.forEach(function(item, i){
			$("<a>")
				.html(item.html)
				.attr({
					href: item.href,
					target: "_blank"
				})
				.appendTo(appendTo);

			if(i != items.length -1){
				appendTo.append(" / ");
			}
		});
	}
}

run()