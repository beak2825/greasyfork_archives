// ==UserScript==
// @name         Premium Exchange - Alert Resources
// @description  Plays chicken sound whenever there is something in the stock
// @author       FunnyPocketBook
// @version      1.2.1
// @include      https://*/game.php*screen=market*
// @namespace    https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/387611/Premium%20Exchange%20-%20Alert%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/387611/Premium%20Exchange%20-%20Alert%20Resources.meta.js
// ==/UserScript==


let woodOld = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
let stoneOld = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
let ironOld = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);

let checkRes = setInterval(() => {
    let woodCurrent = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
    let stoneCurrent = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
    let ironCurrent = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);
    if (woodCurrent != woodOld || stoneCurrent != stoneOld || ironCurrent != ironOld) {
        TribalWars.playSound("chicken");
    }
    woodOld = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
    stoneOld = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
    ironOld = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);
}, 100);