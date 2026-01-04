// ==UserScript==
// @name         Disable Wikidot Editor Lock Timer
// @licence      CC BY-SA 3.0; https://creativecommons.org/licenses/by-sa/3.0/legalcode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script disables the 15 minutes editor lock timer
// @author       SBlake
// @include        *.wikidot.com/*
// @include        *.scp-wiki.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398329/Disable%20Wikidot%20Editor%20Lock%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/398329/Disable%20Wikidot%20Editor%20Lock%20Timer.meta.js
// ==/UserScript==

document.querySelector("#edit-button").onclick = function() {
    setTimeout(() => {
        WIKIDOT.modules.PageEditModule.utils.timerSetTimeLeft = function(a){
            WIKIDOT.modules.PageEditModule.vars.lockExpire = Infinity
        };
        WIKIDOT.modules.PageEditModule.vars.lockExpire = Infinity
    },1500);
};

