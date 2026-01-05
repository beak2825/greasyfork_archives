// ==UserScript==
// @name         Next/Forward Page for EPVP
// @namespace    http://your.homepage/
// @version      0.1
// @description  Press Left/Right arrow key for previous/next page
// @author       .VoiD'
// @match        http://www.elitepvpers.com/forum/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12161/NextForward%20Page%20for%20EPVP.user.js
// @updateURL https://update.greasyfork.org/scripts/12161/NextForward%20Page%20for%20EPVP.meta.js
// ==/UserScript==

var next = $('a[rel=\'next\']')[0],
    prev = $('a[rel=\'prev\']')[0];

$(window).keydown(function (e) {
    if ( e.which === 39 ) {
        window.location.href = next.href;        
    } else if ( e.which === 37 ) {
        window.location.href = prev.href; 
    }
});
