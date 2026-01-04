// ==UserScript==
// @name         STD
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.4
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/SD911-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403526/STD.user.js
// @updateURL https://update.greasyfork.org/scripts/403526/STD.meta.js
// ==/UserScript==

function FindSTD() {
   var text = 'STD', // поиск переменной text в блоке id='customfield_19303-val'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[id='customfield_19303-val']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/STD03TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Std/STD03TVR_DWRCC.ps1" target="_blank"> STD03TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=STD03TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/STD04TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Std/STD04TVR_DWRCC.ps1" target="_blank"> STD04TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=STD04TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/STD05TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Std/STD05TVR_DWRCC.ps1" target="_blank"> STD05TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=STD05TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/STD07TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Std/STD07TVR_DWRCC.ps1" target="_blank"> STD07TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=STD07TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/STD08TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Std/STD08TVR_DWRCC.ps1" target="_blank"> STD08TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=STD08TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/STD10TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Std/STD10TVR_DWRCC.ps1" target="_blank"> STD10TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=STD10TVR" target="_blank">Найти на карте</a>')

}};
setTimeout(FindSTD, 100);