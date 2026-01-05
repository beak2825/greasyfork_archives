// ==UserScript==
// @name         Hidden Link Detector
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.4.2
// @description  Highlights hidden links
// @author       Croned
// @include      https://epicmafia.com/*
// @exclude      https://epicmafia.com/game/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11623/Hidden%20Link%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/11623/Hidden%20Link%20Detector.meta.js
// ==/UserScript==
var scan;

GM_xmlhttpRequest({method: "GET", url: "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js", onload: function(data) {
    eval(data.responseText);
    scan = function() {
        $("a").each(function() {
            linkUrl = $(this).attr("href") || "";
            linkText = $(this).text() || "";
            if (linkUrl.indexOf("javascript:") >= 0) {
                var jsCode = linkUrl.replace("javascript:", "");
                $(this).css("background-color", "#FF9494");
                $(this).attr("title", "WARNING, this link contains javascript that could harm you: " + jsCode);
                console.log("HLD: Threat detected!");
            }
            else if (linkText.indexOf("http") >= 0 && linkText.indexOf(" ") < 0 && linkText != linkUrl) {
                $(this).css("background-color", "#FFFF9D");
                $(this).attr("title", "The real destination of this link is " + linkUrl);
                console.log("HLD: Threat detected!");
            }
        });
    }
    scan();
    
    var previousHTML = $("html").html();

    setInterval(function() {
        var currentHTML = $("html").html();
        if (previousHTML != currentHTML) {
            scan();
            console.log("HLD: Detected change in content, re-scanning.");
        }
        previousHTML = currentHTML;
    }, 1000);
} });