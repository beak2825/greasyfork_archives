// ==UserScript==
// @name         Download Atenea PDF
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download Atenea PDFs
// @author       Gerard López
// @include      https://atenea.upc.edu/mod/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432797/Download%20Atenea%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/432797/Download%20Atenea%20PDF.meta.js
// ==/UserScript==
var pdf_url = document.querySelectorAll('#resourceobject')[0].data;
location.href = pdf_url;
history.back()

