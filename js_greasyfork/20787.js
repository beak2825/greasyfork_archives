// ==UserScript==
// @name         ekstrabladet nagscreen blocker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Removes the nag screen on http://ekstrabladet.dk when using an ad-blocker
// @author       holovati
// @include      http*://ekstrabladet.dk/*
// @run-at 	 document-start
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20787/ekstrabladet%20nagscreen%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/20787/ekstrabladet%20nagscreen%20blocker.meta.js
// ==/UserScript==
var scriptEngine;

if (typeof GM_info === "undefined") {
    scriptEngine = "plain Chrome (Or Opera, or scriptish, or Safari, or rarer)";
} else {
    scriptEngine = GM_info.scriptHandler || "Greasemonkey";
}

if (scriptEngine === 'Tampermonkey') {
    $(document).bind('DOMSubtreeModified', function(e) {
        var element = e.target;
        if (element.tagName === "BODY")
            $('div.p-absolute.p-absolute--fill').parent().remove();
    });
}


if (scriptEngine === "Greasemonkey") {
    $(document).bind('DOMSubtreeModified', function(e) {
        var element = e.target;
        if ($(element.firstElementChild).is('.p-absolute.p-absolute--fill')) {
            $(element).remove();
        }
    });
}