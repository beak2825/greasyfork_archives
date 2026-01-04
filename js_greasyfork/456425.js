// ==UserScript==
// @name         Gmail - Hover to show the URL behind a link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make the href in each link more visible when a mouse hovers over so the user doesn't accidentally click on an unexpected (and potentially spam) link
// @author       You
// @match        https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gmail.com
// @grant        none
// @license      MIT
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/456425/Gmail%20-%20Hover%20to%20show%20the%20URL%20behind%20a%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/456425/Gmail%20-%20Hover%20to%20show%20the%20URL%20behind%20a%20link.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */



(function() {
    'use strict';

    $(document).ready(function () {
        function isMailOpen() {
            const replyButton = $('div[aria-label="Reply"][data-tooltip="Reply"][role="button"]');
            if(replyButton.length > 0){
                var aTagList = $('div.AO a'); // weird way to identify the mail body but ok...
                $.each(aTagList, function(index, aTag){
                   const originalTitle = $(this).attr('title');
                   const currentTitle = $(this).prop('title');
                   if(!originalTitle && !currentTitle) {
                       const href = $(this).attr('href');
                       $(this).prop('title', href);
                   }

               });
            }
        }

        // check every 3 seconds
        setInterval(isMailOpen, 3000);
    });
})();