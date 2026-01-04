// ==UserScript==
// @name         sourcevideo on watchcartoononline
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  redirect to the actual video
// @author       You
// @match        https://www.watchcartoononline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32355/sourcevideo%20on%20watchcartoononline.user.js
// @updateURL https://update.greasyfork.org/scripts/32355/sourcevideo%20on%20watchcartoononline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        var source = $(".jw-video").attr("src");
        if(window.confirm("go to source video at " + source + "?")){
            tab = window.open(source, "_blank");
            tab.focus();
        }
    }
})();