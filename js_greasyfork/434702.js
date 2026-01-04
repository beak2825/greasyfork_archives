// ==UserScript==
// @name         Mark's Steam Script
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Adds info from and links to SteamDB and ProtonDB (Proton Linux compatibility)
// @author       Mark Snyder
// updateURL     https://raw.githubusercontent.com/mkwsnyder/marks-user-scripts/main/scripts/marks-steam-script/script.js
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434702/Mark%27s%20Steam%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/434702/Mark%27s%20Steam%20Script.meta.js
// ==/UserScript==

// made this in like 30 minutes so don't judge quality lol

(() => {
    'use strict';

    let $ = jQuery;

    const headerEl = document.querySelector('.apphub_HeaderStandardTop');

    // let steamID = location.href.match(/.*?store\.steampowered\.com\/app\/([0-9]*)/i)[1];
    let itemID = window.location.pathname.split('/')[2];
    let steamDBurl = `https://steamdb.info/app/${itemID}/`;
    let protonDBurlApi = `https://www.protondb.com/api/v1/reports/summaries/${itemID}.json`;
    let protonDBurl = `https://www.protondb.com/app/${itemID}`;

    let el = document.createElement('div');

    el.classList.add('apphub_OtherSiteInfo')
    el.style['margin-left'] = '1rem';

    el.innerHTML = `
<a class="btnv6_blue_hoverfade btn_medium" href="${steamDBurl}" target="_blank">
<span>View on SteamDB</span>
</a>
`;

    headerEl.insertBefore(el, document.querySelector('.apphub_HeaderStandardTop .apphub_OtherSiteInfo'));

    GM_xmlhttpRequest({
        method: "GET",
        url: protonDBurlApi,
        onload: (r) => {

            // console.log(r);

            let json;

            try {
                json = JSON.parse(r.responseText);
            } catch (e) {
                json = {};
            }

            let backgroundColor;
            let textColor = 'black';

            if (document.querySelector('[data-os="linux"]')) json.tier = 'native';

            switch(json.tier) {
                case 'native':
                    backgroundColor = 'green';
                    textColor = 'white;'
                    break;
                case 'platinum':
                    backgroundColor = 'rgb(180, 199, 220)';
                    break;
                case 'gold':
                    backgroundColor = 'rgb(207, 181, 59)';
                    break;
                case 'silver':
                    backgroundColor = 'rgb(192, 192, 192)';
                    break;
                case 'bronze':
                    backgroundColor = 'rgb(205, 127, 50)';
                    break;
                case 'borked':
                    backgroundColor = 'red';
                    break;
                default:
                    backgroundColor = 'gray'
                    json.tier = 'no info';
                    break;
            }

            let el = document.createElement('div')
            el.style['font-family'] = '"Abel", sans-serif';
            el.style['text-transform'] = 'uppercase';
            el.style['text-align'] = 'center';
            el.style['min-width'] = '187px';
            el.style['font-size'] = '22px';
            el.style.background = backgroundColor;
            el.style.color = textColor;
            el.style.padding = '3px 0';

            el.style['margin-left'] = '1rem';
            el.style.display = 'inline-block';

            el.innerHTML = `<span style="transform: scale(0.8, 1);">${json.tier}</span>`;


            document.querySelector('#appHubAppName').appendChild(el);
            el.outerHTML = `<a href="${protonDBurl}" target="_blank">${el.outerHTML}</a>`;
        }
    });

})();
