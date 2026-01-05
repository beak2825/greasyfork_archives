// ==UserScript==
// @name		searchEngineJumpCE-modify by ted423
// @author		NLF && ywzhaiqi
// @contributor	ted423
// @description	方便的在各个引擎之间跳转。可自定义搜索列表的 NLF 修改版。
// @include			*
// @version		8.1601.08.0
// @namespace	https://greasyfork.org/users/85
// @grant		none
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/213/searchEngineJumpCE-modify%20by%20ted423.user.js
// @updateURL https://update.greasyfork.org/scripts/213/searchEngineJumpCE-modify%20by%20ted423.meta.js
// ==/UserScript==
(function(){
	'use strict';
	var prefs = {
		openInNewTab: false,  // 是否在新页面打开.
		hidePrefsBtn: false, // 隐藏设置按钮
		hideEnglineLabel: 0,  // 是否隐藏前几个搜索的文字部分。0：不隐藏，1：根据高度自行判断，2：隐藏
		engineListDataType: 'ted423', // 搜索列表默认类型
		iconType: '', // 获取 icon 的在线服务的地址类型
		//position: '', // 全局搜索条插入的位置：default, left, top
		debug: false,
	};

	var engineListData = {
		custom: '',
		ted423: '网页\n	百度, https://www.baidu.com/s?wd=%s&ie=utf-8\n	360, https://www.haosou.com/s?ie=utf-8&q=%s\n	bing, https://cn.bing.com/search?q=%s&pc=OPER\n	搜狗, https://www.sogou.com/web?query=%s\n	DuckDuckGo, https://duckduckgo.com/?q=%s\n	Yahoo--网页\n		Yahoo, https://search.yahoo.com/search?p=%s\n		Yahoo(tw), https://tw.search.yahoo.com/search?p=%s\n 		Yahoo.co.jp, https://search.yahoo.co.jp/search?p=%s&aq=-1&oq=&ei=UTF-8&fr=top_ga1_sa&x=wrt\n	Google--百度\n		Google.hk, https://www.google.com.hk/search?q=%s&ie=utf-8&safe=off, https://i.imgur.com/xK23DKf.png\n		Google.co.jp，https://www.google.co.jp/search?q=%s&ie=utf-8&safe=off, https://i.imgur.com/xK23DKf.png\n资料-Scholar\n	百科, http://baike.baidu.com/searchword/?word=%s&pic=1&sug=1&ie=utf-8, https://www.baidu.com/favicon.ico\n	Scholar, http://scholar.google.com/scholar?hl=zh-CN&q=%s&btnG=&lr=, https://i.imgur.com/hJVSUU5.png\n	学术, http://xueshu.baidu.com/s?wd=%s, https://www.baidu.com/favicon.ico\n	知乎, https://www.zhihu.com/search?q=%s\n	萌娘百科, http://zh.moegirl.org/index.php?search=%s, https://zh.moegirl.org/favicon.ico\n	Google Book, https://www.google.com/search?q=%s&btnG=%E6%90%9C%E7%B4%A2%E5%9B%BE%E4%B9%A6&tbm=bks&tbo=1&hl=zh-CN&gws_rd=ssl, https://i.imgur.com/xK23DKf.png\n	WIKI--百科\n		ZWIKI, http://zh.wikipedia.org/w/index.php?search=%s&button=&title=Special%3ASearch, https://zh.wikipedia.org/static/favicon/wikipedia.ico\n		EWIKI, https://en.wikipedia.org/w/index.php?search=%s&button=&title=Special%3ASearch, https://zh.wikipedia.org/static/favicon/wikipedia.ico\n		JWIKI, http://ja.wikipedia.org/w/index.php?search=%s&button=&title=Special%3ASearch, https://zh.wikipedia.org/static/favicon/wikipedia.ico\n	开发--百科\n		stackoverflow, https://stackoverflow.com/search?q=%s, https://cdn.sstatic.net/stackoverflow/img/favicon.ico\n		MDN, https://developer.mozilla.org/en-US/search?q=%s，https://developer.cdn.mozilla.net/media/img/favicon32.png\n		github, https://github.com/search?q=%s\n		krugle, http://opensearch.krugle.org/document/search/#query=%s，http://opensearch.krugle.org/media/images/favicon.ico\n		npm, https://www.npmjs.org/search?q=%s, https://i.imgur.com/Ec0WrY8.png\n地图\n	百度, http://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D%s, https://www.baidu.com/favicon.ico\n	Google, https://www.google.com/maps/search/%s/, https://i.imgur.com/xK23DKf.png\n	搜狗, http://map.sogou.com/#lq=%s, https://www.sogou.com/favicon.ico\n	Bing, https://www.bing.com/ditu/?q=%s\n音乐\n	天天动听, http://www.dongting.com/#a=searchlist&q=%s\n	Music, http://music.baidu.com/search?key=%s&ie=utf-8&oe=utf-8, https://www.baidu.com/favicon.ico\n	搜狗, http://mp3.sogou.com/music.so?query=%s, https://www.sogou.com/favicon.ico\n	一听, http://so.1ting.com/all.do?q=%s\n	虾米, http://www.xiami.com/search?key=%s\n	piapro, https://piapro.jp/search/?view=audio&keyword=%s\n	Lyric, http://music.baidu.com/search/lrc?key=%s, https://www.baidu.com/favicon.ico\n图片-Flickr\n	百度, http://image.baidu.com/search/index?tn=baiduimage&word=%s, https://www.baidu.com/favicon.ico\n	Google, https://www.google.com.hk/search?tbm=isch&q=%s, https://i.imgur.com/xK23DKf.png\n	花瓣, https://huaban.com/search/?q=%s\n	Picsearch, http://cn.picsearch.com/index.cgi?q=%s\n	Flickr, https://www.flickr.com/search/?w=all&q=%s\n	Pixiv, http://www.pixiv.net/search.php?s_mode=s_tag&word=%s\n	dA, https://www.deviantart.com/browse/all/?q=%s, UTF16\n	, http://img.jpg4.info/index.php?feed=%s, https://i.imgur.com/qkOEi8O.png\n下载-nyaa\n	dmhy, https://share.dmhy.org/topics/list?keyword=%s\n	kickass, https://kat.cr/usearch/%s/, https://i.imgur.com/uz2GaPN.png\n	BTSOW, http://www.bt2mag.com/search/%s, http://www.bt2mag.com/app/bts/View/img/btsow.com.favicon.ico\n	BTDigg, https://btdigg.org/search?q=%s\n	xiaohx, http://www.xiaohx.net/search?key=%s, http://s.cdn.acgimg.com/xiaohx.com/images/favicon.ico\n	ed2000, https://www.baidu.com/s?wd=%s+site:ed2000.com&ie=utf-8, http://www.biaoqing.com/2000/favicon.ico\n	字幕--下载\n		subom, http://www.subom.net/search/%s\n		, http://subhd.com/search/%s, https://i.imgur.com/kC8RATC.png\n		射手网(伪), http://sub.makedie.me/sub/?searchword=%s\n	nyaa--dmhy\n		nyaa.eu, https://www.nyaa.eu/?page=search&term=%s, https://i292.photobucket.com/albums/mm30/ted423/favicon_zpsdxwbxo6t.png\n		nyaa.se, http://www.nyaa.se/?page=search&term=%s, https://i292.photobucket.com/albums/mm30/ted423/favicon_zpsdxwbxo6t.png\n		sukebei.nyaa.eu, https://sukebei.nyaa.eu/?page=search&cats=0_0&filter=0&term=%s, https://i292.photobucket.com/albums/mm30/ted423/favicon_zpsdxwbxo6t.png\n		sukebei.nyaa.se, http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=%s, https://i292.photobucket.com/albums/mm30/ted423/favicon_zpsdxwbxo6t.png\n网购\n	一淘, http://s.etao.com/search?q=%s\n	京东, https://search.jd.com/Search?keyword=%s&enc=utf-8\n	淘宝, https://s.taobao.com/search?q=%s\n	亚马逊, https://www.amazon.cn/s/ref=nb_ss?keywords=%s\netc\n	AMO, https://addons.mozilla.org/zh-CN/firefox/search/?q=%s, https://addons.cdn.mozilla.net/favicon.ico\n	汉典, http://www.zdic.net/sousuo/?q=%s&tp=tp3',
	};

	var MAIN_CSS = '#sej-container {\n box-shadow:0px 0px 3px #aaaaaa;\n margin:0 auto;\n opacity: 0.7;\n display:table;\n font-family: Comic Sans MS,"Microsoft YaHei",微软雅黑;\n position: relative;\n padding: 1px 0 1px 10px;\n line-height: 1.5;\n font-size: 13px;\n}\n\n\n#sej-expanded-category {\n font-weight: bold;\n}\n#sej-expanded-category::after {\n content:"：";\n}\n\n\n.sej-engine {\n line-height: 2;\n display: inline-block;\n margin: 0;\n border: none;\n padding: 0 4px;\n text-decoration: none;\n color: #120886 !important;\n transition: background-color 0.15s ease-in-out;\n}\na.sej-engine.only-icon {\n margin-left: 3px;\n margin-right: 3px;\n}\na.sej-engine.only-icon > span {\n display: none;\n}\na.sej-engine:link, a.sej-engine:visited{\n text-decoration: none;\n}\na.sej-engine:visited, a.sej-engine:visited *, a.sej-engine:active, a.sej-engine:active *{\n color: #120886 !important;\n}\n.sej-drop-list-trigger {\n\n}\n.sej-drop-list-trigger-shown {\n background-color: #DEEDFF !important;\n}\n.sej-drop-list-trigger::after {\n content: \'\';\n display: inline-block;\n margin: 0 0 0 3px;\n padding: 0;\n width: 0;\n height: 0;\n border-top: 6px solid #BCBCBC;\n border-right: 5px solid transparent;\n border-left: 5px solid transparent;\n border-bottom: 0px solid transparent;\n vertical-align: middle;\n transition: -webkit-transform 0.3s ease-in-out;\n transition: transform 0.3s ease-in-out;\n}\n.sej-drop-list-trigger-shown::after {\n -webkit-transform: rotate(180deg);\n transform: rotate(180deg);\n}\n.sej-engine:hover {\n background-color: #EAEAEA;\n}\n.sej-drop-list > .sej-engine {\n display: block;\n padding-top: 4px;\n padding-bottom: 4px;\n}\n.sej-drop-list > .sej-engine:hover {\n background-color: #DEEDFF;\n}\n\n.sej-engine-icon {\n display: inline-block;\n height: 16px;\n border: none;\n padding: 0;\n margin: 0 3px 0 0;\n vertical-align: text-bottom;\n}\n\n\n.sej-drop-list {\n position: absolute;\n display: none;\n opacity: 0.3;\n top: -10000px;\n left: 0;\n min-width: 120px;\n border: 1px solid #FAFAFA;\n padding: 5px 0;\n text-align: center;\n font-size: 13px;\n -moz-box-shadow: 2px 2px 5px #ccc;\n -webkit-box-shadow: 2px 2px 5px #ccc;\n box-shadow: 2px 2px 5px #ccc;\n background-color: white;\n transition: opacity 0.2s ease-in-out,\n top 0.2s ease-in-out;\n}';


	var categoryMap = {// rules 和 engineList 的对应
		'web': '网页',
		'map': '地图',
		'video': '视频',
		'music': '音乐',
		'image': '图片',
		'knowledge': '资料',
		'sociality': '社交',
		'shopping': '网购',
		'download': '下载',
	};

	function isTheSameCategory(c1, c2) {
		return (categoryMap[c1] || c1) == (categoryMap[c2] || c2);
	}


	var rules = [// 根据规则把搜索引擎列表插入到指定网站
		// 网页
		// /////////////第一个可以当模板看
		{
			name: "google网页搜索",// 你要加载的网站的名字(方便自己查找)
			enabled: true,// 是否启用
			url: /^https?:\/\/(encrypted\.google\.com|www\.google\.(?!co\.jp)[^\/]{2,9})\/(webhp|search|#|$|\?)(?!.*tbm=)/,// 在哪个网站上加载,正则.
			change: 'mutationTitle',	// mutationTitle监视标题的变化,runAtComplete在页面结束时执行
			engineList: 'web',// 加载哪个类型的列表:
			style: '\
			border-bottom: 1px solid #E5E5E5;\
			border-top: 1px solid #E5E5E5;\
			width:100%;\
			padding-left: 15px;\
			',// 给引擎列表的样式
			// 插入文档,相关
			// target 将引擎跳转工具栏插入到文档的某个元素
			// (请使用css匹配(请加上 'css;' 的前缀),比如: 'css;#subform_ctrl' );
			// keyword 使用 css选中一个form input元素 或者 该项是一个函数，使用返回值
			// where 四种:
			// 'beforeBegin'(插入到给定元素的前面) ;
			// 'afterBegin'(作为给定元素的第一个子元素) ;
			// 'beforeEnd' (作为给定元素的最后一个子元素) ;
			// 'afterEnd'(插入到给定元素的后面);.
			insertIntoDoc: {
				target: 'css;#top_nav',
				where: 'beforeBegin',
			},
			stylish: '',// 自定义样式
		},
		{
			name: "google.co.jp",
			enabled: true,
			url: /^https?:\/\/www\.google\.co\.jp\/(webhp|search|#|$|\?)(?:.(?!&tbm=))*$/,
			change: 'mutationTitle',
			engineList: 'web',
			style: '\
			border-bottom: 1px solid #E5E5E5;\
			border-top: 1px solid #E5E5E5;\
			width:100%;\
			padding-left: 15px;\
			',


			insertIntoDoc: {
				target: 'css;#top_nav',
				where: 'beforeBegin',
			},
		},
		{
			name: "baidu 网页搜索",
			url: /^https?:\/\/www\.baidu\.com\/(?:s(?!.*tn=baidulocal).*|baidu(?!.*tn=baidulocal).*|)&/,
			change: 'mutationTitle',
			enabled: true,
			engineList: 'web',
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			margin-left: 122px;\
			',
			insertIntoDoc: {
				target: 'css;#container',
				where: 'beforeBegin',
			},
		},
		{
			name: "baidu 简洁搜索",//百度简洁搜索：https://www.baidu.com/s?wd=firefox&ie=utf-8&tn=baidulocal
			url: /^https?:\/\/www\.baidu\.com\/s\?.*tn=baidulocal/,
			enabled: true,
			engineList: 'web',
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			margin-left: 122px;\
			',
			insertIntoDoc: {
				target: 'css;table[bgcolor="#e6e6e6"]',
				where: 'beforeBegin',
			},
		},
		{
			name: "必应网页搜索",
			url: /^https?:\/\/[^.]*\.bing\.com\/search/,
			enabled: true,
			engineList: 'web',
			style: '\
			border-collapse:separate;\
			border-top: 1px solid #E6E6E6;\
			border-bottom: 1px solid #E6E6E6;\
			margin-left: 10px;\
			',
			insertIntoDoc: {
				target: 'css;#b_header',
				where: 'beforeEnd',
			},
			stylish: '#b_content{ padding: 10px 0px 20px 100px !important; } .b_underSearchbox{margin:5px 20px 0px;}'
		},
		{
			name: "360搜索",
			url: /^https?:\/\/www\.haosou\.com\/s\?/,
			engineList: 'web',
			enabled: true,
			style: '\
			border-bottom: 1px solid #E0E0E0;\
			border-top: 1px solid #E0E0E0;\
			margin-left: 20px;\
			',
			insertIntoDoc: {
				target: 'css;#head',
				where: 'afterEnd',
			},
			stylish: '#header .inner{height: 116px !important;}'
		},
		{
			name: "搜狗网页搜索",
			url: /^https?:\/\/www\.sogou\.com\/(?:web|s)/,
			enabled: true,
			engineList: 'web',
			style: "\
			margin-bottom: 10px;\
			margin-left: 35px;\
			",
			insertIntoDoc: {
				target: 'css;#wrapper',
				where: 'beforeBegin',
			},
			stylish: '.header{ margin-bottom: 5px; }'
		},
		{
			name: "雅虎网页搜索",
			url: /^https?:\/\/search\.yahoo\.com\/search/,
			engineList: '网页',
			enabled: true,
			style: "\
			margin-left: 15px;\
			border-top:1px solid #D4E9F7;\
			border-bottom:1px solid #D4E9F7;\
			",
			insertIntoDoc: {
				target: 'css;#hd',
				where: 'afterEnd'
			},
			stylish: '#doc #sticky-hd ~ #bd {margin-top: 110px;}'
		},
		{
			name: "tw.yahoo",
			url: /^https?:\/\/tw\.search\.yahoo\.com\/search/,
			engineList: '网页',
			enabled: true,
			style: "\
			margin-left:15px;\
			margin-top:5px;\
			border-top:1px solid #D4E9F7;\
			border-bottom:1px solid #D4E9F7;\
			",
			insertIntoDoc: {
				target: 'css;#sticky-hd',
				where: 'beforeEnd'
			},
			stylish: '#bd {margin-top: 105px!important;}'
		},
		{
			name: "yahoo.co.jp",
			url: /^https?:\/\/search\.yahoo\.co\.jp\/search/,
			engineList: '网页',
			enabled: true,
			style: "\
			margin:0px auto;\
			border:1px solid #D4E9F7;\
			",
			insertIntoDoc: {
				target: 'css;#ygma',
				where: 'afterEnd'
			},
		},
		{
			name: "duckduckgo",
			url: /^https?:\/\/duckduckgo\.com\/\?/,
			engineList: '网页',
			enabled: true,
			style: "\
			margin-left:15px;\
			border:1px solid #D4E9F7;\
			",
			insertIntoDoc: {
				target: 'css;#zero_click_wrapper',
				where: 'afterEnd'
			},
		},
		// 知识
		{
			name: "谷歌学术",
			enabled: true,
			url: /^https?:\/\/scholar\.google(?:\.\D{1,3}){1,2}\/scholar\?/,
			engineList: "资料",
			style: '\
			border-bottom:1px solid #E5E5E5;\
			border-top:1px solid #E5E5E5;\
			z-index:999;\
			position:relative;\
			',
			insertIntoDoc: {
				target: 'css;#gs_ab',
				where: 'beforeBegin'
			}
		},
		{
			name: "百度学术",
			url: /^https?:\/\/xueshu\.baidu\.com\/s\?/,
			enabled: true,
			engineList: '资料',
			style: '\
			border-bottom:1px solid #D9E1F7;\
			',
			insertIntoDoc: {
				target: 'css;#head',
				where: 'afterEnd',
			},
			stylish: '#container{padding-top: 130px !important;}'
		},
		{
			name: "百度百科",
			url: /^https?:\/\/baike\.baidu\.com\/(search|view|subview)/,
			engineList: "资料",
			enabled: true,
			style: "\
			z-index: 999999;\
			",
			insertIntoDoc: {
				target: 'css;.header-wrapper',
				where: 'afterEnd',
			},
		},
		{
			name: "萌娘百科",
			url: /^https?:\/\/zh\.moegirl\.org\/./,
			engineList: "资料",
			enabled: true,
			style: "\
			z-index: 999999;\
			",
			insertIntoDoc: {
				keyword: function () {
					if(document.getElementById('searchText'))return document.getElementById('searchText').value;
					else return document.getElementById('firstHeading').textContent;
				},
				target: 'css;#content',
				where: 'afterBegin',
			},
		},
		{
			name: "google book",
			enabled: true,
			url: /^https?:\/\/www\.google\.co.{1,3}\/search\?.*(&btnG=%E6)|(tbm=bks)/,
			change: 'mutationTitle',
			engineList: '资料',
			style: '\
			border-bottom: 1px solid #E5E5E5;\
			border-top: 1px solid #E5E5E5;\
			width:100%;\
			padding-left: 15px;\
			',
			insertIntoDoc: {
				target: 'css;#top_nav',
				where: 'beforeBegin',
			},
		},
		{
			name: "互知识",
			url: /^https?:\/\/[a-z]{2,3}\.baike\.com\/[a-z]/,
			enabled: true,
			engineList: "资料",
			style: '\
			position:fixed;\
			top:80px;\
			right:2%;\
			width:90px;\
			z-index:99;\
			',
			insertIntoDoc: {
				keyword: function() {
					var input;
					if (document.getElementsByClassName('ac_input')[0] != undefined) {
						if (document.getElementsByClassName('ac_input')[0].value != "")
							input = document.getElementsByClassName('ac_input')[0].value;
						else if (document.getElementsByClassName('blue')[0].innerHTML != "") input = document.getElementsByClassName('blue')[0].innerHTML;
						else input = document.evaluate("//h1", document, null, 9, null).singleNodeValue.innerHTML;
					} else if (document.getElementsByClassName('blue')[0].innerHTML != "") input = document.getElementsByClassName('blue')[0].innerHTML;
					else input = document.evaluate("//h1", document, null, 9, null).singleNodeValue.innerHTML;
					return input;
				},
				target: 'css;body',
				where: 'afterbegin'
			}
		},
		{
			name: "wiki",
			url: /^https?:\/\/..\.wikipedia\.org\/w\/index\.php(?!.*\?search=)/,
			enabled: true,
			engineList: "资料",
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			margin-top:5px;\
			',
			insertIntoDoc: {
				target: 'css;#siteNotice',
				where: 'beforeBegin'
			}
		},
		{
			name: "wiki[ZH]",
			url: /^https?:\/\/zh\.wikipedia\.org\/(?:zh|wiki\/|w\/index.php\?search=)/,
			enabled: true,
			engineList: "资料",
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			margin-top:5px;\
			',
			insertIntoDoc: {
				keyword: function () {
					if(document.getElementById('searchText'))
						return document.getElementById('searchText').value;
					else return document.getElementById('firstHeading').childNodes[0].textContent;
				},
				target: 'css;#siteNotice',
				where: 'beforeBegin'
			}
		},
		{
			name: "wiki[EN]",
			url: /^https?:\/\/en\.wikipedia\.org\/(wiki\/|w\/index\.php\?search=)/,
			enabled: true,
			engineList: "资料",
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			margin-top:5px;\
			',
			insertIntoDoc: {
				keyword: function () {
					if(document.getElementById('searchText'))
						return document.getElementById('searchText').value;
					else return document.getElementById('firstHeading').childNodes[0].textContent;
				},
				target: 'css;#siteNotice',
				where: 'beforeBegin'
			}
		},
		{
			name: "wiki[JP]",
			url: /^https?:\/\/ja\.wikipedia\.org\/(wiki\/|w\/index\.php\?search=)/,
			enabled: true,
			engineList: "资料",
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			margin-top:5px;\
			',
			insertIntoDoc: {
				keyword: function () {
					if(document.getElementById('searchText'))
						return document.getElementById('searchText').value;
					else return document.getElementById('firstHeading').childNodes[0].textContent;
				},
				target: 'css;#siteNotice',
				where: 'beforeBegin'
			}
		},
		{
			name: "百度知道(search)",
			url: /^https?:\/\/zhidao\.baidu\.com\/search/,
			enabled: true,
			engineList: "资料",
			style: '\
			margin-bottom: 8px;\
			',
			insertIntoDoc: {
				target: 'css;#body',
				where: 'beforeBegin'
			},
		},
		{
			name: "百度知道(question)",
			url: /^https?:\/\/zhidao\.baidu\.com\/question/,
			enabled: true,
			engineList: "资料",
			style: '\
			width: 980px;\
			margin: 0 auto;\
			white-space: nowrap;\
			',
			insertIntoDoc: {
				target: 'css;#body',
				where: 'beforeBegin'
			},
			endFix: function() {  // 插入搜索条后修正绿色背景错位的问题
				var container = document.getElementById('sej-container');
				if (container && document.body.classList.contains('has-menu')) {
					document.body.style.backgroundPosition = '0px ' + ( 95 + container.clientHeight ) + 'px';
				}
			},
		},
		{
			name: "知乎",
			url: /^https?:\/\/www\.zhihu\.com\/search\?/,
			enabled: true,
			engineList: "资料",
			style: '\
			border-bottom:1px solid #D9E1F7;\
			margin: 0 auto;\
			',
			insertIntoDoc: {
				target: 'css;.zu-top',
				where: 'afterEnd'
			},
		},
		{
			name: "百度文库",
			url: /^https?:\/\/wenku\.baidu\.com\/search\?/,
			enabled: true,
			engineList: "资料",
			style: '\
			border-top:1px solid #D9E1F7;\
			border-bottom:1px solid #D9E1F7;\
			',
			insertIntoDoc: {
				target: 'css;#hd',
				where: 'afterEnd'
			}
		},
		{
			name: "豆丁",
			url: /^https?:\/\/www\.docin\.com\/search\.do/,
			enabled: true,
			engineList: "资料",
			style: '\
			padding-top:65px;\
			border-top:1px solid #00000;\
			border-bottom:1px solid #D9E1F7;\
			',
			insertIntoDoc: {
				target: 'css;.nav',
				where: 'beforeBegin'
			}
		},
		// 地图
		{
			name: "百度地图",
			url: /^https?:\/\/map\.baidu\.com\/\?newmap/,
			enabled: true,
			engineList: "map",
			style: '\
			margin-left:20px;\
			border-top:1px solid #00000;\
			border-bottom:1px solid #D9E1F7;\
			',
			insertIntoDoc: {
				target: 'css;#searchWrapper',
				where: 'beforeEnd'
			}
		},
		{
			name: "google地图",
			url: /^https?:\/\/www\.google\.co.{1,4}\/maps/,
			enabled: true,
			engineList: "map",
			style: '\
			margin-top: 3px;\
			',
			insertIntoDoc: {
				target: 'css;#omnibox',
				where: 'beforeEnd'
			},
			stylish:'.widget-pane-section-omnibox-spacer{height:90px !important;} .sej-drop-list-trigger{display:none;}',
		},
		{
			name: "搜狗地图",
			url: /^https?:\/\/map\.sogou\.com\/#/,
			enabled: true,
			engineList: "map",
			style: '\
			padding-left:15px;\
			display:block;\
			border-top:1px solid #00000;\
			border-bottom:1px solid #D9E1F7;\
			word-break:keep-all;\
			white-space:nowrap;\
			',
			insertIntoDoc: {
				target: 'css;#search_form',
				where: 'afterEnd'
			},
			stylish: '.sej-drop-list-trigger {display:none;}'
		},
		{
			name: "Bing地图",
			url: /^https?:\/\/[^.]*\.bing\.com\/ditu\//,
			enabled: true,
			engineList: "map",
			style: '\
			display: inline-block;\
			margin-left:15px;\
			border-top:1px solid #00000;\
			border-bottom:1px solid #D9E1F7;\
			word-break:keep-all;\
			white-space:nowrap;\
			',
			insertIntoDoc: {
				target: 'css;#sw_content',
				where: 'beforeBegin'
			}
		},
		// 音乐
		{
			name: "天天动听",
			url: /^https?:\/\/www\.dongting\.com\/#/,
			enabled: true,
			engineList: "music",
			style: "\
			margin-left:23%;\
			background-color:#E2E2E2;\
			position: fixed;\
			right:0;\
			",
			insertIntoDoc: {
				keyword: 'css;.searchBox',
				target: 'css;.head',
				where: 'beforeEnd'
			}
		},
		{
			name: "百度音乐",
			url: /^https?:\/\/music\.baidu\.com\/search/,
			enabled: true,
			engineList: "music",
			insertIntoDoc: {
				target: 'css;.nav-wrapper',
				where: 'beforeBegin'
			}
		},
		{
			name: "qq音乐",
			url: /^https?:\/\/cgi\.music\.soso\.com/,
			enabled: true,
			engineList: "music",
			style: "\
			margin:2px auto;\
			",
			insertIntoDoc: {
				target: 'css;#search_result',
				where: 'beforeBegin'
			}
		},
		{
			name: "搜狗音乐",
			url: /^https?:\/\/mp3\.sogou\.com\/music\.so/,
			enabled: true,
			engineList: "music",
			insertIntoDoc: {
				target: 'css;#header_sogou',
				where: 'afterEnd'
			}
		},
		{
			name: "音悦台",
			url: /^https?:\/\/so\.yinyuetai\.com\/mv\?/,
			enabled: true,
			engineList: "music",
			insertIntoDoc: {
				target: 'css;.search_title',
				where: 'beforeBegin'
			},
		},
		{
			name: "一听音乐",
			url: /^https?:\/\/so\.1ting\.com\//,
			enabled: true,
			engineList: "music",
			style: "\
			width: 960px;\
			",
			insertIntoDoc: {
				target: 'css;.nav',
				where: 'beforeBegin'
			}
		},
		{
			name: "songtaste",
			url: /^https?:\/\/www\.songtaste\.com\/search/,
			enabled: true,
			engineList: "music",
			style: "\
			word-break:keep-all;\
			white-space:nowrap;\
			background-color:#E6E6E6;\
			",
			insertIntoDoc: {
				target: 'css;head',
				where: 'beforeBegin'
			}
		},
		{
			name: "xiami",
			url: /^https?:\/\/www\.xiami\.com\/search/,
			enabled: true,
			engineList: "music",
			style: "\
			word-break:keep-all;\
			margin-right: 205px;\
			",
			insertIntoDoc: {
				target: 'css;.more_cols_left_inner',
				where: 'beforeBegin'
			}
		},

		// 图片
		{
			name: "谷歌图片",
			url: /^https?:\/\/\w{2,10}\.google(?:\.\D{1,3}){1,2}\/search\?(.*tbs=sbi)|(.*tbm=isch)/,
			enabled: true,
			engineList: "image",
			style: '\
			margin-left:0px;\
			',
			insertIntoDoc: {
				target: 'css;#top_nav',
				where: 'beforeBegin'
			}
		},
		{
			name: "百度图片",
			url: /^https?:\/\/image\.baidu\.c(om|n)\/search/,
			enabled: true,
			engineList: "image",
			style: '\
			margin-left:40px;\
			',
			insertIntoDoc: {
				target: 'css;#search',
				where: 'afterEnd'
			}
		},
		{
			name: "360图片",
			url: /^https?:\/\/\image\.haosou\.com\/i\?/,
			enabled: true,
			engineList: "image",
			style: '\
			word-break:keep-all;\
			white-space:nowrap;\
			position:relative;\
			z-index:50;\
			text-align:left;\
			',
			insertIntoDoc: {
				target: 'css;#searchBox',
				where: 'afterBegin'
			},
			etc: function() {
				document.getElementById("searchBox").style.height = '80px';
			}
		},
		{
			name: "bing图片",
			url: /^https?:\/\/.*\.bing\.com\/images\/search/,
			enabled: true,
			engineList: "image",
			style: '\
			top:-5px;\
			margin-left:5px;\
			border-collapse:separate;\
			',
			insertIntoDoc: {
				target: 'css;#rfPane',
				where: 'beforeEnd'
			},
		},
		{
			name: "搜狗图片",
			url: /^https?:\/\/pic\.sogou\.com\/pic/,
			engineList: "image",
			enabled: true,
			style: "\
			margin-top: 10px;\
			margin-left:35px;\
			",
			insertIntoDoc: {
				target: 'css;.fix_area',
				where: 'beforeEnd'
			},
			stylish:'#hdFix{height:130px !important;}',
		},
		{
			name: "有道图片",
			url: /^https?:\/\/image\.youdao\.com\/search/,
			engineList: "image",
			enabled: true,
			style: "\
			",
			insertIntoDoc: {
				target: 'css;#w',
				where: 'beforeBegin'
			}
		},
		{
			name: "花瓣",
			url: /^https?:\/\/huaban\.com\/search\/\?/,
			engineList: "image",
			enabled: true,
			style: "\
			width:100%;\
			background-color:#FFFFFF;\
			text-align:center;\
			",
			insertIntoDoc: {
				target: 'css;#header',
				where: 'beforeEnd'
			},
			stylish:'#page{padding-top: 75px;}',
		},
		{
			name: "flickr",
			url: /^https?:\/\/www\.flickr\.com\/search/,
			engineList: "image",
			enabled: true,
			style: "\
			position:fixed;\
			top:50px;\
			left: 50%;\
			transform: translate(-50%,0);\
			z-index:1999;\
			",
			insertIntoDoc: {
				keyword: function() {
					var input = document.querySelector("input[type='text'][value]");
					if (input) return input.value;
					else {
						var m = location.search.match(/q=([^&]+)/i);
						if (m) return true;
					}
				},
				target: 'css;body',
				where: 'beforeBegin'
			}
		},
		{
			name: "picsearch",
			url: /^http:\/\/(..|...)\.picsearch\.com\/index\.cgi/,
			engineList: "image",
			enabled: true,
			style: "\
			margin-bottom:3px;\
			",
			insertIntoDoc: {
				keyword: 'css;input[name=q]',
				target: 'css;#content',
				where: 'afterBegin'
			}
		},
		{
			name: "pixiv",
			url: /^http:\/\/www\.pixiv\.net\/search\.php/,
			engineList: "image",
			enabled: true,
			style: "\
			box-shadow:none;\
			",
			insertIntoDoc: {
				keyword: 'css;input[name=word]',
				target: 'css;body',
				where: 'beforeBegin'
			}
		},
		{
			name: "deviantart",
			url: /^https?:\/\/www\.deviantart\.com\/browse\/all\//,
			engineList: "image",
			enabled: true,
			style: "\
			margin-bottom:10px;\
			",
			insertIntoDoc: {
				target: 'css;.browse-top-bar',
				where: 'afterEnd'
			}
		},
		{
			name: "jpg4",
			url: /^http:\/\/img\.jpg4\.info\//,
			engineList: "image",
			enabled: true,
			insertIntoDoc: {
				target: 'css;form[name="formMAIN"]',
				where: 'beforeEnd'
			}
		},

		// 下载
		{
			name: "cili008",
			url: /^http:\/\/cili008\.com\/\?topic_title/,
			engineList: "下载",
			enabled: true,
			insertIntoDoc: {
				target: 'css;.header-box',
				where: 'afterEnd',
			},
		},
		{
			name: "dmhy",
			url: /^https?:\/\/share\.dmhy\.org\/topics\/list/,
			engineList: "download",
			enabled: true,
			insertIntoDoc: {
				keyword: function(){var key=document.querySelector('#keyword').value;if(key)return key;else key=document.title.split(/「|」/)[1];return key;},
				target: 'css;.quick_search',
				where: 'afterEnd'
			}
		},
		{
			name: "kickass",
			url: /^https?:\/\/kat\.cr\/usearch\//,
			engineList: "download",
			enabled: true,
			insertIntoDoc: {
				target: 'css;#menu',
				where: 'afterEnd'
			},
		},
		{
			name: "nyaa",
			url: /^https?:\/\/www\.nyaa\.(se|eu)\/\?page=search/,
			engineList: "download",
			enabled: true,
			style: "\
			top:44px;\
			position: fixed;\
			left: 50%;\
			transform: translate(-50%, 0px);\
			white-space: nowrap;\
			",
			insertIntoDoc: {
				target: 'css;#topbar',
				where: 'afterEnd'
			},
			stylish:'#main{padding-top:70px;}',
		},
		{
			name: "sukebei.nyaa",
			url: /^https?:\/\/sukebei\.nyaa\.(se|eu)\/\?page=search/,
			engineList: "download",
			enabled: true,
			style: "\
			top:44px;\
			position: fixed;\
			left: 50%;\
			transform: translate(-50%, 0px);\
			white-space: nowrap;\
			",
			insertIntoDoc: {
				target: 'css;#topbar',
				where: 'afterEnd'
			},
			stylish:'#main{padding-top:70px;}',
		},
		{
			name: "xiaohx",
			url: /^https?:\/\/www\.xiaohx\.net\/search\?/,
			engineList: "download",
			enabled: true,
			insertIntoDoc: {
				target: 'css;.header_box',
				where: 'afterEnd'
			},
		},
		{
			name: "ed2000",
			url: /^https?:\/\/www\.ed2000\.com\/FileList\.asp/,
			engineList: "download",
			enabled: true,
			style: "\
			word-break:keep-all;\
			white-space:nowrap;\
			left: 50%;\
    		transform: translate(-50%, 0);\
			",
			insertIntoDoc: {
				target: 'css;.topsearch',
				where: 'afterEnd'
			},
		},
		{
			name: "bt2mag",
			url: /^https?:\/\/www\.bt2mag\.com\/search\//,
			enabled: true,
			engineList: "download",
			style: '\
			word-break:keep-all;\
			white-space:nowrap;\
			margin:10px auto;\
			',
			insertIntoDoc: {
				target: 'css;.fullsearch-form.search',
				where: 'afterEnd'
			},
			etc: function(){
				if(window.location.href.indexOf('%20')!=-1)window.location.href=window.location.href.replace('%20','+');
			}
		},
		{
			name: "torrentkitty",
			url: /^https?:\/\/(www\.)?torrentkitty\.(net|org)\/search\//,
			enabled: true,
			engineList: "download",
			style: '\
			background-color:#FFFFFF;\
			margin-top:50px;\
			',
			insertIntoDoc: {
				keyword: function() {
					return document.getElementsByTagName("h2")[0].innerHTML.slice(19, -1);
				},
				target: 'css;.wrapper',
				where: 'afterEnd'
			}
		},
		{
			name: "BTDigg",
			url: /^https?:\/\/btdigg\.org\/search\?/,
			enabled: true,
			engineList: "download",
			insertIntoDoc: {
				target: 'css;.pager',
				where: 'beforeBegin'
			}
		},

		//字幕
		{
			name: "subom",
			url: /^https?:\/\/www\.subom\.net\/search/,
			engineList: "download",
			enabled: true,
			insertIntoDoc: {
				target: 'css;#container',
				where: 'afterBegin'
			}
		},
		{
			name: "subhd",
			url: /^https?:\/\/subhd\.com\/search/,
			engineList: "download",
			enabled: true,
			style: "\
			top: -10px;\
			",
			insertIntoDoc: {
				target: 'css;.container.list',
				where: 'beforeBegin'
			}
		},
		{
			name: "射手网(伪)",
			url: /^https?:\/\/sub\.makedie\.me\/sub\/\?s/,
			engineList: "download",
			enabled: true,
			insertIntoDoc: {
				target: 'css;#site_header',
				where: 'afterEnd'
			}
		},
		// 购物
		{
			name: "一淘",
			url: /^https?:\/\/s8?\.etao\.com\/search/,
			enabled: true,
			engineList: "shopping",
			insertIntoDoc: {
				target: 'css;#etao-header-bd',
				where: 'beforeBegin'
			}
		},
		{
			name: "京东",
			url: /^https?:\/\/search\.jd\.com\/(S|s)earch\?/i,
			enabled: true,
			engineList: "shopping",
			insertIntoDoc: {
				target: 'css;div[id*="nav-201"]',
				where: 'beforeBegin'
			}
		},
		{
			name: "淘宝搜索",
			url: /^https?:\/\/(s|haosou\.ai)\.taobao\.com\/search/,
			enabled: true,
			change:'runAtComplete',
			engineList: "shopping",
			style: "\
			width:100%;\
			text-align:center;\
			",
			insertIntoDoc: {
				target: 'css;body',
				where: 'beforeBegin',
			},
		},
		{
			name: "易迅",
			url: /^https?:\/\/searchex\.yixun\.com\/html\?/,
			enabled: true,
			engineList: "shopping",
			style: "\
			text-align: center;\
			background-color:#FFFFFF;\
			",
			insertIntoDoc: {
				target: 'css;.ic_header',
				where: 'beforeEnd'
			}
		},
		{
			name: "苏宁",
			url: /^https?:\/\/search\.suning\.com\//,
			enabled: true,
			engineList: "shopping",
			style: "\
			border-bottom:1px solid #E5E5E5;\
			",
			insertIntoDoc: {
				target: 'css;.ng-header',
				where: 'afterEnd'
			}
		},
		{
			name: "天猫",
			url: /^https?:\/\/list\.tmall\.com\/\/?search/,
			enabled: true,
			engineList: "shopping",
			style: "\
			border-top:1px solid #E5E5E5;\
			margin-bottom:3px;\
			",
			insertIntoDoc: {
				target: 'css;#header',
				where: 'afterEnd'
			}
		},
		{
			name: "亚马逊",
			url: /^https?:\/\/www\.amazon\.cn\/s\/ref/,
			enabled: true,
			engineList: "shopping",
			style: "\
			width: 100%;\
    		text-align: center;\
			",
			insertIntoDoc: {
				target: 'css;#navbar',
				where: 'beforeEnd'
			}
		},
		{
			name: "当当",
			url: /^https?:\/\/search\.dangdang\.com\/\?key/,
			enabled: true,
			engineList: "shopping",
			insertIntoDoc: {
				target: 'css;#bd',
				where: 'beforeBegin'
			}
		},
		{
			name: "拍拍",
			url: /^https?:\/\/(www|duobao)\.paipai\.com\/(list)?\?/,
			enabled: true,
			engineList: "shopping",
			insertIntoDoc: {
				keyword: 'css;input[type="text"]',
				target: 'css;#toTop',
				where: 'afterEnd'
			}
		},
		// 词典
		{
			name: "汉典",
			url: /^https?:\/\/www\.zdic\.net\/sousuo/,
			enabled: true,
			engineList: "etc",
			insertIntoDoc: {
				target: 'css;.secpan',
				where: 'afterEnd'
			}
		},
		];

		if (typeof exports !== 'undefined') {
			exports.rules = rules;
		}

		reloadDebug();

	// --------------------可设置项结束------------------------

	var debug;

	function reloadDebug() {
		debug = prefs.debug ? console.debug.bind(console) : function() {};
	}

	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function(str) {
			return this.slice(0, str.length) == str;
		};
	}


	function getPostFormHTML(url, args, newTab) {// 获取 method 为 POST 的表单的 HTML
		var form = '<form method="post"' +
		' action="' + url + '"' +
		(newTab ? ' target="_blank"' : '') +
		'>';
		for (var arg in args) {
			var input = '<input type="hidden"' +
			' name="' + arg + '"' +
			' value="' + args[arg] + '"' +
			' />';
			form += input;
		}
		form += '</form>';
		return form;
	}

	function wrapToHide(html) {// 包装 HTML 元素代码以隐藏该元素
		return '<span style="display:none;">' + html + '</span>';
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

	// 事件支持检测.
	// 比如 eventSupported('fullscreenchange', document);
	function eventSupported(eventName, elem) {
		elem = elem || document.createElement('div');
		var prefix = ['o', 'ms', 'moz', 'webkit', ''];

		var l = prefix.length;
		var pEventName;
		var isFunction;
		var setAttr;

		while(l --) {
			pEventName = 'on' + prefix[l] + eventName;

			if (pEventName in elem) return pEventName.slice(2);
			else if (typeof elem.setAttribute == 'function') { // setAttribute 是元素节点的方法
				setAttr = false;
				if (!elem.hasAttribute(pEventName)) {
					setAttr = true;
					elem.setAttribute(pEventName, 'return;');
				};

				isFunction = typeof elem[pEventName] == 'function';

				if (setAttr) elem.removeAttribute(pEventName);

				if (isFunction) {
					return pEventName.slice(2);
				};
			};
		};

		return false;
	};


	var data = (function () {// 保存指定对象相关数据
		'use strict';

		var cache = {
			objs: [],
			data: {},
		};


		function data(obj, key, value) {
			var id = cache.objs.indexOf(obj);
			if (id == -1) {id = cache.objs.push(obj) - 1;};
			if (!cache.data[id])cache.data[id] = {};//初始化
			if (typeof value == 'undefined') {// 取值
				return typeof key == 'undefined' ? cache.data[id] : cache.data[id][key];
			} else {
				return cache.data[id][key] = value;
			};
		};

		return data;
	})();

	// 为mouseleave mouseenter事件做个兼容
	// 需要 eventSupported， data函数支持
	var mouseEventListener = (function () {

		var support = {
			mouseleave : eventSupported('mouseleave'),
			mouseenter : eventSupported('mouseenter'),
		};

		var map = {
			mouseleave : 'mouseout',
			mouseenter : 'mouseover',
		};

		return {
			add : function (type, ele, callback) { //事件类型，元素，监听函数
				if (support[type]) {
					ele.addEventListener(type, callback, false); //mouseleave,enter不冒泡，所以在冒泡阶段监听事件，不要担心子孙元素进出发生的事件冒泡上来。
				} else {
					var listener = data(callback, 'mouseELListener');
					if (!listener) {
						listener = function (e) {
							var relatedTarget = e.relatedTarget; //mouseout，去往的元素；mouseover，来自的元素
							// 当mouseout（离开ele）去往的元素不是自己的子孙元素
							// 当mouseover（进入ele）来自的元素不是自己的子孙元素
							if (!ele.contains(relatedTarget)) { // contains函数，自己.contains(自己) 返回true
								callback.call(ele, e);
							};
						};
						data(callback, 'mouseELListener', listener);
					};

					ele.addEventListener(map[type], listener, true);
				};
			},
			remove : function (type, ele, callback) {
				if (support[type]) {
					ele.removeEventListener(type, callback, false);
				} else {
					ele.removeEventListener(map[type], data(callback, 'mouseELListener'), true);
				};
			},
		};
	})();


	function getScrolled(container) {//获取已滚动的距离
		if (container) {
			return {
				x:container.scrollLeft,
				y:container.scrollTop,
			};
		};
		return {
			x: 'scrollX' in window ? window.scrollX : ('pageXOffset' in window ? window.pageXOffset : document.documentElement.scrollLeft || document.body.scrollLeft),
			y: 'scrollY' in window ? window.scrollY : ('pageYOffset' in window ? window.pageYOffset :  document.documentElement.scrollTop || document.body.scrollTop),
		};
	};

	function getElement(selector) {
		if (selector.indexOf('css;') == 0) {
			return document.querySelector(selector.slice(4));
		} else {
			return "";
		};
	};

	function toUTF16(str) { //说是UTF16，但其实是dA专用的，是对转义字符进行编码
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
				} else {
					ret.push('%' + charCode.toString(16));
				};
			} else {
				gCode = charCode.toString();
				if (gCode) {
					while (gCode.length < 4) {
						gCode = '0' + gCode;
					};
					ret.push('%26%23' + gCode + '%3B');
				} else {
					/*字库里面没有.*/
				};
			};
		};
		return ret.join('');
	};


	function parseDataStr(str, opt) {// 转换文本数据为 engineList 对象
		if (typeof opt == 'undefined') {
			opt = {};
		}


		str = str.replace(/[\n\r]+[\s\/]*-\s*(\S+):/g, '_POST_ $1:');// 提前处理下特殊的 post 方式

		var parseArgs = function(str) {
			var arr = str.replace(/，/g, ', ').split(/\s*, \s*/);
			var args = {};
			arr.forEach(function(s){
				var argArr = s.split(/\s*: \s*/);
				args[argArr[0]] = argArr[1];
			});
			return args;
		};

		var isEncoding = function(str) {
			str = str.trim().toLowerCase();
			return ['utf-8', 'gb', 'utf16'].some(function(e) {
				return str.indexOf(e) == 0;
			});
		};

		var parseLine = function (line) {
			line = line.trim();

			if (!line) return;

			if (line.indexOf('//') == 0) {
				if (opt.commentLine) line = line.replace(/^\/\/\s*/, '');// 包含注释行
				else return;
			}

			var engine = {};

			if (line.indexOf('_POST_') != -1) {
				engine.method = 'POST';
				var two = line.split(/\s*_POST_\s*/);
				line = two[0];
				engine.args = parseArgs(two[1]);
			}

			var arr = line.replace(/，/g, ', ').split(/\s*, \s*/);
			if (arr.length === 1) {  // 分类
				return line;
			}

			engine.name = arr[0];
			engine.url = arr[1];
			engine.host = parseUri(engine.url).host;

			// 处理编码和图标
			if (arr[2] && isEncoding(arr[2])) {
				engine.encoding = arr[2];
				engine.favicon = arr[3];
			} else {
				engine.favicon = arr[2];
			}

			if (!engine.favicon) {
				engine.favicon = getFaviconUrl(engine.url, opt.iconType);
			}

			return engine;
		};

		var list = {},
		type;

		str.split(/[\n\r]+/).forEach(function(line){
			var engine = parseLine(line);
			if (!engine) {
				return;
			}

			if (typeof engine === 'string') {
				type = line.trim();
				list[type] = [];
			} else list[type].push(engine);
		});

		return list;
	}

	function getFaviconUrl(url, type) {
		var uri = parseUri(url);
		switch(type) {
			case 0:
			return 'https://www.google.com/s2/favicons?domain=' + uri.host;
			default:
			return uri.protocol + '://' + uri.host + '/favicon.ico';
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
		uri[o.ds.name][0]['key'] = (uri.protocol ? uri.protocol : 'http') + '://' + uri.host + (uri.port ? ':' + uri.port : '') + '/';
		uri[o.ds.name][0]['val'] = '/';
		var i = 0,
		tempsub = '/',
		subs = uri[o.key[10]].substr(1).split('/');
		for (var j = 1; j < (subs.length + 1); j++, i++) {
			tempsub += tempsub === '/' ? subs[i] : '/' + subs[i];
			if (subs[i]) {
				uri[o.ds.name][j] = {};
				uri[o.ds.name][j]['key'] = subs[i];
				uri[o.ds.name][j]['val'] = tempsub;
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

	if (typeof exports !== 'undefined') {
		exports.parseDataStr = parseDataStr;
		exports.parseUri = parseUri;
	}

	function DropDownList(a, list) {// 列表对象
		this.a = a;
		this.list = list;
		this.init();
	};
	DropDownList.zIndex = 100000000;

	DropDownList.prototype = {
		hidden: true,
		showDelay: 233,
		hideDelay: 266,
		aShownClass: 'sej-drop-list-trigger-shown',

		init: function () {
			var a = this.a;
			var list = this.list;
			var self = this;

			mouseEventListener.add('mouseenter', a, function () {// 进入显示
				clearTimeout(self.hideTimerId);

				if (self.hidden) {
					self.showTimerId = setTimeout(function () {
						self.show();
					}, self.showDelay);
				} else {
					var style = list.style;
					style.zIndex = DropDownList.zIndex ++;
					style.opacity = 0.96;
				};
			});

			// 离开隐藏
			mouseEventListener.add('mouseleave', a, function () {
				clearTimeout(self.showTimerId);

				if (!self.hidden) {
					list.style.opacity = 0.3;
					self.hideTimerId = setTimeout(function () {
						self.hide();
					}, self.hideDelay);
				};
			});

			mouseEventListener.add('mouseenter', list, function () {
				clearTimeout(self.hideTimerId);

				var style = list.style;
				style.zIndex = DropDownList.zIndex ++;
				style.opacity = 0.96;
			});

			mouseEventListener.add('mouseleave', list, function () {

				list.style.opacity = 0.3;
				self.hideTimerId = setTimeout(function () {
					self.hide();
				}, self.hideDelay);
			});
		},
		show: function () {
			if (!this.hidden) return;
			this.hidden = false;

			var scrolled = getScrolled();
			var aBCRect = this.a.getBoundingClientRect();

			var style = this.list.style;

			var top, left;
			if (this.a.dataset.horizontal) { // 向右展开
				top = scrolled.y + aBCRect.top;
				left = scrolled.x + aBCRect.left + this.a.clientWidth;
			} else { // 默认的向下展开
				top = scrolled.y + aBCRect.bottom;
				left = scrolled.x + aBCRect.left;
			}

			left=left-25;//使用居中样式的调整
			style.top = top + 6 + 'px';
			style.left = left + 'px';
			style.zIndex = DropDownList.zIndex ++;
			style.display = 'block';

			setTimeout(function () {
				style.opacity = 0.96;
				style.top = top + 'px';
			}, 30);

			this.a.classList.add(this.aShownClass);

		},
		hide: function () {
			if (this.hidden) return;
			this.hidden = true;

			var style = this.list.style;
			style.display = 'none';
			style.opacity = 0.3;

			this.a.classList.remove(this.aShownClass);

		},
	};

	function addGlobalStyle() {
		// 添加全局样式和自定义样式
		var style = document.getElementById('sej-style');
		if (!style) {
			style = document.createElement('style');
			style.id = 'sej-style';
			style.type = 'text/css';
			style.textContent = MAIN_CSS + '\n' + (matchedRule.stylish || '');
			document.head.appendChild(style);
		}
	}

	function addContainer(iTarget, iInput) {
		var pageEncoding = (document.characterSet || document.charset).toLowerCase();
		// 创建dom
		var aPattern = '<a href="" class="sej-engine"' + (prefs.openInNewTab ? ' target="_blank" ' : ' ') +
		'encoding="$encoding$" url="$url$" onclick="$onclick$" _title="$title$">' +
		'<img src="$favicon$" class="sej-engine-icon" />$form$<span>$name$</span></a>';

		var container = document.createElement('sejspan');
		container.id = 'sej-container';

		container.addEventListener('mousedown', mousedownhandler, true);
		if (matchedRule.style) {
			container.style.cssText = matchedRule.style;
		}

		var dropLists = [];

		// 根据搜索列表的类型得到数据
		var engineListDataStr = engineListData[prefs.engineListDataType] || engineListData.normal;
		var allEngineList = parseDataStr(engineListDataStr);
		var isFirstDropList = true;
		var isMatched = false;  // 当前搜索只匹配一次

		Object.keys(allEngineList).forEach(function (categoryStr) {
			var categoryArr = categoryStr.split('-');

			var category = {
				str: categoryStr,
				name: categoryArr[0],
				icon: categoryArr[1],
				insert: categoryArr[2]
			};

			var engines = [];

			var engineList = allEngineList[categoryStr];
			engineList.forEach(function (engine) {
				if (matchedRule.engineList && !isMatched && toRE(matchedRule.url).test(engine.url)) { // 去掉跳转到当前引擎的引擎
					isMatched = false;  // 去除当前搜索只匹配一次
					return;
				}

				var a = aPattern.replace('$encoding$', (engine.encoding || 'utf-8').toLowerCase())
				.replace('$url$', engine.url)
				.replace('$name$', engine.name)
				.replace('$title$', engine.name);
				if (engine.favicon) {
					a = a.replace('$favicon$', engine.favicon);
				} else {
					a = a.replace('src="$favicon$"', '');
				}

				if (engine.method && engine.method.toUpperCase() == 'POST') {
					var f = wrapToHide(getPostFormHTML(engine.url, engine.args, prefs.openInNewTab));
					a = a.replace('$form$', f);
					a = a.replace('$onclick$', "this.getElementsByTagName('form')[0].submit();return false;");
				} else {
					a = a.replace('$form$', '');
					a = a.replace('onclick="$onclick$"', '');
				}

				engines.push(a);
			});

			// 非空列表
			if (!engines.length) return;

			// 插入一个节点给 insertBefore 用
			var lastInsertTitle = category.name;
			engines = engines.join('') + '<span class="sej-engine" _title="' + lastInsertTitle + '" style="display: none;"></span>';

			if (isTheSameCategory(category.name, matchedRule.engineList)) {
				container.innerHTML = '<sejspan id="sej-expanded-category">'+ category.name +'</sejspan>' + engines;
			} else {
				var dropList = document.createElement('sejspan');
				dropList.className = 'sej-drop-list';
				dropList.innerHTML = engines;

				// 有子 droplist
				var a = dropList.firstElementChild.cloneNode(true);
				a.className = a.className + ' sej-drop-list-trigger';
				a.lastChild.textContent = category.name;

				// 更改图标
				if (category.icon) {
					var e = engineList[category.icon - 1];
					if (e && e.favicon) {  // 数字匹配
						a.firstChild.src = e.favicon;
					} else {  // 名称匹配
						for (var i = 0; i < engineList.length; i++) {
							if (engineList[i].name == category.icon) {
								a.firstChild.src = engineList[i].favicon;
								break;
							}
						};
					}
				}

				// 是否为第一个 droplist
				if (isFirstDropList) {
					a.className += ' first';
					isFirstDropList = false;
				}

				// 重新插入的位置
				if (typeof category.insert !== 'undefined') {
					a.dataset.horizontal = true;
					a.dataset.insert = category.insert;
				}

				dropLists.push({
					a: a,
					dropList: dropList
				});
			};
		});

		dropLists.forEach(function (item, index) {
			var a = item.a,
			dropList = item.dropList;

			// 移到某个类别里面
			var ins;
			var insert = a.dataset.insert;
			if (typeof insert !== 'undefined') {
				ins = document.querySelector('.sej-engine[_title="' + insert + '"]:not(.sej-drop-list-trigger)');
			}

			if (ins) {
				ins.parentNode.insertBefore(a, ins);
			} else {
				container.appendChild(a);
			}

			if (a.dataset.horizontal && a.parentNode.id === container.id) {  // 如果是顶层，菜单不需要修正
				a.removeAttribute('data-horizontal');

				// 插入到第一个类别前面
				// ins = container.querySelector('a.sej-engine.first');
				ins = container.querySelector('a.sej-engine:not(.sej-drop-list-trigger)');
				ins.parentNode.insertBefore(a, ins);
			}

			if (prefs.position == 'left') { // 如果再左边的话，修正弹出菜单的位置
				a.dataset.horizontal = true;
			}
			document.body.appendChild(dropList);

			dropList.addEventListener('mousedown', mousedownhandler, true);

			new DropDownList(a, dropList);
		});

		var insertWhere = matchedRule.insertIntoDoc.where;// 设置插入的位置

		switch (insertWhere.toLowerCase()) {// 插入到文档中
			case 'beforebegin' :
			iTarget.parentNode.insertBefore(container, iTarget);
			break;
			case 'afterbegin' :
			if (iTarget.firstChild) {
				iTarget.insertBefore(container, iTarget.firstChild);
			} else {
				iTarget.appendChild(container);
			}
			break;
			case 'beforeend' :
			iTarget.appendChild(container);
			break;
			case 'afterend' :
			if (iTarget.nextSibling) {
				iTarget.parentNode.insertBefore(container, iTarget.nextSibling);
			} else {
				iTarget.parentNode.appendChild(container);
			}
			break;

		};

		var isTwoLine = container.clientHeight / container.children[1].clientHeight > 2;

		// 插入后调整下，如果变成两行，隐藏文字
		if (prefs.hideEnglineLabel == 2 || (prefs.hideEnglineLabel == 1 && isTwoLine)) {
			[].forEach.call(document.querySelectorAll('#sej-container > a[class="sej-engine"] > span'), function(span) {
				var link = span.parentNode;
				link.classList.add('only-icon');
				link.setAttribute('title', span.textContent);
			});
		}

		if (typeof matchedRule.endFix == 'function') {
			try {
				matchedRule.endFix();
			} catch(ex) {
				console.error('endFix 错误', ex);
			}
		}

		function mousedownhandler(e) {
			var target = e.target;
			if(!target.href)target = target.parentNode;

			// if (!target || target.className.indexOf('sej-engine') == -1) return;
			if (!target || !this.contains(target)) return;

			var value;
			if (typeof iInput == 'function') value = iInput();
			else {
				if (iInput.nodeName == 'INPUT' || iInput.localName == 'textarea') value = iInput.value;
				else value = iInput.textContent;
			}

			// 根据后代元素中是否存在 form 元素，判断提交方式并进行处理
			// 如果没有 form 元素，将会使用 GET 方法提交；如果有，将会使用 POST 方法提交
			var forms = target.getElementsByTagName('form');
			if (forms.length == 0) { // 提交方式为 GET
				// 处理编码
				var encoding = target.getAttribute('encoding');
				if (encoding == 'utf-8') value = encodeURIComponent(value);
				else if (encoding.indexOf('gb') == 0) console.log('不再收录gbk编码的引擎')
					else if (encoding == 'utf16') value = toUTF16(value);

				target.href = target.getAttribute('url').replace(/%s/g, value); // 替换“全部”关键词
			}
			else{ // 提交方式为 POST
				var inputs = target.getElementsByTagName('input');
				for (var i = 0; i < inputs.length; i++) inputs[i].value = inputs[i].value.replace(/%s/g, value); // // 替换“全部”关键词
			}
		}
	}

	function run() {
			// 百度搜索插入到顶部搜索条下面就会造成页面部分元素的消失，所以需要每个部分都判断下是否存在
			// 判断插入位置和输入框是否存在
			var iTarget = getElement(matchedRule.insertIntoDoc.target);
			var iInput;
			if(matchedRule.insertIntoDoc.keyword){
				if (typeof matchedRule.insertIntoDoc.keyword == 'function') {
					iInput = matchedRule.insertIntoDoc.keyword;
					if (!iInput()) {
						return;
					}
				} else {
					iInput = getElement(matchedRule.insertIntoDoc.keyword);
				}
			}
			else{
				iInput=document.querySelector('input[type="search"],input[name][value]:not([type]),input[type="text"][value][name]');
				if(!iInput){iInput=document.querySelector('input[autocomplete="off"]:not([type]),input[type="text"]');}
			}
			debug('插入的位置为 %o', iTarget);
			debug('匹配的输入框为 %o', iInput);

			if (!iTarget || !iInput) {
				debug('不存在插入的位置或匹配的输入框', iTarget, iInput);
				return;
			}

			addGlobalStyle();

		// 判断是否存在
		var container = document.getElementById('sej-container'),
		sejspan = document.querySelector('sejspan.sej-drop-list');

		if (!container || !sejspan) {
			if (container) {
				container.parentNode.removeChild(container);
			}
			addContainer(iTarget, iInput);
		}
	}

	function remove() {
		var elems = document.querySelectorAll('#sej-container, sejspan.sej-drop-list');
		if (!elems) return;

		[].forEach.call(elems, function(elem) {
			elem.parentNode.removeChild(elem);
		});
	}

	// iframe 禁止加载
	if (window.self != window.top) return;

	var matchedRule;

	rules.some(function (rule) {
		if (toRE(rule.url).test(location.href)) {
			matchedRule = rule;
			if (typeof rule.etc == 'function') {
				try {
					rule.etc();
				} catch(ex) {
					console.error('执行 etc 错误', ex);
				}
			}
			return true;
		};
	});


	debug('匹配的规则为', matchedRule);

	if (!matchedRule || !matchedRule.enabled) return;

	if (matchedRule.change) {
		if(matchedRule.change=="mutationTitle"){
			run();
			debug('添加标题节点监视器: title');

			var watch = document.querySelector('title');
			var observer = new MutationObserver(function(mutations){
				debug('标题发生了变化', document.title);
				run();
			});
			observer.observe(watch, {childList: true, subtree: true, characterData: true});
		}
		if(matchedRule.change=="runAtComplete"){
			document.onreadystatechange = function() {
				debug('onreadystatechange');
				if (document.readyState == "complete"){
					run();
				}
			}
		}
	}
	else run();


})()
