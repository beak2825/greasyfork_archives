// ==UserScript==
// @name         删除大地图右下广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除观测枢大地图右下广告
// @author       lsdt45
// @match        https://webstatic.mihoyo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mihoyo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455203/%E5%88%A0%E9%99%A4%E5%A4%A7%E5%9C%B0%E5%9B%BE%E5%8F%B3%E4%B8%8B%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/455203/%E5%88%A0%E9%99%A4%E5%A4%A7%E5%9C%B0%E5%9B%BE%E5%8F%B3%E4%B8%8B%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
let timer = setTimeout(()=> {
    console.log('enter')
	let ad = document.querySelector('.bbs-qr');
	if(ad) {
		ad.parentNode.removeChild(ad)
		timer = null
	}
}, 1000)

    // Your code here...
})();