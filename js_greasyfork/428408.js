// ==UserScript==
// @name         DreamSMP Trends Begone!
// @namespace    http://krizisdev.github.io/
// @version      0.4
// @description  Gets rid of (almost) all DreamSMP trends on Twitter
// @author       KrizisDev
// @match        https://twitter.com/*
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428408/DreamSMP%20Trends%20Begone%21.user.js
// @updateURL https://update.greasyfork.org/scripts/428408/DreamSMP%20Trends%20Begone%21.meta.js
// ==/UserScript==
/* globals $, waitForKeyElements */

$(document).ready(function() {
    function _f(jNode) {
        var wordList = [
            "dreamsmp", "dream", "georgenotfound", "george", "callahan", "sapnap", "awesamdude", "ponk", "dropsbyponk", "badboyhalo",
            "tommyinnit", "tommy", "tubbo", "fundy", "punz", "purpled", "wilbur soot", "wilbur", "soot", "ghostbur", "skeepy",
            "jack manifold", "jack", "manifold", "quackity", "mexican dream", "karl jacobs", "karl", "jacobs", "hbomb", "technoblade",
            "techno", "antfrost", "philza", "ph1lza", "lazarbeam", "ranboo"
        ];

        var words = new RegExp(wordList.join("|"));
        if (words.test(jNode.find(".css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0").text().toLowerCase())) {
            jNode.find(".css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0").parent().parent().parent().parent().hide();
        }
    }

    waitForKeyElements("[data-testid='trend'", _f);
});