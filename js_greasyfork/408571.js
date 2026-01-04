// ==UserScript==
// @name         esse script mostra o ping :D
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mostra o ping
// @author       hi oi
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408571/esse%20script%20mostra%20o%20ping%20%3AD.user.js
// @updateURL https://update.greasyfork.org/scripts/408571/esse%20script%20mostra%20o%20ping%20%3AD.meta.js
// ==/UserScript==
$("#consentBlock").css({display: "none"});
const pingDisplay = $("#pingDisplay");
pingDisplay.css("top", "3px");
pingDisplay.css("display", "block");
$("body").append(pingDisplay);
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
window.onbeforeunload = null;
let mouseX;
(function() {
})();