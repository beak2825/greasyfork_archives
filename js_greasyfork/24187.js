// ==UserScript==
// @name        豆瓣电影IMDb链接栏下添加搜索
// @namespace   https://greasyfork.org/scripts/24187
// @version     2017.0426
// @author      ishare
// @description 在豆瓣电影的IMDb链接栏下加入多个自己常用的影视下载搜索和字幕搜索链接！
// @include     http://movie.douban.com/subject/*
// @include     https://movie.douban.com/subject/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24187/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1IMDb%E9%93%BE%E6%8E%A5%E6%A0%8F%E4%B8%8B%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/24187/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1IMDb%E9%93%BE%E6%8E%A5%E6%A0%8F%E4%B8%8B%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

function
run ()

{
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace( '(豆瓣)', '' ).trim();
	var keyword2 = encodeURIComponent( keyword1 );
	var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");
    //var imdb = $("span:contains('tt')").text();


	var link = $("<div>").append($("<span>").attr("class", "pl").html("在线搜索: "));


	var Movie_links =
	[
		{ html: "YouTube", href: "https://www.youtube.com/results?search_query=" + keyword1 },
		{ html: "腾讯视频", href: "https://v.qq.com/x/search/?q=" + keyword1 },
		{ html: "哔哩哔哩", href: "https://search.bilibili.com/all?keyword=" + keyword1 },
	];

	switch(location.host)
	{
		case "movie.douban.com":
			appendLinks(Movie_links, link);

			link.append('<br>')
				.append('<span class="pl">下载搜索: </span>')
				.append($("<a>").attr({href: "https://www.google.com/search?q=" + keyword1 + "+下载|download",target: "_blank"}).html("Google"))
				.append('<span class="pl"> / </span>')
				//.append($("<a>").attr({href: "https://rarbg.com/tv/" + imdb + "/",target: "_blank"}).html("RARBG"))
				//.append('<span class="pl"> / </span>')
				//.append($("<a>").attr({href: "https://zooqle.com/search?q=" + keyword1 + "&t=all",target: "_blank"}).html("Zooqle"))
				//.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "https://share.dmhy.org/topics/list?keyword=" + keyword1,target: "_blank"}).html("动漫花园"))
				.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "http://www.zmz2017.com/search?keyword=" + keyword1,target: "_blank"}).html("人人影视"))
				//.append('<span class="pl"> / </span>')
				//.append($("<a>").attr({href: "https://www.zimuku.net/search?q=" + keyword1,target: "_blank"}).html("字幕库"))
				//.append('<span class="pl"> / </span>')
				//.append($("<a>").attr({href: "https://subhd.com/search/" + keyword1,target: "_blank"}).html("SubHD"))
				//.append('<span class="pl"> / </span>')
				//.append($("<a>").attr({href: "http://assrt.net/sub/?searchword=" + keyword1,target: "_blank"}).html("射手(伪)"))
				//.append('<span class="pl"> / </span>')
				//.append($("<a>").attr({href: "http://www.btbtt.la/search-index-keyword-" + keyword1 + ".htm",target: "_blank"}).html("BT之家"))
            ;
		break;

	}

	$('#info').append(link);


	function appendLinks(items, appendTo)
	{items.forEach
		(function(item, i)
		    {$("<a>")
				.html(item.html)
				.attr({href: item.href,target: "_blank"})
				.appendTo(appendTo);
			 if(i != items.length -1)
			 {appendTo.append(" / ");}
		    }
		);
	}
}

run();