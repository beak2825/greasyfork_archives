// ==UserScript==
// @name        AtCoder 中文助手
// @namespace   Violentmonkey Scripts
// @match       https://atcoder.jp/contests/*/tasks/*
// @grant       none
// @license     MIT
// @version     3.3.1
// @author      Acfboy, psz2007
// @description 在英文题面前显示 AtCoder 中文题面。
// @downloadURL https://update.greasyfork.org/scripts/452449/AtCoder%20%E4%B8%AD%E6%96%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452449/AtCoder%20%E4%B8%AD%E6%96%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function readTextFile(file, ext, callback) {
	let xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/" + ext);
	xhr.open("GET", file, false);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4){
			callback(xhr.responseText, xhr.status);
		}
	}
	xhr.send();
}

function getPoints() {
	let cur = document.getElementsByClassName('lang-ja')[0].childNodes[1].innerHTML;
	if(cur.indexOf("配点") == -1){
		return "";
	}else{
		return cur.replace("配点", "分值").replace("点", "分");
	}
}

let url = window.location.href, contId = url.split('/')[4], probId = url.split('/')[6], traId = "",
	traList = [], failFlg = 0, notFoundFlg = 0, src = ""
	readTextFile("https://atcoder-for-chinese-developers.github.io/translations/list.json", "json", function(txt, stat){
	if(stat == 200){
		traList = JSON.parse(txt).data
	}else{
		alert("翻译列表加载失败")
		failFlg = 1
	}
})

if(!failFlg){
	if(!(contId in traList) || !(probId in traList[contId])){
		failFlg = notFoundFlg = 1
	}else{
		for(let i in traList[contId][probId]){
			traId = i
		}
		readTextFile("https://atcoder-for-chinese-developers.github.io/translations/" + contId + "." + probId + "." + traId + ".html", "html", function(txt, stat){
			if(stat == 200){
				src = txt
			}else{
				alert("翻译加载失败")
				failFlg = 1
			}
		})
	}
}

let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.innerText = 'function showChn() {\
	document.getElementsByClassName("lang-en")[0].style = "display: none";\
	document.getElementsByClassName("lang-ja")[0].style = "display: none";\
	document.getElementsByClassName("lang-cn")[0].style = "display: inline";\
}\
function showEng() {\
	document.getElementsByClassName("lang-en")[0].style = "display: inline";\
	document.getElementsByClassName("lang-ja")[0].style = "display: none";\
	document.getElementsByClassName("lang-cn")[0].style = "display: none";\
}\
function showJpn() {\
	document.getElementsByClassName("lang-en")[0].style = "display: none";\
	document.getElementsByClassName("lang-ja")[0].style = "display: inline";\
	document.getElementsByClassName("lang-cn")[0].style = "display: none";\
}'
document.getElementsByTagName('head')[0].appendChild(script);

let isOldCont = document.getElementById("task-statement").childElementCount > 1;

if(document.getElementById("task-statement").childNodes[1].getAttribute("id") != null){
	isOldCont = 1
	document.getElementById("task-statement").innerHTML = document.getElementById("task-statement").childNodes[1].innerHTML
}

if(isOldCont){
	document.getElementById("task-lang-btn").setAttribute("style","display: block;")
	document.getElementById("task-lang-btn").innerHTML=document.getElementById("task-lang-btn").innerHTML.replace(" / ", "")
	document.getElementById("task-lang-btn").innerHTML=document.getElementById("task-lang-btn").innerHTML.replace("<span data-lang=\"ja\">", "<span onclick=\"showJpn()\" data-lang=\"ja\">")
	document.getElementById("task-lang-btn").innerHTML=document.getElementById("task-lang-btn").innerHTML.replace("<span data-lang=\"en\">", "<span style=\"display: none;\" data-lang=\"en\">")
	let langSpan = document.createElement('span'),
		jaSta = document.getElementById("task-statement").innerHTML,
		jaSpan = document.createElement("span"),
		enSpan = document.createElement("span")
	enSpan.setAttribute("class", "lang-en")
	jaSpan.setAttribute("class", "lang-ja")
	jaSpan.setAttribute("style", "display: inline;")
	jaSpan.innerHTML = jaSta
	langSpan.setAttribute("class", "lang")
	langSpan.appendChild(jaSpan)
	langSpan.appendChild(enSpan)
	document.getElementById("task-statement").innerHTML="";
	document.getElementById("task-statement").appendChild(langSpan);
}

let allBtn = document.getElementById('task-lang-btn'), chnBtn = document.createElement('span');
chnBtn.setAttribute('data-lang', 'cn')
chnBtn.innerHTML = ' / <img src=\"//img.atcoder.jp/assets/flag/CN.png\">'
chnBtn.setAttribute('onclick', 'showChn()')
allBtn.appendChild(chnBtn)

let cnSpan = document.createElement('span')
cnSpan.setAttribute('class', 'lang-cn')

if(notFoundFlg){
	cnSpan.innerHTML = "暂无中文题面，欢迎<a href=\"https://github.com/atcoder-for-chinese-developers/atcoder-for-chinese\">贡献</a>！"
}else if(failFlg){
	cnSpan.innerHTML = "翻译加在过程中出现错误，请刷新界面并重试。"
}else{
	cnSpan.innerHTML = getPoints() + src;
}

document.getElementsByClassName('lang')[0].appendChild(cnSpan)
