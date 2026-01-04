// ==UserScript==
// @name         网页净化
// @namespace    Scripts
// @version      0.2.5
// @description  净化平时用到的网页, 去除广告, 布局调整, 支持多个网站净化, 长期更新, 有需要的网址可以反馈
// @author       xiaomu-dev
// @match        *://*/*
// @match        *://www.123pan.com/*
// @match        *://*.runoob.com/*
// @match        *://remeins.com/*
// @match        *://*.ahhhhfs.com/*
// @match        *://*.speedtest.cn/*
// @match        *://*.ghxi.com/*
// @match        *://*.alipansou.com/*
// @match        *://xiongdipan.com/*
// @match        *://pan.baidu.com/*
// @run-at document-start
// @license Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/481660/%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481660/%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 获取url
	var hostname = window.location.hostname;
	console.log('hostname', hostname);

	// 匹配url
	switch (hostname) {
		case 'www.123pan.com':
		case '123pan.com':
			purify_123pan();
			break;

		case 'c.runoob.com':
			purify_runoob();
			break;

		case 'remeins.com':
			purify_remeins();
			break;

		case 'www.ahhhhfs.com':
		case 'ahhhhfs.com':
			purify_ahhhhfs();
			break;

		case 'www.speedtest.cn':
		case '5g.speedtest.cn':
		case 'speedtest.cn':
			purify_speedtest();
			break;

		case 'www.ghxi.com':
			purify_ghxi();
			break;

		case 'www.alipansou.com':
		case 'xiongdipan.com':
			purify_alipansou();
			break;

		case 'pan.baidu.com':
			purify_baidupan();
			break;

		default:
			break;
	}

	purify_ZhiyiWangyeFanyi();

	// 网页净化
	function purify_ZhiyiWangyeFanyi() {
		const css = `
			.xykj-toolbar,#xykj-chat-page,#xykj-chat-history{display:none !important}
		`;
		insertStyle(css);
		log('已净化智译插件的悬浮框');
	}
	function purify_baidupan() {
		const css = `
			.wp-s-header .nd-chat-ai-btn,.wp-s-header .nd-game-entry,.wp-s-header .nd-sug-ad-item,.wp-s-header .nd-vip-btn,.wp-s-header .chat-with-sug,#mainContainer .chat-with-sug,#mainContainer .header-container__chatpdf-open,.yike-entrance{display:none !important}
		`;
		insertStyle(css);
		log('已净化百度网盘');
	}
	function purify_alipansou() {
		const css = `
			.google-auto-placed,#app > div:last-child > div:first-child > div:first-child > div:nth-child(2){display:none !important}
		`;
		insertStyle(css);
		log('已净化猫狸盘搜 | 兄弟盘');
	}
	function purify_ghxi() {
		const css = `
			#modules-13,#modules-15,#modules-16,#modules-20,#modules-23,#modules-24,#modules-25,#modules-26,.sidebar.sidebar-on-right .widget_image_ad,.sidebar.sidebar-on-right .widget_comments,footer,.entry-related-posts,.wpcom_ad_wrap,.sidebar .widget_comments,.sidebar .widget_post_thumb,.sidebar .widget_html_ad,.webcopyMask + div:not([class]),.webcopyMask + #login-modal + div:not([class]){display:none !important}
		`;
		insertStyle(css);
		log('已净化果核剥壳');
	}
	function purify_123pan() {
		const css = `
			.mfy-main-layout__head{display:none !important}.baidu-banner-container{display:none !important}.baidu-banner-container + div{display:none !important}.site-layout-background{padding:20px !important}.ant-table-body{max-height:calc(100vh - 220px) !important}.banner-container-pc{display:none !important}.contentBorder{height:calc(100vh - 100px) !important}.activity-box{display:none !important}.sider-member-btn{display:none !important}.webbody.svip-body{background:none !important;pointer-events:none !important}.bg_svip_block_ads{display:none !important}.webbody.svip-body{pointer-events:none !important}.webbody.svip-body .sharheader,.webbody.svip-body .contentBorder{pointer-events:auto !important}.hombody{height:100% !important}
		`;
		insertStyle(css);
		log('已净化123网盘');
	}
	function purify_runoob() {
		const css = `
			.runoob-page-content ~ div.row{display:none !important}
		`;
		insertStyle(css);
		log('已净化菜鸟工具');
	}
	function purify_remeins() {
		const css = `
			.toolslove,.baseinfo,.google-auto-placed,.qpage > div.start.p0.vmxform:first-of-type,.wwads-cn.wwads-horizontal{display:none !important}
		`;
		insertStyle(css);
		log('已净化记灵工具');
	}
	function purify_ahhhhfs() {
		const js = `
			const url=window.location.href;console.log(url);const hasGV=url.includes('#google_vignette');if(hasGV){console.log('包含 #google_vignette');const dismissButton=document.getElementById('dismiss-button');if(dismissButton){console.log(dismissButton)}else{console.log('未找到 dismiss-button 元素')}}const elements=document.getElementsByClassName('.adsbygoogle.adsbygoogle-noablate');if(elements.length>0){console.log(elements);elements.remove()}else{console.log('未找到指定的元素')}
		`;
		insertJS(js);

		const css = `
			.adsbygoogle.adsbygoogle-noablate,#ri_home_slider_widget-2,.site-addswarp{display:none !important;z-index:-9999 !important}.rollbar .actions li:nth-last-child(2),.rollbar .actions li:last-child{display:none !important}
		`;
		insertStyle(css);
		log('已净化A姐分享站');
	}
	function purify_speedtest() {
		const css = `
			.speed-twoads481-wrap.speed-twoads481-wrap-index,.speed-home-content .vertisingSpace,.speed-home-content .speed-bottom-ads,#speedApp,#Video,#Video + .swiper-view,#Network,.contentMinHeight.section_wrap .container,.contentMinHeight.section_wrap .speed-twoads-wrap,footer,.sus-window,.nav-item.jiasu2_nav,.nav-item.mall_nav{display:none !important}.pingContainer .tool-content-left,.pingContainer .tool-content-right{display:none !important}.speed-twoads481-wrap,.tools .tools-content-box .right-ads,.tools .more-tools-list-index,.tools .download{display:none !important}.header .box .tab,.rank.rank-5g .ad-w300-h250-index,.rank.rank-5g .ad-w300-h250-other,#Information,#Information + .wgcard,#Information + .wgcard + a,#Equipment,#Equipment + .equipment-content{display:none !important}
		`;
		insertStyle(css);
		log('已净化测速网');
	}

	// 打印
	function log(log) {
		const info = '\n'.concat(' %c ', '小木').concat(' %c ', log, '  \n');
		const css1 = 'background: #000000; padding:5px 0; border-radius: 3px 0 0 3px; color: #fff';
		const css2 = 'background: #f7971d; padding:5px 0; border-radius: 0 3px 3px 0; color: #000';
		console.log(info, css1, css2);
	}
	// 插入样式
	function insertStyle(css) {
		let style = document.createElement('style');
		style.innerHTML = css;
		document.head.appendChild(style);
	}
	// 插入js
	function insertJS(js) {
		const script = document.createElement('script');
		script.text = 'window.addEventListener("load", (event) => {';
		script.text += js;
		script.text += '});';
		document.head.appendChild(script);
	}
})();
