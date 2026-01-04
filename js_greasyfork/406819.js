// ==UserScript==
// @name        RPI SIS Autofill
// @namespace   Violentmonkey Scripts
// @match       https://sis.rpi.edu/*
// @grant       none
// @version     1.1
// @description Makes the User ID recognizable by browser autofill. Tested with LastPass on Firefox.
// @author      bitzer
// @description 8/31/2020, 7:29:54 PM
// @downloadURL https://update.greasyfork.org/scripts/406819/RPI%20SIS%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/406819/RPI%20SIS%20Autofill.meta.js
// ==/UserScript==


var idField = document.getElementById("UserID");
idField.type = "username";