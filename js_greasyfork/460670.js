// ==UserScript==
// @name         TLS签证-silent版
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  TLS签证辅助，自动刷新，空位提示，红色区分
// @author       Mrsir
// @match        https://*.tlscontact.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlscontact.com
// @grant        GM_addStyle
// @supportURL   https://baidu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460670/TLS%E7%AD%BE%E8%AF%81-silent%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460670/TLS%E7%AD%BE%E8%AF%81-silent%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementsByClassName("form_status").length) {
        GM_addStyle('a.appt-table-btn.full {background-color: red;}');
        if (document.getElementsByClassName("appt-table-btn full").length < document.getElementsByClassName("appt-table-btn").length){
            window.alert("Available slot appears!");
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