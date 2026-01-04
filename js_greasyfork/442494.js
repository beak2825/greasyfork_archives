// ==UserScript==
// @name         tinyurl Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ad blocker for tinyurl.com
// @author       Owner, Creator, and Programmer of the ZeriusLearning websites.
// @match        *://tinyurl.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442494/tinyurl%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/442494/tinyurl%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var i = setInterval(function() {
        if(document.querySelector("[data-ad-processed='1']") !== undefined) {
            document.querySelector("[data-ad-processed='1']").remove();
            document.querySelector("[data-ad-processed='1']").remove();
            clearInterval(i);
            console.log("Deleted Ads.");
        }
    },0);
})();