// ==UserScript==
// @name         Rainbow for vikacg
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  make the world colorful again
// @author       xll
// @match        https://www.vikacg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vikacg.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441910/Rainbow%20for%20vikacg.user.js
// @updateURL https://update.greasyfork.org/scripts/441910/Rainbow%20for%20vikacg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){ setTimeout( function(){
        document.querySelector("body > style:nth-child(2)").remove();
        
    }, 1000); };


})();