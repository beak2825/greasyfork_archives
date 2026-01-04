// ==UserScript==
// @name         思 古 解 析 z y f
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  跳转到思 古 解 析 
// @author       hahahaha
// @include http*://www.iqiyi.com/*
// @include http*://v.youku.com/*
// @include http*://v.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401372/%E6%80%9D%20%E5%8F%A4%20%E8%A7%A3%20%E6%9E%90%20z%20y%20f.user.js
// @updateURL https://update.greasyfork.org/scripts/401372/%E6%80%9D%20%E5%8F%A4%20%E8%A7%A3%20%E6%9E%90%20z%20y%20f.meta.js
// ==/UserScript==

function run(){
    var searchPrefix1="https://api.sigujx.com/?url=&url=";
    var searchPrefix2="https://jx.lache.me/cc/?url=&url=";
    var block;
    if(location.host==='www.iqiyi.com'){
		block=document.querySelector('.header-link');
	}
    if(location.host==='v.youku.com'){
		block=document.querySelector('.thesis-wrap');
	}
    if(location.host==='v.qq.com'){
		block=document.querySelector('.player_title');
	}
    var realLink=location.href;
    var targetLink1=searchPrefix1+(realLink);
    var targetLink2=searchPrefix2+(realLink);
	var mamaLink1=document.createElement('a');
	mamaLink1.href=targetLink1;
	mamaLink1.innerText=' goto①';
	block.appendChild(mamaLink1);
    var mamaLink2=document.createElement('a');
    mamaLink2.href=targetLink2;
	mamaLink2.innerText=' goto②';
	block.appendChild(mamaLink2);
}

run();
