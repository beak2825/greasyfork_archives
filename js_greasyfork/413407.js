// ==UserScript==
// @name         20020 Speaker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sbnation.com/secret-base/21410129/20020/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/413407/20020%20Speaker.user.js
// @updateURL https://update.greasyfork.org/scripts/413407/20020%20Speaker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastSpeaker = "";

    // your code here
    $("p").each(function(i){
        var speaker = $(this).attr("class");

        if(lastSpeaker != speaker){
            $(this).prepend("<strong>"+speaker+"</strong>:<br>");
        }

        lastSpeaker = speaker;
    });
})();