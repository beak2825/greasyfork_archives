// ==UserScript==
// @name         jp-bank-auto-id-input
// @namespace    https://nzws.me/
// @version      1.0
// @description  id入力だっるw
// @author       nzws
// @match        https://direct.jp-bank.japanpost.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389860/jp-bank-auto-id-input.user.js
// @updateURL https://update.greasyfork.org/scripts/389860/jp-bank-auto-id-input.meta.js
// ==/UserScript==

const $ = _id => document.querySelector(_id);

(function() {
    'use strict';
    const id = localStorage.getItem('jp_bank_customer_id');
    if (!id) return;
    const arrId = id.split('-');

    const id1 = $('input[name="okyakusamaBangou1"]');
    if (id1) id1.value = arrId[0];

    const id2 = $('input[name="okyakusamaBangou2"]');
    if (id2) id2.value = arrId[1];

    const id3 = $('input[name="okyakusamaBangou3"]');
    if (id3) id3.value = arrId[2];
})();