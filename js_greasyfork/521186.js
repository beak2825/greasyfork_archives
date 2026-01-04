// ==UserScript==
// @name         Remove Ugly Pixiv Sections
// @namespace    http://tampermonkey.net/
// @version      2024-11-18
// @description  Hides certain pixiv carosels
// @author       Cajunwildcat
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521186/Remove%20Ugly%20Pixiv%20Sections.user.js
// @updateURL https://update.greasyfork.org/scripts/521186/Remove%20Ugly%20Pixiv%20Sections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const a = [
        "ranking",
        "Requested illustrations",
        "Newest articles on pixivision",
        "Popular tags",
        "Ongoing contests",
        "Contest results",
        "Popular Projects",
        "Recommended users",
        "Newest by users you follow",
        "Newest by all"
    ];
    const maxWaiting = 20;
    let waiting = 0;
    function timeout () {
        if (waiting > maxWaiting) return;
        setTimeout(() =>{
            if (document.querySelectorAll(".sc-7zddlj-3.kWbWNM").length > 3) {
                if ([...document.querySelectorAll(".sc-7zddlj-3.kWbWNM")].slice(-1)[0].innerHTML === "Newest by all") {
                    setTimeout(clearDivs,5000);
                }
            }
            else if (waiting < maxWaiting) {
                console.log("waiting");
                waiting++;
                timeout();
            }
        },300);
    }
    function clearDivs () {
        document.querySelectorAll("h2").forEach(e=>{
            a.forEach(f => {
                if (e.innerHTML.match(f)) {
                    console.log(`Removed ${f}`);
                    e.closest(".sc-jgyytr-1").remove();
                }
            })
        });
        document.querySelectorAll(".sc-3mzzpc-0.NzNc").forEach(e=>e.remove());
        console.log("Finished");
    }
    timeout();
})();