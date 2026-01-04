// ==UserScript==
// @name         Youtube Ads auto reload
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Reload youtube page when adblocker can't block youtube ads
// @author       sorz.code
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-body
// @require http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/395540/Youtube%20Ads%20auto%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/395540/Youtube%20Ads%20auto%20reload.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var check = function() {
        var special = false;
        if (document.getElementsByClassName('ytp-error').length) {
            if (document.getElementsByClassName('ytp-error')[0].offsetWidth) {
                console.log('youtube encountered error');
                special = true;
                location.reload();
            }
        } else if (document.getElementsByClassName('video-ads ytp-ad-module').length) {
            if (document.getElementsByClassName('video-ads ytp-ad-module')[0].offsetWidth) {
                console.log('adblocker missed the ads');
                special = true;
                location.reload();
            }
        }
        if (!special) {
            console.log('nothing weird happened', new Date());
        }
    }

    function noRefreshCheckInject() {
        // Select the node that will be observed for mutations
        const targetNode = document.getElementsByClassName('video-stream html5-main-video')[0];

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: true
        };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (let mutation of mutationsList) {
                if (mutation.attributeName === 'src') {
                    //console.log(mutation)
                    console.log('no-refresh page', window.location.href);
                    check();
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    function fullRefreshCheck() {
        $(document).on('DOMNodeInserted', 'ytd-player', function(e) {
            console.log('full-refresh page', window.location.href);
            check();
            noRefreshCheckInject();
            $(document).off('DOMNodeInserted', 'ytd-player');
        });
    }

    fullRefreshCheck();

})();