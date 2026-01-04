// ==UserScript==
// @name         PRODUCT
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.4
// @description  Подключение к ПК со страницы JIRA | Поиск места на карте в google sheets
// @author       techsupport
// @match        https://jira.ozon.ru/browse/SD911-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403518/PRODUCT.user.js
// @updateURL https://update.greasyfork.org/scripts/403518/PRODUCT.meta.js
// ==/UserScript==

function FindPRODUCT() {
   var text = 'PRODUCT', // поиск перггеменной text в блоке id='customfield_19303-val'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[id='customfield_19303-val']").innerHTML)) {
// Если есть совпадение, то выполнить это =>
    var reg = new RegExp(text, 'g');
//DWRCC
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT03TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT03TVR_DWRCC.ps1" target="_blank"> PRODUCT03TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT03TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT05TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT05TVR_DWRCC.ps1" target="_blank"> PRODUCT05TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT05TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT06TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT06TVR_DWRCC.ps1" target="_blank"> PRODUCT06TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT06TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT07TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT07TVR_DWRCC.ps1" target="_blank"> PRODUCT07TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT07TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT12TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT12TVR_DWRCC.ps1" target="_blank"> PRODUCT12TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT12TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT31TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT31TVR_DWRCC.ps1" target="_blank"> PRODUCT31TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT31TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT33TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT33TVR_DWRCC.ps1" target="_blank"> PRODUCT33TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT33TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT01TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT01TVR_DWRCC.ps1" target="_blank"> PRODUCT01TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT01TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT02TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT02TVR_DWRCC.ps1" target="_blank"> PRODUCT02TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT02TVR" target="_blank">Найти на карте</a>')
document.querySelector("[id='customfield_19303-val']").innerHTML = document.querySelector("[id='customfield_19303-val']").innerHTML.replace(/PRODUCT09TVR/ig, '<a href="ftp://it27tvr/Jira/Windows/Product/PRODUCT09TVR_DWRCC.ps1" target="_blank"> PRODUCT09TVR</a> >>> <a href="https://script.google.com/macros/s/AKfycbxGIwhmNt8dF365NUpgyNcb5rNrJkSwwXcRHgL8y1hEJcX1nHdg/exec?pc=PRODUCT09TVR" target="_blank">Найти на карте</a>')

  }};
setTimeout(FindPRODUCT, 100);