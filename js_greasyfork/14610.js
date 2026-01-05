// ==UserScript==
// @name         Speedport Hybrid Engineer
// @namespace    http://www.router-faq.de/index.php?id=spinfo&hws=speedporthybrid#speedporthybrid
// @version      0.1
// @description  fügt einen Link ins Hauptmenü des Speedport Hybrid ein um das Engineer Menü aufzurufen
// @author       Tilo Brandenburger
// @match        http://speedport.ip/html/content/*
// @match        http://192.168.2.1/html/content/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14610/Speedport%20Hybrid%20Engineer.user.js
// @updateURL https://update.greasyfork.org/scripts/14610/Speedport%20Hybrid%20Engineer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var div = document.getElementById("mn_05");
if (div) {
    div.className = "";
    div.removeAttribute('id');
    div.innerHTML = "<a href='../../../engineer/html/dsl.html?lang=de' class='mainnav_middle' id='mn_05'><img src='../../../images/icons/settings_30x30.png' width='30' height='30' alt='Engineer'><span>Engineer</span></a>";
}