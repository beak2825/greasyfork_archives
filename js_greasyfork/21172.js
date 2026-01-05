// ==UserScript==
// @name         Title Cleanup for Salesforce 2
// @version      1.0
// @description  Making things happen
// @author       jawz
// @match        https://s3.amazonaws.com/*
// @match        https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21172/Title%20Cleanup%20for%20Salesforce%202.user.js
// @updateURL https://update.greasyfork.org/scripts/21172/Title%20Cleanup%20for%20Salesforce%202.meta.js
// ==/UserScript==

var first = $('h3:contains("FIRST NAME")').eq(0).text().replace('FIRST NAME: ', '');
var last = $('h3:contains("LAST NAME")').eq(0).text().replace('LAST NAME: ', ' ');
var org = $('b:contains("Organization")').eq(0).text().replace('Organization: ', ' ');
var url = "http://www.google.com/search?q=" + first + last + org + ' linkedin';
var wleft = window.screenX;
var halfScreen = window.outerWidth;
var windowHeight = window.outerHeight;
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);

$('div[class="panel panel-primary"]').hide();
$('input[value="Yes"]').eq(0).prop('checked',true);
$('input[value="Yes"]').eq(1).prop('checked',true);
$('input[value="No"]').eq(2).prop('checked',true);
$('input[value="No"]').eq(3).prop('checked',true);
$('input[value="No"]').eq(4).prop('checked',true);
$('input[value="No"]').eq(5).prop('checked',true);
$('input[value="Yes"]').eq(6).prop('checked',true);
$('input[value="Yes"]').eq(7).prop('checked',true);
$('input[value="No"]').eq(8).prop('checked',true);
$('input[value="No"]').eq(9).prop('checked',true);
$('input[value="No"]').eq(10).prop('checked',true);
$('input[value="No"]').eq(11).prop('checked',true);
$('input[value="Yes"]').eq(12).prop('checked',true);
$('input[value="75"]').prop('checked',true);
$('#submitButton')[0].addEventListener("click", function(){ popupX.close(); });