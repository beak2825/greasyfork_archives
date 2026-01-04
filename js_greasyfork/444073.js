// ==UserScript==
// @name        Speedrun Adventure Mode Recreation
// @description My attempt at recreating the speedrun adventure mode
// @version     1.0.3
// @namespace   Ew0345
// @author      Ew0345
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/444073/Speedrun%20Adventure%20Mode%20Recreation.user.js
// @updateURL https://update.greasyfork.org/scripts/444073/Speedrun%20Adventure%20Mode%20Recreation.meta.js
// ==/UserScript==

/* jshint  esversion:6 */

((main) => {
  var script = document.createElement('script');
  script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
  document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
  'use strict';
  
  let debug = false

  if (window.navigator.userAgent.indexOf("AppleWebKit") >= 0) {
    debug = true;
  }

  function setSkillModifiers() {
    //decreasedSkillIntervalPercent
    var sIntervals = player.modifiers.skillModifiers.get("decreasedSkillIntervalPercent");

    for (var i = 0; i < 30; i++) {
      switch (i) {
        case 4:case 0: sIntervals.set(i, 130);
          break;
        case 1: sIntervals.set(i, 120);
          break;
        case 2:case 3:case 5:case 10:case 11:case 13:case 14:case 15:case 16:case 19:case 20:case 21:case 22: sIntervals.set(i, 80);
          break;
        default: break;
      } 
    }
  }

  function setNormalModifiers() {
    var pMod = player.modifiers;
    
    pMod.decreasedAttackIntervalPercent = 80;
    //pMod.increasedMaxHitpoints = 100;
    pMod.decreasedMonsterRespawnTimer = 2000;
    pMod.increasedGlobalMasteryXP = 800;
  }

  function startScript() {
    console.log("Loading CustomGamemode");
    const snmInt = setInterval(setNormalModifiers, 10);
    const ssmInt = setInterval(setSkillModifiers, 10);
    snmInt;
    ssmInt;
  }

  function loadScript() {
    if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
      clearInterval(scriptLoader);
      startScript();
    } else if (debug === "true") {
      clearInterval(scriptLoader);
      startScript();
    }
  }

  const scriptLoader = setInterval(loadScript, 200);
});