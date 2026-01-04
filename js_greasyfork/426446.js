// ==UserScript==
// @name         河南省教育人才学会网络学院-全自动版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       You
// @description   简单强大
// @match        https://learning.haetjxjy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426446/%E6%B2%B3%E5%8D%97%E7%9C%81%E6%95%99%E8%82%B2%E4%BA%BA%E6%89%8D%E5%AD%A6%E4%BC%9A%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/426446/%E6%B2%B3%E5%8D%97%E7%9C%81%E6%95%99%E8%82%B2%E4%BA%BA%E6%89%8D%E5%AD%A6%E4%BC%9A%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
var href = location.href;
			if(href.indexOf('https://learning.haetjxjy.com/course')!=-1){
				setInterval(function () {
			    //当任务完成后，回到首页
					if(document.getElementsByClassName("btn text-sm hidden-xs js-learned-prompt color-primary moveup").length != 0)
						{
							document.getElementsByClassName("back-link")[0].click()

						}
				}, 2000)
			}
			if(href.indexOf('https://learning.haetjxjy.com/my')!=-1){
				//回到首页后，点击继续学习

							        document.getElementsByClassName("btn btn-primary btn-lg")[0].click()
			}
})();