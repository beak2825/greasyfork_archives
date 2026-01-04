// ==UserScript==
// @name        Yandex Eda price calculator
// @namespace   Violentmonkey Scripts
// @match       *://eda.yandex.ru/*
// @grant       none
// @version     1.5
// @author      Insaf Burangulov
// @description 12/6/2024, 7:41:34 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/519925/Yandex%20Eda%20price%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/519925/Yandex%20Eda%20price%20calculator.meta.js
// ==/UserScript==

// Главный селектор карточки
const CARD_PRICE_ROOT_CLASS = 'UiKitDesktopProductCard_descriptionWrapper';

// Селектор, исключающий для карточки повторный пересчет цены
const CARD_PRICE_CALCULATED_CLASS = 'calculated-by-price';

// Внутренний селектор карточки, содержащий вес/объем товара
const CARD_WEIGHT_CLASS = 'UiKitDesktopProductCard_weight';

const CARD_PRICE_SELECTOR = '.UiKitDesktopProductCard_priceWrapper span';

// Поиск карточек товаров
function findCardsForCalculating(root = document) {
    return root
        .querySelectorAll('.' + CARD_PRICE_ROOT_CLASS + ':not(.' + CARD_PRICE_CALCULATED_CLASS + ')');
}

// Извлечение количества и единицы измерения из карточки
function extractWeight(card) {
    const weightDiv = card.querySelector('.' + CARD_WEIGHT_CLASS);
    if (!weightDiv) {
        return false;
    }

    const weightData = weightDiv
        .textContent
        .split(/\s|&nbsp;/g)
    if (weightData.length < 2) {
        return false;
    }

    weightData[0] = parseFloat(weightData[0]);
    return weightData;
}

// Извлечение узла, содержащего цену товара
function extractPriceNode(card) {
    return card.querySelector(CARD_PRICE_SELECTOR);
}

// Извлечение цены товара
function extractPriceData(node) {
    const regex = /([0-9\s,]+)(\p{Sc}|\p{L})/gu;
    const match = node.textContent.match(regex);

    if (!match) {
        return false;
    }

    // Удаление пробелов и конвертация строки в число
    const amount = parseFloat(match[0]
        .replace(/\s/g, '')
        .replace(/,/g, '.'));

    // Извлечение символа валюты
    const currency = match[0]
        .replace(/[0-9\s,]/g, '')
        .trim();

    return [amount, currency];
}

// Функции расчета цены
const priceCalculators = {
    'г': (price, weight) => Math.round((price / weight) * 1000),
    'мл': (price, weight) => Math.round((price / weight) * 1000),
    'кг': (price, weight) => Math.round(price / weight),
    'л': (price, weight) => Math.round(price / weight),
    'шт': (price, weight) => Math.round(price / weight),
};

// Расчет цены
function calculatePrice(price, weight, type) {
    return priceCalculators[type] ? priceCalculators[type](price, weight) : false;
}

// Установка текста цены
function setPriceText(price, currencyChar, node) {
    if (price !== parseInt(node.textContent)) {
        node.textContent = node.textContent + '/' + price + '\u2009' + currencyChar;
    }
}

// Метка карточки как просчитанной
function markCardAsCalculated(card) {
    card.classList.add(CARD_PRICE_CALCULATED_CLASS);
}

// Обработка карточки товара
function processCard(card) {
    const weightData = extractWeight(card);
    if (!weightData) {
        return;
    }

    const weight = weightData[0];
    const type = weightData[1];

    const priceNode = extractPriceNode(card);
    if (!priceNode) {
        return;
    }

    const priceData = extractPriceData(priceNode);
    if (!priceData) {
        return;
    }

    const price = priceData[0];
    const currencyChar = priceData[1];

    const calculatedPrice = calculatePrice(price, weight, type);
    if (!calculatedPrice) {
        return;
    }

    setPriceText(calculatedPrice, currencyChar, priceNode);
    markCardAsCalculated(card);
}

// Расчет цены на загруженные карточки товаров
function calc_prices() {
    const cards = findCardsForCalculating();
    cards.forEach(processCard)
}

function createObserver() {
    let oldCardsCount = findCardsForCalculating().length;

    return new MutationObserver(() => {
        let newCardsCount = findCardsForCalculating().length;

        if (newCardsCount !== oldCardsCount) {
            oldCardsCount = newCardsCount;
            calc_prices();
        }
    });
}

const observer = createObserver();
observer.observe(document.body, {childList: true, subtree: true, attributes: false});