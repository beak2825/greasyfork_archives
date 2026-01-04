// ==UserScript==
// @name         Alta Definizione Link Extractor (con Blocco Pop-up)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Estrae i link, blocca i pop-up e rimuove gli overlay fastidiosi.
// @author       Flejta & Gemini
// @match        https://altadefinizione.day/*
// @include      https://altadefinizione*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526140/Alta%20Definizione%20Link%20Extractor%20%28con%20Blocco%20Pop-up%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526140/Alta%20Definizione%20Link%20Extractor%20%28con%20Blocco%20Pop-up%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // NUOVA FUNZIONE: Blocco dell'apertura automatica di finestre (Pop-up)
    //================================================================================
    /**
     * Sovrascrive la funzione window.open con una versione "vuota" per
     * impedire ai siti di aprire nuove finestre o schede pubblicitarie.
     * Restituisce 'null' per simulare il fallimento dell'apertura della finestra.
     */
    function blockPopups() {
        // Salva una copia della funzione originale, se mai servisse (ma in questo caso no)
        const originalWindowOpen = window.open;

        window.open = function(url, target, features) {
            console.log(`[Bloccato] Tentativo di aprire: ${url}`);
            // Non fare nulla, bloccando di fatto il pop-up.
            return null;
        };

        console.log('Blocco Pop-up attivato.');
    }


    //================================================================================
    // FUNZIONE DI PULIZIA: Rimozione dell'overlay fastidioso
    //================================================================================
    /**
     * Utilizza un MutationObserver per monitorare e rimuovere istantaneamente
     * qualsiasi <div> con z-index = 2147483647 che venga aggiunto alla pagina.
     */
    function removeOverlayOnCreation() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.tagName === 'DIV' &&
                            node.style.zIndex === '2147483647')
                        {
                            node.remove();
                            // console.log('Overlay fastidioso rimosso.');
                        }
                    });
                }
            }
        });

        // Osserva il body per l'aggiunta di nuovi nodi.
        observer.observe(document.body, { childList: true, subtree: true });
    }

    //--------------------------------------------------------------------------------
    // Funzioni originali per l'estrazione dei link (invariate)
    //--------------------------------------------------------------------------------

    function createModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000;
            width: 90%; max-height: 80vh; overflow-y: auto; display: none;
        `;
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            position: absolute; right: 10px; top: 10px; border: none;
            background: #ff4444; color: white; border-radius: 50%;
            width: 24px; height: 24px; cursor: pointer;
        `;
        closeBtn.onclick = () => modal.style.display = 'none';
        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            width: 100%; min-height: 200px; margin-top: 20px; padding: 10px;
            border: 1px solid #ccc; border-radius: 4px; font-family: monospace; color: #000;
        `;
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy All Links';
        copyBtn.style.cssText = `
            margin-top: 10px; padding: 8px 16px; background: #4CAF50;
            color: white; border: none; border-radius: 4px; cursor: pointer;
        `;
        copyBtn.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            alert('Links copied to clipboard!');
        };
        const title = document.createElement('h3');
        title.textContent = 'Extracted Links';
        title.style.marginTop = '0';
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(textarea);
        modal.appendChild(copyBtn);
        document.body.appendChild(modal);
        return { modal, textarea };
    }

    function extractLinks() {
        const rows = document.querySelectorAll('tr[onclick]');
        const allLinks = [];
        rows.forEach(row => {
            const onclick = row.getAttribute('onclick');
            const matches = [...onclick.matchAll(/window\.open\s*\(\s*'([^']+)'/g)];
            matches.forEach(match => {
                if (match[1]) {
                    allLinks.push({ link: match[1], text: row.textContent.trim() });
                }
            });
        });
        const anchorElements = document.querySelectorAll('a[allowfullscreen][data-link]');
        anchorElements.forEach(anchor => {
            const dataLink = anchor.getAttribute('data-link');
            if (dataLink) {
                allLinks.push({ link: dataLink, text: anchor.textContent.trim() });
            }
        });
        return allLinks;
    }

    function createFloatingButton() {
        const button = document.createElement('button');
        button.textContent = '🔗 Extract Links';
        button.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 10px 20px;
            background: #2196F3; color: white; border: none; border-radius: 4px;
            cursor: pointer; z-index: 9999; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(button);
        return button;
    }

    function formatLinks(links) {
        return links.map(item => `${item.text}\n${item.link}\n`).join('\n');
    }

    // Initialize everything
    function init() {
        // --- Attiva subito le funzioni di blocco e pulizia ---
        blockPopups();
        removeOverlayOnCreation();

        // Crea l'interfaccia per l'estrazione
        const { modal, textarea } = createModal();
        const floatingButton = createFloatingButton();
        floatingButton.onclick = () => {
            const links = extractLinks();
            textarea.value = formatLinks(links);
            modal.style.display = 'block';
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();