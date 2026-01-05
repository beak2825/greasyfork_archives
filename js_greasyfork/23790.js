// ==UserScript==
// @name        豆瓣电影直搜
// @namespace   https://greasyfork.org/zh-CN/users/31443-007dalin
// @version     1.1600306
// @include     http://movie.douban.com/subject/*
// @include     https://movie.douban.com/subject/*
// @include     http://book.douban.com/subject/*
// @grant       none
// @description 在影评界面加入多个较好用的直搜链接
// @downloadURL https://update.greasyfork.org/scripts/23790/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/23790/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%90%9C.meta.js
// ==/UserScript==

function run () {
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace( '(豆瓣)', '' ).trim();
	var keyword2 = encodeURIComponent( keyword1 );
	var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");

	var Movie_links = [
		{ html: "百度", href: "http://www.quzhuanpan.com/source/search.action?q=" +  keyword1 },
		{ html: "百度盘", href: "http://www.panduoduo.net/s/name/" + keyword1 },
		{ html: "BT天堂吧", href: "http://www.bttt8.com/?s=" + keyword1 },
		//{ html: "VeryCD", href: "http://www.verycd.com/search/folders/" + keyword2 },
		//{ html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
		{ html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle },
		{ html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
		{ html: "BT天堂", href: "http://www.bttiantang.com/s.php?q=" + keyword1 },
        { html: "影视小二", href: "http://s.yfsoso.com/sm.php?q=" + keyword1 },
		{ html: "量子界", href: "http://www.liangzijie.com/index.php?s=vod-search-wd-" + keyword1 + "-1.html"},
		{ html: "阳光电影", href: "http://s.dydytt.net/plus/search.php?kwtype=0&searchtype=title&keyword=" + keyword2 },
		{ html: "飘花资源", href: " http://so.piaohua.com:8909/plus/search.php?kwtype=0&keyword=" + keyword1 },
		{ html: "高清Mp4吧", href: "http://www.mp4ba.com/search.php?keyword=" + keyword1 },
		{ html: "BT工厂", href: "http://www.bt1024.net/q/" + keyword2 },
		{ html: "BT蚂蚁", href: " http://www.btmayi.me/search/" + keyword1 + "-first-asc-1"},
		{ html: "海盗船", href: " https://thepiratebay.org/search/" + keyword1 + "-first-asc-1"},
		{ html: "磁力Baba", href: " http://www.cilibaba.com/search/" + keyword1 + "-first-asc-1"}
	];

	var Book_links = [
		{ html: "百度盘", href: "https://www.google.com/search?q=" + keyword1 + " site:pan.baidu.com"},
		{ html: "mLook", href: "http://www.mlook.mobi/search?q=" + keyword2 },
		{ html: "VeryCD", href: "http://www.verycd.com/search/folders/" + keyword2 },
		{ html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
		{ html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle },
		{ html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
		{ html: "Google", href: "https://www.google.com/search?ie=UTF-8&q=" + movieTitle },
	];

	var link = $("<div>").append(
		$("<span>").attr("class", "pl").html("下载搜索:")
	);

	switch(location.host){
		case "movie.douban.com":
			appendLinks(Movie_links, link)

			link.append('<br>')
				.append('<span class="pl">字幕链接:</span>')
				.append(
					$("<a>").attr({
						href: "http://www.zimuku.net/search?q=" + keyword1,
						target: "_blank"
					}).html("字幕库")
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