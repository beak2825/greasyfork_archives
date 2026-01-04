// ==UserScript==
// @name         Heros Detector Warzywniak
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  webhook na herosów
// @author       Zaroowa
// @match        *://*.margonem.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535504/Heros%20Detector%20Warzywniak.user.js
// @updateURL https://update.greasyfork.org/scripts/535504/Heros%20Detector%20Warzywniak.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentVersion = '1.14';
    const metadataUrl = 'https://greasyfork.org/scripts/535504-heros-detector-warzywniak.meta.js';

    function checkForUpdate() {
        fetch(metadataUrl)
            .then(response => response.text())
            .then(text => {
                const match = text.match(/@version\s+([^\n]+)/);
                if (match) {
                    const latestVersion = match[1].trim();
                    if (latestVersion !== currentVersion) {
                        const banner = document.createElement('div');
                        banner.style = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            background: #facc15;
                            color: #000;
                            padding: 10px 20px;
                            font-size: 14px;
                            font-family: sans-serif;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                            z-index: 9999;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        `;
    
                        banner.innerHTML = `
                            <span>🆕 Dostępna jest nowa wersja skryptu <strong>Heros Detector Warzywniak</strong>! (${latestVersion})</span>
                            <a href="https://greasyfork.org/pl/scripts/535504-heros-detector-warzywniak" target="_blank" style="
                                background: #1e40af;
                                color: white;
                                padding: 6px 12px;
                                border-radius: 4px;
                                text-decoration: none;
                                font-weight: bold;
                            ">Zaktualizuj teraz</a>
                        `;
    
                        document.body.appendChild(banner);
                    }
                } else {
                    console.error("Nie znaleziono wersji w metadanych.");
                }
            })
            .catch(err => console.error("Błąd sprawdzania wersji:", err));
    }

    // Sprawdzanie aktualizacji od razu po załadowaniu skryptu
    checkForUpdate();

    // --- Logika herosa ---

    const webhookUrl = "https://discord.com/api/webhooks/1337077935680520222/E1jtT7BpWwYB51EE9ZnHemS7OHkmEIctu7A3kXkPCYe1jE4BlWQ2pTPkm4-_IC-xKV3o";
    const allowedHeroes = [
        "Złodziej (51h)",
        "Zły Przewodnik (63w)",
        "Opętany Paladyn (74p)",
        "Piekielny Kościej (85w)",
        "Koziec Mąciciel Ścieżek (94m)",
        "Kochanka Nocy (102m)",
        "Książę Kasim (116b)",
        "Święty Braciszek (123b)",
        "Złoty Roger (135t)",
        "Baca bez łowiec (144h)",
        "Czarująca Atalia (157m)",
        "Obłąkany Łowca Orków (165w)",
        "Lichwiarz Grauhaz (177w)",
        "Viviana Nandin (185t)",
        "Mulher Ma (197b)",
        "Demonis Pan Nicości (210m)",
        "Vapor Veneno (227w)",
        "Dęborożec (242w)",
        "Tepeyollotl (260b)",
        "Negthotep Czarny Kapłan (271h)",
        "Młody Smok (282m)",
    ];

    const heroRoles = {
        "Złodziej": "<@&1292188443052478494>",
        "Zły Przewodnik": "<@&1292188362685546547>",
        "Opętany Paladyn": "<@&1292188233840726137>",
        "Piekielny Kościej": "<@&1292188161706823826>",
        "Koziec Mąciciel Ścieżek": "<@&1292188088591843449>",
        "Kochanka Nocy": "<@&1292188006802919484>",
        "Książę Kasim": "<@&1292187940063285370>",
        "Święty Braciszek": "<@&1292185101936889987>",
        "Złoty Roger": "<@&1292188520341045259>",
        "Baca bez łowiec": "<@&1292187863609380996>",
        "Czarująca Atalia": "<@&1292187495496155146>",
        "Obłąkany Łowca Orków": "<@&1292187539825754252>",
        "Lichwiarz Grauhaz": "<@&1292187725382029343>",
        "Viviana Nandin": "<@&1292184649761689600>",
        "Mulher Ma": "<@&1292185013345058816>",
        "Demonis Pan Nicości": "<@&1292184572334837810>",
        "Vapor Veneno": "<@&1292184520342241392>",
        "Dęborożec": "<@&1292184353811730585>",
        "Tepeyollotl": "<@&1292184293140856905>",
        "Negthotep Czarny Kapłan": "<@&1292184722784387175>",
        "Młody Smok": "<@&1292184056288776332>",
    };

    let notificationSent = false;

    function sendToDiscord(heroName, location, imageUrl) {
        const heroNameWithoutProfession = heroName.replace(/\s*\(\d+\w\)/, '');
        const heroPing = heroRoles[heroNameWithoutProfession] || "";

        const data = {
            content: heroPing,
            embeds: [{
                title: "🦸‍♂️ Znaleziono herosa!",
                description: `**Nazwa:** ${heroName}\n**Mapa:** ${location}`,
                color: 16776960,
                image: { url: imageUrl },
                footer: { text: "" }
            }]
        };

        fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) console.error("Błąd wysyłania:", response.statusText);
        });
    }

    const observer = new MutationObserver(() => {
        const heroPopup = document.querySelector('.heros-detector');
        if (heroPopup && !notificationSent) {
            const heroName = heroPopup.querySelector('.name-label')?.innerText || "Nieznany heros";
            const location = heroPopup.querySelector('.map-label')?.innerText || "Nieznana mapa";
            const imageElement = heroPopup.querySelector('img');
            const imageUrl = imageElement ? imageElement.src : null;

            // Sprawdzamy, czy URL obrazu nie zawiera 'chrome://favicon'
            if (imageUrl && !imageUrl.includes("chrome://favicon")) {
                if (allowedHeroes.includes(heroName)) {
                    sendToDiscord(heroName, location, imageUrl);
                    notificationSent = true;
                }
            } else {
                console.warn("Zignorowano niedostępny favicon lub URL", imageUrl);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
