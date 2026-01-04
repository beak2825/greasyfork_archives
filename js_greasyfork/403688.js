// ==UserScript==
// @name         Larger previews
// @version      0.1
// @description  Larger image previews
// @author       A Meaty Alt
// @match        https://deadfrontier.info/w/map/bossmap.php
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/403688/Larger%20previews.user.js
// @updateURL https://update.greasyfork.org/scripts/403688/Larger%20previews.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("img").forEach((img) => {
        img.src = img.src.replace("icon/", "")
        img.style.height = "256px";
        img.style.width = "256px"
    })
})();