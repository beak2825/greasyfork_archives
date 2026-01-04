// ==UserScript==
// @name            WME Lane Guidance Click Saver
// @author          HBiede
// @namespace       hbiede.com
// @description     Set the straight options by default on new lane guidance changes
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version         2020.05.29.001
// @grant           none
// @license         MIT
// @copyright       2020 HBiede
// @downloadURL https://update.greasyfork.org/scripts/398006/WME%20Lane%20Guidance%20Click%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/398006/WME%20Lane%20Guidance%20Click%20Saver.meta.js
// ==/UserScript==

/* global W */

setTimeout(initLaneGuidanceClickSaver, 1000);

function setTurns() {
    let lanesPane = document.getElementsByClassName("lanes")[0];
    let left = (lanesPane.getElementsByClassName("angle--135").length > 0 ? "angle--135"
                      : (lanesPane.getElementsByClassName("angle--90").length > 0 ? "angle--90" : "angle--45"));
    let right = (lanesPane.getElementsByClassName("angle-135").length > 0 ? "angle-135"
                      : (lanesPane.getElementsByClassName("angle-90").length > 0 ? "angle-90" : "angle-45"));

    let turnSections = lanesPane.getElementsByClassName("turn-lane-edit");
    for (let i = 0; i < turnSections.length; i++) {
        // Check if the lanes are already set. If already set, don't change anything
        let alreadySet = 0;
        let laneCheckboxes = turnSections[i].getElementsByTagName("input");
        for (let j = 0; j < laneCheckboxes.length && !alreadySet; j++) {
            if (laneCheckboxes[j].checked !== undefined) {
                if (laneCheckboxes[j].checked === true) {
                    alreadySet++;
                }
            }
        }
        if (alreadySet === 0 && laneCheckboxes && laneCheckboxes.length > 0) {
            if (turnSections[i].getElementsByClassName("angle-0").length > 0) {
                // Set all lanes for straight turns
                for (let j = 0; j < laneCheckboxes.length; j++) {
                    if (laneCheckboxes[j].checked !== undefined && laneCheckboxes[j].checked === false) {
                        laneCheckboxes[j].click();
                    }
                }
            } else if (turnSections[i].getElementsByClassName(left).length > 0
                       && laneCheckboxes[0].checked !== undefined
                       && laneCheckboxes[0].checked === false) {
                laneCheckboxes[0].click();
            } else if (turnSections[i].getElementsByClassName(right).length > 0
                       && laneCheckboxes[laneCheckboxes.length - 1].checked !== undefined
                       && laneCheckboxes[laneCheckboxes.length - 1].checked === false) {
                laneCheckboxes[laneCheckboxes.length - 1].click();
            }
        }
    }
}

function initLaneGuidanceClickSaver() {
    if (typeof W === 'undefined' || typeof W.map === 'undefined' || typeof W.loginManager === 'undefined') {
        setTimeout(initLaneGuidanceClickSaver, 800);
        return;
    }
    if (!W.loginManager.user) {
        // init on login for non-logged in users
        W.loginManager.events.register("login", null, initLaneGuidanceClickSaver);
        W.loginManager.events.register("loginStatus", null, initLaneGuidanceClickSaver);
        if (!W.loginManager.user) {
            return;
        }
    }

    let laneObserver = new MutationObserver(function (mutations) {
        if (W.selectionManager.getSelectedFeatures()[0] && W.selectionManager.getSelectedFeatures()[0].model.type === "segment") {
            let laneCountInput = document.getElementsByName("laneCount");
            if (laneCountInput.length > 0) {
                laneCountInput[0].addEventListener(
                    'change',
                    function() {
                        // wait for the input to appear
                        setTimeout(setTurns(), 50);
                    },
                    false
                );
            }

            let laneToolsButtons = document.getElementsByClassName("lt-add-lanes");
            for (let i = 0; i < laneToolsButtons.length; i++) {
                laneToolsButtons[i].addEventListener(
                    'click',
                    function() {
                        // wait for the input to appear
                        setTimeout(setTurns(), 50);
                    },
                    false
                );
            }
        }
    });

    laneObserver.observe(document.getElementById("edit-panel"), {
        childList: true,
        subtree: true
    });
}
