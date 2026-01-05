// ==UserScript==
// @name        YouTube Header Relative Position
// @namespace   https://github.com/valera5505
// @description The top header will no longer scroll along with the page
// @author      Valery Kirichenko
// @homepage    https://github.com/valera5505/Relative-YouTube-Header
// @match       *://www.youtube.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24040/YouTube%20Header%20Relative%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/24040/YouTube%20Header%20Relative%20Position.meta.js
// ==/UserScript==

function setMasthead() {
    var isFixed;
    if (window.location.href.indexOf("watch") != -1)
        isFixed = false;
    else
        isFixed = true;

    document.getElementById("masthead-positioner").style.position = isFixed ? 'fixed' : 'relative';
    document.getElementById("masthead-positioner-height-offset").style.display = isFixed ? 'block' : "none";
}

setMasthead();

// SPFdone is event of YouTube AJAX page loader. I want to have relative header
// on video page, but normal header on other pages
document.addEventListener("spfdone", function() {
    setMasthead();
});
