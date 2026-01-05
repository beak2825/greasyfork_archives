// ==UserScript==
// @name         Allow fullscreen
// @namespace    https://github.com/prositen
// @version      0.1
// @description  Add allowfullscreen to iframes
// @author       prositen
// @match        *://loading.se/*
// @update       https://github.com/prositen/tampermonkey-scripts/raw/master/allow-fullscreen.user.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24956/Allow%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/24956/Allow%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jq = jQuery.noConflict();
    jq('iframe').each(function(i,v) {
        console.log(v);
        jq(v).attr('allowfullscreen',true);
    });
})();
