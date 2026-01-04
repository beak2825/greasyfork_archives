// ==UserScript==
// @name         redacted/searchapplelink
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add apple search links to request page
// @author       You
// @match        https://redacted.ch/requests.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redacted.ch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462001/redactedsearchapplelink.user.js
// @updateURL https://update.greasyfork.org/scripts/462001/redactedsearchapplelink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Get all the <tr> elements with class="rowb"
    const rows = document.querySelectorAll('tr.rowb');

    // Loop through each row and extract the text before "[" character
    rows.forEach(row => {
        const text = row.innerText.split('[')[0].trim();

        // Find the first link element in the row's .tags div
        const newLink = document.createElement('a');
        newLink.href = "https://music.apple.com/us/search?term="+encodeURIComponent(text.replace(" &","").replace(" - "," ").replace("EP","").trim());
        newLink.textContent = "APM";
        newLink.target = "_Blank";

        const tags_element = row.querySelector('div.tags');
        tags_element.insertBefore(newLink,tags_element.firstChild);
    })
})
();