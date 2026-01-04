// ==UserScript==
// @name         『自用』微调网页合集
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  更改B站视频播放页面(tab)标题，更改B站播放控件大小，展开 AutoHotkey论坛帖子代码框，Material Design2去掉顶部悬浮推荐，重定向淘宝主页到购物车，移除 Github页面的CSK快捷键，百度bing翻译页面添加切换语言快捷键CtrlShiftS，CSDN vip文章高亮居中显示大字VIP文本，有道云笔记编辑器去除推广
// @author       CandyTek
// @homepageURL  https://greasyfork.org/zh-CN/scripts/460556
// @supportURL   https://greasyfork.org/zh-CN/scripts/460556/feedback
// @match        *://*.bilibili.com/list/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.bilibili.com/medialist/play/*
// @match        *://blog.csdn.net/*
// @match        *://*.autohotkey.com/boards/*
// @match        *://m2.material.io/*
// @match        *://taobao.com/
// @match        *://www.taobao.com/
// @match        *://github.com/*
// @match        *://*.github.com/*
// @match        *://fanyi.baidu.com/*
// @match        *://note.youdao.com/web/*
// @match        *://*.bing.com/translator*
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJAYW5kcm9pZDpjb2xvci93aGl0ZSI+PHBhdGggZD0ibTIxLjcgMTguMi01LjMtNS4zaC0xbC0yLjYgMi41djFsNS4zIDUuM2MuNC40IDEgLjQgMS40IDBsMi4yLTIuMWMuNC0uNC40LTEgMC0xLjR6Ii8+PHBhdGggZD0ibTE3LjMgMTAuMiAxLjQtMS40IDIuMiAyLjFhMyAzIDAgMCAwIDAtNC4yTDE3LjMgMyAxNiA0LjVWMS43bC0uNy0uNy0zLjUgMy41LjcuOGgyLjhsLTEuNCAxLjQgMSAxLTIuOCAzLTQuMi00LjJWNWwtMy0zTDIgNC44bDMgM2gxLjRsNC4yIDQuMS0uOS45SDcuNmwtNS4zIDUuM2ExIDEgMCAwIDAgMCAxLjRsMi4xIDIuMWMuNC40IDEgLjQgMS40IDBsNS4zLTUuM3YtMi4xTDE2LjMgOWwxIDF6Ii8+PC9nPjwvc3ZnPg==
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/460556/%E3%80%8E%E8%87%AA%E7%94%A8%E3%80%8F%E5%BE%AE%E8%B0%83%E7%BD%91%E9%A1%B5%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/460556/%E3%80%8E%E8%87%AA%E7%94%A8%E3%80%8F%E5%BE%AE%E8%B0%83%E7%BD%91%E9%A1%B5%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

// 获取用户输入的文本，是表示 true 还是 false
function getTrueOrFalse(name){
	return !(name==="不" || name==="否" || name==="0" || name==="false" || name==="no" || name==="not" || name==="不移除" || name==="非" || name==="f" || name==="nul" || name==="null" || name==="n");
}
// 获取用户脚本保存配置参数 true or false,并添加设置菜单
function GetPrefBoolean(prefTitle,prefKey,defaultValue){
	GM_registerMenuCommand(prefTitle, function() {
		const name = prompt("是否" + prefTitle + "？（true  false）", GM_getValue(prefKey,defaultValue)).toLowerCase();
		GM_setValue(prefKey,getTrueOrFalse(name));
		location.reload();
	});
	return GM_getValue(prefKey,defaultValue);
}

(function() {

const isNeedChangeBilibiliTitle = GetPrefBoolean("更改B站播放页面标题","pref_is_change_bilibili_title",false);
const isNeedChangeBilibiliPlayerSize = GetPrefBoolean("更改B站播放控件大小","pref_is_change_bilibili_player_size",false);
const isNeedTaobaoReplaceUrl = GetPrefBoolean("重定向淘宝至个人淘宝页面","pref_is_taobao_replace_url",true);
const isNeedShowCsdnVip = GetPrefBoolean("高亮显示CSDN vip文章","pref_show_csdn_vip",true);

// 匹配域名，并运行小脚本
const hostname = window.location.hostname;
if(hostname.includes("bilibili")){
	if(isNeedChangeBilibiliTitle){changeBilibiliVideoTitle();}
	if(isNeedChangeBilibiliPlayerSize){changeBilibiliVideoWidgetSize();}
}else if(hostname.includes("autohotkey")){
	// 强行展开AutoHotkey论坛帖子代码框
	GM_addStyle(`code.language-autohotkey{height: auto !important;}`);
}else if(hostname.includes("material")){
	// Material Design2 去掉顶部推荐，把顶栏压扁一些
	GM_addStyle(`mio-communication-banner{display: none !important;}header{height: 50px !important; }`);
}else if(hostname.includes("taobao")){
	// 重定向淘宝主页到个人淘宝页面
	if(isNeedTaobaoReplaceUrl){window.location.replace("https://cart.taobao.com/");}
}else if(hostname.includes("github")){
	githubRemoveHotkeyCSK()
}else if(hostname.includes("baidu")){
	baiduFanyi();
}else if(hostname.includes("bing")){
	bingFanyi();
}else if(hostname.includes("csdn")){
	if(isNeedShowCsdnVip){csdnHightlightVip();}
}else if(hostname.includes("note.youdao")){
	youdaoNoteRemoveAd();
}


/** 更改B站视频播放页面(tab)标题 */
function changeBilibiliVideoTitle() {
	// 摸鱼标题字符串数组
	const moyuTitleArr = [
		"Android 截屏实现的几种方式_android adb 截图_jun_tong的博客-CSDN博客",
		"Android Caused by: java.net.SocketException: Connection reset",
		"Android：获取 Resources$NotFoundException for abc_ic_ab_back_material - Stack Overflow",
		"android内存泄露：2、非静态的内部类错误使用_情形2_mkeyedtags in constraintlayout 泄漏_华哥折腾历险记的博客-CSDN博客",
		"android recyclerview滑动删除 android recyclerview item动画_clghxq的技术博客_51CTO博客"
	];

	// 随机获取数组中的一个值
	const randomIndex = Math.floor(Math.random() * moyuTitleArr.length);
	const randomTitle = moyuTitleArr[randomIndex];

	window.addEventListener('load', setMoyuTitle);
	setTimeout(setMoyuTitle, 2000);
	setTimeout(setMoyuTitle, 5000);
	setTimeout(setMoyuTitle, 10000);

	// 更改网页标题
	function setMoyuTitle(){
		document.title = randomTitle;
	}
}

/** 更改B站视频控件大小，强制1080px，（2K屏时使用） */
function changeBilibiliVideoWidgetSize() {
	const css1 = `
	@media screen and (min-width: 2000px) {
		div.text-info{display: none !important;}
		div.bili-header__bar.mini-header{padding-right: 120px !important;}

		div.bpx-player-video-area{
		max-width: 1920px !important;
		max-height: 1080px !important;
		}
		div.bpx-player-container{
		max-width: 1922px !important;
		}
	}
	`
	GM_addStyle(css1);
}

/** 移除所有 Github 页面的 Ctrl + Shift + K 快捷键占用 */
function githubRemoveHotkeyCSK() {
  document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'k') {
			event.stopImmediatePropagation();
        }
    }, true);
}

/** 百度翻译，添加语音掉转，快捷键 */
function baiduFanyi(){
	document.addEventListener("keydown", function(event) {
		if (event.ctrlKey && event.shiftKey && event.key === "S") {
			document.querySelector(".from-to-exchange").click();
		}
	});
}

/** Bing翻译，添加语音掉转，快捷键 */
function bingFanyi(){
	document.addEventListener("keydown", function(event) {
		if (event.ctrlKey && event.shiftKey && event.key === "S") {
			document.querySelector("#tta_revIcon").click();
		}
	});
}

/** 给网页添加悬浮中间，高亮元素 */
function addFloatingTipsView(text){
	const css1=`
		#floatingDiv {
		position: fixed;
		z-index: 1000;  /* 设置 z 轴高度为 1000 */
		height:0px;
		top:calc(50vh - 60px);       /* 距离顶部 40% 的位置，垂直居中 */
		left: 5%;      /* 距离左侧 40% 的位置，水平居中 */
		line-height:120px;
		font-size:120px;
		color:#888;
		}
	`
	// 添加高亮元素
	GM_addStyle(css1);
	var floatingDiv = document.createElement("a");
	floatingDiv.id = "floatingDiv";
	floatingDiv.innerText=text;
	document.body.appendChild(floatingDiv);
}

/** 在CSDN vip文章里，高亮显示VIP文本，提醒自己以免浪费浏览时间 */
function csdnHightlightVip() {
window.addEventListener('DOMContentLoaded', function() {
	var divElements2 = document.querySelectorAll('a.bt-subscribe-article');
	// 遍历匹配的元素并检查其文本内容
	divElements2.forEach(function(div) {
		if (div.textContent.trim() === "订阅专栏 解锁全文") {
			addFloatingTipsView("此文为专栏文章！");
			return;
		}
	});

	// 获取具有指定类名的 div 元素
	var divElements = document.querySelectorAll('.vip_article');
	// 遍历匹配的元素并检查其文本内容
	divElements.forEach(function(div) {
		if (div.textContent.trim() === "VIP文章") {
			addFloatingTipsView("此文为VIP文章！");
			return;
		}
	});
});
}

/** 有道云笔记，编辑器，去除推广 */
function youdaoNoteRemoveAd() {
window.addEventListener('DOMContentLoaded', function() {
	const css1 = `
	ad-component{display:none !important;}
	upgrade-v1-hint{display:none !important;}
	.list-bd.adList {top:72px !important;}
	.detail.adBar {margin-top:-36px !important;}
	`;
	GM_addStyle(css1);

});
}

})();