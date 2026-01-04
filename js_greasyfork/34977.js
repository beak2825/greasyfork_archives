// ==UserScript==
// @name         elitedelanation-stickers
// @namespace    www.reddit.com/r/EliteDeLaNation/
// @version      0.2
// @description  try to take over the world!
// @author       -pushkin
// @match        www.reddit.com/r/EliteDeLaNation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34977/elitedelanation-stickers.user.js
// @updateURL https://update.greasyfork.org/scripts/34977/elitedelanation-stickers.meta.js
// ==/UserScript==

(function() { 'use strict';
$( "textarea" ).one("click",(function() {
$(this).closest(".usertext-edit").prepend ( `<div id="a"><ul id="b"><a href="#stickers1"</a><a href="#stickers2"</a><a href="#stickers3"</a><a href="#stickers4"</a><a href="#stickers5"</a><a href="#stickers6"</a><a href="#stickers7"</a><a href="#stickers8"</a><a href="#stickers9"</a><a href="#stickers10"</a><a href="#stickers11"</a><a href="#stickers12"</a><a href="#stickers13"</a><a href="#stickers14"</a><a href="#stickers15"</a><a href="#stickers16"</a><a href="#stickers17"</a><a href="#stickers18"</a><a href="#stickers19"</a><a href="#stickers20"</a><a href="#stickers21"</a><a href="#stickers22"</a><a href="#stickers23"</a><a href="#stickers24"</a><a href="#stickers25"</a><a href="#stickers26"</a><a href="#stickers27"</a><a href="#stickers28"</a><a href="#stickers29"</a><a href="#stickers30"</a><a href="#stickers31"</a><a href="#stickers32"</a>
<a href="#stickers33"</a><a href="#stickers34"</a><a href="#stickers35"</a><a href="#stickers36"</a><a href="#stickers37"</a><a href="#stickers38"</a><a href="#stickers39"</a><a href="#stickers40"</a><a href="#stickers41"</a><a href="#stickers42"</a><a href="#stickers43"</a><a href="#stickers44"</a><a href="#stickers45"</a><a href="#stickers46"</a><a href="#stickers47"</a><a href="#stickers48"</a><a href="#stickers49"</a><a href="#stickers50"</a><a href="#stickers51"</a><a href="#stickers52"</a><a href="#stickers53"</a><a href="#stickers54"</a><a href="#stickers55"</a><a href="#stickers56"</a><a href="#stickers57"</a><a href="#stickers58"</a><a href="#stickers59"</a><a href="#stickers60"</a><a href="#stickers61"</a><a href="#stickers62"</a><a href="#stickers63"</a><a href="#stickers64"</a>
<a href="#stickers65"</a><a href="#stickers66"</a><a href="#stickers67"</a><a href="#stickers68"</a><a href="#stickers69"</a><a href="#stickers70"</a><a href="#stickers71"</a><a href="#stickers72"</a><a href="#stickers73"</a><a href="#stickers74"</a><a href="#stickers75"</a><a href="#stickers76"</a><a href="#stickers77"</a><a href="#stickers78"</a><a href="#stickers79"</a><a href="#stickers80"</a><a href="#stickers81"</a><a href="#stickers83"</a><a href="#stickers84"</a><a href="#stickers85"</a><a href="#stickers86"</a><a href="#stickers87"</a><a href="#stickers88"</a><a href="#stickers89"</a><a href="#stickers90"</a><a href="#stickers91"</a><a href="#stickers92"</a><a href="#stickers93"</a><a href="#stickers94"</a><a href="#stickers95"</a><a href="#stickers96"</a><a href="#stickers97"</a></ul></div>` );
        $('ul#b').css({
            'overflow-y':'scroll',
            'display':'block',
            'overflow-wrap' : 'normal',
            'border':'1px solid black',
            'margin-bottom':'1em',
            'height':'300px',
            'background-color':'white'});

}));
$(function(){
$('body').on('click', 'div ul a', function(){
$(this).closest(".usertext-edit").find("textarea").val($(this).closest(".usertext-edit").find("textarea").val() +' '+ '[](' + $(this).attr('href') + ') ');
    });
});
})();