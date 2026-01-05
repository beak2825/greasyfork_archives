// ==UserScript==
// @name         Potwierdzenie wyjścia 
// @namespace    KROKIk
// @version      1
// @description  Niepozwala na niepożądane opuszczenie strony
// @author       KROKIk
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25864/Potwierdzenie%20wyj%C5%9Bcia.user.js
// @updateURL https://update.greasyfork.org/scripts/25864/Potwierdzenie%20wyj%C5%9Bcia.meta.js
// ==/UserScript==

window.onbeforeunload = function(){
  return 'Czy na pewno chcesz opuścić stronę?';
};

