// ==UserScript==
// @name Autoplay Ozolio
// @description Check every 5 seconds to restart play of Ozolio stream idled to pause.
// @license MIT
// @match *://relay.ozolio.com/*
// @version 0.0.1.20230414215054
// @namespace https://greasyfork.org/users/1060171
// @downloadURL https://update.greasyfork.org/scripts/464012/Autoplay%20Ozolio.user.js
// @updateURL https://update.greasyfork.org/scripts/464012/Autoplay%20Ozolio.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        if (!document.querySelector('video')) {
            document.querySelector('.ozx-v-c-image').click();
        }
    }, 5000);
})();