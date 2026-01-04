// ==UserScript==
// @name         MEETING
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.4
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/SD911-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403516/MEETING.user.js
// @updateURL https://update.greasyfork.org/scripts/403516/MEETING.meta.js
// ==/UserScript==

function FindMEETING() {
   var text = 'MEETING', // поиск переменной text в блоке id='customfield_19303-val'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[id='customfield_19303-val']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING01TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING01TVR_DWRCC.ps1" target="_blank"> MEETING01TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING01TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING02TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING02TVR_DWRCC.ps1" target="_blank"> MEETING02TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING02TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING03TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING03TVR_DWRCC.ps1" target="_blank"> MEETING03TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING03TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING04TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING04TVR_DWRCC.ps1" target="_blank"> MEETING04TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING04TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING05TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING05TVR_DWRCC.ps1" target="_blank"> MEETING05TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING05TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING06TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING06TVR_DWRCC.ps1" target="_blank"> MEETING06TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING06TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING07TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING07TVR_DWRCC.ps1" target="_blank"> MEETING07TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING07TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING08TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING08TVR_DWRCC.ps1" target="_blank"> MEETING08TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING08TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/MEETING13TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Meeting/MEETING13TVR_DWRCC.ps1" target="_blank"> MEETING13TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxf3I49v_FABuCm4eRBw2FoH8baB_wP05lh5_Traonh3cWKfC94/exec?pc=MEETING13TVR" target="_blank">Найти на карте</a>')

}};
setTimeout(FindMEETING, 100);