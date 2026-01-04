// ==UserScript==
// @name         Open search Quick Filters for CEM
// @namespace    https://greasyfork.org/users/887711
// @match        *://kibana.*.ngc.imanagelabs.com/*
// @grant        none
// @version      2.5
// @author       -
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @description  improvements
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516831/Open%20search%20Quick%20Filters%20for%20CEM.user.js
// @updateURL https://update.greasyfork.org/scripts/516831/Open%20search%20Quick%20Filters%20for%20CEM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var setFilters = function() {
        var bar = $('.globalFilterGroup__filterBar');
        var filter = $('.globalFilterBar__addButton').first().clone();
        filter.find('.euiButtonEmpty__text').text("SetFilters");
        filter.addClass("extra-button"); // Add this to prevent duplicate buttons
        filter.click(function() {
            var replaceStr = "columns:!(kubernetes.container_name,LogLevel,Message)"
            var url = window.location.href.replace(/columns:!\(.*?\)/, replaceStr);
            window.location.href = url;
        });
        filter.appendTo(bar);
    }

    var waitForElem = function(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    var attachExtraFeaturesIfNotPresent = function() {
        // if we have already added some extra buttons, then don't add them again
        if ($('.extra-button').first().length == 0) {
            console.log("attaching extra features");
            waitForElem('.globalFilterGroup__filterBar').then((elm) => {
                setFilters();
            });
        }

        waitForElem('.globalFilterGroup__filterBar').then((elm) => {
            setTimeout(function(){
                // we try to add the features after a second because sometimes they disappear
                attachExtraFeaturesIfNotPresent();
            }, 1000);
        });
    }

    $(window).ready(function() {
        attachExtraFeaturesIfNotPresent();
    });
})();