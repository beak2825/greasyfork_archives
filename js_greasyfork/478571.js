// ==UserScript==
// @name         mangaupdates to mangadex button
// @version      0.1
// @namespace   iduunonium
// @description  It adds a button next to each manga in your lists that redirect you to mangadex.
// @author       me
// @license MIT
// @match        https://www.mangaupdates.com/mylist.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangaupdates.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478571/mangaupdates%20to%20mangadex%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/478571/mangaupdates%20to%20mangadex%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

const mangas = document.querySelectorAll('div[id="list_table"] > div > div:nth-of-type(2) > a');

for (var i = 0, len = mangas.length; i < len; i++) {
    const manga_title = mangas[i].textContent.trim().replace(/---/g, '').replace(/\s+/g, '+');
    const mangadex_href = `https://mangadex.org/search?q=${manga_title}`;

    // Create an anchor (<a>) element
    const mangadex_link = document.createElement('a');
    mangadex_link.textContent = "MangaDex";
    mangadex_link.href = mangadex_href;
    mangadex_link.target = "_blank";


const containerDiv = document.createElement('div');
containerDiv.style.display = 'inline-block';

// Append the link to the container div
containerDiv.appendChild(mangadex_link);

// Get the <span class="newlist"> element
const newlistSpan = mangas[i].closest('div').querySelector('span.newlist');

// Insert the container div after the <span class="newlist">
newlistSpan.parentNode.insertBefore(containerDiv, newlistSpan.nextSibling);

    // Add margin to separate the link from the <span class="newlist">
    mangadex_link.style.marginLeft = '10px';
}

})();