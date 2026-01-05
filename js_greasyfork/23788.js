// ==UserScript==
// @name        Youtube Card Annotations Disable
// @description Assign an extra option to the default annotations button to toggle the new youtube cards
// @namespace   q1k
// @version     1.0
// @match       *://www.youtube.com/*
// @exclude     *://www.youtube.com/live_chat*
// @exclude     *://www.youtube.com/tv*
// @grant       none
// @require     https://code.jquery.com/jquery-3.1.0.slim.js
// @downloadURL https://update.greasyfork.org/scripts/23788/Youtube%20Card%20Annotations%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/23788/Youtube%20Card%20Annotations%20Disable.meta.js
// ==/UserScript==

var checkExist = setInterval(function() {
    
    if ( $('.playing-mode').length ) {
        
        $('.ytp-settings-button').click();
        $('.ytp-settings-button').click();
        
        $('<style> .ytp-ce-element { display: none; } </style>').appendTo(document.head);
        
        $('.ytp-menuitem').click(function() {
            if ($(this).text().trim() === "Annotations") {
                if ($(this).attr('aria-checked') == 'true') {
                    $('.ytp-ce-element').css('display', 'block');
                } else {
                    $('.ytp-ce-element').css('display', 'none');
                }
            }
        });
        clearInterval(checkExist);
        
   }
   
}, 1000);