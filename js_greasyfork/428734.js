// ==UserScript==
// @name         SFDC Open Task Lightning Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  You can open SFDC Classic New Task on Lightning with this script.
// @author       You
// @match        https://hp.lightning.force.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428734/SFDC%20Open%20Task%20Lightning%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/428734/SFDC%20Open%20Task%20Lightning%20Mode.meta.js
// ==/UserScript==

'use strict';


// in loop to always be searching for a case
setInterval(function () {
    // URL of page
    let nameStorage = location.pathname
    // link if exist
    let removeNewTask = document.querySelector("#open_new_task")
    let linkLighting

    if (nameStorage.includes("/lightning/r/Case/") && !nameStorage.includes("/related/OpenActivities/view")) {

        if (!removeNewTask) {
            // Styling
            linkLighting = document.createElement("a")
            linkLighting.innerText = "Open new task"
            linkLighting.id = "open_new_task"
            linkLighting.target = "_blank"
            linkLighting.style.display = "block"
            linkLighting.style.paddingTop = "8px"
            linkLighting.style.paddingBottom = "10px"
            linkLighting.style.zIndex = "10"
            linkLighting.style.right = "20px"
            linkLighting.style.top = "50px"
            linkLighting.style.position = "absolute"
            // Append to page
            document.body.appendChild(linkLighting)
        }

        let caseId = nameStorage.replace("/lightning/r/Case/", "").replace("/view", "")
        removeNewTask.href = `https://hp.my.salesforce.com/00T/e?what_id=${caseId}&isdtp=vw`

    } else if (!nameStorage.includes("/lightning/r/Case/") || nameStorage.includes("/related/OpenActivities/view")) {
        if (removeNewTask) {
            removeNewTask.remove()
        }
    }
}, 100)