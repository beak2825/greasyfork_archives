// ==UserScript==
// @name         PRINTERS
// @namespace    https://jira.ozon.ru/secure/RapidBoard.jspa?rapidView=99/
// @version      0.2
// @description  Принтеры
// @author       techsupport
// @match        https://jira.ozon.ru/browse/*
// @grant        none
// @icon         https://cloclo19.datacloudmail.ru/weblink/view/EDwW/bv7MVrZg6?etag=B49F49908691572A732191FBC6A15E4ADBE65D99
// @downloadURL https://update.greasyfork.org/scripts/403670/PRINTERS.user.js
// @updateURL https://update.greasyfork.org/scripts/403670/PRINTERS.meta.js
// ==/UserScript==

function Find() {
   var text = '', // поиск переменной text в блоке class='user-content-block'
      regexp = new RegExp(text, 'i');

  if (regexp.exec(document.querySelector("[class='user-content-block']").innerHTML)) {
// Если есть совпадение, то выполнить действие =>
    var reg = new RegExp(text, 'g');
//ПРИНТЕРЫ


      }};
setTimeout(Find, 100);