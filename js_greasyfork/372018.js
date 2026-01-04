// ==UserScript==
// @name        OkCupid View Last Login On Profile
// @author      Fruzilla
// @description Displays the time and date that a user was last online on their profile.
// @include     *://*.okcupid.com/profile/*
// @exclude     *://*.okcupid.com/profile/*/questions* 
// @exclude     *://*.okcupid.com/profile/*/personality*
// @version     1
// @grant       none
// @run-at 	document-idle
// @noframes
// @namespace https://greasyfork.org/users/211162
// @downloadURL https://update.greasyfork.org/scripts/372018/OkCupid%20View%20Last%20Login%20On%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/372018/OkCupid%20View%20Last%20Login%20On%20Profile.meta.js
// ==/UserScript==

function displayDate(){
  var dateDiv = document.createElement("div");
  dateDiv.append("Last Online: " + new Date(profileParams.profile.lastLogin * 1000).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true}));
  dateDiv.setAttribute("style", "margin-bottom: 15px");
  dateDiv.setAttribute("id", "dateDiv");
  document.getElementById("react-profile-details").prepend(dateDiv);
}

displayDate();