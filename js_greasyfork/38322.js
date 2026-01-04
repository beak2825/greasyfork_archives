// ==UserScript==
// @name         mTurk Parent Window Command Accepter
// @namespace    salembeats
// @version      2.7
// @description  Updated for the Worker-only (no WWW) world.
// @include      https://www.mturk.com/mturk/preview?*
// @include      https://www.mturk.com/mturk/accept?*
// @include      https://www.mturk.com/mturk/continue?*
// @include      https://www.mturk.com/mturk/return?*
// @include      https://worker.mturk.com/projects/*/tasks*
// @icon         http://ez-link.us/sb-png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38322/mTurk%20Parent%20Window%20Command%20Accepter.user.js
// @updateURL https://update.greasyfork.org/scripts/38322/mTurk%20Parent%20Window%20Command%20Accepter.meta.js
// ==/UserScript==

// Targeting just active HITs would be @include https://worker.mturk.com/projects/*/tasks/*?assignment_id=*

(function() {

    let childIFrame = document.querySelector("iframe");
    let childWindow = childIFrame.contentWindow;

    let acceptHITButton = document.querySelector("span[data-react-class*='SubmitAcceptTaskFormButton'] button");

    let secondaryButton = document.querySelector("input[name='authenticity_token']~button.btn.btn-secondary");
    let returnHITButton;
    if(secondaryButton.innerText.trim() === "Return") {returnHITButton = secondaryButton;}

    let reactDetails = JSON.parse(document.querySelector(`[data-react-class="require('reactComponents/common/ShowModal')['default']"]`).dataset.reactProps).modalOptions;

    window.addEventListener('message', function(event) {
        let receivedObject = event.data;

        if(receivedObject.hasOwnProperty("mTurkParentWindowQuery")) {

            let objectToReplyWith = {};

            if(receivedObject["mTurkParentWindowQuery"] === "accepted") {

                let responseString = "";

                if(returnHITButton) {responseString = "accepted";} else {responseString = "notAccepted";}

                objectToReplyWith["mTurkParentWindowResponse"] = responseString;
            }

            if(receivedObject["mTurkParentWindowQuery"] === "url") {

                objectToReplyWith["urlResponse"] = window.location.href;
            }

            if(receivedObject["mTurkParentWindowQuery"] === "hitDetails") {

                objectToReplyWith["hitDetails"] = JSON.stringify(reactDetails);
            }

            childWindow.postMessage(objectToReplyWith, "*");
        }

        if(receivedObject.hasOwnProperty("mTurkParentWindowAction")) {

            if(receivedObject["mTurkParentWindowAction"] === "accept" && acceptHITButton) {
                acceptHITButton.click();
            }

            if(receivedObject["mTurkParentWindowAction"] === "return" && returnHITButton) {
                returnHITButton.click();
            }

            if(receivedObject.mTurkParentWindowAction === "navigate") {
                window.location.href = receivedObject.url;
            }
        }
    });
})();