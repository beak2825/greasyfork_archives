// ==UserScript==
// @name         Finalsite - Parature - Ticket View Updates
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Makes updates to Parature's ticket view.
// @author       Lee McKusick
// @match        https://supportcenteronline.com/ics/tt/ticketDetail.asp*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/17523/Finalsite%20-%20Parature%20-%20Ticket%20View%20Updates.user.js
// @updateURL https://update.greasyfork.org/scripts/17523/Finalsite%20-%20Parature%20-%20Ticket%20View%20Updates.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Begin code
jQuery(function() {
    
    //Hide Empty or Unnecessary Fields
    jQuery('.webBox tr:contains("English-United States")').hide();
    jQuery('.webBox tr:contains("Use Contact Email Notification Preferences")').hide();
    jQuery('.webBox td.webCaption').siblings("td:empty, td:htmlEquals('&nbsp;')").parent().hide();
    jQuery('.webBox tr:contains("Portal Alias") td:only-child').parent().hide();
    if ( jQuery.trim( jQuery('#ticketLeftCol>table.webBox tr td.webCaption:contains("Attachment:")').siblings('td').text() ).length === 0) {
        jQuery('#ticketLeftCol>table.webBox tr:contains("Attachment:")').hide();
    }
    if ( jQuery.trim( jQuery('#ticketLeftCol>table.webBox tr td.webCaption:contains("Assigned Technician:")').siblings('td').text() ).length === 0) {
        jQuery('#ticketLeftCol>table.webBox tr:contains("Assigned Technician:")').hide();
    }

    
    //Clean up Actions Row
    jQuery('#action_row td.webBox').html(function(i,h){
        return h.replace(/&nbsp;/g,'');
    });
    
    //jQuery('#action_text_div').hide();
    jQuery('#action_row .webBox').prepend('<div class="head2 actionHeading" id="miscActions">Misc. Actions</div>');
    jQuery('#action_row .webBox').prepend('<div class="head2 actionHeading" id="editActions">Edit Actions</div>');

    jQuery('#action_row .webBox').append('<div class="head2 actionHeading" id="assignActions">Assign Actions</div>');
    jQuery('#action_row .webBox').append('<div class="head2 actionHeading" id="publicActions">Public Actions</div>');
    jQuery('#action_row .webBox input.formButton').insertAfter('#miscActions');
    jQuery("#action_row .webBox input[value*='Edit'], #action_row .webBox input[value*='Clone'] ").addClass("editActionButton").insertAfter('#editActions');
    jQuery("#action_row .webBox input[value*='Assign to']").addClass("assignActionButton").insertAfter('#assignActions');
    jQuery("#action_row .webBox input[value*='Public'], #action_row .webBox input[value*='Need Client Info'] ").addClass("publicActionButton").insertAfter('#publicActions');

    jQuery('#action-dropdown-menu option').remove();
    jQuery('#action-dropdown-menu').append('<option>--Select An Action--</option>');

    jQuery('#action_row .formButton').each( function(i) {
        jQuery('#action-dropdown-menu').append('<option value="' + i + '">' + jQuery(this).val() + '</option>');
    });

    //Puts the history pagination AFTER the history.
    jQuery('#historyPaginatorContainer').insertAfter('#historyDatatable');

});


jQuery.expr[':'].htmlEquals = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).html().match("^" + arg + "jQuery");
    };
});