// ==UserScript==
// @name         Gamestop force enable add to cart/pre-order
// @namespace    gamestop-force-enable
// @version      0.1
// @description  Enable the gamestop add to cart/pre-order quicker
// @author       BattleEye
// @match        https://www.gamestop.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433888/Gamestop%20force%20enable%20add%20to%20cartpre-order.user.js
// @updateURL https://update.greasyfork.org/scripts/433888/Gamestop%20force%20enable%20add%20to%20cartpre-order.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
   $("#add-to-cart").before(`<button id="updateBUtton" class="btn-sm btn btn-secondary">Update Button</button>`);
   $("#updateBUtton").click (updateButton);
})

function updateButton(){
   $("#add-to-cart").attr('disabled',false);
   $("#add-to-cart").text("Add to cart/Pre-Order");
}