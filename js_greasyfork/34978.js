// ==UserScript==
// @name         Staker Roulette Tweaks
// @namespace    stakerroulettetweaks
// @version      0.1
// @description  visuell improvements / autocharting
// @author       stimpy
// @match        https://stake.com/games/roulette
// @match        *://stake.com/games/roulette/*
// @match        https://stake.com/games
// @match        https://stake.com/games/roulette*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/34978/Staker%20Roulette%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/34978/Staker%20Roulette%20Tweaks.meta.js
// ==/UserScript==
//////JQuery Compatibility statement//////
this.$ = this.jQuery = jQuery.noConflict(true);
//////JQuery Compatibility statement//////


document.getElementById('game-row').insertAdjacentHTML('beforebegin',
    '<br><div id="dropgame" class="tab-content tab-content-xs" style="border-style: solid;width: 720px;border-color: #000000;border-radius: 2px;border-style: solid;border-width: 1px; padding-bottom: 2px;padding-left: 2px;padding-right: 2px; padding-top: 2px"><div id="dropgameinnerwrap"> <div id="controlWrapper" style="Display:inline-block;">');


$( "#dropgameinnerwrap" ).css( "background", "red" );
