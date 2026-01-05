// ==UserScript==
// @name         Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clicks attack every second no matter how many autos you own.
// @author       Mike
// @match        http://tampermonkey.net/index.php?version=3.12.58&ext=dhdg&updated=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18120/Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/18120/Clicker.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

setInterval(function () {document.getElementById("attack-btn").click();}, 1000);