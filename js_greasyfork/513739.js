// ==UserScript==
// @name         Hírstart Admin - Forrás zóna szerkesztő extra
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Checkbox handler for expanded divs in Hírstart Source Zone Editor (Filtered to x-tree-node-ct)
// @author       Virág Attila
// @match        https://admin.hirstart.hu/?open_panel=source_zone_editor&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @grant        none
// @license      hirstart.hu
// @connect      admin.hirstart.hu
// @downloadURL https://update.greasyfork.org/scripts/513739/H%C3%ADrstart%20Admin%20-%20Forr%C3%A1s%20z%C3%B3na%20szerkeszt%C5%91%20extra.user.js
// @updateURL https://update.greasyfork.org/scripts/513739/H%C3%ADrstart%20Admin%20-%20Forr%C3%A1s%20z%C3%B3na%20szerkeszt%C5%91%20extra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isToggling = false; // Zászló a rekurzió elkerülésére
    const observedDivs = new Set(); // Megfigyelt elemek nyilvántartása

    // Megfigyelő létrehozása a DOM változások figyelésére (nyitás/zárás)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                handleDivChange(mutation.target);
            }
        });
    });

    // Minden div megfigyelése, hogy ha változik az osztályuk (pl. nyitás/zárás)
    function observeDivs() {
        document.querySelectorAll('.x-tree-node-ct .x-tree-node-el').forEach((div) => {
            if (!observedDivs.has(div)) {
                observer.observe(div, { attributes: true, childList: true, subtree: true });
                observedDivs.add(div);
            }
        });
    }

    // Kezeli a nyitott és becsukott div-eket
    function handleDivChange(div) {
        if (div.classList.contains('x-tree-node-expanded')) {
            addHeaderCheckbox(div);
        } else if (div.classList.contains('x-tree-node-collapsed')) {
            removeHeaderCheckbox(div);
        }
    }

    // Fejléc checkbox hozzáadása a 3. oszlophoz és a ".ze-tree-center" osztály hozzáadása
    function addHeaderCheckbox(div) {
        const headerCol = div.querySelectorAll('.x-tree-col')[2]; // 3. oszlop
        if (headerCol && !headerCol.querySelector('input[type="checkbox"]')) { // Ha még nincs checkbox
            const headerCheckbox = document.createElement('input');
            headerCheckbox.type = 'checkbox';
            headerCheckbox.style.margin = '0 19px';
            headerCheckbox.style.outline = '2px solid red';
            headerCheckbox.addEventListener('change', () => {
                if (!isToggling) {
                    toggleCheckboxes(div, headerCheckbox.checked);
                }
            });

            // Skip adding checkbox for elements matching the specific pattern
            if (!shouldSkipCheckbox(headerCol)) {
                headerCol.appendChild(headerCheckbox);
            }
        }
    }

    // Meghatározza, hogy ki kell-e hagyni a checkbox hozzáadását
    function shouldSkipCheckbox(headerCol) {
        const skipPattern = '#ext-gen927 > div > li:nth-child(1) > ul > li > div > div:nth-child(3) > input[type="checkbox"]';
        return headerCol.matches(skipPattern);
    }

    // Fejléc checkbox eltávolítása a bezáráskor
    function removeHeaderCheckbox(div) {
        const headerCol = div.querySelectorAll('.x-tree-col')[2]; // 3. oszlop
        const headerCheckbox = headerCol.querySelector('input[type="checkbox"]');
        if (headerCheckbox) {
            headerCheckbox.remove();
        }
    }

    // Az összes checkbox beállítása a div-en belül
    function toggleCheckboxes(div, checked) {
        if (isToggling) return; // Ha már toggling folyamatban van, kilépünk

        isToggling = true; // Beállítjuk a zászlót

        try {
            const checkboxes = div.parentElement.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked !== checked) { // Csak akkor állítjuk be, ha szükséges
                    checkbox.checked = checked;

                    // Események kiváltása a mentés gomb aktiválásához
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                }
            });
        } finally {
            isToggling = false; // Visszaállítjuk a zászlót
        }
    }

    // Kezdeti megfigyelés
    observeDivs();

    // Időnként új div-ek megfigyelése (ha új div-ek kerülnének be)
    setInterval(observeDivs, 2000);

})();