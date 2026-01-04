// ==UserScript==
// @name          Combat 2.0
// @version       1.1
// @namespace     Zahonek
// @description   Kickass combat 2.0 (may include slight rounding error)
// @author        Mrkef
// @match         *://*.idlescape.com/game
// @downloadURL https://update.greasyfork.org/scripts/428060/Combat%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/428060/Combat%2020.meta.js
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

addGlobalStyle('@keyframes combatplayerx {0% {transform: translate(0,0);} 20% {transform: translate(0,0);} 60% {transform: translate(80%,0);} 100% {transform: translate(0,0);}} @keyframes combatplayery {0% {transform: translate(0,0);} 20% {transform: translate(0,0);} 35% {transform: translate(0,-10%);} 60% {transform: translate(0,0);} 100% {transform: translate(0,0);}} div.combat-player-area {z-index: 1; animation-name: combatplayerx; animation-duration: 4s; animation-iteration-count: infinite;} div.combat-player-area > div {animation-name: combatplayery; animation-duration: 4s; animation-iteration-count: infinite; animation-timing-function: linear;}');

addGlobalStyle('@keyframes combatmonsterxy {0% {transform: translate(0,0);} 20% {transform: translate(0,0);} 40% {transform: translate(-15%,-7%);} 60% {transform: translate(-30%,0);} 80% {transform: translate(-20%,0);} 100% {transform: translate(0,0);}} div.combat-monster-area {animation-name: combatmonsterxy; animation-duration: 4s; animation-iteration-count: infinite; animation-timing-function: linear;}');

addGlobalStyle('@keyframes explosionsX{from{background-position-x:0}to{background-position-x:-2048}}@keyframes explosionsY{from{background-position-y:0}to{background-position-y:-1488px}}div.death-animation::after{content:" ";position:absolute;animation:explosionsX 50ms steps(8),explosionsY .4s steps(6);width:256px;height:248px;background-repeat:no-repeat;background-image:url(https://imgpile.com/images/NG4Nhc.png)}');