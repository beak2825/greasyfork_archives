// ==UserScript==
// @name         Marfeel Social report Facebook and Instagram post link repair
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces Facebook and Instagram links with the correct format on hub.marfeel.com/workspaces/*. If no anchor element is present, the link text is wrapped in a new anchor element.
// @match        https://hub.marfeel.com/workspaces/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marfeel.com
// @grant        none
// @author
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526652/Marfeel%20Social%20report%20Facebook%20and%20Instagram%20post%20link%20repair.user.js
// @updateURL https://update.greasyfork.org/scripts/526652/Marfeel%20Social%20report%20Facebook%20and%20Instagram%20post%20link%20repair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Függvény a Facebook és Instagram linkek javítására
    function fixSocialLinks() {
        document.querySelectorAll("span").forEach(span => {
            const text = span.textContent.trim();
            if (text.startsWith("https://www.facebook.com/") || text.startsWith("https://www.instagram.com/")) {
                const fixedUrl = text;
                const anchor = span.closest("a");
                if (anchor) {
                    // Ha már van <a> szülő, akkor csak módosítjuk a href attribútumot
                    anchor.href = fixedUrl;
                    console.log("Social post link replaced in existing anchor:", fixedUrl);
                } else {
                    // Ha nincs <a>, akkor létrehozunk egy újat és becsomagoljuk vele a span-t
                    const newAnchor = document.createElement("a");
                    newAnchor.href = fixedUrl;
                    // Opcionálisan megadhatjuk, hogy új lapon nyíljon a link:
                    newAnchor.target = "_blank";
                    // A span-t áthelyezzük az új <a> elem belsejébe
                    span.parentNode.insertBefore(newAnchor, span);
                    newAnchor.appendChild(span);
                    console.log("Social post link wrapped in new anchor:", fixedUrl);
                }
            }
        });
    }

    // Futtatás oldal betöltése után
    window.addEventListener('load', fixSocialLinks);

    // MutationObserver dinamikus tartalom kezeléséhez
    const observer = new MutationObserver(fixSocialLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
