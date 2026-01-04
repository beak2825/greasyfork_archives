// ==UserScript==
// @name         Image Larger
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.pixiv.net/artworks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404406/Image%20Larger.user.js
// @updateURL https://update.greasyfork.org/scripts/404406/Image%20Larger.meta.js
// ==/UserScript==

function erase(item){
	item.parentNode.removeChild(item);
}

function erase_array(item){
	for(let i = item.length - 1; i >= 0; i--){
		erase(item[i]);
	}
}

setInterval(function(){
    //erase_array(document.getElementsByTagName("aside"));
    //erase_array(document.getElementsByTagName("ul"));
    erase_array(document.getElementsByClassName("sc-jSoGAS eSAKCl")); // 画像の下に出てくるいいねボタンとかがあるリボン
    for(let i of document.getElementsByClassName("sc-jCDCQp")){; // 画像本体
		i.style.width = "300%";
		i.style.height = "auto";
		i.style.maxHeight = "none";
		i.parentNode.maxWidth = "none";
	}
}, 100);