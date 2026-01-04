// ==UserScript==
// @name         helper Imagefap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Close announcements from our admins box
// @author       LYNX
// @match        https://www.imagefap.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407820/helper%20Imagefap.user.js
// @updateURL https://update.greasyfork.org/scripts/407820/helper%20Imagefap.meta.js
// ==/UserScript==
/*global announce */

(function() {
    'use strict';

    if(typeof(announce) === "object" && typeof(announce.close) === "function"){
        announce.close();
    }
})();
