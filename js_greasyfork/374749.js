// ==UserScript==
// @name         Random.org
// @version      0.6
// @match        https://www.random.org/*
// @description  Predictable number generation for Random.org (https://www.random.org/)
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace    https://greasyfork.org/users/228137
// @license      GPLv3
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374749/Randomorg.user.js
// @updateURL https://update.greasyfork.org/scripts/374749/Randomorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug function
    function debugLog(message) {
        console.log('[Random.org Debug] ' + message);
    }

    debugLog('Script started. URL: ' + window.location.href);

    // Number which will be generated on target click
    var desired_number = 10;
    var desired_click_number = 1;

    var click_ctr = 0;
    var html_template = "<center><span style='font-size:100%;font-weight:bold;'>%value%<br/></span><span style='font-size:70%;'>Min:&nbsp;%min%, Max:&nbsp;%max%<br/>%date%</span></center>";

    function template(template_data, params) {
        return template_data.replace(/%(\w*)%/g, function(m, key) {
            return params.hasOwnProperty(key) ? params[key] : "";
        });
    }

    // Check if we're inside the iframe
    if (window.top !== window.self) {
        debugLog('Running inside iframe.');

        function overrideGetTrueRandomInteger() {
            debugLog('Attempting to override getTrueRandomInteger inside iframe.');

            if (typeof window.getTrueRandomInteger !== 'undefined') {
                debugLog('getTrueRandomInteger is defined inside iframe.');
                var origGetTrueRandomInteger = window.getTrueRandomInteger;

                window.getTrueRandomInteger = function(min, max) {
                    click_ctr++;
                    debugLog('getTrueRandomInteger called. Click count: ' + click_ctr);

                    if (click_ctr === desired_click_number) {
                        debugLog('Desired click count reached. Mimicking animation and injecting desired number.');

                        // Mimic the animation
                        var resultSpan = document.querySelector('[id$="-result"]');
                        var generateButton = document.querySelector('[id$="-button"]');
                        var minInput = document.querySelector('[id$="-min"]');
                        var maxInput = document.querySelector('[id$="-max"]');

                        if (resultSpan && generateButton && minInput && maxInput) {
                            generateButton.disabled = true;
                            minInput.disabled = true;
                            maxInput.disabled = true;
                            resultSpan.innerHTML = '<img src="/util/cp/images/ajax-loader.gif" alt="Loading..." />';

                            setTimeout(function() {
                                var date = new Date();
                                var date_str = [
                                    date.getUTCFullYear(),
                                    ("0" + (date.getUTCMonth() + 1)).slice(-2),
                                    ("0" + date.getUTCDate()).slice(-2)
                                ].join("-") + " " + [
                                    ("0" + date.getUTCHours()).slice(-2),
                                    ("0" + date.getUTCMinutes()).slice(-2),
                                    ("0" + date.getUTCSeconds()).slice(-2)
                                ].join(":") + " UTC";

                                resultSpan.innerHTML = template(html_template, {
                                    value: desired_number,
                                    min: minInput.value,
                                    max: maxInput.value,
                                    date: date_str
                                });
                                generateButton.disabled = false;
                                minInput.disabled = false;
                                maxInput.disabled = false;
                                debugLog('Desired number injected successfully.');
                            }, 600); // Match the original wait time for animation
                        } else {
                            debugLog('One or more elements not found inside iframe.');
                        }
                    } else {
                        // Call the original function for other clicks
                        debugLog('Calling original getTrueRandomInteger.');
                        origGetTrueRandomInteger(min, max);
                    }
                };
            } else {
                debugLog('getTrueRandomInteger is not defined yet inside iframe. Setting up MutationObserver.');
                // Use MutationObserver to watch for when getTrueRandomInteger becomes available
                var observer = new MutationObserver(function(mutations, obs) {
                    if (typeof window.getTrueRandomInteger !== 'undefined') {
                        debugLog('getTrueRandomInteger is now defined inside iframe.');
                        obs.disconnect();
                        overrideGetTrueRandomInteger();
                    }
                });
                observer.observe(document, { childList: true, subtree: true });
            }
        }

        overrideGetTrueRandomInteger();

    } else {
        debugLog('Running in parent page.');
        // No action needed in parent page
    }

})();