// ==UserScript==
// @name         YouTube Remove Bad Alerts
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1.0
// @description  Hide alerts from youtube that are stupid and won't go away
// @match        https://www.youtube.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/412775/YouTube%20Remove%20Bad%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/412775/YouTube%20Remove%20Bad%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var removeAlert = function (nodeArray) {
        // First, hide the stupid feed bar thing if it's there
        $('ytd-feed-filter-chip-bar-renderer').hide();

        // Then, get all of the alerts, then go through each string inside them and see if the entire alert should be removed
        if (typeof nodeArray !== "undefined") {
            for (let node of nodeArray) {
                if (node.getElementsByTagName) {
                    let alerts = node.getElementsByTagName('yt-alert-with-actions-renderer');
                    if (alerts.length > 0) {
                        Array.from(alerts).forEach(function(alert) {
                            let strings = alert.getElementsByTagName('yt-formatted-string');
                            if (strings.length > 0) {
                                Array.from(strings).forEach(function(string) {
                                    let text = string.innerText;
                                    badAlerts.forEach(function(bad) {
                                        if (text.includes(bad)) {
                                            alert.remove();
                                            console.log('Killed an Alert for you!');
                                        }
                                    });
                                });
                            }
                        });

                        // If there were any alerts, check if the alert-banner should be displayed
                        let alertBanner = document.getElementById('alert-banner');
                        if (alertBanner.hasChildNodes()) {
                            $(alertBanner).show();
                        }
                        else {
                            $(alertBanner).hide();
                        }
                    }
                }
            }
        }
    }

    var badAlerts = [];
    badAlerts.push("Easily access information about your data on YouTube and your privacy controls at any time");

    $(document).ready(function() {
        var pageManager = document.getElementsByTagName('ytd-page-manager');
        if (pageManager.length === 1) {
            var config = { childList: true, subtree: true };
            var callback = function(mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        removeAlert(mutationsList.addedNodes);
                    }
                }
            };
            var observer = new MutationObserver(callback);
            observer.observe(pageManager[0], config);
            console.log('Observer deployed to watch and remove Alerts');
        }

        var app = document.getElementsByTagName('ytd-app');
        if (app.length === 1) {
            removeAlert(app[0].childNodes);
        }
    });
})();