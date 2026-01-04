// ==UserScript==
// @name        Simplified Twitter
// @namespace   https://github.com/dnek
// @version     1.8.1
// @description Remove distractions from the new Twitter layout; UserScript version of https://github.com/brunolemos/simplified-twitter
// @author      DNEK
// @copyright   2019 Bruno Lemos
// @copyright   2025 DNEK
// @license     MIT
// @match       https://x.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529191/Simplified%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/529191/Simplified%20Twitter.meta.js
// ==/UserScript==

/*!
 * MIT License
 *
 * Original Project: Simplified Twitter
 * https://github.com/brunolemos/simplified-twitter
 *
 * Copyright (c) 2019 Bruno Lemos
 * Copyright (c) 2025 DNEK
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

(function () {
  'use strict';

  GM_addStyle(`
#react-root main {
  -webkit-flex-grow: 1 !important;
  flex-grow: 1 !important;
}

@media (min-width: 800px) {
  [role='listbox'] {
    max-width: 500px !important;
  }
}
`)

  function update () {
    const width = Math.min(document.documentElement.offsetWidth || 800, 800)
    if (window.innerWidth === width && document.documentElement.clientWidth === width) return

    window.__defineGetter__('innerWidth', () => width)
    document.documentElement.__defineGetter__('clientWidth', () => width)
    if (window.visualViewport) window.visualViewport.__defineGetter__('width', () => width)

    window.dispatchEvent(new Event('resize'))
    if (window.visualViewport) window.visualViewport.dispatchEvent(new Event('resize'))
  }

  window.addEventListener('load', update)
  window.addEventListener('resize', update)
  if (window.visualViewport) window.visualViewport.addEventListener('resize', update)
  document.addEventListener('visibilitychange', update)
  update()
})();
