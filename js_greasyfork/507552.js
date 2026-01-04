// ==UserScript==
// @name         JPDB WaniKani Toggle
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Adds a toggle to swap JPDB's meanings, radicals and mnemonics with WaniKani's
// @author       Philip "Frizzil" Guin
// @match        https://jpdb.io/review
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/507552/JPDB%20WaniKani%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/507552/JPDB%20WaniKani%20Toggle.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const wanikaniApiKey = 'YOUR_API_KEY';

    const originalData = {
        radicals: null,
        meanings: null,
        mnemonic: null,
    };
    let wanikaniData = null;

    function storeOriginalJpdbData() {
        originalData.radicals = $('div.subsection-composed-of-kanji .subsection').html();
        originalData.meanings = $('div.subsection').eq(-2).html();
        originalData.mnemonic = $('div.subsection').last().parent().html();
    }
    function loadData(data) {
        if (data.radicals) $('div.subsection-composed-of-kanji .subsection').html(data.radicals);
        if (data.meanings) $('div.subsection').eq(-2).html(data.meanings);
        if (data.mnemonic) $('div.subsection').last().parent().html(data.mnemonic);
    }

    async function fetchWanikaniData(kanji) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.wanikani.com/v2/subjects?slugs=${kanji}&types=kanji`,
                headers: {
                    'Authorization': `Bearer ${wanikaniApiKey}`,
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data && data.data && data.data.length > 0) {
                        resolve(data.data[0].data);
                    } else {
                        reject(new Error(`No data found for kanji: ${kanji}`));
                    }
                },
                onerror: function(err) {
                    reject(new Error(`Failed to fetch WaniKani data for ${kanji}: ${err}`));
                }
            });
        });
    }
    async function fetchWanikaniSubjectById(subjectId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.wanikani.com/v2/subjects/${subjectId}`,
                headers: {
                    'Authorization': `Bearer ${wanikaniApiKey}`,
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data && data.data) {
                        resolve(data.data);
                    } else {
                        reject(new Error(`No data found for subject ID: ${subjectId}`));
                    }
                },
                onerror: function(err) {
                    reject(new Error(`Failed to fetch WaniKani subject for ID ${subjectId}: ${err}`));
                }
            });
        });
    }


    async function initWanikaniData(kanjiSlug) {
        const kanji = await fetchWanikaniData(kanjiSlug);

        const componentIds = kanji.component_subject_ids;
        const subjectMap = {};
        if (componentIds && componentIds.length > 0) {
            for (const subjectId of componentIds) {
                subjectMap[subjectId] = await fetchWanikaniSubjectById(subjectId);
            }
        }
        wanikaniData = {
            meanings: null,
            mnemonic: null,
            radicals: null,
        }

        wanikaniData.meanings = kanji.meanings
            .filter(x => !x.hidden)
            .map(x => x.meaning.toLowerCase())
            .join(', ');

        const meaningMnemonic = kanji.meaning_mnemonic;
        const meaningHint = kanji.meaning_hint || '';
        const wkUrl = kanji.document_url;

        const meaningMnem2 = meaningMnemonic
            .replaceAll('<radical>', '<strong>').replaceAll('</radical>', '</strong>')
            .replaceAll('<kanji>', '<em><strong>').replaceAll('</kanji>', '</strong></em>');

        wanikaniData.mnemonic = `
            <h6 class="subsection-label">
              <a href="${wkUrl}" target="_blank">WaniKani</a>
            </h6>
            <div class="subsection">
              <div class="mnemonic">
                <p>${meaningMnem2}</p>
                ${meaningHint ? `<p><b>Hint:</b> ${meaningHint}</p>` : ''}
              </div>
            </div>`;

        let radicalsHtml = '';
        for (const subjectId of componentIds) {
            const subject = subjectMap[subjectId];

            const subjectCharacters = subject.characters || subject.slug;
            const subjectMeaning = subject.meanings.find(m => m.primary).meaning.toLowerCase();
            const subjectUrl = subject.document_url;

            radicalsHtml += `
                        <div>
                            <div class="spelling">
                                <a class="plain" href="${subjectUrl}" target="_blank">${subjectCharacters}</a>
                            </div>
                            <div class="description">${subjectMeaning}</div>
                        </div>`;
        }
        wanikaniData.radicals = radicalsHtml;
    }

    let showWaniKani = localStorage.getItem('showWaniKani') === 'true'; // Read persisted

    async function toggleWanikani() {
        if (showWaniKani) {
            if (!wanikaniData) {
                const link = $('a.kanji.plain').first();
                const kanjiSlug = link.attr('href').split('/')[2]; // after second slash in url
                await initWanikaniData(kanjiSlug);
            }
            loadData(wanikaniData);
        } else {
            loadData(originalData);
        }
    }

    function addToggleButton() {
        const toggleButton = $('<a class="nav-item" href="#">Toggle WaniKani</a>');
        $('.menu-btn').before(toggleButton); // Insert before the .menu-btn

        toggleButton.on('click', async function(event) {
            event.preventDefault();
            showWaniKani = !showWaniKani;
            localStorage.setItem('showWaniKani', showWaniKani); // Persist the state
            toggleWanikani();
        });
    }

    $(document).ready(function() {
        storeOriginalJpdbData();
        addToggleButton();
        if (showWaniKani) toggleWanikani();
    });
})();
