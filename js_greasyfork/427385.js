// ==UserScript==
// @name         CC98 Tools - Page Up Down
// @namespace    https://www.cc98.org/
// @version      0.0.1
// @description  Use Ctrl+ArrowRight/ArrowLeft to turn page up/down in CC98 topic.
// @author       ml98
// @match        https://www.cc98.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427385/CC98%20Tools%20-%20Page%20Up%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/427385/CC98%20Tools%20-%20Page%20Up%20Down.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if(document.URL.startsWith("https://www.cc98.org/topic/")){
            if (event.ctrlKey){
                var p = document.querySelector('.page-link.active');
                switch(event.key){
                    case "ArrowLeft":
                        p.parentNode.previousSibling.children[0].click();
                        break;
                    case "ArrowRight":
                        p.parentNode.nextSibling.children[0].click();
                        break;
                }
            }
        }
    });
})();