// ==UserScript==
// @name         YouTube Logo Replacer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Replace the YouTube Logo with your custom text!
// @author       Dan6erbond
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36592/YouTube%20Logo%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/36592/YouTube%20Logo%20Replacer.meta.js
// ==/UserScript==

//YouTube Logo Replacer
//Insert this script into your console
//This script is also available on GreasyFork:
//https://greasyfork.org/de/scripts/36592-youtube-logo-replacer

var innerHTML = ''; //Insert the text with which the YouTube logo should be replaced
//You can also insert images: <img src="imgLink"></img>

setTimeout(replaceLogo, 500);

function replaceLogo(){
    document.getElementById('logo-icon-container').innerHTML = innerHTML;
}