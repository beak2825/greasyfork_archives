// ==UserScript==
// @name         OR - Unit convertor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert numbers to easier way to read it : 1.235.015.156 => 1.235 M
// @author       Maxime VINCENT
// @match        https://www.origins-return.fr/univers-origins/production.php
// @match        https://www.origins-return.fr/univers-origins/chantier.php*
// @exclude      https://www.origins-return.fr/univers-origins/chantier.php?cat*
// @match        https://www.origins-return.fr/univers-origins/specialise.php
// @match        https://www.origins-return.fr/univers-origins/empire.php
// @match        https://www.origins-return.fr/univers-origins/messagerie*
// @match        https://www.origins-return.fr/univers-origins/batiments.php*
// @match        https://www.origins-return.fr/univers-origins/batiments.php?cat*
// @match        https://www.origins-return.fr/univers-origins/laboratoire.php*
// @match        https://www.origins-return.fr/univers-origins/description.php*
// @match        https://www.origins-return.fr/univers-origins/laboratoire.php?cat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404414/OR%20-%20Unit%20convertor.user.js
// @updateURL https://update.greasyfork.org/scripts/404414/OR%20-%20Unit%20convertor.meta.js
// ==/UserScript==

const EQUIV_ARRAY = [
    '',
    'K',
    'M',
    'G',
    'T',
    'P',
    'E',
    'Z',
    'Y'
];

(function() {
    'use strict';

    function replaceNumber(n) {
        const arr = n.split('.')
        let toRemove = 2
        let scale = arr.length - toRemove
        if (scale >= EQUIV_ARRAY.length) {
            toRemove += scale - EQUIV_ARRAY.length
            scale = EQUIV_ARRAY.length - 1
        }
        const v = arr.length > 3 ? `${arr.slice(0, toRemove).join('.')} ${EQUIV_ARRAY[scale]}` : n
        return v
    }

    let allContent = document.documentElement.innerHTML.replace(/((?:[\d]*\.[\d]{3}){3,})/gm, (all, p1) => {
        return replaceNumber(p1)
    })
    document.documentElement.innerHTML = allContent

})();