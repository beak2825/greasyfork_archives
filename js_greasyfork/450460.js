// ==UserScript==
// @name        RARBG Thumbnail
// @namespace   Violentmonkey Scripts
// @match       https://rarbg.to/torrents.php
// @grant       none
// @version     1.0
// @author      skygate2012
// @description Display the thumbnail of each torrent listing without mouse hover.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450460/RARBG%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/450460/RARBG%20Thumbnail.meta.js
// ==/UserScript==

document.querySelectorAll(".lista2t .lista > a[onmouseover]").forEach((item, index) => {
    setTimeout(() => {
        var img_url = item.getAttribute("onmouseover").match(/src=\\'(.*)\\/);
        item.parentElement.parentElement.querySelector("img").src = img_url[1];
    }, index * 100);
})
