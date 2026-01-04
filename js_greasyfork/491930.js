// ==UserScript==
// @name        Show Item Price In Trades
// @namespace   Violentmonkey Scripts
// @match       https://solario.lol/trade/view/*
// @grant       none
// @version     1.0
// @author      script
// @description Shows the price of items in trades.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491930/Show%20Item%20Price%20In%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/491930/Show%20Item%20Price%20In%20Trades.meta.js
// ==/UserScript==

const parser = new DOMParser();
const formatter = Intl.NumberFormat("en", { notation: "compact" });

const rows = document.querySelectorAll("body > div.ms-auto.me-auto > div > div.col-9 > div.row");

rows.forEach(row => {
    Array.from(row.children).forEach(item => {
        if (item.children.length < 2) return;
        fetch(item.querySelector(":scope > a").href).then(response => response.text()).then(html => {
            const doc = parser.parseFromString(html, "text/html");
            const price = formatter.format(parseInt(doc.querySelector("#main > div > div.row > div.col-md-3.p-1 > div > p > span").innerText.replace(/\D/g, "")));
            item.querySelector(":scope > div").innerHTML += `<p class="position-absolute bg-dark p-1 text-robux" style="bottom: -16px;right: 0px;font-size: 12px;">R$ ${price}</p>`;
        });
    });
});