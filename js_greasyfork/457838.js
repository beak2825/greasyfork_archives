// ==UserScript==
// @name         Złoże i tropiciele herosów
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  wykrywa złoża i tropicieli (żółty napis)
// @author       You
// @match        http*://*.margonem.pl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457838/Z%C5%82o%C5%BCe%20i%20tropiciele%20heros%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/457838/Z%C5%82o%C5%BCe%20i%20tropiciele%20heros%C3%B3w.meta.js
// ==/UserScript==

((Engine) => {

    const arrayOfElements = ['Złoże', 'Tropiciel Herosów', 'Wtajemniczony Tropiciel Herosów','Doświadczony Tropiciel Herosów'];

    const log = ({d: npc}) => {
        if(arrayOfElements.includes(npc.nick)) {
            window.message(`Znaleziono ${npc.nick}`);
        }
    };

    window.API.addCallbackToEvent('newNpc', log)
})(window.Engine);