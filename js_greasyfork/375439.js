// ==UserScript==
// @name         修改微信公众号文章title标题
// @namespace    http://zhangbohun.github.io/
// @version      0.1
// @description  修改微信公众号文章title标题（默认全部会变成公众号名称不方便存书签）
// @author       zhangbohun
// @match        *://mp.weixin.qq.com/*
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/375439/%E4%BF%AE%E6%94%B9%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0title%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/375439/%E4%BF%AE%E6%94%B9%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0title%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

window.onload =function() {
    'use strict';
	window.setTimeout(function(){ document.getElementsByTagName('title')[0].innerHTML= document.getElementById('activity-name').innerHTML; }, 3000);
	window.setTimeout(function(){ document.getElementsByTagName('title')[0].innerHTML= document.getElementById('activity-name').innerHTML; }, 5000);
	window.setTimeout(function(){ document.getElementsByTagName('title')[0].innerHTML= document.getElementById('activity-name').innerHTML; }, 7000);
};