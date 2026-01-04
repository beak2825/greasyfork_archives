// ==UserScript==
// @name         Wikipedia, set "float: left" for <figure> with width over 50 em
// @namespace    http://tampermonkey.net/
// @version      2024-03-21.2
// @description  Setting "float: left" for <figure> with width over 50 em, avoids texts(left aligned) being squeezed too short.
// @author       Al Arcus
// @match        **.wikipedia.org/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490471/Wikipedia%2C%20set%20%22float%3A%20left%22%20for%20%3Cfigure%3E%20with%20width%20over%2050%20em.user.js
// @updateURL https://update.greasyfork.org/scripts/490471/Wikipedia%2C%20set%20%22float%3A%20left%22%20for%20%3Cfigure%3E%20with%20width%20over%2050%20em.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Select all <figure> elements whose width is over 50em
const figures = document.querySelectorAll('figure');

figures.forEach(figure => {
  // Get the computed width of the figure
  const figureWidth = parseFloat(window.getComputedStyle(figure).width);
    console.log('Figure width:', figureWidth);

  // Check if width is over 50em
  if (figureWidth > 50 * parseFloat(window.getComputedStyle(document.documentElement).fontSize)) {
    // Set the float property to left
    figure.style.float = 'left';
    figure.style.marginLeft = '0px';
  }
});
})();