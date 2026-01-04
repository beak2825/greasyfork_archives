// ==UserScript==
// @name         Цена с кэшбеком от Яндекс Банка на Ozon
// @namespace    https://greasyfork.org/users/1265523-apterousteen
// @version      1.3.0
// @description  Script for Ozon marketplace. Injects the price with the deduction of Yandex Bank cashback into product and cart pages
// @description:ru  Скрипт для маркетплейса Ozon. Добавляет цену с вычетом кэшбека от Яндекс Банка на страницу товара и в корзине
// @author       apterousteen
// @match        https://www.ozon.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/488046/%D0%A6%D0%B5%D0%BD%D0%B0%20%D1%81%20%D0%BA%D1%8D%D1%88%D0%B1%D0%B5%D0%BA%D0%BE%D0%BC%20%D0%BE%D1%82%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%91%D0%B0%D0%BD%D0%BA%D0%B0%20%D0%BD%D0%B0%20Ozon.user.js
// @updateURL https://update.greasyfork.org/scripts/488046/%D0%A6%D0%B5%D0%BD%D0%B0%20%D1%81%20%D0%BA%D1%8D%D1%88%D0%B1%D0%B5%D0%BA%D0%BE%D0%BC%20%D0%BE%D1%82%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%20%D0%91%D0%B0%D0%BD%D0%BA%D0%B0%20%D0%BD%D0%B0%20Ozon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const YANDEX_CASHBACK = 0.03;
  const YANDEX_GRADIENT =
    'radial-gradient(100% 283.68% at 0 100%, #fcab14 0, #fa6641 15.91%, #be40c0 40.21%, rgba(80, 90, 221, 0) 100%), radial-gradient(107.24% 195.45% at 100% 0, #48cce0 0, #428beb 28.85%, #505add 60.18%)';

  // Интервал чисто для корректной работы в Firefox
  const interval = setInterval(() => {
    // На странице товара
    if (window.location.pathname.includes('product')) {
      let loaded = document.querySelector('div[data-widget=webAddToCart] div > span');

      if (loaded) {
        clearInterval(interval);
        productPageFn();
      }
    }

    // В корзине
    if (window.location.pathname.includes('cart')) {
      let loaded = document.querySelector('div[data-widget=paginator]');

      if (loaded) {
        clearInterval(interval);
        cartPageFn();
      }
    }
  }, 500);

  const formatPrice = (yandexPrice, inCart = false) => {
    return new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 2,
    })
      .format(yandexPrice)
      .replaceAll(/\u00A0/g, '&thinsp;')
      .concat(inCart ? '&nbsp;₽' : '&thinsp;₽');
  };

  // Вставка ноды цены на странице товара с копированием стилей Озона
  const appendProductPriceNode = (price) => {
    const parentEl = document.querySelector('div[data-widget=webPrice] button');
    const markupNode = document.querySelector('div[data-widget=webPrice] button span');
    const customNode = markupNode.cloneNode(true);
    customNode.classList.add('custom-price-container');
    customNode.style.marginTop = '8px';
    parentEl.appendChild(customNode);
    let [priceValue, cardName] = [...document.querySelectorAll('.custom-price-container span')];
    priceValue.parentElement.style.background = YANDEX_GRADIENT;
    priceValue.innerHTML = `${price}`;
    cardName.innerHTML = `c Яндекс СБП`;
  };

  // Кастомный HTML для цен в корзине
  const generateCartPriceMarkup = (price) => {
    return `
    <style>
      .custom-price-container {
        align-items: center;
        display: inline-flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }

      .custom-price__value {
        border-radius: 4px;
        font-size: 16px;
        line-height: 20px;
        padding: 0 4px;
        font-weight: 700;
        margin: 0 4px 2px 0;
        white-space: nowrap;
        color: rgba(255, 255, 255, 1);
        background: ${YANDEX_GRADIENT};
      }

      .custom-price__caption {
        color: rgb(44, 89, 189);
        font-size: 12px;
        line-height: 16px
      }
    </style>
    <div class="custom-price-container">
      <div class="custom-price__value">
        ${formatPrice(price, true)}
      </div>
      <div class="custom-price__caption">
        с Яндекс СБП
      </div>
    </div>`;
  };

  // Вставка кастомного HTML для цен в корзине
  const insertCartPriceHTML = (updatePrice = false) => {
    console.log('❗Ozon User Script / insertCartPriceHTML()');

    const cartItems = [...document.querySelectorAll('div[data-widget=split] > div')].slice(1);

    for (let i = 0; i < cartItems.length; i++) {
      let item = cartItems[i];
      let yandexPriceIsUpToDate = item.querySelector('.custom-price-container') && !updatePrice;

      if (yandexPriceIsUpToDate) continue;

      item.querySelector('.custom-price-container')?.remove();
      const priceParentEl = item.querySelector('a + div + div');
      const rawPriceContainer = item.querySelector('div > span > span');
      const rawPrice = Number.parseInt(rawPriceContainer?.innerHTML.match(/\d+/g).join(''));
      const yandexPrice = rawPrice - YANDEX_CASHBACK * rawPrice;
      const markup = generateCartPriceMarkup(yandexPrice);
      priceParentEl?.insertAdjacentHTML('afterbegin', markup);
    }
  };

  // Кастомный HTML для цены без Ozon карты
  const generateNotOzonPriceMarkup = (price) => {
    return `
      <style>
      .custom-product-price__container {
        margin-bottom: 8px;
        white-space: nowrap;
        align-items: baseline;
        display: flex;
        flex-direction: row;
      }

      .custom-product-price__value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 8px;
        color: #fff;
        padding: 2px 8px;
        background: ${YANDEX_GRADIENT};
      }

      .custom-product-price__value span {
        font-size: 30px;
        font-weight: 700;
        line-height: 38px;
      }

      .custom-product-price__caption {
        color: #070707;
        margin-left: 8px;
      }
    </style>
    <div class="custom-product-price__container">
      <div class="custom-product-price__value">
        <span>${formatPrice(price)}</span>
      </div>
      <span class="custom-product-price__caption">
        с Яндекс СБП
      </span>
    </div>`;
  };

  const insertNotOzonPriceHTML = () => {
    console.log('❗Ozon User Script / insertNotOzonPriceHTML()');

    const priceParentEl = document.querySelector('div[data-widget=webPrice]');
    const priceEl = document.querySelector('div[data-widget=webPrice] div > span');

    if (!priceEl) {
      console.error('Unusual Price');
      return;
    }

    const rawPrice = Number.parseInt(priceEl.innerHTML.match(/\d+/g).join(''));
    const yandexPrice = rawPrice - YANDEX_CASHBACK * rawPrice;
    const markup = generateNotOzonPriceMarkup(yandexPrice);
    priceParentEl?.insertAdjacentHTML('afterbegin', markup);
  };

  const productPageFn = () => {
    console.log('❗Ozon User Script / Product');

    const priceEl = document.querySelector('div[data-widget=webPrice] > div > div:nth-child(2) span');

    if (!priceEl) {
      console.log('❗Ozon User Script / Not Ozon Price');
      return insertNotOzonPriceHTML();
    }

    const rawPrice = Number.parseInt(priceEl.innerHTML.match(/\d+/g).join(''));
    const yandexPrice = rawPrice - YANDEX_CASHBACK * rawPrice;
    const formattedPrice = formatPrice(yandexPrice);

    appendProductPriceNode(formattedPrice);
  };

  const cartPageFn = () => {
    insertCartPriceHTML();

    // Подписка на изменения товаров в корзине: добавление, удаление, кол-во
    const targetNode = document.querySelector('div[data-widget=container]');
    const config = { childList: true, subtree: true, characterDataOldValue: true };
    const DOMChangeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Изменение цены при изменении кол-ва товаров
        if (mutation.type === 'characterData' && mutation.oldValue !== mutation.target.textContent) {
          insertCartPriceHTML(true);
        } else insertCartPriceHTML();
      }
    });
    DOMChangeObserver.observe(targetNode, config);
  };
})();
