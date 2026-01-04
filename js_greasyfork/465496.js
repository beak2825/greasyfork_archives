// ==UserScript==
// @name         Herculist Skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Skip Herculist Ads, passive advertisement credits.
// @author       UnbreachableData
// @match        http://www.herculist.com/cgi-bin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465496/Herculist%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/465496/Herculist%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetText = "Next site >"; // replace with the text you're looking for
    var intervalId = setInterval(function() {
        var clickableText = document.querySelector("#bloc-167 > div > div > div.col-sm-4 > div > div > h4 > a > span");
        if (clickableText && clickableText.textContent === targetText) {
            clickableText.click();
            clearInterval(intervalId); // stop the interval once the text is found
        }
    }, 1000); // repeat every 1 second
})();
