// ==UserScript==
// @name         Steam Community - Complete Your Set (Steam Forum Trading Helper)
// @icon         https://store.steampowered.com/favicon.ico
// @namespace    https://github.com/tkhquang
// @version      1.90
// @description  Automatically detect missing cards from a card set, help you auto-fill Trading Thread input areas
// @author       Quang Trinh
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @homepage     https://greasyfork.org/en/scripts/368518-steam-community-complete-your-set-steam-forum-trading-helper
// @match        *://steamcommunity.com/*/*/gamecards/*
// @match        *://steamcommunity.com/app/*/tradingforum/*
// @match        *://steamcommunity.com/app/*/tradingforum
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/368518/Steam%20Community%20-%20Complete%20Your%20Set%20%28Steam%20Forum%20Trading%20Helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368518/Steam%20Community%20-%20Complete%20Your%20Set%20%28Steam%20Forum%20Trading%20Helper%29.meta.js
// ==/UserScript==

/* global GM_getValue, GM_setValue, GM_deleteValue */

// ==Configuration==
const tradeTag = 2; //1 = #Number of Set in Title//2 = Card Name in Title
const tradeMode = 0; //0 = List both Owned and Unonwed Cards//1 = Only List Owned Cards, 2 = Only List Unowned Cards
const showQtyInTitle = false; //Show quantity in title?
const fullSetMode = 2; //0 = Cards Lister Mode//1 = Only check for game set that you have enough cards to make it full//2 = Complete your remainng set
const fullSetTarget = 0; //0 = Don't set a target number of Card Sets//Integer > 0 = Set a target number for Card Sets
const fullSetUnowned = true; //Check for sets that you're missing a whole full set? This has no effect if fullSetMode = 1
const fullSetStacked = false; //false = Will check for the nearest number of your card set, even if you have enough cards to have 2, 3 more set
const useLocalStorage = false; //Use HTML5 Local Storage instead, set this to true if you're using Greasemonkey
const useForcedFetch = false; //Use this if your Language is unsupported by the script by now, this is a workaround
const useForcedFetchBackup = true; //If no language is detected, it switches to Forced Fetch Mode automatically so that it won't throw an error
const steamID64 = ""; //Your steamID64, needed for fetch trade data directly from trade forum
const customSteamID = ""; //If you have set a custom ID for you Steam account, set this
const yourLanguage = ""; //Set this if the script has problems detecting your language, see the Langlist below
const customTitle = " [1:1]";
const customBody = "\n[1:1] Trading";
const haveListTitle = "[H] ";
const wantListTitle = "[W] ";
const haveListBody = "[H]\n";
const wantListBody = "[W]\n";
const foilTitle = "(Foil) ";
const foilBody = "(Foil Trading)\n";
const debugMode = false;
// ==Configuration==

// ==Codes==
//List of languages, if you can't find your Language below, please contact me.
const langList = {
  "english"      :    /\s(\d+)\sof\s\d+,\sSeries\s\d+\s$/,
  "bulgarian"    :    /\s(\d+)\sот\s\d+,\sсерия\s\d+\s$/,
  "czech"        :    /\s(\d+)\sz\s\d+,\s\d+\.\ssérie\s$/,
  "danish"       :    /\s(\d+)\saf\s\d+,\sserie\s\d+\s$/,
  "dutch"        :    /\s(\d+)\svan\sde\s\d+,\sserie\s\d+\s$/,
  "finnish"      :    /\s(\d+)\s\/\s\d+,\sSarja\s\d+\s$/,
  "french"       :    /\s(\d+)\ssur\s\d+,\sséries\s\d+\s$/,
  "german"       :    /\s(\d+)\svon\s\d+,\sSerie\s\d+\s$/,
  "greek"        :    /\s(\d+)\sαπό\s\d+,\sΣειρά\s\d+\s$/,
  "hungarian"    :    /\s(\d+)\s\/\s\d+,\s\d+\.\ssorozat\s$/,
  "italian"      :    /\s(\d+)\sdi\s\d+,\sserie\s\d+\s$/,
  "japanese"     :    /\s\d+\s枚中\s(\d+)枚,\sシリーズ\s\d+\s$/,
  "koreana"      :    /\s\d+장\s중\s(\d+)번째,\s시리즈\s\d+\s$/,
  "latam"        :    /\s(\d+)\sde\s\d+,\sserie\s\d+\s$/,
  "norwegian"    :    /\s(\d+)\sav\s\d+,\sserie\s\d+\s$/,
  "polish"       :    /\s(\d+)\sz\s\d+,\sseria\s\d+\s$/,
  "portuguese"   :    /\s(\d+)\sde\s\d+,\s\d+ª\sSérie\s$/,
  "brazilian"    :    /\s(\d+)\sde\s\d+,\ssérie\s\d+\s$/,
  "romanian"     :    /\s(\d+)\sdin\s\d+,\sseria\s\d+\s$/,
  "russian"      :    /\s(\d+)\sиз\s\d+,\sсерия\s\d+\s$/,
  "schinese"     :    /\s\d+\s张中的第\s(\d+)\s张，系列\s\d+\s$/,
  "spanish"      :    /\s(\d+)\sde\s\d+,\sserie\s\d+\s$/,
  "swedish"      :    /\s(\d+)\sav\s\d+,\sserie\s\d+\s$/,
  "tchinese"     :    /\s(\d+)\s\/\s\d+，第\s\d+\s套\s$/,
  "thai"         :    /\s(\d+)\sจาก\s\d+\sในชุดที่\s\d+\s$/,
  "turkish"      :    /\s(\d+)\/\d+,\sSeri\s\d+\s$/,
  "ukrainian"    :    /\s(\d+)\sз\s\d+,\sсерія\s№\d+\s$/,
  "vietnamese"   :    /\s(\d+)\strong\s\d+,\ssê-ri\s\d+\s$/
};

(function () {
  "use strict";

  const DisplayText = {
    set (text, color) {
      const cysDisplay = document.getElementById("cys_display");
      cysDisplay.textContent = `(CYS) - ${text}`;
      cysDisplay.style.color = color;
    },
    success (text) {
      this.set(text, "green");
    },
    error (text) {
      this.set(text, "red");
    },
    default (text) {
      this.set(text, "yellow");
    }
  };

  const Debugger = {
    log: (target) => {
      if (!debugMode) {
        return;
      }
      console.log("(CYS)", target);
    },
    warn: (target) => {
      if (!debugMode) {
        return;
      }
      console.warn("(CYS)", target);
    },
    error: (target) => {
      if (!debugMode) {
        return;
      }
      console.error("(CYS)", target);
    }
  };

  function getInfo(doc, lang) {
    let ularrCards = [],
      arrCards = [],
      objCards = {},
      total = 0,
      qtyDiff = false,
      cardCheck = true,
      lowestQty = Infinity,
      set;

    function clean(str, replacements) {
      replacements.forEach(function (value, key) {
        str = str.replace(key, value);
      });
      return str;
    }

    function getOwnedCards() {
      const ownedCards = doc.getElementsByClassName("owned"),
        owned = [],
        replaceOwned = new Map([
          [/\s+/gm, " "],
          [langList[lang], "=.=$1"],
          [/^\s\((\d+)\)\s/, "$1=.="]
        ]);
      Array.from(ownedCards).forEach(function (card) {
        owned.push(clean(card.textContent, replaceOwned).split("=.="));
      });
      Debugger.log({ owned });
      return owned;
    }

    function getUnownedCards() {
      const unownedCards = doc.getElementsByClassName("unowned"),
        unowned = [],
        replaceUnowned = new Map([
          [/\s+/gm, " "],
          [langList[lang], "=.=$1"],
          [/^\s/, "0=.="]
        ]);
      Array.from(unownedCards).forEach(function (card) {
        unowned.push(clean(card.textContent, replaceUnowned).split("=.="));
      });
      Debugger.log({ unowned });
      return unowned;
    }

    function sortArr(arr, index) {
      let sort = Object.keys(new Int8Array(arr.length + 1)).map(Number).slice(1);
      let result = [];
      sort.forEach(function (key) {
        let found = false;
        arr = arr.filter(function (item) {
          if (!found && Number(item[index]) === key) {
            result.push(item);
            found = true;
            return false;
          } else {
            return true;
          }
        });
      });
      return result;
    }

    ularrCards = getOwnedCards().concat(getUnownedCards());
    arrCards = sortArr(ularrCards, 2);
    Debugger.log({ arrCards });
    set = (arrCards.length > 0) ? arrCards.length : 0;
    arrCards.forEach(function (card) {
      let curQty = Number(card[0]);
      if (arrCards[0][0] !== card[0]) {
        qtyDiff = true;
      }
      if (curQty < lowestQty) {
        lowestQty = curQty;
      }
      if (!(/\d+/).test(card[0]) || !(/\d+/).test(card[2])) {
        cardCheck = false;
      }
      total += curQty;
      objCards[`card${card[2]}`] = {
        "order": Number(card[2]),
        "name": card[1],
        "quantity": curQty
      };
    });
    Debugger.log({ objCards });
    return {
      objCards,
      total,
      set,
      qtyDiff,
      lowestQty,
      cardCheck
    };
  }

  function calcTrade(info, numSet, tradeNeed, CYSstorage, foil) {
    if (!tradeNeed) {
      return;
    }
    let CYStext = [],
      haveListTextTitle = (foil) ? `${foilTitle}${haveListTitle}` : haveListTitle,
      wantListTextTitle = wantListTitle,
      haveListText = (foil) ? `${foilBody}${haveListBody}` : haveListBody,
      wantListText = wantListBody;
    Object.keys(info.objCards).map((e) => info.objCards[e]).forEach(function (v) {
      let tag = (tradeTag === 2) ? v.name : v.order;
      if (v.quantity > numSet && tradeMode !== 2) {
        haveListTextTitle += (showQtyInTitle) ? `${tag} (x${(v.quantity-numSet)}), ` : `${tag}, `;
        haveListText += `Card ${v.order} - ${v.name} - (x${(v.quantity-numSet)})` +
                    "\n";
      }
      if ((v.quantity < numSet || (fullSetMode === 0 && v.quantity === numSet)) && tradeMode !== 1) {
        wantListTextTitle += (showQtyInTitle) ? `${tag} (x${(numSet-v.quantity)}), ` : `${tag}, `;
        wantListText += `Card ${v.order} - ${v.name} - (x${(numSet-v.quantity)})` +
                    "\n";
      }
    });
    haveListTextTitle = haveListTextTitle.replace(/(?:,|,\s+)$/, " ");
    wantListTextTitle = wantListTextTitle.replace(/(?:,|,\s+)$/, "");
    Debugger.log({
      haveListTextTitle,
      wantListTextTitle,
      haveListText,
      wantListText
    });
    if (CYSstorage === "fetch") {
      (function (reply, topic, btn) {
        if (btn.length > 0) {
          btn[0].click();
        }
        reply[0].value = "";
        if (topic.length > 0) {
          topic[0].value = "";
        }
        reply[0].value = `${haveListText}` +
                    "\n" +
                    `${wantListText}${customBody}`;
        if (topic.length > 0) {
          topic[0].value = `${haveListTextTitle}${wantListTextTitle}${customTitle}`;
        }
      }(document.getElementsByClassName("forumtopic_reply_textarea"),
        document.getElementsByClassName("forum_topic_input"),
        document.getElementsByClassName("responsive_OnClickDismissMenu")));
      return;
    }
    CYStext = JSON.stringify([
      `${haveListText}` +
            "\n" +
            `${wantListText}`,
      `${haveListTextTitle}${wantListTextTitle}`,
      window.location.pathname.split("/")[4],
      Date.now()
    ]);
    Debugger.log({ CYStext: JSON.parse(CYStext) });
    CYSstorage.storageSet(CYStext);
    const AugmentedSteam = document.querySelectorAll("a.es_visit_tforum[href^=\"https://steamcommunity.com\"]");
    if (!AugmentedSteam.length) {
      const a = document.createElement("a");
      a.className = "btn_grey_grey btn_medium";
      a.href = `https://steamcommunity.com/app/${window.location.pathname.split("/")[4]}/tradingforum/`;
      a.innerHTML = "<span>Visit Trade Forum</span>";
      a.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
      document.getElementsByClassName("gamecards_inventorylink")[0].appendChild(a);
      return;
    }
    AugmentedSteam[0].style.backgroundColor = "rgba(255, 0, 0, 0.3)";
  }

  function readInfo(cardInfo, calcTrade, CYSstorage, foil) {
    const info = cardInfo;
    Debugger.log({ info });
    if (!info.cardCheck) {
      alert("(CYS) Something is wrong, please try setting your Language in the script settings manually\n" +
                "Or try enabling useForcedFetch");
    }
    // Raw number of total sets
    const setDiff = info.total / info.set;
    // Lowest number of card sets based on the quantity of total cards
    const lowestNumset = Math.floor(setDiff);
    // User has the exact number of cards to make card sets full
    const isFullSet = Number.isInteger(setDiff);
    let numSet, tradeNeed = false;

    // Returns the numbers of cards user needs to complete the sets
    function remainCards(a) {
      return (Math.abs(info.total - (info.set * a)));
    }

    if (fullSetTarget !== 0) {
      numSet = fullSetTarget;
      tradeNeed = Boolean(lowestNumset < numSet || (lowestNumset === numSet && info.qtyDiff));
      Debugger.log(`Target Set :${fullSetTarget}`);
      if (!tradeNeed) {
        const message = "Script stopped since you've reached this target already";
        Debugger.log(message);
        DisplayText.success(message);
      } else {
        const message = `You need ${remainCards(numSet)} more card(s) to get ${numSet} full set(s)`;
        Debugger.warn(message);
        DisplayText.default(message);
      }
    } else { // No custom target set was defined
      let remainSet;
      switch (fullSetMode) {
      // Card lister mode
      case 0:
        numSet = 0;
        tradeNeed = true;
        Debugger.warn("Card lister mode");
        DisplayText.default("Card lister mode");
        break;
      // Only check for game set that you have enough cards to make it full
      case 1:
        if (lowestNumset === 0) { // Don't have enough cards
          const message = "You don't have enough cards for a full set";
          Debugger.log(message);
          DisplayText.default(message);
        } else if (isFullSet && info.qtyDiff) { // Have exact numbers, but need trading
          numSet = lowestNumset;
          tradeNeed = true;
          const message = `Your cards are enough to get ${numSet} full set(s)`;
          Debugger.log(message);
          DisplayText.success(message);
        } else if (info.qtyDiff && lowestNumset > 1) {
          // fullSetStacked = false; Will check for the nearest number of your card set, even if you have enough cards to have 2, 3 more set
          numSet = (fullSetStacked) ? lowestNumset : info.lowestQty + 1;
          tradeNeed = true;
          const remains = Object.values(info.objCards).filter(function (card) {
            return card.quantity === info.lowestQty;
          }).length;
          const message = (fullSetStacked) ? `Your cards are enough to get ${numSet} full set(s)` : `You need to trade ${remains} card(s) for the next full set - ${lowestNumset} sets in total`;
          Debugger.log(message);
          DisplayText.success(message);
        } else {
          const message = "You don't have enough cards for a full set";
          Debugger.log(message);
          DisplayText.default(message);
        }
        break;
      // Complete your remainng set
      case 2:
        remainSet = Boolean(!isFullSet || (isFullSet && info.qtyDiff));
        if (remainSet) {
          numSet = (fullSetStacked) ? lowestNumset + 1 : info.lowestQty + 1;
          tradeNeed = true;
          const message = (isFullSet)
            ? `You have enough cards to get ${lowestNumset} full set(s)`
            : (setDiff === 1)
              ? `You need ${remainCards(numSet)} more card(s) to get ${numSet} full set(s)`
              : (setDiff > 1)
                ? `You have enough cards to get ${lowestNumset} full set(s) | You need ${remainCards(lowestNumset + 1)} more card(s) to get the next full set`
                : `You need ${remainCards(numSet)} more card(s) to get ${numSet} full set(s)`;
          Debugger.log(message);
          if (isFullSet || setDiff > 1) {
            DisplayText.success(message);
          } else {
            DisplayText.default(message);
          }
        } else {
          if (fullSetUnowned) {
            numSet = Math.floor(setDiff + 1);
            tradeNeed = true;
            if (remainCards(numSet) !== info.set && info.qtyDiff) {
              const message = `You need ${remainCards(numSet)} more card(s) to get ${numSet} full set(s)`;
              Debugger.log(message);
              DisplayText.default(message);
            } else {
              const message = (info.qtyDiff) ? "You have enough cards to get a full set" : "You need a whole full set";
              Debugger.log(message);
              if (info.qtyDiff) {
                DisplayText.success(message);
              } else {
                DisplayText.default(message);
              }
            }
          } else {
            numSet = lowestNumset;
            const message = "You need a whole full set - " +
            "Script stopped according to your configurations (fullSetUnowned = false)";
            Debugger.warn(message);
            DisplayText.default(message);
          }
        }
        break;
      }
    }
    calcTrade(info, numSet, tradeNeed, CYSstorage, foil);
  }

  function inTrade(CYSstorage, disBtn) {
    if (disBtn.length === 0) {
      return;
    }
    disBtn[0].click();
    document.getElementsByClassName("forumtopic_reply_textarea")[0].value = CYSstorage.storageItem(0) + customBody;
    document.getElementsByClassName("forum_topic_input")[0].value = CYSstorage.storageItem(1) + customTitle;
    setTimeout(function () {
      CYSstorage.storageClear();
    }, 1000);
  }

  function getStorage(mode) {
    let storageItem, storageInv, storageClear, storageSet;

    if (!mode) {
      storageInv = function () {
        return Boolean(typeof GM_getValue("CYS-STORAGE") !== "undefined" && GM_getValue("CYS-STORAGE").length > 0);
      };
      storageItem = function (index) {
        return JSON.parse(GM_getValue("CYS-STORAGE"))[index];
      };
      storageClear = function () {
        GM_deleteValue("CYS-STORAGE");
        Debugger.log("GM Storage Cleared");
      };
      storageSet = function (content) {
        GM_setValue("CYS-STORAGE", content);
        Debugger.log("Done storing trade info in GM Storage");
      };
    } else {
      storageInv = function () {
        return Boolean(window.localStorage.cardTrade !== undefined && window.localStorage.cardTrade.length > 0);
      };
      storageItem = function (index) {
        return JSON.parse(localStorage.cardTrade)[index];
      };
      storageClear = function () {
        window.localStorage.removeItem("cardTrade");
        Debugger.log("Local Storage Cleared");
      };
      storageSet = function (content) {
        window.localStorage.cardTrade = content;
        Debugger.log("Done storing trade info in Local Storage");
      };
    }
    return {
      storageInv,
      storageItem,
      storageClear,
      storageSet
    };
  }

  function passiveFetch(lang, appID, CYSstorage, foil) {
    const checkURL1 = "https://steamcommunity.com/profiles/";
    const checkURL2 = "https://steamcommunity.com/id/";
    const steamID = (function () {
      const pattn = [/steamRememberLogin=(\d{17})/, /\/steamcommunity.com\/(?:id|profiles)\/([\w-_]+)\//];
      let tempID = null,
        userAva = document.getElementsByClassName("user_avatar");
      if (/^\d{17}$/.test(steamID64)) {
        tempID = steamID64;
      } else if (/^[\w-_]+$/.test(customSteamID)) {
        tempID = customSteamID;
      } else if (document.cookie.match(pattn[0])) {
        tempID = document.cookie.match(pattn[0])[1];
      } else if (userAva.length > 0) {
        if (userAva[0].href.match(pattn[1])) {
          tempID = userAva[0].href.match(pattn[1])[1];
        }
      }
      return tempID;
    }());
    if (steamID === null) {
      alert("(CYS) SteamID not set, failed to get it from cookies\n" +
                "Cannot perform fetching your cards data\nPlease try setting your steamID manually");
      return;
    }
    Debugger.log(`Your SteamID = ${steamID}`);
    const URL = (/^7656119[0-9]{10}$/.test(steamID)) ? `${checkURL1}${steamID}` : `${checkURL2}${steamID}`;
    let resURL;
    fetch(`${URL}/gamecards/${appID}/${ (foil) ? `?border=1&l=${lang}` : `?l=${lang}`}`, {
      method: "GET",
      mode: "same-origin"
    }).then(function (response) {
      resURL = response.url;
      Debugger.log(`Getting data from ${resURL}...`);
      return response.text();
    })
      .then(function (text) {
        if (!resURL.match(`/gamecards/${appID}`) && resURL.match("/?goto=")) {
          alert("(CYS) Something might not be right\nPlease try again or doing it manually " +
                        "if your trade data is not right");
        }
        const gameCardPage = document.createElement("div");
        gameCardPage.innerHTML = text;
        readInfo(getInfo(gameCardPage, lang), calcTrade, CYSstorage, foil);
      })
      .catch(function (error) {
        alert("(CYS) Something went wrong, cannot fetch data, please try doing it manually");
        Debugger.warn("Cannot fetch data, please try doing it manually", error);
      });
  }

  function fetchButton(lang, appID, CYSstorage) {
    const rightbox = document.getElementsByClassName("rightbox");
    const tradeofBtn = document.getElementsByClassName("forum_topic_tradeoffer_button_ctn");
    const inForum = Boolean(/\/(?:tradingforum|tradingforum\/)$/.test(window.location.href));
    if (!inForum && tradeofBtn.length === 0) {
      return;
    }
    const container = (inForum) ? rightbox[0] : tradeofBtn[0];
    const content = document.createElement("div");
    content.className = "content";
    const a = document.createElement("a");
    a.className = "btn_darkblue_white_innerfade btn_medium";
    a.innerHTML = "<span>Fetch Info</span>";
    content.appendChild(a);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "cysfoil";
    checkbox.id = "foil-checkbox";
    content.appendChild(checkbox);
    const label = document.createElement("Label");
    label.setAttribute("for", checkbox.id);
    label.innerHTML = "Foil";
    content.appendChild(label);
    if (inForum) {
      const rule = document.createElement("div");
      rule.className = "rule";
      container.insertBefore(content, container.insertBefore(rule, container.firstChild));
    } else {
      container.style.display = "inline-flex";
      content.style.marginLeft = "2px";
      container.insertBefore(content, container.lastChild);
    }
    a.onclick = function () {
      passiveFetch(lang, appID, CYSstorage, checkbox.checked);
    };
  }

  function getUserLang(testEl) {
    if (testEl.length === 0) {
      return false;
    }
    let tempLang = null;
    const msgLang = "Couldn't detect you current language using cookies\n" +
            "Or your language setting in the script not right\n" +
            "Please set your Language in the script settings then try again";
    const cookieLang = document.cookie.match(/Steam_Language=(\w+)/);
    if (yourLanguage.length > 0) {
      tempLang = yourLanguage;
    } else {
      tempLang = (cookieLang) ? cookieLang[1] : null;
    }
    if (tempLang !== null && Object.keys(langList).indexOf(tempLang) > -1) {
      Debugger.log(`Your current language: ${tempLang}`);
    } else {
      tempLang = null;
    }
    if (useForcedFetch) {
      tempLang = "fetch";
    }
    if (!tempLang) {
      if (!useForcedFetchBackup) {
        alert("(CYS) Forced Fetch disable\n" + msgLang);
        return false;
      }
      tempLang = "fetch";
      Debugger.warn(msgLang);
    }
    return tempLang;
  }

  function configCheck(condi, value) {
    return condi.some(function (config) {
      return config === value;
    });
  }

  function initialize() {
    let useStorage = useLocalStorage,
      CYSstorage = {},
      userLang;

    const numChecks = [
        !(Number.isInteger(fullSetTarget) && fullSetTarget >= 0),
        [1, 2].indexOf(tradeTag) === -1,
        [0, 1, 2].indexOf(tradeMode) === -1,
        [0, 1, 2].indexOf(fullSetMode) === -1,
        typeof useLocalStorage !== "boolean",
        typeof showQtyInTitle !== "boolean",
        typeof fullSetUnowned !== "boolean",
        typeof fullSetStacked !== "boolean",
        typeof useForcedFetch !== "boolean",
        typeof useForcedFetchBackup !== "boolean",
        typeof debugMode !== "boolean"
      ],
      GMChecks = [
        typeof GM_setValue !== "undefined",
        typeof GM_getValue !== "undefined",
        typeof GM_deleteValue !== "undefined"
      ];

    if (configCheck(numChecks, true)) {
      alert("(CYS) - Invalid Config Settings\nPlease Check Again!");
      return;
    }
    if (!useStorage && configCheck(GMChecks, false)) {
      useStorage = true;
      Debugger.warn("GM functions are not defined - Switch to use HTML5 Local Storage instead");
    }
    CYSstorage = getStorage(useStorage);

    if (/\/gamecards\//.test(window.location.pathname)) {
      const displayText = document.createElement("div");
      const badgeDetail = document.getElementsByClassName("badge_detail_tasks")[0];

      displayText.id = "cys_display";
      displayText.textContent = "(CYS) initialize...";
      displayText.style.textAlign = "center";
      displayText.style.color = "yellow";
      displayText.style.paddingBottom = "24px";
      badgeDetail.insertBefore(displayText, document.getElementsByClassName("gamecards_inventorylink")[0]);

      userLang = getUserLang(document.getElementsByClassName("gamecards_inventorylink"));

      if (!userLang) {
        return;
      }
      if (CYSstorage.storageInv()) {
        CYSstorage.storageClear();
      }
      const badgeType = Boolean(/border=1/.test(window.location.href));
      if (userLang === "fetch") {
        Debugger.log("Forced Fetch Mode is ON");
        userLang = "english";
        Debugger.log(`Your current language: ${userLang}`);
        passiveFetch(userLang, window.location.pathname.split("/")[4], CYSstorage, badgeType);
      } else {
        readInfo(getInfo(document, userLang), calcTrade, CYSstorage, badgeType);
      }
    }
    if (/\/tradingforum/.test(window.location.pathname)) {
      userLang = getUserLang(document.getElementsByClassName("user_avatar"));
      if (!userLang) {
        return;
      }
      if (userLang === "fetch") {
        userLang = "english";
        Debugger.log("Forced Fetch Mode is ON");
        Debugger.log(`Your current language: ${userLang}`);
      }
      fetchButton(userLang, window.location.pathname.split("/")[2], "fetch");
      if (!CYSstorage.storageInv()) {
        Debugger.log("No Stored Trade Info In Storage");
        return;
      }
      if ((new RegExp(CYSstorage.storageItem(2))).test(window.location.pathname)) {
        const storedTime = Date.now() - CYSstorage.storageItem(3);
        Debugger.log(`Time: ${storedTime}ms`);
        if (storedTime > 21600000) {
          if (window.confirm("It's been more than 6 hours since you checked your cards\n" +
                            "You can go back to your GameCard Page or do an info Fetch,\n" +
                            "since your stored trade info might be outdated\n" +
                            "Hit OK will take you go back to your GameCard Page")) {
            window.open(`https://steamcommunity.com/my/gamecards/${CYSstorage.storageItem(2)}`, "_blank");
            return;
          }
        }
        setTimeout(function () {
          inTrade(CYSstorage, document.getElementsByClassName("responsive_OnClickDismissMenu"));
        }, 1000);
      }
    }
  }
  initialize();
}());
