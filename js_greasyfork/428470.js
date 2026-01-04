// ==UserScript==
// @name         MCYT Selfie Days Begone!
// @namespace    http://krizisdev.github.io/
// @version      0.1
// @description  Gets rid of (most if not all) MCYT selfie day trends on Twitter
// @author       KrizisDev
// @match        https://twitter.com/*
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428470/MCYT%20Selfie%20Days%20Begone%21.user.js
// @updateURL https://update.greasyfork.org/scripts/428470/MCYT%20Selfie%20Days%20Begone%21.meta.js
// ==/UserScript==
/* globals $, waitForKeyElements */

$(document).ready(function() {
    function _f(jNode) {
        var wordList = [
            "dttwtselfieday", "punztwtselfieday", "sleepytwtselfieday", "minxtwtselfieday", "blackmcytselfieday",
            "clingytwtselfieday", "spifeyselfieday", "gappletwtselfieday", "hermittwtselfieday", "ayuptwtselfieday",
            "tiredtwtselfieday", "yiptwtselfieday", "nikiselfieday", "pugtwtselfieday", "filimcsd", "smokecityselfies",
            "mutetwtselfieday", "innittwtselfieday", "muffinselfieday", "natetwtselfieday", "asianmcyttwtselfieday",
            "honktwtselfieday", "hispanicmcyttwtselfieday", "shubtwtselfieday", "selfiesforcelestia", "f1nnselfieday",
            "deotwtselfieday", "cpktwtselfieday", "fruitninjaselfieday", "tubbotwtselfieday", "patchestwtselfieday",
            "transmcyttwtselfieday", "bootwtselfieday", "awesamtwtselfieday", "quacktwtselfieday", "technotwtselfieday"
        ];

        var words = new RegExp(wordList.join("|"));
        if (words.test(jNode.find(".css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0").text().toLowerCase())) {
            jNode.find(".css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0").parent().parent().parent().parent().hide();
        }
    }

    waitForKeyElements("[data-testid='trend'", _f);
});