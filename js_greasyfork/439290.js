// ==UserScript==
// @name        youtube-hide-download-button
// @version     1.0
// @include     https://youtube.com/*
// @include     https://www.youtube.com/*
// @description Simple script, that hides the download button on youtube videos (below the video and from the context menu)
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/870553
// @downloadURL https://update.greasyfork.org/scripts/439290/youtube-hide-download-button.user.js
// @updateURL https://update.greasyfork.org/scripts/439290/youtube-hide-download-button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = 'ytd-menu-service-item-download-renderer{display:none;}';
    document.head.appendChild(style);
})();
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = 'ytd-download-button-renderer{display:none;}';
    document.head.appendChild(style);
})();