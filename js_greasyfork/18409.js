// ==UserScript==
// @name         jmm prevent dm autoplay
// @namespace    jmm prevent dm autoplay
// @version      2016.03.31
// @description  prevent dailymotion videos autoplay in jeanmarcmorandini.com
// @author       hanon
// @match        *://*.jeanmarcmorandini.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/18409/jmm%20prevent%20dm%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/18409/jmm%20prevent%20dm%20autoplay.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
/*$(document).ready(function() {*/
    console.info("tampermonkey plugin start: jmm disable autoplay");
    $('iframe[src*="autoPlay=1"').each(function() {
        $(this).attr('src', $(this).attr('src').replace('autoPlay=1', 'autoPlay=0') );
    });
/*});*/