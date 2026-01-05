// ==UserScript==
// @name         Video Autoplay removal (aftonbladet.se, expressen.se)
// @namespace    https://github.com/prositen
// @version      0.4.1
// @description  Remove autoplay from videos
// @author       prositen
// @match        *://*.aftonbladet.se/*
// @match        *://*.expressen.se/*
// @update       https://github.com/prositen/tampermonkey-scripts/raw/master/autoplay-removal.user.js
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24953/Video%20Autoplay%20removal%20%28aftonbladetse%2C%20expressense%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24953/Video%20Autoplay%20removal%20%28aftonbladetse%2C%20expressense%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jq = jQuery.noConflict();
    jq('iframe[allowfullscreen],iframe[src*=autoplay]').each(function(i,v) {
        var src = v.src;
        var new_src = src.replace('autoplay=true', 'autoplay=false');
        if (new_src == src) {
            new_src += "&autoplay=false";
        }
        new_src = new_src.replace('sticky=true','sticky=false');
        v.src = new_src;
        jq(v).removeAttr('data-sticky');
    });
    // Your code here...
})();
