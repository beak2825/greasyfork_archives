// ==UserScript==
// @name         Leo skipper
// @namespace    leo_skipper
// @version      0.1
// @description  Pour les flemmards
// @author       guzzyLPB
// @match        https://www.connexion.enthdf.fr/*
// @match        https://connexion.enthdf.fr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/411189/Leo%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/411189/Leo%20skipper.meta.js
// ==/UserScript==

//https://enthdf.fr/auth/login?callback=%2Fcas%2Flogin%3Fservice%3Dhttp%253A%252F%252F195.221.154.111%252Feleve.html

(function () {
	'use strict';
	top.location.replace("https://enthdf.fr/auth/login");
})();