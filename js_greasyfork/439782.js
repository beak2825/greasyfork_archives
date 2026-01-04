// ==UserScript==
// @name         Better colors for wordle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fix wordle's colors to be better
// @author       Candle Eatist
// @match        https://www.powerlanguage.co.uk/wordle/
// @icon         https://www.google.com/s2/favicons?domain=powerlanguage.co.uk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439782/Better%20colors%20for%20wordle.user.js
// @updateURL https://update.greasyfork.org/scripts/439782/Better%20colors%20for%20wordle.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(':root { --green: #62c659 !important; --darkendGreen: #50b747 !important; --yellow: #e5c432 !important; --darkendYellow: #d1b123 !important; --color-tone-2: #898989 !important; }');
addGlobalStyle('.nightmode{ --color-tone-2: #777777 !important ; --color-tone-4: #333333 !important ; --color-tone-1: #e9e9e9 !important ;}')

//stuff I removed from line 22  --color-tone-2: #cccccc; !important; --color-tone-4: #999999 !important ; --color-tone-1: #eeeeee !important;
