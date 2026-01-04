// ==UserScript==
// @name         MPP Minecraft-ify
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Apply Minecraftia font to MPP, wrap names in <>, adjust cursor
// @author       Kirogii
// @match        *://*.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
 
// @license MIT

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533760/MPP%20Minecraft-ify.user.js
// @updateURL https://update.greasyfork.org/scripts/533760/MPP%20Minecraft-ify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @font-face {
            font-family: 'Minecraftia';
            src: url('https://raw.githubusercontent.com/Kirogii/MPP-Scripts/refs/heads/main/Minecraftia-Regular.ttf') format('truetype');
        }

        .name, .message, #chat, #chat-input, .nametext, #names, .reply, .replyLink {
            font-family: 'Minecraftia' !important;
        }

        #cursors .name {
            font-size: 50% !important;
            font-family: 'Minecraftia' !important;
        }

        #names .nametext {
            font-family: 'Minecraftia' !important;
            display: inline-block;
        }
    `);

    const observer = new MutationObserver(() => {
        // Apply font and wrap usernames in chat
        document.querySelectorAll('#chat .name').forEach(el => {
            if (!el.dataset.modified) {
                el.textContent = `<${el.textContent.replace(/^<|>$/g, '')}>`;
                el.dataset.modified = "true";
            }
        });

        // Wrap usernames in cursor display
        document.querySelectorAll('#cursors .name').forEach(el => {
            if (!el.dataset.modified) {
                el.textContent = `<${el.textContent.replace(/^<|>$/g, '')}>`;
                el.dataset.modified = "true";
            }
            el.style.fontSize = '50%';
            el.style.fontFamily = 'Minecraftia';
            el.style.marginTop = '10px';
        });

        // Wrap and offset names in namelist
        document.querySelectorAll('#names .nametext').forEach(el => {
            if (!el.dataset.modified) {
                el.textContent = `<${el.textContent.replace(/^<|>$/g, '')}>`;
                el.dataset.modified = "true";
            }
            el.style.marginTop = '10px';
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();