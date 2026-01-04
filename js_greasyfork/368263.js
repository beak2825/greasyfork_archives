// ==UserScript==
// @name         Roblox Poor/Rich Check
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  :)
// @author       FuginCZ
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368263/Roblox%20PoorRich%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/368263/Roblox%20PoorRich%20Check.meta.js
// ==/UserScript==

const robux = document.getElementById("nav-robux-amount");
const OriginalRobux = robux.innerHTML;

function Set()
{
    if (Number(OriginalRobux) <= 0)
    {
        robux.innerHTML = "Extra Poor - " + OriginalRobux;
    } else if(Number(OriginalRobux) >= 500) {
        robux.innerHTML = "Rich - " + OriginalRobux;
    } else {
        robux.innerHTML = "Poor - " + OriginalRobux;
    }

    setTimeout(Set,1);
}

Set()