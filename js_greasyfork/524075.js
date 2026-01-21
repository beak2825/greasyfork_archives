// ==UserScript==
// @name         Forged20
// @namespace    jackpoll4100
// @version      2.5
// @description  Allows rolling and sending abilities from forge steel character sheets into roll20.
// @author       jackpoll4100
// @match        https://andyaiken.github.io/forgesteel*
// @match        https://app.roll20.net/*
// @match        https://*.discordsays.com/*
// @match        https://forgesteel.net*
// @icon         https://raw.githubusercontent.com/jackpoll4100/Forged20/refs/heads/main/DS%20logo.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/524075/Forged20.user.js
// @updateURL https://update.greasyfork.org/scripts/524075/Forged20.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function loadDependency(filename) {
      var fileref = document.createElement('script');
      fileref.setAttribute("type", "text/javascript");
      fileref.setAttribute("src", filename);
      if (typeof fileref != "undefined"){
          (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(fileref);
      }
  }
  if (!window.location.href.includes('forgesteel')){
      window.forgesteelEnabled = false;
      function forgesteelToggle(){
          window.forgesteelEnabled = !window.forgesteelEnabled;
      };
      let forgesteelSettingsTemplate =
          `<div id="forgesteelSettings" style="display: flex; flex-direction: row; justify-content: space-between;">
              <input type="checkbox" id="forgesteelEnabled" title="Enables rolling from your Forge Steel character sheet in another tab.">
              <input id="autoCheckLabel" style="margin: 5px 5px 5px 5px; width: 90%" disabled value="Enable Forged20" type="text" title="Enables rolling and sending abilities from your Forge Steel character sheet in another tab.">
           </div>`;
      function GM_onMessage(label, callback){
          GM_addValueChangeListener(label, function(){
              callback.apply(undefined, arguments[2]);
          });
      }
      function execMacro(macro){
          console.log('Forge Steel - Executing Macro: ', macro);
          if (!window.forgesteelEnabled){
              console.log('cancelling macro execution, forgesteel connection not enabled.');
              return;
          }
          document.querySelectorAll('[title="Text Chat Input"]')[0].value = macro;
          document.getElementById('chatSendBtn').click();
      }
      function execImport(jsonCharacter)
      {
          if(document.querySelector('[name="attr_forgesteel_json"]'))
          {
              document.querySelector('[name="attr_forgesteel_json"]').value = jsonCharacter;
              setTimeout(()=>
              {
                  document?.querySelector('[name="act_import"]')?.click();
              }, 200);
          }
      }
      GM_onMessage('forgesteel-pipe', function(message) {
          console.log('forgesteel message received: ', message);
          if (message.includes('charactersheet---'))
          {
              if(window.location.href.includes('/character'))
              {
                  let cleanedString = message.split('charactersheet---')[1];
                  execImport(cleanedString);
              }
          }
          else if (message.includes('template') || message.includes('data:image')){
              let cleanedString = message.split('---')[1];
              execMacro(cleanedString);
          }
      });
      if (window.location.href.includes('/character'))
      {
          const bodyTarget = document.querySelector('body');
          const config = { attributes: false, childList: true, subtree: true };
          function GM_sendMessage(label){
              GM_setValue(label, Array.from(arguments).slice(1));
          }
          console.log('sending open message');
          GM_sendMessage('roll20-pipe', 'roll20 opened');
          const listenerSetup = ()=>{
              const foundElement = document?.querySelector('[name="act_import"]');
              if (foundElement && !foundElement.getAttribute('listener-applied')){
                  foundElement.setAttribute('listener-applied', true);
                  foundElement.parentElement.innerHTML += '<button type="button" id="f20-import">Import directly from Forge Steel</button>';
                  document.getElementById('f20-import')?.addEventListener?.('click', ()=>
                  {
                      console.log(`requesting character from forgesteel`);
                      GM_sendMessage(`roll20-pipe`, `${ Math.random() }---character please`);
                  });
              }
          };
          const observer = new MutationObserver(listenerSetup);
          observer.observe(bodyTarget, config);
      }
      function appendForgeSteelSettings(){
          let uiContainer = document.createElement('div');
          uiContainer.innerHTML = forgesteelSettingsTemplate;
          document.getElementById('textchat-input').appendChild(uiContainer);
          document.getElementById('forgesteelEnabled').addEventListener('click', forgesteelToggle);
      }
      function timer (){
          if (document.getElementById('chatSendBtn')){
              appendForgeSteelSettings();
          }
          else{
              setTimeout(timer, 500);
          }
      }
      setTimeout(timer, 0);
      console.log('forgesteel listener registered');
  }
  else {

      function GM_sendMessage(label){
          GM_setValue(label, Array.from(arguments).slice(1));
      }
      console.log('sending open message');
      GM_sendMessage('forgesteel-pipe', 'forgesteel opened');

      let classMap = {
          rollSelector: '.total > div.ant-statistic-content > span > span',
          rollTitles: ['.roll-modal div.ant-statistic-title', '.modal-content .ability-panel > div.header-text-panel > div > div.header-text'],
          abilityTypeSelector: '.ability-modal .ability-info-panel > .ds-text',
          rollModifierSelector: '.ability-modal .roll-state-selector .ant-segmented-item-selected > .ant-segmented-item-label',
          pointSelector: '.ability-modal .header-text-content .pill',
          keywordsSelector: '.ability-modal .ability-panel .ant-tag',
          distanceTargetSelector: '.ability-modal .ability-info-panel > .field > .field-value',
          rawDiceValuesSelector: '.ability-modal .result-row .ant-statistic-content-value-int',
          effectDescriptionsSelector: '.ability-modal .ability-panel > div > div:not(.power-roll-panel) > p',
          specialEffectDescriptionsSelector: '.ability-modal .ability-panel > div > div.field.horizontal',
          flavorSelector: '.ability-modal .ability-description-text > p',
          tiersSelector: '.ability-modal .ability-panel div.power-roll-panel p',
          rollButton: '.die-roll-panel > .ant-btn',
          resourceRollButton: '.modal > .modal-content > .ant-space > .ant-space-item > .ant-btn',
          effectsSelector: '.ant-drawer .power-roll-row .effect',
          criticalSuccess: '.ant-alert-success',
          tierAlert: '.ant-alert-warning .ant-alert-message',
          modalSelectors: ['.modal-content .ability-section', '.modal-content .feature-modal', '.modal-content .roll-modal'],
          hideOutputSelectors: ['.ant-collapse', '.ant-slider'],
          modalOpen: ['.modal']
      };

      function fetchCharacter(callback)
      {
          let request = window.indexedDB.open('localforage');
          request.onsuccess = async function(event) {
              let db = event.target.result;
              let store = db.transaction(['keyvaluepairs'],'readwrite').objectStore('keyvaluepairs');
              store.get('forgesteel-heroes').onsuccess = function (event) {
                  console.log('Found the following characters: ', event.target.result);
                  const urlTokens = window.location.href.split('/');
                  let stopLooking = false;
                  for (const character of event.target.result)
                  {
                      if (character.id == urlTokens[urlTokens.length - 1] && !stopLooking)
                      {
                          stopLooking = true;
                          callback(character);
                      }
                  }
              };
          };
      }

      function GM_onMessage(label, callback){
          GM_addValueChangeListener(label, function(){
              callback.apply(undefined, arguments[2]);
          });
      }

      GM_onMessage('roll20-pipe', function(message) {
          console.log('roll20 message received: ', message);
          if (message?.split?.('---')?.[1] === 'character please')
          {
              fetchCharacter((character)=>
              {
                  const characterJSON = JSON.stringify(character);
                  console.log('Sending character to roll20: ', characterJSON);
                  GM_sendMessage('forgesteel-pipe', `${ Math.random() }---charactersheet---` + characterJSON);
              });
          }
      });

      function rasterizeContent(event)
      {
          const cleanDOM = (el) =>
          {
              if (el.querySelector('[listener-applied="true"]')?.style?.display === "")
              {
                  el.querySelector('[listener-applied="true"]').style.display = 'none';
              }
              for (let s of classMap.hideOutputSelectors)
              {
                  for (let e of el.querySelectorAll(s))
                  {
                      e.style.display = 'none';
                  }
              }
          };
          const recursiveFindBGColor = (e) =>
          {
              const targettedStyle = window.getComputedStyle(e);
              const bg = targettedStyle.getPropertyValue('background-color');
              const transparentList = ['transparent', 'rgba(0,0,0,0)', 'rgba(0, 0, 0, 0)', '#00000000'];
              if (!transparentList.includes(bg) || !e.parentNode)
              {
                  if (!e.parentNode)
                  {
                      console.info('[Forged20] Found no non transparent parent element, defaulting to light mode...');
                      return '#e6e6e6';
                  }
                  return bg
              }
              return recursiveFindBGColor(e.parentNode);
          };
          for (let m of classMap.modalSelectors)
          {
              const element = event.target.closest(m) || document.querySelector(m);
              if (element)
              {
                  const elCopy = element.cloneNode(true);
                  elCopy.id = 'tmp-ability-copy';
                  let padding = '';
                  if (m.includes('feature-panel'))
                  {
                      padding = ' padding: 10px;';
                  }
                  elCopy.setAttribute('style', `font-size: 20px !important; z-index: -1; position: absolute; width: 400px; ${ padding }`);
                  elCopy.innerHTML += '<style>#tmp-ability-copy * { font-size: 20px; } #tmp-ability-copy .pill { min-width: 60px; }</style>';
                  cleanDOM(elCopy);
                  element.parentNode.appendChild(elCopy);
                  const parentStyle = window.getComputedStyle(element.parentNode);
                  const bg = recursiveFindBGColor(element);

                  domtoimage.toJpeg(document.getElementById('tmp-ability-copy'), { style: { 'background-color': bg } }).then((dataUrl) =>
                  {
                      document.getElementById('tmp-ability-copy').remove();
                      GM_sendMessage('forgesteel-pipe', `${ Math.random() }---` + `[x](${ dataUrl }#.png)`);
                  });
                  return;
              }
          }
      }

      function rollWatcher(e){
          rasterizeContent(e);
          return;

          // The photo rasterizing method makes the existing scraping code redundant, but keeping it here to refer to if needed.
          fetchCharacter((character) => {
              const roll = document.querySelector(classMap.rollSelector)?.innerHTML;
              const rawRoll = parseInt(document.querySelectorAll(classMap.rawDiceValuesSelector)?.[0]?.innerHTML || 0) + parseInt(document.querySelectorAll(classMap.rawDiceValuesSelector)?.[1]?.innerHTML || 0);
              let rollTitle = '';
              classMap.rollTitles.forEach((selector)=>{
                  rollTitle = document.querySelector(selector)?.innerHTML ? document.querySelector(selector).innerHTML : rollTitle;
              });
              let modifierText = '';
              const tierAlert = document.querySelector(classMap.tierAlert);
              let rollTier = roll < 12 ? 1 : roll < 17 ? 2 : 3;
              if (tierAlert?.innerHTML?.includes('down') && rollTier > 1){
                  rollTier --;
                  modifierText = '(Tier was decreased by a Double Bane)';
              }
              else if (tierAlert?.innerHTML?.includes('up') && rollTier < 3){
                  rollTier ++;
                  modifierText = '(Tier was increased by a Double Edge)';
              }

              const rollMode = 'new';
              if(rollMode === 'legacy' || document.querySelector(classMap.rollTitles[0])?.innerHTML)
              {
                  // "Legacy" macro construction.

                  const effects = document.querySelectorAll(classMap.effectsSelector);
                  const constructedEffect = effects.length === 3 ? `{{effect=${ effects[rollTier - 1].innerHTML } ${ modifierText }}}` : '';

                  const constructedMessage = `&{template:default} {{name=${ character?.name ? `${ character.name }` : '' }}} ${ rollTitle ? `{{type=${ rollTitle }}}` : '' } {{result=${ roll } ${ document.querySelector(classMap.criticalSuccess) ? '(Critical Success)' : ''}}} ${ constructedEffect }`;
                  console.log('Sending message to roll20: ', constructedMessage);
                  GM_sendMessage('forgesteel-pipe', `${ Math.random() }---` + constructedMessage);
                  return;
              }

              let macroTemplate = `&{template:default} {{Resources Required=RESOURCES}} {{Keywords=KEYWORDS}} {{Type=ABILITYTYPE}} {{Distance=DISTANCE}} {{Target=TARGET}} {{Power Roll=[POWERROLL]POWERCSS}} {{Tier 1=TIER1}} {{Tier 2=TIER2}} {{Tier 3=TIER3}}{{name=[NAME](NAMECSS display: inline;)%NEWLINE%%NEWLINE%[FLAVOR](FLAVORCSS display: inline;)}} {{Effect=EFFECT}} {{SPECIALEFFECTS}} {{Edges and Banes=MODIFIER}}`;

              // Apply Special Effects
              const specialEffects = document.querySelectorAll(classMap.specialEffectDescriptionsSelector);
              let specialEffectsString = '';
              specialEffects.forEach(e => {
                  const seName = e.querySelector('.field-label > div')?.innerHTML?.includes('<') ? e.querySelector('.field-label > div')?.innerHTML?.split?.('<')?.[0] : e.querySelector('.field-label')?.innerHTML;
                  const sePoints = e.querySelector('.field-label .pill')?.innerHTML;
                  const seBody = e.querySelector('.field-value p')?.innerHTML;
                  specialEffectsString += `{{${ seName + (sePoints ? ` (${ sePoints?.replaceAll(' ', '') })` : '') }=${ seBody }}}`;
              });
              macroTemplate = macroTemplate.replaceAll('{{SPECIALEFFECTS}}', specialEffectsString);

              // Apply Tier Upgrades
              if (rawRoll < 19)
              {
                  macroTemplate = macroTemplate.replaceAll(`TIER${ rollTier }`, `[>>]POWERCSS [TIER${ rollTier }](HEADERCSS display: inline)[<<]POWERCSS`);
              }
              else
              {
                  macroTemplate = macroTemplate.replaceAll(`TIER${ rollTier }`, `[>>]POWERCSS [Critical Hit!]POWERCSS [TIER${ rollTier }](HEADERCSS display: inline)[<<]POWERCSS`);
                  macroTemplate += '{{Extra=[Take Another Action!]CRITCSS}}';
              }

              // Apply inline styles
              const powercss = '(" style=" color: yellow; font-weight: bold; text-shadow: 2px 2px black, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; font-size: 15px; cursor: text;)';
              const headercss = '" style="text-decoration: none; background: none; padding: 0px; font-size: 13px; cursor: text; display:none; border: none; text-shadow: 2px 2px black, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; color: Yellow; font-weight: bold; white-space: wrap;';
              const namecss = '" style="text-decoration: none; background: none; padding: 0px; font-size: 13px; font-weight: bold; cursor: text; display:none; border: none; text-shadow: 2px 2px black, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; color: white; cursor: text; font-style: bold; font-size: 20px;';
              const flavorcss = '" style="text-decoration: none; background: none; padding: 0px; font-size: 13px; font-weight: bold; cursor: text; display:none; border: none; text-shadow: 2px 2px black, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; color: white; cursor: text; font-style: italic; font-size: 11px;';
              const critcss = '(#" style=" font-weight: normal; display: block; color: yellow; font-weight: bold; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; cursor: text;)';
              macroTemplate = macroTemplate.replaceAll('POWERCSS', powercss).replaceAll('HEADERCSS', headercss).replaceAll('NAMECSS', namecss).replaceAll('FLAVORCSS', flavorcss).replaceAll('CRITCSS', critcss);

              // Apply Name
              macroTemplate = macroTemplate.replaceAll('NAME', `${ character?.name ? `${ character.name }` : '' } - ${ rollTitle }`);

              // Apply Power Roll
              macroTemplate = macroTemplate.replaceAll('POWERROLL', roll);

              // Apply Resources
              const pointString = document.querySelector(classMap.pointSelector)?.innerHTML;
              macroTemplate = macroTemplate.replaceAll('{{Resources Required=RESOURCES}}', (pointString && !pointString?.includes('Signature')) ? `{{Resources Required=${ pointString }}}` : '');

              // Apply Distance and Target
              const distanceTargetArr = document.querySelectorAll(classMap.distanceTargetSelector);
              macroTemplate = macroTemplate.replaceAll('DISTANCE', distanceTargetArr?.[0]?.innerHTML || 'N/A');
              macroTemplate = macroTemplate.replaceAll('TARGET', distanceTargetArr?.[1]?.innerHTML || distanceTargetArr?.[0]?.innerHTML || 'N/A');

              // Apply Tiers
              const tiersArr = document.querySelectorAll(classMap.tiersSelector);
              macroTemplate = macroTemplate.replaceAll('TIER1', tiersArr?.[0]?.innerHTML || 'N/A');
              macroTemplate = macroTemplate.replaceAll('TIER2', tiersArr?.[1]?.innerHTML || 'N/A');
              macroTemplate = macroTemplate.replaceAll('TIER3', tiersArr?.[2]?.innerHTML || 'N/A');

              // Apply Flavor
              const flavor = document.querySelector(classMap.flavorSelector)?.innerHTML;
              macroTemplate = macroTemplate.replaceAll('FLAVOR', flavor || 'N/A');

              // Apply Type
              const type = document.querySelector(classMap.abilityTypeSelector)?.innerHTML;
              macroTemplate = macroTemplate.replaceAll('ABILITYTYPE', type || 'N/A');

              // Apply Effects
              const effects = document.querySelectorAll(classMap.effectDescriptionsSelector);
              let effectsString = '';
              effects.forEach(e => {
                  effectsString += e.innerHTML + ' ';
              });
              macroTemplate = macroTemplate.replaceAll('{{Effect=EFFECT}}', effectsString ? `{{Effect=${effectsString}}}` : '');

              // Apply Keywords
              const keywords = document.querySelectorAll(classMap.keywordsSelector);
              let keywordsString = '';
              keywords.forEach(k => {
                  keywordsString += k.innerHTML + ' ';
              });
              macroTemplate = macroTemplate.replaceAll('KEYWORDS', keywordsString || 'N/A');

              // Apply Modifier
              const modifier = document.querySelector(classMap.rollModifierSelector)?.innerHTML;
              macroTemplate = macroTemplate.replaceAll('MODIFIER', (modifier && modifier !== 'Standard Roll') ? modifier : 'None' );

              // Send to chat
              console.log('Sending message to roll20: ', macroTemplate);
              GM_sendMessage('forgesteel-pipe', `${ Math.random() }---` + macroTemplate);
          });
      }

      const sendButtonTemplate =
            `
            <style>
            #roll20-send-button{
                position: absolute;
                right: 5px;
                bottom: 5px;
                border-radius: 8px;
                border: 0px;
                padding: 10px;
                background-color: rgb(22,119,255);
                color: white;
                cursor: pointer;
            }
      	    #roll20-send-button:hover{
                zoom:1.1;
            }</style>
            <div id="roll20-send-button">Send to Roll20</div>
            `;

      const bodyTarget = document.querySelector('body');
      const config = { attributes: false, childList: true, subtree: true };
      const listenerSetup = ()=>{
          const resourceButton = document.querySelector(classMap.resourceRollButton);
          if (resourceButton && resourceButton.firstChild?.innerHTML == 'Roll')
          {
              if (resourceButton && !resourceButton.getAttribute('listener-applied')){
                  resourceButton.setAttribute('listener-applied', true);
                  resourceButton.parentElement?.parentElement?.classList?.add('roll-modal');
                  resourceButton.addEventListener('click', (e)=>{ setTimeout(()=>{ rollWatcher(e) }, 100); });
              }
              return;
          }
          const foundElement = document.querySelector(classMap.rollButton);
          if (foundElement && !foundElement.getAttribute('listener-applied')){
              foundElement.setAttribute('listener-applied', true);
              foundElement.addEventListener('click', (e)=>{ setTimeout(()=>{ rollWatcher(e) }, 100); });
          }
          const foundModal = document.querySelector(classMap.modalOpen);
          if (foundModal && !foundModal.getAttribute('button-applied'))
          {
              foundModal.setAttribute('button-applied', true);
              setTimeout(()=>
              {
                  let applyButton = false;
                  for (let m of classMap.modalSelectors)
                  {
                      const element = document.querySelector(m);
                      if (element)
                      {
                          applyButton = true;
                      }
                  }
                  if (applyButton)
                  {
                      let template = document.createElement('div');
                      template.innerHTML = sendButtonTemplate;
                      foundModal.appendChild(template);
                      document.getElementById('roll20-send-button').addEventListener('click', (e)=>{ rollWatcher(e); });
                  }
              }, 100);
          }
      };
      const observer = new MutationObserver(listenerSetup);
      observer.observe(bodyTarget, config);
      loadDependency('https://cdn.jsdelivr.net/npm/dom-to-image-more@3.7.1/dist/dom-to-image-more.min.js');
  }

})();