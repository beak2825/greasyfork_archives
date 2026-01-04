// ==UserScript==
// @name         Maxroll.gg details alwways On
// @description  Automatically opens all tabs with stats from build pages
// @icon         https://www.google.com/s2/favicons?domain=maxroll.gg
// @namespace    Carje
// @version      0.1
// @license      MIT
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include      https://maxroll.gg/guides/*
// @author       Carje
// @downloadURL https://update.greasyfork.org/scripts/418583/Maxrollgg%20details%20alwways%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/418583/Maxrollgg%20details%20alwways%20On.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


$(document).ready(function() {
$('.advgb-accordion-body.ui-accordion-content.ui-helper-reset.ui-widget-content.ui-corner-bottom').attr('style',$('.advgb-accordion-body.ui-accordion-content.ui-helper-reset.ui-widget-content.ui-corner-bottom').attr('style').replace('display: none;', ''));
});