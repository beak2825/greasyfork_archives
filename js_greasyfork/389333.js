// ==UserScript==
// @name         urbtix value
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ticket.urbtix.hk/internet/zh_TW/secure/event/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389333/urbtix%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/389333/urbtix%20value.meta.js
// ==/UserScript==

$('input:radio')[0].checked = true;

(function() {
 document.getElementById('ticket-quota-223-sel').value = "4";
})();


(function() {
 window.location.href="javascript:doExperssPurchase()";
})();