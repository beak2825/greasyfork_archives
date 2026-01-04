// ==UserScript==
// @name         TLS签证测试工具
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  TLS签证辅助工具测试
// @author       Mrsir
// @match        https://*.tlscontact.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlscontact.com
// @grant        GM_addStyle
// @supportURL   https://baidu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462397/TLS%E7%AD%BE%E8%AF%81%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/462397/TLS%E7%AD%BE%E8%AF%81%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function play() {
            var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
            audio.play();
        }

    function sleep(ms)
    {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (document.getElementsByClassName("form_status").length) {
        GM_addStyle('a.appt-table-btn.full {background-color: red;}');
        if (document.getElementsByClassName("appt-table-btn full").length < document.getElementsByClassName("appt-table-btn").length){
            window.alert("Available slot appears!");
            for (var c=0;c<3;c++)
            {
                setTimeout(()=>{play()},c*2000);
            }

        }
        else{
            var list1 = document.getElementsByClassName("appt-table-btn full");
            window.alert('Full slot number:'+parseInt(list1.length));
            setTimeout(()=>{location.reload();},parseInt((Math.random()*(30-15)+15)*1000));
        }
        GM_addStyle('.container {max-width: fit-content !important;}');
        GM_addStyle('div.take_appointment,div.card {height: 1600px !important; width: 3000px !important;}');

    }

})();