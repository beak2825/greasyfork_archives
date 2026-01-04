// ==UserScript==
// @name        SpeedCAPTCHA
// @description Enhances the efficiency of resolving Google reCAPTCHA challenges by reducing the duration of transition effects and enabling uninterrupted selection capability.
// @version     1.0
// @license     GNU General Public License
// @include     https://www.google.com/recaptcha/api2/bframe?*
// @run-at      document-start
// @grant       unsafeWindow
// @namespace https://greasyfork.org/users/1231264
// @downloadURL https://update.greasyfork.org/scripts/481810/SpeedCAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/481810/SpeedCAPTCHA.meta.js
// ==/UserScript==

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