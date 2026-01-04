// ==UserScript==
// @name         NCHU 自動填入驗證碼
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  NCHU 各系統自動填入驗證碼小工具
// @author       aa2468291
// @match https://onepiece.nchu.edu.tw/cofsys/plsql/acad_home_eng
// @match https://onepiece.nchu.edu.tw/cofsys/plsql/acad_home
// @match https://onepiece2-sso.nchu.edu.tw/cofsys/plsql/acad_home2
// @match https://onepiece2-sso.nchu.edu.tw/cofsys/plsql/acad_home
// @match https://onepiece2-sso.nchu.edu.tw/ps/plsql/m_stua
// @match https://onepiece2-sso.nchu.edu.tw/ps/plsql/m_stua_c
// @match https://onepiece.nchu.edu.tw/ps/plsql/m_stua
// @match https://idp.nchu.edu.tw/nidp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470214/NCHU%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E9%A9%97%E8%AD%89%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/470214/NCHU%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5%E9%A9%97%E8%AD%89%E7%A2%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function AAS_code_filled() {
        setInterval(function () {
            let AAS_vad_element = document.querySelector('[name="vad"]');
            AAS_vad_element.value = validate;
        }, 300);
        console.log("教務資訊系統驗證碼已填入");
    }

    function SAS_code_filled() {
        setInterval(function () {
            let SAS_vad_element = document.querySelector('[name="vad"]');
            SAS_vad_element.value = validate;
        }, 300);
        console.log("學務資訊系統驗證碼已填入");
    }
        function portal_code_filled() {
        setInterval(function () {
            let portal_vad_element = document.querySelector('[name="inputCode"]');
            portal_vad_element.value = code;
        }, 300);
        console.log("單簽系統驗證碼已填入");
    }

    // 獲取當前網頁的URL
    let currentURL = window.location.href;

    // 定義正則表達式的pattern
    let AAS_pattern = /^https:\/\/onepiece(?:2-sso)?\.nchu\.edu\.tw\/cofsys\/plsql\/acad_home/;
    let SAS_pattern = /^https:\/\/onepiece\.nchu\.edu\.tw\/ps\/plsql\//;
    let portal_pattern = /^https:\/\/idp\.nchu\.edu\.tw\/nidp/;


    // 檢測URL是否符合各系統
    if (AAS_pattern.test(currentURL)) {
        console.log("這是NCHU教務資訊系統");
        // 執行驗證碼填入
        AAS_code_filled();
    }
    else if (SAS_pattern.test(currentURL)){
        console.log("這是NCHU學務資訊系統");
        // 執行驗證碼填入
        SAS_code_filled();
    }
    else if (portal_pattern.test(currentURL)){
        console.log("這是NCHU單簽入口");
        // 執行驗證碼填入
        portal_code_filled();
    }
    else{
        console.log("好像沒有找到相對應的網站QQ");
    }


})();