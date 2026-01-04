// ==UserScript==
// @name         Re S
// @namespace    Re
// @version      2.1
// @description  Re
// @author       myers
// @match        *://*/recaptcha/*
// @connect      thys.pythonanywhere.com
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/481922/Re%20S.user.js
// @updateURL https://update.greasyfork.org/scripts/481922/Re%20S.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var solved = false;
    var checkBoxClicked = false;
    var waitingForAudioResponse = false;
    //Node Selectors
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
    const MAX_ATTEMPTS = 5;
    var requestCount = 0;
    var recaptchaLanguage = qSelector("html").getAttribute("lang");
    var audioUrl = "";
    var recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : ""
    var serversList = ["https://thys.pythonanywhere.com","https://engageub1.pythonanywhere.com"];
    var latencyList = Array(serversList.length).fill(10000);
    //Check for visibility && Click the check box
    function isHidden(el) {
        return(el.offsetParent === null)
    }

    async function getTextFromAudio(URL) {
        GM_xmlhttpRequest ( {
            method:     "POST",
            url:        'https://thys.pythonanywhere.com/',
            data:       "audio_url=" + encodeURIComponent(URL),
            headers:    {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            timeout: 10000,
            onload:     function (response) {
                console.log("Response::" + response.responseText);
                try {
                    var responseText = response.responseText;
                    //Validate Response for error messages or html elements
                    if(responseText == "Nu a" || responseText.includes("<") || responseText.includes(">") || responseText.length < 2 || responseText.length > 50) {
                        //Invalid Response, Reload the captcha
                        console.log("Invalid Response. Retrying..");
                    } else if(qSelector(AUDIO_SOURCE) && qSelector(AUDIO_SOURCE).src && audioUrl == qSelector(AUDIO_SOURCE).src && qSelector(AUDIO_RESPONSE)
                              && !qSelector(AUDIO_RESPONSE).value && qSelector(AUDIO_BUTTON).style.display == "none" && qSelector(VERIFY_BUTTON)) {
                        qSelector(AUDIO_RESPONSE).value = responseText;
                        qSelector(VERIFY_BUTTON).click();
                    } else {
                        console.log("Could not locate text input box")
                    }
                    waitingForAudioResponse = false;
                } catch (err) {
                    console.log(err.message);
                    console.log("Exception handling response. Retrying..");
                    waitingForAudioResponse = false;
                }
            }
        });
    }

    function qSelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    function qSelector(selector) {
        return document.querySelector(selector);
    }



    if(qSelector(CHECK_BOX)){
        qSelector(CHECK_BOX).click();
    }

    //Solve the captcha using audio
    var startInterval = setInterval(function() {
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
                clearInterval(startInterval);
            }
            if(requestCount > MAX_ATTEMPTS) {
                console.log("Attempted Max Retries. Stopping the solver");
                solved = true;
                clearInterval(startInterval);
            }
            if(!solved) {
                if(qSelector(AUDIO_BUTTON) && !isHidden(qSelector(AUDIO_BUTTON)) && qSelector(IMAGE_SELECT)) {
                    // console.log("Audio button clicked");
                    qSelector(AUDIO_BUTTON).click();
                }
                if((!waitingForAudioResponse && qSelector(AUDIO_SOURCE) && qSelector(AUDIO_SOURCE).src
                    && qSelector(AUDIO_SOURCE).src.length > 0 && audioUrl == qSelector(AUDIO_SOURCE).src
                    && qSelector(RELOAD_BUTTON)) ||
                   (qSelector(AUDIO_ERROR_MESSAGE) && qSelector(AUDIO_ERROR_MESSAGE).innerText.length > 0 && qSelector(RELOAD_BUTTON) &&
                    !qSelector(RELOAD_BUTTON).disabled)){
                    qSelector(RELOAD_BUTTON).click();
                } else if(!waitingForAudioResponse && qSelector(RESPONSE_FIELD) && !isHidden(qSelector(RESPONSE_FIELD))
                          && !qSelector(AUDIO_RESPONSE).value && qSelector(AUDIO_SOURCE) && qSelector(AUDIO_SOURCE).src
                          && qSelector(AUDIO_SOURCE).src.length > 0 && audioUrl != qSelector(AUDIO_SOURCE).src
                          && requestCount <= MAX_ATTEMPTS) {
                    waitingForAudioResponse = true;
                    audioUrl = qSelector(AUDIO_SOURCE).src
                    getTextFromAudio(audioUrl);
                }else {
                    //Waiting
                }
            }
            //Stop solving when Automated queries message is shown
            if(qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
                console.log("Automated Queries Detected");
                clearInterval(startInterval);
            }
        } catch(err) {
            console.log(err.message);
            console.log("An error occurred while solving. Stopping the solver.");
            clearInterval(startInterval);
        }
    }, 1000);

})();