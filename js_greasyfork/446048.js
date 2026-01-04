// ==UserScript==
// @name        Replace webp image on Fandom with png
// @description Really quick script that adds "&format=original" to each image opened in a new tab on fandom so that they do not save as a .webp.
// @version     1.0
// @match       *://*static.wikia.nocookie.net/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @namespace https://greasyfork.org/users/922450
// @downloadURL https://update.greasyfork.org/scripts/446048/Replace%20webp%20image%20on%20Fandom%20with%20png.user.js
// @updateURL https://update.greasyfork.org/scripts/446048/Replace%20webp%20image%20on%20Fandom%20with%20png.meta.js
// ==/UserScript==

var url = window.location.href;

if (url.indexOf("&format=original") == -1){
    url +="&format=original";
    window.location.replace(url)
}