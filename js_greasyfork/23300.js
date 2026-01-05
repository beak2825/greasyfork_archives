// ==UserScript==
// @name         Lawrence Cripe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23300/Lawrence%20Cripe.user.js
// @updateURL https://update.greasyfork.org/scripts/23300/Lawrence%20Cripe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".panel-body:contains('Profile URLs are either included by clicking on')").length) {
        $(".panel.panel-primary").hide();
        console.log("Lawrence Cripe");
        var canName = $("td:contains('Name:')").next().html().replace("&amp;","and").replace("'","%27").split(",");
        var canCompany = $("td:contains('Company:')").next().html().replace("&amp;","and").replace("'","%27");
        console.log(canName[1] + " " + canName[0] + " " + canCompany);
        $("td:contains('Name:')").next().append("<a href='https://www.google.com/search?q=site:linkedin.com " + canName[1] + " " + canName[0] + " " + canCompany + "' target='_blank'>" + canName[1] + " " + canName[0] + " " + canCompany + "</a>");
       // $("#srch").on("click", function() {
       //    window.open("https://www.google.com/search?q=site:linkedin.com " + canName[1] + " " + canName[0] + " " + canCompany, "_blank");
       // });
        $("label:contains('LinkedIn Profile URL:')").append("<button type='button' id='notFound'>Not Found</button>");
        $("#notFound").on("click", function() {
           $("#web_url").val("http://UNMATCHED");
           $("#submitButton").click();
        });
    }


})();