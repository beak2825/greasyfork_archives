// ==UserScript==
// @name         [MTurk Worker] Confirm Return HIT
// @namespace    https://github.com/Kadauchi
// @version      1.0.1
// @description  Prevent accidental returns by adding a prompt when returning a HIT
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/tasks*
// @include      https://worker.mturk.com/projects/*/tasks/*?assignment_id=*
// @downloadURL https://update.greasyfork.org/scripts/35209/%5BMTurk%20Worker%5D%20Confirm%20Return%20HIT.user.js
// @updateURL https://update.greasyfork.org/scripts/35209/%5BMTurk%20Worker%5D%20Confirm%20Return%20HIT.meta.js
// ==/UserScript==

(function() {
    document.addEventListener(`submit`, (event) => {
        const returning = event.target.querySelector(`[value="delete"]`);

        if (returning) {
            event.preventDefault();

            const c = confirm(`Are you sure you want to return this HIT?\n\nPress OK to return the HIT or press Cancel to continue working on the HIT.`);

            if (c) {
                event.target.submit();
            }
        }
    });
})();