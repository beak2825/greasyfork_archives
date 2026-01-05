// ==UserScript==
// @name        Smashcast Chat Spellchecking
// @description Allows spellchecking in the chat field for Smashcast
// @namespace   https://www.smashcast.tv/
// @version     1
// @grant       none
// @include     http://smashcast.tv/*
// @include     https://smashcast.tv/*
// @include     http://www.smashcast.tv/*
// @include     https://www.smashcast.tv/*

// @downloadURL https://update.greasyfork.org/scripts/29794/Smashcast%20Chat%20Spellchecking.user.js
// @updateURL https://update.greasyfork.org/scripts/29794/Smashcast%20Chat%20Spellchecking.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
       
var x = document.getElementsByClassName("public-DraftEditor-content");
var i;
for (i = 0; i < x.length; i++) {
    x[i].spellcheck = "true";
}

}, false);


