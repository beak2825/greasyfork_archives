// ==UserScript==
// @name         Hide Shorts on YouTube
// @version      1.1
// @description  Remove youtube shorts Feed on Main Homepage
// @author       Wim Godden <wim@wimgodden.be>
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://*.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/48886
// @downloadURL https://update.greasyfork.org/scripts/448329/Hide%20Shorts%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/448329/Hide%20Shorts%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeShorts(){
        $("div#title-text.style-scope.ytd-rich-shelf-renderer span#title.style-scope.ytd-rich-shelf-renderer").parent().parent().parent().parent().parent().parent().parent().hide();
    }

    const observer = new MutationObserver(removeShorts);
    observer.observe(document.querySelector('#page-manager'), { childList:true, subtree:true });
})();