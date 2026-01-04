// ==UserScript==
// @name         New FGO-Material Thai Version
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://fgosimulator.webcrow.jp/Material/
// @grant        none
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/372468/New%20FGO-Material%20Thai%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/372468/New%20FGO-Material%20Thai%20Version.meta.js
// ==/UserScript==


//--Main Variable--
var button_name = ["登録","全解除","説明書","MyChaldea","結果表示"];
var button_nameTH = ["ล้าง","ข้อมูลทั้งหมด","วิธีใช้งาน","My Chaldea","แสดงสรุปผล"];
var jp_title = ["サーヴァント検索","サーヴァント逆引き検索","サーヴァントステータス検索","霊基再臨","スキル強化"];
var th_title = ['ค้นหาเซอเวนท์','ค้นหาเซอเวนท์ด้วยไอเทม','ค้นหาเซอเวนท์ด้วยสเตตัส','ปลดเพดานเลเวล','อัพเลเวลสกิล'];
var i;
//--End Main Variable--

//--Special Variable--
var b1= $("button#add-servant2").text();
var b2= $("button#add-reverse").text();
var b3= $("button#add-status").text();
var b4=$("span.select-title").text();
var b5=$("span.reverse-title").text();
var b6=$("span.status-title").text();
var b7=$("span.result_title").text();
var b8=$("label.Result").text();
var b9=$("label.Ascention").text();
var b10=$("label.skillReinforce").text();
//--End Special Variable--

//--Main Loop--
$("button").each(function() {
for (i = 0; i < button_name.length; i++) {
    var text = $(this).text();
    $(this).text(text.replace(button_name[i], button_nameTH[i]));}
});
//--End Main Loop--

//--Sub Main--
$("button#add-servant2").text(b1.replace("検索","เพิ่มเซอเวนท์"));
$("button#add-reverse").text(b2.replace("逆引き検索","ค้นหาด้วยไอเทม"));
$("button#add-status").text(b3.replace("ステータス検索","ค้นหาตามสเตตัส"));
$("span.select-title").text(b4.replace(jp_title[0],th_title[0]));
$("span.reverse-title").text(b5.replace(jp_title[1],th_title[1]));
$("span.status-title").text(b6.replace(jp_title[2],th_title[2]));
$("span.result_title").text(b7.replace("結果表示","สรุปผล"));
$("label.Result").text(b8.replace("計算結果","ที่ต้องใช้ทั้งหมด"));
$("label.Ascention").text(b9.replace(jp_title[3],th_title[3]));
$("label.skillReinforce").text(b10.replace(jp_title[4],th_title[4]));
//--End Sub Main--

//--Edit CSS--
$(".tools button").css({"padding":" ","margin":"3"});
$("button#all-clear,button#add-reverse").css({"padding-left":"9","padding-right":"9"});
$("button#add-status").css({"padding-left":"3","padding-right":"3"});
$("button#inventory-setting").css({"padding-left":"5","padding-right":"5"});
$("label.result").css({"width":"106"});
$("label.Ascention").css({"width":"112"});
$("span.select-title,span.reverse-title,span.status-title,span.result_title").css({"font-size":"200%"});

$(document).ready(function(){
    $("*").css("font-family", 'Kanit,ヒラギノ角ゴシック,Hiragino Sans,ヒラギノ角ゴ ProN W3,Hiragino Kaku Gothic ProN,メイリオ,arial,sans-serif');
});
//--End Edit CSS--