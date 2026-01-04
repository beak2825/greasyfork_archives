// ==UserScript==
// @name         Advanced Wars clean pixels
// @namespace    http://tampermonkey.net/
// @version      2024-05-17 1.1
// @description  Removes Anti Aliasing
// @author       Nuion
// @match        https://awbw.amarriner.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amarriner.com
// @license      MIT
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495217/Advanced%20Wars%20clean%20pixels.user.js
// @updateURL https://update.greasyfork.org/scripts/495217/Advanced%20Wars%20clean%20pixels.meta.js
// ==/UserScript==
GM_addStyle ( `img {image-rendering: pixelated !important; "}` );