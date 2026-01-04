// ==UserScript==
// @name        AO3: Display Full Work Conditionally
// @version     1.0.1
// @description Makes chaptered works under a certain wordcount display in full instead of chaptered
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/Userscripts
// @match       *://archiveofourown.org/works/*/chapters/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499197/AO3%3A%20Display%20Full%20Work%20Conditionally.user.js
// @updateURL https://update.greasyfork.org/scripts/499197/AO3%3A%20Display%20Full%20Work%20Conditionally.meta.js
// ==/UserScript==

// @match url makes it so this only runs on chaptered works

var wordLimit = 8000; // fics under and including this amount will be displayed in full

var totalWords = parseFloat(document.querySelectorAll("dd.words")[0].innerHTML.replace(/,/, "")); // get fic word count

if (totalWords <= wordLimit) { // if word count is under or equal to limit
    window.location = window.location.href.replace(/\/chapters\/[0-9]+/, "?view_full_work=true") // redirect to full work version
}   // replaces the chapter part of url with view full work
