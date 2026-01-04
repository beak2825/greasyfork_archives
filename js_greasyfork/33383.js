// ==UserScript==
// @name         斗鱼频道排序
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  斗鱼直播大厅，各分类加权是不同的，有些非主流频道人数少，却排在前面。本脚本让只按人数排序
// @author       You
// @match        https://www.douyu.com/directory/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33383/%E6%96%97%E9%B1%BC%E9%A2%91%E9%81%93%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/33383/%E6%96%97%E9%B1%BC%E9%A2%91%E9%81%93%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(function(){


		//搞个按钮
	//	var $sortButton=$("<li class='fl'> <a href='#'>排序</a></li>");
	//	$("#header .head-nav.fl").append($sortButton);
		sort();

		//排序 函数
		function sort(){
			//放入容器(人数,item)
			var arrayA=new Array();
			$("#live-list-contentbox .dy-num.fr").closest("li");
			$("#live-list-contentbox .dy-num.fr").each(function(){
				var peCount=$(this).text();
				if(peCount.endsWith('万')){
					peCount=peCount.substring(0,peCount.indexOf('万'));
					peCount=peCount*10000;
				}
				arrayA.push({'peCount':peCount,'item':$(this).closest("li")});
			});
			console.log("放入容器中",arrayA);

			//排序
			if(arrayA){
				arrayA.sort(function(a,b){

					return b.peCount-a.peCount;
				});
			}
			console.log("排序后",arrayA);

			//重新放入view
			$("#live-list-contentbox").empty();
			$(arrayA).each(function(){
				$("#live-list-contentbox").append(this.item);
			});
		}

	});

})();