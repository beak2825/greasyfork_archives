// ==UserScript==
// @name         Jump to Queue After Boot
// @namespace    salembeats
// @version      1
// @description  Back to Queue after boot-out
// @author       You
// @include      https://worker.mturk.com/
// @include      https://worker.mturk.com/projects
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387216/Jump%20to%20Queue%20After%20Boot.user.js
// @updateURL https://update.greasyfork.org/scripts/387216/Jump%20to%20Queue%20After%20Boot.meta.js
// ==/UserScript==

let reactAlertElement = document.querySelector(`div[data-react-class="require('reactComponents/alert/Alert')['PureAlert']"]`);

if(reactAlertElement) {
    let reactAlert = JSON.parse(reactAlertElement.dataset.reactProps);

    if(reactAlert.header.toLowerCase().includes("hit submitted")) {
        window.location.href = "http://worker.mturk.com/tasks";
    }
    else if(reactAlert.header.toLowerCase().includes("hit submitted")) {
        window.location.href = "http://worker.mturk.com/tasks";
    }
    else if(reactAlert.header.toLowerCase().includes("there are no more of these hits available")) {
       window.location.href = "http://worker.mturk.com/tasks";
    }
}