// ==UserScript==
// @name       itch.io bundle open in new tab
// @namespace  http://mathemaniac.org/
// @version    1.0.0
// @description  Makes the "Download" button on the itch.io bundle pages open in a new tab.
// @match        https://itch.io/bundle/download/*
// @copyright  2020, Sebastian Paaske Tørholm
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/405077/itchio%20bundle%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/405077/itchio%20bundle%20open%20in%20new%20tab.meta.js
// ==/UserScript==

/* jshint -W097 */
/* eslint-env jquery */
'use strict';

$(function () {
    $('.game_row .button_row form').attr('target', '_blank');
});
