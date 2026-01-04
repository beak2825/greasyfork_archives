// ==UserScript==
// @name         MyDealz Wochenvotes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatisiert 3 wöchentliche Votes
// @author       MD928835
// @match        https://www.mydealz.de/
// @match        https://www.mydealz.de/new
// @match        https://www.mydealz.de/hot
// @match        https://www.mydealz.de/heisseste
// @match        https://www.mydealz.de/deals
// @match        https://www.mydealz.de/deals-new
// @match        https://www.mydealz.de/gruppe/freebies
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      mydealz.de
// @downloadURL https://update.greasyfork.org/scripts/538638/MyDealz%20Wochenvotes.user.js
// @updateURL https://update.greasyfork.org/scripts/538638/MyDealz%20Wochenvotes.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // UserID-Validierung
    const getUserId = () => new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.mydealz.de/graphql",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": document.cookie.match(/xsrf_t=([^;]+)/)[1]
            },
            data: JSON.stringify({ query: "{ me { userId } }" }),
            onload: (r) => {
                try {
                    const uid = JSON.parse(r.responseText)?.data?.me?.userId;
                    console.log('UserID:', uid, 'Valid:', /^\d+$/.test(uid));
                    resolve(uid);
                } catch(e) {
                    resolve(null);
                }
            }
        });
    });

    const userId = await getUserId();
    if (!userId || isNaN(userId)) return;

    // KW-Prüfung
    const getCurrentWeek = () => {
        const d = new Date();
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(),0,1);
        return d.getFullYear() * 100 + Math.ceil((((d - yearStart) / 864e5) + 1)/7);
    };

    const currentWeek = getCurrentWeek();
    const storedWeek = parseInt(localStorage.getItem('md-wochenpunkte')) || 0;
    if (storedWeek >= currentWeek) {
        console.log('Bereits gevoted in KW', currentWeek % 100);
        return;
    }

    // Vote-Logik
    const threads = Array.from(document.querySelectorAll('article[id^="thread_"]'))
        .slice(0,3)
        .map(el => el.id.split('_')[1]);

    threads.forEach(threadId => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.mydealz.de/graphql",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": document.cookie.match(/xsrf_t=([^;]+)/)[1],
                "X-Request-Type": "application/vnd.pepper.v1+json"
            },
            data: JSON.stringify({
                query: `mutation castUpVote($threadId: ID!) {
                    castUpVote(id: $threadId) {
                        thread { threadId }
                    }
                }`,
                variables: { threadId }
            }),
            onload: () => console.log(`Vote für Thread ${threadId} erfolgreich`)
        });
    });

    localStorage.setItem('md-wochenpunkte', currentWeek.toString());
    console.log(`${threads.length} Votes in KW ${currentWeek % 100} gespeichert`);
})();
