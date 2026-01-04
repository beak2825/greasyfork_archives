// ==UserScript==
// @name         AO3-navigate-arrows
// @namespace    a03-navigate-arrows
// @version      0.6
// @description  Arrow Keys used to navigate chapters
// @author       kimcheng
// @match        https://archiveofourown.org/works/*/chapters/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416154/AO3-navigate-arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/416154/AO3-navigate-arrows.meta.js
// ==/UserScript==

(function() {
   document.addEventListener("keydown", function(e) {
       if(e.which == 37) {
           location.href = $('li.chapter.previous').children('a').attr('href');
       } else if(e.which == 39) {
           //alert($('li.chapter.next').children('a').attr('href'));
           location.href = $('li.chapter.next').children('a').attr('href');
       }
    })

})();