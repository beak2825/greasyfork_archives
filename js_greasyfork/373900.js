// ==UserScript==
// @name         surviv.io Ad Blocker
// @namespace    https://greasyfork.org/en/users/223360
// @version      1.0.0
// @description  Remove ads from surviv.io
// @author       Zennar
// @match        *://surviv.io/*
// @grant        none
// @icon         http://surviv.io/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373900/survivio%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/373900/survivio%20Ad%20Blocker.meta.js
// ==/UserScript==

'use strict';
//Make things easy
function delAds(eID){
    if (document.getElementById(eID)){
        document.getElementById(eID).remove();
    }
}
//Do the job
setInterval(function() {
    var adsA=document.getElementsByClassName("ad-block-leaderboard-bottom")[0];
    delAds("start-top-left");
    delAds("leaderboard-front");
    delAds("ad-block-left");
    delAds("start-bottom-left");
    delAds("adunit");
    delAds("ui-stats-ad-container-desktop");
    delAds("surviv-io_728x90")
    if(adsA){
        adsA.remove();
    }
},1000);
