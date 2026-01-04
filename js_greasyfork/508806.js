// ==UserScript==
// @name         Spor Çevrimli Bonus
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Otomatik çevrimli spor bonusu yükleme
// @author       Menderes Acarsoy
// @match        https://bo.bo-2222eos-gbxc.com/player/bonus/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=837bahsine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508806/Spor%20%C3%87evrimli%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/508806/Spor%20%C3%87evrimli%20Bonus.meta.js
// ==/UserScript==


var bonusAmountElement = document.querySelector("input[name='amount']");
var targetAmountElement = document.querySelector("input[name='targetAmount']");
var minOddElement = document.querySelector("input[name='minOdd']");
var maxWinElement = document.querySelector("input[name='maxWin']");
var descriptionElement = document.querySelector("textarea[name='description']");

var url = location.href;
var x = url.split('?')[1];
var urlParams = new URLSearchParams(x);

urlParams.forEach(function(value, key) {
    if (key === "bonusAmount") {
        bonusAmountElement.value = value;
    } else if (key === "targetAmount") {
        targetAmountElement.value = value;
    } else if (key === "minOdd") {
        minOddElement.value = value;
    } else if (key === "description") {
        descriptionElement.value = value;
    }
});

maxWinElement.value = "9999999.99";