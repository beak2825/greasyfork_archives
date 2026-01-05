// ==UserScript==
// @name        xhamster-full-width
// @namespace   xhamster
// @version     1.6
// @grant       none
// @description xhamster.com
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include  *xhamster.com/movies*
// @downloadURL https://update.greasyfork.org/scripts/29599/xhamster-full-width.user.js
// @updateURL https://update.greasyfork.org/scripts/29599/xhamster-full-width.meta.js
// ==/UserScript==

var $ = jQuery;
$(document).ready(function(){

    doFullWidth();
   
});

function doFullWidth(){
    $('.main').css('width', '98%');
    $('#playerBox').css('width', '100%');

    $('#playerSwf video').css('width', '100%').css('height', 'auto').css('max-height', '1000px');
    
    var css = '<style>#player, #playerSwf, #player .noFlash, #playerSwf video, #playerSwf .mp4Thumb {height: auto;}</style>';
    $('body').append(css);
    
    // remove featured column
    $('#content tr').first().find('td').last().remove();
   
}