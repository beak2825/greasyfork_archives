// ==UserScript==
// @name         Remove Ads Kissasian
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove ads that open new window/tabs
// @author       You
// @include      https://kissasian.tld/*
// @include      https://www.mp4upload.com/*
// @include      https://vidmoly.to/*
// @include      https://player-cdn.com/*
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kissasian.mx
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473019/Remove%20Ads%20Kissasian.user.js
// @updateURL https://update.greasyfork.org/scripts/473019/Remove%20Ads%20Kissasian.meta.js
// ==/UserScript==

(function() {
    console.log('kissasian ads checking');

    // Override the window.open method
    window.open = function(url, target, features) {
        // Here, you can handle the attempt to open a new window/tab
        console.log('Attempt to open new window/tab blocked.');
        //alert('Attempt to open new window/tab blocked.');
        // You can also take further actions, such as displaying a message to the user or preventing the action altogether.

        // For demonstration purposes, we'll just log the URL that was trying to be opened.
        console.log('URL: ', url);

        // If you want to completely block the action, you can just return null or false.
        // return null;
        return false;

        // If you want to allow the action to proceed, you can use the original window.open method.
        // Be cautious when doing this, as it may lead to undesired behavior or security risks.
        // return originalOpenMethod(url, target, features);
    };

    // Store the original window.open method
    const originalOpenMethod = window.open;

    // Test the overridden method
    //window.open('https://www.example.com', '_blank');
})();