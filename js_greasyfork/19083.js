// ==UserScript==
// @name        Alldatasheet.com: Single-click PDF access
// @description On the search results page, clicking on the PDF icon will jump you straight to PDF view.
// @namespace   giferrari.net
// @include     http://*.alldatasheet.com/*
// @version     3
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/19083/Alldatasheetcom%3A%20Single-click%20PDF%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/19083/Alldatasheetcom%3A%20Single-click%20PDF%20access.meta.js
// ==/UserScript==

// Grab all links that appear to redirect to a PDF page.
// There isn't a class that we can key off of, so we look for all
// anchors that have a PDF icon in them.
var datasheetPdfLinks = $('img[src="http://other.alldatasheet.com/etc/electronic_parts_datasheet.gif"]').closest('a');

// Open in same window instead of a new one.
datasheetPdfLinks.attr('target', null);

// Compute path to the PDF view page and go there directly.
// I don't know how to compute the path to the PDF itself,
// so we need to load the normal view page first.
datasheetPdfLinks.attr('href', function(i, oldHref) {
  // From:
  // http://www.alldatasheet.com/datasheet-pdf/pdf/317775/COMSET/2N2222.html
  // To:
  //http://pdf1.alldatasheet.com/datasheet-pdf/view/317775/COMSET/2N2222.html
  
  return oldHref
   .replace(/^http:\/\/www.alldatasheet.com/, 'http://pdf1.alldatasheet.com')
   .replace(/\/pdf\//, '/view/');
});

// This script also runs on the PDF page itself.
// If there's a PDF on this page, navigate to it directly.
var pdfIframe = $('iframe[src$=".pdf"');
var pdfUrl = pdfIframe.attr('src');
pdfIframe.attr('src', ''); // Hopefully prevent waste of bandwidth, we're about to go there anyway.
// Use a setTimeout to let the ads load; we're not monsters.
setTimeout(function() {
  if (pdfUrl) {
    window.location.replace(pdfUrl);
  }
}, 1000);