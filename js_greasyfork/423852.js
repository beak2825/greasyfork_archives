// ==UserScript==
// @name         起点小说vip自动换源
// @namespace    http://tampermonkey.net/
// @version      2.4.4
// @description  对起点的vip小说自动搜索笔趣阁，要设置滚动模式，自动加载形式,支持手机和网页
// @author       JucyZhu
// @match        https://m.qidian.com/book/*
// @match        https://read.qidian.com/chapter/*
// @match        https://vipreader.qidian.com/chapter/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      www.xbiquge.la
// @connect      www.42zw.com
// @connect      www.shuquge.com
// @connect      www.20xs.cc
// @connect      www.znlzd.com
// @connect      www.bqg999.cc
// @connect      www.bqg99.cc
// @connect      www.nuomi99.com
// @connect      www.nuomi9.com
// @connect      www.72wx.com
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423852/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4vip%E8%87%AA%E5%8A%A8%E6%8D%A2%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423852/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4vip%E8%87%AA%E5%8A%A8%E6%8D%A2%E6%BA%90.meta.js
// ==/UserScript==
(function() {
	'use strict';
	// Your code here...
	// 声明全局参数
	// ===== 自定义站点规则 =====
	const sites = [
		// 详细版规则示例。注：该网站已无法访问。
		{ //基本信息
			siteName: "72文学",
			URL: "https://www.72wx.com",
			urlUpdata: false,
			searchURL: "https://www.72wx.com/search.php?keyword=",
			method: "GET",
			formData: "keyword=",
			needName: true,
			bookName: "#nr td a:first",
			authorName: "#nr td:eq(2)",
			chapters: "#list dl dd a:gt(8)",
			contentSplit: "<br><br>", //章节分段方式
			content: "#content",
			removeList:[/72文学/,/www./]
		},
		{ //基本信息
			siteName: "糯米小说网",
			URL: "https://www.nuomi99.com",
			urlUpdata: false,
			searchURL: "https://www.nuomi99.com/web/search.php?q=",
			method: "GET",
			formData: "q=",
			needName: true,
			bookName: ".s2 a",
			authorName: ".s4:gt(0)",
			chapters: "#list dl dd a:gt(11)",
			contentSplit: "<br><br>", //章节分段方式
			content: "#content",
			removeList:[/www./]
		},
		{ //基本信息
			siteName: "书趣阁",
			URL: "http://www.shuquge.com/",
			urlUpdata: true,
			searchURL: "http://www.shuquge.com/search.php",
			method: "POST",
			formData: "s=6445266503022880974&searchkey=",
			needName: false,
			bookName: ".bookname a",
			authorName: ".author",
			chapters: ".listmain dl a:gt(11)",
			contentSplit: "<br><br>", //章节分段方式
			content: "#content",
			removeList:[/www./]
		},
		{ //基本信息
			siteName: "新笔趣云",
			URL: "https://www.20xs.cc",
			urlUpdata:false,
			searchURL: "https://www.20xs.cc/searchbook.php?search_key=",
			method: "GET",
			formData: "search_key=",
			needName: true,
			bookName: "strong a",
			authorName: "#li1 .name span:odd",
			chapters: "#list dl a",
			contentSplit: "node", //章节分段方式
			content: "#content p",
			removeList:[/www./]
		},
		{ //基本信息
			siteName: "新笔趣阁", // 站点名字... (可选)
			URL: "http://www.xbiquge.la",
			urlUpdata:false,
			searchURL: "http://www.xbiquge.la/modules/article/waps.php", //搜索相关
			method: "POST", //请求方式
			formData: "searchkey=", //请求数据
			needName: false,
			bookName: "tbody tr .even a", //解析搜索结果相关
			authorName: "tbody tr .even:odd",
			chapters: "#list dl a", //解析目录列表相关
			contentSplit: "<br><br>", //章节分段方式
			content: "#content",//解析章节内容
			removeList:[/www./] //去插入式广告
		},
		{ //基本信息
			siteName: "999笔趣阁",
			URL: "https://www.bqg999.cc/",
			urlUpdata:false,
			searchURL: "https://www.bqg999.cc/s.php?q=",
			method: "GET",
			formData: "q=",
			needName: true,
			bookName: ".bookname a",
			authorName: ".author",
			chapters: ".listmain dd a",
			contentSplit: "<br><br>", //章节分段方式
			content: "#content",
			removeList:[/www./]
		}
	];
	var data = {
			book: {},
			currentChapter: {},
			chapters: [],
			isApp: false
		},
		replaceList = [/http:/, /笔趣阁/, /shuquge/, /书友群/, /书趣阁/],
		chapterNum = 0,
		first_time = true,
		lock = true,
		siteId = 0,
		show = false;
	//脚本更新data获取书籍信息
	getBookContents();
	//滚动事件
	$(window).scroll(function() {
		if (data.isApp) {
			show = ($(".read-article .read-section").last().offset().top - $(document).scrollTop() < $(
				window).height());
		} else {
			show = ($("#j_chapterBox .text-wrap:last").offset().top - $(document).scrollTop() < $(window)
				.height());
		}
		if (($(window).scrollTop() * 1.05 > $(document).height() - $(window).height()) && show && lock) {
			lock = false;
			loadbook();
		}
	});

	function loadbook() {
		updata();
		//更新data
		if (chapterNum > 3) {
			if (data.isApp) {
				$(".read-section").first().remove()
				chapterNum = $(".read-section").length
			} else {
				$(".text-wrap").first().remove()
				chapterNum = $(".text-wrap").length
			}
		}
		if (data.currentChapter.vipState == 1 && chapterNum <= 3) {
			updataCurrentChapter(data.currentChapter.id + 1)
			//console.log(data.currentChapter)
			insertCurrentVipContents();
		}
	};
	//根据当前章节名称，如果是vip则从笔趣阁获取内容资源并插入
	function insertCurrentVipContents() {
		//根据找到的当前章节url获取说内容并解析
		console.log("------正在请求《" + data.currentChapter.chapterName + "》的内容------")
		var href = data.currentChapter.href;
		GM_xmlhttpRequest({
			method: "GET",
			url: href,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
			},
			data: "",
			onload: function(response) {
				//console.log("请求成功");
				insertChapter(parseContent(response.responseText))
			},
			onerror: function(response) {
				console.log("请求失败: href: " + href);
			}
		})
	};
	//更新vip状态和显示章节数
	function updata() {
		//有没有到vipstate==0 &&(登录按钮，订阅按钮长度大于0(有.btn-primary)
		//或者.j_subscribeBtn vip章节全部订阅和订阅本章按钮长度大于0
		//或者发现.w-all前往vip章节长度大于0)
		if (data.currentChapter.vipState == 0) {
			if ($(".btn-primary").length > 0) {
				//手机版
				data.currentChapter.vipState = 1;
				$(".btn-primary").remove();
				findLastChapter()
			} else if ($(".j_subscribeBtn").length > 0 || $(".w-all").length > 0) {
				//网页版
				data.currentChapter.vipState = 1;
				findLastChapter()
				//updataCurrentChapter(data.currentChapter.id + 1)
				$(".w-all").remove();
			}
			//findLastChapter()
		} else if (data.currentChapter.vipState == 1) {
			if (data.isApp) {
				chapterNum = $(".read-section").length
				//findLastChapter()
			} else {
				chapterNum = $(".text-wrap").length
				//findLastChapter()
			}
		}
	};

	function getBookChapterInfor() {
		if (typeof(g_data.book) == "undefined") {
			//说明是电脑网页端
			data.book.bookName = g_data.bookInfo.bookName;
			data.book.authorName = g_data.bookInfo.authorName;
			data.currentChapter.chapterName = $(".j_chapterName:last span:first").text();
			data.currentChapter.vipState = g_data.chapter.vipStatus;
			data.currentChapter.contentList = [];
			data.currentChapter.id = 0;
			data.isApp = false;
		} else {
			//手机网页端
			data.book.bookName = g_data.book.bookName;
			data.book.authorName = g_data.book.authorName;
			data.currentChapter.chapterName = g_data.chapter.chapterName;
			data.currentChapter.vipState = g_data.chapter.vipStatus;
			data.currentChapter.contentList = [];
			data.currentChapter.id = 0;
			data.isApp = true;
		}
		return data;
	};
	//寻找匹配目录
	function findLastChapter() {
		//遍历目录找到当前目录的url
		var chapter = "";
		if (data.isApp) {
			data.currentChapter.chapterName = $(".read-section h3").last().text()
		} else {
			data.currentChapter.chapterName = $(".text-wrap:last h3 span:first").text()
		}
		var current_chapter = data.currentChapter.chapterName;
		if (data.chapters.length > 0) {
			console.log("------正在查找阅读到的最新章节------")
			for (var i = 0, len = data.chapters.length; i < len; i++) {
				chapter = data.chapters[i].name;
				var c = chapter.replace(/\s/g, "").replace(/[：:()()]/, "")
				var cu = current_chapter.replace(/\s/g, "").replace(/[：:()()]/, "")
				if (cu === c || cu.indexOf(c) != -1 || c.indexOf(cu) != -1) {
					console.log(data.chapters[i])
					updataCurrentChapter(i);
					break;
				} else {
					updataCurrentChapter(-1);
				}
			}
		} else {
			updataCurrentChapter(-1);
			console.log("章节目录没有解析到");
		}
		//return data.currentChapter.id
	};

	function updataCurrentChapter(id) {
		if (id > -1) {
			data.currentChapter.id = id;
			data.currentChapter.chapterName = data.chapters[id].name;
			data.currentChapter.href = data.chapters[id].href;
		} else {
			data.currentChapter.id = id;
			data.currentChapter.chapterName = "ERROR";
			data.currentChapter.href = "www.baidu.com";
		}


	}
	//根据章节名获取笔趣阁的目录列表，并赋值给data.chapters
	function getBookContents() {
		//从当前页面获取小说名称和当前章节
		var config = sites[siteId]
		getBookChapterInfor();
		//仅第一次运行
		//console.log(data.book.booName);
		console.log("------开始从*****" + config.siteName + "*****搜索《 " + data.book.bookName + " 》 ------");
		if (config.needName) {
			config.searchURL = config.searchURL + data.book.bookName
		}
		runAsync(config.searchURL, config.method, config.formData + data.book.bookName).then((
			result) => {
			//bookname,authorName ==>搜索===>解析==>href==>请求==>response
			function getTitleAuthorList(result) {
				//console.log(result.responseText);
				var $html = $('<div></div>').html(result.responseText);
				var $table = $($html);
				var nameList = $(config.bookName, $table),
					authorList = $(config.authorName, $table),
					href = "";
				//console.log("nameList", nameList);
				//console.log("authorList", authorList);
				//console.log($(nameList[0]).text() + "-----" + $(authorList[0]).text())
				for (var i = 0, len = nameList.length; i < len; i++) {
					if (data.book.bookName == $.trim($(nameList[i]).text()) && (
							data.book.authorName == $.trim($(authorList[i]).text()) ||
							$.trim($(authorList[i]).text()).indexOf(data.book.authorName) != -1)) {
						//console.log($(nameList[i]).text() + "-----" + $(authorList[i]).text())
						//console.log(nameList[i])
						href = $(nameList[i]).attr("href");
						//href = $(nameList[i]).href;
						//没有http 说明url要拼接
						//console.log("href", href)
						if (href.indexOf("http") == -1) {
							href = config.URL + href
						};
						//console.log("href", href)
						break;
					}
				}
				if (nameList.length == 0 || href == "") {
					console.log("------从*****" + config.siteName + "*****搜索《 " + data.book.bookName +
						" 》 失败------");
					siteId = siteId + 1;
					if (siteId < sites.length) {
						getBookContents()
					} else {
						console.log("------未能找到小说，请继续完善地址池------");
					}
				}
				if (config.urlUpdata) {
					config.URL = href.replace("index.html", "")
				}
				return runAsync(href);
			}
			return getTitleAuthorList(result);
		}).then((response) => {
			//response==>解析==>目录列表==>保存到data==>寻找匹配的章节
			console.log("------开始从response解析目录-------- ");

			function getChapterNameHref(response) {
				var $html = $('<div></div>').html(response.responseText);
				var $table = $($html);
				var chapters = $(config.chapters, $table);
				//console.log(chapters);
				for (var i = 0, len = chapters.length; i < len; i++) {
					var chapterTmp = {
						name: "",
						href: ""
					};
					chapterTmp.name = $(chapters[i]).text();
					chapterTmp.href = config.URL + $(chapters[i]).attr("href");
					//chapterTmp.href = $(chapters[i]).href;
					//console.log(chapterTmp);
					data.chapters.push(chapterTmp);
				}
				//寻找匹配的章节
				//console.log(data.chapters)
				findLastChapter();
				if (data.currentChapter.id != -1) {
					//console.log(data.chapters[data.currentChapter.id].name)
					return runAsync(data.chapters[data.currentChapter.id].href);
				} else {
					console.log("目录没有匹配")
					return runAsync(data.chapters[0].href);
				}

			}
			return getChapterNameHref(response);
		}).then((response) => {
			//response==>解析==>章节内容==>保存到data.currentChapter.contentList==>寻找匹配的章节
			//console.log(response.responseText)
			var c = parseContent(response.responseText)
			if (($(".j_subscribeBtn").length > 0 || $(".btn-primary").length > 0) && c.length > 0) {
				insertChapter(c);
			}
		})
	};

	function parseContent(text) {
		var config = sites[siteId]
		var $html = $('<div></div>').html(text);
		var $content = $(config.content, $html);
		//根据config.contentSplit进行不同的读取方式
		var contents = []
		switch (config.contentSplit) {
			case "<br><br>":
				$content = $content[0].childNodes
				for (var i = 0, len = $content.length; i < len; i++) {
					var t = $($content[i]).text();
					//去掉包含不必要的字符段落
					if (t == "" || t == "\n" || t == "chaptererror();") {
						continue
					}
					//检查插入广告					
					for (var k = 0, len2 = config.removeList.length; k < len2; k++) {
						if(config.removeList[k].test(t)) {
							var arr = [t.lastIndexOf("。"), t.lastIndexOf("”"), t.lastIndexOf("？"), t.lastIndexOf("！")];							
							arr.sort(function(a,b){return a - b;});
							var max=arr[arr.length - 1];					
							t=t.substring(0,max+1);
							break;
						} 
					}
					//检查段落广告
					var pd = false;
					for (var j = 0, len1 = replaceList.length; j < len1; j++) {
						pd = pd || replaceList[j].test(t);
					}
					if (!pd) {
						contents.push(t);
					}
				}
				break;
			case "node":
				for (var i1 = 0, lent = $content.length; i1 < lent; i1++) {
					contents.push($content[i1].innerText);
				}
				break;
			default:
				console.log("未设置 " + config.contentSplit + " 的解析方法")
		}
		if (contents.length == 0) {
			console.log(config.siteName + "----未解析到章节内容,自动换源！！！！！！！")
			siteId = siteId + 1;
			getBookContents()
		}
		data.currentChapter.contentList = contents
		return contents
	}
	// 插入文章
	function insertChapter(contents) {
		var section, paragraph, p = "",
			i = 0,
			mlen = -1;
		if (data.isApp) {
			//手机中插入
			chapterNum = $(".read-section").length
			section = $(".read-article .read-section").last();
			$(".read-article").append(section.clone());
			section = $(".read-article .read-section").last();
			paragraph = $("p", section).first();
			$(".btn-primary", section).remove();
			$(".read-rss-auto", section).remove();
			$("p", section).remove();
			$("h3", section).text(data.currentChapter.chapterName);
			for (i = 0, mlen = contents.length; i < mlen; i++) {
				p = contents[i];
				paragraph.text(p);
				section.append(paragraph.clone());
			}
		} else {
			chapterNum = $(".text-wrap").length
			//web中插入
			section = $("#j_chapterBox .text-wrap:last");
			$("#j_chapterBox").append(section.clone());
			section = $("#j_chapterBox .text-wrap:last");
			paragraph = $(".read-content p:first", section);
			$(".vip-limit-wrap", section).remove();
			$(".admire-wrap", section).remove();
			$(".read-content p", section).remove();
			$("h3:first span:first", section).text(data.currentChapter.chapterName);
			for (i = 0, mlen = contents.length; i < mlen; i++) {
				p = contents[i];
				paragraph.text(p);
				$(".read-content", section).append(paragraph.clone());
			}
		}
		console.log("------已经插入<<" + data.chapters[data.currentChapter.id].name + ">>------")
		lock = true;
	};

	function runAsync(url, send_type = "GET", data_ry = "") {
		if (url.length>0) {
			console.log("请求数据: url: " + url + " method: " + send_type + " data: " + data_ry);
			var p = new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: send_type,
					url: url,
					headers: {
						"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.57",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data: data_ry,
					onload: function(response) {
						resolve(response);
					},
					onerror: function(response) {
						console.log("请求失败: url: " + url + " method: " + send_type +
							" data: " +
							data_ry);
						reject("请求失败: url = " + url);
					}
				});
			})
			return p;
		}else{
			var p = null;
			return p;
		}
		
	};

})();
