// ==UserScript==
// @name         FDS Video Pub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove ad Fdesouche
// @author       You
// @match        https://www.fdesouche.com/*
// @icon         https://www.google.com/s2/favicons?domain=fdesouche.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438775/FDS%20Video%20Pub.user.js
// @updateURL https://update.greasyfork.org/scripts/438775/FDS%20Video%20Pub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".gridlove-sidebar").remove();
})();