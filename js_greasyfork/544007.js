// ==UserScript==
// @name         Conteggio caratteri Bitcointalk e Altcoinstalks (con OK e avviso minimo 200)
// @namespace    https://example.com/
// @version      1.4
// @description  Conta solo il testo scritto (escludendo quote) e avvisa se sotto i 200 caratteri senza spazi. Mostra OK verde se il testo è valido. Utile per campagne bounty. Funziona su Bitcointalk e Altcoinstalks.
// @author       GPT
// @match        https://bitcointalk.org/*
// @match        https://www.altcoinstalks.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544007/Conteggio%20caratteri%20Bitcointalk%20e%20Altcoinstalks%20%28con%20OK%20e%20avviso%20minimo%20200%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544007/Conteggio%20caratteri%20Bitcointalk%20e%20Altcoinstalks%20%28con%20OK%20e%20avviso%20minimo%20200%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const interval = setInterval(() => {
            const textarea = document.querySelector('textarea');

            if (textarea) {
                clearInterval(interval);

                // Contatore caratteri
                const counter = document.createElement('div');
                counter.style.fontSize = '12px';
                counter.style.marginTop = '5px';
                counter.style.color = 'darkblue';

                // Avviso rosso
                const warning = document.createElement('div');
                warning.style.fontSize = '13px';
                warning.style.marginTop = '5px';
                warning.style.fontWeight = 'bold';
                warning.style.color = 'red';
                warning.style.display = 'none';
                warning.textContent = '⚠️ Attenzione: devi scrivere almeno 200 caratteri (esclusi gli spazi)!';

                // Messaggio OK verde
                const okMsg = document.createElement('div');
                okMsg.style.fontSize = '13px';
                okMsg.style.marginTop = '5px';
                okMsg.style.fontWeight = 'bold';
                okMsg.style.color = 'green';
                okMsg.style.display = 'none';
                okMsg.textContent = '✅ OK: testo valido per la pubblicazione.';

                // Aggiungili sotto la textarea
                textarea.parentNode.appendChild(counter);
                textarea.parentNode.appendChild(warning);
                textarea.parentNode.appendChild(okMsg);

                const updateCount = () => {
                    const fullText = textarea.value;

                    // Trova l'ultima chiusura di [/quote]
                    const lastQuoteEnd = fullText.lastIndexOf('[/quote]');
                    let userText = '';
                    if (lastQuoteEnd !== -1) {
                        userText = fullText.substring(lastQuoteEnd + 8).trim();
                    } else {
                        userText = fullText.trim();
                    }

                    const totalChars = userText.length;
                    const noSpaceChars = userText.replace(/\s/g, '').length;

                    counter.innerText = `Caratteri personali: ${totalChars} | Senza spazi: ${noSpaceChars}`;

                    // Mostra avviso o OK
                    if (noSpaceChars < 200) {
                        warning.style.display = 'block';
                        okMsg.style.display = 'none';
                    } else {
                        warning.style.display = 'none';
                        okMsg.style.display = 'block';
                    }
                };

                textarea.addEventListener('input', updateCount);
                updateCount();
            }
        }, 500);
    });
})();
