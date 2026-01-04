// ==UserScript==
// @name         TNA1
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/en/scripts/35976/
// @version      0.4
// @description  try to take over the world!
// @author       TNA
// @match        https://*.unixcoin.com/*
// @match        https://*.unixcoin.com/?*
// @include      wake.unixcoin.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35976/TNA1.user.js
// @updateURL https://update.greasyfork.org/scripts/35976/TNA1.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    var hour = 17;
    var minute = 0;
    var second = 0;
    var milis = 0;
    var timeF5 = 45000;

    var f5TimerId = 0;
    var now = new Date();
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second, milis) - now;
    if (millisTill10 < 0) {
        return 0;
        //document.getElementsByClassName("base-font-color")[5].click();
        //document.getElementsByClassName("btn btn-lg btn-accent-black")[0].click();
    }

    setTimeout(function(){
        f5TimerId = setInterval(function(){
            window.location.reload();
        }, timeF5);
    }, millisTill10 - 120000
    );

    setTimeout(function(){
        clearInterval(f5TimerId);
    }, millisTill10 - 10000);
    setTimeout(function(){
        document.getElementsByClassName("base-font-color")[5].click();
        document.getElementsByClassName("btn btn-lg btn-accent-black")[0].click();
    }, millisTill10);

});