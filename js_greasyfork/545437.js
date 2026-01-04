// ==UserScript==
// @name         CellCraft.io Ultimate Mod
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  FPS boost, custom UI, dark mode, and shop tweaks for CellCraft.io
// @author       S E N S E
// @match        *://cellcraft.io/*
// @grant        none
// @license      S E N S E
// @downloadURL https://update.greasyfork.org/scripts/545437/CellCraftio%20Ultimate%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/545437/CellCraftio%20Ultimate%20Mod.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 S E N S E

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    console.log("%c[CellCraft Mod] Loaded successfully!", "color: lime; font-size:14px;");

    /*** =====================
     * FPS BOOST
     * ===================== ***/
    const fpsBoost = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            * { image-rendering: pixelated !important; }
            body { background-color: #000 !important; }
        `;
        document.head.appendChild(style);
    };

    /*** =====================
     * DARK MODE
     * ===================== ***/
    const darkMode = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            .menu-container, .shop-container, .leaderboard {
                background-color: rgba(0,0,0,0.85) !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    };

    /*** =====================
     * NAME COLOR CHANGER
     * ===================== ***/
    const randomNameColor = () => {
        const input = document.querySelector('#nickname');
        if (input) {
            const colors = ["#ff0000", "#00ff00", "#00ffff", "#ffff00", "#ff00ff"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            input.style.color = color;
        }
    };

    /*** =====================
     * SHOP VISUAL TWEAK (Secret Prank)
     * ===================== ***/
    const tweakShopUI = () => {
        const shopPages = document.querySelectorAll('div.shop-page');
        shopPages.forEach(page => {
            page.querySelectorAll('.skin-card').forEach(card => {
                const priceElm = card.querySelector('.price');
                if (priceElm) {
                    // Secret prank: make all items look free
                    priceElm.innerHTML = '<i class="fas fa-coins"></i> 0';
                }
            });
        });
    };

    /*** =====================
     * OBSERVE DOM CHANGES
     * ===================== ***/
    const observer = new MutationObserver(() => {
        if (document.querySelector('div.shop-page')) {
            tweakShopUI(); // prank trigger
        }
        randomNameColor();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Activate features
    fpsBoost();
    darkMode();
})();