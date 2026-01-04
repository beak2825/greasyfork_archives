// ==UserScript==
// @name         Hírstart admin - RSS partner csatorna megnyitása
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatikus navigáció URL paraméterek alapján: autoNav=true és pid érték. Várakozik, amíg a szükséges elemek láthatóvá válnak, majd egyszer lefut.
// @author       Sancho / Attila
// @match        https://admin.hirstart.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @license      hirstart.hu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528296/H%C3%ADrstart%20admin%20-%20RSS%20partner%20csatorna%20megnyit%C3%A1sa.user.js
// @updateURL https://update.greasyfork.org/scripts/528296/H%C3%ADrstart%20admin%20-%20RSS%20partner%20csatorna%20megnyit%C3%A1sa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Segédfüggvény a teljes egéresemény-szimulációhoz
    function simulateMouseClick(elem) {
        if (!elem) return;
        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            elem.dispatchEvent(event);
        });
    }

    // Függvény, ami megvizsgálja, hogy az elem látható-e
    function isVisible(elem) {
        return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
    }

    // URL paraméterek kiolvasása
    const params = new URLSearchParams(window.location.search);
    const autoNav = params.get('autoNav');
    const pid = params.get('pid');

    if (autoNav !== 'true' || !pid) {
        return;
    }
    console.log(`AutoNav aktiválva, pid: ${pid}`);

    // Első navigációs elem szelektora
    const firstSelector = '#ext-gen299 > div > li:nth-child(5) > ul > li:nth-child(5) > div';
    const firstInterval = setInterval(() => {
        const firstNavItem = document.querySelector(firstSelector);
        if (firstNavItem && isVisible(firstNavItem)) {
            clearInterval(firstInterval);
            console.log("Első navigációs elem megtalálva és látható, kattintás...");
            simulateMouseClick(firstNavItem);

            // Várjunk 500ms-t, hogy a menü animációja elinduljon,
            // majd keressük a második elemet a pid alapján
            setTimeout(() => {
                const secondSelector = `div[ext\\:tree-node-id="rss_partner_tree-partner-${pid}"] > div:nth-child(1) > img.x-tree-ec-icon.x-tree-elbow-plus`;
                const secondInterval = setInterval(() => {
                    const secondNavItem = document.querySelector(secondSelector);
                    if (secondNavItem && isVisible(secondNavItem)) {
                        clearInterval(secondInterval);
                        console.log("Második navigációs elem megtalálva és látható, kattintás...");
                        simulateMouseClick(secondNavItem);
                    }
                }, 100);
            }, 100);
        }
    }, 1000);
})();
