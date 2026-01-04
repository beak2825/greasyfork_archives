// ==UserScript==
// @name         Hokejový zápis
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Přesměruje detail do PDF na hokejovyzapis.cz.
// @author       MK
// @match        https://hokejovyzapis.cz/admin/schedule/match/detail/*
// @icon         https://www.hokej.cz/images/logo/logo.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458739/Hokejov%C3%BD%20z%C3%A1pis.user.js
// @updateURL https://update.greasyfork.org/scripts/458739/Hokejov%C3%BD%20z%C3%A1pis.meta.js
// ==/UserScript==

(function myFunction() {
'use strict';
var link = location.href;
var matchID = link.match(/[0-9]+/);
location.replace("https://hokejovyzapis.cz/pdf/print/cs-html/" + matchID);
})();