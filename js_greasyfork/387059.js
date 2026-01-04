// ==UserScript==
// @name            Open All profiles - Page 1
// @namespace       http://tampermonkey.net/
// @description     Context menu to execute UserScript
// @match           https://www.linkedin.com/recruiter/search/saved/*
// @version         1.1
// @author          author
// @grant           GM_openInTab
// @grant           GM_log
// @run-at          context-menu
// @downloadURL https://update.greasyfork.org/scripts/387059/Open%20All%20profiles%20-%20Page%201.user.js
// @updateURL https://update.greasyfork.org/scripts/387059/Open%20All%20profiles%20-%20Page%201.meta.js
// ==/UserScript==]]]]

"use strict";
open_profiles();

function open_profiles() {
    const TOTAL_PROFILES = 20;
    var links = document.getElementsByTagName('a');
    var index =0;
    var profileCount = 0;
    var pagesToOpen = 1;
    var alerted = false;
    var data_track = "";
    var countValue = document.querySelector('.talent-pool-tab-title .count').innerHTML;
    var profiles = [];
    //alert(countValue);
    var pagesToNavigate = 1;
    if(!isNaN(countValue)) {
        pagesToNavigate = Math.ceil(countValue % 25);
    }
    if(pagesToNavigate > 1) {
        pagesToOpen = Math.ceil(TOTAL_PROFILES / pagesToNavigate);
    }

    while (index < links.length && profileCount < TOTAL_PROFILES) {
        var profile_link = links[index].getAttribute("data-track");
        //GM_log(profile_link);
        if(profile_link == "profile-link") {
            profiles.push(links[index]);
            profileCount++;
            //            GM_log(profile_link);
        }
        index++;
    }

    index = 0;
    while (index < profileCount) {
        window.open(profiles[index].href, "_blank").focus();
        index++;
    }
}