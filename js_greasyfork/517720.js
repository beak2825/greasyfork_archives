// ==UserScript==
// @name         Amazon to Annas Archive
// @version      1
// @description   Enhances Amazon book pages by adding a direct link to search for the book on Annas Archive. The link appears next to the reviews, providing a convenient way to find additional information and resources related to the book on Annas Archive.
// @author       Crimsab
// @match        https://www.amazon.com/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.sg/*
// @match        https://www.amazon.com.tr/*
// @match        https://www.amazon.ae/*
// @match        https://www.amazon.sa/*
// @grant        none
// @namespace https://greasyfork.org/users/1282659
// @downloadURL https://update.greasyfork.org/scripts/517720/Amazon%20to%20Annas%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/517720/Amazon%20to%20Annas%20Archive.meta.js
// ==/UserScript==

(function() {
'use strict';

let ratingsContainer = document.querySelector('#acrCustomerReviewText');

let bookNameElement = document.querySelector('#productTitle');
let bookAuthorElement = document.querySelector('.author a');
if (!bookNameElement || !bookAuthorElement) {
    return;
}
let bookName = bookNameElement.textContent.trim();

if (ratingsContainer) {
    let customLink = document.createElement('a');
    customLink.textContent = ' | Open Annas Archive';
    customLink.href = 'https://annas-archive.org/search?q=' + bookName;
    customLink.style.display = 'inline'
    customLink.style.marginTop = '10px';
    customLink.style.textDecoration = 'none'

    ratingsContainer.parentNode.insertBefore(customLink, ratingsContainer.nextSibling);
}
})();