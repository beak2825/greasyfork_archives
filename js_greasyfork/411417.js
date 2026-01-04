// ==UserScript==
// @name         No Munitions
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  check "no munitions" in Politics&War
// @author       pythonian23
// @match        https://politicsandwar.com/nation/war/groundbattle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411417/No%20Munitions.user.js
// @updateURL https://update.greasyfork.org/scripts/411417/No%20Munitions.meta.js
// ==/UserScript==

(function() {'use strict';(function() {document.getElementsByName("dontequip")[0].checked = true; console.log("ok")})();})();