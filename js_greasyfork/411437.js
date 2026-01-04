// ==UserScript==
// @name         AntiABP-ESP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Anti ABP Español
// @author       @ncasolajimenez
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @match        https://elpais.com/*
// @match        https://www.abc.es/*
// @match        https://www.libertaddigital.com/*
// @downloadURL https://update.greasyfork.org/scripts/411437/AntiABP-ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/411437/AntiABP-ESP.meta.js
// ==/UserScript==

(function() {
    'use strict';
function elpais() {
$(".fc-ab-root").remove();
$("body").removeAttr("style");
}
function libertadigital() {
$(".blocker").remove();
$("body").removeAttr("style");
}
waitForKeyElements (
    ".fc-ab-root",
    elpais
);
waitForKeyElements (
    "#bloqueadorCompleto",
    libertadigital
);
})();