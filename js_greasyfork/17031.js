// ==UserScript==
// @name         Modal_Ad_Removal_thevideo.me
// @namespace    http://greasyfork.org/
// @version      1.4
// @description  Removes recurring modal ad that covers the playback area every .5 seconds.
// @author       D Chapman
// @include      http*://thevideo.me/*
// @include      http*://*.thevideo.me/*
// @grant        GM_addStyle
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/17031/Modal_Ad_Removal_thevideome.user.js
// @updateURL https://update.greasyfork.org/scripts/17031/Modal_Ad_Removal_thevideome.meta.js
// ==/UserScript==

(unsafeWindow || window).$('#hrthwg345eEl').remove();
$("#hrthwg345eEl").remove();
var adstrip_loop = setInterval(function() {  
    (unsafeWindow || window).$('#hrthwg345eEl').remove();
    $("#hrthwg345eEl").remove();
    $(".flc-panel").remove();
}, 500);