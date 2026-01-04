// ==UserScript==
// @name         Gates of Survival - Handout Clearer
// @namespace    dex.gos
// @version      1.0
// @description  This script will add a button to the Kingdom experience handout page. When pressed, the script will zero out every experience field on the screen.
// @author       Dex
// @match        https://www.gatesofsurvival.com/game/index.php?page=main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457898/Gates%20of%20Survival%20-%20Handout%20Clearer.user.js
// @updateURL https://update.greasyfork.org/scripts/457898/Gates%20of%20Survival%20-%20Handout%20Clearer.meta.js
// ==/UserScript==

let GoS_Handout = {
    // Configurable data.
    logging: false,

    // Static data.

    // Methods
    logText(text, objectData=null) {
        if (this.logging) {
            console.log("dex.gos.handout_clearer    " + text);

            if (objectData !== null) {
                console.log(objectData);
            }
        }
    },
    processChange: function (contentElement) {
        let GoS_Handout = this;
        let clearFunc = function() {
            let inputs = jQuery("input[type='number']", contentElement);
            this.logText("All inputs:", inputs);
            inputs.each(function(i, handoutInput) {
                handoutInput.value = 0;
            });
        }

        // Need to use two "prev" to get before script tag and "br" tag (otherwise there is an odd gap before the button).
        jQuery('#clan_handout_entry').prev().prev().before('<div id="dex_gos_clear" class="btn btn-success" style="text-shadow:1px 1px 6px #000;-moz-box-shadow:0 1px 2px #000; width:50%;">Clear Handout Values</div>');
        jQuery('#dex_gos_clear').on("click", jQuery.proxy(clearFunc, GoS_Handout));
    },
    checkAndProcessChange: function () {
        let hasHandoutSctn = jQuery("div#clan_handout_entry div.csstable", this.target).length;
        if (hasHandoutSctn > 0) {
            this.logText("On page with the kindom handout section.");
            this.processChange(this.target);
        } else {
            //this.logText("Not on page with the kindom handout section.");
        }
    },
    start: function () {
        let GoS_Handout = this;
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    GoS_Handout.checkAndProcessChange();
                }
            });
        });
        observer.observe(document.getElementById('page'), {attributes: true, childList: true, characterData: true});
    }
}

GoS_Handout.start();
