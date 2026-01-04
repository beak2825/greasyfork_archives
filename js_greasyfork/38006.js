// ==UserScript==
// @name         cryptoplay
// @namespace    http://moneybot24.com/
// @version      1
// @description  Sign up: https://cryptoplay.store/?ref=inverno88 - login and start to earn every 20 minute automatically
// @author       MoneyBot24.com
// @match        https://cryptoplay.store/*
// @downloadURL https://update.greasyfork.org/scripts/38006/cryptoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/38006/cryptoplay.meta.js
// ==/UserScript==

(function() {
    if(document.documentElement.innerText.indexOf('You can claim now.') > -1)
    {
        $('.btn.btn-lg.btn-primary').click();
    }
    var time = parseInt($('.center-block').children().first().text().split(' ')[0]);
    setTimeout( function() {
        location.href = location.href;
    }, time * 60 * 1000);
})();