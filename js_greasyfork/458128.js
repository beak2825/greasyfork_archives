// ==UserScript==
// @name         ADO Build & Deploy - Viewer+
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Rework HTML of build view in Azure DevOps
// @author       You
// @match        https://*.visualstudio.com/*/_build/results?*view=logs*
// @match        https://dev.azure.com/*/*/_build/results?*view=logs*
// @icon         https://www.google.com/s2/favicons?domain=azure.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458128/ADO%20Build%20%20Deploy%20-%20Viewer%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/458128/ADO%20Build%20%20Deploy%20-%20Viewer%2B.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const STAGE_PREFIX_ID = "icon-stage-";

    /**
     * Hide stage on click.
     * @param {Event} Event.
     * @param {number} Header index.
     * @returns {undefined} Nothing.
     */
    function hideStage(_event, _i) {
        console.log(_event);
        _event.stopPropagation();
        _event.preventDefault();

        const classList = document.getElementById(`${STAGE_PREFIX_ID}${_i}`).classList;
        const newClassList = [];
        // Change icon className
        classList.forEach((_className) => {
            if(_className === "ms-Icon--ChevronDownMed"){
                newClassList.push("ms-Icon--ChevronRightMed");
            } else if ( _className === "ms-Icon--ChevronRightMed" ){
                newClassList.push("ms-Icon--ChevronDownMed");
            } else {
                newClassList.push(_className);
            }
        });
        document.getElementById(`${STAGE_PREFIX_ID}${_i}`).className = newClassList.join(" ");
        document.getElementsByTagName("tbody")[_i].hidden = !document.getElementsByTagName("tbody")[_i].hidden;
    }

    // Get all stages headers
    const headers = document.getElementsByClassName("bolt-table-header-cell-content");
    for(let i = 0; i < headers.length; i++) {
        const currentHeader = headers[i];
        const parentHeader = currentHeader.parentElement;
        // Add icon to collapse/expand stages
        const iconHeaderHtml = '<span aria-hidden="true" id="' + STAGE_PREFIX_ID + i + '" class="bolt-tree-expand-button font-size cursor-pointer flex-noshrink fabric-icon ms-Icon--ChevronRightMed small" role="presentation"></span>';
        currentHeader.innerHTML = iconHeaderHtml + currentHeader.innerHTML;
        const iconHeader = document.getElementById(`${STAGE_PREFIX_ID}${i}`);
        // Hide all stages
        document.getElementsByTagName("tbody")[i].hidden = true;
        // Add listeners to hide/show stages
        iconHeader.addEventListener("click", (_event) => hideStage(_event, i));
        parentHeader.addEventListener("click", (_event) => hideStage(_event, i));
    }
})();
