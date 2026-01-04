// ==UserScript==
// @name         VirusTotal Link Scanner with Icon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show VirusTotal icon next to links for scanning/Mostra l'icona di virustotal quando ci si avvicina con il puntatore del maouse ad un link
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513338/VirusTotal%20Link%20Scanner%20with%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/513338/VirusTotal%20Link%20Scanner%20with%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crea l'icona di VirusTotal
    const createIcon = (url) => {
        const icon = document.createElement('img');
        icon.src = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.lmTvYYmTz8CNrgkfx_MSewAAAA%26pid%3DApi&f=1&ipt=e91a50f513f7d4d4d53d11233648fae6150a97425191184f5108657c9113262e&ipo=images'; // URL dell'icona di VirusTotal
        icon.style.width = '20px'; // Larghezza dell'icona
        icon.style.height = '20px'; // Altezza dell'icona
        icon.style.cursor = 'pointer';
        icon.style.marginLeft = '5px'; // Margine a sinistra
        icon.title = 'Scan with VirusTotal'; // Testo del tooltip

        // Aggiungi l'evento click per aprire VirusTotal
        icon.addEventListener('click', (event) => {
            event.stopPropagation(); // Fermare la propagazione dell'evento
            // Apri VirusTotal con l'URL precompilato
            window.open(`https://www.virustotal.com/gui/home/url?url=${encodeURIComponent(url)}`, '_blank');
        });

        return icon;
    };

    // Aggiungi l'icona accanto ai link
    document.addEventListener('mouseover', (event) => {
        const target = event.target;

        // Controlla se il target è un link
        if (target.tagName === 'A' && target.href) {
            // Rimuovi eventuali icone precedenti
            const existingIcon = target.parentNode.querySelector('.vt-icon');
            if (existingIcon) {
                existingIcon.remove();
            }

            // Crea e aggiungi l'icona
            const icon = createIcon(target.href);
            icon.classList.add('vt-icon'); // Aggiungi una classe per identificare l'icona
            target.parentNode.insertBefore(icon, target.nextSibling);
        }
    });
})();