// ==UserScript==

// @name YouTube Layout Adjustments

// @namespace http://tampermonkey.net/

// @version 0.1

// @description Adjust YouTube layout

// @author You

// @match https://www.youtube.com/*

// @grant none

// @downloadURL https://update.greasyfork.org/scripts/492067/YouTube%20Layout%20Adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/492067/YouTube%20Layout%20Adjustments.meta.js
// ==/UserScript==

(function() {

'use strict';

// Modify experiment flags

ytcfg.set('EXPERIMENT_FLAGS', {

...ytcfg.get('EXPERIMENT_FLAGS'),

kevlar_watch_grid: false,

});

// Delayed modification of secondary element width

setTimeout(function() {

document.getElementById("secondary").style.width = "auto";

document.getElementById("secondary").style.maxWidth = "200px";

}, 500);

// Hide specific elements with provided selectors

document.querySelectorAll('ytd-rich-grid-row, #contents.ytd-rich-grid-row, ytd-two-column-browse-results-renderer.grid-5-columns').forEach(function(element) {

element.style.display = 'none';

});

// Adjust grid items per row for ytd-rich-grid-renderer

var richGridRenderers = document.querySelectorAll('ytd-rich-grid-renderer');

richGridRenderers.forEach(function(renderer) {

renderer.style.setProperty('--ytd-rich-grid-items-per-row', '4', 'important');

});

// Adjust styles for elements with provided selectors

document.querySelectorAll('#ytd-two-column-browse-results-renderer.grid-6-columns').forEach(function(element) {

element.style.width = '100%';

});

document.querySelectorAll('ytd-two-column-browse-results-renderer.grid').forEach(function(element) {

element.style.maxWidth = 'initial';

});

})();