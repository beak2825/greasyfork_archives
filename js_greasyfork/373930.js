// ==UserScript==
// @name         Allen NLP
// @author       Tehapollo
// @version      1.2
// @include      *mturkcontent.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Just auto collapses insturctions
// @downloadURL https://update.greasyfork.org/scripts/373930/Allen%20NLP.user.js
// @updateURL https://update.greasyfork.org/scripts/373930/Allen%20NLP.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
    var hide_stuff = setInterval(function(){ Please_Hide(); }, 250);
    function Please_Hide(){
         if ( $('h2:contains(Complex question answering with high-Level reasoning and inference)').length ){
         document.getElementById('collapse_link').click()
         clearInterval(hide_stuff);
         }

         else if ( $('h2:contains(Complex question answering with high-level reasoning and inference)').length ) {
         document.getElementById('collapse_link').click()
         clearInterval(hide_stuff);
        }
         else {
              clearInterval(hide_stuff);
         }
}

});
})();
