// ==UserScript==
// @name         EM deathsound
// @version      1.0
// @description  Adds button to profiles to listen to deathsound
// @author       Whitepimp007
// @match        https://epicmafia.com/user/*
// @match        https://epicmafia.com/u/*
// @grant        none
// @namespace https://greasyfork.org/users/105745
// @downloadURL https://update.greasyfork.org/scripts/28498/EM%20deathsound.user.js
// @updateURL https://update.greasyfork.org/scripts/28498/EM%20deathsound.meta.js
// ==/UserScript==


var profileLink = document.getElementsByClassName("lcontrols sel")[0].children[0].href;
var profileNumber = profileLink.replace("https://epicmafia.com/user/","");
console.log(profileNumber);

var deathSoundLink = "https://epicmafia.com/uploads/deathsounds/" + profileNumber + ".ogg";

var userbox = document.getElementById("finduserbox");

var constructSpan=document.createElement("span");
constructSpan.className="lcontrols";

var constructAnchor=document.createElement("a");
constructAnchor.href=deathSoundLink;

var constructI=document.createElement("i");
constructI.className="icon-music";
constructI.innterHTML="::before";

constructAnchor.appendChild(constructI);
constructSpan.appendChild(constructAnchor);
userbox.appendChild(constructSpan);