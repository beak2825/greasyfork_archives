// ==UserScript==
// @name        Bandcamp: Artist to Discography
// @version     1.0
// @description When you click the artist name on an album page, it'll take you to the discography page
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/UserScripts
// @match       https://*.bandcamp.com/album/*
// @icon        https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/500414/Bandcamp%3A%20Artist%20to%20Discography.user.js
// @updateURL https://update.greasyfork.org/scripts/500414/Bandcamp%3A%20Artist%20to%20Discography.meta.js
// ==/UserScript==

var linkSection = document.getElementById("name-section");
var linkToChange = linkSection.querySelector("h3 span a").href;
var newUrl = linkToChange + "music";

linkSection.querySelector("h3 span a").href = newUrl;