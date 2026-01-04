// ==UserScript==
// @name         Add scpexplained links to SCP wiki
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds scpexplained links (http://scpexplained.wikidot.com/) to http://www.scp-wiki.net/ and http://www.scpwiki.com/ for ease of access. Not all SCPs have a corresponding scpexplained article
// @author       You
// @include      *scp-wiki.net*
// @include      *scpwiki.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398725/Add%20scpexplained%20links%20to%20SCP%20wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/398725/Add%20scpexplained%20links%20to%20SCP%20wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var box = document.getElementsByClassName("list-pages-box");
    if (box != null && box.length > 1) {
        box[1].innerHTML = box[1].innerHTML.replace(/(href="(.*)">.*<\/a>)/g, '$1 (<a href="http://scpexplained.wikidot.com$2">Explained</a>)');
     }
    var title = document.getElementById("page-title")
    console.log(title)
    if (title != null) {
        title.innerHTML = title.innerHTML.replace(/(SCP-[0-9]+)/g, '$1 (<a href="http://scpexplained.wikidot.com/$1">Explained</a>)');
     }
    var content = document.getElementById("page-content")
    if (content != null) {
        content.innerHTML = content.innerHTML.replace(/(href="(\/scp-[0-9]+\/*)">SCP-[0-9]+<\/a>)/g, '$1 (<a href="http://scpexplained.wikidot.com$2">Explained</a>)');
    }
})();