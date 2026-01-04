// ==UserScript==
// @name         虎牙纯净观看
// @namespace    0
// @version      24.8.15
// @description  需自行添加直播间网址 示例:// @match https://www.huya.com/222523
// @author       mishi321
// @match        https://www.huya.com/222523
// @match        https://www.huya.com/loljiezou
// @match        https://www.huya.com/dank1ng
// @match        https://www.huya.com/116864
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503731/%E8%99%8E%E7%89%99%E7%BA%AF%E5%87%80%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503731/%E8%99%8E%E7%89%99%E7%BA%AF%E5%87%80%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(() => {
	const style = document.createElement("style");
	const 播放器左方边栏过滤 =
		".ssr-wrapper > :not(#duya-header):not(.main-wrap) {display: none !important;}";
	const 播放器上方广告过滤 = ".room-mod-ggTop {display: none !important;}";
	const 播放器上方赛事头图过滤 =
		"#main_col > :not(.main-room) {display: none !important;}";
	const 播放器上方赛事主播过滤 =
		".match-room > :not(.room-wrap) {display: none !important;}";
	const 播放器下方过滤 =
		".room-wrap > :not(.room-core) {display: none !important;}";
	const 播放器右方聊天栏过滤 =
		".room-core > :not(.room-core-l) {display: none !important;}";
	const 播放器上方主播信息过滤 =
		".room-core-l > :not(.room-player-wrap) {display: none !important;}";
	const 播放器下方礼物栏过滤 =
		"#videoContainer > :not(.player-wrap):not(#player-ctrl-wrap):not(#player-pc-watch-btn) {display: none !important;}";
	const 顶栏动态显示 =
		".duya-header-wrap.clearfix {visibility: hidden;} #duya-header:hover {.duya-header-wrap.clearfix {visibility: visible !important;}}";
	const 背景图片 =
		".main-room {background-image: none !important;} body {background-color: white !important;}";
	const 弹幕阴影字重 =
		".danmu-item span {text-shadow: none !important;font-weight: 600 !important;}";
	const 进直播间广告 = ".pre-ab-wrap {display: none !important;}";
	const 小窗播放位置调整 = ".player-top-right-btn {top: 50px !important;}";
	const 播放器控制栏 = "#player-ctrl-wrap {transition: none !important;}";
	const 播放器下方礼物栏占位 =
		".room-player-gift-placeholder {z-index: 100 !important; background-color: #f4f5f8 !important;}";
	const 播放器大小调整 =
		".main-wrap,.main-room {max-width: 1560px !important;margin: 0 auto !important;padding: 0 !important;} .room-core-l {margin: 0 !important;}";
	const 播放器左下方广告 = "#player-ext-wrap {display: none !important;}";
	style.innerHTML +=
		播放器左方边栏过滤 +
		播放器上方赛事头图过滤 +
		播放器上方赛事主播过滤 +
		播放器下方过滤 +
		播放器右方聊天栏过滤 +
		播放器上方主播信息过滤 +
		播放器下方礼物栏过滤 +
		顶栏动态显示 +
		背景图片 +
		弹幕阴影字重 +
		进直播间广告 +
		小窗播放位置调整 +
		播放器控制栏 +
		播放器下方礼物栏占位 +
		播放器大小调整 +
		播放器上方广告过滤 +
		播放器左下方广告;
	document.head.append(style);
	document.addEventListener("DOMContentLoaded", () => {
		document.title = document.getElementsByClassName("host-title")[0].title;
	});
})();
