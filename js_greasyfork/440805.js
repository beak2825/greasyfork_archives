// ==UserScript==
// @name         京东手机版转电脑版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跳转到商品相应的京东联盟，自己的返利自己赚!
// @include http*://item.m.jd.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440805/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%89%88%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/440805/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%89%88%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==

// Your code here...
//debugger;

function run(){
	
    var link=location.href;
    var targetLink= link.replace("https://item.m.jd.com/product/","https://item.jd.com/");
	var block;
    block=document.querySelector("#priceBlock");
	var br=document.createElement('br');
	var mamaLink=document.createElement('a');
	mamaLink.href=targetLink;
	mamaLink.target='_blank';
	mamaLink.innerText='跳转到PC版';
	block.appendChild(mamaLink);


}


run();