// ==UserScript==
// @name         TBF přepis odkazů v prvku
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Pravidelně přepisuje href odkazy ve .sw-ff-container na stránkách tbf.org.tr a lnbp.mx do zdrojového API Atrium Sports.
// @author       LM + JV
// @match        https://*.tbf.org.tr/*
// @match        https://*.lnbp.mx/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532120/TBF%20p%C5%99epis%20odkaz%C5%AF%20v%20prvku.user.js
// @updateURL https://update.greasyfork.org/scripts/532120/TBF%20p%C5%99epis%20odkaz%C5%AF%20v%20prvku.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ Userscript běží na:", location.hostname, location.href);

    const processedLinks = new Set();

    // mapování doména → embedId
    const EMBED_BY_HOST = {
        'tbf.org.tr': '106',
        'www.tbf.org.tr': '106',
        'lnbp.mx': '14',
        'www.lnbp.mx': '14'
    };

    const embedId = EMBED_BY_HOST[location.hostname];
    if (!embedId) {
        console.warn("⚠️ Pro tuto doménu nemám nastavené embedId:", location.hostname);
    } else {
        console.log("Používám embedId =", embedId);
    }

    const processLinks = () => {
        const container = document.querySelector('.sw-ff-container');
        console.log("processLinks: container =", container);

        if (!container) return;

        const links = container.querySelectorAll('a[href]');
        console.log("processLinks: nalezeno odkazů =", links.length);

        links.forEach(link => {
            const originalHref = link.getAttribute("href") || "";
            if (processedLinks.has(link)) return;

            if (originalHref.includes("statistics.html?%7Ew=f%7E")) {
                const newHref = originalHref.replace(
                    "statistics.html?%7Ew=f%7E",
                    `https://eapi.web.prod.cloud.atriumsports.com/v1/embed/${embedId}/fixture_detail?state=`
                );
                console.log("✅ přepis odkazu:", originalHref, "➡️", newHref);
                link.setAttribute("href", newHref);
                processedLinks.add(link);
            } else {
                console.log("ℹ️ odkaz nesedí s patternem:", originalHref);
            }
        });
    };

    // spouštíme každé 2 vteřiny
    setInterval(processLinks, 2000);
})();
