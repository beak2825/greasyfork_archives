// ==UserScript==
// @name         Find Tile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Find f*cking tile...
// @author       Jox [1714547]
// @match        https://www.torn.com/city.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402220/Find%20Tile.user.js
// @updateURL https://update.greasyfork.org/scripts/402220/Find%20Tile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let div = document.createElement('div');
    let a = document.createElement('a');
    a.innerHTML = 'Find';
    let input = document.createElement('input');
    input.placeholder = 'Tile';
    input.addEventListener('keyup', e => {
        a.href = 'https://www.torn.com/city.php#terrName=' + input.value.toUpperCase();
        if(e.keyCode == 13){
            a.click();
        }
    })

    div.appendChild(input);
    div.appendChild(a);

    let referenceNode = document.querySelector('.tutorial-cont');

    referenceNode.parentNode.insertBefore(div, referenceNode.nextSibling);

})();