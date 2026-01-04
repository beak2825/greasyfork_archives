// ==UserScript==
// @name         Strip querystrings from link URLs
// @namespace    https://pinebeecreative.com/
// @version      0.1
// @description  Strips the querystring from link URLs on websites. Originally written as a quick fix for expired Amazon Web Services Unlimited FTP Server (S3 AWS) links when their token had expired. Client would regularly post expired links and I was having to copy + paste each link and strip the querystring manually.
// @author       Pinebee Creative
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392042/Strip%20querystrings%20from%20link%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/392042/Strip%20querystrings%20from%20link%20URLs.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
            $("a").click(function(event) {
                var href = $(this).attr('href').split("?")[0];
              $(this).attr("href", href);
             });

})();
