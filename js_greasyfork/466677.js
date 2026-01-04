// ==UserScript==
// @name         Hide LIVE on YouTube
// @version      1.1
// @description  Remove LIVE videos on Main Homepage
// @author       Wim Godden <wim@wimgodden.be>
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://*.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/48886
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/466677/Hide%20LIVE%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/466677/Hide%20LIVE%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLiveVideos(){
        $( "span.ytd-badge-supported-renderer:contains(LIVE)").parent().parent().parent().parent().parent().parent().parent().parent().hide();
    }

    const observer = new MutationObserver(removeLiveVideos);
    observer.observe(document.querySelector('#page-manager'), { childList:true, subtree:true });
})();