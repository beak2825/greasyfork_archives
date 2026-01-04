// ==UserScript==
// @name         河南教育人才协会
// @namespace    http://thaetjxjy.com/
// @version      1.2
// @description 河南教育人才协会666
// @author       You
// @match        https://learning.haetjxjy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431388/%E6%B2%B3%E5%8D%97%E6%95%99%E8%82%B2%E4%BA%BA%E6%89%8D%E5%8D%8F%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/431388/%E6%B2%B3%E5%8D%97%E6%95%99%E8%82%B2%E4%BA%BA%E6%89%8D%E5%8D%8F%E4%BC%9A.meta.js
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