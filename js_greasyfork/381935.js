// ==UserScript==
// @name         q0 and focus
// @namespace		https://greasyfork.org/en/users/10060-lisugera
// @version		0.1
// @description		Switches weapon to Q0 in air battle and changes focus to fight button
// @author		lisugera
// @match        https://www.erepublik.com/*/military/battlefield/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/381935/q0%20and%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/381935/q0%20and%20focus.meta.js
// ==/UserScript==

if (document.getElementsByClassName("aircraft_pvp").length === 0) return;
document.getElementsByClassName("weapon_link nolink")[0].click();
document.getElementById("fight_btn").focus();