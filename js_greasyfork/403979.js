// ==UserScript==
// @name         随手记 增加 基金按钮
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  随手记 增加 基金 按钮
// @author       hahahaha
// @include http*://www.sui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403979/%E9%9A%8F%E6%89%8B%E8%AE%B0%20%E5%A2%9E%E5%8A%A0%20%E5%9F%BA%E9%87%91%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/403979/%E9%9A%8F%E6%89%8B%E8%AE%B0%20%E5%A2%9E%E5%8A%A0%20%E5%9F%BA%E9%87%91%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

function run(){
    var block;
	block=document.querySelector('.l-report');
    var targetLink1='https://www.sui.com/module/fund_holding.do';
	var mamaLink1=document.createElement('a');
	mamaLink1.href=targetLink1;
	mamaLink1.innerText='     基金';
	block.appendChild(mamaLink1);
}

run();
