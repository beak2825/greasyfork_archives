// ==UserScript==
// @name         Yahoo!Japanニュースからのお知らせ欄除去
// @version      4.0
// @description  Yahoo!Japanニュースのお知らせ欄を除去
// @author       kamken
// @match        https://news.yahoo.co.jp/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419838/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%81%8B%E3%82%89%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E6%AC%84%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/419838/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%81%8B%E3%82%89%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E6%AC%84%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==
'use strict';
(function(){
	var obj=document.getElementsByClassName('yjnSub_list');
	if(obj.length>0){
		var i=0;
		do{
			var objc=obj[i].children;
			if(objc.length>0){
				var j=0;
				do{
					if(objc[j].textContent.indexOf('Yahoo!ニュースからのお知らせ')>=0){
						objc[j].remove();
					}else{
						j++;
					};
				}while(j<objc.length);
			};
			i++;
		}while(i<obj.length);
	};
	var obj2=document.getElementById('yjnFixableArea');
	if(obj2){
		var obj2c=obj2.getElementsByTagName('div');
		if(obj2c.length>0){
			i=0;
			do{
				var obj2c2=obj2c[i].children;
				if(obj2c2.length>0){
					j=0;
					do{
						if(obj2c2[j].textContent.indexOf('Yahoo!ニュースからのお知らせ')==0 || obj2c2[j].textContent.indexOf('Yahoo!ニュース タイアップ')==0){
							obj2c2[j].remove();
						}else{
							j++;
						};
					}while(j<obj2c2.length);
				};
				i++;
			}while(i<obj2c.length);
		};
	};
})();
