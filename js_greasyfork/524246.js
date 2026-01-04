// ==UserScript==
// @name        Open PDF as PDF
// @namespace   Violentmonkey Scripts
// @match       https://www.physicsandmathstutor.com/pdf-pages/*
// @grant       none
// @version     1.0
// @author      -
// @description Automatically opens PMT PDFs as a PDF, rather than embedded in a weird viewer with an advert.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524246/Open%20PDF%20as%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/524246/Open%20PDF%20as%20PDF.meta.js
// ==/UserScript==

(function() {
  window.location = new URLSearchParams(window.location.search).get('pdf');
})();