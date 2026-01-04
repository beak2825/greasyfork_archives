// ==UserScript==
// @name         ConnectBoxNoChecks
// @namespace    hddn.space
// @version      0.1
// @description  Disable ASCII and password strength checks for Unitymedia ConnectBox routers
// @author       Sebastian Stammler
// @match        http://192.168.0.1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376408/ConnectBoxNoChecks.user.js
// @updateURL https://update.greasyfork.org/scripts/376408/ConnectBoxNoChecks.meta.js
// ==/UserScript==

isVerifyASCII = function () {
    return true;
};

checkPasswordStrengthV2 = function () {
    return 3;
};