// ==UserScript==
// @name          哔哩哔哩（bilibili.com）清爽版
// @namespace     https://greasyfork.org/zh-CN/scripts/369893
// @description	  碍眼的东西太多了，干脆都去掉。
// @author        Kenneth4 (Modified by mccally)
// @icon          http://static.hdslb.com/images/favicon.ico
// @homepage      https://userstyles.org/styles/102179
// @run-at        document-start
// @match         https://*.bilibili.com/*
// @version       1.01+v5
// @downloadURL https://update.greasyfork.org/scripts/370118/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E6%B8%85%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/370118/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E6%B8%85%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (new RegExp("^(http|https)://(www|bangumi).bilibili.com/.*$")).test(document.location.href))
	css += [
		"/* template 1 */",
		".z-top-container { height: 42px !important; }",
		".z_top { box-shadow: 0 1px 0 rgba(0, 0, 0, .1); }",
		".z_top .z_top_nav ul li:not(.home) { display: none !important }",
		".z_top .z_top_nav ul li.home { background-position: -910px -74px !important; }",
		".z_top .z_top_nav ul li span { color: #fff !important }",
		".z-top-container .header .search { position: relative !important; margin-top: 23px !important; margin-left: 40px; z-index: 10001 !important; }",
		".z-top-container .header .search { background: none !important; padding: 1px 2px 1px 72px !important; border: 1px solid rgba(0, 0, 0, .1) !important; }",
		".z-top-container .header .search .link-ranking { top: 0 !important; height: 34px !important; border-right: 1px solid rgba(0, 0, 0, .1) !important; border-radius: 0 !important; }",
		".z_top.b-header-blur.b-header-blur-black .z_top_nav li a.i-link, .z_top.b-header-blur.b-header-blur-black .uns_box li.u-i a.i-link { color:#222; }",
		"",
		"/* template 2 */",
		".header { height: 42px !important; background: none !important; }",
		"a.header-link,",
		".header .h-center { height: 42px !important; }",
		".header-layer,",
		".header-link { display: none !important; }",
		".z_top .z_header,",
		".z_top_container,",
		".header .h-center,",
		".header { position: static !important; }",
		".uns_box li.u-i.b-post { z-index: 10000 !important; }",
		".header .num .search { top: -39px !important; left: 50px; z-index: 10002 !important; }",
		".header + .main-inner { padding-top: 50px !important; }",
		".header + .b-page-body { margin-top: 70px !important; }",
		"#primary_menu,",
		".cinema-home-crumb { clear: both !important; }",
		"div[class^=\"cinema\"] { margin-top: 70px !important; }",
		"#channel-app + #app > #primary_menu { top: -10px !important; }",
		".header .num .search { background: none !important; padding: 1px 2px 1px 72px !important; border: 1px solid rgba(0, 0, 0, .1) !important; }",
		".header .num .search .link-ranking { top: 0 !important; height: 34px !important; border-right: 1px solid rgba(0, 0, 0, .1) !important; border-radius: 0 !important; }",
		"",
		"/* template 3 */",
		".bili-header-m .nav-menu { border-bottom: 1px solid rgba(0, 0, 0, .1); }",
		".primary-menu .nav-menu{ border-bottom: none !important; }",
		".bili-header-m ul.nav-menu { padding-bottom: 6px !important; }",
		".bili-header-m .head-banner { background: none !important; }",
		".bili-header-m .nav-menu .blur-bg,",
		".bili-header-m .head-banner .banner-link,",
		".bili-header-m .head-banner .head-content .head-logo,",
		".bili-header-m .nav-menu .nav-mask { display: none !important; }",
		".bili-header-m .head-banner,",
		".bili-header-m .head-banner .head-content { height: 42px !important; }",
		".bili-header-m .head-banner { position: static !important; }",
		".bili-header-m .nav-menu.blur-black .nav-con .nav-item .t { color: #222 !important; }",
		".bili-wrapper .nav-con.fl ul li:not(.home) { display: none !important }",
		".bili-wrapper .nav-con.fl ul li a { text-indent: -9999px; }",
		".bili-wrapper .nav-con.fl ul li.home a i { height: 16px !important; margin: 1px 0 0 !important; background-position: -920px -87px !important;  }",
		".bili-header-m { position: static !important; z-index: -1 !important; }",
		".popularize-module .online { margin-top: -48px !important; z-index: 100 !important; position: relative !important }",
		".popularize-module { position: relative !important; }",
		".head-content .search { top: 3px !important; left: 50px; z-index: 10002 !important; }",
		".head-content .search { background: none !important; padding: 1px 2px 1px 72px !important; border: 1px solid rgba(0, 0, 0, .1) !important; }",
		".head-content .search .link-ranking { top: 0 !important; height: 34px !important; border-right: 1px solid rgba(0, 0, 0, .1) !important; border-radius: 0 !important; }",
		"#app .bili-wrapper { margin-top: 0px !important; }",
		"",
		"/* hidden */",
		"#ad_top_extra,",
		".elecrank-wrapper,",
		".video-toolbar-module { visibility: hidden !important; height: 0 !important; }",
		".bangumi-header .header-activity,",
		".main-container .sponsor-wrapper,",
		".arc-toolbar,",
		".topview-sponsor,",
		".sponsor-content-wrapper,",
		".primary-menu .nav-menu .nav-item.side-nav ,",
		".primary-menu .nav-menu .side-nav,",
		".bili-wrapper .nav-gif,",
		"#viewlater-app .nav-gif,",
		"#viewlater-app .nav-menu .side-nav,",
		"#hotspot_5,",
		".b-page-body [data-ad-type],",
		"#i_menu_become_vip,",
		".viewbox .upinfo .live-status-link,",
		".viewbox .upinfo .r-info .b-btn.elec,",
		"#bofqi span.b-player-gray,",
		"#msg-bug-report,",
		".btn_gotop,",
		".mobile-link-l,",
		".bangumi-buybuybuy,",
		".b-header-mask-wrp,",
		".header .logo,",
		".header .num .menu-r,",
		//".footer,",
		".v-live-recommend,",
		"ul.nav-menu .m-i-square,",
		"ul.nav-menu .m-i-live,",
		"ul.nav-menu .m-i-blackroom,",
		"ul.nav-menu .m-i-zhuanlan,",
		"#b_tag_promote,",
		"#b_live,",
		".container-top-wrapper,",
		".bili_live_pmt,",
		"#b_promote .b-l,",
		"#b_promote .b-body,",
		"#b_recommend,",
		"#app #bili_bangumi .promote-tag-module,",
		"#app .gg-floor-module,",
		"#app .chief-recommend-module,",
		"#app .popularize-module .l-con,",
		"#app .promote-tag-module,",
		"#app .popularize-module .adpos,",
		"#app .special-recommend-module,",
		//"#app #bili_live,",
		"#app .primary-menu .nav-menu .nav-item.side-nav,",
		"#app .primary-menu .nav-gif,",
		"#app #bili_bangumi .promote-tag-module,",
		"#app .gg-floor-module,",
		"#app .chief-recommend-module,",
		"#app .popularize-module .l-con,",
		"#app .promote-tag-module,",
		"#app .popularize-module .adpos,",
		"#app .special-recommend-module,",
		//"#app #bili_live,",
		"#app .primary-menu .nav-menu .nav-item.side-nav,",
		"#app .primary-menu .nav-gif,",
		".index-nav .n-i.n-i-mlink .n-i-mlink-bg,",
		".elevator-module .app-download,",
		//".elevator-module .nav-list div.sortable:nth-child(1),",
		"#index_nav div.n-i:nth-child(1) { display: none !important; }"
	].join("\n");
if (false || (new RegExp("^(http|https)://bangumi.bilibili.com/anime/(\\d*|\\d*\\/)$")).test(document.location.href))
	css += ".z_top { z-index: 10001 !important; }";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();