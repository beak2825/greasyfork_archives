// ==UserScript==
// @name         TLS签证(小法国签证)
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  TLS签证辅助，自动刷新，空位提示，红色区分
// @author       Mrsir
// @match        https://*.tlscontact.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlscontact.com
// @grant        GM_addStyle
// @supportURL   https://baidu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460237/TLS%E7%AD%BE%E8%AF%81%28%E5%B0%8F%E6%B3%95%E5%9B%BD%E7%AD%BE%E8%AF%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460237/TLS%E7%AD%BE%E8%AF%81%28%E5%B0%8F%E6%B3%95%E5%9B%BD%E7%AD%BE%E8%AF%81%29.meta.js
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
            //window.alert('Full slot number:'+parseInt(list1.length));
            setTimeout(()=>{location.reload();},parseInt((Math.random()*(30-15)+15)*1000));
        }
        GM_addStyle('.container {max-width: fit-content !important;}');
        GM_addStyle('div.take_appointment,div.card {height: 1600px !important; width: 3000px !important;}');

    }

})();