// ==UserScript==
// @name         GGn Report OST 320 With FLAC
// @version      1.0.2
// @description  Adds "Trump 320 with FLAC" button inline for MP3 320 in OST torrents if FLAC is available
// @author       SleepingGiant
// @namespace    https://greasyfork.org/users/1395131
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542432/GGn%20Report%20OST%20320%20With%20FLAC.user.js
// @updateURL https://update.greasyfork.org/scripts/542432/GGn%20Report%20OST%20320%20With%20FLAC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TRUMP_REASON = "MP3@320 trumped by FLAC: Rule 4.2.5";
    const CATEGORY_NAME = "OST Information";

    const groupCategory = document.querySelector("#group_nofo_bigdiv > div.head > strong")?.textContent?.trim();
    if (groupCategory !== CATEGORY_NAME) return;

    const editionTables = document.querySelectorAll("tbody[id^='edition_']");

    editionTables.forEach(tbody => {
        const rows = [...tbody.querySelectorAll("tr.group_torrent")];

        const torrents = rows.map(tr => {
            const id = tr.id.match(/torrent(\d+)/)?.[1];
            const tds = tr.querySelectorAll("td");
            const titleLink = tds[0]?.querySelectorAll("a");
            const displayLink = [...titleLink].find(a => a.textContent.includes("[MP3, 320") || a.textContent.includes("[FLAC, Lossless"));
            const titleText = displayLink?.textContent || "";

            return {
                tr,
                id,
                displayLink,
                titleText,
                isFLAC: /\[.*FLAC.*Lossless.*\]/i.test(titleText),
                is320: /\[.*320.*\]/i.test(titleText),
            };
        });

        const flac = torrents.find(t => t.isFLAC);
        const mp3s320 = torrents.filter(t => t.is320 && t.displayLink);

        if (flac && mp3s320.length) {
            mp3s320.forEach(mp3 => {
                mp3.tr.style.backgroundColor = "#8b000033";

                const btn = document.createElement("button");
                btn.textContent = "Trump 320 with FLAC";
                btn.style.marginLeft = "10px";
                btn.style.fontSize = "0.8em";

                btn.onclick = async (e) => {
                    e.preventDefault();
                    btn.disabled = true;
                    btn.textContent = "Reporting...";

                    const formData = new FormData();
                    formData.set('submit', 'true');
                    formData.set('torrentid', mp3.id);
                    formData.set('categoryid', '4');
                    formData.set('id_token', `${Date.now()}`);
                    formData.set('type', 'trump');
                    formData.set('sitelink', `https://gazellegames.net/torrents.php?torrentid=${flac.id}`);
                    formData.set('extra', TRUMP_REASON);

                    try {
                        const response = await fetch('/reportsv2.php?action=takereport', {
                            method: 'POST',
                            body: formData,
                        });

                        if (response.ok && response.redirected) {
                            btn.textContent = "Reported ✓";
                            btn.style.backgroundColor = '#00640033';
                        } else {
                            throw new Error();
                        }
                    } catch {
                        btn.textContent = "Failed ❌";
                        btn.style.backgroundColor = '#f0d0d033';
                    }
                };

                // Inject button after the title link. A bit hacky but looks nicer
                mp3.displayLink?.insertAdjacentElement('afterend', btn);
            });
        }
    });
})();
