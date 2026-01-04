// ==UserScript==
// @name         Brainly Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Remove paywall from Brainly!
// @author       DeathlyBower959
// @license      MIT
// @match        https://brainly.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443289/Brainly%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/443289/Brainly%20Bypass.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    var reloadAnswers = function reloadAnswers(answerBlockers) {
        if (answerBlockers > 0) {
            /* var currentData = JSON.parse(localStorage.getItem('flexible-funnel-cycle-data') || {});
            if (!currentData) return;
            var newTiers = {};
            Object.keys(currentData.tiers).forEach(function (key) {
                newTiers[key] = 0;
            });
            localStorage.setItem('flexible-funnel-cycle-data', JSON.stringify(_objectSpread(_objectSpread({}, currentData), {}, {
                tiers: newTiers
            }))); */

            localStorage.removeItem('social-qa/telemetry')
            window.location.reload();
        }
    };

    var statusCheck = function statusCheck() {
        var answerBlockers = document.querySelectorAll('[data-testid="answer_blockade_adapter"]').length;
        if (answerBlockers <= 0) setTimeout(statusCheck, 1000); else reloadAnswers(answerBlockers);
    };


    statusCheck();
})();