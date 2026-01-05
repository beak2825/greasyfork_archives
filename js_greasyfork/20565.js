// ==UserScript==
// @name         Salesforce Contact
// @version      1.0
// @description  Making things happen
// @author       jawz
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/20565/Salesforce%20Contact.user.js
// @updateURL https://update.greasyfork.org/scripts/20565/Salesforce%20Contact.meta.js
// ==/UserScript==

if ($('p:contains("The goal of this exercise is to get clean and correct contact information")')) {
    $('div[class="panel panel-primary"]').hide();
    var first = $('h3:contains("First Name")').text().replace('First Name: ', '');
    var last = $('h3:contains("Last Name")').text().replace('Last Name: ', ' ');
    var account = $('h3:contains("Account Name")').text().replace('Account Name: ', ' ');
    var url = "http://www.google.com/search?q=" + first + last + 'linkedin' + account;
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    //popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    $('input[value="Yes"]').eq(0).prop('checked',true);
    $('input[value="Yes"]').eq(1).prop('checked',true);
    $('input[value="Yes"]').eq(2).prop('checked',true);
    $('input[value="No"]').eq(3).prop('checked',true);
    $('input[value="No"]').eq(4).prop('checked',true);
    $('input[value="No"]').eq(5).prop('checked',true);
    $('input[value="No"]').eq(6).prop('checked',true);
    $('input[value="No"]').eq(7).prop('checked',true);
    $('input[value="No"]').eq(8).prop('checked',true);
    $('input[value="Yes"]').eq(9).prop('checked',true);
    $('input[value="Yes"]').eq(10).prop('checked',true);
    $('input[value="Yes"]').eq(11).prop('checked',true);
    $('input[value="No"]').eq(12).prop('checked',true);
    $('input[value="No"]').eq(13).prop('checked',true);
    $('input[value="No"]').eq(14).prop('checked',true);
    $('input[value="No"]').eq(15).prop('checked',true);
    $('input[value="No"]').eq(16).prop('checked',true);
    $('input[value="No"]').eq(17).prop('checked',true);
    $('input[value="Yes"]').eq(18).prop('checked',true);
    $('input[value="100"]').prop('checked',true);
    $('h3').eq(0).append($('#submitButton'));
    //$('#submitButton')[0].addEventListener("click", function(){ popupX.close(); });
}