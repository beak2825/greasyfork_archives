// ==UserScript==
// @name         WaniKani Skip Lesson Button
// @namespace    tampermonkey
// @version      1.3.0
// @description  Lets you skip having to do the lesson for an item from its item page. Requires WKOF.
// @author       LupoMikti
// @match        https://www.wanikani.com/*
// @run-at       document-end
// @connect      api.wanikani.com
// @license      MIT
// @supportURL   https://community.wanikani.com/t/userscript-wk-lesson-cherry-picker/51835/34
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478852/WaniKani%20Skip%20Lesson%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/478852/WaniKani%20Skip%20Lesson%20Button.meta.js
// ==/UserScript==

// Modified from the WK lesson cherry picker script made by Alphaxion

(function() {
    'use strict';

    /* global wkof */
    /* eslint curly: off */

    const script_name = 'WaniKani Skip Lesson Button';
    if (!wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    const access_token_url = "https://www.wanikani.com/settings/personal_access_tokens";
    let level, page_type, item_text, learn_button, subject_id, assignment_id, settings;

    const modules = 'ItemData, Apiv2, Settings';

    const wkofTurboEventsScriptUrl = 'https://update.greasyfork.org/scripts/501980/1418426/Wanikani%20Open%20Framework%20Turbo%20Events.js';
    wkof.load_script(wkofTurboEventsScriptUrl, /* use_cache */ true)

    wkof.ready('TurboEvents').then(() => {
        const urlList = [wkof.turbo.common.locations.items_pages];
        wkof.turbo.on.common.urls(_init, urlList);
    });

    function _init() {
        wkof.include(modules);
        wkof.ready(modules).then(loadSettings).then(startup);
    }

    function loadSettings() {
        return wkof.Settings.load('wkslb',{apikey: 'none'}).then(function(data) {
            settings = wkof.settings.wkslb;

            if (wkof.settings.wklcp) {
                settings.apikey = wkof.settings.wklcp.apikey;
                wkof.Settings.save('wkslb');
            }
        });
    }

    function startup() {
        if(!checkForApiKey()) return;
        installCSS();
        createButtons(document.body);
    }

    function checkForApiKey() {
        if (settings.apikey === 'none') {
            let givenkey = prompt('WK Skip Lesson Button: Please enter a valid WaniKani API Key with permission to start assignments.');
            if (givenkey !== null && wkof.Apiv2.is_valid_apikey_format(givenkey)) {
                settings.apikey = givenkey;
                wkof.Settings.save('wkslb');
                return true;
            }
            return false;
        }
        return true;
    }

    function installCSS() {
        let style =
        `<style id="wkskiplessoncss">
            .page-header__icon--jisho {
                background-color: #707070;
                width: 3em;
                color: var(--color-text-dark, --color-text);
            }

            .page-header__icon--lesson {
                width: 6em;
                color: var(--color-text-dark, --color-text);
            }

            .page-header__icon--lesson.rad {
                background-color: var(--color-radical);
            }

            .page-header__icon--lesson.kan {
                background-color: var(--color-kanji);
            }

            .page-header__icon--lesson.voc {
                background-color: var(--color-vocabulary);
            }
        </style>`;

        document.head.insertAdjacentHTML('beforeend', style);
    }

    function getPageType(url) {
        if (url.includes(`wanikani.com/radicals`)) return `rad`;
        else if (url.includes(`wanikani.com/kanji`)) return `kan`;
        else if (url.includes(`wanikani.com/vocabulary`)) return `voc`;
        else return `other`;
    }

    function createButtons(body) {
        level = body.querySelector('.page-header__icon--level').innerHTML;
        page_type = getPageType(document.URL);
        switch (page_type) {
            case `rad`:
                item_text = body.querySelector('.page-header__title-text').innerHTML.toLowerCase();
                break;
            case `kan`:
                item_text = body.querySelector('.page-header__icon--kanji').innerHTML;
                break;
            case `voc`:
                item_text = body.querySelector('.page-header__icon--vocabulary').innerHTML;
                break;
            default:
                return;
        }

        // Bonus : add a link to jisho.org
        if (page_type !== `rad`) {
            const jisho_link = `https://jisho.org/search/${page_type === 'kan' ? item_text + '%23kanji' : item_text}`;
            if (!document.getElementById('jisho-search-button')) body.querySelector('.page-header__icon--level').insertAdjacentHTML('beforebegin',`<a id="jisho-search-button" class="page-header__icon page-header__icon--jisho" href="${jisho_link}">JISHO</a>`);
        }

        let config = {
            wk_items: {
                options: {assignments: true},
                filters: {
                    srs: 'init',
                    level: level
                }
            }
        };

        wkof.ItemData.get_items(config).then(function(items) {
            for (const item of items) {
                if ((item.object !== 'radical' && item.data.characters === item_text) ||
                    (item.object === 'radical' && item.data.slug === item_text)) {
                    subject_id = item.id;
                    buildSkipButton(body);
                    break;
                }
            }
        });
    }

    function buildSkipButton(body) {
        let page_header = body.querySelector('.page-header__prefix');
        if (!document.getElementById('wkskiplessonbtn')) page_header.insertAdjacentHTML('afterbegin',
            `<a id="wkskiplessonbtn" class="page-header__icon page-header__icon--lesson ${page_type}" href="javascript:void(0)">Skip Lesson</a>`);

        learn_button = document.getElementById('wkskiplessonbtn');
        learn_button.addEventListener('click', learnVocab);
    }

    async function learnVocab(ev) {
        let wkofoptions = {
            filters: {
                srs_stages: [0],
                levels: level
            }
        };

        let results = await wkof.Apiv2.fetch_endpoint('assignments', wkofoptions);
        let didRetry = false;

        for (const assignment of results.data) {
            if (assignment.data.subject_id === subject_id) {
                assignment_id = assignment.id;
                try {
                    sendLearnRequest(settings.apikey);
                } catch (error) {
                    didRetry = true;
                    sendLearnRequest(wkof.Apiv2.key);
                }
                break;
            }
        }

        function sendLearnRequest(key) {
            fetch(`https://api.wanikani.com/v2/assignments/${assignment_id}/start`, {
                method: 'PUT',
                headers: {
                    "Authorization": "Bearer " + key,
                    "Wanikani-Revision": "20170710"
                },
                body: {
                    "started_at": new Date().toISOString()
                }
            }).then(function(response) {
                if(response.status !== 200) {
                    if (!didRetry) throw 'Bad Request';
                    if(confirm(`WK API answered : ${response.status} ${response.statusText}\nDo you want to enter a different API key?`)) {
                        settings.apikey = 'none';
                        wkof.Settings.save('wkslb');
                        window.location.href = access_token_url;
                    }
                }
                else {
                    if (didRetry) {
                        settings.apikey = wkof.Apiv2.key;
                        wkof.Settings.save('wkslb');
                    }
                    learn_button.removeEventListener('click', learnVocab);
                    learn_button.remove();
                }
            });
        }
    }
})();