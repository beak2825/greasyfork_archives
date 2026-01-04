// ==UserScript==
// @name         CCD
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.4
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/SD911-*
// @grant        none
//@icon          https://cloclo24.datacloudmail.ru/weblink/view/9vdu/qgrqijfFg?etag=3B7A253A20362287E23F4DE44AEB9697F35266A4
// @downloadURL https://update.greasyfork.org/scripts/403510/CCD.user.js
// @updateURL https://update.greasyfork.org/scripts/403510/CCD.meta.js
// ==/UserScript==

function FindCCD() {
   var text = 'CCD', // поиск переменной text в блоке id='customfield_19303-val'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[id='customfield_19303-val']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD01NBTVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD01NBTVR_DWRCC.ps1" target="_blank"> CCD01NBTVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD01NBTVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD01TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD01TVR_DWRCC.ps1" target="_blank"> CCD01TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD01TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD02NBTVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD02NBTVR_DWRCC.ps1" target="_blank"> CCD02NBTVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD02NBTVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD02TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD02TVR_DWRCC.ps1" target="_blank"> CCD02TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD02TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD03TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD03TVR_DWRCC.ps1" target="_blank"> CCD03TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD03TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD04NBTVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD04NBTVR_DWRCC.ps1" target="_blank"> CCD04NBTVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD04NBTVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD04TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD04TVR_DWRCC.ps1" target="_blank"> CCD04TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD04TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD05TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD05TVR_DWRCC.ps1" target="_blank"> CCD05TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD05TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD06TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD06TVR_DWRCC.ps1" target="_blank"> CCD06TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD06TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD08TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD08TVR_DWRCC.ps1" target="_blank"> CCD08TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD08TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD09TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD09TVR_DWRCC.ps1" target="_blank"> CCD09TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD09TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD11TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD11TVR_DWRCC.ps1" target="_blank"> CCD11TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD11TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/CCD12TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Ccd/CCD12TVR_DWRCC.ps1" target="_blank"> CCD12TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=CCD12TVR" target="_blank">Найти на карте</a>')


}};
setTimeout(FindCCD, 100);