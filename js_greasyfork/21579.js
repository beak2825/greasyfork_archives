// ==UserScript==
// @name         IndieGala: Auto-enter Giveaways
// @version      2.6.1
// @description  Automatically enters IndieGala Giveaways
// @author       Hafas (https://github.com/Hafas/)
// @match        https://www.indiegala.com/giveaways*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @namespace https://greasyfork.org/users/56087
// @downloadURL https://update.greasyfork.org/scripts/21579/IndieGala%3A%20Auto-enter%20Giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/21579/IndieGala%3A%20Auto-enter%20Giveaways.meta.js
// ==/UserScript==

(function () {
  /**
   * change values to customize the script's behaviour
   * preferably in your script manager to avoid overrides on updates
   * if they aren't set they will default to the values below
   */
  const options = {
    skipOwnedGames: false,
    skipDLCs: false,
    // set to 0 to ignore the number of participants
    maxParticipants: 0,
    // set to 0 to ignore the price
    maxPrice: 0,
    // minimum giveaway level
    minLevel: 0,
    // Array of names of games: ["game1","game2","game3"]
    gameBlacklist: [],
    onlyEnterGuaranteed: false,
    // Array of names of users: ["user1","user2","user3"]
    userBlacklist: [],
    // Some giveaways don't link to the game directly but to a sub containing that game. IndieGala is displaying these games as "not owned" even if you own that game
    skipSubGiveaways: false,
    interceptAlert: false,
    // how many minutes to wait at the end of the line until restarting from the beginning
    waitOnEnd: 60,
    // how many seconds to wait between entering giveaways
    delay: 1,
    // Display logs
    debug: false,
    // Your Steam API key (keep it private!): "A1B2C3D4E5F6H7I8J9K10L11M12N13O1"
    steamApiKey: "",
    // Your Steam user id: "12345678901234567"
    steamUserId: "",
    // how many tickets to buy in extra odds giveaways
    extraTickets: 1
  };

  /**
   * current user state
   */
  const my = {
    level: 10,
    coins: 240,
    nextRecharge: 60 * 60 * 1000,
    ownedGames: new Set()
  };
  
  const state = {
    currentPage: 1,
    currentDocument: document
  };

  /**
   * entry point of the script
   */
  async function start () {
    if (!getCurrentPage()) {
      //I'm not on a giveaway list page. Script stops here.
      log("Current page is not a giveway list page. Stopping script.");
      return;
    }
    try {
      await withFailSafeAsync(getOptionsFromCache)();
      const [userData, ownedGames] = await Promise.all([
        withFailSafeAsync(getUserData)(),
        withFailSafeAsync(getOwnedGames)()
      ]);
      setUserData(userData);
      setOwnedGames(ownedGames);
      await waitForGiveaways();
      while (okToContinue()) {
        log("currentPage: %s, myData:", state.currentPage, my);
        const giveaways = parseGiveaways();
        setOwned(giveaways);
        await setGameInfo(giveaways);
        await enterGiveaways(giveaways);
        if (okToContinue() && hasNext()) {
          await loadNextPage();
        } else {
          break;
        }
      }
      const waitOnEnd = options.waitOnEnd * 60 * 1000;
      info("Nothing to do. Waiting %s minutes", options.waitOnEnd);
      setTimeout(reload, waitOnEnd);
    } catch (err) {
      error("Something went wrong:", err);
    }
  }

  const IdType = {
    APP: Symbol(),
    SUB: Symbol()
  };

  /**
   * returns true if the logged in user has coins available.
   * if not, it will return false and trigger navigation to the first giveaway page on recharge
   */
  function okToContinue () {
    if (my.coins === 0) {
      info("No coins available");
      return false;
    }
    return true;
  }
  
  async function getUserData () {
    const response = await request("/get_user_info?show_coins=True", { 
      maxRetries: 0
    });
    /**
     * the API occasionally returns in the `html` property something like:
     * [...]`$('#ajax_get_user_data').toggle('fast');\n\t});\n</script><script async type="text/javascript" src="/_Incapsula_Resource?`[...]
     * with unescaped quotation marks which results to a parsing error when trying to parse it as a JSON
     * The workaround is to just return the payload as text and extract the desired information with regular expressions
     */
    return response.text();
  }

  const LEVEL_PATTERN = /"giveaways_user_lever": ([0-9]+)/;
  const COINS_PATTERN = /"silver_coins_tot": ([0-9]+)/;
  /**
   * collects user information including level, coins and next recharge
   */
  function setUserData (text) {
    let match = LEVEL_PATTERN.exec(text);
    if (!match) {
      error("unable to determine level");
    } else {
      my.level = parseInt(match[1]);
    }

    match = COINS_PATTERN.exec(text);
    if (!match) {
      error("unable to determine #coins");
    } else {
      my.coins = parseInt(match[1]);
    }
  }

  async function getOwnedGames() {
    const fetchOwnedGames = options.skipOwnedGames || options.skipDLCs === "missing_basegame";
    if (!fetchOwnedGames) {
      return [];
    }
    const { steamApiKey, steamUserId } = options;
    if (!steamApiKey || !steamUserId) {
      warn("You must set both 'steamApiKey' and 'steamUserId' to use 'skipOwnedGames'! Proceeding without checking owned games");
      return [];
    }
    let ownedGames = await getFromCache("ownedGames");
    if (ownedGames) {
      return ownedGames;
    }
    const { responseText } = await corsRequest(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamUserId}&format=json`);
    const { games } = JSON.parse(responseText).response;
    ownedGames = games.map(({ appid }) => appid);
    await saveToCache("ownedGames", ownedGames, 60);
    return ownedGames;
  }

  /**
   * sets the owned-property of each giveaway
   */
  function setOwned (giveaways) {
    giveaways.forEach((giveaway) => {
      giveaway.owned = my.ownedGames.has(Number(giveaway.steamId));
      if (giveaway.owned) {
        log("I seem to own '%s' (gameId: '%s')", giveaway.name, giveaway.gameId);
      } else {
        log("I don't seem to own '%s' (gameId: '%s')", giveaway.name, giveaway.gameId);
      }
    });
  }

  async function setGameInfo (giveaways) {
    const fetchGameInfo = options.skipDLCs;
    if (!fetchGameInfo) {
      return;
    }
    const appids = Array.from(
      new Set(
        giveaways.map(({ steamId }) => steamId)
      )
    );
    const appsDetails = await getFromCache("appsDetails", {});
    await Promise.all(
      appids.map(
        async (appid) => {
          const details = appsDetails[appid];
          if (details) {
            return;
          }
          const { responseText } = await corsRequest(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
          const result = JSON.parse(responseText);
          if (result === null) {
            warn("No details found for appid '%s'", appid);
            return;
          }
          if (result[appid].success !== true) {
            error("Failed to get details for appid '%s'", appid, result);
            return;
          }
          const { fullgame, type } = result[appid].data;
          const basegame = fullgame ? Number(fullgame.appid) : undefined;
          appsDetails[appid] = {
            basegame,
            type
          };
        }
      )
    )
    await saveToCache("appsDetails", appsDetails);
    giveaways.forEach((giveaway) => {
      const appid = giveaway.steamId;
      const details = appsDetails[appid];
      if (details) {
        const { basegame, type } = details;
        giveaway.gameType = type;
        if (basegame) {
          giveaway.ownBasegame = my.ownedGames.has(basegame);
        }
      }
    });
  }

  function setOwnedGames (data) {
    my.ownedGames = new Set(data);
  }

  /**
   * iterates through each giveaway and enters them, if possible and desired
   */
  async function enterGiveaways (giveaways) {
    log("Entering giveaways", giveaways);
    for (let giveaway of giveaways) {
      if (!giveaway.shouldEnter()) {
        continue;
      }
      const numberOfEntries = giveaway.extraOdds ? options.extraTickets - giveaway.boughtTickets : 1;
      for (let i = 0; i < numberOfEntries; ++i) {
        const payload = await giveaway.enter();
        log("giveaway entered", "payload", payload);
        switch (payload.status) {
          case "ok": {
            my.coins = payload.silver_tot;
            giveaway.boughtTickets += 1;
            break;
          }
          case "silver": {
            // we know that our coins value is lower than the price to enter this giveaway, so we can set a guessed value
            my.coins = Math.min(my.coins, giveaway.price - 1);
            break;
          }
          case "level": {
            // level hasn't been set properly on initialization - now we can set a guessed value
            my.level = Math.min(my.level, giveaway.minLevel - 1);
            break;
          }
          default: {
            error("Failed to enter giveaway. Status: %s. Code: %s, My: %o", payload.status, payload.code, my);
          }
        }
        const delay = options.delay * 1000;
        log("waiting some msec:", delay);
        await wait(delay);
      }
    }
  }

  /**
   * 
   */
  async function waitForGiveaways () {
    log("waiting giveaways to appear");
    await waitForChange(() => document.querySelector(".page-contents-list .items-list-row"));
    log("giveaways are here. Continue ...");
  }

  /**
   * parses the DOM and extracts the giveaway. Returns Giveaway-Objects, which include the following properties:
   id {String} - the giveaway id
   name {String} - name of the game
   price {Integer} - the coins needed to enter the giveaway
   minLevel {Integer} - the minimum level to enter the giveaway
   participants {Integer} - the current number of participants, that entered that giveaway
   guaranteed {Boolean} - whether or not the giveaway is a guaranteed one
   by {String} - name of the user who created the giveaway
   entered {Boolean} - wheter or not the logged in user has already entered the giveaway
   steamId {String} - the id Steam gave this game
   idType {"APP" | "SUB" | null} - "APP" if the steamId is an appId. "SUB" if the steamId is a subId. null if this script is not sure
   gameId {String} - the gameId IndieGala gave this game. It's usually the appId with or without a suffix, or the subId with a "sub_"-prefix
   */
  function parseGiveaways () {
    return Array.from(state.currentDocument.querySelectorAll(".page-contents-list .items-list-row .items-list-col")).map((giveawayDOM) => {
      // we can extract the game id from the image
      const imageURL = giveawayDOM.getElementsByTagName("img")[0].dataset.imgSrc;
      const [, , typeString, steamId] = new URL(imageURL).pathname.split("/");
      const gameId = steamId;
      let idType;
      switch (typeString) {
        case "apps": {
          idType = IdType.APP;
          break;
        }
        case "bundles":
        case "subs": {
          idType = IdType.SUB;
          break;
        }
        default: {
          error("Unrecognized id type in '%s'", imageURL);
          idType = null;
        }
      }
      return new Giveaway({
        id: getGiveawayId(giveawayDOM),
        name: getGiveawayName(giveawayDOM),
        price: getGiveawayPrice(giveawayDOM),
        minLevel: getGiveawayMinLevel(giveawayDOM),
        //will be filled in later in setOwned()
        owned: undefined,
        participants: getGiveawayParticipants(giveawayDOM),
        guaranteed: getGiveawayGuaranteed(giveawayDOM),
        by: getGiveawayBy(giveawayDOM),
        boughtTickets: getGiveawayBoughtTickets(giveawayDOM),
        extraOdds: getGiveawayExtraOdds(giveawayDOM),
        steamId: steamId,
        idType: idType,
        gameId: gameId,
        gameType: undefined,
        ownBasegame: undefined
      });
    });
  }

  const withFailSafe = (fn) => (...args) => {
    try {
      return fn(...args);
    } catch (err) {
      error(...args, err);
      return undefined;
    }
  }

  const withFailSafeAsync = (fn) => async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      error(...args, err);
      return undefined;
    }
  }

  const getGiveawayId = withFailSafe((giveawayDOM) => {
    const linkToGiveaway = giveawayDOM.getElementsByTagName("a")[0].attributes.href.value;
    return linkToGiveaway.split("/").slice(-1)[0];
  });
  const getGiveawayName = withFailSafe((giveawayDOM) => giveawayDOM.querySelector("a[title]").attributes.title.value);
  const getGiveawayPrice = withFailSafe((giveawayDOM) => parseInt(giveawayDOM.querySelector("[data-price]")?.dataset.price));
  const getGiveawayMinLevel = withFailSafe((giveawayDOM) => {
    const levelElement = giveawayDOM.querySelector(".items-list-item-type span");
    if (!levelElement) {
      return 0;
    }
    // the text is something like "Lev. 1". Just extract the number.
    return parseInt(levelElement.textContent.match(/[0-9]+/)[0]);
  });
  const getGiveawayParticipants = withFailSafe((giveawayDOM) => parseInt(giveawayDOM.getElementsByClassName("items-list-item-data-right-bottom")[0]?.textContent));
  const getGiveawayGuaranteed = withFailSafe((giveawayDOM) => giveawayDOM.getElementsByClassName("items-list-item-type")[0].classList.contains("items-list-item-type-guaranteed"));
  // the page does not show who made the giveaway anymore
  const getGiveawayBy = withFailSafe((/*giveawayDOM*/) => "");
  const getGiveawayBoughtTickets = withFailSafe((giveawayDOM) => {
    if (giveawayDOM.getElementsByClassName("items-list-item-ticket").length === 0) {
      // entered single ticket giveaway
      return 1;
    }
    const extraOddsElement = giveawayDOM.querySelector("aside.extra-odds .palette-color-11");
    if (!extraOddsElement) {
      // not entered single ticket giveaway
      return 0;
    }
    // extra odds giveaway
    return parseInt(extraOddsElement.textContent);
  });
  const getGiveawayExtraOdds = withFailSafe((giveawayDOM) => giveawayDOM.getElementsByClassName("fa-clone").length !== 0);

  /**
   * utility function that checks if a name is in a blacklist
   */
  const isInBlacklist = (blacklist) => (name) => {
    if (!Array.isArray(blacklist)) {
      return false;
    }
    for (var i = 0; i < blacklist.length; ++i) {
      var blacklistItem = blacklist[i];
      if (blacklistItem instanceof RegExp) {
        if (blacklistItem.test(name)) {
          return true;
        }
      } if (name === blacklistItem) {
        return true;
      }
    }
    return false;
  }

  /**
   * whether or not a game by name is in the blacklist
   */
  const isInGameBlacklist = isInBlacklist(options.gameBlacklist);

  /**
   * whether or not a user by name is in the blacklist
   */
  const isInUserBlacklist = isInBlacklist(options.userBlacklist);

  class Giveaway {
    constructor (props) {
      for (let key in props) {
        if (props.hasOwnProperty(key)) {
          this[key] = props[key];
        }
      }
    }

    /**
     * returns true if the script can and should enter a giveaway
     */
    shouldEnter () {
      if (this.boughtTickets && !this.extraOdds) {
        log("Not entering '%s' because I already entered", this.name);
        return false;
      }
      if (this.extraOdds && this.boughtTickets >= options.extraTickets) {
        log("Not entering '%s' because I already entered %s times (extraTickets: %s)", this.name, this.boughtTickets, options.extraTickets);
        return false;
      }
      if (this.owned && options.skipOwnedGames) {
        log("Not entering '%s' because I already own it (skipOwnedGames? %s)", this.name, options.skipOwnedGames);
        return false;
      }
      if (this.gameType === "dlc" && options.skipDLCs) {
        if (options.skipDLCs === "missing_basegame") {
          if (!this.ownBasegame) {
            log("Not entering '%s' because I don't own the basegame of this DLC (skipDLCs? %s)", this.name, options.skipDLCs);
            return false;
          }
        } else {
          log("Not entering '%s' because the game is a DLC (skipDLCs? %s)", this.name, options.skipDLCs);
          return false;
        }
      }
      if (isInGameBlacklist(this.name)) {
        log("Not entering '%s' because this game is on my blacklist", this.name);
        return false;
      }
      if (isInUserBlacklist(this.by)) {
        log("Not entering '%s' because the user '%s' is on my blacklist", this.name, this.by);
        return false;
      }
      if (!this.guaranteed && options.onlyEnterGuaranteed) {
        log("Not entering '%s' because the key is not guaranteed to work (onlyEnterGuaranteed? %s)", this.name, options.onlyEnteredGuaranteed);
        return false;
      }
      if (options.maxParticipants && this.participants > options.maxParticipants) {
        log("Not entering '%s' because of too many are participating (participants: %s, max: %s)", this.name, this.participants, options.maxParticipants);
        return false;
      }
      if (options.maxPrice && this.price > options.maxPrice) {
        log("Not entering '%s' because of too expensive price (price: %s, max: %s)", this.name, this.price, options.maxPrice);
        return false;
      }
      if (this.idType === IdType.SUB && options.skipSubGiveaways) {
        log("Not entering '%s' because this giveaway is linked to a sub (skipSubGiveaways? %s)", this.name, options.skipSubGiveaways);
        return false;
      }
      if (this.minLevel > my.level) {
        log("Not entering '%s' because my level is insufficient (mine: %s, needed: %s)", this.name, my.level, this.minLevel);
        return false;
      }
      if (this.minLevel < options.minLevel) {
        log("Not entering '%s' because level is too low (level: %s, min: %s)", this.name, this.minLevel, options.minLevel);
        return false;
      }
      if (this.price > my.coins) {
        log("Not entering '%s' because my funds are insufficient (mine: %s, needed: %s)", this.name, my.coins, this.price);
        return false;
      }
      return true;
    }

    /**
     * sends a POST-request to enter a giveaway
     */
    async enter () {
      info("Entering giveaway", this);
      const response = await request("/giveaways/join", {
        method: "POST",
        body: JSON.stringify({ id: this.id }),
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      return response.json();
    }
  }

  /**
   * load the DOM of the next page, parse it, and place it in `state.currentDocument` for further processing
   */
  async function loadNextPage () {
    info("loading next page");
    const nextPage = state.currentPage + 1;
    const target = `/giveaways/ajax/${nextPage}/expiry/asc/level/${my.level === 0 ? "0" : "all"}`;
    const response = await request(target);
    const json = await response.json();
    if (json.status === "ok") {
      state.currentPage = json.current_page;
      state.currentDocument = new DOMParser().parseFromString(json.html, "text/html");
    }
  }

  /**
   * calls console[method] if debug is enabled
   */
  const printDebug = (method) => (...args) => {
    if (options.debug) {
      console[method](...args);
    }
  }

  const log = printDebug("log");
  const error = printDebug("error");
  const info = printDebug("info");
  const warn = printDebug("warn");

  var PAGE_NUMBER_PATTERN = /^\/giveaways(?:\/([0-9]+)\/|\/?$)/;
  /**
   * returns the current giveaway page
   */
  function getCurrentPage () {
    var currentPath = window.location.pathname;
    var match = PAGE_NUMBER_PATTERN.exec(currentPath);
    if (match === null) {
      return null;
    }
    if (!match[1]) {
      return 1;
    }
    return parseInt(match[1]);
  }

  /**
   * returns true if there is a next page
   */
  function hasNext () {
    //find the red links and see if one of them is "NEXT"
    const nextLink = state.currentDocument.querySelector(".page-link-cont .fa-angle-right");
    return Boolean(nextLink);
  }

  if (options.interceptAlert) {
    window.alert = function (message) {
      warn("alert intercepted:", message);
    };
  }

  /**
   * sends an HTTP-Request
   */
  async function request (resource, _options =  {}, retryCounter = 0) {
    const { maxRetries = 2, ...otherOptions } = _options;
    if (retryCounter > maxRetries) {
      // retry 3 times at most
      throw new Error(`request to ${resource} failed too often`);
    }
    
    const options = Object.assign({
      credentials: "include"
    }, otherOptions);
    try {
      const response = await fetch(document.location.origin + resource, options);
      if (response.ok) {
        return response;
      }
      const timeoutDelay = response.status === 403 ? 60 * 1000 : 10 * 1000;
      await wait(timeoutDelay);
      // retry
      return request(resource, _options, retryCounter + 1);
    } catch (err) {
      await wait(1000);
      // retry
      return request(resource, _options, retryCounter + 1);
    }
  }

  async function corsRequest (resource, options) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest(Object.assign({
        method: "GET",
        url: resource,
        anonymous: true
      }, options, {
        onerror (response) {
          error("corsRequest failed", response);
          reject();
        },
        onload (response) {
          resolve(response);
        }
      }));
    });
  }

  function wait (timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  function reload () {
    log("reloading page");
    window.location.reload();
  }

  async function waitForChange (condition, timeout = 300) {
    while (true) {
      const result = condition();
      if (result) {
        return result;
      }
      await wait(timeout);
    }
  }

  async function getFromCache (...args) {
    const [key, defaultValue] = args;
    const rawValue = await GM.getValue(key, defaultValue);
    if (rawValue === undefined && args.length === 2) {
      return defaultValue;
    }
    if (!rawValue || typeof rawValue !== "string") {
      return rawValue;
    }
    try {
      const { expires, value } = JSON.parse(rawValue);
      if (expires && new Date().getTime() > new Date(expires).getTime()) {
        //value has expired
        await GM.deleteValue(key);
        return GM.getValue(key, defaultValue);
      }
      return value;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return rawValue;
      }
      throw error;
    }
  }

  async function saveToCache (key, value, duration) {
    // if duration is not set then the resource does not expire
    const expires = duration ? new Date(new Date().getTime() + duration * 60 * 1000) : null
    const object = {
      expires,
      value
    };
    await GM.setValue(key, JSON.stringify(object));
  }

 /*
  * reads values from userscript manager and falls back to the defaults
  * also adds simple menu entries to set the values through the userscript manager
  */
  async function getOptionsFromCache () {
    const optionNames = Object.keys(options);
    await Promise.all(optionNames.map(async (optionName) => {
      
      try {
        if (optionName === "gameBlacklist" || optionName === "userBlacklist") {
          options[optionName] = JSON.parse(await GM.getValue(optionName, JSON.stringify(options[optionName])));
        } else {
          options[optionName] = await GM.getValue(optionName, options[optionName]);
        }
      } catch (err) {
        error("Something went wrong:", err);
      }

      // https://github.com/greasemonkey/greasemonkey/issues/1860#issuecomment-32908169
      GM_registerMenuCommand("Set variable " + optionName, () => {
        try {
          var input = JSON.parse(prompt("Value for " + optionName, JSON.stringify(options[optionName])));

          if (input == null) {
            return;
          }

          if (Array.isArray(input)) {
            input = JSON.stringify(input);
          }

          GM.setValue(optionName, input);
          options[optionName] = input;
          info("Changed %s to %s", optionName, options[optionName]);
        } catch (err) {
          error("Something went wrong:", err);
        }
      });
    }));
  }

  start();
})();
