// ==UserScript==
// @name         MAL Classic List Notes Column
// @namespace    https://greasyfork.org/en/users/738914
// @version      1.2
// @description  Allows sorting by notes by moving them to a separate column.
// @author       iBreakEverything
// @license      Apache-2.0
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @icon         https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/484345/MAL%20Classic%20List%20Notes%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/484345/MAL%20Classic%20List%20Notes%20Column.meta.js
// ==/UserScript==

(function() {
    fixRows();
})();

function fixRows() {
    const SKIP_FIRST_ROWS = 3;
    const SKIP_LAST_ROWS = 1;

    const elems = document.querySelectorAll('tr');
    const lastRowElem = elems[SKIP_FIRST_ROWS].childElementCount - 1;

    for (let row = 0 + SKIP_FIRST_ROWS; row < elems.length - SKIP_LAST_ROWS; row++) {
        if (elems[row].childElementCount > 1) {
            const newRowElem = elems[row].children[lastRowElem].cloneNode(true);
            if (row === SKIP_FIRST_ROWS) {
                if (newRowElem.childElementCount > 1) {
                    newRowElem.children[1].remove();
                }
                const link = newRowElem.querySelector('a');
                link.href = link.href.replace('order=8', 'order=5');
                link.innerText = 'Notes';
            }
            else {
                const noteElem = elems[row].children[1].lastElementChild.cloneNode(true);
                noteElem.style.cssText = ''
                noteElem.firstElementChild.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 50px';
                noteElem.querySelector('a').innerHTML = 'Note'
                elems[row].children[1].lastElementChild.remove();
                newRowElem.innerHTML = '';
                newRowElem.appendChild(noteElem);
            }
            elems[row].appendChild(newRowElem);
        }
    }
}
