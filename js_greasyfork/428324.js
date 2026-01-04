// ==UserScript==
// @name         Twitch Always Open "Following Live"
// @namespace    https://greasyfork.org/en/users/786317
// @version      1.0
// @description  When you click on the "Following" button, open "Following Live" tab instead
// @author       BidensGirl
// @match        https://www.twitch.tv/*
// @icon         https://www.twitch.tv/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428324/Twitch%20Always%20Open%20%22Following%20Live%22.user.js
// @updateURL https://update.greasyfork.org/scripts/428324/Twitch%20Always%20Open%20%22Following%20Live%22.meta.js
// ==/UserScript==


(function() {
    'use strict';

    /* I wanted to modify the big "Following" button at the top using
    document.querySelector('a.navigation-link[data-test-selector="top-nav__following-link"]');
    but for some reason this element's href parameter is not used when the button is clicked on
    and I could not figure out what place is responsible for opening a different page...

    PS: It seems this data is coming from stored Web Components (?), there're many
    redundant references to /directory/ links in js files
    */

    // Thanks, https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript/41825103#41825103
    // popstate Event doesn't work indeed
    var pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(history, arguments);
        //console.log(`URL changed to ${location.href}:` + JSON.stringify(arguments))
        // /directory/following
        if (arguments[2] === "/directory/following") {
            // this will inevitably reload the page completely
            window.location.replace(location.href + "/live");
            console.log("Twitch More Followed Channels: redirecting to /live");
        }
    };

})();
