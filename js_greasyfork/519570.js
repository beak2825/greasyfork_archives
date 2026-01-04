// ==UserScript==
// @name         BaseLinker Cardboard Dimensions
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  Cardboard Dimensions helper for BaseLinker
// @author       Smerechuk
// @match        https://panel.baselinker.com/orders*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baselinker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519570/BaseLinker%20Cardboard%20Dimensions.user.js
// @updateURL https://update.greasyfork.org/scripts/519570/BaseLinker%20Cardboard%20Dimensions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COURIER_ALIASES = {
        "InPost Paczkomat": ["Paczkomat InPost", "Paczkomaty InPost", "Paczkomaty InPost pobranie", "Allegro Paczkomaty InPost", "InPost Paczkomaty 24/7 - wszystkie rozmiary", "InPost Paczkomat 24/7 - wszystkie rozmiary", "ERLI InPost Paczkomaty 24/7 - 25 kg"],
        "Poczta Polska": ["Poczta Polska - odbiór w punkcie", "Pocztex", "Poczta Polska Pocztex Kurier doręczenie pod wskazany adres", "Poczta Polska Pocztex Kurier doręczenie do automatu", "Allegro Kurier Pocztex", "Allegro Odbiór w Punkcie Pocztex", "Allegro Kurier Pocztex pobranie", "Żabka", "ERLI Pocztex Kurier - (punkt - drzwi) - S", "ERLI Pocztex Kurier - (punkt - drzwi) - M", "ERLI Pocztex Kurier - (punkt - drzwi) - L", "ERLI Pocztex Kurier - (punkt - drzwi) - XL"],
        "ORLEN": ["Allegro Automat ORLEN Paczka", "Allegro Odbiór w Punkcie ORLEN Paczka", "ORLEN Paczka", "Orlen Paczka wszystkie wymiary", "ERLI Orlen Paczka - 5 kg", "ERLI Orlen Paczka - 20 kg", "ERLI Orlen Paczka - 25 kg", "ERLI Orlen Paczka - S", "ERLI Orlen Paczka - M", "ERLI Orlen Paczka - L"],
        "Allegro One": ["Allegro One Box, DPD", "Allegro One Box, UPS", "Allegro One Box, One Kurier", "Allegro One Punkt, UPS", "Allegro One Punkt, DPD", "Allegro One Punkt, One Kurier"],
        "DHL BOX": ["Allegro Automat DHL BOX 24/7", "Allegro Odbiór w Punkcie DHL"],
        "Packeta": ["Allegro Wysyłka z Polski do Czech - Automaty Paczkowe Packeta", "Allegro Wysyłka z Polski do Czech - Odbiór w Punkcie Packeta", "Allegro Wysyłka z Polski do Czech - Odbiór w Punkcie Packeta pobranie"],
        "DPD Pickup Station": ["DPD Pickup Station"]
    };

    const COURIER_DIMENSIONS = {
        "InPost Paczkomat": [{ label: "Gabaryt A", size: [8, 38, 64] }, { label: "Gabaryt B", size: [19, 38, 64] }, { label: "Gabaryt C", size: [41, 38, 64] }],
        "ORLEN": [{ label: "Gabaryt S", size: [8, 38, 60] }, { label: "Gabaryt M", size: [19, 38, 60] }, { label: "Gabaryt L", size: [38, 41, 60] }],
        "Poczta Polska": [{ label: "Gabaryt S", size: [9, 40, 65] }, { label: "Gabaryt M", size: [20, 40, 65] }, { label: "Gabaryt L", size: [42, 40, 65] }, { label: "Gabaryt XL", size: [60, 60, 70] }],
        "Allegro One": [{ label: "Gabaryt S", size: [8, 38, 64] }, { label: "Gabaryt M", size: [19, 38, 64] }, { label: "Gabaryt L", size: [41, 38, 64] }],
        "DHL BOX": [{ label: "Gabaryt S", size: [8, 38, 64] }, { label: "Gabaryt M", size: [19, 38, 64] }, { label: "Gabaryt L", size: [41, 38, 64] }],
        "Packeta": [{ label: "Gabaryt S", size: [8, 45, 61] }, { label: "Gabaryt M", size: [17, 45, 61] }, { label: "Gabaryt L", size: [41, 38, 64] }],
        "DPD Pickup Station": [{ label: "Gabaryt S", size: [11, 44, 59] }, { label: "Gabaryt M", size: [24, 44, 59] }, { label: "Gabaryt L", size: [50, 44, 59] }]
    };

    const aliasesMap = new Map();
    Object.entries(COURIER_ALIASES).forEach(([key, values]) => values.forEach(v => aliasesMap.set(v, key)));
    Object.values(COURIER_DIMENSIONS).forEach(dims => dims.forEach(d => d.sorted = [...d.size].sort((a, b) => a - b)));

    const style = document.createElement('style');
    style.textContent = `
        #pack-dimensions-info { display: flex; justify-content: flex-end; margin: 5px 0 10px 0; }
        .pd-wrapper {
            display: flex; flex-direction: column;
            color: #333; font-size: 18px;
            border: 1px solid #e0e0e0;
            min-width: 250px;
            font-family: 'Open Sans', sans-serif;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .pd-header { background: #fbe4e4; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; }
        .pd-list { background: #fff5f5; padding: 8px 12px; line-height: 1.6; }
        .pd-status { padding: 8px 12px; font-weight: bold; border-top: 1px solid #eee; text-align: center; font-size: 15px; }
        .pd-fit { background: #dff0d8; color: #3c763d; }
        .pd-no-fit { background: #fcf8e3; color: #8a6d3b; }
    `;
    document.head.appendChild(style);

    function canFit(pDims, gDims) {
        const sP = [...pDims].sort((a, b) => a - b);
        return sP.every((val, i) => val <= gDims[i]);
    }

    function hideInfoPanel(currentSaleId) {
        const container = document.getElementById('pick_pack_sale_info_container');
        if (!container) return;

        let el = document.getElementById('pack-dimensions-info');
        if (!el) {
            el = document.createElement('div');
            el.id = 'pack-dimensions-info';
            container.appendChild(el);
        }

        el.style.display = 'none';
        el.innerHTML = '';
        if (currentSaleId) {
            el.setAttribute('data-order-id', currentSaleId);
        }
    }

    function renderDimensions() {
        const container = document.getElementById('pick_pack_sale_info_container');
        if (!container) return;

        const currentSaleId = (typeof getCurrentPickPackSaleId !== 'undefined') ? getCurrentPickPackSaleId() : null;
        if (!currentSaleId) {
             const el = document.getElementById('pack-dimensions-info');
             if(el) el.remove();
             return;
        }

        if (typeof getSaleTab === 'undefined') {
             hideInfoPanel(currentSaleId);
             return;
        }

        const saleTab = getSaleTab(currentSaleId);
        const saleInfo = saleTab ? getTabSaleInfo(saleTab) : null;

        if (!saleInfo || !saleInfo.comments) {
            hideInfoPanel(currentSaleId);
            return;
        }

        const shippingMatch = saleInfo.comments.match(/<i class="fal fa-truck .*?<\/i>&nbsp;([\s\S]+?)(?:\s*\(|<\/div>)/);
        
        if (!shippingMatch) {
            hideInfoPanel(currentSaleId);
            return;
        }

        const courierName = aliasesMap.get(shippingMatch[1].trim());

        if (!courierName || !COURIER_DIMENSIONS[courierName]) {
             hideInfoPanel(currentSaleId);
             return;
         }

        const gabaryty = COURIER_DIMENSIONS[courierName];
        let productDimensions = null;
        let fitHtml = '';

        if (typeof Result !== 'undefined' && saleInfo.cardboard_info) {
            try {
                const res = new Result(saleInfo.cardboard_info);
                if (res.IsSuccess) {
                    const parsed = JSON.parse(res.Val);
                    const items = parsed.items;
                    if (items && items.length === 1) {
                        productDimensions = [parseFloat(items[0].size_x), parseFloat(items[0].size_y), parseFloat(items[0].size_z)];
                    }
                }
            } catch (e) { console.error(e); }
        }

        if (productDimensions) {
            const fit = gabaryty.find(g => canFit(productDimensions, g.sorted));
            fitHtml = `<div class="pd-status ${fit ? 'pd-fit' : 'pd-no-fit'}">Prawdopodobnie: ${fit ? fit.label : 'Nie mieści się'}</div>`;
        }

        const dimsList = gabaryty.map(d => `<div>- ${d.label}: <b>${d.size.join(' x ')}</b></div>`).join('');

        let el = document.getElementById('pack-dimensions-info');
        if (!el) {
            el = document.createElement('div');
            el.id = 'pack-dimensions-info';
            container.appendChild(el);
        }

        el.style.display = 'flex';
        el.setAttribute('data-order-id', currentSaleId);

        el.innerHTML = `
            <div class="pd-wrapper">
                <div class="pd-header">Wysyłka: ${courierName}</div>
                <div class="pd-list">${dimsList}</div>
                ${fitHtml}
            </div>`;
    }

    let timer;
    const observer = new MutationObserver(mutations => {
        if (typeof getCurrentPickPackSaleId === 'undefined') return;
        const currentSaleId = getCurrentPickPackSaleId();
        if (!currentSaleId) return;

        const existingEl = document.getElementById('pack-dimensions-info');
        const displayedId = existingEl ? existingEl.getAttribute('data-order-id') : null;

        if (displayedId == currentSaleId) {
            return;
        }

        let meaningfulMutation = false;
        for (const m of mutations) {
            if (m.target.id === 'pack-dimensions-info' || m.target.closest('#pack-dimensions-info')) continue;

            if (
                (m.target.classList && m.target.classList.contains('sale_tab_active')) ||
                (m.target.id === 'sales_pick_pack_modal_body') ||
                (m.target.closest && m.target.closest('#sales_pick_pack_modal_body'))
            ) {
                meaningfulMutation = true;
                break;
            }
        }

        if (meaningfulMutation) {
            clearTimeout(timer);
            timer = setTimeout(renderDimensions, 100);
        }
    });

    observer.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] });
})();