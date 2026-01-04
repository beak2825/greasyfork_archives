// ==UserScript==
// @name        stock4shops - prices without login
// @namespace   https://ksir.pw
// @match       https://stock4shops.co.nz/*
// @grant       none
// @run-at      document-end
// @version     1.3
// @homepage    https://greasyfork.org/scripts/471948-stock4shops-prices-without-login/
// @supportURL  https://greasyfork.org/scripts/471948-stock4shops-prices-without-login/feedback
// @license     MIT
// @author      Kain (ksir.pw)
// @description 18/06/2023, 2:23:49 am
// @downloadURL https://update.greasyfork.org/scripts/471948/stock4shops%20-%20prices%20without%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/471948/stock4shops%20-%20prices%20without%20login.meta.js
// ==/UserScript==

setInterval(() => {
  const ids = Object.keys(window.wooptpmDataLayer.products);
  const prods = window.wooptpmDataLayer.products;

  if(ids.length > 1) {
    document.querySelectorAll('*[data-id]').forEach(product => {
	    const id = product.getAttribute('data-id');
	    const btns = document.querySelector(`.post-${id} .cart:not(.done)`);
      if(btns){
        btns.classList += ' done';
        btns.innerHTML = `$${prods[id].price} NZD` + btns.innerHTML;
      }
    });
  } else {
    const id = ids[0];
    const btns = document.querySelector('.nlogin-text:not(.done)');
    if(btns) {
      btns.classList += ' done';
      btns.innerHTML = `$${prods[id].price} NZD<br>` + btns.innerHTML;
    }
  }
}, 500);