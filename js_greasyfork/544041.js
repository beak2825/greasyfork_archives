// ==UserScript==
// @name          WME ShowTown
// @description   Moves the UR and place update windows down and to the right so the town name and FUME buttons are not covered up
// @namespace     TxAgBQ
// @grant         none
// @grant         GM_info
// @version       20251209
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @author        Rick Zabel (ShowTown) and TxAgBQ (update to shift UR right)
// @license       MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/544041/WME%20ShowTown.user.js
// @updateURL https://update.greasyfork.org/scripts/544041/WME%20ShowTown.meta.js
// ==/UserScript==

function ShowTown() {
    try {
        // Target the new panel structure - the root container for draggable panels
        var panelElement = $('#waze-map-container > div.overlay-container > div.root--_UIQw');

        // Check if the panel element exists and has a length greater than 0.
        // This ensures jQuery found the element on the page.
        if (typeof panelElement !== "undefined" && panelElement.length > 0) {
            // Define the CSS rules to apply.
            // margin-top:25px !important; moves the element down by 25 pixels. Changed to 0 on 9 Dec 25 version
            // margin-left:60px !important; moves the element to the right by 60 pixels.
            // The !important flag helps ensure these rules override Waze's default styles.
            var cssRules = '#waze-map-container > div.overlay-container > div.root--_UIQw { margin-top:0px !important; margin-left:60px !important;}';

            // Check if our custom style tag already exists.
            // We append it only once to avoid cluttering the <head> with duplicate tags.
            if (!$('style#showtown-style').length) {
                $("head").append($('<style type="text/css" id="showtown-style">' + cssRules + '</style>'));
                console.log("ShowTown: Injected custom CSS for panel adjustment.");
            } else {
                // If the style tag already exists, ensure its content is correct.
                // This helps in case of re-runs or dynamic changes.
                $('style#showtown-style').html(cssRules);
            }
        }

        // Set a timeout to re-run this function regularly.
        // This is crucial for dynamically loaded pages like Waze Map Editor.
        // It ensures the styles are applied even if the elements load later or if
        // Waze's own JavaScript tries to override them after initial load.
        // Running every 1 second provides a good balance without excessive overhead.
        setTimeout(ShowTown, 1000);
    } catch (err) {
        // If an error occurs (e.g., jQuery not yet loaded), log it and
        // still try to re-run the function after a delay.
        console.error("ShowTown script error:", err);
        setTimeout(ShowTown, 1000);
    }
}

// Initial call to ShowTown to start the process.
// This will kick off the continuous checking loop.
setTimeout(ShowTown, 1000);