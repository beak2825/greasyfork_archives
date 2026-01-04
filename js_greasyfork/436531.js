// ==UserScript==
// @name         搜索结果已点击效果，区别已点击链接
// @description  百度、必应、谷歌、搜狗、360搜索、F搜、无追搜索、国搜、Ecosia、Naver、Goobe、DuckDuckGo、Yahoo、Qwant、SearchEncrypt、Startpage、Disroot SearX、Lukol、MetaGer、mojeek 搜索结果页面，【增强已点击链接的对比度】 高亮区别分开，强调强化已点击。
// @namespace    https://github.com/CandyTek
// @version      1.3
// @license      GPL-3.0
// @author       CandyTek
// @homepageURL  https://greasyfork.org/zh-CN/scripts/436531
// @supportURL   https://greasyfork.org/zh-CN/scripts/436531/feedback
// @grant        GM_addStyle
// @include		 *://*.google.*/search*
// @match        *://*.baidu.com/s*
// @match        *://*.baidu.com/baidu?*
// @match        *://*.bing.com/s*
// @match        *://bing.com/s*
// @match        *://*.sogou.com/web*
// @match        *://sogou.com/web*
// @match        *://search.naver.com/s*
// @match        *://*.wuzhuiso.com/s*
// @match        *://goobe.io/search*
// @match        *://www.ecosia.org/s*
// @match        *://yandex.com/s*
// @match        *://*.yandex.com/s*
// @match        *://duckduckgo.com/?*
// @match        *://*.duckduckgo.com/?*
// @match        *://search.yahoo.com/*
// @match        *://search.yahoo.co.jp/*
// @match        *://*.so.com/s*
// @match        *://fsoufsou.com/s*
// @match        *://www.searchencrypt.com/s*
// @match        *://www.qwant.com/?*
// @match        *://mijisou.com/?*
// @match        *://www.startpage.com/s*
// @match        *://search.disroot.org/s*
// @match        *://metager.de/m*
// @match        *://metager.org/*
// @match        *://infinitysearch.co/r*
// @match        *://*.chinaso.com/*
// @match        *://www.lukol.com/s*
// @match        *://www.mojeek.com/s*
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJAYW5kcm9pZDpjb2xvci93aGl0ZSIgZD0iTTE1LjUgMTRoLS44bC0uMy0uM2MxLTEuMSAxLjYtMi42IDEuNi00LjJhNi41IDYuNSAwIDEgMC0yLjMgNWwuMy4ydi44bDUgNSAxLjUtMS41LTUtNXptLTYgMGE0LjUgNC41IDAgMSAxIDAtOSA0LjUgNC41IDAgMCAxIDAgOXoiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/436531/%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B7%B2%E7%82%B9%E5%87%BB%E6%95%88%E6%9E%9C%EF%BC%8C%E5%8C%BA%E5%88%AB%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/436531/%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B7%B2%E7%82%B9%E5%87%BB%E6%95%88%E6%9E%9C%EF%BC%8C%E5%8C%BA%E5%88%AB%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
	// █ 建议设置此脚本的运行时期为 document-start
	// 百度重新搜索内容时，会覆盖掉注入的javascript和css，具体的原因没搞懂
	// 使用【AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列】脚本解决这个问题
	// https://greasyfork.org/zh-TW/scripts/14178
	// you.com 弄不了，不知咋回事
	// backdata.net 弄不了，不知咋回事
	// gibiru.com 弄不了，不知咋回事
	// swisscows.com 弄不了，不知咋回事
	// search.becovi.com 弄不了，不知咋回事
	// Gigablast 上不去
	// lookao.com 上不去
	// onelive.fuyeor.com 上不去
	// █ 需要其他颜色的更改 #ffc6c6 颜色值即可
	const subColor = "#ffc6c6";
	const mainColor = "#f75656";

	const css1 = `
		a:visited{color: ${subColor} !important;}
		a:visited > div{color: ${subColor} !important;}
		a:visited > h3{color: ${subColor} !important;}
		a:visited > h2{color: ${subColor} !important;}
		a:visited > h3 > span{color: ${subColor} !important;}
		a:visited > span >mark{color: ${subColor} !important;}
		/* 搜索匹配中的关键词，区别于上面的颜色 */
		a:visited > strong{color: ${mainColor} !important;}
		a:visited > em{color: ${mainColor} !important;}
	`;
	GM_addStyle(css1);

	if(document.domain.includes("google")){
        GM_addStyle(`.ynAwRc{color:${subColor} !important}`);
    }else if(document.domain.includes("baidu")){
		// 调整顶栏高度
		// 某些结果会弹出的tag顶栏，也调整高度
		// 调整百度一下按钮高度
		// 调整输入框按钮高度
		// 调整顶栏右边区域 padd
		// 去掉右边区域的首页
		// 调整logo padd
		// 调整下面那个第三方脚本 注入的“自定义”按钮 padd
		// 调整顶栏下面的 那一栏(网页、图片...) padd
		// 调整第三方【AC-baidu】脚本的 自定义按钮
		// 调整第三方【AC-baidu】脚本的 自定义按钮
		// 调整热点热搜弹幕的高度，使其能显示更多条弹幕
		const css3 = `
			/* 顶栏 */
			#head {height:46px !important;}
			.s_form {height:46px !important;}
			/* 顶栏下tag栏 */
			#searchTag {
				top:49px !important;
				padding-top: 0px !important;
				padding-bottom: 3px !important;
			}
			/* 顶栏下搜索框 */
			.smart_input_wrapper #main-wrapper {
				margin: 1px 0 8px 18px !important;
			}
			#su {height:37px !important;}
			#form > span {height:34px !important;margin-top: 1px !important;}
			#kw {height:34px !important;}
			#form {margin-top:2px !important;}
			#u {margin-top:-9px !important;}
			.toindex {display:none !important;}
			#result_logo {margin-top:4px !important;}
			#myuser {margin-top:10px !important;}
			#s_tab {padding-top: 49px !important;}
			#myuser .myuserconfig:hover {color: #fff !important;}
			.myuserconfig {
				background: #0000 !important;
				color: #222 !important;
				font-weight: 400 !important;
				border: 0px !important;
				font-size: 13px !important;
				margin-top: 6.5px !important;
				box-shadow: none !important;
				font-family: Arial,sans-serif !important;
			}
			#danmakuContainer{height: 680px !important;}
		`

		// 不需要顶栏压扁的话，注释掉下面这行即可
		GM_addStyle(css3);
	}

})();