// ==UserScript==
// @name         Buy/Sell Swap
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match        *.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/37079/BuySell%20Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/37079/BuySell%20Swap.meta.js
// ==/UserScript==

let buyWrap = document.querySelector('.buy-items-wrap')
let sellWrap = document.querySelector('.sell-items-wrap')

if (buyWrap && sellWrap) document.querySelector('.content-wrapper').insertBefore(buyWrap, sellWrap)