// ==UserScript==
// @name         Custom Reftab
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  Changes the default Reftab color scheme to the official University of Puget sound colors
// @author       You
// @match        https://www.reftab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reftab.com
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/495295/Custom%20Reftab.user.js
// @updateURL https://update.greasyfork.org/scripts/495295/Custom%20Reftab.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

$(document).ready(function() {
    'use strict';
    //your code goes here. For example:
    let mycss = '<style>.reftab-navbar-top{background-color:#660000} .reftab-navbar-top{border-top:#660000} .active .rt-nav-link{background:#000000} .rt-nav-link i{color:#FFFFFF} .indv-location-category.active{background-color:#660000} .location-bubble{border-left: 5px solid #660000} #no-inlineblock{color: #FFFFFF} #loan-page-navbar li a.active{color:#660000} .out-count-footer{background-color:#660000} .out-count-box{border: 1px solid #660000} </style>';
    $('body').append(mycss);
})();

