// ==UserScript==
// @name         CS Auto Renamer
// @namespace    https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=1032262
// @version      1.1
// @description  Automatically rename pets based on rarity and adoption year on Chickensmoothie
// @author       OreozHere
// @match        https://www.chickensmoothie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520649/CS%20Auto%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/520649/CS%20Auto%20Renamer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pricingChart = {
        rare: {
            2008: '45 c$',
            2009: '40 c$',
            2010: '35 c$',
            2011: '35 c$',
            2012: '25 c$',
            2013: '25 c$',
            2014: '20 c$',
            2015: '20 c$',
            2016: '20 c$',
            2017: '15 c$',
            2018: '15 c$',
            2019: '15 c$',
            2020: '12 c$',
            2021: '12 c$',
            2022: '10 c$',
            2023: '8 c$',
            2024: '8 c$'
        },
        veryrare: {
            2008: '100 c$',
            2009: '100 c$',
            2010: '70 c$',
            2011: '70 c$',
            2012: '60 c$',
            2013: '50 c$',
            2014: '40 c$',
            2015: '40 c$',
            2016: '40 c$',
            2017: '30 c$',
            2018: '30 c$',
            2019: '30 c$',
            2020: '24 c$',
            2021: '24 c$',
            2022: '20 c$',
            2023: '16 c$',
            2024: '16 c$'
        }
    };

    const renamePetsButton = document.querySelector('.btn-rename-pets');
    if (!renamePetsButton) return;

    const autoRenameButton = document.createElement('button');
    autoRenameButton.textContent = 'Auto Rename';
    autoRenameButton.style.marginRight = '10px';
    autoRenameButton.className = 'btn-auto-rename';

    renamePetsButton.parentNode.insertBefore(autoRenameButton, renamePetsButton);

    autoRenameButton.addEventListener('click', function () {
        autoRenameButton.style.display = 'none';

        renamePetsButton.click();

        const observer = new MutationObserver(() => {
            const renameIcon = document.querySelector('img[src="/img/icons/refresh24.png"]');
            if (renameIcon) {
                observer.disconnect();
                renamePets();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    function renamePets() {
        const petElements = document.querySelectorAll('li > dl.pet');

        petElements.forEach(pet => {
            const rarityElement = pet.querySelector('.pet-rarity img');
            const nameInput = pet.querySelector('.pet-new-name');
            const adoptionDateElement = pet.querySelector('.pet-adoption-date');

            if (!nameInput || !adoptionDateElement) return;

            const adoptionDate = adoptionDateElement.getAttribute('data-original-title') || adoptionDateElement.textContent.trim();
            const adoptionYear = parseInt(adoptionDate.split('-')[0], 10);

            if (adoptionDate.includes('-12-18')) return;

            let newName = '2 c$';
            if (rarityElement) {
                const rarityClass = rarityElement.className;
                if (rarityClass.includes('rarity-bar-omgsocommon') ||
                    rarityClass.includes('rarity-bar-extremelycommon') ||
                    rarityClass.includes('rarity-bar-verycommon')){
                    newName = '3 for 1 c$';
                } else if (rarityClass.includes('rarity-bar-common')) {
                    newName = '1 c$';
                } else if (rarityClass.includes('rarity-bar-uncommon')) {
                    newName = '2 c$';
                } else if (rarityClass.includes('rarity-bar-veryuncommon')) {
                    newName = '4 c$';
                } else if (rarityClass.includes('rarity-bar-extremelyuncommon')) {
                    newName = '8 c$';
                } else if (rarityClass.includes('rarity-bar-rare')) {
                    newName = pricingChart.rare[adoptionYear] || newName;
                } else if (rarityClass.includes('rarity-bar-veryrare')) {
                    newName = pricingChart.veryrare[adoptionYear] || newName;
                }
            }

            nameInput.value = newName;
        });
    }
})();
