// ==UserScript==
// @name         Schoology Tools
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Fixes download of files with schoology
// @author       Hudson Newhouse
// @match        https://shcp.schoology.com/*
// @icon         https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477801/Schoology%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/477801/Schoology%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

//Remember to do control + s(or command + s on mac)to save after making any changes.

//Set this to 1 if you want it to remove the overdue box.
const overdue = 0

//Set this to 1 if you want it to not download and instead view.
const viewRemoval = 1

//Set this to 1 if you want to remove "skip to content" button
const skip = 1

const nameBlock = 0
const name = "Hudson Newhouse"

//Find view link
const nameElement = document.getElementsByClassName("LGaPf _3LkKR _17Z60 util-max-width-twenty-characters-2pOJU")[0];

if (viewRemoval == 1) {
// Check if the element was found
if (nameElement) {
    //Find Name
    const currentName = nameElement.textContent.trim();

    if ((currentName == name) || (nameBlock == 1)) {
        //Find view link
        const view = document.getElementsByClassName("view-file-popup  sExtlink-processed")[0];
        if (view) {
            const viewLink = view.href;
            //Remove view button
            console.log("Completed Document View Correction");
            view.remove();

            // Get all <span> elements with class "attachments-file-name"
            var spanElements = document.getElementsByClassName("attachments-file-name");

            // Iterate through the <span> elements and check if they contain a <a> element
            for (var i = 0; i < spanElements.length; i++) {
                var span = spanElements[i];
                const link = span.querySelector("a"); // Check if there's a <a> inside the <span>
                if (link) {
                    //Set download button to view link
                    link.href = viewLink;
                    //Make it open in a new tab
                    link.target = "_blank";
                }
            }
        }
    }
} else {
    console.log("Name element not found");
}
} else {console.log("Not Activated")}
if (overdue == 1) {
    const overdueElement = document.getElementById("overdue-submissions");
    overdueElement.remove();
}

if (skip == 1) {
    const skipElement = document.getElementsByClassName("skip visually-hidden sExtlink-processed")[0];
    skipElement.remove();
}

})();