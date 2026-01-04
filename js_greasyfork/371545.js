// ==UserScript==
// @name         FGO-Material Thai Version
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://fgosimulator.webcrow.jp/Material/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371545/FGO-Material%20Thai%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/371545/FGO-Material%20Thai%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var mainManu = document.getElementById("all-clear") ;
	mainManu.innerHTML = mainManu.innerHTML.replace("登録",'ล้าง').replace("全解除",'ข้อมูลทั้งหมด');
	mainManu = document.getElementById("show-inst") ;
	mainManu.innerHTML = mainManu.innerHTML.replace("説明書",'วิธีใช้งาน');
	mainManu = document.getElementById("add-servant2") ;
	mainManu.innerHTML = mainManu.innerHTML.replace("検索",'เพิ่มเซอเวนท์');
	mainManu = document.getElementById("add-reverse") ;
	mainManu.innerHTML = mainManu.innerHTML.replace("逆引き",'ค้นหา').replace("検索",'ด้วยไอเทม');
	mainManu = document.getElementById("add-status") ;
	mainManu.innerHTML = mainManu.innerHTML.replace("ステータス",'ค้นหา').replace("検索",'ด้วยสเตตัส');
	mainManu = document.getElementById("modal-open") ;
	mainManu.innerHTML = mainManu.innerHTML.replace("結果表示",'แสดงสรุปผล');

	var titleName = document.getElementsByClassName("select-servant-title");
	titleName[0].innerHTML = titleName[0].innerHTML.replace("サーヴァント検索",'ค้นหาเซอเวนท์');
	titleName[0].innerHTML = titleName[0].innerHTML.replace("サーヴァント逆引き検索",'ค้นหาเซอเวนท์ด้วยไอเทม');
	titleName[0].innerHTML = titleName[0].innerHTML.replace("サーヴァントステータス検索",'ค้นหาเซอเวนท์ด้วยสเตตัส');

	var strMessage1 = document.getElementsByClassName("check-title");
	strMessage1[0].innerHTML = strMessage1[0].innerHTML.replace("確認",'ยืนยันการลบ');

    var upAscention = document.getElementsByClassName("Ascention");
    upAscention[0].innerHTML = upAscention[0].innerHTML.replace("霊基再臨",'ปลดเพดานเลเวล');
    var upSkill = document.getElementsByClassName("skillReinforce");
    upSkill[0].innerHTML = upSkill[0].innerHTML.replace("スキル強化",'อัพเลเวลสกิล');

    var result_title = document.getElementsByClassName("result_title");
    result_title[0].innerHTML = result_title[0].innerHTML.replace("結果表示",'สรุปผล');
    var result_table = document.getElementsByClassName("result-menu");
    result_table[0].innerHTML = result_table[0].innerHTML.replace("計算結果",'ที่ต้องใช้ทั้งหมด');
    result_table[0].innerHTML = result_table[0].innerHTML.replace("不足分",'ที่ต้องการ');
    result_table[0].innerHTML = result_table[0].innerHTML.replace("使用済",'ถ้าใช้ทั้งหมด');
})();