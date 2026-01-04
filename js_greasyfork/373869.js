// ==UserScript==
// @name         Loop video files
// @description  Sets the loop attribute when viewing video files in their own window/tab.
// @namespace    var512
// @author       var512
// @version      1.1.0
// @supportURL   https://gitlab.com/var512
// @supportURL   https://github.com/var512
// @include      /\.(m4v|mp4|ogv|webm)$/
// @include      /^data:video\//
// @license      MIT
// @noframes
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373869/Loop%20video%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/373869/Loop%20video%20files.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const elements = document.getElementsByTagName('video');

  if (typeof elements[0] !== 'undefined') {
    elements[0].setAttribute('loop', 'true');
  }
})();
