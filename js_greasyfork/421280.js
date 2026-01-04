// ==UserScript==
// @name         Jump Google Search Window
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let's jump!
// @author       ibuibu
// @match        https://*.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421280/Jump%20Google%20Search%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/421280/Jump%20Google%20Search%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function (e){
        if(e.keyCode == 83 && event.ctrlKey){//s key
            var s = document.querySelector('.gLFyf');
            var val = s.value;
            s.select();
            setTimeout(function(){
                s.value = val;
            })
        }
    }
})();