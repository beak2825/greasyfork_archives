// ==UserScript==
// @name       Paywal killer for Zero Hora
// @namespace  http://zh.clicrbs.com.br/*
// @version    0.1
// @description  Blocks the paywal from Zero Hora
// @include      http://zh.clicrbs.com.br/*
// @copyright  2014+, Sergio H. Schuler
// @downloadURL https://update.greasyfork.org/scripts/1731/Paywal%20killer%20for%20Zero%20Hora.user.js
// @updateURL https://update.greasyfork.org/scripts/1731/Paywal%20killer%20for%20Zero%20Hora.meta.js
// ==/UserScript==

function kill(elementName){
    var elementInQuestion = document.getElementById(elementName);
    elementInQuestion.parentNode.removeChild(elementInQuestion);
}

function changeInLineStyle() {
   	document.getElementsByTagName("BODY")[0].style.overflow="scroll"; 
}

window.onload = kill("paywall-wrapper");
window.onload = window.setTimeout(changeInLineStyle,1000);
