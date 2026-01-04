// ==UserScript==
// @name Medium.com - check for scheduled publication
// @namespace https://muffinimal.medium.com/
// @version 1.0
// @description Alerts the user with a popup on the edit screen if the story is scheduled for publication
// @author Martin van Soest
// @match https://medium.com/p/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/426319/Mediumcom%20-%20check%20for%20scheduled%20publication.user.js
// @updateURL https://update.greasyfork.org/scripts/426319/Mediumcom%20-%20check%20for%20scheduled%20publication.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var xpathResult = document.evaluate("(//text()[contains(., 'scheduledPublishAt')])[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var node=xpathResult.singleNodeValue;
    if (node==null) {
        console.log("Not scheduled for publication"); }
    else {
        alert("Article is scheduled for publication"); }
})();