// ==UserScript==
// @name        MoreCAPTCHA
// @namespace   https://eugenox.appspot.com/
// @description Speeds up solving Google reCAPTCHA challenges by shortening transition effects and providing continuous selection ability.
// @version     1.2
// @author      Eugene Nouvellieu <eugenox_gmail_com>
// @license     GNU General Public License
// @include     https://www.google.com/recaptcha/api2/bframe?*
// @run-at      document-start
// @grant       unsafeWindow
// @homepageURL https://eugenox.appspot.com/script/morecaptcha
// @downloadURL https://update.greasyfork.org/scripts/31088/MoreCAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/31088/MoreCAPTCHA.meta.js
// ==/UserScript==

// Copyright (C) 2017 Eugene Nouvellieu <eugenox_gmail_com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

var SPEED = 5;

var selector = {
  selecting: undefined,

  handle: function(event) {
    var tiles = new Set(document.querySelectorAll('#rc-imageselect td')), tile = event.target;

    while (tile && ! tiles.has(tile)) {
      tile = tile.parentNode;
    }

    if (tile) {
      event.stopPropagation();
      event.preventDefault();

      var selected = 'selected' in tile.dataset && tile.dataset.selected == 'true';

      if (this[event.type](selected)) {
        tile.dataset.selected = this.selecting;

        tile.firstElementChild.click();
      }
    }
  },

  mouseover: function(selected) {
    return ! (this.selecting === undefined || this.selecting === selected);
  },

  mousedown: function(selected) {
    this.selecting = ! selected;

    return true;
  },

  mouseup: function(selected) {
    this.selecting = undefined;

    return false;
  }
};

window.addEventListener('load', function(event) {
  var sheet = document.body.appendChild(document.createElement('style')).sheet;

  sheet.insertRule(
    '.rc-imageselect-table-33, .rc-imageselect-table-42, .rc-imageselect-table-44' +
    '{ transition-duration: ' + (1 / SPEED) + 's !important }', 0);
  sheet.insertRule(
    '.rc-imageselect-tile' +
    '{ transition-duration: ' + (4 / SPEED) + 's !important }', 1);
  sheet.insertRule(
    '.rc-imageselect-dynamic-selected' +
    '{ transition-duration: ' + (2 / SPEED) + 's !important }', 2);
  sheet.insertRule(
    '.rc-imageselect-progress' +
    '{ transition-duration: ' + (1 / SPEED) + 's !important }', 3);
  sheet.insertRule(
    '.rc-image-tile-overlay' +
    '{ transition-duration: ' + (1 / SPEED) + 's !important }', 4);

  var handler = selector.handle.bind(selector);

  document.body.addEventListener('mouseover', handler, false);
  document.body.addEventListener('mousedown', handler, false);
  document.body.addEventListener('mouseup', handler, false);
});

function publish(func) {
  if (typeof exportFunction == 'function') {
    return exportFunction(func, unsafeWindow);
  }

  return func;
}

var __setTimeout = unsafeWindow.setTimeout.bind(unsafeWindow);

unsafeWindow.setTimeout = publish(function(callback, delay) {
  return __setTimeout(callback, Number(delay) / SPEED);
});
