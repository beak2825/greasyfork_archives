// ==UserScript==
// @name         LolzHack
// @namespace    https://zelenka.guru/
// @version      0.1
// @description  LZT-Hack
// @author       Hack337
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @icon         https://zelenka.guru/public/2017/og.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @grant        window.close

// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455265/LolzHack.user.js
// @updateURL https://update.greasyfork.org/scripts/455265/LolzHack.meta.js
// ==/UserScript==


(function() {
        'use strict';
  $('span.balanceValue').text('999999999');
  $('span.MarketAvailableBalance').text('999999999');
  $('div.bigTextHeading').text('Сумма перевода (доступно 999999999 ₽)');
})();