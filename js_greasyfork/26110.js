// ==UserScript==
// @name         Skip netflix intro
// @namespace    https://greasyfork.org/en/users/90514
// @version      0.1
// @description  Automatically press the netflix "Skip intro" button when it appears.
// @author       Tharaka De Silva
// @match        *://www.netflix.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26110/Skip%20netflix%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/26110/Skip%20netflix%20intro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes.length > 0 && mutation.addedNodes[0].className && mutation.addedNodes[0].className.toString().match(/skip-credits/)) {
                var innerDiv = $(".skip-credits");
                if (innerDiv.length > 0) {
                    var button = innerDiv.find(".nf-flat-button-text");
                    button.click();
                }
            }
        });
    });
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();