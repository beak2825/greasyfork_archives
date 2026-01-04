// ==UserScript==
// @name          JVC Signature Generator
// @version        0.1.85
// @description   Script pour ajouter une signature sur les forums et les commentaires de jeuxvideo.com
// @include       https://www.jeuxvideo.com/messages-prives/*
// @include       https://www.jeuxvideo.com/commentaires/*
// @include       https://www.jeuxvideo.com/forums/0-*
// @include       https://www.jeuxvideo.com/forums/3-*
// @include       https://*.forumjv.com/0-*
// @include       https://*.forumjv.com/3-*
// @include       https://www.jvflux.com/commentaires/*
// @include       https://www.forums.jvflux.com/1-*
// @include       https://www.forums.jvflux.com/3-*
// @include       https://jvflux.com/commentaires/*
// @include       https://forums.jvflux.com/1-*
// @include       https://forums.jvflux.com/3-*
// @homepage      http://jellytime.free.fr/jvcsignature/
// @namespace     http://jellytime.free.fr/jvcsignature/
// @author        JellyTime
// @contributor   JellyTime
// @downloadURL https://update.greasyfork.org/scripts/425325/JVC%20Signature%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/425325/JVC%20Signature%20Generator.meta.js
// ==/UserScript==

var ligne1 = " ";
var base = document.getElementsByTagName("textarea").item(0).value;

function jvc () {
document.getElementsByTagName("textarea").item(0).value = /* base + */ "\n" + "\n" + ligne1; 
clearInterval (jvcid) 
}
jvcid = setInterval (jvc,0)