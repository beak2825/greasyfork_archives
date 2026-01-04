// ==UserScript==
// @name         Anti-Rainbow
// @namespace    http://fireandbrimstone/
// @version      0.4
// @description  Delete the Rainbow. icons,logos,and more.
// @author       fire and brimstone
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370028/Anti-Rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/370028/Anti-Rainbow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var burn = function(){
        var imgs = document.getElementsByTagName('img');
        for(var img of imgs){
            if(img.src.indexOf("tweetdeck-pride") !== -1 || img.src.indexOf("tweetdeck-bate-pride") !== -1){
                img.parentNode.removeChild(img);
                clearInterval(burning);
            }
        }
    }
    var burning = setInterval(burn, 1000);
})();