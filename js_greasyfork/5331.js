// ==UserScript==
// @name       GDocs form field focus
// @description Places the cursor in the first text field on a Google Docs form. Useful if you use the form in combination with a barcode scanner for example.
// @version 0.3
// @match      https://docs.google.com/*/viewform*
// @namespace https://greasyfork.org/users/5660
// @downloadURL https://update.greasyfork.org/scripts/5331/GDocs%20form%20field%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/5331/GDocs%20form%20field%20focus.meta.js
// ==/UserScript==

setTimeout(() => document.querySelector("input[type=text]").focus(), 100);