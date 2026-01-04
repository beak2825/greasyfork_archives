// ==UserScript==
// @name         Auto Open CAPTCHA
// @description  Streamlines the process of engaging with CAPTCHA by automatically activating the verification checkbox.
// @version      1.0
// @license      GNU General Public License
// @icon         https://github.com/Gamby-1791/autoOpenCAPTCHA/raw/main/captcha.png
// @match        *://*/recaptcha/*
// @grant        none
// @namespace https://greasyfork.org/users/1231264
// @downloadURL https://update.greasyfork.org/scripts/482518/Auto%20Open%20CAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/482518/Auto%20Open%20CAPTCHA.meta.js
// ==/UserScript==

// Copyright (C) 2023
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

function qSelector(selector) {
    return document.querySelector(selector);
}

(function() {
    'use strict';
    var solved = false;
    var checkBoxClicked = false;
    var requestCount = 0;
    const MAX_ATTEMPTS = 1;
    const CHECK_BOX = ".recaptcha-checkbox-border";
    const AUDIO_BUTTON = "#recaptcha-audio-button";
    const PLAY_BUTTON = ".rc-audiochallenge-play-button .rc-button-default";
    const AUDIO_SOURCE = "#audio-source";
    const IMAGE_SELECT = "#rc-imageselect";
    const RESPONSE_FIELD = ".rc-audiochallenge-response-field";
    const AUDIO_ERROR_MESSAGE = ".rc-audiochallenge-error-message";
    const AUDIO_RESPONSE = "#audio-response";
    const RELOAD_BUTTON = "#recaptcha-reload-button";
    const RECAPTCHA_STATUS = "#recaptcha-accessible-status";
    const DOSCAPTCHA = ".rc-doscaptcha-body";
    const VERIFY_BUTTON = "#recaptcha-verify-button";
    var recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : ""
    function isHidden(el) {
        return(el.offsetParent === null)
    }
    try {
        if(!checkBoxClicked && qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
            //console.log("checkbox clicked");
            qSelector(CHECK_BOX).click();
            checkBoxClicked = true;
        }
        //Check if the captcha is solved
        if(qSelector(RECAPTCHA_STATUS) && (qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus)) {
            solved = true;
            console.log("SOLVED");
        }
        if(requestCount > MAX_ATTEMPTS) {
            console.log("Attempted Max Retries. Stopping the solver");
            solved = true;
        }
        //Stop solving when Automated queries message is shown
        if(qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
            console.log("Automated Queries Detected");
        }
    } catch(err) {
        console.log(err.message);
        console.log("An error occurred while solving. Stopping the solver.");
    }
})();