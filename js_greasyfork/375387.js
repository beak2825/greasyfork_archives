// ==UserScript==
// @name         搜索引擎不只百度
// @version      1.0
// @description  在百度主页中新增其他搜索引擎的按钮
// @match        *://www.baidu.com/*
// @grant        人民群众有选择搜索引擎的权力，任何搜索引擎不得剥夺
// @author       太史子义慈
// @namespace    qs93313@sina.cn
// @downloadURL https://update.greasyfork.org/scripts/375387/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%8D%E5%8F%AA%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/375387/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%8D%E5%8F%AA%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

!(function() {
	notonlybd();
})();

function notonlybd() {
	if(document.querySelector(".s-center-box") !== null) {
		var s_center_box = document.getElementsByClassName("s-center-box")[0];
		console.log(s_center_box);
		s_center_box.style.cssText = "height:130px";
	}

	//找到父亲节点
	var father = document.getElementsByClassName("s_form_wrapper")[0];

	//新建div子节点
	var new_div = document.createElement('div');
	new_div.setAttribute("id", "id_new_div");
	father.appendChild(new_div);
	new_div.style.cssText = "width:640px;height:72px;text-align:center;margin:0 auto;";

	//搜索引擎网址目录，%sv%为替换符
	var dirall = {
		"id_div_00": {
			0: "谷歌",
			1: "https://www.google.com.hk/search?lr=lang_zh-CN&q=%sv%",
		},
		"id_div_01": {
			0: "mexw",
			1: "https://so.mezw.com/Search?wd=%sv%",
		},
		"id_div_02": {
			0: "searx",
			1: "https://searx.me/?language=zh-CN&q=%sv%",
		},
		"id_div_03": {
			0: "搜狗",
			1: "https://www.sogou.com/web?ie=utf8&query=%sv%",
		},
		"id_div_04": {
			0: "360好搜",
			1: "https://www.so.com/s?q=%sv%",
		},
		"id_div_05": {
			0: "中国搜索",
			1: "http://www.chinaso.com/search/pagesearch.htm?q=%sv%",
		},
		"id_div_06": {
			0: "必应",
			1: "https://cn.bing.com/search?q=%sv%",
		},
		"id_div_07": {
			0: "yandex",
			1: "https://www.yandex.com/search/?text=%sv%",
		},
		"id_div_08": {
			0: "rambler",
			1: "https://nova.rambler.ru/search?query=%sv%",
		},
		"id_div_09": {
			0: "ecosia",
			1: "https://www.ecosia.org/search?q=%sv%",
		},
		"id_div_10": {
			0: "web.de",
			1: "https://suche.web.de/web/result?q=%sv%",
		},
		"id_div_11": {
			0: "duckduckgo",
			1: "https://duckduckgo.com/?q=%sv%",
		},
		"id_div_12": {
			0: "crawler",
			1: "http://www.webcrawler.com/serp?q=%sv%",
		},
		"id_div_14": {
			0: "qwant",
			1: "https://www.qwant.com/?t=web&q=%sv%",
		},
	}

	for(var i in dirall) {
		var v = dirall[i][0];
		var vh = dirall[i][1];
		nsp(v, i, new_div, vh);
	}
}

function nsp(th, ti, new_div, pcsearch) {
	var nsp = document.createElement('div');
	nsp.innerHTML = th;
	nsp.setAttribute("id", ti);
	new_div.appendChild(nsp);
	nsp.style.cssText = "color:white;background-color:rgb(51,133,255);;width:89px;height:22px;font-size: 15px;margin: 1px;padding:6px 0;float:left;border-radius:2px;vertical-align: middle;cursor:pointer;";
	nsp.onclick = function() {
		//找到输入框
		var kw = document.getElementById("kw");
		//获得输入框数据
		var kw_v = kw.value;
		//计算输入框数据长度
		var kw_v_len = kw_v.length;

		if(kw_v_len > 0) {
			//用输入框的数据替换掉网址内的替换符
			pcsearch = pcsearch.replace("%sv%", kw_v);
			//网址跳转
			window.open(pcsearch);
		} else {
			alert("请在上面的输入框输入要搜索的内容。");
		}

	}
}