// ==UserScript==
// @name       MTurk Auto-Accept changer for mturkgrind.com
// @version    0.1
// @description  Changes "preview" links to "previewandaccept" on the mturkgrind forum.
// @require     http://code.jquery.com/jquery-latest.min.js
// @include      http://www.mturkgrind.com/*
// @copyright  2013+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/4261/MTurk%20Auto-Accept%20changer%20for%20mturkgrindcom.user.js
// @updateURL https://update.greasyfork.org/scripts/4261/MTurk%20Auto-Accept%20changer%20for%20mturkgrindcom.meta.js
// ==/UserScript==

$('a[href*="/mturk/preview?"]').each(function(){
     var preview_link=$(this).attr('href').replace("preview?", "previewandaccept?");
     var link_html = "<a href='" + preview_link + "' target='_blank'> ACCEPT</a>";
     $(this).append (" |" + link_html);    
});
