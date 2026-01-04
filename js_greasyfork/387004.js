// ==UserScript==
// @name         Factorio Prints image fix
// @version      0.2
// @description  changes imgur src from https to http
// @author       WebBugT
// @match        https://factorioprints.com/*
// @grant        none
// @namespace https://greasyfork.org/users/314273
// @downloadURL https://update.greasyfork.org/scripts/387004/Factorio%20Prints%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/387004/Factorio%20Prints%20image%20fix.meta.js
// ==/UserScript==

(function() {
'use strict';
    function changeImg(){
    var imageClasses = ["card-img-top","img-thumbnail"];
    for(var i=0,n=imageClasses.length;i<n;i++){
        var elems = document.getElementsByClassName(imageClasses[i])
        for(var j=0,m=elems.length;j<m;j++){
            if(elems[j].src.match("https")) elems[j].src = elems[j].src.replace("https", "http");
        }
    }
   }
   setInterval(changeImg,100)
})();