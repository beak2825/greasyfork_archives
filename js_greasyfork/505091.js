// ==UserScript==
// @name         Remove duolingo plus ads
// @version      1.1
// @namespace    http://tampermonkey.net/
// @description  This tiny bit of code removes all the annoying Duolingo Plus ads littering the site (I hope)
// @author       RenjiYuusei
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/a774fe14d71e450d59a9bc4ed5d210c9.png
// @license      GPL-3.0-only
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505091/Remove%20duolingo%20plus%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/505091/Remove%20duolingo%20plus%20ads.meta.js
// ==/UserScript==

var n;(n=document.createElement("style")).textContent="\n        ._16rRh, ._3D_HB, .MGk8p, ._3HatJ, .cY8_V, ._2V0_0, ._3KIC2, .nSmJD, ._2tNGm  {\n            display: none !important;\n        }\n    ",document.head.appendChild(n);