// ==UserScript==
// @name         Hírstart admin - Forrás zóna szerkesztő RSS csatorna megnyitása
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Az rss paraméter alapján generált elemre kattint 2500 ms után, majd a scrollable konténerben öt scroll lépést hajt végre ciklussal
// @author
// @match        https://admin.hirstart.hu/?open_panel=source_zone_editor&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @license      hirstart.hu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528294/H%C3%ADrstart%20admin%20-%20Forr%C3%A1s%20z%C3%B3na%20szerkeszt%C5%91%20RSS%20csatorna%20megnyit%C3%A1sa.user.js
// @updateURL https://update.greasyfork.org/scripts/528294/H%C3%ADrstart%20admin%20-%20Forr%C3%A1s%20z%C3%B3na%20szerkeszt%C5%91%20RSS%20csatorna%20megnyit%C3%A1sa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Csak akkor fut, ha az open_panel=source_zone_editor
    const params = new URLSearchParams(window.location.search);
    if (params.get('open_panel') !== 'source_zone_editor') return;

    // Az id paramétert figyelmen kívül hagyjuk, az rss alapján dolgozunk
    const rssParam = params.get('rss');
    if (!rssParam) return;

    // Az "rss-6" formátum előállítása (pl. rss=6 esetén)
    const rssString = `rss-${rssParam}`;

    // Függvény, amely megkeresi a scrollozható konténert az adott elemtől felfelé
    function getScrollableElement(el) {
        while (el) {
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
                return el;
            }
            el = el.parentElement;
        }
        return document.documentElement;
    }

    // Függvény a scrollozáshoz: növeli a scrollTop értéket
    function scrollDown(container, amount) {
        container.scrollTop += amount;
    }

    // 2500 ms után keressük meg a cél elemet és kattintunk rá
    setTimeout(() => {
        const targetDiv = document.querySelector(`[ext\\:tree-node-id="${rssString}"]`);
        if (!targetDiv) {
            console.warn(`Nem található elem az attribútummal: ${rssString}`);
            return;
        }
        const targetImg = targetDiv.querySelector('img.x-tree-ec-icon.x-tree-elbow-plus');
        if (!targetImg) {
            console.warn(`Nem található kattintható kép az elemben: ${rssString}`);
            return;
        }
        targetImg.click();
        console.log(`Kattintás végrehajtva az elemre: ${rssString}`);

        // Fókusz beállítása és a scrollozható konténer meghatározása
        window.focus();
        if (targetDiv.tabIndex < 0) targetDiv.tabIndex = 0;
        targetDiv.focus();
        const scrollableContainer = getScrollableElement(targetDiv);
        console.log('Scrollable container:', scrollableContainer);

        // 200 ms után ciklussal pár scroll lépést hajtunk végre (minden lépés 300 ms késleltetéssel, 100px-rel)
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                scrollDown(scrollableContainer, 100);
                console.log(`Scroll lépés ${i + 1}`);
            }, 200 + i * 300);
        }

    }, 2500);
})();
