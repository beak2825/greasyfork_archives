// ==UserScript==
// @name         ML-Enhanced Tinychat & Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license      Bort Mack
// @description  Ad blocker with machine learning capabilities for Tinychat
// @author       Bort Mack (original), (ML enhancements)
// @match        https://tinychat.com/room/*
// @match        https://tinychat.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505214/ML-Enhanced%20Tinychat%20%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/505214/ML-Enhanced%20Tinychat%20%20Ad%20Blocker.meta.js
// ==/UserScript==
(function () {
        "use strict";
        const ESSENTIAL_SCRIPTS = ["tinychat-room-bundle", "tinychat-rtc-bundle"];
        const INITIAL_FEATURES = ["ad", "ads", "banner", "sponsor", "promo"];
        const MAX_FEATURES = 50;
        const LEARNING_RATE = 0.1;
        let adFeatures = GM_getValue("adFeatures", INITIAL_FEATURES);
        let featureWeights = GM_getValue("featureWeights", adFeatures.reduce(
                (acc, feature) => ({
                        ...acc
                        , [feature]: 1
                }), {}));
        
        function sigmoid(x) {
                return 1 / (1 + Math.exp(-x));
        }
        
        function predictAdProbability(element) {
                let score = 0;
                for (let feature in featureWeights) {
                        if (element.innerText.toLowerCase()
                                .includes(feature) || element.id.toLowerCase()
                                .includes(feature) || element.className.toLowerCase()
                                .includes(feature)) {
                                score += featureWeights[feature];
                        }
                }
                return sigmoid(score);
        }
        
        function updateModel(element, isAd) {
                const prediction = predictAdProbability(element);
                const error = isAd ? 1 - prediction : 0 - prediction;
                for (let feature in featureWeights) {
                        if (element.innerText.toLowerCase()
                                .includes(feature) || element.id.toLowerCase()
                                .includes(feature) || element.className.toLowerCase()
                                .includes(feature)) {
                                featureWeights[feature] += LEARNING_RATE * error;
                        }
                }
                GM_setValue("featureWeights", featureWeights);
        }
        
        function learnNewFeature(feature) {
                if (adFeatures.length >= MAX_FEATURES) {
                        const minWeightFeature = Object.entries(featureWeights)
                                .reduce(
                                        (min, entry) => (entry[1] < min[1] ? entry : min))[0];
                        delete featureWeights[minWeightFeature];
                        adFeatures = adFeatures.filter((f) => f !== minWeightFeature);
                }
                adFeatures.push(feature);
                featureWeights[feature] = 1;
                GM_setValue("adFeatures", adFeatures);
                GM_setValue("featureWeights", featureWeights);
        }
        
        function removeAds() {
                document.querySelectorAll("div, span, iframe")
                        .forEach((element) => {
                                if (predictAdProbability(element) > 0.8) {
                                        element.style.display = "none";
                                        updateModel(element, true);
                                }
                        });
        }
        
        function blockAdRequests() {
                const originalFetch = window.fetch;
                window.fetch = function (...args) {
                        const [resource] = args;
                        if (typeof resource === "string" && predictAdProbability({
                                        innerText: resource
                                }) > 0.8) {
                                updateModel(
                                {
                                        innerText: resource
                                }, true);
                                return Promise.resolve(new Response("", {
                                        status: 200
                                        , statusText: "OK"
                                }));
                        }
                        return originalFetch.apply(this, args);
                };
        }
        
        function init() {
                removeAds();
                blockAdRequests();
                setInterval(removeAds, 5000);
        }
        // Allow essential scripts to load
        const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                        for (let node of mutation.addedNodes) {
                                if (node.tagName === "SCRIPT" && ESSENTIAL_SCRIPTS.some((script) => node.src.includes(script))) {
                                        observer.disconnect();
                                        init();
                                        return;
                                }
                        }
                }
        });
        observer.observe(document.documentElement, {
                childList: true
                , subtree: true
        });
        // Fallback: If essential scripts aren't detected after 5 seconds, run init anyway
        setTimeout(() => {
                observer.disconnect();
                init();
        }, 5000);
        // User feedback mechanism
        window.reportFalsePositive = function (element) {
                updateModel(element, false);
                element.style.display = "";
        };
        window.reportMissedAd = function (element) {
                updateModel(element, true);
                element.style.display = "none";
                const newFeatures = element.innerText.toLowerCase()
                        .split(/\s+/)
                        .filter((word) => word.length > 3 && !adFeatures.includes(word));
                if (newFeatures.length > 0) {
                        learnNewFeature(newFeatures[0]);
                }
        };
})();
