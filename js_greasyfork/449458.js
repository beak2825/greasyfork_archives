// ==UserScript==
// @name         4chan Tomorrow Theme Activator
// @namespace    https://boards.4chan.org/
// @version      1.0
// @description  Automatically enables the Tomorrow theme on 4chan so you don't have to manually change it ever again.
// @author       Anon
// @match        https://boards.4chan.org/*
// @match        https://boards.4channel.org/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4channel.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449458/4chan%20Tomorrow%20Theme%20Activator.user.js
// @updateURL https://update.greasyfork.org/scripts/449458/4chan%20Tomorrow%20Theme%20Activator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie = "ws_style=Tomorrow; path=/; Domain=.4channel.org;"
    document.cookie = "nws_style=Tomorrow; path=/; Domain=.4chan.org"
})();