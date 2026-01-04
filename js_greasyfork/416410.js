// ==UserScript==
// @name         Gmail Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hide gmail ads as they appear. Not super elegant but works.
// @author       James Sterling
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416410/Gmail%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/416410/Gmail%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.hidden { display: none; }';
    document.getElementsByTagName('head')[0].appendChild(style);

    function blockAds() {

        var spans = document.querySelectorAll('tr > td > div > span > span');
        var searchText = "Ad";

        for (var i = 0; i < spans.length; i++) {
            if (spans[i].textContent == searchText) {
                spans[i].parentElement.parentElement.parentElement.parentElement.style = 'display: none';
                spans[i].parentElement.parentElement.parentElement.parentElement.classList.toggle('hidden');
            }
        }
    }

    function setup() {

        blockAds();

        setInterval(function() {
            blockAds();
        }, 1000);

        // Listen for tab changes
        document.querySelectorAll('[role="tab"]').forEach(function (el){
            el.addEventListener("click", function() {
                blockAds();
                var counter = 0;
                var look = setInterval(function() {
                    if (counter > 250) {
                        clearInterval(look);
                    }
                    blockAds();
                    counter++;
                }, 5);
            });
        });
    }

    var watcher = setInterval(function() {
        if (document.querySelectorAll('[role="tab"]').length > 0) {
            setup();
            clearInterval(watcher);
        }
    }, 5);

})();