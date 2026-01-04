// ==UserScript==
// @name         知乎去掉视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉知乎的包含视频的问题
// @author       webNoob
// @match        *://www.zhihu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459243/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%8E%89%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459243/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%8E%89%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

function Work(){

    console.log("begin to remove ZHIHU video...");
    var list1 = document.getElementsByClassName("Card TopstoryItem TopstoryItem-isRecommend");
	for(var l=0;l<list1.length;l++){
		if(list1[l].getElementsByClassName("Feed").length ){

            if(list1[l].getElementsByClassName("Feed")[0].hasAttribute("data-za-extra-module")){

                var obj = list1[l].getElementsByClassName("Feed")[0].getAttribute("data-za-extra-module").toString();

                if(JSON.parse(obj).card.has_video){
			        list1[l].parentNode.removeChild(list1[l]);
                }
            }
		}
	}
}
(function() {
	'use strict';
	setInterval(Work,1000);
})();