// ==UserScript==
// @name         [MTurk Worker] Auto Accept Checker
// @namespace    https://github.com/Kadauchi
// @version      1.0.1
// @description  Keeps the auto accept next hit checkbox always checked.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/projects/*/tasks/*?assignment_id=*
// @downloadURL https://update.greasyfork.org/scripts/35890/%5BMTurk%20Worker%5D%20Auto%20Accept%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/35890/%5BMTurk%20Worker%5D%20Auto%20Accept%20Checker.meta.js
// ==/UserScript==

(function() {
    const checkbox = document.querySelector(`[data-react-class="require('reactComponents/workPipeline/AutoAcceptCheckbox')['default']"]`).getElementsByTagName(`input`)[0];

    if (checkbox.checked === false) {
        checkbox.click();
    }
})();