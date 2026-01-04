// ==UserScript==
// @name         Yahoo!Japanニュース広告欄除去
// @version      2.0
// @description  Yahoo!Japanニュースの広告欄を除去
// @author       kamken
// @match        https://news.yahoo.co.jp/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/421944/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%BA%83%E5%91%8A%E6%AC%84%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/421944/Yahoo%21Japan%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%BA%83%E5%91%8A%E6%AC%84%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==
'use strict';
(function(){
	var obj1=document.getElementsByClassName('yjnSub_list');
	if(obj1.length>0){
		var i=0;
		do{
			var obj1c=obj1[i].children;
			if(obj1c.length>0){
				var j=0;
				do{
					if(obj1c[j].textContent.indexOf('Yahoo!ニュース タイアップ')>=0){
						obj1c[j].remove();
					}else{
						j++;
					};
				}while(j<obj1c.length);
			};
			i++;
		}while(i<obj1.length);
	};
	var obj2=document.querySelectorAll('#yjnFixableArea');
	if(obj2.length>0){
		i=0;
		do{
			var obj2c=obj2[i].children[0].children;
			if(obj2c.length>0){
				j=0;
				do{
					if(obj2c[j].textContent.indexOf('Yahoo!ニュース タイアップ')>=0){
						obj2c[j].remove();
					}else{
						j++;
					};
				}while(j<obj2c.length);
			};
			i++;
		}while(i<obj2.length);
	};
})();
