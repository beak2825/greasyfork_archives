// ==UserScript==
// @name         animestars Auto Helper
// @namespace    animestars.org
// @version      3.34аа1
// @description  хелпер который помогает определить популярность карты на сайте astars.club
// @author       astars lover
// @match        https://astars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://asstars.tv/*
// @match        https://asstars.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as2.astars.club/*
// @match        https://as3.astars.club/*
// @match        https://as4.astars.club/*
// @match        https://as5.astars.club/*
// @match        https://as6.astars.club/*
// @match        https://as7.astars.club/*
// @match        https://as8.astars.club/*
// @match        https://as9.astars.club/*
// @match        https://as10.astars.club/*
// @match        https://as11.astars.club/*
// @match        https://as12.astars.club/*
// @match        https://as13.astars.club/*
// @match        https://as14.astars.club/*
// @match        https://as15.astars.club/*
// @match        https://as16.astars.club/*
// @match        https://as17.astars.club/*
// @match        https://as18.astars.club/*
// @match        https://as18.astars.club/*
// @match        https://as20.astars.club/*
// @match        https://as21.astars.club/*
// @match        https://as22.astars.club/*
// @match        https://as23.astars.club/*
// @match        https://as24.astars.club/*
// @match        https://as25.astars.club/*
// @match        https://as26.astars.club/*
// @match        https://as27.astars.club/*
// @match        https://as28.astars.club/*
// @match        https://as29.astars.club/*
// @match        https://as30.astars.club/*
// @match        https://as31.astars.club/*
// @match        https://as32.astars.club/*
// @match        https://as33.astars.club/*
// @match        https://as34.astars.club/*
// @match        https://as35.astars.club/*
// @match        https://as36.astars.club/*

// @license MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/524233/animestars%20Auto%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524233/animestars%20Auto%20Helper.meta.js
// ==/UserScript==

const DELAY = 50; // Задержка между запросами в миллисекундах (по умолчанию 0,5 секунды) не менять чтоб не делать избыточную нагрузку на сайт

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let cardCounter = 0;

const cardClasses = '.noffer__img, .remelt__inventory-item, .lootbox__card, .anime-cards__item, .trade__inventory-item, .trade__main-item, .card-filter-list__card, .deck__item, .history__body-item, .history__body-item, .card-show__placeholder';

function addCheckMark(element) {
    if (!element) return;
    const checkMark = document.createElement('i');
    checkMark.classList.add('fas', 'fa-check', 'div-marked');
    checkMark.style.position = 'absolute';
    checkMark.style.bottom = '5px';
    checkMark.style.left = '5px';
    checkMark.style.background = 'green';
    checkMark.style.color = 'white';
    checkMark.style.borderRadius = '50%';
    checkMark.style.padding = '5px';
    checkMark.style.fontSize = '16px';
    checkMark.style.width = '24px';
    checkMark.style.height = '24px';
    checkMark.style.display = 'flex';
    checkMark.style.alignItems = 'center';
    checkMark.style.justifyContent = 'center';
    element.classList.add('div-checked');
    if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    element.appendChild(checkMark);
}

function addInCardMark(element, count) {
    if (!element) return;
    const checkMark = document.createElement('span');
    checkMark.classList.add('dupl-count');
    element.classList.add('div-checked');
    checkMark.title = 'Карт в корзине';
    if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    checkMark.innerText = count;
    element.appendChild(checkMark);
}

async function iNeedCard(cardId) {
    await sleep(DELAY * 2);
    const url = '/engine/ajax/controller.php?mod=trade_ajax';
    const data = {
        action: 'propose_add',
        type: 0,
        card_id: cardId,
        user_hash: window.dle_login_hash
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'same-origin',
            body: new URLSearchParams(data).toString()
        });
        if (response.status === 502) {
            console.error("Ошибка 502: Остановка выполнения скриптов.");
            throw new Error("502 Bad Gateway");
        }
        if (response.ok) {
            const data = await response.json();
            if (data.error) {
                if (data.error == 'Слишком часто, подождите пару секунд и повторите действие') {
                    await readyToChargeCard(cardId);
                    return;
                } else {
                    window.DLEPush?.info(data.error);
                }
            }
            if ( data.status == 'added' ) {
                cardCounter++;
                return;
            }
            if ( data.status == 'deleted' ) {
                await sleep(DELAY * 2);
                await iNeedCard(cardId);
                return;
            }
            cardCounter++;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
}

async function loadCard(cardId) {
    const cacheKey = 'card_id: ' + cardId;
    let card = await getCard(cacheKey) ?? {};
    if (Object.keys(card).length) {
//        return card;
    }

    console.log(`Обработка карточки с ID: ${cardId}`);
    const currentDomain = window.location.origin;
    await sleep(DELAY);
    let rankText = '';

    const popularityResponse = await fetch(`${currentDomain}/cards/users/?id=${cardId}`);
    if (popularityResponse.status === 502) {
        console.error("Ошибка 502: Остановка выполнения скриптов.");
        throw new Error("502 Bad Gateway");
    }
    let likes = 0;
    let dislikes = 0;
    let popularityCount = 0;
    let needСount = 0;
    let tradeСount = 0;
    let tradeName = '';

    console.log('popularityResponse.ok', popularityResponse.ok);
    if (popularityResponse.ok) {
        const popularityHtml = await popularityResponse.text();
        const popularityDoc = new DOMParser().parseFromString(popularityHtml, 'text/html');

        needСount = popularityDoc.querySelectorAll('span#owners-need')[0].innerText;
        tradeСount = popularityDoc.querySelectorAll('span#owners-trade')[0].innerText;
        tradeName = popularityDoc.querySelector('meta[name="description"]').getAttribute('content').replace('Все обладатели карточки ','');
        rankText = popularityDoc.querySelector('.ncard__rank').innerText.replace('Редкость\n','').trim();

        await checkGiftCard(popularityDoc); // ищем небесный камень заодно
        /*
        const animeUrl = popularityDoc.querySelector('.card-show__placeholder')?.href;
        if (animeUrl) {
            try {
                const response = await fetch(animeUrl);
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                likes = parseInt(doc.querySelector('[data-likes-id]')?.textContent?.trim(), 10);
                dislikes = parseInt(doc.querySelector('[data-dislikes-id]')?.textContent?.trim(), 10);
                checkGiftCard(doc); // ищем небесный камень заодно
            } catch (error) {
                console.error('Ошибка при загрузке страницы:', error);
            }
        }
        popularityCount = popularityDoc.querySelectorAll('.card-show__owner').length;
        */
        popularityCount = popularityDoc.querySelector('#owners-count').innerText ?? 0;
    }

    card = {likes: likes, dislikes: dislikes, rankText: rankText, popularityCount: popularityCount, needCount: needСount, tradeCount: tradeСount, name: tradeName};

    console.log('card', card);

    if (card.likes || card.dislikes) {
        await cacheCard(cacheKey, card)
    }

    return card;
}

async function updateCardInfo(cardId, element) {
    if (!cardId || !element) {
        console.log(cardId, 'updateCardInfo error');
        return;
    }
    try {
        const card = await loadCard(cardId);
        console.log(card);

        element.querySelector('.link-icon')?.remove();
        const icon = document.createElement('div');
        icon.className = 'link-icon';
        icon.style.position = 'absolute';
        icon.style.top = '10px';
        icon.style.right = '10px';
        icon.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        icon.style.color = '#05ed5b';
        icon.style.padding = '5px';
        icon.style.borderRadius = '5px';
        icon.style.fontSize = '8px';
        let anime = card.likes && card.dislikes ? `<br>аниме: +${card.likes} / -${card.dislikes}` : '';
        if (isCardsPackPage() || isTradesPage() || isTradePage())
        {
            const username = document.querySelector('a[href^="/user/"]')?.pathname.split('/')[2];
            let num = await getCardsCountInCart(card.name, cardId, username);
            anime += '<br>у меня: ' + num + ' шт';
        }
        icon.innerHTML = `Ранг: ${card.rankText}<br>имеют: ${card.popularityCount}<br>хотят: ${card.needCount}<br>отдают: ${card.tradeCount}` + anime;
        element.style.position = 'relative';
        element.appendChild(icon);
    } catch (error) {
        console.error(`Ошибка обработки карты ${cardId}:`, error);
        throw error;
    }
}

function clearMarkFromCards() {
    cleanByClass('div-marked');
}

function removeAllLinkIcons() {
    cleanByClass('link-icon');
}

function cleanByClass(className) {
    const list = document.querySelectorAll('.' + className);
    list.forEach(item => item.remove());
}

function getCardsOnPage() {
    return Array.from(
        document.querySelectorAll(cardClasses)
    ).filter(card => card.offsetParent !== null);
}

async function processCards() {

    if (isCardRemeltPage()) {
        const storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
        if (Object.keys(storedData).length < 1) {
            await readyRemeltCards();
            return;
        }
    }

    removeMatchingWatchlistItems();
    removeAllLinkIcons();
    clearMarkFromCards();

    const cards = getCardsOnPage();
    let counter = cards.length;

    if (!counter) {
        return;
    }

    let buttonId = 'processCards';
    startAnimation(buttonId);
    updateButtonCounter(buttonId, counter);
    for (const card of cards) {

        if (card.classList.contains('trade__inventory-item--lock') || card.classList.contains('remelt__inventory-item--lock')) {
            continue;
        }
        let cardId = await getCardId(card);
        if (cardId) {
            await updateCardInfo(cardId, card).catch(error => {
                console.error("Остановка из-за критической ошибки:", error.message);
                return;
            });
            addCheckMark(card);
            counter--;
            updateButtonCounter(buttonId, counter);
        } else {
            console.log(cardId, 'cardId not found');
        }

        if (card.classList.contains('lootbox__card')) {
            card.addEventListener('click', removeAllLinkIcons);
        }
    }
    stopAnimation(buttonId);
}

function removeMatchingWatchlistItems() {
    const watchlistItems = document.querySelectorAll('.watchlist__item');
    if (watchlistItems.length == 0) {
        return;
    }
    watchlistItems.forEach(item => {
        const episodesText = item.querySelector('.watchlist__episodes')?.textContent.trim();
        if (episodesText) {
            const matches = episodesText.match(/[\d]+/g);
            if (matches) {
                const currentEpisode = parseInt(matches[0], 10);
                const totalEpisodes = parseInt(matches.length === 4 ? matches[3] : matches[1], 10);
                if (currentEpisode === totalEpisodes) {
                    item.remove();
                    //console.log(`Удалён блок: ${item}`);
                }
            }
        }
    });

    if (watchlistItems.length) {
        window.DLEPush?.info('Из списка удалены просмотренные аниме. В списке осталось ' + document.querySelectorAll('.watchlist__item').length + ' записей.');
    }
}

function startAnimation(id) {
    const el = document.querySelector('#' + id + ' span:first-child');
    if (el) {
        el.style.animation = 'rotateIcon 2s linear infinite';
    }
}

function stopAnimation(id) {
    const el = document.querySelector('#' + id + ' span:first-child');
    if (el) {
        el.style.animation = '';
    }
}

function getButton(id, className, percent, text, clickFunction) {
    const button = document.createElement('button');
    button.id = id;
    button.title = text;
    button.style.position = 'fixed';
    button.style.top = percent + '%';
    button.style.right = '1%';
    button.style.zIndex = '1000';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '10px 15px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    const icon = document.createElement('span');
    icon.className = 'fal fa-' + className;
    icon.style.display = 'inline-block';
    button.appendChild(icon);
    const info = document.createElement('span');
    info.id = id + '_counter';
    info.className = 'guest__notification';
    info.style.display = 'none';
    button.appendChild(info);
    button.addEventListener('click', clickFunction);
    return button;
}

function updateButtonCounter(id, counter) {
    const el = document.getElementById(id + '_counter');
    if (!el) return;

    el.style.display = counter > 0 ? 'flex' : 'none';
    el.textContent = counter;
}

function addUpdateButton() {
    if (!document.querySelector('#fetchLinksButton')) {
        let cards = getCardsOnPage();

        document.body.appendChild(getButton('processCards', 'rocket', 37, 'Сравнить карточки', processCards));

        if (!cards.length) {
            return
        }

        let myCardPage = isMyCardPage();
        if (myCardPage) {
            document.body.appendChild(getButton('readyToCharge', 'circle-check', 50, '"Готов поменять" на все карточки', readyToCharge));
        }

        let animePage = isAnimePage();
        if (animePage) {
            document.body.appendChild(getButton('iNeedAllThisCards', 'search', 50, '"Хочу карту" на все карточки', iNeedAllThisCards));
        }

        let cardRemeltPage = isCardRemeltPage();
        if (cardRemeltPage) {
            document.body.appendChild(getButton('readyRemeltCards', 'yin-yang', 50, 'закешировать карточки', readyRemeltCards));
            const storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
            updateButtonCounter('readyRemeltCards', Object.keys(storedData).length);
        }

        if (document.querySelectorAll(`[data-id][data-name]`).length) {
            let percent = myCardPage || cardRemeltPage || cardRemeltPage ? 63 : 50;
            document.body.appendChild(getButton('checkCardsCountInCart', 'suitcase', percent, 'проверить наличие в корзине', checkCardsCountInCart));
        }
    }
}

async function checkCardsCountInCart() {
    let cardsCountInCart = document.querySelectorAll(`[data-id][data-name]`);
    if (cardsCountInCart.length < 1) {
        return;
    }

    let buttonId = 'checkCardsCountInCart';
    startAnimation(buttonId);
    let counter = cardsCountInCart.length;
    updateButtonCounter(buttonId, counter);
    const username = document.querySelector('a[href^="/user/"]')?.pathname.split('/')[2];

    for (const card of cardsCountInCart) {
        let name = card?.getAttribute("data-name");
        let id = card?.getAttribute("data-id");
        if (!name || !id) {
            continue;
        }

        let num = await getCardsCountInCart(name, id, username);
        addInCardMark(card, num);
        counter--;
        updateButtonCounter(buttonId, counter);
    }
    stopAnimation(buttonId);
}

function isMyCardPage() {
    return (/^\/user\/(.*)\/cards(\/page\/\d+\/)?/).test(window.location.pathname)
}

function isCardRemeltPage() {
    return (/^\/cards_remelt\//).test(window.location.pathname)
}

function isCardsPackPage() {
    return (/^\/cards\/pack\//).test(window.location.pathname)
}

function isTradesPage() {
    return (/^\/trades\//).test(window.location.pathname)
}

function isTradePage() {
    return (/^\/cards\/.*\/trade\//).test(window.location.pathname)
}

function isAnimePage() {
    return document.getElementById('anime-data') !== null;
}

async function readyRemeltCards() {
    window.DLEPush.info('метод пока не работает');
}

async function iNeedAllThisCards() {
    let cards = getCardsOnPage();
    window.DLEPush.info('Отметить "Хочу карточку" на все ' + cards.length + ' карточек на странице');

    let counter = cards.length;
    let buttonId = 'iNeedAllThisCards';
    startAnimation(buttonId);
    updateButtonCounter(buttonId, counter);
    clearMarkFromCards();

    cardCounter = 0;
    for (const card of cards) {
        if (card.classList.contains('anime-cards__owned-by-user')) {
            counter--;
            updateButtonCounter(buttonId, counter);
            continue;
        }
        let cardId = await getCardId(card);
        if (cardId) {
            await iNeedCard(cardId).catch(error => {
                console.error("Остановка из-за критической ошибки:", error.message);
                return;
            });
            addCheckMark(card);
            counter--;
            updateButtonCounter(buttonId, counter);
        } else {
            console.log(cardId, 'cardId not found');
        }
    }
    stopAnimation(buttonId);
}

async function getCardId(card) {
    let cardId = card.getAttribute('card-id') || card.getAttribute('data-card-id') || card.getAttribute('data-id');
    const href = card.getAttribute('href');
    if (href) {
        let cardIdMatch = href.match(/\/cards\/(\d+)\/users\//) || href.match(/\/cards\/users\/\?id=(\d+)/);
        if (cardIdMatch) {
            cardId = cardIdMatch[1];
        }
    }
    if (cardId) {
        // проверяем что в локально нет такого номера
        console.log('проверка в хранилище номера карты ' + cardId);
        const cardByOwner = await getFirstCardByOwner(cardId);
        // console.log('localStorage', cardByOwner);
        if (cardByOwner) {
            cardId = cardByOwner.cardId;
        }
    }
    return cardId;
}

async function getCardOwnerId(card) {
    let cardId = card.getAttribute('data-owner-id');
    return cardId;
}

async function getCardType(card) {
    return card.getAttribute('data-type') || null;
}

async function getFirstCardByOwner(ownerId) {
    const storedData = JSON.parse(localStorage.getItem('animeCardsData')) || {};
    const key = 'o_' + ownerId;

    return storedData[key] && storedData[key].length > 0 ? storedData[key][0] : null;
}

async function readyToCharge() {
    window.DLEPush.info('Отмечаем все карты на странице как: "Готов обменять" кроме тех что на обмене и заблокированных');
    let cards = getCardsOnPage();
    // DLEPush.info('Карт на странице: ' + cards.length);

    let counter = cards.length;
    let buttonId = 'readyToCharge';
    startAnimation(buttonId);
    updateButtonCounter(buttonId, counter);
    clearMarkFromCards();

    cardCounter = 0;
    for (const card of cards) {
        if (card.classList.contains('trade__inventory-item--lock')) {
            continue;
        }
        let cardOwnerId = await getCardOwnerId(card);
        if (cardOwnerId) {
            await sleep(1000);
            //await readyToChargeCard(cardOwnerId);
            await cardProposeAdd(cardOwnerId)
            counter--;
            addCheckMark(card);
            updateButtonCounter(buttonId, counter);
        }
    }
    window.DLEPush.info('Отправили на обмен ' + cardCounter + ' карточек на странице');
    stopAnimation(buttonId);
}

async function cardProposeAdd(card_id) {
    try {
        await sleep(DELAY * 3);

        const response = await fetch("/engine/ajax/controller.php?mod=trade_ajax", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                action: "propose_add",
                type: 1,
                card_id: card_id,
                user_hash: window.dle_login_hash
            })
        });

        const data = await response.json();

        if (data?.error) {
            if (data.error === 'Слишком часто, подождите пару секунд и повторите действие') {
                return await cardProposeAdd(card_id);
            }

            console.log('cardProposeAdd ' + card_id, data.error);
            return false;
        }

        if (data?.status === "added") {
            return true;
        }

        if (data?.status === "deleted") {
            return await cardProposeAdd(card_id);
        }

        return false;

    } catch (e) {
        console.error("Ошибка запроса:", e);
        return false;
    }
}

const readyToChargeCard = async (cardOwnerId) => {
    await sleep(DELAY * 2);
    const url = '/engine/ajax/controller.php?mod=trade_ajax';
    const data = {
        action: 'propose_add',
        type: 1,
        card_id: cardOwnerId,
        user_hash: window.dle_login_hash
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'same-origin',
            body: new URLSearchParams(data).toString()
        });
        if (response.status === 502) {
            console.error("Ошибка 502: Остановка выполнения скриптов.");
            throw new Error("502 Bad Gateway");
        }
        if (response.ok) {
            const data = await response.json();
            if (data.error) {
                if (data.error == 'Слишком часто, подождите пару секунд и повторите действие') {
                    await readyToChargeCard(cardId);
                    return;
                }
            }
            if ( data.status == 'added' ) {
                cardCounter++;
                return;
            }
            if ( data.status == 'deleted' ) {
                await readyToChargeCard(cardId);
                return;
            }
            cardCounter++;
            //console.log('Ответ сервера:', data);
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};

// Анимация вращения в CSS
const style = document.createElement('style');
style.textContent = `
@keyframes rotateIcon {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
`;
document.head.appendChild(style);

function clearIcons() {
    document.querySelector('.card-notification')?.click();
}

function autoRepeatCheck() {
    clearIcons();
    checkGiftCard(document);
    document.querySelector('.adv_volume.volume_on')?.click();

    Audio.prototype.play = function() {
       return new Promise(() => {});
    };
}

async function checkGiftCard(doc) {
    const button = doc.querySelector('#gift-icon');
    if (!button) return;

    const giftCode = button.getAttribute('data-code');
    if (!giftCode) return false;

    try {
        const response = await fetch('/engine/ajax/controller.php?mod=gift_code_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'same-origin',
            body: new URLSearchParams({
                code: giftCode,
                user_hash: window.dle_login_hash
            })
        });
        const data = await response.json();
        if (data.status === 'ok') {
            window.DLEPush.info(data.text);
            button.remove();
        }
    } catch (error) {
        console.error('Ошибка при проверке подарочной карты:', error);
    }
}

async function startPing() {
    if (!window.dle_login_hash) {
        console.error("Переменная dle_login_hash не определена.");
        return;
    }

    // Определяем текущий домен
    const currentDomain = window.location.origin;

    /*
    try {
        await sleep(DELAY * 3);
        const user_count_timer_data = await new Promise((resolve, reject) => {
            $.ajax({
                url: "/engine/ajax/controller.php?mod=user_count_timer",
                type: "post",
                data: {
                    user_hash: dle_login_hash
                },
                dataType: "json",
                cache: false,
                success: resolve,
                error: reject
            });
        });
    } catch (e) {
        console.error("Ошибка запроса:", e);
        return false;
    }
    */
}

async function checkNewCard() {

    const currentDateTime = new Date();

    if (!window.dle_login_hash) {
        console.error("Переменная dle_login_hash не определена.");
        return;
    }

    const localStorageKey = 'checkCardStopped' + window.dle_login_hash;

    // Проверка: час уже остановлен
    if (localStorage.getItem(localStorageKey) === currentDateTime.toISOString().slice(0, 13)) {
        console.log("Проверка карты уже остановлена на текущий час.");
        return;
    }

    try {
        await sleep(DELAY * 3);

        const response = await fetch("/ajax/card_for_watch/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                user_hash: window.dle_login_hash
            })
        });

        const data = await response.json();

        if (data?.stop_reward === "yes") {
            console.log("Проверка карт остановлена на текущий час:", data.reason);
            localStorage.setItem(localStorageKey, currentDateTime.toISOString().slice(0, 13));
            return;
        }

        if (!data.cards || !data.cards.owner_id) {
            return;
        }

        if (data.cards.name) {
            window.DLEPush?.info('Получена новая карта "' + data.cards.name + '"');
        }

        const ownerId = data.cards.owner_id;
        console.log("owner_id получен:", ownerId);

    } catch (e) {
        console.error("Ошибка запроса:", e);
        return false;
    }
}

async function setCache(key, data, ttlInSeconds) {
    const expires = Date.now() + ttlInSeconds * 1000; // Устанавливаем срок хранения
    const cacheData = { data, expires };
    localStorage.setItem(key, JSON.stringify(cacheData));
}

async function getCardsCountInCart(name, id, username) {
    if (!name || !id) return;

    try {
        await sleep(DELAY * 4);

        const searchUrl = `/user/cards/?name=${encodeURIComponent(username)}&search=${encodeURIComponent(name)}`;
        // /user/cards/?name=ishutko&search=Ёруити%20и%20Рангику
        const response = await fetch(searchUrl);
        const html = new DOMParser().parseFromString(await response.text(), 'text/html');
        await checkGiftCard(html); // ищем небесный камень заодно
        const foundCards = html.querySelectorAll(`[data-id="${id}"]`);

        return foundCards.length;
    } catch (err) {
        console.error("Ошибка при запросе:", err);
        return "❌";
    }
}

async function getCache(key) {
    const cacheData = JSON.parse(localStorage.getItem(key));
    if (!cacheData) return null; // Если данных нет
    if (Date.now() > cacheData.expires) {
        localStorage.removeItem(key); // Если срок истёк, удаляем
        return null;
    }
    return cacheData.data;
}

async function cacheCard(key, data) {
    await setCache(key, data, 86400); // Записываем данные на 24 часа (86400 секунд)
}

async function getCard(key) {
    return await getCache(key); // Записываем данные на 24 часа (86400 секунд)
}

function addClearButton() {
    const filterControls = document.querySelector('.card-filter-form__controls');
    if (!filterControls) {
        return;
    }
    const inputField = filterControls.querySelector('.card-filter-form__search');
    if (!inputField) {
        return;
    }
    const searchButton = filterControls.querySelector('.tabs__search-btn');
    if (!searchButton) {
        return;
    }
    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '<i class="fas fa-times"></i>'; // Иконка Font Awesome
    clearButton.classList.add('clear-search-btn'); // Добавляем класс для стилизации
    clearButton.style.margin = '5px';
    clearButton.style.position = 'absolute';
    clearButton.style.padding = '10px';
    clearButton.style.background = 'red';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '14px';
    clearButton.style.borderRadius = '5px';
    clearButton.addEventListener('click', function () {
        inputField.value = '';
        searchButton.click();
    });
    inputField.style.marginLeft = '30px';
    inputField.parentNode.insertBefore(clearButton, inputField);
}

function addPromocodeBtn() {
    const button = document.createElement('button');
    button.innerText = 'Промокоды';
    button.style.position = 'fixed';
    button.style.bottom = '80px';
    button.style.right = '0px';
    button.style.zIndex = '1000';
    button.style.background = 'rgb(0, 123, 255)';
    button.style.fontSize = '8px';
    button.style.cursor = 'pointer';
    button.style.transform = 'rotateY(47deg);';
    button.addEventListener('click', () => {
        window.location.href = '/promo_codes';
    });
    document.body.appendChild(button);
}

(function() {
    'use strict';

    setInterval(autoRepeatCheck, 2000);
    setInterval(startPing, 31000);
    setInterval(checkNewCard, 10000);

    addUpdateButton();
    addClearButton();
    addPromocodeBtn();

    document.getElementById('tg-banner')?.remove();
    localStorage.setItem('notify18', 'closed');
    localStorage.setItem('hideTelegramAs', 'true');

    // авто открытие карт под аниме
    // $('div .pmovie__related a.glav-s:first')?.click()?.remove();

    // немного увеличиваем карты на списках чтоб читались надписи
    document.querySelectorAll('.anime-cards__item-wrapper').forEach(el => {
        el.style.setProperty('min-width', '20.28%');
    });

    if (isCardsPackPage()) {
        window.doAnimLoot = () => {};
    }

})();

document.addEventListener('click', function (e) {
    const target = e.target;

    if (target.classList.contains('anime-cards__name')) {
        const name = target.textContent.trim();
        const username = document.querySelector('a[href^="/user/"]')?.pathname.split('/')[2];
        const currentDomain = window.location.origin;
        const searchUrl = `${currentDomain}/user/cards/?name=${encodeURIComponent(username)}&search=${encodeURIComponent(name)}`;
        window.open(searchUrl, '_blank');
    }
});

const styleGlobal = document.createElement('style');
style.textContent = `
  .anime-cards__name {
    cursor: pointer;
    text-decoration: underline;
  }
`;
document.head.appendChild(styleGlobal);