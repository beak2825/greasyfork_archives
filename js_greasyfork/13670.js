// ==UserScript==
// @name        HKG EXT
// @namespace   MyAgar
// @description MyAgar
// @author      翠如bb HK Golden
// @include     http://agar.io/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13670/HKG%20EXT.user.js
// @updateURL https://update.greasyfork.org/scripts/13670/HKG%20EXT.meta.js
// ==/UserScript==
$.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpVlhYTmVKTjZqZzA" )
.done(function( script, textStatus ) {
    $.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpOWRUeVFMdTJrbkE" );
})
.fail(function( jqxhr, settings, exception ) {
    console.log("fail to load script");
});