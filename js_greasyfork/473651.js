// ==UserScript==
// @name         Quickfillin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fill in form quickly
// @author       myy
// @match        https://data.chinaaids.cn/SVEL/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473651/Quickfillin.user.js
// @updateURL https://update.greasyfork.org/scripts/473651/Quickfillin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义关键词
    var keyword = "一个感染了艾滋病病毒的人能从外表上看出来吗";

    // 获取页面内容
    var pageContent = document.body.textContent;

    // 判断页面内容中是否包含关键词
    if (pageContent.includes(keyword)) {
        // 确保页面已加载完毕再运行脚本
        setTimeout(function() {
            document.querySelector('#inquiryName').value = "梅倩云";
            document.querySelector('#custodian').value = "闵敏";
//            document.querySelector('#potZcodeShow').value = "32040000";
//            var select = document.getElementById('sdcZoneorg_searchZone-orgcode').getElementsByTagName("select")[0];
//            select.selectedIndex = 1;
            var select = document.querySelector('#b04').getElementsByTagName("select")[0];
            select.selectedIndex = 1;

            // c01-c03 no
            for (var i=1;i<4;i++)
            {
                var check = document.querySelector('#c0'+i).querySelector('#bmgroup-0');
                check.checked = true;
            }

            // c04-c09 yes
            for (i=4;i<10;i++)
            {
                check = document.querySelector('#c0'+i).querySelector('#bmgroup-1');
                check.checked = true;
            }
            // a06 1
            check = document.querySelector('#a06').getElementsByTagName("input")[0];
            check.checked = true;
            // b02 1
            check = document.querySelector('#b02').getElementsByTagName("input")[0];
            check.checked = true;
            // b03 1
            check = document.querySelector('#b03').getElementsByTagName("input")[0];
            check.checked = true;
            // d01 no
            check = document.querySelector('#d01').querySelector('#bmgroup-0');
            check.click();
            // e01 no
            check = document.querySelector('#e01').getElementsByTagName("input")[1];
            check.click();
            // f01-f02 no
            for (i=1;i<3;i++)
            {
                check = document.querySelector('#f0'+i).querySelector('#bmgroup-0');
                check.checked = true;
            }
            // g01 no
            check = document.querySelector('#g01').querySelector('#bmgroup-0');
            check.click();
            // h01 yes
            check = document.querySelector('#h01').querySelector('#bmgroup-1');
            check.checked = true;
            // h02-h03 no
            for (i=2;i<4;i++)
            {
                check = document.querySelector('#h0'+i).querySelector('#bmgroup-0');
                check.checked = true;
            }
            // t01 yes
            check = document.querySelector('#t01').querySelector('#bmgroup-1');
            check.checked = true;
            // t02A t03A t04A t05A no
            for (i=2;i<6;i++)
            {
                check = document.querySelector('#t0'+i+'A').getElementsByTagName("input")[1];
                check.click();
            }
        },500);
    }
})();
