// ==UserScript==
// @name        Jisho Mahou
// @namespace   Violentmonkey Scripts
// @match       *://jisho.org/*
// @grant       GM_setClipboard
// @version     1.3
// @author      harrisonmg
// @description 12/28/2024, 12:50:00 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/522237/Jisho%20Mahou.user.js
// @updateURL https://update.greasyfork.org/scripts/522237/Jisho%20Mahou.meta.js
// ==/UserScript==

/// make entire search result list entries clickable ///

const selectedText = () => {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

for (const entry of document.querySelectorAll('.kanji_light, .concept_light, .sentence')) {
    const details = entry.querySelector('.light-details_link');
    if (details !== null) {
        entry.style.cursor = "pointer";

        entry.addEventListener("click", (event) => {
            // don't clobber clicks on existing links
            const anchor = event.target.tagName === "A";

            // don't trigger if the user is selecting text
            const selection = selectedText() !== "";

            if (!anchor && !selection) {
                entry.dataset.singleClicked = "true";

                // use a timeout to avoid triggering on double clicks
                // which might be for selecting text
                setTimeout(() => {
                    if (entry.dataset.singleClicked === "true") {
                        entry.dataset.singleClicked = "false";
                        details.click();
                    }
                }, 150);
            }
        });

        // use mousedown events to help detect double clicks
        entry.addEventListener("mousedown", () => {
            entry.dataset.singleClicked = "false";
        });
    }
}

/// click any kanji to go to that kanji's page ///

const isKanji = (char) => {
    const kanjiRegex = /[\u4E00-\u9FAF]/;
    return kanjiRegex.test(char);
}

let lastHighlighted = null;
let lastHighlightedBefore = null;
let lastHighlightedAfter = null;
let oldNode = null;

document.addEventListener('mousemove', (event) => {
    // remove highlighting from the last character
    if (lastHighlighted) {
        const parent = lastHighlighted.parentNode;

        parent.removeChild(lastHighlightedBefore);
        parent.removeChild(lastHighlightedAfter);
        parent.replaceChild(oldNode, lastHighlighted);

        lastHighlighted = null;
        lastHighlightedBefore = null;
        lastHighlightedAfter = null;
        oldNode = null;
    }

    // try to avoid activating while selecting text
    if (event.buttons > 0) return;

    // get char under cursor
    const caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);
    if (caretPosition && caretPosition.offsetNode.nodeType === Node.TEXT_NODE) {
        const textNode = caretPosition.offsetNode;

        // don't break radical search
        if (textNode.parentNode.classList.contains("radical")) return;

        const textContent = textNode.textContent;

        // don't clobber existing links
        const parent = textNode.parentNode;
        if (parent.tagName === 'A') return;

        let charIndex = caretPosition.offset;

        if (charIndex >= textContent.length) {
            charIndex = textContent.length - 1;
        }

        let char = textContent[charIndex];

        // not perfect the best for getting under cursor
        if (charIndex > 0 && (!isKanji(char) || char === "undefined")) {
            --charIndex;
        }

        char = textContent[charIndex];

        // only apply to kanji
        if (!isKanji(char)) return;

        oldNode = textNode.cloneNode(true);

        // make span for highlighted char
        const span = document.createElement('a');
        span.style.color = '#909dc0';
        span.href = `https://jisho.org/search/${encodeURIComponent(char)} %23kanji`;
        span.style.textDecoration = 'none';
        span.textContent = char;

        // split the text node around the char
        const beforeText = textContent.slice(0, charIndex);
        const afterText = textContent.slice(charIndex + 1);

        const beforeNode = document.createTextNode(beforeText)
        const afterNode = document.createTextNode(afterText)

        // replace with highlighted char
        parent.insertBefore(beforeNode, textNode);
        parent.insertBefore(span, textNode);
        parent.insertBefore(afterNode, textNode);
        parent.removeChild(textNode);

        lastHighlightedBefore = beforeNode;
        lastHighlighted = span;
        lastHighlightedAfter = afterNode;
    }
});

// ctrl+c copies kanji under cursor
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'c' && lastHighlighted) {
        GM_setClipboard(lastHighlighted.textContent);
    }
});
