// ==UserScript==
// @name			  patch koc 
// @namespace		  GameAdjustmentsKoC
// @description		Adjusting some KOC things to make it easier to play
// @homepageURL   https://greasyfork.org/en/scripts/408233-extra-koc-adjustments

// @include			  *.rycamelot.com/*main_src.php*
// @include			  *.beta.rycamelot.com/*main_src.php*
// @include		  	*apps.facebook.com/kingdomsofcamelot/*
// @include		  	*.rockyou.com/rya/*
// @license       CC-BY-4.0
// @connect	      greasyfork.org
// @version		  	1.0.6
// @downloadURL https://update.greasyfork.org/scripts/445607/patch%20koc.user.js
// @updateURL https://update.greasyfork.org/scripts/445607/patch%20koc.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// ****** CONQUEST ADJUSTMENTS ******
GM_addStyle('div.troopModal.largeModal.primaryContainer > div.borderbody > div.primarycontent { background: url("../img/troopBattle/troopBattle_bg.png") no-repeat,#d2ad55 !important; height: 1300px;');
GM_addStyle(".troopTopHalf > .wrapper > .troopSelectAttackingTroops { height: 865px;}");
GM_addStyle(".troopTopHalf > .wrapper > .troopSelectAttackingTroops .units { height: 793px;}");

GM_addStyle(".cmModalContainer.troopVictoryModal.recruit.cmModal2.mediumModal.primaryContainer {top: 600px !important;}");    // Conquest Lvl 1 Winner box adjustment
GM_addStyle(".cmModalContainer.troopVictoryModal.mercernary.cmModal2.mediumModal.primaryContainer {top: 600px !important;}"); // Conquest Lvl 2 Winner box adjustment
GM_addStyle(".cmModalContainer.troopVictoryModal.veteran.cmModal2.mediumModal.primaryContainer {top: 600px !important;}");    // Conquest Lvl 3 Winner box adjustment
GM_addStyle(".cmModalContainer.troopVictoryModal.hero.cmModal2.mediumModal.primaryContainer {top: 600px !important;}");       // Conquest Lvl 4 Winner box adjustment
GM_addStyle(".cmModalContainer.troopVictoryModal.conqueror.cmModal2.mediumModal.primaryContainer {top: 600px !important;}");  // Conquest Lvl 5 Winner box adjustment



// ****** JOUSTING ADJUSTMENTS ******
GM_addStyle(".joustingMatchmaking .opponents .opponent {height: 656px !important;}"); // Shows full stats on Jousting window when active
GM_addStyle(".joustingMatchmaking .stats_box {height: 564px !important;}"); // Shows full stats on Jousting window when active


// ****** FACEBOOK ADJUSTMENTS ******
GM_addStyle("._31e { position: inherit !important;}"); // stops scrolling
GM_addStyle("#rightCol { display: none !important;}");  // Removes the game Column from the right on FB
GM_addStyle("._2t-a, ._2t-8, ._6ce9 ._4mq3 .fbNubButton {display: none !important;}"); // Hides the FB Chat in the lower right of screen. 


