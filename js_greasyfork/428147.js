// ==UserScript==
// @name         Free Medscape
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  read Medscape without login
// @author       LYNX
// @match        https://*.medscape.com/*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/428147/Free%20Medscape.user.js
// @updateURL https://update.greasyfork.org/scripts/428147/Free%20Medscape.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('div.csdpages').show();

    $('div#fpf_widget').remove();
    $('div.fpf_fadeout').remove();

})();
