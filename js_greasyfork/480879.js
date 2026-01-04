// ==UserScript==
// @name        Eliminar monedas cesta AliExpress
// @namespace   Violentmonkey Scripts
// @match       https://www.aliexpress.com/p/trade/confirm.html*
// @match       https://www.aliexpress.com/p/shoppingcart/index.html*
// @grant       none
// @icon        https://ps.w.org/woo-aliexpress/assets/icon-256x256.png?rev=2162754
// @version     1.0
// @author      @xxdamage
// @description Elimina automáticamente las monedas de la cesta de AliExpress
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480879/Eliminar%20monedas%20cesta%20AliExpress.user.js
// @updateURL https://update.greasyfork.org/scripts/480879/Eliminar%20monedas%20cesta%20AliExpress.meta.js
// ==/UserScript==

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

const waitQuerySelector = async (selector, timeout = 10000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await sleep(100);
  }
  throw new Error(`Tiempo de espera agotado esperando al selector: "${selector}"`);
};

const clickButton = async (selector) => {
  try {
    const button = await waitQuerySelector(selector);
    button.click();
    await sleep(100);
  } catch (error) {
    console.error(`Error al hacer clic en el botón: ${selector}`, error);
  }
};

(async () => {
  try {
    await clickButton('.comet-icon-arrowdown');
    await clickButton('.pl-list-card-container__item-arrow .comet-icon-arrowright');
    await clickButton('.comet-checkbox-circle');
    await clickButton('.pl-model-custom-footer__btn-wrap button');
  } catch (error) {
    console.error('Error al ejecutar el script', error);
  }
})();
