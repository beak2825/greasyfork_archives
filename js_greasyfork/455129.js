// ==UserScript==
// @name         EOTI - Fix Page Stretchers
// @version      1.0
// @description  Seriously, gross.
// @author       Threeskimo
// @match        https://*.endoftheinter.net/*
// @icon         https://static.endoftheinter.net/images/dealwithit.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/695986
// @downloadURL https://update.greasyfork.org/scripts/455129/EOTI%20-%20Fix%20Page%20Stretchers.user.js
// @updateURL https://update.greasyfork.org/scripts/455129/EOTI%20-%20Fix%20Page%20Stretchers.meta.js
// ==/UserScript==


$('head').prepend('<style>.grid { border-collapse: initial !important; border-spacing: 1px !important; } table.grid tr td, table.grid tr th { border: 2px solid #6a6a6a !important; border-width: 0px 2px 2px 0px !important; } </style>');

var dostuff = function() {
    'use strict';
    $('span.img-loaded').removeAttr('style');
    $('span.img-loaded').css({"max-width": "100%", 'max-height': '100%'});
    $('img').css({"width": "auto", 'max-height': '600px'});
    $('img').removeAttr('height');
    //$('img').resizable({aspectRatio: true});
};

setInterval(dostuff, 1000); // call every 1000 milliseconds

