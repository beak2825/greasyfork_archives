// ==UserScript==
// @name         remove blocker-notic and blocker-overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://downloadpc.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408622/remove%20blocker-notic%20and%20blocker-overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/408622/remove%20blocker-notic%20and%20blocker-overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var removeElByClassName = function(cName){

        var ols = document.getElementsByClassName(cName);
        if(ols&&ols.length>0){
            var ol = ols[0];
            // ol.remove();
            ol.parentNode.removeChild(ol);
            console.log(cName+' removed');
        }
    };
    setTimeout(function(){
        removeElByClassName('blocker-notice');
        removeElByClassName('blocker-overlay');

    },50);

})();