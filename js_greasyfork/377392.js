// ==UserScript==
// @name        Goodreads + Audible
// @namespace   http://www.goodreads.com/*
// @description TBD
// @include     /^https?://.*\.goodreads\.com/book/show.*$/
// @grant       none
// @version     1.0.5
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377392/Goodreads%20%2B%20Audible.user.js
// @updateURL https://update.greasyfork.org/scripts/377392/Goodreads%20%2B%20Audible.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery.noConflict();
    const bookTitle = jQuery("#bookTitle").text().trim();
    const bookAuthor = jQuery(".authorName").first().text().trim();
    const searchString = encodeURIComponent(`${bookTitle} ${bookAuthor}`);
    const url = `https://www.audible.com/search?advsearchKeywords=${searchString}`;
    jQuery('body').append(`<div style="position: fixed;
    top: 60px;
    left: 1em;
    width: 400px;
    background-color: #ececec;
    border: 1px solid black;
    padding: 1em;"><h3>Audible result</h3><div id="audible-result">Loading...</div></div>`)

    fetch("https://cors-anywhere.herokuapp.com/"+url).then(response => response.text()).then(text => {
    let data = "";
    for(const a of jQuery(text).find(".productListItem")) {
        const link = jQuery(a).find("a").first().attr("href")
        const name = a.getAttribute("aria-label")
        const author = jQuery(a).find(".authorLabel").text().replace(/\s+/g, " ").trim()
        data += `<div><a href="https://www.audible.com/${link}">${name}</a> ${author}</div>`
    }
    jQuery('#audible-result').html(data);
    })
    // Alernative method using iFrame
    // document.body.appendChild(document.createElement('script')).src='https://unpkg.com/x-frame-bypass';
    // jQuery('body').append(`<iframe is="x-frame-bypass" src="${url}" style="position: fixed;bottom: 0;left: 0;height: 300px;width: 100%;"></iframe>`);
})();