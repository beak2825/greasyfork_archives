// ==UserScript==
// @name     iSAMS Email CC Script
// @match    *https://isams.abingdon.org.uk/modules/studentmanagement/communication/*
// @grant    none
// @description iSAMS CC field
// @Locale GB
// @version 0.0.1.20181029115530
// @namespace https://greasyfork.org/users/222245
// @downloadURL https://update.greasyfork.org/scripts/373740/iSAMS%20Email%20CC%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/373740/iSAMS%20Email%20CC%20Script.meta.js
// ==/UserScript==

var email = "mike.litchfield@abingdon.org.uk"
var checkExist = setInterval(function() {
    if (document.getElementById("email_txt_cc").value != email){

        document.getElementById("email_txt_cc").value=email;
    }

}, 1000); // check every 100ms