// ==UserScript==
// @name         蓝凑云自动填写提取码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  蓝凑云自动填写链接里的提取码
// @author       zyb
// @match        https://lanzoui.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sass.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459514/%E8%93%9D%E5%87%91%E4%BA%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/459514/%E8%93%9D%E5%87%91%E4%BA%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E7%A0%81.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let passwardArr=['psd','pwd','passward'];
	let inputDom = document.querySelectorAll("#pwd")[0];
	let submitDom = document.querySelectorAll("#sub")[0];

	passwardArr.forEach(passward=>{

		let hash = location.hash && location.hash.split("&").filter(item=>{
			return item.includes(passward)
		})[0]?.split(passward+"=")[1];

		let url = location.search && location.search.split("&").filter(item=>{
			return item.includes(passward)
		})[0]?.split(passward+"=")[1];
		inputDom.value = hash || url;
		inputDom.value && submitDom.click();
	})
})();