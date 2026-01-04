// ==UserScript==
// @name         Company Stock Order
// @namespace    hardy.company.stock
// @version      1.3
// @description  Auto-fills amount in Company Stock Boxes
// @author       Hardy [2131687]
// @match        https://www.torn.com/companies.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422084/Company%20Stock%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/422084/Company%20Stock%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var quant = 0;
    var cost = 0;
    var cooldown = setInterval(fillStock, 2500);
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function fillStock() {
        let form = document.querySelector("form[action^='companies.php?step=stock1']");
        if (form) {
            //clearInterval(cooldown);
            let nodeList = document.querySelector(".stock-list-wrap .stock-list").children;
            for (const node of nodeList) {
                if (!node.className) {
                    let obj = {};
                    obj.amount = node.querySelector(".info-wrap .sold-daily").innerText;
                    if (obj.amount.toUpperCase().includes("SOLD")) {
                        obj.amount = obj.amount.replace(/\s/g, "").replace(/"/g, "").split(":")[1]
                    }
                    //console.log(amount);
                    node.querySelectorAll(".quantity .input-money-group input").forEach(function(element) {element.value = obj.amount});
                    //console.log(node.querySelectorAll(".quantity .input-money-group input"));;
                    node.className = "new";
                    node.querySelector(".input-money-group").classList.add("success");
                    let amount = parseInt(obj.amount.replace(/,/g, ""));
                    quant += amount;
                    let price = parseInt(node.querySelector(".cost").innerText.split("$")[1].replace(/,/g, ""));
                    cost += price * amount;
                }
            }
            document.querySelector(".total.t-hide .quantity .amount").innerText = formatNumber(quant);
            document.querySelector("li.quantity .amount").innerText = formatNumber(quant);
            document.querySelector("div.total-price .amount").innerText = formatNumber(cost);
            clearInterval(cooldown);
        }
    }
})();
