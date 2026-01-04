// ==UserScript==
// @name        Faction Profile Onliners Only
// @description Hides offline members from faction page
// @namespace   Scamlife
// @include     *.torn.com/factions.php?step=profile&ID=*
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/398905/Faction%20Profile%20Onliners%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/398905/Faction%20Profile%20Onliners%20Only.meta.js
// ==/UserScript==

// hijacked from Myhedin (RIP)

document.querySelectorAll('.member-list > li').forEach(element => {
    let status = element.querySelector('div ul li').title;
    if (!(status.includes("Online") || (status.includes("Idle")))) {
        element.style.display = 'none';
    }
});
