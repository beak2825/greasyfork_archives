// ==UserScript==
// @name         CSDN免登录代码复制
// @namespace    yeyu
// @version      0.5
// @description  CSDN在不登录的情况下实现代码复制，免关注查看
// @author       夜雨
// @match        *://blog.csdn.net/*/article/details/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456093/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456093/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {

	'use strict';

	 var st = function() {


         $("div.article_content").removeAttr("style")//免关注查看
		 var fuckCopy = function(e) {
               // console.log(e.currentTarget);
		 		let cptext = e.currentTarget.innerText.replace(/[\u00A0]/gi, " ");
		 		GM_setClipboard(cptext)
				console.log("复制成功");
		 };
		let cplist = document.querySelectorAll("code");

		cplist.forEach((v, i) => {
			//v.setAttribute("onclick", "fuckCopy(event)");
			v.removeAttribute("onclick")
			v.addEventListener("click",fuckCopy)
            v.contentEditable = true;
		})

		let cpbuttons = document.querySelectorAll("div[data-title='登录后复制']");

		cpbuttons.forEach((v) => {
            v.removeAttribute("onclick")
           // v.addEventListener("click",fuckCopy)
			v.setAttribute("data-title", "强制复制");
		})
        document.querySelector(".hide-article-box").setAttribute("style","display:none")

	 }
     setTimeout(st, 3000)

})();


