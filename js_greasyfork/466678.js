// ==UserScript==
// @name         Hide official music channels on YouTube
// @version      1.1
// @description  Remove official music channel videos on Main Homepage
// @author       Wim Godden <wim@wimgodden.be>
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://*.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/48886
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/466678/Hide%20official%20music%20channels%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/466678/Hide%20official%20music%20channels%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMusicChannels(){
        $("path.style-scope.yt-icon[d='M12,4v9.38C11.27,12.54,10.2,12,9,12c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4V8h6V4H12z']").parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
    }

    const observer = new MutationObserver(removeMusicChannels);
    observer.observe(document.querySelector('#page-manager'), { childList:true, subtree:true });
})();