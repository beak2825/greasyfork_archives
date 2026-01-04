// ==UserScript==
// @name           Witch Spoilers
// @namespace      */boards.4chan.org/*
// @description    Replace spoilers with witch runes
// @include        */boards.4chan.org/*
// @include        */boards.4channel.org/*
// @version         1.4
// @downloadURL https://update.greasyfork.org/scripts/41070/Witch%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/41070/Witch%20Spoilers.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle ("span.spoiler { } span.spoiler:hover,span.spoiler:focus { } s,s a:not(:hover) {  color:#FFF!important;  background-color:#000!important;  font-family:MadokaRunes!important; } s:hover,s:focus,s:hover a {   color:#FF!important;   background-color:#000!important;   font-family:inherit!important;  } s:hover a {  text-decoration:none!important; } ");