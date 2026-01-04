// ==UserScript==
// @name         OpenUrl for vdruid
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://*/pivot/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396614/OpenUrl%20for%20vdruid.user.js
// @updateURL https://update.greasyfork.org/scripts/396614/OpenUrl%20for%20vdruid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;
    waitForKeyElements (
        ".segment-bubble",
        onBubble
    );

    function onBubble(c){
        var url = $('.segment-bubble .text').text();
        if (isUrl(url)){
            window.open(url);
        }

        $(".segment-bubble .text").bind("DOMCharacterDataModified", function(){
            var url = $('.segment-bubble .text').text();
            if (isUrl(url)){
                window.open(url);
            }
        })
    }

    function isUrl (url) {
        return /^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/.test(url)
    }


})();