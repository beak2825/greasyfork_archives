// ==UserScript==
// @name           Douban Download Helper
// @namespace      cn.icexmoon.js
// @description    增加豆瓣电影、图书，音乐的下载搜索链接
// @author         icexmoon@qq.com
// @version        3.1.3
// @license        MIT
// @include        *//movie.douban.com/subject/*
// @include        *//music.douban.com/subject/*
// @include        *//book.douban.com/subject/*
// @require         https://code.jquery.com/jquery-1.8.3.min.js
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/442386/Douban%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/442386/Douban%20Download%20Helper.meta.js
// ==/UserScript==

//脚本正文

function run() {
	var movieTitle = $('h1 span:eq(0)').text();
	var title = $('html head title').text();
	var keyword1 = title.replace('(豆瓣)', '').trim();
	var keyword2 = encodeURIComponent(keyword1);
	var keyword3 = encodeURIComponent(keyword2);
	var MovieOriginalTitle = movieTitle.replace(/^[^a-zA-Z]*/, "");
	var movieSimpleTitle = keyword1.replace(/第\S+季.*/, "");
	var movieFinalTitle = MovieOriginalTitle.replace(/Season\s/, "S");
	var isTv = false;
	if ($("select#season").length != 0) {
		isTv = true;
	}
	else {
		$("div#info").children("span").each(function () {
			if ($(this).text() == "集数:") {
				isTv = true;
				return false;
			}
		});
	}
	var isAnimation = false;
	$("span[property='v:genre']").each(function () {
		if ($(this).text() == '动画') {
			isAnimation = true;
		}
	});
	var isChinese = false;
	//console.log($("div#info").children());
	$("div#info").children("span").each(function () {
		if ($(this).text() == "制片国家/地区:") {
			if ($.trim($(this.nextSibling).text()) == "中国大陆") {
				isChinese = true;
			}
			return false;
		}
	});
	var Movie_links = [
		{ html: "动漫花园", hasAnimationTV: true, hasForignMovie: false, hasChineseMovie: false, hasChineseTV: false, hasForignTV: false, href: "https://share.dmhy.org/topics/list?keyword=" + keyword1 },
		{ html: "AGE动漫", hasAnimationTV: true, hasForignMovie: false, hasChineseMovie: false, hasChineseTV: false, hasForignTV: false, href: "https://donghua.agefans.com/search?query=" + keyword1 + "&page=1" },
		{ html: "ACG狗狗", hasAnimationTV: true, hasForignMovie: false, hasChineseMovie: false, hasChineseTV: false, hasForignTV: false, href: "http://bt.acg.gg/search.php?keyword=" + keyword2 },
		{ html: "狸猫盘搜", hasAnimationTV: true, hasForignMovie: true, hasChineseMovie: true, hasChineseTV: true, hasForignTV: true, href: "https://www.alipansou.com/search?k=" + keyword1 },
		{ html: "pan666", hasAnimationTV: true, hasForignMovie: true, hasChineseMovie: true, hasChineseTV: true, hasForignTV: true, href: "https://pan666.net/?q=" + keyword1 },
		{ html: "人人影视", hasAnimationTV: false, hasForignMovie: true, hasChineseMovie: false, hasChineseTV: false, hasForignTV: true, href: "https://www.yysub.net/search?keyword=" + keyword1 },
	];
	var Online_links = [
		{ html: "AGE动漫", hasAnimationTV: true, hasForignMovie: false, hasChineseMovie: false, hasChineseTV: false, hasForignTV: false, href: "https://donghua.agefans.com/search?query=" + keyword1 + "&page=1" },
		{ html: "影视仓", hasAnimationTV: true, hasForignMovie: true, hasChineseMovie: true, hasChineseTV: true, hasForignTV: true, href: "https://www.yingshicang.com/?auto_search_key=" + keyword2 },
		{ html: "修罗影视", hasAnimationTV: true, hasForignMovie: true, hasChineseMovie: true, hasChineseTV: true, hasForignTV: true, href: "https://v.xlys.ltd.ua/search/" + keyword2 },
		{ html: "剧馍馍", hasAnimationTV: true, hasForignMovie: true, hasChineseMovie: true, hasChineseTV: true, hasForignTV: true, href: "https://jumomo.cc/vodsearch/-------------.html?wd=" + keyword2 },
		{ html: "5点电影", hasAnimationTV: true, hasForignMovie: true, hasChineseMovie: true, hasChineseTV: true, hasForignTV: true, href: "https://www.5.movie/vodsearch/-------------.html?wd=11" + keyword2 },
	];

	var Music_links = [
		{ html: "百度盘", href: "http://wowenda.com/search?r=0&wd=" + keyword1 },
		{ html: "BOXSET.RU", href: "http://boxset.ru/?s=" + keyword1 },
		{ html: "KickAss", href: "https://kickass2.ch/usearch/" + keyword1 + "/" },
		{ html: "逛电驴", href: "http://verycd.gdajie.com/find.htm?keyword=" + keyword2 },
		{ html: "爱无损", href: "http://www.lovewusun.com/?s=" + keyword1 },
		{ html: "漫音社", href: "http://www.acgjc.com/?s=" + keyword1 },
		{ html: "TPARSER", href: "http://tparser.org/" + keyword1 },
		{ html: "无损迷", href: "http://zhannei.baidu.com/cse/search?s=7434802276389067349&entry=1&q=" + keyword1 },
		{ html: "Lossless Music Archives", href: "http://losslessma.net/?s=" + keyword1 + "&searchsubmit=U" },
	];

	var Book_links = [
		{ html: "百度盘", href: "http://wowenda.com/search?r=0&wd=" + keyword1 },
		{ html: "微盘", href: "https://duckduckgo.com/?q=" + keyword1 + " site%3Avdisk.weibo.com&ia=web" },
		{ html: "mLook", href: "http://www.mlook.mobi/search?q=" + keyword2 },
		{ html: "Library Genesis", href: "http://gen.lib.rus.ec/search.php?req=" + keyword1 + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=0&column=def" },
		{ html: "ebook3000", href: "http://ebook3000.com/plus/search.php?keyword=" + keyword1 + "&x=0&y=0" },
		{ html: "SoftArchive", href: "https://sanet.st/search/?q=" + keyword1 + "&tab_category=books" },
		{ html: "Torrentseeker", href: "https://torrentseeker.com/search.php?q=" + keyword2 },
		{ html: "新浪爱问", href: "http://ishare.iask.sina.com.cn/search/0-0-all-1-default?cond=" + keyword3 },
		{ html: "周村数字图书馆", href: "http://60.210.104.70:81/SearchResult.aspx?kinds=all&content=" + keyword1 },
		{ html: "Readfree", href: "http://readfree.me/search/?q=" + keyword1 },
		{ html: "周读", href: "http://ireadweek.com/index.php/Index/bookList.html?keyword=" + keyword1 },
		{ html: "我的小书屋", href: "http://mebook.cc/?s=" + keyword1 },
		{ html: "万千合集站", href: "http://www.hejizhan.com/html/search?keyword=" + keyword1 },
		{ html: "逛电驴", href: "http://verycd.gdajie.com/find.htm?keyword=" + keyword2 },
		{ html: "读秀@RUC", href: "https://vpn.ruc.edu.cn/,DanaInfo=book.duxiu.com+search?Field=all&channel=search&sw=" + keyword1 + "&ecode=utf-8&edtype=&searchtype=&view=0" },
		{ html: "云海电子图书馆", href: "http://www.pdfbook.cn/?s=" + keyword1 },
		{ html: "书语者", href: "https://book.shuyuzhe.com/search/" + keyword1 },
		{ html: "Mobilism", href: "https://forum.mobilism.org/search.php?keywords=" + keyword1 + "&fid[]=0&sc=1&sr=topics&sf=titleonly" },
		{ html: "超星", href: "http://book.chaoxing.com/search/all/" + keyword1 + "/bookList1_.html" },
		{ html: "So-Kindle", href: "https://www.so-kindle.com/q?type=1&keyword=" + keyword1 },
		{ html: "SoBooks", href: "https://sobooks.cc/search/" + keyword2 },
		{ html: "国学大师", href: "http://www.guoxuedashi.com/so.php?sokeytm=" + keyword1 + "&ka=100&submit=" },
		{ html: "中國哲學書電子化計劃", href: "http://ctext.org/searchbooks.pl?if=gb&searchu=" + keyword1 },
		{ html: "Kindleshare", href: "http://sk.kindleshare.cn/?q=" + keyword1 + "&submit=Search" },
		{ html: "WorldCat", href: "https://www.worldcat.org/search?qt=worldcat_org_all&q=" + keyword1 },
	];

	var Str_links = [
		{ html: "伪·射手网", href: "https://secure.assrt.net/sub/?searchword=" + keyword1 },

	];

	var Buy_links = [
		{ html: "淘宝", href: "https://s.taobao.com/search?q=" + keyword1 },
		{ html: "Amazon", href: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=" + keyword1 },
		{ html: "澜瑞外文", href: "https://www.lanree.com/search?keywords=" + keyword1 },
		{ html: "蔚蓝网", href: "http://www.wl.cn/search?keywords=" + keyword1 },
		{ html: "Book Depository", href: "https://www.bookdepository.com/search?searchTerm=" + keyword1 + "&search=Find+book" },
		{ html: "アマゾン", href: "https://www.amazon.co.jp/s/ref=nb_sb_noss?__mk_ja_JP=カタカナ&url=search-alias%3Daps&field-keywords=" + keyword1 },
		{ html: "多抓鱼", href: "http://www.duozhuayu.net/search/" + keyword1 },
		{ html: "博客來", href: "http://search.books.com.tw/search/query/key/" + keyword1 + "/cat/all" },
		{ html: "AbeBooks", href: "https://www.abebooks.com/servlet/SearchResults?sts=t&tn=" + keyword1 },
		{ html: "Buchmarie", href: "https://www.buchmarie.de/Startseite.aspx?q=" + keyword1 },
		{ html: "缺书网", href: "http://www.queshu.com/search/?c=" + keyword1 },
		{ html: "三民書店", href: "http://www.sanmin.com.tw/search/index/?ct=K&qu=" + keyword1 + "&ls=SD" },
	];

	var link = $("<div>").append(
		$("<span>").attr("class", "pl").html("传送链接:")
	);


	switch (location.host) {
		case "movie.douban.com":
			var arr_links = [];
			for (i = 0; i < Movie_links.length; i++) {
				var curLink = Movie_links[i];
				if (isTv && isAnimation) {
					if (curLink.hasAnimationTV) {
						arr_links.push(curLink);
					}
				}
				else if (isTv && isChinese) {
					if (curLink.hasChineseTV) {
						arr_links.push(curLink);
					}
				}
				else if (isTv && !isChinese) {
					if (curLink.hasForignTV) {
						arr_links.push(curLink);
					}
				}
				else if (!isTv && isChinese) {
					if (curLink.hasChineseMovie) {
						arr_links.push(curLink);
					}
				}
				else if (!isTv && !isChinese) {
					if (curLink.hasForignMovie) {
						arr_links.push(curLink);
					}
				}
				else {
					;
				}
			}
			appendLinks(arr_links, link);
			link.append('<br>')
				.append('<span class="pl">在线观看:</span>');
			//处理在线播放链接
			var used_online_links = [];
			//对链接进行过滤
			for (i = 0; i < Online_links.length; i++) {
				var curLink = Online_links[i];
				if (isTv && isAnimation) {
					if (curLink.hasAnimationTV) {
						used_online_links.push(curLink);
					}
				}
				else if (isTv && isChinese) {
					if (curLink.hasChineseTV) {
						used_online_links.push(curLink);
					}
				}
				else if (isTv && !isChinese) {
					if (curLink.hasForignTV) {
						used_online_links.push(curLink);
					}
				}
				else if (!isTv && isChinese) {
					if (curLink.hasChineseMovie) {
						used_online_links.push(curLink);
					}
				}
				else if (!isTv && !isChinese) {
					if (curLink.hasForignMovie) {
						used_online_links.push(curLink);
					}
				}
				else {
					;
				}
			}
			appendLinks(used_online_links, link);
			link.append('<br>')
				.append('<span class="pl">字幕链接:</span>');
			appendLinks(Str_links, link);


			break;
		case "book.douban.com":
			appendLinks(Book_links, link);

			link.append('<br>')
				.append('<span class="pl">购买链接:</span>');
			appendLinks(Buy_links, link);



			break;
		case "music.douban.com":
			appendLinks(Music_links, link);
			break;
	}

	$('#info').append(link);


	function appendLinks(items, appendTo) {
		items.forEach(function (item, i) {
			$("<a>")
				.html(item.html)
				.attr({
					href: item.href,
					target: "_blank"
				})
				.appendTo(appendTo);

			if (i != items.length - 1) {
				appendTo.append(" / ");
			}
		});
	}
}

run()