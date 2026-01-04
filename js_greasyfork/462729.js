// ==UserScript==
// @name         WaniKani Lesson Enter Key
// @namespace    https://theusaf.org
// @version      1.1.0
// @description  Use the enter key to move between slides in lessons
// @author       theusaf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @match        https://www.wanikani.com/subjects/*/lesson*
// @match        https://www.wanikani.com/subject-lessons/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462729/WaniKani%20Lesson%20Enter%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/462729/WaniKani%20Lesson%20Enter%20Key.meta.js
// ==/UserScript==

window.addEventListener("keyup", (event) => {
    const { target, code } = event;
    if (code !== "Enter") return;
    if (
        target.nodeName === "TEXTAREA" ||
        target.nodeName === "INPUT" ||
        target.nodeName === "A" ||
        target.nodeName === "BUTTON" ||
        target.nodeName === "SELECT"
    ) return;
    event.preventDefault();
    if (event.shiftKey) {
        document.querySelector(".subject-slide:not([hidden]) [data-subject-slides-target='prevButton']").click();
    } else {
        document.querySelector(".subject-slide:not([hidden]) [data-subject-slides-target='nextButton']").click();
    }
})
