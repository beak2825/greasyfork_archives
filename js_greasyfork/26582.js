// ==UserScript==
// @name         GIT GUD
// @namespace    http://gitgud.com
// @version      0.2
// @description  adds a git gud button to bottom of webpages
// @author       MAGGAF (Make America Git Gud Again Foundation)
// @include        *
// @exclude      https://cdn.meme.am/cache/instances/folder521/500x/56123521.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26582/GIT%20GUD.user.js
// @updateURL https://update.greasyfork.org/scripts/26582/GIT%20GUD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = "https://cdn.meme.am/cache/instances/folder521/500x/56123521.jpg";
    var bttttntntntntntn = document.createElement("BUTTON");
    var hgfhvbhjgkhjkt = document.createTextNode("GIT GUD!");
    bttttntntntntntn.appendChild(hgfhvbhjgkhjkt);
    document.body.appendChild(bttttntntntntntn);
    bttttntntntntntn.style.background = "lightblue";
    bttttntntntntntn.style.color = "red";
    bttttntntntntntn.style.width = "100%";
    bttttntntntntntn.onclick = function() {
        window.open(url,'_blank');
        window.open(url);
    };
})();