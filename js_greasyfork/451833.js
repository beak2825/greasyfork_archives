// ==UserScript==
// @name         PreissCentral fixes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix the ticket view, add send + resolve etc buttons
// @author       Andrew Belter
// @match        https://support.preisscentral.com/helpdesk/tickets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=preisscentral.com
// @grant        none
// @require https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337

// @downloadURL https://update.greasyfork.org/scripts/451833/PreissCentral%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/451833/PreissCentral%20fixes.meta.js
// ==/UserScript==

/* global jQuery */
(function() {
    var $ = window.jQuery;

  	$(document).ready(function() {

      /*  $('<div/>',{
            id: 'add_btn_send_wait_3rd_in_reply',
            }).appendTo('.ticket_details');
        $('<div/>',{
            id: 'add_btn_send_wait_in_reply',
        }).appendTo('.ticket_details');
        $('<div/>',{
            id: 'add_btn_send_resolve_in_reply',
        }).appendTo('.ticket_details'); */
        if($('body').hasClass('ticket_details')) {

          //Adjusting toolbar width
          	$('.btn-toolbar').css('width', '650px');

          //Moving the Save Draft to the left side.
            $('#reply-draft').detach().appendTo('.post_in_forum');

            //Adding the new button
            var buttonLabel3rd = ' + Waiting on 3rd Party';
            $('#HelpdeskReply .btn-toolbar>span:first').before('<span class="btn-group has_attachment_form"><button class="btn has_attachment_form reply_agent_collision" rel="custom-reply-status" data-status-name="Waiting on Third Party" data-cnt-id="cnt-reply" data-status-val="7" style="margin:0 8px 8px 0;"><i class="fa fa-paper-plane"></i>' + buttonLabel3rd + '</button></span><br>');
            //$('#add_btn_send_wait_3rd_in_reply').parent().parent().remove();

            //Adding the new button
            var buttonLabelPending = ' + Pending Requester';
            $('#HelpdeskReply .btn-toolbar>span:first').before('<span class="btn-group has_attachment_form"><button class="btn has_attachment_form reply_agent_collision" rel="custom-reply-status" data-status-name="Pending" data-cnt-id="cnt-reply" data-status-val="3" style="margin:0 0 8px 0;"><i class="fa fa-paper-plane"></i>' + buttonLabelPending + '</button></span>');
            //$('#add_btn_send_wait_in_reply').parent().parent().remove();

            //Adding the new button
            var buttonLabelResolve = ' + Resolve';
            $('#HelpdeskReply .btn-toolbar>span:first').before('<span class="btn-group has_attachment_form"><button class="btn has_attachment_form reply_agent_collision" rel="custom-reply-status" data-status-name="Resolved" data-cnt-id="cnt-reply" data-status-val="4" style="margin:0 0 8px 0;"><i class="fa fa-paper-plane"></i>' + buttonLabelResolve + '</button></span>');
            //$('#add_btn_send_resolve_in_reply').parent().parent().remove();
        }
    });
	$("#requester_info").addClass("inactive");
  	$(".ticket_details .sticky_right .status_info").css({'opacity':'1','margin-top':'5px'});
  	$("#edit-dueby-time").detach().appendTo('.status_info>span');
  	$("#edit-dueby-time").css({'font-size':'12px'});
    $('.association-link-wrapper').hide();
    $("#tkt_sidebar_oncall_ack").hide();
    $("#due-by-element-parent").hide();
})();