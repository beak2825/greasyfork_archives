// ==UserScript==
// @name         Bunpro Hide Translation
// @namespace    http://tampermonkey.net/
// @version      0.55
// @description  In reviews, Control key hides Japanese, Shift key hides English
// @author       Nathan Hill
// @include      https://www.bunpro.jp*
// @include      http://www.bunpro.jp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38630/Bunpro%20Hide%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/38630/Bunpro%20Hide%20Translation.meta.js
// ==/UserScript==

function toggle(h){
    if(!h){ return; }
    if(h.style.visibility == "hidden"){
        h.style.visibility = "visible";
    }
    else{
        h.style.visibility = "hidden";
    }
}

(function() {
    'use strict';
    window.addEventListener("keydown", function(event){
       var i;
       if(event.key == "Control"){
           toggle(document.getElementsByClassName("study-question-japanese")[0]);
       }

       if(event.key == "Shift"){
           toggle(document.getElementsByClassName("study-question-english-hint")[0]);
       }
    });
})();