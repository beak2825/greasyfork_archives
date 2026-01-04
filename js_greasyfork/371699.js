// ==UserScript==
// @name         Translate DMM Detail
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       aoiZhime
// @include        *.dmm.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371699/Translate%20DMM%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/371699/Translate%20DMM%20Detail.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var i ;
	var list_detail = document.getElementsByClassName("mg-b20");

	for(i=0; i<=list_detail.length; i++){
        list_detail[i].innerHTML = list_detail[i].innerHTML.replace("種類",'Type');
        list_detail[i].innerHTML = list_detail[i].innerHTML.replace("対応デバイス",'อุปกรณ์ที่รองรับ');
        list_detail[i].innerHTML = list_detail[i].innerHTML.replace("配信開始日",'Delivery start date');
        list_detail[i].innerHTML = list_detail[i].innerHTML.replace("商品",'Product ');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("発売日",'Release Date');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("収録時間",'Duration');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("出演者",'actor');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("監督",'Director');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("シリーズ",'series');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("メーカー",'Maker');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("レーベル",'Label');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("ジャンル",'Genre');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("品番",'Part number');
		list_detail[i].innerHTML = list_detail[i].innerHTML.replace("平均評価",'Average rating');
	}

})();