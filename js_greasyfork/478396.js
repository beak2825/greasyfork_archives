// ==UserScript==
// @name         YT -> Invidious
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll to make thumbnails bordrerd in magenta, then those links will open in a new tab on invidious instead.
// @author       bitbatboot
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478396/YT%20-%3E%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/478396/YT%20-%3E%20Invidious.meta.js
// ==/UserScript==

(function() {
    window.addEventListener("scroll", hijackLinks);

    function hijackLinks() {
        document.querySelectorAll("a#thumbnail:not(.hijacked)").forEach(x => {
            x.classList.add("hikacked");
            x.style.border = "2px solid magenta";
            x.addEventListener("click", openVideo);
        });
    }

    function openVideo(e) {
        e.preventDefault();
        e.stopPropagation();
        let link = "https://onion.tube"+this.getAttribute("href");
        //console.log("opening", link);
        window.open(link);
    }
})();