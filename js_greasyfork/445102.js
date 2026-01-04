// ==UserScript==
// @name         去除B站评分和部分广告
// @version      1.0.1
// @namespace    https://www.九条可怜.cn
// @author       九条可怜
// @description  初衷是为了寻番的时候不会被评分给影响到自己的判断
// @match        *://m.v.qq.com/*
// @match        *://v.qq.com/*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.bilibili.com/*
// @match        *://www.bilibili.com/read/mobile*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://j.wolfimg.cloud/favicon.ico
// @run-at       document-body
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/445102/%E5%8E%BB%E9%99%A4B%E7%AB%99%E8%AF%84%E5%88%86%E5%92%8C%E9%83%A8%E5%88%86%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445102/%E5%8E%BB%E9%99%A4B%E7%AB%99%E8%AF%84%E5%88%86%E5%92%8C%E9%83%A8%E5%88%86%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
	/**
	 * 规则列表
	 * @type {name/url/items}
	 */
	var websites = [
		{
			url: "bilibili.com",//B站
			items: [
				".media-rating",//去除评分
                ".score.media-card-content-footer-score",//去除搜索评分
                ".activity-m.report-wrap-module.report-scroll-module.act-end",//关闭视频底部活动信息
                ".ad-report.ad-floor.report-wrap-module.report-scroll-module",//关闭推荐视频列表下活动广告
                ".pop-live.report-wrap-module.report-scroll-module",//关闭推荐直播
                ".ad-report.report-wrap-module.report-scroll-module",//关闭侧面广告
				".review-module.report-wrap-module.report-scroll-module",//关闭点评框架
                ".pay-bar.report-wrap-module",//关闭大会员提醒
                ".channel-floor.bili-grid",//关闭推广
			],
		},
        {
			url: "v.qq.com",//腾讯
			items: [
				".site_board_ads_top_mask",//去除界面广告
			],
		},
        {
			url: "www.iqiyi.com",//爱奇艺
			items: [
				".pl__1",//去除界面广告
                ".qy-popup-box",//提示登录
                ".ad-tl"//界面广告
			],
		},
		{
			name: "CSDN",
			url: "csdn.net",
			items: [
				".weixin-shadowbox",//下载弹窗
				".feed-Sign-span",//悬浮按钮:APP内打开+登录/打开注册(主页
				"#csdn-highschool-window",//PC端:弹窗:学生认证
				".passport-login-container",//PC端:弹窗:登录账号
			],
		},
	];

	/**
	 * 主体部分
	 */
	for (website of websites) {
		if (location.href.indexOf(website.url) != -1) {
			//修复移动版页面不允许滑动
			if (website.overflow) {
				var css = document.createElement("style");
				css.innerText = "body{overflow: unset !important}";
				document.head.appendChild(css);
			}
			//隐藏/拦截骚扰元素
			for (var item of website.items) {
				var css = document.createElement("style");
				css.innerText += item + "{display: none !important}";
				document.head.appendChild(css);
			}
		}
	}
})();
