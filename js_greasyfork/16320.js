// ==UserScript==
// @name          Steam Check System Requirements Button
// @namespace     DoomTay
// @description   Adds a "check system requirements" button to the store page of a Steam app, which will see if a computer meets an app's system requirements
// @version       1.0.2
// @include       http://store.steampowered.com/app/*
// @include       https://store.steampowered.com/app/*
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/16320/Steam%20Check%20System%20Requirements%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/16320/Steam%20Check%20System%20Requirements%20Button.meta.js
// ==/UserScript==

var appID = window.location.href.match(/store.steampowered.com\/app\/(\d+)/)[1];

var sysReqButton = document.createElement("a");
sysReqButton.className = "linkbar";
sysReqButton.innerHTML = "Check system requirements";
sysReqButton.href = "steam://checksysreqs/" + appID;

var buttonsBlock = document.getElementsByClassName("underlined_links")[0].getElementsByClassName("details_block")[1];

//Usually will put the link above "View discussions", but that link may not always be there
buttonsBlock.insertBefore(sysReqButton, (buttonsBlock.querySelector("a[href*='/discussions/']") || buttonsBlock.lastElementChild));