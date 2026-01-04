// ==UserScript==
// @name         Chub Venus: Export MyCharacters to TSV
// @namespace    http://tampermonkey.net/
// @version      2024-04-04
// @description  Export basic character card stats to a TSV file.
// @author       charmquark
// @license      MIT
// @match        https://venus.chub.ai/my_characters
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chub.ai
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/491682/Chub%20Venus%3A%20Export%20MyCharacters%20to%20TSV.user.js
// @updateURL https://update.greasyfork.org/scripts/491682/Chub%20Venus%3A%20Export%20MyCharacters%20to%20TSV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        includeNSFW: true,
        includeNSFL: true,

        icon: '<span role="img" aria-label="user-add" class="anticon anticon-export-outlined"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="export" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 912H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32h360c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H184v656h656V520c0-4.4 3.6-8 8-8h56c4.4 0 8 3.6 8 8v360c0 17.7-14.3 32-32 32zM770.87 199.13l-52.2-52.2a8.01 8.01 0 014.7-13.6l179.4-21c5.1-.6 9.5 3.7 8.9 8.9l-21 179.4c-.8 6.6-8.9 9.4-13.6 4.7l-52.4-52.4-256.2 256.2a8.03 8.03 0 01-11.3 0l-42.4-42.4a8.03 8.03 0 010-11.3l256.1-256.3z"></path></svg></span>',
        labelId: 'X-ExportTSV-Label'
    };

    let enabled = false;
    let injected = false;
    let label = null;


    function action(event) {
        if (!enabled) return;
        enabled = false;
        label.innerText = ' Generating...';

        // fetch data
        let params = getFetchParams();
        fetch(params.url, params.init).then(response => response.json()).then(
            // success
            json => {
                console.log('[Export TSV] Received data, generating new export.');

                // make 'now' string in format: m/d/yyyy h:mm
                let now = new Date();
                now = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, 0)}`;

                // export TSV to clipboard and re-enable
                exportTSV(now, json.projects.nodes);
                label.innerText = 'TSV Exported: ' + now;
                enabled = true;
            },

            // failure
            reason => {
                // log error
                console.error('[Export TSV] Failed fetching data:');
                console.error(reason);

                // re-enable
                label.innerText = 'TSV export failed. Click again to retry.';
                enabled = true;
            }
        );
    }


    function exportTSV(now, data) {
        let tsv = [['id', 'date', 'name', 'chats', 'messages', 'public_chats', 'favorites', 'downloads'].join("\t")];
        for (const node of data) {
            if (node.projectSpace != 'characters') continue;
            tsv.push([node.id, now, node.name, node.nChats, node.nMessages, node.n_public_chats, node.n_favorites, node.starCount].join("\t"));
        }
        tsv = tsv.join("\n");
        GM_setClipboard(tsv);
        console.log('[Export TSV] Copied to clipboard.')
    }


    function getFetchParams() {
        let url = new URL('https://api.chub.ai/api/users/' + window.localStorage.USERNAME);
        url.searchParams.append('nsfw', config.includeNSFW);
        url.searchParams.append('nsfl', config.includeNSFL);
        url.searchParams.append('nocache', Math.random());
        return {
            url,
            init: {
                headers: {
                    'Access-Control-Allow-Credentials': 'True',
                    'Access-Control-Allow-Origin': '*',
                    'Ch-Api-Key': window.localStorage.URQL_TOKEN,
                    'Samwise': window.localStorage.URQL_TOKEN
                }
            }
        };
    }


    function injectFeature(sibling) {
        if (injected) return;

        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.className = sibling.className;
        button.style['margin-left'] = '1em';
        button.innerHTML = `${config.icon}<span id="${config.labelId}"> Generate TSV</span>`
        button.onclick = action;
        sibling.after(button);
        label = document.getElementById(config.labelId);

        injected = true;
        enabled = true;
    }


    // Wait for page to render, at least enough to have the first button available ('Create Character') then inject feature
    function waitForRender() {
        let sibling = document.getElementsByTagName('button')[0];
        if (sibling === undefined) {
            setTimeout(waitForRender, 300);
        } else {
            injectFeature(sibling);
        }
    }
    waitForRender();
})();