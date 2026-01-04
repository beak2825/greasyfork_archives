// ==UserScript==
// @name         FantasyFeeder Lbs to Kg replacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  In civilised world we use Kilograms not Pounds
// @author       Me
// @license MIT
// @match        http*://fantasyfeeder.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantasyfeeder.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455059/FantasyFeeder%20Lbs%20to%20Kg%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/455059/FantasyFeeder%20Lbs%20to%20Kg%20replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nolbs = /\b((\d*)(?=lbs))/g;
    const wlbs = /\b((\d*)(lbs))/g;
    //document.body.innerHTML = document.body.innerHTML.replace(regex, 'xyz');
    const found=document.body.innerHTML.match(wlbs)
    const foundraw=document.body.innerHTML.match(nolbs)
    for (let i = 0; i < found.length; i++) {
    console.log(found[i]);
    document.body.innerHTML = document.body.innerHTML.replace(found[i], (foundraw[i]*0.45359237).toFixed(2) + ' kg');
}
})();