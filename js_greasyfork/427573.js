// ==UserScript==
// @name         WaxDropsCatcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fast catcher for wax drops
// @author       Logarit
// @match        https://wax.atomichub.io/drops/*
// @icon         https://static.cryptobuyingtips.com/static/img/coins/200x200/2300.png
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/427573/WaxDropsCatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/427573/WaxDropsCatcher.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';
    setTimeout(function() {
        if ($(".btn.btn-primary.btn-block").length){
        var intv = setInterval(function() {
        var isDisabled = $(".btn.btn-primary.btn-block").is(':disabled');
    if (isDisabled) {
        console.log("Дроп еще не начался!");
    } else {
        console.log("ЛОВИМ!");
        document.querySelector(".btn.btn-primary.btn-block").click();
        document.querySelectorAll(".btn.btn-primary.btn-block")[1].click();
        clearInterval(intv);
    }
}, 100);
}
}, 1000);
})();