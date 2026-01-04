// ==UserScript==
// @name         Super Compare Cart
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Create Cart
// @author       Professor
// @match        https://www.ybitan.co.il/*
// @match        https://www.carrefour.co.il/*
// @match        https://www.quik.co.il/*
// @match        https://www.yuda.co.il/*
// @match        https://www.victoryonline.co.il/*
// @match        https://www.tivtaam.co.il/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512078/Super%20Compare%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/512078/Super%20Compare%20Cart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function removeQueryParam(param) {
        const url = new URL(window.location);
        url.searchParams.delete(param);
        window.history.replaceState({}, '', url);
    }

    const cartId = getQueryParam('loginOrRegister');

    if (cartId) {
        localStorage.setItem('frontend', JSON.stringify({"serverCartId": cartId, "cartClosed": "0"}));
        removeQueryParam('loginOrRegister');
    }

})();
