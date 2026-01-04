// ==UserScript==
// @name         Создание абзацев
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Делит текст на абзацы с отступами
// @author       resursator
// @license      MIT
// @match        https://ficbook.net/readfic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ficbook.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534292/%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B0%D0%B1%D0%B7%D0%B0%D1%86%D0%B5%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/534292/%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B0%D0%B1%D0%B7%D0%B0%D1%86%D0%B5%D0%B2.meta.js
// ==/UserScript==

(function () {
    const content = document.getElementById("content");
    if (!content) return;

    // Step 1: Get raw HTML content
    let html = content.innerHTML;

    // Step 2: Replace various non-breaking space types with regular space
    html = html.replace(/(&nbsp;|\u00A0|\u2002|\u2003|\u2009|\u202F|\u205F|\u3000)/g, ' ');

    // Step 3: Replace 4+ consecutive spaces (even inside tags) with a unique marker
    html = html.replace(/ {4,}/g, '[[PARA_SPLIT]]');
    html = html.replace(/\n/g, '[[PARA_SPLIT]]');

    // Step 4: Split by the marker
    let parts = html.split('[[PARA_SPLIT]]').map(p => p.trim()).filter(Boolean);

    // Step 5: Collapse multiple inner spaces to one (while keeping tags intact)
    parts = parts.map(p => p.replace(/ {2,}/g, ' '));

    // Step 6: Rebuild HTML with paragraph tags
    content.innerHTML = '';
    parts.forEach(part => {
        const p = document.createElement('p');
        p.style.textIndent = '2em';
        p.innerHTML = part;
        content.appendChild(p);
    });

    console.log("Success: Cleaned, normalized, and split into paragraphs.");
})();
