// ==UserScript==
// @name         REFSAM to Pilotage RTC
// @namespace    Inetum
// @version      1.0.2
// @description  Récupère les informations sur le LDAP et le colle directement dans le formulaire de Pilotage RTC.
// @author       Philippe PELIZZARI
// @match        https://aida-achatformation.sso.infra.ftgroup/appli/voirLdap.php
// @match        https://pilotage-rtc.sso.francetelecom.fr/admin/users*
// @match        https://sar-refsam.sso.infra.ftgroup/php/ch_traitement_du_due.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infra.ftgroup
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/480462/REFSAM%20to%20Pilotage%20RTC.user.js
// @updateURL https://update.greasyfork.org/scripts/480462/REFSAM%20to%20Pilotage%20RTC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.hostname === 'sar-refsam.sso.infra.ftgroup') {
        const habilitations = {};

        setTimeout(() => { document.getElementById('rechercheDemandeUnitaire').click() }, 100);

        setTimeout(() => {
            [...document.getElementById('div_resultat').querySelectorAll('tr:not(:first-child)')].filter((_, i) => i % 2 == 0).map(node => {
                const type = node.querySelector('td:nth-child(2)').innerText.split(' ')[0];
                const role = node.querySelector('td:nth-child(7)').innerText;
                const cuid = node.querySelector('td:nth-child(5) a').innerText.split(' ')[0];

                console.log(type, role, cuid);

                habilitations[cuid] = {};
                habilitations[cuid].type = type;
                habilitations[cuid].role = role;
            })

            console.log(habilitations);
            GM_setValue("LDAP_TO_PILOTAGE_RTC", habilitations);
        }, 600);
    }

    if (location.hostname === 'aida-achatformation.sso.infra.ftgroup') {
        const habilitations = GM_getValue("LDAP_TO_PILOTAGE_RTC");
        const cuid = document.querySelector('.data') !== null ? document.querySelector('.data').innerText : null;

        console.log(habilitations)
        if (cuid && !habilitations[cuid]?.surname ) {
            [...document.querySelectorAll('.data')].map((node) => {
                habilitations[cuid][node.dataset.key] = node.innerText;
            });

            console.log(habilitations);
            GM_setValue("LDAP_TO_PILOTAGE_RTC", habilitations);
        }

        for (let [key, val] of Object.entries(habilitations)) {
            if (val.type === 'ajout' && !val?.surname) {
                document.querySelector('input[type="text"]').value = key;
                document.querySelector('input[type="submit"]').click();
            }
        }
    }

    if (location.hostname === 'pilotage-rtc.sso.francetelecom.fr') {
        const habilitations = GM_getValue("LDAP_TO_PILOTAGE_RTC");

        for (let [cuid, habilitation] of Object.entries(habilitations)) {
            if (habilitation.type === 'ajout') {
                for (let [key, val] of Object.entries(habilitation)) {
                    if (document.querySelector('a[href="/admin/users/create"]')) {
                        document.querySelector('a[href="/admin/users/create"]').click();
                    }

                    switch (key) {
                        case 'active':
                            val = val === 'Oui' ? 1 : 0;
                            break;
                        case 'civility':
                            val = val === 'M.' ? 1 : val === 'Mme' ? 2 : 3;
                            break;
                        case 'preferred_language':
                            val = val === 'Français' ? 'FR' : 'EN';
                            break;
                        case 'role':
                            val = document.evaluate("//option[text()='Marché DefE BOS']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            break;
                    }

                    if (key === 'role') {
                        document.getElementById('groups').value = val.value;
                    }

                    if (key !== 'role' && key !== 'type') {
                        document.getElementById(key).value = val;
                    }
                }

                delete habilitations[cuid];
                GM_setValue("LDAP_TO_PILOTAGE_RTC", habilitations);
                document.querySelector('input[type="submit"]').click();
            }

            if (habilitation.type === 'sup') {
                if (document.querySelector('input[value="Supprimer"]')) {
                    delete habilitations[cuid];
                    GM_setValue("LDAP_TO_PILOTAGE_RTC", habilitations);
                    document.querySelector('input[value="Supprimer"]').click();
                }

                if (!document.getElementById('collapseSearchPanel').classList.contains('show')) {
                    document.querySelector('button[href="#collapseSearchPanel"]').click();
                }

                if (document.getElementById('username').value !== cuid) {
                    document.getElementById('username').value = cuid;
                    document.getElementById('submitSearch').click();
                }

                document.querySelector('table tr td:last-child a:last-child').click()
            }

            return
        }
    }
})();