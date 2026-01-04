// ==UserScript==
// @name         Google Meet Auto Admitter
// @description  Admit waiting users automatically!
// @homepage     https://products.agarmen.com/
// @namespace    https://agarmen.com/
// @version      1.0
// @author       #EMBER
// @match        *://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=meet.google.com
// @grant        none
// @run-at       documet-end
// @downloadURL https://update.greasyfork.org/scripts/426086/Google%20Meet%20Auto%20Admitter.user.js
// @updateURL https://update.greasyfork.org/scripts/426086/Google%20Meet%20Auto%20Admitter.meta.js
// ==/UserScript==

(function() {
     setInterval(function(){
        let spans = document.getElementsByTagName('span');
         for(let span of spans)
         {
             if( span.innerText === 'Admit' || span.innerText === 'View all' ){
                 span.click();
                 console.log('A user was admitted');
             }
         }
    }, 1E3);
})();

