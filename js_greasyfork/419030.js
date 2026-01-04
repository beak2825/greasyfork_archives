// ==UserScript==
// @name         続きを読むリンククリック
// @version      4.0
// @description  Yahoo!Japanニュースの「続きを読む」「記事全文を読む」「速報を見る」を自動でクリック
// @author       kamken
// @match        https://news.yahoo.co.jp/pickup/*
// @grant        none
// @namespace    https://greasyfork.org/users/719226
// @downloadURL https://update.greasyfork.org/scripts/419030/%E7%B6%9A%E3%81%8D%E3%82%92%E8%AA%AD%E3%82%80%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/419030/%E7%B6%9A%E3%81%8D%E3%82%92%E8%AA%AD%E3%82%80%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==
'use strict';
(function(){
    var obj=document.getElementsByTagName('a');
	for(var i=0;i<100;i++){
		if(obj[i].textContent=='続きを読む'||obj[i].textContent=='記事全文を読む'||obj[i].textContent=='速報を見る'){
			location.href=obj[i].href;
			break;
		};
	};
})();
