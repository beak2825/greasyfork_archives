// ==UserScript==
// @name         xju评教自动点击
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认一个良好，其他都是优秀。只有第二大题第四小题是良好.如果修改其他问题为良好，修改 #wdt_x_x_1为#wdt_x_x_2。
// @author       You
// @match        http://jwxt.xju.edu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=xju.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427149/xju%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/427149/xju%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //第一大题
    var btn = document.querySelector('#wdt_0_0_1');
    btn.click();
    var btn_2 = document.querySelector('#wdt_0_1_1');
    btn_2.click();
    var btn_3 = document.querySelector('#wdt_0_2_1');
    btn_3.click();
    var btn_4 = document.querySelector('#wdt_0_3_1');
    btn_4.click();

    //第2大题
    var btn_2_1 = document.querySelector('#wdt_1_0_1');
    btn_2_1.click();
    var btn_2_2 = document.querySelector('#wdt_1_1_1');
    btn_2_2.click();
    var btn_2_3 = document.querySelector('#wdt_1_2_1');
    btn_2_3.click();
    var btn_2_4 = document.querySelector('#wdt_1_3_2');
    btn_2_4.click();

    //第3大题
    var btn_3_1 = document.querySelector('#wdt_2_0_1');
    btn_3_1.click();
    var btn_3_2 = document.querySelector('#wdt_2_1_1');
    btn_3_2.click();
    var btn_3_3 = document.querySelector('#wdt_2_2_1');
    btn_3_3.click();
    var btn_3_4 = document.querySelector('#wdt_2_3_1');
    btn_3_4.click();

    //第4大题
     var btn_4_1 = document.querySelector('#wdt_3_0_1');
    btn_4_1.click();
     var btn_4_2 = document.querySelector('#wdt_3_1_1');
    btn_4_2.click();
    var btn_4_3 = document.querySelector('#wdt_3_2_1');
    btn_4_3.click();
    var btn_4_4 = document.querySelector('#wdt_3_3_1');
    btn_4_4.click();

    //第5
     var btn_5_1 = document.querySelector('#wdt_4_0_1');
    btn_5_1.click();
     var btn_5_2 = document.querySelector('#wdt_4_1_1');
    btn_5_2.click();
    var btn_5_3 = document.querySelector('#wdt_4_2_1');
    btn_5_3.click();
    var btn_5_4 = document.querySelector('#wdt_4_3_1');
    btn_5_4.click();




    // Your code here...
})();