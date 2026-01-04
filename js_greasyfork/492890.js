// ==UserScript==
// @name         ontools.net bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Decrypts the URL on ontools.net and redirects to the decrypted URL
// @author       Your name
// @match        *.ontools.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492890/ontoolsnet%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/492890/ontoolsnet%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove <h1> headers
function removeHeaders() {
    var headers = document.querySelectorAll('h1, h2, h3');
    headers.forEach(function(header) {
        header.remove();
    });
}

// Function to remove <span> elements
function removeSpans() {
    var spans = document.querySelectorAll('span');
    spans.forEach(function(span) {
        span.remove();
    });
}

// Function to remove <p> elements
function removeParagraphs() {
    var paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(function(paragraph) {
        paragraph.remove();
    });
}

// Function to remove <nav> elements
function removeNavs() {
    var navs = document.querySelectorAll('nav');
    navs.forEach(function(nav) {
        nav.remove();
    });
}

// Function to remove <b> elements
function removeBold() {
    var bolds = document.querySelectorAll('b');
    bolds.forEach(function(bold) {
        bold.remove();
    });
}

// Function to remove <table> elements
function removeTables() {
    var tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
        table.remove();
    });
}

removeHeaders();
removeSpans();
removeParagraphs();
removeNavs();
removeBold();
removeTables();

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    };

    var decryptedUrl = aesCrypto.decrypt(apps2app($.urlParam('o')), apps2app('root'));

    window.location.href = decryptedUrl;
})();
