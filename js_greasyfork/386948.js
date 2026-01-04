// ==UserScript==
// @name         Singsnap Autoplay-Enabler for Chrome
// @namespace    https://greasyfork.org/en/scripts/386948-singsnap-autoplay-enabler-for-chrome
// @version      0.1
// @description  Slightly widens Flash player to trigger Chrome's detection of it as primary content, which then allows it to autoplay, as opposed to needing to be clicked first.
// @author       Won Kim
// @match        http://www.singsnap.com/karaoke/watchandlisten/play*
// @license      GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/386948/Singsnap%20Autoplay-Enabler%20for%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/386948/Singsnap%20Autoplay-Enabler%20for%20Chrome.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    $(document).ready(function() {
        $("object > embed").attr('width', '398px').css('margin-left', '-21px');
    });
})();