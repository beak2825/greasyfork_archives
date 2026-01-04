// ==UserScript==
// @name 鲨鱼默认隐藏mediainfo
// @namespace https://sharkpt.net
// @icon https://sharkpt.net/favicon.ico
// @version 1.0
// @description 默认隐藏mediainfo
// @match https://sharkpt.net/details.php?*
// @require https://cdn.staticfile.org/jquery/3.6.4/jquery.min.js
// @author freefrank
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462972/%E9%B2%A8%E9%B1%BC%E9%BB%98%E8%AE%A4%E9%9A%90%E8%97%8Fmediainfo.user.js
// @updateURL https://update.greasyfork.org/scripts/462972/%E9%B2%A8%E9%B1%BC%E9%BB%98%E8%AE%A4%E9%9A%90%E8%97%8Fmediainfo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        // Find the target element
        const targetElement = $('td.rowfollow[valign="top"][align="left"] > div.nexus-media-info-raw');

        // Create and add the show/hide button
        const button = $('<button>').text('Show').css('margin-bottom', '5px');
        targetElement.before(button);

        // Hide the target element by default
        targetElement.hide();

        // Toggle the visibility of the target element when the button is clicked
        button.on('click', function () {
            targetElement.toggle();
            if (button.text() === 'Show') {
                button.text('Hide');
            } else {
                button.text('Show');
            }
        });
    });
})();
