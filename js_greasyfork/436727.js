// ==UserScript==
// @name         Useless Egg Count
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Egg Count Abuse
// @author       Jayvan
// @match        https://shellshock.io/
// @icon         https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/231/among-us-player-white-512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436727/Useless%20Egg%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/436727/Useless%20Egg%20Count.meta.js
// ==/UserScript==

setInterval(function() {
    var random;
    function genNumber() {
        random = Math.floor(Math.random() * 1000000);
        return random;
    };
    genNumber();
    while(random % 5 !== 0) {
        genNumber();
    }
    document.getElementById('account_top').getElementsByClassName('egg_count')[0].innerHTML = random;
    document.getElementById('equip_screen').getElementsByClassName('egg_count')[0].innerHTML = random;
    document.getElementById('game_account_panel').getElementsByClassName('egg_count')[0].innerHTML = random;
}, 100);
//Change the above number to speed up/slow down
//Lower # is faster, Higher # is slower (1000 = 1 second)