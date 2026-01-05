// ==UserScript==
// @name         Tumblr Mobile Posts
// @namespace    https://greasyfork.org/en/users/67287-d1sover
// @version      0.2
// @description  Automatically shows the individual Tumblr posts in mobile layout, as to save on all the bad design and autoplay background music.
// @author       Mikolaj "D1SoveR" Banasik
// @license      WTFPL
//
// @include      http://*.tumblr.com/post/*
// @include      https://*.tumblr.com/post/*
// @exclude      http://*.tumblr.com/post/*/mobile
// @exclude      https://*.tumblr.com/post/*/mobile
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/23343/Tumblr%20Mobile%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/23343/Tumblr%20Mobile%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the mobile indicator to the address that's missing it.
    if (!/\/mobile$/.test(window.location.pathname)) {
        window.location.pathname += '/mobile';
    }

})();