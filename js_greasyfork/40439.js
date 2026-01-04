// ==UserScript==
// @name        優化動畫瘋彈幕
// @version     1.1.7.20
// @description         原作者：hbl91707（深海異音）
// @author       i9602097
// @include     https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant       none
// @namespace https://greasyfork.org/users/106880
// @downloadURL https://update.greasyfork.org/scripts/40439/%E5%84%AA%E5%8C%96%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/40439/%E5%84%AA%E5%8C%96%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95.meta.js
// ==/UserScript==
//▼▼▼這裡的設定可以修改▼▼▼
var int_刷新頻率 = 30; //預設每30毫秒刷新一次彈幕界面（相當於1秒33幀
var int_彈幕陰影程度 = 12; //陰影模糊程度（可能消耗一點點CPU運算）
var s_文字字重 = "400"; //文字的字重
var s_文字字體 = "\'Roboto\', \'Roboto Condensed\', \'Roboto Slab\', \'Roboto Mono\', \'Noto Sans JP\', \'Noto Sans Japanese\', \'Noto Sans TC\', \'Noto Sans SC\', \'Noto Sans KR\', \'Lucida Sans Unicode\', customFont, sans-serif, Simhei, Simsun, Heiti, \"wqy-zenhei\", \"MS Mincho\", \"Meiryo\", \"Microsoft Yahei\", monospace"; //文字的字體
var bool_過濾單一符號的彈幕 = 0; //1=啟動、0=關閉。例如【%%%%%】、【！！！】、【噓噓噓】就會被過濾
var bool_自動透明度 = 1; //1=啟動、0=關閉。
var bool_showFPS = 0; //1=啟動、0=關閉。
var int_過濾過短的彈幕 = 0; //【字數】小於等於 這個數字的彈幕就會被過濾。不想用的話就改成【0】
var ar_filter = new Array(); //過濾出現這些文字的彈幕，要新增就在下面多一行【ar_filter.push("你要的文字");】，英文不區分大小寫
//▲▲▲這裡的設定可以修改▲▲▲
var cssLink = new Array();
cssLink.push('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto+Mono:100,100i,300,300i,400,400i,500,500i,700,700i|Roboto+Slab:100,300,400,700|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese');
cssLink.push('//fonts.googleapis.com/earlyaccess/notosansjp.css');
cssLink.push('//fonts.googleapis.com/earlyaccess/notosansjapanese.css');
cssLink.push('//fonts.googleapis.com/earlyaccess/notosanstc.css');
cssLink.push('//fonts.googleapis.com/earlyaccess/notosanssc.css');
cssLink.push('//fonts.googleapis.com/earlyaccess/notosanskr.css');
var DOMLink = new Array(cssLink.length);
for (var i = 0; i < DOMLink.length; i++) {
	DOMLink[i] = document.createElement('link');
	DOMLink[i].rel = 'stylesheet';
	DOMLink[i].href = cssLink[i];
	document.getElementsByTagName('head')[0].appendChild(DOMLink[i]);
}
//----------------------------------
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, int_刷新頻率); //30毫秒後重新執行
		};
})();
//判斷之前全部轉成大寫
for (var i = 0; i < ar_filter.length; i++) {
	ar_filter[i] = ar_filter[i].toLowerCase();
}
var obj_can;
var ofs_can;
var NoD = 0;
var fps = 0;
var dom_fps;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
new MutationObserver(function(records) {
	if (document.getElementsByClassName("vjs-danmu")[0] && !document.getElementById("ani_video").querySelector('canvas')) {
		//console.log('make canvas');
		fun_creat_canvas();
		this.disconnect();
	}
}).observe(document.querySelector('#video-container'), {
	'childList': true,
	'subtree': true
});
///
///判斷字串是否每一個字都相同
///
function fun_allSame(str) {
	if (str.length <= 1) {
		return false;
	}
	let ar_str = str.split(""); //切割字串
	for (let i = 1; i < ar_str.length; i++) {
		if (ar_str[i] != ar_str[0]) {
			return false;
		}
	}
	return true;
}
///
///產生canvas
///
function fun_creat_canvas() {
	let vjs = document.getElementsByClassName("vjs-danmu")[0];
	//產生canvas
	obj_can = document.createElement("canvas");
	ofs_can = document.createElement("canvas");
	dom_fps = document.createElement("div");
	var DPR = window.devicePixelRatio || 1;
	var BSR = obj_can.getContext("2d").webkitBackingStorePixelRatio || obj_can.getContext("2d").mozBackingStorePixelRatio || obj_can.getContext("2d").msBackingStorePixelRatio || obj_can.getContext("2d").oBackingStorePixelRatio || obj_can.getContext("2d").backingStorePixelRatio || 1;
	//obj_can.style.backgroundColor = "rgba(0,0,0,0.4)";
	obj_can.style.pointerEvents = "none"; //禁止點擊
	obj_can.style.position = "absolute"; //設定位置
	obj_can.style.left = "0px";
	obj_can.style.top = "0px";
	dom_fps.style.cssText = 'white-space: nowrap; padding: 3px 0 0 0; margin: 0; line-height: 100%; text-decoration: none; color: #f00; letter-spacing: 0; font-size: 25px; position: absolute; word-break: none; text-wrap: none; border: 0 !important; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; text-size-adjust: none; pointer-events: none; user-select: none; left: 1px; top: 1px; font-family: ' + s_文字字體 + '; font-weight: ' + s_文字字重 + '; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, -1px -1px black, -1px 1px black, 1px 1px black, 1px -1px black, 0 0 12px black;';
	//產生style（避免原本的彈幕消耗記憶體，所以隱藏起來
	let obj_style = document.createElement("style");
	obj_style.innerHTML = ".cmt{position:static !important; display:inline!important; opacity:0!important;} .cmt_none{display:none!important;} ";
	//插入
	var ani_video = document.getElementById("ani_video");
	//var ani_video = document.getElementsByClassName("player")[0];
	ani_video.appendChild(obj_can);
	ani_video.appendChild(obj_style);
	if (bool_showFPS) ani_video.appendChild(dom_fps);
	setInterval(showFPS, 1000);
	fun_div_to_canvas();
	if ('ResizeObserver' in self) {
		new ResizeObserver(fun_auto_size).observe(document.getElementsByClassName("vjs-danmu")[0]);
	} else {
		setInterval(fun_auto_size, 1500);
	}
	fun_auto_size();
	let DanmuOpacityRange = document.getElementsByClassName("DanmuOpacityRange");
	for (let i = 0; i < DanmuOpacityRange.length; i++) {
		DanmuOpacityRange[i].addEventListener("input", function() {
			fun_set_opacity(DanmuOpacityRange[i].value, bool_自動透明度 ? mathOpacity(NoD) : 1);
		});
		DanmuOpacityRange[i].addEventListener("change", function() {
			fun_set_opacity(DanmuOpacityRange[i].value, bool_自動透明度 ? mathOpacity(NoD) : 1);
		});
	}
	fun_set_opacity(document.getElementsByClassName("DanmuOpacityRange")[0].value, bool_自動透明度 ? mathOpacity(NoD) : 1);
}
///
///調整canvas的大小
///
function fun_auto_size() {
	let vjs = document.getElementsByClassName("vjs-danmu")[0];
	DPR = window.devicePixelRatio || 1;
	BSR = obj_can.getContext("2d").webkitBackingStorePixelRatio || obj_can.getContext("2d").mozBackingStorePixelRatio || obj_can.getContext("2d").msBackingStorePixelRatio || obj_can.getContext("2d").oBackingStorePixelRatio || obj_can.getContext("2d").backingStorePixelRatio || 1;
	if (obj_can.width != vjs.clientWidth * DPR / BSR) {
		ofs_can.width = vjs.clientWidth * DPR / BSR;
		ofs_can.height = vjs.clientHeight * DPR / BSR;
		obj_can.width = vjs.clientWidth * DPR / BSR;
		obj_can.height = vjs.clientHeight * DPR / BSR;
		obj_can.style.width = vjs.clientWidth + 'px';
		obj_can.style.height = vjs.clientHeight + 'px';
	}
}
///
///調整canvas的透明度
///
function mathOpacity(t) {
	return Math.tanh((0 - 50) / 25) / Math.PI * .8 - Math.tanh((t - 50) / 25) / Math.PI * .8 + 1;
}

function fun_set_opacity(value, AutoOpacity) {
	//console.log(value);
	//console.log(AutoOpacity);
	//根據動畫瘋本身的設定來調整透明度
	if (document.getElementById("DanmuOpacityNum") === undefined) {
		obj_can.style.opacity = AutoOpacity;
	} else {
		obj_can.style.opacity = Number(value) / 100 * AutoOpacity;
	}
}

function showFPS() {
	if (bool_showFPS) dom_fps.innerHTML = 'fps:' + fps;
	fps = 0;
}
///
///將DIV彈幕轉成canvas來繪製
///
function fun_div_to_canvas() {
	let ar_tt = document.getElementsByClassName("cmt"); //取得所有彈幕
	var count = 0;
	for (let i = 0; i < ar_tt.length; i++) {
		ar_tt[i].className = "cmt_none cmt"; //隱藏
		if (ar_tt[i].getAttribute("style").indexOf("opacity") > -1) { //如果opacity是0，就是在動畫瘋屬於隱藏的彈幕
			if (Number(ar_tt[i].style.opacity) === 0)
				continue;
		}
		let cmt_t = ar_tt[i].innerHTML.replace(/&gt;/g, ">").replace(/&lt;/g, "<")
			.replace(/&amp;/g, "&").replace(/&quot;/g, '"')
			.replace(/&apos;/g, "'").replace(/<br>/g, " ")
			.replace(/&nbsp;/g, " "); //文字內容
		if (ar_tt[i].getAttribute("text_allow") != "true") { //判斷過的句子就不再判斷第二次
			//過濾相同符號的留言（例如【！！！】、【%%%】
			if (bool_過濾單一符號的彈幕 > 0) {
				if (fun_allSame(cmt_t)) {
					ar_tt[i].style.opacity = "0"; //隱藏
					ar_tt[i].innerHTML = "";
					continue;
				}
			}
			//彈幕小於等於這個長度就會被過濾
			if (cmt_t.length <= int_過濾過短的彈幕) {
				ar_tt[i].style.opacity = "0"; //隱藏
				ar_tt[i].innerHTML = "";
				continue;
			}
			//過濾包含特定關鍵字的彈幕
			let bool_delete = false; //避免閃爍
			for (let j = 0; j < ar_filter.length; j++) {
				if (cmt_t.toLowerCase().indexOf(ar_filter[j]) > -1) {
					ar_tt[i].style.opacity = "0"; //隱藏
					ar_tt[i].innerHTML = "";
					bool_delete = true;
					break;
				}
			}
			if (bool_delete) {
				continue;
			}
			ar_tt[i].setAttribute("text_allow", "true");
		} //if
		let cmt_color = ar_tt[i].style.color; //文字顏色
		let cmt_fontSize = Number(ar_tt[i].style.fontSize.replace("px", "")); //文字size
		let cmt_x = Number(ar_tt[i].style.left.replace("px", "")); //left
		let cmt_y = 0; //top
		if (ar_tt[i].style.bottom.length > 1) { //【靠下】
			cmt_y = 0 - Number(ar_tt[i].style.bottom.replace("px", ""));
		} else { //【滾動】或【靠上】
			cmt_y = Number(ar_tt[i].style.top.replace("px", ""));
		}
		ofs_can.getContext("2d").textBaseline = (ar_tt[i].style.bottom.length > 1) ? "bottom" : "top";
		ofs_can.getContext("2d").font = s_文字字重 + " " + cmt_fontSize * DPR / BSR + "px " + s_文字字體;
		ofs_can.getContext("2d").lineWidth = 2 * DPR / BSR;
		ofs_can.getContext("2d").lineCap = 'round';
		ofs_can.getContext("2d").lineJoin = 'round';
		ofs_can.getContext("2d").strokeStyle = "black"; //陰影顏色
		ofs_can.getContext("2d").fillStyle = cmt_color; //文字顏色
		if (!ar_tt[i].can || ar_tt[i].can.height != ofs_can.height + 2 * int_彈幕陰影程度 * DPR / BSR) {
			//console.log(cmt_t);
			//console.log(ofs_can.getContext("2d").measureText(cmt_t));
			ar_tt[i].can = document.createElement("canvas");
			ar_tt[i].can.width = ofs_can.getContext("2d").measureText(cmt_t).width + 2 * int_彈幕陰影程度 * DPR / BSR;
			ar_tt[i].can.height = ofs_can.height + 2 * int_彈幕陰影程度 * DPR / BSR;
			ar_tt[i].can.getContext("2d").textBaseline = (ar_tt[i].style.bottom.length > 1) ? "bottom" : "top";
			ar_tt[i].can.getContext("2d").font = s_文字字重 + " " + cmt_fontSize * DPR / BSR + "px " + s_文字字體;
			ar_tt[i].can.getContext("2d").lineWidth = 2 * DPR / BSR;
			ar_tt[i].can.getContext("2d").lineCap = 'round';
			ar_tt[i].can.getContext("2d").lineJoin = 'round';
			ar_tt[i].can.getContext("2d").strokeStyle = "black"; //陰影顏色
			ar_tt[i].can.getContext("2d").fillStyle = cmt_color; //文字顏色
			ar_tt[i].can.getContext("2d").save();
			ar_tt[i].can.getContext("2d").shadowBlur = int_彈幕陰影程度 * DPR / BSR;
			ar_tt[i].can.getContext("2d").shadowColor = "black"; //陰影顏色
			ar_tt[i].can.getContext("2d").fillText(cmt_t, int_彈幕陰影程度 * DPR / BSR, (ar_tt[i].style.bottom.length > 1) ? ar_tt[i].can.height - int_彈幕陰影程度 * DPR / BSR : int_彈幕陰影程度 * DPR / BSR); //先繪製陰影
			ar_tt[i].can.getContext("2d").restore();
			ar_tt[i].can.getContext("2d").strokeText(cmt_t, int_彈幕陰影程度 * DPR / BSR, (ar_tt[i].style.bottom.length > 1) ? ar_tt[i].can.height - int_彈幕陰影程度 * DPR / BSR : int_彈幕陰影程度 * DPR / BSR);
			ar_tt[i].can.getContext("2d").fillText(cmt_t, int_彈幕陰影程度 * DPR / BSR, (ar_tt[i].style.bottom.length > 1) ? ar_tt[i].can.height - int_彈幕陰影程度 * DPR / BSR : int_彈幕陰影程度 * DPR / BSR); //繪製文字
		}
		ofs_can.getContext("2d").drawImage(ar_tt[i].can, cmt_x * DPR / BSR - int_彈幕陰影程度 * DPR / BSR, cmt_y * DPR / BSR - int_彈幕陰影程度 * DPR / BSR);
		count++;
	}
	//obj_can.getContext("2d").clearRect(0, 0, obj_can.width, obj_can.height); //清除上次的繪圖結果
	obj_can.width = obj_can.width; //清除上次的繪圖結果
	obj_can.getContext("2d").drawImage(ofs_can, 0, 0);
	//ofs_can.getContext("2d").clearRect(0, 0, ofs_can.width, ofs_can.height); //清除上次的繪圖結果
	ofs_can.width = ofs_can.width; //清除上次的繪圖結果
	if (bool_自動透明度 && count != NoD) fun_set_opacity(document.getElementsByClassName("DanmuOpacityRange")[0].value, mathOpacity(count));
	NoD = count;
	fps++;
	requestAnimationFrame(function() {
		fun_div_to_canvas();
	});
}