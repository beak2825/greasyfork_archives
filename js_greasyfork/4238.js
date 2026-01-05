// ==UserScript==
// @name       MTurk Auto-Accept changer
// @version    3.14
// @description  Changes "preview" links to "previewandaccept" on mturk grind.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match      http://www.mturkgrind.com/*
// @match      http://www.mturkgrind.com/threads*
// @copyright  2013+, You
// @namespace https://greasyfork.org/users/958
// @downloadURL https://update.greasyfork.org/scripts/4238/MTurk%20Auto-Accept%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/4238/MTurk%20Auto-Accept%20changer.meta.js
// ==/UserScript==

$(function(){
    $('a').each(function() {
        if (this.href.indexOf("preview?") !== -1)
            $(this).attr('href', this.href.replace("preview?", "previewandaccept?"));
    });
});