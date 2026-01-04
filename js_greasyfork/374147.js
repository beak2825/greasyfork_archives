// ==UserScript==
// @name         yellow bgclor
// @namespace    http://kingkongkongking/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @exclude      *github.com*
// @exclude      *greasyfork.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374147/yellow%20bgclor.user.js
// @updateURL https://update.greasyfork.org/scripts/374147/yellow%20bgclor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.body.style.backgroundColor="#FFFFE1";
    var divs = document.getElementsByTagName("div");
    for(var i = 0; i < divs.length; i++){
        //do something to each div like
        divs[i].style.backgroundColor="#FFFFE1";
    }
})();