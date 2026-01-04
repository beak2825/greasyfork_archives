// ==UserScript==
// @name         Front-end switcher (Twitter -> Nitter)
// @namespace    https://github.com/Bit38
// @source       https://github.com/Bit38/user-scrips
// @license      MIT
// @version      1.0.0
// @description  Automatically switches from twitter to nitter (by default uses: xcancel.com)
// @author       Bit38
// @match        https://*x.com/*
// @match        https://*twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534920/Front-end%20switcher%20%28Twitter%20-%3E%20Nitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534920/Front-end%20switcher%20%28Twitter%20-%3E%20Nitter%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let url = new URL(window.location.href);
    url.host = 'xcancel.com';

    window.location.replace(url);
})();

