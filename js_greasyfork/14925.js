// ==UserScript==
// @name          Wayback Machine Automatic Saver
// @namespace     DoomTay
// @description   Automatically saves pages on Wayback Machine when taken to such a prompt
// @include       http://web.archive.org/web/*
// @include       https://web.archive.org/web/*
// @include       http://wayback.archive.org/web/*
// @include       https://wayback.archive.org/web/*
// @version       1.0.3

// @downloadURL https://update.greasyfork.org/scripts/14925/Wayback%20Machine%20Automatic%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/14925/Wayback%20Machine%20Automatic%20Saver.meta.js
// ==/UserScript==

var saveLink = document.body.querySelector("#livewebInfo [href *= '/save/']");
if(saveLink != null) location.href = saveLink.href;