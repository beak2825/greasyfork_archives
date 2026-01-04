// ==UserScript==
// @name         set default description template for jira issue
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Just a simple util to to make submitting bug easier
// @author       You
// @match        *://*.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373083/set%20default%20description%20template%20for%20jira%20issue.user.js
// @updateURL https://update.greasyfork.org/scripts/373083/set%20default%20description%20template%20for%20jira%20issue.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    $("body").click(function() {
        if ($("#description") && $("#description").html().trim() == "") {
            $("#description").html("* h2.Precondition\n" +
                "** Account：\n" +
                "** Password：\n" +
                "** Page URL：\n" +
                "\n" +
                "* h2.Reproduce Steps:\n" +
                "# \n" +
                "# \n" +
                "\n" +
                "* h2.Expect Result:\n" +
                "\n" +
                "\n" +
                "{color:#d04437}* h2.Actual Result:{color}\n" +
                "\n" +
                "\n" +
                "\n");
        }
    });
})();
    
    
    
    
    
    