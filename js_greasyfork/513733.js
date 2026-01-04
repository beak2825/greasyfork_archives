// ==UserScript==
// @name         Hirstart Admin - GPT címke generátor OpenAI
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  A Hírstart admin "Hírenkénti CT" menüben segíti a szerkesztő munkáját az adott hír Kategória megállapításában az OpenAI segítségével. Az API kulcsot külső fájlból tölti be.
// @author       Virág Attila
// @match        https://admin.hirstart.hu/?news=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @connect      admin.hirstart.hu
// @connect      api.openai.com
// @downloadURL https://update.greasyfork.org/scripts/513733/Hirstart%20Admin%20-%20GPT%20c%C3%ADmke%20gener%C3%A1tor%20OpenAI.user.js
// @updateURL https://update.greasyfork.org/scripts/513733/Hirstart%20Admin%20-%20GPT%20c%C3%ADmke%20gener%C3%A1tor%20OpenAI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Globális változó az API kulcs tárolására
    let apiKey = null;

    // Engedélyezett címkék tömbje (konstans)
    const ALLOWED_TAGS = [
        "[hirdetés]", "Állatvilág", "Autó-motor", "Baleset-bűnügy", "Belföld", "Boksz", "Bulvár", "Cégvilág", "Divat", "Egészség", "Életmód", "Ezotéria-horoszkóp", "Film", "Foci", "Forma1", "Gaming", "Gazdaság", "Humor", "Időjárás", "Infotech", "Ingatlan", "Karácsony", "Karrier", "Kézilabda", "Kosárlabda", "Könyv", "Kultúra", "Külföld", "Média", "Megyei", "Mezőgazdaság", "Mobiltech", "Modern Gazdaság", "Olimpia", "Otthon", "Póker", "Recept", "Sport", "Sport gyorsulás", "Szex", "Színes", "Színpad", "Tudomány", "Utazás", "Választás", "Vélemény", "Vitorlás", "Vizes sport", "Vizes VB", "Vízilabda", "Zene"
    ];

    // Fájl URL
    const fileUrl = 'https://admin.hirstart.hu/file_manager/actions.php?action=download&directory=/hirdet%C3%A9s&file=dsfrewfgsgfdg564sdr.txt';

    // Fájl letöltése és API kulcs kinyerése
    function loadApiKey() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: fileUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const text = response.responseText;
                        const apiKeyMatch = text.match(/apiKey\s*=\s*'sk-[^']+'/);
                        if (apiKeyMatch) {
                            // Kivágjuk a kulcsot az egyezésből
                            apiKey = apiKeyMatch[0].split("'")[1];
                            // console.log('API Key sikeresen betöltve.'); // disabled verbose log
                            resolve(apiKey);
                        } else {
                            console.error('API Key nem található a fájlban.');
                            reject('API Key nem található a fájlban.');
                        }
                    } else {
                        console.error('Hiba a fájl letöltésekor:', response.statusText);
                        reject('Hiba a fájl letöltésekor: ' + response.statusText);
                    }
                },
                onerror: function(err) {
                    console.error('API kérés hiba:', err);
                    reject('API kérés hiba: ' + err);
                }
            });
        });
    }

    // Függvény a GPT ikon hozzáadásához
    function addGptIcons() {
        const rows = document.querySelectorAll('.x-grid3-row-table tbody tr');
        // console.log(`Talált sorok száma: ${rows.length}`); // disabled verbose log

        rows.forEach((row, index) => {
            // console.log(`Feldolgozás alatt: sor ${index + 1}`); // disabled verbose log
            const titleElement = row.querySelector('.x-grid3-col-2 a');
            const leadElement = row.nextElementSibling?.querySelector('.news-search-tr');
            const sourceElement = row.querySelector('.x-grid3-col-4');
            const cellInnerElement = row.querySelector('.x-grid3-td-6 .x-grid3-cell-inner');
            const targetDiv = cellInnerElement?.querySelector('div[qtip]');

            // console.log({ titleElement, leadElement, sourceElement, cellInnerElement, targetDiv }); // disabled verbose debug

            if (titleElement && leadElement && sourceElement && cellInnerElement && targetDiv) {
                const title = titleElement.textContent.trim();
                const lead = leadElement.textContent.trim();
                const source = sourceElement.textContent.trim();
                const sourceTag = targetDiv.getAttribute('qtip');

                if (!cellInnerElement.querySelector('.gpt-icon')) {
                    // GPT ikon létrehozása
                    const gptIcon = document.createElement('img');
                    gptIcon.src = 'https://img.icons8.com/?size=16&id=iGqse5s20iex&format=png'; // Ikon URL
                    gptIcon.style.cursor = 'pointer';
                    gptIcon.style.width = '16px';
                    gptIcon.style.height = '16px';
                    gptIcon.style.margin = '0';
                    gptIcon.style.padding = '0';
                    gptIcon.style.float = 'right';
                    gptIcon.style.background = 'white';
                    gptIcon.style.border = '1px solid #14B38B';
                    gptIcon.style.borderRadius = '5px';
                    gptIcon.style.position = 'relative';
                    gptIcon.title = 'OpenAI címkejavaslat';
                    gptIcon.classList.add('gpt-icon');
                    gptIcon.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const rect = gptIcon.getBoundingClientRect();
                        const anchorRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
                        if (apiKey) {
                            generateClickbaitTitle(title, lead, source, sourceTag, anchorRect);
                        } else {
                            alert('API kulcs még nem töltődött be. Kérjük, próbáld újra később.');
                        }
                    });

                    // Az ikon beszúrása közvetlenül a targetDiv elé
                    cellInnerElement.insertBefore(gptIcon, targetDiv);
                    // console.log(`GPT ikon beszúrva a sor ${index + 1} cellájába.`); // disabled verbose log
                }
            }
        });
    }

    // OpenAI API hívása
    // Optional `anchorRect` positions popups near where the user clicked
    function generateClickbaitTitle(title, lead, source, sourceTag, anchorRect) {
        if (!apiKey) {
            alert('API kulcs nincs beállítva.');
            return;
        }

        // Mutassunk betöltő animációt amíg az API dolgozik (pozícionálva ha van anchor)
        showLoadingPopup(anchorRect);

        const prompt =
              `Az alábbi hír címe és leadje alapján állapítsd meg, hogy ez a cikk ` +
              `milyen tematikába esik. A cím: "${title}". A lead: "${lead}". ` +
              `A híroldal: "${source}". A kapott tag: "${sourceTag}". ` +
              `Lehetőleg egy, maximum három szót adj vissza írásjel nélkül, ami a hírre jellemző hír tematika címke. ` +
              `Ha bizonytalan a válaszod vagy több tipped is lehet, akkor adj maximum három tippet, vesszővel tagolva. Az első szó legyen mindig a legrelevánsabb találat.` +
              `Válassz az alábbi listából (a zárójeles rész a kontextus, azt ne add vissza): ` +
              `[hirdetés] (hirdetés, reklám, nyereményjáték, PR cikk, (x)-szel vagy (X)-szel vagy [x]-szel vagy [X]-szel jelölt cikk, nyereményre buzdító cikk, ez a válasz magas priort élvez), ` +
              `Ha azt akarod visszaadni, hogy "Hirdetés", akkor így add vissza zárójellel: [hirdetés]. ` +
              `Állatvilág (aranyos kiscicák, lótartás, bálnák a parton), ` +
              `Autó-motor (autó teszt, motorosoknak, közlekedés, DE nem: balesetek, sem motorsport), ` +
              `Baleset-bűnügy (megölték, ellopta, felrobbant, szörnyű karambol), ` +
              `Belföld (közélet, pártok, hazai történések), ` +
              `Boksz (box mérkőzés), ` +
              `Bulvár (sztárvilág, celebek), ` +
              `Cégvilág (vállalatok, KKV szektor), ` +
              `Divat (smink és ruha, sztárdivat), ` +
              `Egészség (orvos válaszol, gyógyszeripar, 5 egészséges mozgástipp), ` +
              `Életmód (hogyan tartsd meg a párod, 10 tipp a szebb élethez), ` +
              `Ezotéria-horoszkóp, ` +
              `Film (filmajánlók, filmkritikák, mozi, DE nem: videóklippek, vicces videók), ` +
              `Foci (labdarúgás), ` +
              `Forma1 (F1, formula-1), ` +
              `Gaming (PC és egyéb elektronikus/szoftver-játék), ` +
              `Gazdaság, ` +
              `Humor (vicces dolgok), ` +
              `Időjárás (hazai időjárás, meteorológiai riasztások, DE nem: közlekedési balesetek), ` +
              `Infotech (számítógépes, IT, PC, notebook, hálózat, internet), ` +
              `Ingatlan (ingatlanpiac, lakáspiac), ` +
              `Karácsony (év végi ünnepek, advent), ` +
              `Karrier (HR, oktatás, képzés, munkaügy, DE nem: körömfestés oktató-videó), ` +
              `Kézilabda, ` +
              `Kosárlabda, ` +
              `Könyv (könyv, képregény, könyvkritika, könyvajánló, DE nem: viccek), ` +
              `Kultúra (művészet, irodalom, intellektuális programok), ` +
              `Külföld, ` +
              `Média (médiapiac, reklámpiac, marketingpiac), ` +
              `Mezőgazdaság (agrárium, gazda élet), ` +
              `Mobiltech (okostelefon, hordozható kütyük, GSM ipar, DE nem: ellopták a mobilját), ` +
              `Modern Gazdaság (bitcoin, kriptogazdaság, NFT, blokklánc, kripto-bányászat), ` +
              `Olimpia, ` +
              `Otthon (lakás, kert, luxus apartmanok, házi barkács tippek, DE nem: ingatlanpiac), ` +
              `Recept (gasztronómia, gasztrokultúra, receptek), ` +
              `Sport (sporthírek, DE nem: a focista feleségének keblei, DE nem: sportfogadás), ` +
              `Sport gyorsulás (rally, motorsport, sport, DE nem: F1), ` +
              `Szex (felnőtt erotikus tartalom), ` +
              `Színes, ` +
              `Színpad (színház, színpad, táncelőadás, DE nem: terrortámadás a színházban), ` +
              `Tudomány (kutatás, felfedezés, űrkutatás, csillagászat, MTA), ` +
              `Utazás (Balatoni tippek, csodás tájak), ` +
              `Választás (hazai választások, EP-választás), ` +
              `Vélemény (publicisztika, blog, véleményes megjegyzések), ` +
              `Vitorlás (vitorlázás, hajózás, motorcsónak), ` +
              `Vizes sport (vízben játszott sportjátékok), ` +
              `Vizes VB (vízilabda-világbajnokság), ` +
              `Vízilabda, ` +
              `Zene (zene, zenekarok, énekes előadók, DE nem: egyszer "éneklő" celeb).` +
              `A többi címke esetén a címkét add vissza nagy kezdőbetűvel.`;

        const data = {
            model: "gpt-4.1-mini", // a modell neve, pl.: "gpt-4o-mini"
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            data: JSON.stringify(data),
            onload: function(response) {
                // Az API válasza beérkezett: eltüntetjük a betöltő animációt és feldolgozzuk
                hideLoadingPopup();
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.choices && result.choices.length > 0) {
                        const responseText = result.choices[0].message.content.trim();

                        // Feldaraboljuk a választ: vesszők, pontosvesszők és sortörések szerint
                        const rawItems = responseText.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

                        // Normalizáló segédfüggvény (kisbetűs, zárójelek eltávolítása)
                        function normalize(s) {
                            return s.replace(/^[\[\]()\s]+|[\[\]()\s]+$/g, '').toLowerCase();
                        }

                        // Keresés az ALLOWED_TAGS-ban; ha egyezik, a pontos ALLOWED_TAGS elem kerül vissza
                        const matched = [];
                        rawItems.forEach(item => {
                            const norm = normalize(item);
                            for (const allowed of ALLOWED_TAGS) {
                                if (normalize(allowed) === norm) {
                                    if (!matched.includes(allowed)) matched.push(allowed);
                                    break;
                                }
                            }
                        });

                        if (matched.length > 0) {
                            showCopyableTitle(matched, anchorRect);
                        } else {
                            showNoMatchRetry(title, lead, source, sourceTag, anchorRect);
                        }

                    } else {
                        alert('Nincs eredmény az OpenAI API-tól');
                        console.error('Nincs eredmény az OpenAI API-tól', result);
                    }
                } catch (err) {
                    hideLoadingPopup();
                    alert('Hiba a válasz feldolgozása közben');
                    console.error('Hiba a válasz feldolgozása közben: ', err);
                }
            },
            onerror: function(err) {
                hideLoadingPopup();
                console.error('API kérés hiba: ', err);
                alert('API kérés hiba');
            }
        });
    }

    // Felugró ablak létrehozása a címkével/gombokkal és másolás gombbal
    // Elfogad egy tömböt: `titles` (a megjelenítendő, ALLOWED_TAGS szerint egyező elemek)
    function showCopyableTitle(titles, anchorRect) {
        if (typeof titles === 'string') titles = titles.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
        overlay.style.zIndex = '9999';

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        // If anchorRect provided, we'll position near that; otherwise center
        if (anchorRect && typeof anchorRect.left === 'number') {
            // temporary place at 0,0 then compute
            popup.style.left = '0px';
            popup.style.top = '0px';
        } else {
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
        }
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '10000';
        popup.style.borderRadius = '8px';
        popup.style.minWidth = '220px';

        const infoText = document.createElement('p');
        infoText.textContent = 'címkejavaslat';
        infoText.style.fontWeight = 'normal';
        infoText.style.textAlign = 'center';
        infoText.style.marginBottom = '10px';
        infoText.style.fontFamily = 'Arial, sans-serif';
        infoText.style.opacity = '0.35';
        popup.appendChild(infoText);

        titles.forEach((singleTitle) => {
            const copyButton = document.createElement('button');
            copyButton.textContent = singleTitle;
            copyButton.style.backgroundColor = '#007bff';
            copyButton.style.color = 'white';
            copyButton.style.border = 'none';
            copyButton.style.padding = '10px 20px';
            copyButton.style.fontSize = '16px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.marginTop = '10px';
            copyButton.style.marginRight = '5px';
            copyButton.style.borderRadius = '5px';
            copyButton.style.fontFamily = 'Arial, sans-serif';
            copyButton.style.display = 'block';
            copyButton.style.width = '100%';

            copyButton.addEventListener('mouseover', function() {
                copyButton.style.backgroundColor = '#0056b3';
            });
            copyButton.addEventListener('mouseout', function() {
                copyButton.style.backgroundColor = '#007bff';
            });

            copyButton.addEventListener('click', function() {
                GM_setClipboard(singleTitle);
                try { document.body.removeChild(popup); } catch (e) {}
                try { document.body.removeChild(overlay); } catch (e) {}
            });

            popup.appendChild(copyButton);
        });

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // If we have an anchorRect, position popup near it (adjust to viewport)
        if (anchorRect && typeof anchorRect.left === 'number') {
            placePopupNear(popup, anchorRect);
        }

        overlay.addEventListener('click', function() {
            try { document.body.removeChild(popup); } catch (e) {}
            try { document.body.removeChild(overlay); } catch (e) {}
        });
    }

    // Ha nincs egyezés: mutatunk egy egyszerű popupot csak egy 'Újra' gombbal.
    function showNoMatchRetry(title, lead, source, sourceTag, anchorRect) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
        overlay.style.zIndex = '9999';

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '10000';
        popup.style.borderRadius = '8px';
        popup.style.minWidth = '200px';

        const infoText = document.createElement('p');
        infoText.textContent = 'Nincs egyező címke a listán.';
        infoText.style.textAlign = 'center';
        infoText.style.marginBottom = '10px';
        popup.appendChild(infoText);

        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Újra';
        retryBtn.style.backgroundColor = '#14B38B';
        retryBtn.style.color = 'white';
        retryBtn.style.border = 'none';
        retryBtn.style.padding = '10px 20px';
        retryBtn.style.fontSize = '16px';
        retryBtn.style.cursor = 'pointer';
        retryBtn.style.borderRadius = '5px';
        retryBtn.style.display = 'block';
        retryBtn.style.margin = '0 auto';

        retryBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            try { document.body.removeChild(popup); } catch (err) {}
            try { document.body.removeChild(overlay); } catch (err) {}
            // Indítsuk újra a folyamatot ugyanazokkal az adatokkal
            generateClickbaitTitle(title, lead, source, sourceTag, anchorRect);
        });

        popup.appendChild(retryBtn);

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        if (anchorRect && typeof anchorRect.left === 'number') {
            placePopupNear(popup, anchorRect);
        }

        overlay.addEventListener('click', function() {
            try { document.body.removeChild(popup); } catch (e) {}
            try { document.body.removeChild(overlay); } catch (e) {}
        });
    }

    // Loading popup: egyszerű animáció amíg az API dolgozik
    let __gpt_loading_interval = null;
    function showLoadingPopup() {
        // Accept optional anchorRect as first arg (function overloaded)
        const anchorRect = arguments[0];
        if (document.getElementById('gpt-loading-popup-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'gpt-loading-popup-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.12)';
        overlay.style.zIndex = '9998';

        const popup = document.createElement('div');
        popup.id = 'gpt-loading-popup';
        popup.style.position = 'fixed';
        if (anchorRect && typeof anchorRect.left === 'number') {
            popup.style.left = '0px';
            popup.style.top = '0px';
        } else {
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
        }
        popup.style.padding = '14px 18px';
        popup.style.backgroundColor = 'white';
        popup.style.boxShadow = '0px 0px 8px rgba(0,0,0,0.25)';
        popup.style.zIndex = '9999';
        popup.style.borderRadius = '8px';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.fontSize = '14px';
        popup.style.color = '#333';

        // Create a small container with three emoji spans side-by-side
        const emojis = ['🧠', '🤔', '💭'];
        const emojiContainer = document.createElement('span');
        emojiContainer.style.display = 'inline-block';
        emojiContainer.style.fontSize = '18px';
        emojiContainer.style.letterSpacing = '8px';
        emojiContainer.style.paddingLeft = '2px';
        emojiContainer.style.paddingRight = '2px';

        const emojiSpans = [];
        for (let i = 0; i < 3; i++) {
            const s = document.createElement('span');
            s.textContent = emojis[i];
            s.style.display = 'inline-block';
            s.style.marginRight = '6px';
            emojiContainer.appendChild(s);
            emojiSpans.push(s);
        }

        popup.appendChild(emojiContainer);

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // If anchor specified, position near it
        if (anchorRect && typeof anchorRect.left === 'number') {
            placePopupNear(popup, anchorRect);
        }

        // Rotate the order of the three emoji spans so their sequence shifts
        let emojiIndex = 0;
        __gpt_loading_interval = setInterval(() => {
            emojiIndex = (emojiIndex + 1) % 3;
            try {
                // Display order: emojis[emojiIndex], emojis[(emojiIndex+1)%3], emojis[(emojiIndex+2)%3]
                for (let j = 0; j < 3; j++) {
                    emojiSpans[j].textContent = emojis[(emojiIndex + j) % 3];
                }
            } catch (e) {}
        }, 500);
    }

    function hideLoadingPopup() {
        if (__gpt_loading_interval) {
            clearInterval(__gpt_loading_interval);
            __gpt_loading_interval = null;
        }
        const popup = document.getElementById('gpt-loading-popup');
        const overlay = document.getElementById('gpt-loading-popup-overlay');
        try { if (popup) document.body.removeChild(popup); } catch (e) {}
        try { if (overlay) document.body.removeChild(overlay); } catch (e) {}
    }

    // Helper to place a popup near an anchor rect, keeping it inside the viewport
    function placePopupNear(popupEl, anchorRect) {
        try {
            const padding = 8;
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

            // Preferred coordinates: center above the anchor (if enough space), otherwise below
            const anchorCenterX = anchorRect.left + (anchorRect.width || 0) / 2;
            let preferTop = (anchorRect.top - 10); // slightly above

            // Measure popup (temporarily visible but offscreen) by removing transforms
            popupEl.style.left = '0px';
            popupEl.style.top = '-9999px';
            popupEl.style.transform = 'none';
            const rect = popupEl.getBoundingClientRect();
            const pw = rect.width;
            const ph = rect.height;

            // Compute left so popup centers horizontally on anchorCenterX
            let left = Math.round(anchorCenterX - pw / 2);
            // clamp to viewport
            left = Math.max(padding, Math.min(left, vw - pw - padding));

            // Try above
            let top = Math.round(preferTop - ph);
            // If not enough space above, place below the anchor
            if (top < padding) {
                top = Math.round(anchorRect.top + (anchorRect.height || 0) + 10);
                // If below would overflow, clamp
                if (top + ph > vh - padding) {
                    top = Math.max(padding, vh - ph - padding);
                }
            }

            popupEl.style.left = left + 'px';
            popupEl.style.top = top + 'px';
        } catch (e) {
            // fallback: center
            popupEl.style.left = '50%';
            popupEl.style.top = '50%';
            popupEl.style.transform = 'translate(-50%, -50%)';
        }
    }

    // MutationObserver figyeli a DOM változásait, hogy az új tartalmakat is feldolgozza
    const observer = new MutationObserver(() => {
        addGptIcons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // API kulcs betöltése és első futtatás
    loadApiKey()
        .then(() => {
            addGptIcons();
        })
        .catch((error) => {
            console.error(error);
            // Opcióként itt lehet tájékoztatni a felhasználót is
        });

})();