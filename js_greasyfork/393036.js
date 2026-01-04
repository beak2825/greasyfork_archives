// ==UserScript==
// @name         河南学习网-全自动版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        http://www.henanxuexi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393036/%E6%B2%B3%E5%8D%97%E5%AD%A6%E4%B9%A0%E7%BD%91-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/393036/%E6%B2%B3%E5%8D%97%E5%AD%A6%E4%B9%A0%E7%BD%91-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
var href = location.href;
			if(href.indexOf('http://www.henanxuexi.com/course')!=-1){
				setInterval(function () {
			    //当任务完成后，回到首页
					if(document.getElementsByClassName("btn text-sm hidden-xs js-learned-prompt color-primary moveup").length != 0)
						{
							document.getElementsByClassName("back-link")[0].click()

						}
				}, 2000)
			}
			if(href.indexOf('http://www.henanxuexi.com/my')!=-1){
				//回到首页后，点击继续学习

							        document.getElementsByClassName("btn btn-primary btn-lg")[0].click()
			}
})();