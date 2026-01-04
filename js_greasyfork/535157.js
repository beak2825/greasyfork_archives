// ==UserScript==
// @name         MyFreeMP3 Anti-Hijack Script
// @namespace    https://github.com/Sniv3lbe
// @version      1.0
// @description  Blocks clipboard hijacking on myfreemp3juices.cc. Prevents spam URL injection into your clipboard when searching.
// @author       Sniv3lbe
// @match        https://2024.myfreemp3juices.cc/*
// @match        https://*.myfreemp3juices.cc/*
// @icon         https://2024.myfreemp3juices.cc/favicon-32x32.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://github.com/Sniv3lbe/myfreemp3-anti-hijack-script
// @supportURL   https://github.com/Sniv3lbe/myfreemp3-anti-hijack-script/issues
// @downloadURL https://update.greasyfork.org/scripts/535157/MyFreeMP3%20Anti-Hijack%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/535157/MyFreeMP3%20Anti-Hijack%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*********************************************************************
     * 1. Suppression du champ <input> 5 px × 5 px inséré par le site
     *********************************************************************/
    const removeHiddenInput = () => {
        const badInput = document.getElementById('myInput');
        if (badInput) badInput.remove();
    };

    // Exécute immédiatement puis surveille les réinsertions éventuelles
    removeHiddenInput();
    new MutationObserver(removeHiddenInput).observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    /*********************************************************************
     * 2. Blocage des événements « copy » déclenchés par les scripts du site
     *********************************************************************/
    window.addEventListener(
        'copy',
        (e) => {
            const clip = e.clipboardData || window.clipboardData;
            const pending = clip && clip.getData('text/plain');

            // Détecte les textes publicitaires du site
            if (pending && /myfree(mp3|mp3juices|\.vip)/i.test(pending)) {
                e.stopImmediatePropagation();
                e.preventDefault(); // Rien n’est copié
                console.debug('[Userscript] Clipboard hijack bloqué (event copy)');
            }
        },
        true // Capture : on se place avant les handlers du site
    );

    /*********************************************************************
     * 3. Surcharge de navigator.clipboard.writeText
     *********************************************************************/
    if (navigator.clipboard && navigator.clipboard.writeText) {
        const nativeWrite = navigator.clipboard.writeText.bind(navigator.clipboard);

        navigator.clipboard.writeText = async (text) => {
            if (/myfree(mp3|mp3juices|\.vip)/i.test(text)) {
                console.debug('[Userscript] Clipboard hijack bloqué (writeText)');
                return Promise.resolve();
            }
            return nativeWrite(text); // appels légitimes inchangés
        };
    }

    /*********************************************************************
     * 4. Surcharge de document.execCommand('copy')
     *********************************************************************/
    const nativeExec = document.execCommand.bind(document);
    document.execCommand = (cmd, ui, val) => {
        if (String(cmd).toLowerCase() === 'copy') {
            const selText = (document.getSelection() || '').toString();
            if (/myfree(mp3|mp3juices|\.vip)/i.test(selText)) {
                console.debug('[Userscript] Clipboard hijack bloqué (execCommand)');
                return false; // empêche la copie
            }
        }
        return nativeExec(cmd, ui, val);
    };
})();