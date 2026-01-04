// ==UserScript==
// @name         Klikalny Tracking Przesyłki
// @namespace    https://premiumtechpanel.sellasist.pl/admin/orders/edit/
// @version      1.2
// @description  Klikalny numer(y) przesyłki w karcie zamówienia SellAsist
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @run-at       document-end
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/537503/Klikalny%20Tracking%20Przesy%C5%82ki.user.js
// @updateURL https://update.greasyfork.org/scripts/537503/Klikalny%20Tracking%20Przesy%C5%82ki.meta.js
// ==/UserScript==

(function(){
    'use strict';
    console.log('[TM] v1.13 start');

    const carrierUrls = {
        'InPost':        num => `https://inpost.pl/sledzenie-przesylek?number=${encodeURIComponent(num)}`,
        'DPD':           num => `https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=${encodeURIComponent(num)}`,
        'UPS':           num => `https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=${encodeURIComponent(num)}`,
        'GLS':           num => `https://gls-group.eu/PL/pl/sledzenie?match=${encodeURIComponent(num)}`,
        'Poczta Polska': num => `https://emonitoring.poczta-polska.pl/?numer=${encodeURIComponent(num)}`,
        'DHL':           num => `https://www.dhl.com/pl-pl/home/sledzenie-przesylek.html?tracking-id=${encodeURIComponent(num)}`,
        'Allegro One':   num => `https://allegro.pl/kampania/one/kurier/sledzenie-paczki?numer=${encodeURIComponent(num)}`,
        'Orlen Paczka':  num => `https://www.orlenpaczka.pl/sledz-paczke/?numer=${encodeURIComponent(num)}`
    };

    const shippingSelect = document.getElementById('selected_shipment');
    const shippingText = shippingSelect
        ? shippingSelect.options[shippingSelect.selectedIndex].text.trim()
        : '';

    function detectCarrierBySelect() {
        if (!shippingText) return null;
        const txt = shippingText.toLowerCase();
        if (txt.includes('allegro one'))     return 'Allegro One';
        if (txt.endsWith(', one'))           return 'Allegro One';
        if (txt.includes('inpost'))          return 'InPost';
        if (txt.includes('dpd'))             return 'DPD';
        if (txt.includes('ups'))             return 'UPS';
        if (txt.includes('gls'))             return 'GLS';
        if (txt.includes('poczta polska'))   return 'Poczta Polska';
        if (txt.includes('dhl'))             return 'DHL';
        if (txt.includes('orlen paczka'))    return 'Orlen Paczka';
        return null;
    }

    function processCell(cell) {
        if (cell.dataset.processed) return;

        const text = cell.textContent;
        const m = text.match(/\b[A-Za-z0-9]{8,}\b/);
        if (!m) return;
        const raw = m[0];
        console.log(`[TM] raw number: ${raw}`);

        const originals = Array.from(cell.childNodes);
        const otherNodes = originals.filter(n =>
            !(n.nodeType === Node.TEXT_NODE || n.textContent.includes(raw))
        );

        let carrier = detectCarrierBySelect();
        if (!carrier) {
            const row = cell.closest('tr[data-id]');
            if (row) {
                const help = row.previousElementSibling;
                if (help) {
                    for (const span of help.querySelectorAll('span')) {
                        for (const key in carrierUrls) {
                            if (span.textContent.includes(key)) {
                                carrier = key;
                                break;
                            }
                        }
                        if (carrier) break;
                    }
                }
                if (!carrier) {
                    for (const a of row.querySelectorAll('a[href]')) {
                        const h = a.href;
                        if (h.includes('/download/dhl/'))                                { carrier = 'DHL';           break; }
                        if (h.includes('/download/erli/') || h.includes('/download/shipx_paczkomaty/')) { carrier = 'InPost'; break; }
                        if (h.includes('/download/pocztex/'))                            { carrier = 'Poczta Polska'; break; }
                    }
                }
                if (!carrier) {
                    for (const a of row.querySelectorAll('a[href]')) {
                        const h = a.href;
                        if (h.includes('dpd.com.pl'))              { carrier = 'DPD';         break; }
                        if (h.includes('ups.com'))                 { carrier = 'UPS';         break; }
                        if (h.includes('gls-group.eu'))            { carrier = 'GLS';         break; }
                        if (h.includes('poczta-polska.pl'))        { carrier = 'Poczta Polska'; break; }
                        if (h.includes('dhl.com'))                 { carrier = 'DHL';         break; }
                        if (h.includes('allegro.pl/kampania/one')) { carrier = 'Allegro One'; break; }
                        if (h.includes('orlenpaczka.pl/sledz-paczke')) { carrier = 'Orlen Paczka'; break; }
                    }
                }
            }
        }
        console.log(`[TM] detected carrier: ${carrier || 'fallback'}`);

        const builder = (carrier && carrierUrls[carrier])
            ? carrierUrls[carrier]
            : num => {
                console.warn(`[TM] fallback URL for ${num}`);
                return `https://example.com/track/${encodeURIComponent(num)}`;
            };

        const a = document.createElement('a');
        a.href = builder(raw);
        a.target = '_blank';
        a.textContent = raw;
        a.style.textDecoration = 'underline';
        a.style.color = '#007bff';

        cell.textContent = '';
        cell.appendChild(a);
        otherNodes.forEach(n => cell.appendChild(n));

        cell.dataset.processed = '1';
        console.log('[TM] cell processed');
    }

    function makeTrackingClickable() {
        console.log('[TM] makeTrackingClickable()');
        document
            .querySelectorAll('#tracking_numbers tbody tr[data-id] > td:nth-child(2)')
            .forEach(processCell);
    }

    makeTrackingClickable();
    new MutationObserver(makeTrackingClickable)
        .observe(document.body, { childList: true, subtree: true });
    console.log('[TM] observer set');
})();