// ==UserScript==
// @name         WB: Фильтр + Удаление визуального шума ✅
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Фильтр товаров и удаление лишних элементов, минималистичный UI
// @author       thetacursed
// @match        https://www.wildberries.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533544/WB%3A%20%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%2B%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%D0%B8%D0%B7%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%88%D1%83%D0%BC%D0%B0%20%E2%9C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/533544/WB%3A%20%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%2B%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%D0%B8%D0%B7%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%88%D1%83%D0%BC%D0%B0%20%E2%9C%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultSettings = {
        minReviews: 400,
        minRating: 4.0,
        hideVisualNoise: true
    };

    function getSettings() {
        return {
            minReviews: parseInt(localStorage.getItem('wb_min_reviews') || defaultSettings.minReviews),
            minRating: parseFloat(localStorage.getItem('wb_min_rating') || defaultSettings.minRating),
            hideVisualNoise: localStorage.getItem('wb_hide_visual_noise') !== 'false'
        };
    }

    function saveSettings(settings) {
        localStorage.setItem('wb_min_reviews', settings.minReviews);
        localStorage.setItem('wb_min_rating', settings.minRating);
        localStorage.setItem('wb_hide_visual_noise', settings.hideVisualNoise);
    }

    function parseReviews(text) {
        const cleaned = text.replace(/\s/g, '');
        const match = cleaned.match(/\d+/g);
        return match ? parseInt(match.join(''), 10) : 0;
    }

    function parseRating(text) {
        return parseFloat(text.replace(',', '.'));
    }

    let counterElement;

    function hideBadCards() {
        const settings = getSettings();
        let hiddenCount = 0;

        document.querySelectorAll('article.product-card').forEach(card => {
            if (card.dataset.filtered) return;

            const reviewElem = card.querySelector('.product-card__count');
            const ratingElem = card.querySelector('.address-rate-mini');

            const reviews = reviewElem ? parseReviews(reviewElem.textContent) : 0;
            const rating = ratingElem ? parseRating(ratingElem.textContent) : 0;

            if (reviews < settings.minReviews || rating < settings.minRating) {
                card.style.display = 'none';
                hiddenCount++;
            }

            card.dataset.filtered = 'true';
        });

        if (counterElement) {
            const visible = document.querySelectorAll('article.product-card[data-filtered="true"]:not([style*="display: none"])').length;
            const total = document.querySelectorAll('article.product-card[data-filtered="true"]').length;
            counterElement.textContent = `Скрыто: ${total - visible}`;
        }
    }

    function hideVisualNoise() {
        const settings = getSettings();
        if (!settings.hideVisualNoise) return;

        const elementsToHide = [
            '.product-card__tips.product-card__tips--bottom',
            '.search-tags__list.j-tags-list',
            '.search-tags__header.section-header',
            '.custom-slider.custom-slider--goods',
            '.goods-slider__header.section-header',
            '.goods-slider__see-all'
        ];

        elementsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    function debounce(func, delay) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, delay);
        };
    }

    function createUI() {
        const settings = getSettings();

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '15px';
        panel.style.right = '15px';
        panel.style.background = 'rgba(255, 255, 255, 0.95)';
        panel.style.border = '1px solid #e0e0e0';
        panel.style.borderRadius = '12px';
        panel.style.padding = '16px';
        panel.style.fontSize = '14px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        panel.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        panel.style.minWidth = '200px';
        panel.style.backdropFilter = 'blur(8px)';
        panel.style.color = '#333';

        panel.innerHTML = `
            <div style="margin-bottom: 12px; font-weight: 500; font-size: 15px;">WB Фильтры</div>
            <div style="display: grid; gap: 12px;">
                <div style="display: grid; gap: 4px;">
                    <label style="font-size: 13px; color: #555;">Мин. рейтинг</label>
                    <input type="number" step="0.1" min="0" max="5" id="wb_min_rating" value="${settings.minRating}"
                           style="padding: 6px 8px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px;">
                </div>
                <div style="display: grid; gap: 4px;">
                    <label style="font-size: 13px; color: #555;">Мин. отзывов</label>
                    <input type="number" step="1" min="0" id="wb_min_reviews" value="${settings.minReviews}"
                           style="padding: 6px 8px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px;">
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                    <input type="checkbox" id="wb_hide_visual_noise" ${settings.hideVisualNoise ? 'checked' : ''}
                           style="margin: 0; width: 16px; height: 16px;">
                    <label for="wb_hide_visual_noise" style="font-size: 13px;">Убрать визуальный шум</label>
                </div>
                <button id="wb_apply_filter"
                        style="padding: 8px 12px; background: #a73afd; color: white; border: none; border-radius: 6px;
                               font-size: 13px; cursor: pointer; transition: background 0.2s;">
                    Применить
                </button>
                <div id="wb_hidden_count" style="font-size: 12px; color: #666; text-align: center;">Скрыто: 0</div>
            </div>
        `;

        document.body.appendChild(panel);
        counterElement = document.getElementById('wb_hidden_count');

        document.getElementById('wb_apply_filter').addEventListener('click', () => {
            const newSettings = {
                minRating: parseFloat(document.getElementById('wb_min_rating').value),
                minReviews: parseInt(document.getElementById('wb_min_reviews').value, 10),
                hideVisualNoise: document.getElementById('wb_hide_visual_noise').checked
            };
            saveSettings(newSettings);
            location.reload();
        });

        // Добавляем hover-эффект для кнопки
        const applyBtn = document.getElementById('wb_apply_filter');
        applyBtn.addEventListener('mouseenter', () => {
            applyBtn.style.background = '#303f9f';
        });
        applyBtn.addEventListener('mouseleave', () => {
            applyBtn.style.background = '#3f51b5';
        });
    }

    // ——— Запуск ———
    createUI();
    hideBadCards();
    hideVisualNoise();

    const debouncedHide = debounce(() => {
        hideBadCards();
        hideVisualNoise();
    }, 500);

    const observer = new MutationObserver(debouncedHide);
    observer.observe(document.body, { childList: true, subtree: true });
})();