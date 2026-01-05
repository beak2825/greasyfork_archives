// ==UserScript==
// @name        Protopage Ad Zapper
// @namespace   OPK
// @include     https://www.protopage.com/*
// @grant	none
// @version     1.11
// @description Remove Ads from free Protopage
// Recommended setting in most cases: Run at "document-body"
// @downloadURL https://update.greasyfork.org/scripts/24279/Protopage%20Ad%20Zapper.user.js
// @updateURL https://update.greasyfork.org/scripts/24279/Protopage%20Ad%20Zapper.meta.js
// ==/UserScript==
var div = document.getElementById("ad-0");
if (div) {
    // div.style.display = "none"; // Hides the ad, leaves the space
    // Or
    div.parentNode.removeChild(div); // Removes it entirely
}