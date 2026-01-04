// ==UserScript==
// @name            HentaiHeroes Automation Toggle
// @namespace       https://sleazyfork.org/users/1281730-vipprograms
// @author          vipprograms
// @version         0.3.0
// @description     Automate things on Hentai Heroes
// @match           https://*.comixharem.com/*
// @match           https://hentaiheroes.com/*
// @match           https://www.hentaiheroes.com/*
// @exclude         *://*live.hentaiheroes.com/*
// @exclude         *://www.hentaiheroes.com/img/*
// @match           https://*.pornstarharem.com/*
// @match           https://www.mangarpg.com/*
// @match           https://www.amouragent.com/*
// @match           https://*.connect.chibipass.com/authentication/*
// @match           *://*blog.kinkoid.com/patchnotes/*
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFxUExURQAAALsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRP///9bUSvUAAAB5dFJOUwATY6TBv8DFxy6lti1BcF47M3GnDZeraMb9+LdYQ8KWK8NJauziT2bSOC/MoNcx391EEf7Z4JmqxDrUSIiYbu53Is/vUbDaW86hu+hLbD+yflCzfbhrVT3mRyzk/I/74aY252E8gMoy2M0w3IxWyHu9VK/060yH29XNsu5ZAAAAAWJLR0R6ONWFagAAAAd0SU1FB+gGEQoLAyZM+7IAAAH7SURBVDjLZVP7XxJBEB/2CEEQQiAtJE/q4k7CuEOh6IpHmUppanWUPe1lZmX23v++m5312NP5YT+z8/3e3Mx3dgACizAteiYWG4trLAKnLTGeZKkJlk5nzmYn47nUCThfOJedmj7PhV0ozpQuzuZVXJ8rX7rMFTOuVEx9hFvR+ZiCVvG4atWs4PvYwrURXLcd/2zw6YVFmSM/N780wpsOQEt412+0qY7Zm9ER7mKkQv6tyYLoT7strh27i//HUE+y7X7Cv40n7uCl5VC8h4w6Efp3c75+y+kgNca76DS5qJPb9yLAVlb5cdzFTEoRfM1loOnCHWDcxlLUIu7bGiQfkO93ByhAUxRRlYyUCcV1cisYb3Ud0saVhA0DHm5KgULDsyVhawm2H5HbCY+3ExAeP5ETkojXEh2T2nz4FAbP1F94dUmVje6YoO00eCAExXuyIc6flzVgLE4EN4hXjlV90XzJIFKc4kqjAxLTETW8Gr72n++b3bdEECJ3hWgOCTU2k8NxL7+TKZCQFVRqsvG+huOGgrdNBM9PXVXepvuhQE/u415bdhrCk/Yn+fT1/c8HQkyvruK7RvDwrf3sAT9hX0qGpSzOauarocLfhoc1Pbx630tHP34S+mutdNQOrx52m6seWnu/Myvl1MSfv6eWV65/v2b+WzRD6/8f2Z7ycoRhRvkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDYtMTdUMTA6MTA6MzcrMDA6MDCgF8oMAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA2LTE3VDEwOjEwOjM4KzAwOjAwJwICWQAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wNi0xN1QxMDoxMTowMyswMDowMBNdG6EAAAAASUVORK5CYII=
// @grant           GM_addStyle
// @grant           GM.setValue
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_registerMenuCommand
// @grant           GM.registerMenuCommand
// @grant           GM_xmlhttpRequest
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @contributionURL https://paypal.me/annarossa44
// @downloadURL https://update.greasyfork.org/scripts/513328/HentaiHeroes%20Automation%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/513328/HentaiHeroes%20Automation%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let _GM_registerMenuCommand, _GM_notification, options, optionName;
  let { register } = VM.shortcut; // https://violentmonkey.github.io/vm-shortcut/
  let debug = false;
  let automation = false;
  let alreadyLogged = false;
  let previousPageTitle = '';
  let iframe = document.querySelector('iframe#hh_game');
  let doc = iframe?.contentWindow.document;
  let cooldown = false;
  let hideStory = false;
  let lastBigLoop = 0;
  let nextRunTimeout = null;
  let autoEquipFirstNine = false;
  let autoItemsTimer = 250; // * 2
  let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  let isArrayEmpty = arr => !arr.length;
  let capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || "";
  let replaceSpacesAndSpecialChars = (input, replacement = '_') => input.replace(/[^\w]+/g, replacement);
  let currentHaremPosition = null;
  let stopForNow = false;
  let dailyPachinko = false;
  let activePageElement = "";
  let lastClickedElement = null;
  let collectingMoney = false;
  let savedPlaces = false;
  let optionUniverse = [];
  let urlParams = new URLSearchParams(window.location.search);
  let CURRENT_URL = window.location.href;
  let urlParamClicked, marketSold = 0, addedSellListeners;
  let toInt = str => parseInt(str.replace(/,/g, ''), 10);



  if (typeof GM_registerMenuCommand !== 'undefined') {
    _GM_registerMenuCommand = GM_registerMenuCommand;
  } else if (typeof GM !== 'undefined' && typeof GM.registerMenuCommand !== 'undefined') {
    _GM_registerMenuCommand = GM.registerMenuCommand;
  } else {
    console.error("Oh no");
  }


  const optionsConfig = [
    { name: "SFW mode", id: 1, defaultValue: false },
    { name: "skip completed champions", id: 2, defaultValue: true },
    { name: "auto start champions", id: 3, defaultValue: true },
    { name: "loop lock champion", id: 4, defaultValue: false },
    { name: "battle speed", id: 5, defaultValue: 32, inputType: 'number' },
    { name: "always do POP", id: 6, defaultValue: false }
  ];

  optionsConfig.forEach(option => {
    if (option.inputType) {
      setMenuInput(option);
    } else {
      toggleMenuBoolean(option);
    }
  });

  let SFW = retrieveValueFromStorage("options")[1];
  let skipObtainedChampionGirl = retrieveValueFromStorage("options")[2];
  let autoStartChampions = retrieveValueFromStorage("options")[3];
  let loopChamp = retrieveValueFromStorage("options")[4];
  let battleSpeed = retrieveValueFromStorage("options")[5];
  let alwaysDoPop = retrieveValueFromStorage("options")[6];

  localStorage.setItem('battle_speed', battleSpeed);



  function getOptions(optionId, defaultValue) {
    let options = retrieveValueFromStorage("options") || {};
    if (options[optionId] === undefined) {
      options[optionId] = defaultValue;
      saveValue("options", options);
    }
    return { options, currentValue: options[optionId] };
  }

  function toggleMenuBoolean(option) {
    let { options, currentValue } = getOptions(option.id, option.defaultValue);
    let commandLabel = currentValue ? `${capitalize(option.name)} [ON]` : `${capitalize(option.name)} [OFF]`;

    _GM_registerMenuCommand(commandLabel, () => {
      options[option.id] = !currentValue;
      saveValue("options", options);
      setTimeout(() => location.reload(), 50);
    });
  }

  function setMenuInput(option) {
    let { options, currentValue } = getOptions(option.id, option.defaultValue);
    let commandLabel = `Set ${option.name} [${currentValue}x]`;

    _GM_registerMenuCommand(commandLabel, () => {
      let newValue = prompt(`Enter new value for ${option.name}`, currentValue);
      if (newValue !== null && newValue !== currentValue) {
        if (option.inputType === 'number') newValue = parseFloat(newValue);
        options[option.id] = newValue;
        saveValue("options", options);
        setTimeout(() => location.reload(), 50);
      }
    });
  }


  function getShared() {
    if (typeof shared === 'undefined' || !shared) return;
    return shared || window.shared;

  }

  async function saveGirlsMap() {
    let startTime = Date.now();
    while (!getShared()) {
      if (Date.now() - startTime > 3000) return;
      await wait(100);
    }

    let haremMap;
    const universe = getShared().Hero.infos.hh_universe;
    const oldHaremMap = retrieveValueFromStorage("girlsMap")[universe];
    const saveTimestamp = Math.floor(Date.now() / 1000);

    if (oldHaremMap && saveTimestamp - (oldHaremMap.saveTimestamp || 0) < 60) return oldHaremMap;

    startTime = Date.now();
    while (!haremMap || Object.keys(haremMap).length === 0) {
      await wait(100);
      haremMap = getGirlsMap();
      if (Date.now() - startTime > 3000) return;
    }

    const strippedHaremMap = {};
    for (const key in haremMap) {
      strippedHaremMap[key] = {
        gId: haremMap[key].gId,
        name: haremMap[key].gData.name,
        nb_grades: haremMap[key].gData.nb_grades
      };
    }

    strippedHaremMap.saveTimestamp = saveTimestamp;
    saveOptionUniverse('girlsMap', strippedHaremMap);
  }




  saveGirlsMap()


  function getGirlsMap() {
    if (typeof shared === 'undefined' || !shared) return;
    if (!shared.GirlSalaryManager?.girlsMap) return;
    return shared.GirlSalaryManager.girlsMap;
  }

  function haremNewMoney() {
    let haremMap = getGirlsMap();
    if (!haremMap) return;
    return Object.values(haremMap).some(girl => girl.readyForCollect === true);
  }




  if (window.location.pathname !== '/' && window.location.pathname.length > 1) {
    doc = document;
  } else if (window.location.pathname === '/' && urlParams.get('click') !== 'chat') {
    window.location.href = "/home.html";
    return;
  } else {
    addTargetTop(iframe);

    console.log("we here")
  }
  // console.log(doc)

  if (sessionStorage.getItem('UserScriptAutomation') === "true") {
    automation = true;
  }
  if (!sessionStorage.getItem('UserScriptHappy')) {
    hideStory = SFW;
  } else {
    hideStory = sessionStorage.getItem('UserScriptHappy') === "true" ? true : false;
  }
  toggleStories(hideStory);

  let clickLog = (element, force = false) => {
    if (typeof element === 'string') element = doc.querySelector(element);
    if (element && isElementVisible(element) && !element.disabled) {
      console.log('Clicked:', element, "Last element:", lastClickedElement);
      lastClickedElement = element;
      element.click();
      return true;
    }
    return false;
  };



  function isInputFocused() {
    return document.activeElement.isContentEditable || ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
  }

  function addShortcuts() {
    VM.shortcut.register('x', () => {
      if (!isInputFocused()) toggleAutomation();
    });

    VM.shortcut.register('a', () => {
      if (!isInputFocused()) clickLog(doc.getElementById('auto-select'));
    });

    VM.shortcut.register('s', () => {
      if (!isInputFocused()) clickLog(doc.getElementById('level-up'));
    });


    VM.shortcut.register('esc', () => {
      clickLog(doc.querySelector("a.close_cross"))
    });
  }


  function saveValue(key, array) {
    const saveFunc = (typeof GM !== 'undefined' && GM.setValue) || GM_setValue;
    if (!saveFunc) return; // console.log("Oh no, no save method available");

    const result = saveFunc(key, array);
    if (result instanceof Promise) {
      result.then(() => { /* console.log("Array saved successfully"); */ })
        .catch(e => console.error("Error:", e));
    } else {
      // console.log("Array saved successfully");
    }
  }

  function retrieveValueFromStorage(key) {
    if (typeof GM_getValue === "function") {
      return GM_getValue(key, false);
    }
    if (typeof GM === "object" && typeof GM.getValue === "function") {
      return GM.getValue(key, false).then(value => value);
    }
    console.error("Unsupported userscript manager.");
    return undefined;
  }
  function saveArraySettings(settingsName, subSettingsName, newValue) {
    let settings = retrieveValueFromStorage(settingsName) || {};
    settings[subSettingsName] = newValue;
    return saveValue(settingsName, settings);
  }

  function timestampToHourMinute(timestamp) {
    let date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  }

  function timestampToString(timestamp, skipSeconds = true) {
    const now = Date.now();
    const difference = timestamp - now; // IMPORTANT: timestamp must be * by 1000 to be in ms
    let result = '';

    const seconds = Math.floor(Math.abs(difference) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (difference > 0) result = 'in ';
    if (days > 0) result += `${days}d `;
    if (hours % 24 > 0) result += `${hours % 24}h `;
    if (minutes % 60 > 0) result += `${minutes % 60}m `;
    if (!skipSeconds && seconds % 60 > 0) result += `${seconds % 60}s`;

    if (difference < 0) result += ' ago';

    return result.trim() || 'now';
  }

  function secondsToString(seconds, shortSwitch = false) {
    const intervals = [
      { label: 'year', value: 31536000 },
      { label: 'month', value: 2592000 },
      { label: 'week', value: 604800 },
      { label: 'day', value: 86400 },
      { label: 'hour', value: 3600 },
      { label: 'minute', value: 60 },
      { label: 'second', value: 1 }
    ];

    const isNegative = seconds < 0;
    seconds = Math.abs(seconds);

    const result = intervals.reduce((acc, { label, value }) => {
      if (seconds >= value && acc.length < 2) {
        const count = Math.floor(seconds / value);
        acc.push(`${count}${shortSwitch ? label.charAt(0) : ` ${label}${count > 1 && !shortSwitch ? 's' : ''}`}`);
        seconds -= count * value;
      }
      return acc;
    }, []).join(' ');

    return result ? `${isNegative ? 'in' : ''} ${result} ${isNegative ? '' : 'ago'}` : 'just now';
  }


  function secondsUntilTime(targetHour, targetMinute = 0, targetSecond = 0) {
    const now = new Date();
    const targetTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), targetHour, targetMinute, targetSecond));
    const diff = targetTime - now;
    return Math.max(0, Math.floor(diff / 1000));
  }


  function updateButton() {
    let button = doc.querySelector("#actionbutton");
    button.innerText = automation ? 'Auto ON' : 'Auto OFF';
    button.className = automation ? 'red_button_L' : 'blue_button_L';
    // console.log(automation ? 'Automations enabled' : 'Automations disabled');

    // alreadyCollectedMoney = false;
    alreadyLogged = false;
  }

  function toggleAutomation() {
    automation = !automation;
    updateButton();
    sessionStorage.setItem('UserScriptAutomation', automation);
  }

  function createButton() {
    if (window !== window.top) return;
    const button = doc.createElement('button');
    button.id = "actionbutton";
    button.style = 'position:fixed;left:.5rm;bottom:.25rem;z-index:1000';
    doc.body.appendChild(button);
    updateButton(button);

    button.onclick = function () {
      toggleAutomation();
    };

  }

  function durationToSeconds(duration) {
    if (!duration) return;
    return duration.split(' ').reduce((total, part) => {
      const value = parseInt(part);
      const unit = { w: 604800, d: 86400, h: 3600, m: 60, s: 1 }[part.slice(-1)];
      return total + value * unit;
    }, 0);
  }


  createButton();

  // let counter = 0;
  let firstLoop = true;

  // setInterval(async function() {
  let bigLoop = async function (mutationsList, observer) {
    const now = Date.now();
    if (now - lastBigLoop < 500) {
      clearTimeout(nextRunTimeout);
      nextRunTimeout = setTimeout(() => {
        lastBigLoop = Date.now();

        // console.log("Running big loop!")
        document.getElementById("hh_bg_music")?.remove();
        doc.getElementById("hh_bg_music")?.remove();

        haremButtons()
        addHaremDirectionKeys()
        seasonal()
        labyrinthTimer();
        // haremNav()




        if (!alreadyLogged) tryLogin();
        // toggleStories(SFW || hideStory);



        if (!automation || cooldown) {
          // console.log("Skipped: pause:",pause, "!automation:",!automation, "cooldown:",cooldown);
          return;
        }
        cooldown = true;


        if (
          // !window.location.href.includes('season-arena.html') &&
          // && !window.location.href.includes('activities.html?tab=pop')
          !window.location.href.includes('event.html?tab=dp')
          && !isElementVisible(doc.querySelector("#no_energy_fight"))
          // && !doc.querySelector("#hh_hentai.page-quest.lang-en div#contains_all.fixed_scaled section div.quest-container.quest-fullscreen")
        ) {
          doc = iframe?.contentDocument || document;
          let rewardsPopup = isElementVisible(doc.querySelector('#rewards_popup'));
          let popDiv = isElementVisible(doc.querySelector('#pop'));
          if (window.location.href.includes('/labyrinth-battle.html') && window === window.top) {
            setTimeout(function () {
              if (!isElementVisible(doc.querySelector(".pvp-container .team-container .team-hexagon-container.pvp-hexagon .team-hexagon-col"))) {
                if (window.location.href.includes('/labyrinth-battle.html')) {
                  window.location.href = '/labyrinth.html';
                }
              } else {
                console.log("CORRECT BATTLE CORRECT BATTLE")
              }
            }, 1500);

            createLabyrinthButton();
            setTimeout(function () {
              if (window.location.href.includes('/labyrinth-battle.html')) {
                window.location.href = '/labyrinth.html';
              }
            }, 10000);
          }

          if (doc.querySelector('#no_energy_quest close')) {
            clickLog(doc.querySelector('#no_energy_quest close'))
            stopForNow = true;
          }

          if (stopForNow) {
            console.log("Stop for now")
            return;
          }

          pachinko();
          if (window.location.href.includes('pachinko.html')) return;
          // console.log("running")
          if (champions()) return;


          if (window.location.href.includes("home") && haremNewMoney()) {
            //<span class="button-notification-icon button-notification-reward"></span>
            //.button-notification-action
            const haremLink = document.querySelector('a[rel="harem"]');
            const notifPosition = haremLink.querySelector('.notif-position');
            let newHarem = haremLink.querySelector('#hh_new_harem');
            // console.log(haremLink,notifPosition,newHarem)
            if (!haremLink || !notifPosition || newHarem) return;

            const notification = document.createElement('img');
            notification.className = 'new_notif button-notification-new';
            notification.src = 'https://th.hh-content.com/ic_new.png';
            notification.id = 'hh_new_harem';
            notification.style = 'right:0;top:50%;transform:translateY(-50%);animation:none';
            notifPosition.insertAdjacentElement('afterend', notification);

            let existingChest = document.querySelector('a[rel="harem"] .button-notification-upgrade');
            if (existingChest) existingChest.style.marginRight = "22px";


          }

          changePageTitle('.underline-tab')
          changePageTitle('a.active')
          changePageTitle('#harem_left h3')
          changePageTitle('#messenger h4.tab-title')

          const buttons = [...doc.querySelectorAll('button.blue_button_L, button.blue_text_button, button.purple_button_L')];
          // console.log("placesOfPower() calling")
          placesOfPower(buttons)
          // console.log("placesOfPower() called")

          clickLog(doc.querySelector('#start-bang-button'));

          const purpleClaim = doc.querySelector('button.purple_button_L[rel="pop_claim"][style*="display: block"]');
          purpleClaim && isElementVisible(purpleClaim) && clickLog(purpleClaim);

          // clickLog(buttons.find(b => b.innerText.trim().toLowerCase() === 'claim all' && !b.classList.contains('hidden')));
          clickLog(buttons.find(b => b.innerText.trim().toLowerCase() === 'claim' && !b.classList.contains('hidden') && !b.classList.contains('claim-relic-btn') && !doc.querySelector('div.potions-paths-background-panel')));
          clickLog(buttons.find(b => b.classList.contains('purple_button_L') && b.getAttribute('rel') === 'claim' && !b.classList.contains('hidden') && !doc.querySelector('div.potions-paths-background-panel')));
          clickLog(buttons.find(b => b.innerText.trim().toLowerCase() === 'skip'));



          // clickLog(buttons.find(b => (b.classList.contains('green_button_L') || b.id === 'perform_opponent') && (b.innerText.trim().toLowerCase() === 'fight!' || b.innerText.trim().toLowerCase() === 'perform!')));
          // clickLog(doc.querySelector('button.purple_button_L[rel="pop_claim"]:not(.hidden)'));

          doc.querySelector('#new-battle-skip-btn')?.click()
          doc.querySelector('#perform_opponent')?.click()
          doc.querySelector('button.blue_button_L[rel="pop_auto_assign"]')?.click()


          clickLog(doc.querySelector('div.activities-container div.base_block.lead_wrapper div#pop.canvas.switch-tab-content div#pop_info div.pop_right_part button.blue_button_L'));
          clickLog(doc.querySelector('div.activities-container div.base_block.lead_wrapper div#pop.canvas.switch-tab-content div#pop_info div.pop_central_part.dark_subpanel_box button.purple_button_L'));
          doc.querySelector('#close-relic-popup')?.click();
          doc.querySelector('#free-reward')?.click()
          clickLog(doc.querySelector('button#end_play.quest-claim-reward-btn'))

          messanger()
          game()




          const element = document.querySelector('#collect_all .free-text');
          if (isElementVisible(element)) {
            console.log(element); // Ensure the element is logged correctly
            element.focus(); // Optionally focus the element
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          }





          if (!!doc.querySelector('#activities')) doMissions();
          if (!!doc.querySelector('.underline-tab[data-tab="contests"]')) contestsObjectives();

          pantheon();




          // doc.querySelector('button[rel="claim_end_gift"]')?.click();
          clickLog(doc.querySelector('button[rel="claim_end_gift"]'));
          if (isElementVisible(doc.querySelector('#rewards_popup'))) clickLog(doc.querySelector('button.blue_button_L[confirm_blue_button][close_callback]'), true);



          let popup_message = doc.querySelector("#popup_message");
          if (popup_message && popup_message.style.display === "block") popup_message.querySelector("close").click(); // Error display


          let paymentTabs = doc.querySelector("#shop-payment-tabs");
          let popupPaymentTab = doc.querySelector('#popup-payment-container');

          if (!!paymentTabs || !!popupPaymentTab) {
            let paymentTab = popupPaymentTab || paymentTabs;

            console.log("paymentTab tab open:", paymentTab)
            let paymentObserver = new MutationObserver(() => {
              if (!!paymentTab.querySelector("h4.switch-tab")) {
                let tabWithNotification = paymentTab.querySelector("h4 .button-notification-icon.button-notification-reward");
                if (!!tabWithNotification) {
                  tabWithNotification.closest("h4")?.click();
                } else {
                  doc.querySelector("div.close_cross")?.click();
                }
                paymentObserver.disconnect();
              }
            });
            paymentObserver.observe(paymentTab, { childList: true, subtree: true });
          }



          labyrinth()
          if (leagues()) {
            stopForNow = true;
            return;
          }

          // if(leaguesSelection()){
          //               stopForNow = true;
          //   return;
          // }





          newCodes();
          redeemCodeFromUrl();

          // console.log("MAYB CALL")
          seasonArena()
          market()
          activitiesTab()

          if (isElementVisible(doc.querySelector('#pass_reminder_popup'))) {
            clickLog(doc.querySelector('close'))
          }


          rewardsPopup && clickLog(buttons.find(b => b.innerText.trim().toLowerCase() === 'ok'), true);


          createFixedButton(doc, hideStory ? 'blue' : 'orange', 'Happy', '#background.picture.visible-background', function () {
            let happyBtn = doc.querySelector("#hh_happy");
            hideStory = !hideStory;
            console.log("hideStory:", hideStory)
            sessionStorage.setItem('UserScriptHappy', hideStory);
            happyBtn.classList.toggle('orange_button_L', !hideStory);
            happyBtn.classList.toggle('blue_button_L', hideStory);
            toggleStories(hideStory);
          });
          createFixedButton(doc, 'purple', 'Download', 'div.quest-container.quest-fullscreen', function () {
            let img = doc.querySelector('#background.picture.visible-background');
            let imgSrc = img.src;
            let link = doc.createElement('a');
            link.href = imgSrc;
            link.download = '';
            link.click();
          });




          let autoSelectBtn = doc.getElementById('auto-select');
          if (autoSelectBtn) autoSelectBtn.textContent.includes('(A') || (autoSelectBtn.textContent += ' (A)');
          let levelUpBtn = doc.getElementById('level-up')?.childNodes[0];
          if (levelUpBtn && !levelUpBtn.textContent.includes('(S)')) levelUpBtn.textContent += ' (S)';




        } else {
          console.log("Automations skipped!")
        }
        // removeAllAudio();
        firstLoop = false;
        previousPageTitle = window.location.href;
        // counter += 300;
        setTimeout(() => { cooldown = false; }, 500);
      }, 100 - (now - lastBigLoop));
      return;
    }
    lastBigLoop = now;

  }

  const docObserver = new MutationObserver(bigLoop);

  docObserver.observe(doc.body, { childList: true, subtree: true });

  async function calculateMinEnergy() {
    const shared = await (async () => { while (!getShared()) await wait(100); return getShared(); })();

    let energies = shared.Hero.energies.quest;
    let { amount, max_regen_amount, seconds_per_point, update_ts, next_refresh_ts } = energies;

    update_ts *= 1000;
    next_refresh_ts *= 1000;

    let secondsToMissions = secondsUntilTime(12, 30);

    let neededEnergy = max_regen_amount - amount;
    let secondsToFullBar = neededEnergy * seconds_per_point;

    if (secondsToFullBar >= secondsToMissions) {
      console.log("Not enough energy to reach 12:30, need full energy", secondsToString(-1 * secondsToFullBar));
      return max_regen_amount;
    }

    let regenAmount = Math.floor(secondsToMissions / seconds_per_point);
    let minEnergy = max_regen_amount - regenAmount;

    minEnergy = Math.max(0, minEnergy);

    console.log("Minimum energy required to have >= 100 at 12:30 UTC:", minEnergy);
    return minEnergy;
  }


  (async () => {
    const minEnergyRequired = await calculateMinEnergy();
    // console.log("Min energy required:", minEnergyRequired);
  })();



  function mythicTimeToWait() {
    let storedTimestamp = localStorage.getItem('mythicEventTimestamp');
    if (!storedTimestamp) return null;

    let now = Math.floor(Date.now() / 1000);
    let secondsLeft = storedTimestamp - now;
    return secondsLeft;
  }

  async function mythicEvent() {
    if (!/\/event\.html\?tab=mythic_event_\d+$/.test(window.location.href)) return;

    waitForElement('.shards-info.one-girl .shards-remaining .number', element => {
      let totalShardsRemaining = parseInt(element.textContent.trim(), 10);
      // console.log(totalShardsRemaining, "mythic shards remaining");

      if (totalShardsRemaining <= 0) {
        let [h, m] = document.querySelector('.shards-info.one-girl .shards-available .timer').textContent.trim().match(/(\d+)h\s(\d+)m/).slice(1).map(Number);
        let unixTimestamp = Math.floor(Date.now() / 1000) + h * 3600 + m * 60;
        localStorage.setItem('mythicEventTimestamp', unixTimestamp);
        // console.log(unixTimestamp);
      }

      setInterval(() => automation && window.location.reload(), 5000);
    });
  }


  mythicEvent();


  function trollPreBattle() {
    if (!automation || !window.location.href.includes('troll-pre-battle.html')) return;

    if (mythicReload()) {
      stopForNow = true;
      return;
    }

    let performLink = [...doc.querySelectorAll('a.green_button_L.battle-action-button')].find(a => {
      let label = a.querySelector('.action-label');
      return label && (label.textContent.includes('Perform!') || label.textContent.includes('Fight!')) && !a.hasAttribute('disabled');
    });
    clickLog(performLink)
  }


  trollPreBattle()

  function mythicReload() {
    let mythicWaitTime = mythicTimeToWait();

    if (mythicWaitTime !== null && mythicWaitTime > 0) {
      console.log(`Time to wait: ${mythicWaitTime} seconds.`);
      setTimeout(() => {
        window.location.reload();
      }, mythicWaitTime * 1000);
      return true;
    }

  }

  async function highestSalaryList(notify = false) {
    while (!getShared()) {
      await wait(100);
    }

    let shared = getShared();
    while (Object.keys(shared.GirlSalaryManager.girlsMap).length === 0) {
      await wait(100);
    }
    console.log("Doing highestSalaryList() now")

    let scrollElement = doc.querySelector('.girls_list.grid_view.hh-scroll');
    let notOwnedElement = await scrollUntilNotOwned(scrollElement);
    scrollElement.scrollTop = 0;


    let data = shared.GirlSalaryManager.girlsMap;
    let sorted = Object.entries(data)
      .sort(([, a], [, b]) => b.gData.salary - a.gData.salary)
      .map(([_, v]) => ({ gId: v.gId, salary: v.gData.salary }));
    // showPopup()
    return sorted;
  }

  // highestSalaryList().then(result => console.log(result));

  async function showSalaryList() {
    console.log("invoked showSalaryList()")
    let salaries = await highestSalaryList();
    let html = '<ul>';
    html += `<h2>Highest salaries</h2>`;

    salaries.forEach(({ gId, salary }) => {
      html += `<li><a href="/characters/${gId}">Salary: ${salary}</a></li>`;
    });

    html += '</ul>';
    showPopup(html);
  }



  async function showPopup(html = `Hello guise!`) {
    let popups = doc.querySelector(`#popups`);
    let popupBunny = doc.querySelector(`#popup_bunny`);

    popups.style.display = 'block';
    popupBunny.style.display = 'block';
    popupBunny.style.top = '0';

    let closeButton = popupBunny.querySelector(':scope > button');
    closeButton.style.display = 'block';

    closeButton.addEventListener('click', () => {
      popups.style.display = 'none';
      popupBunny.style.display = 'none';
    });

    popupBunny.querySelector(`.bunny-msg`).innerHTML = html;
  }

  // showPopup()



  async function highestSalary(notify = false) {
    while (!getShared()) {
      await wait(100);
    }
    shared = getShared();
    while (Object.keys(shared.GirlSalaryManager.girlsMap).length === 0) {
      await wait(100);
    }

    let highestSalary = 0;
    let seconds, highestId;

    let girlsData = shared.GirlSalaryManager.girlsMap;

    Object.values(girlsData).forEach(girl => {
      if (!girl.gData.salary) {
        console.warn("Error in highestSalary(), didn't find shared.GirlSalaryManager.girlsMap.gData.salary");
        return;
      }
      let salary = girl.gData.salary;
      if (salary > highestSalary) {
        highestSalary = salary;
        seconds = girl.gData.pay_in;
        highestId = girl.gData.id_girl;
      }
    });

    if (!highestId || !seconds) return;

    let timestamp = secondsToTimestamp(seconds);
    saveOptionUniverse('salary_timer', timestamp);

    if (notify) newNotification(`Come back at ${timestampToHourMinute(timestamp)}, ${timestampToString(timestamp)}`)
  }


  highestSalary()
  notifyOfTimer('salary_timer', "Collect your money!", '/characters/')


  function newNotification(text, url) {
    if (url && window.location.href.includes(url)) return;

    let idBox = 'hh_notifications';
    let notificationBox = document.getElementById(idBox);

    if (!notificationBox) {
      notificationBox = document.createElement('div');
      notificationBox.id = idBox;
      notificationBox.style.zIndex = 3;
      notificationBox.style.position = 'absolute';
      notificationBox.style.bottom = '.25rem';
      notificationBox.style.left = '50%';
      notificationBox.style.transform = 'translateX(-50%)';
      notificationBox.style.padding = '.5rem 1rem 0';
      notificationBox.style.borderRadius = '.5rem';
      notificationBox.style.backdropFilter = 'blur(20px)';
      notificationBox.style.color = '#fff';
      document.body.appendChild(notificationBox);
    }

    let title = notificationBox.querySelector('h3');
    if (!title) {
      title = document.createElement('h3');
      title.textContent = 'Notifications';
      title.style = `width: 100%;
  margin: -25px 0px 0px 0px;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.22px;
  color: #ffb827;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px -2px 5px rgba(255, 159, 0, 0.4), 2px -2px 5px rgba(255, 159, 0, 0.4), -2px 2px 5px rgba(255, 159, 0, 0.4), 2px 2px 5px rgba(255, 159, 0, 0.4), 0px 0px 10px rgba(255, 159, 0, 0.4);`;
      notificationBox.appendChild(title);
    }
    let message = document.createElement('div');
    message.textContent = text;
    message.style.display = 'grid';
    message.style.gridTemplateColumns = '1fr min-content';
    message.style.gridTemplateRows = 'repeat(2, auto)';
    message.style.gap = '.5rem';
    message.style.alignItems = 'center';

    let button = document.createElement('a');
    button.href = url;
    button.textContent = 'Go';
    button.classList.add('blue_button_L');
    button.style.padding = '.33rem .66rem';

    if (url) message.appendChild(button);
    notificationBox.appendChild(message);
  }



  async function placesOfPower(buttons) {
    let isPlacesOfPowerTabActive = !!doc.querySelector('.switch-tab.underline-tab[data-tab="pop"]')

    if (!isPlacesOfPowerTabActive) return;

    let ids = extractUnlockedPlaces();

    if (!isArrayEmpty(ids)) {
      saveOptionUniverse("places", ids);
      return;
    };

    let universe = await getUniverse();
    ids = retrieveValueFromStorage('places')[universe];
    let lastValue = ids[ids.length - 1].toString();
    let indexValue = urlParams.get('index');
    let isLastElement = CURRENT_URL.includes('activities.html?tab=pop&index=') && indexValue === lastValue;


    // return;

    let startButton = buttons.find(b => b.innerText.trim().toLowerCase() === 'start');
    let timeOK = false;
    let durationString = doc.querySelector('div#pop_info div.pop_central_part div.pop_remaining span')?.textContent;
    let timeToSeconds = durationToSeconds(durationString);
    let goBack = setTimeout(() => {
      (indexValue === lastValue) ? window.location.href = '/activities.html?tab=pop#GOBACK' : null;
      // console.log(indexValue, "===" ,lastValue)
    }, 1500);

    if (durationString && (timeToSeconds < (60 * 60 * 8))) timeOK = true;

    let nextButton = doc.querySelector('#next_pop');
    let navigate = () => isLastElement ? goBack : nextButton?.click();

    if (isElementVisible(doc.querySelector('.pop_central_part .hh_bar')) || (!alwaysDoPop && !placesRewardsGood())) { // FORCE OPTION DISABLED && REWARDS BAD => SKIP
      navigate();
    } else if (timeOK && clickLog(startButton)) {
      setTimeout(navigate, 500);
    } else {
      setTimeout(navigate, 7000);
    }


  }

  function placesRewardsGood() {
    return ['.slot_ticket', '.slot_girl_shards', '.slot_hard_currency', '.slot_orbs']
      .some(selector => document.querySelector(selector) !== null);
  }

  function extractUnlockedPlaces() {
    return Array.from(document.querySelectorAll('.pop_thumb_container .pop_thumb[pop_id]'))
      .map(el => parseInt(el.getAttribute('pop_id')));
  }


  const scrollUntilNotOwned = async (element = null) => {

    if (!element) element = doc.querySelector('.girls_list.grid_view.hh-scroll');
    let notOwnedElement;
    const timeout = Date.now() + 3000;

    do {
      element.scrollTop = element.scrollHeight;
      await wait(100);
      notOwnedElement = element.querySelector('.not_owned');
    } while (!notOwnedElement && Date.now() < timeout);

    return notOwnedElement || null;
  };


  const collectMoney = async (hhatCollectBtn) => {
    if (collectingMoney) return;
    collectingMoney = true;
    const scrollElement = doc.querySelector('.girls_list.grid_view.hh-scroll');
    const notOwnedElement = await scrollUntilNotOwned(scrollElement);
    scrollElement.scrollTop = 0;

    let delay = 0;
    console.log("Collect Money Invoked");

    for (let button of doc.querySelectorAll('div.soft_currency_icn')) {
      let pctBar = button.closest('.bar-wrap').querySelector('.bar');

      if (pctBar && parseFloat(pctBar.style.width) === 100) {
        await wait(delay);
        scrollToGirl(button.parentElement.parentElement.parentElement.parentElement.parentElement);
        button.dispatchEvent(new Event('click', { bubbles: true }));
        delay = 350;
      } else {
        hhatCollectBtn.setAttribute('disabled', true);
      }
    }
    // scrollElement.scrollTop = 0;
    scrollElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    collectingMoney = false;
    highestSalary(true);

  };


  function waitForElement(selector, callback) {
    const element = doc.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }

  function waitForElementVisible(selector, callback) {
    const element = doc.querySelector(selector);
    if (isElementVisible(element)) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }
  async function waitForElementAndClick(selector) {
    return new Promise((resolve) => {
      waitForElementVisible(selector, async (element) => {
        await clickLog(element);
        resolve();
      });
    });
  }

  function scrollToGirl(girlElement) {
    let girlsList = doc.querySelector('.girls_list');
    // console.log("Scrolling to", girlElement);
    if (!girlElement || !girlsList) return;

    let offset = girlElement.offsetTop - girlsList.offsetTop;

    girlsList.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  }



  function collectButtonUpdateText() {
    let moneyToCollect = doc.querySelector('#collect_all span[rel="next_salary"]')?.textContent || "money"
    let hhatCollectBtn = doc.querySelector('#hhat_collect_btn');
    if (!hhatCollectBtn) return;

    if (moneyToCollect === "0") {
      hhatCollectBtn.innerText = "Nothing";
      hhatCollectBtn.disabled = true;
    } else {

      let intMoney = toInt(moneyToCollect);
      let abbrMoney = abbreviateNumber(intMoney);

      // console.log(moneyToCollect, toInt(moneyToCollect), abbrMoney);


      hhatCollectBtn.innerText = "Collect " + abbrMoney;
      hhatCollectBtn.disabled = false;
    }
  }

  function addHaremDirectionKeys() {
    if (!doc.querySelector('#harem_whole')) return;

    let directions = { left: -1, right: 1, up: -4, down: 4 };

    for (let [key, val] of Object.entries(directions)) {
      VM.shortcut.register(key, () => haremDirectionKeys(val));
    }
  }



  function haremDirectionKeys(position) {
    let bigParent = doc.querySelector('.girls_list');
    let girls = [...bigParent.querySelectorAll('div[id_girl]')];

    let selectedIndex = currentHaremPosition || girls.indexOf(bigParent.querySelector('.opened').parentElement);
    if (selectedIndex === 0 && (position === -4 || position === -1)) return;

    let targetIndex = selectedIndex + position;
    if (targetIndex < 0 || targetIndex >= girls.length) return;

    let targetGirl = girls[targetIndex];
    let clickableGirl = targetGirl.querySelector(".harem-girl .left img");
    clickableGirl.dispatchEvent(new Event('click', { bubbles: true }));

    if (isPartiallyHidden(targetGirl)) {
      scrollToGirl(targetGirl);
    }

    currentHaremPosition = targetIndex;
  }

  function isPartiallyHidden(element) {
    let rect = element.getBoundingClientRect();
    let viewHeight = window.innerHeight;
    let viewWidth = window.innerWidth;

    return (
      rect.top < viewHeight &&
      rect.bottom > 0 &&
      rect.left < viewWidth &&
      rect.right > 0
    );
  }
  async function getUniverse() {
    while (!getShared()) {
      await wait(100);
    }
    return getShared().Hero.infos.hh_universe;
  }




  const fetchLatestCode = async () => {
    try {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://forum.kinkoid.com/index.php?/topic/14595-gift-code-posting-thread-hh/&page=999",
          onload: resolve,
          onerror: reject
        });
      });

      if (response.status === 200) {
        const html = response.responseText;
        const posts = [...html.match(/<div class='cPost_contentWrap'.*?>(.*?)<\/div>/gs)];
        const text = posts.map(p => (p.match(/<div data-role='commentContent'.*?>(.*?)<\/p>/s) || [])[1]?.replace(/<[^>]+>/g, '') || '');
        const codes = text.join(' ').match(/#\w+/gi) || [];
        let latestCode = codes.at(-1);
        return latestCode;
      } else {
        throw new Error("Failed to fetch the page");
      }
    } catch (error) {
      console.error(error.message);
    }
  };







  async function newCodes() {
    if (!window.location.href.includes("home")) return;

    let universe = await getUniverse();
    if (universe !== 'hentai') return;

    console.log("Check new codes?");

    let lastCheck = retrieveValueFromStorage("promoCodes")['lastCheck'];
    let currentTs = Date.now();
    let twentyFourHours = 86400000;

    if (!lastCheck || currentTs - lastCheck >= twentyFourHours) {
      saveArraySettings("promoCodes", "lastCheck", currentTs);

      let latestCode = await fetchLatestCode();

      if (!latestCode || !latestCode.includes("#")) return;

      let oldCodeFromValues = retrieveValueFromStorage("promoCodes")['latestCode'];
      if (oldCodeFromValues === latestCode) {
        console.log("No new codes");
        return;
      } else {
        if (confirm(`New code found. Redeem it automatically now?\n${latestCode}`)) {
          window.location.href = `/settings.html?hh_code=${encodeURIComponent(latestCode)}`;
        }

      }

      saveArraySettings("promoCodes", "latestCode", latestCode);

    } else {
      console.log("No need to update. Last check was within the last 24 hours.");
    }
  }


  function redeemCodeFromUrl() {
    if (!window.location.href.includes('settings.html')) {
      return;
    }

    const hhClick = getQueryParam('hh_code');

    if (!hhClick) return;


    const redeemCodeField = document.getElementById('redeem_code');
    if (!redeemCodeField) return;


    redeemCodeField.value = hhClick;

    setTimeout(() => {
      const redeemButton = document.getElementById('redeem_code_button');
      if (redeemButton) redeemButton.click();
    }, 200);

    stopForNow = true;
    return;

  }






  async function notifyOfTimer(name, text, url) {
    while (!getShared()) {
      await wait(100);
    }
    let universe = getShared().Hero.infos.hh_universe;

    let data = retrieveValueFromStorage(name);
    let timestamp = data[universe];

    if (!data || !timestamp) return;
    if (timestamp > Date.now()) return;

    newNotification(text, url);

  }

  notifyOfTimer("seasonal_timer", "New seasonal rewards available!", '/seasonal.html?click=event_ranking_tab');

  async function saveOptionUniverse(name, content, force = false) {
    if (optionUniverse[name] && !force) return;
    while (!getShared()) {
      await wait(100);
    }
    let universe = getShared().Hero.infos.hh_universe;

    saveArraySettings(name, universe, content);
    optionUniverse[name] = true;


  }
  function secondsToTimestamp(seconds) {
    return Date.now() + seconds * 1000;
  }
  function clickClickUrlParam(selectedClass = '.underline-tab') {
    if (urlParamClicked) return;
    let clickValue = urlParams.get('click');
    if (clickValue && !doc.querySelector(`#${clickValue}${selectedClass}`)) {
      if (clickLog(doc.querySelector(`#${clickValue}`))) {
        urlParamClicked = true;
      }
    }
  }

  function seasonal() {
    if (!window.location.href.includes('seasonal')) return;

    clickClickUrlParam()

    let rankings = doc.querySelector();
    if (!rankings) return;

    let timerSelector = '.ranking-timer.timer';
    let timer = doc.querySelector(timerSelector);

    if (!timer) return;

    let seconds = parseInt(timer.getAttribute('data-time-stamp') || 0, 10);
    // console.log(seconds)
    if (seconds > 0) {
      saveOptionUniverse("seasonal_timer", secondsToTimestamp(seconds));
      // console.log("Saving time, in",seconds,"seconds")

      GM_addStyle(`${timerSelector}::after{content: "✅";position: absolute;bottom: 0;right: 0;} ${timerSelector}{position:relative;}`);
      timer.classList.add('tick-after');




      return;
    }
    saveOptionUniverse("seasonal_timer", seconds);
    // WHY THO? Maybe -1 would be better? hmmmmm a t naaaah


  }


  function labyrinthTimer() {
    if (!window.location.href.includes('labyrinth')) return;
    clickClickUrlParam()

    let timerSelector = '.restock-info-timer .shop-timer.timer';

    let timer = doc.querySelector(timerSelector);
    if (!timer) return;
    if (timer.classList.contains('tick-after')) return;

    let seconds = parseInt(timer.getAttribute('data-time-stamp') || 0, 10);
    console.log(seconds, "seconds");


    saveOptionUniverse("labyrinth_timer", secondsToTimestamp(seconds));
    console.log("Come back in", seconds, "seconds");

    GM_addStyle(`${timerSelector}::after{content: "✅";position: absolute;bottom: 0;right: 0;} ${timerSelector}{position:relative;}`);
    timer.classList.add('tick-after');
  }


  notifyOfTimer("labyrinth_timer", "Labyrinth has reset", '/labyrinth.html?click=shop_tab');




  haremNav()
  async function haremNav() {
    let match = ['girl', 'characters'].find(p => CURRENT_URL.includes(`/${p}/`));
    if (!match) return;

    let sections = doc.querySelectorAll('#experience .left-section .girl-section, #affection .left-section .girl-section');
    if (!sections.length || doc.querySelector('#previous_girl') || doc.querySelector('#next_girl')) return;

    while (!getShared()) await wait(100);

    let universe = getShared().Hero.infos.hh_universe;
    let haremMap = retrieveValueFromStorage("girlsMap")?.[universe];
    if (!haremMap) return;

    let urlObj = new URL(window.location.href);
    let currentId = urlObj.pathname.split('/').pop();
    let keys = Object.keys(haremMap);
    let prevId = keys[keys.indexOf(currentId) - 1], nextId = keys[keys.indexOf(currentId) + 1];

    GM_addStyle(`
    .quicknav.next { left: 405px; }
    .quicknav.prev { left: 8px; }
    .quicknav { position: absolute; width: 100px; bottom: 156px; }
    .quicknav img, .quicknav-skills img { opacity: 0.8; width: 100%; }
    `);

    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (urlObj.searchParams.has('resource')) {
          resolve();
          observer.disconnect();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });

    let resourceParam = urlObj.searchParams.get('resource');

    [prevId, nextId].forEach((id, i) => {
      if (id) {
        let girl = haremMap[id], link = doc.createElement('a');
        link.href = `/girl/${girl.gId}${resourceParam ? `?resource=${resourceParam}` : ''}`;
        link.id = i === 0 ? 'previous_girl' : 'next_girl';
        link.classList.add('quicknav', i === 0 ? 'prev' : 'next');
        let img = doc.createElement('img');
        let grade = girl.nb_grades ? girl.nb_grades : 1;
        img.src = `https://ch.hh-content.com/pictures/girls/${girl.gId}/ava${grade}-1200x.webp?v=4`;
        link.appendChild(img);
        sections.forEach(section => section.appendChild(link.cloneNode(true)));
      }
    });
  }

  function haremButtons() {
    let haremTitle = doc.querySelector('#harem_left > h3');
    let buttonsContainer = doc.querySelector('div.buttons_container');
    if (!haremTitle || !buttonsContainer) return;

    collectButtonUpdateText()

    GM_addStyle(`
            #collect_all_container{display:none;}
            #unequip_all_container{visibility:hidden; display:none}
        `);
    buttonsContainer.style.overflowX = 'auto'
    buttonsContainer.style.width = '19rem'
    buttonsContainer.style.height = '5rem';
    buttonsContainer.classList.add('hh-scroll')

    let hhatCollectDiv, hhAutoItemsContainer, removeItemsBlock, changeTeamsBlock, showSalariesBlock, scrollTopBlock;
    let money = doc.querySelectorAll('div.soft_currency_icn');

    if (money.length > 0 && buttonsContainer && !doc.getElementById('hhat_collect')) {
      hhatCollectDiv = doc.createElement('div');
      hhatCollectDiv.id = 'hhat_collect';
      hhatCollectDiv.innerHTML = `<button style="height:52px;font-size:13px;padding:6px 10px;width:80px; line-height: 1.3" id="hhat_collect_btn" class="green_button_L">Collect</button>`;

      buttonsContainer.insertBefore(hhatCollectDiv, buttonsContainer.firstChild);

      let hhatCollectBtn = hhatCollectDiv.querySelector('#hhat_collect_btn');
      hhatCollectBtn.addEventListener('click', function () {
        collectMoney(hhatCollectBtn);
      });
    }


    if (!doc.getElementById('hh_remove_items_block') && hhatCollectDiv) {
      removeItemsBlock = doc.createElement('div');
      removeItemsBlock.id = 'hh_remove_items_block';
      removeItemsBlock.innerHTML = `
                <button style="height:52px;font-size:13px;padding:6px 10px;width:5rem;" id="hh_remove_items" class="red_button_L">Remove all items</button>
            `;
      buttonsContainer.insertBefore(removeItemsBlock, hhatCollectDiv.nextSibling);

      doc.querySelector('#hh_remove_items').addEventListener('click', function () {
        let unequipAll = doc.querySelector("#unequip_all");
        unequipAll.click()

        waitForElement("#popup_confirm", (okConfirm) => {
          okConfirm.click();
        });

      });
    }



    if (!doc.getElementById('hh_auto_items_container') && removeItemsBlock) {
      hhAutoItemsContainer = doc.createElement('div');
      hhAutoItemsContainer.id = 'hh_auto_items_container';
      hhAutoItemsContainer.innerHTML = `
                <button style="height:52px;font-size:13px;padding:6px 10px;" id="hh_auto_items_btn" class="purple_button_L">Auto items</button>
            `;
      buttonsContainer.insertBefore(hhAutoItemsContainer, removeItemsBlock.nextSibling);

      let hhAutoItemsBtn = doc.querySelector('#hh_auto_items_btn');
      hhAutoItemsBtn.addEventListener('click', function () {

        (async function () {
          for (let i = 0; i < 9; i++) {
            let haremGirl = doc.querySelectorAll('div[id_girl]')[i];
            if (haremGirl) {
              let clickable = haremGirl.querySelector(".harem-girl .left img");
              if (clickable) {
                await waitForLoadingToFinish(); // Wait until loading animation is gone
                clickable.dispatchEvent(new Event('click', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, autoItemsTimer));

                let girlEquip = doc.querySelector('#girl-equip');
                await waitForLoadingToFinish(); // Wait until loading animation is gone
                girlEquip?.click();
                await new Promise(resolve => setTimeout(resolve, autoItemsTimer));

              }
            }
          }
          autoEquipFirstNine = false;
        })();





      });
    }



    if (!doc.querySelector('#hh_change_teams') && hhAutoItemsContainer) {
      //https://www.comixharem.com/teams.html?battle_type=seasons
      changeTeamsBlock = doc.createElement('div');
      changeTeamsBlock.id = 'hh_change_teams';
      changeTeamsBlock.innerHTML = `
                <button style="height:52px;font-size:13px;padding:6px 10px;" id="hh_change_teams_btn" class="orange_button_L">Change team</button>
            `;
      buttonsContainer.insertBefore(changeTeamsBlock, hhAutoItemsContainer.nextSibling);

      doc.querySelector('#hh_change_teams_btn').addEventListener('click', function () {
        window.location.href = "/teams.html?battle_type=seasons&auto";

      });
    }


    if (!doc.querySelector('#hh_show_salaries') && changeTeamsBlock) {
      //https://www.comixharem.com/teams.html?battle_type=seasons
      showSalariesBlock = doc.createElement('div');
      showSalariesBlock.id = 'hh_show_salaries';
      showSalariesBlock.innerHTML = `
                <button class="purple_button_L" id="hh_show_salaries_btn" style="height:52px;font-size:13px;padding:6px 10px;">Show salaries</button>
            `;
      buttonsContainer.insertBefore(showSalariesBlock, changeTeamsBlock.nextSibling);

      doc.querySelector('#hh_show_salaries_btn').addEventListener('click', function () {
        showSalaryList()

      });
    }

    if (!doc.querySelector('#hh_scroll_top') && showSalariesBlock) {
      scrollTopBlock = doc.createElement('div');
      scrollTopBlock.id = 'hh_scroll_top';
      scrollTopBlock.innerHTML = `
                <button class="blue_button_L" id="hh_scroll_top_btn" style="height:52px;font-size:13px;padding:6px 10px;">Scroll top</button>
            `;
      buttonsContainer.insertBefore(scrollTopBlock, showSalariesBlock.nextSibling);

      doc.querySelector('#hh_scroll_top_btn').addEventListener('click', function () {
        let scrollElement = doc.querySelector('.girls_list.grid_view.hh-scroll');
        scrollElement.scrollTop = 0;
        addHaremDirectionKeys()
      });
    }



    // showSalaryList()




    // console.log(doc.querySelectorAll('div.harem-girl'))

  }

  function pantheon() {
    let performLink = [...doc.querySelectorAll('a.green_button_L.battle-action-button')].find(a => {
      let label = a.querySelector('.action-label');
      return label && (label.textContent.includes('Perform!') || label.textContent.includes('Fight!')) && !a.hasAttribute('disabled');
    });
    clickLog(performLink)


    if (CURRENT_URL.includes('pantheon.html')) {
      clickLog(doc.querySelector('.pantheon-pre-battle-btn'));
      return;
    }


    if (!CURRENT_URL.includes("pantheon-pre-battle.html")) return;

    let pantheonEnergy = doc.querySelector('#pantheon_tab_worship_energy span[energy]');
    if (pantheonEnergy?.textContent.trim() !== "0") {
      clickLog(doc.querySelector('a.blue_button_L.pantheon-pre-battle-btn'));
    }


  }



  async function waitForLoadingToFinish() {
    while (isElementVisible(doc.querySelector('.loading-anim'))) {
      await new Promise(resolve => setTimeout(resolve, 125)); // Check every 500ms
    }
  }



  function getContPointsNumber(row) {
    const pointsElement = row.querySelector('.cont_points_number span');
    return pointsElement ? parseInt(pointsElement.textContent.replace(/,/g, ''), 10) : null;
  }

  function getRowPointsByRank(rank, contestID) {
    const row = doc.querySelector(`div.ranking[id_contest="${contestID}"] tbody.leadTable tr[rank="${rank}"]`);
    // console.log("row for place",rank,"-",row)

    if (!row) return null;
    const pointsElement = row.querySelector('.cont_points_number span');
    return pointsElement ? parseInt(pointsElement.textContent.replace(/,/g, ''), 10) : null;
  }


  function getUserPosition(contestID) {
    const row = doc.querySelector(`div.ranking[id_contest="${contestID}"] tbody.leadTable tr.lead_table_default`);
    return row ? parseInt(row.getAttribute('rank'), 10) : null;
  }


  function getOrdinalSuffix(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const mod = num % 100;
    return num + (suffixes[(mod - 20) % 10] || suffixes[mod] || suffixes[0]);
  }
  function abbreviateNumber(num) {
    if (num >= 1e9) return Math.floor(num / 1e9) + 'B';
    if (num >= 1e6) return Math.floor(num / 1e6) + 'M';
    if (num >= 1e3) return Math.floor(num / 1e3) + 'K';
    return num.toString();
  }

  function getParentIdContestValue(element) {
    while (element) {
      if (element.hasAttribute('id_contest')) return element.getAttribute('id_contest');
      element = element.parentElement;
    }
    return null;
  }


  async function contestsObjectives() {
    const objectives = {
      "Spend Gems": "/characters/",
      "Earn Mojo": "/season-arena.html",
      "Win performances in Seasons": "/season-arena.html",
      "Sell items": "/shop.html?tab=books",
      "Spend energy": null,
      "Do Pantheon Performances": "/pantheon.html",
      "Use Pachinko Orbs": "/pachinko.html",
      "Gain XP (XP from Bundles doesn't count)": null,
      "Challenge Club Champions": "/club-champion.html?loop=true",
      "Give xp to the girls": "/characters/",
      "Level up a girl": "/characters/",
      "Upgrade any affection grade": "/characters/",
      "Get a new girl": "/pachinko.html",
      "Buy items from the Market": "/shop.html",
      "Restock the Market": "/shop.html",
      "Do Champion Performances (no matter win/lose)": "/champions-map.html"
    };

    while (!getShared()) await wait(100);
    let shared = getShared();

    objectives["Spend energy"] = shared?.Hero.infos.questing.current_url;

    doc.querySelectorAll('.contest_objectives .obj_desc').forEach((element) => {
      let text = element.textContent.trim();

      if (text === "Win performances in Seasons") element.textContent = "Win in Seasons";
      if (text === "Do Pantheon Performances") element.textContent = "Pantheon";
      if (text === "Use Pachinko Orbs") element.textContent = "Pachinko";
      if (text === "Gain XP (XP from Bundles doesn't count)") element.textContent = "Gain XP";
      if (text === "Challenge Club Champions") element.textContent = "Club Champion";
      if (text === "Buy items from the Market") element.textContent = "Buy from market";
      if (text === "Restock the Market") element.textContent = "Restock Market";
      if (text === "Do Champion Performances (no matter win/lose)") element.textContent = "Do Champion Performances";
      if (text === "Upgrade any affection grade") element.textContent = "Upgrade affection";

      if (/Play (\w+ Pachinko(?: \d+| Draft)?)/i.test(text)) {
        element.textContent = text.replace(/Play (\w+ Pachinko(?: \d+| Draft)?)/i, '$1');
      }

      if (!text.includes("Pachinko") && !objectives[text]) return;

      if (element.nextElementSibling?.tagName === 'A') return;

      element.innerHTML = element.innerHTML.includes('Pachinko') ? element.innerHTML.replace('Pachinko', '<em>PK</em>') : element.innerHTML;



      let url = (!!objectives[text]) ? objectives[text] : "/pachinko.html";

      const button = doc.createElement('a');
      button.textContent = "Go";
      button.href = url;
      button.target = "_blank";
      button.style.marginLeft = '5px';
      button.style.padding = "5px 10px";
      button.className = 'orange_button_L';
      element.after(button);
    });


    doc.querySelectorAll('.contest_objectives .obj_info').forEach((pointsInfo) => {

      if (!!pointsInfo.parentElement.querySelector('.HAT-info')) return;



      let contestID = getParentIdContestValue(pointsInfo);

      let userPosition = getUserPosition(contestID);



      let missionPoints = pointsInfo.querySelector('.points').innerText.trim()
        .replace(',', '') // Remove commas
        .replace(/(\d)\.(\d)K$/, (_, intPart, decimalPart) => `${intPart}${decimalPart.padEnd(3, '0')}`) // Handle "40.0K"
        .replace('K', '000'); // Replace "K" with "000"

      let infoDiv = doc.createElement('div');
      infoDiv.classList.add('HAT-info');


      let price = 0;
      let buttonPrice = pointsInfo.querySelector('button[data-price]');

      if (!!buttonPrice) {
        price = parseInt(buttonPrice.getAttribute('data-price'), 10);
      }

      let userPoints = getRowPointsByRank(userPosition, contestID);

      [1, 4].forEach((place) => {
        let pointsToReach = getRowPointsByRank(place, contestID);
        let missingPoints = pointsToReach - userPoints;
        let timesToDoAction = Math.ceil(missingPoints / missionPoints);
        let priceForPosition = price * timesToDoAction;
        let priceString = priceForPosition ? `for ${abbreviateNumber(priceForPosition)}` : ``;

        if (timesToDoAction <= 0) return;

        console.log("Need to reach", pointsToReach, `points for ${place}th place because missing ${missingPoints} points (currently ${userPosition}th position with ${userPoints}). This mission gives`, missionPoints, "points, so do this", missingPoints / missionPoints, "(", timesToDoAction, ")", "times");




        let divText = doc.createElement('div');
        divText.innerHTML = `<div>${getOrdinalSuffix(place)}</div><div>${abbreviateNumber(timesToDoAction)} times</div>${priceForPosition ? `<div>${priceString}</div>` : ``}`;
        infoDiv.appendChild(divText);



      });

      pointsInfo.parentElement.appendChild(infoDiv);

      GM_addStyle(`

      #contests > div.contests-container > div.left_part > .scroll_area > .contest > .contest_body > .contest_rewards > .reward_position{
        width: auto;
        min-width: max-content;
        padding-left: 5px;
        transition: none;
      }
      #contests > div.contests-container > div.left_part > .scroll_area > .contest > .contest_body > .contest_info {
        width: 273px;
      }


.contest_objectives > div > .obj_desc{
  padding: 0;
}

.HAT-info{
  opacity:.75;
  width: 100%;
/*   text-align: end; */
  padding-right: 1rem;
}

.HAT-info > div{
  display:flex;
  justify-content: space-between;
}


.contest_objectives > div > .obj_info{
  margin-left: 0;
}

.contest_objectives > div{
   display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;
}




      `);

    });


  }



  function updateMissionsCounter(seconds) {
    const missionsCounter = document.querySelector("#missions_counter");
    if (missionsCounter.querySelector(".time-to-finish-all.timer")) return;

    const newMissionsTimer = missionsCounter.querySelector(".new-missions-timer.timer");
    if (!newMissionsTimer) return;

    let expiryTimestamp = secondsToTimestamp(seconds);

    const div = document.createElement("div");
    div.className = "time-to-finish-all timer new-missions-timer";
    div.setAttribute("data-time-stamp", seconds);
    div.innerHTML = `<p>Finished <span rel="expires">${timestampToString(expiryTimestamp)}</span></p>`;
    newMissionsTimer.after(div);

    const span = div.querySelector("span[rel='expires']");
    const interval = setInterval(() => {
      span.innerText = timestampToString(expiryTimestamp);
    }, 1000);


    GM_addStyle(`

    #missions_counter{
      display:inline-flex;
    }

    #missions #missions_counter .missions-counter-rewards{
      display:none;
    }

  `);

  }








  async function doMissions() {
    let rarityLevels = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5, 'mythic': 6 };
    let missionObjects = [...document.querySelectorAll('.mission_object.mission_entry')];

    let ascending = sessionStorage.getItem('missionsAscending') === 'true';

    missionObjects.sort((a, b) => {
      const aRarity = Object.keys(rarityLevels).find(rarity => a.classList.contains(rarity)) || 'common';
      const bRarity = Object.keys(rarityLevels).find(rarity => b.classList.contains(rarity)) || 'common';
      return ascending ? rarityLevels[aRarity] - rarityLevels[bRarity] : rarityLevels[bRarity] - rarityLevels[aRarity];
    });

    const hasShorterMission = missionObjects.some(m => {
      const dataD = JSON.parse(m.getAttribute('data-d'));
      return dataD.duration < 3600;
    });

    // console.log(missionObjects)
    let index = 0;
    let totalDuration = 0;
    for (let mission of missionObjects) {
      mission.style.order = index++;
      let button = mission.querySelector('button.blue_button_L[rel="mission_start"]');
      // let button = mission.querySelector('button.blue_button_L[rel="mission_start"]:not([disabled])');
      if (!button) continue;

      const dataD = JSON.parse(mission.getAttribute('data-d'));
      const duration = dataD.duration;

      totalDuration += duration;

      // if (hasShorterMission && duration > 3600) continue;

      button.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("Total duration:", totalDuration, "seconds", timestampToString(secondsToTimestamp(totalDuration)))
    updateMissionsCounter(totalDuration)

    GM_addStyle(`

      #missions .missions_wrap{
        display: flex;
        flex-direction: column;
      }



    `)
  }


  function champions() {
    let weAreTheChampions = window.location.href.includes('champion');
    if (!weAreTheChampions) return;

    if (window.location.href.includes('champions-map')) {
      let universe = getShared()?.Hero.infos.hh_universe;
      if (!universe) return true;

      let championsLairs = [...doc.querySelectorAll('a.champion-lair')]
        .filter(el => el.getAttribute('href') !== 'champions-help.html')
        .map(el => ({
          id: parseInt(el.getAttribute('href').split('/')[1]),
          name: el.querySelector('.champion-lair-name span').innerText,
          href: el.getAttribute('href'),
          obtainedGirl: el.querySelector('span.green-tick-icon') ? true : false
        }));


      saveArraySettings("championsLairs", universe, championsLairs);


      let parentsWithoutTimers = Array.from(doc.querySelectorAll('.stage-bar-wrapper'))
        .map(wrapper => wrapper.parentElement)
        .filter(parent => {
          let hasTimer = parent.querySelector('.champion-rest-timer');
          let hasGreenTick = skipObtainedChampionGirl && parent.querySelector('span.green-tick-icon');

          if (hasGreenTick && skipObtainedChampionGirl) {
            parent.style.opacity = ".6";
            parent.style.filter = "saturate(0.1)";
          }


          return !hasTimer && !hasGreenTick;
        });


      console.log(parentsWithoutTimers)
      if (autoStartChampions && parentsWithoutTimers.length > 0) {
        nextChampion(true)

      }

      let restTimers = doc.querySelectorAll('.champion-rest-timer');
      let times = Array.from(restTimers)
        .map(el => parseInt(el.getAttribute('data-time'), 10))
        .filter(time => !isNaN(time));

      let lowestTime = Math.min(...times);

      if (lowestTime === Infinity) {
        nextChampion(true);
        console.log("We should go now. lowestTime =", lowestTime)
        return true;
      }

      console.log("lowestTime:", lowestTime, "(", times, ") from", restTimers);
      setTimeout(() => nextChampion(true), lowestTime * 1000);



      return true;
    }


    let tickets = shared.Hero.currencies.ticket || null;
    if (!tickets || tickets <= 0) return true;

    clickLog(doc.querySelector('button.champions-bottom__start-battle'));



    nextChampion();
    stopForNow = true;





    return true;
  }


  async function nextChampion(force = false) {
    // console.log("nextChampion();")

    if (!!doc.querySelector('.champions-bottom__start-battle') && window.location.pathname !== '/champions-map.html') {
      // console.log("Not map. Waiting for start button.")
      await new Promise(resolve => waitForElementVisible(".section__battle-header", resolve));
    }

    if (new URLSearchParams(window.location.search).get('loop') === 'true') {
      console.log("Loop true, returning");
      return;
    }

    if (loopChamp) return;


    while (!getShared()) {
      await wait(50);
    }

    let universe = getShared().Hero.infos.hh_universe;

    let championsLairs = retrieveValueFromStorage("championsLairs");

    // console.log("championsLairs:", championsLairs)

    if (!championsLairs || !championsLairs[universe]) {
      stopForNow = true;
      window.location.href = "/champions-map.html";
      return true;
    }
    let match = window.location.pathname.match(/\/champions\/(\d+)/);
    let champId = match ? parseInt(match[1]) : null;
    let championsInfo = championsLairs[universe];


    let newChampion = {
      "id": 99,
      "name": "Club Champion",
      "href": "club-champion.html",
      "obtainedGirl": false
    };

    if (typeof shared.Hero.club === 'object') {
      championsInfo.push(newChampion);
    }
    // console.log("shared.Hero.club, championsInfo:", shared.Hero.club, championsInfo)


    let currentIndex = championsInfo.findIndex(champ => champ.id === champId);
    let nextIndex = (currentIndex + 1) % championsInfo.length;


    while (skipObtainedChampionGirl && championsInfo[nextIndex].obtainedGirl) {
      nextIndex = (nextIndex + 1) % championsInfo.length;
    }
    let nextChampion = championsInfo[nextIndex];
    let nextChampionHref = "/" + nextChampion.href;
    // console.log("nextIndex:",nextIndex,"currentIndex:",currentIndex)
    if ((currentIndex >= 0 && nextIndex > currentIndex) || force) {

      window.location.href = nextChampionHref;
      console.log("Next champ")
      stopForNow = true;
    } else if (window.location.pathname !== '/champions-map.html') {
      window.location.href = "/champions-map.html";
      console.log("Return to map")

    }

    return true;





  }

  async function pachinko() {
    if (!dailyPachinko && doc.querySelector('.playing-zone[type-panel="mythic"]') && doc.querySelector('button[data-free="true"]')) {
      dailyPachinko = true;
      console.log("Daily Pachinko!");

      const elements = [
        'button[data-free="true"]',
        'button[confirm_blue_button]',

        'div[type-pachinko="equipment"]',
        'button[data-free="true"]',
        'button[confirm_blue_button]',

        'div[type-pachinko="great"]',
        'button[data-free="true"]',
        'button[confirm_blue_button]',
      ];

      for (let i = 0; i < elements.length; i++) {
        await waitForElementAndClick(elements[i]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }


  function isElementVisible(element) {
    if (!element) return false
    const style = window.getComputedStyle(element);
    if (!style) return true
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function tryLogin() {
    const loginLink = doc.querySelector('a[rel="phoenix_member_login"][title="Login"]');
    if (loginLink) {
      console.log("LOGGIN IN");
      loginLink.click();
      alreadyLogged = true;
    }
  }

  function seasonArena() {
    if (!doc.querySelector("body.page-season_arena")) return;

    let energyElement = doc.querySelector('#season_battle_user_block_kiss_energy .energy_counter_amount span[energy]');
    let sysEnergy = shared.Hero.energies.kiss.amount || null;
    // console.log(sysEnergy)
    let energy = sysEnergy || parseInt(energyElement.textContent);
    // console.log(energyElement, energy)
    if (energy <= 0) return;



    let pctSpan = Array.from(doc.querySelectorAll('span.matchRating'));

    let pctSpanGood = Array.from(doc.querySelectorAll('span.matchRating.plus'));
    let pctSpanAverage = Array.from(doc.querySelectorAll('span.matchRating.close'));
    let pctSpanBad = Array.from(doc.querySelectorAll('span.matchRating.minus'));

    if (pctSpan.length > 0) {
      let winningElement = pctSpan
        .map(el => ({ el, val: parseInt(el.textContent.replace('%', '')) }))
        .sort((a, b) => b.val - a.val)[0].el;


      if (winningElement.classList.contains('minus')) return;

      if (pctSpanGood.length > 1) {
        // console.log("More than one good:",pctSpanGood)
        let highestMojoValue = -Infinity;
        let bestGoodElement = null;
        let bestMojoElement = null;


        pctSpanGood.forEach(good => {
          let mojo = good.parentNode.parentNode.parentNode.parentNode.querySelector('div.opponent_rewards div.rewards_list div.slot_victory_points div.amount');
          let mojoValue = parseInt(mojo.textContent.trim());
          // console.log(mojoValue)

          if (mojoValue > highestMojoValue) {
            // console.log("New:",good, "bacause:",mojoValue,">",highestMojoValue)
            highestMojoValue = mojoValue;
            bestGoodElement = good;
            bestMojoElement = mojo;
          }
        });

        if (bestGoodElement) {
          winningElement = bestGoodElement;
          bestMojoElement.style = "color: rgb(102, 205, 0) !important";
          console.log("New winningElement:", bestGoodElement)
        }
      }
      winningElement.style = "outline: 8px green solid; outline-offset: 3px;";

      let grandparent = winningElement.parentNode.parentNode.parentNode.parentNode;
      let performBtn = grandparent.querySelector('div.player-panel-buttons div button[rel="launch"]');

      // console.log(performBtn); // Logging the perform button for verification

      setTimeout(() => {
        clickLog(performBtn); // Uncomment this line to perform the click action after 1500ms
      }, 250);
    }
  }

  function game() {
    if (!doc.querySelector('.page-quest')) return;

    let img = document.querySelector('#background');
    if (img) img.src = img.src.replace('800x450cut', '1600x900cut');


    let clickNextGame = doc.querySelector('button#pay.green_text_button');
    let currentEnergy = shared.Hero.energies.quest.amount || doc.querySelector('span[energy]')?.textContent;
    let necessaryEnergy = doc.querySelector('button#pay.green_text_button .action-cost .price')?.textContent;
    // console.log("are we here")
    if (!currentEnergy) { console.log("currentEnergy:", currentEnergy, "necessaryEnergy:", necessaryEnergy); return; }

    let currentEnergyInt = parseInt(currentEnergy);
    let necessaryEnergyInt = parseInt(necessaryEnergy);
    if (currentEnergyInt < necessaryEnergyInt) { console.log("currentEnergyInt:", currentEnergyInt, "necessaryEnergyInt:", necessaryEnergyInt); return; }
    clickLog(clickNextGame);

    clickLog(doc.querySelector('button#battle.next-button'));
    clickLog(doc.querySelector('button#free.next-button'));
    clickLog(doc.querySelector('button#use_item.next-button'));
    clickLog(doc.querySelector('#pay.next-button.green_text_button'))
  }

  function messanger() {
    if (!doc.querySelector("#messenger")) return;

    clickLog(doc.querySelector('button.message-option'));
    clickLog(doc.querySelector('button.blue_button_L[close_callback][confirm_blue_button]'));
    clickLog(doc.querySelector('button.claim-messenger-reward'));



    let replies = doc.querySelector("#hero-current-replies").textContent.trim();
    let repliesInt = parseInt(replies);
    if (repliesInt <= 0) {
      doc.querySelector(".close-button").click();
    }
  }

  function removeMissionsComplete() {
    let elems = Array.from(document.querySelectorAll('.daily-goals-objective'));
    let toRemove = elems.filter(div => div.querySelector('.daily-goals-objective-action p')?.textContent === 'Completed!');
    let removedCount = toRemove.length;
    toRemove.forEach(div => div.remove());


    if (!doc.querySelector('#hh_missions_complete') && removedCount === elems.length) {
      // MISSIONS COMPLETE

      let missionsParent = doc.querySelector('.daily-goals-objectives-container');
      missionsParent.style.marginTop = "1rem";
      missionsParent.style.height = "100%";
      missionsParent.style.justifyContent = "center";
      let completeH3 = doc.createElement('h3');
      completeH3.id = 'hh_missions_complete';
      completeH3.innerText = 'Missions complete';
      missionsParent.appendChild(completeH3);
    }
  }

  function activitiesTab() {
    if (!doc.querySelector('#activities-tabs')) return;
    removeMissionsComplete()

    if (!doc.querySelector('#missions_counter') || doc.querySelector("#missionsAscending")) return;
    let button = doc.createElement('button');
    button.className = 'blue_button_L';
    button.id = 'missionsAscending';
    button.style = 'height:2rem;line-height:0;width:120px';
    doc.querySelector('#missions_counter').appendChild(button);

    if (!sessionStorage.getItem('missionsAscending')) {
      sessionStorage.setItem('missionsAscending', 'false');
    }


    button.innerText = sessionStorage.getItem('missionsAscending') === 'false' ? 'By rarity' : 'By time';

    button.onmouseover = function () {
      button.innerText = sessionStorage.getItem('missionsAscending') === 'false' ? 'By time' : 'By rarity';
    };

    button.onmouseout = function () {
      button.innerText = sessionStorage.getItem('missionsAscending') === 'false' ? 'By rarity' : 'By time';
    };


    button.title = 'Currently ' + (sessionStorage.getItem('missionsAscending') === 'true' ? 'bottom top' : 'top bottom');

    button.onclick = function () {
      let ascending = sessionStorage.getItem('missionsAscending') === 'true';
      sessionStorage.setItem('missionsAscending', !ascending);
      button.innerText = ascending ? 'Descending' : 'Ascending';
      // location.reload()
      doMissions()
    };



    //Potions of Erection  == daily missions
    //Earn Potions of Lust by playing in the Night-club.


  }


  function leagues() {
    if (!doc.querySelector('body[page="leagues-pre-battle"]')) return;

    if (!doc.querySelector('#hh_league_amp_next')) {

      let battleButtonsRow = doc.querySelector('.battle-buttons-row');
      let nextLeagueOpp = doc.querySelector('#next_league_opp');
      if (!nextLeagueOpp) return;
      let href = nextLeagueOpp.getAttribute('href');

      let hhLeagueAmpNext = doc.createElement('div');
      hhLeagueAmpNext.id = 'hh_league_amp_next';
      hhLeagueAmpNext.className = 'green_button_L battle-action-button league-multiple-battle-button';
      hhLeagueAmpNext.innerHTML = `
            <div class="action-label">Challenge &amp; next</div>
            <div class="action-cost">
                <div><span class="energy_challenge_icn"></span> x3</div>
            </div>
        `;

      battleButtonsRow.insertBefore(hhLeagueAmpNext, nextLeagueOpp);

      hhLeagueAmpNext.addEventListener('click', function () {
        let nextBattleBtn = doc.querySelector('.league-multiple-battle-button');
        console.log(nextBattleBtn)
        nextBattleBtn.click();


        let waitForDisabled = () => {
          const checkDisabled = setInterval(() => {
            if (nextBattleBtn.hasAttribute('disabled')) {
              clearInterval(checkDisabled);
              console.log("BTN DISABLED! Going to", href);
              window.location.href = href;
            }
          }, 100); // Check every 100ms
        };

        waitForDisabled();

      });
    }

    GM_addStyle(`
        .battle-action-button.green_button_L {
            min-width: revert;
            padding-inline: 1rem;
        }
    `);
  }

  labyrinthBuilder()
  async function labyrinthBuilder() {
    if (!doc.querySelector('#edit-team-page') || (!doc.body.textContent.includes("Labyrinth") || !doc.body.textContent.includes("labyrinth"))) return;
    await wait(100);

    clickLog('#clear-team');
    await wait(100);
    clickLog('#auto-fill-team');

  }

  function labyrinth() {

    debug = false;


    let confirmButton = doc.querySelector('button[rel="labyrinth_team_confirmation"]');
    let autoAssignButton = doc.querySelector('button[rel="labyrinth_auto_assign"]');


    if (doc.body.textContent.includes("Are you sure you want to perform with a partially full team?")) {


      console.log("Some shit to do");

      clickLog(doc.querySelector('.red_button_L[close_callback=""]'));
      clickLog(doc.querySelector('#change_team'));

      stopForNow = true;

      return;
    }




    if (!!confirmButton && confirmButton.disabled) {
      autoAssignButton.click();
      setTimeout(() => {
        confirmButton.click();
      }, 200);
    }

    let autoFillButton = doc.getElementById('auto-fill-team');
    let validateButton = doc.getElementById('validate-team');

    if (!!autoFillButton && autoFillButton.disabled) {
      validateButton.click();
    }



    const confirmationPopup = doc.querySelector('#confirmation_popup div p.text');
    if (!!confirmationPopup && confirmationPopup.textContent === "No girl will be healed, are you sure you want to proceed?") {
      // doc.querySelector('#popup_confirm').click();
      clickLog(doc.querySelector('#popup_confirm'))
    }


    setTimeout(() => {
    }, 250);

    if (isElementVisible(doc.querySelector('#labyrinth_reward_popup'))) {
      const rarityLevels = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5, 'Mythic': 6 };

      const rarestRelic = Array.from(doc.querySelectorAll('.relic-container'))
        .reduce((acc, container) => {
          const rarityText = container.querySelector('.relic-name span').textContent.trim();
          const rarityLevel = rarityLevels[rarityText] || 0;
          return rarityLevel > (acc.level || 0) ? { container, level: rarityLevel } : acc;
        }, {});

      if (rarestRelic.container) {
        const rarityText = rarestRelic.container.querySelector('.relic-name span').textContent.trim();
        console.log(`Rarest relic rarity: ${rarityText}`, rarestRelic.container.querySelector('.claim-relic-btn'));
        !debug && rarestRelic.container.querySelector('.claim-relic-btn').click(); // Commented out click action
      }
      return
    } else if (doc.querySelector('div.labyrinth-panel.home-tab-active') === null || isElementVisible(doc.querySelector('#rewards_popup'))) {
      debug && console.log("no labyrinth", doc.querySelector('#rewards_popup'), isElementVisible(doc.querySelector('#rewards_popup')));
      return;
    }

    const hexes = doc.querySelectorAll('.clickable-hex');
    let lowestHex = null;
    let lowestPower = Infinity;

    hexes.forEach(hex => {
      const sibling1 = hex.nextElementSibling;
      const sibling2 = sibling1 ? sibling1.nextElementSibling : null;

      let hexType = hex.getAttribute('hex_type');
      if (hexType === "treasure" || hexType === "shrine") {
        if (!lowestHex || hexType === "treasure" || (hexType === "shrine" && lowestHex.getAttribute('hex_type') !== "treasure")) {
          lowestHex = hex;
          lowestPower = 0; // Reset lowest power for treasure or shrine
        }
      } else if (sibling2) {
        const powerText = sibling2.querySelector('.opponent-power-text');
        const power = parseInt(powerText.getAttribute('data-power'), 10);
        if (power < lowestPower) {
          lowestPower = power;
          lowestHex = hex;
        }
      }
    });
    // let youWon = doc.querySelector("#rewards_big_header");

    // console.log("YOU WON INNERTEXT", youWon.innerText)
    if (lowestHex && !isElementVisible(doc.querySelector('#labyrinth_reward_popup'))) {
      setTimeout(() => {
        // !debug && lowestHex.click();
        !debug && clickLog(lowestHex, true);
        console.log("Click on:", lowestHex, lowestPower);
      }, 1500);
    } else {
      console.log("Can't click, rewards on");
    }

  }

  function createLabyrinthButton() {
    let labyrinthButton = doc.createElement('button');
    labyrinthButton.id = "labyrinthButton";
    labyrinthButton.style = 'position:fixed;right:10px;bottom:10px;z-index:2';
    labyrinthButton.innerText = 'Return to Labyrinth';
    labyrinthButton.className = 'blue_button_L';

    labyrinthButton.onclick = function () {
      window.location.href = "/labyrinth.html"
    };

    doc.body.appendChild(labyrinthButton);
  }

  function highlightStats() {
    const stats = document.querySelectorAll('.my-hero-stats [carac]');
    if (stats.length) {
      let max = -Infinity, min = Infinity, high, low;
      stats.forEach(el => {
        const val = parseInt(el.textContent.replace(/,/g, ''));
        if (val > max) max = val, high = el;
        if (val < min) min = val, low = el;
      });
      high.style.color = '#00dc00';
      low.style.color = '#ff1a1a';
    }
  }



  function market() {
    if (!doc.querySelector('#shops')) return;

    batchMarketSell('#gifts-tab-container');
    batchMarketSell('#books-tab-container');
    highlightStats();

    if (addedSellListeners) return;
    doc.querySelectorAll('button[rel="sell"]').forEach(button => {
      button.addEventListener('click', () => {
        marketSold++;
        doc.querySelectorAll('.soldText').forEach(element => {
          element.innerText = `Sold: ${marketSold}`;
        });
      });
    });
    addedSellListeners = 1;
  }

  function batchMarketSell(containerId) {
    const inventoryTitle = doc.querySelector('p.right-side-title');
    const bottomContainer = doc.querySelector(`${containerId} div.right-container div.bottom-container`);

    if (!!inventoryTitle && inventoryTitle.textContent.trim() === 'My Inventory' && !doc.getElementById(`sell-all-${containerId.slice(1)}`)) {
      bottomContainer.style = "display:flex;align-items: center;"
      bottomContainer.style.height = '4.5rem'

      let sellAllBtn = doc.createElement('button');
      sellAllBtn.id = `sell-all-${containerId.slice(1)}`;
      sellAllBtn.className = 'green_text_button';
      sellAllBtn.textContent = 'First item all';
      sellAllBtn.style.height = '100%'
      sellAllBtn.addEventListener('click', () => {
        sellFirstItem(containerId)
      });
      bottomContainer?.appendChild(sellAllBtn);

      let soldText = doc.createElement('div');
      soldText.classList.add('soldText');
      soldText.innerText = `Sold: 0`;
      bottomContainer?.appendChild(soldText);



    }
  }


  function sellFirstItem(containerId) {
    let itemToSell = doc.querySelector(`${containerId}.active div.right-container div.my-inventory-container div.player-inventory-content div.slot-container div.slot`);
    let currentItemsNumber = parseInt(itemToSell?.querySelector("div.amount span")?.textContent.trim(), 10) || 1;


    if (!itemToSell || currentItemsNumber <= 0) {
      console.log("!itemToSell:", !itemToSell, "currentItemsNumber:", currentItemsNumber)
      return
    };

    itemToSell.setAttribute('data-uid', `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const uid = itemToSell.getAttribute('data-uid');
    console.log('Unique ID of the element:', uid);

    itemToSell.click();

    const sellButton = doc.querySelector(`${containerId} div.right-container div.bottom-container button.green_text_button`);
    if (!sellButton) return;

    console.log("Clicking", sellButton, currentItemsNumber, "times");
    let initialInt = currentItemsNumber;

    let itemToSellUpdated = null;
    let currentItems = 0;
    const sellInterval = setInterval(() => {
      itemToSellUpdated = doc.querySelector(`${containerId}.active div.right-container div.my-inventory-container div.player-inventory-content div.slot-container div.slot`)
      currentItems = parseInt(itemToSell?.querySelector("div.amount span")?.textContent.trim(), 10);
      if (!itemToSellUpdated.hasAttribute('data-uid') || !currentItems || currentItems <= 0) {
        clearInterval(sellInterval);
      } else {
        sellButton.click();
      }

    }, 150);
  }






  if (SFW) document.title = "Farming Game";
  // CSS SFW
  if (SFW) GM_addStyle(`



body.post-template-default .elementor-widget-image,
body.post-template-default .elementor-widget-container img{
  display: none;
}





#leagues .league_content,
#leagues .league_content .league_tiers{
	height: auto;
  max-width: revert;
}

#hh_hentai #leagues .league_content .league_table .data-list .data-row.head-row {
	width: calc(100% - 4rem) !important;
	left: 2rem;
}

.background_image-style:has(+#login_register_form),
video.background_image-style{
  display: none;
}



body:has(#login_register_form){
  background:#000;
}
#authenticate-form{
  filter:invert(1) hue-rotate(120deg) brightness(137%) saturate(69%);

}
#google-login {
	filter: hue-rotate(1000deg) contrast(150%) grayscale(100%);
}
#authenticate .title_banner{
  z-index:2;
}
video.background_image-style{
  display:none;
}

img.avatar{
  display:none;
}
img.champions-over__girl-image,img.champions-over__champion-image, img.girl-ava,.pvp-girls{
  filter:blur(28px) !important;
}
canvas.animated-girl-display,
div.girl-display img.avatar {
  display:none !important;

}
img.figure[id-pose]{
	content: url("https://picsum.photos/220");
  border-radius: 50%;
}
img[src="https://hh2.hh-content.com/pictures/backgrounds/2200x/club_champion_1.jpg"]{ /* champion bg */
	content: url("https://picsum.photos/id/1/2200/1200");
}
div.page-member-progression.member-progression-container.tiers-container{
  width: calc(100% - 1rem)
}

div.page-girl, img.girl-avatar-0, img.girl-avatar-1{
  display: none;
}
img.pop_left_fade_list.avatar {
	content: url("https://picsum.photos/340/800");
	top: 1.5rem;
	position: relative;
}
img.champion-pose{
	content: url("https://picsum.photos/220");
  border-radius: 50%;
  padding:.4rem;
}

.pachinko_img img{
	content: url("https://picsum.photos/616");
  border-radius: 50%;
  }
div.avatar-box img.avatar,
div.girl-avatar-wrapper img.avatar,
img.pop_left_fade_page.avatar{
  content: url("https://picsum.photos/1200/3000");
  border-radius: 1rem;
  filter: brightness(.9) grayscale(1.1)
}

[page="teams"] .nc-panel .nc-panel-body .teams-content-container .girl-image-container img{
  content: url("https://picsum.photos/200/500");
  width: 155px;
  left: 0;
  border-radius: 1rem;
  object-fit:contain;
}

div.waifu-container img.avatar{
    display: none;
}
#pop div.pop_thumb img{
    content: url("https://picsum.photos/512/260");
}
#pop div.pop_list_scrolling_area, div.pop_thumb_container, div.pop_thumb {
  height: min-height;
}
#pop div.pop_thumb_space{
  display: none !important;

}

#pop div.pop_thumb{
  position: relative;
  height: initial !important;
}
#pop .pop_list .pop_list_scrolling_area .pop_thumb > .pop_thumb_progress_bar .hh_bar > .backbar{
  width: calc(100% - 5px) !important;
}
#pop div.pop_thumb_progress_bar{
  top: 0;
	margin-top: 8px;
	padding-bottom: 2rem !important;

  backdrop-filter: blur(5px) contrast(1.05) brightness(.95);
  padding: 5px;
  background-color: #00000045 !important;
  border-radius: 5px !important;
  margin-inline: 5px;
  width: calc(100% - 10px) !important;
}

#activities div.pop_thumb button.purple_button_L{
  position:absolute;
  bottom:0;
}

img.pop_left_fade_list.avatar{
    content: url("https://picsum.photos/1200/3000");
}
div.contest_header {
  background-image: url("https://picsum.photos/1700/421") !important;
}
div.contest_title  {
  display: none !important;
}
div.contest_title_timer div.contest_timer{
  position: absolute;
  right: 0;
  bottom: 5px;
}

div.collect_notif{
  filter: hue-rotate(270.1deg);
}
div.pop_thumb_title{
  opacity: 0;
  transition: opacity .5s;
position: absolute !important;
  top: 0;
  left: 0;
  margin: 0 !important;
}
/* div.pop_thumb:hover div.pop_thumb_title{
  opacity: 1;
} */
button[rel="pop_thumb_info"]{
  position: absolute;
  bottom: 0;
}
div.girl_action img:not(.classGirl), .player-profile-picture img,div.girl_ico img {
    content: url("https://picsum.photos/300");
}


div.slot img, div.mission_object div.mission_image img{
  scale: .8;
}
div.slot.mythic img{
    content: url("https://picsum.photos/id/100/200");
}
div.slot.legendary img{
    content: url("https://picsum.photos/id/221/200");
}
div.slot.rare img{
    content: url("https://picsum.photos/id/312/200");
}
div.slot.epic img{
    content: url("https://picsum.photos/id/444/200");
}
div.slot.common img{
    content: url("https://picsum.photos/id/519/100");
}
img.awakening-avatar{
  display: none;
}
div.mission_object.mythic div.mission_image img{
    content: url("https://picsum.photos/id/100/200");
}
div.mission_object.legendary div.mission_image img{
    content: url("https://picsum.photos/id/221/200");
}
div.mission_object.rare div.mission_image img{
    content: url("https://picsum.photos/id/312/200");
}
div.mission_object.epic div.mission_image img{
    content: url("https://picsum.photos/id/444/200");
}
div.mission_object.common div.mission_image img{
    content: url("https://picsum.photos/id/519/200");
}
div.mission_details{
  display: none;
}
#missions .missions_wrap .mission_object{
  height: auto;
}
/* #missions .missions_wrap .mission_object .mission_image{
  height: 2.5rem;
  width: 2.5rem;
  border: 2px solid #00000073;
  padding: 0 !important;
} */
div.mission_object {
  display: flex;
	flex-direction: row;
	justify-content: space-around;
	justify-content: space-between;
	align-content: center;
	align-items: center;
  padding-inline: 1rem;
}
#missions .missions_wrap .mission_object .mission_button > button[rel="finish"],
#missions .missions_wrap .mission_object .mission_button > button[rel="claim"],
#missions .missions_wrap .mission_object .mission_button .hh_bar,
#missions .missions_wrap .mission_object .mission_button .duration,
#missions .missions_wrap .mission_object .mission_button > button[rel="mission_start"]{
  left: 0;
}
#missions .missions_wrap .mission_object .mission_reward {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

div#login_register_form div#character-wrapper img.character{
  content: url("https://picsum.photos/1200/3000");
  border-radius: 1rem;

}


div.new-battle-hero-team-container div.new-battle-girl-container img{
  display: none;
}

div.battle-girls-row div.player-girl img{
  content: url("https://picsum.photos/id/69/1200/3000");
  border-radius: 1rem;
}
div.battle-girls-row div.oponnent-girl img{
  content: url("https://picsum.photos/id/666/1200/3000");
  border-radius: 1rem;
}
img.message-image{
  content: url("https://picsum.photos/800/451");
  border-radius: 1rem;
}

#girls_holder img.avatar{
  display:none;
}



div.daily-goals-right-part{
  display: none;
}

div.team-girl-container div.girl-container{
  display: none;
}
#daily_goals .daily-goals-container .daily-goals-left-part .daily-goals-objectives-container{
  flex-direction: column-reverse;
}

div.defender-preview.move-backwards-opponents img{
  filter: blur(20px);
}
#next_girl{
    content: url("https://picsum.photos/1119/3000");
    border-radius: 1rem;
  transform: scale(.50) translateY(25%)
}
#previous_girl{
    content: url("https://picsum.photos/1120/2999");
    border-radius: 1rem;
  transform: scale(.50) translateY(25%)
}

img.girl-box__ico, div.base-hexagon img.girl_img,
div.conversation-image div.image-background img{
    content: url("https://picsum.photos/id/230/230");
}
img[src="https://hh2.hh-content.com/pictures/pantheon/temple_1/backgrounds/stage_300.jpg"], [src="https://hh2.hh-content.com/pictures/backgrounds/2200x/pantheon_stage_1_300.jpg"]{
    content: url("https://picsum.photos/id/46/2200/1200");
}
div#harem_left div.girls_list div div.harem-girl div img,
img.girl_img {
    content: url("https://picsum.photos/id/45/300");
}
#contests > div.contests-container > div.right_part > .ranking > h5,
#contests > div.contests-container > div.right_part > .info > h5{
  display: none;
}

.league_girl {
  display: none;
}



`);





  function createFixedButton(doc, color, buttonText, selectorCondition, onClickHandler) {
    let id = "hh_" + buttonText.toLowerCase();
    let wrapperDiv = doc.getElementById('hht_right_bottom_buttons') || (() => {
      let wrapperDiv = doc.createElement('div');
      wrapperDiv.id = 'hht_right_bottom_buttons';
      Object.assign(wrapperDiv.style, { position: 'fixed', right: '10px', bottom: '10px', zIndex: '1000', display: 'flex', flexDirection: 'column', gap: '.25rem' });
      doc.body.appendChild(wrapperDiv);
      return wrapperDiv;
    })();

    let thisBtn = doc.querySelector(`#${id}`) || (() => {
      let thisBtn = doc.createElement('button');
      thisBtn.innerText = buttonText;
      thisBtn.id = id;
      thisBtn.className = `${color}_button_L`;
      thisBtn.onclick = onClickHandler;
      wrapperDiv.appendChild(thisBtn);
      return thisBtn;
    })();

    if (doc.querySelector(selectorCondition)) {
      thisBtn.style.display = 'block';
    } else {
      thisBtn.style.display = 'none';
    }
  }

  function toggleStories(hideStory) {
    const styleId = 'hh_hide_story';
    let style = doc.getElementById(styleId) || doc.head.appendChild(doc.createElement('style'));

    if (!hideStory) { style.remove(); return; }

    // console.log("Hiding story")
    style.id = styleId;
    style.textContent = `
            .quest-container.quest-fullscreen #scene > div.canvas > img.picture, #scene div.canvas #background { display: none; }
        `;


  }




  function addTargetTop(iframe) {
    iframe = document.querySelector('iframe#hh_game');
    doc = iframe?.contentDocument;

    if (!doc) return; // Exit if the iframe is not found

    function updateLinks() {
      doc.querySelectorAll('a:not([target])').forEach(a => a.setAttribute('target', '_top'));
    }

    updateLinks();

    const observerForIframeContent = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          updateLinks(); // Apply to newly added nodes inside the iframe
        }
      });
    });

    observerForIframeContent.observe(doc.body, { childList: true, subtree: true });
  }

  // addTargetTop();


  function changePageTitle(selector) {
    let url = window.location.href.split('?')[0];
    let page = url.split('/').pop().replace('.html', '').replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());

    if (doc.querySelector(selector)) activePageElement = " - " + doc.querySelector(selector).textContent.trim();

    let title = page + activePageElement.replace(/\b\w/g, char => char.toUpperCase());

    if (url.includes('champions/')) title = "Champion " + title;


    document.title = title;
  }





  setInterval(() => {
    if (automation && doc.hidden && location.pathname !== '/' && !doc.querySelector('#harem_whole')) {
      location.reload();
      // window.focus();
    }
  }, 60000);



  //CUSTOM CSS
  GM_addStyle(`
/* *{color: red !important} */






#missions .missions_wrap .mission_object {
  transition: filter .5s ease;
  margin-bottom: 2px;
}

#missions .missions_wrap .mission_object .mission_image {
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
}

#missions .missions_wrap .mission_object .mission_reward {
  gap: 3px;
  width: inherit;
  height: 100%;
}



#missions .missions_wrap .mission_object .mission_reward .slot {
  margin: 0;
}



#missions .slot {
  border: 0;
}

#missions .slot.size_xs {

  width: auto;
  height: 100%;
}

#missions .slot.slot_xp {
inset 0 0 5px 0 rgba(0, 0, 0, 0.73);
  font-size: inherit;
}



#missions .slot.slot_frames, .slot.slot_energy_fight, .slot.slot_energy_quest, .slot.slot_energy_challenge, .slot.slot_energy_kiss, .slot.slot_energy_worship, .slot.slot_soft_currency, .slot.slot_hard_currency, .slot.slot_ticket, .slot.slot_contribution_points, .slot.slot_dating_tokens, .slot.slot_gems, .slot.slot_energy_reply, .slot.slot_frame, .slot.slot_empty, .slot.slot_progressions, .slot.slot_seasonal_event_card_1, .slot.slot_seasonal_event_card_2, .slot.slot_seasonal_event_card_3, .slot.slot_seasonal_event_card_4, .slot.slot_sultry_coins, .slot.slot_mythic_equipment, .slot.slot_scrolls_mythic, .slot.slot_scrolls_legendary, .slot.slot_scrolls_epic, .slot.slot_scrolls_rare, .slot.slot_scrolls_common, .slot.slot_seasonal_event_cash, .slot.slot_random_girl, .slot.slot_laby_coin, .slot.slot_rejuvenation_stone, .slot.slot_prestige_points {
  background: hsla(0, 0%, 0%, 0.5);
}

#missions .missions_wrap .mission_object .mission_image{
  height:35px;
  width:auto;
  border:none;
  transition: height .5s ease;
}


#missions .mission_object.mission_entry:hover{
  filter: brightness(1.05);

  & .mission_image{
  height:50px;
  }
}



#missions .missions_wrap .mission_object .mission_button > button[rel="finish"]{
height: 30px;
width: max-content;
  font-size: 12px;
  display:flex;
  line-height: 1;
  margin-inline: 5px;
  margin-top:2.5px;

}
#missions .missions_wrap .mission_object .mission_button > button[rel="finish"] [class*="_icn"]{
  margin-right: 0;
}

#missions .missions_wrap .mission_object .mission_button{
  display: flex;
flex-direction: column;
  gap:0;
}

#missions .missions_wrap .mission_object .mission_button > button[rel="mission_start"] {
	padding: 0 15px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;

}

#missions .missions_wrap .mission_object .mission_button > button[rel="mission_start"][disabled] {
  display: none;
}

#missions .missions_wrap .mission_object .mission_button > button[rel="finish"] > div span{
  vertical-align: top;
  vertical-align: text-top;
}

#missions .missions_wrap .mission_object .mission_button > button[rel="finish"] > div span.hard_currency_icn{
  transform: translateY(-33%);
}


em{
font-style: oblique 6deg;
}
#missions_counter{
  display: inline-flex;
  justify-content: space-between;
}
#missions #missions_counter > hr{
  display: none;
}
         .champion-lair{
            transition: opacity .5s ease, filter .5s ease;
          }

#pop .pop_thumb_progress_bar {
    margin-top: 0;
}
#ad_activities,.ad-revive-container{display:none !important;}
#harem_whole{height:initial;}
.haremdex-wrapper{position:relative}
.contest_info .flavor_text{display:none}
#harem_whole #harem_left div.girls_list{
  height:23rem !important;
}

@media (max-width: 1025px) {
  .potions-paths-background-panel {
    height: 34rem;
  }
}
  div[rel="avatar"] img.new_notif{
    display: none;
  }
#contests > div.contests-container > .right_part > .ranking .lead_table_view, #contests.height-for-ad > div.contests-container > .right_part > .ranking{
  height: 100% !important;
}
#contests > div.contests-container > .right_part > .ranking{
  padding: 1rem 0 !important;
}
#contests div.contests-container div.right_part div.info{
  padding: 1rem 0;
}
#contests div.contests-container div.right_part div.info div.over_panel{
  height: auto !important;

}

@media (max-width: 1025px) {

.league_end_in{
	background: #ffffff17;
	padding: .6rem;
	border-radius: .5rem;
	backdrop-filter: blur(5px);

}
}

div.next_contest div.contest_timer div.text{
  margin-right: 20px;
  text-align: end;
  color: whitesmoke;
  text-shadow: initial;
  filter: drop-shadow(3px 3px 1px hsla(0, 0%, 0%, 50%));
}

div.next_contest{
  position: absolute;
  margin: 0 !important;
  top: 0;
  right:0;
}

div#contests div.contests-container div.left_part div.scroll_area{
  position:relative;
  padding-top: 32px;
}


tbody.leadTable{
  transform: perspective(10000px);
  transform-style: preserve-3d;
  --translateZ: 100px;
}
tbody.leadTable tr{
  transition: 300ms;
  filter: brightness(.8);
}
tbody.leadTable tr:hover{
  filter: brightness(1);
  transform: translateZ(calc(var(--translateZ) / 10 * 10))
}
tbody.leadTable tr:hover + * {
  filter: brightness(0.9);
  transform: translateZ(calc(var(--translateZ) / 10 * 9)) rotateX(-15deg);
}
tbody.leadTable tr:has(+ *:hover) {
  filter: brightness(0.9);
  transform: translateZ(calc(var(--translateZ) / 10 * 9)) rotateX(15deg);
}

div.lead_table_view {
  overflow-x: hidden !important;
  padding-top: 10px !important;
}
#contests > div.contests-container > div.left_part > .scroll_area > .contest > .contest_header:hover {
  background-size: 110% !important;
}
#contests > div.contests-container > div.left_part > .scroll_area > .contest > .contest_header{
  background-size: 100% !important;
  transition: background-size .5s !important;
  background-position: center;
}


#daily_goals .daily-goals-container .daily-goals-left-part{
  width: 100%;
}
#daily_goals .daily-goals-container .daily-goals-left-part .daily-goals-objectives-container.height-for-ad{
  height: auto;
}



.contests-container {
  height: 100% !important;
}


#contests.height-for-ad > div.contests-container > .left_part {
  height: initial !important;
}

#contests.height-for-ad > div.contests-container > .left_part .scroll_area {
  height: 100% !important;
}
#contests.height-for-ad > div.contests-container > .right_part {
  height: initial !important;
}

div.ranking > h5:nth-child(1) {
  margin-block: 0 !important;
  margin-top: -2rem !important;
}


`)


  function getQueryParam(param) {
    let urlSearchParams;

    if (window.top !== window) {
      urlSearchParams = new URLSearchParams(window.top.location.search);
    } else {
      urlSearchParams = new URLSearchParams(window.location.search);
    }

    return urlSearchParams.get(param);
  }


  function replaceButtonWithNewFunction() {
    let clickValue = getQueryParam('click');


    let header = document.querySelector("header");
    let chatButton = document.getElementById("chat_btn");


    if (clickValue === 'chat') {
      clickLog(chatButton)



      const button = Object.assign(document.createElement('a'), { href: '/', className: 'orange_button_L', style: 'position:fixed;left:.5rem;bottom:.25rem;z-index:1000;', textContent: 'Refresh & Enable' });

      document.body.appendChild(button);



      stopForNow = true;
      return
    };

    if (!chatButton) return;
    let buttonOuterHTML = chatButton.innerHTML;
    chatButton.remove();

    let newButton = document.createElement("a");
    newButton.innerHTML = buttonOuterHTML;
    newButton.id = 'chat_btn';

    newButton.onclick = function (event) {
      window.location.href = "/?click=chat";
      return;
    };

    let logoLink = header.querySelector('a[href="/home.html"]');
    if (logoLink) logoLink.insertAdjacentElement('afterend', newButton);



  }

  replaceButtonWithNewFunction();

  if (!stopForNow) addShortcuts()



})();
