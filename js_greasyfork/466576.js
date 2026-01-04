// ==UserScript==
// @name         Hide Longs on YouTube
// @version      1.0
// @description  Remove youtube long videos on Main Homepage
// @author       Wim Godden <wim@wimgodden.be>
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://*.youtube.com/*
// @grant        none
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/48886
// @downloadURL https://update.greasyfork.org/scripts/466576/Hide%20Longs%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/466576/Hide%20Longs%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLongs(){
        //$("div#title-text.style-scope.ytd-rich-shelf-renderer span#title.style-scope.ytd-rich-shelf-renderer").parent().parent().parent().parent().parent().parent().parent().hide();
        $("ytd-thumbnail-overlay-time-status-renderer span").each(function() {
          var array = $(this).text().split(":");
          if (isNaN(parseInt(array[2], 10))) {
            var seconds = (parseInt(array[0], 10) * 60) + (parseInt(array[1], 10));
          } else {
            var seconds = (parseInt(array[0], 10) * 60 * 60) + (parseInt(array[1], 10) * 60) + parseInt(array[2], 10);
          }
          if (seconds > 3600) {
            $(this).parent().parent().parent().parent().parent().parent().parent().parent().remove();
          }
        });
    }

    const observer = new MutationObserver(removeLongs);
    observer.observe(document.querySelector('#page-manager'), { childList:true, subtree:true });
})();