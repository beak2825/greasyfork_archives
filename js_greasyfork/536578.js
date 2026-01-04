// ==UserScript==
// @name         Universal Link Extractor
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Estrae link con filtri di inclusione specifici per ogni sito, con GUI e toggle.
// @author       ChatGPT (modificato)
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/536578/Universal%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/536578/Universal%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHost = location.host;
    const enabledSites = JSON.parse(GM_getValue('enabledSites', '[]'));

    // Struttura per salvare i filtri specifici per ogni sito
    // { "example.com": ["pattern1", "pattern2"], "another.com": ["pattern3"] }
    const siteFilters = JSON.parse(GM_getValue('siteFilters', '{}'));

    // Menu per abilitare/disabilitare lo script su questo sito
    GM_registerMenuCommand(
        enabledSites.includes(currentHost)
            ? 'Disabilita Universal Link Extractor su questo sito'
            : 'Abilita Universal Link Extractor su questo sito',
        () => {
            let sites = JSON.parse(GM_getValue('enabledSites', '[]'));
            if (sites.includes(currentHost)) {
                sites = sites.filter(s => s !== currentHost);
                GM_setValue('enabledSites', JSON.stringify(sites));
                alert('Script disabilitato su: ' + currentHost);
            } else {
                sites.push(currentHost);
                GM_setValue('enabledSites', JSON.stringify(sites));

                // Se non esistono filtri per questo sito, crea un default
                if (!siteFilters[currentHost]) {
                    siteFilters[currentHost] = [`^https://${currentHost}/.*`];
                    GM_setValue('siteFilters', JSON.stringify(siteFilters));
                }

                alert('Script abilitato su: ' + currentHost);
            }
        }
    );

    // Se non abilitato, esci
    if (!enabledSites.includes(currentHost)) return;

    // GUI principale
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed', top: '50px', right: '10px',
        width: '360px', maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff',
        border: '1px solid #444', borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)', zIndex: '999999',
        fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.4',
        transition: 'max-height 0.3s ease, opacity 0.3s ease', opacity: '1'
    });

    // Ottieni i filtri del sito corrente
    const currentSiteFilters = siteFilters[currentHost] || [`^https://${currentHost}/.*`];

    panel.innerHTML = `
        <div style="padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong>Universal Link Extractor</strong>
                <button id="extractBtn" style="background:#28a745; border:none; color:#fff; padding:4px 8px; border-radius:3px; cursor:pointer;">Estrai link</button>
            </div>
            <div style="font-weight:bold; margin-bottom:8px;">Come usare:</div>
            <ul style="padding-left:20px; margin:0 0 8px 0;">
                <li>Clicca "Estrai link" per copiare quelli che matchano i filtri.</li>
                <li>Configura filtri di <strong>inclusione</strong> specifici per ${currentHost}.</li>
            </ul>
            <div style="font-weight:bold; margin-bottom:4px;">Filtri attivi per ${currentHost}:</div>
            <pre style="background:#f4f4f4; color:#000; padding:10px; border-radius:4px; font-family:monospace; font-size:13px; max-height:80px; overflow-y:auto;">
${currentSiteFilters.join('\n')}
            </pre>
            <div style="font-size:12px; color:#ccc; margin-top:8px;">Apri/chiudi con la freccia blu in alto a destra.</div>
        </div>
    `;
    document.body.appendChild(panel);

    // Listener Estrai
    document.getElementById('extractBtn').addEventListener('click', extractLinks);

    // Toggle sempre visibile
    const toggle = document.createElement('div');
    Object.assign(toggle.style, {
        position: 'fixed', top: '10px', right: '10px',
        width: '32px', height: '32px', cursor: 'pointer',
        backgroundColor: '#007bff', color: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '4px', fontSize: '18px', fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: '1000000',
        userSelect: 'none', transition: 'opacity 0.3s ease', opacity: '1'
    });
    toggle.textContent = '▼';
    document.body.appendChild(toggle);

    let expanded = true;
    toggle.addEventListener('click', () => {
        expanded = !expanded;
        if (expanded) {
            panel.style.maxHeight = '300px'; panel.style.opacity = '1'; toggle.textContent = '▼'; toggle.style.opacity = '1';
        } else {
            panel.style.maxHeight = '0'; panel.style.opacity = '0'; toggle.textContent = '▲'; toggle.style.opacity = '0';
        }
    });

    // Menu comando per configurare i filtri specifici per il sito
    GM_registerMenuCommand(`Configura filtri di inclusione per ${currentHost}`, () => {
        const defaultVal = currentSiteFilters.join(',');
        const inp = prompt(`Regex da includere per ${currentHost} (separa con virgola):`, defaultVal);

        if (inp !== null) {
            const newFilters = inp.split(',').map(s => s.trim()).filter(s => s);

            // Aggiorna i filtri specifici per questo sito
            siteFilters[currentHost] = newFilters;
            GM_setValue('siteFilters', JSON.stringify(siteFilters));

            alert(`Filtri di inclusione aggiornati per ${currentHost}`);
            // Refresh per aggiornare l'interfaccia
            location.reload();
        }
    });

    // Estrai link basandosi solo sui filtri del sito corrente
    function matchesAny(link, patterns) {
        return patterns.some(pat => {
            try {
                return new RegExp(pat).test(link);
            } catch {
                return false;
            }
        });
    }

    function extractLinks() {
        const currentFilters = siteFilters[currentHost] || [`^https://${currentHost}/.*`];

        const links = Array.from(document.querySelectorAll('a[href]'))
            .map(a => a.href)
            .filter(l => matchesAny(l, currentFilters));

        if (!links.length) return alert('Nessun link trovato');

        const count = links.length;
        navigator.clipboard.writeText(links.join('\n')).then(() => {
            console.log('Link estratti:', links);
            alert(`Ho copiato ${count} link negli appunti`);
        });
    }
})();