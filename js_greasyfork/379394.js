// ==UserScript==
// @name         	Twiiter可疑用户提示
// @namespace    	https://github.com/ZeroMai
// @version      	0.0.2
// @description  	标记骗子，疑似骗子，盗图用户
// @author       	ZeroMai
// @include      	*twitter.com/*
// @require      	http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      	http://code.highcharts.com/highcharts.js
// @require      	https://unpkg.com/tippy.js@3/dist/tippy.all.min.js
// @license      	MIT
// @supportURL   	https://github.com/ZeroMai
// @compatible   	chrome
// @incompatible   	firefox
// @incompatible   	edge
// @grant        	GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379394/Twiiter%E5%8F%AF%E7%96%91%E7%94%A8%E6%88%B7%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/379394/Twiiter%E5%8F%AF%E7%96%91%E7%94%A8%E6%88%B7%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var settings = {
		// 功能1-1 高亮骗子ID
		highlightSpecificCheatID : [
			"@henhendada", 
			"@mademazi233", 
			"@qimugouqi",
			"@henhendemajia",
			"@91pornvideo"
			
		], // 需要高亮的ID数组
        highlightSpecificCheatBack : "#d9534f", // 高亮背景色 ，红色
        highlightSpecificCheatFront : "#ffffff", // 高亮字体颜色，白色
		
		// 功能1-2 高亮盗图ID
		highlightSpecificThiefID : [
			"@lovesm521",
			"@feiyie520",
			"@xiaobaiai",
			"@vfd88",
			"@dddd64807393",
			"@BDSMart8",
			"@wxingy",
			"@miya69994148",
			"@Nacey_2433",
			"@yizhiyingcao",			
			"@baobaoaiyezhan",
			"@bding67"		
		], // 需要高亮的ID数组
        highlightSpecificThiefBack : "#000000", // 高亮背景色，黑色
        highlightSpecificThiefFront : "#ffffff", // 高亮字体颜色，白色
		
		// // 功能1-3 高亮疑似骗子ID
		// highlightSpecifiDoubtID : [
			// "@qimugouqi"
		// ], // 需要高亮的ID数组
        // highlightSpecificDoubtBack : "#0000CD", // 高亮背景色，蓝色
        // highlightSpecificDoubtFront : "#ffffff", // 高亮字体颜色，白色

    }
	
	
	// 功能1-1 标注骗子ID
	var Cheat = document.getElementsByClassName("username u-dir u-textTruncate");
	settings.highlightSpecificCheatID.map(function(i, n) {
		for(var index = 0; index < Cheat.length; ++index){
			if(Cheat[index].innerText == i){
				Cheat[index].innerText= i + " !!!骗子!!!";
			}
		}
	});
	
	// 功能1-2 标注盗图ID
	var Thief = document.getElementsByClassName("username u-dir u-textTruncate");
	settings.highlightSpecificThiefID.map(function(i, n) {
		for(var index = 0; index < Thief.length; ++index){
			if(Thief[index].innerText == i){
				Thief[index].innerText= i + " !!!盗图!!!";
			}
		}
	});
	
	
	// // 功能1-3 标注疑似骗子ID
	// var Doubt = document.getElementsByClassName("username u-dir u-textTruncate");
	// settings.highlightSpecifiDoubtID.map(function(i, n) {
		// for(var index = 0; index < Doubt.length; ++index){
			// if(Doubt[index].innerText == i){
				// Doubt[index].innerText= i + " !!!疑似骗子!!!";
			// }
		// }
	// });
})();