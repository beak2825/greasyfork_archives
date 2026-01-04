// ==UserScript==
// @name         Amazon Notepad
// @namespace    https://github.com/LeoDupont/userscripts
// @version      0.1
// @description  Lets you annotate Amazon products. Uses localStorage.
// @author       LeoDupont
// @license      MIT
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.mx/*
// @match        https://www.amazon.br/*
// @match        https://www.amazon.jp/*
// @match        https://www.amazon.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.fr
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435751/Amazon%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/435751/Amazon%20Notepad.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////
// Amazon Notepad
//
// Displays a simple text input under the product's name
//  * on product pages (always),
//  * on search results pages (if notes were found).
//
// Notes are saved on 'change' event.
// => the input need to loose focus for the event to be triggered,
// => a simple Tab or a click away will do the job.
//
// Uses the browser's localStorage to store notes.
// => notes are not synced anywhere on the Internet.
////////////////////////////////////////////////////////////////////

var $ = window.$; // Declaration

(function() {
  'use strict';

  // === Product Page ===

  var pageId = getProductIdFromUrl(document.URL);
  if (pageId) {
    var pageNotes = loadProductNotes(pageId);
    showNotepad(pageId, pageNotes, '#titleSection');
  }

  // === Search Results Page ===

  $('h2.a-size-mini > a.a-link-normal').each(function(i, elm) {
    var productId = getProductIdFromUrl(elm.href);
    if (productId) {
      var productNotes = loadProductNotes(productId);
      if (productNotes) {
        showNotepad(productId, productNotes, $(elm).parent().parent());
      }
    }
  });

})();

// =======================================================
// == Helpers
// =======================================================

function getProductIdFromUrl(url) {
  var match = url.match(/\/(\w{10})/);
  if (match) {
      return match[1];
  }
}

// =======================================================
// == UI
// =======================================================

function showNotepad(productId, value, elmToAppendTo) {
  $('<input>')
    .attr({
      id: 'amazon-notepad-' + productId,
      name: 'amazon-notepad',
      style: 'width: 100%; margin: 10px 0; background-color: lightyellow;',
      value: value,
      placeholder: 'Amazon Notepad...',
    })
    .appendTo(elmToAppendTo)
    .change(function(e) {
      var newNotes = e.target.value;
      console.log('[AMAZON NOTEPAD] Storing new notes for ' + productId + ': ' + newNotes);
      saveProductNotes(productId, newNotes);
    });
}

// =======================================================
// == Storage
// =======================================================

function loadProductNotes(productId) {
  return localStorage.getItem('amazon-notepad-' + productId);
}

function saveProductNotes(productId, notes) {
  localStorage.setItem('amazon-notepad-' + productId, notes);
}
