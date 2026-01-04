// ==UserScript==
// @name Better Turnip.exchange
// @namespace http://random.com
// @description Add a link to notes
// @include https://turnip.exchange/islands
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version 0.2.20200507
// @downloadURL https://update.greasyfork.org/scripts/402836/Better%20Turnipexchange.user.js
// @updateURL https://update.greasyfork.org/scripts/402836/Better%20Turnipexchange.meta.js
// ==/UserScript==

$( document ).ready(function() {

$(function(){
   function addlink(){
    $( ".note" ).each(function( index ) {
        $(this).wrap($('<a>',{
            href: 'https://turnip.exchange/island/' + $(this).attr('data-turnip-code'),
            class: 'notelink'
        }));
    });
   $('.notelink').css('color', '#ffffff');
   $('.notelink').css('text-decoration', 'none');
   };
   window.setTimeout( addlink, 5000 ); // 5 seconds
});

});

