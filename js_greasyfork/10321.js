// ==UserScript==
// @name        adjustColor2
// @namespace   http://chiebukuro.yahoo.co.jp/my/gbjyn273
// @author Syakku
// @description	convert colors to eye-friendly - webページの配色を目に優しく変更します (Flash対応)
// @include     *
// @version     2.0
// @run-at     document-start  
// @downloadURL https://update.greasyfork.org/scripts/10321/adjustColor2.user.js
// @updateURL https://update.greasyfork.org/scripts/10321/adjustColor2.meta.js
// ==/UserScript==

//	================≪ OPTION ≫================

//	----------------< white" & "black" color >----------------
var FILTER_COLOR_W = "rgb(234, 229, 227)";
var FILTER_COLOR_B = "rgb(41, 34, 29)";
var INNER_COLOR_W = "rgb(211, 203, 198)";
var INNER_COLOR_B = "rgb(41, 34, 29)";	//	gb is disabled

//	OPTION : apply to Flash object
var FLASH = true;

//	OPTION : skip <a> tag (link anchor)
//	OPTION : <a> タグ、つまりリンク文字列を処理から除外します
var A_SKIP = true;



// ################################################ //
// ################# オブジェクト #################### //
// ################################################ //
	
//	================ <色縮小オブジェクト ≫================
function RGBConv(w, b, pre_filter){
	this.w = w, this.b = b, this.pf = pre_filter;
	this.init();
}

// ----------------< 初期化 >----------------
RGBConv.prototype.init = function(){

	this.pr = (this.w[0] - this.b[0]) / 255;
	this.pg = (this.w[1] - this.b[1]) / 255;
	this.pb = (this.w[2] - this.b[2]) / 255;
	this.pr2 = this.b[0], this.pg2 = this.b[1], this.pb2 = this.b[2];
	
	// 先に計算
	this.ra = this.pf.r * this.pf.a;
	this.ga = this.pf.g * this.pf.a;
	this.ba = this.pf.b * this.pf.a;
	this.ia = 1 - this.pf.a;
	
	// 色変換の結果保持配列
	this.lBefore = [];
	this.lAfter = [];
	this.lCount = 0;
}

// ----------------< 色変換メソッド >----------------
RGBConv.prototype.conv = function(bg){
	//	処理する必要のないカラーは省く
	// （本スクリプトで処理後のカラーは大抵変な数字になっている）
	// （それを利用して簡易的ではあるが二重処理を防いでいる）
	for (var i=0; n<this.lCount; i++){
		if (bg === this.lAfter[i]) return;
	}
				
	//	既存のカラーは省エネ
	for (var i=0; i<this.lCount; i++){
		if (bg === this.lBefore[i]){
			tElm.style.color = this.lAfter[i];
			return;
		}
	}
	
	var ret = this.calc(bg);
	this.lBefore[lCount] = bg;
	this.lAfter[lCount] = ret;
	this.lCount++;
	return ret;
}

// ----------------< 計算メソッド >----------------
RGBConv.prototype.calc = function(bg){

	var col = rgbSplit(bg);
	
    var colR = col[0] * this.pr + this.pr2*1;
    var colG = col[1] * this.pg + this.pg2*1;
    var colB = col[2] * this.pb + this.pb2*1;
	
	// フィルターによる効果を考慮
	// filter.r + (colR - filter.r) / filter.ia と同義
	colR = Math.floor((colR - this.ra) / this.ia);
	colG = Math.floor((colG - this.ga) / this.ia);
	colB = Math.floor((colB - this.ba) / this.ia);

    if (typeof col[3] === "undefined") {
        return ("rgb(" + colR + ", " + colG + ", " + colB + ")");
    }
    return ("rgb(" + colR + ", " + colG + ", " + colB + ", " + col[3] + ")"); //	rgba
}
	

// ================≪ フィルタオブジェクト≫================
function RGBFilter(w, b){
	this.wr = w[0], this.wg = w[1], this.wb = w[2];
	this.br = b[0];
	this.r = 0, this.b = 0, this.g = 0, this.a = 0, this.str = 0;
	
	this.init();
}

// ----------------< 初期化 >----------------
RGBFilter.prototype.init = function(){
	
	with(this){
		// trをwr-0と100-wrの総計で割ってwrの取り分を決める
		r = (wr-br) / (255 - (wr-br)) * br + br;
		
		a = br / r;	// 中心値rが気をつけないと 0 や 255 になって 0 除算になる
		if (isNaN(a) === true) a = (wr-255) / (r-255);

		g = r - (wr-wg) / a;
		b = r - (wr-wb) / a;
		
		str = "rgba(" + Math.floor(r) + ", " + Math.floor(g) + ", " + Math.floor(b) + ", " + a + ")";
	}
}

// ----------------< フィルター適用 >----------------
RGBFilter.prototype.applyFilter = function(elm){
	
	var f = document.createElement("ac_filter");
	f.id = "adjustColor"; 
	
	with (f.style){
		backgroundColor = this.str;
		pointerEvents = "none";
		height = "100%";
		width = "100%";
		display = "block";
		position = "fixed";
		zIndex = "2147483647";
	}

	for (var i=0, len=elm.children.length; i<len; i++){
		if (elm.children[i].tagName !== "HEAD"){
			elm.insertBefore(f, elm.children[i]);
			break;
		} else if (i === len - 1){
			elm.insertBefore(f, null);
			break
		}
	}
}


// ================≪ フラッシュオブジェクト ≫================
function FlashObj(obj, type){
	this.obj = obj;
	this.type = type;
	this.init();
}

// ----------------< 初期化 >----------------
FlashObj.prototype.init = function(){
	
	if (this.type == "OBJECT"){
	
		this.name = "value";
		var params = this.obj.querySelector("param[name='wmode']");
		if (params){
			this.wmode = params;
		} else {
			// paramが存在しないとき用（動作未確認）
			var param = document.createElement("param");
			param.setAttribute("name", "wmode");
			this.obj.appendChild(param);
			this.wmode = param;
		}
	} else {
		
		this.name = "wmode";
		this.wmode = this.obj;
	}
}

// ----------------< 透過メソッド >----------------
FlashObj.prototype.trans = function(){

	this.wmode.setAttribute(this.name, "transparent");
	this.obj.src = this.obj.src;
	this.obj.data = this.obj.data;
}
	

	
// ################################################ //
// ################### メソッド ###################### //
// ################################################ //

// ================≪ 追加処理 ≫================
function afterTouch(){

	mo.observe(document.body, {childList: true, subtree: true});
	
	var elm;
	if (A_SKIP) elm = document.querySelector(":not(A)");
	else elm = document.getElementsByTagName("*");
	
	for (var i = 0; i < elm.length; i++) {

		var tElm = elm[i];
        var style = window.getComputedStyle(tElm, null);
		var fgColor = style.getPropertyValue("color");
		
		var tColor = conv.conv(fgColor);
		if (tColor) tElm.style.color = tColor;
	}
}


// ================≪ RGB値の分割 ≫================
function rgbSplit(col){
	var ret = col.match(/\d+/g);
	for (var i=0; i<ret.length; i++){
		ret[i]*=1;
	}
	return (ret);
}


// ==========≪ フラッシュにもフィルタを適用 ≫==========
function applyFlash(){

	for (var i=0, obj, objs=document.body.getElementsByTagName("object"); obj = objs[i]; i++){
		obj = new FlashObj(obj, "OBJECT");
		obj.trans();
	}
	
	for (var i=0, obj, objs=document.body.getElementsByTagName("embed"); obj = objs[i]; i++){
		obj = new FlashObj(obj, "EMBED");
		obj.trans();
	}
}



// ################################################ //
// ################### メイン処理 #################### //
// ################################################ //

// ----------------< フィルタ関連の初期化 >----------------
var fCw = rgbSplit(FILTER_COLOR_W);
var fCb = rgbSplit(FILTER_COLOR_B);
var iCw = rgbSplit(INNER_COLOR_W);
var iCb = rgbSplit(INNER_COLOR_B);

// インナーがフィルターを超えていたら修正
for (var i=0; i<3; i++){
	if (iCw[i] > fCw[i]) iCw[i] = fCw[i];
	if (iCb[i] < fCb[i]) iCb[i] = fCb[i];
}

var filter = new RGBFilter(fCw, fCb);
var conv = new RGBConv(iCw, iCb, filter);


// ================≪ 起動処理 ≫================
// iframeではフィルターはいらない
if (window === window.parent) {
	filter.applyFilter(document.getElementsByTagName("html")[0]);
}

window.addEventListener("DOMContentLoaded", afterTouch, false);

if (FLASH === true) {
	window.addEventListener("DOMContentLoaded", applyFlash, false);
}

var mo = new MutationObserver(function(rec){this.adjustColor(rec)});

// MOをオーバーライド、メモリ節約（？）
MutationObserver.prototype.adjustColor = function(rec){

	for (i=0; i<rec.length; i++){
		for (j=0; j<rec[i].addedNodes.length; j++){
			var node = rec[i].addedNodes[j];
			
			if (node.tagName == "OBJECT" || node.tagName == "EMBED"){
				var obj = new FlashObj(node, node.tagName);
				obj.trans();
				
			}
		}
	}
}
