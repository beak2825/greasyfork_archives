// ==UserScript==
// @name        De-derp Slicer Stats
// @namespace   http://classcoder.com
// @description The stats page has the "HOME | ABOUT | FAQ | SUPPORT | TERMS | PRIVACY" bar right smack dab in the middle of it. This userscript removes it.
// @include     http://stats.slicer.io/*
// @include     https://stats.slicer.io/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/10801/De-derp%20Slicer%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/10801/De-derp%20Slicer%20Stats.meta.js
// ==/UserScript==

document.querySelector('div[muid=".0.1.0.4"]').style.display = 'none'