// ==UserScript==
// @name         [選課後台] 自動選擇xfit418永和店 v1.2
// @namespace    https://www.facebook.com/airlife917339
// @version      1.2
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      airlife917339
// @match        http://www.xline.com.tw/X-Fit_Studio/x-jump/login.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444638/%5B%E9%81%B8%E8%AA%B2%E5%BE%8C%E5%8F%B0%5D%20%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87xfit418%E6%B0%B8%E5%92%8C%E5%BA%97%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/444638/%5B%E9%81%B8%E8%AA%B2%E5%BE%8C%E5%8F%B0%5D%20%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87xfit418%E6%B0%B8%E5%92%8C%E5%BA%97%20v12.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 自動選擇xfit418永和店
    document.querySelector("select[name=custid]")[22].selected = 'selected';
    
    // 加入感謝文
    let tr = document.createElement("tr")
    document.querySelector('#login > tbody > tr:nth-child(1)').after(tr);
    document.querySelector('#login > tbody > tr:nth-child(2)').innerHTML = '<td width="98" height="28" align="right" valign="top"></td><td width="302" align="left" valign="top"><lable type="text" style="color:red;">Kevin已經幫你選好了，不用客氣！</lable></td>';
    
    // 調整行距
    document.querySelector('#login > tbody > tr:nth-child(1) > td:nth-child(1)').height = '28';

})();