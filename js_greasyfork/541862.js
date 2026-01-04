// ==UserScript==
// @name         SteamGifts Auto-Join Button
// @namespace    https://www.steamgifts.com/
// @version      1.0
// @description  Adds a button to auto-join all visible giveaways
// @author       CapnJ
// @license      MIT
// @match        https://www.steamgifts.com/giveaways*
// @grant        GM_xmlhttpRequest
// @connect      steamgifts.com
// @downloadURL https://update.greasyfork.org/scripts/541862/SteamGifts%20Auto-Join%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/541862/SteamGifts%20Auto-Join%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function addAutoJoinButton() {
        const heading = document.querySelector('.page__heading');
        if (!heading || document.getElementById('autoJoinBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'autoJoinBtn';
        btn.textContent = '🎯 Auto-Join Giveaways';
        btn.style.marginLeft = '10px';
        btn.style.padding = '6px 12px';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';

        btn.onclick = async () => {
            btn.disabled = true;
            btn.textContent = 'Joining...';
            console.log('[AutoJoin] Starting...');

            const allGiveaways = [...document.querySelectorAll('.giveaway__row-outer-wrap')];
            const buttonY = btn.getBoundingClientRect().top + window.scrollY;

            const links = allGiveaways
                .filter(el => {
                    const elY = el.getBoundingClientRect().top + window.scrollY;
                    return elY > buttonY;
                })
                .map(el => el.querySelector('a.giveaway__heading__name')?.href)
                .filter(Boolean);

            for (const url of links) {
                await joinGiveaway(url);
                await delay(2000);
            }

            btn.textContent = '✅ Done!';
            console.log('[AutoJoin] Finished.');
        };

        heading.appendChild(btn);
        console.log('[AutoJoin] Button added.');
    }

    function joinGiveaway(url) {
        return new Promise(resolve => {
            console.log(`[AutoJoin] Fetching: ${url}`);
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: response => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const token = doc.querySelector('input[name="xsrf_token"]')?.value;
                    const code = doc.querySelector('input[name="code"]')?.value;
                    const alreadyEntered = doc.querySelector('.sidebar__entry-delete:not(.is-hidden)');

                    if (!token || !code) {
                        console.warn(`[AutoJoin] Skipping (missing token/code): ${url}`);
                        return resolve();
                    }

                    if (alreadyEntered) {
                        console.log(`[AutoJoin] Already entered: ${code}`);
                        return resolve();
                    }

                    console.log(`[AutoJoin] Joining: ${code}`);
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://www.steamgifts.com/ajax.php',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': token
                        },
                        data: `xsrf_token=${token}&do=entry_insert&code=${code}`,
                        onload: res => {
                            console.log(`[AutoJoin] Joined: ${code}`);
                            resolve();
                        },
                        onerror: () => {
                            console.error(`[AutoJoin] Failed to join: ${code}`);
                            resolve();
                        }
                    });
                },
                onerror: () => {
                    console.error(`[AutoJoin] Failed to fetch: ${url}`);
                    resolve();
                }
            });
        });
    }

    window.addEventListener('load', () => {
        setTimeout(addAutoJoinButton, 1000);
    });
})();
