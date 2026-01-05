// ==UserScript==
// @name A9 Image Survey Clothes
// @namespace http://tampermonkey.net/
// @version 0.3
// @description Modified to refresh whenever it boots you out of the batch.
// @author THFYM - Modified by walco005
// @include *.mturkcontent.com/*
// @include https://s3.amazonaws.com/mturk_bulk/*
// @include https://www.mturk.com/mturk/previewandaccept?prevRequester=Amazon+Requester+Inc.+A9+Data+Validation&autoAcceptEnabled=true*groupId=3D00S7P7YGMS0X50UPV7TFTQ47DZEI
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/19922/A9%20Image%20Survey%20Clothes.user.js
// @updateURL https://update.greasyfork.org/scripts/19922/A9%20Image%20Survey%20Clothes.meta.js
// ==/UserScript==

// ---This sections was all added by THFYM---
if ($("h4:contains(Picture of a picture is acceptable. Mannequin is acceptable.)").length){
$(".btn:contains('No')").click();
$(".form-group").css('width', '200');
$(".form-group").css('float', 'left');
window.focus();
$(document).keydown(function(e) {
if (e.keyCode === 13) { // enter to submit
$("input[value='Submit']").click();
}
});
// ---End of THFYM part of the script---
}

// ---Added by walco005---
if ($("td:contains(All HITs Available to You)").length){
    location.reload();
}
