// ==UserScript==
// @name         BTN Subtitle Flags (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Adds subtitle flags to each torrent with improved visuals.
// @author       RaeLynn
// @match        https://broadcasthe.net/torrents.php?id=*
// @icon         https://broadcasthe.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531945/BTN%20Subtitle%20Flags%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531945/BTN%20Subtitle%20Flags%20%28Enhanced%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var languages = {
        'Arabic': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ae.png',
        'Bengali': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/Bengali.jpg',
        'Bulgarian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/bg.png',
        'Basque': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/es-pv.png' ,
        'Catalan': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/es-ct.png',
        'Czech': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/cz.png',
        'Chinese': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/cn.png',
        'Chinese (Simplified)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/cn.png',
        'Chinese (Traditional)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/cn.png',
        'Chinese (Cantonese)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/hk.jpg',
        'Chinese (HK)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/hk.jpg',
        'Cantonese': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/hk.jpg',
        'Chinese (Taiwan)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/cn.ta.png',
        'Croatian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/hr.png',
        'Danish': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/dk.png',
        'Dutch': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/nl.png',
        'English': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/us.png',
        'English (US)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/us.png',
        'English (GB)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/gb.png',
        'Estonian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ee.png',
        'fil': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ph.png',
        'Filipino': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ph.png',
        'Finnish': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/fi.png',
        'French': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/fr.png',
        'French (FR)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/fr.png',
        'French (CA)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/can-qc.png',
        'Galician': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/es-ga.png',
        'German': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/de.png',
        'Greek': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/gr.png',
        'Hebrew': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/il.png',
        'Hindi': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/in.png',
        'Hungarian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/hu.png',
        'Icelandic': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/is.png',
        'Indonesian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/id.png',
        'Italian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/it.png',
        'Japanese': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/jp.png',
        'Kannada': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/Kannada.png',
        'Korean': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/kr.png',
        'Latvian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/lv.png',
        'Lithuanian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/lt.png',
        'Malay': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/my.png',
        'Macedonian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/Macedonian.png',
        'Malayalam': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/in.png',
        'Norwegian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/no.png',
        'Norwegian Bokmal': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/no.png',
        'Persian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ir.png',
        'Polish': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/pl.png',
        'Portuguese (PT)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/pt.png',
        'Portuguese (BR)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/br.png',
        'Portuguese': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/pt.png',
        'Romanian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ro.png',
        'Russian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ru.png',
        'Serbian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/rs.png',
        'Slovak': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/sk.png',
        'Slovenian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/si.png',
        'Spanish (ES)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/es.png',
        'Spanish': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/es.png',
        'Spanish (Latin America)': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/mx.png',
        'Swedish': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/se.png',
        'Tamil': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/Tamil.png',
        'Telugu': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/in.png',
        'Thai': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/th.png',
        'Turkish': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/tr.png',
        'Ukrainian': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/ua.png',
        'Vietnamese': 'https://raw.githubusercontent.com/Vijj3N/db-flag-images/refs/heads/main/vn.png',
    };

    const tInfoRows = document.querySelectorAll('tr.pad');

    for (let tInfoRow of tInfoRows) {
        const bq = tInfoRow.querySelectorAll('blockquote')[1];
        const subsInfo = bq?.textContent.split(/\nText(?:\n| #1[^\d])/)[1];
        if (!subsInfo) continue;

        const matchedLangs = subsInfo.match(/\nLanguage\s*[:]\s*(.*?)(?=\n|$)/g);
        if (!matchedLangs) continue;

        const setOfLangs = new Set();
        for (let lang of matchedLangs) {
            setOfLangs.add(lang.split(':')[1].trim());
        }

        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.innerHTML = 'In Torrent: ';
        tr.appendChild(td);

        const subsView = document.getElementById('subtitle_display_' + tInfoRow.id.split('_')[1]);
        subsView?.closest('tbody').insertBefore(tr, subsView.parentNode);
        subsView.innerHTML = 'External: ' + subsView.innerHTML;

        for (let lang of setOfLangs) {
            if (languages[lang]) {
                const img = document.createElement('img');
                img.title = lang;
                img.src = languages[lang];
                img.alt = lang + ' Flag';
                img.style.width = '21px';
                img.style.height = 'auto';
                img.style.borderRadius = '3px';
                img.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
                img.style.marginRight = '5px';
                img.style.verticalAlign = 'middle';
                img.style.transition = 'transform 0.2s ease';

                img.addEventListener('mouseover', () => {
                    img.style.transform = 'scale(1.1)';
                    img.style.outline = '2px solid #ffcc00';
                });

                img.addEventListener('mouseout', () => {
                    img.style.transform = 'scale(1)';
                    img.style.outline = 'none';
                });

                td.appendChild(img);
            } else {
                console.warn(`No flag found for language: ${lang}`);
            }
        }
    }
})();