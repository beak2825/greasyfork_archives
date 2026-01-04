// ==UserScript==
// @name            Search Reelgood
// @namespace       http://tampermonkey.net/
// @description     Context menu to execute UserScript
// @version         0.20
// @author          jakelewis3d@gmail.com
// @include         *
// @grant           GM_openInTab
// @run-at          context-menu
// @license         GPL 2.0
// @description     allows a one click connection from any website to the Reelgood search results for that selection
// @downloadURL https://update.greasyfork.org/scripts/416484/Search%20Reelgood.user.js
// @updateURL https://update.greasyfork.org/scripts/416484/Search%20Reelgood.meta.js
// ==/UserScript==]]]


(function() {
    'use strict';
    //first read any selected text
    var textSelected = "";
        textSelected = document.getSelection().toString().trim();

    //if none, read text under cursor
    if(textSelected.length<=1){
        var elements = document.querySelectorAll(':hover');
        textSelected = elements[elements.length-1].innerText.trim();
        console.log(elements.length+"  "+elements);
    }
    //convert non url safe characters
    //var urlsafe = textSelected.replace("&", "%26"); //textSelected = ";,/?:@&=+$-_.!~*'()#"
    var urlsafe = encodeURIComponent(textSelected);
    console.log("RightClickTo ---"+textSelected+"---"+ urlsafe );
    GM_openInTab("https://reelgood.com/search?q="+urlsafe, { active: true, insert: true, setParent: true });

})();


