// ==UserScript==
// @name        Kraland Ignore
// @description Passe tous les messages forum, événements et rapport privé d'une liste de personne par des messages en spoiler
// @include     http://www.kraland.org/*
// @require     http://code.jquery.com/jquery-2.0.3.min.js
// @version     2024-09-12
// @namespace https://greasyfork.org/users/1320445
// @downloadURL https://update.greasyfork.org/scripts/507648/Kraland%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/507648/Kraland%20Ignore.meta.js
// ==/UserScript==

// Liste des mots à rechercher
const wordList = [
    'pseudonyme_1',
    'pseudonyme_2',
    'pseudonyme_3'
];

// Function to check if a word from the list is found in the text and return the found word
function findWord(text) {
    return wordList.find(word => text.includes(word)) || null;
}

// Function to extract content up to the first ':' or '.'
function extractTextStart(text) {
    const colonPosition = text.indexOf(':');
    const periodPosition = text.indexOf('.');

    // Find the first occurrence of ':' or '.'
    const endPosition = colonPosition !== -1
        ? (periodPosition !== -1 ? Math.min(colonPosition, periodPosition) : colonPosition)
        : periodPosition;

    return endPosition !== -1 ? text.substring(0, endPosition) : text;
}

// Function to encapsulate content in the spoiler structure
function encapsulateWithSpoiler(element, content, foundWord) {
    console.log(`Encapsulating content with spoiler for the found word: ${foundWord}`);

    // Create the new HTML structure with the found word added
    const newStructure = `
        <div>
            <div class="pre-spoiler">
                <span style="float:left; padding-top: 2px;">${foundWord} : Spoiler</span>
                <input type="button" value="Show" class="see-spoiler">
            </div>
            <div>
                <div class="spoiler" style="display: none;">${content}</div>
            </div>
        </div>
    `;

    // Replace the element's content with the new structure
    element.innerHTML = newStructure;

    // Attach event listener to the button
    const button = element.querySelector('.see-spoiler');
    button.addEventListener('click', function() {
        const spoilerContent = button.parentElement.nextElementSibling.querySelector('.spoiler');
        if (spoilerContent.style.display === 'none') {
            spoilerContent.style.display = 'block';
            button.value = 'Hide';
        } else {
            spoilerContent.style.display = 'none';
            button.value = 'Show';
        }
    });
}

// Scenario 1: Pages of type http://www.kraland.org/main.php?p=5*
function scenario1() {
    console.log('Executing Scenario 1');
    // Select the table with class "forum"
    const forumTable = document.querySelector('table.forum');

    if (!forumTable) {
        console.log('Forum table not found');
        return;
    }

    const rows = forumTable.querySelectorAll('tr');

    rows.forEach(row => {
        const cartoucheColumn = row.querySelector('.forum-cartouche');
        const messageColumn = row.querySelector('.forum-message');

        if (cartoucheColumn && messageColumn) {
            const cartoucheText = cartoucheColumn.outerHTML;

            if (findWord(cartoucheText)) {
                encapsulateWithSpoiler(messageColumn, messageColumn.innerHTML, findWord(cartoucheText));
            }
        }
    });
}

// Scenario 2: Pages of type http://www.kraland.org/main.php?p=4_4*
function scenario2() {
    console.log('Executing Scenario 2');
    const forumTables = document.querySelectorAll('table.forum');

    forumTables.forEach(table => {
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const evNormalElements = row.querySelectorAll('.ev_normal');

            evNormalElements.forEach(evNormalElement => {
                const fullText = evNormalElement.outerHTML;
                const extractedText = extractTextStart(fullText);
                const foundWordInExtract = findWord(extractedText);

                if (foundWordInExtract) {
                    encapsulateWithSpoiler(evNormalElement, fullText, foundWordInExtract);
                }
            });
        });
    });
}

// Scenario 3: Pages of type http://www.kraland.org/report.php?p=0*
function scenario3() {
    console.log('Executing Scenario 3');
    // Select the table with class "forum"
    const forumTable = document.querySelector('table.forum');

    if (!forumTable) {
        console.log('Forum table not found');
        return;
    }

    const rows = forumTable.querySelectorAll('tr');

    rows.forEach(row => {
        // Select the second column of the row
        const columns = row.querySelectorAll('td');
        if (columns.length >= 2) {
            const secondColumn = columns[1];

            // Extract text from the second column up to the first ':' or '.'
            const fullText = secondColumn.outerHTML;
            const extractedText = extractTextStart(fullText);
            const foundWordInExtract = findWord(extractedText);

            // If a word from the list is found, encapsulate the content
            if (foundWordInExtract) {
                encapsulateWithSpoiler(secondColumn, fullText, foundWordInExtract);
            }
        }
    });
}

// Execute the appropriate scenario based on the page URL
if (window.location.href.startsWith('http://www.kraland.org/main.php?p=5')) {
    window.onload = scenario1;
} else if (window.location.href.startsWith('http://www.kraland.org/main.php?p=4_4')) {
    window.onload = scenario2;
} else if (window.location.href.startsWith('http://www.kraland.org/report.php?p=0')) {
    window.onload = scenario3;
}