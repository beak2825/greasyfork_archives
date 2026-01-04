// ==UserScript==
// @name         Nexus Clash Improved Character Select (B4)
// @namespace    https://roadha.us
// @version      0.2
// @description  Adds colored resource bars and highlights characters according to certain conditions
// @author       haliphax
// @match        https://www.nexusclash.com/modules.php?name=Game*
// @downloadURL https://update.greasyfork.org/scripts/410838/Nexus%20Clash%20Improved%20Character%20Select%20%28B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410838/Nexus%20Clash%20Improved%20Character%20Select%20%28B4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let headers = document.querySelectorAll('center > h2'),
        isSelectScreen = false;

    for (let i = 0; i < headers.length; i++) {
        if (headers[i].innerText.trim().startsWith('Welcome')) {
            isSelectScreen = true;
            break;
        }
    }

    if (!isSelectScreen) return;

    let columnHeaders = document.querySelectorAll('th');
    var characterTable = null;

    for (let i = 0; i < columnHeaders.length; i++) {
        if (columnHeaders[i].innerText.trim() == 'Character') {
            characterTable = columnHeaders[i].parentNode.parentNode.parentNode;
            break;
        }
    }

    if (characterTable === null) {
        console.warn('Could not find character table');
        return;
    }

    let characters = Array.from(characterTable.children[0].children)
        .filter((el, idx, arr) => idx > 0 && idx < arr.length - 1);

    for (let i = 0; i < characters.length; i++) {
        let row = characters[i],
            apCell = row.children[2],
            apString = apCell.innerText.trim(),
            apSplit = apString.indexOf('/'),
            hpCell = row.children[3],
            hpString = hpCell.innerText.trim(),
            hpSplit = hpString.indexOf('/'),
            mpCell = row.children[4],
            mpString = mpCell.innerText.trim(),
            mpSplit = mpString.indexOf('/'),
            char = {
                ap: apString.substring(0, apSplit),
                apMax: apString.substring(apSplit + 1),
                hp: hpString.substring(0, hpSplit),
                hpMax: hpString.substring(hpSplit + 1),
                mp: mpString.substring(0, mpSplit),
                mpMax: mpString.substring(mpSplit + 1)
            };

        [apCell, hpCell, mpCell].forEach((cell) => {
            let img = null,
                op1 = null,
                op2 = null;

            switch (cell) {
                case apCell:
                    img = 'ap';
                    op1 = char.ap;
                    op2 = char.apMax;
                    break;
                case hpCell:
                    img = 'hp';
                    op1 = char.hp;
                    op2 = char.hpMax;
                    break;
                case mpCell:
                    img = 'mp';
                    op1 = char.mp;
                    op2 = char.mpMax;
                    break;
            }

            let pct = Math.min(100, Math.max(0, op1 / op2 * 100));

            cell.classList.add('stat-bar');

            if (pct === 0) {
                cell.classList.add('empty');
            }
            else {
                cell.style = 'background-size: ' + pct + '% 100%; background-image: url(/images/g/' + img + '-bar.png);';

                if (pct === 100) cell.classList.add('full');
            }
        });
    }

    let css = document.createElement('style');

    css.innerText = `
        .stat-bar { background-repeat: no-repeat; background-position: left top; text-align: center; padding: .5em; }
        .stat-bar.full { font-weight: bold; }
        .stat-bar.empty { color: #900; font-weight: bold; }
    `;
    document.head.appendChild(css);
})();