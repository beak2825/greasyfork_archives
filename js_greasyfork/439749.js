// ==UserScript==
// @name         3 Close tabs
// @namespace    Grizon_Ru
// @version      1.1
// @description  Close tabs
// @author       Grizon
// @match        https://autofaucet.dutchycorp.space/*
// @match        https://autoclaim.in/*
// @match        https://autofaucet.org/*
// @match        https://autobitco.in/*
// @match        https://99faucet.com/links*
// @match        https://btcbunch.com/links
// @icon         https://rxss.online/coin/extention/resurse/img/stop.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439749/3%20Close%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/439749/3%20Close%20tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        if (document.querySelector('span[class="bordeaux-span"]')) //Dutchy
             {window.close();}
        else if (document.querySelector('div[style="margin: 30px;"]')) //Autofaucet
             {window.close();}
        else if (document.querySelector('div[class="swal2-success-ring"]')) //99faucet,btcbunch
             {window.close();}
    }, 1500);
})();