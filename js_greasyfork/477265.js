// ==UserScript==
// @name        Native MathML for Wikipedia
// @namespace   Violentmonkey Scripts
// @description Use MathML on Wikipedia.
//// http:
// @include       http://*wiki*
// @include       http://wikipedia.org/*
// @include       http://*.wikipedia.org/*
// @include       http://wiktionary.org/*
// @include       http://*.wiktionary.org/*
// @include       http://*/wiki/*
//// https:
// @include       https://*wiki*
// @include       https://wikipedia.org/*
// @include       https://*.wikipedia.org/*
// @include       https://wiktionary.org/*
// @include       https://*.wiktionary.org/*
// @include       https://*/wiki/*
// @version       0.1
// @author        loikein
// @license       MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/477265/Native%20MathML%20for%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/477265/Native%20MathML%20for%20Wikipedia.meta.js
// ==/UserScript==
// Adapted from: https://github.com/fred-wang/webextension-native-mathml/tree/master

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let menuConfig = "renderer:NativeMML"; // Force the native MathML output.
menuConfig += "&;semantics:true";      // Preserve semantics annotations.
menuConfig += "&;context:Browser";     // Force the browser context menu.
menuConfig += "&;zoom:None";           // Disable MathJax's zoom.

// Create a mjx.menu cookie for this document to modify the menu option.
document.cookie = `mjx.menu=${escape(menuConfig)}; path=/; SameSite=Strict`;

// Delete the cookie before leaving the page.
window.addEventListener("unload", () => {
  document.cookie = "mjx.menu=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
});

/**
 * https://stackoverflow.com/a/15506705/10668706
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

addStyle(`
.mwe-math-mathml-a11y {
    clip: auto !important;
    overflow: visible !important;
    position: static !important;
    width: auto !important;
    height: auto !important;
    opacity: 1 !important;
    display: inherit !important;
}
body.mediawiki .ve-ce-mwLatexNode .mwe-math-mathml-a11y {
    /* override https://phabricator.wikimedia.org/diffusion/EMAT/browse/master/modules/ve-math/ve.ce.MWLatexNode.css */
    display: inherit !important;
}
/* Support where MediaWiki lazy loaded images */
.mwe-math-mathml-inline ~ .lazy-image-placeholder,
.mwe-math-mathml-display ~ .lazy-image-placeholder,
/* Support where MediaWiki doesn't lazy load images */
.mwe-math-mathml-inline + .mwe-math-fallback-image-inline,
.mwe-math-mathml-display + .mwe-math-fallback-image-display {
    display: none !important;
}
`);
