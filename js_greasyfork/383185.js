// ==UserScript==
// @name         V2EX多页面操作支持（解决防CSRF策略token更新导致旧页面操作无效问题）
// @namespace    http://zhangbohun.github.io/
// @version      0.1
// @description  通过localStorage同步最新的csrfToken，用于所有打开页面内收藏、感谢等操作（并非直接使用在Cookies中仍然可以避免CSRF攻击隐患）
// @author       zhangbohun
// @match        *://*.v2ex.com/*
// @grant        none
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/383185/V2EX%E5%A4%9A%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%E6%94%AF%E6%8C%81%EF%BC%88%E8%A7%A3%E5%86%B3%E9%98%B2CSRF%E7%AD%96%E7%95%A5token%E6%9B%B4%E6%96%B0%E5%AF%BC%E8%87%B4%E6%97%A7%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%E6%97%A0%E6%95%88%E9%97%AE%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/383185/V2EX%E5%A4%9A%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%E6%94%AF%E6%8C%81%EF%BC%88%E8%A7%A3%E5%86%B3%E9%98%B2CSRF%E7%AD%96%E7%95%A5token%E6%9B%B4%E6%96%B0%E5%AF%BC%E8%87%B4%E6%97%A7%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%E6%97%A0%E6%95%88%E9%97%AE%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

	if(typeof csrfToken != "undefined")//只在csrfToken更新的页面生效
	{
		//同步更新csrfToken到localStorage
		localStorage.csrfToken=csrfToken;
		//修改函数中固定的csrfToken字符串从localStorage中动态获取，V站没有js动态绑定的操作函数，直接替换dom方便些
		var node = document.querySelector("body");
		node.innerHTML=node.innerHTML.replace(new RegExp("\'"+csrfToken+"\'", "g"), "localStorage.csrfToken");

		//收藏操作
		var url=document.querySelector(".topic_buttons>a").href;
		document.querySelector(".topic_buttons>a").href="javascript:void(0)";
		document.querySelector(".topic_buttons>a").onclick=function(){
			window.location.href=url.split('=')[0]+'='+ localStorage.csrfToken;
		}
	}
})();