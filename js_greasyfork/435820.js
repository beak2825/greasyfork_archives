// ==UserScript==
// @name         Queslar Betterment Script
// @namespace    https://www.queslar.com
// @version      1.8.0
// @description  A script that lets you know more info about quests and other QOL improvements
// @author       RiddleMeDoo
// @match        *://*.queslar.com/*
// @require      https://code.jquery.com/jquery-3.6.3.slim.min.js
// @resource     settingsMenu https://raw.githubusercontent.com/RiddleMeDoo/qs-bettermentScript/master/tomeSettingsMenu.html
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/435820/Queslar%20Betterment%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/435820/Queslar%20Betterment%20Script.meta.js
// ==/UserScript==

class Script {
  constructor() {
    // Get quest data
    this.quest = {
      questsCompleted: 0,
      numRefreshes: 0,
      refreshesUsed: 0,
      villageBold: 0,
      villageSize: 1,
      villageNumRefreshes: 5,
      villageRefreshesUsed: 0,
      baseStat: 15,
      minActions: 360,
      maxActions: 580,
    };

    this.catacomb = {
      actionTimerSeconds: 30,
      tomesAreEquipped: true,
    }
    this.kdExploLevel = 0;
    this.playerId;
    this.gameData;
    this.gems = [];

    //observer setup
    this.initObservers();
    this.currentPath = window.location.hash.split('/').splice(2).join();

    // Other setup
    addInvisibleScrollDiv();
  }

  loadDataFromStorage() {
    /**
     * Load data stored in the localStorage of the website. Each player stores their own settings.
     */
    // ! BANDAID migration, please remove non-id settings in storage after 2024-12-01
    this.villageSettings = JSON.parse(localStorage.getItem(`${this.playerId}:QuesBS_villageSettings`));
    if (!this.villageSettings && localStorage.getItem('QuesBS_villageSettings')) {
      // Attempt migration from old settings
      this.villageSettings = JSON.parse(localStorage.getItem('QuesBS_villageSettings'));
      localStorage.setItem(`${this.playerId}:QuesBS_villageSettings`, JSON.stringify(this.villageSettings));
      localStorage.removeItem('QuesBS_villageSettings');
    } else if(!this.villageSettings) {
      this.villageSettings = {
        strActions: 30000,
        taxObjectivePercent: 0,
        resActionRatio: 999999999999,
      };
    }

    this.tomeSettings = JSON.parse(localStorage.getItem(`${this.playerId}:QuesBS_tomeSettings`));
    if (!this.tomeSettings && localStorage.getItem('QuesBS_tomeSettings')) {
      // Attempt migration from old settings
      this.tomeSettings = JSON.parse(localStorage.getItem('QuesBS_tomeSettings'));
      localStorage.setItem(`${this.playerId}:QuesBS_tomeSettings`, JSON.stringify(this.tomeSettings));
      localStorage.removeItem('QuesBS_tomeSettings');
    } else if(!this.tomeSettings) {
      this.tomeSettings = {
        goldKillTomesEquippedAmount: 0,
        useWeightSettings: false,
        weights: {},
        thresholds: {
          reward: 999900,
          mobDebuff: 999900,
          character: 999900,
          characterWb: 999900,
          elementalConv: 999900,
          multiMob: 1,
          lifesteal: 1,
          actionSpeed: 1,
          mobSkip: 1,
          numGoodRolls: 1,
          numGoodRollsWb: 2,
        },
        spaceThresholds: {
          reward: 6,
          mobDebuff: 6,
          character: 6,
          wb: 6,
          rare: 6,
          legendary: 6,
        },
        hideMods: {},
        disableRefreshOnHighlight: true,
      };
    }
    // Legacy code updates, keep for now until bugs do not occur when it gets removed
    this.tomeSettings.useWeightSettings = this.tomeSettings.useWeightSettings ?? false;
    this.tomeSettings.weights = this.tomeSettings.weights ?? {};
    this.tomeSettings.thresholds = this.tomeSettings.thresholds ?? {
      reward: this.tomeSettings.highlightReward ?? 99900,
      mobDebuff: this.tomeSettings.highlightMob ?? 99900,
      character: this.tomeSettings.highlightCharacter ?? 99900,
      characterWb: this.tomeSettings.highlightCharacterWb ?? 99900,
      elementalConv: this.tomeSettings.highlightElementalConv ?? 99900,
      multiMob: this.tomeSettings.highlightMultiMob ?? 1,
      lifesteal: this.tomeSettings.highlightLifesteal ?? 1,
      actionSpeed: this.tomeSettings.highlightActionSpeed ?? 1,
      mobSkip: this.tomeSettings.highlightMobSkip ?? 1,
      numGoodRolls: this.tomeSettings.numGoodRolls ?? 1,
      numGoodRollsWb: 2,
    }
    this.tomeSettings.spaceThresholds = this.tomeSettings.spaceThresholds ?? {
      reward: this.tomeSettings.spaceLimitReward ?? 6,
      mobDebuff: this.tomeSettings.spaceLimitMob ?? 6,
      character: this.tomeSettings.spaceLimitCharacter ?? 6,
      wb: this.tomeSettings.spaceLimitWb ?? 6,
      rare: this.tomeSettings.spaceLimitRare ?? 6,
      legendary: this.tomeSettings.spaceLimitLegendary ?? 6,
    }
    this.tomeSettings.hideMods = this.tomeSettings.hideMods ?? {};
    this.tomeSettings.disableRefreshOnHighlight = this.tomeSettings.disableRefreshOnHighlight ?? true;
  }

  async getGameData() { //ULTIMATE POWER
    let tries = 10;
    //Get a reference to *all* the data the game is using, courtesy of Blah's exposed global object
    this.gameData = playerGeneralService;
    while(this.gameData === undefined && tries > 0) { //Power comes with a price; wait for it to load
      await new Promise(resolve => setTimeout(resolve, 500))
      this.gameData = playerGeneralService;
      tries--;
    }

    if (tries <= 0) {
      console.log('QuesBS: Could not load gameData.');
    }
  }

  async updateCatacombData() {
    /***
     * Updates catacomb action timer in seconds and equipped tomes indicator 
    ***/
    // Wait until services load
    while(this.gameData?.playerCatacombService === undefined || this.gameData?.playerVillageService === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    const tomes = this.gameData.playerCatacombService.calculateTomeOverview();

    // Calculate catacomb action speed in seconds
    let actionTimerSeconds = 24;
    if (this.gameData.playerCatacombService.actionData) {
      // If a catacomb is active, it will show how many seconds it has in an action
      actionTimerSeconds = this.gameData.playerCatacombService.actionData.actionSpeed;
    } else {
      // If a catacomb is inactive, actionData is undefined. Manually calculate
      const villageService = this.gameData.playerVillageService;
      
      let villageActionSpeedBoost;
      if (villageService?.isInVillage === true) {
        const level = villageService?.buildings?.observatory?.amount ?? 0;
        villageActionSpeedBoost = (Math.floor(level / 20) * Math.floor(level / 20 + 1) / 2 * 20 + (level % 20) * Math.floor(level / 20 + 1)) / 100;
      } else {
        villageActionSpeedBoost = 0;
      }
      actionTimerSeconds = 30 / (1 + villageActionSpeedBoost + tomes.speed / 100) + 0.2
    }

    this.catacomb = {
      actionTimerSeconds: actionTimerSeconds,
      tomesAreEquipped: tomes.mobs > 0,
    }
  }

  async initPlayerData() {
    // Make sure gameData is loaded before initializing player data
    let loadingTries = 300;
    while ((!this.gameData || this.gameData.loadingService.loading) && loadingTries > 0) {
      if (!this.gameData) {
        this.getGameData();
      }
      console.log('QuesBS: Waiting for game to load...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadingTries--;
    }

    if (loadingTries <= 0) {
      console.log('QuesBS: Could not load player data. Please refresh or manually restart the script.');
      return;
    }
    //Couldn't find an easier method to get quest completions than a POST request
    this.gameData.httpClient.post('/player/load/misc', {}).subscribe(
      val => {
        this.quest.questsCompleted = val.playerMiscData.quests_completed;
        this.playerId = val.playerMiscData.player_id;
        this.loadDataFromStorage();
      },
      response => console.log('QuesBS: POST request failure', response)
    );

    await this.updateRefreshes();
    if(this.gameData.playerVillageService?.isInVillage === true) {
      let villageService = this.gameData.playerVillageService;
      //Wait for service to load
      while(villageService === undefined) {
        await new Promise(resolve => setTimeout(resolve, 200));
        villageService = this.gameData.playerVillageService;
      }
      this.quest.villageBold = villageService.strengths.bold.amount;
      this.quest.villageSize = villageService.general.members.length;
      this.quest.villageNumRefreshes = villageService.general.dailyQuestsBought + 5;
      this.quest.villageRefreshesUsed = villageService.general.dailyQuestsUsed;
    }
    //Can't be bothered to calculate it accurately using all 4 stats
    this.quest.baseStat = Math.min(15, this.gameData.playerStatsService?.strength * 0.0025);

    // Get catacomb data
    await this.updateCatacombData();

    // Get kd exploration level for wb drops
    await this.updateKdInfo();

    // Other misc player refreshing stuff
    this.gems = [];
  }

  async getPartyActions() {
    //A function to wait for party service to load
    //And also to abstract the horribly long method
    while(this.gameData?.partyService?.partyOverview?.partyInformation === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return this.gameData.partyService.partyOverview.partyInformation[this.playerId].actions.daily_actions_remaining;
  }

  async updateRefreshes() {
    //Only made a load waiter because script was having issues with not loading
    while(this.gameData?.playerQuestService?.refreshesUsed === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    this.quest.numRefreshes = this.gameData.playerQuestService.refreshesBought + 20;
    this.quest.refreshesUsed = this.gameData.playerQuestService.refreshesUsed;
  }

  async updateVillageRefreshes() {
    let villageService = this.gameData.playerVillageService;
    this.quest.villageNumRefreshes = villageService.general.dailyQuestsBought + 5;
    this.quest.villageRefreshesUsed = villageService.general.dailyQuestsUsed;
    const maxBuildingLevel = Object.values(villageService.buildings).reduce((currMax, building) => Math.max(currMax, building.amount), 0);
    const buildingCost = villageService.calculateVillageBuildingUpgradeCost(maxBuildingLevel);
    this.quest.villageMaxResCost = buildingCost[1].cost * 4 + (buildingCost?.[5]?.cost ?? 0);
  }

  async updateKdInfo() {
    /** Only stores exploration information for wb drops */
    let kdService = this.gameData.playerKingdomService;
    // Wait for game to load data
    while(kdService?.kingdomData?.explorations === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    this.kdExploLevel = kdService.kingdomData.explorations.level;
  }

  initObservers() {
    /**
     * Initialize observers which will be used to detect changes on
     * each specific page when it updates.
     */
    let scriptObject = this; //mutation can't keep track of this
    this.personalQuestObserver = new MutationObserver(mutationsList => {
      scriptObject.handlePersonalQuest(mutationsList[0]);
    });
    this.villageQuestObserver = new MutationObserver(mutationsList => {
      scriptObject.handleVillageQuest(mutationsList[0]);
    });
    this.catacombObserver = new MutationObserver(mutationsList => {
      this.handleCatacombPage(mutationsList[0]);
    });
    this.tomeObserver = new MutationObserver(mutationsList => {
      this.handleCatacombTomeStore(mutationsList[0]);
    });
    this.wbDropsObserver = new MutationObserver(mutationsList => {
      this.handleWbChestOpening(mutationsList[0]);
    });
  }


  async initPathDetection() {
    /**
     * Initializes the event trigger that will watch for changes in the
     * url path. This will allow us to determine which part of the
     * script to activate on each specific page.
     */
    let router = this.gameData?.router
    //Wait for service to load
    while(router === undefined && router?.events === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200));
      router = this.gameData.router
    }
    this.gameData.router.events.subscribe(event => {
      if(event.navigationTrigger) this.handlePathChange(event.url);
    });

    //Send a popup to player as feedback
    this.gameData.snackbarService.openSnackbar('QuesBS has been loaded.');
  }


  async insertPlayerStatRatios(petDiv) {
    /* 
     * Insert player stat ratios into the pet div by copy pasting from one of the existing
     * boxes. 
     */
    // Copy existing box to match the css style
    const statBoxElem = petDiv.children[1].children[2].cloneNode(true);

    statBoxElem.firstChild.innerText = 'Player stat ratios';
    const statsBody = statBoxElem.children[1];

    const playerStatsElem = document.querySelector('app-inventory-menu > div > div:nth-child(3)');
    const statRatios = getStatRatios(playerStatsElem);
    // Insert the stat ratios
    for (let i = 0; i < statRatios.length; i++) {
      const row = statsBody.children[i].firstChild;
      row.children[1].innerText = `${playerStatsElem.children[i].children[1].innerText}`;
      const statRatioDiv = document.createElement('div');
      statRatioDiv.innerText = `(${statRatios[i]})`;
      row.appendChild(statRatioDiv);
    }

    // Insert elem to be under the pet farm column
    petDiv.children[2].appendChild(statBoxElem);
  }


  async handlePathChange(url) {
    /**
     * Detects which page the player navigated to when the url path
     * has changed, then activates the observer for the page.
     */
    const path = url.split('/').length == 2 ? url.split('/').slice(1) : url.split('/').slice(2);
    if(path.join() !== this.currentPath) {
      this.stopObserver(this.currentPath);
    }
    this.currentPath = path.join();
    //Activate observer if on a specific page
    if(path[path.length - 1].toLowerCase() === 'quests' && path[0].toLowerCase() === 'actions') {
      //Observe personal quest page for updates
      let target = document.querySelector('app-actions');
      //Sometimes the script attempts to search for element before it loads in
      while(!target) {
        await new Promise(resolve => setTimeout(resolve, 50))
        target = document.querySelector('app-actions');
      }
      this.personalQuestObserver.observe(target, {
        childList: true, subtree: true, attributes: false,
      });
      //Sometimes there is no change observed for the initial page load, so call function
      await this.handlePersonalQuest({target: target});


    } else if(path[path.length - 1].toLowerCase() === 'quests' && path[0].toLowerCase() === 'village') {
      //Observe village quest page for updates
      let target = document.querySelector('app-village');
      //Sometimes the script attempts to search for element before it loads in
      while(!target) {
        await new Promise(resolve => setTimeout(resolve, 50))
        target = document.querySelector('app-village');
      }
      this.villageQuestObserver.observe(target, {
        childList: true, subtree: true, attributes: false,
      });
      //Sometimes there is no change observed for the initial page load, so call function
      await this.handleVillageQuest({target: target});


    } else if(path[path.length - 1].toLowerCase() === 'settings' && path[0].toLowerCase() === 'village') {
      //Insert our own settings box
      await this.insertVillageSettingsElem();

    } else if(path[path.length - 1].toLowerCase() === 'catacomb' && path[0].toLowerCase() === 'catacombs') {
      this.updateCatacombData();

      let target = document.querySelector('app-catacomb-main')?.firstChild;
      while(!target) {
        await new Promise(resolve => setTimeout(resolve, 200))
        target = document.querySelector('app-catacomb-main').firstChild;
      }

      if (target.nodeName === '#comment') { // Active catacomb page
        // Only listen for change in active/inactive state
        this.catacombObserver.observe(target.parentElement, {
          childList: true, subtree: false, attributes: false,
        });
        this.handleCatacombPage({target: target});

      } else {
        this.catacombObserver.observe(target, {
          childList: true, subtree: true, attributes: false,
        });
      }

    } else if (path[path.length - 1].toLowerCase() === 'tome_store' && path[0].toLowerCase() === 'catacombs') {
      await this.modifyTomeStorePage();

      let target = $('app-catacomb-tome-store > div > div > div.base-scrollbar > div');
      while(target.length < 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
        target = $('app-catacomb-tome-store > div > div > div.base-scrollbar > div');
      }

      this.tomeObserver.observe(target[0], {
        childList: true, subtree: false, attributes: false
      });
      this.handleCatacombTomeStore({target: target[0]});

    } else if (path[path.length - 1].toLowerCase() === 'chests' && path[0].toLowerCase() === 'wb') {
      let target = $('app-game-world-boss-chests > div');
      while(target.length < 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
        target = $('app-game-world-boss-chests > div');
      }
      this.wbDropsObserver.observe(target[0], {
        childList: true, subtree: false, attributes: false
      });
    } else if (path[path.length - 1].toLowerCase() === 'pets' && path[0].toLowerCase() === 'actions') {
      let target = $('app-actions-pets > .scrollbar > div > .d-flex');
      while(target.length < 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
        target = $('app-actions-pets > .scrollbar > div > .d-flex');
      }
      // Insert stat ratios on the pets page
      await this.insertPlayerStatRatios(target[0]);
    } else if (path[path.length - 1].toLowerCase() === 'gems' && path[0].toLowerCase() === 'inventory') {
      await this.insertFuseFrenzyButton();
    }
  }


  async handlePersonalQuest(mutation) {
    /**
     * Handles a new update to the personal quests page. It loads in all
     * the extra quest information, which differs depending on an active or
     * non-active quest page view.
     */
    //Filter out any unneeded mutations/updates to the page
    if(mutation?.addedNodes?.length < 1 ||
      mutation?.addedNodes?.[0]?.localName === 'mat-tooltip-component' ||
      mutation?.addedNodes?.[0]?.nodeName === 'TH' ||
      mutation?.addedNodes?.[0]?.nodeName === 'TD' ||
      mutation?.addedNodes?.[0]?.nodeName === '#text' ||
      mutation?.addedNodes?.[0]?.className === 'mat-ripple-element' ||
      mutation?.addedNodes?.[0]?.id === 'questInfoRow') {
      return;
    }
    //Modify the table used to hold quest information
    const questTable = mutation.target.parentElement.tagName === 'TABLE' ? mutation.target.parentElement : mutation.target.querySelector('table');

    if(questTable) {
      let infoRow = null;

      //Add end time column to table
      this.addEndTimeColumn(questTable);

      const tableBody = questTable.children[1];

      //There are two states: active quest and no quest
      if(tableBody.children.length > 2) {//No quest
        //Get the info row that goes at the bottom
        infoRow = await this.modifyQuestInfo(tableBody, false, false);

      } else if(tableBody.children.length > 0) { //Active quest
        //Update number of refreshes used, just in case
        await this.updateRefreshes();
        infoRow = await this.modifyQuestInfo(tableBody, false, true);

      } else {
        return;
      }

      //Add an extra row for extra quest info if there isn't one already
      if(!document.getElementById('questInfoRow')) tableBody.appendChild(infoRow);
    }
  }


  async handleVillageQuest(mutation) {
    /**
     * Handles a new update to the village quests page. It loads in all
     * the extra quest information, which differs depending on an active or
     * non-active quest page view.
     */
    //Filter out unneeded mutations/updates to page
    if(mutation?.addedNodes?.length < 1 ||
      mutation?.addedNodes?.[0]?.nodeName === '#text' ||
      mutation?.addedNodes?.[0]?.nodeName === 'TH' ||
      mutation?.addedNodes?.[0]?.nodeName === 'TD' ||
      mutation?.addedNodes?.[0]?.className === 'mat-ripple-element' ||
      mutation?.addedNodes?.[0]?.id === 'questInfoRow') {
      return;
    }
    const questTable = mutation.target.parentElement.tagName === 'TABLE' ? mutation.target.parentElement : mutation.target.querySelector('table');

    if(questTable) {
      await this.updateVillageRefreshes(); //Update for refreshes used
      this.addEndTimeColumn(questTable);

      //Add end time
      const tableBody = questTable.children[1];

      //Add end time elems to the end time column
      if(tableBody.children.length > 2) { //Quest is not active
        await this.modifyQuestInfo(tableBody, true, false);
      } else { //Quest is active
        await this.modifyQuestInfo(tableBody, true, true);
      }

      //Add info text at the bottom of quest table
      const infoRow = document.createTextNode('End time is calculated assuming all members are active. The time is approximate and may not be accurate.'
        + `${this.quest.villageRefreshesUsed}/${this.quest.villageNumRefreshes} refreshes used.`);
      infoRow.id = 'questExplanation';
      if(questTable.parentElement.lastChild.id !== 'questExplanation') {
        questTable.parentElement.appendChild(infoRow);
      }
    }
  }

  async handleCatacombPage(mutation) {
    /**
     * Handle an update on the catacomb page, and insert an end time into the page
     * for any selected catacomb.
    **/
    if ( // skip unnecessary updates
      mutation?.addedNodes?.[0]?.localName === 'mat-tooltip-component' ||
      mutation?.addedNodes?.[0]?.className === 'mat-ripple-element' ||
      mutation?.addedNodes?.[0]?.nodeName === '#text' ||
      mutation?.addedNodes?.[0]?.id === 'catacombEndTime'
    ) {
      return;
    }
    const mainView = document.querySelector('app-catacomb-main');

    //Check if active or inactive view
    if (mainView.firstChild.nodeName === '#comment') { // Active view
      const parentElement = mainView.firstElementChild.firstChild.firstChild.firstChild;
      const secondsLeft = parseNumber(parentElement.children[1].innerText);
      // Use api data
      const totalMobs = this.gameData.playerCatacombService.actionData.catacombStats.mobCount;
      const mobsKilled = this.gameData.playerCatacombService.actionData.catacombStats.killCount;


      // Create the end time ele to insert into
      const endTimeEle = document.getElementById('catacombEndTime') ?? document.createElement('div');
      endTimeEle.id = 'catacombEndTime';
      endTimeEle.setAttribute('class', 'h5');
      endTimeEle.innerText = `| End time: ${getCatacombEndTime(totalMobs - mobsKilled, this.catacomb.actionTimerSeconds, secondsLeft)}`;

      parentElement.appendChild(endTimeEle);

    } else { // Inactive view
      const mobOverviewEle = mainView.firstChild.children[1].firstChild.firstChild;
      const totalMobs = parseNumber(mobOverviewEle.firstChild.children[1].firstChild.children[11].children[1].innerText);
      const cataTierSelectionEle = mobOverviewEle.children[1];

      // Create the end time ele to insert into
      const endTimeEle = document.getElementById('catacombEndTime') ?? document.createElement('div');
      endTimeEle.id = 'catacombEndTime';
      endTimeEle.innerText = `End time (local): ${getCatacombEndTime(totalMobs, this.catacomb.actionTimerSeconds)}`;
      cataTierSelectionEle.appendChild(endTimeEle);

      // Create tooltips for gold/hr and emblems/hr
      const goldEle = mobOverviewEle.firstChild.children[1].firstChild.children[9].children[1];
      const boostedGoldPerKill = parseNumber(goldEle.innerText);
      const goldHr = boostedGoldPerKill / this.catacomb.actionTimerSeconds * 3600;
      goldEle.parentElement.setAttribute('title', `${goldHr.toLocaleString(undefined, {maximumFractionDigits:2})}/Hr`);

      const emblemsEle = mobOverviewEle.firstChild.children[1].firstChild.children[10].children[1];
      const emblemsHr = parseNumber(emblemsEle.innerText) / totalMobs / this.catacomb.actionTimerSeconds * 3600;
      emblemsEle.parentElement.setAttribute('title', `${emblemsHr.toLocaleString(undefined, {maximumFractionDigits:2})}/Hr`);

      // Highlight start button if tomes are equipped
      const goldPerKillEle = mutation.target.parentElement.parentElement?.previousSibling?.children?.[9]?.firstElementChild;
      if (!goldPerKillEle) return; // Early return if element cannot be found, since mutations can come from anything
      const baseGoldPerKill = parseNumber(goldPerKillEle.innerText);
      const startCataButton = mobOverviewEle.nextSibling.firstChild;
      if (this.catacomb.tomesAreEquipped && baseGoldPerKill < this.tomeSettings.goldKillTomesEquippedAmount) {
        startCataButton.style.boxShadow = '0px 0px 12px 7px red';
        startCataButton.style.color = 'red';
      } else {
        startCataButton.style.boxShadow = 'none';
        startCataButton.style.color = '';
      }
    }
  }

  async handleCatacombTomeStore(mutation) {
    /**
     * Add highlights around tomes with good boosts and obscures bad tomes
     * Credit to Ender for code collaboration and fading out tomes
     *
    **/
    if ( // skip unnecessary updates
      mutation?.addedNodes?.[0]?.localName === 'mat-tooltip-component' ||
      mutation?.addedNodes?.[0]?.className === 'mat-ripple-element' ||
      mutation?.addedNodes?.[0]?.nodeName === '#text' ||
      mutation?.addedNodes?.[0]?.id === 'highlight'
    ) {
      return;
    }
    // Get store element and tome store data
    const tomeElements = $('app-catacomb-tome-store > div > div > div.base-scrollbar > div > div');
    let tomes = this.gameData.playerCatacombService?.tomeStore;
    while (this.gameData.playerCatacombService === undefined || tomes === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200))
      tomes = this.gameData.playerCatacombService?.tomeStore;
    }
    // Put an id on the first tome of the store to mark it as "processed"
    tomeElements[0].id = 'highlight';
    // Get the refresh button for disabling it
    const refreshButton = $('app-catacomb-tome-store > div > div > div.my-auto > div > button')[0]; 
    refreshButton.style.touchAction = 'manipulation'; // Disable double tap zoom for mobile when tapping the button

    // For each tome (loop by index), check if tome has good modifiers.
    for (let i = 0; i < tomes.length; i++) {
      const tomeMods = tomes[i];
      const tomeElement = tomeElements[i].firstChild;

      let shouldFadeTome = true;
      let highlightIncome = false;

      if (this.tomeSettings?.useWeightSettings) {
        // Create row after tome mods to display the power per space values
        const displayEle = tomeElement.querySelector(`#perspacedisplay-${tomeMods.id}`) ?? document.createElement('div');
        displayEle.id = `perspacedisplay-${tomeMods.id}`;
        displayEle.className = 'd-flex justify-content-between ng-star-inserted';
        tomeElement.appendChild(displayEle, tomeElement.nextSibling.firstChild);

        if (this.checkTomeIncomePower(tomeMods, displayEle)) { // Displays income power as well
          shouldFadeTome = false;
          highlightIncome = true;
        } 
        if (this.checkTomeWBPower(tomeMods, displayEle)) { // Displays wb power as well
          shouldFadeTome = false;
        }
      } else {
        if (this.checkTomeIncomeMeetsThresholds(tomeMods, tomeElement)) {
          shouldFadeTome = false;
          highlightIncome = true;
        } 
        if (this.checkTomeWBMeetsThresholds(tomeMods, tomeElement)) {
          shouldFadeTome = false;
        }
      }

      // Fade out tomes that didn't meet requirements
      if (shouldFadeTome) {
        tomeElement.style.color = "rgba(255, 255, 255, 0.4)";
        [...tomeElement.children].forEach((child) => {
           child.style.opacity = "0.4";
        });
      } else {
        if (this.tomeSettings.disableRefreshOnHighlight) {
          // Briefly disable the refresh button
          refreshButton.disabled = true;
          refreshButton.className = 'mat-focus-indicator mat-stroked-button mat-button-base';
          document.querySelector('#stopScrollDiv').focus({preventScroll: true}); // Prevent spacebar from scrolling down
          setTimeout((button) => {
            button.disabled = false;
            button.className = 'mat-focus-indicator mat-raised-button mat-button-base';
            button.focus({preventScroll: true});
          }, 1600, refreshButton);
        }
          
        if (highlightIncome) {
          tomeElement.parentElement.style.boxShadow = '0 0 30px 15px #48abe0';
        } else {
          tomeElement.parentElement.style.boxShadow = '0 0 30px 15px green';
        }
      }

      // Hide modifiers on tomes according to the settings
      const modifierOrder = [
        'tomeName', 'spaceReq', 'addedMobs', 'reward', 'mobDebuff', 'character', 'waterResistance', 
        'thunderResistance', 'fireResistance', 'meleeResistance', 'rangedResistance', 'elementalConversion', 
        'fortifyReduction'
      ];
      for (let i = 2; i < tomeElement.children.length; i++) {
        const modifierEle = tomeElement.children[i];
        if (this.tomeSettings.hideMods[modifierOrder[i]]) {
          modifierEle.style.setProperty('display', 'none', 'important');
        } else {
          modifierEle.style.display = '';
        }
      }
    }
  }

  checkTomeIncomePower(tomeMods, powerDisplayEle) {
    /**
     * Returns true if the tomeMods are weighted and meet the thresholds according to the tome settings for income.
     * It also displays the income power on the tome using the powerDisplayEle elememt
     */
    let incomePerSpace = 0;
    incomePerSpace += (tomeMods.multi_mob ?? 0) / 100 * (this.tomeSettings.weights.multiMob ?? 0);
    incomePerSpace += (tomeMods.character_multiplier ?? 0) / 100 * (this.tomeSettings.weights.character ?? 0);
    incomePerSpace += (tomeMods.speed ?? 0) / 100 * (this.tomeSettings.weights.actionSpeed ?? 0);
    incomePerSpace += (tomeMods.skip ?? 0) / 100 * (this.tomeSettings.weights.mobSkip ?? 0);
    incomePerSpace += (tomeMods.lifesteal ?? 0) / 100 * (this.tomeSettings.weights.lifesteal ?? 0);
    incomePerSpace += (tomeMods.reward_multiplier ?? 0) / 100 * (this.tomeSettings.weights.reward ?? 0);
    incomePerSpace += (tomeMods.mob_multiplier ?? 0) / 100 * (this.tomeSettings.weights.mobDebuff ?? 0);
    incomePerSpace /= tomeMods.space_requirement;

    // Display the income power per space in the powerDisplayEle
    const incomePerSpaceEle = powerDisplayEle.querySelector(`#incomeperspace-${tomeMods.id}`) ?? document.createElement('div');
    incomePerSpaceEle.id = `incomeperspace-${tomeMods.id}`;
    incomePerSpaceEle.innerText = `Income: ${Math.round(incomePerSpace).toLocaleString()}`;
    powerDisplayEle.appendChild(incomePerSpaceEle);

    // Check 
    if (incomePerSpace >= this.tomeSettings.weights.incomePerSpaceThreshold) {
      incomePerSpaceEle.style.color = 'gold';
      return true;
    }
    return false;
  }

  checkTomeWBPower(tomeMods, powerDisplayEle) {
    /**
     * Returns true if the tomeMods are weighted and meet the thresholds according to the tome settings for world boss.
     * It also displays the WB power on the tome using the powerDisplayEle elememt
     */
    let wbPowerPerSpace = (tomeMods.character_multiplier ?? 0) / 100.0 * (this.tomeSettings.weights.wbCharacter ?? 0);
    wbPowerPerSpace += (tomeMods.elemental_conversion ?? 0) / 100.0 * (this.tomeSettings.weights.wbElementalConv ?? 0);
    wbPowerPerSpace /= tomeMods.space_requirement;

    // Display the WB power per space in the powerDisplayEle
    const wbPowerPerSpaceEle = powerDisplayEle.querySelector(`#wbpowerperspace-${tomeMods.id}`) ?? document.createElement('div');
    wbPowerPerSpaceEle.id = `wbpowerperspace-${tomeMods.id}`;
    wbPowerPerSpaceEle.innerText = `WB: ${Math.round(wbPowerPerSpace).toLocaleString()}`;
    powerDisplayEle.appendChild(wbPowerPerSpaceEle);

    if (wbPowerPerSpace >= this.tomeSettings.weights.wbPowerPerSpaceThreshold) {
      wbPowerPerSpaceEle.style.color = 'forestgreen';
      return true;
    }
    return false;
  }

  checkTomeIncomeMeetsThresholds(tomeMods, tomeElement) {
    /**
    * Returns true if given tomes meets thresholds accored to the stored tome settings for income
    * Also highlight the tomeElement if threshold is met 
    */
    let sumGoodRolls = 0;
    // Check each important mods: reward, character, mob, lifesteal, multi mob, action speed, mob skip
    // For each mod, if it meets the settings highlight the mod and increment the number of rolls
    if (
      this.tomeSettings.thresholds.reward > 0
      && tomeMods.reward_multiplier >= this.tomeSettings.thresholds.reward 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.reward
    ) {
      const isDouble = tomeMods.reward_multiplier >= this.tomeSettings.thresholds.reward * 2;
      tomeElement.children[3].style.border = `${isDouble ? 'thick' : '2px'} solid`;
      tomeElement.children[3].style.borderColor = tomeElement.children[3].firstChild.style.color ?? 'gold';
      
      sumGoodRolls += Math.floor(tomeMods.reward_multiplier / this.tomeSettings.thresholds.reward);
    }
    if (
      this.tomeSettings.thresholds.mobDebuff > 0
      && tomeMods.mob_multiplier >= this.tomeSettings.thresholds.mobDebuff 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.mobDebuff
    ) {
      const isDouble = tomeMods.mob_multiplier >= this.tomeSettings.thresholds.mobDebuff * 2;
      tomeElement.children[4].style.border = `${isDouble ? 'thick' : '2px'} solid`;
      tomeElement.children[4].style.borderColor = tomeElement.children[4].firstChild.style.color ?? 'white';
      
      sumGoodRolls += Math.floor(tomeMods.mob_multiplier / this.tomeSettings.thresholds.mobDebuff);
    }
    if (
      this.tomeSettings.thresholds.character > 0
      && tomeMods.character_multiplier >= this.tomeSettings.thresholds.character 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.character
    ) {
      const isDouble = tomeMods.character_multiplier >= this.tomeSettings.thresholds.character * 2;
      tomeElement.children[5].style.border = `${isDouble ? 'thick' : '2px'} solid`;
      tomeElement.children[5].style.borderColor = tomeElement.children[5].firstChild.style.color ?? 'white';

      sumGoodRolls += Math.floor(tomeMods.character_multiplier / this.tomeSettings.thresholds.character);
    }
    if (
      this.tomeSettings.thresholds.lifesteal > 0
      && tomeMods.lifesteal >= this.tomeSettings.thresholds.lifesteal 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.rare
    ) {
      sumGoodRolls += Math.floor(tomeMods.lifesteal / this.tomeSettings.thresholds.lifesteal);
    }
    if (
      this.tomeSettings.thresholds.multiMob > 0
      && tomeMods.multi_mob >= this.tomeSettings.thresholds.multiMob 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.rare
    ) {
      sumGoodRolls += Math.floor(tomeMods.multi_mob / this.tomeSettings.thresholds.multiMob);
    }
    if (
      this.tomeSettings.thresholds.actionSpeed > 0
      && tomeMods.speed >= this.tomeSettings.thresholds.actionSpeed 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.legendary
    ) {
      sumGoodRolls += Math.floor(tomeMods.speed / this.tomeSettings.thresholds.actionSpeed);
    }
    if (
      this.tomeSettings.thresholds.mobSkip > 0
      && tomeMods.skip >= this.tomeSettings.thresholds.mobSkip 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.legendary
    ) {
      sumGoodRolls += Math.floor(tomeMods.skip / this.tomeSettings.thresholds.mobSkip);
    }

    return sumGoodRolls >= this.tomeSettings.thresholds.numGoodRolls;
  }

  checkTomeWBMeetsThresholds(tomeMods, tomeElement) {
    /**
    * Returns true if given tomes meets thresholds accored to the stored tome settings for world boss
    * Also highlight the tomeElement if threshold is met 
    */ 
    let sumRolls = 0;

    if (
      this.tomeSettings.thresholds.elementalConv > 0
      && tomeMods.elemental_conversion >= this.tomeSettings.thresholds.elementalConv
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.wb
    ) {
      const isDoubleElemental = tomeMods.elemental_conversion >= this.tomeSettings.thresholds.elementalConv * 2;
      sumRolls += Math.floor(tomeMods.elemental_conversion / this.tomeSettings.thresholds.elementalConv);
      tomeElement.children[11].style.border = `${isDoubleElemental ? 'thick' : '1px'} solid`;
      tomeElement.children[11].style.borderColor = 'forestgreen';
    } 

    if (
      this.tomeSettings.thresholds.characterWb > 0
      && tomeMods.character_multiplier >= this.tomeSettings.thresholds.characterWb 
      && tomeMods.space_requirement <= this.tomeSettings.spaceThresholds.wb
    ) {
      const isDoubleCharacter = tomeMods.character_multiplier >= this.tomeSettings.thresholds.characterWb * 2;
      sumRolls += Math.floor(tomeMods.character_multiplier / this.tomeSettings.thresholds.characterWb);
      tomeElement.children[5].style.border = `${isDoubleCharacter ? 'thick' : '1px'} solid`;
      tomeElement.children[5].style.borderColor = 'forestgreen';
    }

    return sumRolls >= this.tomeSettings.thresholds.numGoodRollsWb;
  }

  async handleWbChestOpening(mutation) {
    /**
     * Highlight drops that are desirable
     * - Gems over the kd level
     * - Descriptions with max depth 31+
     * - Equipment with depth 31+
    **/
    // Check if first time opening chests on page
    if (mutation?.addedNodes?.[0]?.innerText && mutation.addedNodes[0].innerText.startsWith('After')) {
      // Change observer to listen to subsequent chest openings
      let target = document.querySelector('app-game-world-boss-chest-drops');
      this.wbDropsObserver.disconnect();
      this.wbDropsObserver.observe(target, {
        childList: true, subtree: false, attributes: false
      });
    }


    // Get list of drops
    const dropsCategories = document.querySelector('app-game-world-boss-chest-drops').children;
    for (const category of dropsCategories) {
      const text = category.innerText.split(' ');
      const dropType = text[text.length - 1].toLowerCase();
      if (dropType === 'gem' || dropType === 'description' || dropType === 'item') {
        // They are grouped together in an inner list, so extract the inner list
        const dropList = category.firstElementChild.children;

        for (const drop of dropList) {
          const text = drop.innerText.split(' ');
          // Additional filters
          if (dropType === 'gem' && parseNumber(text[1]) < this.kdExploLevel) {
            // Gem has to be higher level than kd exploration level
            continue;
          } else if (dropType === 'description' && parseNumber(text[1].split('-')[1]) <= 30) {
            // Description has to be max depth 31+
            continue;
          } else if (dropType === 'item' && parseNumber(text[1]) < 31) {
            // Fighter item must be depth 31+
            continue;
          }
          // Highlight the element
          drop.style.backgroundColor = 'darkblue';
        }
      }
    }
  }

  stopObserver(pathname) {
    const stop = {
      'actions,quests': () => this.personalQuestObserver.disconnect(),
      'village,quests': () => this.villageQuestObserver.disconnect(),
      'catacombs,catacomb': () => this.catacombObserver.disconnect(),
      'catacombs,tome_store': () => this.tomeObserver.disconnect(),
      'wb,chests': () => this.wbDropsObserver.disconnect(),
      'portal': () => { setTimeout(this.initPlayerData.bind(this), 2000)},
      'inventory,gems': () => { this.gems = [] },
    }
    if(stop[pathname]) {
      stop[pathname]();
    }
  }

  getStatReward() {
    /**
     * Returns the possible max and min values for stat quests
     */
    return {
      max: Math.round((this.quest.questsCompleted/300+this.quest.baseStat+22.75)*(1+this.quest.villageBold*2/100)*1.09),
      min: Math.round((this.quest.questsCompleted/300+this.quest.baseStat+8.5)*(1+this.quest.villageBold*2/100)*1.09),
    }
  }

  async getQuestInfoElem(actionsNeeded) {
    /**
     * Returns the info row used for active personal quest page
     */
    const partyActions = await this.getPartyActions();
    let row = document.createElement('tr');

    const date = new Date();
    //actionsNeeded * 6000 = actions * 6 sec per action * 1000 milliseconds
    const finishPartyTime = new Date(date.getTime() + (actionsNeeded + partyActions) * 6000).toLocaleTimeString('en-GB').match(/\d\d:\d\d/)[0];
    const info = ['',`${this.quest.refreshesUsed}/${this.quest.numRefreshes} refreshes used`, '',
      actionsNeeded >= 0 ? `End time (local time) with ${partyActions} party actions: ${finishPartyTime}`: ''];
    let htmlInfo = '';
    for (let text of info) {
      htmlInfo += `<td>${text}</td>`
    }
    row.innerHTML = htmlInfo;
    row.id = 'questInfoRow';
    return row;
  }

  getTimeElem(actionsNeeded, className, isVillage=true) {
    /**
     * Returns an element used to describe the end time for each quest, used for
     * the end time column. It has styled CSS through the className, and the
     * time calculation differs for village vs personal. If there are an
     * invalid number of actionsNeeded, the time is N/A.
     */
    const cell = document.createElement('td');

    if(actionsNeeded > 0) {
      const date = new Date();
      const numPeople = isVillage ? this.quest.villageSize : 1;
      //actionsNeeded * 6 sec per action * 1000 milliseconds / numPeople
      const finishTime = new Date(date.getTime() + actionsNeeded * 6000 / numPeople).toLocaleTimeString('en-GB').match(/\d\d:\d\d/)[0];
      cell.innerText = finishTime;
    } else {
      cell.innerText = 'N/A';
    }
    cell.setAttribute('class', className);
    return cell;
  }

  getQuestRatioInfo() {
    //Return info row used for inactive personal quests
    let row = document.createElement('tr');
    const stat = this.getStatReward();
    const avg = (stat.max/this.quest.minActions + stat.min/this.quest.maxActions) / 2;
    const info = ['Possible stat ratios, considering quests completed & village bold:',
    `Worst ratio: ${(stat.min/this.quest.maxActions).toFixed(3)}`,
    `Avg ratio: ${(avg).toFixed(3)}`,
    `Best Ratio: ${(stat.max/this.quest.minActions).toFixed(3)}`,
      ''
    ];
    let htmlInfo = '';
    for (let text of info) {
      htmlInfo += `<td>${text}</td>`
    }
    row.innerHTML = htmlInfo;
    row.setAttribute('class', 'mat-row cdk-row ng-star-inserted');
    row.id = 'questInfoRow';
    return row;
  }

  addEndTimeColumn(tableElem) {
    //Given a table element, add a new column for end time and add times to each row
    if(tableElem === undefined) return;

    //Add header title for the column
    if(tableElem?.firstChild?.firstChild?.nodeType !== 8 &&
      (tableElem.firstChild.firstChild.children?.[3]?.id !== 'endTimeHeader' //Inactive vs active quest
      && tableElem.firstChild.firstChild.children?.[4]?.id !== 'endTimeHeader')) {
      const header = document.createElement('th');
      header.innerText = 'End Time (local time)';
      header.id = 'endTimeHeader';
      header.setAttribute('class', tableElem.firstChild.firstChild?.firstChild?.className ?? 'mat-header-cell cdk-header-cell cdk-column-current mat-column-current ng-star-inserted');
      tableElem.firstChild.firstChild.appendChild(header);
    }
  }

  async modifyQuestInfo(tableBody, isVillage, isActiveQuest) {
    /* Returns info row because I suck at structure
    ** Also inserts the end time for each quest
    */
    //First, determine if quest is active
    if(isActiveQuest && tableBody.children[0]) {
      //If it is, parse the text directly to get the end time
      const row = tableBody.children[0];
      const objectiveElemText = row?.children[1].innerText.split(' ');
      let timeElem;
      if(objectiveElemText[3].toLowerCase() === 'actions' || objectiveElemText[3].toLowerCase() === 'survived') {
        const actionsDone = parseNumber(objectiveElemText[0]);
        const objective = parseNumber(objectiveElemText[2]);
        const reward = row.children[2].innerText.split(' ');
        let actionsNeeded = -1;

        //Special case: Party action quest (because it has 7 sec timer)
        if(row.children[2].innerText.split(' ')[1].toLowerCase() === 'party') {
          actionsNeeded = (objective - actionsDone) * 7 / 6;
        } else {
          actionsNeeded = objective - actionsDone;
        }
        timeElem = this.getTimeElem(actionsNeeded, row.firstChild.className, isVillage);
        row.appendChild(timeElem);

        //Add ratios
        if(reward[1].toLowerCase() === 'gold') {
          const ratio = Math.round(parseInt(reward[0]) / objective * 600).toLocaleString();
          row.children[2].innerText = `${row.children[2].innerText} (${ratio} gold/hr)`;
        } else if(!isVillage) {
          const ratio = (parseInt(reward[0]) / objective).toFixed(3);
          row.children[2].innerText = `${row.children[2].innerText} (${ratio})`;
        }

        return await this.getQuestInfoElem(actionsNeeded);

      } else if(objectiveElemText[3].toLowerCase() === 'base') { //Special case: Exp reward quest
        const goldCollected = parseNumber(objectiveElemText[0]);
        const objective = parseNumber(objectiveElemText[2]);
        const currentMonster = this.gameData.playerActionService.selectedMonster;
        const baseGoldPerAction = 8 + 2 * currentMonster;
        const actionsNeeded = Math.ceil((objective - goldCollected) / baseGoldPerAction);
        // Insert end time
        timeElem = this.getTimeElem(actionsNeeded, row.firstChild.className, isVillage);
        row.appendChild(timeElem);
        
        //Add ratio
        const expNeeded = this.gameData.playerLevelsService.battling.exp.needed;
        const reward = parseNumber(row.children[2].innerText.split(' ')[0].replace(/,/g, '')) / 100;
        const ratio = Math.round((expNeeded * reward) / (objective / baseGoldPerAction)).toLocaleString();
        row.children[2].innerText = `${row.children[2].innerText} (${ratio} exp/action)`;

        // Replace exp requirement with action requirement
        const actionsDone = Math.floor(goldCollected / baseGoldPerAction).toLocaleString();
        const actionsLeft = Math.ceil(objective / baseGoldPerAction).toLocaleString();
        row.children[1].innerText = `${actionsDone} / ${actionsLeft} actions (does not update)`;

        return await this.getQuestInfoElem(actionsNeeded);

      } else {
        timeElem = this.getTimeElem(-1, row.firstChild.className, isVillage);
        row.appendChild(timeElem);
        return await this.getQuestInfoElem(-1);
      }


    } else if(isVillage && tableBody.children[0]) {
      const refreshButton = $('app-village-quests > div > div > div.mt-3 > button')[0];
      refreshButton.style.touchAction = 'manipulation'; // Disable double tap zoom for mobile when tapping the button

      //Get village quests
      for(let i = 0; i < tableBody.children.length; i++) {
        let row = tableBody.children[i];

        const objectiveText = row.children[1].innerText.split(' ');
        let timeElem = null;
        let meetsHighlightReq = false;

        if(objectiveText[1] === 'actions') {
          //Add border if there's a str point reward or it meets the minResAction threshold
          const rewardText = row.children[2].innerText.split(' ');
          const reward = rewardText[1];
          if(reward === 'strength' && parseNumber(objectiveText[0]) <= this.villageSettings.strActions) {
            meetsHighlightReq = true;
          } else if (parseNumber(rewardText[0]) / parseNumber(objectiveText[0]) >= this.villageSettings.resActionRatio) {  
            // res reward ratio meets threshold setting
            meetsHighlightReq = true;
          }
          if (meetsHighlightReq) {
            row.children[2].style.border = 'inset';
            if (this.tomeSettings.disableRefreshOnHighlight) {
              refreshButton.disabled = true;
              refreshButton.className = 'mat-focus-indicator mr-2 mat-stroked-button mat-button-base';
              document.querySelector('#stopScrollDiv').focus({preventScroll: true}); // Prevent spacebar from scrolling down
              setTimeout((button) => {
                button.disabled = false;
                button.className = 'mat-focus-indicator mr-2 mat-raised-button mat-button-base';
                button.focus({preventScroll: true});
              }, 1200, refreshButton);
            }
          }

          //Insert end time
          const objective = parseNumber(objectiveText[0]);
          timeElem = this.getTimeElem(objective, row.firstChild.className, true);
        } else {
          timeElem = this.getTimeElem(-1, row.firstChild.className, true);
        }
        row.appendChild(timeElem);
      }
      return;


    } else if(tableBody.children[0]) { //personal not active quests
      const availableQuests = this.gameData.playerQuestService.questArray;

      //Go through each quest and update row accordingly
      for(let i = 0; i < availableQuests.length; i++) {
        const row = tableBody.children[i];
        let actionsNeeded = -1;

        if(availableQuests[i].type === 'swordsman' || availableQuests[i].type === 'tax' ||
          availableQuests[i].type === 'gems' || availableQuests[i].type === 'spell') {
          //Above are the quests that require actions to be done
          actionsNeeded = parseNumber(availableQuests[i].objective.split(' ')[0]);

        } else if(availableQuests[i].type === 'treasure') {
          actionsNeeded = parseNumber(availableQuests[i].objective.split(' ')[0]);
          //Insert a gold ratio
          const reward = parseNumber(availableQuests[i].reward.split(' ')[0]);
          const ratio = Math.round(reward / actionsNeeded * 600).toLocaleString();
          row.children[1].innerText = `${row.children[1].innerText} (${ratio} gold/hr)`;

        } else if(availableQuests[i].type === 'slow') {
          //Convert 7 second actions to 6 second actions
          actionsNeeded = parseNumber(availableQuests[i].objective.split(' ')[0]) * 7 / 6;

        } else if(availableQuests[i].type === 'friend') { //Base gold objective
          const goldObjective = parseNumber(availableQuests[i].objective.split(' ')[0]);
          const currentMonster = this.gameData.playerActionService.selectedMonster;
          actionsNeeded = Math.ceil(goldObjective / (8 + 2 * currentMonster));
          //Insert a exp ratio
          const reward = parseNumber(row.children[1].innerText.split(' ')[0]);
          const ratio = Math.round(reward / actionsNeeded).toLocaleString();
          row.children[1].innerText = `${row.children[1].innerText} (${ratio} exp/action)`;
          // Convert gold requirement to action requirement
          row.children[0].innerText = `${actionsNeeded.toLocaleString()} actions`;
        }
        if(row.id !== 'questInfoRow'){
          const timeElem = this.getTimeElem(actionsNeeded, row.firstChild.className, false);
          row.appendChild(timeElem);
        }
      }
      return this.getQuestRatioInfo(); //The bottom row that contains extra info
    }
  }

  async insertVillageSettingsElem() {
    /**
     * Inserts a custom settings box into the village settings page
     */
    //Get settings page contents
    let settingsOverview = document.querySelector('app-village-settings');
    while(!settingsOverview) {
      await new Promise(resolve => setTimeout(resolve, 50));
      settingsOverview = document.querySelector('app-village-settings');
    }

    //Clone a copy of the armory settings to match the css style
    const questSettings = settingsOverview.firstChild.children[1].cloneNode(true);
    questSettings.style.width = '35%';
    questSettings.style.maxWidth = '';
    //Modify to our liking
    questSettings.firstChild.children[3].remove();
    questSettings.firstChild.children[2].remove();
    questSettings.firstChild.firstChild.innerText = 'QuesBS Highlight Quest';
    questSettings.firstChild.children[1].firstChild.innerText = 'Max actions for strength point';
    questSettings.firstChild.children[1].children[1].id = 'actionsLimitSetting';
    questSettings.firstChild.children[1].children[1].style.width = '50%';
    questSettings.firstChild.children[1].children[1].firstChild.value = this.villageSettings.strActions;
    questSettings.firstChild.children[1].children[1].firstChild.style.width = '6em';
    // Clone for extra rows
    const resActionSetting = questSettings.firstChild.children[1].cloneNode(true);
    resActionSetting.firstChild.innerText = 'Min ratio for res/action quests';
    resActionSetting.children[1].id = 'minResActionSetting';
    resActionSetting.children[1].firstChild.value = this.villageSettings.resActionRatio ?? 999999999999;
    resActionSetting.children[1].firstChild.style.width = '9em';
    const taxObjectiveSetting = questSettings.firstChild.children[1].cloneNode(true);
    taxObjectiveSetting.firstChild.innerText = 'Max tax objective % (0.5~1.25)';
    taxObjectiveSetting.children[1].id = 'taxObjectiveSetting';
    taxObjectiveSetting.children[1].firstChild.value = this.villageSettings.taxObjectivePercent ?? 0;
    // Insert
    const saveButton = questSettings.firstChild.children[2];
    saveButton.disabled = false;
    saveButton.className = 'mat-focus-indicator mat-raised-button mat-button-base';  // Make it look enabled in case it's disabled
    questSettings.firstChild.insertBefore(resActionSetting, saveButton);
    questSettings.firstChild.insertBefore(taxObjectiveSetting, saveButton);

    saveButton.firstChild.firstChild.innerText = 'Save QuesBS Quests';
    //Add a save function for button
    saveButton.firstChild.onclick = () => {
      const newActions = parseNumber(document.getElementById('actionsLimitSetting').firstChild.value);
      const newResActions = parseNumber(document.getElementById('minResActionSetting').firstChild.value);
      const newTaxObjectivePercent = parseNumber(document.getElementById('taxObjectiveSetting').firstChild.value);
      //Data validation
      if(isNaN(newActions) || isNaN(newTaxObjectivePercent) || isNaN(newResActions)) {
        this.gameData.snackbarService.openSnackbar('Error: Value should be a number'); //feedback popup
      } else if (newTaxObjectivePercent < 0 || newTaxObjectivePercent > 1.25) {
        this.gameData.snackbarService.openSnackbar('Error: Tax % should be between 0 and 1.25');
      } else {
        this.villageSettings.strActions = newActions;
        this.villageSettings.taxObjectivePercent = newTaxObjectivePercent;
        this.villageSettings.resActionRatio = newResActions;
        localStorage.setItem(`${this.playerId}:QuesBS_villageSettings`, JSON.stringify(this.villageSettings));
        this.gameData.snackbarService.openSnackbar('Settings saved successfully'); //feedback popup
      }
    }
    settingsOverview.appendChild(questSettings);
  }

  async modifyTomeStorePage() {
    /**
     * Inserts a custom popup menu for tome settings
     */  
    //Get store page contents
    let tomeStoreOverview = document.querySelector('app-catacomb-tome-store');
    while(!tomeStoreOverview) {
      await new Promise(resolve => setTimeout(resolve, 50));
      tomeStoreOverview = document.querySelector('app-catacomb-tome-store');
    }

    // Create settings menu
    const settings = document.createElement('div');
    settings.id = 'highlightTomeSettings';
    settings.style.margin = '1rem';
    settings.style.position = 'relative';
    settings.innerHTML = GM_getResourceText('settingsMenu');
    const openTomeSettingsbutton = document.createElement('button');
    openTomeSettingsbutton.id = 'openTomeSettingsButton';
    openTomeSettingsbutton.className = 'mat-focus-indicator mat-raised-button mat-button-base';
    openTomeSettingsbutton.innerText = 'QuesBS Tome Settings';
    settings.insertBefore(openTomeSettingsbutton, settings.childNodes[0]);
    const topStoreBar = tomeStoreOverview.firstChild.firstChild;
    topStoreBar.insertBefore(settings, topStoreBar.firstChild);

    // Display correct settings
    const settingsContainer = settings.childNodes[1];
    if (this.tomeSettings?.useWeightSettings) {
      settingsContainer.querySelector('#tomeWeightSettingsBlock').style.display = 'block';
      settingsContainer.querySelector('#thresholdSettingsBlock').style.display = 'none';
    }

    // Fill in input values
    const d = 99900; // Default value
    settingsContainer.querySelector('#rewardHighlightSetting').value = ((this.tomeSettings.thresholds.reward ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#mobHighlightSetting').value = ((this.tomeSettings.thresholds.mobDebuff ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#characterHighlightSetting').value = ((this.tomeSettings.thresholds.character ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#characterWbHighlightSetting').value = ((this.tomeSettings.thresholds.characterWb ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#elementalConvHighlightSetting').value = ((this.tomeSettings.thresholds.elementalConv ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#multiMobHighlightSetting').value = ((this.tomeSettings.thresholds.multiMob ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#lifestealHighlightSetting').value = ((this.tomeSettings.thresholds.lifesteal ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#actionSpeedHighlightSetting').value = ((this.tomeSettings.thresholds.actionSpeed ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#mobSkipHighlightSetting').value = ((this.tomeSettings.thresholds.mobSkip ?? d) / 100).toFixed(2);
    settingsContainer.querySelector('#rewardSpaceSetting').value = this.tomeSettings.spaceThresholds.reward ?? 6;
    settingsContainer.querySelector('#mobSpaceSetting').value = this.tomeSettings.spaceThresholds.mobDebuff ?? 6;
    settingsContainer.querySelector('#characterSpaceSetting').value = this.tomeSettings.spaceThresholds.character ?? 6;
    settingsContainer.querySelector('#wbSpaceSetting').value = this.tomeSettings.spaceThresholds.wb ?? 9;
    settingsContainer.querySelector('#rareSpaceSetting').value = this.tomeSettings.spaceThresholds.rare ?? 9;
    settingsContainer.querySelector('#legendarySpaceSetting').value = this.tomeSettings.spaceThresholds.legendary ?? 9;
    settingsContainer.querySelector('#numGoodRolls').value = this.tomeSettings.thresholds.numGoodRolls ?? 1;
    settingsContainer.querySelector('#numGoodRollsWb').value = this.tomeSettings.thresholds.numGoodRollsWb ?? 2;

    settingsContainer.querySelector('#actionSpeedWeight').value = this.tomeSettings.weights.actionSpeed ?? 0;
    settingsContainer.querySelector('#mobSkipWeight').value = this.tomeSettings.weights.mobSkip ?? 0;
    settingsContainer.querySelector('#multiMobWeight').value = this.tomeSettings.weights.multiMob ?? 0;
    settingsContainer.querySelector('#lifestealWeight').value = this.tomeSettings.weights.lifesteal ?? 0;
    settingsContainer.querySelector('#rewardWeight').value = this.tomeSettings.weights.reward ?? 0;
    settingsContainer.querySelector('#mobDebuffWeight').value = this.tomeSettings.weights.mobDebuff ?? 0;
    settingsContainer.querySelector('#characterWeight').value = this.tomeSettings.weights.character ?? 0;
    settingsContainer.querySelector('#incomePerSpaceThreshold').value = this.tomeSettings.weights.incomePerSpaceThreshold ?? 0;
    settingsContainer.querySelector('#wbCharacterWeight').value = this.tomeSettings.weights.wbCharacter ?? 0;
    settingsContainer.querySelector('#wbElementalConvWeight').value = this.tomeSettings.weights.wbElementalConv ?? 0;
    settingsContainer.querySelector('#wbPowerPerSpaceThreshold').value = this.tomeSettings.weights.wbPowerPerSpaceThreshold ?? 0;

    settingsContainer.querySelector('#hideAddedMobs').checked = this.tomeSettings.hideMods.addedMobs ?? false;
    settingsContainer.querySelector('#hideReward').checked = this.tomeSettings.hideMods.reward ?? false;
    settingsContainer.querySelector('#hideMobDebuff').checked = this.tomeSettings.hideMods.mobDebuff ?? false;
    settingsContainer.querySelector('#hideCharacter').checked = this.tomeSettings.hideMods.character ?? false;
    settingsContainer.querySelector('#hideWaterResistance').checked = this.tomeSettings.hideMods.waterResistance ?? false;
    settingsContainer.querySelector('#hideThunderResistance').checked = this.tomeSettings.hideMods.thunderResistance ?? false;
    settingsContainer.querySelector('#hideFireResistance').checked = this.tomeSettings.hideMods.fireResistance ?? false;
    settingsContainer.querySelector('#hideMeleeResistance').checked = this.tomeSettings.hideMods.meleeResistance ?? false;
    settingsContainer.querySelector('#hideRangedResistance').checked = this.tomeSettings.hideMods.rangedResistance ?? false;
    settingsContainer.querySelector('#hideElementalConversion').checked = this.tomeSettings.hideMods.elementalConversion ?? false;
    settingsContainer.querySelector('#hideFortifyReduction').checked = this.tomeSettings.hideMods.fortifyReduction ?? false;

    settingsContainer.querySelector('#goldPerKillForTomesEquipped').value = this.tomeSettings.goldKillTomesEquippedAmount ?? 0;
    settingsContainer.querySelector('#disableRefreshOnHighlight').checked = this.tomeSettings.disableRefreshOnHighlight ?? true;
    if (this.tomeSettings.useWeightSettings) {
      settingsContainer.querySelector('#toggleWeightSettings').className = 'mat-focus-indicator mat-stroked-button mat-button-base';
    } else {
      settingsContainer.querySelector('#toggleThresholdSettings').className = 'mat-focus-indicator mat-stroked-button mat-button-base';
    }

    // Set up buttons
    openTomeSettingsbutton.onclick = () => { // Toggle open and close menu
      const container = document.querySelector('#tomeSettingsContainer');
      if (container.style.display === 'none') {
        container.style.display = 'inline-block';
      } else {
        container.style.display = 'none';
      }
    };
    const toggleWeightSettings = (yes) => {
      const thresholdSettingsBlock = settingsContainer.querySelector('#thresholdSettingsBlock');
      const weightSettingsBlock = settingsContainer.querySelector('#tomeWeightSettingsBlock');
      const toggleThresholdButton = settingsContainer.querySelector('#toggleThresholdSettings');
      const toggleWeightButton = settingsContainer.querySelector('#toggleWeightSettings');

      if(yes) {
        weightSettingsBlock.style.display = 'block';
        thresholdSettingsBlock.style.display = 'none';
        this.tomeSettings.useWeightSettings = true;
        toggleThresholdButton.className = 'mat-focus-indicator mat-raised-button mat-button-base';
        toggleWeightButton.className = 'mat-focus-indicator mat-stroked-button mat-button-base';
      } else {
        weightSettingsBlock.style.display = 'none';
        thresholdSettingsBlock.style.display = 'block';
        this.tomeSettings.useWeightSettings = false;
        toggleThresholdButton.className = 'mat-focus-indicator mat-stroked-button mat-button-base';
        toggleWeightButton.className = 'mat-focus-indicator mat-raised-button mat-button-base';
      }
    }
    settingsContainer.querySelector('#toggleThresholdSettings').onclick = () => toggleWeightSettings(false);
    settingsContainer.querySelector('#toggleWeightSettings').onclick = () => toggleWeightSettings(true);
    settingsContainer.querySelector('#tomeSettingsSaveButton').onclick = () => {
      // Get all of the values
      const container = document.querySelector('#tomeSettingsContainer');
      const tomeSettings = {
        thresholds: {
          reward: container.querySelector('#rewardHighlightSetting').valueAsNumber * 100,
          mobDebuff: container.querySelector('#mobHighlightSetting').valueAsNumber * 100,
          character: container.querySelector('#characterHighlightSetting').valueAsNumber * 100,
          characterWb: container.querySelector('#characterWbHighlightSetting').valueAsNumber * 100,
          elementalConv: container.querySelector('#elementalConvHighlightSetting').valueAsNumber * 100,
          multiMob: container.querySelector('#multiMobHighlightSetting').valueAsNumber * 100,
          lifesteal: container.querySelector('#lifestealHighlightSetting').valueAsNumber * 100,
          actionSpeed: container.querySelector('#actionSpeedHighlightSetting').valueAsNumber * 100,
          mobSkip: container.querySelector('#mobSkipHighlightSetting').valueAsNumber * 100,
          numGoodRolls: container.querySelector('#numGoodRolls').valueAsNumber,
          numGoodRollsWb: container.querySelector('#numGoodRollsWb').valueAsNumber,
        },
        spaceThresholds: {
          reward: container.querySelector('#rewardSpaceSetting').valueAsNumber,
          mobDebuff: container.querySelector('#mobSpaceSetting').valueAsNumber,
          character: container.querySelector('#characterSpaceSetting').valueAsNumber,
          wb: container.querySelector('#wbSpaceSetting').valueAsNumber,
          rare: container.querySelector('#rareSpaceSetting').valueAsNumber,
          legendary: container.querySelector('#legendarySpaceSetting').valueAsNumber,
        },
        weights: {
          actionSpeed: container.querySelector('#actionSpeedWeight').valueAsNumber,
          mobSkip: container.querySelector('#mobSkipWeight').valueAsNumber,
          multiMob: container.querySelector('#multiMobWeight').valueAsNumber,
          lifesteal: container.querySelector('#lifestealWeight').valueAsNumber,
          reward: container.querySelector('#rewardWeight').valueAsNumber,
          mobDebuff: container.querySelector('#mobDebuffWeight').valueAsNumber,
          character: container.querySelector('#characterWeight').valueAsNumber,
          incomePerSpaceThreshold: container.querySelector('#incomePerSpaceThreshold').valueAsNumber,
          wbCharacter: container.querySelector('#wbCharacterWeight').valueAsNumber,
          wbElementalConv: container.querySelector('#wbElementalConvWeight').valueAsNumber,
          wbPowerPerSpaceThreshold: container.querySelector('#wbPowerPerSpaceThreshold').valueAsNumber,
        },
        hideMods: {
          addedMobs: container.querySelector('#hideAddedMobs').checked,
          reward: settingsContainer.querySelector('#hideReward').checked,
          mobDebuff: settingsContainer.querySelector('#hideMobDebuff').checked,
          character: settingsContainer.querySelector('#hideCharacter').checked,
          waterResistance: settingsContainer.querySelector('#hideWaterResistance').checked,
          thunderResistance: settingsContainer.querySelector('#hideThunderResistance').checked,
          fireResistance: settingsContainer.querySelector('#hideFireResistance').checked,
          meleeResistance: settingsContainer.querySelector('#hideMeleeResistance').checked,
          rangedResistance: settingsContainer.querySelector('#hideRangedResistance').checked,
          elementalConversion: settingsContainer.querySelector('#hideElementalConversion').checked,
          fortifyReduction: settingsContainer.querySelector('#hideFortifyReduction').checked,
        },
        goldKillTomesEquippedAmount: container.querySelector('#goldPerKillForTomesEquipped').valueAsNumber,
        disableRefreshOnHighlight: container.querySelector('#disableRefreshOnHighlight').checked,
      };
      // Sanitize inputs
      for (const type in tomeSettings) {
        if (typeof tomeSettings[type] === 'object') {
          for (const [key, value] of Object.entries(tomeSettings[type])) {
            this.tomeSettings[type][key] = isNaN(value) ? this.tomeSettings[type][key] : value;
          }
        } else {
          this.tomeSettings[type] = isNaN(tomeSettings[type]) ? this.tomeSettings[type] : tomeSettings[type];
        }
      }
      localStorage.setItem(`${this.playerId}:QuesBS_tomeSettings`, JSON.stringify(this.tomeSettings));
      this.gameData.snackbarService.openSnackbar('Store settings saved successfully');
      // Refresh highlighting
      const target = $('app-catacomb-tome-store > .scrollbar > div > div > .d-flex.flex-wrap.gap-1');
      this.handleCatacombTomeStore({target: target[0]});
    }
  }

  async insertFuseFrenzyButton() {
    // Add a fuse button to the gem page
    // Wait for page to load and get the html nodes required
    let gemInvOverview = document.querySelector('app-inventory-gems');
    while(!gemInvOverview) {
      await new Promise(resolve => setTimeout(resolve, 50));
      gemInvOverview = document.querySelector('app-inventory-gems');
    }
    let gemInvTopBar = gemInvOverview.firstChild.firstChild.firstChild;
    // Create button
    const buttonContainer = document.createElement('div');
    const fuseFrenzyButton = document.createElement('div');
    fuseFrenzyButton.id = 'fuseFrenzyButton';
    fuseFrenzyButton.className = 'mat-focus-indicator mat-raised-button mat-button-base';
    fuseFrenzyButton.innerText = 'Fuse Frenzy';
    // Add button
    buttonContainer.appendChild(fuseFrenzyButton);
    gemInvTopBar.appendChild(buttonContainer);
    fuseFrenzyButton.onclick = async () => {
      await this.fuseFrenzy();
    };
  }

  async fuseFrenzy() {
    // If this.gems has no gems, get gems from code
    if (this.gems.length < 1) {
      // Sort by level (descending) and filter frenzy gems out
      this.gems = this.gameData.playerInventoryService.gems.filter(
          gem => gem.gem_type != 'frenzy' && gem.on_market === 0 && gem.trashed === 0
      ).toSorted(
          (gemA, gemB) => gemB.gem_level - gemA.gem_level
      );
    }
    if (this.gems.length < 3) {
      // No valid gems to fuse, return early
      this.gameData.snackbarService.openSnackbar(`There aren't enough gems to fuse!`);
      return;
    }

    // take the ids of the last 3 gems (lowest level gems) and fuse
    const lowestLevelGems = [this.gems.pop(), this.gems.pop(), this.gems.pop()];
    const frenzyLevel = Math.round((lowestLevelGems[0].gem_level + lowestLevelGems[1].gem_level + lowestLevelGems[2].gem_level) / 3);
    // Disable fuse button until gem inventory has been updated
    const fuseButton = document.querySelector('#fuseFrenzyButton');
    fuseButton.disabled = true;
    fuseButton.className = 'mat-focus-indicator mat-stroked-button mat-button-base';
    this.gameData.httpClient.post('/inventory/fuse-frenzy-gem', {gemIds: [lowestLevelGems[0].id, lowestLevelGems[1].id, lowestLevelGems[2].id]}).subscribe(
      async val => {
        this.gameData.snackbarService.openSnackbar(`A level ${frenzyLevel} frenzy gem was created.`); //feedback popup
        fuseButton.disabled = false;
        fuseButton.className = 'mat-focus-indicator mat-raised-button mat-button-base';
      },
      response => {
        this.gameData.snackbarService.openSnackbar(`The gem failed to be created. (Gems may be out of sync with the server)`);
        console.log('QuestBS: Frenzy gem could not be created.', response);
        fuseButton.disabled = false;
        fuseButton.className = 'mat-focus-indicator mat-raised-button mat-button-base';
      }
    );
  }
}

// ----------------------------------------------------------------------------
// Helper functions

function getCatacombEndTime(numMobs, actionTimerSeconds, extraSeconds=0) {
  const current = new Date();
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  };
  const finishTime = new Date(current.getTime() + (numMobs * actionTimerSeconds + extraSeconds) * 1000)
                              .toLocaleString('en-US', options);
  return finishTime;
}

function getStatRatios(statBlockElem) {
  /* Given an element statBlockElem containing rows of the 4 stats displayed at 
  the top of the page, return the ratios between the stats
  */
  const stats = [];

  for (let i = 0; i < statBlockElem.children.length; i++) {
    const row = statBlockElem.children[i];
    stats.push(parseNumber(row.children[1].firstChild.innerText));
  }

  const minStat = Math.min(...stats);
  return [
    (stats[0] / minStat).toFixed(2),
    (stats[1] / minStat).toFixed(2),
    (stats[2] / minStat).toFixed(2),
    (stats[3] / minStat).toFixed(2),
  ];
}

function parseNumber(num) {
  /**
   * Given a num (string), detect the type of number formatting it uses and then
   * convert it to the type Number. 
  **/
  // First strip any commas
  const resultNumStr = num.replace(/,/g, '');
  if (!isNaN(Number(resultNumStr))) { // This can also convert exponential notation
    return Number(resultNumStr);
  }

  // Check if string has suffix
  const suffixes = ["k", "m", "b", "t", "qa", "qi", "sx", "sp"];
  const suffixMatch = resultNumStr.match(/[a-z]+\b/g);
  if (suffixMatch) {
    const suffix = suffixMatch[0];
    const shortenedNum = parseFloat(resultNumStr.match(/[0-9.]+/g)[0]);

    const multiplier = 1000 ** (suffixes.findIndex(e => e === suffix) + 1)
    if (multiplier < 1000) {
      console.log('QuesBS: ERROR, number\'s suffix not found in existing list');
      return 0;
    } else {
      return shortenedNum * multiplier;
    }
  }
}

function addInvisibleScrollDiv() {
  /**
   * Add an invisible div to stop the window from scrolling via the spacebar
   */
  const invisiDiv = document.createElement('button');
  invisiDiv.id = 'stopScrollDiv';
  invisiDiv.onclick = () => {};
  invisiDiv.style.width = '0px';
  invisiDiv.style.height = '0px';
  invisiDiv.style.opacity = 0;
  document.body.appendChild(invisiDiv);
}

// ----------------------------------------------------------------------------

// This is where the script starts
var QuesBS = null;
console.log('QuesBS: Init load');
let QuesBSLoader = null;
let numAttempts = 30;
QuesBSLoader = setInterval(setupScript, 3000);

window.startQuesBS = () => { // If script doesn't start, call this function (ie. startQuesBS() in the console)
  QuesBSLoader = setInterval(setupScript, 3000);
}

window.restartQuesBS = () => { // Try to reload the game data for the script
  QuesBSLoader = setInterval(async () => {
    if (QuesBS.gameData === undefined) {
      await QuesBS.getGameData();
    } else {
      clearInterval(QuesBSLoader);
      console.log('QuesBS: Script has been reloaded.')
    }
  }, 3000);
 }

 async function setupScript() {
  if(QuesBS === null) {
    QuesBS = new Script();
    await QuesBS?.getGameData();
  }

  if(QuesBS !== null && QuesBS.gameData !== undefined) {
    console.log('QuesBS: The script has been loaded.');

    clearInterval(QuesBSLoader);
    await QuesBS.initPathDetection();
    await QuesBS.initPlayerData();
  } else {
    await QuesBS?.getGameData();
    console.log('QuesBS: Loading failed. Trying again...');
    numAttempts--;
    if(numAttempts <= 0) {
      clearInterval(QuesBSLoader); //Stop trying after a while
      console.log('QuesBS: Loading failed. Stopping...');
    }
  }
}