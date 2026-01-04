// ==UserScript==
// @name         Custom Oxide
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  Новый стиль, добавление фильтра цены, добавление двух кнопок "Запросить обновление"
// @author       YOO | PGR-RUST | YOLO!
// @match        https://oxide-russia.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oxide-russia.ru
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539578/Custom%20Oxide.user.js
// @updateURL https://update.greasyfork.org/scripts/539578/Custom%20Oxide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_FROM = 'oxidePriceFilterFrom';
    const STORAGE_KEY_TO = 'oxidePriceFilterTo';
    const FILTER_CONTAINER_CLASS = 'price-filter-container';

    function applyFilter(fromVal, toVal) {
        const resourceItems = document.querySelectorAll('.structItem.structItem--resource');
        resourceItems.forEach(item => {
            const priceSpan = item.querySelector('span.label.label--primary.label--smallest');
            if (!priceSpan) {
                item.style.display = 'none';
                return;
            }
            const priceText = priceSpan.textContent.trim().replace('₽', '').replace(',', '.');
            const price = parseFloat(priceText);

            let show = true;
            if (!isNaN(fromVal) && price < fromVal) show = false;
            if (!isNaN(toVal) && price > toVal) show = false;

            item.style.display = show ? '' : 'none';
        });
    }

    function createPriceFilter() {
        const filterBar = document.querySelector('.filterBar');
        if (!filterBar || document.querySelector(`.${FILTER_CONTAINER_CLASS}`)) return;

        const container = document.createElement('div');
        container.className = FILTER_CONTAINER_CLASS;
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.marginRight = '12px';
        container.style.gap = '6px';

        const label = document.createElement('span');
        label.textContent = 'Цена:';
        label.style.color = '#333';
        label.style.fontWeight = '600';
        container.appendChild(label);

        const inputFrom = document.createElement('input');
        inputFrom.type = 'number';
        inputFrom.min = '0';
        inputFrom.placeholder = 'От';
        inputFrom.style.width = '70px';
        inputFrom.style.padding = '4px 6px';
        container.appendChild(inputFrom);

        const inputTo = document.createElement('input');
        inputTo.type = 'number';
        inputTo.min = '0';
        inputTo.placeholder = 'До';
        inputTo.style.width = '70px';
        inputTo.style.padding = '4px 6px';
        container.appendChild(inputTo);

        const btn = document.createElement('button');
        btn.textContent = 'Принять';
        btn.className = 'button button--primary';
        btn.style.padding = '6px 12px';
        container.appendChild(btn);

        const filtersLink = filterBar.querySelector('a.filterBar-menuTrigger');
        if (filtersLink) filterBar.insertBefore(container, filtersLink);

        const savedFrom = localStorage.getItem(STORAGE_KEY_FROM);
        const savedTo = localStorage.getItem(STORAGE_KEY_TO);

        if (savedFrom !== null) inputFrom.value = savedFrom;
        if (savedTo !== null) inputTo.value = savedTo;

        if ((savedFrom !== null && savedFrom !== '') || (savedTo !== null && savedTo !== '')) {
            applyFilter(parseFloat(savedFrom), parseFloat(savedTo));
        }

        btn.addEventListener('click', () => {
            const fromVal = inputFrom.value.trim();
            const toVal = inputTo.value.trim();

            localStorage.setItem(STORAGE_KEY_FROM, fromVal);
            localStorage.setItem(STORAGE_KEY_TO, toVal);

            applyFilter(parseFloat(fromVal), parseFloat(toVal));
        });
    }

    function hookHistoryEvents(callback) {
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function() {
            pushState.apply(this, arguments);
            callback();
        };

        history.replaceState = function() {
            replaceState.apply(this, arguments);
            callback();
        };

        window.addEventListener('popstate', callback);
    }

    function observeContentChanges() {
        const target = document.querySelector('.p-body-main');
        if (!target) return;

        const observer = new MutationObserver(() => {
            createPriceFilter();

            const savedFrom = localStorage.getItem(STORAGE_KEY_FROM);
            const savedTo = localStorage.getItem(STORAGE_KEY_TO);
            if (savedFrom || savedTo) {
                applyFilter(parseFloat(savedFrom), parseFloat(savedTo));
            }
        });

        observer.observe(target, { childList: true, subtree: true });
    }

    function init() {
        createPriceFilter();
        observeContentChanges();

        const savedFrom = localStorage.getItem(STORAGE_KEY_FROM);
        const savedTo = localStorage.getItem(STORAGE_KEY_TO);
        applyFilter(parseFloat(savedFrom), parseFloat(savedTo));

        hookHistoryEvents(() => {
            setTimeout(() => {
                createPriceFilter();
                const savedFrom = localStorage.getItem(STORAGE_KEY_FROM);
                const savedTo = localStorage.getItem(STORAGE_KEY_TO);
                applyFilter(parseFloat(savedFrom), parseFloat(savedTo));
            }, 300);
        });
    }

    window.addEventListener('load', init);
})();
window.addEventListener('load', () => {
    (function() {
        'use strict';


        function insertRequestButton() {
            const discussBtn = [...document.querySelectorAll('a.button.button--fullWidth')]
                .find(el => el.textContent.trim() === 'Обсудить ресурс');
            if (!discussBtn) return;

            if (document.querySelector('.button-request-update')) return;

            let authorName = null;
            const dls = document.querySelectorAll('dl.pairs.pairs--justified');
            dls.forEach(dl => {
                const dt = dl.querySelector('dt');
                if (dt && dt.textContent.trim() === 'Автор') {
                    const dd = dt.nextElementSibling;
                    const a = dd?.querySelector('a.username span');
                    if (a) authorName = a.textContent.trim();
                }
            });
            if (!authorName) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'button button--fullWidth button-request-update';
            btn.style.marginTop = '8px';
            btn.innerHTML = '<span class="button-text">Запросить обновление у автора</span>';

            btn.addEventListener('click', () => {
                const url = `https://oxide-russia.ru/direct-messages/add?to=${encodeURIComponent(authorName)}`;
                sessionStorage.setItem('dmTitle', 'Привет! Пожалуйста, обновите плагин');
                sessionStorage.setItem('dmMessage', location.href);
                window.open(url, '_blank');
            });

            discussBtn.insertAdjacentElement('afterend', btn);
        }

        insertRequestButton();

        if (location.pathname.startsWith('/direct-messages/add')) {
            const title = sessionStorage.getItem('dmTitle');
            const message = sessionStorage.getItem('dmMessage');

            if (title) {
                const titleInput = document.querySelector('input[name="title"]');
                if (titleInput) titleInput.value = title;
            }
            if (message) {
                const messageDiv = document.querySelector('div.fr-element.fr-view[contenteditable="true"]');
                if (messageDiv) {
                    messageDiv.innerHTML = `<p>${message}</p>`;
                }
            }

            sessionStorage.removeItem('dmTitle');
            sessionStorage.removeItem('dmMessage');
        }
    })();
});
(function () {
    'use strict';

    const TITLE_TEXT = 'Требуется обновление для следующего плагина';

    function insertButtonIfNotExists() {
        const sidebarGroup = document.querySelector('.resourceSidebarGroup--buttons');
        if (!sidebarGroup || sidebarGroup.querySelector('.button-add-update')) return;

        const updateButton = document.createElement('button');
        updateButton.className = 'button button--fullWidth button-add-update';
        updateButton.type = 'button';
        updateButton.style.marginTop = '8px';
        updateButton.innerHTML = '<span class="button-text">Запросить обновление у админа.</span>';

        updateButton.addEventListener('click', () => {
            const pluginURL = location.href;
            sessionStorage.setItem('updateRequestLink', pluginURL);
            sessionStorage.setItem('updateRequestTitle', TITLE_TEXT);
            window.open('https://oxide-russia.ru/support/categories/7/create', '_blank');
        });

        sidebarGroup.appendChild(updateButton);
    }


    const observer = new MutationObserver(() => {
        insertButtonIfNotExists();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    insertButtonIfNotExists();

    // ============ Заполнение формы ============
    if (location.href.includes('/support/categories/7/create')) {
        window.addEventListener('load', () => {
            const title = sessionStorage.getItem('updateRequestTitle');
            const link = sessionStorage.getItem('updateRequestLink');

            if (title && link) {
                const titleInput = document.querySelector('input[name="title"]');
                const linkInput = document.querySelector('input[name="custom_fields[resource_link]"]');

                if (titleInput) titleInput.value = title;
                if (linkInput) linkInput.value = link;

                sessionStorage.removeItem('updateRequestTitle');
                sessionStorage.removeItem('updateRequestLink');
            }
        });
    }
})();
(function () {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
    .feedback-type-positive::before {
    content: "👍 ";
    margin-right: 4px;
}
.feedback-type-neutral {
    color: rgba(255, 255, 255, 0.6);
}
.feedback-type-neutral::before {
    content: "🤝 ";
    margin-right: 4px;
}

.feedback-type-negative {
    color: #c51a1a;
}
.feedback-type-negative::before {
    content: "👎 ";
    margin-right: 4px;
}
.message--simple .message-cell.message-cell--user {
    flex: 0 0 110px;
    background: #0e203b;
}
.p-nav {
    color: #f8fafc;
    background: #0f172a;
    border-radius: 12px;
    padding: 0 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in-out;
}
.p-pageWrapper .p-navSticky.is-sticky .p-nav {
    background: #0c2665;
    border-radius: 0 !important;
}.p-body {
    display: flex;
    align-items: stretch;
    flex-grow: 1;
    min-height: 1px;
    position: relative;
    background-color: #0f172a;
}.p-footer-copyrightRow {
    order: 30;
    color: rgba(255, 255, 255, 0.6);
    background: #121b2c;
    padding-top: 20px;
    padding-bottom: 20px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.p-footer-copyrightRow:hover {
    background: #1a273a;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.2);
}.p-footer-inner {
    order: 20;
    padding-top: 15px;
    padding-bottom: 15px;
    background: #121b2c;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.p-footer-inner:hover {
    background: #1a273a;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 6px rgba(0, 0, 0, 0.2);
}.blockMessage {
    margin-bottom: 10px;
    padding: 20px;
    color: rgba(255, 255, 255, 0.87);
    background: #121b2c;
    border: 1px solid #1a273a;
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}



.blockMessage > * {
    position: relative;
    z-index: 1;
}.dcomSearchWidget form {
    background: #121b2c;
    position: relative;
    border: 1px solid #1a273a;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    padding-right: 87px;
    transition: all 0.3s ease;
}

.dcomSearchWidget form:hover {
    background: #1a273a;
    border-color: #1f304a;
    box-shadow: 0 0 10px rgba(0, 143, 251, 0.2);
}.dcomSearchWidget form .input {
    height: 34px;
    background: radial-gradient(#0f172a, #172341, transparent);
}.lfs .tabGroup .tabGroup-content .tabGroup-scroller {
    overflow-y: auto;
    scroll-behavior: smooth;
    max-height: 100%;
    height: 100%;
    background: radial-gradient(#0f172a, #0f172a, transparent);
}.block-container:not(.block-container--noStripRadius) > :first-child,
.block-topRadiusContent,
.block-container:not(.block-container--noStripRadius) > .block-body:first-child > .blockLink:first-child {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    background: #0f172a;
    box-shadow: 0 0 6px rgba(0, 143, 251, 0.2);
    position: relative;
    overflow: hidden;
}

.block-container:not(.block-container--noStripRadius) > :first-child::before,
.block-topRadiusContent::before,
.block-container:not(.block-container--noStripRadius) > .block-body:first-child > .blockLink:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: -75%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
        120deg,
        transparent,
        rgba(0, 143, 251, 0.1),
        transparent
    );

}


}.block-container:not(.block-container--noStripRadius) > :last-child,
.block-bottomRadiusContent,
.block-container:not(.block-container--noStripRadius) > .block-body:last-child > .blockLink:last-child,
.block-container:not(.block-container--noStripRadius) > .tabPanes:last-child > [role=tabpanel] > :last-child,
.block-container:not(.block-container--noStripRadius) > .tabPanes:last-child > [role=tabpanel] > .block-body > :last-child {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
    background: #0f172a;
    box-shadow: 0 0 6px rgba(0, 143, 251, 0.2);
}.widget-tabs {
    overflow: hidden;
    background: #0f172a;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 143, 251, 0.2);
}.block-body .node:first-child .node-body {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #0f172a;
    box-shadow: 0 0 6px rgba(0, 143, 251, 0.2);
}.node--depth2:nth-child(even) .node-body {
    background-color: #1a273a;
}.node-body {
    display: flex;
    background: linear-gradient(45deg, #192639, #0f172a, transparent);
}.block-row.block-row--minor {
    font-size: 1.4rem;
    background: radial-gradient(#0f172a, #131d35, #0f172a, transparent);
}

.input {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.87);
    background-color: #121b2c;
    border: 1px solid #1a273a;
    border-radius: 8px;
    padding: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    vertical-align: top;
    line-height: 1.4;
    text-align: left;
    word-wrap: break-word;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    box-shadow: 0 0 4px rgba(0, 143, 251, 0.1);
}.menu-header {
    padding: 10px;
    margin: 0;
    font-weight: 400;
    text-decoration: none;
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.87);
    background-color: #0f172a;
    border-bottom: 1px solid #1a273a;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}.menu-content>:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: #0f172a;
}.menu-linkRow {
    display: block;
    padding: 10px 10px;
    border-left: 2px solid transparent;
    color: rgba(255, 255, 255, 0.87);
    text-decoration: none;
    background-color: #0f172a;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.menu-linkRow:hover {
    background-color: #121b2c;
    border-left-color: #008fff;
    color: #ffffff;
}.block-container {
    color: rgba(255,255,255,0.87);
    background: #0f172a;
    border: 1px solid #222;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
}.p-body-sideNav .block-footer, .p-body-sidebar .block-footer, .columnContainer-sidebar .block-footer {
    padding: 15px;
    background: #0f172a;
}.block-footer {
    padding: 20px 20px;
    font-size: 1.3rem;
    color: rgba(255,255,255,0.6);
    background: #192639;
    border-top: 1px solid #222;
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}.carousel-item {
    width: 100%;
    height: 100%;
    color: rgba(255, 255, 255, 0.87);
    background: #0f172a;
    border: 1px solid #1a273a;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0 8px rgba(0, 143, 251, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

/* Плавный блик при наведении */
.carousel-item::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 143, 251, 0.1) 0%, transparent 60%);
    transform: rotate(25deg);
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.carousel-item:hover::before {
    opacity: 1;
    animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
    0% {
        transform: translate(-50%, -50%) rotate(25deg);
    }
    50% {
        transform: translate(0%, 0%) rotate(25deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(25deg);
    }
}

.carousel-item:hover {
    background: #121b2c;
    border-color: #1f304a;
    box-shadow: 0 0 12px rgba(0, 143, 251, 0.2);
}
}.ratingStars-star:first-child {
    margin-left: 0;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease, filter 0.3s ease;
}

.ratingStars-star:first-child::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    pointer-events: none;
}

.ratingStars-star:first-child:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
}

.ratingStars-star:first-child:hover::after {
    opacity: 1;
    animation: starPulse 1.5s infinite ease-in-out;
}@keyframes starPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.6;
    }
}.label.label--primary,
a.label.label--primary:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.2) !important;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 0 6px rgba(59, 130, 246, 0.2);
}

.label.label--primary::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%);
    transform: rotate(25deg) translateY(-50%);
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.label.label--primary:hover {
    background: rgba(59, 130, 246, 0.3) !important;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
    transform: scale(1.05);
}

.label.label--primary:hover::before {
    opacity: 1;
    animation: shine 3s ease-in-out infinite;
}@keyframes shine {
    0% {
        transform: translate(-50%, -50%) rotate(25deg);
    }
    50% {
        transform: translate(0%, -50%) rotate(25deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(25deg);
    }
}.label.label--blue,
a.label.label--blue:hover {
    color: #87ceeb;
    background: rgba(135, 206, 235, 0.15) !important;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 0 4px rgba(135, 206, 235, 0.15);
}

.label.label--blue:hover {
    background: rgba(135, 206, 235, 0.25) !important;
    box-shadow: 0 0 8px rgba(135, 206, 235, 0.3);
    transform: scale(1.03);
}.label.label--orange,
a.label.label--orange:hover {
    color: #ff9800 !important;
    background: rgba(255, 143, 0, 0.2) !important;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 4px rgba(255, 143, 0, 0.2);
}

.label.label--orange:hover {
    background: rgba(255, 143, 0, 0.3) !important;
    box-shadow: 0 0 10px rgba(255, 143, 0, 0.5);
    transform: scale(1.05);
}.label.label--green,
a.label.label--green:hover {
    color: #4caf50 !important;
    background: rgba(76, 175, 80, 0.2) !important;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 4px rgba(76, 175, 80, 0.2);
}

.label.label--green:hover {
    background: rgba(76, 175, 80, 0.3) !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
    transform: scale(1.05);
}.label.label--subtle {
    color: rgba(255, 255, 255, 0.6);
    background: #121b2c;
    border-color: #1f304a;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 0.9rem;
    font-weight: 400;
    transition: all 0.3s ease;
}

.label.label--subtle:hover {
    background: #1a273a;
    color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 8px rgba(0, 143, 251, 0.1);
}.overlay > .overlay-title:first-child,
.overlay .overlay-firstChild {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #0f172a;
    color: rgba(255, 255, 255, 0.87);
    padding: 12px 16px;
    font-size: 1.2rem;
    font-weight: 600;
    position: relative;
    transition: background-color 0.3s ease;
}

.overlay > .overlay-title:first-child::after,
.overlay .overlay-firstChild::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 143, 251, 0.2), transparent);
}.inputGroup.inputGroup--joined .inputGroup-text:first-child {
    border-right: 0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: #0f172a;
}.structItem {
    display: table;
    table-layout: fixed;
    border-top: 1px solid #222;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: transparent;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.structItem:hover {
    background-color: #121b2c;
    box-shadow: inset 0 0 0 1px rgba(0, 143, 251, 0.1),
                0 2px 6px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
}.username--style3 {
    background: linear-gradient(266deg, #ff511a, #ff1a1a, #df3d3d, #ff1b1b);
    background-size: 200% auto; /* Движущийся градиент */
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;

    /* Анимация градиента */
    animation: gradientFlow 5s ease infinite;

    /* Свечение */
    text-shadow:
        0 0 4px rgba(255, 26, 26, 0.4),
        0 0 8px rgba(255, 26, 26, 0.5),
        0 0 12px rgba(255, 26, 26, 0.6),
        0 0 16px rgba(255, 0, 0, 0.7);

    font-weight: bold;
}

/* Анимация движения градиента */
@keyframes gradientFlow {
    0% {
        background-position: 0% center;
    }
    50% {
        background-position: 100% center;
    }
    100% {
        background-position: 0% center;
    }
}
.username--style8 {
    background: linear-gradient(90deg, #999999, #cccccc, #999999);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;

    text-shadow:
        0 0 4px rgba(180, 180, 180, 0.3),
        0 0 6px rgba(160, 160, 160, 0.4),
        0 0 8px rgba(120, 120, 120, 0.5);

    animation: grayShine 6s ease-in-out infinite;
    font-weight: 600;
}

/* Анимация движения серого градиента */
@keyframes grayShine {
    0% {
        background-position: 0% center;
    }
    50% {
        background-position: 100% center;
    }
    100% {
        background-position: 0% center;
    }
}
.username--style7 {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #FAC51C;
    position: relative;
    padding: 2px 6px;
    border-radius: 4px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
    display: inline-block;
}

/* Статичное свечение вокруг текста */
.username--style7::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg,
        rgba(250, 197, 28, 0.3),
        rgba(255, 255, 255, 0.1),
        rgba(250, 197, 28, 0.2)
    );
    box-shadow:
        0 0 4px rgba(250, 197, 28, 0.4),
        0 0 8px rgba(250, 197, 28, 0.3);
    border-radius: 4px;
    z-index: -1;
    pointer-events: none;
}.username--style10 {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #00CD5E;
    position: relative;
    padding: 2px 6px;
    border-radius: 4px;
    background: linear-gradient(145deg, rgba(0, 50, 30, 0.4), rgba(0, 80, 40, 0.3));
    display: inline-block;
}

/* Статичное зелёное свечение вокруг текста */
.username--style10::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(
        45deg,
        rgba(0, 205, 94, 0.2),
        rgba(0, 255, 120, 0.1),
        rgba(0, 205, 94, 0.15)
    );
    box-shadow:
        0 0 4px rgba(0, 205, 94, 0.4),
        0 0 8px rgba(0, 205, 94, 0.3);
    border-radius: 4px;
    z-index: -1;
    pointer-events: none;
}.p-body-pageContent>.tabs--standalone:first-child {
    margin-bottom: 5px;
    background: #0e233e;
}.tagItem {
    display: inline-block;
    max-width: 100%;
    padding: 0 6px 1px;
    border-radius: 8px;
    font-size: 1.3rem;
    color: rgba(255,255,255,0.6);
    background: #0f4714;
    border: 1px solid #222;
    margin: 0 0 2px;
    border-radius: 3px;
}.block--messages .message-inner:last-of-type .message-cell:first-child, .js-quickReply .message-inner:last-of-type .message-cell:first-child {
    border-bottom-left-radius: 7px;
    background: #15222d;
}.fr-box.fr-basic .fr-element {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    color: rgba(255,255,255,0.87);
    font-size: 1.4rem;
    line-height: 1.4;
    background: #0f172a;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-x: auto;
    min-height: 60px;
    text-align: left;
}.blockMessage.blockMessage--alt {
    color: rgba(255,255,255,0.87);
    background: #0f172a;
}.bbCodeBlock.bbCodeBlock--quote .bbCodeBlock-content {
    font-size: 1.4rem;
    background: #161a1d;
}.structItemContainer-group {
    display: table-row-group;
    background: #0f172a;
}.fr-box.fr-basic {
    background: #071a49;
    border: solid 1px #222;
    border-color: var(--input-border-heavy) var(--input-border-light) var(--input-border-light) var(--input-border-heavy);
    border-radius: 8px;
    -moz-border-radius: 8px;
    -webkit-border-radius: 8px;
    -moz-background-clip: padding;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
}.menu--emoji .menu-header, .menu--gif .menu-header {
    background: none;
    font-size: 1.6rem;
    color: rgba(255,255,255,0.87);
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    background-color: #002545;
    z-index: 100;
    font-size: 1.4rem;
    position: -webkit-sticky;
    position: sticky;
    padding: 15px 20px;
    top: 0;
}.menu-row.menu-row--alt {
    color: rgba(255,255,255,0.87);
    background: #15222d;
}.button, button.button a.button {
    display: inline-block;
    border: 1px solid transparent;
    -webkit-transition: background-color .1s ease, border-color .1s ease, color .1s ease;
    transition: background-color .1s ease, border-color .1s ease, color .1s ease;
    font-size: 1.3rem;
    font-weight: 400;
    border-radius: 8px;
    padding-top: 0;
    padding-right: 14px;
    padding-bottom: 0;
    padding-left: 14px;
    text-align: center;
    outline: none;
    line-height: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-appearance: none;
    will-change: box-shadow;
    transition: all .3s cubic-bezier(.25, .8, .25, 1);
    border: none;
    white-space: nowrap;
    color: rgba(255,255,255,0.87);
    text-decoration: none;
    background: #1e1e1e;
    z-index: 55555;
    z-index: inherit;
    border-color: #111 #2b2b2b #2b2b2b #111;
}.resourceSidebarGroup.resourceSidebarGroup--buttons>.button:last-child {
    margin-bottom: 0;
}.block-container:not(.block-container--noStripRadius) > :first-child::before,
.block-topRadiusContent::before,
.block-container:not(.block-container--noStripRadius) > .block-body:first-child > .blockLink:first-child::before {
    position: absolute;
    top: 0;
    left: -75%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
        120deg,
        transparent,
        rgba(0, 143, 251, 0.1),
        transparent
    );
    pointer-events: none; /* Добавлено — теперь клики "пройдут" через этот слой */
}
.formRow>dt {
    border-right: 1px solid transparent;
    background: #0e1c33;
    border-color: #222;
    text-align: right;
    width: 33%;
    padding: 20px 20px 20px 20px;
}.block-container:not(.block-container--noStripRadius)>.block-body:last-child .formSubmitRow:not(.is-sticky) .formSubmitRow-bar, .block-container:not(.block-container--noStripRadius)>.formSubmitRow:not(.is-sticky):last-child .formSubmitRow-bar, .block-bottomRadiusContent>.formSubmitRow:not(.is-sticky) .formSubmitRow-bar {
    border-bottom-left-radius: 7px;
    background: #0f192f;
    border-bottom-right-radius: 7px;
}.formSubmitRow-controls {
    position: relative;
    padding-left: 33%;
    padding-top: 15px;
    padding-bottom: 15px;
    background: #0f192f;
    margin-left: 20px;
    margin-right: 20px;
}.button.button--link, button.button a.button.button--link {
    font-size: 1.3rem;
    padding-top: 8px;
    padding-right: 15px;
    padding-bottom: 8px;
    padding-left: 15px;
    display: inline-flex !important;
    line-height: unset;
    background: #3691ce;
    border: 1px solid #222;
    text-transform: initial;
}* {
    scrollbar-width: thin;
    scrollbar-color: #3691ce #162235;
}.blockLink.is-selected {
    color: #3691ce;
    font-weight: 600;
    background: #15232d;
    border-left: 2px solid #3691ce;
    padding-left: 18px;
}.blockLink {
    display: block;
    padding: 10px 20px;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    background: #15232d;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

/* Hover эффект */
.blockLink:hover {
    background: #1c2e3d;
    color: #ffffff;
}
.block--messages .message-inner:last-of-type .message-cell:last-child, .js-quickReply .message-inner:last-of-type .message-cell:last-child {
    border-bottom-right-radius: 7px;
    background: #15222d;
}.message-attachments {
    margin: .5em 0;
    background: #15222d;
    padding: 20px;
    margin-top: 0;
    margin-bottom: 20px;
}.formSubmitRow.formSubmitRow--sticky.is-sticky .formSubmitRow-bar {
    --backdrop-filter: blur(10px);
    -webkit-backdrop-filter: var(--backdrop-filter);
    backdrop-filter: var(--backdrop-filter);
    background: #0f192f;
}
    `;
    document.head.appendChild(style);
})();
(function () {
    'use strict';

    // Создаём стиль с анимацией и свечением
    const style = document.createElement('style');
    style.textContent = `
    @keyframes yooGradientGlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

.username--yooCustom {
    background: linear-gradient(270deg, #ffffff, #0731ff, #ffffff, #00e5ff);
    background-size: 600% 600%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    font-weight: 800;
    animation: yooGradientGlow 6s ease-in-out infinite;
    text-shadow: 0 0 4px rgba(0, 200, 255, 0.4),
            0 0 8px rgba(0, 150, 255, 0.5),
            0 0 12px rgba(0, 120, 255, 0.6);
}
    `;
    document.head.appendChild(style);

    // Применить стиль только к элементу с текстом "YOO"
    function applyCustomYooStyle() {
        document.querySelectorAll('.username--style8').forEach(el => {
            if (el.textContent.trim() === 'YOO') {
                el.classList.add('username--yooCustom');
            }
        });
    }

    // Вызов при загрузке и при изменении DOM
    applyCustomYooStyle();
    new MutationObserver(applyCustomYooStyle).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
