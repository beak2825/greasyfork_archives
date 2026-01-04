// ==UserScript==
// @name         Accor Najniższe Ceny Hoteli
// @namespace    http://nowak.re
// @version      1.1
// @description  Szukaj najniższych cen w kalendarzach hoteli Accor
// @author       theq
// @match        https://all.accor.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542154/Accor%20Najni%C5%BCsze%20Ceny%20Hoteli.user.js
// @updateURL https://update.greasyfork.org/scripts/542154/Accor%20Najni%C5%BCsze%20Ceny%20Hoteli.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Dodaj przycisk na stronie
    const button = document.createElement('button');
    button.textContent = '🔍 Szukaj najniższych cen';
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#e91e63';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', async () => {
        button.disabled = true;
        button.textContent = '⏳ Przetwarzanie...';

        const results = [];
        const today = new Date();
        
        let prevHeight = 0;
        while (true) {
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(1000);
            const currentHeight = document.body.scrollHeight;
            if (currentHeight === prevHeight) break;
            prevHeight = currentHeight;
        }
        console.log('✅ Wszystkie hotele załadowane.');

        const hotelButtons = document.querySelectorAll('button[data-testid="price-calendar-link"]');
        console.log(`🔍 Znaleziono ${hotelButtons.length} hoteli.`);

        for (let i = 0; i < hotelButtons.length; i++) {
            const btn = hotelButtons[i];
            // Pobierz nazwę hotelu
            const container = btn.closest('.result-list-item');
            const hotelNameElem = container ? container.querySelector('h2 .ads-link__content') : null;
            const hotelName = hotelNameElem ? hotelNameElem.innerText.trim() : `Hotel #${i + 1}`;
            console.log(`🏨 ${i + 1}/${hotelButtons.length}: ${hotelName}`);

            // Kliknij przycisk aby otworzyć kalendarz
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            btn.click();
            await waitForSelector('.ads-modal__content', 5000);

            const modal = document.querySelector('.ads-modal__content');
            const calendar = modal.querySelector('.price-calendar-content__calendar-availabilities');

            console.log('  ↪️ Przewijanie kalendarza...');
            let attempts = 0;
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 90);
            while (attempts < 25) { // max 25 przewinięć
                const dates = [...modal.querySelectorAll('[data-date]')]
                    .map(e => new Date(e.getAttribute('data-date')))
                    .filter(d => !isNaN(d))
                    .sort((a, b) => a - b);
                if (dates.length > 0) {
                    const lastDate = dates[dates.length - 1];
                    console.log(`    📅 Ostatnia data w kalendarzu: ${lastDate.toISOString().split('T')[0]}`);
                    if (lastDate >= targetDate) break;
                }
                calendar.scrollBy(0, calendar.clientHeight / 2);
                await sleep(700);
                attempts++;
            }

            // Szukaj najniższej ceny w kalendarzu
            const days = modal.querySelectorAll('button.calendar-item');
            let minPrice = null;
            let minDate = null;

            days.forEach(day => {
                // Pobierz datę (data-date lub alternatywnie)
                let date = day.getAttribute('data-date');
                if (!date) {
                    const dayNumElem = day.querySelector('.ui-heading-02');
                    const dayNum = dayNumElem ? dayNumElem.innerText.trim() : '';
                    const monthYearElem = day.closest('.price-calendar-content__list').previousElementSibling;
                    const monthYear = monthYearElem ? monthYearElem.innerText.trim() : '';
                    date = `${monthYear} ${dayNum}`; // np. "lipiec 2025 15"
                }
                const priceElem = day.querySelector('[data-testid="calendar-offer-price"]');
                if (priceElem) {
                    const priceText = priceElem.innerText.replace(/[^\d]/g, '');
                    const price = parseInt(priceText, 10);
                    if (!isNaN(price) && (minPrice === null || price < minPrice)) {
                        minPrice = price;
                        minDate = date;
                    }
                }
            });

            console.log(`  💰 Najniższa cena: ${minPrice} (${minDate})`);
            results.push({ hotel: hotelName, price: minPrice, date: minDate });

            // Zamknij modal
            const closeBtn = document.querySelector('.ads-modal__close-button');
            if (closeBtn) closeBtn.click();
            await sleep(500);
        }

        console.table(results);

        // Wyświetl podsumowanie na stronie
        showSummary(results);

        button.disabled = false;
        button.textContent = '🔍 Szukaj najniższych cen';
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForSelector(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                if (document.querySelector(selector)) {
                    clearInterval(timer);
                    resolve();
                } else if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for selector: ${selector}`));
                }
                elapsed += interval;
            }, interval);
        });
    }

    function showSummary(results) {
        const summaryDiv = document.createElement('div');
        summaryDiv.style.position = 'fixed';
        summaryDiv.style.top = '50px';
        summaryDiv.style.left = '50%';
        summaryDiv.style.transform = 'translateX(-50%)';
        summaryDiv.style.backgroundColor = 'white';
        summaryDiv.style.border = '2px solid #333';
        summaryDiv.style.borderRadius = '8px';
        summaryDiv.style.padding = '15px';
        summaryDiv.style.zIndex = '10000';
        summaryDiv.style.maxHeight = '70vh';
        summaryDiv.style.overflowY = 'auto';
        summaryDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖ Zamknij';
        closeBtn.style.float = 'right';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => summaryDiv.remove();

        const title = document.createElement('h2');
        title.textContent = '📊 Podsumowanie najniższych cen';
        title.style.marginTop = '0';

        const list = document.createElement('ul');
        results.forEach(r => {
            const item = document.createElement('li');
            item.textContent = `${r.hotel}: ${r.price || 'Brak danych'} (${r.date || '-'})`;
            list.appendChild(item);
        });

        summaryDiv.appendChild(closeBtn);
        summaryDiv.appendChild(title);
        summaryDiv.appendChild(list);
        document.body.appendChild(summaryDiv);
    }
})();
