/*
// ==UserScript==
// @name         [谷歌/Alook/Via]玫瑰小说网重排
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  一个简单的网页小说重排，兼容Via和Alook浏览器。自用脚本，不催不更。催了也不更[dog]。
// @author       Mr.NullNull
// @include      *://m.meiguixsw.com/html/*  
// @downloadURL https://update.greasyfork.org/scripts/399571/%5B%E8%B0%B7%E6%AD%8CAlookVia%5D%E7%8E%AB%E7%91%B0%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%87%8D%E6%8E%92.user.js
// @updateURL https://update.greasyfork.org/scripts/399571/%5B%E8%B0%B7%E6%AD%8CAlookVia%5D%E7%8E%AB%E7%91%B0%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%87%8D%E6%8E%92.meta.js
// ==/UserScript==
*/
/* window.alert("StartA"); */
function ReaderMain() {
	/* window.alert("ReaderMain"); */
	var url = document.URL;
	window.stop();
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.overrideMimeType("text/html;charset=gbk");
	request.send();
	document.querySelector("html").innerHTML = request.response;


	var htmlStr = '<html> <head> <title></title> <style type="text/css"> body { margin: 0px; padding: 1.2em 0.6em; } .i_title { font-weight: bold; line-height: 3em; margin: 1.6em 0 1em 0; } .i_button { line-height: 3em; text-align: center; text-decoration: none; float: left; color: inherit; display: block; background-color: rgba(128, 128, 128, 0.102); border: 1px solid rgba(128, 128, 128, 0.502); } .i_menu { height: 3em; margin: 1.2em 0px; } .i_menu > a, .i_setMenu > div { width: 32.6%; } .i_light { color: #000000; background-color: #fbf6ec; } .i_night { color: #cccccc; background-color: #232729; } </style> <style type="text/css" id="i_css"> </style> </head> <body> <div> <div class="i_setMenu i_menu"> <div class="i_button" id="i_set0"></div> <div class="i_button" id="i_set1">A-</div> <div class="i_button" id="i_set2">A+</div> </div> <div class="i_title"></div> <div class="i_nr"></div> <div class="i_menu"> <a class="i_button" href="">上一章</a> <a class="i_button" href="">目　录</a> <a class="i_button" href="">下一章</a> </div> </div> </body> </html>';

	var nrStr = document.querySelector("div#nr1").innerHTML,
		nrTitle = document.querySelector("div#nr_title").innerHTML,
		htmlTitle = document.querySelector("title").innerHTML,
		nrPrevHref = "https://m.meiguixs.net" + document.querySelector("a#pb_next").getAttribute("href"),
		nrMuLuHref = "https://m.meiguixs.net" + document.querySelector("a#pb_mulu").getAttribute("href"),
		nrNextHref = "https://m.meiguixs.net" + document.querySelector("a#pb_prev").getAttribute("href");

	nrStr = nrStr.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "　　");
	nrTitle = nrTitle.replace("正文 ", "");
	htmlTitle = htmlTitle.replace("最新更新手打全文字TXT全集下载-玫瑰小说网手机阅读", "") + " " + nrTitle;
	nrStr = nrStr.replace(/(玫瑰小说网|大家记得收藏网址或牢记网址|网址m\.meiguixs\.net|免费最快更新无防盗无防盗|报错章|求书找书|和书友聊书请加qq群：647377658（群号）)(\,|\.|\s)*/g, "");

	/*colorCode: 夜间模式night 日间模式light*/
	var colorCode, fontSize;

	init();

	function init() {
		var tmpColor = Utils.getCookie("i_Color"),
			tmpFontSize = Utils.getCookie("i_fontSize");
		if (tmpColor != null && tmpFontSize != null) {
			colorCode = tmpColor;
			fontSize = tmpFontSize;
		} else {
			colorCode = "night";
			fontSize = 16;
			setUserCookie();
		}

		/* 设置网页内容 */
		document.querySelector("html").innerHTML = htmlStr;
		document.querySelector("title").innerHTML = htmlTitle;
		document.querySelector("div.i_title").innerHTML = nrTitle;
		document.querySelector("div.i_nr").innerHTML = nrStr;
		var tmpArr = document.querySelectorAll("div.i_menu > a");
		try {
			tmpArr[0].setAttribute("href", nrNextHref);
			tmpArr[1].setAttribute("href", nrMuLuHref);
			tmpArr[2].setAttribute("href", nrPrevHref);
		} catch (error) {
			console.log(error)
		}

		document.querySelector("div#i_set0").onclick = function () {
			setColor();
		};
		document.querySelector("div#i_set1").onclick = function () {
			setFontSizeCut();
		};
		document.querySelector("div#i_set2").onclick = function () {
			setFontSizeAdd();
		};

		document.querySelector("style#i_css").innerHTML = 'body{font: ' + fontSize + 'px/1.5 "微软雅黑";}';

		switch (colorCode) {
			case "night":
				document.querySelector("body").setAttribute("class", "i_night");
				document.querySelector("#i_set0").innerHTML = "开灯";
				break;
			case "light":
				document.querySelector("body").setAttribute("class", "i_light");
				document.querySelector("#i_set0").innerHTML = "关灯";
				break;
		}
	}

	function setColor() {
		switch (colorCode) {
			case "light":
				document.querySelector("body").setAttribute("class", "i_night");
				document.querySelector("#i_set0").innerHTML = "开灯";
				colorCode = "night";
				break;
			case "night":
				document.querySelector("body").setAttribute("class", "i_light");
				document.querySelector("#i_set0").innerHTML = "关灯";
				colorCode = "light";
				break;
		}
		setUserCookie();
	}

	function setFontSizeAdd() {
		fontSize++;
		document.querySelector("style#i_css").innerHTML = 'body{font: ' + fontSize + 'px/1.5 "微软雅黑";}';
		setUserCookie();
	}

	function setFontSizeCut() {
		fontSize--;
		document.querySelector("style#i_css").innerHTML = 'body{font: ' + fontSize + 'px/1.5 "微软雅黑";}';
		setUserCookie();
	}

	function setUserCookie() {
		Utils.setCookie("i_Color", colorCode + "");
		Utils.setCookie("i_fontSize", fontSize + "");
	}
};

class Utils {
	static getCookie(name) {
		var cStr = document.cookie;
		var tmp, tmpName, tmpValue;
		cStr = cStr.split(";");
		for (var i = 0, len = cStr.length; i < len; i++) {
			tmp = cStr[i].split("=");
			tmpName = tmp[0];
			tmpValue = tmp[1];
			if (tmpName == name || tmpName == " " + name) {
				return tmpValue;
			}
		}
		return null;
	}

	static setCookie(name, value) {
		document.cookie = name + '=' + value;
	}

	static getBrowser() {
		var browser = {
				msie: false,
				firefox: false,
				opera: false,
				safari: false,
				chrome: false,
				netscape: false,
				appname: 'unknown',
				version: 0
			},
			ua = window.navigator.userAgent.toLowerCase();
		if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
			browser[RegExp.$1] = true;
			browser.appname = RegExp.$1;
			browser.version = RegExp.$2;
		} else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
			/* safari */
			browser.safari = true;
			browser.appname = 'safari';
			browser.version = RegExp.$2;
		}
		return browser.appname + ' ' + browser.version;
	}
};

if (window.location.href.indexOf("index.shtml") == -1) {
	ReaderMain();
}else{
	/* alert("在目录"); */
}