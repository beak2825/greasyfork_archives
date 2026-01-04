// ==UserScript==
// @name         WS-TVR
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.4
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403528/WS-TVR.user.js
// @updateURL https://update.greasyfork.org/scripts/403528/WS-TVR.meta.js
// ==/UserScript==

function FindWSTVR() {
   var text = 'WS-TVR', // поиск переменной text в блоке class='user-content-block'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[class='user-content-block']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/WS-TVR-A0002/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/WS-TVR/WS-TVR-A0002_DWRCC.vbs" target="_blank"> WS-TVR-A0002 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=WS-TVR-A0002" target="_blank">Найти на карте</a>')
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/WS-TVR-A0001/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/WS-TVR/WS-TVR-A0001_DWRCC.vbs" target="_blank"> WS-TVR-A0001 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=WS-TVR-A0001" target="_blank">Найти на карте</a>')
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/WS-TVR-A0004/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/WS-TVR/WS-TVR-A0004_DWRCC.vbs" target="_blank"> WS-TVR-A0004 (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=WS-TVR-A0004" target="_blank">Найти на карте</a>')

}};
setTimeout(FindWSTVR, 100);