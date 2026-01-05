// ==UserScript==
// @name			searchEngineJump-NextStage
// @author			ted423
// @contributor		NLF && ywzhaiqi
// @description		方便的在各个引擎之间跳转。可自定义搜索列表的 NLF 修改版。
// @version			10.2022.0605.0
// @include			*
// @namespace		https://github.com/ted423
// @require			https://code.jquery.com/jquery-3.3.1.min.js
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_addStyle
// @grant      		GM_registerMenuCommand
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/16193/searchEngineJump-NextStage.user.js
// @updateURL https://update.greasyfork.org/scripts/16193/searchEngineJump-NextStage.meta.js
// ==/UserScript==


(function() {
	"use strict";
	var prefs = {
		display: true,
		openInNewTab: true, //是否在新页面打开.
		engineListDataType: "ted423", //搜索列表默认类型
		debug: false
	};
	var svg ={
		list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.626 511.626"><path d="M63.953 164.453H9.135c-2.474 0-4.615.9-6.423 2.709C.903 168.972 0 171.114 0 173.589v54.817c0 2.473.903 4.619 2.712 6.424 1.809 1.803 3.949 2.712 6.423 2.712h54.818c2.474 0 4.615-.905 6.423-2.712 1.809-1.809 2.712-3.951 2.712-6.424v-54.817c0-2.475-.904-4.617-2.712-6.427-1.808-1.806-3.949-2.709-6.423-2.709zM63.953 383.722H9.135c-2.474 0-4.615.896-6.423 2.707C.903 388.238 0 390.378 0 392.854v54.82c0 2.471.903 4.609 2.712 6.42 1.809 1.813 3.949 2.714 6.423 2.714h54.818c2.474 0 4.615-.903 6.423-2.714 1.809-1.807 2.712-3.949 2.712-6.42v-54.82c0-2.477-.904-4.616-2.712-6.426-1.808-1.803-3.949-2.706-6.423-2.706zM63.953 274.082H9.135c-2.474 0-4.615.91-6.423 2.714S0 280.749 0 283.22v54.815c0 2.478.903 4.62 2.712 6.427 1.809 1.808 3.949 2.707 6.423 2.707h54.818c2.474 0 4.615-.896 6.423-2.707 1.809-1.807 2.712-3.949 2.712-6.427V283.22c0-2.471-.904-4.613-2.712-6.424-1.808-1.807-3.949-2.714-6.423-2.714zM63.953 54.817H9.135c-2.474 0-4.615.903-6.423 2.712S0 61.479 0 63.953v54.817c0 2.475.903 4.615 2.712 6.424s3.949 2.712 6.423 2.712h54.818c2.474 0 4.615-.9 6.423-2.712 1.809-1.809 2.712-3.949 2.712-6.424V63.953c0-2.475-.904-4.615-2.712-6.424-1.808-1.804-3.949-2.712-6.423-2.712zM502.49 383.722H118.771c-2.474 0-4.615.896-6.423 2.707-1.809 1.81-2.712 3.949-2.712 6.426v54.82c0 2.471.903 4.609 2.712 6.42 1.809 1.813 3.946 2.714 6.423 2.714H502.49c2.478 0 4.616-.903 6.427-2.714 1.81-1.811 2.71-3.949 2.71-6.42v-54.82c0-2.477-.903-4.616-2.71-6.426-1.811-1.804-3.95-2.707-6.427-2.707zM502.49 274.082H118.771c-2.474 0-4.615.91-6.423 2.714s-2.712 3.953-2.712 6.424v54.815c0 2.478.903 4.62 2.712 6.427 1.809 1.808 3.946 2.707 6.423 2.707H502.49c2.478 0 4.616-.896 6.427-2.707 1.81-1.807 2.71-3.949 2.71-6.427V283.22c0-2.471-.903-4.613-2.71-6.424-1.811-1.804-3.95-2.714-6.427-2.714zM508.917 57.529c-1.811-1.805-3.949-2.712-6.427-2.712H118.771c-2.474 0-4.615.903-6.423 2.712s-2.712 3.949-2.712 6.424v54.817c0 2.475.903 4.615 2.712 6.424s3.946 2.712 6.423 2.712H502.49c2.478 0 4.616-.9 6.427-2.712 1.81-1.809 2.71-3.949 2.71-6.424V63.953c-.001-2.474-.904-4.615-2.71-6.424zM502.49 164.453H118.771c-2.474 0-4.615.9-6.423 2.709-1.809 1.81-2.712 3.952-2.712 6.427v54.817c0 2.473.903 4.615 2.712 6.424 1.809 1.803 3.946 2.712 6.423 2.712H502.49c2.478 0 4.616-.905 6.427-2.712 1.81-1.809 2.71-3.951 2.71-6.424v-54.817c0-2.475-.903-4.617-2.71-6.427-1.811-1.806-3.95-2.709-6.427-2.709z"/></svg>',
		setting: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 438.529 438.529"><path d="M436.25 181.438c-1.529-2.002-3.524-3.193-5.995-3.571l-52.249-7.992c-2.854-9.137-6.756-18.461-11.704-27.98 3.422-4.758 8.559-11.466 15.41-20.129 6.851-8.661 11.703-14.987 14.561-18.986 1.523-2.094 2.279-4.281 2.279-6.567 0-2.663-.66-4.755-1.998-6.28-6.848-9.708-22.552-25.885-47.106-48.536-2.275-1.903-4.661-2.854-7.132-2.854-2.857 0-5.14.855-6.854 2.567l-40.539 30.549c-7.806-3.999-16.371-7.52-25.693-10.565l-7.994-52.529c-.191-2.474-1.287-4.521-3.285-6.139C255.95.806 253.623 0 250.954 0h-63.38c-5.52 0-8.947 2.663-10.278 7.993-2.475 9.513-5.236 27.214-8.28 53.1-8.947 2.86-17.607 6.476-25.981 10.853l-39.399-30.549c-2.474-1.903-4.948-2.854-7.422-2.854-4.187 0-13.179 6.804-26.979 20.413-13.8 13.612-23.169 23.841-28.122 30.69-1.714 2.474-2.568 4.664-2.568 6.567 0 2.286.95 4.57 2.853 6.851 12.751 15.42 22.936 28.549 30.55 39.403-4.759 8.754-8.47 17.511-11.132 26.265l-53.105 7.992c-2.093.382-3.9 1.621-5.424 3.715C.76 182.531 0 184.722 0 187.002v63.383c0 2.478.76 4.709 2.284 6.708 1.524 1.998 3.521 3.195 5.996 3.572l52.25 7.71c2.663 9.325 6.564 18.743 11.704 28.257-3.424 4.761-8.563 11.468-15.415 20.129-6.851 8.665-11.709 14.989-14.561 18.986-1.525 2.102-2.285 4.285-2.285 6.57 0 2.471.666 4.658 1.997 6.561 7.423 10.284 23.125 26.272 47.109 47.969 2.095 2.094 4.475 3.138 7.137 3.138 2.857 0 5.236-.852 7.138-2.563l40.259-30.553c7.808 3.997 16.371 7.519 25.697 10.568l7.993 52.529c.193 2.471 1.287 4.518 3.283 6.14 1.997 1.622 4.331 2.423 6.995 2.423h63.38c5.53 0 8.952-2.662 10.287-7.994 2.471-9.514 5.229-27.213 8.274-53.098 8.946-2.858 17.607-6.476 25.981-10.855l39.402 30.84c2.663 1.712 5.141 2.563 7.42 2.563 4.186 0 13.131-6.752 26.833-20.27 13.709-13.511 23.13-23.79 28.264-30.837 1.711-1.902 2.569-4.09 2.569-6.561 0-2.478-.947-4.862-2.857-7.139-13.698-16.754-23.883-29.882-30.546-39.402 3.806-7.043 7.519-15.701 11.136-25.98l52.817-7.988c2.279-.383 4.189-1.622 5.708-3.716 1.523-2.098 2.279-4.288 2.279-6.571v-63.376c.005-2.474-.751-4.707-2.278-6.707zm-165.304 89.501c-14.271 14.277-31.497 21.416-51.676 21.416-20.177 0-37.401-7.139-51.678-21.416-14.272-14.271-21.411-31.498-21.411-51.673 0-20.177 7.135-37.401 21.411-51.678 14.277-14.272 31.504-21.411 51.678-21.411 20.179 0 37.406 7.139 51.676 21.411 14.274 14.277 21.413 31.501 21.413 51.678 0 20.175-7.138 37.403-21.413 51.673z"/></svg>'
	};
	var engineListData = {
		custom: "",
		ted423: "网页\n	Google\n		Google, https://www.google.com/search?q=%s&safe=off\n		Google.hk, https://www.google.com.hk/search?q=%s&safe=off\n		Google.co.jp，https://www.google.co.jp/search?q=%s&safe=off\n	百度, https://www.baidu.com/s?wd=%s\n	360, https://www.so.com/s?q=%s\n	Bing\n		Bing(CN), https://cn.bing.com/search?q=%s\n		Bing(Global), https://global.bing.com/search?q=%s&setmkt=en-us&setlang=en-us\n	搜狗, https://www.sogou.com/web?query=%s\n	DuckDuckGo, https://duckduckgo.com/?q=%s\n	Yahoo\n		Yahoo, https://search.yahoo.com/search?p=%s\n		Yahoo(tw), https://tw.search.yahoo.com/search?p=%s\n 		Yahoo.co.jp, https://search.yahoo.co.jp/search?p=%s&aq=-1&x=wrt\n	Startpage, https://www.startpage.com/do/search?q=%s\n资料\n	Wiki\n		ZWiki, https://zh.wikipedia.org/w/index.php?search=%s&button=&title=Special%3ASearch\n		EWiki, https://en.wikipedia.org/w/index.php?search=%s&button=&title=Special%3ASearch\n		JWiki, https://ja.wikipedia.org/w/index.php?search=%s&button=&title=Special%3ASearch\n	百度百科, https://baike.baidu.com/searchword/?word=%s\n	Internet Archive, https://archive.org/search.php?query=%s\n	Scholar, http://scholar.google.com/scholar?hl=zh-CN&q=%s&btnG=&lr=\n	百度学术, https://xueshu.baidu.com/s?wd=%s\n	知乎, https://www.zhihu.com/search?q=%s\n	萌娘百科, http://zh.moegirl.org/index.php?search=%s\n	Google Book, https://www.google.com/search?q=%s&btnG=搜索图书&tbm=bks&tbo=1&hl=zh-CN&gws_rd=ssl\n	中国知网, https://kns.cnki.net/KNS8/DefaultResult/Index?dbcode=CFLS&kw=%s\n	爱学术, https://www.ixueshu.com/search/index.html?search_type=&q=%s\n	维普, http://lib.cqvip.com/Qikan/Search/Index?from=Qikan_Search_Index/%post#key=u%3D%s#indexKey=%s\n	开发\n		stackoverflow, https://stackoverflow.com/search?q=%s\n		MDN, https://developer.mozilla.org/en-US/search?q=%s\n		github, https://github.com/search?q=%s\n		krugle, http://opensearch.krugle.org/document/search/#query=%s\n		npm, https://www.npmjs.org/search?q=%s\n地图\n	百度, http://map.baidu.com/?newmap=1&s=s%26wd%3D%s\n	Google, https://www.google.com/maps/search/%s/\n	Bing, https://www.bing.com/ditu/?q=%s\n	搜狗, https://map.sogou.com/#lq=%s\n音乐\n	千千, https://music.taihe.com/search?word=%s\n	QQ, https://y.qq.com/portal/search.html#page=1&searchid=1&t=song&w=%s\n	一听, https://so.1ting.com/song?q=%s\n	虾米, http://www.xiami.com/search?key=%s\n	piapro, https://piapro.jp/search/?view=audio&keyword=%s\n	刘志进, https://music.liuzhijin.cn/?name=%s&type=qq\n	歌词\n		QQ歌词, https://y.qq.com/portal/search.html#page=1&searchid=1&t=lyric&w=%s\n		一听歌词, https://so.1ting.com/lyric?q=%s\n		歌词迷, http://gecimi.com/search/?keyword=%s\n图片\n	百度, http://image.baidu.com/search/index?tn=baiduimage&word=%s\n	Google, https://www.google.com.hk/search?tbm=isch&q=%s\n	花瓣, https://huaban.com/search/?q=%s\n	Picsearch, http://cn.picsearch.com/index.cgi?q=%s\n	Flickr, https://www.flickr.com/search/?w=all&q=%s\n	Pixiv, http://www.pixiv.net/search.php?s_mode=s_tag&word=%s\n	dA, https://www.deviantart.com/browse/all/?q=%s\n下载\n	BTDigg, https://btdig.com/search?q=%s\n	idope, https://idope.se/torrent-list/%s\n	TK, https://www.torrentkitty.tv/search/%s\n	limetorrents\n		co, https://www.limetorrents.co/search/all/%s\n		asia, https://www.limetorrents.asia/search/all/%s\n		pro, https://www.limetor.pro/search/all/%s\n	ED2K\n		xiaohx, https://v1.xiaohx.org/search?key=%s\n		cdsoso, https://www.cdsoso.cc/searches-%s-hot-1-null.html\n	字幕\n		zimuku, https://zimuku.org/search?q=%s&vertoken=d49cac93\n		射手网(伪), https://assrt.net/sub/?searchword=%s\n		sub HD, https://subhd.la/search/%s\n		Subscene, https://subscene.com/subtitles/searchbytitle%post#query=%s\n		R3SUB, https://r3sub.com/search.php?s=%s\n影视\n	torrentfunk2, https://www.torrentfunk2.com/all/torrents/%s.html?v=&smi=&sma=&i=250\n	thepiratebay, https://thepiratebay.org/search/%s\n	zooqle, https://zooqle.com/search?q=%s\n	pianyuan, http://www.pianyuan.la/search?q=%s\n	Torrentz2, https://www.torrentz2.xyz/?q=%s\n	Torrentz2k, https://torrentz2k.xyz/search/%post#q=%s#category=all\n	1337x.to, https://www.1377x.to/search/%s/1/\n	Torlock, https://www.torlock2.com/all/torrents/%s.html\n	YourBT, https://yourbittorrent2.com/?q=%s\n	TD, https://www.torrentdownloads.me/search/?search=%s\n	xiaohx, https://www.xiaohx.org/search?key=%s\n	RARBG\n		rarbgprx, https://rarbgprx.org/torrents.php?search=%s\n		rarbgproxy, https://rarbgproxy.org/torrents.php?search=%s\n	kickass(镜像1), https://kat.sx/search.php?q=%s\n	kickass(镜像2)\n		kickasstorrents, https://kickasstorrents.to/usearch/%s\n		kickass1.to, https://kickass1.to/usearch/%s/\n		kat.am, https://kat.am/usearch/%s/\n		kickasstorrent.cr, https://kickasstorrent.cr/usearch/%s/\nACG\n	nyaa.si, https://nyaa.si/?f=0&c=0_0&q=%s\n	dmhy, https://share.dmhy.org/topics/list?keyword=%s\n	Tokyotosho, https://www.tokyotosho.info/search.php?terms=%s\n	Mikan, http://mikanani.me/Home/Search?searchstr=%s\n	＊MioBT＊, http://www.miobt.com/search.php?keyword=%s\n	shana project, https://www.shanaproject.com/search/?title=%s\n	简单动漫, https://www.36dm.com/search.php?keyword=%s\n	KOTOMI RSS, https://moe4sale.in/?kw=%s\n	ACG狗狗, http://bt.acg.gg/search.php?keyword=%s\n	ACG.RIP, https://acg.rip/?term=%s\n	AcgnX, https://www.acgnx.se/search.php?sort_id=0&keyword=%s\n	末日動漫, https://share.acgnx.se/search.php?sort_id=0&keyword=%s\nSukebei\n	nyaa.si, https://sukebei.nyaa.si/?f=0&c=0_0&q=%s\n	Glodls, https://glodls.to/search_results.php?search=%s\n	AniDex, https://anidex.info/?q=%s\n	AcgnX Ero, https://www.anix.moe/search.php?sort_id=0&keyword=%s\n	AniRena, https://www.anirena.com/?s=%s\n	GGBases, http://www.ggbases.com/search.so?title=%s\n网购\n	一淘, https://www.etao.com/search.htm?nq=%s\n	京东, https://search.jd.com/Search?keyword=%s&enc=utf-8\n	淘宝, https://s.taobao.com/search?q=%s\n	亚马逊, https://www.amazon.cn/s/ref=nb_ss?keywords=%s\netc\n	邮编库, http://www.youbianku.com/%s\n	AMO, https://addons.mozilla.org/zh-CN/firefox/search/?q=%s\n	汉典(字), http://www.zdic.net/sousuo/?q=%s&tp=tp1\n	汉典(词), http://www.zdic.net/sousuo/?q=%s&tp=tp3",
	};

	var MAIN_CSS = "#sej-button{\n	position: fixed;\n    top: 0px;\n    left: 0px;\n    width: 14px;\n    height: 14px;\n    background: grey;\n    border-radius: 7px !important;\n    display: block;\n    z-index: 91111111111;\n    cursor: crosshair;\n}\n#sej-container{\n	position:fixed;\n	top:0px;\n	z-index:91111111111;\n	margin:0;\n	background: white;\n	box-shadow:0px 0px 3px #aaaaaa;\n	margin:0 auto;\n	display:table;\n	font-family: Comic Sans MS, 'Microsoft YaHei', 微软雅黑;\n	line-height: 1.5;\n	font-size: 9px;\n	transition: opacity 0.5s ease-in-out;\n}\nsejul{\n	border: 1px solid #333;\n}\n#sej-container svg{\n	height:15px;\n	vertical-align: text-bottom;\n	padding-right: 1px;\n}\n#sej-container button{\n	font-size:9px;\n}\n\nsejul, sejli{\n	margin: 0;\n	padding: 0;\n	list-style: none outside;\n}\nsejli{\n	display: list-item;\n}\nsejli:hover>sejul{\n	display:block;\n}\nbody>sejul>sejli{\n	float: left;\n}\nsejli sejul{\n	position: absolute;\n}\nsejli sejul sejul{\n	margin-left: 100px;\n	margin-top: -30px;\n}\nsejli sejul .sej-engine{\n	padding: 4px 0px;\n	width:100%;\n	text-align: left;\n	text-indent: 5px;\n}\n#sej-container>sejli{\n	float: left;\n	border-right: 1px solid #333;\n}\n#sej-container>sejli:last-child{\n	border-right: none;\n}\n#sej-expanded-category{\n	display: inline-block;\n	font-weight: bold;\n	padding: 0px 4px;\n	line-height: 2;\n}\n#sej-expanded-category::after{\n	content:' :';\n}\n.sej-engine{\n	line-height: 2;\n	display: inline-block;\n	margin: 0;\n	border: none;\n	padding: 0px 4px;\n	text-decoration: none;\n	transition: background-color 0.15s ease-in-out;\n}\na.sej-engine{\n	white-space: nowrap;\n	min-width: 55px;\n	text-align: center;\n}\nbutton.sej-engine{\n	background-color: #FFFFFF;\n	font-family: Comic Sans MS, 'Microsoft YaHei', 微软雅黑;\n	color: #120886;\n	cursor:pointer;\n}\na.sej-engine:visited, a.sej-engine:active{\n	color: #120886;\n}\na.sej-engine:link, a.sej-engine:visited{\n	text-decoration: none;\n}\n.sej-drop-list-trigger-shown{\n	background-color: #DEEDFF !important;\n}\n.sej-drop-list-trigger::after {\n	content:\'\';\n	display: inline-block;\n	margin: 0 0 0 3px;\n	padding: 0;\n	width: 0;\n	height: 0;\n	border-top: 6px solid #BCBCBC;\n	border-right: 5px solid transparent;\n	border-left: 5px solid transparent;\n	border-bottom: 0px solid transparent;\n	transition: -webkit-transform 0.3s ease-in-out;\n	transition: transform 0.3s ease-in-out;\n	vertical-align: unset;\n}\n.sej-drop-list-trigger-shown::after {\n	-webkit-transform: rotate(180deg);\n	transform: rotate(180deg);\n}\n.sej-engine:hover {\n	background-color: #EAEAEA;\n}\n.sej-engine-icon {\n	display: inline-block;\n	height: 16px;\n	border: none;\n	padding: 0;\n	margin: 0 3px 0 0;\n	vertical-align: sub;\n}\n.sej-drop-list {\n	display: none;\n	float: left;\n	min-width: 100px;\n	font-size: 13px;\n	-moz-box-shadow: 2px 2px 5px #ccc;\n	-webkit-box-shadow: 2px 2px 5px #ccc;\n	box-shadow: 2px 2px 5px #ccc;\n	background-color: white;\n}\n.sej-drop-list> sejli {\n	border-bottom: 1px solid #333;\n}\n.sej-drop-list> sejli:last-child {\n	border-bottom: none;\n}";

	var categoryMap = { //rules 和 engineList 的对应
		"web": "网页",
		"map": "地图",
		"video": "视频",
		"music": "音乐",
		"image": "图片",
		"Movie": "影视",
		"knowledge": "资料",
		"sociality": "社交",
		"shopping": "网购",
		"download": "下载",
	};

	var engineListIntroduce = getMStr(function() {
		/*
		<div>
			<h2>分类规则：</h2>
			<i>【名称最好不要更改，类别跟站点规则有个对应关系】</i>
			<p>1、"音乐--music"，代表类别是 "音乐"</p>
		</div>
		<div>
			<h2>搜索引擎规则：</h2>
			<code>名称，地址（%s 关键字）</code>
			<p>1、"//" 开头会被忽略</p>
			<p>2、中间分隔符：中文逗号（，） 或 英文逗号 + 空格（, ）</p>
			<p>3、站点图标也可省略</p>
			<p>4、POST 范例 维普, http://lib.cqvip.com/Qikan/Search/Index?from=Qikan_Search_Index/%post#key=u%3D%s#indexKey=%s</p>
		</div>
		 */
	});

	function introduceToHtml() {
		return engineListIntroduce.replace(/(（.*?）)/g, "<span>$1</span>")
			.replace(/"(.*?)"/g, "<span>$1</span>");
	}
	
	function isTheSameCategory(c1, c2) {
		return (categoryMap[c1] || c1) == (categoryMap[c2] || c2);
	}

	var rules = [ //根据规则把搜索引擎列表插入到指定网站		
		{// 网页,第一个可以当模板看
			name: "google网页搜索", //你要加载的网站的名字(方便自己查找)
			url: /^https?:\/\/(encrypted\.google\.com|www\.google\.(?!co\.jp)[^\/]{2,9})\/(webhp|search|#|$|\?)(?!.*tbm=)/, //在哪个网站上加载,正则.
			mutationTitle: true, //mutationTitle监视标题的变化
			engineList: "web", //加载哪个类型的列表:
			// keyword 使用 css选中一个form input元素 或者 该项是一个函数，使用返回值
			// 插入文档,相关
			// target 将引擎跳转工具栏插入到文档的某个元素
			// (请使用css匹配,比如: "#subform_ctrl" );
			// where 四种:
			// "beforeBegin"(插入到给定元素的前面) ;
			// "afterBegin"(作为给定元素的第一个子元素) ;
			// "beforeEnd" (作为给定元素的最后一个子元素) ;
			// "afterEnd"(插入到给定元素的后面);.
		}, {
			name: "google.co.jp",
			url: /^https?:\/\/www\.google\.co\.jp\/(webhp|search|#|$|\?)(?:.(?!&tbm=))*$/,
			mutationTitle: true,
			engineList: "web",
			
		}, {
			name: "Startpage",
			url: /^https?:\/\/[a-z0-9]{3}\.startpage\.com\//,
			mutationTitle: true,
			engineList: "web",
			
		}, {
			name: "baidu 网页搜索", //因为不刷新搜索，所以百度跳简洁搜索会有问题
			url: /^https?:\/\/www\.baidu\.com\/(?:s.*|baidu.*|\?bn.*|\?tn.*|)$/,//bn、tn是推广之类的东西
			mutationTitle: true,
			engineList: "web",
			endFix: function() {
					if (getComputedStyle(document.getElementById("lg")).display != "none") remove();
				} //通过检测首页图片判断，在首页的话不显示
		}, {
			name: "bing(global)",
			url: /^https?:\/\/global\.bing\.com\/search/,
			engineList: "web",
		}, {
			name: "必应网页搜索",
			url: /^https?:\/\/(cn|www)\.bing\.com\/search/,
			engineList: "web",
		}, {
			name: "360搜索",
			url: /^https?:\/\/www\.so\.com\/s\?/,
			engineList: "web",
		}, {
			name: "搜狗网页搜索",
			url: /^https?:\/\/www\.sogou\.com\/(?:web|s)/,
			engineList: "web",
			keyword: "#upquery",
		}, {
			name: "雅虎网页搜索",
			url: /^https?:\/\/search\.yahoo\.com\/search/,
			change: "noExternalRequests",
			engineList: "网页",
		}, {
			name: "tw.yahoo",
			url: /^https?:\/\/tw\.search\.yahoo\.com\/search/,
			change: "noExternalRequests",
			engineList: "web",
		}, {
			name: "yahoo.co.jp",
			url: /^https?:\/\/search\.yahoo\.co\.jp\/search/,
			engineList: "web",
		}, {
			name: "duckduckgo",
			url: /^https?:\/\/duckduckgo\.com\/\?/,
			engineList: "web",
		},
		// 知识
		{
			name: "Scholar",
			url: /^https?:\/\/scholar\.google(?:\.\D{1,3}){1,2}\/scholar\?/,
			engineList: "资料",
		}, {
			name: "百度学术",
			url: /^https?:\/\/xueshu\.baidu\.com\/s\?/,
			engineList: "资料",
			
		}, {
			name: "IA",
			url: /^https?:\/\/archive\.org\/search\.php/,
			engineList: "资料",
			keyword: "input[type='text'][value]",
		}, {
			name: "百度百科",
			url: /^https?:\/\/baike\.baidu\.com\/(search|item)/,
			engineList: "资料",
		}, {
			name: "萌娘百科",
			url: /^https?:\/\/zh\.moegirl\.org\/./,
			engineList: "资料",
			keyword: function() {
				if (document.getElementById("searchText")) return document.querySelector("input[type='search']").value;
				else return document.getElementById("firstHeading").textContent;
			},
		}, {
			name: "Google book",
			url: /^https?:\/\/www\.google\.co.{1,3}\/search\?.*(&btnG=%E6)|(tbm=bks)/,
			mutationTitle: true,
			engineList: "资料",
		}, {
			name: "互动百科",
			url: /^https?:\/\/[a-z]{2,3}\.baike\.com\/[a-z]/,
			engineList: "资料",
			keyword: function() {
				var input;
				if (document.getElementsByClassName("ac_input")[0] != undefined) {
					if (document.getElementsByClassName("ac_input")[0].value != "")
						input = document.getElementsByClassName("ac_input")[0].value;
					else if (document.getElementsByClassName("blue")[0].innerHTML != "") input = document.getElementsByClassName("blue")[0].innerHTML;
					else input = document.evaluate("//h1", document, null, 9, null).singleNodeValue.innerHTML;
				} else if (document.getElementsByClassName("blue")[0].innerHTML != "") input = document.getElementsByClassName("blue")[0].innerHTML;
				else input = document.evaluate("//h1", document, null, 9, null).singleNodeValue.innerHTML;
				return input;
			},
		}, {
			name: "wiki",
			url: /^https?:\/\/..\.wikipedia\.org\/w\/index\.php(?!.*\?search=)/,
			engineList: "资料",
		}, {
			name: "wiki[ZH]",
			url: /^https?:\/\/zh\.wikipedia\.org\/(?:zh|wiki\/|w\/index.php\?search=)/,
			engineList: "资料",
			keyword: function() {
				if (document.getElementById("searchText"))return document.querySelector("#searchText>input").value;
				else return document.getElementById("firstHeading").childNodes[0].textContent;
			},
			
		}, {
			name: "wiki[EN]",
			url: /^https?:\/\/en\.wikipedia\.org\/(wiki\/|w\/index\.php\?search=)/,
			engineList: "资料",
			keyword: function() {
				if (document.getElementById("searchText"))
					return document.querySelector("#searchText>input").value;
				else return document.getElementById("firstHeading").childNodes[0].textContent;
			},
			
		}, {
			name: "wiki[JP]",
			url: /^https?:\/\/ja\.wikipedia\.org\/(wiki\/|w\/index\.php\?search=)/,
			engineList: "资料",
			keyword: function() {
				if (document.getElementById("searchText"))return document.querySelector("#searchText>input").value;
				else return document.getElementById("firstHeading").childNodes[0].textContent;
			},
		}, {
			name: "百度知道(search)",
			url: /^https?:\/\/zhidao\.baidu\.com\/search/,
			engineList: "资料",
		}, {
			name: "百度知道(search)",
			url: /^https?:\/\/zhidao\.baidu\.com\/search/,
			engineList: "资料",
		}, {
			name: "维普",
			url: /^https?:\/\/lib\.cqvip\.com\/Qikan/,
			engineList: "资料",
		}, {
			name: "爱学术",
			url: /^https?:\/\/www\.ixueshu\.com\/\search/,
			engineList: "资料",
		}, {
			name: "中国知网",
			url: /^https?:\/\/kns\.cnki\.net\/\KNS8\/DefaultResult/,
			engineList: "资料",
		}, {
			name: "知乎",
			url: /^https?:\/\/www\.zhihu\.com\/search\?/,
			change: "noExternalRequests",
			engineList: "资料",
		}, {
			name: "stackoverflow",
			url: /^https?:\/\/stackoverflow\.com\/search\?/,
			engineList: "资料",
		}, {
			name: "百度文库",
			url: /^https?:\/\/wenku\.baidu\.com\/search\?/,
			engineList: "资料",
		}, {
			name: "豆丁",
			url: /^https?:\/\/www\.docin\.com\/search\.do/,
			engineList: "资料",
			
		},
		// 地图
		{
			name: "百度地图",
			url: /^https?:\/\/map\.baidu\.com\/\?newmap/,
			engineList: "map",
		}, {
			name: "google地图",
			url: /^https?:\/\/www\.google\.co.{1,4}\/maps/,
			engineList: "map",
			mutationTitle: true,
		}, {
			name: "Bing地图",
			url: /^https?:\/\/[^.]*\.bing\.com\/ditu\//,
			engineList: "map",
		}, {
			name: "搜狗地图",
			url: /^https?:\/\/map\.sogou\.com\/#/,
			engineList: "map",
		},
		// 音乐
		{
			name: "千千音乐",
			url: /^https?:\/\/music\.taihe\.com\/search/,
			engineList: "music",
			keyword:".container input[valuekey]"
		}, {
			name: "QQ音乐",
			url: /^https?:\/\/y\.qq\.com\/portal\/search/,
			engineList: "music",
			keyword: ".search_input__input",
		}, {
			name: "音悦台",
			url: /^https?:\/\/so\.yinyuetai\.com\/mv\?/,
			engineList: "music",
		}, {
			name: "刘志进",
			url: /^https?:\/\/music\.liuzhijin\.cn\/\?name/,
			engineList: "music",
		}, {
			name: "一听音乐",
			url: /^https?:\/\/so\.1ting\.com\/(?!lyric)/,
			engineList: "music",
			etc: function() { //处理一听根据reffer拒绝访问的问题
				if (document.referrer.indexOf("https://so.1ting.com") == -1) {
					location.reload();
				}
			}
		}, {
			name: "一听歌词",
			url: /^https?:\/\/so\.1ting\.com\/lyric/,
			engineList: "music",
			etc: function() { //处理一听根据reffer拒绝访问的问题
				if (document.referrer.indexOf("https://so.1ting.com") == -1) {
					location.reload();
				}
			}
		}, {
			name: "歌词迷",
			url: /^https?:\/\/gecimi\.com\/search/,
			engineList: "music",
			keyword: function() {
				var key = location.href.split("keyword=")[1];
				return key;
			},
		}, {
			name: "xiami",
			url: /^https?:\/\/www\.xiami\.com\/search/,
			engineList: "music",
			keyword: function() {
				var key = location.href.split("key=")[1];
				return key;
			},
		},
		// 图片
		{
			name: "谷歌图片",
			url: /^https?:\/\/\w{2,10}\.google(?:\.\D{1,3}){1,2}\/search\?(.*tbs=sbi)|(.*tbm=isch)/,
			engineList: "image",
		}, {
			name: "百度图片",
			url: /^https?:\/\/image\.baidu\.c(om|n)\/search/,
			engineList: "image",
			style: "margin-left:35px"
		}, {
			name: "360图片",
			url: /^https?:\/\/\image\.so\.com\/i\?/,
			engineList: "image",
		}, {
			name: "bing图片",
			url: /^https?:\/\/.*\.bing\.com\/images\/search/,
			engineList: "image",
					}, {
			name: "搜狗图片",
			url: /^https?:\/\/pic\.sogou\.com\/pic/,
			engineList: "image",
		}, {
			name: "花瓣",
			url: /^https?:\/\/huaban\.com\/search\/\?/,
			engineList: "image",
		}, {
			name: "flickr",
			url: /^https?:\/\/www\.flickr\.com\/search/,
			change: "noExternalRequests",
			engineList: "image",
			keyword: function() {
				var input = document.querySelector("input[type='text'][value]");
				if (input) return input.value;
				else {
					var m = location.search.match(/q=([^&]+)/i);
					if (m) return true;
				}
			},
		}, {
			name: "picsearch",
			url: /^http:\/\/(..|...)\.picsearch\.com\/index\.cgi/,
			engineList: "image",
		}, {
			name: "pixiv",
			url: /^http:\/\/www\.pixiv\.net\/search\.php/,
			engineList: "image",
			keyword: "input[name=word]",
		}, {
			name: "deviantart",
			url: /^https?:\/\/www\.deviantart\.com\/browse\/all\//,
			engineList: "image",
			keyword: "#searchInput",
			etc: function() { //这个是为了调整编码
				if (window.location.href.indexOf("%26%23") == -1 && /%[A-Fa-f8-9][A-Fa-f0-9]/.test(window.location.href)) {
					var url = window.location.href.split("q=");
					window.location.href = url[0] + "q=" + toEscapeCharacter(decodeURIComponent(url[1]));
				}
			}
		},
		// 下载
		{
			name: "xiaohx",
			url: /^https?:\/\/www\.xiaohx\.org\/search\?/,
			engineList: "download",
			keyword:"input.search"
		}, {
			name: "xiaohx",
			url: /^https?:\/\/v1\.xiaohx\.org\/search\?/,
			engineList: "download",
		}, {
			name: "cdsoso",
			url: /^https?:\/\/www\.cdsoso\.cc\/searches/,
			engineList: "download",
		}, {
			name: "ed2000",
			url: /^https?:\/\/www\.ed2000\.com\/FileList\.asp/,
			engineList: "download",
		}, {
			name: "BTSOW",
			url: /^https?:\/\/btio\.pw\/search\//,
			engineList: "download",
		}, {
			name: "limetorrents",
			url: /^https?:\/\/www\.(limetorrents\.(info|asia|co)|limetor\.pro)\/search\//,
			engineList: "download",
		}, {
			name: "idope",
			url: /^https?:\/\/idope\.se\/torrent-list\//,
			engineList: "download",
		}, {			
			name: "torrentkitty",	
			url: /^https?:\/\/(www\.)?torrentkitty\.(net|org|tv)\/search\//,	
			engineList: "download",	
			keyword: function() {	
				return document.getElementsByTagName("h2")[0].innerHTML.slice(18, -1);	
			},	
		}, 
		//影视
		{
			name: "thepiratebay",
			url: /^https?:\/\/thepiratebay\.org\/search/,
			engineList: "Movie",
		}, {
			name: "1337x",
			url: /^https?:\/\/www\.1377x\.to\/(sort-)?search/,
			engineList: "Movie",
		}, {
			name: "btdig",
			url: /^https?:\/\/(www\.)?btdig\.com\/search\?/,
			engineList: "download",
		}, {
			name: "kickass(替代)",
			url: /^https?:\/\/(kickass1\.to|kickasstorrent\.cr|kat\.am|kickasstorrents\.to)\/usearch\//,
			engineList: "Movie",
			keyword: function() {
				var key = document.querySelector("#contentSearch").value;
				if (key) return key;
				else key = document.title.split('"')[1];
				return key;
			},
		}, {
			name: "kickass(镜像1)",
			url: /^https?:\/\/kat\.sx\/u?search/,
			engineList: "Movie",
		}, {
			name: "RARBG",
			url: /^https?:\/\/(rarbgproxy\.org|rarbg\.is|rarbgprx\.org)\/torrents\.php\?search/,
			engineList: "Movie",
		}, {
			name: "yourbittorrent",
			url: /^https?:\/\/yourbittorrent2?\.com\/\?q/,
			engineList: "Movie",
		}, {
			name: "pianyuan",
			url: /^https?:\/\/www\.pianyuan\.la\/search\?q/,
			engineList: "Movie",
		}, {
			name: "torrentfunk2",
			url: /^https?:\/\/www\.torrentfunk2\.com\/[a-z]/,
			engineList: "download",
		}, {
			name: "idope",
			url: /^https?:\/\/zooqle\.com\/search\?/,
			engineList: "download",
		}, {
			name: "torlock",
			url: /^https?:\/\/www\.torlock2\.com\/[a-zA-Z]/,
			engineList: "Movie",
			keyword: function() {
				var key = document.title.split('Torrents')[0].replace('-',' ');
				return key;
			},
		}, {
			name: "torrent downloads",
			url: /^https?:\/\/www\.torrentdownloads\.me\/search\/\?search/,
			engineList: "Movie",
			keyword: "input[name='search']",
		}, {
			name: "extratorrent.si",
			url: /^https?:\/\/extratorrent\.si\/search\/\?search/,
			engineList: "Movie",
		}, {	
			name: "Torrentz2",	
			url: /^https?:\/\/(www\.)?torrentz2\.xyz\/\?q/,	
			engineList: "download",	
		}, {	
			name: "Torrentz2k",	
			url: /^https?:\/\/torrentz2k\.xyz\/search/,	
			engineList: "download",	
		},
		//ACG
		{
			name: "dmhy",
			url: /^https?:\/\/share\.dmhy\.org\/topics\/list/,
			engineList: "ACG",
			keyword: function() {
				var key = document.querySelector("#keyword").value;
				if (key) return key;
				else key = document.title.split(/「|」/)[1];
				return key;
			},
		}, {
			name: "Tokyotosho",
			url: /^https?:\/\/www\.tokyotosho\.info\/search\.php/,
			engineList: "ACG",
		}, {
			name: "＊MioBT＊",
			url: /^https?:\/\/www\.miobt\.com\/search\.php/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "爱恋动漫",
			url: /^https?:\/\/www\.kisssub\.org\/search\.php/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "Mikan",
			url: /^https?:\/\/mikanani\.me\/Home\/Search\?searchstr/,
			engineList: "ACG",
		}, {
			name: "acgsou",
			url: /^https?:\/\/www\.acgsou\.com\/search\.php/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "36dm",
			url: /^https?:\/\/www\.36dm\.com\/search\.php/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "KOTOMI RSS",
			url: /^https?:\/\/moe4sale\.in\/\?kw/,
			engineList: "ACG",
		}, {
			name: "ACG狗狗",
			url: /^https?:\/\/bt\.acg\.gg\/search/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "ACG.RIP",
			url: /^https?:\/\/acg\.rip\/\?term/,
			engineList: "ACG",
		}, {
			name: "nyaa.si",
			url: /^https?:\/\/nyaa\.(si|uk)\/\?/,
			engineList: "ACG",
		}, {
			name: "Nyaapantsu",
			url: /^https?:\/\/(nyaa\.|www\.|)?(pantsu\.cat|nyaa\.pt)\/search\?/,
			engineList: "ACG",
		}, {
			name: "shana project",
			url: /^https?:\/\/www\.shanaproject\.com\/search/,
			engineList: "ACG",
		}, {
			name: "AcgnX",
			url: /^https?:\/\/www\.acgnx\.se\/search\.php\?/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "末日动漫",
			url: /^https?:\/\/share\.acgnx\.se\/search\.php\?/,
			engineList: "ACG",
			keyword: "#topsearch",
		}, {
			name: "AniRena",
			url: /^https?:\/\/www\.anirena\.com\/\?s/,
			engineList: "ACG",
		},
		//Sukebei
		{
			name: "GGBases",
			url: /^https?:\/\/www\.ggbases\.com\/search/,
			engineList: "Sukebei",
		}, {
			name: "sukebei.nyaa.si",
			url: /^https?:\/\/sukebei\.nyaa\.(si|uk)\/\?/,
			engineList: "Sukebei",
		},{
			name: "Nayapantsu(sukebei)",
			url: /^https?:\/\/sukebei\.(pantsu\.cat|nyaa\.pt)\/search\?/,
			engineList: "Sukebei",
		}, {
			name: "anix",
			url: /^https?:\/\/www\.anix\.moe\/search\.php\?/,
			engineList: "Sukebei",
			keyword: "#topsearch",
		}, {
			name: "AniDex",
			url: /^https?:\/\/anidex\.info\/\?q/,
			engineList: "Sukebei",
		},
		//字幕
		{
			name: "subom",
			url: /^https?:\/\/www\.subom\.net\/search/,
			engineList: "download",
		}, {
			name: "subhd",
			url: /^https?:\/\/subhd\.tv\/search/,
			engineList: "download",
			keyword: "#sn",
		}, {
			name: "射手网(伪)",
			url: /^https?:\/\/assrt\.net\/sub\/\?s/,
			engineList: "download",
		}, {
			name: "Subscene",
			url: /^https?:\/\/subscene\.com\/subtitles\/searchbytitle/,
			engineList: "download",
		}, {
			name: "R3SUB",
			url: /^https?:\/\/r3sub\.com\/search\.php/,
			engineList: "download",
		},
		// 购物
		{
			name: "一淘",
			url: /^https?:\/\/www?\.etao\.com\/search/,
			engineList: "shopping",
			
		}, {
			name: "京东",
			url: /^https?:\/\/search\.jd\.com\/(S|s)earch\?/i,
			engineList: "shopping",
			
		}, {
			name: "淘宝搜索",
			url: /^https?:\/\/(s|haosou\.ai)\.taobao\.com\/search/,
			engineList: "shopping",
		}, {
			name: "易迅",
			url: /^https?:\/\/searchex\.yixun\.com\/html\?/,
			engineList: "shopping",
		}, {
			name: "苏宁",
			url: /^https?:\/\/search\.suning\.com\//,
			engineList: "shopping",
		}, {
			name: "天猫",
			url: /^https?:\/\/list\.tmall\.com\/\/?search/,
			engineList: "shopping",
		}, {
			name: "亚马逊",
			url: /^https?:\/\/www\.amazon\.cn\/s\/ref/,
			engineList: "shopping",
		}, {
			name: "当当",
			url: /^https?:\/\/search\.dangdang\.com\/\?key/,
			engineList: "shopping"
		}, {
			name: "newegg",
			url: /^https?:\/\/www\.newegg\.com\.tw\/search\?/,
			engineList: "shopping",
			keyword: "#searchword",
		},
	];

	function loadPrefs() {
		prefs.display = GM_getValue("display", prefs.display);
		prefs.openInNewTab = GM_getValue("openInNewTab", prefs.openInNewTab);
		prefs.debug = GM_getValue("debug", prefs.debug);
		prefs.engineListDataType = GM_getValue("engineListDataType", prefs.engineListDataType);
		engineListData.custom = GM_getValue("engineList") || "";
		reloadDebug();
	}

	function openPrefs() {
			var d = document;
			var on = function(node, e, f) {
				node.addEventListener(e, f, false);
			};

			var $ = function(s) {
				return d.getElementById("sej-prefs-" + s);
			};
			if ($("setup")) return;

			var styleNode = GM_addStyle("\
		#sej-prefs-setup { position:fixed;z-index:2147483647;top:38px;right:60px;padding:20px 30px 10px;background:#eee;width:500px;border:1px solid black; }\
		#sej-prefs-setup * { color:black;text-align:left;line-height:normal;font-size:12px; }\
		#sej-prefs-setup i { 'Microsoft YaHei UI','微软雅黑',Arial; }\
		#sej-prefs-setup a { color:black;text-decoration:underline; }\
		#sej-prefs-setup div { text-align:center;font-size:14px; }\
		#sej-prefs-title { font-weight:bold; }\
		#sej-prefs-setup ul { margin:15px 0 0 0;padding:0;list-style:none;background:#eee;border:0; }\
		#sej-prefs-setup input, #sej-prefs-setup select { border:1px solid gray;padding:2px;background:white; height: auto; }\
		#sej-prefs-setup li { margin:0;padding:6px 0;vertical-align:middle;background:#eee;border:0 }\
		#sej-prefs-setup textarea { width:98%; height:60px; margin:3px 0; font-family: 'Microsoft YaHei UI','微软雅黑',Arial; }\
		#sej-prefs-setup button { padding: 1px 6px; font-size: 12px; margin-right: 3px; }\
		#sej-prefs-setup #top-buttons{text-align: left;}\
		#sej-prefs-setup img { display: initial; }\
		#sej-prefs-minitip { position: absolute; background: #ff9; border: 1px solid #F96; padding: 10px; left: -400px; top: 200px; right: 570px; }\
		#sej-prefs-minitip p { margin: 5px 5px; }\
		#sej-prefs-minitip span { color: green; }\
		#sej-prefs-debug { margin-left: 18px; }\
		");

			var div = d.createElement("div");
			div.id = "sej-prefs-setup";
			d.body.appendChild(div);
			div.innerHTML = "\
		<div id='top-buttons'>\
			<button id='sej-prefs-ok' title='立即生效'>√ 确定</button>\
			<button id='sej-prefs-cancel' title='取消本次设定，所有选项还原'>X 取消</button>\
		</div>\
		<div id='sej-prefs-title'>SearchEngineJumpCE 设置</div>\
		<ul>\
			<li>\
				<input type='checkbox' id='sej-prefs-openInNewTab' /> 在新页面打开\
				<input type='checkbox' id='sej-prefs-debug' /> 调试模式\
			</li>\
			<li>\
				搜索列表版本：\
				<select id='sej-prefs-engineListDataType' >\
					<option value='custom'>用户版本</option>\
					<option value='ted423'>ted423版本</option>\
				</select>\
				<a style='margin-left: 20px;' target='_blank' href='https://greasyfork.org/zh-CN/scripts/16193/feedback' title='通过反馈给作者加入你的版本'>加入你的版本？</a>\
			</li>\
			<li>自定义搜索列表:\
				<sej-i id='sej-prefs-engineList-tip'>(?)</sej-i>\
				<div>\
					<textarea id='sej-prefs-engineList' style='height: 350px;'></textarea>\
				</div>\
			</li>\
		</ul>\
		<div id='sej-prefs-minitip' style='display: none;'>" +
				introduceToHtml() + "\
		</div>\
		";
			div = null;

			var engineListType_sel = $("engineListDataType"),
				engineList_txt = $("engineList");

			var close = function() {
				if (styleNode) {
					styleNode.parentNode.removeChild(styleNode);
				}
				var div = $("setup");
				div.parentNode.removeChild(div);
			};

			on($("ok"), "click", function() {
				GM_setValue("openInNewTab", prefs.openInNewTab = !!$("openInNewTab").checked);
				GM_setValue("debug", prefs.debug = !!$("debug").checked);
				GM_setValue("engineListDataType", prefs.engineListDataType = engineListType_sel.value);

				if (engineListType_sel.value == "custom") {
					GM_setValue("engineList", engineListData.custom = engineList_txt.value);
				}

				// 刷新工具条
				remove();
				reloadDebug();
				debug("run");
				run();
				close();
			});

			on($("cancel"), "click", close);

			$("engineList-tip").onclick = function() {
				var minitip = $("minitip");
				minitip.style.display = (minitip.style.display == "block") ? "none" : "block";
			};

			engineListType_sel.onchange = function() {
				engineList_txt.value = engineListData[engineListType_sel.value].trim();
			};

			$("openInNewTab").checked = prefs.openInNewTab;
			$("debug").checked = prefs.debug;
			engineListType_sel.value = prefs.engineListDataType;

			engineList_txt.value = engineListData[prefs.engineListDataType].trim();
		}
		// --------------------可设置项结束------------------------
	var debug;

	function reloadDebug() {
		debug = prefs.debug ? console.log.bind(console) : function() {};//console.debug在chrome里失去作用
	}


	function getPostFormHTML(name, url, args, newTab) { //获取 method 为 POST 的表单的 HTML
		var form = "<form method='post'" +
			" action='" + url + "' id ='sej_" + name + "'" +
			(newTab ? " target='_blank'" : "") +
			">";
		for (var arg in args) {
			var input = "<input type='hidden'" +
				" name='" + arg + "'" +
				" value='" + args[arg] + "'" +
				" />";
			form += input;
		}
		form += "</form>";
		return form;
	}

	function wrapToHide(html) { //包装 HTML 元素代码以隐藏该元素
		return "<span style='display:none;'>" + html + "</span>";
	}

	function toRE(obj) {
		if (obj instanceof RegExp) {
			return obj;
		} else if (obj instanceof Array) {
			return new RegExp(obj[0], obj[1]);
		} else {
			return new RegExp(obj);
		}
	}

	function getMStr(func) {
		var lines = func.toString();
		lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
		return lines;
	}

	function toEscapeCharacter(str) { //dA使用ISO-8859-1编码，网页只能使用转义字符(UTF16)来显示其他字符 这里是对转义字符(UTF16)进行编码
		var length = str.length;
		var ret = [];
		var character;
		var charCode;
		var gCode;
		var neReg = /[\dA-z]/;
		for (var i = 0; i < length; i++) {
			charCode = str.charCodeAt(i);
			if (charCode <= 128) {
				character = str.charAt(i);
				if (neReg.test(character)) { /*ascii的数字字母不编码*/
					ret.push(character);
				} else ret.push("%" + charCode.toString(16));
			} else {
				gCode = charCode.toString();
				if (gCode) {
					while (gCode.length < 4) {
						gCode = "0" + gCode;
					}
					ret.push("%26%23" + gCode + "%3B");
				} else {
					/*字库里面没有.*/
				}
			}
		}
		return ret.join("");
	}

	function getFaviconUrl(url, type) {
		var uri = parseUri(url);
		switch (type) {
			case 0:
				return "http://g.soz.im/" + uri.host;
			default:
				return uri.protocol + "://" + uri.host + "/favicon.ico";
		}
	}

	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License
	var parseUri = function(str) {
		var o = parseUri.options,
			m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.ds.name] = {};
		uri[o.ds.name][0] = {};
		uri[o.ds.name][0]["key"] = (uri.protocol ? uri.protocol : "http") + "://" + uri.host + (uri.port ? ":" + uri.port : "") + "/";
		uri[o.ds.name][0]["val"] = "/";
		i = 0;
		var tempsub = "/",
			subs = uri[o.key[10]].substr(1).split("/");
		for (var j = 1; j < (subs.length + 1); j++, i++) {
			tempsub += tempsub === "/" ? subs[i] : "/" + subs[i];
			if (subs[i]) {
				uri[o.ds.name][j] = {};
				uri[o.ds.name][j]["key"] = subs[i];
				uri[o.ds.name][j]["val"] = tempsub;
			}
		}

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});
		uri[o.aq.name] = {};
		uri[o.key[13]].replace(o.aq.parser, function($0, $1, $2) {
			if ($1) uri[o.aq.name][$1] = $2;
		});

		return uri;
	};
	parseUri.options = {
		strictMode: false,
		key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
		q: {
			name: "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		aq: {
			name: "anchorqueryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		ds: {
			name: "directorySub"
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};

	function addGlobalStyle() {
		// 添加全局样式和自定义样式
		var style;
		if (!document.getElementById("sej-style")) {
			style = document.createElement("style");
			style.id = "sej-style";
			style.type = "text/css";
			style.textContent = MAIN_CSS + "\n" + (matchedRule.stylish || "");
			document.head.appendChild(style);
			if (prefs.display === false){
				style = document.createElement("style");
				style.id = "sej-display-style";
				style.type = "text/css";
				style.textContent = "#sej-container{pointer-events:none;opacity: 0.1;}";
				document.head.appendChild(style);
			}
		}

	}

	function addContainer(iTarget, iInput) {
		function parseDataStr(str) { //转换文本数据
			var List = str.split(/\n(?=[^\s])/);
			List.forEach(function(eachList) {
				var line = eachList.split(/[\n\r]+/);
				var category = line[0];
				category = category.split("--");
				if (isTheSameCategory(category[0], matchedRule.engineList)) {
					container.innerHTML += "<sejli><sejspan id='sej-expanded-category'>" + svg.list + category[0] + "</sejspan></sejli>";
					parseLine(container, line, true);
				} else {
					var contSejli = document.createElement("sejli");
					contSejli.innerHTML = "<sejspan class='sej-engine sej-drop-list-trigger'>"+ svg.list + category[0] + "</sejspan>";
					var sejul = document.createElement("sejul");
					sejul.className = "sej-drop-list";
					parseLine(sejul, line, false);
					contSejli.appendChild(sejul);
					container.appendChild(contSejli);
				}
			});


			//str = str.replace(/[\n\r]+[\s\/]*-\s*(\S+):/g, "_POST_ $1:"); //提前处理下特殊的 post 方式

			function parseArgs(str) {
				var arr = str.split("#");
				var args = {};
				arr.forEach(function(s) {
					var argArr = s.split("=");
					args[argArr[0]] = argArr[1];
				});
				return args;
			};

			function parseLine(container, line, isCurrent) {
				line.splice(0, 1);
				var sejul, defaultEngine, contSejli;
				var flag, flag2;
				for (var i = 0; i < line.length; i++) {
					if (!line[i]) continue;

					if (line[i].indexOf("//") == 0) {
						continue;
					}
					var arr = line[i].replace(/，/g, ", ").split(/,\s/);
					if (isCurrent && matchedRule.engineList && toRE(matchedRule.url).test(arr[1])) { //去掉跳转到当前引擎
						if (flag == i - 1) flag++;
						if (flag2 == i - 1) {
							if (i == line.length - 1) {
								contSejli.appendChild(sejul);
								container.appendChild(contSejli);
							}
							flag2++;
						}
						continue;
					}
					var engine = {};
					if (line[i].indexOf("%post") != -1) {
						engine.method = "POST";
						var two = line[i].split("%post#");
						line[i] = two[0];
						engine.args = parseArgs(two[1]);
					}
					if (arr.length === 1) { //分类
						flag = i;
						if (flag2 == i - 1 && sejul != "") {
							contSejli.appendChild(sejul);
							container.appendChild(contSejli);
						}
						defaultEngine = arr[0].trim();
						sejul = document.createElement("sejul");
						sejul.className = "sej-drop-list";
						continue;
					}
					if (/\s\s/.test(arr[0])) { //引擎分类只支持2级，所以两个tab就是二级分类的引擎
						var sejli = document.createElement("sejli");
						sejli.innerHTML = getaPattern(arr,engine);
						sejul.appendChild(sejli);
						if (i == flag + 1) { //由于二级分类大多是引擎细分，所以引擎名字上也需要能点击才行
							arr[0] = defaultEngine;
							contSejli = document.createElement("sejli");
							contSejli.innerHTML = getaPattern(arr,engine).replace("sej-engine", "sej-engine sej-drop-list-trigger");
						}
						flag2 = i; //flag2代表二级分类的引擎标记，结束后需要写入列表
						if (i == line.length - 1) { //如果已二级分类的引擎结尾，写入列表
							contSejli.appendChild(sejul);
							container.appendChild(contSejli);
						}
						continue;
					}
					if (/\s[^\s]/.test(arr[0])) {
						if (flag2 == i - 1 && sejul != "") { //看是否二级分类引擎结束
							contSejli.appendChild(sejul);
							container.appendChild(contSejli);
						}
						sejul = "";
						sejli = document.createElement("sejli");
						sejli.innerHTML = getaPattern(arr,engine);
						container.appendChild(sejli);
					}
				}
			}

		}

		function getaPattern(arr,engine) {
				engine.name = arr[0].trim();
				engine.url = arr[1];
				if(engine.method == "POST") engine.url = engine.url.split("%post")[0];
				engine.host = parseUri(engine.url).host;
				if (arr[2]) engine.favicon = arr[2];
				var a = aPattern.replace("$url$", engine.url)
					.replace("$name$", engine.name)
					.replace("$title$", engine.name);
				if (engine.favicon) {
					if (/^fa/.test(engine.favicon)) a = a.replace("<img src='$favicon$' class='sej-engine-icon' />", "<sej-i class='fa " + engine.favicon + "'></sej-i>");
					a = a.replace("$favicon$", engine.favicon);
				} else {
					a = a.replace("src='$favicon$'", "");
				}

				if (engine.method && engine.method.toUpperCase() == "POST") {
					var f = wrapToHide(getPostFormHTML(engine.name, engine.url, engine.args, prefs.openInNewTab));
					a = a.replace("$form$", f);
					a = a.replace("a href=''","button type='submit' value='Submit'" + "form='sej_"+ engine.name + "'" );
				} else {
					a = a.replace("$form$", "");
				}
				return a;
			}
			// 创建dom
		var aPattern = "<a href='' class='sej-engine'" + (prefs.openInNewTab ? " target='_blank' " : " ") +
			"url='$url$' _title='$title$'>" +
			"<img src='$favicon$' class='sej-engine-icon' />$form$<span>$name$</span></a>";

		var container = document.createElement("sejul");
		container.id = "sej-container";

		container.addEventListener("mousedown", mousedownhandler, true);
		if (matchedRule.style) {
			container.style.cssText = matchedRule.style;
		}
		// 根据搜索列表的类型得到数据
		var engineListDataStr = engineListData[prefs.engineListDataType] || engineListData.normal;
		parseDataStr(engineListDataStr);
		var insertWhere = matchedRule.insertIntoDoc ? matchedRule.insertIntoDoc.where : "beforeBegin"; //设置插入的位置
		
		var sejButton = document.getElementById("sej-button");

		if (!sejButton) {} else if (sejButton) {
			sejButton.parentNode.removeChild(sejButton);
		}

		var button = document.createElement("sejdiv");
		button.id = "sej-button";
		button.onmouseover = function() {
				if ($("#sej-container").css("pointer-events") === "none") {
					$("#sej-container").css("pointer-events", "all").css("opacity", "1");
					GM_setValue("display", true);
				} else {
					$("#sej-container").css("pointer-events", "none").css("opacity", "0.1");
					GM_setValue("display", false);
				}
			}
		document.head.parentNode.insertBefore(button,document.head);
		//设置按钮
		var configBtn = document.createElement("sej-li");
		configBtn.innerHTML = "<sejspan class='sej-engine'>" + svg.setting + "</sejspan>";
		configBtn.onclick = openPrefs;
		container.appendChild(configBtn);

		switch (insertWhere.toLowerCase()) { //插入到文档中
			case "beforebegin":
				iTarget.parentNode.insertBefore(container, iTarget);
				break;
			case "afterbegin":
				if (iTarget.firstChild) {
					iTarget.insertBefore(container, iTarget.firstChild);
				} else {
					iTarget.appendChild(container);
				}
				break;
			case "beforeend":
				iTarget.appendChild(container);
				break;
			case "afterend":
				if (iTarget.nextSibling) {
					iTarget.parentNode.insertBefore(container, iTarget.nextSibling);
				} else {
					iTarget.parentNode.appendChild(container);
				}
				break;
		}

		if (typeof matchedRule.endFix == "function") {
			try {
				matchedRule.endFix();
			} catch (ex) {
				console.error("endFix 错误", ex);
			}
		}

		function mousedownhandler(e) {
			var target = e.target;
			if (!target.href) target = target.parentNode;
			if (!target || target.className.indexOf("sej-engine") == -1) return;
			if (!target || !this.contains(target)) return;
			var value;
			if (typeof iInput == "function") value = iInput();
			else {
				if (iInput.nodeName == "INPUT" || iInput.localName == "textarea") value = iInput.value;
				else value = iInput.textContent;
			}
			if (document.characterSet != "UTF-8") value = encodeURIComponent(value);
			// 根据后代元素中是否存在 form 元素，判断提交方式并进行处理
			// 如果没有 form 元素，将会使用 GET 方法提交；如果有，将会使用 POST 方法提交
			var forms = target.getElementsByTagName("form");
			if (forms.length == 0) { //提交方式为 GET
			value = value.replace("&","%26");//&直接提交到地址栏中无法搜索，可能还有其他特殊符号也需要类似处理。只在get
			value = value.replace("#","%23");
				target.href = target.getAttribute("url").replace(/%s/g, value); //替换"全部"关键词
			} else { //提交方式为 POST
				var inputs = target.getElementsByTagName("input");
				for (var i = 0; i < inputs.length; i++) inputs[i].value = inputs[i].value.replace(/%s/g, value); //// 替换"全部"关键词
			}
		}
	}

	function run() {
		// 百度搜索插入到顶部搜索条下面就会造成页面部分元素的消失，所以需要每个部分都判断下是否存在
		// 判断插入位置和输入框是否存在
		var iTarget = matchedRule.insertIntoDoc ? document.querySelector(matchedRule.insertIntoDoc.target) : document.querySelector("head");
		var iInput;
		if (matchedRule.keyword) {
			if (typeof matchedRule.keyword == "function") {
				iInput = matchedRule.keyword;
				if (!iInput()) {
					return;
				}
			} else {
				iInput = document.querySelector(matchedRule.keyword);
			}
		} else {
			iInput = document.querySelector("input[type='search'],input[type='text'][autocomplete='off'],input[autocomplete='off']:not([type])") || document.querySelector("input[type='text'][name][value],input[name][value]:not([type])");
		}
		debug("插入的位置为 %o", iTarget);
		debug("匹配的输入框为 %o", iInput);

		if (!iTarget || !iInput) {
			debug("不存在插入的位置或匹配的输入框", iTarget, iInput);
			return;
		}

		addGlobalStyle();

		// 判断是否存在
		var container = document.getElementById("sej-container");

		if (!container) {} else if (container) {
			container.parentNode.removeChild(container);
		}
		addContainer(iTarget, iInput);
		container = document.getElementById("sej-container");
		if(container)container.style.left = "calc(50% - " + getComputedStyle(container).width + " / 2)";
	}

	function remove() {
		var elems = document.querySelectorAll("#sej-container");
		if (!elems) return;

		[].forEach.call(elems, function(elem) {
			elem.parentNode.removeChild(elem);
		});
		
		elems = document.querySelectorAll("#sej-button");
		[].forEach.call(elems, function(elem) {
			elem.parentNode.removeChild(elem);
		});
	}

	// iframe 禁止加载
	if (window.self != window.top) return;
	
	loadPrefs();
	
	var matchedRule;

	rules.some(function(rule) {
		if (toRE(rule.url).test(location.href)) {
			matchedRule = rule;
			if (typeof rule.etc == "function") {
				try {
					rule.etc();
				} catch (ex) {
					console.error("执行 etc 错误", ex);
				}
			}
			return true;
		}
	});

	var flag = 0;
	debug("匹配的规则为", matchedRule);
	debug("脚本执行于:"+document.readyState);
	debug("onreadystatechange function:"+document.onreadystatechange);
	if (!matchedRule) return;
	GM_registerMenuCommand("设置",openPrefs);
	document.onreadystatechange = function() {
		flag = 1;
		if (document.readyState == "interactive") {
			debug("onreadystatechange: " + document.readyState);
			run();
		} else if (document.readyState == "complete") {
			debug("onreadystatechange: " + document.readyState);
			run();
			/*if (window.navigator.userAgent.indexOf("Chrome") != -1) {
				setTimeout(run(), 1000);
			}*/
		}
	};
	window.onload = function() {//用于DuckDuckGo,影响到了onreadystatechange
		debug("onload");
		if (flag == 0)run();
		flag = 1;
	};
	if (matchedRule.mutationTitle) {
		debug("添加标题节点监视器: title");
		var watch = document.querySelector("title");
		var observer = new window.MutationObserver(function(mutations) {
			debug("标题发生了变化", document.title);
			run();
		});
		observer.observe(watch, {
			childList: true,
			subtree: true,
			characterData: true
		});
	}
})();
