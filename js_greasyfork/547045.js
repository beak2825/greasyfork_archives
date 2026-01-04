// ==UserScript==
// @name        Yandex, I'm taken!
// @namespace   http://tampermonkey.net/
// @version     1.12
// @description Убирает назойливые баннеры Яндекса, включая скрытые плашки на Яндекс.Картинках 😤
// @author      Echo91
// @match       *://ya.ru/*
// @match       *://yandex.ru/*
// @match       *://yandex.ru/images/*
// @license     MIT
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547045/Yandex%2C%20I%27m%20taken%21.user.js
// @updateURL https://update.greasyfork.org/scripts/547045/Yandex%2C%20I%27m%20taken%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // *** Ключевая функция для проверки домена ***
    function shouldRunHere() {
        const url = location.href;
        return url.startsWith('https://ya.ru/') || url.startsWith('https://yandex.ru/');
    }

    // *** ГЛАВНАЯ ПРОВЕРКА: Если мы не на Яндексе, ПРЕКРАЩАЕМ выполнение. ***
    if (!shouldRunHere()) {
        console.log("YIT: Скрипт не активен на текущем домене.");
        return;
    }
    // --------------------------------------------------------------------------
    // ВЕСЬ код НИЖЕ будет выполняться ТОЛЬКО на yandex.ru или ya.ru
    // --------------------------------------------------------------------------

    // ===== Умеренная CSS Инъекция для скрытия баннеров (сохраняя галерею) =====
    // Мы удаляем слишком общие классы, такие как .Overlay и .Modal.
    const style = document.createElement('style');
    style.textContent = `
        /* Блокировка ТОЛЬКО баннерных и дистрибьюторских плашек */
        .Distribution-Popup,
        .Distribution-Actions, [class*="Distribution"],
        #DistributionPopupDesktop_renew-PhAPg2v, /* Ваш ID для пустого баннера */
        .splash,
        .yandex-browser-promo-hint
        {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // Уведомление о работе скрипта
    setTimeout(() => {
        // Проверка location.href здесь больше не нужна, так как весь скрипт активен только на Яндексе
        showNotification("😤 Yandex, I'm taken! 😤");
    }, 50);
// =========================================================

    const showToast = true;
    const toastMs = 3000;
    const quickTextCheckRx = /Сделать Яндекс|Установить поиск Яндекса|Я\.Браузер|Яндекс Браузер/i;
    const popupTextRx = /(Сделать Яндекс основным поиском|Сделать Яндекс поиском по умолчанию\?|Сделать поиск Яндекса основным\?|Установить поиск Яндекса)/i;
    const ybrowserRx = /(Яндекс Браузер|Я\.Браузер|Я\.Браузер пересказывает|Я\.Браузер переводит)/i;

    const searchSelectors =
        '.Distribution-Popup, .Distribution-Actions, [class*="Distribution"], .Modal, [role="dialog"], .popup, .Popup, .Overlay, .splash, .splash-screen, #DistributionPopupDesktop_renew-PhAPg2v'; // <-- ДОБАВЛЕН ВАШ НОВЫЙ ID

    function showNotification(text) {
        if (!showToast) return;
        let note = document.getElementById('yit-toast');
        if (!note) {
            note = document.createElement('div');
            note.id = 'yit-toast';
            document.body.appendChild(note);
        }
        note.textContent = text;
        Object.assign(note.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 2147483647,
            fontFamily: 'sans-serif',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            transition: 'opacity .4s ease',
            opacity: '1',
            pointerEvents: 'none'
        });
        setTimeout(() => {
            note.style.opacity = '0';
            setTimeout(() => note.remove(), 450);
        }, toastMs);
    }

    function isVisible(el) {
        if (!el || !document.body.contains(el)) return false;
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }

    function hideBanner(el) {
        if (!el) return;

        const ignoreSelectors = [
            '.header', '.head', '.header2', '.services', '.usermenu', '.passport',
            '.desk-notif', '.topmenu', '.b-topbar', '.HeadBanner-Wrapper', '.navigation'
        ];
        if (
            el.closest(ignoreSelectors.join(',')) ||
            el.offsetHeight < 40 ||
            el.querySelector('input[name="text"], input[type="search"]')
        ) {
            return;
        }

        el.style.maxHeight = '0';
        el.style.overflow = 'hidden';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.transition = 'opacity .25s ease, max-height .25s ease';
    }

    function findPopupContainer(startEl) {
        let el = startEl;
        let lastCandidate = startEl;
        while (el && el !== document.body) {
            const cls = (el.className || '') + '';
            const s = getComputedStyle(el);
            const z = parseInt(s.zIndex) || 0;
            if ((s.position === 'fixed' || s.position === 'absolute') && z >= 1) return el;
            if (/popup|Popup|modal|Modal|Distribution|distr|overlay/i.test(cls)) return el;
            lastCandidate = el;
            el = el.parentElement;
        }
        return lastCandidate || startEl;
    }

    function isPopupLike(el) {
        const style = getComputedStyle(el);
        const z = parseInt(style.zIndex) || 0;
        return (style.position === 'fixed' || style.position === 'absolute') && z > 400;
    }

    let actedForUrl = null;

    async function tryClosePopups() {
        // Проверка shouldRunHere() здесь больше не нужна благодаря глобальной проверке
        // if (!shouldRunHere()) return; // Убрана!

        // ==== новый фикс: скрыть пустую нижнюю плашку ====
        const bottomPlate = document.querySelector(
            '.Distribution-Popup_position-right-bottom, .Distribution-Popup_position-right, [class*="Popup_position-right-bottom"], #DistributionPopupDesktop_renew-PhAPg2v' // <-- ДОБАВЛЕН ВАШ НОВЫЙ ID
        );
        if (bottomPlate && isVisible(bottomPlate)) {
            // Чтобы быть уверенным, что мы не скрываем что-то другое, проверим на отсутствие текста
            if (!popupTextRx.test(bottomPlate.innerText || '') && !ybrowserRx.test(bottomPlate.innerText || '')) {
                hideBanner(bottomPlate);
                showNotification("😤 Yandex, I'm taken! 😤");
            }
        }

        if (!quickTextCheckRx.test(document.body.innerText)) return;

        const currentUrl = location.href;
        if (actedForUrl === currentUrl) return;

        const nodes = Array.from(document.querySelectorAll(searchSelectors));
        const candidates = nodes.filter(
            n =>
                isVisible(n) &&
                (popupTextRx.test(n.innerText || '') || ybrowserRx.test(n.innerText || ''))
        );

        if (!candidates.length) return;

        for (const cand of candidates) {
            let container = findPopupContainer(cand);
            if (!container || !isVisible(container)) continue;

            if (isPopupLike(container)) {
                hideBanner(container);
                showNotification("😤 Yandex, I'm taken! 😤");
                actedForUrl = currentUrl;
                return;
            }

            hideBanner(cand);
            showNotification("😤 Yandex, I'm taken! 😤");
            actedForUrl = currentUrl;
            return;
        }
    }

    // function shouldRunHere() {
    //   // Функция оставлена выше и используется для глобальной проверки
    // }

    (function () {
        const wrap = (type) => {
            const orig = history[type];
            return function (...args) {
                const res = orig.apply(this, args);
                window.dispatchEvent(new Event('locationchange'));
                return res;
            };
        };
        history.pushState = wrap('pushState');
        history.replaceState = wrap('replaceState');
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', () => {
            actedForUrl = null;
            setTimeout(() => tryClosePopups().catch(console.error), 500);
        });
    })();

    window.addEventListener('load', () => setTimeout(() => tryClosePopups().catch(console.error), 100));
    const observer = new MutationObserver(() => {
        clearTimeout(observer._deb);
        observer._deb = setTimeout(() => tryClosePopups().catch(console.error), 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });
// ===== Безопасный ловец поздних баннеров для Яндекс.Картинок =====
// Убирает только реальные рекламные плашки, не затрагивая галерею
    setInterval(() => {

        // Ищем все элементы с фиксированной или абсолютной позицией
        const lateBanners = Array.from(document.querySelectorAll(`
            div[style*="position: fixed"],
            div[style*="position: absolute"]
        `)).filter(bn => isVisible(bn)); // Добавляем проверку, что элемент видим

        if (!lateBanners.length) return;

        for (const bn of lateBanners) {

            const style = getComputedStyle(bn);
            const z = parseInt(style.zIndex) || 0;

            // Игнорируем элементы с низким z-index (обычно это часть макета)
            if (z < 100) continue;

            // Игнорируем большие элементы (галерею, шапку)
            const rect = bn.getBoundingClientRect();

            // Сама галерея огромна, а баннер — маленький
            const tiny = rect.width < 500 && rect.height < 250; // Немного увеличим высоту для запаса

            // Игнорируем элементы, которые слишком близко к центру или краю
            if (rect.left < 50 && rect.top < 50) continue;

            // Баннер всегда появляется справа-снизу
            const inRightBottom =
                rect.bottom > window.innerHeight - 250 && // В пределах 250px от нижнего края
                rect.right > window.innerWidth - 250 && // В пределах 250px от правого края
                rect.width > 30; // Игнорируем совсем крошечные невидимые элементы

            if (tiny && inRightBottom) {
                hideBanner(bn);
                console.log("YIT: поздний/пустой баннер Яндекс.Картинок скрыт агрессивно!");

                // Дополнительно скрываем ближайший родительский оверлей (если есть)
                const overlay = bn.closest('.Overlay, .splash-screen');
                if (overlay) {
                    hideBanner(overlay);
                    console.log("YIT: скрыт также родительский оверлей.");
                }

                // Можно показать уведомление, чтобы видеть, что сработало
                showNotification("😤 Yandex, I'm taken! 😤");
                return; // Останавливаемся после нахождения
            }
        }

    }, 400);


})();