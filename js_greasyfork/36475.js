// ==UserScript==
// @name         AO3: Links for Entire Works
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.5
// @license      MIT
// @description  Add links to next and previous chapter to Entire Works of AO3.
// @author       Vannius
// @match        https://archiveofourown.org/works/*view_full_work=true*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36475/AO3%3A%20Links%20for%20Entire%20Works.user.js
// @updateURL https://update.greasyfork.org/scripts/36475/AO3%3A%20Links%20for%20Entire%20Works.meta.js
// ==/UserScript==

(function() {
    // get id="chapter-[d]+" tags
    let chapters = [];
    let index = 1;
    while (true) {
        const chapter = document.getElementById('chapter-' + index);
        if (chapter) {
            chapters.push(chapter);
            index += 1;
        } else {
            break;
        }
    }

    for (let i = 0; i < chapters.length; i++) {
        // Display add links to right of each chapter title.
        const rightSpan = document.createElement('span');
        rightSpan.style.float = 'right';

        // Make a link to current chapter
        if (i === 0) {
            const currentChapter = document.createElement('a');
            currentChapter.title = "Current chapter";
            currentChapter.href = "#chapter-" + (i + 1);
            currentChapter.appendChild(document.createTextNode('◆'));
            rightSpan.appendChild(currentChapter);
        }
        // Make a link to prev chapter
        if (i !== 0) {
            const prevChapter = document.createElement('a');
            prevChapter.title = "Previous chapter";
            prevChapter.href = "#chapter-" + i;
            prevChapter.appendChild(document.createTextNode('▲'));
            rightSpan.appendChild(prevChapter);
        }
        // Make a link to next chapter
        if (i != chapters.length - 1) {
            const nextChapter = document.createElement('a');
            nextChapter.title = "Next chapter";
            nextChapter.href = "#chapter-" + (i + 2);
            nextChapter.appendChild(document.createTextNode('▼'));
            rightSpan.appendChild(nextChapter);
        }
        // Make a link to current chapter
        if (i == chapters.length - 1) {
            const currentChapter = document.createElement('a');
            currentChapter.title = "Current chapter";
            currentChapter.href = "#chapter-" + (i + 1);
            currentChapter.appendChild(document.createTextNode('◆'));
            rightSpan.appendChild(currentChapter);
        }

        // Add links
        chapters[i].querySelector(".chapter .title").appendChild(rightSpan);
    }
})();