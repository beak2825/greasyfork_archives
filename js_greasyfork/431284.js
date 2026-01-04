// ==UserScript==
// @name           Simple Instagram Search
// @description    Starts Instagram with search, based on fake URL.
// @author         futurebum
// @namespace      Violentmonkey Scripts
// @include        /^https?://www\.instagram\.com/\?search=./
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require        https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license        MIT
// @version        1.03
// @downloadURL https://update.greasyfork.org/scripts/431284/Simple%20Instagram%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/431284/Simple%20Instagram%20Search.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* globals waitForKeyElements */

let search_query = decodeURIComponent(window.location.href).split(/\?search=(.+)/)[1];
waitForKeyElements('.XTCLo', function(insta_input) {
  insta_input.focus().attr('value', search_query)[0].dispatchEvent(new Event('input', {bubbles: true}));
}, true);