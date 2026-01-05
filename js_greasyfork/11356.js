// ==UserScript==
// @name       PDS Auto Submit
// @author Dormammu
// @version    10.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/11356/PDS%20Auto%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/11356/PDS%20Auto%20Submit.meta.js
// ==/UserScript==

var page = document.getElementById("mturk_form");
page.tabIndex = "0";
page.focus();

// Match select and submit hit
$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="Match"]').click();
                                            document.getElementById( "submitButton" ).click();
                         }
});

// No Match select and submit hit
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="Not Match"]').click();
                                            document.getElementById( "submitButton" ).click();
                         }
});
