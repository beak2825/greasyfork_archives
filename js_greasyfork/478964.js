// ==UserScript==
// @name        Watch on Invidious/Piped
// @homepageURL https://gitlab.com/menguele/watch-on-invidious
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     0.1
// @author      menguele
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @description Scroll to open videos on Invidious;
// @match *://*.youtube.com/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/478964/Watch%20on%20InvidiousPiped.user.js
// @updateURL https://update.greasyfork.org/scripts/478964/Watch%20on%20InvidiousPiped.meta.js
// ==/UserScript==
InvidiousInstance = 'https://vid.puffyan.us/';//Change this to your preffered instance
middleClickRedirect = true;//True redirects only on middle click, false redirects only on left click

window.addEventListener("scroll", hijackLinks); //Only activates the script after a mouse wheel scroll

function hijackLinks() {
    document.querySelectorAll("a#thumbnail:not(.hijacked)").forEach(x => {
        x.classList.add("hijacked"); // Fix typo here (changed "hikacked" to "hijacked")
        x.style.border = "2px solid magenta";
        middleClickRedirect ? x.addEventListener("auxclick", openVideo):x.addEventListener("click", openVideo);
    });
}

function openVideo(e) {
    e.preventDefault();
    e.stopPropagation();
    let link = InvidiousInstance + this.getAttribute("href");
    //console.log("opening", link);
    middleClickRedirect ? window.open(link,"_blank").blur():window.open(link);
}
