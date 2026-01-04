// ==UserScript==
// @name         navigate-canonical
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  Go to the canonical page
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @license      MIT
// @homepage     https://github.com/ciffelia/navigate-canonical#readme
// @supportURL   https://github.com/ciffelia/navigate-canonical/issues
// @include      *
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387313/navigate-canonical.user.js
// @updateURL https://update.greasyfork.org/scripts/387313/navigate-canonical.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const navigate = () => {
    location.href = document.querySelector('link[rel=canonical]').href;
  };

  GM_registerMenuCommand('Go to the canonical page', navigate, 'g');

}());
