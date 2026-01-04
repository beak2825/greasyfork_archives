// ==UserScript==
// @name         Eenadu banner ads
// @namespace    https://raw.githubusercontent.com/shastry-chamarthi/userscripts/master/eenadu.js
// @version      0.2
// @description  Clean eenadu.net site and read peacefully
// @author       You
// @match        https://*.eenadu.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375995/Eenadu%20banner%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/375995/Eenadu%20banner%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var elem = document.getElementById('body_ad');
    elem = (elem) ? elem.remove() : '';
    
    //var style = document.createElement('script');
    var styles = " #body_ad,.socio, .GoogleActiveViewClass, img, .ads680-30, .ad-block-300, .lcol-ad-block, .ytp-thumbnail-overlay, .videoplay,footer, header, .innertop, .two-col-left-block img  { display: none !important; opacity: 0 !important; visibility: none !important; position:absolute !important; left: -999em !important;}";
    styles += ".col-left, .col-right, #wrapper, .gridContainer, .  { width : 100% !important }";
    styles += ".thumb-description, .article-title-rgt { float: none !important; width: auto !important; } ";
    styles += ".box-shadow { box-shadow : none !important; }";
    jQuery('<style type="text/css" />').append(styles).appendTo($('body'));
})();
