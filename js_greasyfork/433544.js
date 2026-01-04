// ==UserScript==
// @name         B站全部直播页面黑名单
// @namespace    https://greasyfork.org/zh-CN/scripts/433544-b%E7%AB%99%E5%85%A8%E9%83%A8%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E9%BB%91%E5%90%8D%E5%8D%95
// @version      0.1.2
// @description  屏蔽掉不喜欢的人吧
// @author       karlholmes
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433544/B%E7%AB%99%E5%85%A8%E9%83%A8%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/433544/B%E7%AB%99%E5%85%A8%E9%83%A8%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {

	/*----配置项----*/
    var mode = 0; //0关键词移除(包含关键词即移除);1根据UP主昵称精确移除 ;所有模式均需区分大小写
	var sCName = "index_item_JSGkw"; //房间块的className(后续可能会更新)
	var sText = "老实憨厚的笑笑,CSGO--德云两鬼,德云色,DYS解说,老实憨厚,罗汉解说"; //需要移除的UP主昵称或关键字，以英文半角逗号分隔
	/*--------------*/

	var fTag,sTags,sArr = SplitsText(sText,",");
	function SplitsText(a,b){
	    let itext=a.split(b);
	    return itext;
	}

	setInterval(function() {
	    sTags = document.getElementsByTagName("div");
	    if (mode == 0) {
		   for (let i = 0; i < sTags.length; i++) {
			  if (sTags[i].className == sCName) {
				 for (let n = 0; n < sArr.length; n++) {
					if (sTags[i].innerText.indexOf(sArr[n]) != -1) {
					    fTag = sTags[i];
					    console.log(fTag);
					    fTag.remove();
					    break;
					}
				 }
			  }
		   }
	    } else if (mode == 1) {
		   for (var i = 0; i < sTags.length; i++) {
			  for (var n = 0; n < sArr.length; n++) {
				 if (sTags[i].innerText == sArr[n]) {
					let pTag = sTags[i]
					for (let k = 1; k < 10; k++) {
					    pTag = pTag.parentNode;
					    if (pTag.className == sCName) {
						   console.log(pTag);
						   pTag.remove();
						   break;
					    }
					}
					break;
				 }
			  }
		   }
	    }
	}, 1000);

})();