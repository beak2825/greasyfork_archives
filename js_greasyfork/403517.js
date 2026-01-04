// ==UserScript==
// @name         NB-TVR
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.3
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/*
// @grant        none
//@icon          https://cloclo23.datacloudmail.ru/weblink/view/GYub/FQrGbVgs7?etag=0007E3F8207645047B129004B87E46F325E784AE
// @downloadURL https://update.greasyfork.org/scripts/403517/NB-TVR.user.js
// @updateURL https://update.greasyfork.org/scripts/403517/NB-TVR.meta.js
// ==/UserScript==

function FindNBTVR() {
   var text = 'NB-TVR', // поиск переменной text в блоке class='user-content-block'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[class='user-content-block']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/NB-TVR-A0008/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/NB-TVR/NB-TVR-A0008_DWRCC.vbs" target="_blank"> NB-TVR-A0008 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=NB-TVR-A0008" target="_blank">Найти на карте</a>')
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/NB-TVR-A0003/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/NB-TVR/NB-TVR-A0003_DWRCC.vbs" target="_blank"> NB-TVR-A0003 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=NB-TVR-A0003" target="_blank">Найти на карте</a>')
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/NB-TVR-A0006/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/NB-TVR/NB-TVR-A0006_DWRCC.vbs" target="_blank"> NB-TVR-A0006 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=NB-TVR-A0006" target="_blank">Найти на карте</a>')
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/NB-TVR-A0001/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/NB-TVR/NB-TVR-A0001_DWRCC.vbs" target="_blank"> NB-TVR-A0001 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbwaFaDr1Qgfo83h8BiPMRPrBNM-3QToX3LaKr9tCiORY1hyOoE/exec?pc=NB-TVR-A0001" target="_blank">Найти на карте</a>')

}};
setTimeout(FindNBTVR, 100);