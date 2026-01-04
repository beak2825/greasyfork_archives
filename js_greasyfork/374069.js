// ==UserScript==
// @name         Improve Image Rendering
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ""
// @author       Eva1ent
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374069/Improve%20Image%20Rendering.user.js
// @updateURL https://update.greasyfork.org/scripts/374069/Improve%20Image%20Rendering.meta.js
// ==/UserScript==

;(function(d) {
  'use strict'
  d.body.style.imageRendering = "-webkit-optimize-contrast"
})(document)
