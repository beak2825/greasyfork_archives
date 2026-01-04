// ==UserScript==
// @name         Mturk Worker Site - Full HIT Text (No ellipsis)
// @namespace    yuvaraja
// @version      3
// @description  .
// @author       yuvaraja
// @include      https://worker.mturk.com/
// @include      https://worker.mturk.com/projects
// @include      https://worker.mturk.com/?page_size=*
// @include      https://worker.mturk.com/?page_number=*
// @include      https://worker.mturk.com/tasks
// @include      https://worker.mturk.com/status_details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38147/Mturk%20Worker%20Site%20-%20Full%20HIT%20Text%20%28No%20ellipsis%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38147/Mturk%20Worker%20Site%20-%20Full%20HIT%20Text%20%28No%20ellipsis%29.meta.js
// ==/UserScript==

function fullHITText() {
    for(let truncatedTextElement of document.querySelectorAll(".text-truncate")) {
        truncatedTextElement.classList.remove("text-truncate");
    }

    for(let row of document.querySelectorAll(".desktop-row, .mobile-row")) {
        for(let divOrSpan of row.querySelectorAll("div,span")) {

            if(row.clientHeight < divOrSpan.clientHeight) {
                row.style.height = `${divOrSpan.clientHeight + Math.floor(divOrSpan.clientHeight * 0.3)}px`;
            }

        }
    }
}

fullHITText();

window.addEventListener("resize", fullHITText);