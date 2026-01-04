// ==UserScript==
// @name         Gats.io Adblock
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adblocker for Gats.io
// @author       Taureon
// @match        https://gats.io/
// @match        https://gats2.com/
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/454825/Gatsio%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/454825/Gatsio%20Adblock.meta.js
// ==/UserScript==

(function main(){

    //if the game hasn't loaded yet, wait until it is loaded
    //it is checked if the game has loaded by checking if the game tick function exists
    if (typeof a41 !== 'function') return setTimeout(main);

    //this disables ad related functions
    a119=()=>{};a78=()=>{};a79=()=>{};a80=()=>{};

    //removes the component that checks for adblock
    play = () => {
        if (RF.list[0] === undefined) return;
        if (!c4) {
            var selection = {class: c1.weapon, armor: c1.armor, color: c1.color};
            RF.list[0].send(a59("c1", selection));
        }
        b21 = true;
        a36();
    };

    //this removes ad elements
    for (let ad of j36) {
        //to make it work with TioHax Client without it crashing
        let element = document.getElementById(ad.pl);
        if (element) element.remove();
    }

})();