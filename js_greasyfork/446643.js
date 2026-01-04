// ==UserScript==
// @name         WME Segment ID Mover
// @namespace    https://fxzfun.com/
// @version      1.0
// @description  Removes the segment ids from the top of the edit panel and places them at the bottom, as well as moving the segment warnings as well.
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/446643/WME%20Segment%20ID%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/446643/WME%20Segment%20ID%20Mover.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    function selectionHandler() {
        if (W.selectionManager.hasSelectedFeatures()) {
            // wait for panel to open
            setTimeout(() => {
                var idsElement = document.querySelector(".feature-ids-details");
                if (idsElement) idsElement.style.display = "none";
                // move segment ids to bottom
                document.querySelector(".elementHistoryContainer").insertAdjacentElement("beforeBegin", document.querySelector("wz-caption.feature-id"));
                document.querySelector("wz-caption.feature-id").classList = "feature-ids-details";

                // move segment warnings to bottom
                document.querySelector(".elementHistoryContainer").insertAdjacentElement("afterEnd", document.querySelector("wz-alerts-group"));
            }, 200);
        }
    }

    function initialize() {
        W.selectionManager.events.register('selectionchanged', this, selectionHandler);
    }

    W?.userscripts?.state?.isReady ? initialize() : document.addEventListener("wme-ready", initialize, { once: true });
})();