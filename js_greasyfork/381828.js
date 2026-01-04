// ==UserScript==
// @name new_makaba_tripcode
// @version 1.0
// @author porgamest
// @match https://2ch.hk/rf/
// @match https://2ch.hk/rf/*
// @grant none
// @description none
// @namespace https://greasyfork.org/users/176859
// @downloadURL https://update.greasyfork.org/scripts/381828/new_makaba_tripcode.user.js
// @updateURL https://update.greasyfork.org/scripts/381828/new_makaba_tripcode.meta.js
// ==/UserScript==

(function() {
'use strict';
$("label[for=e-mail]").text("Трипкод");
document.getElementById("e-mail").name = "name";
document.getElementById("e-mail").placeholder = "трипкод";
document.getElementById("qr-e-mail").name = "name";
document.getElementById("qr-e-mail").placeholder = "трипкод";
})();