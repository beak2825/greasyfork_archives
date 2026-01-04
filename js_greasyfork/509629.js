// ==UserScript==
// @name         【网页标题助手】　
// @namespace    https://greasyfork.org/
// @version      241009.13
// @description  自定义网页标题+相关工具
// @author       You
// @license      MIT
// @run-at       document-end
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/509629/%E3%80%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%8A%A9%E6%89%8B%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/509629/%E3%80%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%8A%A9%E6%89%8B%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';const $=(e)=>{return document.querySelector(e)};

let autoTitle=1;/*值为1时，无标题网页自动把域名作为标题*/

const siteRules=[
	{
		'name':'网站名称',
		'match':'匹配url正则。用构造函数创造的正则对象，需要常规的字符转义规则（在前面加反斜杠 \）',
		'title':'网页标题选择器/函数'
	},
	{
		'name':'微信公众号文章',
		'match':'mp.weixin.qq.com\\/s',
		'title':()=>{return document.title+'_'+$('#js_name').innerText.trim();}
	},
	{
		'name':'可爱TV',
		'match':'keai.cm\\/\\?.*?id=.*?',
		'title':'.text-container'
	}

];

function main(){

/*匹配自定义规则*/
for(let i of siteRules){
let ruleReg=new RegExp(i.match);
if(location.href.match(ruleReg)){
let title=typeof i.title=='function'?i.title():$(i.title)?.innerText;
title&&(document.title=title);
break;}
}

!document.title&&autoTitle=='1'&&(document.title=location.hostname);

}

setTimeout(main,1000);

GM_registerMenuCommand('【修改网页标题】',function(){let newTitle=prompt('想要什么标题，随心改',document.title);newTitle&&(document.title=newTitle);});
GM_registerMenuCommand('【复制网页标题】',function(){GM_setClipboard(document.title);});
GM_registerMenuCommand('【复制网页标题和网址】',function(){GM_setClipboard(`${document.title}\n${decodeURIComponent(location.href)}\n\n`);});

})();