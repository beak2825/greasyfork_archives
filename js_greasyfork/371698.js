// ==UserScript==
// @name         Translate DMM Menu&Sort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       aoiZhime
// @include        *.dmm.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371698/Translate%20DMM%20MenuSort.user.js
// @updateURL https://update.greasyfork.org/scripts/371698/Translate%20DMM%20MenuSort.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var i ;
	var list_title1 = document.getElementsByClassName("list-lcol sort");
	var list_sort = document.getElementsByClassName("list-lcol sort");
	for(i = 0; i<=list_title1.length; i++){
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("デバイス",'Device');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("範囲",'Range');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("並び替え",'Sort');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("配信形式",'Delivery format');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("価格",'Price');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("メディア",'Media');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("テレビ",'TV Set');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("全て",'All');
        list_title1[i].innerHTML = list_title1[i].innerHTML.replace("全て",'All');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("ストリーミング",'Streaming');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("ダウンロード",'download');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("HD版ダウンロード",'HD version download');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("300円以下",'ต่ำกว่า 300 เยน');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("500円以下",'ต่ำกว่า 500 เยน');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("1000円以下",'ต่ำกว่า 1000 เยน');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("2000円以下",'ต่ำกว่า 2000 เยน');
		list_title1[i].innerHTML = list_title1[i].innerHTML.replace("2001円以上",'ต่ำกว่า 2001 เยน');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("全て",'All');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("全商品",'All goods');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("DMM通販",'DMM mail order');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("予約可能商品",'Available items');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("発売済み商品",'วางจำหน่ายแล้ว');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("即納商品",'Instant delivery');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("マーケットプレイス",'market place');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("人気順",'ตามความนิยม');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("新着順",'ตามวันที่');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("評価順",'ตามลำดับคะแนน');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("Priceの安い順",'ราคาถูกที่สุด');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("価格の高い順",'ถูกที่สุดก่อน');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("価格の安い順",'แพงที่สุดก่อน');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("売上げ本数順",'ตามจำนวนการขาย');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("評価の高い順",'ตามลำดับคะแนนจากมากไปน้อย');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("お気に入り数順",'ตามจำนวนความชอบ');
		list_sort[i].innerHTML = list_sort[i].innerHTML.replace("商品発売日順",'ตามวันวางจำหน่าย');
	}
})();