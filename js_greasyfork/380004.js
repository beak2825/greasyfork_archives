// ==UserScript==
// @name         图片替换
// @namespace    http://tampermonkey.net/
// @include        http://tieba.baidu.com/*
// @include        https://tieba.baidu.com/*
// @version      0.2
// @description  能替换贴吧中的部分图像
// @author       e01 某b吧吧友

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380004/%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/380004/%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

var second = 3; //每几秒替换一轮
//横幅链接
var banner = "";
//吧标志链接
var card = "";
//群众头像替换链接
var head =''
//吧主头像替换链接
var mhead ='';
//广告图片替换链接
var ad ='';

setInterval(function() {
    var allElements, thisElement;
allElements = document.evaluate(
	'//img[@src]',
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);

for (var i = 0; i < allElements.snapshotLength; i++) {
	thisElement = allElements.snapshotItem(i);

   if(thisElement.getAttribute('id') == "forum-card-banner") thisElement.setAttribute('src',banner);
    if(thisElement.getAttribute('id') == "forum-card-head") thisElement.setAttribute('src',card);
    if(thisElement.getAttribute('class') == "card_head_img") thisElement.setAttribute('src',card);
    if(thisElement.getAttribute('class') == "hover_btn") thisElement.setAttribute('src',ad);
    if(thisElement.hasAttribute('username')||thisElement.parentNode.hasAttribute('username')) thisElement.setAttribute('src',head);
    if(thisElement.parentNode.getAttribute('class')=="media_top manager_media") thisElement.setAttribute('src',mhead);
  
}
},second*1000);