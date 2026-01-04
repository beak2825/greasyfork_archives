// ==UserScript==
// @name         POB导出军团珠宝链接转国服
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license MIT
// @description  ~
// @author       欧阳诛仙
// @match        *://poe.game.qq.com/trade/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/475031/POB%E5%AF%BC%E5%87%BA%E5%86%9B%E5%9B%A2%E7%8F%A0%E5%AE%9D%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%9B%BD%E6%9C%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/475031/POB%E5%AF%BC%E5%87%BA%E5%86%9B%E5%9B%A2%E7%8F%A0%E5%AE%9D%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%9B%BD%E6%9C%8D.meta.js
// ==/UserScript==


(function () {
    'use strict';
	if(navigator.clipboard){
	  navigator.clipboard.readText()
		.then(text => {
			console.log(text)
			if (!!~text.search('www.pathofexile.com')){
                window.location.href=text.replace('www.pathofexile.com','poe.game.qq.com').replace('online','any')
			}
		})
		.catch(error => console.log('获取剪贴板内容失败：', error));
	} else {
	  console.log('当前浏览器不支持Clipboard API');
	}
})();
