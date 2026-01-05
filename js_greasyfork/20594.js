// ==UserScript==

// @name quotient-force-private-note

// @version 1.0

// @description Force private note option in dropdown when leaving comments in Quotient

// @include https://go.quotientapp.com/*

// @namespace 

// @downloadURL https://update.greasyfork.org/scripts/20594/quotient-force-private-note.user.js
// @updateURL https://update.greasyfork.org/scripts/20594/quotient-force-private-note.meta.js
// ==/UserScript==

jQuery = jQuery.noConflict();

jQuery(document).ready(function(){
    jQuery('select#discussion_to').val(2566);
});
jQuery('a.btn.btn-action.btn-lg').click(function(event){
    if(jQuery('select#discussion_to option:selected').val()) {
    
    }else {
        var r = window.confirm("Are you sure you want to add as private note only?");
        if ( r === false){
            return false;
        }
    }
});