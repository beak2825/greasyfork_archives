// ==UserScript==
// @name         Tinhte Filter
// @namespace    https://greasyfork.org/vi/users/20451-anh-nguyen/
// @version      0.4
// @description  Edit UI Tinhte.vn
// @author       Paul Nguyen
// @grant        none

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include        /^https?://tinhte\.vn/.*$/

// @downloadURL https://update.greasyfork.org/scripts/14008/Tinhte%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/14008/Tinhte%20Filter.meta.js
// ==/UserScript==

$('.uix_mainSidebar_right').remove();
$('div.mainContent').css("margin-right","0px",'important');
$('div.mainContent').css("margin-right","0px",'important');
$('div.widgets-14bfa').remove();
$('footer').empty();
$('#uix_paneContainer').css("overflow-y","hidden");