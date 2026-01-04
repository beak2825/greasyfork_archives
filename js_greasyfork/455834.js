// ==UserScript==
// @name         网页灰度调节器
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  网页灰度自由调节器,黑白转彩色,彩色转黑白,去掉灰色
// @author       小明
// @match        https://*/*
// @match        https://news.baidu.com/*
// @exclude      https://www.bilibili.com/*
// @exclude      https://www.iqiyi.com/*
// @exclude      https://www.youku.com/*
// @exclude      https://v.qq.com/*
// @icon         https://www.baidu.com/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/455834/%E7%BD%91%E9%A1%B5%E7%81%B0%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455834/%E7%BD%91%E9%A1%B5%E7%81%B0%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//window.isDebug = false;
	//info('---网页灰度调节器---')

	//001.判断灰度主题
	//is_gray_theme()

	//002.灰度主题
	//gray_theme()

	//003.非灰度主题
	un_gray_theme()
	//un_gray_theme_mini()//mini主题更节能

	//004.特殊网站专用
	//special_website()

})();

//----全局变量----start----
window.isDebug = false;
//----全局变量----end----

//----函数----start----
function is_gray_theme(){
	var flag = false
	if(document.body.style.filter.indexOf('grayscale') != -1){
		flag = true
	}
	if(document.getElementsByTagName('html')[0].style.filter.indexOf('grayscale') != -1){
		flag = true
	}
	info(flag?'网页采用gray主题':'网页没有采用gray主题')
}

function gray_theme(){
	if(document.body.style.filter){
		document.body.style.filter="grayscale(100%)"
	}
	if(document.getElementsByTagName('html')[0].style.filter){
		document.getElementsByTagName('html')[0].style.filter="grayscale(100%)"
	}
	if(document.getElementsByName('html')){
		GM_addStyle ( `
			html {
				filter:grayscale(1) !important;
				-webkit-filter:grayscale(1) !important;
			}
		` );
	}
}

function un_gray_theme(){
	if(document.body.style.filter){
		document.body.style.filter="grayscale(0)"
	}
	if(document.getElementsByTagName('html')[0].style.filter){
		document.getElementsByTagName('html')[0].style.filter="grayscale(0)"
	}
	if(document.getElementsByName('html')){
		GM_addStyle ( `
			html {
				filter:grayscale(0) !important;
				-webkit-filter:grayscale(0) !important;
			}
		` );
	}
}

function un_gray_theme_mini(){
	GM_addStyle ( `
		html {
			filter:grayscale(0) !important;
			-webkit-filter:grayscale(0) !important;
		}
	` );
}

function special_website(){
	var url = window.location.host;
	if(url.indexOf('baidu.com')){
		if(document.getElementsByTagName('body')[0].classList.contains('big-event-gray')){
			document.getElementsByTagName('body')[0].classList.remove('big-event-gray')
			document.getElementById('s_lg_img').src = document.getElementById('s_lg_img').src.replace('_gray','');
		}
	}
}


function info(str){
	if(window.isDebug){
		console.info(str);
	}
}

//----函数----end----