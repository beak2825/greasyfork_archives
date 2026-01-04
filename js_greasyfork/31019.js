// ==UserScript==
// @name         Facebook scroll hider
// @namespace    https://zachsaucier.com/
// @version      0.1
// @description  Hide elements on Facebook when the page is scrolled
// @author       Zach Saucier
// @match        https://www.facebook.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31019/Facebook%20scroll%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/31019/Facebook%20scroll%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hideElementList = [
        document.getElementById("pagelet_bluebar"),
        document.getElementById("leftCol"),
        document.getElementById("rightCol")
    ];
    
    function checkScroll(timestamp) {
        console.log(window.pageYOffset);
        if(window.pageYOffset !== 0) {
            for(var i = 0; i < hideElementList.length; i++) {
                hideElementList[i].style.opacity = "0";
            }
        } else {
            for(var i = 0; i < hideElementList.length; i++) {
                hideElementList[i].style.opacity = "1";
            }
        }
        window.requestAnimationFrame(checkScroll);
    }
    
    window.requestAnimationFrame(checkScroll);
})();