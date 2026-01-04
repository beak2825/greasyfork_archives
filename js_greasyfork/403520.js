// ==UserScript==
// @name         PVZ
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.3
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/*
// @grant        none
//@icon          https://thumb.cloud.mail.ru/weblink/thumb/xw1/EsUR/Dc9PP2yoQ/PVZ.jpg?x-email=f_tyutin%40list.ru
// @downloadURL https://update.greasyfork.org/scripts/403520/PVZ.user.js
// @updateURL https://update.greasyfork.org/scripts/403520/PVZ.meta.js
// ==/UserScript==

function FindPVZ() {
   var text = 'CD', // поиск переменной text в блоке class='user-content-block'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[class='user-content-block']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/CD17OCTVR/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/PVZ/CD17OCTVR_DWRCC.vbs" target="_blank"> CD17OCTVR (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=CD17OCTVR" target="_blank">Найти на карте</a>')
document.querySelector("[class='user-content-block']").innerHTML = document.querySelector("[class='user-content-block']").innerHTML.replace(/CD18OCTVR/ig, '<a href="ftp://User:pass@jiraozon.ddns.net/FTP/DWRCC/PVZ/CD18OCTVR_DWRCC.vbs" target="_blank"> CD18OCTVR (DWRCC)</a> >>> <a href="https://script.google.com/a/ozon.ru/macros/s/AKfycbyCXB-89BYqWG1MEb-ctd7N6TzrFPh-vj74bYTs7-zlWxr6ekc/exec?pc=CD18OCTVR" target="_blank">Найти на карте</a>')

}};
setTimeout(FindPVZ, 100);