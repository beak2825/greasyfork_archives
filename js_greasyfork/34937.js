// ==UserScript==
// @name         twitter 140 char highlighting
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  return 140 char highlighting to twitter
// @author       ashleyjames.xyz
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34937/twitter%20140%20char%20highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/34937/twitter%20140%20char%20highlighting.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var textdiv = document.getElementById('tweet-box-home-timeline');
    var otherdiv = document.getElementById('tweet-box-global');
    textdiv.onkeyup = function(){
        var str = textdiv.innerText;
        if (str.length > 140){
            textdiv.style.backgroundColor = "#faa";
        }
        else if (str.length <= 140){
            textdiv.style.backgroundColor = "#fff";
        }
    };
    otherdiv.onkeyup = function(){
        var otherstr = otherdiv.innerText;
        if (otherstr.length > 140){
            otherdiv.style.backgroundColor = "#faa";
        }
        else if (otherstr.length <= 140){
            otherdiv.style.backgroundColor = "#fff";
        }
    };
})();