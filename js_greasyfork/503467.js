// ==UserScript==
// @name         Demiplane 2 Roll20
// @namespace    jackpoll4100
// @version      1.11
// @description  Allows rolling from demiplane character sheets in roll20.
// @author       jackpoll4100
// @match        https://app.demiplane.com/*
// @match        https://app.roll20.net/*
// @match        https://*.discordsays.com/*
// @icon         https://raw.githubusercontent.com/jackpoll4100/Demiplane2Roll20/main/d20.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/503467/Demiplane%202%20Roll20.user.js
// @updateURL https://update.greasyfork.org/scripts/503467/Demiplane%202%20Roll20.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (!window.location.href.includes('demiplane')){
      window.demiplaneEnabled = false;
      function demiplaneToggle(){
          window.demiplaneEnabled = !window.demiplaneEnabled;
      };
      let demiplaneSettingsTemplate =
          `<div id="demiplaneSettings" style="display: flex; flex-direction: row; justify-content: space-between;">
              <input type="checkbox" id="demiplaneEnabled" title="Enables rolling from your Demiplane character sheet in another tab.">
              <input id="autoCheckLabel" style="margin: 5px 5px 5px 5px; width: 90%" disabled value="Enable rolls from Demiplane" type="text" title="Enables rolling from your Demiplane character sheet in another tab.">
           </div>`;
      function GM_onMessage(label, callback){
          GM_addValueChangeListener(label, function(){
              callback.apply(undefined, arguments[2]);
          });
      }
      function execMacro(macro){
          console.log('Demiplane - Executing Macro: ', macro);
          if (!window.demiplaneEnabled){
              console.log('cancelling macro execution, demiplane connection not enabled.');
              return;
          }
          document.querySelectorAll('[title="Text Chat Input"]')[0].value = macro;
          document.getElementById('chatSendBtn').click();
      }
      GM_onMessage('demiplane-pipe', function(message) {
          console.log('demiplane message received: ', message);
          if (message.includes('template')){
              let cleanedString = message.split('---')[1];
              execMacro(cleanedString);
          }
      });
      function appendDemiplaneSettings(){
          let uiContainer = document.createElement('div');
          uiContainer.innerHTML = demiplaneSettingsTemplate;
          document.getElementById('textchat-input').appendChild(uiContainer);
          document.getElementById('demiplaneEnabled').addEventListener('click', demiplaneToggle);
      }
      function timer (){
          if (document.getElementById('chatSendBtn')){
              appendDemiplaneSettings();
          }
          else{
              setTimeout(timer, 500);
          }
      }
      setTimeout(timer, 0);
      console.log('demiplane listener registered');
  }
  else {
      // Watch for focus.
      let focused = true;
      document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
              focused = false;
          }
          else
          {
              focused = true;
          }
      });
      function GM_sendMessage(label){
          GM_setValue(label, Array.from(arguments).slice(1));
      }
      console.log('sending open message');
      GM_sendMessage('demiplane-pipe', 'demiplane opened');
      let demiGameClassMap = {
          'cosmere': {
              rollVals: ['dice-history-item-result-value'],
              nameVal: 'dice-history-item-name',
              secondaryNameVal: 'dice-history-item-name--source',
              charName: 'character-name',
              modifiers: {
                  'complication': 'Complication',
                  'opportunity': 'Opportunity'
              }
          },
          'cyberpunkred': {
              rollVals: ['dice-history-item-result-value'],
              nameVal: 'dice-history-item-name',
              secondaryNameVal: 'dice-history-item-name--source',
              charName: 'character-name',
              modifiers: {
                  'dice-roller-history--critical-failure': 'Critical Failure',
                  'dice-roller-history--critical-success': 'Critical Success'
              }
          },
          'marvelrpg': {
              rollVals: ['dice-history-item-result-value'],
              nameVal: 'dice-history-item-name',
              damageVal: 'dice-history-damage-total-container',
              secondaryNameVal: 'dice-history-item-origin',
              charName: 'character-name',
              modifiers: {
                  'dice-roller-history--fantastic': 'Fantastic',
                  'dice-roller-history--ultimate-fantastic': 'Ultimate Fantastic'
              }
          },
          'daggerheart': {
              rollVals: ['dice-history-item-result-value'],
              nameVal: 'dice-history-item-name',
              secondaryNameVal: 'dice-history-item-name--source',
              charName: 'character-name',
              modifiers: {
                  'with-hope': 'Hope',
                  'with-fear': 'Fear',
                  'critical-success': 'Critical Success'
              }
          },
          'candelaobscura': {
              rollVals: ['dice-roller-history'],
              nameVal: 'dice-history-item-name',
              secondaryNameVal: 'dice-history-item-origin',
              charName: 'character-name',
              modifiers: {
                  'dice-roller-history--critical ': 'Critical Success'
              }
          },
          'avatar': {
              rollVals: ['dice-roll__total'],
              nameVal: 'dice-roll__name',
              secondaryNameVal: 'dice-roll__origin',
              charName: 'header-character-name-container',
              rollsClosed: 'dice-roller__fab--expanded',
              orderReversed: true,
              modifiers: {
                  'dice-roll--miss': 'Miss',
                  'dice-roll--weak-hit': 'Weak Hit',
                  'dice-roll--strong-hit': 'Strong Hit'
              }
          },
          'starfinder': {
              rollVals: ['dice-roll__total'],
              nameVal: 'dice-roll__name',
              secondaryNameVal: 'dice-roll__origin',
              charName: 'character-name',
              rollsClosed: 'dice-roller__fab--expanded',
              orderReversed: true,
              modifiers: {
                  '20': 'Natural 20'
              }
          },
          'pathfinder': {
              rollVals: ['dice-roll__total'],
              nameVal: 'dice-roll__name',
              secondaryNameVal: 'dice-roll__origin',
              charName: 'character-name',
              rollsClosed: 'dice-roller__fab--expanded',
              orderReversed: true,
              modifiers: {
                  '20': 'Natural 20'
              }
          },
          'alienrpg': {
              rollVals: ['dice-history-successes-value','dice-history-item-result-value'],
              nameVal: 'dice-history-item-name',
              charName: 'character-name',
              modifierToken: ' - ',
              modifiers: {
                  'with-panic': 'Panic',
                  'panic-table-result-name': 'innerHTML',
                  'panic-table-result-description': 'innerHTML'
              }
          },
          'vampire': {
              rollVals: ['dice-history-successes-container'],
              nameVal: 'dice-history-name',
              charName: 'character-name',
              modifiers: {
                  'history-item-result__die--hunger-critical': 'Messy Critical',
                  'history-item-result__die--hunger-1': 'Bestial Failure',
                  'history-item-result__die--standard-critical': 'Standard Critical'
              }
          }
      };
      function getGame(){
          let gameSet = Object.keys(demiGameClassMap);
          for (let g of gameSet){
              if (window.location.href.includes(g)){
                  return g;
              }
          }
          return 'cosmere';
      }
      function rollWatcher(prevLState, charHash, execute){
          let game = getGame();
          let menuOpen = document.getElementsByClassName(demiGameClassMap?.[game]?.rollsClosed || 'dice-close-button').length;
          let parsedSession = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
          if (parsedSession?.includes('?')){
              parsedSession = parsedSession.split('?')[0];
          }
          let sessionID = parsedSession + '-dice-history';
          let lState = localStorage.getItem(sessionID);
          if (!lState){
              sessionID = sessionID.replace('dice-history', 'dicerolls');
              lState = localStorage.getItem(sessionID);
          }
          // This is hacky, I feel like npc history is probably not supposed to be stored under "undefined".
          if (!lState && window.location.href.includes('npc-sheet'))
          {
              sessionID = 'undefined-dice-history';
              lState = localStorage.getItem(sessionID);
          }
          if (charHash !== parsedSession || !focused){
              setTimeout(()=>{ rollWatcher(lState, parsedSession); }, 500);
              return;
          }
          if (!menuOpen){
              setTimeout(()=>{ rollWatcher(prevLState, parsedSession); }, 500);
              return;
          }
          let shouldRoll = false;
          if (prevLState !== lState){
              shouldRoll = true;
          }
          if (!shouldRoll){
              setTimeout(()=>{ rollWatcher(prevLState, parsedSession); }, 500);
              return;
          }
          else if (shouldRoll && !execute){
              setTimeout(()=>{ rollWatcher(prevLState, parsedSession, true); }, 100);
              return;
          }
          let rollEls = document.querySelectorAll(demiGameClassMap?.[game]?.rollVals ? `.${ demiGameClassMap?.[game]?.rollVals.join(',.') }` : 'nothing');
          let rolls = [];
          for (let e of rollEls){
              let rollForm = [];
              if (game === 'candelaobscura'){
                  let tempRolls = e.getElementsByClassName('history-item-result__label');
                  for (let r of tempRolls){
                      rollForm.push(r.innerHTML);
                  }
              }
              rolls.push(rollForm.length ? rollForm.join(', ') : e.innerHTML);
          }
          if (!rolls.length){
              setTimeout(()=>{ rollWatcher(prevLState, parsedSession); }, 500);
              return;
          }
          if (demiGameClassMap?.[game]?.orderReversed){
              rolls = rolls.reverse();
          }
          let rollNamesEls = document.getElementsByClassName(demiGameClassMap?.[game]?.nameVal || 'nothing');
          let rollNames = [];
          for (let e of rollNamesEls){
              rollNames.push(e.innerHTML);
          }
          let rollCasesEls = document.getElementsByClassName('dice-roller-history');
          if (!rollCasesEls.length){
              rollCasesEls = document.querySelectorAll('.dice-roll--expanded,.dice-roll--collapsed');
          }
          let secondaryRollNamesEls = [];
          let damageRollEls = [];
          let damageRolls = [];
          for (let e of rollCasesEls){
              secondaryRollNamesEls.push(e.getElementsByClassName(demiGameClassMap?.[game]?.secondaryNameVal || 'nothing')?.[0] || 0);
              damageRollEls.push(e.getElementsByClassName(demiGameClassMap?.[game]?.damageVal || 'nothing')?.[0] || 0);
              if (game === 'cosmere'){
                  let hit = e.getElementsByClassName('dice-history-damage-container--hit-container')?.[0]?.innerHTML?.replace('Hit', ' Hit ') || 0;
                  let graze = e.getElementsByClassName('dice-history-damage-container--graze-container')?.[0]?.innerHTML?.replace('Graze', ' Graze ') || 0;
                  let crit = e.getElementsByClassName('dice-history-damage-container--critical-hit-container')?.[0]?.innerHTML?.replace('Critical Hit', ' Critical Hit ') || 0;
                  if (hit || graze || crit){
                      damageRolls.push(`${ hit ? hit : '' }${ graze ? graze : '' }${ crit ? crit : '' }`);
                  }
                  else {
                      damageRolls.push(0);
                  }
              }
          }
          let rollTypes = [];
          for (let e of secondaryRollNamesEls){
              rollTypes.push(e ? e.innerHTML : '');
          }
          if (game !== 'cosmere'){
              for (let e of damageRollEls){
                  damageRolls.push(e ? e.innerHTML : '');
              }
          }
          if (demiGameClassMap?.[game]?.orderReversed){
              rollNames = rollNames.reverse();
              rollTypes = rollTypes.reverse();
              damageRolls = damageRolls.reverse();
          }
          let rollCases = [];
          if (demiGameClassMap?.[game]?.modifiers){
              for (let e of rollCasesEls){
                  let modSet = [];
                  for (let m of Object.keys(demiGameClassMap?.[game]?.modifiers)){
                      if (game === 'vampire'){
                          if (e.innerHTML.includes(m)){
                              modSet.push(demiGameClassMap?.[game]?.modifiers?.[m]);
                          }
                      }
                      else if (game === 'starfinder' || game === 'pathfinder'){
                          if (e.getElementsByClassName('dice-roll-details-dice__value')?.[0]?.innerHTML?.includes(m)){
                              modSet.push(demiGameClassMap?.[game]?.modifiers?.[m]);
                          }
                      }
                      else if (demiGameClassMap?.[game]?.modifiers?.[m] === 'innerHTML'){
                          let elem = e.getElementsByClassName(m)?.[0];
                          if (elem){
                              modSet.push(elem.innerHTML);
                          }
                      }
                      else if (e.classList.value.includes(m)){
                          modSet.push(demiGameClassMap?.[game]?.modifiers?.[m]);
                      }
                  }
                  if (!modSet.length){
                      rollCases.push(false);
                  }
                  else{
                      rollCases.push(modSet.join(demiGameClassMap?.[game]?.modifierToken || ', '));
                  }
              }
              if (demiGameClassMap?.[game]?.orderReversed){
                  rollCases = rollCases.reverse();
              }
          }
          let charName = document?.getElementsByClassName(demiGameClassMap?.[game]?.charName || 'nothing')?.[0]?.children?.[0]?.innerHTML || document?.getElementsByClassName('stat-block-name')?.[0]?.innerHTML || '';
          let constructedMessage = `&{template:default} {{name=${ charName ? `${ charName } - ` : '' }${ rollNames[rolls.length - 1] }}} ${ rollTypes[rolls.length - 1] ? `{{type=${ rollTypes[rolls.length - 1] }}}` : '' } {{result=${ rolls[rolls.length - 1] }}} ${ rollCases?.[rolls.length - 1] ? '{{additional effects=' + rollCases[rolls.length - 1] + '}}' : '' } ${ damageRolls[rolls.length - 1] ? `{{damage=${ damageRolls[rolls.length - 1] }}}` : '' }`;
          console.log('Sending message to roll20: ', constructedMessage);
          GM_sendMessage('demiplane-pipe', `${ Math.random() }---` + constructedMessage);
          setTimeout(()=>{ rollWatcher(lState, sessionID); }, 500);
      }
      let parsedSession = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
      let sessionID = parsedSession + '-dice-history';
      let lState = localStorage.getItem(sessionID);
      if (!lState){
          sessionID = sessionID.replace('dice-history', 'dicerolls');
          lState = localStorage.getItem(sessionID);
      }
      // This is hacky, I feel like npc history is probably not supposed to be stored under "undefined".
      if (!lState && window.location.href.includes('npc-sheet'))
      {
          sessionID = 'undefined-dice-history';
          lState = localStorage.getItem(sessionID);
      }
      rollWatcher(lState, parsedSession);
  }

})();