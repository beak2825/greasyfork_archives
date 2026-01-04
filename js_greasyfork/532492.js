// ==UserScript==
// @name         Warframe Wiki (Official) Enhanced Market Navigator
// @name:pt-BR   Botão do Market para a Wiki Oficial
// @namespace    http://tampermonkey.net/
// @version      1.1 Ready to Public Relesase
// @description  Adds Market icon button in infobox for tradable sets/mods.
// @description:pt-br   Adiciona o botão do ícone do market para conjuntos/mods negociáveis.
// @author       aqueleK (Ispired in PixDie work)
// @match        https://wiki.warframe.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532492/Warframe%20Wiki%20%28Official%29%20Enhanced%20Market%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/532492/Warframe%20Wiki%20%28Official%29%20Enhanced%20Market%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper Functions ---

    function createMarketButton(targetUrl, backgroundColor) {
        const button = document.createElement('button');
        const img = document.createElement('img');
        img.src = 'https://www.findpwa.com/images/app_icons/warframe-market_icon.webp';
        img.alt = 'Market';
        img.style.height = '18px';
        img.style.width = '18px';
        img.style.verticalAlign = 'middle';
        button.appendChild(img);

        button.style.padding = '4px 5px';
        button.style.lineHeight = '1';
        button.style.backgroundColor = backgroundColor || '#4a4a4a';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.display = 'inline-block';
        button.style.transition = 'filter 0.2s ease';
        button.addEventListener('mouseenter', () => button.style.filter = 'brightness(120%)');
        button.addEventListener('mouseleave', () => button.style.filter = 'brightness(100%)');

        button.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(targetUrl, '_blank');
        });
        return button;
    }

     function createButtonContainer(button) {
         const container = document.createElement('div');
         container.style.textAlign = 'center';
         container.style.marginTop = '8px';
         container.style.marginBottom = '8px';
         container.appendChild(button);
         return container;
     }

    function formatNameForMarket(name) {
         let formatted = name.toLowerCase().replace(/\s+/g, '_');
         formatted = formatted.replace(/_\((mod|prime|relic|weapon|warframe|blueprint|scene|misc|cosmetic|fish|resource|component)\)$/, '');
         formatted = formatted.replace(/_\(.*\)$/, '');
         return formatted;
    }

    // --- Main Button Logic ---

    console.log("[WEMN v1.1 Public] Script running.");

    const infoboxElement = document.querySelector('div.infobox');
    if (!infoboxElement) {
        // console.log("[WEMN v1.1 Public] Infobox not found."); // Optional: Hide if too noisy
        return;
    }

    const infoboxTitleElement = infoboxElement.querySelector('div.title');
    if (!infoboxTitleElement) {
        console.log("[WEMN v1.1 Public] Infobox Title not found.");
        return;
    }

    let titleBgColor = '#4a4a4a';
    try {
        const computedStyle = window.getComputedStyle(infoboxTitleElement);
        if (computedStyle && computedStyle.backgroundColor && computedStyle.backgroundColor !== 'transparent' && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            titleBgColor = computedStyle.backgroundColor;
        }
    } catch (e) {
        console.error("[WEMN v1.1 Public] Error getting title background color:", e);
    }
    // console.log(`[WEMN v1.1 Public] Using background color: ${titleBgColor}`);

    const originalItemName = infoboxTitleElement.textContent.trim();
    const formattedNameBase = formatNameForMarket(originalItemName);
    let marketItemName = formattedNameBase;
    let shouldAddButton = false;
    let insertionTargetElement = null;
    let insertionMode = 'after';
    const isPrime = /Prime/i.test(originalItemName);

    // console.log(`[WEMN v1.1 Public] Processing: "${originalItemName}" (Is Prime: ${isPrime})`); // Optional: Hide if too noisy

    // Logic for Primes
    if (isPrime) {
        marketItemName = `${formattedNameBase}_set`;
        const updateDataLink = infoboxElement.querySelector('a[href*="/Module:"]');
        insertionTargetElement = updateDataLink?.closest('.row');
        insertionMode = 'before';
        shouldAddButton = true;
        // console.log("[WEMN v1.1 Public] Item is PRIME. Target: Before 'Update Data' row."); // Optional
    }
    // Logic for Non-Primes
    else {
        const tradableSpan = infoboxElement.querySelector('span[style*="color:green"]');
        const isTradable = tradableSpan && ['Tradable', 'Tradeable'].includes(tradableSpan.textContent.trim());

        if (isTradable) {
             insertionTargetElement = tradableSpan.closest('.row');
             insertionMode = 'after';
             const isModDetected = !!infoboxElement.querySelector('a[href*="/w/Transmutation"]');

             if (isModDetected) {
                 marketItemName = formattedNameBase;
                 // console.log(`[WEMN v1.1 Public] Tradable MOD detected. URL: ${marketItemName}`); // Optional
             } else {
                 marketItemName = `${formattedNameBase}_set`;
                 // console.log(`[WEMN v1.1 Public] Tradable NON-MOD item detected. URL: ${marketItemName}`); // Optional
             }
             shouldAddButton = true;
        } else {
             shouldAddButton = false;
             // console.log(`[WEMN v1.1 Public] Non-Prime item is NOT Trad(e)able.`); // Optional
        }
    }

    // Add Button
    if (shouldAddButton && insertionTargetElement) {
        const targetUrl = `https://warframe.market/items/${marketItemName}`;
        const button = createMarketButton(targetUrl, titleBgColor);
        const buttonContainer = createButtonContainer(button);

        if (insertionMode === 'before') {
            insertionTargetElement.parentNode.insertBefore(buttonContainer, insertionTargetElement);
        } else {
            insertionTargetElement.insertAdjacentElement('afterend', buttonContainer);
        }
         console.log(`[WEMN v1.1 Public] Added Market button for: "${originalItemName}", URL: ${targetUrl}`);

    } else {
         if (shouldAddButton && !insertionTargetElement) {
              console.error(`[WEMN v1.1 Public] Could not add button for "${originalItemName}" - insertion target not found.`);
         }
         // else { console.log(`[WEMN v1.1 Public] No button added for: "${originalItemName}".`); } // Optional
    }

    // --- Footer Modification ---
    const footerElement = document.getElementById('footer');
    if (footerElement) {
        // console.log("[WEMN v1.1 Public] Found footer element."); // Optional

        // Create the attribution paragraph and link
        const attributionParagraph = document.createElement('p');
        attributionParagraph.style.marginTop = '15px';
        attributionParagraph.style.marginBottom = '5px'; 
        attributionParagraph.style.textAlign = 'center';
        attributionParagraph.style.color = 'inherit';
        attributionParagraph.style.fontSize = 'small';

        const myLinkTree = document.createElement('a');
        myLinkTree.href = "https://linktr.ee/aquelek";
        myLinkTree.textContent = "aqueleK";
        myLinkTree.target = "_blank";
        myLinkTree.rel = "noopener noreferrer";

        attributionParagraph.innerHTML = `Integration of the warframe market button by ${myLinkTree.outerHTML}`;

        // Find the specific list item to insert BEFORE
        const copyrightLi = footerElement.querySelector('#footer-info-copyright'); // Target the copyright line's list item

        if (copyrightLi && copyrightLi.parentNode) {
            // Insert the new paragraph before the copyright list item
            copyrightLi.parentNode.insertBefore(attributionParagraph, copyrightLi); // *** Use insertBefore ***
            console.log("[WEMN v1.1 Public] Inserted attribution before copyright line in footer.");
        } else {
            // Fallback or Error if the specific element isn't found
            console.warn("[WEMN v1.1 Public] Could not find the copyright list item (#footer-info-copyright) to insert before. Appending to footer as fallback.");
            footerElement.appendChild(attributionParagraph); // Append to end if target not found
        }

    } else {
        console.warn("[WEMN v1.1 Public] Footer element (#footer) not found. Could not add attribution.");
    }
    // -------------------------

})();