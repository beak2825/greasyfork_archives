// ==UserScript==
// @name         scrap.tf|多余查找
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       过客
// @match        https://scrap.tf/sell/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394613/scraptf%7C%E5%A4%9A%E4%BD%99%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/394613/scraptf%7C%E5%A4%9A%E4%BD%99%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==

(function() {
function autoSell(){
	var items = document.getElementsByClassName("items-container")[0].children;
	var itemNames = [];
	for(var i=0;i<items.length;i++){
		var dataTitle = items[i].getAttribute("data-title");
		if(itemNames.indexOf(dataTitle)>-1){
			items[i].click();
			console.log("click "+dataTitle);
		}else{
			itemNames.push(dataTitle);
		}
	}
}
var b = document.createElement("a");
b.innerText = "自动选择重复项";
b.onclick = autoSell;
document.getElementsByClassName("inv-switcher")[0].appendChild(b);
})();