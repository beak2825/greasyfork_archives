// ==UserScript==
// @name         TEST
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @include      https://www.waze.com/*/editor/*
// @include      https://www.waze.com/editor/*
// @include      https://editor-beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/23581/TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/23581/TEST.meta.js
// ==/UserScript==

function log(message) {
    if (typeof message === 'string') {
        console.log('TESTING: ' + message);
    } else {
        console.log('TESTING: ', message);
    }
}

// initialize BNLValidator and do some checks
function TESTING_bootstrap() {
    log("Start");
    if(!window.Waze.map) {
        setTimeout(TESTING_bootstrap, 1000);
        return;
    }
    TESTING_init();
}

function TESTING_init() {
    // Check initialisation
    if (typeof Waze == 'undefined' || typeof I18n == 'undefined') {
        setTimeout(BNLValidator_init, 660);
        log('Waze object unavailable, map still loading');
        return;
    }

    // Het effectieve Waze object
    log(Waze);
}

setTimeout(TESTING_bootstrap, 3000);