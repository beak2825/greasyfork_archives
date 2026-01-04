// ==UserScript==
// @name			    Extra KOC Adjustments
// @namespace		  GameAdjustmentsKoC
// @description		Adjusting some KOC things to make it easier to play
// @icon
// @homepageURL   https://greasyfork.org/en/scripts/408233-extra-koc-adjustments
// @include			*.rycamelot.com/*main_src.php*
// @include			*.beta.rycamelot.com/*main_src.php*
// @include			*apps.facebook.com/kingdomsofcamelot/*
// @include			*apps.facebook.com/*
// @require			  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require			  http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @connect			  *
// @connect	      greasyfork.org
// @grant	      GM_addStyle
// @run-at	      document-end

// @license       CC-BY-4.0


// @version		  	2.0.2
// @downloadURL https://update.greasyfork.org/scripts/524772/Extra%20KOC%20Adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/524772/Extra%20KOC%20Adjustments.meta.js
// ==/UserScript==



function GM_addStyle(css) {
    var head = document.getElementsByTagName('head')[0];
    if (!head) return;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// ***** TR CARD SEARCH ******//
GM_addStyle(`
  #btthroneSearchEffectFilter,
  #btthroneSearchTypeFilter,
  #btthroneSearchQualityFilter,
  #btthroneSearchLevelFilter,
  #btthroneSearchJewelFilter,
  #btthroneSearchFactionFilter {
    height: 200px !important;
  }
`);

// **** SIDE SCROLL TR CARDS ***** //
(function() {
    'use strict';

    function convertScroll(e) {
        if (!e.deltaY) return;
        e.preventDefault();
        this.scrollLeft += e.deltaY + e.deltaX;
    }

    function attachScrollListener() {
        const element = document.getElementById('btthroneSearchResults');
        if (element) {
            element.addEventListener('wheel', convertScroll);
            return true;
        }
        return false;
    }

    if (!attachScrollListener()) {
        const intervalId = setInterval(() => {
            if (attachScrollListener()) {
                clearInterval(intervalId);
            }
        }, 500);
    }
})();


// ****** CONQUEST ADJUSTMENTS ******
GM_addStyle('div.troopModal.largeModal.primaryContainer > div.borderbody > div.primarycontent { background: url("../img/troopBattle/troopBattle_bg.png") no-repeat #d2ad55 !important; height: 1300px !important;');
GM_addStyle(".cmModalContainer.troopModal.cmModal1.largeModal.primaryContainer {  height: 1300px !important;}"); //Royal

GM_addStyle(`
  [class^="cmModalContainer"].troopVictoryModal.cmModal2.mediumModal.primaryContainer {
    top: 884px !important;
    left: 337px !important;
  }`);


GM_addStyle(`
  .troopTopHalf {
    height: 965px !important; /* Royal */
  }

  .troopTopHalf > .wrapper > .troopSelectAttackingTroops {
    height: 925px !important; /* General */
  }

  .troopTopHalf > .wrapper > .troopSelectAttackingTroops .units {
    height: 793px;
    overflow-x: none;
  }`);


// ****** JOUSTING ADJUSTMENTS ****** //
GM_addStyle(".joustingMatchmaking .opponents .opponent {height: 656px !important;}"); // Shows full stats on Jousting window when active
GM_addStyle(".joustingMatchmaking .stats_box {height: 564px !important;}"); // Shows full stats on Jousting window when active
GM_addStyle("#ptJoustPop {  top: 180px !important; height: 600px !important;}");
GM_addStyle("#pbjoust_info {height: 525px !important;max-height: 600px !important;overflow-y: auto !important;background-color: #fff;}");



// ****** BOSS BATTLE ADJUSTMENTS ****** //
GM_addStyle("#ptBossPop {  top: 180px !important;}");


// ****** FACEBOOK **** REMOVE SIDE BAR **** //
GM_addStyle('.x1cvmir6.x1n2onr6.x1t2pt76.x2lah0s.x78zum5.x2bj2ny {display:none !important;}');
