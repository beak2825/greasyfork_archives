// ==UserScript==
// @name         bypass LoggedIn Requirement in Twitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to redirect user to twitter embed link, to avoud requirement of beeing logging in
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @esversion    8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470202/bypass%20LoggedIn%20Requirement%20in%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/470202/bypass%20LoggedIn%20Requirement%20in%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function main() {
        console.log('Before 3 seconds of sleep');
        await sleep(3000);
        let xpathResultMark1 = document.evaluate("//*[text()='Sign up']", document, null, XPathResult.ANY_TYPE, null);
        let xpathResultMark2 = document.evaluate("//*[text()='Retry']", document, null, XPathResult.ANY_TYPE, null);

        let node1 = xpathResultMark1.iterateNext();
        let node2 = xpathResultMark2.iterateNext();

        if (node1 && node2) {
            console.log("Text 'Sign up' and 'Retry' is present in the HTML document.");

            let link = "https://platform.twitter.com/embed/Tweet.html?id=%s"

            let currentURL = window.location.href;

            let url = currentURL;
            let regex = /[^/]*$/;
            let lastPart = url.match(regex)[0];

            let targetPage = `https://platform.twitter.com/embed/Tweet.html?id=${lastPart}`
            window.location.href = targetPage;
        } else {
            console.log("Text 'Sign up' and 'Retry' is NOT present in the HTML document. you are logged in");
            console.log(node1);
            console.log(node2);
        }
    }

    main();
})();
