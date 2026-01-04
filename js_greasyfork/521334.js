// ==UserScript==
// @name         Warframe Wiki Enhanced Market Navigator
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds Market buttons to Warframe Wiki pages: below the title and next to mod links.
// @author       PixDie
// @match        https://warframe.fandom.com/wiki/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521334/Warframe%20Wiki%20Enhanced%20Market%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/521334/Warframe%20Wiki%20Enhanced%20Market%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a common Market button
    function createMarketButton(targetUrl) {
        const button = document.createElement('button');
        button.textContent = 'Market';
        button.style.padding = '2px 5px';
        button.style.fontSize = '12px';
        button.style.backgroundColor = '#0078d7';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', (event) => {
             event.preventDefault();
            window.open(targetUrl, '_blank');
        });

        return button;
    }


     // Function to add a button below the specified element
     function addMarketButtonBelow(targetElement, targetUrl) {
         const buttonContainer = document.createElement('div');
         buttonContainer.style.display = 'flex';
         buttonContainer.style.justifyContent = 'center';
         buttonContainer.style.marginTop = '5px';


        const button = createMarketButton(targetUrl);
        buttonContainer.appendChild(button);
        targetElement.insertAdjacentElement('beforeend', buttonContainer);
    }

    // Function to add a button next to the link element
    function addMarketButtonNextTo(linkElement, targetUrl) {
         const button = createMarketButton(targetUrl);
        button.style.marginLeft = '5px';

        //Insert button after the text span
         const textSpan = linkElement.nextElementSibling;
        if(textSpan){
         textSpan.parentNode.insertBefore(button, textSpan.nextSibling);
        } else{
         linkElement.parentNode.insertBefore(button, linkElement.nextSibling)
        }

    }

    // --- Title Button Logic ---
    const titleElement = document.querySelector('h2.pi-item.pi-item-spacing.pi-title.pi-secondary-background');
     if (titleElement) {
         const titleText = titleElement.textContent.trim().toLowerCase().replace(/\s+/g, '_');
         const targetUrl = `https://warframe.market/items/${titleText}`;
         addMarketButtonBelow(titleElement, targetUrl);
     }


    // --- Mod Link Button Logic ---
    const spans = document.querySelectorAll('span[data-param2="Mods"]');

    spans.forEach(span => {
       const innerSpan = span.querySelector('span[style*="border-bottom: 2px dotted"]');
       if(innerSpan){
            const link = span.querySelector('a[href^="/wiki/"]');
            if (link) {
                const variable = link.getAttribute('href').split('/wiki/')[1].toLowerCase();
                const targetUrl = `https://warframe.market/items/${variable}`;
                addMarketButtonNextTo(link, targetUrl);
            }
        }
    });
})();