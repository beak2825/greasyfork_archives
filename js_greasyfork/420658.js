// ==UserScript==
// @name         Změna fontu na start.auto.cz
// @namespace    StartAutoCzFont
// @version      1.0
// @description  Změní font na stránce start.auto.cz
// @author       Štěpán Hašler
// @match        *://start.auto.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420658/Zm%C4%9Bna%20fontu%20na%20startautocz.user.js
// @updateURL https://update.greasyfork.org/scripts/420658/Zm%C4%9Bna%20fontu%20na%20startautocz.meta.js
// ==/UserScript==

(function() {
    'use strict';
var s = document.createElement("style");
s.type = "text/css";
s.textContent = "* { font-family: calibri !important; }";
document.head.appendChild(s);
})();