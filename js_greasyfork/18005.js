// ==UserScript==
// @name           Netvibes: remove clutter
// @namespace      https://greasyfork.org/en/users/8981-buzz
// @description    Removes netvibes clutter
// @author         buzz
// @require        https://code.jquery.com/jquery-2.2.0.min.js
// @version        0.3
// @license        GPLv2
// @match          https://www.netvibes.com/dashboard/*
// @grant          GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/18005/Netvibes%3A%20remove%20clutter.user.js
// @updateURL https://update.greasyfork.org/scripts/18005/Netvibes%3A%20remove%20clutter.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global window: false, document: false, $: false, GM_addStyle: false */
'use strict';

jQuery(function() {
  var $b = $('body'), sel = 'body.clutter_removed ';
  GM_addStyle(
    sel + '#top { display: none; }' +
    sel + '#header { display: none; }' +
    sel + '#nv-panel { display: none; }' +
    sel + '#footer { display: none !important; }' +
    '#clutter_toggle {' +
    ' position: absolute;' +
    ' top: 0; left: 0;' +
    ' z-index:999;' +
    ' cursor: pointer;' +
    ' border-top: none; border-right: 1px solid #B5B5B5; border-bottom: 1px solid #949494; border-left: none; ' +
    ' outline: none;' +
    ' padding: 0 2px;' +
    ' font-size: 16px;' +
    ' background-color: #F1F1F1;' +
    ' border-bottom-right-radius: 3px;' +
    '}' +
    '#clutter_toggle:hover {' +
    ' background-color: #F1F1F1;' +
    '}'
  );
  $b
    .addClass('clutter_removed')
    .prepend('<button id="clutter_toggle" title="Toggle clutter!">&#9776;</button>');
  $('#clutter_toggle').click(function() {
    $b.toggleClass('clutter_removed');
  });
});
