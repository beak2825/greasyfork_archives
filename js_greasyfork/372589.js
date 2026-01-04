// ==UserScript==
// @name        FAImageFit
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Add a button to have a full view resized to screen.
// @author       ThatDumbCat
// @match        https://www.furaffinity.net/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372589/FAImageFit.user.js
// @updateURL https://update.greasyfork.org/scripts/372589/FAImageFit.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var img = document.getElementById("submissionImg");
        img.src = img.getAttribute("data-fullview-src");
        img.style.maxWidth = "100%";
        img.style.height = "auto";
})();
