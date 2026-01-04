// ==UserScript==
// @name         VAST page sound alarm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  VAST sound alarm when new alert show
// @author       You
// @match        https://eu.vast.ops-integration.amazon.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488230/VAST%20page%20sound%20alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/488230/VAST%20page%20sound%20alarm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function playSound() {
        var audio = new Audio('https://drive.corp.amazon.com/view/nowaratn@/Chute_Checker/BUZZER.mp3');
        audio.play();
    }

    function observeTable(table) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'TBODY') {
                        console.log('tbody added');
                        playSound();
                    }
                });
            });
        });

        observer.observe(table, { childList: true, subtree: true });
    }

    function waitForTableAndObserve() {
        var checkTableExist = setInterval(function() {
            var table = document.querySelector('.animOnLoadAppearChildren.css-3u0lc3');
            if (table) {
                clearInterval(checkTableExist);
                observeTable(table);
                console.log('Table monitoring started.');
            }
        }, 1000); 
    }

    waitForTableAndObserve();
})();
