// ==UserScript==
// @name         avgle
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  avgle 屏幕
// @author       cH
// @match        https://avgle.com
// @include      *://avgle.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377848/avgle.user.js
// @updateURL https://update.greasyfork.org/scripts/377848/avgle.meta.js
// ==/UserScript==
// @require      http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
(function() {
    'use strict';
    if(document.getElementById('flash')){
        var video = jQuery('#flash');
        jQuery('body').prepend(video);
    }
})();