// ==UserScript==
// @name         屏蔽笔趣阁广告
// @description  新手写的代码，方法简单暴力，就是屏蔽了笔趣阁网站的所有图片，以此来屏蔽广告。
// @namespace    https://greasyfork.org/zh-CN/scripts/438867
// @version      0.8
// @author       jakor
// @match        https://www.xbiquge.la/*/*
// @match        https://www.biqugesk.org/*
// @match        https://www.bswtan.com/*
// @icon         https://img1.baidu.com/it/u=2223429227,4256575164&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438867/%E5%B1%8F%E8%94%BD%E7%AC%94%E8%B6%A3%E9%98%81%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/438867/%E5%B1%8F%E8%94%BD%E7%AC%94%E8%B6%A3%E9%98%81%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(
    function changeState(){
    var adPic=document.getElementsByTagName('img');
    var i;
		for(i=0;i<adPic.length;i++)
		{
			adPic[i].style.display = "none";
		}
var adDiv=document.getElementById("HMRichBox");
    adDiv.style.display="none";},3000);

})();