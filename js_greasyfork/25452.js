// ==UserScript==
// @name         Random Wikia
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Press a button to go to any random page of the wikia you're on
// @author       RexOmni
// @match        http://*.wikia.com/*
// @match        https://*.wikia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25452/Random%20Wikia.user.js
// @updateURL https://update.greasyfork.org/scripts/25452/Random%20Wikia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key that changes the page
    var randKey = 'f';

    // Key that changes the page
    var saveKey = 'h';

    // DO not edit below unless you know what you are doing
    window.addEventListener("keydown", function (event) {
        if(event.key==randKey){
            var url = window.location.href;
            var res = url.substring(0, url.indexOf("wikia.com")+9) + "/wiki/Special:Random";

            window.location.replace(res);
        }
        else if(event.key==saveKey){
            var url = window.location.href;
            var stateObj = { };
            history.pushState(stateObj, document.title, url);
        }
    });
})();