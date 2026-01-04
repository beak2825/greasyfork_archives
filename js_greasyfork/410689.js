// ==UserScript==
// @name         DH3 Quick SD Converter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert a spesified amount of SD into SD packs
// @author       Lasse Brustad
// @match        https://dh3.diamondhunt.co/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410689/DH3%20Quick%20SD%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/410689/DH3%20Quick%20SD%20Converter.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';

    // how many packs do you want to convert at once? default is 100, so 100k SD turns into 100 packs
    // 0 = all
    // 1+ = stardust / 1000 / packs
    const packs = 100;


    /**
     * #==================================================================#
     * #                                                                  #
     * # I suggest you to keep away from the code below here to keep safe #
     * #                                                                  #
     * #==================================================================#
     **/


    // Format Numbers - 1000 = 1,000
    const fnum = window.formatNumber;

    // Get SD, but returns "null" if it isn't enough to convert
    function getSD() {
        const sd = window.getItem('stardust');
        return sd >= 1e3 ? sd : null;
    }

    // Get the number of convertable SD packs you can convert SD to
    function getMaxConvertableSD() {
        const sd = getSD();
        if (sd === null) return 0;
        return Math.floor(sd / 1e3);
    }

    function final() {
        const maxPacks = getMaxConvertableSD();
        let total = maxPacks;
        if (packs !== 0) total -= total % packs;
        if (total === 0) return;

        console.log(`Converted ${fnum(total * 1e3)} SD into ${fnum(total)} SD packs`);
        window.sendBytes(`MAKE_SD_PACKS=${total}`);
    }

    window.convertStardustToPack = final;
})();