// ==UserScript==
// @name         Slorum DingDong Checker
// @namespace    http://slorum.net/
// @version      0000-00-09
// @description  Hide posts and quotes from specific users for sanity protection, customize username/content in quoted posts to your hearts desire.
// @author       Fazer#103
// @match        https://slorum.org/*
// @match        https://slorum.net/*
// @match        https://workwebpage.com/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/528499/Slorum%20DingDong%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/528499/Slorum%20DingDong%20Checker.meta.js
// ==/UserScript==

// Hide direct posts by the user
var sanityCheck = document.getElementsByClassName("sparkywannabe");
for (var i = 0; i < sanityCheck.length; i++) {
    sanityCheck[i].style.display = "none";
}

// Hide quoted content if it's from "Sparky Wannabe", but keep "dingdong said:"
var quotes = document.querySelectorAll("div.quote"); // Select quote blocks
quotes.forEach(function(quote) {
    var quoteText = quote.innerHTML.trim();

    // Look for the username in the quote header
    if (quoteText.match(/<strong>Sparky Wannabe said:<\/strong>/i)) {
        // Change "Sparky Wannabe said:" to "dingdong said:"
        quote.innerHTML = quote.innerHTML.replace(/<strong>Sparky Wannabe said:<\/strong>/i, "<strong>dingdong said:</strong>");
        
        // Remove everything else inside the quote, including images
        quote.innerHTML = quote.innerHTML.split("<br><br>")[0] + "<br><br>k";
        
        // Remove images inside the quote
        var images = quote.querySelectorAll("img");
        images.forEach(img => img.remove());
    }
});
