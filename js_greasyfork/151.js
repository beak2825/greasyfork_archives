// ==UserScript==
// @name           tiebagogo
// @description    常逛的贴吧快速切换
// @include        http://www.baidu.com/*
// @include        http://tieba.baidu.com/*
// @icon           http://imgsrc.baidu.com/forum/pic/item/6fd108fb43166d229cb84fac452309f79152d2e2.png
// @author         congxz6688
// @version        2014.12.1.0
// @namespace      https://greasyfork.org/scripts/151
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/151/tiebagogo.user.js
// @updateURL https://update.greasyfork.org/scripts/151/tiebagogo.meta.js
// ==/UserScript==


//此处供用户添加自己常逛的吧
//贴吧名称不要带后面的“吧”字，就象下面的例子一样，用小写的双引号括起来，再用小写的逗号相互隔开
var addByUser = ["宰执天下", "大宋的智慧", "chrome", "firefox", "行尸走肉", "疑犯追踪", "超感神探", "grimm"];

/**********************以下部分不要随意修改**********************/

function addStyle(css){
	document.head.appendChild(document.createElement("style")).textContent = css;
}

var signCSS = "";
signCSS += ".useColor{color:#1E6AD0;} .gogoTd{line-height:22px; padding:0px 8px;} .gogo{text-decoration:none} .gogo:hover{text-decoration:underline}";
signCSS += "#floatGogo{border:1px solid grey; z-index:999; padding:8px 6px; background-color:white; color: blue;}";
signCSS += "#tieba_gogo{cursor:pointer; color:blue; background_color:grey; height:14px; width:16px; padding:1px 5px 9px 4px; position:fixed; top:200px; left:0px; z-index:99999; border: solid 1px #1E6AD0;}"
addStyle(signCSS);


//函数 绝对定位
function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
//函数 绝对定位
function getElementTop(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}
var Tds1 = [];
//建表函数
function creaseTable(UrlLength) {
	Tds1 = [];
	cons = 2;
	var tablepp = document.createElement("table");
	tablepp.setAttribute("width", "100%");
	var trs = [];
	for (ly = 0; ly < Math.ceil(UrlLength / cons); ly++) {
		var tr = document.createElement("tr");
		mmd = trs.push(tr);
		tablepp.appendChild(tr);
	}
	for (ls = 0; ls < UrlLength; ls++) {
		var td = document.createElement("td")
			td.setAttribute("class", "gogoTd");
		wq = Tds1.push(td);
		trs[Math.floor(ls / cons)].appendChild(td);
	}
	return tablepp
}

//悬浮列表窗创建函数
function openGogoList(e) {
	if (!document.getElementById("floatGogo")) {
		if ((e.target.getAttribute("href") && e.target.getAttribute("href") == "http://tieba.baidu.com") || (e.target.getAttribute("wdfield") && e.target.getAttribute("wdfield") == "kw")) {
			var jjue = e.target;
			var thisTop = getElementTop(jjue) + 15;
		} else if (e.target.id == "tieba_gogo"){
			var jjue = e.target;
			var thisTop = getElementTop(jjue) + 25;
		}else {
			var jjue = document.querySelector(".nav_item") || document.querySelector(".star_info>a") || document.getElementById("tab_home") || document.getElementsByClassName("card_title")[0] || document.getElementById("tab_forumname");
			var thisTop = getElementTop(jjue) + 30;
		}
		var thisLeft = getElementLeft(jjue);
		addStyle("#floatGogo{position:" + ((e.target.id == "tieba_gogo") ? "fixed" : "absolute") + "; left:" + thisLeft + "px; top:" + thisTop + "px}");
		var floatGogo = document.createElement("div");
		floatGogo.id = "floatGogo";
		var huuw = addByUser.deleteThe("贴吧例一").deleteThe("贴吧例二");
		var fTable = creaseTable(huuw.length);
		floatGogo.appendChild(fTable);
		if (huuw.length > 0) {
			for (vv = 0; vv < huuw.length; vv++) {
				var anch = document.createElement("a");
				anch.href = "http://tieba.baidu.com/f?kw=" + huuw[vv];
				anch.title = huuw[vv];
				anch.className = "gogo";
				anch.target = "_blank";
				anch.innerHTML = '<fon class="useColor">' + huuw[vv].reComLength() + '</fon>';
				Tds1[vv].appendChild(anch);
			}
		}
		floatGogo.addEventListener("mouseleave", closeGogoList, false)
		document.body.appendChild(floatGogo);
	}
}
function closeGogoList() {
	document.getElementById("floatGogo").parentNode.removeChild(document.getElementById("floatGogo"));
}
//吧名长度计算
String.prototype.reComLength = function () {
	var yn = 0;
	var kuu = "";
	for (w in this) {
		if (w < this.length) {
			if (/[a-zA-Z0-9]/.exec(this[w])) {
				yn += 1;
			} else {
				yn += 2;
			}
			if (yn < 13) {
				kuu += this[w];
			}
		}
	}
	var uui = yn > 15 ? kuu + "..." : this;
	return uui;
}
//数组中删除特定元素
Array.prototype.deleteThe = function (v) {
	var ra = [];
	for (w = 0; w < this.length; w++) {
		if (this[w] != v) {
			foo = ra.push(this[w]);
		}
	}
	return ra;
}
//数组中删除与另一数组重复的元素
Array.prototype.deleteRepeatWith = function (v) {
	var ra = [];
	for (w = 0; w < this.length; w++) {
		if (v.indexOf(this[w]) == -1) {
			foo = ra.push(this[w]);
		}
	}
	return ra;
}

var gogoDiv = document.createElement("div");
gogoDiv.innerHTML = "go";
gogoDiv.id = "tieba_gogo";
gogoDiv.addEventListener("mouseover", openGogoList, false);
if(window.location.href.match(/\/p\/|f\?ct=|f\?kz=/)){
	gogoDiv.addEventListener("click", function(){
		window.location = document.querySelector("#tofrs_up>a").href;
	}, false);
}
document.body.appendChild(gogoDiv);
if (document.location.href.indexOf("www.baidu.com") == -1) {
	var refresh = document.querySelector(".nav_item") || document.querySelector(".star_info>a") || document.getElementsByClassName("card_title_fname")[0] || document.getElementById("tab_home") || document.getElementById("tab_forumname") || document.getElementsByClassName("signrank_crown_tab_text")[0];
	refresh.addEventListener("mouseover", openGogoList, false);
}