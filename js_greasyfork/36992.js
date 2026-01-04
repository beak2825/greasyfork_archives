// ==UserScript==
// @name         WPML translated deep string search
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Searches the displayed strings for the translated strings
// @author       Thomas Allcaps
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @match        https://*/wp-admin/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36992/WPML%20translated%20deep%20string%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/36992/WPML%20translated%20deep%20string%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(window.location.href.indexOf("wpml-string-translation") > -1) {

        jQuery("#wpwrap").prepend('<div id="string_search"><div class="stringinput"><label for="vname">String to search <br><input type="text" id="stringsearch" class="stringsearchclass" name="stringsearch"></label><br><span class="stringsfoundnumber">Press Enter to search</div></div>');
        jQuery("#string_search").css({"position":"fixed","left":"70%","top":"50px","background":"white","box-shadow":"2px 2px 2px grey","z-index":"1","padding":"30px"}).draggable();
        jQuery.expr[":"].contains = jQuery.expr.createPseudo(function(arg) {
            return function( elem ) {
                return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };});

        jQuery(document).on('keydown', 'input.stringsearchclass', function(ev) {
            if(ev.which === 13) {
                jQuery(".foundstring").css({"background":"none"});
                jQuery(".foundstring").removeClass("foundstring");

                var searchstring = jQuery('#stringsearch').val();

                jQuery('table#icl_string_translations tr > td.wpml-st-col-string > div.icl-st-inline > form > table > tbody > tr:nth-child(1) > td > textarea:contains('+searchstring+')').closest('.wpml-st-col-string').addClass('foundstring');

                var stringnumber = jQuery('.foundstring').length;
                jQuery(".foundstring").css({"background":"lightgreen"});
                jQuery(".stringsfoundnumber").text("String found "+stringnumber+" times");

                return false;
            }
        });





    }


})();