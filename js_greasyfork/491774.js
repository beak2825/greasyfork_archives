// ==UserScript==
// @name        Swap Receiving/Giving Items
// @namespace   Violentmonkey Scripts
// @match       https://solario.lol/trade/*
// @grant       none
// @version     1.0
// @author      script
// @description Swap items giving and items receiving in trades.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491774/Swap%20ReceivingGiving%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/491774/Swap%20ReceivingGiving%20Items.meta.js
// ==/UserScript==

const tradeDiv = document.querySelector("body > div.ms-auto.me-auto > div > div.col-9");

const traded = tradeDiv.querySelectorAll(':scope > div.d-flex');
const rows = tradeDiv.querySelectorAll(':scope > div.row');

const receive = traded[0];
const receiveRow = rows[0];
const send = traded[1];
const sendRow = rows[1];

tradeDiv.replaceChild(send.cloneNode(true), receive);
tradeDiv.replaceChild(sendRow.cloneNode(true), receiveRow);
tradeDiv.replaceChild(receive.cloneNode(true), send);
tradeDiv.replaceChild(receiveRow.cloneNode(true), sendRow);