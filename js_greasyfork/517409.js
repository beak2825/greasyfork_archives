// ==UserScript==
// @name         CSDN禁止弹窗+允许复制，隐藏页面上一切无用的信息，还你一个干净的CSDN
// @namespace    http://tampermonkey.net/
// @version      1.0.0.3
// @description  向csdn宣战
// @author       lalaki
// @match        https://*.csdn.net/*
// @icon         https://www.csdn.net/favicon.ico
// @homepage     https://lalaki.cn
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/517409/CSDN%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97%2B%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%EF%BC%8C%E9%9A%90%E8%97%8F%E9%A1%B5%E9%9D%A2%E4%B8%8A%E4%B8%80%E5%88%87%E6%97%A0%E7%94%A8%E7%9A%84%E4%BF%A1%E6%81%AF%EF%BC%8C%E8%BF%98%E4%BD%A0%E4%B8%80%E4%B8%AA%E5%B9%B2%E5%87%80%E7%9A%84CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/517409/CSDN%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97%2B%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%EF%BC%8C%E9%9A%90%E8%97%8F%E9%A1%B5%E9%9D%A2%E4%B8%8A%E4%B8%80%E5%88%87%E6%97%A0%E7%94%A8%E7%9A%84%E4%BF%A1%E6%81%AF%EF%BC%8C%E8%BF%98%E4%BD%A0%E4%B8%80%E4%B8%AA%E5%B9%B2%E5%87%80%E7%9A%84CSDN.meta.js
// ==/UserScript==
(function () {
	"use strict";
	const style = document.createElement("style");
	style.innerHTML = `.www-home-left{width:100% !important}#app .main-lt.blog,#app .detail-container.com-list-box{width:100% !important}#userSkin.skin-cookwhite,.user-profile-head{background-image:unset!important}.floor-blog-index .blog-content{width:auto!important}.vip-name{color:unset!important}#article_content{overflow:auto!important}.bar-content .time{font-size:unset!important}#mainBox main{position:absolute;left:0!important;top:0!important;z-index:2147483646!important}@media screen and (min-width:1px){.nodata .container{width:auto!important}}.article_content{height:auto!important}#article_content span.words-blog.hl-git-1,#content_views .hl-git-1,#content_views .hl-1{background-image:unset!important;margin:0 0 0 0!important;padding:0 0 0 0!important;color:unset!important;pointer-events:none}.set-code-hide{max-height:unset!important;height:auto!important}#getVipUrl{transform:scale(2.5);bottom:50px}.hide-article-pos{position:fixed!important;left:0}#blogVoteBox,#treeSkill,#recommend,.m_toolbar_left_app_btn,.m_toolbar_left_copyright,.readall_box,.article-heard-img,.c-gray,.wap-shadowbox,.feed-Sign-weixin,.ios-shadowbox,.openApp,#operate,.hide-article-pos,.blog-slide,.ai-abstract-box,.user-profile-head-info-ll,.user-right-floor,.recommendList,.introduction-fold.default,.quick-question,.so-hot-words,.user-profile-head-info-r-c ul li span + div,.so-footer,#csdn-copyright-footer,#www-home-right .links,.adImgs,.commentToolbar.comment-toolbar-fix,#www-home-right,#blogHuaweiyunAdvert,.ai-article-tag,#blogColumnPayAdvert,a.logo,img.logo,.vip-icon,.blog_container_aside,.blog-tags-box,.left-toolbox,.hide-preCode-box,.btn-tag,.article-vip-img-new,.el-popover__reference-wrapper,.show-more-introduction-fold,.person-code-age,.user-profile-icon,.user-profile-body-left{display:none!important;position:absolute;top:-999px;left:-999px}.toolbar-container-right{display:none!important}#blog_extension{display:none!important}.body-show-la{opacity:0;transition:opacity .5s ease}.body-show-la.show{opacity:1}.passport-login-tip-container{display:none!important}#mainBox main{width:100%!important}.recommend-box{display:none!important}#toolbarBox000,.hljs-button.signin.active,.article-search-tip,.passport-login-container,.passport-login-box{display:none!important}*{user-select:auto!important}#passportbox,.passport-login-container{pointer-events:none;display:none;position:fixed;top:-99999px!important;left:-9999px!important}.csdn-side-toolbar{display:none!important}#copyright-box{display:none;position:absolute;left:-999px;bottom:-2222px}.blog-footer-bottom{position:fixed;bottom:-9999px}.hljs-button.signin.active.blog-footer-bottom{display:none!important}`;
	document.head.prepend(style);
	const script = document.createElement("script");
	script.innerHTML = `
window.onload = () => {
	document.querySelectorAll("p").forEach((t) => {
		(t.oncontextmenu = "return true"),
			t.addEventListener("copy", (t) => {
				const o = window.getSelection().toString();
				return e.clipboardData.setData("text/plain", o), e.preventDefault(), !0;
			});
	}),
		(document.body.className += " body-show-la"),
		(function e(t) {
			const o = t.children;
			"none" === window.getComputedStyle(t).userSelect &&
				(t.style.userSelect = "auto");
			const n = t.className + "",
				l = t.id;
			(l.startsWith("blog") && l.endsWith("Advert")) ||
			"treeSkill" == l ||
			"toolbarBox" == l ||
			"copyright-box" == l ||
			-1 != n.indexOf("csdn-side-toolbar") ||
			-1 != n.indexOf("more-toolbox-new") ||
			-1 != n.indexOf("blog_container_aside") ||
			-1 != n.indexOf("recommend-box") ||
			-1 != n.indexOf("blog-footer-bottom") ||
			-1 != n.indexOf("hljs-button signin active")
				? t.setAttribute("hidden", "hidden")
				: -1 != n.indexOf("hide-preCode-bt") && t.click(),
				(t.oncontextmenu = "return true"),
				(t.oncopy = (e) => {
					const t = window.getSelection().toString();
					return (
						e.clipboardData.setData("text/plain", t), e.preventDefault(), !0
					);
				});
			for (let t = 0; t < o.length; t++) e(o[t]);
		})(document.body);
	let e = 0;
	const t = setInterval(() => {
		try {
			document.querySelector(".blog-footer-bottom").remove(),
				document
					.querySelectorAll(".hljs-button.signin.active")
					.forEach((e) => (e.style = "display:none")),
				document.body.classList.toggle("show"),
				clearInterval(t);
		} catch (o) {
			e > 200 && (document.body.classList.toggle("show"), clearInterval(t)),
				e++;
		}
	}, 1);
};
`;
	document.head.append(script);
})();
