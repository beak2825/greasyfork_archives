// ==UserScript==
// @name         Autoclaim instant-btc Faucet
// @description  Autoclaim instant-btc Faucet, play without Captcha, after get minimum amount (5 satoshis) every interval of 7 or 13 minutes with script. First try working...
// @description  In the first execution, maybe you need to fill captcha form... after that, will execute automatically...
// @description  Support my work join with https://bit.ly/3bLk3g1
// @description  Donate BTC Core to: 32C5696f8xJf4E5PpbguczFidjp7RaPGfs
// @icon         https://j.mp/2FmoJgk
// @namespace    http://tampermonkey.net/
// @create       2020-09-10
// @lastmodified 2020-09-10
// @version      0.1
// @author       Douglas E. C. Carvalho
// @match        https://www.instant-btc.eu/faucet*
// @grant        none
// @copyright    2020, Douglas E. C. Carvalho
// @downloadURL https://update.greasyfork.org/scripts/411187/Autoclaim%20instant-btc%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/411187/Autoclaim%20instant-btc%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isDebug = true;
    //var selFaucet = "body > div.navbar.navbar-fixed-top > div > div > nav > ul.nav.navbar-nav:nth-child(1) > li:nth-child(1) > a";
    var selAmount = "body > main > div.container > div:nth-child(2) > div:nth-child(2) > div > div > div.row > div > div:nth-child(2) > span";
    var selButton = "body > main > div.container > div:nth-child(2) > div:nth-child(2) > div > div > div.row > div:nth-child(2) > div:nth-child(2) > button";

    window.onload = function(){
        $('#fbf-mobile-close-coinzilla').click();
        reclamar();
        setInterval(function(){ reclamar(); }, random(420000, 780000));
    };

    function reclamar(){
        var amount = $(selAmount).text().substring(0,10);
        var button = $(selButton);
        if(isDebug) console.log('Amount: ==> '+ $(selAmount).text().substring(0,10));
        if(amount > 0.00000004){
            button.click();
            if(isDebug) console.log('Clicking Claim Now... '+button.text());
            setTimeout(function(){ recarregar(); }, random(2000, 5000));
        }
    }

    function recarregar(){
        location.reload();
    }

    function random(min, max) {
        return min + (max - min) * Math.random();
    }
})();