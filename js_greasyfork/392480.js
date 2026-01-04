// ==UserScript==
// @name         eBay.de entfernen Price von-bis
// @namespace    KarlBaumann
// @version      1.0
// @description  Entfernen die Artikeln wo Preis ist von-bis
// @author       Karlis Baumanis
// @match        https://www.ebay.de/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392480/eBayde%20entfernen%20Price%20von-bis.user.js
// @updateURL https://update.greasyfork.org/scripts/392480/eBayde%20entfernen%20Price%20von-bis.meta.js
// ==/UserScript==

$(".DEFAULT,.prRange").parents("li.s-item,li.sresult").remove()