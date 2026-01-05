// This script borrows heavily (okay, outright steals) from the excellent
// "The Amazon Review Tabulator - TART" script created by AnotherFloyd.
// https://greasyfork.org/en/scripts/24434-the-amazon-review-tabulator-tart
//
// Log into your Amazon account and visit the "Public Reviews Written by You"
// link on your account page. A popup will ask whether or not to download
// reviews for ARAT. Visit the link again or refresh the page to download
// reviews again.
//
// ARAT v3.15+ has a toolbar button for processing downloaded reviews. ARAT
// will look for the reviews in the Downloads folder registered with the
// operating system.

// ==UserScript==
// @name         ARAT-assist
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This script will download review pages for ARAT to analyze.
// @author       Kirk Hodges
// @match        https://www.amazon.com/gp/cdp/member-reviews/?ie=UTF8&ref_=ya_your_reviews&sort_by=MostRecentReview
// @grant        GM_xmlhttpRequest
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/25790/ARAT-assist.user.js
// @updateURL https://update.greasyfork.org/scripts/25790/ARAT-assist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (confirm("Download reviews for ARAT?"))
    {
        var findProfileLink = "";
        var url = window.location.href;
        if(url.indexOf('amazon.com/') > -1)
        {
            // for Amazon US
            findProfileLink = document.evaluate("//b[contains(.,'Your Profile')]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }
        else
        {
            // Amazon UK, CA, AU
            findProfileLink = document.evaluate("//a[contains(.,'Customer Reviews')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }   
        var profileLink = findProfileLink.snapshotItem(0).getAttribute("href");
        var lst = profileLink.split("/");
        var userID = lst[4];
        var findDiv = document.evaluate("//div[contains(.,'Helpful Votes')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var profileDiv = findDiv.snapshotItem(0);
        var prevSibDiv = profileDiv.previousElementSibling;
        var charIdx = prevSibDiv.textContent.lastIndexOf(':');
        var reviewCount = prevSibDiv.textContent.substring(charIdx+2);
        var pageCount = Math.floor(reviewCount / 10) + ((reviewCount % 10 > 0) ? 1 : 0);
        var dt = new Date();
        var page = 1;
        while (page <= pageCount)
        {
            (function(page){
                var pageUrl = "https://www.amazon.com/gp/cdp/member-reviews/" + userID + "?ie=UTF8&display=public&page=" + page + "&sort_by=MostRecentReview";
                GM_xmlhttpRequest({
                    method: "GET",
                    url: pageUrl,
                    onload: function(response) {
                        var a = document.createElement("a"), file = new Blob([response.responseText], {type: "text/html"});
                        var fileUrl = URL.createObjectURL(file);
                        a.href = fileUrl;
                        a.download = userID + "_" +
                            dt.getFullYear() +
                            (dt.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2}) +
                            dt.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2}) +
                            dt.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2}) +
                            dt.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2}) +
                            dt.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2}) +
                            "_Page " + page.toLocaleString('en-US', {minimumIntegerDigits: 3}) +
                            " of " + pageCount.toLocaleString('en-US', {minimumIntegerDigits: 3}) + ".arat";
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function() {
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(fileUrl);
                        }, 0);
                    }
                });
            })(page);
            page++;
        }
    }
})();
