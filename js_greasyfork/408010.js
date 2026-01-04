// ==UserScript==
// @name         老虎搬家阅读刷刷
// @namespace    http://tampermonkey.net/
// @version      0.104
// @description  try to take over the world!
// @author       0ltremar3
// @match        *.weibo.com/a/hot/7591120104660993_1.html?type=new*
// @match        *.weibo.com/3081216591/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408010/%E8%80%81%E8%99%8E%E6%90%AC%E5%AE%B6%E9%98%85%E8%AF%BB%E5%88%B7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/408010/%E8%80%81%E8%99%8E%E6%90%AC%E5%AE%B6%E9%98%85%E8%AF%BB%E5%88%B7%E5%88%B7.meta.js
// ==/UserScript==
var curUrl = window.location.href;
var pool = "//weibo.com/a/hot/7591120104660993_1.html?type=new";
var a = 0, b = 0, v = 0, i = 0;
var n = 16;
var start = 20;
var url = "";
var urlList = new Array();
var matchList = new Array();
var curWin;
(function () {
	'use strict';
	// console.log(curUrl,pool);
	document.onreadystatechange = function () {
		if (document.readyState == 'complete') {
			if (curUrl.indexOf(pool) != -1) {
				console.log("当前在汇总帖");
				readMore();
			} else {
				console.log("当前在微博正文");
				clock();
			}
		}
	};
})();

//展开更多
function readMore() {
	var jxnr = document.getElementsByClassName("WB_frame_c")[0];
	var more = jxnr.getElementsByClassName('UG_tips');
	var cycle = setInterval(func, 100);
	function func() {
		if (more[0]) {
			more[0].click();
			cycle;
		} else {
			var lista = document.getElementsByClassName("UG_list_a");
			var listb = document.getElementsByClassName("UG_list_b");
			var listv = document.getElementsByClassName("UG_list_v2 clearfix");
			clearInterval(cycle);
			console.log("全部微博加载完毕");

			while (lista[a]) {
				url = lista[a].getAttribute("href");
				urlList.push(url);
				rpl();
				a++;
			}
			while (listb[b]) {
				url = listb[b].getAttribute("href");
				urlList.push(url);
				rpl();
				b++;
			}
			while (listv[v]) {
				url = listv[v].getElementsByClassName("list_des")[0].getAttribute("href");
				urlList.push(url);
				rpl();
				v++;
			}

			// var len=a+b+v;
			// console.log('a='+a,'b='+b,'v='+v,'total='+len);
			// console.log(urlList);

			// for(var m=0;m<urlList.length;m++){
			// 	console.log(urlList[m]);
			// }
			console.log("共有" + urlList.length + "条虎言虎语");

			var tmp = "";
			for (var k = 0; k < matchList.length; k++) {
				// console.log(matchList[k]);
				tmp += matchList[k];
			}
			console.log(tmp);
			tips();
			mainBody();
		}
	}
}
function rpl() {
	url = url.replace("//", "// @match        *.");
	// url=url.replace("http://","// @match        *.\n");
	url = url + "*\n";
	matchList.push(url);
}
//跳转到精选内容下第一条的正文
function mainBody() {
	var space = setInterval(function () {
		if (i == urlList.length) {
			clearInterval(space);
			alert("完成阅读！");
			return;
		}
		var newWin = window.open(urlList[i]);
		console.log();
		newWin.focus();
		setTimeout(function () {
			// console.log(newWin.closed);
			if (newWin.closed) {
				console.log("已读" + (i + 1) + ":" + urlList[i]);
				i = i + 1;
			}
		}, 18000);
	}, 20000);
}
//设置正文窗口15s后关闭
function clock() {
	n = n - 1;
	console.log("将在" + n + "秒后关闭");
	if (n > 0) {
		setTimeout(clock, 1000);
	} else {
		window.close();
	}
}
function tips() {
	console.log("将在" + start + "秒后开始阅读");
	start = start - 1;
	if (start > 0) {
		var t = setTimeout(tips, 1000);
	} else {
		clearTimeout(t);
	}
}
