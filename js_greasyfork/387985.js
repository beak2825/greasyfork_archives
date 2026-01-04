// ==UserScript==
// @name         SOJM (Slow Or Just Me?) Installer
// @namespace    salembeats
// @version      1
// @description  Is it slow on Amazon Mechanical Turk? Install this script to tell whether MTurk is slow for everyone, or just for you. Averages, leaderboards, leagues, and rivalries. This script will prompt you to install SOJM the first time you visit your dashboard on mTurk after installing.
// @author       salembeats
// @include      https://worker.mturk.com/dashboard*
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/387985/SOJM%20%28Slow%20Or%20Just%20Me%29%20Installer.user.js
// @updateURL https://update.greasyfork.org/scripts/387985/SOJM%20%28Slow%20Or%20Just%20Me%29%20Installer.meta.js
// ==/UserScript==

if(!GM_getValue("runOnce")) {
    window.open("https://gist.github.com/salembeats/fd67a279b7ec7977f2f01a90cbd0958b/raw/mturk-slow-or-just-me.user.js");
    GM_setValue("runOnce", true);
}