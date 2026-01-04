// ==UserScript==
// @name        Title Cleaner
// @namespace   Violentmonkey Scripts
// @match       *
// @version     1.0
// @description Clean up title strings
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @license      none
// ==/UserScript==

function cleanText(input) {
    // Add cleanText logic here as defined previously
}

function removeExplicit(text) {
    return text.replace(/\s*\(Explicit\)/i, '');
}

function removeDiacritics(text) {
    const diacriticsMap = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
    };
    return text.replace(/[áéíóúÁÉÍÓÚ]/g, match => diacriticsMap[match]);
}

function truncateAfterKeywords(text) {
    const keywords = [",", "ft", "feat", "(", "and"];
    let truncatePos = text.length;
    keywords.forEach(keyword => {
        const pos = text.indexOf(keyword);
        if (pos !== -1 && pos < truncatePos) truncatePos = pos;
    });
    return text.slice(0, truncatePos).trim();
}
