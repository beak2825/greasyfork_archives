// ==UserScript==
// @name         Add Sefaria Link to Wikisource
// @namespace    http://torahchats.com/
// @version      1.1
// @description  Adds a link to Sefaria on Hebrew Wikisource pages
// @author       Binjomin Szanto-Varnagy
// @license      MIT
// @match        https://he.wikisource.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511920/Add%20Sefaria%20Link%20to%20Wikisource.user.js
// @updateURL https://update.greasyfork.org/scripts/511920/Add%20Sefaria%20Link%20to%20Wikisource.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dictionary mapping Hebrew book names to Sefaria's English book names
    const bookNameMap = {
        "בראשית": "Genesis",
        "שמות": "Exodus",
        "ויקרא": "Leviticus",
        "במדבר": "Numbers",
        "דברים": "Deuteronomy",
        "יהושע": "Joshua",
        "שופטים": "Judges",
        "שמואל א": "I_Samuel",
        "שמואל ב": "II_Samuel",
        "מלכים א": "I_Kings",
        "מלכים ב": "II_Kings",
        "ישעיהו": "Isaiah",
        "ירמיהו": "Jeremiah",
        "יחזקאל": "Ezekiel",
        "הושע": "Hosea",
        "יואל": "Joel",
        "עמוס": "Amos",
        "עובדיה": "Obadiah",
        "יונה": "Jonah",
        "מיכה": "Micah",
        "נחום": "Nahum",
        "חבקוק": "Habakkuk",
        "צפניה": "Zephaniah",
        "חגי": "Haggai",
        "זכריה": "Zechariah",
        "מלאכי": "Malachi",
        "תהלים": "Psalms",
        "משלי": "Proverbs",
        "איוב": "Job",
        "שיר השירים": "Song_of_Songs",
        "רות": "Ruth",
        "איכה": "Lamentations",
        "קהלת": "Ecclesiastes",
        "אסתר": "Esther",
        "דניאל": "Daniel",
        "עזרא": "Ezra",
        "נחמיה": "Nehemiah",
        "דברי הימים א": "I_Chronicles",
        "דברי הימים ב": "II_Chronicles"
    };

    // Step 1: Extract the reference from the URL
    const url = decodeURI(window.location.href);
    const regex = /קטגוריה:([^_]+)_([^_]+)_([^_]+)/;
    const match = url.match(regex);

    if (match) {
        const hebrewBook = match[1].replace(/_/g, " "); // Get Hebrew book name
        const chapter = hebrewToNumber(match[2]); // Get chapter number
        const verse = hebrewToNumber(match[3]); // Get verse number

        // Step 2: Translate the Hebrew book name to English using the dictionary
        const englishBook = bookNameMap[hebrewBook];
        if (englishBook) {
            // Step 3: Create the Sefaria URL
            const sefariaUrl = `https://www.sefaria.org/${englishBook}.${chapter}.${verse}?lang=bi`;

            // Step 4: Inject the link to Sefaria at the top of the Wikisource page
            const sefariaLink = document.createElement('a');
            sefariaLink.href = sefariaUrl;
            sefariaLink.innerText = "View this chapter on Sefaria";
            sefariaLink.style.display = 'block';
            sefariaLink.style.margin = '10px';
            sefariaLink.style.fontWeight = 'bold';
            sefariaLink.style.color = 'blue';

            // Step 5: Append the link to the top of the body
            document.body.prepend(sefariaLink);
        }
    }
})();

function hebrewToNumber(hebrew) {
    // Special cases for 15 (טו) and 16 (טז)
    if (hebrew === "טו") return 15;
    if (hebrew === "טז") return 16;

    // Map of Hebrew letters to their corresponding numeric values
    const gematriaMap = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
        'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
        'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    };

    // Convert the Hebrew string into a number
    let number = 0;
    for (let i = 0; i < hebrew.length; i++) {
        const letter = hebrew[i];
        if (gematriaMap[letter]) {
            number += gematriaMap[letter];
        } else {
            console.warn(`Unknown Hebrew letter: ${letter}`);
        }
    }
    return number;
}
