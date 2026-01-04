// ==UserScript==
// @name         FamilyMart Shopee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動調整蝦皮出貨單
// @author       zxcasd
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @match        http://external2.shopee.tw/ext/familymart/OrdersPrint/OrdersPrint.aspx
// @match        https://external2.shopee.tw/ext/familymart/OrdersPrint/OrdersPrint.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380582/FamilyMart%20Shopee.user.js
// @updateURL https://update.greasyfork.org/scripts/380582/FamilyMart%20Shopee.meta.js
// ==/UserScript==
var fmimg = $("img")[0].src;
$("img").css("position","absolute");
$("img").css("margin","-5px");
$("img").css("clip","rect(7px ,50px ,35px,12px)");
$("img").css("left","-5px");
//條碼上
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(4px, 216px, 17px, 135px);top: 8px;left: -25px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(36px, 249px, 72px, 110px);top: -10px;left: -25px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(72px, 207px, 83px, 147px);top: -10px;left: -25px;-webkit-filter: brightness(0.8);'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(86px, 297px, 122px, 60px);top: -12px;left: -25px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(122px, 235px, 133px, 125px);top: -12px;left: -25px;-webkit-filter: brightness(0.8);'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(137px, 297px, 173px, 60px);top: -15px;left: -25px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(174px, 229px, 185px, 132px);top: -15px;left: -25px;-webkit-filter: brightness(0.8);'>");
//資料
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(192px, 123px, 208px, 10px);top: -21px;left: 0px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(192px, 300px, 208px, 214px);top: -21px;left: -18px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(215px, 123px, 230px, 10px);top: -27px;left: 0px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(238px, 123px, 257px, 10px);top: -36px;left: 0px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(265px, 70px, 278px, 10px);top: -44px;left: 0px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(265px, 172px, 278px, 90px);top: -44px;left: 0px;-webkit-filter: brightness(0.8);'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(285px, 94px, 300px, 10px);top: -50px;left: 0px;'>");
//qr
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(245px, 302px, 318px, 229px);top: -56px;left: -20px;'>");
//注意事項
var ww = 600;
var hh = (ww / 752) * 502;
$("form").append("<img src='" + fmimg + "' style='width: " + ww + "px;height: " + hh + "px;border: 0px;margin: -5px;position: absolute;clip: rect(259px, 77px, 272px, 9px);top: -8px;left: 2px;'>");
$("form").append("<img src='" + fmimg + "' style='width: " + ww + "px;height: " + hh + "px;border: 0px;margin: -5px;position: absolute;clip: rect(275px, 262px, 297px, 9px);top: -11px;left: 2px;'>");
$("form").append("<img src='" + fmimg + "' style='width: " + ww + "px;height: " + hh + "px;border: 0px;margin: -5px;position: absolute;clip: rect(300px, 250px, 322px, 9px);top: -15px;left: 2px;'>");
$("form").append("<img src='" + fmimg + "' style='width: " + ww + "px;height: " + hh + "px;border: 0px;margin: -5px;position: absolute;clip: rect(325px, 250px, 348px, 9px);top: -19px;left: 2px;'>");
//條碼下
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(437px, 292px, 474px, 53px);top: -109px;left: -25px;'>");
$("form").append("<img src='" + fmimg + "' style='border: 0px;margin: -5px;position: absolute;clip: rect(478px, 226px, 490px, 114px);top: -113px;left: -25px;-webkit-filter: brightness(0.8);'>");
