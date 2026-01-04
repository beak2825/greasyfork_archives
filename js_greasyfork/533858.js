// ==UserScript==
// @name         AnimeStars Auto-Unwanted
// @namespace    animestars.org
// @version      4.5
// @license MIT
// @description  Автоматически добавляет дубликаты карт в ненужные
// @author       clo3eX
// @match        https://astars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      animestars.org
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/533858/AnimeStars%20Auto-Unwanted.user.js
// @updateURL https://update.greasyfork.org/scripts/533858/AnimeStars%20Auto-Unwanted.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DELAY = 100;
    const CACHE_TTL = 24 * 60 * 60 * 1000;
    let processing = false;
    let currentUnwanted = [];

    function createUI() {
    const container = document.createElement('div');
    container.id = 'duplicates-manager';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        max-width: 300px;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        background: #2d3436;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        color: white;
        margin-bottom: 10px;
    `;

    const buttonStyle = `
        width: 100%;
        padding: 10px;
        background: #6c5ce7;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
    `;

    const mainButton = document.createElement('button');
    mainButton.id = 'dm-start';
    mainButton.textContent = 'Найти дубликаты';
    mainButton.style.cssText = buttonStyle;

    const tradeButton = document.createElement('button');
    tradeButton.id = 'dm-trade-sort';
    tradeButton.textContent = 'Скрыть уникальные';
    tradeButton.style.cssText = buttonStyle;
    tradeButton.style.marginTop = '10px';
    tradeButton.style.display = 'none';

    const cartButton = document.createElement('button');
    cartButton.id = 'checkCardsCountInCart';
    cartButton.textContent = 'Проверить корзину';
    cartButton.style.cssText = buttonStyle;
    cartButton.style.marginTop = '10px';
    cartButton.style.background = '#7B1FA2';

    panel.appendChild(createHeader());
    panel.appendChild(document.getElementById('dm-stats') || createStats());
    panel.appendChild(mainButton);
    panel.appendChild(tradeButton);
    panel.appendChild(cartButton);
    panel.appendChild(createProgress());

    container.appendChild(panel);
    document.body.appendChild(container);

    mainButton.addEventListener('click', processDuplicates);
    tradeButton.addEventListener('click', processTradePage);
    cartButton.addEventListener('click', checkCardsCountInCart);

    [mainButton, tradeButton].forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.background = '#5f51e3');
        btn.addEventListener('mouseleave', () => btn.style.background = '#6c5ce7');
    });
}

function createHeader() {
    const title = document.createElement('h3');
    title.innerHTML = `
        <i class="fas fa-copy"></i>
        Управление дубликатами
    `;
    title.style.cssText = `
        margin: 0 0 15px 0;
        color: #6c5ce7;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    return title;
}

function createStats() {
    const stats = document.createElement('div');
    stats.id = 'dm-stats';
    stats.style.cssText = `
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 1.5;
    `;
    return stats;
}

function createProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.id = 'dm-progress';
    progressContainer.style.cssText = `
        margin-top: 15px;
        display: none;
    `;

    const progressText = document.createElement('div');
    progressText.id = 'dm-progress-text';
    progressText.style.cssText = `
        margin-bottom: 5px;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
    `;

    const progressBar = document.createElement('div');
    progressBar.id = 'dm-progress-bar';
    progressBar.style.cssText = `
        height: 8px;
        background: #444;
        border-radius: 4px;
        overflow: hidden;
    `;

    progressBar.innerHTML = '<div id="dm-progress-fill" style="height:100%;width:0%;background:#6c5ce7;transition:width 0.3s;border-radius:4px"></div>';
    progressContainer.append(progressText, progressBar);
    return progressContainer;
}
    function updateStats(total, duplicates, inUnwanted) {
        const stats = $('#dm-stats');
        stats.html(`
            <div><i class="fas fa-layer-group"></i> Всего карт: ${total}</div>
            <div><i class="fas fa-copy"></i> Дубликатов: ${duplicates}</div>
            <div><i class="fas fa-ban"></i> Уже в ненужных: ${inUnwanted}</div>
        `);
    }

    function updateProgress(current, total, text) {
        const percent = Math.round((current / total) * 100);
        $('#dm-progress-fill').css('width', percent + '%');
        $('#dm-progress-text').html(`
            <span>${text}</span>
            <span>${current}/${total}</span>
        `);
    }

    function toggleProgress(show) {
        $('#dm-progress').css('display', show ? 'block' : 'none');
    }
function getUsername() {
    const match = window.location.pathname.match(/^\/user\/([^/]+)/);
    return match ? match[1] : null;
}

    async function processDuplicates() {
        if (processing) return;
        processing = true;
        try {
            $('#dm-start').html('<i class="fas fa-spinner"></i> Загрузка...').prop('disabled', true);
            toggleProgress(true);
            updateProgress(0, 1, 'Загрузка списка карт...');
            await loadFullUnwantedList();
            updateProgress(0, 1, 'Поиск всех карт...');
            const allCards = await fetchAllCards();
            const totalCards = allCards.length;
            updateProgress(0, 1, 'Поиск дубликатов...');
            const duplicates = findDuplicates(allCards);
            const duplicateCount = duplicates.length;
            const alreadyUnwanted = duplicates.filter(card =>
                currentUnwanted.includes(parseInt(card.id))
            ).length;

            updateStats(totalCards, duplicateCount, alreadyUnwanted);

            if (duplicates.length === 0) {
                GM_notification('Дубликаты не найдены', 'AnimeStars Duplicates Manager');
                return;
            }
            const toAdd = duplicates.filter(card =>
                !currentUnwanted.includes(parseInt(card.id))
            );

            if (toAdd.length === 0) {
                GM_notification('Все дубликаты уже в ненужных', 'AnimeStars Duplicates Manager');
                return;
            }

            const confirm = window.confirm(`Найдено ${duplicateCount} дубликатов, ${toAdd.length} новых. Добавить в ненужные?`);
            if (!confirm) return;

            updateProgress(0, toAdd.length, 'Добавление в ненужные...');
            await addDuplicatesToUnwanted(toAdd);
            await updateUnwantedCache(toAdd.map(card => parseInt(card.id)));

            GM_notification('Готово! Все дубликаты обработаны', 'AnimeStars Duplicates Manager');
        } catch (error) {
            console.error('Ошибка:', error);
            GM_notification(`Ошибка: ${error.message}`, 'AnimeStars Duplicates Manager');
        } finally {
            $('#dm-start').text('Найти дубликаты').prop('disabled', false);
            toggleProgress(false);
            processing = false;
        }
    }
    async function updateUnwantedCache(newIds) {
        const cached = await GM_getValue('unwantedCache', { ids: [], timestamp: 0 });
        const updatedIds = [...new Set([...cached.ids, ...newIds])];

        await GM_setValue('unwantedCache', {
            ids: updatedIds,
            timestamp: Date.now()
        });

        currentUnwanted = updatedIds;
    }
    async function fetchAllCards() {
        const profileUrl = $('.lgn__btn-profile').attr('href');
        if (!profileUrl) throw new Error('Не удалось найти ссылку на профиль');

        let page = 1;
        const allCards = [];
        let totalPages = 1;

        while (page <= totalPages) {
            const url = `${profileUrl}cards/page/${page}/`;
            const html = await fetchWithRetry(url);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            if (page === 1) {
                const pagination = doc.querySelector('.pagination__pages');
                if (pagination) {
                    const lastPage = pagination.querySelector('a:last-of-type');
                    totalPages = lastPage ? parseInt(lastPage.textContent.trim(), 10) : 1;
                }
            }

            const cards = parseCardsFromPage(doc);
            allCards.push(...cards);

            updateProgress(allCards.length, totalPages * 49, `Загрузка страницы ${page}/${totalPages}`);
            page++;
            await sleep(DELAY);
        }

        return allCards;
    }

    function findDuplicates(cards) {
        const cardCounts = {};
        cards.forEach(card => {
            cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
        });

        return cards
            .filter(card => cardCounts[card.id] > 1)
            .filter((card, index, self) =>
                index === self.findIndex(c => c.id === card.id)
            );
    }
    async function addDuplicatesToUnwanted(duplicates) {
        for (let i = 0; i < duplicates.length; i++) {
            const card = duplicates[i];
            try {
                const success = await addToUnwanted(card.id);
                if (success) {
                    console.log(`✅ Добавлена карта ${card.name} (ID: ${card.id}) в ненужные`);
                    await sleep(DELAY * 10);
                }
            } catch (error) {
                console.error(`❌ Ошибка при добавлении карты ${card.id}:`, error);
            }
            updateProgress(i + 1, duplicates.length, 'Добавление в ненужные');
        }
    }

    async function addToUnwanted(cardId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/engine/ajax/controller.php?mod=trade_ajax",
                type: "POST",
                data: {
                    action: "propose_add",
                    type: 1,
                    card_id: cardId,
                    user_hash: dle_login_hash
                },
                dataType: "json",
                success: (data) => {
                    if (data.error) {
                        if (data.error.includes('Слишком часто')) {
                            setTimeout(() => resolve(addToUnwanted(cardId)), DELAY * 4);
                        } else {
                            reject(new Error(data.error));
                        }
                    } else {
                        resolve(data.status === 'added');
                    }
                },
                error: (xhr, status, error) => {
                    reject(new Error(error));
                }
            });
        });
    }
    function processTradePage() {
        if (!window.location.href.includes('/trade/')) return;

        try {
            sortCardsAlphabetically();
            hideUniqueCards();
        } catch (error) {
            console.error('Ошибка:', error);
            GM_notification(`Ошибка: ${error.message}`, 'AnimeStars Trade Helper');
        }
    }

    function sortCardsAlphabetically() {
        const container = document.querySelector('.trade__inventory-list');
        if (!container) throw new Error('Контейнер карт не найден');

        const cards = Array.from(container.children);
        cards.sort((a, b) => {
            const nameA = getCardName(a).toLowerCase();
            const nameB = getCardName(b).toLowerCase();
            return nameA.localeCompare(nameB);
        });
        container.innerHTML = '';
        cards.forEach(card => container.appendChild(card));
    }

    function hideUniqueCards() {
        const cards = document.querySelectorAll('.trade__inventory-item');
        const cardGroups = {};
        cards.forEach(card => {
            const name = getCardName(card);
            if (!cardGroups[name]) cardGroups[name] = [];
            cardGroups[name].push(card);
        });
        Object.values(cardGroups).forEach(group => {
            if (group.length === 1) {
                group[0].style.display = 'none';
            }
        });
    }

    function getCardName(cardElement) {
        return cardElement.querySelector('.trade__inventory-item--exptra')?.textContent.trim() || '';
    }
async function loadFullUnwantedList() {
    const unwantedCards = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const url = `/user/${getUsername()}/cards/trade/page/${page}/`;
        console.log(`Загружаем: ${url}`);
        const html = await fetchWithRetry(url);
        const doc = new DOMParser().parseFromString(html, 'text/html');
        if (page === 1) {
            const pagination = doc.querySelector('.pagination__pages');
            if (pagination) {
                const lastPage = pagination.querySelector('a:last-of-type');
                if (lastPage) {
                    totalPages = parseInt(lastPage.textContent.trim());
                }
            }
        }

        const ids = Array.from(doc.querySelectorAll('.anime-cards__item'))
            .map(card => parseInt(card.getAttribute('data-id')))
            .filter(id => !isNaN(id));

        unwantedCards.push(...ids);
        updateProgress(page, totalPages, `Загружаем ненужные (${page}/${totalPages})`);
        page++;
        await sleep(DELAY);
    }

    currentUnwanted = unwantedCards;
    await GM_setValue('unwantedCache', {
        ids: unwantedCards,
        timestamp: Date.now()
    });
}
    function parseCardsFromPage(doc) {
        return Array.from(doc.querySelectorAll('.anime-cards__item')).map(card => ({
            id: card.dataset.id,
            name: card.dataset.name,
            rank: card.dataset.rank
        }));
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function fetchWithRetry(url, retries = 3) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                type: "GET",
                success: resolve,
                error: (xhr, status, error) => {
                    if (retries > 0) {
                        setTimeout(() => fetchWithRetry(url, retries - 1).then(resolve).catch(reject), DELAY);
                    } else {
                        reject(new Error(`Не удалось загрузить страницу: ${error}`));
                    }
                }
            });
        });
    }

    function addInCardMark(element, count) {
        if (!element || count === 0) return;

        const oldBadge = element.querySelector('.card-badge');
        if (oldBadge) oldBadge.remove();

        const checkMark = document.createElement('div');
        checkMark.classList.add('card-badge');
        Object.assign(checkMark.style, {
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #7B1FA2 0%, #512DA8 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 3px 8px rgba(156, 39, 176, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10',
            fontFamily: 'Arial, sans-serif',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(2px)',
            transition: 'transform 0.2s ease, opacity 0.2s ease'
        });

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-suitcase');
        icon.style.marginRight = '6px';
        icon.style.fontSize = '12px';
        icon.style.opacity = '0.9';

        const text = document.createTextNode(count);
        checkMark.appendChild(icon);
        checkMark.appendChild(text);

        element.classList.add('div-checked');
        if (window.getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(checkMark);
        checkMark.title = `В корзине: ${count} ${count === 1 ? 'товар' : 'товара'}`;

        checkMark.addEventListener('mouseenter', () => {
            checkMark.style.transform = 'scale(1.05)';
            checkMark.style.opacity = '0.95';
        });

        checkMark.addEventListener('mouseleave', () => {
            checkMark.style.transform = 'scale(1)';
            checkMark.style.opacity = '1';
        });
    }
    async function getCardsCountInCart(name, id) {
        if (!name || !id) return;

        try {
            await sleep(DELAY);
            const profileUrl = $('.lgn__btn-profile').attr('href');
            if (!profileUrl) return 0;
            const searchUrl = `${profileUrl}cards/?search=${encodeURIComponent(name)}`;
            const html = await fetchWithRetry(searchUrl);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const foundCards = doc.querySelectorAll(`[data-id="${id}"]`);

            return foundCards.length;
        } catch (err) {
            console.error("Ошибка при запросе:", err);
            return 0;
        }
    }

    async function checkCardsCountInCart() {
        if (processing) return;
        processing = true;
        try {
            const buttonId = 'checkCardsCountInCart';
            startAnimation(buttonId);
            const cards = document.querySelectorAll('[data-id][data-name]');
            if (cards.length < 1) {
                GM_notification('Карты не найдены на странице', 'AnimeStars Cart Checker');
                return;
            }

            let counter = cards.length;
            updateButtonCounter(buttonId, counter);

            for (const card of cards) {
                const name = card?.getAttribute("data-name");
                const id = card?.getAttribute("data-id");
                if (!name || !id) {
                    counter--;
                    updateButtonCounter(buttonId, counter);
                    continue;
                }
                const num = await getCardsCountInCart(name, id);
                addInCardMark(card, num);
                counter--;
                updateButtonCounter(buttonId, counter);
                await sleep(DELAY);
            }

            GM_notification('Проверка корзины завершена', 'AnimeStars Cart Checker');
        } catch (error) {
            console.error('Ошибка:', error);
            GM_notification(`Ошибка: ${error.message}`, 'AnimeStars Cart Checker');
        } finally {
            stopAnimation('checkCardsCountInCart');
            processing = false;
        }
    }

    function startAnimation(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
            button.disabled = true;
        }
    }

    function stopAnimation(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = 'Проверить корзину';
            button.disabled = false;
        }
    }

    function updateButtonCounter(buttonId, counter) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Осталось: ${counter}`;
        }
    }

    $(document).ready(function() {
    if (window.location.pathname.match(/^\/user\/.+\/cards/) || window.location.href.includes('/trade/')) {
        createUI();
        const isTradePage = window.location.href.includes('/trade/');
        $('#dm-start').toggle(!isTradePage);
        $('#dm-trade-sort').toggle(isTradePage);
    }
});
})();