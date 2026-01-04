// ==UserScript==
// @name            Open Random 20 profiles for sampling
// @namespace       http://tampermonkey.net/
// @description     Context menu to execute UserScript
// @match           https://www.linkedin.com/recruiter/search/saved/*
// @version         1.0
// @author          author
// @grant           GM_openInTab
// @grant           GM_log
// @run-at          context-menu
// @downloadURL https://update.greasyfork.org/scripts/386970/Open%20Random%2020%20profiles%20for%20sampling.user.js
// @updateURL https://update.greasyfork.org/scripts/386970/Open%20Random%2020%20profiles%20for%20sampling.meta.js
// ==/UserScript==]]]

"use strict";
open_profiles();

function open_profiles() {
    var links = document.getElementsByTagName('a');
    var index =0;
    var profileCount = 0;
    var alerted = false;
    var data_track = "";
    var countValue = document.querySelector('.talent-pool-tab-title .count').innerHTML;
    //alert(countValue);
    var pagesToNavigate = 1;
    if(!isNaN(countValue)) {
        pagesToNavigate = countValue % 25;
    }
    while (index < links.length && profileCount < 20) {
        var profile_link = links[index].getAttribute("data-track");
        //GM_log(profile_link);
        if(profile_link == "profile-link") {
            profileCount++;
            GM_log(profile_link);
            window.open(links[index].href, "_blank").focus();
        }
        index++;
    }
}