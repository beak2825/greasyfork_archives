// ==UserScript==
// @name         mitreview-shutup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  block mit review story counter popup and re-enable scroll
// @author       tlrib
// @match        https://www.technologyreview.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436769/mitreview-shutup.user.js
// @updateURL https://update.greasyfork.org/scripts/436769/mitreview-shutup.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let observer = new MutationObserver(() => {

        if (document.querySelector(".overlayFooter__roadblockWrapper--cbMiv")) {
            console.info("mitreview-shutup: removing story counter popup");
            document.querySelector(".overlayFooter__roadblockWrapper--cbMiv").style.display = "none";
        }

        if (document.querySelector(".body__obscureContent--3qe0X")) {
            document.querySelector(".body__obscureContent--3qe0X").classList.remove("body__obscureContent--3qe0X");
        }
    });

    observer.observe(document.querySelector("body"), {
        attributes: true,
    });
})();