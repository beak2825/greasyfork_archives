// ==UserScript==
// @name         kinopoisk → sspoisk (rate-style near rating + style for "Быть смелее")
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  Добавляет кнопку "Смотреть онлайн" рядом с оценкой; fallback — слева от "Буду смотреть". Плюс стилизует "Быть смелее" под неё.
// @author       ChatGPT + Grok tweak
// @match        *://www.kinopoisk.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528347/kinopoisk%20%E2%86%92%20sspoisk%20%28rate-style%20near%20rating%20%2B%20style%20for%20%22%D0%91%D1%8B%D1%82%D1%8C%20%D1%81%D0%BC%D0%B5%D0%BB%D0%B5%D0%B5%22%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528347/kinopoisk%20%E2%86%92%20sspoisk%20%28rate-style%20near%20rating%20%2B%20style%20for%20%22%D0%91%D1%8B%D1%82%D1%8C%20%D1%81%D0%BC%D0%B5%D0%BB%D0%B5%D0%B5%22%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function applyButtonStyle(btn) {
        if (!btn || btn.classList.contains('kp-rate-style-applied')) return;
        btn.classList.add('kp-rate-style-applied');
        Object.assign(btn.style, {
            display: 'inline-block',
            padding: '6px 10px',
            fontSize: '13px',
            border: '1px solid #dcdcdc',
            borderRadius: '6px',
            background: '#fff !important',
            color: '#222 !important',
            cursor: 'pointer',
            marginLeft: '10px',
            boxShadow: 'none !important',
            lineHeight: '1',
            fontWeight: '600',
        });
        const originalShadow = btn.style.boxShadow;
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06) !important';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = originalShadow;
        });
    }
    function createRateButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Смотреть онлайн';
        btn.className = 'kp-rate-style-button';
        applyButtonStyle(btn);
        btn.addEventListener('click', () => {
            const newUrl = window.location.href.replace('kinopoisk.ru/', 'sspoisk.ru/');
            window.open(newUrl, '_blank');
        });
        return btn;
    }
    function findRatingElement() {
        const els = Array.from(document.querySelectorAll('span, div, a')).filter(el => {
            const t = el.textContent.trim();
            return /^\d{1,2}(\.\d)?$/.test(t);
        });
        if (!els.length) return null;
        for (const el of els) {
            let node = el;
            for (let i = 0; i < 5 && node; i++) {
                if (node.parentElement && node.parentElement !== document.body) return node.parentElement;
                node = node.parentElement;
            }
        }
        return els[0] || null;
    }
    function findBeSmelerButton() {
        return [...document.querySelectorAll('button')].find(b => /Быть смелее/i.test(b.innerText || b.textContent));
    }
    function insertRateButton() {
        if (document.querySelector('.kp-rate-style-button')) return;
        const ratingEl = findRatingElement();
        if (ratingEl) {
            const btn = createRateButton();
            const style = window.getComputedStyle(ratingEl);
            if (/(inline|flex)/.test(style.display)) {
                ratingEl.appendChild(btn);
            } else {
                ratingEl.parentElement.insertBefore(btn, ratingEl.nextSibling);
            }
            return;
        }
        // Fallback: слева от "Буду смотреть"
        const fallback = [...document.querySelectorAll('button')].find(b => /Буду смотреть/i.test(b.innerText || b.textContent));
        if (fallback) {
            const btn = createRateButton();
            btn.style.marginLeft = '0'; // Чтоб не отползала слева
            const parent = fallback.parentNode;
            // Всегда оборачиваем в flex, чтоб наверняка в ряд встали
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '10px';
            wrapper.style.marginTop = '10px'; // Чтоб не прилипло к верху
            // Удаляем фоллбек из текущего места и вставляем в обертку
            parent.removeChild(fallback);
            parent.insertBefore(wrapper, fallback); // Вставляем обертку на место фоллбека
            wrapper.appendChild(btn);
            wrapper.appendChild(fallback);
            // Добавляем margin-right на вторую кнопку для баланса, если надо
            fallback.style.marginRight = '0';
        } else {
            // Старый fallback для других кнопок
            const oldFallback = [...document.querySelectorAll('button')].find(b => /Добавить в папку|В папку/i.test(b.innerText));
            if (oldFallback) {
                const btn = createRateButton();
                btn.style.display = 'block';
                btn.style.width = '100%';
                btn.style.marginLeft = '0';
                btn.style.marginTop = '10px';
                oldFallback.parentNode.insertBefore(btn, oldFallback.nextSibling);
            }
        }
    }
    function styleBeSmelerButton() {
        const beSmelerBtn = findBeSmelerButton();
        if (beSmelerBtn) {
            applyButtonStyle(beSmelerBtn);
        }
    }
    function init() {
        insertRateButton();
        styleBeSmelerButton();
    }
    const observer = new MutationObserver(() => {
        insertRateButton();
        styleBeSmelerButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    init();
    setTimeout(init, 1200);
    setTimeout(init, 3500);
})();