// ==UserScript==
// @name        Steam Decensor
// @namespace   http://twitter.com/DarkwindLeaf/
// @version     1.0
// @author      DarkwindLeaf
// @description Removes censors on Steam screenshot descriptions and reviews. A script for manly Steam users.
// @icon        https://dl.dropboxusercontent.com/u/21409664/icons/decensor.png
// @include     http://steamcommunity.com/sharedfiles/filedetails/?id=*
// @include     https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @include     http://steamcommunity.com/id/*/recommended/*
// @include     https://steamcommunity.com/id/*/recommended/*
// @downloadURL https://update.greasyfork.org/scripts/3244/Steam%20Decensor.user.js
// @updateURL https://update.greasyfork.org/scripts/3244/Steam%20Decensor.meta.js
// ==/UserScript==

if (location.href.indexOf("sharedfiles") != -1) {
    var desc = document.querySelector(".screenshotDescription");
    var realDesc = '"' + document.getElementsByClassName("descField")[0].value + '"';
    desc.innerHTML = realDesc;
} else {
    var review = document.getElementById("ReviewText");
    var realReview = document.getElementById("ReviewEditTextArea").value;
    review.innerHTML = realReview;
}