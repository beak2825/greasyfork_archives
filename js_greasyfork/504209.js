// ==UserScript==
// @name        AO3: Incomplete. Continue?
// @version     1.0
// @description Checks how long ago incomplete works were last updated and displays a warning if longer than user set time period.
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/UserScripts
// @match       https://archiveofourown.org/works/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/504209/AO3%3A%20Incomplete%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/504209/AO3%3A%20Incomplete%20Continue.meta.js
// ==/UserScript==

// note: months are presumed at 30 days so worst case, warnings are gonna be off by a couple days here and there

// == START Settings ==

const maxTimeAllowed = 6; // months

// == END Settings ==

const chapters = document.querySelector("dd.chapters").innerText;

// if not matching chapter count
if (chapters.match(/\S+(?=\/)/g)[0] != chapters.match(/(?<=\/)\S+/g)[0]) {
    // get dates
    const currentDate = new Date();
    const lastUpdated = new Date(document.querySelector("dd.status").innerText);

    // do maths
    const diffTime = currentDate - lastUpdated;
    const timeSinceUpdateDays = diffTime / (1000 * 60 * 60 * 24);
    const timeSinceUpdateYears = timeSinceUpdateDays / (30 * 12);
    const roundedDays = Math.round(timeSinceUpdateDays);
    const roundedYears = timeSinceUpdateYears.toFixed(2);

    // find date of okay update time
    const updateLimit = currentDate.setDate(currentDate.getDate() - (maxTimeAllowed * 30));

    // see if warning needed
    if (updateLimit > lastUpdated) {
        const message = "This work is currently marked incomplete and was last updated " + roundedDays + " days or " + roundedYears + " years ago. Are you sure you wish to continue?";

        const subject = document.querySelector("#inner");
        subject.insertAdjacentHTML( 'afterbegin', '<div style="border: 2px solid red; background: #ffb5b5; color: black; padding: 10px 30px; max-width: max-content; margin: 0 auto;">'+ message + '</div>' );
    }
}