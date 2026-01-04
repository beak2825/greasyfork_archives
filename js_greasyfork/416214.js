// ==UserScript==
// @name         Horsey for lishogi
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       dugong161
// @match        https://lishogi.org/*
// @grant        bruh
// @downloadURL https://update.greasyfork.org/scripts/416214/Horsey%20for%20lishogi.user.js
// @updateURL https://update.greasyfork.org/scripts/416214/Horsey%20for%20lishogi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (getOriginalColour() == 'white')
    {
        addGlobalStyle(
            'piece.gote.knight { background-image: url(https://i.imgur.com/gCXGXXi.png)!important; }' +
            'piece.sente.knight { background-image: url(https://i.imgur.com/AhroEaJ.png)!important; }'
        );
    }
    else
    {
        addGlobalStyle(
            'piece.sente.knight { background-image: url(https://i.imgur.com/AhroEaJ.png)!important; }' +
            'piece.gote.knight { background-image: url(https://i.imgur.com/gCXGXXi.png)!important; }'
        );
    }

})();

/**
 * @returns 'white' | 'black'
 */
function getOriginalColour () {
    const str = document.body.innerHTML.match(/LishogiRound.boot\((.*?)\)/)[1];
    const data = JSON.parse(str);
    return data.data.player.color;
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};