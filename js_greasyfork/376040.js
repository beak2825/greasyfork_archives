// ==UserScript==
// @name         Click here to logout clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://onlinebooking.sand.telangana.gov.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376040/Click%20here%20to%20logout%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/376040/Click%20here%20to%20logout%20clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intId = setInterval(function(){
    if($("#ccMain_tblLogOut").get(0).style.display != "none") {
        $("#btnLogout").click();
        clearInterval(intId);
    }
    },200);
})();