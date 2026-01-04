// ==UserScript==
// @name         Redgifs Extractor
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Video source extractor
// @author       Entinator with hints from Ember
// @match        https://www.redgifs.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451700/Redgifs%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/451700/Redgifs%20Extractor.meta.js
// ==/UserScript==

var done = false
var intervalIdiframe = window.setInterval(function(){
    if(done == false){
        if(document.querySelectorAll("div[class*='player-video']")[0]){
            var src = document.querySelectorAll("div[class*='player-video']")[0].childNodes[0].src
            window.parent.postMessage(src, '*');
            done = true;
        }
    }
}, 200);