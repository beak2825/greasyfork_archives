// ==UserScript==
// @name         Genius Helper
// @namespace    https://greasyfork.org/en/users/1471367
// @version      1.2
// @description  Genius Helpers
// @author       Amentes
// @match        https://genius.com/*
// @grant        none
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/536330/Genius%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/536330/Genius%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

let currentTextarea = null;
let lastSelection = { start: null, end: null };
let sectionButtonsAdded = false;

function addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
    .genius-format-popup {
        position: absolute;
        background: #222;
        color: white;
        border-radius: 8px;
        padding: 8px 10px;
        display: flex;
        gap: 10px;
        z-index: 9999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        font-size: 16px;
    }

    .genius-format-button {
        background: #333;
        border: none;
        color: white;
        font-weight: bold;
        cursor: pointer;
        font-size: 18px;
        padding: 6px 10px;
        border-radius: 5px;
    }

    .genius-format-button:hover {
        background-color: #555;
        color: yellow;
    }

    #genius-section-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
        align-items: center;
        background: #1e1e1e;
        padding: 10px;
        border-radius: 10px;
    }

    #genius-section-buttons button {
        background: #2a2a2a;
        border: 1px solid #444;
        color: #ddd;
        padding: 8px 14px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
    }

    #genius-section-buttons button:hover {
        background-color: #3a3a3a;
        border-color: #777;
        color: #fff;
    }

    .artist-tag {
        background: #3c3c3c;
        color: white;
        padding: 6px 12px;
        border-radius: 16px;
        margin: 2px;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s, transform 0.2s;
    }

    .artist-tag.selected {
        background: #0a84ff;
        font-weight: bold;
        transform: scale(1.05);
    }

    #artist-tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
    }
    `;
    document.head.appendChild(style);
}

function getCaretCoordinates(textarea, selectionIndex) {
    const div = document.createElement("div");
    const style = getComputedStyle(textarea);

    for (const prop of style) {
        div.style[prop] = style[prop];
    }

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.overflow = "auto";
    div.style.width = `${textarea.offsetWidth}px`;

    const value = textarea.value;
    const before = value.substring(0, selectionIndex);
    const after = value.substring(selectionIndex);
    const span = document.createElement("span");
    span.textContent = after.length === 0 ? "." : after[0];
    div.textContent = before;
    div.appendChild(span);

    document.body.appendChild(div);
    const { left, top } = span.getBoundingClientRect();
    document.body.removeChild(div);

    return { x: left, y: top };
}

function createPopup(x, y, onBold, onItalic) {
    removePopup();

    const popup = document.createElement('div');
    popup.className = 'genius-format-popup';
    popup.style.top = `${y}px`;
    popup.style.left = `${x}px`;

    const boldBtn = document.createElement('button');
    boldBtn.innerText = 'B';
    boldBtn.className = 'genius-format-button';
    boldBtn.addEventListener('mousedown', e => {
        e.preventDefault();
        onBold();
    });

    const italicBtn = document.createElement('button');
    italicBtn.innerText = 'I';
    italicBtn.className = 'genius-format-button';
    italicBtn.addEventListener('mousedown', e => {
        e.preventDefault();
        onItalic();
    });

    popup.appendChild(boldBtn);
    popup.appendChild(italicBtn);

    document.body.appendChild(popup);
}

function removePopup() {
    const existing = document.querySelector('.genius-format-popup');
    if (existing) existing.remove();
}

function handleFormatting(textarea) {
    currentTextarea = textarea;

    textarea.addEventListener('mouseup', (event) => {
    setTimeout(() => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) {
            removePopup();
            return;
        }

        lastSelection = { start, end };

        const x = event.pageX;
        const y = event.pageY - 40;

        createPopup(x, y, wrapWithTag('b'), wrapWithTag('i'));
     }, 0);
    });



    textarea.addEventListener('blur', () => {
        setTimeout(removePopup, 100);
    });

    textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            updateSelection(textarea);
            wrapWithTag('b')();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            updateSelection(textarea);
            wrapWithTag('i')();
        }
    });
}

function updateSelection(textarea) {
    lastSelection = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd
    };
}

function wrapWithTag(tag) {
    return function () {
        if (!currentTextarea) return;

        const { start, end } = lastSelection;
        if (start === null || end === null) return;

        const value = currentTextarea.value;

        if (start === end) {
            const wrapped = `<${tag}></${tag}>`;
            currentTextarea.setRangeText(wrapped, start, end, 'end');
        } else {
            const selectedText = value.substring(start, end);
            const wrapped = `<${tag}>${selectedText}</${tag}>`;
            currentTextarea.setRangeText(wrapped, start, end, 'end');
        }

        currentTextarea.focus();
        currentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        removePopup();
    };
}

function formatArtists(artists) {
    if (artists.length <= 1) return artists[0] || '';
    if (artists.length === 2) return `${artists[0]} & <i>${artists[1]}</i>`;
    return artists.map((a, i) => {
        if (i === 0) return a;
        if (i === 1) return `<i>${a}</i>`;
        return `<b>${a}</b>`;
    }).join(', ').replace(/, ([^,]*)$/, ' & $1');
}

function extractArtistsFromPage() {
    const mainArtists = [];
    const featuredArtists = [];

    const artistDiv = document.querySelector('[class*="ListArtists"]');
    if (artistDiv) {
        const links = artistDiv.querySelectorAll('a');
        links.forEach(link => {
            const name = link.textContent.trim().replace(/\s*\(.*?\)\s*/g, '');
            if (name && !mainArtists.includes(name)) {
                mainArtists.push(name);
            }
        });
    }

    const featElement = Array.from(document.querySelectorAll('div, span, p')).find(el =>
        el.textContent.trim() === 'Featuring'
    );

    if (featElement && featElement.parentElement) {
        const featLinks = featElement.parentElement.querySelectorAll('a');
        featLinks.forEach(link => {
            const name = link.textContent.trim().replace(/\s*\(.*?\)\s*/g, '');
            if (name && !featuredArtists.includes(name) && !mainArtists.includes(name)) {
                featuredArtists.push(name);
            }
        });
    }

    return { mainArtists, featuredArtists };
}

function insertSectionButtons() {
    if (sectionButtonsAdded) return;

    const interval = setInterval(() => {
        const saveBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Save' || btn.className.includes('SaveButton'));

        if (saveBtn) {
            clearInterval(interval);

            const moreBtn = Array.from(document.querySelectorAll('a, span, button')).find(el => {
                const text = el.textContent.trim().toLowerCase();
                return text === '... more' || /^\+\d+ more$/.test(text) || text.endsWith('more');
            });

            if (moreBtn) {
                moreBtn.click();
            }

            if (document.getElementById('genius-section-buttons')) return;

            const { mainArtists, featuredArtists } = extractArtistsFromPage();
            const allArtists = [...mainArtists, ...featuredArtists];
            const showArtistTags = allArtists.length > 1;

            const container = document.createElement('div');
            container.id = 'genius-section-buttons';

            const selectedArtists = new Set();

            if (showArtistTags) {
                const artistTagsContainer = document.createElement('div');
                artistTagsContainer.id = 'artist-tags-container';

                allArtists.forEach(name => {
                    const tag = document.createElement('div');
                    tag.className = 'artist-tag';
                    tag.innerText = name;
                    tag.addEventListener('click', () => {
                        if (selectedArtists.has(name)) {
                            selectedArtists.delete(name);
                            tag.classList.remove('selected');
                        } else {
                            selectedArtists.add(name);
                            tag.classList.add('selected');
                        }
                    });
                    artistTagsContainer.appendChild(tag);
                });

                container.appendChild(artistTagsContainer);
            }

            const sections = ['Giriş', 'Verse', 'Ön Nakarat', 'Nakarat', 'Arka Nakarat', 'Köprü', 'Çıkış', '?', 'Instrumental', 'Kesit'];

            sections.forEach(name => {
                const btn = document.createElement('button');
                btn.innerText = name;
                btn.addEventListener('click', () => {
                    const textarea = document.querySelector('textarea');
                    if (!textarea) return;

                    if (name === 'Kesit') {
                        const insertText = `<b>[Kesit şarkı sözleri, resmî sözler yayımlanınca güncellenecektir]</b>\n`;
                        const pos = textarea.selectionStart;
                        textarea.value = textarea.value.slice(0, pos) + insertText + textarea.value.slice(pos);
                        textarea.selectionStart = textarea.selectionEnd = pos + insertText.length;
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        return;
                    }

                    let sectionLabel = name;
                    const selected = Array.from(selectedArtists);

                    if (name !== '?' && name !== 'Instrumental') {
                        if (name === 'Verse') {
                            if (mainArtists.length === 1 && featuredArtists.length === 0 || selected.length === 0) {
                                sectionLabel += '';
                            } else {
                                sectionLabel += `: ${formatArtists(selected)}`;
                            }
                        } else if (selected.length > 0) {
                            sectionLabel += `: ${formatArtists(selected)}`;
                        }
                    }

                    const insertText = `\n[${sectionLabel}]\n`;
                    const cursorPos = textarea.selectionStart;
                    const value = textarea.value;

                    const before = value.slice(0, cursorPos).replace(/\s*$/, '');
                    const after = value.slice(cursorPos);
                    const newValue = before + insertText + after;
                    textarea.value = newValue;

                    const newCursorPos = before.length + insertText.length;
                    textarea.selectionStart = textarea.selectionEnd = newCursorPos;

                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                });
                container.appendChild(btn);
            });

            saveBtn.parentElement.insertBefore(container, saveBtn);
            sectionButtonsAdded = true;
        }
    }, 300);

    setTimeout(() => clearInterval(interval), 5000);
}

document.addEventListener("click", function (e) {
    const target = e.target;

    if (target && target.innerText.trim() === "Edit Lyrics") {
        setTimeout(() => {
            const textarea = document.querySelector('textarea');

            if (textarea && textarea.value.trim() === "") {
                const titleEl = document.querySelector('h1');
                const songTitle = titleEl ? titleEl.innerText.trim() : "Bu Şarkı";

                const { featuredArtists } = extractArtistsFromPage();

                let ftPart = "";
                if (featuredArtists.length > 0) {
                    if (featuredArtists.length === 1) {
                        ftPart = ` ft. ${featuredArtists[0]}`;
                    } else if (featuredArtists.length === 2) {
                        ftPart = ` ft. ${featuredArtists[0]} & ${featuredArtists[1]}`;
                    } else {
                        const allButLast = featuredArtists.slice(0, -1).join(', ');
                        const last = featuredArtists[featuredArtists.length - 1];
                        ftPart = ` ft. ${allButLast} & ${last}`;
                    }
                }

                textarea.value = `["${songTitle}"${ftPart} için şarkı sözleri]`;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }

            addStyle();
            handleFormatting(textarea);
            insertSectionButtons();
        }, 1000);
    }
});
    })();