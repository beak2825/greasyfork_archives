// ==UserScript==
// @name         Translate Amazon a little
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       aoiZhime
// @match        *.amazon.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371701/Translate%20Amazon%20a%20little.user.js
// @updateURL https://update.greasyfork.org/scripts/371701/Translate%20Amazon%20a%20little.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var i =0;
	var sort_main = document.getElementsByClassName("a-size-base");
	sort_main[i].innerHTML = sort_main[i].innerHTML.replace("並べ替え",'เรียงลำดับตาม');
	var list_sort = document.getElementsByClassName("a-spacing-top-mini");
	for(i = 0; i<=list_sort.length; i++){
	list_sort[i].innerHTML = list_sort[i].innerHTML.replace("キーワードに関連する商品",'ตามความเกี่ยวข้อง');
	list_sort[i].innerHTML = list_sort[i].innerHTML.replace("価格の安い順番",'ราคาถูกที่สุดก่อน');
	list_sort[i].innerHTML = list_sort[i].innerHTML.replace("価格の高い順番",'ราคาแพงที่สุดก่อน');
	list_sort[i].innerHTML = list_sort[i].innerHTML.replace("レビューの評価順",'ตามคะแนนรีวิว');
	list_sort[i].innerHTML = list_sort[i].innerHTML.replace("最新商品",'วางจำหน่ายล่าสุด');
	}

})();