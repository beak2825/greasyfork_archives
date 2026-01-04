// ==UserScript==
// @name         Spiegel Online: Bentoblocker
// @description  Entfernt Bento aus der SPON-Homepage.
// @author       Sebastian Haberey <sebastian@haberey.com> (https://haberey.com)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @icon         http://tampermonkey.net/favicon.ico
// @match        http*://*.spiegel.de/*
// @locale       de
// @license      MIT
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/382919/Spiegel%20Online%3A%20Bentoblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/382919/Spiegel%20Online%3A%20Bentoblocker.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, -W097 */

(function($) {
  'use strict';

  var SELECTORS = [
    '.bento',
    '#footer',
    '.gutscheine-widget',
    '.html_139440'
  ];

  /**
   * Finds all elements identified by the specified list of jQuery selectors.
   *
   * @param selectors
   * @returns map with key: selector and value: list of elements
   */
  function findElements(selectors) {
    return selectors.reduce(function(accumulator, selector) {
      accumulator[selector] = $(selector);
      return accumulator;
    }, {});
  }

  /**
   * Removes all elements identified by the specified map of jQuery elements.
   *
   * @param map with key: selector and value: list of elements
   */
  function removeElements(selectorsToElements) {

    var removed = {};

    for (var selector in selectorsToElements) {

      var elements = selectorsToElements[selector];
      var elementCount = elements && elements.length ? elements.length : 0;

      if (elementCount > 0) {
        elements.remove();
      }

      removed[selector] = elementCount;
    }

    return removed;
  }

  var elements = findElements(SELECTORS);
  removeElements(elements);

  for (var selector in elements) {
    console.debug(
        'Removed ' +
        elements[selector].length +
        ' element(s) for selector \'' +
        selector +
        '\'.');
  }

})(window.jQuery);

window.jQuery.noConflict();
