// ==UserScript==
// @name         Oxford CS Past Paper downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Download past paper from Oxford CS Website
// @match        https://www.cs.ox.ac.uk/*/pastpapers.html
// @namespace    https://greasyfork.org/users/169007
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393672/Oxford%20CS%20Past%20Paper%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/393672/Oxford%20CS%20Past%20Paper%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var all = document.getElementsByTagName('a')
    var ans = ""
    for(var i=0;i<all.length;i++){
        if(all[i].href.endsWith(".pdf")){
            ans+=`curl '${all[i].href}' -o '${all[i].innerText}.pdf'\n`
        }
    }
})();