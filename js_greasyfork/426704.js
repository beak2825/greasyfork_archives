// ==UserScript==
// @name         略過網課審核機制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  略過可惡的新興網課審核機制
// @author       我
// @match        *eclass.hshs.tyc.edu.tw/index.php?do=learnView*
// @icon         https://live.staticflickr.com/65535/51188402747_ec94ceae3b_m.jpg
// @grant        none
// @require https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @downloadURL https://update.greasyfork.org/scripts/426704/%E7%95%A5%E9%81%8E%E7%B6%B2%E8%AA%B2%E5%AF%A9%E6%A0%B8%E6%A9%9F%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/426704/%E7%95%A5%E9%81%8E%E7%B6%B2%E8%AA%B2%E5%AF%A9%E6%A0%B8%E6%A9%9F%E5%88%B6.meta.js
// ==/UserScript==

setTimeout(function(){
    confirm_seconds = 99999
    alert("請在"+confirm_seconds+"秒內，點選提示畫面右下角按鈕，確保學習記錄。\n\n注意事項：\n１.從現在就開始計時數了\n２.現在可以掛著網頁了\n３.可以不用撥放影片\n４.請自己計算經過的時間\n時間到了請記得按「學習結束，請點此按鈕，方可記錄學習時間。」的按鈕\n５.請不要再另外開啟其他的網課影片，這樣會導致時間重計，\n６.不要關閉網頁");
}, 3000);

