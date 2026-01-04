// ==UserScript==
// @name         Bandcamp Collapsable Shop
// @namespace    https://github.com/lukalovre/BandcampCollapsableShop
// @version      1.0
// @description  Bundles up all bandcamp purchase options under one collapsable
// @author       Luka Lovre
// @match        https://*.bandcamp.com/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470653/Bandcamp%20Collapsable%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/470653/Bandcamp%20Collapsable%20Shop.meta.js
// ==/UserScript==

window.self === window.top && window.siteroot && "https://bandcamp.com" == window.siteroot && (function() {

    let shopButton = document.createElement("button");
    shopButton.textContent = "Shop";
    shopButton.style.width = '50px';
    shopButton.style.height = '20px';
    shopButton.style.fontSize = '12px';
    shopButton.style.float = "right";

    // Default Bandcamp following button colors
    shopButton.style.background = '#619aa9';
    shopButton.style.color = '#fff';

    const hide = element => {
        element.style.display = 'none'
    }

    const show = element => {
        element.style.display = 'block'
    }

    const toggle = element => {
        // if the element is visible, hide it
        if (window.getComputedStyle(element).display !== 'none') {
            hide(element)
            return
        }

        show(element)
    }

    let shopSection = '.tralbumCommands';
    let shopButtonLocationParent = '#name-section h3';
    let shopButtonLocation = '#name-section h3 [itemprop="byArtist"]';

    shopButton.addEventListener("click", function() {
        let element = document.querySelector(shopSection);
        toggle(element);
    });

    document.querySelector(shopSection).style.display = "none";
    document.querySelector(shopButtonLocationParent).insertBefore(shopButton, document.querySelector(shopButtonLocation));
}());
