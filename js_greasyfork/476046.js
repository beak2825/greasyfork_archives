// ==UserScript==
// @name         mteam 界面優化
// @namespace    http://tampermonkey.net/
// @version      2023.9.28
// @description  M-Team Blue Gene寬屏風格
// @author       You
// @match        https://xp.m-team.cc/*
// @match        https://xp.m-team.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.cc
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476046/mteam%20%E7%95%8C%E9%9D%A2%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476046/mteam%20%E7%95%8C%E9%9D%A2%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==
'use strict';
(function() {
    var style = document.createElement("style");
    var url = window.location.href;
    var text = document.createTextNode("table.mainouter {width: 100%;} table.main {width: 98%;} table table:nth-child(2) {width: 100%;}");

    style.type = "text/css";
            if(url.indexOf("details.php") >= 0 ){
                text = document.createTextNode("table.mainouter {width: 100%;} table.main {width: 98%;} table table:nth-child(2) {width: 100%;} td.rowhead:nth-child(1) {width: 8%;} .mg-b20 {width: 550px !important;}");
        }else{
        }
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();