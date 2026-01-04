// ==UserScript==
// @name         Clean Youtube Redirect URLs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get rid of those annoying Youtube redirect warnings whenever an external link is click. May also reduces Youtube's tracking.
// @author       Newish
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAe1BMVEVHcEymAACFhYXkAAC/AADyAADTAAD/////Ly//AwPhBgbxAAAmAAD5AADxAADJAADVBATaDw+BAADTAgL/LCzWAADhCAjfGhr/KCjnAAD0AADOAAD/AAD/////9/f/7+//e3v/UFD/vr7/qan/PT3/39//kJD/Kir/zc0Q/tNHAAAAHHRSTlMALQOZg+HKD8j9S+wQ88ttWX4fO6+0imqYqbniBuNvagAAAZNJREFUWIXtlt1ygjAQhTdEaBOSQEQBNVGrrfX9n7ABRlvR/EhueuGZYRgg52MTluwCvPTSv1LCEKpo00jZtovF4n0sc69ta9k0Ja0QYsnIPpdrkeZEKdUdv6erhmvSn3ieCoHpXztWT4uotLz4Wfq8v1cz+FE+0a/UEMNqsl/l/QJM9w8hFDEAHDcDpQSDRMQA0jnMp37DXhxFAggFxG0P9+N0fqQSKuuw7TmAUEBpB2h99CJqRxoYgD5/eADYAzBBfDoBK5h5AHq3dwGWfoDWX455BAH09mgdlAUBHPMIBWh9eLyYGdSBgN3p4SARGoElgNAp2L9DGOD0bR0UAjjY7V0e+FLZnYhegEkh4vwjMZQugCuJLwBqfYEv+l4SKuuWdvC+XnU7UkRl7FTG7soVsKjCkiOAdUwApjKBjIlgbYprFQOQXYMQs4qsA9Dp/npokiYT6kubVk5LpqvfSIo8pBZfRbjA7KZVZYgWM7zMsk3O+V2f2nsI4TzdZNkSzwpa3drHfXOSvN3J3HR32y+9FKEfw10c+oXU9S4AAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449286/Clean%20Youtube%20Redirect%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/449286/Clean%20Youtube%20Redirect%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", main);

    async function main() {
        // Wait for key elements to load
        await waitForElementToLoad("#content");
        await waitForElementToLoad("#meta");
        await waitForElementToLoad("#comments");
        await waitForElementToLoad("#secondary");

        // Do inital cleaning
        cleanURLs();

        // Observe for change, and clean urls upon change
        let refreashTimeout = null;
        // Limit cleanURLs() calles & call 100ms after change
        const observer = new MutationObserver(function() {
            if(refreashTimeout) {
                clearTimeout(refreashTimeout);
            }

            refreashTimeout = setTimeout(function() {
                cleanURLs();
                refreashTimeout = null;
            }, 100);
        });

        observer.observe(document.querySelector("#content"), {subtree: true, childList: true});
    }

    async function waitForElementToLoad(elnQuery) {
        while(!document.querySelector(elnQuery)) {
            await sleep(100);
        }
    }
    
    // https://stackoverflow.com/a/39914235
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function cleanURLs(){
        let anchors = document.querySelectorAll("a");
        const matchKey = "youtube.com/redirect?";
        const rawQueryKey = "q";

        for(const n of anchors) {
            let href = n.href;

            if(href.includes(matchKey)) {
                let rawURL = getParameterByName(rawQueryKey, href);
                let innerHTML = n.innerHTML;
                rawURL = decodeURIComponent(rawURL);
                n.href = rawURL;
            }
        }

        // https://stackoverflow.com/a/53717363
        function getParameterByName(name, url) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
    }
})();