// ==UserScript==
// @name          Emoji size limiter

// @namespace     Seven0492/emoji_size_limiter

// @description   Prevents in-line images, like an emoji, ballooning and taking up your entire screen.

// @match         *://ranobes.top/*/*
// @match         *://ranobes.net/*/*

// @grant         none
// @run-at        document-start
// @version       1.1
// @author        Seven0492 <https://greasyfork.org/users/1166310>

// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/474540/Emoji%20size%20limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/474540/Emoji%20size%20limiter.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", () => {

    var style = document.createElement('style');
    style.type = 'text/css';

    var limiter = `.story .text img { max-width: 2.1%; }`;

    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = limiter;
    } else {
        // Other browsers
        style.innerHTML = limiter;
    }

    document.getElementsByTagName("head")[0].appendChild( style );

});