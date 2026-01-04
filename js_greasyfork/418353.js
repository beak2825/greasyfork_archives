// ==UserScript==
// @name         ExploreLearning Gizmos Unlimited Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gives unlimited time on ExploreLearning Gizmos
// @author       cardoza
// @match        *://*.explorelearning.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418353/ExploreLearning%20Gizmos%20Unlimited%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/418353/ExploreLearning%20Gizmos%20Unlimited%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var url=window.location.href;
    // Your code here...
    $( document ).ready(()=>{
        var i =setInterval(()=>{
            //var timerCounterElement = document.getElementById('counter');
            if(url.indexOf("cResource.dspView">-1)){
                //alert("B");
                //function upd() {/*empty*/}
                document.body.appendChild(document.createElement('script'))
             .innerHTML = "function upd() {}";
                clearInterval(i);
            }
        },100);
    });
})();