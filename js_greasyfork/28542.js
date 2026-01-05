// ==UserScript==
// @name         NetFlix Auto Account selection
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically select your Netflix account (enter your netflix account name below)
// @author       Guile93
// @match    https://www.netflix.com/browse*
// @downloadURL https://update.greasyfork.org/scripts/28542/NetFlix%20Auto%20Account%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/28542/NetFlix%20Auto%20Account%20selection.meta.js
// ==/UserScript==
(function() {
    var netflixname="YOUR ACCOUNT NAME HERE";
    var nom=document.getElementsByClassName("profile-name");
    var l=nom.length;
    if(l){
     for(var y=0;y<l;y++){
         var x=nom[y];
         if(x.textContent==netflixname){
             x.parentElement.click();
         }
     }
    }
})();