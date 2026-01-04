// ==UserScript==
// @icon          https://v.qq.com/favicon.ico
// @name         腾讯视频真实链接提取
// @namespace       http://www.lxzy.ml
// @supportURL      http://www.lxzy.ml/?p=453
// @version      2.2
// @note            2021.06.06 V1.0 初步实现播放器内右键并点击复制调试信息即可激活脚本弹出视频真实播放链接
// @note            2021.07.02 V1.1 临时修复在部分程序内剪贴板内不是视频链接的bug，改为点击复制调试信息自动重写页面并复制视频真实链接到剪贴板。同时新增点击播放器右侧标题跳转到详情页的功能（仅限腾讯视频）。
// @note            2022.06.18 v2.0 针对腾讯视频更新后的2021版播放器界面进行修改，调整了获取链接的逻辑。
// @note            2022.07.17 v2.1 bug修复
// @note            2022.11.22 v2.2 针对腾讯视频web端新版页面修复功能
// @description  在腾讯视频的视频播放页左上角生成解析按键，获取当前页面播放的清晰度的视频真实m3u8链接，请手动复制。
// @license         GPL-3.0-only
// @author       银河以北吾彦最美
// @match       https://v.qq.com/x/cover/*
// @match       https://v.qq.com/x/page/*
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427551/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427551/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

let download = document.createElement("button");
download.innerHTML = '<div style="border:2px solid rgb(204,204,204);background-color:rgb(43,137,234);height:40px;width:40px;border-radius:50%;line-height:40px;text-align:center;position:fixed;top:100px;left:20px;">链接</div>';
download.onclick = function() {
	try {
		var a = prompt(PLAYER._DownloadMonitor.context.dataset.title, PLAYER._DownloadMonitor.context.dataset.ckc ? PLAYER._DownloadMonitor.context.dataset.currentVideoUrl : PLAYER._DownloadMonitor.context.dataset.currentVideoUrl.replace(/:.*qq.com/g, "://defaultts.tc.qq.com/defaultts.tc.qq.com"));
	} catch (error) {
		var a = prompt(__PLAYER__.tvplayConfig.playTitle, __PLAYER__.currentVideoInfo.loadingUrl.replace(/:.*qq.com/g, "://defaultts.tc.qq.com/defaultts.tc.qq.com"));
	}
}
$(download)
	.insertBefore(".playlist-side__header-btn")