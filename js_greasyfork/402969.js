// ==UserScript==
// @name         sankakucomplex no delay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://chan.sankakucomplex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402969/sankakucomplex%20no%20delay.user.js
// @updateURL https://update.greasyfork.org/scripts/402969/sankakucomplex%20no%20delay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // blocked_url = "https://chan.sankakucomplex.com/javascripts/app.js?237";
    // observe tags and remove the one matching the app.js
    new MutationObserver((_, observer) => {
        const appJsTag = document.querySelector('script[src*="app.js"]');
        if (appJsTag) {
            appJsTag.remove();
            // We've done what we needed to do, no need for the MutationObserver anymore:
            observer.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    var patched = "";
    fetch('https://chan.sankakucomplex.com/javascripts/app.js').then(response => response.text()).then((data) => {
        patched = data;
        patched = patched.replace("var FADE_IN_DELAY = 250;", "var FADE_IN_DELAY = 1;");
        patched = patched.replace("var FADE_IN_DURATION = 175;", "var FADE_IN_DURATION = 1;");

        var scriptNode = document.createElement ("script");
        scriptNode.type = 'text/javascript';
        scriptNode.text = patched;
        document.getElementsByTagName('body')[0].appendChild(scriptNode);

        // for some reason the page begins with images blurried. this removes the blur
        document.querySelectorAll('.blacklisted').forEach(function(element) {
            element.className = element.className.replace("blacklisted", "");
        });
    })

})();