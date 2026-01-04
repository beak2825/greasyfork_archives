// ==UserScript==
// @name         EasyPLU
// @namespace    https://easy-plu.knowledge-hero.com/*
// @version      2.0.3
// @description  PLUs automatisch lernen/eintragen – stabil für Firefox Nightly Android
// @author       E4gle
// @match        https://easy-plu.knowledge-hero.com/*
// @match        http://easy-plu.knowledge-hero.com/*
// @match        *://easy-plu.knowledge-hero.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543150/EasyPLU.user.js
// @updateURL https://update.greasyfork.org/scripts/543150/EasyPLU.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const debug = true;
    const STORAGE_KEY = 'easyPLUdb';
    let pluDatenbank = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    let observerGestartet = false;

    function istLernmodus() {
        const h1 = document.querySelector('h1');
        return h1 && h1.textContent.includes('PLU-Lernmodus');
    }

    function speichereDB() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pluDatenbank));
        aktualisiereClearDBButton();
    }

    function tragePLUMehrfachEin(plu, eingabeFeld, anzahl = 3, delay = 400) {
        return new Promise((resolve) => {
            let count = 0;
            const interval = setInterval(() => {
                if (count >= anzahl) {
                    clearInterval(interval);
                    resolve();
                    return;
                }
                eingabeFeld.value = plu;
                eingabeFeld.dispatchEvent(new Event('input', { bubbles: true }));
                eingabeFeld.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13
                }));
                count++;
            }, delay);
        });
    }

    async function arbeiteAktuellesProduktAb() {
        if (!istLernmodus()) return;

        const titelElement = document.querySelector('h1.tw\\:line-clamp-2');
        const eingabeFeld = document.getElementById('plu-number-input');
        if (!titelElement || !eingabeFeld) return;

        const produktname = titelElement.textContent.trim();
        let plu = pluDatenbank[produktname];

        const spanPLU = document.querySelector('span[data-v-3bb33b45]');
        if (spanPLU) {
            const neuePLU = spanPLU.textContent.trim();
            if (neuePLU && neuePLU !== plu) {
                pluDatenbank[produktname] = neuePLU;
                speichereDB();
                console.log(`[EasyPLU] PLU für "${produktname}" gelernt: ${neuePLU}`);
                plu = neuePLU;
            }
        }

        if (plu) {
            console.log(`[EasyPLU] PLU für "${produktname}" wird eingetragen: ${plu}`);
            await tragePLUMehrfachEin(plu, eingabeFeld, 3);
        } else {
            console.log(`[EasyPLU] Keine PLU für "${produktname}" gespeichert.`);
        }
    }

    function erstellePLUEintragButtonNichtLernmodus() {
        if (istLernmodus()) return;

        const titelElement = document.querySelector('h1.tw\\:line-clamp-2');
        const eingabeFeld = document.getElementById('plu-number-input');
        const pluButton = document.getElementById('numpad-plu');

        if (!titelElement || !eingabeFeld || !pluButton) return;

        const produktname = titelElement.textContent.trim();
        if (pluButton.dataset.easypluAttached === 'true') return;
        pluButton.dataset.easypluAttached = 'true';

        const neuerButton = pluButton.cloneNode(true);
        pluButton.parentNode.replaceChild(neuerButton, pluButton);

        neuerButton.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();

            let gespeichertePLU = pluDatenbank[produktname];
            if (!gespeichertePLU) {
                const eingabe = prompt(`Keine PLU für "${produktname}" gefunden.\nBitte PLU eingeben:`);
                if (eingabe && eingabe.trim()) {
                    gespeichertePLU = eingabe.trim();
                    pluDatenbank[produktname] = gespeichertePLU;
                    speichereDB();
                    console.log(`[EasyPLU] Neue PLU gespeichert für "${produktname}": ${gespeichertePLU}`);
                } else {
                    console.log(`[EasyPLU] Keine PLU eingegeben für "${produktname}".`);
                    return;
                }
            }

            eingabeFeld.value = gespeichertePLU;
            eingabeFeld.dispatchEvent(new Event('input', { bubbles: true }));
            eingabeFeld.dispatchEvent(new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            }));

            console.log(`[EasyPLU] PLU "${gespeichertePLU}" eingetragen für "${produktname}".`);
        });
    }

    function aktualisiereClearDBButton() {
        const clearBtn = document.getElementById('easyplu-clear-db');
        if (!clearBtn) return;
        const anzahl = Object.keys(pluDatenbank).length;
        clearBtn.textContent = `🗑️ Datenbank löschen (${anzahl} Eintrag${anzahl === 1 ? '' : 'e'})`;
    }

    function erstelleClearDBButton() {
        if (!debug || document.getElementById('easyplu-clear-db')) return;

        const navbar = document.querySelector('.navbar.navbar-expand-lg');
        if (!navbar) return;

        const clearBtn = document.createElement('button');
        clearBtn.id = 'easyplu-clear-db';
        clearBtn.style.marginLeft = '10px';
        clearBtn.style.padding = '6px 12px';
        clearBtn.style.fontSize = '14px';
        clearBtn.style.backgroundColor = '#e53935';
        clearBtn.style.color = 'white';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '4px';
        clearBtn.style.cursor = 'pointer';

        clearBtn.addEventListener('click', () => {
            if (confirm('Willst du die PLU-Datenbank wirklich löschen?')) {
                pluDatenbank = {};
                localStorage.removeItem(STORAGE_KEY);
                alert('PLU-Datenbank wurde gelöscht.');
                console.log('[EasyPLU] Datenbank gelöscht');
                aktualisiereClearDBButton();
            }
        });

        navbar.appendChild(clearBtn);
        aktualisiereClearDBButton();
    }

    function prüfeUndKlickeDashboardZurückButton() {
        const h1 = document.querySelector('h1');
        if (!h1 || h1.textContent.trim() !== 'Lernmodus erfolgreich abgeschlossen') return;

        const versucheKlick = () => {
            const zurückButton = Array.from(document.querySelectorAll('span'))
                .find(el => el.textContent.trim() === 'ZURÜCK ZUM DASHBOARD');

            if (zurückButton) {
                console.log('[EasyPLU] Dashboard-Button gefunden, klicke...');
                zurückButton.click();
                setTimeout(() => location.reload(), 1500);
            } else {
                console.log('[EasyPLU] Warte auf Dashboard-Button...');
                setTimeout(versucheKlick, 500);
            }
        };

        versucheKlick();
    }

    function setupObserver() {
        if (observerGestartet) return;
        observerGestartet = true;

        const observer = new MutationObserver(() => {
            clearTimeout(observer._timer);
            observer._timer = setTimeout(() => {
                arbeiteAktuellesProduktAb();
                erstellePLUEintragButtonNichtLernmodus();
                erstelleClearDBButton();
                prüfeUndKlickeDashboardZurückButton();
            }, 500);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Direkt initial prüfen
        setTimeout(() => {
            arbeiteAktuellesProduktAb();
            erstellePLUEintragButtonNichtLernmodus();
            erstelleClearDBButton();
            prüfeUndKlickeDashboardZurückButton();
        }, 800);
    }

    function init() {
        setupObserver();

        if (Object.keys(pluDatenbank).length === 0) {
            setTimeout(() => {
                const hinweis = confirm(
                    'Die PLU-Datenbank ist leer.\nLernmodus starten, um PLUs automatisch zu speichern?'
                );
                if (hinweis) {
                    alert('Wechsle in den Lernmodus und beginne mit dem ersten Artikel.');
                }
            }, 800);
        }
    }

    function warteAufElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    reject(`Timeout: ${selector} nicht gefunden`);
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    }

    // 🔁 Initialisierung robust starten
    warteAufElement('body').then(() => {
        console.log('[EasyPLU] Initialisierung...');
        init();
    }).catch((err) => {
        console.warn('[EasyPLU] Init fehlgeschlagen:', err);
    });

    // Optional: Fallback-Retry nach 5s
    setTimeout(() => {
        if (!observerGestartet) {
            console.log('[EasyPLU] Wiederhole Initialisierung...');
            init();
        }
    }, 5000);
})();
