// ==UserScript==
// @name         Bilibili Hider
// @description  bilibili hide
// @version      0.1.2
// @author       Kanna阿飘大hentai
// @namespace    http://weibo.com/Mr256luch
// @grant        none
// @include      https://live.bilibili.com/p/eden/area-tags?areaId=0&parentAreaId=9
// @downloadURL https://update.greasyfork.org/scripts/418938/Bilibili%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/418938/Bilibili%20Hider.meta.js
// ==/UserScript==

(function() {
	setInterval(function() {

		var list = document.querySelectorAll('.text-info-ctnr span'), i;

		for(i=0; i<list.length; i++){
            if(list[i].getAttribute("title")){
                var thisStr = list[i].getAttribute("title")
                var findStr = ["转播","测试直播"]
                findStr.forEach(function (item, index, array) {
                    if(list[i].getAttribute("title").indexOf(item)+1){

                        list[i].parentNode.parentNode.parentNode.style.display = 'none';
                    }
                });
            }
        }
	}, 10);
})();