// ==UserScript==
// @name				mobile01.com - navigate with keyboard
// @name:zh-TW			mobile01.com 鍵盤瀏覽
// @name:zh-CN			mobile01.com 键盘浏览
// @description:en		press keyboard [← / a] to the previous page, [→ / d] to the next page, [↓ / s] back to parent classification. Add "My Article" to the top right corner.
// @description:zh-TW	用方向鍵 [← / a] 切換前一頁，[→ / d] 切換次一頁，[↓ / s] 退回外層分類。右上角加入 [我的文章/我的市集] 連結。
// @description:zh-CN	用方向键 [← / a] 切换前一页，[→ / d] 切换次一页，[↓ / s] 退回外层分类。右上角加入 [我的文章/我的市集] 连结。
// @namespace			https://greasyfork.org/zh-TW/users/393133-evan-tseng
// @author				Evan Tseng
// @version				1.12
// @match				*://*.mobile01.com/*
// @run-at				document-end
// @grant				none
// @license				MIT
// @description press keyboard [← / a] to the previous page, [→ / d] to the next page, [↓ / s] back to parent classification. Add "My Article" to the top right corner.
// @downloadURL https://update.greasyfork.org/scripts/391745/mobile01com%20-%20navigate%20with%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/391745/mobile01com%20-%20navigate%20with%20keyboard.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// 新增[我的文章]按鈕
		var elm=document.querySelector(".l-header__main .l-signedIn");
		if(elm){
			const css=`._myLink { display: inline-block; white-space: nowrap; height: 1em; font-size: calc(9pt + .25vw); text-align: center; padding: .3em; line-height: 1; margin: calc(.5em - .4vw) 1mm 1px 4mm; border-radius: 5pt; transition: .2s }
._myLink:hover { transition: 60ms }
._myLink:active { margin: calc(.5em - .4vw + 1px) 1mm 0 4mm; transition: 0s }
@media (prefers-color-scheme: light) {
	._myLink { color: #f3f3f3; background: #30A651; text-shadow: 0 0 1px #000; box-shadow: inset 0 0 0 1px #30A651, inset 0 0 0 2px #ebeae7; }
	._myLink:hover { color: #f3f3f3; background: #23803d; box-shadow: inset 0 0 0 1px #3a5, inset 0 0 0 2px #fff, 0 1px 4px rgba(0, 0, 0, .4); }
	._myLink:active { color: #fff; background: #23803d; box-shadow: inset 0 0 0 1px #3a5, inset 0 0 0 2px #ccc, inset 0 0 5px #000; }
}
@media (prefers-color-scheme: dark) {
	._myLink { color: #ccc; background: #263; box-shadow: inset 0 0 0 1px #052, inset 0 0 0 2px #30A651; }
	._myLink:hover { background: #23803D; box-shadow: inset 0 0 0 1px #052, inset 0 0 0 2px #30A651; }
	._myLink:active { color: #ddd; background: #263; box-shadow: inset 0 0 0 1px #052, inset 0 0 0 2px #183; }
}`;
			var currPos = document.querySelector(".l-header .l-header__left>a").getAttribute("href"),
				myArticle = document.createElement('a');
			myArticle.setAttribute("class", "_myLink");

			if(currPos == "/marketindex.php") {
				myArticle.appendChild(document.createTextNode("我的市集"));
				myArticle.setAttribute("href", "/mypurchaselist.php");
				myArticle.setAttribute("title", "我的市集");
			}
			else {
				myArticle.appendChild(document.createTextNode("我的文章"));
				myArticle.setAttribute("href", "/participatetopics.php");
				myArticle.setAttribute("title", "我的文章");
			}
			elm.parentNode.appendChild(myArticle);

			var cssStyle = document.createElement('style');
			if(cssStyle.styleSheet) cssStyle.styleSheet.cssText=css;
			else cssStyle.appendChild(document.createTextNode(css));
			document.querySelector('head').appendChild(cssStyle);
		}

	// 移除指向本頁的連結
	document.querySelectorAll(".l-pagination__page.is-active>a, .c-filter a.c-iconLink--gn").forEach(function(elm){
		if(elm.tagName == "A") elm.removeAttribute("href")
	});

	// 綁定方向鍵
	document.addEventListener("keydown", async function(e) {
		if(document.querySelector("input:focus, textarea:focus") || (e.shiftKey | e.ctrlKey | e.altKey | e.metaKey | e.isComposing)) return;
		e = e || window.event;
		try{
			switch(e.key.toLowerCase()) {
				case 'arrowdown':
				case 's':
					if(window.location.href.match(/\/topicdetail\.php\?/i))	document.querySelector(".c-breadCrumb__item:last-child a").click();
					else	document.querySelector(".c-breadCrumb__item:nth-last-of-type(-n+2) a").click();
					break;
				case 'arrowleft':
				case 'a':
					document.querySelector(".l-pagination__page.is-active").previousSibling.querySelector("a.c-pagination").click();
					break;
				case 'arrowright':
				case 'd':
					document.querySelector(".l-pagination__page.is-active").nextSibling.querySelector("a.c-pagination").click();
					break;
			}
		} catch(err){ console.log(err); }
	});

	// 拿掉外網連結警示
	document.addEventListener("mousedown", function(e) {
		var clickTarget = e.target.closest("a");
		if(!clickTarget) return;
		var theHref = clickTarget.getAttribute("href");
		theHref=decodeURIComponent(theHref.replace("/externallink.php?url=", ""));
		clickTarget.setAttribute("href", theHref);
	});

})();
