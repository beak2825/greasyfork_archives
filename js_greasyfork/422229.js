// ==UserScript==
// @name         OR - Production Unit convertor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert production numbers to an easier way to read it : 1.235(2) M => 1.235(4)
// @author       Arawn
// @match        https://www.origins-return.fr/univers-origins/production.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422229/OR%20-%20Production%20Unit%20convertor.user.js
// @updateURL https://update.greasyfork.org/scripts/422229/OR%20-%20Production%20Unit%20convertor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function numberWithSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function replaceProdNumber(n) {
        n = n.replace(' M', '');

        var max = n.replaceAll('.', '');
        max = Math.floor(Number(max) * 1.25);

        const arr = numberWithSeparator(max).split('.');
        const v = arr.length > 3 ? `${arr.slice(0, 2).join('.')} (${arr.length})` : n;
        return v;
    }

    let allContent = document.documentElement.innerHTML.replace(/((?:[\d]*\.[\d]{3}){3,}) M/gm, (all, p1) => {
        return replaceProdNumber(p1);
    })
    document.documentElement.innerHTML = allContent;

})();