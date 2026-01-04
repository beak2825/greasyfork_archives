// ==UserScript==
// @name         Test Video warnings
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Warns to make test videos private
// @author       Jacqueb
// @match        https://www.youtube.com/*
// @include      https://restream.io/titles*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380659/Test%20Video%20warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/380659/Test%20Video%20warnings.meta.js
// ==/UserScript==

setInterval(function() {starter()},0);
function starter() {
    if(document.body.getElementsByTagName("A")[0] != null) {for(var z = 0; z < document.body.getElementsByTagName("A").length; z++) {if(document.body.getElementsByTagName("A")[z].getElementsByClassName("added")[0] == null) {if(document.body.getElementsByTagName("A")[z].innerText.toLowerCase().split("test")[1] != null) {document.body.getElementsByTagName("A")[z].innerHTML = document.body.getElementsByTagName("A")[z].innerText + "<b><span style='color: red' class='added'> Warning: make test videos private or unlisted!</span></b>"}}}}
    if(document.body.getElementsByTagName("A")[0] != null) {for(var z1 = 0; z1 < document.body.getElementsByTagName("A").length; z1++) {if(document.getElementsByTagName("A")[z1].id == "creator-editor-title-link") {if(document.getElementById("added2") == null) {if(document.body.getElementsByTagName("A")[z1].innerText.toLowerCase().split("test")[1] != null) {if(document.getElementsByClassName("privacy-select")[0] != null) {document.getElementsByClassName("privacy-select")[0].style.border = "solid 3px red"; document.getElementsByClassName("privacy-select")[0].parentElement.innerHTML += "<b><span style='color: red' id='added2'>Test videos should be made private or unlisted!</span></b>"}}}}}}
    if(document.getElementById("footer-links-secondary") != null) {document.getElementById("footer-links-secondary").getElementsByTagName("B")[0].style.display = "none"}
    if(document.body.getElementsByTagName("yt-formatted-string")[0] != null) {for(var z2 = 0; z2 < document.body.getElementsByTagName("yt-formatted-string").length; z2++) {if(document.getElementById("added3") == null) {if(document.body.getElementsByTagName("yt-formatted-string")[z2].innerText.toLowerCase().split("test")[1] != null) {console.log(document.getElementsByTagName("yt-formatted-string")[z2].innerHTML += "<br><b><span style='color: red' id='added3'>WARNING: Test videos should be made private or unlisted!</span></b>")}}}}
    if(document.getElementsByClassName("js-title-text")[0] != null) {if(document.getElementsByClassName("js-title-text")[0].innerText.toLowerCase().split("test")[1] != null) {if(document.getElementById("restreamextra") == null) {document.getElementsByClassName("app-page-title__text")[0].innerHTML += "<span id='restreamextra' style='color: red'><b>Make sure test videos are private/unlisted!</b></span>"}}}
}