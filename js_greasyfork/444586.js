// ==UserScript==
// @name         Simple porn blocker
// @namespace    http://tampermonkey.net/SPB
// @version      1.0
// @description  A basic porn blocker that redirects you to vitas opera 2 every time you try to search for it
// @author       You
// @match        *://*/*
// @icon         https://i.imgur.com/Xe00FR1.png
// @grant        none
// @exclude      http://open.spotify.com/*/*
// @exclude      http://youtube.com/*
// @exclude      https://www.reddit.com/r/NoFap/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444586/Simple%20porn%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/444586/Simple%20porn%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (document.title.indexOf("Porn") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("hentai") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=1741");}
if (document.title.indexOf("rule34") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("rule 34") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("porno") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("sexo") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("xnxx") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("xvideos") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
if (document.title.indexOf("pornhub") != -1){
window.location.replace("https://youtu.be/8-qZD6XHVCA?t=174");}
// Your code here...
})();