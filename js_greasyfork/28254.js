// ==UserScript==
// @name          Show ed2k
// @namespace     http://diveintogreasemonkey.org/download/
// @description   Show ed2k && block top_slide_wrap
// @include       http://www.verycd.com/*
// @exclude       http://diveintogreasemonkey.org/*
// @exclude       http://www.diveintogreasemonkey.org/*
// @version 0.0.1.20170318074017
// @downloadURL https://update.greasyfork.org/scripts/28254/Show%20ed2k.user.js
// @updateURL https://update.greasyfork.org/scripts/28254/Show%20ed2k.meta.js
// ==/UserScript==

$("a[ed2k]").each(
    function(){
        $('#iptcomED2K').append('<div class="codemain" style=" word-break: break-all; word-wrap:break-word;padding: 10px; ">'+$(this).attr("href") + "\n<br/>\n<br/></div>");
        console.log($(this).attr("href"));
    }
);

$('.top_slide_wrap').remove();