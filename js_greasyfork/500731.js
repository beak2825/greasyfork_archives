// ==UserScript==
// @name         [KPX] Sulane Skill Level Display
// @namespace    https://www.sulane.net/
// @version      0.1
// @description  Displays the corresponding skill level for each URL on the Sulane website
// @author       KPCX
// @match        https://www.sulane.net/avaleht.php?asukoht=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sulane.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500731/%5BKPX%5D%20Sulane%20Skill%20Level%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/500731/%5BKPX%5D%20Sulane%20Skill%20Level%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Map of skill IDs to their corresponding names
    const skillMap = {
        raidumiselv: 'Raidumine',
        joogimeistrilv: 'Joogimeister',
        kaevandamiselv: 'Kaevandamine',
        varastamiselv: 'Varastamine',
        sulatamiselv: 'Sulatamine',
        aianduselv: 'Aiandus',
        ehitamiselv: 'Ehitamine',
        kasitoolv: 'Kasitöö',
        sepanduslv: 'Sepandus',
        kalastamiselv: 'Kalastamine',
        kokanduselv: 'Kokandus',
        keemikulv: 'Keemik',
        juveliirlv: 'Juveliir',
        maagialv: 'Maagia',
        jahinduslv: 'Jahindus',
    };

    // Function to extract skill level from the page
    function getSkillLevel(skillId) {
        const element = document.getElementById(skillId);
        return element ? element.textContent.trim() : 'N/A';
    }

    // Define the URLs and their corresponding skill IDs
    const urlMappings = [
        { url: 'https://www.sulane.net/avaleht.php?asukoht=metsvalik', skillId: 'raidumiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=10xmets', skillId: 'raidumiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=kaevandusvalik', skillId: 'kaevandamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=10xkaevandus', skillId: 'kaevandamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=tiik', skillId: 'kalastamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=aedkontor', skillId: 'aianduselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=soogitaimedaed', skillId: 'aianduselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=ravimtaimedaed', skillId: 'aianduselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=istikudaed', skillId: 'aianduselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=aedpuud', skillId: 'aianduselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=ehitusruum', skillId: 'ehitamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=ehitellimused', skillId: 'ehitamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=kasitoo', skillId: 'kasitoolv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=omblus', skillId: 'kasitoolv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=sulatamine', skillId: 'sulatamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=ahi', skillId: 'sulatamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=sepandus', skillId: 'sepanduslv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=alasi', skillId: 'sepanduslv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=keemik', skillId: 'keemikulv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=juveliir', skillId: 'juveliirlv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=varastamine', skillId: 'varastamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=varas', skillId: 'varastamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=roovikoht', skillId: 'varastamiselv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=jahimaja', skillId: 'jahinduslv' },
        { url: 'https://www.sulane.net/avaleht.php?asukoht=joogimeister', skillId: 'joogimeistrilv' }, //fix
        { url: 'https://www.sulane.net/avaleht.php?asukoht=kokandus', skillId: 'kokanduselv' }, //fix
        { url: 'https://www.sulane.net/avaleht.php?asukoht=maagia', skillId: 'maagialv' } //fix
    ];

    // Check if the current page matches any desired URL
    const currentURL = window.location.href;
    for (const mapping of urlMappings) {
        if (currentURL.includes(mapping.url)) {
            const skillId = mapping.skillId;
            const skillName = skillMap[skillId] || 'Unknown Skill';
            const skillLevel = getSkillLevel(skillId);

            // Update the existing "Jutukas" content
            const jutukasElement = document.querySelector('#mobchatbox'); // Corrected selector
            if (jutukasElement) {
                jutukasElement.innerHTML += `<div width="100%"><b><center>${skillName} Level: ${skillLevel}</center></b></div>`;
            }
            break; // Exit the loop after finding a match
        }
    }
})();