// ==UserScript==
// @name         Obelisk Boons Display
// @description  Inserts images below selections
// @version      2025.09.16
// @license      GNU GPLv3
// @match        https://www.neopets.com/prehistoric/battleground/
// @author       Posterboy
// @namespace    https://youtube.com/@Neo_PosterBoy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @grant        GM_xmlhttpRequest
// @connect      images.neopets.com
// @downloadURL https://update.greasyfork.org/scripts/524389/Obelisk%20Boons%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/524389/Obelisk%20Boons%20Display.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const factionBoons = {
        'Brute': [
            'doppelganger_y2g78rgu',
            'equipall_th54u28g',
            'grrraaaahhhhhh_q5g48y9v',
            'rightround_eh938urw',
            'scratchmaster_43hu98n9'
        ],
        'Order': [
            'cartogriphication_bhjei43v',
            'doctorwho_iy98der8',
            'doppelganger_y2g78rgu',
            'doublebubble_a45h9i3r',
            'refreshquest_bh3y98ur'
        ],
        'Seekers': [
            'bankbribery_o34y928v',
            'booksmarts_0y7u4erw',
            'doctorwho_iy98der8',
            'rightround_eh938urw',
            'strengthmind_g459ub47'
        ],
        'Sway': [
            'bankbribery_o34y928v',
            'blackmarket_q54xw47c',
            'cheaperdozen_p4h2tuv6',
            'refreshquest_bh3y98ur',
            'millionairefeeling_z34yue5y'
        ],
        'Thieves': [
            'cheaperdozen_p4h2tuv6',
            'doppelganger_y2g78rgu',
            'fivefinger_uy68huy1',
            'lolavies_u347qr2i',
            'scratchmaster_43hu98n9'
        ],
        'Awakened': [
            'unknown',
            'numbers',
        ]
    };

    function createDisplay(faction) {
        const displayDiv = document.createElement('div');
        displayDiv.className = 'item-display';
        displayDiv.style.marginTop = '10px';

        const boonSlugs = factionBoons[faction] || [];

        boonSlugs.forEach((slug, index) => {
            const isUnknown = slug === 'unknown' || slug === 'numbers';

            const thumbURL = isUnknown
                ? `https://images.neopets.com/charity/2017/${slug}.gif`
                : `https://images.neopets.com/prehistoric/obelisk/${slug}/thumb.png`;

            const titleURL = isUnknown
                ? `https://images.neopets.com/prehistoric/outskirts/numbers.png`
                : `https://images.neopets.com/prehistoric/obelisk/${slug}/title.png`;

            const imageUrls = [thumbURL, titleURL];

            imageUrls.forEach((imageUrl) => {
                const img = document.createElement('img');
                img.alt = `${faction} Image ${index + 1}`;
                img.style.width = '180px';
                img.style.display = 'block';
                img.style.margin = '0 auto 8px';
                displayDiv.appendChild(img);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        img.src = URL.createObjectURL(response.response);
                    },
                    onerror: function() {
                        console.error('Failed to load image:', imageUrl);
                        img.src = imageUrl;
        }});});});

        const textDiv = document.createElement('div');
        textDiv.textContent = `Boons if ${faction} wins`;
        textDiv.style.textAlign = 'center';
        textDiv.style.fontWeight = 'bold';
        textDiv.style.marginTop = '10px';
        displayDiv.appendChild(textDiv);

        return displayDiv;
    }

    function processListItems() {
        const listItems = document.querySelectorAll('li');

        listItems.forEach((li) => {
            Object.keys(factionBoons).forEach((faction) => {
                if (li.innerHTML.includes(faction)) {
                    const display = createDisplay(faction);
                    li.appendChild(display);
    }});});}

    window.addEventListener('load', processListItems);
})();
