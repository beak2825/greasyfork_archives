// ==UserScript==
// @name         HLTV.ORG COLLAPSE COMMENTS
// @namespace    https://greasyfork.org/pl/users/10243-pexu
// @version      1.0.0
// @description  Add comment tree collapsing button to comments
// @author       peXu
// @match        http://www.hltv.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18353/HLTVORG%20COLLAPSE%20COMMENTS.user.js
// @updateURL https://update.greasyfork.org/scripts/18353/HLTVORG%20COLLAPSE%20COMMENTS.meta.js
// ==/UserScript==

//jQuery('.centerFade>div>div>div>.header2').prepend("<a class='us-px' style='cursor:pointer'>[-]</a> | ");         // only top level comments
jQuery('.header2').prepend("<a class='us-px' style='cursor:pointer'>[-]</a> | ");                                   // all comments

jQuery(function() {
    jQuery('.us-px').click( function() {
        jQuery(this).toggleClass('us-collapsed');
        if (jQuery(this).hasClass('us-collapsed')) {                       // collapsing
            jQuery(this).text("[+]");
            jQuery(this).parents('div').eq(2).children().not('.header').hide();
        } else {                                                           // expanding
            jQuery(this).text("[-]");
            jQuery(this).parents('div').eq(2).children().not('.header').show();
        }
    });
});
