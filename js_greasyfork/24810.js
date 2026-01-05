// ==UserScript==
// @name         [HF] Report counter
// @namespace    https://hackforums.net
// @version      0.1
// @description  Report counter in the header.
// @author       iNeo19
// @match        https://hackforums.net/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24810/%5BHF%5D%20Report%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/24810/%5BHF%5D%20Report%20counter.meta.js
// ==/UserScript==

function getElementByXpath(page, path) {
  return page.evaluate(path, page, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var userID = "3099730";

(function() {
    'use strict';
    var profileURL = "member.php?action=profile&uid=" + userID;
    $.get(profileURL).then(function(profilePage) {
        var HTMLParser = new DOMParser();
        var page = HTMLParser.parseFromString(profilePage, "text/html");
        var reportCount = getElementByXpath(page, '//*[@id="content"]/div[2]/table[2]/tbody/tr/td[1]/table[1]/tbody/tr[8]/td[2]/text()');
        updateReports(reportCount);
    });
})();

function updateReports(reports) {
    var banner = getElementByXpath(document, '//*[@id="container"]/div[1]');
    var container = document.createElement("span");
    container.innerHTML = " (<font color='#00aaff'>Reported content: </font><font style='font-weight:normal'>"+reports.textContent+"</font>)";
    banner.appendChild(container);
}