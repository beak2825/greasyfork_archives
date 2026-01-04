// ==UserScript==
// @name         util
// @license      MIT
// @description  TL;DR
// @author       https://greasyfork.org/ja/users/705684
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * format to HH:MM:SS
     * @param {Date} date JavaScript Date object
     * @return {string} HH:MM:SS
     */
    window.formatTime = date => {
        let d = date && date !== 0 ? new Date(date) : Date.now();
        d /= 1000;
        const s = (d | 0) % 60;
        d /= 60;
        d -= new Date().getTimezoneOffset();
        const m = (d | 0) % 60;
        d /= 60;
        const h = (d | 0) % 24;
        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    };

    /**
     * calc PseudoRandom from seed
     * @param {string} seed
     * @return {number} 0 <= x < 1
     */
    window.pseudoRandomBy = async seed => {
        const [a, b] = new Uint8Array(await window.crypto.subtle.digest('SHA-1', (new TextEncoder()).encode(seed)));
        const unique = (a << 8) + b;
        return unique / 0x10000;
    };
})();