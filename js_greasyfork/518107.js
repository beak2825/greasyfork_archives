// ==UserScript==
// @name         LostSectorFlatten
// @namespace    https://x.com/Tescostum/
// @version      2024-11-20g
// @description  GameWidthのロストセクターの攻略内容にあるテーブルを縦に整列します
// @author       KBT
// @match        https://gamewith.jp/nikke/article/show/376187
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamewith.jp
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518107/LostSectorFlatten.user.js
// @updateURL https://update.greasyfork.org/scripts/518107/LostSectorFlatten.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        const sectors = document.querySelectorAll("div.sector");
        convertSectorTalbeToDiv(Array.from(sectors));
    }

    function convertSectorTalbeToDiv(sectors) {
        if(!sectors) return;
        console.log(sectors);
        sectors.forEach(elm => {
            const table = elm.querySelector('table');
            if(!table) return;
            const tbody = table.querySelector('tbody');
            const parentDiv = document.createElement('div');
            let count = 0;
            tbody.querySelectorAll('tr').forEach((row, index, array) => {
                row.childNodes.forEach(cell => {
                    const newElements = newElementsForSectorDiv(cell, count);
                    if(newElements) parentDiv.appendChild(newElements);

                    if(cell.tagName === 'TH') count++;
                });

            });

            replaceTableToDiv(parentDiv, table);
        });
    }

    function newElementsForSectorDiv(cell, count=0) {
        if(cell.tagName === 'TH') {
            const newP = document.createElement('p');
            newP.innerHTML = `▼${count+1}`;
            return newP;
        } else {
            const imgTag = cell.querySelector('img');
            if(!imgTag) {
                const newDiv = document.createElement('div');
                newDiv.innerHTML = cell.innerHTML;
                return newDiv;
            } else {
                const newImg = document.createElement('img');
                newImg.src = imgTag.dataset.original;
                newImg.loading = 'lazy';
                newImg.width = 710;
                return newImg;
            }
        }
        return null;
    }

    function replaceTableToDiv(parent, table) {
        table.parentNode.replaceChild(parent, table);
    }

    main();
})();