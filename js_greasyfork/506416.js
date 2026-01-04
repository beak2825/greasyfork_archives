// ==UserScript==
// @name         TTR PowerUp
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  letsgo
// @author       skyfighteer
// @license      MIT
// @match        https://ttr.sze.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506416/TTR%20PowerUp.user.js
// @updateURL https://update.greasyfork.org/scripts/506416/TTR%20PowerUp.meta.js
// ==/UserScript==


setTimeout(_ => {
    console.log('running')
    const main = document.querySelectorAll('.v-data-table__wrapper')[0];
    if (!main) return;

    const mainTable = main.firstChild;

    // fix #1
    swapCredits(mainTable);
    // fix #2
    removeTooltips();
    // fix #3
    removeNumbers(mainTable);
    // fix #4
    clickToSelect(mainTable);
}, 3000)

function swapCredits(mainTable) {
    const creditsParent = mainTable.lastChild.lastChild.firstChild;
    const all = creditsParent.firstElementChild;
    const current = creditsParent.lastElementChild;
    const slash = current.previousSibling;

    all.before(current);
    all.before(slash);
}

function removeTooltips() {
    addGlobalStyle(`.v-tooltip__content { display: none !important; } `);
}

function removeNumbers(mainTable) {
    Array.from(mainTable.querySelectorAll('tr')).forEach(row => {
        const cell = row.firstElementChild;
        // keep total credits row
        if (cell.hasAttribute('colspan')) return;
        cell.remove();
    });
}

function clickToSelect(mainTable) {

    addGlobalStyle(`
    td[checked="true"] {
        background-color: orange !important;
    }
    td[checked="true"] a {
        color: white !important;
    }
    `)

    Array.from(mainTable.querySelectorAll('td[class="border"]')).forEach(cell => {
        // no popup on click (check is due to shitty comments)
        cell.style.cursor = "pointer";
        if (cell.firstChild instanceof HTMLElement) {
            cell.firstChild.style.pointerEvents = "none";
        }

        // hide checkbox
        cell.lastElementChild.style.display = "none";

        // replace checkbox functionality
        // todo: replace original func with dblclick
        cell.addEventListener('click', evt => {
            const input = cell.lastElementChild;
            input.click();

            if (input.checked) {
                cell.setAttribute('checked', true)
            } else {
                cell.setAttribute('checked', false)
            }

        })
    })
}


// helper

function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

