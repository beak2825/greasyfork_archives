// ==UserScript==
// @name        ISEN Background Selector
// @namespace   isenbackground
// @include     https://web.isen-bretagne.fr/uPortal/*
// @version     1
// @description Add Custom Background on ISEN Website
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/10518/ISEN%20Background%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/10518/ISEN%20Background%20Selector.meta.js
// ==/UserScript==

if (!GM_getValue("imgLink"))
{
    imgLink = prompt("Please enter Custom Image Link", "Image");
    GM_setValue("imgLink", imgLink);
}
else
{
    imgLink = GM_getValue("imgLink");
}

var newBackground = document.createElement("A");
var backgroundImage = document.createElement("IMG");
var backgroundCaption = document.createElement("SPAN");

newBackground.href = "#";
backgroundImage.src = imgLink;

backgroundCaption.className = "caption";
backgroundCaption.innerHTML = "Custom Image";

newBackground.appendChild(backgroundImage);
newBackground.appendChild(backgroundCaption);

var backgroundSelectorClass = document.getElementsByClassName("background-edit-menu")[0];

backgroundSelectorClass.appendChild(newBackground);