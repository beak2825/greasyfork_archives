// ==UserScript==
// @name        豆瓣电影下载搜索和字幕搜索
// @namespace   https://greasyfork.org/zh-CN
// @version     2.0
// @author      花似
// @web         https://subei.me  
// @description 在豆瓣电影的影评界面加入多个自己常用的影视下载搜索和字幕搜索链接！
// @include     http://movie.douban.com/subject/*
// @include     https://movie.douban.com/subject/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38041/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%E6%90%9C%E7%B4%A2%E5%92%8C%E5%AD%97%E5%B9%95%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/38041/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%E6%90%9C%E7%B4%A2%E5%92%8C%E5%AD%97%E5%B9%95%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

function
run ()

{
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace( '(豆瓣)', '' ).trim();
	var keyword2 = encodeURIComponent( keyword1 );
	var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");


	var link = $("<div>").append($("<span>").attr("class", "pl").html("影视下载: "));


	var Movie_links =
	[
		{ html: "疯狂影视搜索", href: "http://ifkdy.com/?q=" + keyword1 },
		{ html: "胖鸟电影", href: "http://www.pniao.com/Mov/so/" + keyword1 },
        { html: "电影FM", href: "http://dianying.fm/search/?text=" + keyword1 },
        { html: "电影街", href: "https://moviejie.net/search/q_" + keyword1 },
        { html: "Neets", href: " http://neets.cc/search?key=" + keyword1 },
        { html: "低端影视", href: " http://ddrk.me/?s=" + keyword1 },
	];

	switch(location.host)
	{
		case "movie.douban.com":
			appendLinks(Movie_links, link);

            link.append('<br>')
				.append('<span class="pl">在线观看: </span>')
                .append($("<a>").attr({href: "http://xlyy100.com/index.php?m=vod-search-pg-1-wd-" + keyword1,target: "_blank"}).html("降龙影院"))
				.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "https://www.kankanwu.com/index.php?s=vod-search-wd-" + keyword1,target: "_blank"}).html("看看屋"))
				.append('<span class="pl"> / </span>')
                .append($("<a>").attr({href: "http://esyy007.com/index.php?m=vod-search-pg-1-wd-" + keyword1,target: "_blank"}).html("二十影院"))
            	.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "http://qukantv.net/index.php?m=vod-search-pg-1-wd-" + keyword1,target: "_blank"}).html("去看TV网"))
				.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "https://www.lalilali.com/index.php?m=vod-search-pg-1-wd-" + keyword1,target: "_blank"}).html("拉里拉里"));

			link.append('<br>')
				.append('<span class="pl">字幕下载: </span>')
                .append($("<a>").attr({href: "http://www.zimuzu.tv/search/index?search_type=&keyword=" + keyword1,target: "_blank"}).html("人人影视"))
				.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "http://subhd.com/search/" + keyword1,target: "_blank"}).html("Sub HD字幕站"))
				.append('<span class="pl"> / </span>')
                .append($("<a>").attr({href: "http://www.zimuku.net/search?q=" + keyword1,target: "_blank"}).html("字幕库"))
            	.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "http://assrt.net/sub/?searchword=" + keyword1,target: "_blank"}).html("射手网(伪)"))
				.append('<span class="pl"> / </span>')
				.append($("<a>").attr({href: "http://www.163sub.com/Search?id=" + keyword1,target: "_blank"}).html("163字幕网"));
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