// ==UserScript==
// @name  MyMHAid
// @namespace  https://greasyfork.org/en/users/39779
// @version  2.1.66.26.38
// @description  My aid 4 mh.
// @author  Elie
// @match  http://mousehuntgame.com/*
// @match  https://mousehuntgame.com/*
// @match  http://www.mousehuntgame.com/*
// @match  https://www.mousehuntgame.com/*
// @match  http://www.mousehuntgame.com/camp.php*
// @match  https://www.mousehuntgame.com/camp.php*
// @match  http://apps.facebook.com/mousehunt/*
// @match  https://apps.facebook.com/mousehunt/*
// @icon  https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @require  https://code.jquery.com/jquery-2.2.2.min.js
// @require  https://greasyfork.org/scripts/7601-parse-db-min/code/Parse%20DB%20min.js?version=132819
// @require  https://greasyfork.org/scripts/16046-ocrad/code/OCRAD.js?version=100053
// @require  https://greasyfork.org/scripts/16036-mh-auto-kr-solver/code/MH%20Auto%20KR%20Solver.js?version=102270
// @license  GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @grant  unsafeWindow
// @grant  GM_info
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/483607/MyMHAid.user.js
// @updateURL https://update.greasyfork.org/scripts/483607/MyMHAid.meta.js
// ==/UserScript==

/* eslint-disable */
/** MouseHunt base url */
const MOUSEHUNT_BASE_URL = 'https://www.mousehuntgame.com/';
const MapClasses = { treasuer: 'treasure', poster: 'poster', event: 'event' };
const allSnuids = {
  angel: '100000656351135',
  angela: '100000556925297',
  angelie: '100000724831315',
  anthony: '100000612521913',
  levine: '100000578963305',
  elie: '1842354617',
  kelly: '100001064572224',
  kevin: '100000636731698',
  kitty: '100000541126764',
  levi: '1142000722517150',
  lydia: 'hg_8222e273c0d07aa036e56ed17a8f7884',
  mary: '100000520204559',
  mina: '100000669404954',
  monica: '100000633987931',
  nina: '100000473806593',
  pola: '100000062975901',
  raphael: '468834843316798',
  rose: '100000533948473',
  hsilung: '100000122134338',
  van: '100000096968840',
  vera: 'hg_7b359afdc278e154c3c6f5c6a2f1ba31',
  vivienne: '100000638927202',
  weyl: '1794714531',
  vanne: '100000438303274',
  riem: 'hg_d783ff747d3b60073ef541d335ff901d',
  kaze: 'hg_1602095c6c0a2376b3bbb12e417df9a4',
  sky: 'hg_3207d1fd7e0a8bca4bdef74c378a6a32',
  shall: 'hg_81538b33309a53ae077d5f01f53f6c06',
  furt: 'hg_62a01c775dd2fe8670b6cb46b31c1318',
  feyn: 'hg_2d25dd402e32439c658e10b62d1d64bf',
  rebec: 'hg_3aee6d83ca43348e580141870193b531',
  renee: 'hg_91cbc542b246f2f8b4f0f3b446915199',
  haru: 'hg_5eeb1174c05069baa7fa40bd82897130',
  Umr: 'hg_52952f2bb5ff36565d7936529f156349',
  scent: 'hg_219f8417793705b8bfe8c4a01ecce1fc',
  stein: 'hg_9ab9014e7b20bd60ce4a31485651e008'
};
/** ERROR CHECKING ONLY: Script debug */
const isDebug = true;
/** Utilities */
const MyUtils = (function () {
  const utils = {
    /**
     * logging function.
     * Invoke console.log with customization.
     * @param  {...any} logs
     */
    logging(...any) {
      if (isDebug) {
        console.groupCollapsed(new Date(), ...any);
        // console.log(Error().stack);
        console.trace(...any);
        console.groupEnd();
      }
    },
    /**
     * Format date to ISO date string format yyyy-MM-dd.
     * Return today's date string if no argument
     */
    toISODateString(date) {
      const d = date ? date : new Date();
      return d.toLocaleDateString('en-CA');
    },
    /** Remove any comma in number expression and then parse to integer
     * return 0 if argument is null or isNaN(after remove comma)
     */
    parseQuantity(qty) {
      const strQty = ((qty || 0) + '').trim();
      const rtn = parseInt(strQty.replaceAll(',', ''));
      return Number.isNaN(rtn) ? 0 : rtn;
    },
    /** trim string or number, to empty if null or undefined */
    trimToEmpty(str) {
      return this.trimToDefault(str);
    },
    /** trim string or number, to default if null or undefined */
    trimToDefault(str, deflt) {
      return str === 0 ? '0' : ((str || (deflt ? deflt : '')) + '').trim();
    },
    /** get a integer between min and max */
    getRandomInteger(min, max) {
      return parseInt(min + Math.random() * (max - min));
    },
    /** create new array containing distinct element of original array */
    distinctArray(array) {
      const rtn = [];
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (rtn.indexOf(element) < 0) rtn.push(element);
      }
      return rtn;
    },
    /**
     * Check if argument is null or undefined
     * or string of both.
     * Not including empty string.
     * @param {*} obj
     * @return true if argument is null
     * or undefined or string of both.
     */
    isNullOrUndefined(obj) {
      return (
        obj === null ||
        obj === undefined ||
        obj === 'null' ||
        obj === 'undefined'
      );
    },
    /**
     * 用 keyName從 localStorage getItem.
     * 如果取出來的字串 isNullOrUndefined,
     * 將 objDefault stringify存回 localStorage.
     * json parse取出的字串成物件 obj.
     * 將 obj與 objDefault比對屬性,
     * obj如果有缺少 objDefault的屬性,
     * 將缺少的屬性從 objDefault copy給obj後回寫 localStorage.
     * @param {String} keyName
     * @param {*} objDefault
     * @return {*} json parse後的物件
     */
    getStorageToObject(keyName, objDefault) {
      let obj = this.getStorage(keyName);
      let bCheckNewProp = true;
      if (this.isNullOrUndefined(obj)) {
        obj = JSON.stringify(objDefault);
        this.setStorage(keyName, obj);
        bCheckNewProp = false;
      }
      obj = JSON.parse(obj);
      if (bCheckNewProp) {
        if (this.assignMissingDefault(obj, objDefault)) {
          this.setStorage(keyName, JSON.stringify(obj));
        }
      }
      return obj;
    },
    /**
     * if the web browser support HTML5 storage,
     * 用 name作為 key從 localStorage中 getItem.
     * @param {String} name key name
     * @return
     */
    getStorage(name) {
      if (
        'localStorage' in window &&
        !this.isNullOrUndefined(window.localStorage)
      ) {
        return window.localStorage.getItem(name);
      }
    },
    /** if the web browser support HTML5 storage, store it */
    setStorage(name, value) {
      if (
        'localStorage' in window &&
        !this.isNullOrUndefined(window.localStorage)
      ) {
        window.localStorage.setItem(name, value);
      }
    },
    /**
     * 將 objDefault中有但 obj沒有的屬性 copy給 obj
     * @param {*} obj
     * @param {*} defaultObj
     * @return {Boolean} if any property copied
     */
    assignMissingDefault(obj, defaultObj) {
      let isResave = false;
      for (const key in defaultObj) {
        if (
          Object.prototype.hasOwnProperty.call(defaultObj, key) &&
          !Object.prototype.hasOwnProperty.call(obj, key)
        ) {
          const element = defaultObj[key];
          obj[key] = element;
          isResave = true;
        }
      }
      return isResave;
    },
    /**
     * Parse datetime or time str to datetime in milliseconds.
     * Prepend today's Date if str is time expression(without T or start with T).
     * Express UTC time with Z at end.
     */
    parseDateTime(str) {
      if (this.trimToEmpty(str) === '') return null;
      if (str.indexOf('T') === 0)
        return Date.parse(this.toISODateString() + str);
      if (str.indexOf('T') > 0) return Date.parse(str);
      return Date.parse(this.toISODateString() + 'T' + str);
    }
  };
  return utils;
})();
/** Mousehunt Utils */
const MhUtils = (function () {
  const mhUtils = {
    /** Cheese names for arming */
    cheeseNames: {
      brie: 'Brie Cheese',
      gouda: 'Gouda Cheese',
      brieString: 'Brie String',
      ancient: 'Ancient Cheese',
      radio: 'Radioactive Blue',
      rancid: 'Rancid Radioactive Blue'
    },
    /** whether stagger horn and check */
    isStaggerHornCheck: localStorage['isStaggerHornCheck'] === 'true',
    /**
     * Get current enviroment type(location key).
     * @return {String} current enviroment type
     */
    getEnvironmentType() {
      const rtn = MyUtils.trimToEmpty(user.environment_type);
      // console.plog(`Current location environment_type: ${rtn}`);
      return rtn;
    },
    /** Request, parse, and cache gold/points/wisdom values */
    updateGPWStats(isUpdateWisdom) {
      const storageKey = 'MyMhGPWStats';
      if (!isUpdateWisdom) {
        this.updateGPStats(true);
        return;
      }
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        'https://www.mousehuntgame.com/item.php?item_type=wisdom_stat_item'
      );
      xhr.onload = function () {
        const data = xhr.responseText;
        const parser = new DOMParser();
        const dom = parser.parseFromString(data, 'text/html');
        const wisdomItem = dom.querySelector('.itemView-sidebar-quantity');
        if (wisdomItem) {
          const wisdomText = wisdomItem.textContent
            .split('Own: ')[1]
            .replace(/,/g, '');
          const wisdom = parseInt(wisdomText);
          const gpwValues = mhUtils.updateGPStats(false);
          const wisdoms = gpwValues.wisdom;
          const oldWisdom = wisdoms[0]; // updateGPStats use last wisdom as latest
          if (oldWisdom === parseInt(wisdom)) return;
          wisdoms[0] = wisdom;
          if (wisdoms.length > 5) wisdoms.splice(5);
          const checkAt = gpwValues.checkAt;
          checkAt[0] = Date.now();
          if (checkAt.length > 5) checkAt.splice(5);
          localStorage.setItem(storageKey, JSON.stringify(gpwValues));
          // render(false);
        }
      };
      xhr.onerror = function () {
        console.error(xhr.statusText);
      };
      xhr.send();
    },
    /** Request, parse, and cache gold/points/wisdom values, use last wisdom as latest */
    updateGPStats(isSave) {
      const storageKey = 'MyMhGPWStats';
      const defaultValues = {
        gold: [-1, -1],
        points: [-1, -1],
        wisdom: [-1, -1],
        checkAt: [null, null]
      };
      const usr = user;
      const gpwStats = localStorage.getItem(storageKey);
      const tmpGpw = gpwStats ? JSON.parse(gpwStats) : defaultValues;
      // 如果是舊的資料型態就覆蓋掉
      const gpwValues = tmpGpw.previousGold ? defaultValues : tmpGpw;
      const gold = gpwValues.gold;
      gold.unshift(parseInt(usr.gold));
      if (gold.length > 5) gold.splice(5);
      const points = gpwValues.points;
      points.unshift(parseInt(usr.points));
      if (points.length > 5) points.splice(5);
      const wisdoms = gpwValues.wisdom;
      wisdoms.unshift(wisdoms[0]);
      if (wisdoms.length > 5) wisdoms.splice(5);
      const checkAt = gpwValues.checkAt;
      checkAt.unshift(Date.now());
      if (checkAt.length > 5) checkAt.splice(5);
      if (isSave) {
        localStorage.setItem(storageKey, JSON.stringify(gpwValues));
        // render(false);
      }
      return gpwValues;
    },
    /**
     * Parse trap string.
     * Resolve trapName with leading 'best.' from objBestTrap.
     * Otherwise split trapName by ','.
     *
     * @param {String} trapName
     * @return {Array<String>} Resolved trap array.
     */
    parseTrapName(trapName) {
      // TODO best.weapon.arcane的best段改成用來放 arming sort
      MyUtils.logging('trap name before parse: ', trapName);
      let rtn;
      if (MyUtils.isNullOrUndefined(trapName) || trapName == '') {
        rtn = [''];
        MyUtils.logging('empty trap name after parse: ', rtn);
        return rtn;
      }
      if (Array.isArray(trapName)) return trapName;
      if (trapName.indexOf('best.') == 0) {
        const temp = trapName.split('.');
        rtn = objBestTrap[temp[1]][temp[2]];
        MyUtils.logging('best trap after parse: ', rtn);
        return rtn;
      }
      rtn = trapName.split(',');
      // 避免逗號前後有空白
      for (let index = 0; index < rtn.length; index++) {
        rtn[index] = rtn[index].trim();
      }
      MyUtils.logging('trap name split by comma after parse: ', rtn);
      return rtn; // return arr.length > 1 ? arr : arr[0];
    },
    /**
     * 處理訊息顯示並延遲 1秒後執行 reloadPage(soundHorn)
     * @param {String} msg msg displayed on title.
     * @param {Boolean} soundHorn is soundHorn or not
     */
    reloadWithMessage(msg, soundHorn) {
      console.plog('reloadWithMessage: ', msg, ',', soundHorn);
      // display the message
      this.displayTimer(msg, msg, msg);
      // reload the page
      setTimeout(function () {
        mhUtils.reloadPage(soundHorn);
      }, 1000);
    },
    /**
     * 根據是否顯示於標題列及是否顯示 timer,
     * 處理要顯示的訊息.
     * @param {*} title 標題列要顯示的訊息
     * @param {*} nextHornTime 下次 soundHorn還有多久
     * @param {*} checkTime 下次 trap check還有多久
     */
    displayTimer(title, nextHornTime, checkTime) {
      if (showTimerInTitle) {
        document.title = title;
      }
      if (showTimerInPage) {
        nextHornTimeElement.innerHTML =
          '<b>Next Hunter Horn Time:</b> ' + nextHornTime;
        checkTimeElement.innerHTML =
          '<b>Next Trap Check Time:</b> ' + checkTime;
      }
    },
    /**
     * 應該是很舊的程式碼了,用 location.href sound horn.
     * 如果 soundHorn為 true,連 turn.php sound horn.
     * 如果 soundHorn為 false,連遊戲首頁
     * 註解掉用 turn.php sound horn的部分(太老舊了),
     * 此方法只剩 soundHorn == false的功能.
     * @param {Boolean} soundHorn
     */
    reloadPage(soundHorn) {
      // reload the page
      if (fbPlatform) {
        // for Facebook only
        if (secureConnection) {
          if (soundHorn) {
            // window.location.href = 'https://www.mousehuntgame.com/canvas/turn.php';
          } else {
            window.location.href = 'https://www.mousehuntgame.com/canvas/';
          }
        } else {
          if (soundHorn) {
            // window.location.href = 'http://www.mousehuntgame.com/canvas/turn.php';
          } else {
            window.location.href = 'http://www.mousehuntgame.com/canvas/';
          }
        }
      } else if (hiFivePlatform) {
        // for Hi5 only
        if (secureConnection) {
          if (soundHorn) {
            // window.location.href = 'https://mousehunt.hi5.hitgrab.com/turn.php';
          } else {
            window.location.href = 'https://mousehunt.hi5.hitgrab.com/';
          }
        } else {
          if (soundHorn) {
            // window.location.href = 'http://mousehunt.hi5.hitgrab.com/turn.php';
          } else {
            window.location.href = 'http://mousehunt.hi5.hitgrab.com/';
          }
        }
      } else if (mhPlatform) {
        // for mousehunt game only
        window.location.href =
          'http' + (secureConnection ? 's' : '') + '://www.mousehuntgame.com/';
        /* window.location.href =
      'http' +
      (secureConnection ? 's' : '') +
      '://www.mousehuntgame.com/camp.php'; */
        /* if (secureConnection) {
      if (soundHorn) {
        // window.location.href = 'https://www.mousehuntgame.com/turn.php';
      } else {
        window.location.href = 'https://www.mousehuntgame.com/';
      }
    } else {
      if (soundHorn) {
        // window.location.href = 'http://www.mousehuntgame.com/turn.php';
      } else {
        window.location.href = 'http://www.mousehuntgame.com/';
      }
    } */
      }
    },
    /** get sn_user_id */
    getSnUserId() {
      return MyUtils.trimToEmpty(user.sn_user_id);
    },
    /**
     * Get current bait name.
     * @return {String} current bait name
     */
    getBaitName() {
      return MyUtils.trimToEmpty(user.bait_name);
    },
    /**
     * Get current bait item id.
     * @return {BigInt} current bait item id
     */
    getBaitItemId() {
      return MyUtils.parseQuantity(user.bait_item_id);
    },
    /**
     * Get current bait quantity.
     * @return {BigInt} current bait quantity
     */
    getBaitQuantity() {
      return MyUtils.parseQuantity(user.bait_quantity);
    },
    /**
     * Get current charm name.
     * @return {String} current charm name
     */
    getCharmName() {
      return MyUtils.trimToEmpty(user.trinket_name);
    },
    /**
     * Get current charm item id.
     * @return {BigInt} current charm item id
     */
    getCharmItemId() {
      return MyUtils.parseQuantity(user.trinket_item_id);
    },
    /**
     * Get current charm quantity.
     * @return {BigInt} current charm quantity
     */
    getCharmQuantity() {
      return MyUtils.parseQuantity(user.trinket_quantity);
    },
    /** close any js dialog */
    closeAnyJsDialog() {
      $(
        'input.jsDialogClose,a.jsDialogClose,#jsDialogClose,a.closeButton,a.messengerUINotificationClose,a.giftSelectorView-inboxHeader-closeButton'
      ).click();
    },
    /**
     * Query item quantity by http get and then execute callback
     * @param {string} itemType
     * @param {Function} callback
     * @param {Boolean} isAlwaysCallback true if run callback even when qty is NaN or 0
     */
    getQuantityByUrlThen(itemType, callback, isAlwaysCallback) {
      const url = MOUSEHUNT_BASE_URL + 'item.php?item_type=' + itemType;
      $.get(url, (data) => {
        const key = 'You Own: ';
        const text = data.split(key)[1];
        const key2 = '</div>';
        const endIndex = text.indexOf(key2);
        const qtyText = text.substring(0, endIndex).trim();
        MyUtils.logging(qtyText);
        const qty = MyUtils.parseQuantity(qtyText.split('/')[0]);
        if (!isAlwaysCallback && (Number.isNaN(qty) || qty < 1)) return;
        if (callback) callback(qty);
      });
    },
    /**
     * Find a working map by map_class
     * @param {String} mapClass
     * @returns
     */
    getMapByClass(mapClass) {
      const maps = user.quests.QuestRelicHunter.maps;
      for (let i = 0; i < maps.length; i++) {
        const element = maps[i];
        if (element.map_class == mapClass) {
          return element;
        }
      }
      return null;
    },
    /**
     * Reduced native completeTransaction
     * @param {Boolean} isPurchase
     * @param {String} itemType
     * @param {BigInt} itemQuantity
     * @param {Boolean} isKingsCartItem
     * @param {Function} success
     */
    completeTransaction(
      isPurchase,
      itemType,
      itemQuantity,
      isKingsCartItem,
      success
    ) {
      if (itemQuantity < 1) {
        console.plog('Cannot buy 0 item');
        return;
      }
      const uniqueHash = user.unique_hash;
      $.ajax({
        data: {
          type: itemType,
          quantity: itemQuantity,
          buy: isPurchase ? 1 : 0,
          is_kings_cart_item: isKingsCartItem ? 1 : 0,
          uh: uniqueHash
        },
        dataType: 'json',
        type: 'post',
        url: MOUSEHUNT_BASE_URL + 'managers/ajax/purchases/itempurchase.php',
        success: function (data) {
          console.log(data.success, data);
          eventRegistry.doEvent('ajax_response', data);
          if (success) success();
        },
        error: function (data) {
          const message = `completeTransaction for ${itemType} error`;
          popupMessage(message);
          localStorage.setItem(storingMessageKey, message);
          console.plog(data);
        }
      });
    },
    /**
     * Wrapping complete transaction codes in promise
     * @param {Boolean} isBuy
     * @param {String} itemType
     * @param {BigInt} itemQty
     * @param {Boolean} isKCItem
     */
    completeTransactionPromise(isBuy, itemType, itemQty, isKCItem) {
      return new Promise((resolve, reject) => {
        const uniqueHash = user.unique_hash;
        if (itemQty > 0)
          $.ajax({
            data: {
              type: itemType,
              quantity: itemQty,
              buy: isBuy ? 1 : 0,
              is_kings_cart_item: isKCItem ? 1 : 0,
              uh: uniqueHash
            },
            dataType: 'json',
            type: 'post',
            url: callbackurl + 'managers/ajax/purchases/itempurchase.php',
            success: function (data) {
              console.log('success', data.success, data);
              eventRegistry.doEvent('ajax_response', data);
              if (resolve) resolve(data);
            },
            error: reject
          });
        else {
          console.log('Ignore 0 quantity');
          if (resolve) resolve({ success: 0 });
        }
      });
    },
    /** Buy Scroll in Treasure Map Shop */
    purchaseItem(itemType, environmentType, successCallback) {
      $.ajax({
        data: {
          type: itemType,
          quantity: 1,
          buy: 1,
          is_kings_cart_item: environmentType == 'kings_arms' ? 1 : 0,
          environment_type: environmentType,
          uh: user.unique_hash
        },
        dataType: 'json',
        type: 'post',
        url: MOUSEHUNT_BASE_URL + 'managers/ajax/purchases/itempurchase.php',
        success: function (data) {
          eventRegistry.doEvent('ajax_response', data);
          if (data.success) {
            // var itemData = arrayFindValueByKey(data.inventory, 'type', itemType);
            // if (successCallback) {
            //   successCallback(itemData);
            // }
            if (successCallback) successCallback(data);
          } else if (data.error_title) {
            const popup = new jsDialog();
            popup.setTemplate('error');
            popup.addToken('{*title*}', data.error_title);
            popup.addToken('{*content*}', data.error_message);
            popup.show();
          } else {
            this.error();
          }
        },
        error: function () {
          const popup = new jsDialog();
          popup.setTemplate('error');
          popup.addToken('{*title*}', 'Uh oh.');
          popup.addToken(
            '{*content*}',
            'Something went wrong! Please try again.'
          );
          popup.show();
        }
      });
    }
  };
  return mhUtils;
})();
// == Basic User Preference Setting (Begin) ==
// // The variable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.
/** ERROR CHECKING ONLY: KR debug */
let debugKR = false;

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 10 - 360
let hornTimeDelayMin = 20;
let hornTimeDelayMax = 240;

// // Bot aggressively by ignore all safety measure such as check horn image visible before sounding it. (true/false)
// // Note: Highly recommended to turn off because it increase the chances of getting caught in botting.
// // Note: It will ignore the hornTimeDelayMin and hornTimeDelayMax.
// // Note: It may take a little bit extra of CPU processing power.
let aggressiveMode = false;

// // Enable trap check once an hour. (true/false)
let enableTrapCheck = true;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
let trapCheckTimeDiff = 15;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
let checkTimeDelayMin = 15;
let checkTimeDelayMax = 120;

// // Play sound when encounter king's reward (true/false)
let isKingWarningSound = false;

// // Which sound to play when encountering king's reward (need to be .mp3)
let kingWarningSound =
  'https://raw.githubusercontent.com/nobodyrandom/libs/master/resource/horn.mp3';

// // Which email to send KR notiff to (leave blank to disable feature)
let kingRewardEmail = '';

// // Which number to send SMS to
let kingRewardPhone = '';

// // Verification code sent to this number
let kingRewardPhoneVerify = '';

// // Play sound when no more cheese (true/false)
let isNoCheeseSound = false;

// // Reload the the page according to kingPauseTimeMax when encountering King Reward. (true/false)
// // Note: No matter how many time you refresh, the King's Reward won't go away unless you resolve it manually.
let reloadKingReward = false;

// // Duration of pausing the script before reload the King's Reward page (in seconds)
// // Note: It only take effect if reloadKingReward = true;
let kingPauseTimeMax = 18000;

/**
 * Auto solve KR
 */
let isAutoSolve = true;

/**
 * Extra delay time before solving KR. (in seconds)
 * Default: 10 - 30.
 */
let krDelayMin = 10;
let krDelayMax = 30;

/**
 * Time to start and stop solving KR. (in hours, 24-hour format)
 * Example: Script would not auto solve KR between 00:00 - 6:00
 * when krStopHour = 0 & krStartHour = 6;
 * To disable this feature, set both to the same value.
 */
let krStopHour = 3;
let krStartHour = 3;

/**
 * Extra delay time to start solving KR after krStartHour. (in minutes)
 */
let krStartHourDelayMin = 10;
let krStartHourDelayMax = 30;

// // Time offset (in seconds) between client time and internet time
// // -ve - Client time ahead of internet time
// // +ve - Internet time ahead of client time
let g_nTimeOffset = 0;

// // Maximum retry of solving KR.
// // If KR solved more than this number, pls solve KR manually ASAP in order to prevent MH from caught in botting
let kingsRewardRetryMax = 3;

/**
 * State to indicate whether to save KR image into localStorage or not
 */
let saveKRImage = true;

/**
 * Maximum number of KR image to be saved into localStorage
 */
let maxSaveKRImage = 75;

/**
 * The script will pause if player at different location
 * that hunt location set before. (true/false)
 * Note: Make sure you set showTimerInPage to true
 * in order to know what is happening.
 */
let pauseAtInvalidLocation = false;

/**
 * Time to wait after trap selector clicked (in second)
 */
let secWait = 7;

/**
 * Stop trap arming after X retry
 */
let armTrapRetry = 3;

/**
 * Maximum number of log to be saved
 * into sessionStorage, default 750.
 */
let maxSaveLog = 750;

/**
 * Popup on KR or not, the script will throw out an alert box if true.
 */
let autoPopupKR = false;

// == Basic User Preference Setting (End) ==

// == Advance User Preference Setting (Begin) ==
// // The variable in this section contain some advance option that will change the script behavior.
// // Edit this variable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
let showTimerInTitle = true;

// // Embed a timer in page to show next hunter horn timer, highly recommended to turn on. (true/false)
// // Note: You may not access some option like pause at invalid location if you turn this off.
let showTimerInPage = true;

// // Display the last time the page did a refresh or reload. (true/false)
let showLastPageLoadTime = true;

// // Default time to reload the page when bot encounter error. (in seconds)
let errorReloadTime = 60;

// // Time interval for script timer to update the time. May affect timer accuracy if set too high value. (in seconds)
let timerRefreshInterval = 10;

/**
 * Trap arming status, -1
 */
const LOADING = -1;
/**
 * Trap arming status, 0
 */
const NOT_FOUND = 0;
/**
 * Trap arming status, 1
 */
const ARMED = 1;

/**
 * Trap List
 */
let objTrapList = {
  weapon: [],
  base: [],
  trinket: [],
  bait: []
};

/**
 * Trap Collection
 */
const objTrapCollection = {
  weapon: [
    '2010 Blastoff',
    '2012 Big Boom',
    '500 Pound Spiked Crusher',
    "Admiral's Galleon",
    'Ambrosial Portal',
    'Ambush',
    'Ancient Box',
    'Ancient Gauntlet',
    'Ancient Spear Gun',
    'Anniversary Ambush',
    'Anniversary Ancient Box',
    'Anniversary Arcane Capturing Rod Of Never Yielding Mystery',
    'Anniversary DeathBot',
    "Anniversary Reaper's Perch",
    'Arcane Blast',
    'Arcane Capturing Rod Of Never Yielding Mystery',
    'Bandit Deflector',
    'Biomolecular Re-atomizer',
    'Birthday Candle Kaboom',
    'Birthday Party Piñata Bonanza',
    'Blackstone Pass',
    'Blazing Ember Spear',
    'Boiling Cauldron',
    'Bottomless Grave',
    'Brain Extractor',
    'Bubbles: The Party Crasher',
    'Cackle Lantern',
    'Candy Crusher',
    'Carousel Charger',
    'Celestial Dissonance',
    'Cemetery Gate Grappler',
    'Charming PrinceBot',
    'Cheese Seeking Lighthouse',
    "Chesla's Revenge",
    'Christmas Cactus',
    'Christmas Cracker',
    'Christmas Crystalabra',
    'Chrome Arcane Capturing Rod Of Never Yielding Mystery',
    'Chrome Celestial Dissonance',
    'Chrome Circlet of Pursuing',
    'Chrome DeathBot',
    'Chrome DrillBot',
    'Chrome Grand Arcanum',
    'Chrome MonstroBot',
    'Chrome Nannybot',
    'Chrome Oasis Water Node',
    'Chrome Onyx Mallet',
    'Chrome Phantasmic Oasis',
    'Chrome RhinoBot',
    'Chrome School of Sharks',
    'Chrome Slumbering Boulder',
    'Chrome Sphynx Wrath',
    'Chrome Storm Wrought Ballista',
    'Chrome Tacky Glue',
    'Chrome Temporal Turbine',
    'Chrome Thought Obliterator',
    'Circlet of Pursuing',
    'Circlet of Seeking',
    'Cloaking Droid',
    'Clockapult of Time',
    'Clockapult of Winter Past',
    'Clockwork Portal',
    'Creepy Coffin',
    'Crystal Crucible',
    'Crystal Mineral Crusher',
    'Crystal Tower',
    'Dark Magic Mirrors',
    'Darkest Chocolate Bunny',
    'Digby DrillBot',
    'Dimensional Chest',
    'Double Diamond Adventure',
    'Dragon Lance',
    'Dragon Slayer Cannon',
    'Dragonvine Ballista',
    'Dreaded Totem',
    'Droid Archmagus',
    'Ember Prison Core',
    'Endless Labyrinth',
    'Engine Doubler',
    'Enraged RhinoBot',
    'Event Horizon',
    'Explosive Toboggan Ride',
    "Father Winter's Timepiece",
    'Festive Forgotten Fir',
    'Festive Gauntlet Crusher',
    'Fluffy DeathBot',
    'Focused Crystal Laser',
    'Forgotten Pressure Plate',
    'Giant Speaker',
    'Gingerbread House Surprise',
    'Glacier Gatler',
    'Goldfrost Crossbow',
    'Golem Guardian Arcane',
    'Golem Guardian Forgotten',
    'Golem Guardian Hydro',
    'Golem Guardian Physical',
    'Golem Guardian Tactical',
    'Gorgon',
    'Gouging Geyserite',
    'Grand Arcanum',
    'Grungy Deathbot',
    'Harpoon Gun',
    'Harrowing Holiday Harpoon Harp',
    'Haunted Shipwreck',
    'Heat Bath',
    'High Tension Spring',
    'HitGrab Horsey',
    "HitGrab Rainbow Rockin' Horse",
    "HitGrab Rockin' Horse",
    'Holiday Hydro Hailstone',
    'Horrific Venus Mouse',
    'Ice Blaster',
    'Ice Maiden',
    'Icy RhinoBot',
    'Infinite Dark Magic Mirrors',
    'Infinite Labyrinth',
    'Infinite Winter Horizon',
    'Interdimensional Crossbow',
    'Isle Idol Hydroplane Skin',
    'Isle Idol Stakeshooter Skin',
    'Isle Idol',
    'Jacked Rabbot™',
    'Judge Droid',
    'Kraken Chaos',
    'Law Laser',
    'Lawful Lifeguard',
    'Legendary KingBot',
    'Maniacal Brain Extractor',
    'Meteor Prison Core',
    'Moonbeam Barrier',
    'Mouse DeathBot',
    'Mouse Hot Tub',
    "Mouse Mary O'Nette",
    'Mouse Rocketine',
    'Mouse Trebuchet',
    'Multi-Crystal Laser',
    'Mutated Venus Mouse',
    'Mysteriously unYielding Null-Onyx Rampart of Cascading Amperes',
    'Mystic Pawn Pincher',
    'NVMRC Forcefield',
    'Nannybot',
    'Net Cannon',
    'New Horizon',
    "New Year's Fireworks",
    'Ninja Ambush',
    'Nutcracker Nuisance',
    'Oasis Water Node',
    'Obelisk of Incineration',
    'Obelisk of Slumber',
    'Obvious Ambush',
    'Onyx Mallet',
    'Paradise Falls',
    'PartyBot',
    'Phantasmic Oasis',
    'Pneumatic Tube',
    'Polar Vortex',
    'Pumpkin Pummeler',
    'Queso Factory',
    'Queso Fount',
    "Reaper's Perch",
    'Rewers Riposte',
    'RhinoBot',
    'Rift Glacier Gatler',
    'Rocket Propelled Gavel',
    'Rune Shark',
    'S.A.M. F.E.D. DN-5',
    'S.L.A.C.',
    'S.L.A.C. II',
    'S.S. Scoundrel Sleigher',
    'S.T.I.N.G.',
    'S.T.I.N.G.E.R.',
    'S.U.P.E.R. Scum Scrubber',
    'Sandcastle Shard',
    'Sandstorm MonstroBot',
    'Sandtail Sentinel',
    'Scarlet Ember Root',
    'School of Sharks',
    'Scum Scrubber',
    'Shrink Ray',
    'Sinister Portal',
    'Sleeping Stone',
    'Slumbering Boulder',
    'Smoldering Stone Sentinel',
    'Snow Barrage',
    'Snowglobe',
    'Soul Catcher',
    'Soul Harvester',
    'Sphynx Wrath',
    'Sprinkly Cupcake Surprise',
    'Stale Cupcake Golem',
    'Steam AugerBot 3000',
    'Steam Laser Mk. I',
    'Steam Laser Mk. II',
    'Steam Laser Mk. III',
    'Storm Wrought Ballista',
    'Supply Grabber',
    'Surprise Party',
    'Swiss Army Mouse',
    'Tacky Glue',
    'Tarannosaurus Rex',
    'Technic Pawn Pincher',
    'Temporal Turbine',
    'Terrifying Spider',
    'The Dread Nautilus',
    'The Forgotten Art of Dance',
    'The Haunted Manor',
    'The Holiday Express',
    'The Law Draw',
    'Thorned Venus Mouse',
    'Thought Manipulator',
    'Thought Obliterator',
    'Timesplit Dissonance',
    "Tome of the Mind's Eye",
    'Tulip Turret',
    'Ultra MegaMouser MechaBot',
    'Veiled Vine',
    'Venus Mouse',
    'Wacky Inflatable Party People',
    'Warden Slayer',
    'Warpath Thrasher',
    'Well of Wisdom',
    'Wrapped Gift',
    "Zugzwang's First Move",
    "Zugzwang's Last Move",
    "Zugzwang's Ultimate Move",
    "Zurreal's Folly"
  ],
  base: [
    '10 Layer Birthday Cake Base',
    "2017 New Year's Base",
    "2018 New Year's Base",
    "2019 New Year's Base",
    "2020 New Year's Base",
    "2021 New Year's Base",
    "2022 New Year's Base",
    "2023 New Year's Base",
    'Adorned Empyrean Refractor Base',
    "Alchemist's Cookbook Base",
    'All Season Express Track Base',
    'Ancient Booster Base',
    'Aqua Base',
    'Attuned Enerchi Induction Base',
    'Aurora Base',
    'Bacon Base',
    'Bamboozler Base',
    'Birthday Banana Cake Base',
    'Birthday Cake Base',
    'Birthday Confetti Cake Base',
    'Birthday Dragée Cake Base',
    'Birthday Ube Cake Base',
    'Black Forest Cake Base',
    'Black Widow Base',
    'Bronze Tournament Base',
    'Candy Cane Base',
    'Carrot Birthday Cake Base',
    'Cheesecake Base',
    'Chocolate Bar Base',
    'Chocolate Birthday Cake Base',
    'Claw Shot Base',
    'Clockwork Base',
    'Compass Magnet Base',
    'Condemned Base',
    'Crushed Birthday Cake Base',
    'Cupcake Birthday Base',
    'Curse Breaker Base',
    'Deadwood Plank Base',
    'Deep Freeze Base',
    'Dehydration Base',
    'Denture Base',
    'Depth Charge Base',
    'Desert Heater Base',
    'Dog Jade Base',
    'Dragon Jade Base',
    'Eerie Base',
    'Eerier Base',
    'Electromagnetic Meteorite Base',
    'Elixir Exchanger Base',
    'Enerchi Induction Base',
    'Explosive Base',
    'Extra Sweet Cupcake Birthday Base',
    'Fan Base',
    'Festive Winter Hunt Base',
    'Firecracker Base',
    'Fissure Base',
    'Forecaster Base',
    'Fracture Base',
    'Furoma Base',
    'Gemology Base',
    'Gift of the Day Base',
    'Gingerbread Base',
    'Glowing Golem Guardian Base',
    'Golden Tournament Base',
    'Hallowed Ground Base',
    'Hearthstone Base',
    'Horse Jade Base',
    'Hothouse Base',
    'Ice Cream Cake Base',
    'Iceberg Boiler Base',
    'Jade Base',
    'Labyrinth Base',
    'Living Base',
    'Living Grove Base',
    'Marble Cake Base',
    'Magma Base',
    'Magnet Base',
    'Minotaur Base',
    'Mist Meter Regulator Base',
    'Molten Shrapnel Base',
    'Monkey Jade Base',
    'Monolith Base',
    'Naughty List Printing Press Base',
    'Overgrown Ember Stone Base',
    'Ox Jade Base',
    'Papyrus Base',
    'Physical Brace Base',
    'Pig Jade Base',
    'Polar Base',
    'Polluted Base',
    'Prestige Base',
    'Queso Cannonstorm Base',
    'Rabbit Jade Base',
    'Rat Jade Base',
    'Red Velvet Cake Base',
    'Refined Pollutinum Base',
    'Remote Detonator Base',
    'Rift Base',
    'Rift Mist Diffuser Base',
    'Rooster Jade Base',
    'Royal Ruby Refractor Base',
    'Runic Base',
    'Seasonal Base',
    'Seasonal Gift of the Day Base',
    'Sheep Jade Base',
    'Signature Series Denture Base',
    'Silver Tournament Base',
    'Skello-ton Base',
    'Smelly Sodium Base',
    'Snake Jade Base',
    'Soiled Base',
    'Spellbook Base',
    'Spiked Base',
    'Sprinkly Sweet Cupcake Birthday Base',
    'Stone Base',
    'Storm Condenser Base',
    'Thief Base',
    'Tidal Base',
    'Tiger Jade Base',
    'Tiki Base',
    'Treasure Seeker Base',
    'Tribal Base',
    'Tribal Kaboom Base',
    'Ultimate Iceberg Base',
    'Vegetation Base',
    'Washboard Base',
    'Wooden Base',
    'Wooden Base with Target'
  ],
  bait: [
    'Abominable Asiago',
    'Ancient Cheese',
    'Ancient String Cheese',
    'Arctic Asiago Cheese',
    'Ascended Cheese',
    'Bland Queso',
    'Bonefort Cheese',
    'Brie Cheese',
    'Brie String Cheese',
    'Candy Corn Cheese',
    'Checkmate Cheese',
    'Chedd-Ore Cheese',
    'Cheddar Cheese',
    'Cherry Cheese',
    'Cloud Cheesecake',
    'Coggy Colby Cheese',
    'Combat Cheese',
    'Creamy Havarti Cheese',
    'Crescent Cheese',
    'Crimson Cheese',
    'Crunchy Cheese',
    'Crunchy Havarti Cheese',
    'Cupcake Colby',
    'Dewthief Camembert',
    'Diamond Cheese',
    'Dragonvine Cheese',
    'Dumpling Cheese',
    'Duskshade Camembert',
    'Empowered Brie Cheese',
    'Empowered SUPER|brie+',
    'Extra Rich Cloud Cheesecake',
    'Extra Sweet Cupcake Colby',
    'Festive Feta',
    'Fishy Fromage',
    "Flamin' Queso",
    'Fusion Fondue',
    'Galleon Gouda',
    'Gauntlet Cheese Tier 2',
    'Gauntlet Cheese Tier 3',
    'Gauntlet Cheese Tier 4',
    'Gauntlet Cheese Tier 5',
    'Gauntlet Cheese Tier 6',
    'Gauntlet Cheese Tier 7',
    'Gauntlet Cheese Tier 8',
    'Gauntlet String Cheese',
    'Gemstone Cheese',
    'Ghastly Galleon Gouda',
    'Ghoulgonzola Cheese',
    'Gilded Cheese',
    'Gingerbread Cheese',
    'Glazed Pecan Pecorino Cheese',
    'Glowing Gruyere Cheese',
    'Glutter Cheese',
    'Gnarled Cheese',
    'Gouda Cheese',
    'Graveblossom Camembert',
    'Grilled Cheese',
    'Gumbo Cheese',
    'Hot Queso',
    'Inferno Havarti Cheese',
    'Lactrodectus Lancashire Cheese',
    'Limelight Cheese',
    'Lockbox Limburger Cheese',
    'Lunaria Camembert',
    'Magical Havarti Cheese',
    'Magical Rancid Radioactive Blue Cheese',
    'Magical String Cheese',
    'Maki Cheese',
    'Maki String Cheese',
    'Marble Cheese',
    'Marble String Cheese',
    'Marshmallow Monterey',
    'Master Fusion Cheese',
    'Medium Queso',
    'Mild Queso',
    'Mineral Cheese',
    'Monterey Jack-O-Lantern',
    'Moon Cheese',
    'Mozzarella Cheese',
    "Nian Gao'da Cheese",
    'Null Onyx Gorgonzola',
    'Nutmeg Cheese',
    'Onyx Gorgonzola',
    'Pecan Pecorino Cheese',
    'Polluted Parmesan Cheese',
    'Polter-Geitost',
    'Pungent Havarti Cheese',
    'Radioactive Blue Cheese',
    'Rainy Cheese',
    'Rancid Radioactive Blue Cheese',
    'Resonator Cheese',
    'Rewind Raclette',
    'Rift Combat Cheese',
    'Rift Glutter Cheese',
    'Rift Rumble Cheese',
    'Rift Susheese Cheese',
    'Riftiago Cheese',
    'Rockforth Cheese',
    'Rumble Cheese',
    'Runic Cheese',
    'Runic String Cheese',
    'Runny Cheese',
    'Scream Cheese',
    'Seasoned Gouda',
    'Shell Cheese',
    'Sky Pirate Swiss Cheese',
    'Snowball Bocconcini',
    'Speedy Coggy Colby',
    'Spicy Havarti Cheese',
    'Sunrise Cheese',
    'SUPER|brie+',
    'Susheese Cheese',
    'Sweet Havarti Cheese',
    'Swiss Cheese',
    'Swiss String Cheese',
    'Terre Ricotta Cheese',
    'Undead Emmental',
    'Undead String Emmental',
    'Vanilla Stilton Cheese',
    'Vengeful Vanilla Stilton Cheese',
    'White Cheddar Cheese',
    'Wicked Gnarly Cheese',
    'Wildfire Queso',
    'Windy Cheese'
  ],
  trinket: [
    '2014 Charm',
    '2015 Charm',
    '2016 Charm',
    '2017 Charm',
    '2018 Charm',
    '2019 Charm',
    '2020 Charm',
    '2021 Charm',
    '2022 Charm',
    '2023 Charm',
    '2024 Charm',
    '2025 Charm',
    'Airship Charm',
    'Amplifier Charm',
    'Ancient Charm',
    'Antiskele Charm',
    'Artisan Charm',
    'Athlete Charm',
    'Attraction Charm',
    'Baitkeep Charm',
    'Black Powder Charm',
    'Blue Double Sponge Charm',
    'Brain Charm',
    'Bravery Charm',
    'Brilliant Water Jet Charm',
    'Cackle Charm',
    'Cactus Charm',
    'Candy Charm',
    'Champion Charm',
    'Cherry Charm',
    'Chrome Charm',
    'Clarity Charm',
    'Compass Magnet Charm',
    'Crucible Cloning Charm',
    'Cupcake Charm',
    'Dark Chocolate Charm',
    'Derr Power Charm',
    'Diamond Boost Charm',
    'Door Guard Charm',
    'Dragonbane Charm',
    'Dragonbreath Charm',
    'Dreaded Charm',
    'Dusty Coal Charm',
    'EMP400 Charm',
    'Eggscavator Charge Charm',
    'Eggstra Charge Charm',
    'Eggstra Charm',
    'Elub Power Charm',
    'Ember Charm',
    'Empowered Anchor Charm',
    'Enerchi Charm',
    'Extra Sweet Cupcake Charm',
    'Extreme Ancient Charm',
    'Extreme Attraction Charm',
    'Extreme Chrome Charm',
    'Extreme Dragonbane Charm',
    'Extreme Luck Charm',
    'Extreme Lucky Power Charm',
    'Extreme Party Charm',
    'Extreme Polluted Charm',
    'Extreme Power Charm',
    'Extreme Queso Pump Charm',
    'Extreme Regal Charm',
    'Extreme Snowball Charm',
    'Extreme Spooky Charm',
    'Extreme Spore Charm',
    'Extreme Wealth Charm',
    'Factory Repair Charm',
    'Festive Anchor Charm',
    'Festive Ultimate Luck Charm',
    'Festive Ultimate Lucky Power Charm',
    'Festive Ultimate Power Charm',
    'Firecracker Charm',
    'First Ever Charm',
    'Flamebane Charm',
    'Forgotten Charm',
    'Freshness Charm',
    'Gargantua Charm',
    'Gemstone Boost Charm',
    'Gift Wrapped Charm',
    'Gilded Charm',
    'Gloomy Charm',
    'Glowing Gourd Charm',
    'Gnarled Charm',
    'Golden Anchor Charm',
    'Golem Guardian Charm',
    'Greasy Glob Charm',
    'Growth Charm',
    'Grub Salt Charm',
    'Grub Scent Charm',
    'Grubling Bonanza Charm',
    'Grubling Chow Charm',
    'Horsepower Charm',
    "Hunter's Horn Rewind Charm",
    'Hydro Charm',
    'Lantern Oil Charm',
    'Let It Snow Charm',
    'Luck Charm',
    'Lucky Power Charm',
    'Lucky Rabbit Charm',
    'Lucky Valentine Charm',
    'Magmatic Crystal Charm',
    'Mining Charm',
    'Mobile Charm',
    'Monger Charm',
    'Monkey Fling Charm',
    'Nanny Charm',
    'Nerg Power Charm',
    'Nightlight Charm',
    'Nightshade Farming Charm',
    'Nitropop Charm',
    'Oxygen Burst Charm',
    'Party Charm',
    'Pointy Charm',
    'Polluted Charm',
    'Power Charm',
    "Prospector's Charm",
    'Queso Pump Charm',
    'Rainbow Charm',
    'Rainbow Spore Charm',
    'Ramming Speed Charm',
    'Reality Restitch Charm',
    'Realm Ripper Charm',
    'Red Double Sponge Charm',
    'Red Sponge Charm',
    'Regal Charm',
    'Rift 2020 Charm',
    'Rift 2021 Charm',
    'Rift 2022 Charm',
    'Rift 2023 Charm',
    'Rift 2024 Charm',
    'Rift 2025 Charm',
    'Rift Airship Charm',
    'Rift Antiskele Charm',
    'Rift Charm',
    'Rift Chrome Charm',
    'Rift Extreme Chrome Charm',
    'Rift Extreme Luck Charm',
    'Rift Extreme Power Charm',
    'Rift Extreme Snowball Charm',
    'Rift Luck Charm',
    'Rift Power Charm',
    'Rift Rainbow Spore Charm',
    'Rift Snowball Charm',
    'Rift Spooky Charm',
    'Rift Super Chrome Charm',
    'Rift Super Luck Charm',
    'Rift Super Power Charm',
    'Rift Super Snowball Charm',
    'Rift Super Vacuum Charm',
    'Rift Tarnished Charm',
    'Rift Ultimate Chrome Charm',
    'Rift Ultimate Luck Charm',
    'Rift Ultimate Lucky Power Charm',
    'Rift Ultimate Power Charm',
    'Rift Ultimate Snowball Charm',
    'Rift Vacuum Charm',
    'Rift Wealth Charm',
    'Roof Rack Charm',
    'Rook Crumble Charm',
    'Rotten Charm',
    'Safeguard Charm',
    'Scholar Charm',
    "Scientist's Charm",
    'Searcher Charm',
    'Shadow Charm',
    'Shamrock Charm',
    'Shattering Charm',
    "Sheriff's Badge Charm",
    'Shielding Charm',
    'Shine Charm',
    'Shortcut Charm',
    'Small Power Charm',
    'Smart Water Jet Charm',
    'Snakebite Charm',
    'Snowball Charm',
    'Soap Charm',
    'Softserve Charm',
    'Spellbook Charm',
    'Spiked Anchor Charm',
    'Sponge Charm',
    'Spooky Charm',
    'Spore Charm',
    'Sprinkly Sweet Cupcake Charm',
    'Stagnant Charm',
    'Stalemate Charm',
    'Sticky Charm',
    'Striker Charm',
    'Super Ancient Charm',
    'Super Attraction Charm',
    'Super Brain Charm',
    'Super Cactus Charm',
    'Super Chrome Charm',
    'Super Dragonbane Charm',
    'Super Enerchi Charm',
    'Super Lantern Oil Charm',
    'Super Luck Charm',
    'Super Lucky Power Charm',
    'Super Nightshade Farming Charm',
    'Super Party Charm',
    'Super Polluted Charm',
    'Super Power Charm',
    'Super Queso Pump Charm',
    'Super Regal Charm',
    'Super Rotten Charm',
    'Super Salt Charm',
    'Super Snowball Charm',
    'Super Soap Charm',
    'Super Spooky Charm',
    'Super Spore Charm',
    'Super Warpath Archer Charm',
    'Super Warpath Cavalry Charm',
    "Super Warpath Commander's Charm",
    'Super Warpath Mage Charm',
    'Super Warpath Scout Charm',
    'Super Warpath Warrior Charm',
    'Super Wax Charm',
    'Super Wealth Charm',
    'Supply Schedule Charm',
    'Tarnished Charm',
    'Taunting Charm',
    'Timesplit Charm',
    'Torch Charm',
    'Treasure Trawling Charm',
    'Ultimate Anchor Charm',
    'Ultimate Ancient Charm',
    'Ultimate Attraction Charm',
    'Ultimate Charm',
    'Ultimate Chrome Charm',
    'Ultimate Dragonbane Charm',
    'Ultimate Luck Charm',
    'Ultimate Lucky Power Charm',
    'Ultimate Party Charm',
    'Ultimate Polluted Charm',
    'Ultimate Power Charm',
    'Ultimate Regal Charm',
    'Ultimate Snowball Charm',
    'Ultimate Spooky Charm',
    'Ultimate Spore Charm',
    'Ultimate Wealth Charm',
    'Uncharged Scholar Charm',
    'Unstable Charm',
    'Valentine Charm',
    'Warpath Archer Charm',
    'Warpath Cavalry Charm',
    "Warpath Commander's Charm",
    'Warpath Mage Charm',
    'Warpath Scout Charm',
    'Warpath Warrior Charm',
    'Water Jet Charm',
    'Wax Charm',
    'Wealth Charm',
    'Wild Growth Charm',
    'Winter Builder Charm',
    'Winter Charm',
    'Winter Hoarder Charm',
    'Winter Miser Charm',
    'Winter Screw Charm',
    'Winter Spring Charm',
    'Winter Wood Charm',
    'Yellow Double Sponge Charm',
    'Yellow Sponge Charm'
  ]
};

/**
 * Best weapon/base/charm/bait pre-determined by user.
 * Edit ur best weapon/base/charm/bait in ascending order.
 * e.g. [best, better, good]
 */
let objBestTrap = {
  weapon: {
    arcane: [
      'Chrome Circlet of Pursuing',
      'Circlet of Pursuing',
      'Circlet of Seeking',
      'Event Horizon',
      'Arcane Storm Summoner Lightning Rod',
      'Droid Archmagus',
      'Boiling Cauldron',
      'Arcane Capturing Rod Of Never Yielding Mystery'
    ],
    draconic: [
      'Dragon Devastator',
      'Chrome Dragon Slayer Cannon',
      'Dragon Slayer Cannon',
      'Chrome Storm Wrought Ballista',
      'Storm Wrought Ballista',
      'Dragonvine Ballista',
      "Ronza's Flock of Golden Anti-Dragonbots",
      'Blazing Ember Spear',
      'Ice Maiden'
    ],
    forgotten: [
      'Chrome Thought Obliterator',
      'Thought Obliterator',
      'Thought Manipulator',
      'Endless Labyrinth',
      'Scarlet Ember Root',
      'The Forgotten Art of Dance',
      'Ancient Box'
    ],
    hydro: [
      'Chrome School of Sharks',
      'Queso Fount',
      'School of Sharks',
      'Rune Shark',
      'Steam AugerBot 3000',
      'Oasis Water Node',
      'Bubbles: The Party Crasher',
      'Ancient Spear Gun'
    ],
    law: [
      'S.T.I.N.G.E.R.',
      'Ember Prison Core',
      'S.T.I.N.G.',
      'Lawful Lifeguard',
      'Meteor Prison Core'
    ],
    physical: [
      'Legendary KingBot',
      'Charming PrinceBot',
      'Smoldering Stone Sentinel',
      'Chrome MonstroBot',
      'Sandstorm MonstroBot',
      'Jacked Rabbot',
      'Enraged RhinoBot',
      'RhinoBot'
    ],
    rift: [
      'Chrome Celestial Dissonance',
      'Celestial Dissonance',
      'Timesplit Dissonance',
      'Derelict Airship',
      'Biomolecular Re-atomizer'
    ],
    shadow: [
      'Infinite Dark Magic Mirrors',
      'Dark Magic Mirrors',
      'Interdimensional Crossbow'
    ],
    tactical: [
      'Chrome Slumbering Boulder',
      'Slumbering Boulder',
      'Polar Vortex',
      'Gouging Geyserite',
      'Sleeping Stone',
      'Chrome Sphynx Wrath',
      'Sphynx Wrath',
      'Horrific Venus Mouse'
    ]
  },
  base: {
    luck: [
      "Dragon's Breath Opal Refractor Base",
      "Sorcerer's Sapphire Refractor Base",
      'Royal Ruby Refractor Base',
      'Adorned Empyrean Refractor Base',
      'Minotaur Base',
      'Clockwork Base',
      'Fissure Base',
      'Overgrown Ember Stone Base',
      'Rift Base',
      'Naughty List Printing Press Base',
      'Attuned Enerchi Induction Base',
      'Refined Pollutinum Base',
      'Black Forest Cake Base',
      "Alchemist's Cookbook Base",
      'Chocolate Bar Base'
    ],
    power: [
      "Dragon's Breath Opal Refractor Base",
      "Sorcerer's Sapphire Refractor Base",
      'Royal Ruby Refractor Base',
      'Adorned Empyrean Refractor Base',
      'Minotaur Base',
      'Clockwork Base',
      'Tidal Base',
      'Naughty List Printing Press Base',
      'Refined Pollutinum Base',
      'Attuned Enerchi Induction Base',
      'Fissure Base',
      'Overgrown Ember Stone Base',
      'Black Forest Cake Base'
    ],
    combo: [
      "Dragon's Breath Opal Refractor Base",
      "Sorcerer's Sapphire Refractor Base",
      'Royal Ruby Refractor Base',
      'Adorned Empyrean Refractor Base',
      'Minotaur Base',
      'Overgrown Ember Stone Base',
      'Naughty List Printing Press Base',
      'Attuned Enerchi Induction Base',
      'Black Forest Cake Base',
      "Alchemist's Cookbook Base",
      'Chocolate Bar Base'
    ],
    rift: [
      "Dragon's Breath Opal Refractor Base",
      "Sorcerer's Sapphire Refractor Base",
      'Royal Ruby Refractor Base',
      'Clockwork Base',
      'Fissure Base',
      'Adorned Empyrean Refractor Base',
      'Attuned Enerchi Induction Base',
      'Enerchi Induction Base',
      'Minotaur Base',
      'Overgrown Ember Stone Base',
      'Naughty List Printing Press Base',
      'Refined Pollutinum Base',
      'Black Forest Cake Base'
    ],
    labyrinth: ['Minotaur Base', 'Labyrinth Base', 'Treasure Seeker Base']
  }
};
objBestTrap.base.labyrinth = objBestTrap.base.labyrinth.concat(
  objBestTrap.base.combo
);

// Living Garden Preference
let bestLGBase = ['Living Base', 'Hothouse Base'].concat(
  objBestTrap.base.combo
); // ;
let bestSalt = ['Super Salt', 'Grub Salt'];
let wasteCharm = ['Tarnished', 'Unstable', 'Wealth'];
let redSpongeCharm = ['Red Double', 'Red Sponge'];
let yellowSpongeCharm = ['Yellow Double', 'Yellow Sponge'];
let spongeCharm = ['Blue Double', 'Sponge'];

let bestAnchor = ['Golden Anchor', 'Spiked Anchor', 'Empowered Anchor'];
let bestOxygen = ['Oxygen Burst', 'Empowered Anchor'];

// GES Preferences
let supplyDepotTrap = [
  'Meteor Prison Core',
  'Supply Grabber',
  'S.L.A.C. II',
  'Law Laser',
  'S.L.A.C.'
];
let raiderRiverTrap = [
  'Meteor Prison Core',
  'Bandit Deflector',
  'S.L.A.C. II',
  'Law Laser',
  'S.L.A.C.'
];
let daredevilCanyonTrap = [
  'Meteor Prison Core',
  'Engine Doubler',
  'S.L.A.C. II',
  'Law Laser',
  'S.L.A.C.'
];
let coalCharm = ['Magmatic Crystal', 'Black Powder', 'Dusty Coal'];

// let chargeCharm = ['Eggstra Charge', 'Eggscavator'];
let scOxyBait = ['Fishy Fromage', 'Gouda'];

/**
 * Sunken City Preference
 * DON'T edit this variable if you don't know what are you editing
 */
let objSCZone = {
  ZONE_NOT_DIVE: 0,
  ZONE_DEFAULT: 1,
  ZONE_CORAL: 2,
  ZONE_SCALE: 3,
  ZONE_BARNACLE: 4,
  ZONE_TREASURE: 5,
  ZONE_DANGER: 6,
  ZONE_DANGER_PP: 7,
  ZONE_OXYGEN: 8,
  ZONE_BONUS: 9,
  ZONE_DANGER_PP_LOTA: 10
};
let bestSCBase = ['Minotaur Base', 'Fissure Base', 'Depth Charge Base'];

// // Spring Egg Hunt
let chargeCharm = ['Eggstra Charge', 'Eggscavator'];
let chargeHigh = 17;
let chargeMedium = 12;

// // Labyrinth
let bestLabyBase = [
  'Prestige Base',
  'Minotaur Base',
  'Labyrinth Base',
  'Treasure Seeker Base'
];
let objCodename = {
  FEALTY: 'y',
  TECH: 'h',
  SCHOLAR: 's',
  TREASURY: 't',
  FARMING: 'f',
  PLAIN: 'p',
  SUPERIOR: 's',
  EPIC: 'e',
  SHORT: 's',
  MEDIUM: 'm',
  LONG: 'l'
};
let arrHallwayOrder = ['sp', 'mp', 'lp', 'ss', 'ms', 'ls', 'se', 'me', 'le'];
let objDefaultLaby = {
  districtFocus: 'None',
  minorFocus: 'None',
  focusTypesQueue: ['TREASURY', 'FARMING', 'FEALTY', 'SCHOLAR', 'TECH'],
  plansIgnoreQueue: ['MINOTAUR', 'HIGHEST', 'BALANCE'],
  securityDisarm: false,
  travelTo: '',
  lastHunt: 0,
  armOtherBase: 'false',
  disarmCompass: true,
  nDeadEndClue: 0,
  between0and14: ['lp'],
  between15and59: ['sp', 'ls'],
  between60and100: ['sp', 'ss', 'le'],
  autoOpenExit: true,
  openFocusDoor: true,
  autoLantern: true,
  focusClues: 15,
  chooseOtherDoors: true,
  focusTypesManualDoor: ['FEALTY', 'SCHOLAR', 'TECH'],
  typeOtherDoors: 'SHORTEST_FEWEST',
  baitFarming: 'Gouda Cheese',
  weaponFarming: 'best.weapon.forgotten',
  charmFarming: 'None',
  baitTreasury: 'Gouda Cheese',
  weaponTreasury: 'best.weapon.forgotten',
  charmTreasury: 'None',
  baitFocus: 'Glowing Gruyere',
  charmFocus: 'None',
  baitNonFocus: 'Brie Cheese',
  weaponNonFocus: 'best.weapon.physical',
  baseNonFocus: 'Cheesecake Base',
  charmNonFocus: 'None',
  baitIntersection: 'Brie Cheese',
  charmIntersection: 'None'
};
let objLength = {
  SHORT: 0,
  MEDIUM: 1,
  LONG: 2
};

// Furoma Rift
let objFRBattery = {
  level: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  name: [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten'
  ],
  capacity: [20, 45, 75, 120, 200, 310, 450, 615, 790, 975],
  cumulative: [20, 65, 140, 260, 460, 770, 1220, 1835, 2625, 3600]
};

let g_arrHeirloom = []; // to be refresh once page reload

/**
 * 用類似 enum方式宣告一些 bait/charm的組合.
 */
let g_objConstTrap = {
  bait: {
    ANY_HALLOWEEN: {
      sort: 'any',
      name: ['Ghoulgonzola', 'Candy Corn']
    },
    ANY_MASTER: {
      sort: 'any',
      name: ['Rift Susheese', 'Rift Combat', 'Rift Glutter']
    },
    ANY_LUNAR: {
      sort: 'any',
      name: ['Moon Cheese', 'Crescent Cheese']
    },
    ANY_FESTIVE_BRIE: {
      sort: 'best',
      name: [
        'Arctic Asiago',
        'Nutmeg',
        'Snowball Bocconcini',
        'Festive Feta',
        'Gingerbread',
        'Brie Cheese'
      ]
    },
    ANY_FESTIVE_GOUDA: {
      sort: 'best',
      name: [
        'Arctic Asiago',
        'Nutmeg',
        'Snowball Bocconcini',
        'Festive Feta',
        'Gingerbread',
        'Gouda'
      ]
    },
    ANY_FESTIVE_SB: {
      sort: 'best',
      name: [
        'Arctic Asiago',
        'Nutmeg',
        'Snowball Bocconcini',
        'Festive Feta',
        'Gingerbread',
        'SUPER'
      ]
    }
  },
  trinket: {
    GAC_EAC: {
      sort: 'best',
      name: ['Golden Anchor', 'Empowered Anchor']
    },
    SAC_EAC: {
      sort: 'best',
      name: ['Spiked Anchor', 'Empowered Anchor']
    },
    UAC_EAC: {
      sort: 'best',
      name: ['Ultimate Anchor', 'Empowered Anchor']
    },
    'ANCHOR_FAC/EAC': {
      sort: 'best',
      name: ['Festive Anchor Charm', 'Empowered Anchor Charm']
    }
  }
};

/**
 * Arming priority: null/none/best/any
 */
const armPriority = { null: null, none: 'none', best: 'best', any: 'any' };

/**
 * Available trap type: weapon/base/trinket/bait
 */
const TrapType = {
  weapon: 'weapon',
  base: 'base',
  trinket: 'trinket',
  bait: 'bait'
};

/**
 * Scaffolding Code for Auto QCGT Mapping Function.
 * Automatically Snipes PP/CQ/QR/Corky.
 * Requires Mapping Helper Script (https://greasyfork.org/en/scripts/384275-mousehunt-mapping-helper).
 */
function check() {
  magic_dict_qr = [
    'Croquet Crusher',
    'Croquet Crusher',
    'Pump Raider',
    'Tiny Saboteur',
    'Sleepy Merchant'
  ];
  magic_dict_pp = {
    'Bland Queso': ['Spice Seer', 'Old Spice Collector'],
    'Mild Queso': ['Spice Farmer', 'Granny Spice'],
    'Medium Queso': ['Spice Finder', 'Spice Sovereign'],
    'Hot Queso': ['Spice Reaper', 'Spice Raider']
  };
  magic_dict_cq = {
    'Bland Queso': ['Chip Chiseler', 'Tiny Toppler'],
    'Mild Queso': ['Ore Chipper', 'Rubble Rummager'],
    'Medium Queso': ['Nachore Golem', 'Rubble Rouser'],
    'Hot Queso': ['Grampa Golem', 'Fiery Crusher']
  };
  magic_dict_qg = {
    'Bland Queso': ['Fuzzy Drake'],
    'Mild Queso': ['Cork Defender'],
    'Medium Queso': ['Burly Bruiser'],
    'Hot Queso': ['Corky, the Collector', 'Horned Cork Hoarder'],
    "Flamin' Queso": ['Rambunctious Rain Rumbler'],
    'Wildfire Queso': ['Corkataur']
  };
  magic_dict_qg2 = {
    'Mild Queso': ['Warming Wyvern'],
    'Medium Queso': ['Steam Sailor'],
    'Hot Queso': ['Vaporior'],
    "Flamin' Queso": ['Pyrehyde'],
    'Wildfire Queso': ['Emberstone Scaled']
  };
  if (true) {
    qg_bait = ['Hot Queso', 'Medium Queso', 'Mild Queso', 'Bland Queso'];
    let remaining_mice = JSON.parse(
      localStorage.getItem('tsitu-maptem-mapmice')
    );
    if (remaining_mice == null) return;
    console.plog('Mode = 2');
    logging(remaining_mice);
    if (user.environment_name == 'Prickly Plains') {
      if (objBestTrap.weapon.arcane[0] == '') objBestTrap.weapon.arcane.shift();
      if (getBaitName() == 'SUPER|brie+')
        checkThenArm(null, 'bait', 'Medium Queso');
      checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
      console.plog('user in pp');
      qg_bait = ['Bland Queso', 'Mild Queso', 'Medium Queso', 'Hot Queso'];
      for (const check_bait of qg_bait) {
        logging('checking', check_bait);
        if (findCommonElements(magic_dict_pp[check_bait], remaining_mice)) {
          checkThenArm(null, 'bait', check_bait);
          logging(check_bait, 'present');
          return;
        }
      }
      for (const check_bait of qg_bait) {
        if (findCommonElements(magic_dict_cq[check_bait], remaining_mice)) {
          checkThenArm('best', 'weapon', objBestTrap.weapon.shadow);
          checkThenArm(null, 'bait', check_bait);
          travel('queso_quarry');
          return;
        }
      }
      console.plog(
        findCommonElements(magic_dict_pp['Bland Queso'], remaining_mice)
      );
    }
    if (user.environment_name == 'Cantera Quarry') {
      checkThenArm('best', 'weapon', objBestTrap.weapon.shadow);
      logging('reached');
      console.plog('user in cq');
      for (const check_bait of qg_bait) {
        logging('checking', check_bait);
        if (findCommonElements(magic_dict_cq[check_bait], remaining_mice)) {
          checkThenArm(null, 'bait', check_bait);
          logging(check_bait, 'present');
          return;
        }
      }
      let temp = true;
      for (const check_bait of qg_bait) {
        if (findCommonElements(magic_dict_qg[check_bait], remaining_mice)) {
          checkThenArm('best', 'weapon', objBestTrap.weapon.draconic);
          checkThenArm(null, 'bait', check_bait);
          travel('queso_geyser');
          logging('yes');
          temp = false;
          return;
        }
      }
      checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
      checkThenArm(null, 'bait', 'Mild Queso');
      travel('queso_plains');
    }
    if (user.environment_name == 'Queso Geyser') {
      logging('before', objBestTrap.weapon.draconic);
      if (objBestTrap.weapon.draconic[0] == '') {
        objBestTrap.weapon.draconic.shift();
        logging('reached 2');
      }
      logging('after', objBestTrap.weapon.draconic);
      logging('here', objBestTrap.weapon.draconic);
      checkThenArm('best', 'weapon', objBestTrap.weapon.draconic);
      if (user.quests.QuestQuesoGeyser.state != 'collecting') {
        logging('wrong stage');
        return;
      }
      if (user.quests.QuestQuesoGeyser.state == 'collecting') {
        ext = ["Flamin' Queso", 'Wildfire Queso'];
        for (const check_bait of ext.concat(qg_bait)) {
          logging('checking', check_bait);
          if (findCommonElements(magic_dict_qg[check_bait], remaining_mice)) {
            checkThenArm(null, 'bait', check_bait);
            logging(check_bait, 'present');
            return;
          }
        }
      }
      if (user.quests.QuestQuesoGeyser.state == 'corked') {
        for (const check_bait of ext.concat(qg_bait)) {
          logging('checking', check_bait);
          if (user.quests.QuestQuesoGeyser.max_pressure == 35) {
            qg_bait = [
              'Mild Queso',
              'Bland Queso',
              'Hot Queso',
              'Medium Queso'
            ];
          }
          if (findCommonElements(magic_dict_qg2[check_bait], remaining_mice)) {
            checkThenArm(null, 'bait', check_bait);
            logging(check_bait, 'present');
            return;
          }
        }
      }
      if (user.quests.QuestQuesoGeyser.state == 'collecting') {
        checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
        checkThenArm(null, 'bait', 'Bland Queso');
        travel('queso_plains');
      }
    }
    if (user.environment_name == 'Queso River') {
      if (findCommonElements(magic_dict_qr, remaining_mice)) {
        checkThenArm(null, 'bait', 'SUPER');
      } else {
        checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
        checkThenArm(null, 'bait', 'Bland Queso');
        checkThenArm(null, 'bait', 'Bland Queso');
        travel('queso_plains');
      }
    }
    //console.plog(user.environment_name == "Cantera Quarry");
  }
}

/**
 * Travel to specified location.
 * Directly invoke function of game.
 * @param {String} environmentType
 * @param {BigInt} milliseconds
 *  wait milliseconds to reload after travel.
 *  if no milliseconds, 5000 is default value.
 *  Will not reload if milliseconds less then 0.
 */
function travel(environmentType, milliseconds, callback) {
  if (user.environment_type == environmentType) return;
  const timeout = milliseconds ? milliseconds : 2000;
  user.environment_type = environmentType;
  user.environment_id = environmentTypeIdDictionary[environmentType];
  /* hg.utils.User.travel(
    environmentType,
    function (data) {
      activejsDialog.hide();
      hg.utils.PageUtil.setPage('Camp');
    },
    function () {}
  ); */
  app.pages.TravelPage.travel(environmentType);
  if (timeout >= 0) {
    window.setTimeout(function () {
      console.log(callback);
      if (callback) callback();
      else reloadWithMessage('After travel. Reloading...', false);
    }, timeout);
  }
}

/**
 * Travel to specified location to break current hunting.
 *
 * @param {String} environmentType
 * @param {BigInt} milliseconds
 */
function pauseByTraveling(environmentType, milliseconds, callback) {
  setStorage('workIn', '');
  // setStorage('sleepIn', '');
  travel(environmentType, milliseconds, callback);
}

function findCommonElements(arr1, arr2) {
  if (arr1 == null || arr2 == null) return;
  return arr1.some((item) => arr2.includes(item));
}

// // Addon code (default: empty string)
let addonCode = '';

// == Advance User Preference Setting (End) ==

// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
let g_strHTTP = 'https';
let g_strVersion = (scriptVersion = GM_info.script.version);
let g_strScriptHandler = '';
let fbPlatform = false;
let hiFivePlatform = false;
let mhPlatform = false;
let mhMobilePlatform = false;
let secureConnection = false;
let lastDateRecorded = new Date();
let hornTime = 900;
let hornTimeDelay = 0;
let checkTimeDelay = 0;
let isKingReward = false;
let lastKingRewardSumTime;
let baitQuantity = -1;
let huntLocation;
let currentLocation;
let today = new Date();
let checkTime =
  today.getMinutes() >= trapCheckTimeDiff
    ? 3600 +
      trapCheckTimeDiff * 60 -
      (today.getMinutes() * 60 + today.getSeconds())
    : trapCheckTimeDiff * 60 - (today.getMinutes() * 60 + today.getSeconds());
today = undefined;
let millisTillGWH = new Date(2022, 11, 6, 15, 0, 0, 0) - today;
/**
 * 嘗試重新 sound horn的最大次數.
 * 到達最大次數的話就 reload.
 */
let hornRetryMax = 10;
let hornRetry = 0;
let nextActiveTime = 900;
let timerInterval = 2;
let checkMouseResult = null;
let armingQueue = [];
let dequeueingCTA = false;
let dequeueIntRunning = false;
let mouseList = [];
let eventLocation = 'None';
let discharge = false;
/**
 * Trap selector opened.
 */
let arming = false;
let g_arrArmingList = [];
let kingsRewardRetry = 0;
let keyKR = [];
/**
 * It's the ~ symbol
 */
const separator = '~';

// element in page
let titleElement;
let nextHornTimeElement;
let checkTimeElement;
let kingTimeElement;
let lastKingRewardSumTimeElement;
let optionElement;
let travelElement;
let hornButton = 'hornbutton';
let campButton = 'campbutton';
let header = 'header';
let hornReady = 'hornready';
let isNewUI = false;

// NOB vars
let NOBtickerTimout;
let NOBtickerInterval;
let NOBtraps = []; // Stores ALL traps, bases, cheese etc available to user
let NOBhuntsLeft = 0; // Temp for huntFor();
let NOBpage = false;
let mapRequestFailed = false;
let clockTicking = false;
let clockNeedOn = false;
let NOBadFree = true;
/**
 * Use timeInMilliSeconds of known status
 * to count now status.
 */
const LOCATION_TIMERS = [
  [
    'Seasonal Garden',
    {
      first: 1283616000,
      length: 288000,
      breakdown: [1, 1, 1, 1],
      name: ['Summer', 'Fall', 'Winter', 'Spring'],
      color: ['Red', 'Orange', 'Blue', 'Green'],
      effective: ['tactical', 'shadow', 'hydro', 'physical']
    }
  ],
  [
    "Balack's Cove",
    {
      first: 1294680060,
      length: 1200,
      breakdown: [48, 3, 2, 3],
      name: ['Low', 'Medium (in)', 'High', 'Medium (out)'],
      color: ['Green', 'Orange', 'Red', 'Orange']
    }
  ],
  [
    'Forbidden Grove',
    {
      first: 1285704000,
      length: 14400,
      breakdown: [4, 1],
      name: ['Open', 'Closed'],
      color: ['Green', 'Red']
    }
  ],
  [
    'Toxic Spill',
    {
      first: 1503597600,
      length: 3600,
      breakdown: [
        15, 16, 18, 18, 24, 24, 24, 12, 12, 24, 24, 24, 18, 18, 16, 15
      ],
      name: [
        'Hero',
        'Knight',
        'Lord',
        'Baron',
        'Count',
        'Duke',
        'Grand Duke',
        'Archduke',
        'Archduke',
        'Grand Duke',
        'Duke',
        'Count',
        'Baron',
        'Lord',
        'Knight',
        'Hero'
      ],
      color: [
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green',
        'Green'
      ],
      effective: [
        'Rising',
        'Rising',
        'Rising',
        'Rising',
        'Rising',
        'Rising',
        'Rising',
        'Rising',
        'Falling',
        'Falling',
        'Falling',
        'Falling',
        'Falling',
        'Falling',
        'Falling',
        'Falling'
      ]
    }
  ],
  [
    'Relic Hunter',
    {
      url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt'
    }
  ]
];
/**
 * default bait(armed when no bait).
 */
let defaultBait = 'Gouda Cheese';
/**
 * Rest time, [start at what o'clock, for how many hours].
 * Both number are randamized so no minutes for input
 */
let restTimes = [
  [19, 1],
  [12, 1],
  [2, 6],
  [0, 0],
  [0, 0],
  [0, 0]
];
/**
 * Active time(start at what o'clock, for how many hours).
 * Use short hornTimeDelayMax(40 seconds).
 */
let activeTimes = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0]
];
/**
 * Take rest in location.
 */
let sleepIn = '';
/**
 * Fixed hunting location.
 * Travel to if not in this location.
 */
let workIn = '';
/** Enable scheduled jobs or not */
let isEnableScheduledJobs = false;
/** Auto use SB supply pack when LGS seconds less than minLgsSeconds, -1 if not auto use */
let minLgsSeconds = -1;
/**
 * onload anchor.
 * On page loaded scroll to this anchor point
 */
let onloadAnchor = ['ByClassName', 'mousehuntHeaderView-gameTabs', ''];
/**
 * anchor points.
 * Used for generating buttons for quick scroll to
 */
let anchorPoints = [
  ['journal', 'ById', 'journalContainer', ''],
  ['status', 'ByClassName', 'mousehuntHud-userStatBar', ''],
  [
    'timer',
    'ByClassName',
    'huntersHornView__timerState huntersHornView__timerState--type-countdown huntersHornView__countdown',
    'huntersHornView__timerState huntersHornView__timerState--type-ready'
  ],
  ['topbar', 'ByClassName', 'mousehuntHeaderView-gameTabs', '']
];
/**
 * Location code and name.
 */
const locations = [
  ['meadow', 'Meadow', true, 'Novice'],
  ['town_of_gnawnia', 'Town of Gnawnia', true, 'Recruit'],
  ['ronzas_traveling_shoppe', "Ronza's Traveling Shoppe", false],
  ['windmill', 'Windmill', true, 'Apprentice'],
  ['harbour', 'Harbour', true, 'Initiate'],
  ['mountain', 'Mountain', true, 'Journeyman'],
  ['winter_hunt_fortress', 'Ice Fortress', false],
  ['winter_hunt_workshop', 'Golem Workshop', false],
  ['winter_hunt_grove', 'Cinnamon Hill', false],
  ['kings_arms', "King's Arms", true, 'Apprentice'],
  ['tournament_hall', 'Tournament Hall', true, 'Apprentice'],
  ['kings_gauntlet', "King's Gauntlet", true, 'Hero'],
  ['calm_clearing', 'Calm Clearing', true, 'Journeyman'],
  ['great_gnarled_tree', 'Great Gnarled Tree', true, 'Master'],
  ['lagoon', 'Lagoon', true, 'Grandmaster'],
  ['halloween_event_location', 'Gloomy Greenwood', false],
  ['laboratory', 'Laboratory', true, 'Master'],
  ['mousoleum', 'Mousoleum', true, 'Master'],
  ['town_of_digby', 'Town of Digby', true, 'Master'],
  ['bazaar', 'Bazaar', true, 'Grandmaster'],
  ['pollution_outbreak', 'Toxic Spill', true, 'Hero'],
  ['training_grounds', 'Training Grounds', true, 'Grandmaster'],
  ['dojo', 'Dojo', true, 'Grandmaster'],
  ['meditation_room', 'Meditation Room', true, 'Grandmaster'],
  ['pinnacle_chamber', 'Pinnacle Chamber', true, 'Grandmaster'],
  ['catacombs', 'Catacombs', true, 'Legendary'],
  ['forbidden_grove', 'Forbidden Grove', true, 'Legendary'],
  ['acolyte_realm', 'Acolyte Realm', false, 'Legendary'],
  ['cape_clawed', 'Cape Clawed', true, 'Legendary'],
  ['elub_shore', 'Elub Shore', true, 'Legendary'],
  ['nerg_plains', 'Nerg Plains', true, 'Legendary'],
  ['derr_dunes', 'Derr Dunes', true, 'Legendary'],
  ['jungle_of_dread', 'Jungle of Dread', true, 'Hero'],
  ['dracano', 'Dracano', true, 'Knight'],
  ['balacks_cove', "Balack's Cove", true, 'Knight'],
  ['claw_shot_city', 'Claw Shot City', true, 'Lord'],
  ['train_station', 'Gnawnian Express Station', true, 'Lord'],
  ['fort_rox', 'Fort Rox', true, 'Baron'],
  ['queso_river', 'Queso River', true, 'Count'],
  ['queso_plains', 'Prickly Plains', true, 'Count'],
  ['queso_quarry', 'Cantera Quarry', true, 'Count'],
  ['queso_geyser', 'Queso Geyser', true, 'Count'],
  ['super_brie_factory', 'SUPER|brie+ Factory', true, 'Novice'],
  ['ss_huntington_ii', 'S.S. Huntington IV', true, 'Legendary'],
  ['seasonal_garden', 'Seasonal Garden', true, 'Lord'],
  ['zugzwang_tower', "Zugzwang's Tower", true, 'Lord'],
  ['zugzwang_library', 'Crystal Library', true, 'Lord'],
  ['slushy_shoreline', 'Slushy Shoreline', true, 'Lord'],
  ['iceberg', 'Iceberg', true, 'Lord'],
  ['sunken_city', 'Sunken City', true, 'Count'],
  ['desert_warpath', 'Fiery Warpath', true, 'Baron'],
  ['desert_city', 'Muridae Market', true, 'Baron'],
  ['desert_oasis', 'Living/Twisted Garden', true, 'Baron'],
  ['lost_city', 'Lost/Cursed City', true, 'Baron'],
  ['sand_dunes', 'Sand Dunes/Crypts', true, 'Baron'],
  ['fungal_cavern', 'Fungal Cavern', true, 'Duke'],
  ['labyrinth', 'Labyrinth', true, 'Duke'],
  ['ancient_city', 'Zokor', true, 'Duke'],
  ['moussu_picchu', 'Moussu Picchu', true, 'Grand Duke'],
  ['floating_islands', 'Floating Islands', true, 'Archduke'],
  ['foreword_farm', 'Foreword Farm', true, 'Archduke'],
  ['prologue_pond', 'Prologue Pond', true, 'Archduke'],
  ['table_of_contents', 'Table of Contents', true, 'Archduke'],
  ['bountiful_beanstalk', 'Bountiful Beanstalk', false, 'Viceroy'],
  ['school_of_sorcery', 'School of Sorcery', false, 'Viceroy'],
  ['draconic_depths', 'Draconic Depths', true, 'Viceroy'],
  ['rift_gnawnia', 'Gnawnia Rift', true, 'Count'],
  ['rift_burroughs', 'Burroughs Rift', true, 'Duke'],
  ['rift_whisker_woods', 'Whisker Woods Rift', true, 'Duke'],
  ['rift_furoma', 'Furoma Rift', true, 'Grand Duke'],
  ['rift_bristle_woods', 'Bristle Woods Rift', true, 'Grand Duke'],
  ['rift_valour', 'Valour Rift', true, 'Archduke']
];
/**
 * Environment type:id dictionary.
 */
const environmentTypeIdDictionary = {
  acolyte_realm: 1,
  meadow: 18,
  town_of_gnawnia: 28,
  ronzas_traveling_shoppe: 24,
  windmill: 30,
  harbour: 13,
  mountain: 20,
  winter_hunt_fortress: 68,
  winter_hunt_workshop: 70,
  winter_hunt_grove: 69,
  kings_arms: 38,
  tournament_hall: 37,
  kings_gauntlet: 15,
  calm_clearing: 4,
  great_gnarled_tree: 12,
  halloween_event_location: 64,
  lagoon: 17,
  laboratory: 16,
  mousoleum: 21,
  town_of_digby: 27,
  bazaar: 3,
  pollution_outbreak: 45,
  training_grounds: 29,
  dojo: 8,
  meditation_room: 19,
  pinnacle_chamber: 23,
  catacombs: 6,
  forbidden_grove: 11,
  cape_clawed: 5,
  elub_shore: 10,
  nerg_plains: 22,
  derr_dunes: 7,
  jungle_of_dread: 14,
  dracano: 9,
  balacks_cove: 2,
  claw_shot_city: 43,
  train_station: 44,
  fort_rox: 54,
  queso_river: 59,
  queso_plains: 57,
  queso_quarry: 58,
  queso_geyser: 61,
  super_brie_factory: 60,
  ss_huntington_ii: 26,
  seasonal_garden: 31,
  zugzwang_tower: 32,
  zugzwang_library: 36,
  slushy_shoreline: 39,
  iceberg: 40,
  sunken_city: 47,
  desert_warpath: 33,
  desert_city: 34,
  desert_oasis: 35,
  lost_city: 41,
  sand_dunes: 42,
  fungal_cavern: 50,
  labyrinth: 52,
  ancient_city: 51,
  moussu_picchu: 56,
  floating_islands: 63,
  foreword_farm: 65,
  prologue_pond: 66,
  table_of_contents: 67,
  bountiful_beanstalk: 71,
  school_of_sorcery: 72,
  draconic_depths: 73,
  rift_gnawnia: 46,
  rift_burroughs: 48,
  rift_whisker_woods: 49,
  rift_furoma: 53,
  rift_bristle_woods: 55,
  rift_valour: 62
};
/**
 * default location setup.
 */
const defaultLocationSetup = {
  derr_dunes: {
    weapon: {
      sort: 'best',
      name: 'best.weapon.physical'
    },
    base: {
      sort: null,
      name: 'Tiki Base'
    },
    bait: {
      sort: 'any',
      name: 'Gouda,Crunchy Cheese,Brie'
    },
    trinket: {
      sort: null,
      name: 'none'
    },
    litCandle: 'none'
  },
  desert_city: {
    weapon: {
      sort: 'best',
      name: 'best.weapon.physical'
    },
    base: {
      sort: null,
      name: 'best.base.combo'
    },
    bait: {
      sort: 'any',
      name: 'Brie,Empowered Brie'
    },
    trinket: {
      sort: 'any',
      name: 'Super Power Charm,Power Charm'
    },
    litCandle: 'none'
  }
};
/**
 * Save console logging to sessionStorage.
 * When exceed maxSaveLog, remove first half.
 * When QuotaExceededError, remove all Log_.
 */
function saveToSessionStorage() {
  let i;
  let str = '';
  for (i = 0; i < arguments.length; i++) {
    if (!isNullOrUndefined(arguments[i]) && typeof arguments[i] === 'object') {
      // if it is object
      str += JSON.stringify(arguments[i]);
    } else {
      str += arguments[i];
    }

    if (i != arguments.length - 1) str += ' ';
  }
  let key = '';
  let arrLog = [];
  for (i = 0; i < window.sessionStorage.length; i++) {
    key = window.sessionStorage.key(i);
    if (key.indexOf('Log_') > -1) arrLog.push(key);
  }
  if (arrLog.length > maxSaveLog) {
    arrLog = arrLog.sort();
    let count = Math.floor(maxSaveLog / 2);
    for (i = 0; i < count; i++) removeSessionStorage(arrLog[i]);
  }

  try {
    setSessionStorage(
      'Log_' + (performance.timing.navigationStart + performance.now()),
      str
    );
  } catch (e) {
    if (e.name == 'QuotaExceededError') {
      for (i = 0; i < window.sessionStorage.length; i++) {
        key = window.sessionStorage.key(i);
        if (key.indexOf('Log_') > -1) removeSessionStorage(key);
      }
      saveToSessionStorage.apply(this, arguments);
    }
  }
}
console.plog = function (...any) {
  if (isDebug) {
    saveToSessionStorage.apply(this, any);
    console.groupCollapsed(new Date(), ...any);
    // console.log(Error().stack);
    console.trace(...any);
    console.groupEnd();
  }
};
console.perror = function (...any) {
  if (isDebug) {
    saveToSessionStorage.apply(this, any);
    console.groupCollapsed(new Date(), ...any);
    // console.log(Error().stack);
    console.trace(...any);
    console.groupEnd();
  }
};
console.pdebug = function () {
  if (isDebug) {
    saveToSessionStorage.apply(this, arguments);
    console.trace.apply(console, arguments);
  }
};

// CNN KR SOLVER START
function FinalizePuzzleImageAnswer(answer) {
  logging('RUN FinalizePuzzleImageAnswer()');
  logging(answer);

  let myFrame;
  if (answer.length != 5) {
    //Get a new puzzle
    if (kingsRewardRetry >= kingsRewardRetryMax) {
      kingsRewardRetry = 0;
      setStorage('KingsRewardRetry', kingsRewardRetry);
      let strTemp =
        'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
      alert(strTemp);
      displayTimer(strTemp, strTemp, strTemp);
      console.perror(strTemp);
      return;
    } else {
      ++kingsRewardRetry;
      setStorage('KingsRewardRetry', kingsRewardRetry);
      let newCodeButton = document.getElementsByClassName(
        'puzzleView__requestNewPuzzleButton'
      );
      if (newCodeButton.length > 0) {
        console.plog('request new code button found!!');
        fireEvent(newCodeButton[0], 'click');
        myFrame = document.getElementById('myFrame');
        if (!isNullOrUndefined(myFrame)) document.body.removeChild(myFrame);
        window.setTimeout(function () {
          CallKRSolver();
        }, 6000);
        return;
      }
      /* let tagName = document.getElementsByTagName('a');
      for (let i = 0; i < tagName.length; i++) {
        if (tagName[i].innerText == 'Click here to get a new one!') {
          // IMPORTANT: Find another time to fetch new puzzle
          fireEvent(tagName[i], 'click');
          myFrame = document.getElementById('myFrame');
          if (!isNullOrUndefined(myFrame)) document.body.removeChild(myFrame);
          window.setTimeout(function () {
            CallKRSolver();
          }, 6000);
          return;
        }
      } */
    }
  } else {
    logging('Submitting captcha answer: ' + answer);
    //Submit answer

    //let puzzleAns = document.getElementById("puzzle_answer");
    let puzzleAns = document.getElementsByClassName('puzzleView__code')[0];

    if (!puzzleAns) {
      console.plog('puzzleAns: ' + puzzleAns);
      return;
    }
    puzzleAns.value = '';
    puzzleAns.value = answer.toLowerCase();

    //let puzzleSubmit = document.getElementById("puzzle_submit");
    let puzzleSubmit = document.getElementsByClassName(
      'puzzleView__solveButton'
    )[0];

    if (!puzzleSubmit) {
      console.plog('puzzleSubmit: ' + puzzleSubmit);
      return;
    }

    puzzleSubmit.classList.remove('disabled');

    fireEvent(puzzleSubmit, 'click');
    kingsRewardRetry = 0;
    setStorage('KingsRewardRetry', kingsRewardRetry);
    myFrame = document.getElementById('myFrame');
    if (myFrame) document.body.removeChild(myFrame);

    window.setTimeout(function () {
      CheckKRAnswerCorrectness();
    }, 5000);
  }
}

function receiveMessage(event) {
  console.plog('Event origin: ' + event.origin);

  if (!debugKR && !isAutoSolve) return;

  if (
    event.origin.indexOf('mhcdn') > -1 ||
    event.origin.indexOf('mousehuntgame') > -1 ||
    event.origin.indexOf('dropbox') > -1
  ) {
    console.plog(event.data);
    if (typeof event.data.indexOf !== 'function') {
      return;
    }
    if (event.data.indexOf('~') > -1) {
      let result = event.data.substring(0, event.data.indexOf('~'));
      if (saveKRImage) {
        let processedImg = event.data.substring(
          event.data.indexOf('~') + 1,
          event.data.length
        );
        let strKR = 'KR' + separator;
        strKR += Date.now() + separator;
        strKR += result + separator;
        strKR += 'RETRY' + kingsRewardRetry;
        try {
          setStorage(strKR, processedImg);
        } catch (e) {
          console.perror('receiveMessage', e.message);
        }
      }
      FinalizePuzzleImageAnswer(result);
    } else if (event.data.indexOf('#') > -1) {
      let value = event.data.substring(1, event.data.length);
      setStorage('krCallBack', value);
    } else if (event.data.indexOf('Log_') > -1) {
      console.plog(event.data.split('_')[1]);
    } else if (event.data.indexOf('MHAKRS_') > -1) {
      let temp = event.data.split('_');
      console.plog(temp[0], temp[1]);
      setStorage(temp[0], temp[1]);
    }
  }
}

function CallKRSolver() {
  console.plog('RUN CallKRSolver()');

  let frame = document.createElement('iframe');
  frame.setAttribute('id', 'myFrame');
  let img;
  if (debugKR) {
    //frame.src = "https://dl.dropboxusercontent.com/s/4u5msso39hfpo87/Capture.PNG";
    //frame.src = "https://dl.dropboxusercontent.com/s/og73bcdsn2qod63/download%20%2810%29Ori.png";
    frame.src =
      'https://dl.dropboxusercontent.com/s/ppg0l35h25phrx3/download%20(16).png';
  } else {
    //if (isNewUI) {

    img = document.getElementsByClassName('puzzleView__image')[0];
    logging('Captcha Image fetched:');
    logging(img);

    frame.src = img.querySelector('img').src;
    /*} else {
            img = document.getElementById('puzzleImage');
            frame.src = img.src;
        }*/
  }
  document.body.appendChild(frame);
}

function CheckKRAnswerCorrectness() {
  let puzzleForm = document.getElementsByClassName('puzzleView')[0];
  if (puzzleForm.classList.contains('puzzleView--state-solved')) {
    // KR is solved clicking continue now
    location.reload(true);
    resumeKRAfterSolved();
    return;
  }

  let strTemp = '';
  let codeError = document.getElementsByClassName('puzzleView__error');
  for (let i = 0; i < codeError.length; i++) {
    if (
      codeError[i].innerText.toLowerCase().indexOf('incorrect claim code') > -1
    ) {
      if (kingsRewardRetry >= kingsRewardRetryMax) {
        kingsRewardRetry = 0;
        setStorage('KingsRewardRetry', kingsRewardRetry);
        strTemp =
          'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
        alert(strTemp);
        displayTimer(strTemp, strTemp, strTemp);
        console.perror(strTemp);
      } else {
        ++kingsRewardRetry;
        setStorage('KingsRewardRetry', kingsRewardRetry);
        let newCodeButton = document.getElementsByClassName(
          'puzzleView__requestNewPuzzleButton'
        );
        if (newCodeButton.length > 0) {
          fireEvent(newCodeButton[0], 'click');
          myFrame = document.getElementById('myFrame');
          if (!isNullOrUndefined(myFrame)) document.body.removeChild(myFrame);
          window.setTimeout(function () {
            CallKRSolver();
          }, 6000);
          return;
        }
        /* ++kingsRewardRetry;
        setStorage('KingsRewardRetry', kingsRewardRetry);
        CallKRSolver(); */
      }
      return;
    }
  }

  window.setTimeout(function () {
    CheckKRAnswerCorrectness();
  }, 1000);
}

function resumeKRAfterSolved() {
  logging('RUN resumeKRAfterSolved()');

  /*const resumeButton = document.getElementsByClassName(
    'puzzleView__resumeButton'
  )[0];*/
  location.reload(true);
}

function addKREntries() {
  let i, temp, maxLen, keyName;
  let replaced = '';
  let nTimezoneOffset = -new Date().getTimezoneOffset() * 60000;
  let count = 1;
  let strInnerHTML = '';
  let selectViewKR = document.getElementById('viewKR');
  if (selectViewKR.options.length > 0) {
    // append keyKR for new KR entries under new UI
    for (i = 0; i < window.localStorage.length; i++) {
      keyName = window.localStorage.key(i);
      if (keyName.indexOf('KR' + separator) > -1 && keyKR.indexOf(keyName) < 0)
        keyKR.push(keyName);
    }
  }
  maxLen = keyKR.length.toString().length;
  for (i = 0; i < keyKR.length; i++) {
    if (keyKR[i].indexOf('KR' + separator) > -1) {
      temp = keyKR[i].split(separator);
      temp.splice(0, 1);
      temp[0] = parseInt(temp[0]);
      if (Number.isNaN(temp[0])) temp[0] = 0;

      temp[0] += nTimezoneOffset;
      temp[0] = new Date(temp[0]).toISOString();
      replaced = temp.join('&nbsp;&nbsp;');
      temp = count.toString();
      while (temp.length < maxLen) {
        temp = '0' + temp;
      }
      replaced = temp + '. ' + replaced;
      strInnerHTML +=
        '<option value="' +
        keyKR[i] +
        '"' +
        (i == keyKR.length - 1 ? ' selected' : '') +
        '>' +
        replaced +
        '</option>';
      count++;
    }
  }
  if (strInnerHTML !== '') selectViewKR.innerHTML = strInnerHTML;
}

function setKREntriesColor() {
  // set KR entries color
  let i, nCurrent, nNext, strCurrent;
  let selectViewKR = document.getElementById('viewKR');
  for (i = 0; i < selectViewKR.children.length; i++) {
    if (i < selectViewKR.children.length - 1) {
      nCurrent = parseInt(selectViewKR.children[i].value.split('~')[1]);
      nNext = parseInt(selectViewKR.children[i + 1].value.split('~')[1]);
      if (Math.round((nNext - nCurrent) / 60000) < 2)
        selectViewKR.children[i].style = 'color:red';
    }
    strCurrent = selectViewKR.children[i].value.split('~')[2];
    if (
      strCurrent == strCurrent.toUpperCase() &&
      selectViewKR.children[i].style.color != 'red'
    ) {
      selectViewKR.children[i].style = 'color:magenta';
    }
  }
}

window.addEventListener('message', receiveMessage, false);
if (debugKR) CallKRSolver();
// CNN KR SOLVER END

// start executing script
logging('STARTING SCRIPT - ver: ' + scriptVersion);
if (window.top != window.self) {
  logging(
    'In IFRAME - may cause firefox to error, location: ' + window.location.href
  );
  //return;
} else {
  logging('NOT IN IFRAME - will not work in fb MH');
}

let getMapPort;
try {
  if (!isNullOrUndefined(chrome.runtime.id)) {
    g_strScriptHandler = 'Extensions';
    g_strVersion = chrome.runtime.getManifest().version;
    getMapPort = chrome.runtime.connect({ name: 'map' });
    getMapPort.onMessage.addListener(function (msg) {
      logging(msg);
      if (msg.array.length > 0) checkCaughtMouse(msg.obj, msg.array);
    });
  } else {
    g_strScriptHandler = GM_info.scriptHandler + ' ' + GM_info.version;
    g_strVersion = GM_info.script.version;
  }
} catch (e) {
  console.perror('Before exeScript', e.message);
  getMapPort = undefined;
  g_strVersion = undefined;
  g_strScriptHandler = undefined;
}

exeScript();

/**
 * Main function.
 * 移除 titleElement.
 * Trap check time檢查(含防呆).
 * 處理臉書、Hi5等無法顯示 timer的網站.
 * 判斷遊戲平台.
 * 檢查通訊協定(HTTPS or not).
 * 根據遊戲平台的不同執行不同的 functions.
 * 本家平台執行:loadPreferenceSettingFromStorage(),
 * 如果!checkIntroContainer() && retrieveDataFirst(),
 * embedTimer(true),embedScript(),action(),nobInit().
 * 否則 errorReloadTime(秒)後重新載入網頁.
 */
function exeScript() {
  logging('RUN %cexeScript()', 'color: #9cffbd');
  browser = browserDetection();
  try {
    let titleElm = document.getElementById('titleElement');
    if (titleElm) {
      titleElm.parentNode.remove();
    }
  } catch (e) {
    logging('No past title elements found.');
  } finally {
    titleElm = null;
  }

  try {
    // check the trap check setting first
    trapCheckTimeDiff = GetTrapCheckTime();

    // check the trap check setting first
    if (trapCheckTimeDiff == 60) {
      trapCheckTimeDiff = 0;
    } else if (trapCheckTimeDiff < 0 || trapCheckTimeDiff > 60) {
      // invalid value, just disable the trap check
      enableTrapCheck = false;
    }

    if (showTimerInTitle) {
      // check if they are running in iFrame
      let contentElement, breakFrameDivElement;
      if (window.location.href.indexOf('apps.facebook.com/mousehunt/') != -1) {
        contentElement = document.getElementById('pagelet_canvas_content');
        if (contentElement) {
          breakFrameDivElement = document.createElement('div');
          breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
          breakFrameDivElement.innerHTML =
            "Timer cannot show on title page. You can <a href='http://www.mousehuntgame.com/canvas/'>run MouseHunt without iFrame (Facebook)</a> to enable timer on title page";
          contentElement.parentNode.insertBefore(
            breakFrameDivElement,
            contentElement
          );
        }
        contentElement = undefined;
      } else if (
        window.location.href.indexOf('hi5.com/friend/games/MouseHunt') != -1
      ) {
        contentElement = document.getElementById('apps-canvas-body');
        if (contentElement) {
          breakFrameDivElement = document.createElement('div');
          breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
          breakFrameDivElement.innerHTML =
            "Timer cannot show on title page. You can <a href='http://mousehunt.hi5.hitgrab.com/'>run MouseHunt without iFrame (Hi5)</a> to enable timer on title page";
          contentElement.parentNode.insertBefore(
            breakFrameDivElement,
            contentElement
          );
        }
        contentElement = breakFrameDivElement = undefined;
      }
    }

    // check user running this script from where
    if (window.location.href.indexOf('mousehuntgame.com/canvas/') != -1) {
      // from facebook
      fbPlatform = true;
      setStorage('Platform', 'FB');
    } else if (window.location.href.indexOf('mousehuntgame.com') != -1) {
      // need to check if it is running in mobile version
      let version = getCookie('switch_to');
      if (version !== null && version == 'mobile') {
        // from mousehunt game mobile version
        mhMobilePlatform = true;
        setStorage('Platform', 'MHMobile');
      } else {
        // from mousehunt game standard version
        mhPlatform = true;
        setStorage('Platform', 'MH');
      }
      version = undefined;
    } else if (
      window.location.href.indexOf('mousehunt.hi5.hitgrab.com') != -1
    ) {
      // from hi5
      hiFivePlatform = true;
      setStorage('Platform', 'Hi5');
    }

    // check if user running in https secure connection, true/false
    secureConnection = window.location.href.indexOf('https://') > -1;
    setStorage('HTTPS', secureConnection);

    if (fbPlatform) {
      if (
        window.location.href == 'http://www.mousehuntgame.com/canvas/' ||
        window.location.href == 'http://www.mousehuntgame.com/canvas/#' ||
        window.location.href == 'https://www.mousehuntgame.com/canvas/' ||
        window.location.href == 'https://www.mousehuntgame.com/canvas/#' ||
        window.location.href.indexOf('mousehuntgame.com/canvas/?') != -1
      ) {
        // page to execute the script!

        // make sure all the preference already loaded
        loadPreferenceSettingFromStorage();

        // this is the page to execute the script
        if (!checkIntroContainer() && retrieveDataFirst()) {
          // embed a place where timer show
          embedTimer(true);

          // embed script to horn button
          embedScript();

          // start script action
          action();

          nobInit();
        } else {
          // fail to retrieve data, display error msg and reload the page
          document.title =
            'Fail to retrieve data from page. Reloading in ' +
            timeFormat(errorReloadTime);
          window.setTimeout(function () {
            reloadWithMessage(title, false);
          }, errorReloadTime * 1000);
        }
      } else {
        // not in hunters camp, just show the title of autobot version
        embedTimer(false);

        nobInit();
      }
    } else if (mhPlatform) {
      if (
        window.location.href == 'http://www.mousehuntgame.com/' ||
        window.location.href == 'https://www.mousehuntgame.com/' ||
        window.location.href == 'http://www.mousehuntgame.com/#' ||
        window.location.href == 'https://www.mousehuntgame.com/#' ||
        window.location.href ==
          'http://www.mousehuntgame.com/?switch_to=standard' ||
        window.location.href ==
          'https://www.mousehuntgame.com/?switch_to=standard' ||
        window.location.href == 'http://www.mousehuntgame.com/index.php' ||
        window.location.href == 'https://www.mousehuntgame.com/index.php' ||
        window.location.href == 'http://www.mousehuntgame.com/camp.php' ||
        window.location.href == 'https://www.mousehuntgame.com/camp.php' ||
        window.location.href == 'http://www.mousehuntgame.com/camp.php#' ||
        window.location.href == 'https://www.mousehuntgame.com/camp.php#' ||
        window.location.href.indexOf('mousehuntgame.com/index.php') >= 0 ||
        window.location.href.indexOf('mousehuntgame.com/camp.php') >= 0 ||
        window.location.href.indexOf('mousehuntgame.com/camp.php#') >= 0
      ) {
        // page to execute the script!

        // make sure all the preference already loaded
        loadPreferenceSettingFromStorage();

        // this is the page to execute the script
        if (!checkIntroContainer() && retrieveDataFirst()) {
          // embed a place where timer show
          embedTimer(true);

          // embed script to horn button
          embedScript();

          // start script action
          action();

          nobInit();

          // check if time to rest
          // checkTakingRest();
        } else {
          // fail to retrieve data, display error msg and reload the page
          document.title =
            'Fail to retrieve data from page. Reloading in ' +
            timeFormat(errorReloadTime);
          window.setTimeout(function () {
            reloadWithMessage(title, false);
          }, errorReloadTime * 1000);
        }
      } else {
        // not in hunters camp, just show the title of autobot version
        embedTimer(false);
      }
    } else if (mhMobilePlatform) {
      // execute at all page of mobile version
      // page to execute the script!

      // make sure all the preference already loaded
      loadPreferenceSettingFromStorage();

      // embed a place where timer show
      embedTimer(false);
    } else if (hiFivePlatform) {
      if (
        window.location.href == 'http://mousehunt.hi5.hitgrab.com/#' ||
        window.location.href.indexOf('http://mousehunt.hi5.hitgrab.com/?') !=
          -1 ||
        window.location.href == 'http://mousehunt.hi5.hitgrab.com/' ||
        window.location.href.indexOf(
          'http://mousehunt.hi5.hitgrab.com/turn.php'
        ) != -1 ||
        window.location.href.indexOf(
          'http://mousehunt.hi5.hitgrab.com/?newpuzzle'
        ) != -1 ||
        window.location.href.indexOf(
          'http://mousehunt.hi5.hitgrab.com/index.php'
        ) != -1
      ) {
        // page to execute the script!

        // make sure all the preference already loaded
        loadPreferenceSettingFromStorage();

        // this is the page to execute the script
        if (!checkIntroContainer() && retrieveDataFirst()) {
          // embed a place where timer show
          embedTimer(true);

          // embed script to horn button
          embedScript();

          // start script action
          action();

          nobInit();

          // check if time to rest
          // checkTakingRest();
        } else {
          // fail to retrieve data, display error msg and reload the page
          document.title =
            'Fail to retrieve data from page. Reloading in ' +
            timeFormat(errorReloadTime);
          window.setTimeout(function () {
            reloadWithMessage(title, false);
          }, errorReloadTime * 1000);
        }
      } else {
        // not in hunters camp, just show the title of autobot version
        embedTimer(false);

        nobInit();
      }
    }
  } catch (e) {
    logging('exeScript error - ' + e);
  }
}

function GetTrapCheckTime() {
  // Check storage first
  let trapCheckFromStorage = getStorageToVariableInt('TrapCheckTimeOffset', -1);
  if (trapCheckFromStorage != -1) return trapCheckFromStorage;

  try {
    let passiveElement = document.getElementsByClassName('passive');
    if (passiveElement.length > 0) {
      let time = passiveElement[0].textContent;
      time = time.substr(time.indexOf('m -') - 4, 2);
      setStorage('TrapCheckTimeOffset', time);
      return parseInt(time);
    } else {
      throw new Error('passiveElement not found');
    }
  } catch (e) {
    console.perror('GetTrapCheckTime', e.message);
    let tempStorage = getStorage('TrapCheckTimeOffset');
    if (isNullOrUndefined(tempStorage)) {
      tempStorage = 0;
      setStorage('TrapCheckTimeOffset', tempStorage);
    }
    return parseInt(tempStorage);
  }
}
/** 應該是檢查是否存在新玩家引導 */
function checkIntroContainer() {
  logging('RUN %ccheckIntroContainer()', 'color: #bada55');
  const gotIntroContainerDiv = true;
  const introContainerDiv = document.getElementById('introContainer');
  if (introContainerDiv) return gotIntroContainerDiv;
  return !gotIntroContainerDiv;
}
/**
 * 取得最近一筆 journal並以 LastRecordedJournal
 * 為 key存入 localStorage.
 */
function getJournalDetail() {
  let strLastRecordedJournal = getStorageToVariableStr(
    'LastRecordedJournal',
    ''
  );
  let classJournal = document.getElementsByClassName('journaltext');
  let i,
    j,
    eleA,
    strTrap,
    temp,
    nIndexStart,
    nIndexEnd,
    nIndexCharm,
    nIndexCheese;
  let objResave = {
    trinket: false,
    bait: false
  };
  for (i = 0; i < classJournal.length; i++) {
    if (classJournal[i].parentNode.textContent == strLastRecordedJournal) break;

    eleA = classJournal[i].getElementsByTagName('a');
    if (eleA.length > 0) {
      // has loot(s)
      for (j = 0; j < eleA.length; j++) {
        strTrap = '';
        temp = eleA[j].textContent;
        if (temp.indexOf('Charm') > -1) {
          strTrap = 'trinket';
          temp = temp.replace(/Charms/, 'Charm');
        } else if (temp.indexOf('Cheese') > -1) strTrap = 'bait';
        temp = temp.replace(/\d+/, '');
        temp = temp.trimLeft();
        if (strTrap !== '' && objTrapList[strTrap].indexOf(temp) < 0) {
          console.plog('Add', temp, 'into', strTrap, 'list');
          objTrapList[strTrap].unshift(temp);
          objResave[strTrap] = true;
        }
      }
    } else {
      nIndexStart = -1;
      temp = classJournal[i].textContent.replace(/\./, '');
      temp = temp.replace(/Charms/, 'Charm');
      temp = temp.split(' ');
      if (classJournal[i].textContent.indexOf('crafted') > -1) {
        nIndexStart = temp.indexOf('crafted');
        if (nIndexStart > -1) nIndexStart += 2;
      } else if (classJournal[i].textContent.indexOf('purchased') > -1) {
        nIndexStart = temp.indexOf('purchased');
        if (nIndexStart > -1) nIndexStart += 2;
      }
      if (nIndexStart > -1) {
        strTrap = '';
        nIndexEnd = -1;
        nIndexCharm = temp.indexOf('Charm');
        nIndexCheese = temp.indexOf('Cheese');
        if (nIndexCharm > -1) {
          strTrap = 'trinket';
          nIndexEnd = nIndexCharm + 1;
        } else if (nIndexCheese > -1) {
          strTrap = 'bait';
          nIndexEnd = nIndexCheese + 1;
        }
        if (strTrap !== '' && nIndexEnd > -1) {
          temp = temp.slice(nIndexStart, nIndexEnd);
          temp = temp.join(' ');
          if (temp !== '' && objTrapList[strTrap].indexOf(temp) < 0) {
            console.plog('Add', temp, 'into', strTrap, 'list');
            objTrapList[strTrap].unshift(temp);
            objResave[strTrap] = true;
          }
        }
      }
    }
  }
  for (let prop in objResave) {
    if (objResave.hasOwnProperty(prop) && objResave[prop] === true)
      setStorage(
        'TrapList' + capitalizeFirstLetter(prop),
        objTrapList[prop].join(',')
      );
  }
  setStorage('LastRecordedJournal', classJournal[0].parentNode.textContent);

  const progressReport = document.getElementsByClassName(
    'entry short log_summary stats'
  );
  if (progressReport && progressReport.length > 0) {
    let reportId =
      'progressReport' + progressReport[0].getAttribute('data-entry-id');
    if (!getStorage(reportId)) {
      setStorage(reportId, progressReport[0].outerHTML);
    }
  }
}

function getJournalDetailFRift() {
  if (g_arrHeirloom.length != 3) return;
  let strLastRecordedJournal = getStorageToVariableStr(
    'LastRecordedJournalFRift',
    ''
  );
  let classJournal = document.getElementsByClassName('journaltext');
  let i, j, eleA, temp, nIndex;
  for (i = 0; i < classJournal.length; i++) {
    if (classJournal[i].parentNode.textContent == strLastRecordedJournal) break;
    eleA = classJournal[i].getElementsByTagName('a');
    if (eleA.length > 0) {
      // has loot(s)
      for (j = 0; j < eleA.length; j++) {
        temp = eleA[j].textContent;
        if (temp.indexOf('Chi Claw Heirloom') > -1) nIndex = 0;
        else if (temp.indexOf('Chi Fang Heirloom') > -1) nIndex = 1;
        else if (temp.indexOf('Chi Belt Heirloom') > -1) nIndex = 2;
        else nIndex = -1;
        if (nIndex > -1) g_arrHeirloom[nIndex]++;
      }
    }
  }
  setStorage(
    'LastRecordedJournalFRift',
    classJournal[0].parentNode.textContent
  );
}

//// EMBEDING ENHANCED EDITION CODE
function eventLocationCheck(caller) {
  logging('RUN eventLocationCheck(' + caller + ')');

  if (checkSuccessCatch()) {
    console.log('Terminate eventLocationCheck()');
    return;
  }
  console.log('Keep running eventLocationCheck()');

  let selAlgo = getStorageToVariableStr('eventLocation', 'None');
  let temp = '';

  if (selAlgo != null && selAlgo != '') logging('Running ' + selAlgo + ' bot.');

  const environmentType = getEnvironmentType();
  switch (selAlgo) {
    case 'Hunt For':
      huntFor();
      return;
    case 'Charge Egg 2015':
      checkCharge(12);
      return;
    case 'Charge Egg 2015(17)':
      checkCharge(17);
      return;
    case 'Charge Egg 2016 Medium + High':
      checkCharge2016(chargeMedium);
      return;
    case 'Charge Egg 2016 High':
      checkCharge2016(chargeHigh);
      return;
    case 'GES':
      if (environmentType == 'train_station') {
        hornTimeDelayMin = 10;
        hornTimeDelayMax = 210;
        // USING A SMARTER GES function
        gnawnianExpress();
        return;
      } else {
        break;
      }
    case 'Burroughs Rift(Red)':
      if (environmentType == 'rift_burroughs') {
        BurroughRift(true, 19, 20);
        return;
      } else {
        break;
      }
    case 'Burroughs Rift(Green)':
      if (environmentType == 'rift_burroughs') {
        BurroughRift(true, 6, 18);
        return;
      } else {
        break;
      }
    case 'Burroughs Rift(Yellow)':
      if (environmentType == 'rift_burroughs') {
        BurroughRift(true, 1, 5);
        return;
      } else {
        break;
      }
    case 'Burroughs Rift Custom':
      if (environmentType == 'rift_burroughs') {
        BRCustom();
        return;
      } else {
        break;
      }
    case 'Burroughs Rift Auto':
      if (environmentType == 'rift_burroughs') {
        burroughsRift();
        return;
      } else {
        break;
      }
    case 'Iceberg':
      if (environmentType == 'iceberg') {
        iceberg();
        return;
      } else {
        break;
      }
    case 'WWRift':
      if (environmentType == 'rift_whisker_woods') {
        // wwrift();
        whiskerWoodsRift();
        return;
      } else {
        break;
      }
    case 'Halloween 2016':
      Halloween2016();
      return;
    case 'Halloween 2015':
      Halloween2015();
      return;
    case 'Winter 2015':
      Winter2015();
      return;
    case 'GWH2023':
      gwh2023();
      return;
    case 'GWH2016R':
      gwh2016();
      return;
    case 'All LG Area':
      let allLGArea = ['desert_oasis', 'lost_city', 'sand_dunes'];
      if (allLGArea.indexOf(environmentType) > -1) {
        lgGeneral();
        return;
      } else {
        break;
      }
    case 'Sunken City':
      SunkenCity(false);
      return;
    case 'Sunken City Aggro':
      SunkenCity(true);
      return;
    case 'Sunken City Custom':
      SCCustom();
      return;
    case 'SG':
      if (
        environmentType == 'seasonal_garden' ||
        environmentType == 'zugzwang_tower'
      ) {
        seasonalGarden();
        return;
      } else {
        break;
      }
    case 'ZT':
      if (
        environmentType == 'zugzwang_tower' ||
        environmentType == 'seasonal_garden'
      ) {
        // ZTower();
        zugzwangTower();
        return;
      } else {
        break;
      }
    case 'Fiery Warpath':
      if (environmentType == 'desert_warpath') {
        // fieryWarpath();
        // fw();
        fieryWarpath();
        return;
      } else {
        break;
      }
    case 'Iceberg (Wax)':
      iceberg('wax');
      return;
    case 'Iceberg (Sticky)':
      iceberg('sticky');
      return;
    case 'Labyrinth':
      if (environmentType == 'labyrinth' || environmentType == 'ancient_city') {
        labyZokor();
        //labyrinth();
        //return;
        return;
      } else {
        break;
      }
    case 'Zokor':
      if (environmentType == 'labyrinth' || environmentType == 'ancient_city') {
        //zokor();
        labyZokor();
        return;
      } else {
        break;
      }
    case 'Furoma Rift':
      if (environmentType == 'rift_furoma') {
        fRift();
        return;
      } else {
        break;
      }
    case 'BC/JOD':
      if (environmentType == 'balacks_cove') {
        balackCoveJOD();
        return;
      } else {
        break;
      }
    case 'FG/AR':
      if (
        environmentType == 'forbidden_grove' ||
        environmentType == 'acolyte_realm'
      ) {
        forbiddenGroveAR();
        return;
      } else {
        break;
      }
    case 'Bristle Woods Rift':
      if (environmentType == 'rift_bristle_woods') {
        bwRift();
        return;
      } else {
        break;
      }
    case 'Fort Rox':
      if (environmentType == 'fort_rox') {
        fortRox();
        return;
      } else {
        break;
      }
    case 'Test':
      test();
      return;
    default:
      break;
  }
  locationSetup();
}

/**
 * Non-eventLocation setup for convenience,
 * such as Derr Dunes.
 * Coexists with eventLocation, but executed
 * later.
 * So this will replace eventLocation
 * setting if effective eventLocation and
 * locationSetup duplicated.
 */
function locationSetup() {
  const environmentType = getEnvironmentType();
  if (environmentType == '') {
    return;
  }
  logging('locationSetup in ', environmentType);
  /* By default, neither lit candle nor double egg.
  Turn them on in location-specific handling. */
  /* litCandle('none');
  doubleEgg(false); */
  const locationSetup = getStorageToObject(
    'locationSetup',
    defaultLocationSetup
  );
  logging(environmentType, ' setup: ', locationSetup);
  // location-specific handling.
  switch (environmentType) {
    case 'harbour':
      harbour();
      break;

    case 'mountain':
      mountain(locationSetup.mountain);
      break;

    case 'halloween_event_location':
      halloween();
      break;

    case 'acolyte_realm':
      forbiddenGroveAR();
      break;

    case 'forbidden_grove':
      forbiddenGroveAR();
      break;

    case 'jungle_of_dread':
      balackCoveJOD();
      break;

    case 'balacks_cove':
      balackCoveJOD();
      break;

    case 'fort_rox':
      fortRox();
      break;

    case 'seasonal_garden':
      seasonalGarden();
      break;

    case 'zugzwang_tower':
      zugzwangTower();
      break;

    case 'desert_oasis':
      lgGeneral();
      break;

    case 'lost_city':
      lgGeneral();
      break;

    case 'sand_dunes':
      lgGeneral();
      break;

    case 'labyrinth':
      labyZokor();
      break;

    case 'ancient_city':
      labyZokor();
      break;

    case 'rift_burroughs':
      burroughsRift();
      break;

    case 'rift_whisker_woods':
      whiskerWoodsRift();
      break;

    case 'rift_furoma':
      fRift();
      break;

    case 'rift_bristle_woods':
      bwRift();
      break;

    case 'super_brie_factory':
      superbrieFactory();
      break;

    default:
      // general location setup.
      if (!locationSetup[environmentType]) {
        // 沒 location setup時就單獨檢查是否裝備 superbrie.
        checkDisarmSuperbrie();
        break;
      }
      // location trap setup
      const trapTypes = [
        TrapType.bait,
        TrapType.weapon,
        TrapType.base,
        TrapType.trinket
      ];
      const armSortKey = 'sort';
      const armNameKey = 'name';
      for (let index = 0; index < trapTypes.length; index++) {
        const trapType = trapTypes[index];
        logging('setup for ', trapType);
        let trapName = locationSetup[environmentType][trapType][armNameKey];
        // logging('original setup text: ', trapName);
        trapName = parseTrapName(trapName);
        // logging('setup text parsed to: ', trapName);
        if (trapType === TrapType.bait && trapName[0] !== '')
          // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
          defaultBait = trapName[0];
        console.log(`default bait: ${defaultBait}`);
        const armPriority =
          locationSetup[environmentType][trapType][armSortKey];
        checkThenArm(armPriority, trapType, trapName);
      }
      // LNY candle
      litCandle(locationSetup[environmentType]['litCandle']);
      break;
  }
}
/** hooker to MhUtils.parseTrapName */
function parseTrapName(trapName) {
  return MhUtils.parseTrapName(trapName);
}
/**
 * Halloween automation.
 */
function halloween() {
  const todayUTC = new Date().toISOString().split('T')[0];
  const scream = 'Scream Cheese';
  const polter = 'Polter-Geitost';
  const bonefort = 'Bonefort Cheese';
  const monterey = 'Monterey Jack-O-Lantern';
  const shoppeCheese = 'Gouda Cheese';
  const bct = 'Boiling Cauldron';
  const acb = "Alchemist's Cookbook";
  const bestBase = 'best.base.combo';
  const sgotd = 'Seasonal Gift';
  const luck7up = 'Chrome Charm,Extreme Luck Charm,Super Regal';
  const luck5 = 'Airship Charm,Greasy Glob Charm,Luck Charm';
  const luck2to3 = 'Cactus Charm,Luck Charm';
  const none = 'none';
  const defaultSettings = {
    isAutoMap: false,
    isAutoBuyMap: false,
    minBrewingQty: 10,
    priorityBegin: 0,
    minBaitQuantity: [31, 61, 91, 61, 0], // [Scream,Polter,Bonefort,Monterey,shoppeCheese] reserved qty for next year
    minBaitQuantityTracking: [1, 1, 1, 1, 0],
    mapEndingQuantity: 3,
    mapEndingPriorityBegin: 0,
    saveBaitEndAt: null,
    isLootEnding: false,
    gotdDates: [],
    traps: {
      tracking: [
        [scream, bct, bestBase, none, true],
        [polter, bct, bestBase, none, false],
        [bonefort, bct, bestBase, none, false],
        [monterey, bct, acb, luck2to3, false],
        [shoppeCheese, bct, acb, luck2to3, false]
      ],
      boon: [
        [scream, bct, acb, luck7up, true],
        [polter, bct, acb, luck7up, false],
        [bonefort, bct, acb, luck5, false],
        [monterey, bct, acb, luck2to3, false],
        [shoppeCheese, bct, acb, luck2to3, false]
      ],
      gotd: [
        [scream, bct, sgotd, luck7up, true],
        [polter, bct, sgotd, luck7up, false],
        [bonefort, bct, sgotd, luck5, false],
        [monterey, bct, sgotd, luck2to3, false],
        [shoppeCheese, bct, sgotd, luck2to3, false]
      ]
    }
  };
  const settings = getStorageToObject(getEnvironmentType(), defaultSettings);
  // 超過指定日期,強制不再為了 map調節 bait的使用
  if (settings.saveBaitEndAt && Date.now() > Date.parse(settings.saveBaitEndAt))
    settings.mapEndingPriorityBegin = 0;
  const quest = user.quests.QuestHalloweenBoilingCauldron;
  const rewardTrack = quest.reward_track;
  const isTrackingReward = rewardTrack.total_progress < 40;
  const totalEE =
    parseQuantity(rewardTrack.total_progress) * 15 +
    parseQuantity(
      quest.items.cauldron_potion_ingredient_stat_item.quantity_unformatted
    );
  const traps =
    settings.gotdDates.indexOf(todayUTC) > -1
      ? settings.traps.gotd
      : isTrackingReward
      ? settings.traps.tracking
      : settings.traps.boon;
  if (
    (isTrackingReward && totalEE > 600) ||
    quest.is_shutdown ||
    quest.is_final_shutdown
  ) {
    // traps[4][0] = 'Brie Cheese'; // shutdown phase用 Brie就夠了, brew只看 hunts
    armAllTraps(...traps[4]); // shoppe cheese setup
    toggleIncense(traps[4][4]);
    return;
  }
  const minBaitQuantity = isTrackingReward
    ? settings.minBaitQuantityTracking
    : settings.minBaitQuantity;
  const ingredients = [
    parseQuantity(
      quest.items.cauldron_tier_4_ingredient_stat_item.quantity_unformatted
    ),
    parseQuantity(
      quest.items.cauldron_tier_3_ingredient_stat_item.quantity_unformatted
    ),
    parseQuantity(
      quest.items.cauldron_tier_2_ingredient_stat_item.quantity_unformatted
    ),
    parseQuantity(
      quest.items.cauldron_tier_1_ingredient_stat_item.quantity_unformatted
    ),
    parseQuantity(
      quest.items.cauldron_potion_ingredient_stat_item.quantity_unformatted
    )
  ];
  if (settings.isLootEnding) {
    // 接近停止 loot時,把 tier-4 tier-3材料歸零就好,可以繼續收集 Bonefort
    // 也就是只用 Gouda/Monterey hunting. Bonefort材料有剩也不是太浪費
    if (ingredients[0] % 15 > 1) logging('Normally hunt.');
    else if (ingredients[1] % 15 > 2) minBaitQuantity[1] = 1000;
    else {
      minBaitQuantity[1] = 1000;
      minBaitQuantity[2] = 1000;
    }
  }
  logging('minBaitQuantity:', minBaitQuantity);
  const cheeseStats = [
    parseQuantity(quest.items.cauldron_tier_4_cheese.quantity_unformatted),
    parseQuantity(quest.items.cauldron_tier_3_cheese.quantity_unformatted),
    parseQuantity(quest.items.cauldron_tier_2_cheese.quantity_unformatted),
    parseQuantity(quest.items.cauldron_tier_1_cheese.quantity_unformatted),
    1000
  ];
  const mapMouseRemaining = () => {
    const maps = user.quests.QuestRelicHunter.maps;
    for (let i = 0; i < maps.length; i++) {
      const map = maps[i];
      if (map.map_class == 'event') {
        logging('Remaining map mouse quantity:', map.num_total - map.num_found);
        return map.num_total - map.num_found;
      }
    }
    return 0;
  };
  let priorityBegin = settings.priorityBegin;
  if (mapMouseRemaining() > settings.mapEndingQuantity)
    priorityBegin = Math.max(
      settings.priorityBegin,
      settings.mapEndingPriorityBegin
    );
  // logging('Auto choose cheese');
  for (let i = priorityBegin; i < cheeseStats.length; i++) {
    const baitQuantity = cheeseStats[i];
    if (baitQuantity > minBaitQuantity[i]) {
      logging('found best bait with enough quantity, bait index:', i);
      const trap = traps[i];
      logging(trap);
      if (trap) {
        armAllTraps(...trap);
        toggleIncense(trap[4]);
      }
      break;
    }
  }
  function toggleIncense(isEnabled) {
    const iiQuantity = parseQuantity(
      quest.items.insidious_incense_stat_item.quantity
    );
    if (iiQuantity < 1) return;
    const isDisable =
      (isTrackingReward && totalEE > 600 && iiQuantity < 32) ||
      (!isTrackingReward && iiQuantity < 32) ||
      quest.is_shutdown ||
      quest.is_final_shutdown;
    const isFuelEnabled = quest.is_fuel_enabled;
    if ((isFuelEnabled == true) !== (isEnabled && !isDisable))
      hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.toggleFuel();
  }
}
/**
 * Harbour automation.
 */
function harbour() {
  const beginSearchButton = document.querySelector('.harbourHUD-beginSearch');
  if (isvisible(beginSearchButton)) {
    logging('Saw begin search button, click it.');
    beginSearchButton.click();
  }
  const claimBootyButton = document.querySelector(
    '.harbourHUD-claimBootyButton.active'
  );
  if (claimBootyButton) {
    logging('Saw claim booty button, click it.');
    claimBootyButton.click();
  }
  setTimeout(() => {
    document.querySelector('a.jsDialogClose, a#jsDialogClose').click();
    checkDisarmSuperbrie();
  }, 3000);
}

/**
 * Mountain automation.
 * @param {Object} settings locationSetup for mountain
 */
function mountain(settings) {
  const quest = user.quests.QuestMountain;
  /* let boulderHp = parseInt(questMountain.boulder_hp);
  if (Number.isNaN(boulderHp)) boulderHp = 0;
  if (boulderHp == 0) { */
  const boulderStatus = trimToEmpty(quest.boulder_status);
  if (boulderStatus === 'can_claim') {
    const claimButton = document
      .getElementsByClassName('mountainHUD-boulder')[0]
      .getElementsByClassName('mousehuntActionButton small')[0];
    claimButton.click();
  }
  if (!settings) {
    setTimeout(() => {
      checkDisarmSuperbrie();
    }, 15000);
    return;
  }
  let baitName = settings.bait.name;
  let weaponName = settings.weapon.name;
  let baseName = settings.base.name;
  let charmName = '';
  const items = quest.items;
  const cheddoreQuantity = parseQuantity(items.cheddore_cheese.quantity);
  const nonPowerCharm = 'Tarnished Charm,Unstable Charm,None';
  if (cheddoreQuantity > 70) {
    charmName = nonPowerCharm;
  } else if (cheddoreQuantity < 40) {
    charmName = settings.trinket.name;
  }
  const boulderHp = parseQuantity(quest.boulder_hp);
  const superPowerQty = parseQuantity(items.super_power_trinket.quantity);
  const superPowerName = 'Super Power Charm';
  /* const powerQty = parseQuantity(items.power_trinket.quantity);
  const powerName = 'Power Charm'; */
  const smallPowerQty = parseQuantity(items.weak_power_trinket.quantity);
  const smallPowerName = 'Small Power Charm';
  const isAutoCharm =
    settings.isAutoCharm &&
    cheddoreQuantity < 71 &&
    user.trinket_item_id &&
    nonPowerCharm.indexOf(getCharmName()) < 0;
  if (isAutoCharm) {
    charmName = settings.trinket.name;
    switch (boulderHp) {
      case 2500:
        if (superPowerQty > 1) charmName = superPowerName;
        break;
      case 2250:
        if (superPowerQty > 0) charmName = superPowerName;
        break;
      case 2000:
        if (superPowerQty > 1) charmName = superPowerName;
        break;
      case 1750:
        if (superPowerQty > 0) charmName = superPowerName;
        break;
      case 1500:
        if (superPowerQty > 1) charmName = superPowerName;
        break;
      case 1250:
        if (superPowerQty > 0) charmName = superPowerName;
        break;
      case 1000:
        break;
      case 750:
        if (superPowerQty > 0) charmName = superPowerName;
        break;
      case 500:
        break;
      case 250:
        if (smallPowerQty > 0) charmName = smallPowerName;
        break;
      case 250:
        if (smallPowerQty > 0) charmName = smallPowerName;
        break;
      case 0:
        if (superPowerQty > 1) charmName = superPowerName;
        break;

      default:
        break;
    }
  }
  const baitSort = settings.bait.sort;
  const weaponSort = settings.weapon.sort;
  const baseSort = settings.base.sort;
  const charmSort = settings.trinket.sort;
  checkThenArm(baitSort, TrapType.bait, parseTrapName(baitName));
  checkThenArm(weaponSort, TrapType.weapon, parseTrapName(weaponName));
  checkThenArm(baseSort, TrapType.base, parseTrapName(baseName));
  checkThenArm(charmSort, TrapType.trinket, parseTrapName(charmName));
  const currentBait = getBaitName();
  if (
    settings.bait.name.indexOf('SUPER') == 0 ||
    currentBait.indexOf('SUPER') == 0
  ) {
    setTimeout(() => {
      checkDisarmSuperbrie();
    }, 15000);
  }
}

/**
 * Prevent from using checkThenArm in after:.
 * It's better modifying eventLocation or locationSetup setting,
 * and then let eventLocationCheck and locationSetup to checkThenArm
 * to prevent from checkThenArm conflicting.
 */
const huntingLocationsSample = [
  {
    environmentType: 'rift_burroughs',
    targets: [
      {
        target: 'test',
        quantity: 0,
        after: `console.log('0 quantity');false;`
      },
      {
        target: 'Menace of the Rift',
        quantity: 1,
        trap: {
          bait: 'Polluted Parmesan',
          weapon: 'best.weapon.rift',
          base: 'best.base.combo',
          trinket: 'Festive Ultimate Power Charm'
        },
        checkCaughtFunctionName: 'hasCaughtTargetByMouseName',
        after: `console.log('after executed.');false;`
      }
    ]
  }
];

/**
 * Check if targets in localStorage item huntingLocations
 * are successfully caught.
 * Use target as keyword to search in
 * textContent of catchsuccess journal entry.
 *
 * @return {Boolean} Terminate eventLocationCheck or not.
 */
function checkSuccessCatch() {
  // Check if caught target mouse and handle after actions
  console.log('Executing checkSuccessCatch().');
  // TODO 處理 environmentType可能與 sleepIn/workIn衝突
  // console.log('Remove cleared target and location first.');
  const huntingLocationsStr = window.localStorage.getItem('huntingLocations'); // defaultHuntingLocations;
  if (!huntingLocationsStr) return false;
  const huntingLocations = JSON.parse(huntingLocationsStr);
  if (huntingLocations.length == 0) return false;
  console.log('There are hunting locations, removing cleared location first.');
  let isModified = false;
  for (let i = 0; i < huntingLocations.length; i++) {
    const huntingLocation = huntingLocations[i];
    console.log('Hunting location at index', i, huntingLocation);
    const huntedTargets = huntingLocation.targets;
    if (!huntedTargets || huntedTargets.length == 0) {
      huntingLocations.splice(i, 1);
      isModified = true;
      continue;
    }
    console.log('There are hunted targets.');
    for (let j = 0; j < huntedTargets.length; j++) {
      const huntedTarget = huntedTargets[j];
      if (huntedTarget.quantity == 0) {
        console.log('Hunted target cleared, ', huntedTarget);
        huntedTargets.splice(j, 1);
        isModified = true;
      }
    }
    if (huntedTargets.length == 0) {
      huntingLocations.splice(i, 1);
      isModified = true;
    }
  }
  console.log('Are there initially 0 quantity mouses? ', isModified);
  if (isModified) {
    window.localStorage.setItem(
      'huntingLocations',
      JSON.stringify(huntingLocations)
    );
    console.log('There are removed target(s), write back to localStorage.');
  }
  console.log('Treat latestSuccessEntryId and catchSuccessMouses');
  let caughtMouse;
  for (let i = 0; i < huntingLocations.length; i++) {
    const huntingLocation = huntingLocations[i];
    console.log('Hunting location at index', i, huntingLocation);
    const huntedTargets = huntingLocation.targets;
    for (let j = 0; j < huntedTargets.length; j++) {
      const huntedTarget = huntedTargets[j];
      if (hasCaughtTargetByMouseName(huntedTarget.target)) {
        caughtMouse = huntedTargets.splice(j, 1);
        console.log('Caught hunted target:', caughtMouse);
        break;
      }
    }
    if (huntedTargets.length == 0) {
      huntingLocations.splice(i, 1);
    }
    if (caughtMouse) break;
  }
  if (caughtMouse && caughtMouse.length > 0) {
    console.log(
      'Caught hunted target:',
      caughtMouse,
      ', eval "after" codes:',
      caughtMouse[0].after
    );
    window.localStorage.setItem(
      'huntingLocations',
      JSON.stringify(huntingLocations)
    );
    return eval(caughtMouse[0].after);
  }
  return false;
}

function checkOneSuccessCatch() {
  console.log('Executing checkOneSuccessCatch().');
  // Treat latestSuccessEntryId and catchSuccessMouses
  // 釐清兩件事: check caught mouses跟 tracking down mouses.不分清楚程式就會亂.
  const setting = huntingLocationsSample;
  if (!setting || setting.length == 0) return false;
  console.log('Have setting.');
  for (let i = 0; i < setting.length; i++) {
    const oneSuccessCatchMouse = setting[i];
    console.log('oneSuccessCatchMouse at index', i, oneSuccessCatchMouse);
    // if not in specified location, travel to there( will reload)
    // and return true to terminating eventLocationCheck.
    if (getEnvironmentType() != oneSuccessCatchMouse.environmentType) {
      console.log('Not correct location, travel.');
      travel(oneSuccessCatchMouse.environmentType);
      return true;
    }
    console.log('Correct location.');
    const targets = oneSuccessCatchMouse.targets;
    if (!targets || targets.length == 0) return false;
    console.log('Have targets.');
    // 找出 1個需處理的 target.
    let target = null;
    for (let j = 0; j < targets.length; j++) {
      console.log('Find 1 target to treat.');
      const element = targets[j];
      if (element.quantity < 1) {
        // 如果 target已歸零,移除掉(後面寫回 localStorage)且不予處理.
        console.log('Target quantity 0, done.');
        targets.splice(j, 1);
        continue;
      }
      console.log('Treating target found at index', j);
      target = element;
      break; // 找到1個就中斷迴圈並開始處理
    }
    // 如果 oneSuccessCatchMouse中找不到需處理的 target,
    // 從 setting中移除後回寫 setting,
    // 然後重新執行自己(小心無窮迴圈),並回傳 true中斷執行後面的程式.
    if (!target) {
      console.log('No target in setting index 0');
      setting.splice(0, 1);
      window.localStorage.setItem(
        'oneSuccessCatchMouses',
        huntingLocationsSample
      );
      checkOneSuccessCatch();
      return true;
    }
    let weaponName = '',
      baseName = '',
      charmName = '',
      baitName = '';
    if (oneSuccessCatchMouse.trap) {
      weaponName = parseTrapName(trimToEmpty(oneSuccessCatchMouse.trap.weapon));
      baseName = parseTrapName(trimToEmpty(oneSuccessCatchMouse.trap.base));
      charmName = parseTrapName(trimToEmpty(oneSuccessCatchMouse.trap.trinket));
      baitName = parseTrapName(trimToEmpty(oneSuccessCatchMouse.trap.bait));
      // return true; // 必須 return, 但可能要後面一點.不然重點的 checkCaught跑不到.
    }
    // const currentBait = getBaitName();
    if (
      window[oneSuccessCatchMouse.checkCaughtFunctionName](
        oneSuccessCatchMouse.targets
      )
    ) {
      return eval(oneSuccessCatchMouse.after);
    }
    // 有設定 trap的話,不能繼續跑後面的 eventLocationCheck,不然 checkThenArm會衝突
    // 所以下面這段程式碼的執行點要深思
    if (oneSuccessCatchMouse.trap) return true;
  }
  return false;
}

function executeFunctionByName(functionName, context /*, args */) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split('.');
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}

/**
 * 成功捕捉指定老鼠後,將 superbrie換成 defaultBait
 */
function checkDisarmSuperbrie() {
  const currentBait = getBaitName();
  if (currentBait.indexOf('SUPER') != 0) {
    return;
  }
  const superbrieMouseSetting = getStorage('superbrieMouses');
  if (!superbrieMouseSetting || superbrieMouseSetting == '') {
    checkThenArm(null, 'bait', defaultBait);
    return;
  }
  const superbrieMouses = JSON.parse(superbrieMouseSetting);
  const loc = getEnvironmentType();
  const locationMouses = superbrieMouses[loc];
  if (!locationMouses || locationMouses.length < 1) {
    checkThenArm(null, 'bait', defaultBait);
    return;
  }
  const mouseEntries = $('div[data-mouse-type]');
  let isChanged = false;
  for (let i = 0; i < mouseEntries.length; i++) {
    const mouseEntry = mouseEntries[i];
    const mouseIndex = locationMouses.indexOf(
      mouseEntry.getAttribute('data-mouse-type')
    );
    if (
      mouseIndex > -1 &&
      mouseEntry.className &&
      mouseEntry.className.indexOf('success') > -1
    ) {
      locationMouses.splice(mouseIndex, 1);
      isChanged = true;
      console.plog('after splice, superbrieMouses became: ', superbrieMouses);
    }
  }
  if (isChanged) {
    if (locationMouses.length < 1) checkThenArm(null, 'bait', defaultBait);
    setStorage('superbrieMouses', JSON.stringify(superbrieMouses));
  }
  // const newEntries = document.getElementsByClassName('newEntry')[0].getAttribute('data-mouse-type');
  /* const journals = document.getElementById('journalContainer').getElementsByClassName('journaltext');
  for (let i = 0; i < journals.length; i++) {
      const journal = journals[i];
      let links = journal.getElementsByTagName('a');
      for (let j = 0; j < links.length; j++) {
        const link = links[j];
        const text = link.innerText;
        if (text.indexOf('Gluttonous Zombie') == 0) {
          console.log(text);
        }
      }
  } */
}

/**
 * Find data-mouse-type attribute of successfully catch journal.
 * @return {Array<String>} array of journal data-mouse-type attribute
 */
function findCaughtMouseJournal() {
  const journalMouses = $('div[data-mouse-type]');
  const caughtMouses = [];
  for (let i = 0; i < journalMouses.length; i++) {
    const journalMouse = journalMouses[i];
    if (journalMouse.className.indexOf('success') > -1) {
      caughtMouses.push(journalMouse.getAttribute('data-mouse-type'));
    }
  }
  return caughtMouses;
}
// prettier-ignore
/**
 * 各房間升級所需材料數量.
 * 讓 array index與等級直接相等.
 */
const roomMaterials = {
  pumping_room: [[], [], [5, 0, 0, 0], [5, 0, 5, 0], [10, 5, 0, 5], [20, 10, 10, 10]],
  break_room: [[], [], [0, 0, 5, 0], [5, 0, 5, 0], [0, 5, 10, 5], [10, 10, 15, 10]],
  mixing_room: [[], [], [0, 5, 0, 0], [0, 10, 0, 5], [5, 10, 5, 0], [10, 20, 10, 5]],
  quality_assurance_room: [[], [], [0, 0, 0, 5], [0, 5, 0, 5], [5, 0, 5, 10], [10, 10, 10, 10]],
  material_in_room: ['pumping_room', 'mixing_room', 'break_room', 'quality_assurance_room']
};
const SbFactoryTrapKeys = {
  gouda: 'gouda_cheese',
  sb: 'super_brie_cheese',
  cc: 'coggy_colby_cheese',
  scc: 'speed_coggy_colby_cheese',
  boss: 'boss'
};
/**
 * Super|brie+ Factory.
 */
function superbrieFactory() {
  const version = '1.0.9';
  logging(`superbrieFactory_${version}`);
  const location = getEnvironmentType();
  if (location != 'super_brie_factory') return;
  // prettier-ignore
  $('.superBrieFactoryHUD-itemContainer.craftingItems').css({'background-color': '#BEEDC7', 'top': '0px', 'left': '410px', 'zIndex': '2'});
  // prettier-ignore
  $('.superBrieFactoryHUD-itemContainer.trinket').css({'background-color': '#BEEDC7', 'top': '30px', 'left': '410px', 'zIndex': '2'});
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Gouda Cheese';
  const quest = user.quests.QuestSuperBrieFactory;
  // if (quest.is_shutdown || quest.is_shutdown_enabled) return;
  // prettier-ignore
  const defaultSettings = {
    isStopEvent: false,
    isAutoRoom: true,
    isAutoFrc: true,
    isEnerchi: false,
    ccStartQty: 14,
    ccKeptQty: 2,
    traps: {
      gouda_cheese: ['Gouda Cheese', 'best.weapon.law', 'Seasonal Gift', 'Factory Repair Charm,Tarnished Charm,Unstable Charm,None'],
      super_brie_cheese: ['SUPER', 'best.weapon.law', 'Seasonal Gift', 'Factory Repair Charm,Tarnished Charm,Unstable Charm,None'],
      coggy_colby_cheese: {
        pumping_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None'],
        break_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None'],
        mixing_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None'],
        quality_assurance_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None']
      },
      speed_coggy_colby_cheese: {
        pumping_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None'],
        break_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None'],
        mixing_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None'],
        quality_assurance_room:['Coggy Colby', 'Boiling Cauldron', 'Seasonal Gift', 'Tarnished Charm,Unstable Charm,None']
      },
      boss: ['SUPER', 'best.weapon.physical', 'Seasonal Gift', 'None']
    },
    materialPlan: [
      [8, 8, 4, 4],
      [8, 8, 8, 8],
      [16, 16, 8, 8],
      [16, 16, 16, 16],
      [24, 24, 16, 16],
      [24, 24, 24, 24],
      [32, 32, 24, 24],
      [32, 32, 32, 32]
    ]
  };
  // claim crate
  const theCrate = document.querySelector('.superBrieFactoryHUD-claimButton');
  if (isvisible(theCrate)) {
    /* const element = '<a href="#" class="superBrieFactoryHUD-claimButton reveal">';
      hg.views.HeadsUpDisplaySuperBrieFactoryView.claimReward(element); */
    setTimeout(() => {
      theCrate.click();
      setTimeout(() => {
        document
          .querySelector('a#jsDialogClose, a.jsDialogClose')
          .dispatchEvent(new Event('click'));
      }, getRandomInteger(5000, 6500));
    }, getRandomInteger(1500, 2500));
  }
  const settings = getStorageToObject('superbrieFactory', defaultSettings);
  const factoryAtts = quest.factory_atts;
  const currentRoom = trimToEmpty(factoryAtts.current_room);
  const items = quest.items;
  const frcQty = parseQuantity(items.birthday_factory_trinket.quantity);
  const maxProgress = factoryAtts.max_pipe_progress;
  const currentProgress = factoryAtts.current_progress;
  /* let speed = parseQuantity(factoryAtts.pipe_speed);
  if (armedCharm.indexOf('Factory Repair') !== 0) speed += 10; // 裝上 FRC後 speed+10
  if (speed === 0) speed = 2000; // 2000: max_pipe_progress */
  const progressLeft = maxProgress - currentProgress;
  const roomDatas = factoryAtts.room_data;
  const myRoomLevels = {};
  for (let i = 0; i < roomDatas.length; i++) {
    const roomData = roomDatas[i];
    switch (roomData.type) {
      case 'mixing_room':
        // mixingRoomLevel = roomData.level;
        myRoomLevels['mixing_room'] = roomData.level;
        break;
      case 'break_room':
        // breakRoomLevel = roomData.level;
        myRoomLevels['break_room'] = roomData.level;
        break;
      case 'pumping_room':
        // pumpRoomLevel = roomData.level;
        myRoomLevels['pumping_room'] = roomData.level;
        break;
      case 'quality_assurance_room':
        // qaRoomLevel = roomData.level;
        myRoomLevels['quality_assurance_room'] = roomData.level;
        break;
      default:
        break;
    }
  }
  logging('Levels of my room: ', myRoomLevels);
  const myRoomLevelsArray = [
    myRoomLevels['pumping_room'],
    myRoomLevels['break_room'],
    myRoomLevels['mixing_room'],
    myRoomLevels['quality_assurance_room']
  ];
  const treatEnerchi = (trap) => {
    // use Enerchi Charm algorithm
    if (settings.isEnerchi && (trap[3].indexOf('Factory') < 0 || frcQty < 1)) {
      trap[2] = 'Attuned Enerchi';
      trap[3] = 'Enerchi Charm';
    }
  };
  // default trap is currently using trap
  let currentTrapKey = localStorage.currentTrapKey;
  // no currentTrapKey
  if (!currentTrapKey) currentTrapKey = SbFactoryTrapKeys.sb;
  let trap = settings.traps[currentTrapKey][currentRoom];
  // maybe no room setting(gouda/sb/boss)
  if (!trap) trap = settings.traps[currentTrapKey];
  // wrong currentTrapKey
  if (!trap) trap = settings.traps[SbFactoryTrapKeys.sb];
  // boss warning, change to boss trap
  if (factoryAtts.boss_warning) {
    logging('boss coming');
    trap = settings.traps.boss;
    if (settings.isStopEvent || quest.is_shutdown_enabled)
      trap[0] = 'Gouda Cheese';
    armAllTraps(...trap);
    return;
  }
  // shutdown前如果來不及完成拿到 crate,不要做,用 gouda收集 CC明年用.
  // 細節忘了,但是 shutdown後才完成拿到 crate是不划算的
  if (settings.isStopEvent || quest.is_shutdown_enabled) {
    logging('stop eventing');
    trap = settings.traps.gouda_cheese;
    // 絕對不用 FRC
    trap[3] = trap[3]
      .replaceAll('Factory Repair Charm,', '')
      .replaceAll(',Factory Repair Charm', '');
    treatEnerchi(trap);
    armAllTraps(...trap);
    return;
  }
  // all rooms level 5
  // isAutoFrc才觸發 FRC安裝,後續才能根據餘數處理,不要把 FRC用到光
  if (Math.min(...myRoomLevelsArray) == 5) {
    if (
      (settings.isAutoFrc && frcQty > 4 && progressLeft > 200) ||
      (frcQty > 1 && progressLeft % 40 !== 0)
    ) {
      trap = settings.traps[SbFactoryTrapKeys.sb];
      trap[3] = 'Factory Repair Charm';
      armAllTraps(...trap);
      return;
    }
  }
  // use cc trap algorithm
  const ccQty = parseQuantity(items.coggy_colby_cheese.quantity);
  let huntsLeft = factoryAtts.hunts_remaining;
  if (!huntsLeft || Number.isNaN(parseInt(huntsLeft)))
    huntsLeft = Number.MAX_SAFE_INTEGER;
  if (
    ccQty > settings.ccStartQty ||
    (myRoomLevelsArray[0] == 5 && ccQty > huntsLeft)
  ) {
    localStorage.currentTrapKey = SbFactoryTrapKeys.cc;
    trap = settings.traps[SbFactoryTrapKeys.cc][currentRoom];
  }
  if (ccQty < settings.ccKeptQty) {
    localStorage.currentTrapKey = SbFactoryTrapKeys.sb;
    trap = settings.traps[SbFactoryTrapKeys.sb];
  }
  treatEnerchi(trap);
  // 最後 200 progress, 剩餘的 pipe progress無法被裝上 FRC後的 speed整除的話,就不要浪費 FRC
  // 200 == 40 * 5 = 50 *4, 不能整除的話只差 1 hunt而已,不用浪費 FRC
  if (progressLeft <= 200 && progressLeft % 50 !== 0) {
    trap[3] = trap[3]
      .replaceAll('Factory Repair Charm,', '')
      .replaceAll(',Factory Repair Charm', '');
  }
  armAllTraps(...trap);
  /**
   * Room upgrading plan.
   */
  const upgradePlan = [
    ['pumping_room', 4],
    ['break_room', 2],
    ['pumping_room', 5],
    ['break_room', 5],
    ['mixing_room', 5],
    ['quality_assurance_room', 5]
  ];
  const myMaterials = [
    items.birthday_factory_pumping_room_stat_item.quantity,
    items.birthday_factory_mixing_room_stat_item.quantity,
    items.birthday_factory_break_room_stat_item.quantity,
    items.birthday_factory_quality_assurance_room_stat_item.quantity
  ];
  logging('my materials(pump/mix/break/qa): ', myMaterials);
  // 至少有一個房間還沒 5級
  if (Math.min(...myRoomLevelsArray) < 5) {
    for (let i = 0; i < upgradePlan.length; i++) {
      const stagedGoal = upgradePlan[i];
      const doingRoom = stagedGoal[0];
      const doingRoomGoalLevel = stagedGoal[1];
      const doingRoomCurrentLevel = myRoomLevels[doingRoom];
      if (doingRoomCurrentLevel < doingRoomGoalLevel) {
        for (let j = 0; j < roomDatas.length; j++) {
          const roomData = roomDatas[j];
          if (roomData.type == doingRoom && roomData.can_upgrade) {
            const element = $(
              '<a href="#" class="mousehuntActionButton  " data-room="' +
                roomData.type +
                '">'
            );
            setTimeout(function () {
              hg.views.HeadsUpDisplaySuperBrieFactoryView.upgradeRoom(element);
            }, 5000);
            setTimeout(function () {
              reloadWithMessage('Upgraded room!! Superbrie factory', false);
            }, 10000);
            return;
          }
        }
        const nextLevelMaterials =
          roomMaterials[doingRoom][doingRoomCurrentLevel + 1];
        for (let j = 0; j < myMaterials.length; j++) {
          const myMaterial = myMaterials[j];
          const nextLevelMaterial = nextLevelMaterials[j];
          const nextLevelMaterialInRoom = roomMaterials['material_in_room'][j];
          if (myMaterial < nextLevelMaterial) {
            if (currentRoom != nextLevelMaterialInRoom) {
              logging('Find next material in room: ', nextLevelMaterialInRoom);
              enterRoom(nextLevelMaterialInRoom);
            }
            break;
          }
        }
        break;
      }
    }
    return;
  }
  const myRoomOrder = roomMaterials['material_in_room'];
  const materialPlan = settings.materialPlan;
  const buyFrc = () => {
    logging('buyFrc');
    const progressRemainder = parseInt((progressLeft % 40) / 10);
    // Using FRC, not buy
    if (frcQty > 1 && progressRemainder !== 0) {
      logging(`Using ${frcQty} FRC for remaining ${progressLeft}, not buying`);
      return;
    }
    // 買 5個用 4個,保持 FRC不要用到光
    let itemQuantity = 5;
    if (frcQty < itemQuantity) {
      itemQuantity -= frcQty;
      // 材料不夠
      if (Math.min(...myMaterials) < itemQuantity) {
        logging(`not enough materials ${Math.min(...myMaterials)} to buy`);
        return;
      }
      logging(`enough materials ${Math.min(...myMaterials)} to buy`);
      const itemType = 'birthday_factory_trinket';
      logging(
        `completeTransaction(true, '${itemType}', ${itemQuantity}, false)`
      );
      completeTransaction(true, itemType, itemQuantity, false);
    }
  };
  const goForMaterial = () => {
    logging(`goForMaterial`);
    for (let i = 0; i < materialPlan.length; i++) {
      const stagedGoal = materialPlan[i];
      let isOneGoaled = false;
      for (let j = 0; j < myMaterials.length; j++) {
        const myMaterial = myMaterials[j];
        isOneGoaled = myMaterial >= stagedGoal[j];
        // 如果未達標就進入該材料的收穫房間並中斷myMaterials的迴圈
        if (!isOneGoaled) {
          // 當前房間材料還沒集齊的話就留在原地
          const currentRoomIndex = myRoomOrder.indexOf(currentRoom);
          const currentRoomMaterial = myMaterials[currentRoomIndex];
          if (currentRoomMaterial < stagedGoal[currentRoomIndex]) {
            logging(
              `materials are ${currentRoomMaterial} in ${currentRoom}, not goal to ${stagedGoal[currentRoomIndex]}`
            );
            break;
          }
          // 否則就進未達標材料的收穫房間
          const materialInRoom = roomMaterials['material_in_room'][j];
          if (currentRoom != materialInRoom) {
            enterRoom(materialInRoom);
          }
          break;
        }
      }
      // 只要找到一個未達標就中斷materialPlan的迴圈
      if (!isOneGoaled) {
        break;
      }
    }
  };
  if (Math.min(...myRoomLevelsArray) == 5) {
    logging('superbrieFactory(), all room level 5.');
    // 買 FRC原則: 讓剩餘 progress能被 40整除
    buyFrc();
    // 自動進房間找材料
    if (settings.isAutoRoom) goForMaterial();
  }
}
/**
 * Enter room by native function.
 * @param {String} roomType
 */
function enterRoom(roomType) {
  const quest = user.quests.QuestSuperBrieFactory;
  const currentRoom = quest.factory_atts.current_room;
  if (currentRoom == roomType) return;
  const element = `<a href="#" class="mousehuntActionButton tiny" data-room="${roomType}">`;
  setTimeout(() => {
    hg.views.HeadsUpDisplaySuperBrieFactoryView.pickRoom(element);
  }, 5000);
}
function huntFor() {
  if (NOBhuntsLeft <= 0) {
    disarmTrap('bait');
  }
}

function mapHunting() {
  let objDefaultMapHunting = {
    status: false,
    selectedMouse: [],
    logic: 'OR',
    weapon: 'Remain',
    base: 'Remain',
    trinket: 'Remain',
    bait: 'Remain',
    leave: false
  };
  let objMapHunting = getStorageToObject('MapHunting', objDefaultMapHunting);
  let strViewState = getPageVariable('user.quests.QuestRelicHunter.view_state');
  let bHasMap = strViewState == 'hasMap' || strViewState == 'hasReward';
  if (
    !objMapHunting.status ||
    !bHasMap ||
    objMapHunting.selectedMouse.length === 0
  )
    return;

  checkCaughtMouse(objMapHunting);
}

function checkCaughtMouse(obj, arrUpdatedUncaught) {
  let arrUncaughtMouse = [];
  if (!Array.isArray(arrUpdatedUncaught)) arrUpdatedUncaught = [];

  let bHasReward =
    getPageVariable('user.quests.QuestRelicHunter.view_state') == 'hasReward';
  if (!bHasReward && arrUpdatedUncaught.length === 0) {
    let nRemaining = -1;
    let classTreasureMap = document.getElementsByClassName(
      'mousehuntHud-userStat treasureMap'
    )[0];
    if (
      classTreasureMap.children[2].textContent
        .toLowerCase()
        .indexOf('remaining') > -1
    )
      nRemaining = parseInt(classTreasureMap.children[2].textContent);

    if (Number.isNaN(nRemaining) || nRemaining == -1) return;

    let temp = getStorageToVariableStr('Last Record Uncaught', null);
    if (!isNullOrUndefined(temp)) arrUncaughtMouse = temp.split(',');

    if (arrUncaughtMouse.length != nRemaining) {
      // get updated uncaught mouse list
      arrUncaughtMouse = [];
      let objData = {
        sn: 'Hitgrab',
        hg_is_ajax: 1,
        action: 'info',
        uh: getPageVariable('user.unique_hash')
      };
      if (isNullOrUndefined(getMapPort)) {
        // direct call jquery
        ajaxPost(
          window.location.origin + '/managers/ajax/users/relichunter.php',
          objData,
          function (data) {
            logging(data.treasure_map);
            if (!isNullOrUndefined(data.treasure_map.groups)) {
              let arrUncaught = [];
              for (let i = 0; i < data.treasure_map.groups.length; i++) {
                if (data.treasure_map.groups[i].is_uncaught === true) {
                  for (
                    let j = 0;
                    j < data.treasure_map.groups[i].mice.length;
                    j++
                  ) {
                    arrUncaught.push(data.treasure_map.groups[i].mice[j].name);
                  }
                }
              }
              if (arrUncaught.length > 0) checkCaughtMouse(obj, arrUncaught);
            }
          },
          function (error) {
            console.error('ajax:', error);
          }
        );
      } else {
        getMapPort.postMessage({
          request: 'getUncaught',
          data: objData,
          url: window.location.origin + '/managers/ajax/users/relichunter.php',
          objMapHunting: obj
        });
      }
      return;
    }
  } else {
    if (bHasReward) setStorage('Last Record Uncaught', '');
    else setStorage('Last Record Uncaught', arrUpdatedUncaught.join(','));
    arrUncaughtMouse = arrUpdatedUncaught.slice();
  }

  console.plog('Uncaught:', arrUncaughtMouse);
  let i;
  let bChangeTrap = false;
  let bCanLeave = false;
  let arrIndex = [];
  for (i = 0; i < obj.selectedMouse.length; i++) {
    arrIndex.push(arrUncaughtMouse.indexOf(obj.selectedMouse[i]));
  }
  if (obj.logic == 'AND') {
    bChangeTrap =
      countArrayElement(-1, arrIndex) == arrIndex.length || bHasReward;
  } else {
    bChangeTrap = countArrayElement(-1, arrIndex) > 0 || bHasReward;
  }

  bCanLeave = !bHasReward && bChangeTrap;
  if (bChangeTrap) {
    for (i = arrIndex.length - 1; i >= 0; i--) {
      if (arrIndex[i] == -1) obj.selectedMouse.splice(i, 1);
    }
    setStorage('MapHunting', JSON.stringify(obj));
    for (let prop in obj) {
      if (
        obj.hasOwnProperty(prop) &&
        (prop == 'weapon' ||
          prop == 'base' ||
          prop == 'trinket' ||
          prop == 'bait')
      ) {
        if (obj[prop] != 'Remain') {
          if (obj[prop] == 'None') disarmTrap(prop);
          else checkThenArm(null, prop, obj[prop]);
        }
      }
    }
  }

  if (bCanLeave && obj.leave) {
    let objData = {
      sn: 'Hitgrab',
      hg_is_ajax: 1,
      action: 'discard',
      uh: getPageVariable('user.unique_hash')
    };
    if (isNullOrUndefined(getMapPort)) {
      // direct call jquery
      ajaxPost(
        window.location.origin + '/managers/ajax/users/relichunter.php',
        objData,
        function (data) {
          console.plog('Map discarded');
        },
        function (error) {
          console.perror('ajax discard:', error);
        }
      );
    } else {
      getMapPort.postMessage({
        request: 'discard',
        data: objData,
        url: window.location.origin + '/managers/ajax/users/relichunter.php'
      });
    }
  }
}
/**
 * Get current enviroment name.
 * @return {String} current enviroment name
 */
function getCurrentLocation() {
  let loc = trimToEmpty(user.environment_name);
  console.plog('Current Location:', loc);
  return loc;
}
/** hooker to MhUtils.getEnvironmentType */
function getEnvironmentType() {
  return MhUtils.getEnvironmentType();
}
/**
 * 用來測試新 function的 function
 * 只要 location選 test
 * 就可以從這邊呼叫新 function而不用去改preferenceHTML
 */
function test() {
  // call function to be tested
}
/**
 * GWH 2023
 */
function gwh2023() {
  logging('2023 GWH');
  // GWH 2023攻略的中控主要還是 pecan cheese、haistone、festive spirit的數量，應該從這三個數值去思考攻略程式碼

  if (getBaitQuantity() == 0) {
    /* 應該已經被 defaultBait功能解決了
    checkThenArm(null, 'bait', 'Gouda Cheese');
    window.setTimeout(function () {
      location.reload(true);
    }, 10000);*/
    return;
  }

  let pecanCheeseQuantityText = $("div[data-item-type='pecan_pecorino_cheese']")
    .find($('.headsUpDisplayWinterHuntRegionView__baitQuantity.quantity'))
    .html();
  logging('pecanCheeseQuantityText:' + pecanCheeseQuantityText);
  let pecanCheeseQuantity = pecanCheeseQuantityText
    ? parseInt(pecanCheeseQuantityText)
    : 0;
  let glazedCheeseQuantityText = $(
    "div[data-item-type='glazed_pecan_pecorino_cheese']"
  )
    .find($('.headsUpDisplayWinterHuntRegionView__baitQuantity.quantity'))
    .html();
  logging('glazedCheeseQuantityText:' + glazedCheeseQuantityText);
  let glazedCheeseQuantity = glazedCheeseQuantityText
    ? parseInt(glazedCheeseQuantityText)
    : 0;
  let fuelEnabled = document.querySelector(
    '.headsUpDisplayWinterHuntRegionView--fuelEnabled'
  );
  let fuelButton = document.getElementsByClassName(
    'headsUpDisplayWinterHuntRegionView__fuelButton'
  )[0];
  let compressedQuantityText = $(
    "div[data-item-type='compressed_cinnamon_coal_stat_item']"
  ).html();
  logging('compressedQuantity:' + compressedQuantityText);
  let compressedQuantity = compressedQuantityText
    ? parseInt(compressedQuantityText)
    : 0;
  let hailstoneQuantityText = $(
    "div[data-item-type='hailstone_stat_item']"
  ).html();
  logging('hailstoneQuantityText:' + hailstoneQuantityText);
  let hailstoneQuantity = hailstoneQuantityText
    ? parseInt(hailstoneQuantityText)
    : 0;

  if (pecanCheeseQuantity > 30 && getBaitQuantity() > 100) {
    checkThenArm(null, 'bait', 'Pecan Pecorino Cheese');
  }

  if (currentLocation.indexOf('Golem Workshop') > -1) {
    logging('在 Golem Workshop');
    // 不 fuel
    if (fuelEnabled) {
      fuelButton.click();
    }
    // compressed cinnamon少於 5個就去 ice fortress收集
    if (pecanCheeseQuantity < 0) {
      window.setTimeout(function () {
        travel('winter_hunt_fortress');
      }, 10000);
      return;
    }
    if (pecanCheeseQuantity > 10) {
      checkThenArm(null, 'bait', 'Pecan Pecorino Cheese');
    }
  } else if (currentLocation.indexOf('Ice Fortress') > -1) {
    logging('在 Ice Fortress');
    // Frost King出現
    let shieldHealth = document.getElementsByClassName(
      'headsUpDisplayWinterHuntIceFortressView__shieldHealth'
    );
    logging(
      shieldHealth ? 'shield health: ' + shieldHealth[0].innerHTML : 'undefined'
    );
    let shieldHealthQuantity = shieldHealth
      ? parseInt(shieldHealth[0].innerHTML)
      : 99;
    // Shield快破的時候, 先看看 hailstone夠不夠
    if (shieldHealthQuantity < 3) {
      logging('開兩門砲+fuel的話一次轟掉3.shieldHealthQuantity < 3');
      // 不點亮Spirit
      if (fuelEnabled) fuelButton.click();
      // 等 10秒double check一下
      window.setTimeout(function () {
        if (
          document.querySelector(
            '.headsUpDisplayWinterHuntRegionView--fuelEnabled'
          )
        )
          fuelButton.click();
      }, 10000);
      // 換成Gouda
      checkThenArm(null, 'bait', 'Gouda Cheese');
      if (hailstoneQuantity > 0) {
        return; // hailstone用完前return掉等打完King再說
      }
    }
    // 處理 hailstone
    logging('有 Hailstone? ' + (hailstoneQuantity > 0));
    // 一門砲才是 > 0 if (hailstoneQuantity > 0) {
    // 兩門砲是 > 0
    if (hailstoneQuantity > 1) {
      treatHailstone();
      return;
    } else {
      // 不點亮Spirit
      if (fuelEnabled) fuelButton.click();
      // 等 10秒double check一下
      window.setTimeout(function () {
        if (
          document.querySelector(
            '.headsUpDisplayWinterHuntRegionView--fuelEnabled'
          )
        )
          fuelButton.click();
      }, 10000);
    }
    // 累積超過 45個 compressed cinnamon且沒有 hailstone時,換成Pecan或Gouda去workshop
    if (compressedQuantity > 18 && hailstoneQuantity == 0) {
      if (pecanCheeseQuantity > 0) {
        checkThenArm(null, 'bait', 'Pecan Pecorino Cheese');
      } else {
        checkThenArm(null, 'bait', 'Gouda Cheese');
      }
      window.setTimeout(function () {
        travel('winter_hunt_workshop');
      }, 10000);
    }
  }
}

function treatHailstone() {
  logging('有 Hailstone');
  // 如果hailstone > 0,能 fuelEnable就fuelEnable
  tryFuel(0);
}

function tryFuel(retries) {
  logging('重試次數: ' + retries);
  if (retries > 1) location.reload(true);
  let spiritQuantityText = $(
    "div[data-item-type='festive_spirit_stat_item']"
  ).html();
  logging('spiritQuantityText:' + spiritQuantityText);
  let spiritQuantity = spiritQuantityText ? parseInt(spiritQuantityText) : 0;
  let fuelEnabled = document.querySelector(
    '.headsUpDisplayWinterHuntRegionView--fuelEnabled'
  );
  let fuelButton = document.getElementsByClassName(
    'headsUpDisplayWinterHuntRegionView__fuelButton'
  )[0];
  if (spiritQuantity > 0 && !fuelEnabled) {
    logging('有 Spirit');
    fuelButton.click();
    // 等 10秒double check一下
    window.setTimeout(function () {
      tryFuel(retries + 1);
    }, 10000);
    return;
  }
  checkFortressBait();
}

function checkFortressBait() {
  logging('checkFueledBait()');

  let pecanCheeseQuantityText = $("div[data-item-type='pecan_pecorino_cheese']")
    .find($('.headsUpDisplayWinterHuntRegionView__baitQuantity.quantity'))
    .html();
  logging('pecanCheeseQuantityText:' + pecanCheeseQuantityText);
  let pecanCheeseQuantity = pecanCheeseQuantityText
    ? parseInt(pecanCheeseQuantityText)
    : 0;
  let glazedCheeseQuantityText = $(
    "div[data-item-type='glazed_pecan_pecorino_cheese']"
  )
    .find($('.headsUpDisplayWinterHuntRegionView__baitQuantity.quantity'))
    .html();
  logging('glazedCheeseQuantityText:' + glazedCheeseQuantityText);
  let glazedCheeseQuantity = parseInt(glazedCheeseQuantityText);
  let fuelEnabled = document.querySelector(
    '.headsUpDisplayWinterHuntRegionView--fuelEnabled'
  );
  let activeCheese = document.getElementsByClassName(
    'headsUpDisplayWinterHuntRegionView__baitImageButton active'
  )[0];
  let isGlazed =
    activeCheese.getAttribute('data-item-type').indexOf('glazed') > -1;
  let isPecan =
    activeCheese.getAttribute('data-item-type').indexOf('pecan') > -1;

  if (fuelEnabled) {
    // 有 fuel,glazed>pecan>gouda
    if (glazedCheeseQuantity > 0 && !isGlazed) {
      checkThenArm(null, 'bait', 'Glazed Pecan Pecorino Cheese');
    } else if (pecanCheeseQuantity > 0 && !isPecan) {
      checkThenArm(null, 'bait', 'Pecan Pecorino Cheese');
    } else {
      // do nothing checkThenArm(null,'bait','Gouda Cheese');
    }
  } else {
    // 沒有 fuel, 不使用 glazed.如果正在用 glazed,pecan>20時換成 pecan,否則換成 gouda
    if (pecanCheeseQuantity > 20) {
      if (!isPecan) checkThenArm(null, 'bait', 'Pecan Pecorino Cheese');
    } else {
      if (isPecan) checkThenArm(null, 'bait', 'Gouda Cheese');
    }
  }
}

function bwRift() {
  if (getCurrentLocation().indexOf('Bristle Woods Rift') < 0) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Brie String';
  const defaultSettings = {
    travelTo: '',
    choosePortal: false,
    choosePortalAfterCC: false,
    minTimeSand: [70, 70, 50, 50, 50, 50, 40, 40, 999],
    minRSCType: 'NUMBER',
    minRSC: 0,
    enterMinigameWCurse: false,
    order: [
      'NONE',
      'GEARWORKS',
      'ANCIENT',
      'RUNIC',
      'TIMEWARP',
      'GUARD',
      'SECURITY',
      'FROZEN',
      'FURNACE',
      'INGRESS',
      'PURSUER',
      'ACOLYTE_CHARGING',
      'ACOLYTE_DRAINING',
      'ACOLYTE_DRAINED',
      'LUCKY',
      'HIDDEN'
    ],
    master: {
      weapon: new Array(32).fill('best.weapon.rift'),
      base: new Array(32).fill('best.base.rift'),
      trinket: new Array(32).fill('Rift Vacuum Charm,Rift Super Vacuum Charm'),
      bait: new Array(32).fill('Brie String'),
      activate: new Array(32).fill(false)
    },
    specialActivate: {
      forceActivate: new Array(32).fill(false),
      remainingLootActivate: new Array(32).fill(1),
      forceDeactivate: new Array(32).fill(false),
      remainingLootDeactivate: new Array(32).fill(1)
    },
    gw: {
      weapon: new Array(4).fill('MASTER'),
      base: new Array(4).fill('MASTER'),
      trinket: new Array(4).fill('MASTER'),
      bait: new Array(4).fill('MASTER'),
      activate: new Array(4).fill('MASTER')
    },
    al: {
      weapon: new Array(4).fill('MASTER'),
      base: new Array(4).fill('MASTER'),
      trinket: new Array(4).fill('MASTER'),
      bait: new Array(4).fill('MASTER'),
      activate: new Array(4).fill('MASTER')
    },
    rl: {
      weapon: new Array(4).fill('MASTER'),
      base: new Array(4).fill('MASTER'),
      trinket: new Array(4).fill('MASTER'),
      bait: new Array(4).fill('MASTER'),
      activate: new Array(4).fill('MASTER')
    },
    gb: {
      weapon: new Array(14).fill('MASTER'),
      base: new Array(14).fill('MASTER'),
      trinket: new Array(14).fill('MASTER'),
      bait: new Array(14).fill('MASTER'),
      activate: new Array(14).fill('MASTER')
    },
    ic: {
      weapon: new Array(8).fill('MASTER'),
      base: new Array(8).fill('MASTER'),
      trinket: new Array(8).fill('MASTER'),
      bait: new Array(8).fill('MASTER'),
      activate: new Array(8).fill('MASTER')
    },
    fa: {
      weapon: new Array(32).fill('MASTER'),
      base: new Array(32).fill('MASTER'),
      trinket: new Array(32).fill('MASTER'),
      bait: new Array(32).fill('MASTER'),
      activate: new Array(32).fill('MASTER')
    },
    priorities: [
      'SECURITY',
      'FURNACE',
      'PURSUER',
      'ACOLYTE',
      'LUCKY',
      'HIDDEN',
      'TIMEWARP',
      'RUNIC',
      'ANCIENT',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS'
    ],
    prioritiesCursed: [
      'SECURITY',
      'FURNACE',
      'PURSUER',
      'ANCIENT',
      'GEARWORKS',
      'RUNIC',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS'
    ]
  };
  const settings = getStorageToObject('BWRift', defaultSettings);
  logging('RUN BWRift() using:', settings);
  const quest = user.quests.QuestRiftBristleWoods;
  const items = quest.items;
  const hasHourglass =
    MyUtils.parseQuantity(items.rift_hourglass_stat_item.quantity) > 0;
  const hasPaladinBane = quest.status_effects.ng.indexOf('default') < 0;
  const hasAcolyteInfluence = quest.status_effects.ac.indexOf('default') < 0;
  const hasFourthPortal = quest.status_effects.ex.indexOf('default') < 0;
  let nIndex = -1;
  let nLootRemaining = quest.progress_remaining;
  const nTimeSand = MyUtils.parseQuantity(
    quest.items.rift_hourglass_sand_stat_item.quantity,
    10
  );
  const quantumQuartzQuantity = MyUtils.parseQuantity(
    quest.items.rift_quantum_quartz_stat_item.quantity,
    10
  );
  let strChamberName = quest.chamber_name.split(' ')[0].toUpperCase();
  let strTestName = quest.chamber_name.toUpperCase();
  if (strTestName.indexOf('LUCK') > -1) strChamberName = 'LUCKY';
  if (strChamberName == 'ACOLYTE') {
    // in Acolyte Chamber
    let strStatus;
    if (quest.minigame.acolyte_chamber.obelisk_charge < 100) {
      strStatus = 'ACOLYTE_CHARGING';
      nLootRemaining = 100 - quest.minigame.acolyte_chamber.obelisk_charge;
    } else if (quest.minigame.acolyte_chamber.acolyte_sand > 0) {
      strStatus = 'ACOLYTE_DRAINING';
      nLootRemaining = Number.MAX_SAFE_INTEGER;
    } else {
      strStatus = 'ACOLYTE_DRAINED';
      nLootRemaining = Number.MAX_SAFE_INTEGER;
      doubleEgg(true);
    }
    console.plog(
      `Status: ${strStatus}, Obelisk: ${quest.minigame.acolyte_chamber.obelisk_charge}, Acolyte Sand: ${quest.minigame.acolyte_chamber.acolyte_sand}`
    );
    if (
      trimToEmpty(settings.travelTo) !== '' &&
      strStatus === 'ACOLYTE_DRAINED'
    ) {
      pauseByTraveling(settings.travelTo);
      return;
    }
    nIndex = settings.order.indexOf(strStatus);
  } else if (strChamberName == 'RIFT') {
    doubleEgg(false);
    nIndex = 0;
  } else {
    doubleEgg(false);
    if (nLootRemaining > 0) nIndex = settings.order.indexOf(strChamberName);
    else nIndex = 0;
  }
  console.plog(
    `Status: ${quest.chamber_status}, Name: ${quest.chamber_name}, Shortname: ${strChamberName}, Index: ${nIndex}, Remaining Loot: ${nLootRemaining}, Time Sand: ${nTimeSand}`
  );
  if (nIndex < 0) return;
  let nIndexBuffCurse = 0;
  if (
    !(
      quest.status_effects.un.indexOf('default') > -1 ||
      quest.status_effects.un.indexOf('remove') > -1
    ) ||
    !(
      quest.status_effects.fr.indexOf('default') > -1 ||
      quest.status_effects.fr.indexOf('remove') > -1
    ) ||
    !(
      quest.status_effects.st.indexOf('default') > -1 ||
      quest.status_effects.st.indexOf('remove') > -1
    )
  )
    nIndexBuffCurse = 8;
  else {
    if (hasPaladinBane) nIndexBuffCurse |= 0x04;
    if (hasAcolyteInfluence) nIndexBuffCurse |= 0x02;
    if (hasFourthPortal) nIndexBuffCurse |= 0x01;
  }
  console.plog(
    `Buff & Curse Index: ${nIndexBuffCurse}, Obj: `,
    quest.status_effects
  );
  // Choosing portal
  if (nIndex === 0 || quest.chamber_status == 'open') {
    const classPortalContainer = document.getElementsByClassName(
      'riftBristleWoodsHUD-portalContainer'
    );
    if (classPortalContainer.length > 0) {
      const objPortal = {
        arrName: new Array(classPortalContainer[0].children.length).fill(''),
        arrIndex: new Array(classPortalContainer[0].children.length).fill(
          Number.MAX_SAFE_INTEGER
        )
      };
      let i, j;
      const arrPriorities =
        nIndexBuffCurse == 8 ? settings.prioritiesCursed : settings.priorities;
      // 還沒拿到 PaladinBane或拿到 hourglass但還沒拿到 AcolyteInfluence前,
      // TIMEWARP的 priority僅高於 GEARWORKS(只是低 priority,不是不進去)
      if (!hasPaladinBane || (hasHourglass && !hasAcolyteInfluence)) {
        const timewarpIndex = arrPriorities.indexOf('TIMEWARP');
        if (timewarpIndex > -1) {
          const timewarp = arrPriorities.splice(timewarpIndex, 1)[0];
          const gearworksIndex = arrPriorities.indexOf('GEARWORKS');
          arrPriorities.splice(gearworksIndex, 0, timewarp);
          console.plog('re-ordered priority: ', arrPriorities);
        }
      }
      /**AL/RL選項在 priority中的 index */
      let nIndexCustom = -1;
      for (i = 0; i < arrPriorities.length; i++) {
        if (arrPriorities[i].indexOf('AL/RL') > -1) {
          nIndexCustom = i;
          break;
        }
      }
      // objPortal賦值
      for (i = 0; i < objPortal.arrName.length; i++) {
        // Assign short chamber name to initially empty string arrName elements
        objPortal.arrName[i] = classPortalContainer[0].children[
          i
        ].getElementsByClassName(
          'riftBristleWoodsHUD-portal-name'
        )[0].textContent;
        strTestName = objPortal.arrName[i].toUpperCase();
        if (strTestName.indexOf('LUCK') > -1) objPortal.arrName[i] = 'LUCKY';
        else if (
          strTestName.indexOf('HIDDEN') > -1 ||
          strTestName.indexOf('TREASUR') > -1
        )
          objPortal.arrName[i] = 'HIDDEN';
        objPortal.arrName[i] = objPortal.arrName[i].split(' ')[0].toUpperCase();
        objPortal.arrIndex[i] = arrPriorities.indexOf(objPortal.arrName[i]);
        // 看看 portal有沒有 Ancient或 Runic
        if (
          nIndexCustom > -1 &&
          (objPortal.arrName[i] == 'ANCIENT' || objPortal.arrName[i] == 'RUNIC')
        ) {
          if (objPortal.arrIndex[i] < 0 || nIndexCustom < objPortal.arrIndex[i])
            objPortal.arrIndex[i] = nIndexCustom;
        }
        if (objPortal.arrIndex[i] < 0)
          objPortal.arrIndex[i] = Number.MAX_SAFE_INTEGER;
      }
      console.plog(objPortal, 'nIndexCustom:', nIndexCustom);
      if (settings.choosePortal) {
        if (
          nIndex === 0 ||
          (nIndex > 0 &&
            quest.chamber_status == 'open' &&
            settings.choosePortalAfterCC)
        ) {
          let nIndexOld = nIndex;
          let arrIndices = [];
          const mscQuantity = MyUtils.parseQuantity(
            quest.items.magical_string_cheese.quantity
          );
          let nASCPot = MyUtils.parseQuantity(
            quest.items.ancient_string_cheese_potion.quantity
          );
          let nASC = MyUtils.parseQuantity(
            quest.items.ancient_string_cheese.quantity
          );
          /**
           * total effective ASC
           */
          let nEffectiveASC = nASCPot + nASC;
          // 如果 priority中有 AL/RL選項且選項有 MSC字樣,代表 ASC用 MSC brew
          /* 這段本來是放在 AL/RL處理區段中,所以保證 nIndexCustom大於 -1
          但是別的程式也要用而拉到外面來,就不一定了.
          當 priority中沒有 AL/RL時(例如我在 priorityCursed中的設定),
          nIndexCustom會維持初始值 -1,無法判斷用不用 MSC,只能視為不用
          設想下列情境: priorityCursed沒有 AL/RL,
            要計算 acolyte chamber所需的 cheese時,沒有任何地方可以判斷是否使用MSC,
            所以借 AL/RL中是否使用 MSC做判斷.
            當 priority中沒有 AL/RL時,就只能當作不使用 MSC */
          if (
            nIndexCustom > -1 &&
            arrPriorities[nIndexCustom].indexOf('MSC') > -1
          )
            nEffectiveASC =
              Math.min(nASCPot, parseInt(mscQuantity / 2)) * 2 + nASC;
          let nRSCPot = MyUtils.parseQuantity(
            quest.items.runic_string_cheese_potion.quantity
          );
          let nRSC = MyUtils.parseQuantity(
            quest.items.runic_string_cheese.quantity
          );
          /**
           * total effective RSC
           */
          let nEffectiveRSC =
            nRSC + Math.min(nRSCPot, parseInt(nEffectiveASC / 2)) * 2;
          let nTotalRSC = nRSC + nRSCPot * 2;
          if (!Number.isInteger(nEffectiveRSC))
            nEffectiveRSC = Number.MAX_SAFE_INTEGER;
          console.plog(
            `RSC Pot: ${nRSCPot}, RSC: ${nRSC}, Effective RSC: ${nEffectiveRSC}, Total RSC: ${nTotalRSC}`
          );
          let nMinRSC = -1;
          if (settings.minRSCType == 'NUMBER') nMinRSC = settings.minRSC;
          else if (settings.minRSCType == 'GEQ')
            nMinRSC = settings.minTimeSand[nIndexBuffCurse];
          // Total RSC或 timesand不夠或沒有 ac buff不進 Acolyte Chamber
          let nIndexTemp = objPortal.arrName.indexOf('ACOLYTE');
          // timesand是否足夠->要考慮撤退後再進去的情形:需要的數量不是設定值
          // 大於設定值算夠了
          let isEnoughTimesand =
            nTimeSand >= settings.minTimeSand[nIndexBuffCurse];
          // Obelisk滿了,但還沒抓到 AA
          // 7 sand抓 AA + 還沒抽乾的砂量用 CR推算需求的砂量
          // x - x*(1-cr) - x*(1-cr)*0.75 = quest.acolyte_sand
          // const catchRate = 0.8;
          // 7 sand抓 AA + 還沒抽乾的砂量 + 25% paladin fail and steal
          const acolyteSand = MyUtils.parseQuantity(quest.acolyte_sand);
          const obeliskPercent = MyUtils.parseQuantity(quest.obelisk_percent);
          isEnoughTimesand ||=
            obeliskPercent == 100 && nTimeSand >= acolyteSand * 1.5 + 7;
          // Obelisk charge中途撤退,設定值減去 AA已得的砂量
          isEnoughTimesand ||=
            obeliskPercent > 0 &&
            obeliskPercent < 100 &&
            // nTimeSand >= objBWRift.minTimeSand[nIndexBuffCurse] - acolyteSand;
            nTimeSand >=
              ((100 - obeliskPercent) / 3.3) * 2.4 + acolyteSand * 1.4 + 7;
          // RSC是否足夠->要考慮撤退後再進去的情形:需要的數量不是設定值
          // 大於設定值算夠了
          let isEnoughRSC = nEffectiveRSC >= nMinRSC;
          /* RSC就不要計算了,多收集沒壞處
          // 7 RSC抓 AA + 還沒抽乾的砂量 + 25% fail
          isEnoughRSC ||=
            obeliskPercent == 100 && nEffectiveRSC >= acolyteSand * 1.25 + 7; // 只有 sand會被偷, RSC不會
          // Obelisk charge中途撤退,設定值減去 AA已得的砂量
          isEnoughRSC ||=
            obeliskPercent > 0 &&
            obeliskPercent < 100 &&
            nEffectiveRSC >= nMinRSC - acolyteSand; */
          if (nIndexTemp > -1) {
            if (!isEnoughRSC || !isEnoughTimesand || !hasAcolyteInfluence) {
              arrIndices = getAllIndices(objPortal.arrName, 'ACOLYTE');
              for (i = 0; i < arrIndices.length; i++)
                objPortal.arrIndex[arrIndices[i]] = Number.MAX_SAFE_INTEGER;
            }
          }
          console.plog('Check disable Acolyte:', objPortal);
          // 如果收集夠了設定的 timesand,不進 TIMEWARP跟 GUARD
          // 這會無法自然增加 timesand提高 Acolyte Chamber出現機率.但是浪費打獵在 timesand不如收集 potion.
          let arrTemp = ['TIMEWARP', 'GUARD'];
          for (i = 0; i < arrTemp.length; i++) {
            nIndexTemp = objPortal.arrName.indexOf(arrTemp[i]);
            if (nIndexTemp > -1 && isEnoughTimesand) {
              arrIndices = getAllIndices(objPortal.arrName, arrTemp[i]);
              for (j = 0; j < arrIndices.length; j++)
                objPortal.arrIndex[arrIndices[j]] = Number.MAX_SAFE_INTEGER;
            }
          }
          console.plog('Check disable TIMEWARP, GUARD:', objPortal);
          // 第一次 TIMEWARP, RSC少於 17片不進去;
          // 第二次以上的 TIMEWARP, RSC未達標或 timesand已達標不進去
          arrTemp = ['TIMEWARP'];
          for (i = 0; i < arrTemp.length; i++) {
            nIndexTemp = objPortal.arrName.indexOf(arrTemp[i]);
            if (
              nIndexTemp > -1 &&
              ((!hasHourglass && nEffectiveRSC < 17) ||
                (hasHourglass && (!isEnoughRSC || isEnoughTimesand)))
            ) {
              arrIndices = getAllIndices(objPortal.arrName, arrTemp[i]);
              for (j = 0; j < arrIndices.length; j++)
                objPortal.arrIndex[arrIndices[j]] = Number.MAX_SAFE_INTEGER;
            }
          }
          console.plog('Check disable TIMEWARP:', objPortal);
          // 如果沒設定 enterMinigameWCurse=true,被詛咒時不進 minigame.
          // 如果 RSC或 QQ不夠不進 minigame<=不需要-直接進去失敗拿到 buff,再找機會解詛咒,效率應該更好
          arrTemp = ['GUARD', 'FROZEN', 'INGRESS'];
          const noMinigameWhenCursed =
            nIndexBuffCurse == 8 && settings.enterMinigameWCurse === false;
          /* const isEnoughMinigameResource =
            nRSC > 20 && quantumQuartzQuantity > 20; */
          for (i = 0; i < arrTemp.length; i++) {
            nIndexTemp = objPortal.arrName.indexOf(arrTemp[i]);
            /* if (
              nIndexTemp > -1 &&
              (noMinigameWhenCursed || !isEnoughMinigameResource)
            ) { */
            if (nIndexTemp > -1 && noMinigameWhenCursed) {
              arrIndices = getAllIndices(objPortal.arrName, arrTemp[i]);
              for (j = 0; j < arrIndices.length; j++)
                objPortal.arrIndex[arrIndices[j]] = Number.MAX_SAFE_INTEGER;
              console.plog(
                'Minigame disable portal, index:',
                nIndexTemp,
                objPortal
              );
            }
          }
          console.plog('Check disable GUARD, FROZEN, INGRESS:', objPortal);
          // 比較 RSC跟 ASC的數量來決定要進 AL還是 RL.
          let arrAL = getAllIndices(objPortal.arrName, 'ANCIENT');
          let arrRL = getAllIndices(objPortal.arrName, 'RUNIC');
          if (arrAL.length > 0 && arrRL.length > 0 && nIndexCustom > -1) {
            console.plog(
              `ASC Pot: ${nASCPot}, ASC: ${nASC}, Effective ASC: ${nEffectiveASC}, RSC Pot: ${nRSCPot}, RSC: ${nRSC}, Effective RSC: ${nEffectiveRSC}, Total RSC: ${nTotalRSC}`
            );
            if (nEffectiveASC < nTotalRSC) {
              // ancient first
              for (j = 0; j < arrRL.length; j++)
                objPortal.arrIndex[arrRL[j]] = Number.MAX_SAFE_INTEGER;
            } else {
              // runic first
              for (j = 0; j < arrAL.length; j++)
                objPortal.arrIndex[arrAL[j]] = Number.MAX_SAFE_INTEGER;
            }
            console.plog('Check disable AL/RL:', objPortal);
          }
          // 如果是在入口,強制進 GEARWORKS
          nIndexTemp = objPortal.arrName.indexOf('ENTER');
          if (nIndexTemp > -1) objPortal.arrIndex[nIndexTemp] = 1;
          console.plog(objPortal);
          let nMinIndex = minIndex(objPortal.arrIndex);
          if (
            objPortal.arrIndex[nMinIndex] == Number.MAX_SAFE_INTEGER ||
            classPortalContainer[0].children[nMinIndex] == 'frozen'
          )
            nIndex = nIndexOld;
          else {
            if (objPortal.arrName[nMinIndex] == 'ACOLYTE') {
              console.plog(
                `Chosen Portal: ${objPortal.arrName[nMinIndex]} Index: Unknown`
              );
              // 進了 ACOLYTE後要重新檢查一次,看目前的 ACOLYTE進度到哪了(離開 ACOLYTE進度會保留)
              fireEvent(classPortalContainer[0].children[nMinIndex], 'click');
              window.setTimeout(function () {
                fireEvent(
                  document.getElementsByClassName(
                    'mousehuntActionButton small'
                  )[1],
                  'click'
                );
                window.setTimeout(function () {
                  bwRift();
                }, 2000);
              }, 1500);
              return;
            }
            if (objPortal.arrName[nMinIndex] == 'ENTER')
              nIndex = settings.order.indexOf('GEARWORKS');
            else nIndex = settings.order.indexOf(objPortal.arrName[nMinIndex]);
            if (nIndex > -1) {
              console.plog(
                'Chosen Portal:',
                objPortal.arrName[nMinIndex],
                'Index:',
                nIndex
              );
              strChamberName = settings.order[nIndex];
              fireEvent(classPortalContainer[0].children[nMinIndex], 'click');
              window.setTimeout(function () {
                fireEvent(
                  document.getElementsByClassName(
                    'mousehuntActionButton small'
                  )[1],
                  'click'
                );
              }, 1000);
              nLootRemaining = Number.MAX_SAFE_INTEGER;
            } else nIndex = nIndexOld;
          }
        }
      }
    }
  }

  let objTemp = {
    weapon: '',
    base: '',
    trinket: '',
    bait: '',
    activate: false
  };

  if (nIndex === 0) strChamberName = 'NONE';
  if (nIndexBuffCurse == 8) nIndex += 16;
  if (
    strChamberName == 'GEARWORKS' ||
    strChamberName == 'ANCIENT' ||
    strChamberName == 'RUNIC'
  ) {
    let nCleaverAvailable = quest.cleaver_status == 'available' ? 1 : 0;
    console.plog('Cleaver Available Status:', nCleaverAvailable);
    let strTemp = '';
    if (strChamberName == 'GEARWORKS') strTemp = 'gw';
    else if (strChamberName == 'ANCIENT') strTemp = 'al';
    else strTemp = 'rl';
    if (nIndexBuffCurse == 8) nCleaverAvailable += 2;
    for (let prop in objTemp) {
      // if (objTemp.hasOwnProperty(prop))
      if (Object.prototype.hasOwnProperty.call(objTemp, prop))
        objTemp[prop] =
          settings[strTemp][prop][nCleaverAvailable] == 'MASTER' ||
          // 剩餘進度越低, Chamber Cleaver出現的機率越高
          quest.progress_percent > 40
            ? settings.master[prop][nIndex]
            : settings[strTemp][prop][nCleaverAvailable];
    }
  } else if (strChamberName == 'GUARD') {
    let nAlertLvl = isNullOrUndefined(quest.minigame.guard_chamber)
      ? -1
      : parseInt(quest.minigame.guard_chamber.status.split('_')[1]);
    console.plog('Guard Barracks Alert Lvl:', nAlertLvl);
    if (Number.isNaN(nAlertLvl) || nAlertLvl < 0 || nAlertLvl > 6) {
      // Not alerted yet
      for (let prop in objTemp) {
        if (objTemp.hasOwnProperty(prop))
          objTemp[prop] = settings.master[prop][nIndex];
      }
    } else {
      // Alert on
      if (nIndexBuffCurse == 8) nAlertLvl += 7;
      for (let prop in objTemp) {
        // if (objTemp.hasOwnProperty(prop))
        if (Object.prototype.hasOwnProperty.call(objTemp, prop))
          objTemp[prop] =
            settings.gb[prop][nAlertLvl] == 'MASTER'
              ? settings.master[prop][nIndex]
              : settings.gb[prop][nAlertLvl];
      }
    }
  } else {
    /*else if(strChamberName == 'INGRESS'){
	}
	else if(strChamberName == 'FROZEN'){
	}*/
    for (let prop in objTemp) {
      // if (objTemp.hasOwnProperty(prop))
      if (Object.prototype.hasOwnProperty.call(objTemp, prop))
        objTemp[prop] = settings.master[prop][nIndex];
    }
  }

  logging('BW RIFT ARMING:', objTemp);
  // arm trap
  checkThenArm(armPriority.best, 'weapon', parseTrapName(objTemp.weapon));
  checkThenArm(armPriority.best, 'base', parseTrapName(objTemp.base));
  let isEnoughTimesand = nTimeSand >= settings.minTimeSand[nIndexBuffCurse];
  if (strChamberName === 'TIMEWARP' && isEnoughTimesand)
    checkThenArm(armPriority.best, 'trinket', [
      'Rift Vacuum',
      'Rift Super Vacuum'
    ]);
  else
    checkThenArm(armPriority.best, 'trinket', parseTrapName(objTemp.trinket));
  if (objTemp.bait == 'Runic/Ancient')
    checkThenArm('any', 'bait', [
      'Runic String Cheese',
      'Ancient String Cheese'
    ]);
  else if (objTemp.bait == 'Runic=>Ancient')
    checkThenArm('best', 'bait', [
      'Runic String Cheese',
      'Ancient String Cheese'
    ]);
  else checkThenArm(armPriority.best, 'bait', parseTrapName(objTemp.bait));
  /* checkThenArm(null, 'weapon', objTemp.weapon);
  checkThenArm(null, 'base', objTemp.base);
  checkThenArm(null, 'trinket', objTemp.trinket);
  if (objTemp.bait == 'Runic/Ancient')
    checkThenArm('any', 'bait', [
      'Runic String Cheese',
      'Ancient String Cheese'
    ]);
  else if (objTemp.bait == 'Runic=>Ancient')
    checkThenArm('best', 'bait', [
      'Runic String Cheese',
      'Ancient String Cheese'
    ]);
  else checkThenArm(null, 'bait', objTemp.bait); */
  // toggle Quantum Quartz
  let classLootBooster = document.getElementsByClassName(
    'riftBristleWoodsHUD-portalEquipment lootBooster mousehuntTooltipParent'
  )[0];
  let bPocketwatchActive =
    classLootBooster.getAttribute('class').indexOf('selected') > -1;
  let classButton = classLootBooster.getElementsByClassName(
    'riftBristleWoodsHUD-portalEquipment-action'
  )[0];
  let bForce = false;
  let bToggle = false;
  if (objTemp.activate) {
    bForce =
      settings.specialActivate.forceDeactivate[nIndex] &&
      nLootRemaining <=
        settings.specialActivate.remainingLootDeactivate[nIndex];
    if (bForce === bPocketwatchActive) bToggle = true;
  } else {
    bForce =
      settings.specialActivate.forceActivate[nIndex] &&
      nLootRemaining <= settings.specialActivate.remainingLootActivate[nIndex];
    if (bForce !== bPocketwatchActive) bToggle = true;
  }
  console.plog(
    `QQ Activated: ${bPocketwatchActive}, Activate?: ${objTemp.activate}, Force: ${bForce}, Toggle: ${bToggle}`
  );
  if (bToggle) {
    let nRetry = 5;
    let intervalPocket = setInterval(function () {
      if (
        classLootBooster.getAttribute('class').indexOf('chamberEmpty') < 0 ||
        --nRetry <= 0
      ) {
        fireEvent(classButton, 'click');
        clearInterval(intervalPocket);
        intervalPocket = null;
      }
    }, 1000);
  }
}

/**
 * Fort Rox的處理控制邏輯.
 * 先從 localStorage用 key 'fort_rox'取得設定,
 * 如果沒找到就用預設並把預設存入 localStorage
 * 取得遊戲頁面 user.quests.QuestFortRox物件,
 * 找出目前的 stage.
 * 判斷 stage是設定中 order的第幾個元素,
 * 用這個 index取得 weapon等的設定後 checkThenArm.
 * 從 user資料取得法師塔當前啟用與否,並結合各 stage
 * 啟用法師塔與否及是否滿血停用法師塔設定自動
 * 啟用/停用法師塔.
 */
function fortRox() {
  if (getCurrentLocation().indexOf('Fort Rox') < 0) return;
  const upgradeCategory = {
    wall: 'w',
    ballista: 'b',
    cannon: 'c',
    moat: 'm',
    tower: 't'
  };
  // Fort Rox的預設設定.在 bodyJS>saveFRox()中有同樣的宣告.
  const defaultSettings = {
    meteoriteMoreThan: 540,
    howliteLessThan: 9999,
    bloodStoneLessThan: 9999,
    enterAfterTime: '',
    enterBeforeTime: '',
    maxHpUse: 120,
    fullHPDeactivate: true,
    charmOnHighDamage: '',
    highDamageRate: 99,
    stopAtHunts: 1,
    travelTo: '',
    stage: [
      'day',
      'stage_one',
      'stage_two',
      'stage_three',
      'stage_four',
      'stage_five',
      'dawn',
      'lair'
    ],
    order: [
      'day',
      'twilight',
      'midnight',
      'pitch',
      'utter',
      'first',
      'dawn',
      'lair'
    ],
    weapon: new Array(8).fill(''),
    base: new Array(8).fill(''),
    trinket: new Array(8).fill('None'),
    bait: [
      'Gouda Cheese',
      'Crescent Cheese',
      'Crescent Cheese',
      'Crescent Cheese',
      'Crescent Cheese',
      'Crescent Cheese',
      'Crescent Cheese',
      'Sunrise Cheese'
    ],
    activate: new Array(8).fill(false)
  };
  const settings = getStorageToObject('fort_rox', defaultSettings);
  const quest = user.quests.QuestFortRox;
  const isDay = quest.is_day;
  const isDawn = quest.is_dawn;
  const isLair = quest.is_lair;
  const huntsUntilDawn = MyUtils.parseQuantity(quest.hunts_until_dawn);
  const nowStage = (quest.current_stage || '').toLowerCase();
  const crecsentQty = MyUtils.parseQuantity(
    quest.items.crescent_cheese.quantity
  );
  const meteorite = quest.items.meteorite_piece_craft_item;
  const meteoriteQty = MyUtils.parseQuantity(meteorite.quantity);
  const effectiveMeteorite = crecsentQty * 3 + meteoriteQty;
  const repairCost = Math.min(
    MyUtils.parseQuantity(quest.max_possible_repair_cost || 0),
    settings.maxHpUse - quest.hp
  );
  const canRepair = isDay && repairCost > 0 && meteoriteQty > repairCost;
  const howliteQty = MyUtils.parseQuantity(
    quest.items.howlite_stat_item.quantity
  );
  const bloodStone = quest.items.blood_stone_stat_item;
  const bloodStoneQty = MyUtils.parseQuantity(bloodStone.quantity);
  const nowPhase = trimToEmpty(quest.current_phase).toLowerCase();
  const mana = quest.items.fort_rox_tower_mana_stat_item;
  const manaQty = MyUtils.parseQuantity(mana.quantity);
  const bossMultiplier = MyUtils.parseQuantity(quest.boss_multiplier);
  let stageIndex = -1;
  if (isLair === true) {
    stageIndex = 7;
    // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
    defaultBait = 'Moon Cheese'; // Moon基本上是被省下來不用的
    console.plog('In Lair: Heart of the Meteor');
  } else if (isDawn === true) {
    stageIndex = 6;
    // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
    defaultBait = 'Moon Cheese'; // Moon基本上是被省下來不用的
    console.plog('In Dawn');
  } else if (nowPhase == 'night') {
    stageIndex = settings.stage.indexOf(nowStage);
    // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
    defaultBait = 'Moon Cheese'; // Moon基本上是被省下來不用的
    console.plog('In Night, Current Stage:', nowStage);
  } else if (isDay) {
    litCandle(candleTypes.none);
    doubleEgg(false);
    stageIndex = 0;
    // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
    defaultBait = 'Gouda Cheese';
    console.plog('In Day');
  }
  init();
  function init() {
    stopHunting();
  }
  /** Stop before Dawn.
  hunts_until_dawn will not be 0 but 'Dawn' at Dawn.
  After dawn, it's still 'Dawn' at day before enter night. */
  function stopHunting() {
    const travelTo = settings.travelTo;
    if (travelTo && travelTo != '') {
      if (isDawn || huntsUntilDawn < settings.stopAtHunts) {
        pauseByTraveling(travelTo);
        return;
      }
    }
    repairWall();
  }
  /** repairWall後一堆參數值改變了,要重跑 fortRox() */
  function repairWall() {
    logging('repairWall');
    if (!canRepair) {
      console.log('No repair, check auto enter');
      autoEnter();
      return;
    }
    console.log('repair wall and then re-run fortRox()');
    fortRoxRepairFort(repairCost, () => {
      setTimeout(() => {
        // autoEnter();
        fortRox();
      }, 2000);
    });
  }
  /** autoEnter後一堆參數值改變了,要重跑 fortRox() */
  function autoEnter() {
    logging('autoEnter');
    const enterAfter = MyUtils.parseDateTime(settings.enterAfterTime);
    const enterBefore = MyUtils.parseDateTime(settings.enterBeforeTime);
    console.log(`enterAfter: ${enterAfter}, enterBefore: ${enterBefore}`);
    if (
      isDay &&
      effectiveMeteorite > settings.meteoriteMoreThan &&
      (howliteQty < settings.howliteLessThan ||
        bloodStoneQty < settings.bloodStoneLessThan) &&
      (!enterAfter || Date.now() > enterAfter) &&
      (!enterBefore || Date.now() < enterBefore)
    ) {
      console.log('in day and have enough meteorite and no desired upgrade');
      fortRoxEnterTheNight(null, () => {
        MhUtils.updateGPWStats();
        setTimeout(() => {
          quest.current_phase = 'night';
          quest.current_stage = 'stage_one';
          // toggleTower(settings.activate[stageIndex]);
          fortRox();
        }, 2000);
      });
      return;
    }
    console.log('not auto enter, treat toggle tower and handle trap');
    let activate = settings.activate[stageIndex];
    // TODO 暫時先寫死處理
    if (huntsUntilDawn <= 100 && huntsUntilDawn > 70)
      activate = settings.activate[2];
    toggleTower(activate);
  }
  /**
   * toggleTower其實也有狀態變化未更新問題
   * 不過已經是末端就算了
   */
  function toggleTower(isEnable) {
    logging(`toggleTower(${isEnable})`);
    const quest = user.quests.QuestFortRox;
    const isToEnable =
      isEnable && !(settings.fullHPDeactivate && quest.hp >= quest.max_hp);
    console.log(`isToEnable: ${isToEnable}`);
    const isTowerActive = quest.tower_status.indexOf('inactive') < 0;
    console.plog(
      'Tower Active:',
      isTowerActive,
      'Mana:',
      manaQty,
      'Current HP:',
      quest.hp,
      'Max HP:',
      quest.max_hp
    );
    // night結束後會自動 disable tower
    if (manaQty < 1 || stageIndex < 1 || isToEnable === isTowerActive) {
      console.log('Not toggle tower, handle trap');
      handleTrap();
      return;
    }
    console.log('Need to toggle tower and then handle trap');
    fortRoxToggleTower(null, handleTrap);
  }
  function handleTrap() {
    logging(`handleTrap for stage index: ${stageIndex}`);
    if (stageIndex < 0) return;
    checkThenArm('best', 'weapon', parseTrapName(settings.weapon[stageIndex]));
    checkThenArm('best', 'base', parseTrapName(settings.base[stageIndex]));
    if (bossMultiplier > parseInt(settings.highDamageRate)) {
      checkThenArm(null, 'trinket', settings.charmOnHighDamage);
    } else {
      checkThenArm(null, 'trinket', settings.trinket[stageIndex]);
    }
    if (settings.bait[stageIndex] == 'ANY_LUNAR')
      checkThenArm('any', 'bait', ['Moon Cheese', 'Crescent Cheese']);
    else if (settings.bait[stageIndex].indexOf('=>') > -1) {
      const arr = settings.bait[stageIndex].split('=>');
      checkThenArm('best', 'bait', arr);
    } else checkThenArm(null, 'bait', parseTrapName(settings.bait[stageIndex]));
  }
  function fortRoxRepairFort(repairHp, successCallback, errorCallback) {
    if (!canRepair) {
      if (successCallback) successCallback();
      return;
    }
    const params = {
      action: 'repair_fort',
      repair_item_quantity: Math.min(
        user.quests.QuestFortRox.max_possible_repair_cost,
        repairHp
      )
    };
    fortRoxAjax(null, params, successCallback, errorCallback);
  }
  function fortRoxEnterTheNight(element, successCallback, errorCallback) {
    let repairItemQuantity = 0;
    // if (
    //   $('.fortRoxHUD-dialog.enterNight .fortRoxHUD-dialog-repairAll').prop(
    //     'checked'
    //   )
    // ) {
    //   repairItemQuantity = user.quests.QuestFortRox.max_possible_repair_cost;
    // }
    const params = {
      action: 'enter_the_night',
      repair_item_quantity: repairItemQuantity
    };
    fortRoxAjax(element, params, successCallback, errorCallback);
  }
  function fortRoxUpgradeFort(
    element,
    category,
    successCallback,
    errorCallback
  ) {
    // const target = $(element);
    // if (target.hasClass('disabled') || target.hasClass('selected')) {
    //   return false;
    // }
    const params = { action: 'upgrade_fort', type: category };
    fortRoxAjax(element, params, successCallback, errorCallback);
  }
  function fortRoxToggleTower(element, successCallback, errorCallback) {
    const params = { action: 'toggle_tower' };
    fortRoxAjax(element, params, successCallback, errorCallback);
  }
  function fortRoxAjax(element, params, successCallback, errorCallback) {
    // const target = $(element);
    // if (target.hasClass('busy') || target.hasClass('disabled')) {
    //   return false;
    // }
    // target.addClass('busy');
    params['last_read_journal_entry_id'] = $('#journallatestentry').data(
      'entry-id'
    ); // lastReadJournalEntryId;
    params['uh'] = user.unique_hash;
    $.ajax({
      data: params,
      dataType: 'json',
      type: 'post',
      url: callbackurl + 'managers/ajax/environment/fort_rox.php',
      success: function (data) {
        // self.fortRoxHideConfirm();
        // target.removeClass('busy');
        eventRegistry.doEvent('ajax_response', data);
        if (successCallback) successCallback();
      },
      error: function () {
        const popup = new jsDialog();
        popup.setTemplate('error');
        popup.addToken('{*title*}', 'An error has occurred.');
        popup.addToken('{*content*}', 'An error occurred. Please try again!');
        popup.show();
        // target.removeClass('busy');
        if (errorCallback) errorCallback();
      }
    });
  }
}

function Halloween2014() {
  let currentLocation = getPageVariable('user.environment_name');
  logging(currentLocation);
  if (currentLocation.indexOf('Haunted Terrortories') > -1) {
    let areaName = document.getElementsByClassName(
      'halloween2014Hud-areaDetails-name'
    )[0].innerHTML;
    let warning = document.getElementsByClassName(
      'halloween2014Hud-areaDetails-warning active'
    ).length;
    let isWarning = warning > 0;
    logging('Current Area Name: ' + areaName + ' Warning: ' + isWarning);
    if (isWarning) {
      let trickContainer = document.getElementsByClassName(
        'halloween2014Hud-bait trick_cheese clear-block'
      )[0];
      let treatContainer = document.getElementsByClassName(
        'halloween2014Hud-bait treat_cheese clear-block'
      )[0];
      if (trickContainer.children[2].getAttribute('class') == 'armNow active') {
        logging('Currently armed: Trick cheese, Going to arm Treat cheese');
        fireEvent(treatContainer.children[2], 'click');
      } else {
        logging('Currently armed: Treat cheese, Going to arm Trick cheese');
        fireEvent(trickContainer.children[2], 'click');
      }
    }
  }
}

function Halloween2015() {
  let currentLocation = getPageVariable('user.environment_name');
  logging(currentLocation);
  if (currentLocation.indexOf('Haunted Terrortories') > -1) {
    let areaName = document.getElementsByClassName(
      'halloweenHud-areaDetails-name'
    )[0].innerHTML;
    let warning = document.getElementsByClassName(
      'halloweenHud-areaDetails-warning active'
    ).length;
    let isWarning = warning > 0;
    logging('Current Area Name: ' + areaName + ' Warning: ' + isWarning);
    if (isWarning) {
      let trickContainer = document.getElementsByClassName(
        'halloweenHud-bait trick_cheese clear-block'
      )[0];
      let treatContainer = document.getElementsByClassName(
        'halloweenHud-bait treat_cheese clear-block'
      )[0];
      if (trickContainer.children[2].getAttribute('class') == 'armNow active') {
        logging('Currently armed: Trick cheese, Going to arm Treat cheese');
        fireEvent(treatContainer.children[2], 'click');
      } else {
        logging('Currently armed: Treat cheese, Going to arm Trick cheese');
        fireEvent(trickContainer.children[2], 'click');
      }
    }
  }
}

function Halloween2016() {
  if (getCurrentLocation().indexOf('Spooky Sandcastle') < 0) return;

  let areaName = document.getElementsByClassName(
    'halloweenHud-areaDetails-name'
  )[0].innerHTML;
  let warning = document.getElementsByClassName(
    'halloweenHud-areaDetails-warning active'
  ).length;
  let isWarning = warning > 0;
  let trickContainer = document.getElementsByClassName(
    'halloweenHud-bait trick_cheese clear-block'
  )[0];
  let treatContainer = document.getElementsByClassName(
    'halloweenHud-bait treat_cheese clear-block'
  )[0];
  let bTricking =
    trickContainer.children[2].getAttribute('class') == 'armNow active';
  let bTreating =
    treatContainer.children[2].getAttribute('class') == 'armNow active';
  console.plog(
    'Current Area Name:',
    areaName,
    'Warning:',
    isWarning,
    'Tricking:',
    bTricking,
    'Treating:',
    bTreating
  );
  if (!(bTricking || bTreating)) return;
  if (isWarning) {
    if (bTricking) {
      if (parseInt(treatContainer.children[1].textContent) > 0)
        fireEvent(treatContainer.children[2], 'click');
      else {
        disarmTrap('trinket');
        checkThenArm(null, 'bait', 'Brie Cheese');
      }
    } else {
      if (parseInt(trickContainer.children[1].textContent) > 0)
        fireEvent(trickContainer.children[2], 'click');
      else {
        disarmTrap('trinket');
        checkThenArm(null, 'bait', 'Brie Cheese');
      }
    }
  } else {
    let i;
    let nSquareMin = 0;
    let classContent = document.getElementsByClassName(
      'halloweenHud-trinket-content clear-block'
    );
    for (i = 0; i < classContent.length; i += 3) {
      if (
        classContent[i].children[3]
          .getAttribute('class')
          .indexOf('armNow active') > -1
      )
        nSquareMin++;
    }
    if (nSquareMin === 0) return;
    i = areaName.indexOf('Haunted Dream') > -1 ? 0 : 1;
    let stageContainer = document.getElementsByClassName(
      'halloweenHud-progress-stage-row-container'
    )[i];
    i = bTricking ? 0 : 1;
    let nSquareLeft =
      stageContainer.children[i].getElementsByTagName('i').length;
    console.plog('Min Square:', nSquareMin, 'Square Left:', nSquareLeft);
    if (nSquareLeft <= nSquareMin) {
      for (i = 0; i < classContent.length; i += 3) {
        if (
          classContent[i].children[3]
            .getAttribute('class')
            .indexOf('armNow active') > -1
        )
          fireEvent(classContent[i].children[3], 'click');
      }
    }
  }
}

function loadTrain(location) {
  try {
    switch (location) {
      case 'raider':
        let repellents = parseInt(
          document
            .getElementsByClassName('mouseRepellent')[0]
            .getElementsByClassName('quantity')[0].textContent
        );
        if (repellents >= 10)
          fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        break;
      case 'canyon':
        let timeLeft = document
          .getElementsByClassName('phaseTimer')[0]
          .textContent.substr(10);
        // Fire only when time left is less than 16 mins :P (needs checking if works)
        if (
          parseInt(timeLeft.substr(0, timeLeft.indexOf(':'))) == 0 &&
          parseInt(timeLeft.substr(timeLeft.indexOf(':') + 1)) <= 16
        )
          fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        break;
      default:
        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        break;
    }
    return;
  } catch (e) {
    logging(e.message);
    return;
  }
}

let timeoutToReloadOnTheHourInRRPhase;
function gnawnianExpress() {
  if (getEnvironmentType() != 'train_station') return;
  let i, j;
  const quest = user.quests.QuestTrainStation;
  const trainDuration = quest.duration;
  const bOnTrain = quest.on_train;
  const minigame = quest.minigame;
  const charmArmed = getCharmName();
  let arrCharm;
  let nCharmQuantity;
  // ges default settings
  const defaultSettings = {
    autoBoard: false,
    isAutoResttimes: false,
    trainDuration: 72,
    sleepHours: 11.5,
    bLoadCrate: false,
    nMinCrate: 11,
    goalRateStopLoadCrate: 0.4,
    bUseRepellent: false,
    nMinRepellent: 11,
    bStokeEngine: false,
    nMinFuelNugget: 20,
    hoursNoMinigame: 9,
    SD_BEFORE: { weapon: '', base: '', trinket: '', bait: '' },
    SD_AFTER: { weapon: '', base: '', trinket: '', bait: '' },
    RR: { weapon: '', base: '', trinket: '', bait: '' },
    DC: { weapon: '', base: '', trinket: '', bait: '' },
    WAITING: { weapon: '', base: '', trinket: '', bait: '' }
  };
  let settings = getStorageToObject('GES', defaultSettings);
  let nPhaseSecLeft = quest.phase_seconds_remaining;
  let strCurrentPhase = '';
  if (!bOnTrain) {
    strCurrentPhase = 'WAITING';
  } else {
    let classPhase = document.getElementsByClassName('box phaseName');
    if (classPhase.length > 0 && classPhase[0].children.length > 1)
      strCurrentPhase = classPhase[0].children[1].textContent;
  }
  console.plog(
    `Current Phase: ${strCurrentPhase}, Time Left (s): ${nPhaseSecLeft}`
  );
  if (strCurrentPhase === '') return;

  // prepareSleep(parseInt(user.quests.QuestTrainStation.phase_seconds_remaining), true, 12);
  // prepareSleep(parseInt(user.quests.QuestTrainStation.phase_seconds_remaining), false, 0, 0.25);
  // [[16,0],[6.5,12.5],[1.75,0],[0,0],[0,0],[0,0]]
  /**
   * 在 SD結束前要睡多久,就要多久前設定 restTimes.
   *   (檢查所在小時的次一小時 + shift)開始 rest.
   * 在 RR一開始要清除 restTimes
   * 在 RR結束前要設定 restTimes
   * 在 DC結束前要清除 restTimes
   *
   * @param {BigInt} phaseSecondsLeft
   * @param {Boolean | null} isClearSleep Is clearing restTimes or not.false if null.
   * @param {Number | null} checkAt Check restTimes at how many hours before phase end.
   * @param {Number} shiftCheck Shift checkAt.
   * @param {Number} sleepHours sleep how many hours.
   *  Time to check(between lower+0.1 and lower+0.5). Use localStorage.gesSleepHours if null.
   * @param {Number | null} shiftSleep Shift sleep at. 0 if null.
   */
  const prepareSleep = (
    phaseSecondsLeft,
    isClearSleep,
    checkAt,
    shiftCheck,
    sleepHours,
    shiftSleep
  ) => {
    const gesSleepHours = sleepHours || 11.5;
    console.log('GES sleep hours ', gesSleepHours);
    // 沒指定結束前幾小時檢查的話,就是要睡的時數
    // lowerHour要減掉 shiftCheck.提早睡就提早檢查,延後睡就延後檢查
    // shiftCheck/shiftSleep大於 0時是檢查/睡覺時間延後(減少/增加).小於 0時是檢查/睡覺時間提前(增加/減少).
    const shiftingCheck = shiftCheck || 0;
    const shiftingSleep = shiftSleep || 0;
    // 向上取整(提早一些檢查).這樣才不會睡醒已經是 RR
    const lowerHour =
      Math.ceil(Number.isNaN(parseFloat(checkAt)) ? gesSleepHours : checkAt) -
      shiftingCheck; // 小心 checkAt為 0時會被當 false.
    // 在 eventLocationCheck中檢查,所以基本上是 soundHourn/reload檢查一次
    // 0.5這個數值再大會增加無意義的檢查,太小可能會檢查不到(至少大於 soundHorn最大可能值)
    // Rose發生沒執行檢查,所以 0.5不保險.再加大.
    let upperHour = lowerHour + 1;
    // 只在 lowerHour < phaseSecondsLeft < upperHour間檢查
    // lowerHour + 0.1是避免因為一些誤差,又讓後面 new Date()跳進下一小時
    // ex. 12:00 SD->RR, 睡 11.5小時: 23:54 - 23:30間檢查,會設定 23 + 1(23 + 1 == 24) + (shiftHours || 0)睡
    // ex. 00:00 RR->DC, 傳 lower = 0, 23:54 - 23:30間檢查,會設定 23 + 1 + (shiftHours || 0)睡
    console.log(
      'Is clear restTimes?',
      isClearSleep,
      'shiftingCheck',
      shiftingCheck,
      'shiftingSleep',
      shiftingSleep,
      'lowerHour',
      lowerHour,
      'phaseSecondsLeft ',
      phaseSecondsLeft,
      ' should be between lowerHour ',
      (lowerHour + 0.1) * 60 * 60,
      ' and upperHour ',
      upperHour * 60 * 60
    );
    if (
      phaseSecondsLeft < (lowerHour + 0.1) * 60 * 60 ||
      phaseSecondsLeft > upperHour * 60 * 60
    )
      return;
    console.log('During preparing restTimes');
    // 如果是要清除 rest,清除後 return;
    let originalRestTimes = window.localStorage.getItem('restTimes');
    if (isClearSleep) {
      console.log('Clear restTimes');
      if (originalRestTimes != '[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]') {
        console.log('Not cleared yet, clear it');
        // prettier-ignore
        restTimes = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        if (!window.localStorage.getItem('restTimesBackup'))
          window.localStorage.setItem('restTimesBackup', originalRestTimes);
        window.localStorage.setItem(
          'restTimes',
          '[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]'
        );
      }
      return;
    }
    console.log('Not to clear restTimes, setup restTimes');
    let hour = new Date().getHours();
    // TODO 用檢查時的小時數推算開始睡覺時間問題滿多的
    hour = hour + 1 + shiftingSleep;
    if (hour >= 24) hour -= 24;
    console.log('Sleep at', hour, 'for', gesSleepHours);
    // prettier-ignore
    let newRest = [
      [hour, gesSleepHours],, [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    mhges;
    let temp = JSON.stringify(newRest);
    if (temp != originalRestTimes) {
      console.log('restTimes not modified yet ', temp, originalRestTimes);
      restTimes = newRest;
      if (!window.localStorage.getItem('restTimesBackup'))
        window.localStorage.setItem('restTimesBackup', originalRestTimes);
      window.localStorage.setItem('restTimes', temp);
    }
  };
  console.log(quest.points, quest.total_goal, quest.score, quest.team_goal);
  // 最後 75分鐘不用 supply charm
  if (nPhaseSecLeft < 4500) settings.SD_BEFORE.trinket = 'None';
  // 火車目標達成後不用 charm
  if (quest.score >= quest.team_goal) {
    settings.SD_BEFORE.trinket = 'None';
    /* // 即使火車目標已達成,如果有 Supply Hoarder,還是繼續沿用設定的 charm.
    if (MyUtils.parseQuantity(minigame.supply_hoarder_turns) < 1) {
      settings.SD_AFTER.trinket = 'None';
    } */
    // RR例外, charm是賺錢重點
    // objGES.RR.trinket = 'None';
  }
  if (quest.points >= quest.total_goal) {
    // 達成 train goal後不玩小遊戲.
    settings.bLoadCrate = false;
    settings.bStokeEngine = false;
    settings.bUseRepellent = false;
    // DC只有在多組 Charm auto時才停用.單選時不停用,不然永遠用不到
    if (settings.DC.trinket.indexOf(',') > -1) {
      settings.DC.trinket = 'None';
    }
  }
  // 增加達成 team goal設定比例後不玩 SD minigame
  const isNoCrate =
    quest.score > settings.goalRateStopLoadCrate * quest.team_goal;
  logging(
    `Not load Crate? ${isNoCrate}, ${quest.score} > ${settings.goalRateStopLoadCrate} * ${quest.team_goal}`
  );
  if (isNoCrate) {
    settings.bLoadCrate = false;
  }
  // 增加可設定最後幾小時不玩 RR minigame-72小時的火車才套用.
  const isNoRepellent = nPhaseSecLeft < settings.hoursNoMinigame * 60 * 60;
  logging(
    `Not use Repellent? ${isNoRepellent}, ${nPhaseSecLeft} < ${settings.hoursNoMinigame} * 60 * 60`
  );
  if (trainDuration == 72 && isNoRepellent) {
    settings.bUseRepellent = false;
  }

  let strStage = '';
  if (strCurrentPhase.indexOf('Supply Depot') > -1) {
    // Supply Schedule Charm數量為 0時,如果有設定使用,要強制設為 None
    // 這樣才不會導致 SD_AFTER結束後,卻還卡在 SD_AFTER charm的 bug.
    // 因為 checkThenArm在要裝備的 item找不到時並不會 disarm已裝備的 item.
    const supplyCharmQuantity = parseInt(minigame.trinkets.book_warmer_trinket);
    if (
      settings.SD_BEFORE.trinket.indexOf('Supply Schedule') > -1 &&
      supplyCharmQuantity == 0
    )
      settings['SD_BEFORE'].trinket = 'None';
    // 在 SD結束前要睡多久,就要多久前設定 restTimes.
    let sleepHours = settings.sleepHours - 4;
    if (settings.isAutoResttimes) {
      try {
        // SD phase的休息時間不要提前 15分鐘好像比較剛好
        prepareSleep(nPhaseSecLeft, false, null, 0, sleepHours, 0);
        // prepareSleep(nPhaseSecLeft, false, null, 0, sleepHours, -0.25);
      } catch (error) {}
      // 如果是 72小時的火車,睡前 2小時不用 charm(跟 prepareSleep一樣道理,再短有檢查不到風險)
      if (trainDuration == 72 && nPhaseSecLeft < (sleepHours + 2) * 60 * 60) {
        settings['SD_BEFORE'].trinket = 'None';
        // 還有 Supply Hoarder時繼續用設定的 charm
        if ((minigame.supply_hoarder_turns || 0) <= 0) {
          settings['SD_AFTER'].trinket = 'None';
        }
      }
    }
    if (
      nPhaseSecLeft <= nextActiveTime ||
      (enableTrapCheck && trapCheckTimeDiff === 0 && nPhaseSecLeft <= 900)
    ) {
      // total seconds left to next phase less than next active time or next trap check time
      strStage = 'RR';
      checkThenArm(null, 'trinket', settings[strStage].trinket);
    } else {
      /* let nTurn = parseInt(
        document
          .getElementsByClassName('supplyHoarderTab')[0]
          .textContent.substr(0, 1)
      ); */
      let nTurn = MyUtils.parseQuantity(minigame.supply_hoarder_turns);
      console.plog('Supply Hoarder Turn:', nTurn);
      if (nTurn <= 0) {
        // before
        strStage = 'SD_BEFORE';
        if (
          settings.SD_BEFORE.trinket.indexOf('Supply Schedule') > -1 &&
          charmArmed.indexOf('Supply Schedule') < 0
        ) {
          let classCharm = document.getElementsByClassName('charms');
          let linkCharm = classCharm[0].children[0];
          nCharmQuantity = parseInt(
            document
              .getElementsByClassName('charms')[0]
              .getElementsByClassName('quantity')[0].textContent
          );
          console.plog('Supply Schedule Charm Quantity:', nCharmQuantity);
          if (Number.isInteger(nCharmQuantity) && nCharmQuantity > 0)
            fireEvent(linkCharm, 'click');
        } else checkThenArm(null, 'trinket', settings.SD_BEFORE.trinket);
      } else {
        strStage = 'SD_AFTER';
        if (settings.SD_AFTER.trinket.indexOf('Supply Schedule') > -1)
          disarmTrap('trinket');
        else checkThenArm(null, 'trinket', settings.SD_AFTER.trinket);
      }
    }

    if (settings.bLoadCrate) {
      let nCrateQuantity = parseInt(
        document
          .getElementsByClassName('supplyCrates')[0]
          .getElementsByClassName('quantity')[0].textContent
      );
      console.plog('Crate Quantity:', nCrateQuantity);
      if (
        Number.isInteger(nCrateQuantity) &&
        nCrateQuantity >= settings.nMinCrate
      )
        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
    }
  } else if (strCurrentPhase.indexOf('Raider River') > -1) {
    if (settings.isAutoResttimes) {
      try {
        //  在 RR一開始要清除 restTimes
        prepareSleep(nPhaseSecLeft, true, 23);
        // 在 RR結束前要設定 DC的前 8小時的 restTimes
        let sleepHours = 8;
        // let sleepHours = objGES.sleepHours + 4;
        // DC的前段休息稍微再晚一點,觀察看還會不會沒 disarm RR charm.
        prepareSleep(nPhaseSecLeft, false, 0, 0, sleepHours, 0.3);
        // prepareSleep(nPhaseSecLeft, false, 0, 0, sleepHours, 0.25);
      } catch (error) {}
    }
    if (
      nPhaseSecLeft <= nextActiveTime ||
      (enableTrapCheck && trapCheckTimeDiff === 0 && nPhaseSecLeft <= 900)
    ) {
      // total seconds left to next phase less than next active time or next trap check time
      strStage = 'DC';
      checkThenArm(null, 'trinket', settings[strStage].trinket);
    } else {
      strStage = 'RR';
      if (settings.RR.trinket == 'AUTO') {
        // get raider status and arm respective charm
        arrCharm = ['Roof Rack', 'Door Guard', 'Greasy Glob'];
        let classTrainCarArea = document.getElementsByClassName('trainCarArea');
        nCharmQuantity = 0;
        let strAttack = '';
        for (i = 0; i < classTrainCarArea.length; i++) {
          if (classTrainCarArea[i].className.indexOf('attacked') > -1) {
            strAttack = classTrainCarArea[i].className.substr(
              0,
              classTrainCarArea[i].className.indexOf(' ')
            );
            nCharmQuantity = parseInt(
              classTrainCarArea[i].getElementsByClassName('quantity')[0]
                .textContent
            );
            console.plog(
              `'Raiders Attack: ${capitalizeFirstLetter(strAttack)}, use ${
                arrCharm[i]
              }, Charm Quantity: ${nCharmQuantity}`
            );
            if (
              Number.isInteger(nCharmQuantity) &&
              nCharmQuantity > 0 &&
              charmArmed.indexOf(arrCharm[i]) < 0
            )
              fireEvent(classTrainCarArea[i].firstChild, 'click');
            else {
              for (j = 0; j < arrCharm.length; j++) {
                if (j != i && charmArmed.indexOf(arrCharm[j]) > -1) {
                  disarmTrap('trinket');
                  break;
                }
              }
            }
            break;
          }
        }
      } else checkThenArm(null, 'trinket', settings.RR.trinket);
    }
    // 處理自動 use repellent
    if (settings.bUseRepellent) {
      let nRepellentQuantity = parseInt(
        document
          .getElementsByClassName('mouseRepellent')[0]
          .getElementsByClassName('quantity')[0].textContent
      );
      console.plog('Repellent Quantity:', nRepellentQuantity);
      if (Number.isInteger(nRepellentQuantity)) {
        if (nRepellentQuantity >= settings.nMinRepellent)
          fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        else if (
          // 不玩 RR小遊戲前 20分鐘把 Repellent用完
          nPhaseSecLeft < (settings.hoursNoMinigame * 60 + 20) * 60 &&
          nPhaseSecLeft > settings.hoursNoMinigame * 60 * 60 &&
          nRepellentQuantity > 0
        )
          fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
      }
      /* if (
        Number.isInteger(nRepellentQuantity) &&
        nRepellentQuantity >= objGES.nMinRepellent
      )
        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click'); */
    }
    // 距離整點 20分鐘內時,設定整點後 4-14秒 reload page
    const secondsToNextHour = 3600000 - (Date.now() % 3600000);
    const timeoutSeconds = secondsToNextHour + 4000 + 10 * Math.random();
    if (secondsToNextHour < 1200000 && !timeoutToReloadOnTheHourInRRPhase) {
      console.log('該設定整點 reload了');
      timeoutToReloadOnTheHourInRRPhase = setTimeout(() => {
        window.location.href = MOUSEHUNT_BASE_URL;
      }, timeoutSeconds);
      console.log(
        '整點 reload timeout seconds',
        timeoutSeconds,
        'timeout id',
        timeoutToReloadOnTheHourInRRPhase
      );
    } else {
      console.log('還沒到設定整點 reload的時間');
    }
  } else if (strCurrentPhase.indexOf('Daredevil Canyon') > -1) {
    let sleepHours = settings.sleepHours + 4 - 8; // 前半段睡了 8小時了
    if (settings.isAutoResttimes) {
      try {
        // 在 DC結束前,後半段要睡多久,就要多久前設定 restTimes.
        // DC的後段休息提早 1小時檢查延後 0.4小時睡,避免睡醒已經結束了,會執行不到清除 restTimes
        prepareSleep(nPhaseSecLeft, false, null, -1, sleepHours, 0.4);
        // prepareSleep(nPhaseSecLeft, false, null, -1, sleepHours, 0);
        // 在 DC結束前要清除 restTimes.提前一些比較保險.
        // RR一結束進 DC就睡了,如果貼著 DC結束才檢查,可能會因為 RR設的睡覺時間跑去睡.
        prepareSleep(nPhaseSecLeft, true, 0);
      } catch (error) {}
    }
    if (
      nPhaseSecLeft <= nextActiveTime ||
      (enableTrapCheck && trapCheckTimeDiff === 0 && nPhaseSecLeft <= 900)
    ) {
      // total seconds left to next phase less than next active time or next trap check time
      strStage = 'WAITING';
      checkThenArm(null, 'trinket', settings[strStage].trinket);
    } else {
      strStage = 'DC';
      arrCharm = [
        'Dusty Coal Charm',
        'Black Powder Charm',
        'Magmatic Crystal Charm'
      ];
      let nIndex = arrCharm.indexOf(settings.DC.trinket);
      if (arrCharm.indexOf(settings.DC.trinket) > -1) {
        let classCharms = document.getElementsByClassName('charms');
        nCharmQuantity = parseInt(
          classCharms[0].children[nIndex].getElementsByClassName('quantity')[0]
            .textContent
        );
        console.plog(settings.DC.trinket, 'Quantity:', nCharmQuantity);
        if (
          Number.isInteger(nCharmQuantity) &&
          nCharmQuantity > 0 &&
          charmArmed.indexOf(settings.DC.trinket) < 0
        )
          fireEvent(classCharms[0].children[nIndex], 'click');
      } else
        checkThenArm(
          armPriority.best,
          TrapType.trinket,
          parseTrapName(settings.DC.trinket)
        );
    }

    if (settings.bStokeEngine) {
      // get fuel nugget quantity
      let nFuelQuantity = parseInt(
        document
          .getElementsByClassName('fuelNugget')[0]
          .getElementsByClassName('quantity')[0].textContent
      );
      console.plog('Fuel Nugget Quantity:', nFuelQuantity);
      if (
        Number.isInteger(nFuelQuantity) &&
        nFuelQuantity >= settings.nMinFuelNugget
      )
        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
    }
  } else {
    // 自動搭火車
    if (settings.autoBoard !== false)
      setTimeout(() => {
        autoBoardTrain(settings.trainDuration);
      }, 15000);
    strStage = 'WAITING';
    arrCharm = [
      'Supply Schedule Charm',
      'Roof Rack Charm',
      'Door Guard Charm',
      'Greasy Glob Charm',
      'Magmatic Crystal Charm',
      'Black Powder Charm',
      'Dusty Coal Charm'
    ];
    // dropdownlist沒有空字串可選,除非初始後都沒動過
    if (
      arrCharm.indexOf(settings.WAITING.trinket) > -1 ||
      arrCharm.indexOf(charmArmed) > -1
    )
      disarmTrap('trinket');
    else
      checkThenArm(
        armPriority.null,
        TrapType.trinket,
        settings.WAITING.trinket
      );
  }
  checkThenArm(
    armPriority.best,
    TrapType.weapon,
    parseTrapName(settings[strStage].weapon)
  );
  checkThenArm(
    armPriority.best,
    TrapType.base,
    parseTrapName(settings[strStage].base)
  );
  checkThenArm(armPriority.null, TrapType.bait, settings[strStage].bait);
}

/**
 * 自動選擇火車
 *
 * @param {*} desiredDuration train duration.
 */
function autoBoardTrain(desiredDuration) {
  console.log('Start auto board');
  // 似乎還沒領獎勵前,data-active是 1或空
  let isBoarded = $('div[data-active=1]').length > 0;
  if (!isBoarded) {
    console.log('No data-active=1, try true');
    isBoarded = $('div[data-active=true]').length > 0;
  }
  if (isBoarded) {
    console.log('There is data-active=true or data-active=1, terminate');
    return;
  }
  console.log('No boarded train, continue');
  let trains = $('.trainTableBody').find('div[data-can-join=true]');
  if (trains.length == 0)
    trains = $('.trainTableBody').find('div[data-can-join=1]');
  // let trains = $(html).find('.trainTableBody').find('div[data-can-join=true]');
  console.log('trains can join: ', trains.length);
  for (let i = 0; i < trains.length; i++) {
    const train = $(trains[i]);
    const duration = train.find('.column.duration').text();
    if (
      desiredDuration === 'any' ||
      (duration && duration.trim() == desiredDuration + ' hours')
    ) {
      console.log(train.find('.column.name').text().trim());
      const joinButton = train.find('.join_train.trainButton');
      console.log(joinButton);
      joinButton.click();
      break;
    }
  }
}
/**
 * Default whisker woods rift setting.
 */
const objDefaultWWRift = {
  factionFocus: 'CC',
  factionFocusNext: 'Remain',
  startMBW: 55,
  startFunnel: 20,
  stopFunnel: 0,
  saveFunnelCharm: 'true',
  travelTo: '',
  faction: {
    weapon: new Array(3).fill('best.weapon.rift'),
    base: new Array(3).fill('best.base.rift'),
    trinket: new Array(3).fill('None'),
    bait: new Array(3).fill('Brie String')
  },
  MBW: {
    minRageLLC: 48,
    rage4044: {
      weapon: new Array(7).fill('best.weapon.rift'),
      base: new Array(7).fill('best.base.rift'),
      trinket: new Array(7).fill('None'),
      bait: new Array(7).fill('Brie String')
    },
    rage4548: {
      weapon: new Array(13).fill('best.weapon.rift'),
      base: new Array(13).fill('best.base.rift'),
      trinket: new Array(13).fill('None'),
      bait: new Array(13).fill('Brie String')
    }
  }
};
const objDefaultWWRift1 = {
  factionFocus: 'CC',
  factionFocusNext: 'Remain',
  startMBW: 55,
  startFunnel: 10,
  stopFunnel: 0,
  saveFunnelCharm: 'true',
  travelTo: '',
  faction: {
    weapon: ['best.weapon.rift', 'best.weapon.rift', 'best.weapon.rift'],
    base: ['best.base.rift', 'best.base.rift', 'best.base.rift'],
    trinket: [
      'Enerchi Charm,Rift Vacuum Charm',
      'Enerchi Charm,Rift Vacuum Charm',
      'Rift 2024 Charm'
    ],
    bait: ['Brie String', 'Brie String', 'Brie String']
  },
  MBW: {
    minRageLLC: 48,
    rage4044: {
      weapon: [
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift'
      ],
      base: [
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift'
      ],
      trinket: ['None', 'FSCLR', 'FSCLR', 'None', 'FSCLR', 'FSCLR', 'None'],
      bait: [
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String'
      ]
    },
    rage4548: {
      weapon: [
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift',
        'best.weapon.rift'
      ],
      base: [
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift',
        'best.base.rift'
      ],
      trinket: [
        'Enerchi Charm,Rift Vacuum Charm',
        'FSCLR',
        'FSCLR',
        'Enerchi Charm,Rift Vacuum Charm',
        'FSCLR',
        'FSCLR',
        'Enerchi Charm,Rift Vacuum Charm',
        'FSCLR',
        'FSCLR',
        'Enerchi Charm,Rift Vacuum Charm',
        'Rift Ultimate Luck Charm',
        'Rift Ultimate Luck Charm',
        'Rift Ultimate Luck Charm'
      ],
      bait: [
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Brie String',
        'Lactrodectus Lancashire',
        'Lactrodectus Lancashire',
        'Lactrodectus Lancashire'
      ]
    }
  }
};
/**
 * Whisker Woods Rift factions in order: CC/GGT/DL
 */
const WhiskerWoodsRiftFactions = ['CC', 'GGT', 'DL'];
/**
 * Whisker Woods Rift funnel charm in order: CC/GGT/DL
 */
const WhiskerWoodsRiftFunnelCharm = [
  'Cherry Charm',
  'Gnarled Charm',
  'Stagnant Charm'
];
/**
 *
 */
function whiskerWoodsRift() {
  if (getEnvironmentType() !== 'rift_whisker_woods') return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Brie String';
  const quest = user.quests.QuestRiftWhiskerWoods;
  const llcCraftingItems = [
    quest.items.tasty_spider_mould_crafting_item.quantity,
    quest.items.creamy_gnarled_sap_crafting_item.quantity,
    quest.items.crumbly_rift_salts_crafting_item.quantity
  ];
  logging('LLC crafting items quantity:', llcCraftingItems);
  const funnelCharms = [
    quest.items.cherry_trinket.quantity,
    quest.items.gnarled_trinket.quantity,
    quest.items.wicked_gnarly_trinket.quantity
  ];
  const rages = [
    quest.zones.clearing.level,
    quest.zones.lagoon.level,
    quest.zones.tree.level
  ];
  const setup = getStorageToObject('WWRift', objDefaultWWRift);
  // 初始把 factionFocus設定為 CC(Auto)
  if (sumData(rages) < 2) {
    if (setup.factionFocus != 'CC') {
      setup.factionFocus = 'CC';
      localStorage.WWRift = JSON.stringify(setup);
    }
  }
  // 如果系統要送 MBW(在任一個 faction到達 25時, 3個 faction合計超過設定中的 startMBW-最美好的情況是合計 72)就收
  if (
    Math.max(...rages) > 24 &&
    Math.max(...rages) < 27 &&
    sumData(rages) > setup.startMBW
  ) {
    if (setup.factionFocus != 'MBW_45_48') {
      setup.factionFocus = 'MBW_45_48';
      localStorage.WWRift = JSON.stringify(setup);
    }
  }
  if (isNullOrUndefined(setup.factionFocusNext) || setup.factionFocus === '')
    setup.factionFocusNext = 'Remain';
  setup.order = WhiskerWoodsRiftFactions.slice();
  setup.funnelCharm = WhiskerWoodsRiftFunnelCharm.slice();
  setup.rage = new Array(3);
  let i;
  let temp = -1;
  let tempNext = -1;
  let trapSetupIndex = -1;
  let classRage = document.getElementsByClassName(
    'riftWhiskerWoodsHUD-zone-rageLevel'
  );
  for (i = 0; i < classRage.length; i++) {
    setup.rage[i] = parseInt(classRage[i].textContent);
    if (Number.isNaN(setup.rage[i])) return;
  }
  console.plog(setup);
  let charmArmed = getCharmName();
  let rage25Count = 0;
  let rage44Count = 0; // 安全線,因為有 +6 rage的存在,設成 43比較安全?
  let rage50Count = 0;
  let minRageCount = 0;
  let charmIndex = -1;
  let rageGoal = 0;
  let weaponName = '',
    baseName = '',
    charmName = '',
    baitName = '';
  if (setup.factionFocus == 'MBW_40_44') {
    for (i = 0; i < setup.rage.length; i++) {
      if (setup.rage[i] >= 25) rage25Count++;
    }
    if (rage25Count >= 3) {
      for (i = 0; i < setup.rage.length; i++) {
        if (setup.rage[i] >= setup.MBW.minRageLLC) minRageCount++;
      }
    }
    trapSetupIndex = rage25Count + minRageCount;
    weaponName = parseTrapName(setup.MBW.rage4044.weapon[trapSetupIndex]);
    baseName = parseTrapName(setup.MBW.rage4044.base[trapSetupIndex]);
    if (setup.MBW.rage4044.trinket[trapSetupIndex].indexOf('FSC') > -1) {
      // charmIndex = objWWRift.funnelCharm.indexOf(charmArmed);
      rageGoal = trapSetupIndex >= 3 ? setup.MBW.minRageLLC : 25;
      for (let i = 0; i < setup.rage.length; i++) {
        const r = setup.rage[i];
        if (r >= rageGoal) {
          setup.rage.splice(i, 1);
          setup.funnelCharm.splice(i, 1);
          i--;
        }
      }
      temp = maxIndex(setup.rage);
      if (temp > -1) {
        setup.MBW.rage4044.trinket[trapSetupIndex] = setup.funnelCharm[temp];
      }
      /* if (charmIndex > -1) {
        if (objWWRift.rage[charmIndex] >= rageGoal) {
          temp = minIndex(objWWRift.rage);
          if (temp > -1)
            objWWRift.MBW.rage4044.trinket[trapSetupIndex] =
              objWWRift.funnelCharm[temp];
        } else objWWRift.MBW.rage4044.trinket[trapSetupIndex] = charmArmed;
      } else {
        temp = minIndex(objWWRift.rage);
        if (temp > -1)
          objWWRift.MBW.rage4044.trinket[trapSetupIndex] =
            objWWRift.funnelCharm[temp];
      } */
    }
    charmName = parseTrapName(setup.MBW.rage4044.trinket[trapSetupIndex]);
    baitName = parseTrapName(setup.MBW.rage4044.bait[trapSetupIndex]);
  } else if (setup.factionFocus == 'MBW_45_48') {
    if (Math.max(...setup.rage) == 50 && setup.travelTo != '') {
      pauseByTraveling(setup.travelTo);
      return;
    }
    for (i = 0; i < setup.rage.length; i++) {
      if (setup.rage[i] >= 25) rage25Count++;
    }
    if (rage25Count >= 3) {
      for (i = 0; i < setup.rage.length; i++) {
        if (setup.rage[i] >= 44) rage44Count++;
      }
    }
    // TODO rage 44後有可能直接跳 rage 50,不見得絕對會有 3個 faction都 >= minRageLLC(48)的過程
    // 不過這種情形的結果就是抓 mini boss而已.
    if (rage44Count >= 3) {
      for (i = 0; i < setup.rage.length; i++) {
        if (setup.rage[i] >= setup.MBW.minRageLLC) minRageCount++;
      }
    }
    if (minRageCount >= 3) {
      for (i = 0; i < setup.rage.length; i++) {
        if (setup.rage[i] == 50) rage50Count++;
      }
    }
    trapSetupIndex = rage25Count + rage44Count + minRageCount + rage50Count;
    weaponName = parseTrapName(setup.MBW.rage4548.weapon[trapSetupIndex]);
    baseName = parseTrapName(setup.MBW.rage4548.base[trapSetupIndex]);
    if (setup.MBW.rage4548.trinket[trapSetupIndex].indexOf('FSC') > -1) {
      charmIndex = setup.funnelCharm.indexOf(charmArmed);
      rageGoal =
        trapSetupIndex >= 9
          ? 50
          : trapSetupIndex >= 6
          ? setup.MBW.minRageLLC
          : trapSetupIndex >= 3
          ? 44
          : 25;
      for (let i = 0; i < setup.rage.length; i++) {
        const r = setup.rage[i];
        if (r >= rageGoal) {
          setup.rage.splice(i, 1);
          setup.funnelCharm.splice(i, 1);
          i--;
        }
      }
      // 48 up to 50, min first.
      temp = trapSetupIndex >= 9 ? minIndex(setup.rage) : maxIndex(setup.rage);
      if (temp > -1) {
        setup.MBW.rage4548.trinket[trapSetupIndex] = setup.funnelCharm[temp];
      }
      /* if (charmIndex > -1) {
        if (objWWRift.rage[charmIndex] >= rageGoal) {
          temp = minIndex(objWWRift.rage);
          if (temp > -1)
            objWWRift.MBW.rage4548.trinket[trapSetupIndex] =
              objWWRift.funnelCharm[temp];
        } else objWWRift.MBW.rage4548.trinket[trapSetupIndex] = charmArmed;
      } else {
        temp = minIndex(objWWRift.rage);
        if (temp > -1)
          objWWRift.MBW.rage4548.trinket[trapSetupIndex] =
            objWWRift.funnelCharm[temp];
      } */
    }
    charmName = parseTrapName(setup.MBW.rage4548.trinket[trapSetupIndex]);
    baitName = parseTrapName(setup.MBW.rage4548.bait[trapSetupIndex]);
  } else {
    const rage = parseRage();
    if (sumData(rage) < 2) {
      console.log('New round, clear isEnoughFunnelCharm');
      window.localStorage.removeItem('isEnoughFunnelCharm');
    }
    temp = Math.max(...llcCraftingItems) - Math.min(...llcCraftingItems);
    if (temp > 0) {
      console.log(
        'LLC crafting items are unbalanced. Max is ',
        temp,
        ' more then min.'
      );
      temp = minIndex(llcCraftingItems);
      let isEnoughFunnelCharm = window.localStorage.getItem(
        'isEnoughFunnelCharm'
      );
      if (
        funnelCharms[temp] >= setup.startFunnel &&
        isEnoughFunnelCharm !== 'true'
      ) {
        isEnoughFunnelCharm = 'true';
        window.localStorage.setItem('isEnoughFunnelCharm', isEnoughFunnelCharm);
      }
      if (
        funnelCharms[temp] <= setup.stopFunnel &&
        isEnoughFunnelCharm === 'true'
      ) {
        isEnoughFunnelCharm = 'false';
        window.localStorage.setItem('isEnoughFunnelCharm', isEnoughFunnelCharm);
      }
      if (isEnoughFunnelCharm === 'true') {
        console.log(
          'There are enough ',
          WhiskerWoodsRiftFunnelCharm[temp],
          funnelCharms[temp]
        );
        temp = WhiskerWoodsRiftFactions[temp];
        console.log('To focus faction is ', temp);
        wwRiftFactionFocus(temp);
        return;
      }
      console.log(
        'There are not enough ',
        WhiskerWoodsRiftFunnelCharm[temp],
        funnelCharms[temp]
      );
    }
    wwRiftFactionFocus();
    return;
  }
  checkThenArm('best', TrapType.weapon, weaponName);
  if (getCharmItemId === 2081) baseName = 'Attuned Enerchi Induction';
  checkThenArm('best', TrapType.base, baseName);
  checkThenArm('best', TrapType.trinket, charmName);
  checkThenArm('best', TrapType.bait, baitName);
}

/**
 * Parse and collect rage in the order of CC->GGT->DL
 *
 * @return {BigInt[] | null}
 * rage of all factions in the order of CC->GGT->DL.
 * null if any rage of factions is NaN.
 */
function parseRage() {
  const rage = new Array(3);
  const classRage = document.getElementsByClassName(
    'riftWhiskerWoodsHUD-zone-rageLevel'
  );
  for (let i = 0; i < classRage.length; i++) {
    rage[i] = parseInt(classRage[i].textContent);
    if (Number.isNaN(rage[i])) return null;
  }
  return rage;
}

/**
 * Focus on specified faction.
 * 只在有 faction的 rage大於等於 25後才會啟動.
 *
 * @param {String} faction elements of WhiskerWoodsRiftFactionOrder
 */
function wwRiftFactionFocus(faction) {
  const rage = parseRage();
  if (!rage) return;
  const objWWRift = getStorageToObject('WWRift', objDefaultWWRift);
  // const objWWRift = JSON.parse(window.localStorage.getItem('WWRift'));
  const maxRage = Math.max(...rage);
  const trapSetupIndex = Math.floor(maxRage / 25);
  const weaponName = objWWRift.faction.weapon[trapSetupIndex];
  const baseName = objWWRift.faction.base[trapSetupIndex];
  let charmName = objWWRift.faction.trinket[trapSetupIndex];
  const baitName = objWWRift.faction.bait[trapSetupIndex];
  const focusFactionIndex = WhiskerWoodsRiftFactions.indexOf(faction);
  if (maxRage >= 44) {
    console.log('Max rage is greater or equal to 44.');
    if (focusFactionIndex > -1 && rage[focusFactionIndex] != maxRage) {
      console.log(
        'There is focus faction and rage of focus faction is not max.'
      );
      charmName = WhiskerWoodsRiftFunnelCharm[focusFactionIndex];
    }
  } else if (maxRage >= 25) {
    console.log('Max rage is greater or equal to 25.');
    if (focusFactionIndex > -1 && rage[focusFactionIndex] != maxRage) {
      console.log(
        'There is focus faction and rage of focus faction is not max.'
      );
      charmName = WhiskerWoodsRiftFunnelCharm[focusFactionIndex];
    }
  }
  // console.log('best', TrapType.weapon, weaponName);
  // console.log('best', TrapType.base, baseName);
  // console.log('best', TrapType.trinket, charmName);
  // console.log('best', TrapType.bait, baitName);
  checkThenArm('best', TrapType.weapon, parseTrapName(weaponName));
  checkThenArm('best', TrapType.base, parseTrapName(baseName));
  checkThenArm('best', TrapType.trinket, parseTrapName(charmName));
  checkThenArm('best', TrapType.bait, parseTrapName(baitName));
}

function iceberg(waxOrSticky) {
  // takes in string 'wax' or 'sticky'
  let location = getPageVariable('user.environment_name');
  logging(location);

  if (location.indexOf('Iceberg') > -1) {
    let stage = document.getElementsByClassName('currentPhase')[0].textContent;
    let progress = parseInt(
      document
        .getElementsByClassName('user_progress')[0]
        .textContent.replace(',', '')
    );
    logging('In ' + stage + ' at ' + progress + ' feets right now.');

    // Check if theres general
    if (
      progress == 300 ||
      progress == 600 ||
      progress == 1600 ||
      progress == 1800
    ) {
      logging('General encountered.');
      checkThenArm('best', 'base', bestPowerBase);
      checkThenArm(null, 'trinket', 'Super Power', wasteCharm);
      return;
    }

    let icebergCharm;
    if (waxOrSticky == 'sticky') {
      icebergCharm = ['Sticky', 'Wax'];
    } else {
      icebergCharm = ['Wax', 'Sticky'];
    }

    switch (stage) {
      case 'Treacherous Tunnels':
        // magnet base
        checkThenArm(null, 'base', 'Magnet Base');
        checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
        break;
      case 'Brutal Bulwark':
        // spiked base
        checkThenArm(null, 'base', 'Spiked Base');
        checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
        break;
      case 'Bombing Run':
        // Remote det base
        checkThenArm('best', 'base', ['Remote Detonator Base', 'Magnet Base']);
        checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
        break;
      case 'The Mad Depths':
        // Hearthstone base
        checkThenArm(null, 'base', 'Hearthstone Base');
        checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
        break;
      case "Icewing's Lair":
      // Deep freeze base for the rest
      case 'Hidden Depths':
      case 'The Deep Lair':
        checkThenArm(null, 'base', 'Deep Freeze Base');
        let charmArmed = getPageVariable('user.trinket_name');
        if (charmArmed.indexOf('Wax') > -1 || charmArmed.indexOf('Sticky') > -1)
          disarmTrap('trinket');
        break;
      default:
        break;
    }

    icebergCharm = null;
    stage = null;
  } else if (location.indexOf('Slushy Shoreline') > -1) {
    logging('Disarming cheese as wrong area now.');
    disarmTrap('bait');
  }
  location = null;
}

function icebergV2() {
  let loc = getCurrentLocation();
  let arrOrder = [
    'GENERAL',
    'TREACHEROUS',
    'BRUTAL',
    'BOMBING',
    'MAD',
    'ICEWING',
    'HIDDEN',
    'DEEP',
    'SLUSHY'
  ];
  let objDefaultIceberg = {
    base: new Array(9).fill(''),
    trinket: new Array(9).fill('None'),
    bait: new Array(9).fill('Gouda')
  };
  let objIceberg = getStorageToObject('Iceberg', objDefaultIceberg);
  let nIndex = -1;
  if (loc.indexOf('Iceberg') > -1) {
    let phase;
    let nProgress = -1;
    let classCurrentPhase = document.getElementsByClassName('currentPhase');
    if (classCurrentPhase.length > 0) phase = classCurrentPhase[0].textContent;
    else phase = getPageVariable('user.quests.QuestIceberg.current_phase');
    let classProgress = document.getElementsByClassName('user_progress');
    if (classProgress.length > 0)
      nProgress = parseInt(classProgress[0].textContent.replace(',', ''));
    else
      nProgress = parseInt(
        getPageVariable('user.quests.QuestIceberg.user_progress')
      );
    console.plog('In', phase, 'at', nProgress, 'feets');

    if (
      nProgress == 300 ||
      nProgress == 600 ||
      nProgress == 1600 ||
      nProgress == 1800
    )
      nIndex = 0;
    else {
      phase = phase.toUpperCase();
      for (let i = 1; i < arrOrder.length; i++) {
        if (phase.indexOf(arrOrder[i]) > -1) {
          nIndex = i;
          break;
        }
      }
    }
  } else if (loc.indexOf('Slushy Shoreline') > -1)
    nIndex = arrOrder.indexOf('SLUSHY');
  if (nIndex < 0) return;
  checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
  checkThenArm(null, 'base', objIceberg.base[nIndex]);
  checkThenArm(null, 'trinket', objIceberg.trinket[nIndex]);
  checkThenArm(null, 'bait', objIceberg.bait[nIndex]);
}

function BurroughRift(bCheckLoc, minMist, maxMist, nToggle) {
  //Tier 0: 0 Mist Canisters
  //Tier 1/Yellow: 1-5 Mist Canisters
  //Tier 2/Green: 6-18 Mist Canisters
  //Tier 3/Red: 19-20 Mist Canisters
  if (bCheckLoc && getCurrentLocation().indexOf('Burroughs Rift') < 0) return;

  const currentMistQuantity = parseInt(
    user.quests.QuestRiftBurroughs.mist_released || 0
  );
  /* let currentMistQuantity = parseInt(
    document.getElementsByClassName('mistQuantity')[0].innerText
  ); */
  const isMisting = user.quests.QuestRiftBurroughs.is_misting;
  /* let isMisting =
    getPageVariable('user.quests.QuestRiftBurroughs.is_misting') == 'true'; */
  const mistButton = document.getElementsByClassName('mistButton')[0];
  console.plog(
    'Current Mist Quantity:',
    currentMistQuantity,
    'Is Misting:',
    isMisting
  );
  if (minMist === 0 && maxMist === 0) {
    if (isMisting) {
      console.plog('Stop mist...');
      fireEvent(mistButton, 'click');
    }
  } else if (currentMistQuantity >= maxMist && isMisting) {
    if (maxMist == 20 && Number.isInteger(nToggle)) {
      if (nToggle == 1) {
        console.plog('Stop mist...');
        fireEvent(mistButton, 'click');
      } else {
        let nCount20 = getStorageToVariableInt('BR20_Count', 0);
        nCount20++;
        if (nCount20 >= nToggle) {
          nCount20 = 0;
          console.plog('Stop mist...');
          fireEvent(mistButton, 'click');
        }
        setStorage('BR20_Count', nCount20);
      }
    } else {
      console.plog('Stop mist...');
      fireEvent(mistButton, 'click');
    }
  } else if (currentMistQuantity <= minMist && !isMisting) {
    console.plog('Start mist...');
    fireEvent(mistButton, 'click');
  }
  return currentMistQuantity;
}

function BRCustom() {
  if (getEnvironmentType() != 'rift_burroughs') return;
  let objDefaultBRCustom = {
    hunt: '',
    toggle: 1,
    name: ['Red', 'Green', 'Yellow', 'None'],
    weapon: new Array(4),
    base: new Array(4),
    trinket: new Array(4),
    bait: new Array(4)
  };
  let objBR = getStorageToObject('BRCustom', objDefaultBRCustom);
  let mistQuantity = 0;
  if (objBR.hunt == 'Red')
    mistQuantity = BurroughRift(false, 19, 20, objBR.toggle);
  else if (objBR.hunt == 'Green') mistQuantity = BurroughRift(false, 6, 18);
  else if (objBR.hunt == 'Yellow') mistQuantity = BurroughRift(false, 1, 5);
  else mistQuantity = BurroughRift(false, 0, 0);

  let currentTier = '';
  if (mistQuantity >= 19) currentTier = 'Red';
  else if (mistQuantity >= 6) currentTier = 'Green';
  else if (mistQuantity >= 1) currentTier = 'Yellow';
  else currentTier = 'None';

  if (currentTier != objBR.hunt) return;

  let nIndex = objBR.name.indexOf(currentTier);
  checkThenArm(null, 'weapon', objBR.weapon[nIndex]);
  checkThenArm(null, 'base', objBR.base[nIndex]);
  checkThenArm(null, 'bait', objBR.bait[nIndex]);
  if (objBR.trinket[nIndex] == 'None') disarmTrap('trinket');
  else checkThenArm(null, 'trinket', objBR.trinket[nIndex]);
}
/**
 * Automate Burroughs Rift.
 */
function burroughsRift() {
  if (getEnvironmentType() != 'rift_burroughs') return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Brie String';
  // get BRift Settings
  const defaultBRSetting = {
    hunt: '',
    enoughCanister: 100,
    isAutoTerreRicotta: true,
    autoTerreRicottaAtQuantity: 10,
    charmPairedWithTerreRicotta: '',
    toggle: 1,
    name: ['Red', 'Green', 'Yellow', 'None'],
    weapon: new Array(4),
    base: new Array(4),
    trinket: new Array(4),
    bait: new Array(4)
  };
  const objBR = getStorageToObject('BRCustom', defaultBRSetting);
  const questRiftBurroughs = user.quests.QuestRiftBurroughs;
  const mistReleased = parseInt(questRiftBurroughs.mist_released || 0);
  let currentTier = '';
  if (mistReleased > 18) currentTier = 'Red';
  else if (mistReleased > 5) currentTier = 'Green';
  else if (mistReleased > 0) currentTier = 'Yellow';
  else currentTier = 'None';
  let index = objBR.name.indexOf(currentTier);
  let weaponName = parseTrapName(objBR.weapon[index]),
    baseName = parseTrapName(objBR.base[index]),
    baitName = parseTrapName(objBR.bait[index]),
    charmName = parseTrapName(objBR.trinket[index]);
  // auto mist when enough canister
  const canisterQty = parseInt(
    questRiftBurroughs.items.mist_canister_stat_item.quantity || 0
  );
  if (
    mistReleased == 0 &&
    canisterQty > objBR.enoughCanister &&
    objBR.hunt != 'None'
  ) {
    toggleMisting(true);
    checkThenArm('best', 'weapon', weaponName);
    checkThenArm('best', 'base', baseName);
    checkThenArm('best', 'bait', baitName);
    checkThenArm('best', 'trinket', charmName);
    return;
  }
  if (objBR.hunt == 'Red') burroughsRiftMisting(false, 19, 20, objBR.toggle);
  else if (objBR.hunt == 'Green') burroughsRiftMisting(false, 8, 16);
  else if (objBR.hunt == 'Yellow') burroughsRiftMisting(false, 1, 5);
  else burroughsRiftMisting(false, 0, 0);

  // if (currentTier != objBR.hunt) return;
  // auto brew
  /* self.usePotion = function (element) {
    var target = $(element);
    var container = target.parents('.itemViewContainer');
    var targetData = $('li.selected', container).data();
    var html = '';
    html +=
      '<div class="inventoryPage-item" data-item-type="' +
      targetData.itemType +
      '">';
    html +=
      '<li class="selected" data-recipe-item="' +
      targetData.recipeItem +
      '" data-produced-item="' +
      targetData.producedItem +
      '" data-recipe-index="' +
      targetData.recipeIndex +
      '"></li>';
    html += '</div>';
    var tmpDOM = $(html);
    app.pages.InventoryPage.showConfirmPopup(tmpDOM, 'potion');
  }; */
  // auto Terre Ricotta
  const terreRicottaQuantity =
    questRiftBurroughs.items.terre_ricotta_cheese.quantity;
  let isTerreRicottaRun = window.localStorage.getItem('isTerreRicottaRun');
  if (
    objBR.isAutoTerreRicotta &&
    currentTier == objBR.hunt &&
    currentTier != 'Red' &&
    currentTier != 'None'
  ) {
    // When auto Terre Ricotta Run,
    if (
      terreRicottaQuantity > objBR.autoTerreRicottaAtQuantity &&
      'true' !== isTerreRicottaRun
    ) {
      isTerreRicottaRun = 'true';
      window.localStorage.setItem('isTerreRicottaRun', isTerreRicottaRun);
    }
    if (terreRicottaQuantity == 0 && 'false' !== isTerreRicottaRun) {
      isTerreRicottaRun = 'false';
      window.localStorage.setItem('isTerreRicottaRun', isTerreRicottaRun);
    }
    if (isTerreRicottaRun === 'true') {
      baitName.unshift('Terre Ricotta');
      if (charmName.indexOf('None') < 0) {
        charmName.unshift(objBR.charmPairedWithTerreRicotta);
      } else {
        charmName = [objBR.charmPairedWithTerreRicotta];
      }
    }
  }
  changeDefaultBait('Brie String');
  checkThenArm('best', 'weapon', weaponName);
  checkThenArm('best', 'base', baseName);
  checkThenArm('best', 'bait', baitName);
  checkThenArm('best', 'trinket', charmName);
}

/**
 * Change default bait in game running.
 *
 * @param {String} newDefault
 */
function changeDefaultBait(newDefault) {
  if (defaultBait.indexOf(newDefault) < 0) {
    defaultBait = newDefault;
    window.localStorage.setItem('defaultBait', newDefault);
  }
}

/**
 * Toggle mist button.
 *
 * @param {Boolean} isEnable true: enable/false: disable.
 */
function toggleMisting(isEnable) {
  const questRiftBurroughs = user.quests.QuestRiftBurroughs;
  const isMisting = questRiftBurroughs.is_misting || false;
  if (isEnable !== isMisting)
    fireEvent(document.getElementsByClassName('mistButton')[0], 'click');
}

/**
 * Auto start/stop misting by specified min/maxMist.
 *
 * @param {Boolean} isCheckLoc
 * @param {BigInt} minMist
 * @param {BigInt} maxMist
 * @param {BigInt} nToggle
 * @return {BigInt} current mist quantity.
 */
function burroughsRiftMisting(isCheckLoc, minMist, maxMist, nToggle) {
  //Tier 0: 0 Mist Canisters
  //Tier 1/Yellow: 1-5 Mist Canisters
  //Tier 2/Green: 6-18 Mist Canisters
  //Tier 3/Red: 19-20 Mist Canisters
  if (isCheckLoc && getEnvironmentType() != 'rift_burroughs') return;

  const questRiftBurroughs = user.quests.QuestRiftBurroughs;
  const currentMistReleased = parseInt(questRiftBurroughs.mist_released || 0);
  const isMisting = questRiftBurroughs.is_misting;
  let mistButton = document.getElementsByClassName('mistButton')[0];
  console.plog(
    'Current Mist Quantity:',
    currentMistReleased,
    'Is Misting:',
    isMisting
  );
  if (minMist === 0 && maxMist === 0) {
    toggleMisting(false);
  } else if (currentMistReleased >= maxMist && isMisting) {
    if (maxMist == 20 && Number.isInteger(nToggle)) {
      if (nToggle == 1) {
        toggleMisting(false);
      } else {
        let nCount20 = getStorageToVariableInt('BR20_Count', 0);
        nCount20++;
        if (nCount20 >= nToggle) {
          nCount20 = 0;
          toggleMisting(false);
        }
        setStorage('BR20_Count', nCount20);
      }
    } else {
      toggleMisting(false);
    }
  } else if (currentMistReleased <= minMist && !isMisting) {
    toggleMisting(true);
  }
  return currentMistReleased;
}
/**
 * lg area portal method
 * @param {Object} settings
 * @returns
 */
function lgGeneral() {
  defaultBait = 'Gouda';
  const objLGTemplate = {
    isAutoFill: false,
    isAutoPour: false,
    maxSaltCharged: 25,
    base: {
      before: '',
      after: '',
      tc: '',
      boss: ''
    },
    trinket: {
      before: '',
      after: '',
      tc: '',
      boss: ''
    },
    bait: {
      before: '',
      after: '',
      tc: '',
      boss: ''
    }
  };
  let objDefaultLG = {
    isCheckDuskshade: false,
    isCheckLunaria: false,
    dewthief: 30,
    duskshade: 150,
    graveblossom: 30,
    lunaria: 50,
    LG: JSON.parse(JSON.stringify(objLGTemplate)),
    TG: JSON.parse(JSON.stringify(objLGTemplate)),
    LC: JSON.parse(JSON.stringify(objLGTemplate)),
    CC: JSON.parse(JSON.stringify(objLGTemplate)),
    SD: JSON.parse(JSON.stringify(objLGTemplate)),
    SC: JSON.parse(JSON.stringify(objLGTemplate))
  };
  const settings = getStorageToObject('LGArea', objDefaultLG);
  const loc = getCurrentLocation();
  const baitItemId = getBaitItemId();
  loadLootItems();
  switch (loc) {
    case 'Living Garden':
      if (settings.isCheckDuskshade)
        if (baitItemId === lgAreaItems.duc.itemId) {
          console.log('Use armed Duskshade quantity');
          lgAreaItems.duc.quantity = getBaitQuantity();
          livingGarden(settings);
        } else if (lgAreaItems.duc.quantity < 0) {
          console.log('Not arming Duskshade, query Duskshade quantity');
          getQuantityByUrlThen(
            'duskshade_camembert_cheese',
            (qty) => {
              lgAreaItems.duc.quantity = qty;
              console.log('After getQuantityByUrlThen', lgAreaItems);
              livingGarden(settings);
            },
            true
          );
        } else {
          console.log('Else Duskshade quantity: ', lgAreaItems.duc.quantity);
          livingGarden(settings);
        }
      // 無法購買 Duskshade時設定成不檢查 Duskshade(Duskshade數量為 0)
      else livingGarden(settings);
      break;
    case 'Lost City':
      lostCity(settings);
      break;
    case 'Sand Dunes':
      sandDunes(settings);
      break;
    case 'Twisted Garden':
      if (settings.isCheckLunaria)
        if (baitItemId === lgAreaItems.luc.itemId) {
          console.log('Use armed Lunaria quantity');
          lgAreaItems.luc.quantity = getBaitQuantity();
          twistedGarden(settings);
        } else if (lgAreaItems.luc.quantity < 0) {
          console.log('Not arming Lunaria, query Lunaria quantity');
          getQuantityByUrlThen(
            lgAreaItems.luc.type,
            (qty) => {
              lgAreaItems.luc.quantity = qty;
              console.log('After getQuantityByUrlThen', lgAreaItems);
              twistedGarden(settings);
            },
            true
          );
        } else {
          console.log('Else Lunaria quantity: ', lgAreaItems.luc.quantity);
          twistedGarden(settings);
        }
      // 無法購買 Lunaria時設定成不檢查 Lunaria(Lunaria數量為 0)
      else twistedGarden(settings);
      break;
    case 'Cursed City':
      cursedCity(settings);
      break;
    case 'Sand Crypts':
      sandCrypts(settings);
      break;
    default:
      break;
  }
  DisarmLGSpecialCharm(loc);
}
const lgAreaItems = {
  dec: { quantity: 0, itemId: 1007, type: 'dewthief_camembert_cheese' },
  duc: { quantity: -1, itemId: 1008, type: 'duskshade_camembert_cheese' },
  grc: { quantity: 0, itemId: 1009, type: 'graveblossom_camembert_cheese' },
  luc: { quantity: -1, itemId: 1010, type: 'lunaria_camembert_cheese' },
  dep: { quantity: 0, type: 'dewthief_petal_crafting_item' },
  drh: { quantity: 0, type: 'dreamfluff_herbs_crafting_item' },
  dup: { quantity: 0, type: 'duskshade_petal_crafting_item' },
  grp: { quantity: 0, type: 'graveblossom_petal_crafting_item' },
  plh: { quantity: 0, type: 'plumepearl_herbs_crafting_item' },
  lup: { quantity: 0, type: 'lunaria_petal_crafting_item' },
  sponge: { quantity: 0, itemId: 1020, type: 'sponge_trinket' },
  searcher: { quantity: 0, itemId: 1018, type: 'searcher_trinket' },
  chow: { quantity: 0, itemId: 1016, type: 'grubling_chow_trinket' },
  red: { quantity: 0, itemId: 1017, type: 'red_sponge_trinket' },
  yellow: { quantity: 0, itemId: 1022, type: 'yellow_sponge_trinket' },
  bravery: { quantity: 0, itemId: 1011, type: 'bravery_trinket' },
  shine: { quantity: 0, itemId: 1019, type: 'shine_trinket' },
  clarity: { quantity: 0, itemId: 1012, type: 'clarity_trinket' },
  salt: { quantity: 0, itemId: 1014, type: 'grub_salt_trinket' },
  scent: { quantity: 0, itemId: 1015, type: 'grub_scent_trinket' }
};
/** Load living garden complex loot items quantity */
function loadLootItems() {
  const quest = user.quests.QuestLivingGarden
    ? user.quests.QuestLivingGarden
    : user.quests.QuestLostCity
    ? user.quests.QuestLostCity
    : user.quests.QuestSandDunes
    ? user.quests.QuestSandDunes
    : null;
  if (!quest) return;
  const lootDrops = quest.loot_drops;
  console.log('quest loot_drops', quest, lootDrops);
  /* const dewthiefQty = MyUtils.parseQuantity(
    document
      .querySelector('a.itemImage.dewthief_petal_crafting_item')
      .querySelector('div.quantity').innerText
  );
  lootItems.dep.quantity = dewthiefQty; */
  lgAreaItems.dep.quantity = MyUtils.parseQuantity(
    lootDrops.dewthief_petal_crafting_item.quantity
  );
  lgAreaItems.drh.quantity = MyUtils.parseQuantity(
    lootDrops.dreamfluff_herbs_crafting_item.quantity
  );
  lgAreaItems.dup.quantity = MyUtils.parseQuantity(
    lootDrops.duskshade_petal_crafting_item.quantity
  );
  lgAreaItems.grp.quantity = MyUtils.parseQuantity(
    lootDrops.graveblossom_petal_crafting_item.quantity
  );
  lgAreaItems.plh.quantity = MyUtils.parseQuantity(
    lootDrops.plumepearl_herbs_crafting_item.quantity
  );
  lgAreaItems.lup.quantity = MyUtils.parseQuantity(
    lootDrops.lunaria_petal_crafting_item.quantity
  );
  console.plog('Load loot items: ', lgAreaItems);
  // return lootItems;
}
const lgComplex = {
  livingGarden: 'desert_oasis',
  twistedGarden: 'desert_oasis',
  lostCity: 'lost_city',
  cursedCity: 'lost_city',
  sandDunes: 'sand_dunes',
  sandCrypts: 'sand_dunes'
};
/**
 * Living Garden algorithm
 * @param {Object} settings
 * @param {Object} lootItems
 */
function livingGarden(settings) {
  logging('livingGarden_1.0.0.0.0');
  // auto lost city/sand dunes
  const itemQuantity = lgAreaItems.dep.quantity;
  if (itemQuantity + lgAreaItems.dec.quantity > settings.dewthief) {
    const itemType = lgAreaItems.dec.type;
    const travelTo =
      lgAreaItems.dup.quantity < settings.duskshade
        ? lgComplex.sandDunes
        : lgAreaItems.drh.quantity < settings.duskshade
        ? lgComplex.lostCity
        : '';
    /* 交錯收集
    const travelTo =
      lootItems.dup.quantity < settings.duskshade &&
      lootItems.dup.quantity <= lootItems.drh.quantity
        ? lgComplex.sandDunes
        : lootItems.drh.quantity < settings.duskshade &&
          lootItems.drh.quantity < lootItems.dup.quantity
        ? lgComplex.lostCity
        : '';
     */
    if (travelTo !== '') {
      completeTransaction(true, itemType, itemQuantity, false, () => {
        travel(travelTo);
      });
      return;
    }
  }
  // auto buy duskshade camembert.至少用光其中一種材料
  const duskCamQty = lgAreaItems.duc.quantity;
  const duskshadeQty = Math.min(
    lgAreaItems.drh.quantity,
    lgAreaItems.dup.quantity
  );
  console.log('duskCamQty: ', duskCamQty, 'duskshadeQty: ', duskshadeQty);
  const duskCamType = lgAreaItems.duc.type;
  if (duskshadeQty > 0 && duskshadeQty + duskCamQty > settings.duskshade) {
    console.log(`To buy ${duskshadeQty} ${duskCamType}`);
    completeTransaction(true, duskCamType, duskshadeQty, false, () => {
      console.log(`Bought ${duskshadeQty} ${duskCamType}`);
      setTimeout(() => {
        reloadWithMessage('Bought Duskshade, Reloading...', false);
      }, 20000);
    });
    // return;
  }
  const quest = user.quests.QuestLivingGarden;
  const minigame = quest.minigame;
  const estimateHunt = parseInt(minigame.estimate);
  /* const pourEstimate = document.getElementsByClassName('pourEstimate')[0];
  const estimateHunt = parseInt(pourEstimate.innerText.split(/ +/)[0]); */
  let state = minigame.bucket_state;
  if (Number.isNaN(estimateHunt)) state = 'pouring';
  else if (estimateHunt >= 35) state = 'filled';
  console.plog('Estimate Hunt:', estimateHunt, 'State:', state);
  let baitName = 'Gouda';
  const weaponName = objBestTrap.weapon.hydro;
  let baseName = bestLGBase;
  let charmName = 'None';
  // auto twisted garden
  const autoTwisted = () => {
    if (duskshadeQty + duskCamQty > settings.duskshade) {
      settings.LG.bait.before = 'Duskshade Camembert';
      settings.LG.bait.after = 'Duskshade Camembert';
      settings.LG.base.before = settings.LG.base.boss;
      settings.LG.base.after = settings.LG.base.boss;
      settings.LG.trinket.before = settings.LG.trinket.boss;
      settings.LG.trinket.after = settings.LG.trinket.boss;
    }
  };
  const setLgTrapBefore = () => {
    // 處理 bait
    // 無法在 LG長期用 Camembert hunt. Duskshade抓到 Carmine the Apothecary就進 TG了
    // 所以 LG不接受設定任何 Camembert,但是選項不可移除,要留給 TG用
    if (settings.LG.bait.before.indexOf('Camembert') > -1)
      settings.LG.bait.before = 'Gouda Cheese';
    autoTwisted();
    // 裝備 Duskshade時不自動改,因為在 TG裝備 Duskshade時,不可能回到 LG.
    if (getBaitItemId() === lgAreaItems.duc.itemId)
      if (getBaitQuantity() > 2) settings.LG.bait.before = '';
    baitName = parseTrapName(settings.LG.bait.before);
    // 處理 base
    if (getBaitItemId() === lgAreaItems.duc.itemId)
      settings.LG.base.before = settings.LG.base.boss;
    if (settings.LG.base.before !== '')
      baseName = parseTrapName(settings.LG.base.before);
    // 處理 charm
    // Sponge不可設定使用,autoFill時自動切換
    if (settings.LG.trinket.before.indexOf('Sponge') > -1)
      settings.LG.trinket.before = 'None';
    // autoFill時自動使用 Sponge
    if (settings.LG.isAutoFill) {
      // 避免浪費 Double Sponge, > 27後就改只用 Sponge
      if (estimateHunt > 27) settings.LG.trinket.before = 'Sponge';
      else settings.LG.trinket.before = spongeCharm.join(',');
    }
    if (getBaitItemId() === lgAreaItems.duc.itemId)
      settings.LG.trinket.before = settings.LG.trinket.boss;
    charmName = parseTrapName(settings.LG.trinket.before);
  };
  const setLgTrapAfter = () => {
    // 處理 bait
    autoTwisted();
    // 裝備 Duskshade時不自動改,因為在 TG裝備 Duskshade時,不可能回到 LG.
    if (getBaitItemId() === lgAreaItems.duc.itemId)
      if (getBaitQuantity() > 2) settings.LG.bait.after = '';
    // 不給選空白 if (trimToEmpty(settings.LG.bait.after) !== '')
    baitName = parseTrapName(settings.LG.bait.after);
    // 處理 base
    if (getBaitItemId() === lgAreaItems.duc.itemId)
      settings.LG.base.after = settings.LG.base.boss;
    if (trimToEmpty(settings.LG.base.after) !== '')
      baseName = parseTrapName(settings.LG.base.after);
    // 處理 charm
    if (settings.LG.trinket.after.indexOf('Sponge') > -1)
      settings.LG.trinket.after = 'None';
    if (getBaitItemId() === lgAreaItems.duc.itemId)
      settings.LG.trinket.after = settings.LG.trinket.boss;
    charmName = parseTrapName(settings.LG.trinket.after);
  };
  if (state == 'pouring') {
    setLgTrapAfter();
  } else if (state == 'filled') {
    const pourButton = document.getElementsByClassName('pour')[0];
    if (settings.LG.isAutoPour && !isNullOrUndefined(pourButton)) {
      livingGardenDoAlchemy(true, () => {
        setLgTrapAfter();
      });
      /* fireEvent(pourButton, 'click');
      setTimeout(() => {
        const confirm = document.getElementsByClassName('confirm button')[0];
        if (confirm) {
          fireEvent(confirm, 'click');
          window.setTimeout(function () {
            setLgTrapAfter();
          }, 3000);
        }
      }, 3000); */
    } else {
      setLgTrapBefore();
    }
  } else if (state == 'filling') {
    setLgTrapBefore();
  }
  checkThenArm(armPriority.best, TrapType.bait, baitName);
  checkThenArm(armPriority.best, TrapType.weapon, weaponName);
  checkThenArm(armPriority.best, TrapType.base, baseName);
  checkThenArm(armPriority.best, TrapType.trinket, charmName);
}
/** living garden pour function */
function livingGardenDoAlchemy(isNormal, callback) {
  var container = $('#hudLocationContent .livingGardenHud');
  $('.dewdrops, .redDrops, .yellowDrops', container).animate(
    { height: 0 },
    2000
  );
  $('a.pour span', container).text('Pouring');
  $('a.pour', container).addClass('pouringDrops');
  var ajax = new Ajax();
  ajax.requireLogin = true;
  ajax.responseType = Ajax.JSON;
  ajax.ondone = function (resp) {
    $('a.pour', container).removeClass('pouringDrops');
    eventRegistry.doEvent('ajax_response', resp);
    if (callback) callback(resp);
  };
  ajax.onerror = function () {};
  var params = {
    action: isNormal ? 'dump_bucket' : 'combine_vials',
    uh: user.unique_hash
  };
  ajax.post(
    canvaspageurl + 'managers/ajax/environment/livinggarden.php',
    params
  );
}
/**
 * lostCity algorithm. @param {Object} settings */
function lostCity(settings) {
  logging('lostCity_1.0.0.0.0');
  const quest = user.quests.QuestLostCity;
  const minigame = quest.minigame;
  const isCursed = minigame.is_cursed;
  console.plog('Cursed:', isCursed);
  const baitName = 'Dewthief';
  const weaponName = objBestTrap.weapon.arcane;
  let baseName = bestLGBase;
  let charmName = 'None';
  //disarm searcher charm when cursed is lifted
  if (!isCursed) {
    if (trimToEmpty(settings.LC.base.after) !== '')
      baseName = parseTrapName(settings.LC.base.after);
    if (settings.LC.trinket.after.indexOf('Searcher') > -1)
      settings.LC.trinket.after = 'None';
    charmName = parseTrapName(settings.LC.trinket.after);
  } else {
    if (trimToEmpty(settings.LC.base.before) !== '')
      baseName = parseTrapName(settings.LC.base.before);
    charmName = 'Searcher';
  }
  // auto buy Searcher Charm
  const charmQty = minigame.curses[0].charm.quantity;
  if (charmName === 'Searcher' && charmQty < 4) {
    completeTransaction(true, lgAreaItems.searcher.type, 5, false, () => {
      checkThenArm(armPriority.best, TrapType.bait, baitName);
      checkThenArm(armPriority.best, TrapType.weapon, weaponName);
      checkThenArm(armPriority.best, TrapType.base, baseName);
      checkThenArm(armPriority.best, TrapType.trinket, charmName);
      goGardenAsCheeseFew();
    });
    return;
  }
  checkThenArm(armPriority.best, TrapType.bait, baitName);
  checkThenArm(armPriority.best, TrapType.weapon, weaponName);
  checkThenArm(armPriority.best, TrapType.base, baseName);
  checkThenArm(armPriority.best, TrapType.trinket, charmName);
  goGardenAsCheeseFew();
}
/** if Dewthief are less then 3, clear workIn and travel back Living Garden. */
function goGardenAsCheeseFew() {
  setTimeout(() => {
    const baitName = getBaitName();
    const baitQty = getBaitQuantity();
    console.plog(
      `goGardenAsCheeseFew, "${baitName}": ${baitQty} < 3? ${baitQty < 3}`
    );
    if (baitQty < 3) {
      console.plog('goGardenAsCheeseFew, bait less then 3, travel.');
      pauseByTraveling('desert_oasis');
      return;
    }
    // Dewthief/Graveblossom
    if ([1007, 1009].indexOf(getBaitItemId()) < 0) {
      storeError('Failed to travel when bait less then 3');
      pauseByTraveling('desert_oasis');
    }
    /* if (baitName.indexOf('Dewthief') < 0 || baitQuantity < 3) {
      pauseByTraveling('desert_oasis');
      // if (window.localStorage.getItem('workIn') == 'lost_city')
      //   window.localStorage.setItem('workIn', '');
      // travel('desert_oasis');
    } */
  }, 20000);
}
/** Sand Dunes algorithm. */
function sandDunes(settings) {
  logging('sandDunes_1.0.0.0.0');
  const quest = user.quests.QuestSandDunes;
  const minigame = quest.minigame;
  const baitName = 'Dewthief';
  const weaponName = objBestTrap.weapon.shadow;
  let baseName = bestLGBase;
  let charmName = 'None';
  const hasStampede = minigame.has_stampede;
  console.plog(`Has Stampede: ${hasStampede}`);
  if (hasStampede) {
    if (trimToEmpty(settings.SD.base.after) !== '')
      baseName = parseTrapName(settings.SD.base.after);
    charmName = 'Grubling Chow';
  } else {
    //disarm grubling chow charm when there is no stampede
    if (trimToEmpty(settings.SD.base.before) !== '')
      baseName = parseTrapName(settings.SD.base.before);
    if (settings.SD.trinket.before.indexOf('Chow') > -1)
      settings.SD.trinket.before = 'None';
    charmName = parseTrapName(settings.SD.trinket.before);
  }
  // auto buy Grubling Chow Charm
  const charmQty = minigame.grubling_charm_quantity;
  if (charmQty < 5) {
    completeTransaction(true, lgAreaItems.chow.type, 15, false, () => {
      checkThenArm(armPriority.best, TrapType.bait, baitName);
      checkThenArm(armPriority.best, TrapType.weapon, weaponName);
      checkThenArm(armPriority.best, TrapType.base, baseName);
      checkThenArm(armPriority.best, TrapType.trinket, charmName);
      goGardenAsCheeseFew();
    });
    return;
  }
  checkThenArm(armPriority.best, TrapType.bait, baitName);
  checkThenArm(armPriority.best, TrapType.weapon, weaponName);
  checkThenArm(armPriority.best, TrapType.base, baseName);
  checkThenArm(armPriority.best, TrapType.trinket, charmName);
  goGardenAsCheeseFew();
}
/** Twisted Garden algorithm. @param {Object} settings */
function twistedGarden(settings) {
  logging('twistedGarden_1.0.0.0.0');
  // auto cursed city/sand crypts
  const itemQuantity = lgAreaItems.grp.quantity;
  if (itemQuantity + lgAreaItems.grc.quantity > settings.graveblossom) {
    const itemType = lgAreaItems.grc.type;
    const travelTo =
      lgAreaItems.lup.quantity < settings.lunaria
        ? lgComplex.sandCrypts
        : lgAreaItems.plh.quantity < settings.lunaria
        ? lgComplex.cursedCity
        : '';
    /* 交錯收集
    const travelTo =
      lootItems.lup.quantity < settings.lunaria &&
      lootItems.lup.quantity <= lootItems.plh.quantity
        ? lgComplex.sandCrypts
        : lootItems.plh.quantity < settings.lunaria &&
          lootItems.plh.quantity < lootItems.lup.quantity
        ? lgComplex.cursedCity
        : '';
     */
    if (travelTo !== '') {
      completeTransaction(true, itemType, itemQuantity, false, () => {
        travel(travelTo);
      });
      return;
    }
  }
  // auto buy lunaria camembert.至少用光其中一種材料
  const lunariaCamQty = lgAreaItems.luc.quantity;
  const lunariaQty = Math.min(
    lgAreaItems.plh.quantity,
    lgAreaItems.lup.quantity
  );
  console.log('lunariaCamQty: ', lunariaCamQty, 'lunariaQty: ', lunariaQty);
  const lunariaCamType = lgAreaItems.luc.type;
  if (lunariaQty > 0 && lunariaQty + lunariaCamQty > settings.lunaria) {
    console.log(`To buy ${lunariaQty} ${lunariaCamType}`);
    completeTransaction(true, lunariaCamType, lunariaQty, false, () => {
      console.log(`Bought ${lunariaQty} ${lunariaCamType}`);
      setTimeout(() => {
        reloadWithMessage('Bought Lunaria, Reloading...', false);
      }, 20000);
    });
    // return;
  }
  const quest = user.quests.QuestLivingGarden;
  const minigame = quest.minigame;
  const estimateHunt = parseInt(minigame.estimate);
  let state = minigame.vials_state;
  const red = parseInt(minigame.red_drops);
  const yellow = parseInt(minigame.yellow_drops);
  const redPlusYellow = redSpongeCharm.concat(yellowSpongeCharm);
  if (
    Number.isNaN(red) ||
    Number.isNaN(yellow) ||
    document.getElementsByClassName('stateFilling hidden').length > 0
  ) {
    state = 'pouring';
  } else if (red == 10 && yellow == 10) state = 'filled';
  console.plog(
    `Red: ${red}, Yellow: ${yellow}, Estimate Hunt: ${estimateHunt}, Status: ${state}`
  );
  let baitName = 'Duskshade Camembert';
  const weaponName = objBestTrap.weapon.hydro;
  let baseName = bestLGBase;
  let charmName = 'None';
  // auto twisted carmine
  const autoTwisted = () => {
    if (lunariaQty + lunariaCamQty > settings.lunaria) {
      settings.TG.bait.before = 'Lunaria Camembert';
      settings.TG.bait.after = 'Lunaria Camembert';
      settings.TG.base.before = settings.TG.base.tc;
      settings.TG.base.after = settings.TG.base.tc;
      settings.TG.trinket.before = settings.TG.trinket.tc;
      settings.TG.trinket.after = settings.TG.trinket.tc;
    }
  };
  const setTgTrapBefore = () => {
    // 處理 bait
    // TG不給設定 Duskshade/Lunaria以外的,用其他 cheese 1 hunt就回 LG了
    if (
      settings.TG.bait.before.indexOf('Duskshade') < 0 &&
      settings.TG.bait.before.indexOf('Lunaria') < 0
    )
      settings.TG.bait.before = 'Duskshade Camembert';
    // 裝備 Duskshade時,如果 bait數量低於 4,裝備 Gouda離開,不要用光 Duskshade
    if (getBaitItemId() === lgAreaItems.duc.itemId && getBaitQuantity() < 4)
      settings.TG.bait.before = 'Gouda Cheese';
    autoTwisted();
    // 裝備 Lunaria時, bait數量低於 3之前 bait保持不變,修改 base/charm為 tc設定.
    // 低於 3時 bait改成 Duskshade不要用光 Lunaria,不修改 base/charm
    if (getBaitItemId() === lgAreaItems.luc.itemId) {
      settings.TG.bait.before = '';
      if (getBaitQuantity() < 3)
        settings.TG.bait.before = 'Duskshade Camembert';
    }
    baitName = parseTrapName(settings.TG.bait.before);
    // 處理 base
    if (getBaitItemId() === lgAreaItems.luc.itemId)
      if (getBaitQuantity() > 2) settings.TG.base.before = settings.TG.base.tc;
    if (settings.TG.base.before !== '')
      baseName = parseTrapName(settings.TG.base.before);
    // 處理 charm
    // Sponge不可設定使用,autoFill時自動切換
    if (
      settings.TG.trinket.before.indexOf('Red') > -1 ||
      settings.TG.trinket.before.indexOf('Yellow') > -1
    )
      settings.TG.trinket.before = 'None';
    // autoFill時自動使用 Sponge
    if (settings.TG.isAutoFill) {
      if (red <= 8 && yellow <= 8)
        settings.TG.trinket.before = redPlusYellow.join(',');
      else if (red < 10) {
        if (red <= 8) settings.TG.trinket.before = redSpongeCharm.join(',');
        else settings.TG.trinket.before = 'Red Sponge';
      } else if (red == 10 && yellow < 10) {
        if (yellow <= 8)
          settings.TG.trinket.before = yellowSpongeCharm.join(',');
        else settings.TG.trinket.before = 'Yellow Sponge';
      }
    }
    if (getBaitItemId() === lgAreaItems.luc.itemId)
      if (getBaitQuantity() > 2)
        settings.TG.trinket.before = settings.TG.trinket.tc;
    charmName = parseTrapName(settings.TG.trinket.before);
  };
  const setTgTrapAfter = () => {
    // 處理 bait
    // 裝備 Duskshade時,如果 bait數量低於3,裝備 Gouda離開,不要用光 Duskshade
    if (getBaitItemId() === lgAreaItems.duc.itemId && getBaitQuantity() < 3)
      settings.TG.bait.after = 'Gouda Cheese';
    autoTwisted();
    // 裝備 Lunaria時, bait數量低於 3之前 bait保持不變,修改 base/charm為 tc設定.
    // 低於 3時 bait改成 Duskshade不要用光 Lunaria,不修改 base/charm
    if (getBaitItemId() === lgAreaItems.luc.itemId) {
      settings.TG.bait.after = '';
      if (getBaitQuantity() < 3) settings.TG.bait.after = 'Duskshade Camembert';
    }
    if (trimToEmpty(settings.TG.bait.after) !== '')
      baitName = parseTrapName(settings.TG.bait.after);
    // 處理 base
    if (getBaitItemId() === lgAreaItems.luc.itemId)
      settings.TG.base.after = settings.TG.base.tc;
    if (trimToEmpty(settings.TG.base.after) !== '')
      baseName = parseTrapName(settings.TG.base.after);
    // 處理 charm
    if (
      settings.TG.trinket.after.indexOf('Red') > -1 ||
      settings.TG.trinket.after.indexOf('Yellow') > -1
    )
      settings.TG.trinket.after = 'None';
    if (getBaitItemId() === lgAreaItems.luc.itemId)
      settings.TG.trinket.after = settings.TG.trinket.tc;
    charmName = parseTrapName(settings.TG.trinket.after);
  };
  if (state == 'pouring') {
    setTgTrapAfter();
  } else if (state == 'filled') {
    let pourButton = document.getElementsByClassName('pour')[0];
    if (settings.TG.isAutoPour && !isNullOrUndefined(pourButton)) {
      fireEvent(pourButton, 'click');
      if (document.getElementsByClassName('confirm button')[0]) {
        window.setTimeout(function () {
          fireEvent(
            document.getElementsByClassName('confirm button')[0],
            'click'
          );
        }, 1000);
        setTgTrapAfter();
      } else {
        setTgTrapBefore();
      }
    } else {
      setTgTrapBefore();
    }
  } else if (state == 'filling') {
    setTgTrapBefore();
  }
  checkThenArm(armPriority.best, TrapType.bait, baitName);
  checkThenArm(armPriority.best, TrapType.weapon, weaponName);
  checkThenArm(armPriority.best, TrapType.base, baseName);
  checkThenArm(armPriority.best, TrapType.trinket, charmName);
}
function cursedCity(settings) {
  logging('cursedCity_1.0.0.0.0');
  const quest = user.quests.QuestLostCity;
  const minigame = quest.minigame;
  console.plog(minigame);
  const isCursed = minigame.is_cursed;
  console.plog('Cursed:', isCursed);
  const baitName = 'Graveblossom';
  const weaponName = objBestTrap.weapon.arcane;
  let baseName = bestLGBase;
  let charmName = 'None';
  if (!isCursed) {
    if (trimToEmpty(settings.CC.base.after) !== '')
      baseName = parseTrapName(settings.CC.base.after);
    if (
      settings.CC.trinket.after.indexOf('Bravery') > -1 ||
      settings.CC.trinket.after.indexOf('Shine') > -1 ||
      settings.CC.trinket.after.indexOf('Clarity') > -1
    )
      settings.CC.trinket.after = 'None';
    charmName = parseTrapName(settings.CC.trinket.after);
  } else {
    if (trimToEmpty(settings.CC.base.before) !== '')
      baseName = parseTrapName(settings.CC.base.before);
    const curses = minigame.curses;
    const cursedCityCharm = [];
    for (let i = 0; i < curses.length; i++) {
      const curse = curses[i];
      console.plog('i:', i, 'Active:', curse.active);
      if (curse.active) {
        switch (i) {
          case 0:
            console.plog('Fear Active');
            cursedCityCharm.push('Bravery');
            break;
          case 1:
            console.plog('Darkness Active');
            cursedCityCharm.push('Shine');
            break;
          case 2:
            console.plog('Mist Active');
            cursedCityCharm.push('Clarity');
            break;
        }
      }
    }
    charmName = cursedCityCharm;
    // auto buy Charm
    const charmQty = [
      curses[0].charm.quantity,
      curses[1].charm.quantity,
      curses[2].charm.quantity
    ];
    const charmTypes = {
      fear: lgAreaItems.bravery.type,
      darkness: lgAreaItems.shine.type,
      mist: lgAreaItems.clarity.type
    };
    if (Math.min(...charmQty) < 4) {
      const isBuy = true;
      let itemType = charmTypes[curses[0].type];
      let itemQty = curses[0].charm.quantity < 4 ? 5 : 0;
      const isKCItem = false;
      completeTransactionPromise(isBuy, itemType, itemQty, isKCItem)
        .then(() => {
          itemType = charmTypes[curses[1].type];
          itemQty = curses[1].charm.quantity < 4 ? 5 : 0;
          return completeTransactionPromise(isBuy, itemType, itemQty, isKCItem);
        })
        .then(() => {
          itemType = charmTypes[curses[2].type];
          itemQty = curses[2].charm.quantity < 4 ? 5 : 0;
          return completeTransactionPromise(isBuy, itemType, itemQty, isKCItem);
        })
        .then(() => {
          checkThenArm(armPriority.best, TrapType.bait, baitName);
          checkThenArm(armPriority.best, TrapType.weapon, weaponName);
          checkThenArm(armPriority.best, TrapType.base, baseName);
          checkThenArm(armPriority.best, TrapType.trinket, charmName);
          goGardenAsCheeseFew();
        });
    }
  }
  checkThenArm(armPriority.best, TrapType.bait, baitName);
  checkThenArm(armPriority.best, TrapType.weapon, weaponName);
  checkThenArm(armPriority.best, TrapType.base, baseName);
  checkThenArm(armPriority.best, TrapType.trinket, charmName);
  goGardenAsCheeseFew();
}
function sandCrypts(settings) {
  logging('sandCrypts_1.0.0.0.0');
  const quest = user.quests.QuestSandDunes;
  const minigame = quest.minigame;
  const baitName = 'Graveblossom';
  const weaponName = objBestTrap.weapon.shadow;
  let baseName = bestLGBase;
  let charmName = 'None';
  let salt = MyUtils.parseQuantity(minigame.salt_charms_used);
  console.plog('Salted:', salt);
  if (salt >= settings.SC.maxSaltCharged) {
    if (trimToEmpty(settings.SC.base.after) !== '')
      baseName = parseTrapName(settings.SC.base.after);
    if (trimToEmpty(settings.SC.trinket.after) === '')
      settings.SC.trinket.after = 'Grub Scent';
    charmName = parseTrapName(settings.SC.trinket.after);
  } else {
    if (trimToEmpty(settings.SC.base.before) !== '')
      baseName = parseTrapName(settings.SC.base.before);
    if (trimToEmpty(settings.SC.trinket.before) === '')
      if (settings.SC.maxSaltCharged - salt == 1)
        settings.SC.trinket.before = 'Grub Salt';
      else settings.SC.trinket.before = bestSalt.join(',');
    charmName = parseTrapName(settings.SC.trinket.before);
  }
  // auto buy Grub Salt/Grub Scent
  const charmItemId = getCharmItemId();
  const charmQty = getCharmQuantity();
  // Grub Salt
  if (charmItemId === 1014 && charmQty < 5) {
    completeTransaction(true, lgAreaItems.salt.type, 10, false, () => {
      checkThenArm(armPriority.best, TrapType.bait, baitName);
      checkThenArm(armPriority.best, TrapType.weapon, weaponName);
      checkThenArm(armPriority.best, TrapType.base, baseName);
      checkThenArm(armPriority.best, TrapType.trinket, charmName);
      goGardenAsCheeseFew();
    });
    return;
  }
  // Grub Scent
  if (charmItemId === 1015 && charmQty < 4) {
    completeTransaction(true, lgAreaItems.scent.type, 4, false, () => {
      checkThenArm(armPriority.best, TrapType.bait, baitName);
      checkThenArm(armPriority.best, TrapType.weapon, weaponName);
      checkThenArm(armPriority.best, TrapType.base, baseName);
      checkThenArm(armPriority.best, TrapType.trinket, charmName);
      goGardenAsCheeseFew();
    });
    return;
  }
  checkThenArm(armPriority.best, TrapType.bait, baitName);
  checkThenArm(armPriority.best, TrapType.weapon, weaponName);
  checkThenArm(armPriority.best, TrapType.base, baseName);
  checkThenArm(armPriority.best, TrapType.trinket, charmName);
  goGardenAsCheeseFew();
}
function DisarmLGSpecialCharm(locationName) {
  let obj = {};
  obj['Living Garden'] = spongeCharm.slice();
  obj['Lost City'] = ['Searcher'];
  obj['Sand Dunes'] = ['Grubling Chow'];
  obj['Twisted Garden'] = redSpongeCharm.concat(yellowSpongeCharm);
  obj['Cursed City'] = ['Bravery', 'Shine', 'Clarity'];
  obj['Sand Crypts'] = bestSalt.slice();
  delete obj[locationName];
  let charmArmed = getCharmName();
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      for (let i = 0; i < obj[prop].length; ++i) {
        if (charmArmed.indexOf(obj[prop][i]) === 0) {
          disarmTrap('trinket');
          return;
        }
      }
    }
  }
}

function ZTower() {
  let location = getPageVariable('user.environment_name');
  logging(location);
  if (
    location.indexOf("Zugzwang's Tower") == -1 &&
    location.indexOf('Seasonal Garden') == -1
  ) {
    logging("Not in Zugzwang's Tower or Seasonal Garden.");
    return;
  }

  if (location.indexOf('Seasonal Garden') > -1) {
    checkThenArm(null, 'bait', 'Gouda');
    checkThenArm(null, 'trinket', 'Amplifier');
    checkThenArm('best', 'base', ['Seasonal', 'Fissure', 'Golden Tournament']);

    let season = nobCalculateOfflineTimers('seasonal');
    logging('It is ' + season + ' in Seasonal Gardens right now.');
    switch (season) {
      case 'Spring':
        checkThenArm('best', 'weapon', bestPhysical);
        checkThenArm('best', 'weapon', bestPhysicalBase);
        break;
      case 'Summer':
        checkThenArm('best', 'weapon', bestTactical);
        checkThenArm('best', 'weapon', bestPowerBase);
        break;
      case 'Fall':
        checkThenArm('best', 'weapon', bestShadow);
        checkThenArm('best', 'weapon', bestPowerBase);
        break;
      case 'Winter':
        checkThenArm('best', 'weapon', bestHydro);
        checkThenArm('best', 'weapon', bestPowerBase);
        break;
      default:
        break;
    }

    season = null;
    return;
  } else if (location.indexOf("Zugzwang's Tower") > -1) {
    let ztTriesLeft = 5;
    retrieveMouseList();
    let intervalZT = setInterval(function () {
      if (mouseList.length > 0) {
        if (checkMouse('Chess Master')) {
          //arm Uncharged Scholar Charm & Checkmate Cheese
          checkThenArm(null, 'trinket', 'Uncharged Scholar');
          checkThenArm(null, 'bait', 'Checkmate');
        } else if (checkMouse('King')) {
          //arm Checkmate Cheese
          checkThenArm(null, 'bait', 'Checkmate');
        } else if (checkMouse('Queen')) {
          //arm another charm other than rook charm
          checkThenArm(null, 'trinket', 'Super Power');
          disarmTrap('trinket');
        } else if (checkMouse('Rook')) {
          //arm rook charm (if available)
          checkThenArm(null, 'trinket', 'Rook Crumble');
        } else if (checkMouse('Knight')) {
          //arm Sphynx Wrath
          checkThenArm(null, 'weapon', 'Sphynx Wrath');
          checkThenArm('best', 'base', bestPowerBase);
        }
        clearInterval(intervalZT);
        intervalZT = null;
        mouseList = [];
        return;
      } else {
        logging('Count down to ZT bot give up: ' + ztTriesLeft);
        if (ztTriesLeft == 0) {
          clearInterval(intervalZT);
          intervalZT = null;
          mouseList = [];
          ztTriesLeft = null;
        }
        return;
      }
    }, 3000);
    return;
  }
}

/* Begin V2 SG + ZTower */
/**
 * Auto zugzwangTower() function added:
 * When amplifier fullfill user requirement,
 * auto travel to Zugzwang's Tower.
 * At that moment, eventLocation will still
 * be SG but currentLocation will be
 * Zugzwang's Tower.
 *
 * Seasonal Garden algorithm.
 *
 * Use timeInMilliSeconds to verify current
 * season and checkThenArm trap setup.
 *
 * Change season if next horn sounded in
 * different season.
 *
 * Disarm bait when amplifier is full setup.
 */
function seasonalGarden() {
  const loc = getCurrentLocation();
  if (loc.indexOf("Zugzwang's Tower") > -1) {
    setStorage('eventLocation', 'ZT');
    zugzwangTower();
    return;
  } else if (loc.indexOf('Seasonal Garden') < 0) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Gouda Cheese';
  // SG絕不使用 Checkmate
  const cheeseArmed = getBaitName();
  if (cheeseArmed.indexOf('Checkmate') > -1)
    checkThenArm(null, 'bait', 'Gouda Cheese');
  const objDefaultSG = {
    weapon: new Array(4).fill(''),
    base: new Array(4).fill(''),
    trinket: new Array(4).fill(''),
    bait: new Array(4).fill(''),
    disarmBaitAfterCharged: false,
    travelTo: '',
    requiredAmplifier: 150
  };
  const objSG = getStorageToObject('SGarden', objDefaultSG);
  objSG.season = ['Spring', 'Summer', 'Fall', 'Winter'];
  const now =
    g_nTimeOffset === 0
      ? new Date()
      : new Date(Date.now() + g_nTimeOffset * 1000);
  let nTimeStamp = Date.parse(now) / 1000;
  let nFirstSeasonTimeStamp = 1283328000;
  let nSeasonLength = 288000; // 80hr
  let nSeason =
    Math.floor((nTimeStamp - nFirstSeasonTimeStamp) / nSeasonLength) %
    objSG.season.length;
  let nSeasonNext =
    nSeasonLength - ((nTimeStamp - nFirstSeasonTimeStamp) % nSeasonLength);
  let nowAmp = parseInt(getPageVariable('user.viewing_atts.zzt_amplifier'));
  let nMaxAmp = parseInt(
    getPageVariable('user.viewing_atts.zzt_max_amplifier')
  );
  console.plog(
    'Current Amplifier:',
    nowAmp,
    'Current Season:',
    objSG.season[nSeason],
    'Next Season In:',
    timeFormat(nSeasonNext)
  );
  if (nSeasonNext <= nextActiveTime) {
    // total seconds left to next season less than next active time
    nSeason++;
    if (nSeason >= objSG.season.length) nSeason = 0;
  }

  let requiredAmplifier = Math.min(nMaxAmp, objSG.requiredAmplifier);
  if (nowAmp >= requiredAmplifier) {
    if (objSG.travelTo == '') {
      if (objSG.disarmBaitAfterCharged) disarmTrap('bait');
      else checkThenArm(null, 'bait', parseTrapName(objSG.bait[nSeason]));
      checkThenArm(null, 'weapon', parseTrapName(objSG.weapon[nSeason]));
      checkThenArm(null, 'base', parseTrapName(objSG.base[nSeason]));
      if (objSG.trinket[nSeason].indexOf('Amplifier') < 0)
        checkThenArm(null, 'trinket', parseTrapName(objSG.trinket[nSeason]));
      else disarmTrap('trinket');
    } else {
      disarmTrap('trinket');
      // Travel to settled location.
      setTimeout(function () {
        travel(objSG.travelTo);
      }, 5000);
    }
    return;
  }
  if (nowAmp + 1 >= requiredAmplifier) {
    logging(
      'Almost reach required amplifier, user.trinket_name: ',
      getCharmName()
    );
    checkThenArm(null, 'bait', parseTrapName(objSG.bait[nSeason]));
    checkThenArm(null, 'weapon', parseTrapName(objSG.weapon[nSeason]));
    checkThenArm(null, 'base', parseTrapName(objSG.base[nSeason]));
    if (
      getCharmName().indexOf('Amplifier') > -1 ||
      objSG.trinket[nSeason].indexOf('Amplifier') > -1
    ) {
      // What if FTC on next hunt?
      disarmTrap('trinket');
    } else checkThenArm(null, 'trinket', parseTrapName(objSG.trinket[nSeason]));
    return;
  }
  checkThenArm(null, 'bait', parseTrapName(objSG.bait[nSeason]));
  checkThenArm(null, 'weapon', parseTrapName(objSG.weapon[nSeason]));
  checkThenArm(null, 'base', parseTrapName(objSG.base[nSeason]));
  checkThenArm(null, 'trinket', parseTrapName(objSG.trinket[nSeason]));
}

/**
 * Zugzwang tower algorithm.
 * If location is seasonal garden,
 * Set localStorage event location as SG
 * and then invoke seasonalGarden().
 * Do nothing if other location.
 * Find progress by user variable.
 * By progress checkThenArm setuped trap.
 */
function zugzwangTower() {
  const loc = getCurrentLocation();
  if (loc.indexOf('Seasonal Garden') > -1) {
    setStorage('eventLocation', 'SG');
    seasonalGarden();
    return;
  } else if (loc.indexOf("Zugzwang's Tower") < 0) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Gouda Cheese';
  const objDefaultZT = {
    focus: 'MYSTIC',
    order: ['PAWN', 'KNIGHT', 'BISHOP', 'ROOK', 'QUEEN', 'KING', 'CHESSMASTER'],
    weapon: new Array(14).fill(''),
    base: new Array(14).fill(''),
    trinket: new Array(14).fill('None'),
    bait: new Array(14).fill('Gouda')
  };
  const objZT = getStorageToObject('ZTower', objDefaultZT);
  objZT.focus = objZT.focus.toUpperCase();
  const nProgressMystic = parseInt(
    getPageVariable('user.viewing_atts.zzt_mage_progress')
  );
  const nProgressTechnic = parseInt(
    getPageVariable('user.viewing_atts.zzt_tech_progress')
  );
  if (Number.isNaN(nProgressMystic) || Number.isNaN(nProgressTechnic)) return;

  const strUnlockMystic = getZTUnlockedMouse(nProgressMystic);
  const strUnlockTechnic = getZTUnlockedMouse(nProgressTechnic);
  if (strUnlockMystic === '' || strUnlockTechnic === '') return;
  let nIndex = -1;
  console.plog(
    capitalizeFirstLetter(objZT.focus),
    'Progress Mystic:',
    nProgressMystic,
    'Unlock Mystic:',
    strUnlockMystic,
    'Progress Technic:',
    nProgressTechnic,
    'Unlock Technic:',
    strUnlockTechnic
  );
  if (objZT.focus.indexOf('MYSTIC') === 0) {
    // Mystic side first
    if (strUnlockMystic == 'CHESSMASTER' && objZT.focus.indexOf('=>') > -1) {
      // is double run?
      nIndex = objZT.order.indexOf(strUnlockTechnic);
      if (nIndex > -1) nIndex += 7;
    } else {
      // single run
      nIndex = objZT.order.indexOf(strUnlockMystic);
    }
  } else {
    // Technic side first
    if (strUnlockTechnic == 'CHESSMASTER' && objZT.focus.indexOf('=>') > -1) {
      // is double run?
      nIndex = objZT.order.indexOf(strUnlockMystic);
      if (nIndex > -1) nIndex += 7;
    } else {
      // single run
      nIndex = objZT.order.indexOf(strUnlockTechnic);
    }
  }

  if (nIndex == -1) return;

  if (objZT.weapon[nIndex] == 'MPP/TPP') {
    if (objZT.focus.indexOf('MYSTIC') === 0)
      objZT.weapon[nIndex] =
        nIndex >= 7 ? 'Technic Pawn Pincher' : 'Mystic Pawn Pincher';
    else
      objZT.weapon[nIndex] =
        nIndex >= 7 ? 'Mystic Pawn Pincher' : 'Technic Pawn Pincher';
  } else if (objZT.weapon[nIndex] == 'BPT/OAT') {
    if (objZT.focus.indexOf('MYSTIC') === 0)
      objZT.weapon[nIndex] = nIndex >= 7 ? 'Obvious Ambush' : 'Blackstone Pass';
    else
      objZT.weapon[nIndex] = nIndex >= 7 ? 'Blackstone Pass' : 'Obvious Ambush';
  }

  for (let prop in objZT) {
    if (
      objZT.hasOwnProperty(prop) &&
      (prop == 'weapon' ||
        prop == 'base' ||
        prop == 'trinket' ||
        prop == 'bait')
    ) {
      if (objZT[prop][nIndex] == 'None') disarmTrap(prop);
      else
        checkThenArm(
          armPriority.best,
          prop,
          parseTrapName(objZT[prop][nIndex])
        );
    }
  }
}

function getZTUnlockedMouse(nProgress) {
  let strUnlock = '';
  if (nProgress <= 7) strUnlock = 'PAWN';
  else if (nProgress <= 9) strUnlock = 'KNIGHT';
  else if (nProgress <= 11) strUnlock = 'BISHOP';
  else if (nProgress <= 13) strUnlock = 'ROOK';
  else if (nProgress <= 14) strUnlock = 'QUEEN';
  else if (nProgress <= 15) strUnlock = 'KING';
  else if (nProgress <= 16) strUnlock = 'CHESSMASTER';
  return strUnlock;
}
/* End V2 ZTower */

function balackCoveJOD() {
  const curLoc = getEnvironmentType();
  const isJOD = curLoc === 'jungle_of_dread';
  const isBC = curLoc === 'balacks_cove';
  if (!isJOD && !isBC) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Vanilla Stilton Cheese';
  const defaultSettings = {
    isBalackHunt: false,
    isAutoBack: false,
    order: ['JOD', 'LOW', 'MID', 'HIGH'],
    weapon: new Array(4).fill(''),
    base: new Array(4).fill(''),
    trinket: new Array(4).fill(''),
    bait: new Array(4).fill('')
  };
  const settings = getStorageToObject('BC_JOD', defaultSettings);
  let nIndex = -1;
  if (isJOD) nIndex = 0;
  else {
    let i = 0;
    let tides = {
      arrTide: [
        'Low Rising',
        'Mid Rising',
        'High Rising',
        'High Ebbing',
        'Mid Ebbing',
        'Low Ebbing'
      ],
      arrLength: [24, 3, 1, 1, 3, 24],
      arrAll: []
    };
    let nTimeStamp = Math.floor(Date.now() / 1000) + g_nTimeOffset * 1000;
    let nFirstTideTimeStamp = 1294708860;
    let nTideLength = 1200; // 20min
    for (i = 0; i < tides.arrTide.length; i++) {
      tides.arrAll = tides.arrAll.concat(
        new Array(tides.arrLength[i]).fill(tides.arrTide[i])
      );
    }
    let nTideTotalLength = sumData(tides.arrLength);
    let nDiff = nTimeStamp - nFirstTideTimeStamp;
    let nIndexCurrentTide = Math.floor(nDiff / nTideLength) % nTideTotalLength;
    let tideNameCurrent = tides.arrAll[nIndexCurrentTide];
    let tideNameNext;
    if (tideNameCurrent.indexOf('Low') > -1) tideNameNext = 'Mid Rising';
    else if (tideNameCurrent.indexOf('High') > -1) tideNameNext = 'Mid Ebbing';
    else if (tideNameCurrent == 'Mid Rising') tideNameNext = 'High Rising';
    else if (tideNameCurrent == 'Mid Ebbing') tideNameNext = 'Low Ebbing';

    let nTideDist =
      tides.arrAll.indexOf(tideNameNext) + nTideTotalLength - nIndexCurrentTide;
    nTideDist = nTideDist % nTideTotalLength;
    let nNextTideTime = nTideDist * nTideLength - (nDiff % nTideLength);
    let strTempCurrent = tideNameCurrent.toUpperCase().split(' ')[0];
    let strTempNext = tideNameNext.toUpperCase().split(' ')[0];
    nIndex = settings.order.indexOf(strTempCurrent);
    if (nNextTideTime <= nextActiveTime && strTempNext != strTempCurrent)
      // total seconds left to next tide less than next active time
      nIndex = settings.order.indexOf(strTempNext);
    console.plog(
      'Current Tide:',
      tides.arrAll[nIndexCurrentTide],
      'Index:',
      nIndex,
      'Next Tide:',
      tideNameNext,
      'In',
      timeFormat(nNextTideTime)
    );
    if (nIndex < 0) return;
  }
  if (nIndex === 2 && settings.isBalackHunt) nIndex = 4;
  if (isJOD)
    if (settings.isAutoBack) {
      travel('balacks_cove');
      return;
    } else armJodBait(settings.bait[nIndex]);
  else checkThenArm(null, 'bait', parseTrapName(settings.bait[nIndex]));
  checkThenArm(null, 'weapon', parseTrapName(settings.weapon[nIndex]));
  checkThenArm(null, 'base', parseTrapName(settings.base[nIndex]));
  checkThenArm(null, 'trinket', parseTrapName(settings.trinket[nIndex]));
}
function armJodBait(bait) {
  logging('armJodBait');
  if (getEnvironmentType() !== 'jungle_of_dread') return;
  const armedBaitId = getBaitItemId();
  const ce = 'Creamy Havarti';
  const cu = 'Crunchy Havarti';
  const mg = 'Magical Havarti';
  const pg = 'Pungent Havarti';
  const sp = 'Spicy Havarti';
  const sw = 'Sweet Havarti';
  // Creamy Havarti: 83
  if (armedBaitId === 83)
    checkThenArm('best', 'bait', [cu, mg, pg, sp, sw, ce, bait]);
  // Crunchy Havarti: 85
  else if (armedBaitId === 85)
    checkThenArm('best', 'bait', [mg, pg, sp, sw, ce, cu, bait]);
  // Magical Havarti: 102
  else if (armedBaitId === 102)
    checkThenArm('best', 'bait', [pg, sp, sw, ce, cu, mg, bait]);
  // Pungent Havarti: 107
  else if (armedBaitId === 107)
    checkThenArm('best', 'bait', [sp, sw, ce, cu, mg, pg, bait]);
  // Spicy Havarti: 113
  else if (armedBaitId === 113)
    checkThenArm('best', 'bait', [sw, ce, cu, mg, pg, sp, bait]);
  // Sweet Havarti: 116
  else if (armedBaitId === 116)
    checkThenArm('best', 'bait', [ce, cu, mg, pg, sp, sw, bait]);
  else checkThenArm(null, 'bait', bait);
}
function forbiddenGroveAR() {
  const environmentType = getEnvironmentType();
  const isFG = environmentType.indexOf('forbidden_grove') > -1;
  const isAR = environmentType.indexOf('acolyte_realm') > -1;
  if (!(isFG || isAR)) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Ancient Cheese';
  const huntingPlans = [
    'FG',
    'AR',
    'CHRONO',
    'ACOLYTE',
    'ACOLYTE_AR',
    'CHRONO_AR'
  ];
  const defaultSetupFGAR = {
    huntingPlan: 'ACOLYTE_AR',
    bait: [
      'Ancient Cheese,Radioactive Blue Cheese',
      'Ancient Cheese',
      'Runic Cheese',
      'Runic Cheese'
    ],
    weapon: [
      'best.weapon.arcane',
      'best.weapon.arcane',
      'best.weapon.forgotten',
      'best.weapon.forgotten'
    ],
    base: [
      'best.base.combo',
      'best.base.combo',
      'best.base.combo',
      'best.base.combo'
    ],
    trinket: new Array(4).fill('')
  };
  const settings = getStorageToObject('FG_AR', defaultSetupFGAR);
  if (isFG) {
    const quest = user.quests.QuestForbiddenGrove;
    const progress = quest.progress;
    if (progress < 3) settings.bait[0] = 'Radioactive Blue Cheese';
  }
  const armedBait = getBaitName();
  const setupOrder = ['FG', 'AR', 'CHRONO', 'ACOLYTE'];
  const setup = settings.huntingPlan.split('_');
  let nIndex = -1;
  if (isFG) {
    nIndex = 0;
  } else {
    nIndex = setupOrder.indexOf(setup[0]);
    // Runic用完, arm defaultBait後會再跑一次 eventLocationCheck.
    if (armedBait.indexOf('Ancient') === 0) {
      nIndex = setupOrder.indexOf('AR');
    }
    // 如果需要檢查捕獲
    if (setup[1]) {
      const caughtMouses = findCaughtMouseJournal();
      const dataMouseType = setup[0].toLowerCase();
      for (let i = 0; i < caughtMouses.length; i++) {
        const caughtMouse = caughtMouses[i];
        if (caughtMouse.indexOf(dataMouseType) > -1) {
          nIndex = setupOrder.indexOf(setup[1]);
          break;
        }
      }
    }
  }
  checkThenArm(
    armPriority.any,
    TrapType.bait,
    parseTrapName(settings.bait[nIndex])
  );
  checkThenArm(
    armPriority.best,
    TrapType.weapon,
    parseTrapName(settings.weapon[nIndex])
  );
  checkThenArm(
    armPriority.best,
    TrapType.base,
    parseTrapName(settings.base[nIndex])
  );
  checkThenArm(
    armPriority.best,
    TrapType.trinket,
    parseTrapName(settings.trinket[nIndex])
  );
}

function SunkenCity(isAggro) {
  if (getCurrentLocation().indexOf('Sunken City') < 0) return;

  let zone = document.getElementsByClassName('zoneName')[0].innerText;
  console.plog('Current Zone:', zone);
  let currentZone = GetSunkenCityZone(zone);
  checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
  if (currentZone == objSCZone.ZONE_NOT_DIVE) {
    checkThenArm('best', 'base', objBestTrap.base.luck);
    checkThenArm(null, 'trinket', 'Oxygen Burst');
    checkThenArm('best', 'bait', ['Fishy Fromage', 'Gouda']);
    return;
  }

  checkThenArm('best', 'base', bestSCBase);
  let distance = parseInt(
    getPageVariable('user.quests.QuestSunkenCity.distance')
  );
  console.plog('Dive Distance(m):', distance);
  let charmArmed = getPageVariable('user.trinket_name');
  let charmElement = document.getElementsByClassName('charm');
  let isEACArmed = charmArmed.indexOf('Empowered Anchor') > -1;
  let isWJCArmed = charmArmed.indexOf('Water Jet') > -1;
  if (
    currentZone == objSCZone.ZONE_OXYGEN ||
    currentZone == objSCZone.ZONE_TREASURE ||
    currentZone == objSCZone.ZONE_BONUS
  ) {
    if (isAggro && currentZone == objSCZone.ZONE_TREASURE)
      checkThenArm('best', 'trinket', ['Golden Anchor', 'Empowered Anchor']);
    else {
      // arm Empowered Anchor Charm
      if (!isEACArmed) {
        if (parseInt(charmElement[0].innerText) > 0)
          fireEvent(charmElement[0], 'click');
      }
    }

    checkThenArm(null, 'bait', 'SUPER');
  } else if (
    currentZone == objSCZone.ZONE_DANGER_PP ||
    currentZone == objSCZone.ZONE_DANGER_PP_LOTA
  ) {
    if (!isAggro) {
      // arm Empowered Anchor Charm
      if (!isEACArmed && !isAggro) {
        if (parseInt(charmElement[0].innerText) > 0)
          fireEvent(charmElement[0], 'click');
      }
    } else
      checkThenArm('best', 'trinket', ['Spiked Anchor', 'Empowered Anchor']);
    checkThenArm(null, 'bait', 'Gouda');
  } else if (currentZone == objSCZone.ZONE_DEFAULT && isAggro) {
    let depth = parseInt(
      getPageVariable('user.quests.QuestSunkenCity.zones[1].length')
    );
    if (depth >= 500) {
      let nextZoneName = getPageVariable(
        'user.quests.QuestSunkenCity.zones[2].name'
      );
      let nextZoneLeft = parseInt(
        getPageVariable('user.quests.QuestSunkenCity.zones[2].left')
      );
      let nextZone = GetSunkenCityZone(nextZoneName);
      let distanceToNextZone = parseInt((nextZoneLeft - 80) / 0.6);
      console.plog('Distance to next zone(m):', distanceToNextZone);
      if (
        distanceToNextZone >= 480 ||
        (distanceToNextZone >= 230 && nextZone == objSCZone.ZONE_DEFAULT)
      ) {
        // arm Water Jet Charm
        checkThenArm('best', 'trinket', ['Smart Water Jet', 'Water Jet']);
      } else DisarmSCSpecialCharm(charmArmed);
    } else DisarmSCSpecialCharm(charmArmed);

    checkThenArm(null, 'bait', 'Gouda');
  } else {
    DisarmSCSpecialCharm(charmArmed);
    checkThenArm(null, 'bait', 'Gouda');
  }
}

function SCCustom() {
  if (getCurrentLocation().indexOf('Sunken City') < 0) return;

  let objDefaultSCCustom = {
    zone: [
      'ZONE_NOT_DIVE',
      'ZONE_DEFAULT',
      'ZONE_CORAL',
      'ZONE_SCALE',
      'ZONE_BARNACLE',
      'ZONE_TREASURE',
      'ZONE_DANGER',
      'ZONE_DANGER_PP',
      'ZONE_OXYGEN',
      'ZONE_BONUS',
      'ZONE_DANGER_PP_LOTA'
    ],
    zoneID: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isHunt: new Array(11).fill(true),
    bait: new Array(11).fill('Gouda'),
    trinket: new Array(11).fill('None'),
    useSmartJet: false
  };
  let objSCCustom = getStorageToObject('SCCustom', objDefaultSCCustom);
  let zone = document.getElementsByClassName('zoneName')[0].innerText;
  let zoneID = GetSunkenCityZone(zone);
  checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
  if (zoneID == objSCZone.ZONE_NOT_DIVE) {
    checkThenArm('best', 'base', objBestTrap.base.luck);
    checkThenArm(null, 'trinket', objSCCustom.trinket[zoneID]);
    checkThenArm(null, 'bait', objSCCustom.bait[zoneID]);
    return;
  }
  let distance = parseInt(
    getPageVariable('user.quests.QuestSunkenCity.distance')
  );
  console.plog('Current Zone:', zone, 'ID', zoneID, 'at meter', distance);
  checkThenArm('best', 'base', bestSCBase);
  let canJet = false;
  if (!objSCCustom.isHunt[zoneID]) {
    let distanceToNextZone = [];
    let isNextZoneInHuntZone = [];
    let arrZone = JSON.parse(
      getPageVariable('JSON.stringify(user.quests.QuestSunkenCity.zones)')
    );
    let nActiveZone = parseInt(
      getPageVariable('user.quests.QuestSunkenCity.active_zone')
    );
    let nStartZoneIndex = 0;
    let i, nIndex;
    for (i = 0; i < arrZone.length; i++) {
      if (arrZone[i].num == nActiveZone) {
        nStartZoneIndex = i + 1;
        break;
      }
    }
    console.plog('Start Zone Index:', nStartZoneIndex);
    for (i = nStartZoneIndex; i < arrZone.length; i++) {
      nIndex = i - nStartZoneIndex;
      distanceToNextZone[nIndex] = parseInt((arrZone[i].left - 80) / 0.6);
      isNextZoneInHuntZone[nIndex] =
        objSCCustom.isHunt[GetSunkenCityZone(arrZone[i].name)];
      console.plog(
        'Next Zone:',
        arrZone[i].name,
        'in meter',
        distanceToNextZone[nIndex],
        'Is In Hunt Zone:',
        isNextZoneInHuntZone[nIndex]
      );
    }
    if (distanceToNextZone.length === 0) {
      distanceToNextZone[0] = 0;
      isNextZoneInHuntZone[0] = true;
    }

    // jet through
    let charmElement = document.getElementsByClassName('charm');
    let charmArmed = getPageVariable('user.trinket_name');
    let isWJCArmed = charmArmed.indexOf('Water Jet') > -1;
    if (
      distanceToNextZone[0] >= 480 ||
      (distanceToNextZone[1] >= 480 && !isNextZoneInHuntZone[0]) ||
      !(isNextZoneInHuntZone[0] || isNextZoneInHuntZone[1])
    ) {
      // arm Water Jet Charm
      if (objSCCustom.useSmartJet)
        checkThenArm('best', 'trinket', [
          'Smart Water Jet',
          'Water Jet',
          objSCCustom.trinket[zoneID]
        ]);
      else
        checkThenArm('best', 'trinket', [
          'Water Jet',
          objSCCustom.trinket[zoneID]
        ]);
    } else checkThenArm(null, 'trinket', objSCCustom.trinket[zoneID]);
  } else checkThenArm(null, 'trinket', objSCCustom.trinket[zoneID]);
  checkThenArm(null, 'bait', objSCCustom.bait[zoneID]);
}

function DisarmSCSpecialCharm(charmArmedName) {
  let specialCharms = [
    'Golden Anchor',
    'Spiked Anchor',
    'Ultimate Anchor',
    'Oxygen Burst',
    'Empowered Anchor',
    'Water Jet'
  ];
  for (let i = 0; i < specialCharms.length; i++) {
    if (charmArmedName.indexOf(specialCharms[i]) > -1) {
      disarmTrap('trinket');
      break;
    }
  }
}

function GetSunkenCityZone(zoneName) {
  let returnZone = 0;
  switch (zoneName) {
    case 'Sand Dollar Sea Bar':
    case 'Pearl Patch':
    case 'Sunken Treasure':
      returnZone = objSCZone.ZONE_TREASURE;
      break;
    case 'Feeding Grounds':
    case 'Carnivore Cove':
      returnZone = objSCZone.ZONE_DANGER;
      break;
    case 'Monster Trench':
      returnZone = objSCZone.ZONE_DANGER_PP;
      break;
    case 'Lair of the Ancients':
      returnZone = objSCZone.ZONE_DANGER_PP_LOTA;
      break;
    case 'Deep Oxygen Stream':
    case 'Oxygen Stream':
      returnZone = objSCZone.ZONE_OXYGEN;
      break;
    case 'Magma Flow':
      returnZone = objSCZone.ZONE_BONUS;
      break;
    case 'Coral Reef':
    case 'Coral Garden':
    case 'Coral Castle':
      returnZone = objSCZone.ZONE_CORAL;
      break;
    case 'School of Mice':
    case 'Mermouse Den':
    case 'Lost Ruins':
      returnZone = objSCZone.ZONE_SCALE;
      break;
    case 'Rocky Outcrop':
    case 'Shipwreck':
    case 'Haunted Shipwreck':
      returnZone = objSCZone.ZONE_BARNACLE;
      break;
    case 'Shallow Shoals':
    case 'Sea Floor':
    case 'Murky Depths':
      returnZone = objSCZone.ZONE_DEFAULT;
      break;
    default:
      returnZone = objSCZone.ZONE_NOT_DIVE;
      break;
  }
  return returnZone;
}

function labyZokor() {
  if (getCurrentLocation().indexOf('Labyrinth') < 0) zokor();
  else labyrinth();
}

function tempLabyrinth() {
  if (!$('a.labyrinthHUD-door').hasClass('disabled')) {
    disarmTrap('bait');
  }
}

const LabyrinthSpecificCharms = [
  'Compass Magnet Charm',
  'Glowing Gourd Charm',
  'Lantern Oil Charm',
  'Super Lantern Oil Charm',
  'Nightshade Farming Charm'
];

function labyrinthAuto() {
  logging('RUN labyrinth()');
  if (getEnvironmentType() != 'labyrinth') {
    logging('Not in Labyrinth');
    return;
  }
  // get game status
  const questLabyrinth = user.quests.QuestLabyrinth;
  const labyStatus = questLabyrinth.status;
  const isAtEntrance = labyStatus == 'intersection entrance';
  const isAtHallway = labyStatus == 'hallway';
  const isAtIntersection = labyStatus == 'intersection';
  const isAtExit = labyStatus == 'exit';
  console.plog(
    'Entrance:',
    isAtEntrance,
    'Intersection:',
    isAtIntersection,
    'Exit:',
    isAtExit
  );
  if (isAtEntrance || isAtIntersection) {
    labyrinthChooseDoor(questLabyrinth);
    return;
  }
  if (isAtHallway) {
    labyrinthHallwayHunting(questLabyrinth);
    return;
  }
  if (isAtExit) {
    labyrinthChooseExit(questLabyrinth);
  }
}

function labyrinthChooseDoor(questLabyrinth) {
  console.log('Choose door in labyrinth');
  if (!setupLaby.openFocusDoor) return;
}

function labyrinthHallwayHunting(questLabyrinth) {
  console.log('Hunting in hallway');
}

const labyrinthChooseExitMaxRetries = 3;
let labyrinthChooseExitRetries = 0;
function labyrinthChooseExit(setupLaby) {
  console.plog(
    'Choose exit in labyrinth, retries:',
    labyrinthChooseExitRetries
  );
  const baitName = parseTrapName(setupLaby.baitIntersection);
  const weaponName = objBestTrap.weapon.forgotten;
  const baseName = objBestTrap.base.combo;
  const charmName = parseTrapName(setupLaby.charmIntersection);
  if (labyrinthChooseExitRetries > labyrinthChooseExitMaxRetries) {
    armAllTraps(baitName, weaponName, baseName, charmName);
    return;
  }
  // Not open exit, arm terminal trap and stop.
  if (!setupLaby.autoOpenExit) {
    armAllTraps(baitName, weaponName, baseName, charmName);
    return;
  }
  const focusType = setupLaby.districtFocus;
  const focusTypeCode = objCodename[focusType];
  const doorsExit = document.querySelectorAll('a.labyrinthHUD-exit');
  console.plog(focusType, focusTypeCode, doorsExit);
  for (let i = 0; i < doorsExit.length; i++) {
    const doorExit = doorsExit[i];
    const choice = $(doorExit).data('choice');
    if (choice.charAt(0) === focusTypeCode) {
      console.plog(
        'Got wanted exit data-choice:',
        choice,
        'of',
        doorExit,
        'from',
        doorsExit
      );
      hg.views.HeadsUpDisplayLabyrinthView.labyrinthAjax(null, {
        action: 'make_intersection_choice',
        choice: choice
      });
      labyrinthChooseExitRetries++;
      setTimeout(() => {
        labyZokor();
      }, 5000);
      return;
    }
  }
  console.plog('Expected exit type not found, arm terminal trap and stop.');
  armAllTraps(baitName, weaponName, baseName, charmName);
}

function labyrinthChooseExitV1(setupLaby) {
  console.plog('Choose exit in labyrinth');
  const baitName = parseTrapName(setupLaby.baitIntersection);
  const weaponName = objBestTrap.weapon.forgotten;
  const baseName = objBestTrap.base.combo;
  const charmName = parseTrapName(setupLaby.charmIntersection);
  // Not open exit, arm terminal trap and stop.
  if (!setupLaby.autoOpenExit) {
    armAllTraps(baitName, weaponName, baseName, charmName);
    return;
  }
  const exitTypes = ['FEALTY', 'TECH', 'SCHOLAR', 'TREASURY', 'FARMING'];
  // document.querySelector('.labyrinthHUD-exitContainer').getElementsByClassName('labyrinthHUD-exit');
  const focusType = setupLaby.districtFocus;
  const exitIndex = exitTypes.indexOf(focusType);
  if (exitIndex < 0) {
    console.plog('Unknown exit type, arm terminal trap and stop.');
    armAllTraps(weaponName, baseName, charmName, baitName);
    return;
  }
  const doorsExit = document.getElementsByClassName('labyrinthHUD-exit');
  const doorExit = $(doorsExit[exitIndex]);
  const choice = doorExit.data('choice');
  if (choice.trim() == '') return;
  console.plog(
    'Got wanted exit data-choice:',
    choice,
    ', choose it from',
    doorsExit
  );
  hg.views.HeadsUpDisplayLabyrinthView.labyrinthAjax(null, {
    action: 'make_intersection_choice',
    choice: choice
  });
  setTimeout(() => {
    labyZokor();
  }, 5000);
}
/**
 * Arm all traps.
 *
 * @param {*} baitName
 * @param {*} weaponName
 * @param {*} baseName
 * @param {*} charmName
 */
function armAllTraps(baitName, weaponName, baseName, charmName) {
  checkThenArm(armPriority.best, TrapType.bait, parseTrapName(baitName));
  checkThenArm(armPriority.best, TrapType.weapon, parseTrapName(weaponName));
  checkThenArm(armPriority.best, TrapType.base, parseTrapName(baseName));
  checkThenArm(armPriority.best, TrapType.trinket, parseTrapName(charmName));
}
/**
 * auto lantern in focus district when focus clues less then specified except farming
 * @param {Object} setupLaby
 * @param {Boolean} isFocusDistrict
 * @param {Boolean} isFarming
 */
function labyrinthAutoLantern(setupLaby, isFocusDistrict, isFarming) {
  // focus district clue quantity
  const quest = user.quests.QuestLabyrinth;
  let focusClueQuantity = -1;
  for (let i = 0; i < quest.all_clues.length; i++) {
    const clue = quest.all_clues[i];
    if (clue.name.toUpperCase().indexOf(setupLaby.districtFocus) > -1) {
      focusClueQuantity = clue.quantity;
      break;
    }
  }
  if (focusClueQuantity == -1) {
    let msg = 'Focus district clue quantity not found!!';
    displayTimer(msg, msg, msg);
    return;
  }
  // if (objLaby.autoLantern && isFocusDistrict && !isFarming) {
  if (setupLaby.autoLantern && isFocusDistrict) {
    // turn on lantern when less than and turn off lantern when more than
    labyrinthLitLantern(focusClueQuantity < setupLaby.focusClues);
    /* turn on lantern when less than but won't turn off lantern when more than
      if (
        focusClueQuantity < objLaby.focusClues &&
        quest.lantern_status !== 'active'
      )
        hg.views.HeadsUpDisplayLabyrinthView.labyrinthToggleLantern(); */
  }
}

function labyrinthLitLantern(isLit) {
  const quest = user.quests.QuestLabyrinth;
  const items = quest.items;
  if (MyUtils.parseQuantity(items.labyrinth_lantern_fuel) < 1) return;
  if ((quest.lantern_status === 'active') !== isLit)
    hg.views.HeadsUpDisplayLabyrinthView.labyrinthToggleLantern();
}

function labyrinth() {
  logging('RUN labyrinth()');
  if (getCurrentLocation().indexOf('Labyrinth') < 0) {
    logging('Not in labyrinth.');
    return;
  }
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Gouda Cheese';
  // get game status
  const charmArmed = getCharmName();
  const quest = user.quests.QuestLabyrinth;
  const allClues = {};
  const clues = quest.all_clues;
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];
    allClues[clue.name.toUpperCase()] = clue.quantity;
  }
  const labyStatus = quest.status;
  const isAtEntrance = labyStatus == 'intersection entrance';
  const isAtHallway = labyStatus == 'hallway';
  let isAtIntersection = labyStatus == 'intersection';
  const isAtExit = labyStatus == 'exit';
  console.plog(
    'Entrance:',
    isAtEntrance,
    'Intersection:',
    isAtIntersection,
    'Exit:',
    isAtExit,
    'All clues:',
    allClues
  );
  const lastHunt =
    document.getElementsByClassName('labyrinthHUD-hallway-tile locked').length +
    1;
  const totalClue = quest.total_clues || 0;
  /* const totalClue = parseInt(
    document.getElementsByClassName('labyrinthHUD-clueBar-totalClues')[0]
      .innerText
  ); */
  // load setting
  const objLaby = getStorageToObject('Labyrinth', objDefaultLaby);
  console.plog(
    'Original focus type:',
    objLaby.districtFocus,
    'chooseOtherDoors:',
    objLaby.chooseOtherDoors,
    'typeOtherDoors:',
    objLaby.typeOtherDoors
  );
  const focusTypesQueue = objLaby.focusTypesQueue;
  if (focusTypesQueue.length > 0) {
    const toFocus = focusTypesQueue[0];
    if (objLaby.plansIgnoreQueue.indexOf(objLaby.districtFocus) < 0)
      objLaby.districtFocus = toFocus;
  }
  if (objLaby.focusTypesManualDoor.indexOf(objLaby.districtFocus) > -1)
    objLaby.chooseOtherDoors = false;
  if (totalClue > 85) objLaby.typeOtherDoors = 'SHORTEST_FEWEST';
  console.plog(
    'Modified focus type:',
    objLaby.districtFocus,
    'chooseOtherDoors:',
    objLaby.chooseOtherDoors,
    'total clues:',
    totalClue,
    'typeOtherDoors:',
    objLaby.typeOtherDoors
  );
  let baitName = parseTrapName(objLaby.baitFocus);
  let weaponName = objBestTrap.weapon.forgotten;
  let baseName = objBestTrap.base.labyrinth;
  let charmName = parseTrapName(objLaby.charmFocus);
  // handle base arming.
  if (
    objLaby.armOtherBase != 'false' &&
    charmArmed.indexOf('Compass Magnet') === 0
  ) {
    baseName = objLaby.armOtherBase;
  }
  // TODO auto retreat
  // Disarm Compass Magnet Charm by Dead End Clue quantity
  if (objLaby.disarmCompass && charmArmed.indexOf('Compass Magnet') > -1) {
    for (let i = 0; i < quest.all_clues.length; i++) {
      if (quest.all_clues[i].name.toUpperCase().indexOf('DEAD') > -1) {
        if (quest.all_clues[i].quantity <= objLaby.nDeadEndClue)
          charmName = 'None'; // disarmTrap('trinket');
        break;
      }
    }
  }
  // handle Hallway hunting
  if (isAtHallway) {
    let strCurHallwayFullname = document
      .getElementsByClassName('labyrinthHUD-hallwayName')[0]
      .textContent.toUpperCase();
    let isFocusDistrict =
      strCurHallwayFullname.indexOf(objLaby.districtFocus) > -1 ||
      strCurHallwayFullname.indexOf(objLaby.minorFocus) > -1;
    let isFarming =
      strCurHallwayFullname.indexOf('FARMING') > -1 && isFocusDistrict;
    let isTreasury =
      strCurHallwayFullname.indexOf('TREASURY') > -1 && isFocusDistrict;
    // if (objLaby.districtFocus != 'None') {
    if (!isFocusDistrict) {
      weaponName = parseTrapName(objLaby.weaponNonFocus);
      baseName = parseTrapName(objLaby.baseNonFocus);
      baitName = parseTrapName(objLaby.baitNonFocus);
      charmName = parseTrapName(objLaby.charmNonFocus);
    }
    // }
    // handle weapon type of farming
    if (isFarming) {
      weaponName = parseTrapName(objLaby.weaponFarming);
      charmName = parseTrapName(objLaby.charmFarming);
      baitName = parseTrapName(objLaby.baitFarming);
    }
    // handle weapon type of treasury
    if (isTreasury) {
      weaponName = parseTrapName(objLaby.weaponTreasury);
      charmName = parseTrapName(objLaby.charmTreasury);
      baitName = parseTrapName(objLaby.baitTreasury);
    }
    // security disarm - hallway中途 clues會破百的話,要不要 disarm bait.
    if (objLaby.travelTo && objLaby.travelTo != '') {
      let strCurHallwayTier = strCurHallwayFullname.split(' ')[1];
      let maxCluePerHunt = 0;
      if (strCurHallwayTier == 'PLAIN') maxCluePerHunt = 1;
      else if (strCurHallwayTier == 'SUPERIOR') maxCluePerHunt = 2;
      else maxCluePerHunt = 3;
      let classLantern = document.getElementsByClassName(
        'labyrinthHUD-toggleLantern mousehuntTooltipParent'
      );
      let bLanternActive = true;
      if (classLantern.length < 1)
        bLanternActive = quest.lantern_status == 'active';
      else
        bLanternActive =
          classLantern[0].getAttribute('class').indexOf('inactive') < 0;
      if (bLanternActive) maxCluePerHunt++;
      if (charmArmed.indexOf('Lantern Oil') > -1) maxCluePerHunt++;
      // Super Lantern Oil Charm add 2 clues, 1 more than Lantern Oil
      if (charmArmed.indexOf('Super Lantern Oil') > -1) maxCluePerHunt++;
      console.plog(
        'Hallway Last Hunt :',
        lastHunt,
        'Total Clues:',
        totalClue,
        'Max Clue Per Hunt:',
        maxCluePerHunt
      );
      if (
        // lastHunt <= objLaby.lastHunt &&
        // totalClue >= 100 - maxCluePerHunt * lastHunt
        totalClue >=
        100 - maxCluePerHunt * objLaby.lastHunt
      ) {
        pauseByTraveling(objLaby.travelTo);
        return;
        // disarmTrap('bait');
      }
    }
    // auto lantern except farming
    labyrinthAutoLantern(objLaby, isFocusDistrict, isFarming);
    armAllTraps(weaponName, baseName, charmName, baitName);
    return;
  }
  /**
   * Arm all traps.
   *
   * @param {*} weaponName
   * @param {*} baseName
   * @param {*} charmName
   * @param {*} baitName
   */
  function armAllTraps(weaponName, baseName, charmName, baitName) {
    checkThenArm(armPriority.best, TrapType.weapon, weaponName);
    checkThenArm(armPriority.best, TrapType.base, baseName);
    checkThenArm(armPriority.best, TrapType.trinket, charmName);
    checkThenArm(armPriority.best, TrapType.bait, baitName);
  }
  // TODO objLaby.districtFocus.indexOf('None') > -1

  // handle entrance/exit hunting
  // entrance/exit 時直接 Brie並且不使用 charm. entrance/exit的老鼠沒價值
  /*  if (isAtEntrance || isAtExit || objLaby.districtFocus.indexOf('None') > -1) {
    checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
    checkThenArm(null, 'bait', 'Gouda');
    disarmTrap('trinket');
    return;
  } */

  // 在 entrance/exit/intersection時,如果沒能進下一個門,應該使用下列 trap
  if (isAtEntrance || isAtExit || isAtIntersection) {
    baseName = objBestTrap.base.combo;
    baitName = parseTrapName(objLaby.baitIntersection);
    charmName = parseTrapName(objLaby.charmIntersection);
  }
  if (isAtExit) {
    labyrinthChooseExit(objLaby);
    return;
  }
  // 這個 class在 entrance也適用
  let doorsIntersect = document.getElementsByClassName('labyrinthHUD-door');
  let objDoors = {
    name: [],
    length: [],
    tier: [],
    clue: [],
    code: [],
    priorities: [],
    debug: []
  };
  let temp = '';
  for (let i = 0; i < doorsIntersect.length; i++) {
    // TODO 有沒有三道門但其中一兩道門是 mystery的情況?還是如果只給兩道門,就是兩道非 mystery的門?
    // 任一道門是 mystery狀態時代表不在 intersection.不處理選門
    if (doorsIntersect[i].getAttribute('class').indexOf('mystery') > -1) {
      isAtIntersection = false;
      armAllTraps(weaponName, baseName, charmName, baitName);
      return;
    }
    // 收集門的資訊.broken的門直接 assign固定值
    if (
      doorsIntersect[i].getAttribute('class').indexOf('broken') > -1 ||
      doorsIntersect[i].children.length < 2
    ) {
      objDoors.length.push('LONG');
      objDoors.tier.push('PLAIN');
      objDoors.name.push('BROKEN');
      objDoors.debug.push('LONG PLAIN BROKEN');
      objDoors.code.push('');
      objDoors.clue.push(Number.MAX_SAFE_INTEGER);
      objDoors.priorities.push(Number.MAX_SAFE_INTEGER);
    } else {
      // ex. SHORT PLAIN FARMING
      temp = doorsIntersect[i].children[1].innerText.toUpperCase();
      objDoors.debug.push(temp);
      temp = temp.split(/\s+/); // temp.split(' ');
      objDoors.length.push(temp[0]);
      objDoors.tier.push(temp[1]);
      objDoors.name.push(temp[2]);
      objDoors.code.push(objCodename[temp[0]] + objCodename[temp[1]]);
      objDoors.clue.push(Number.MAX_SAFE_INTEGER);
      objDoors.priorities.push(Number.MAX_SAFE_INTEGER);
    }
    isAtIntersection = true;
  }
  console.plog(objDoors.debug.join(','));

  temp = '';
  let range = '';
  let index = [];
  try {
    // 找出每個門對應的 clue數量
    for (let i = 0; i < quest.all_clues.length; i++) {
      temp = quest.all_clues[i].name.toUpperCase();
      if (temp.indexOf('DEAD') > -1) continue;
      index = getAllIndices(objDoors.name, temp);
      for (let j = 0; j < index.length; j++) {
        objDoors.clue[index[j]] = quest.all_clues[i].quantity;
      }
    }

    index = objDoors.name.indexOf(objLaby.districtFocus);
    // if (index < 0) index = objDoors.name.indexOf(objLaby.minorFocus);
    // 所有門都不是 focus/minorFofus的 district
    if (index < 0) {
      if (objLaby.chooseOtherDoors) {
        // 沒有 focus的門還是選
        console.plog(objDoors);
        // 找出 clue數等於所有 clue最小值的 index
        temp = min(objDoors.clue);
        let objFewestClue = {
          num: temp, // 最小值
          indices: getAllIndices(objDoors.clue, temp), // 哪些 index等於最小值
          count: countArrayElement(temp, objDoors.clue) // 等於最小值的元素數量
        };
        let objShortestLength = {
          type: 'SHORT',
          indices: [],
          count: 0
        };
        if (objDoors.length.indexOf('SHORT') > -1)
          objShortestLength.type = 'SHORT';
        else if (objDoors.length.indexOf('MEDIUM') > -1)
          objShortestLength.type = 'MEDIUM';
        else if (objDoors.length.indexOf('LONG') > -1)
          objShortestLength.type = 'LONG';
        objShortestLength.indices = getAllIndices(
          objDoors.length,
          objShortestLength.type
        );
        objShortestLength.count = objShortestLength.indices.length;
        console.plog(JSON.stringify(objShortestLength));
        console.plog(JSON.stringify(objFewestClue));
        // 沒門可選
        if (
          objShortestLength.indices.length < 1 ||
          objFewestClue.indices.length < 1
        ) {
          // TODO wrong cheese name Glowing Gruyere
          /* checkThenArm(null, 'bait', 'Glowing Guyere');
          disarmTrap('trinket'); */
          logging('No choosable door');
          armAllTraps(weaponName, baseName, 'Swiss Cheese', 'None');
          return;
        }
        // 放最短元素中等於 clue數最小值的 index的 array.
        let arrTemp = [];
        let nMin = Number.MAX_SAFE_INTEGER;
        let nMinIndex = -1;
        if (objLaby.typeOtherDoors.indexOf('SHORTEST') === 0) {
          // SHORTEST_ONLY / SHORTEST_FEWEST
          if (
            objShortestLength.count > 1 &&
            objLaby.typeOtherDoors.indexOf('FEWEST') > -1
          ) {
            // SHORTEST_FEWEST
            for (let i = 0; i < objShortestLength.indices.length; i++) {
              if (objDoors.clue[objShortestLength.indices[i]] < nMin) {
                nMin = objDoors.clue[objShortestLength.indices[i]];
                nMinIndex = objShortestLength.indices[i];
              }
            }
            if (nMinIndex > -1) arrTemp.push(nMinIndex);
          } else arrTemp = objShortestLength.indices; // SHORTEST_ONLY
        } else if (objLaby.typeOtherDoors.indexOf('FEWEST') === 0) {
          // FEWEST_ONLY / FEWEST_SHORTEST
          if (
            objFewestClue.count > 1 &&
            objLaby.typeOtherDoors.indexOf('SHORTEST') > -1
          ) {
            // FEWEST_SHORTEST
            let strTemp = '';
            for (let i = 0; i < objFewestClue.indices.length; i++) {
              strTemp = objDoors.length[objFewestClue.indices[i]].toUpperCase();
              if (
                objLength.hasOwnProperty(strTemp) &&
                objLength[strTemp] < nMin
              ) {
                nMin = objLength[strTemp];
                nMinIndex = objFewestClue.indices[i];
              }
            }
            // 到這邊 arrTemp可能只剩一個元素了
            if (nMinIndex > -1) arrTemp.push(nMinIndex);
          } else arrTemp = objFewestClue.indices; // FEWEST_ONLY
        }
        console.plog(arrTemp);
        // 有不是 focus的門可選
        weaponName = parseTrapName(objLaby.weaponNonFocus);
        baseName = parseTrapName(objLaby.baseNonFocus);
        charmName = parseTrapName(objLaby.charmNonFocus);
        baitName = parseTrapName(objLaby.baitNonFocus);
        let chosen = -1;
        // 看看有沒有 minor focus
        if (objLaby.minorFocus != 'None') {
          for (let i = 0; i < arrTemp.length; i++) {
            if (
              objDoors.name[arrTemp[i]].indexOf('BROKEN') < 0 &&
              objDoors.name[arrTemp[i]].indexOf(objLaby.minorFocus) > -1
            ) {
              chosen = arrTemp[i];
              charmName = objLaby.charmFocus;
              baitName = objLaby.baitFocus;
              break;
            }
          }
        }
        // 沒有 minor focus就選第一個不是 BROKEN的
        if (chosen == -1) {
          for (let i = 0; i < arrTemp.length; i++) {
            if (objDoors.name[arrTemp[i]].indexOf('BROKEN') < 0) {
              chosen = arrTemp[i];
              break;
            }
          }
        }
        /* // 選第一個不是 BROKEN的
        for (let i = 0; i < arrTemp.length; i++) {
          if (objDoors.name[arrTemp[i]].indexOf('BROKEN') < 0) {
            chosen = arrTemp[i];
            break;
          }
        } */
        /* 這邊是沒有 focus的門可選區塊,只要不處理 farming跟 treasury即可
        const isFarming =
          objDoors.name[chosen].indexOf('FARMING') > -1 &&
          objLaby.districtFocus.indexOf('FARMING') > -1;
        const isTreasury =
          objDoors.name[chosen].indexOf('TREASURY') > -1 &&
          objLaby.districtFocus.indexOf('TREASURY') > -1;
        if (isFarming) {
          weaponName = parseTrapName(objLaby.weaponFarming);
          charmName = parseTrapName(objLaby.charmFarming);
          baitName = parseTrapName(objLaby.baitFarming);
        }
        if (isTreasury) {
          weaponName = parseTrapName(objLaby.weaponTreasury);
          charmName = parseTrapName(objLaby.charmTreasury);
          baitName = parseTrapName(objLaby.baitTreasury);
        } */
        fireEvent(doorsIntersect[chosen], 'click');
        window.setTimeout(function () {
          fireEvent(
            document.getElementsByClassName('mousehuntActionButton confirm')[0],
            'click'
          );
          window.setTimeout(() => {
            // non-focus district不用 auto lantern
            armAllTraps(weaponName, baseName, charmName, baitName);
          }, 3000);
        }, 1500);
        /* for (let i = 0; i < arrTemp.length; i++) {
          if (objDoors.name[arrTemp[i]].indexOf('BROKEN') < 0) {
            // if (objDoors.name[arrTemp[i]].indexOf('FARMING') > -1) {
            //   if (objLaby.weaponFarming == 'Arcane')
            //     checkThenArm(
            //       'best',
            //       'weapon',
            //       objBestTrap.weapon.arcane.concat(objBestTrap.weapon.forgotten)
            //     );
            //   else checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
            // } else checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
            weaponName = objBestTrap.weapon.forgotten;
            baseName = bestLabyBase.concat(objBestTrap.base.combo);
            charmName = objLaby.charmNonFocus;
            baitName = objLaby.baitNonFocus;
            if (objDoors.name[arrTemp[i]].indexOf('FARMING') > -1) {
              charmName = parseTrapName(objLaby.charmFarming);
              baitName = parseTrapName(objLaby.baitFarming);
              weaponName = parseTrapName(objLaby.weaponFarming);
            }
            fireEvent(doorsIntersect[arrTemp[i]], 'click');
            window.setTimeout(function () {
              fireEvent(
                document.getElementsByClassName(
                  'mousehuntActionButton confirm'
                )[0],
                'click'
              );
              window.setTimeout(() => {
                armTrap(weaponName, baseName, charmName, baitName);
              }, 3000);
            }, 1500);
            break;
          }
        } */
      } else {
        // 沒有 focus的門就不選.既然是選不選門,一定是 entrance/exit/intersection之一
        // 所以 trap一定經過 entrance/exit/intersection的修改了
        /* checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
        checkThenArm(null, 'bait', 'Glowing Guyere');
        disarmTrap('trinket'); */
        armAllTraps(weaponName, baseName, charmName, baitName);
      }
      return;
    } /*  else {
      if (objDoors.clue[index] < 15) range = 'between0and14';
      else if (objDoors.clue[index] < 60) range = 'between15and59';
      else range = 'between60and100';
    } */
    // 有 Focus的門可選
    // 可以設定不開門以便觀察
    if (!objLaby.openFocusDoor) {
      armAllTraps(weaponName, baseName, charmName, baitName);
      return;
    }
    if (objDoors.clue[index] < 15) range = 'between0and14';
    else if (objDoors.clue[index] < 60) range = 'between15and59';
    else range = 'between60and100';
    let arr;
    let arrAll = [];
    for (let i = 0; i < objLaby[range].length; i++) {
      // between0and14: ['lp'],
      // between15and59: ['sp', 'ls'],
      // between60and100: ['sp', 'ss', 'le'],
      // i = 0/1/2 = plain/superior/epic
      arr = [];
      for (let j = 0; j < 3; j++)
        arr.push(j + 1 + (objLaby[range].length - 1 - i) * 3);

      if (objLaby[range][i].indexOf(objCodename.LONG) === 0)
        arrAll = arrAll.concat(arr.reverse());
      else arrAll = arrAll.concat(arr);
    }
    // arrHallwayOrder = ['sp', 'mp', 'lp', 'ss', 'ms', 'ls', 'se', 'me', 'le']
    for (let i = arrAll.length; i < arrHallwayOrder.length; i++)
      arrAll.push(Number.MAX_SAFE_INTEGER);

    for (let i = 0; i < objDoors.code.length; i++) {
      if (objDoors.name[i].indexOf(objLaby.districtFocus) > -1) {
        index = arrHallwayOrder.indexOf(objDoors.code[i]);
        if (index > -1) {
          objDoors.priorities[i] = arrAll[index];
        }
      }
    }
    console.plog(objDoors);

    let sortedDoorPriorities = sortWithIndices(objDoors.priorities, 'ascend');
    fireEvent(doorsIntersect[sortedDoorPriorities.index[0]], 'click');
    window.setTimeout(function () {
      fireEvent(
        document.getElementsByClassName('mousehuntActionButton confirm')[0],
        'click'
      );
      // 有 focus的門可選時用下列 trap
      weaponName = objBestTrap.weapon.forgotten;
      baseName = objBestTrap.base.labyrinth;
      charmName = parseTrapName(objLaby.charmFocus);
      baitName = parseTrapName(objLaby.baitFocus);
      const isFarming = objLaby.districtFocus.indexOf('FARMING') > -1;
      const isTreasury = objLaby.districtFocus.indexOf('TREASURY') > -1;
      if (isFarming) {
        weaponName = parseTrapName(objLaby.weaponFarming);
        charmName = parseTrapName(objLaby.charmFarming);
        baitName = parseTrapName(objLaby.baitFarming);
      }
      if (isTreasury) {
        weaponName = parseTrapName(objLaby.weaponTreasury);
        charmName = parseTrapName(objLaby.charmTreasury);
        baitName = parseTrapName(objLaby.baitTreasury);
      }
      window.setTimeout(() => {
        // 這是 focus door的區塊,當然 isFocusDistrict = true;
        const isFocusDistrict = true;
        labyrinthAutoLantern(objLaby, isFocusDistrict, isFarming);
        armAllTraps(weaponName, baseName, charmName, baitName);
      }, 3000);
    }, 1500);
    /* if (objLaby.districtFocus.indexOf('FARMING') > -1) {
      if (objLaby.weaponFarming == 'Arcane')
        checkThenArm(
          'best',
          'weapon',
          objBestTrap.weapon.arcane.concat(objBestTrap.weapon.forgotten)
        );
      else checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
    } else checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten); */
  } catch (e) {
    console.perror('labyrinth', e.message);
    /* checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
    checkThenArm(null, 'bait', 'Glowing Guyere');
    disarmTrap('trinket'); */
    armAllTraps(
      objBestTrap.weapon.forgotten,
      objBestTrap.base.combo,
      'None',
      'Marble Cheese'
    );
    return;
  }
}

function zokor() {
  const loc = getCurrentLocation();
  if (loc.indexOf('Labyrinth') > -1) {
    setStorage('eventLocation', 'Labyrinth');
    labyrinth();
    return;
  } else if (loc.indexOf('Zokor') < 0) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Gouda Cheese';
  // zokor setup and quest object
  const objDefaultZokor = {
    bossStatus: ['UNAVAILABLE', 'INCOMING', 'ACTIVE', 'DEFEATED'],
    districtType: ['FEALTY', 'TECH', 'SCHOLAR', 'TREASURY', 'FARMING'],
    trap: {
      FEALTY: new Array(4).fill([
        'Glowing Gruyere',
        'best.weapon.forgotten',
        'best.base.combo',
        'None'
      ]),
      TECH: new Array(4).fill([
        'Glowing Gruyere',
        'best.weapon.forgotten',
        'best.base.combo',
        'None'
      ]),
      SCHOLAR: new Array(4).fill([
        'Glowing Gruyere',
        'best.weapon.forgotten',
        'best.base.combo',
        'None'
      ]),
      TREASURY: new Array(4).fill([
        'Glowing Gruyere',
        'best.weapon.forgotten',
        'best.base.combo',
        'None'
      ]),
      FARMING: new Array(4).fill([
        'Glowing Gruyere',
        'best.weapon.forgotten',
        'best.base.combo',
        'None'
      ])
    }
  };
  const objZokor = getStorageToObject('Zokor', objDefaultZokor);
  const quest = user.quests.QuestAncientCity;
  const bossStatus = trimToEmpty(quest.boss).toUpperCase();
  const clueName = trimToEmpty(quest.clue_name).toUpperCase();
  const remainingStealth = quest.remaining;
  let statusIndex = objZokor.bossStatus.indexOf(bossStatus);
  console.plog(
    'District Tier:',
    quest.district_tier,
    'Boss Status:',
    bossStatus
  );
  // Remove finished type from focus queue when stealth less than 5;
  // TODO 反覆刷同一個 type時,queue裡的該 type會被多次移除.等於 queue只能以 type不重複的方式設定.
  if (remainingStealth < 5) {
    const objLaby = getStorageToObject('Labyrinth', objDefaultLaby);
    const focusTypesQueue = objLaby.focusTypesQueue;
    if (focusTypesQueue && focusTypesQueue.length > 0) {
      const districtIndex = focusTypesQueue.indexOf(clueName);
      if (districtIndex == 0) {
        focusTypesQueue.splice(districtIndex, 1);
        setStorage('Labyrinth', JSON.stringify(objLaby));
      }
    }
  }
  let baitName = 'Glowing Gruyere';
  let weaponName = 'best.weapon.forgotten';
  let baseName = 'best.base.combo';
  let charmName = 'None';
  if (statusIndex > -1) {
    const trap = objZokor.trap[clueName][statusIndex];
    baitName = trap[0];
    weaponName = trap[1];
    baseName = trap[2];
    charmName = trap[3];
  }
  checkThenArm(armPriority.best, TrapType.bait, parseTrapName(baitName));
  checkThenArm(armPriority.best, TrapType.weapon, parseTrapName(weaponName));
  checkThenArm(armPriority.best, TrapType.base, parseTrapName(baseName));
  checkThenArm(armPriority.best, TrapType.trinket, parseTrapName(charmName));
}

// // Fiery Warpath Preference
/**
 * Array of commander's charm.
 * Mainly used for checkThenArm best.
 */
const CommanderCharm = [
  "Super Warpath Commander's Charm",
  "Warpath Commander's Charm"
];
/**
 * HUD中由左至右的老鼠種類
 * 及其對應的charm的主要識別名稱.
 * 0,1,2,3,4,5:
 * ['Warrior', 'Scout', 'Archer', 'Cavalry', 'Mage', 'Artillery']
 */
const objPopulation = {
  WARRIOR: 0,
  SCOUT: 1,
  ARCHER: 2,
  CAVALRY: 3,
  MAGE: 4,
  ARTILLERY: 5,
  name: ['Warrior', 'Scout', 'Archer', 'Cavalry', 'Mage', 'Artillery']
};
/**
 * wave是 1/2/3, 所以 array index 0補一個0.
 * 用不到.
 */
const FWSupportRetreatAt = [0, 10, 18, 26];
/**
 * 最高可能連勝數
 */
const FwHighestStreak = 15;
/**
 * Fiery Warpath預設設定值
 */
const DefaultFwWaveSettings = {
  weapon: 'best.weapon.physical',
  base: 'best.base.combo',
  Cavalry: 'best.weapon.tactical',
  Mage: 'best.weapon.hydro',
  Artillery: 'best.weapon.arcane',
  Commander: 'best.weapon.physical',
  someFews: 'best.weapon.physical',
  focusType: 'NORMAL',
  priorities: 'HIGHEST',
  cheese: new Array(FwHighestStreak).fill('Gouda'),
  charmType: new Array(FwHighestStreak).fill('Warpath'),
  special: new Array(FwHighestStreak).fill('None'),
  ignoreMouseLessThan: 1,
  hasCavalryCharm: false,
  hasMageCharm: false,
  charmOnlySoldier: 'None',
  charmOnlyCavalry: 'None',
  charmOnlyMage: 'None',
  charmOnlyArtillery: 'None',
  charmSomeFews: 'None',
  charmArtilleryCommander: 'None',
  lastSoldierConfig: 'HUNT_GARGANTUA',
  includeArtillery: true,
  disarmAfterSupportRetreat: false,
  warden: {
    before: {
      weapon: '',
      base: '',
      trinket: '',
      bait: ''
    },
    after: {
      weapon: '',
      base: '',
      trinket: '',
      bait: ''
    }
  }
};

/**
 * 連勝數(array index)對應的清除老鼠數量
 */
const mousesCaughtAtStreak = [0, 1, 2, 5, 6, 7, 12, 13, 14, 21];

/**
 * My Fiery Warpath
 */
function fieryWarpath() {
  if (getEnvironmentType() != 'desert_warpath') return;
  const warpathViewAtts = user.viewing_atts.desert_warpath;
  const wave = warpathViewAtts.wave;
  const mice = warpathViewAtts.mice;
  const items = warpathViewAtts.items;
  let weaponName = '';
  let baseName = '';
  let charmName = '';
  let baitName = '';
  /** 雖然第4波邏輯不同,但是並沒有讓第4波與其他3波設定方式不一樣.
    1-4波的設定物件欄位都一樣,
    所以程式會先處理掉邏輯不同的第 4波,取 warden[before/after]進行處理.
    後面 1-3波再用一致的方式(不會用到warden[before/after])處理. */
  const objDefaultFWAll = {
    stopAtWardenLessThan: 0,
    travelTo: '',
    wave1: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
    wave2: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
    wave3: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
    wave4: JSON.parse(JSON.stringify(DefaultFwWaveSettings))
  };
  const objFWAll = getStorageToObject('FW', objDefaultFWAll);
  // 如果有從預設設定中複製屬性到設定物件,回寫 localStorage.
  let temp = false;
  for (let prop in objFWAll) {
    if (objFWAll.hasOwnProperty(prop)) {
      if (assignMissingDefault(objFWAll[prop], DefaultFwWaveSettings))
        temp = true;
    }
  }
  if (temp) setStorage('FW', JSON.stringify(objFWAll));
  /** 當前 wave的設定值. */
  const objFW = wave === 'portal' ? objFWAll['wave4'] : objFWAll['wave' + wave];
  const physicalWeaponSetup = parseTrapName(objFW.weapon);
  const baseSetup = parseTrapName(objFW.base);
  /* 第4/portal波與其他不同,所以先處理第4/portal波.
    判斷 warden清光沒.清光前跟清光後各自可設定不同的 trap. */
  if (wave == 4 || wave == 'portal') {
    // 目前的經驗通常都是 user沒同步,但也發生過 HUD沒同步
    let wardenLeft = parseInt(
      document
        .getElementsByClassName('warpathHUD-wave wave_' + wave)[0]
        .getElementsByClassName('warpathHUD-wave-mouse-population')[0]
        .textContent
    );
    let wardenNumUser = parseInt(mice.desert_elite_gaurd.quantity);
    if (wardenLeft != wardenNumUser) {
      reloadUserData('Warden number not sync.');
      return;
    }
    console.plog(`Wave: ${wave}, Warden Left: ${wardenLeft}`);
    if (Number.isNaN(wardenLeft)) wardenLeft = 12;
    let travelTo = objFWAll.travelTo;
    if (
      !isNullOrUndefined(travelTo) &&
      travelTo != '' &&
      travelTo != getEnvironmentType()
    ) {
      if (wardenLeft < objFWAll.stopAtWardenLessThan) {
        pauseByTraveling(travelTo);
        return;
      }
    }
    temp = wardenLeft > 0 ? 'before' : 'after';
    weaponName = parseTrapName(objFW.warden[temp].weapon);
    baseName = parseTrapName(objFW.warden[temp].base);
    checkThenArm(armPriority.best, TrapType.weapon, weaponName);
    checkThenArm(armPriority.best, TrapType.base, baseName);
    checkThenArm(
      armPriority.best,
      TrapType.trinket,
      wave == 'portal'
        ? parseTrapName(objFW.charmArtilleryCommander)
        : parseTrapName(objFW.warden[temp].trinket)
    );
    checkThenArm(null, TrapType.bait, objFW.warden[temp].bait);
    if (temp == 'after') {
      litCandle(candleTypes.red);
      // doubleEgg(true); // Warmonger Egg can't be doubled when Monger Charm armed
    }
    return;
  }
  /**
   * plog(msg) and then reload.
   *
   * @param {*} msg
   */
  const reloadUserData = (msg) => {
    console.plog(msg);
    reloadWithMessage(msg, false);
  };
  /* litCandle('none');
  doubleEgg(false); */
  weaponName = physicalWeaponSetup;
  // 特殊情況下(如 LNY), base還是要判斷的
  baseName = baseSetup;
  // 取得目前的連勝數
  objFW.streak = parseInt(
    document.getElementsByClassName('warpathHUD-streak-quantity')[0].innerText
  );
  let streakUser = warpathViewAtts.streak_quantity || 0;
  if (objFW.streak != streakUser) {
    reloadUserData('Streak not sync.');
    return;
  }
  console.plog('Wave:', wave, 'Streak:', objFW.streak);
  // 如果連勝數不正常,停止執行.
  if (
    Number.isNaN(objFW.streak) ||
    objFW.streak < 0 ||
    objFW.streak >= FwHighestStreak
  )
    return;
  // 如果連勝的設定沒設給預設值: Gouda/Warpath/None
  if (isNullOrUndefined(objFW.cheese[objFW.streak]))
    objFW.cheese[objFW.streak] = 'Gouda';
  if (isNullOrUndefined(objFW.charmType[objFW.streak]))
    objFW.charmType[objFW.streak] = 'Warpath';
  if (isNullOrUndefined(objFW.special[objFW.streak]))
    objFW.special[objFW.streak] = 'None';
  /* 當前連勝中的老鼠.一般類別老鼠都是 desert_起頭的.
    沒連勝時,這個欄位的資料為 null,要預防. */
  objFW.streakMouse = trimToEmpty(warpathViewAtts.streak_type);
  if (objFW.streakMouse.indexOf('desert_') > -1)
    objFW.streakMouse = capitalizeFirstLetter(objFW.streakMouse.split('_')[1]);
  console.plog('Current streak mouse type:', objFW.streakMouse);
  const streakMouseIndex = objPopulation.name.indexOf(objFW.streakMouse);
  // 這波當下有哪些老鼠及其數量
  /* 有抓到老鼠後, HUD的老鼠數量有減少,但是 view_atts卻沒有的情形 */
  let population = document
    .getElementsByClassName('warpathHUD-wave wave_' + wave.toString())[0]
    .getElementsByClassName('warpathHUD-wave-mouse-population');
  const populationUser = getFwPopulation();
  let populationArray = [];
  for (let i = 0; i < population.length; i++) {
    const qtyDiv = population[i];
    populationArray.push(parseInt(qtyDiv.innerText));
  }
  if (populationArray.join(',') != populationUser.join(',')) {
    reloadUserData('Mouse population not sync.');
    return;
  }
  /* all: 全部老鼠各別的數量
       normal: warrior, scout, archer各別的數量
       special: 非 normal老鼠各別的數量
       active: 全部老鼠各別是否歸零:1未歸零, 0已歸零
       ignore: 不使用 charm的老鼠:1:不使用, 0:使用 */
  objFW.population = {
    all: [],
    normal: [],
    special: [],
    active: [],
    ignore: []
  };
  /* 將畫面上抓到的各種老鼠的數量,
    填入 all/normal/special/active/ignore中.
    active與否用老鼠數量是否為0判斷.
    ignore與否用ignore設定判斷.
    soldierActive用來判斷 NORMAL夠不夠 6連勝,
    以自動切換到 SPECIAL. */
  objFW.soldierActive = false;
  /* 原本只用>0判斷 soldierActive,
    這樣容易造成優先類別不夠 6連勝時,
    還傻傻一直抓而不切到可以 6連勝的 focusType. */
  for (let i = 0; i < population.length; i++) {
    // temp = parseInt(population[i]);
    temp = parseInt(population[i].innerText);
    if (Number.isNaN(temp)) temp = 0;
    objFW.population.all.push(temp);
    /* objFW.population.active只用在判斷是否只剩一種老鼠,
      維持判斷大於0而非夠不夠 6連勝. */
    if (temp > 0) objFW.population.active.push(1);
    else objFW.population.active.push(0);
    /* objFW.population.ignore用來判斷
      存活老鼠的數量是否不使用 charm. */
    if (temp < objFW.ignoreMouseLessThan) objFW.population.ignore.push(1);
    else objFW.population.ignore.push(0);
    if (i < objPopulation.CAVALRY) {
      objFW.population.normal.push(temp);
      // 不使用 >0判斷避免一直抓不夠 6連勝的老鼠
      const caughtQtyAtNowStreak =
        i == streakMouseIndex ? mousesCaughtAtStreak[objFW.streak] : 0;
      objFW.soldierActive ||=
        temp + caughtQtyAtNowStreak >= objFW.ignoreMouseLessThan; // mousesCaughtAtStreak[6];
    } else {
      objFW.population.special.push(temp);
    }
  }
  if (!objFW.hasCavalryCharm)
    objFW.population.ignore[objPopulation.CAVALRY] = 1;
  if (!objFW.hasMageCharm) objFW.population.ignore[objPopulation.MAGE] = 1;
  // 如果所有 normal老鼠的數量都不足6連勝且有設定使用特別 charm,focusType改成 SPECIAL.
  if (
    !objFW.soldierActive &&
    objFW.focusType == 'NORMAL' &&
    (objFW.hasCavalryCharm || objFW.hasMageCharm)
  )
    objFW.focusType = 'SPECIAL';
  console.plog('settings of wave', wave, objFW);
  /** get charm array for only 1 type of mouse left by target mouse index */
  const getCharmOnlyType = (index) => {
    logging(`getCharmOnlyType(${index})`);
    const targetMouse =
      index < objPopulation.CAVALRY ? 'Soldier' : objPopulation.name[index];
    return parseTrapName(objFW['charmOnly' + targetMouse]);
  };
  /** get charm array by current streak and target mouse index */
  const getCharmName = (streak, index) => {
    logging(`getCharmName(${streak}, ${index})`);
    if (index < 0) return parseTrapName(objFW.charmSomeFews);
    if (index === objPopulation.ARTILLERY)
      return parseTrapName(objFW.charmOnlyArtillery);
    const targetMouse = objPopulation.name[index];
    const rtn = objFW.charmType[streak] + ' ' + targetMouse;
    return rtn;
  };
  /** get weapon array by target mouse index */
  const getWeaponName = (index) => {
    const targetMouse = index < 0 ? 'someFews' : objPopulation.name[index];
    return index > -1 && index < objPopulation.CAVALRY
      ? physicalWeaponSetup
      : parseTrapName(objFW[targetMouse]);
  };
  /* 處理只剩一種老鼠相關設定.
    計算還有多少種老鼠 active(數量不為0).
    includeArtillery這個設定,
    用來判斷<只剩一種老鼠>包不包括 artillery.
    只剩一種老鼠時可以設定不使用 charm,
    而 artillery沒有對應的 charm,
    這時候可以設定為不包括 */
  let index = -1;
  let charmArmed = getCharmName();
  let nSum;
  if (wave == 3 && !objFW.includeArtillery) {
    const arrTemp = objFW.population.active.slice();
    arrTemp[objPopulation.ARTILLERY] = 0;
    nSum = sumData(arrTemp);
    if (nSum < 1) nSum = 1;
  } else nSum = sumData(objFW.population.active);
  // 只剩一種老鼠
  if (nSum == 1) {
    /* 如果只有 13隻,抓到第 13隻也進下個 wave了
      所以要有 14隻才夠抓 Gargantua.
      只剩一種老鼠時才需要特別處理抓 Gargantua,
      還有多種老鼠時跟著設定走就好. */
    // 只剩一種老鼠,maxIndex就是那種老鼠的index.
    const indexMax = maxIndex(objFW.population.all);
    const lastMouseQty = objFW.population.all[indexMax];
    logging(
      `enough for gargantua? max population(${indexMax}, ${lastMouseQty}), streaking(${streakMouseIndex}, ${
        mousesCaughtAtStreak[objFW.streak]
      })`
    );
    const lastMouseQtyPlusCaught =
      lastMouseQty +
      (indexMax == streakMouseIndex ? mousesCaughtAtStreak[objFW.streak] : 0);
    // 老鼠數量要夠 8連勝才能 hunt Gargantua
    const notEnoughGargantua = lastMouseQtyPlusCaught < mousesCaughtAtStreak[8];
    // only one soldier type left
    if (objFW.lastSoldierConfig == 'CONFIG_STREAK')
      objFW.priorities = 'HIGHEST';
    else if (objFW.lastSoldierConfig == 'CONFIG_UNCHANGED') return;
    else if (
      objFW.lastSoldierConfig == 'CONFIG_GOUDA' ||
      objFW.lastSoldierConfig == 'NO_WARPATH' ||
      objFW.lastSoldierConfig.indexOf('HUNT_GARGANTUA') > -1
    ) {
      // 不裝 warpath charm
      if (charmArmed.indexOf('Warpath') > -1) charmName = 'None';
      index = objFW.population.active.indexOf(1);
      weaponName = getWeaponName(index);
      charmName = getCharmOnlyType(index);
      if (objFW.lastSoldierConfig == 'CONFIG_GOUDA') baitName = 'Gouda';
      if (objFW.lastSoldierConfig.indexOf('HUNT_GARGANTUA') > -1) {
        baitName = 'Gouda';
        // 不足 7連勝都不裝備 Gargantua Charm.
        if (charmArmed.indexOf('Gargantua') > -1) charmName = 'None';
        if (notEnoughGargantua) {
          // 剩餘老鼠數量不足 7連勝,不適合抓 gargantua
          logging('not enough mouse for Gargantua');
        } else {
          logging('enough mouse for Gargantua');
          if (objFW.streak > 6) {
            logging(`streak > 6? ${objFW.streak}`);
            if (objFW.special[objFW.streak].indexOf('GARGANTUA') > -1) {
              weaponName = objBestTrap.weapon.draconic;
              baseName = objBestTrap.base.combo;
              baitName = objFW.cheese[objFW.streak]; // 'SUPER';
              if (objFW.special[objFW.streak].indexOf('_GGC') > -1)
                charmName = 'Gargantua Charm';
              else charmName = '202';
            }
          } else if (objFW.streak > 3) {
            logging(
              'streak > 3 and < 7, hunt gargantua streak 4 and up with sb+ ?'
            );
            if (objFW.lastSoldierConfig.indexOf('_SB') > -1) baitName = 'SUPER';
          } else {
            logging('streak < 4, hunt gargantua always with sb+ ?');
            if (objFW.lastSoldierConfig == 'HUNT_GARGANTUA_ALL_SB')
              baitName = 'SUPER';
          }
        }
      }
      logging('HUNT_GARGANTUA', weaponName, baseName, charmName, baitName);
      checkThenArm('best', 'weapon', weaponName);
      checkThenArm('best', 'base', baseName);
      checkThenArm('any', 'trinket', charmName);
      checkThenArm(null, 'bait', baitName);
      return;
    }
  }
  const findTargetMouseIndex = (
    minMouseQuantity,
    isIncludeCaught,
    isCharmRequired
  ) => {
    logging(
      `findTargetMouseIndex(${minMouseQuantity}, ${isIncludeCaught}, ${isCharmRequired})`
    );
    const isCharmOkIfMouseLessThan = 6;
    logging(
      `ignore hasMageCharm when mage less than: ${isCharmOkIfMouseLessThan}`
    );
    // 1.依老鼠數量現況判斷-單純清光
    // 2.包括已捕捉的數量-找足夠連勝的老鼠
    const allMice = objFW.population.all;
    const allMiceCopy = allMice.slice();
    // let totalQuantity = tmpArr.reduce((a, b) => a + b, 0);
    // allMiceCopy連勝中已捕捉的老鼠要加回去
    if (streakMouseIndex > -1)
      allMiceCopy[streakMouseIndex] =
        allMiceCopy[streakMouseIndex] + mousesCaughtAtStreak[objFW.streak];
    let isStreakOk =
      (!isIncludeCaught && allMice[streakMouseIndex] > minMouseQuantity) ||
      (isIncludeCaught && allMiceCopy[streakMouseIndex] > minMouseQuantity);
    // soldier一定有 charm, artillery一定沒 charm, cavalry跟 mage要看設定
    const isCharmOk = (index) => {
      const maxMouseQuantity = isIncludeCaught
        ? Math.max(...allMiceCopy)
        : Math.max(...allMice);
      // 不平衡且 Mage少量時無視 hasMageCharm
      const isMageCharmOk =
        index === objPopulation.MAGE &&
        ((maxMouseQuantity > mousesCaughtAtStreak[5] &&
          allMice[objPopulation.MAGE] < isCharmOkIfMouseLessThan) ||
          objFW.hasMageCharm);
      // 不平衡且 Cavalry少量時無視 hasCavalryCharm
      const isCavalryCharmOk =
        index === objPopulation.CAVALRY &&
        ((maxMouseQuantity > mousesCaughtAtStreak[5] &&
          allMice[objPopulation.CAVALRY] < isCharmOkIfMouseLessThan) ||
          objFW.hasCavalryCharm);
      logging(`isCavalryCharmOk=${isCavalryCharmOk}`);
      return (
        index !== objPopulation.ARTILLERY &&
        (index < objPopulation.CAVALRY || isMageCharmOk || isCavalryCharmOk)
      );
    };
    logging(!isCharmRequired || isCharmOk(objPopulation.CAVALRY));
    isStreakOk &= isCharmOk(streakMouseIndex);
    if (streakMouseIndex > -1 && isStreakOk) {
      logging(`right streak mouse, use streak index: ${streakMouseIndex}`);
      return streakMouseIndex;
    }
    logging(
      `wrong streak mouse ${streakMouseIndex}, find the right one more than ${minMouseQuantity} and set streak to 0`
    );
    let rtn = -1;
    if (allMice[objPopulation.SCOUT] > minMouseQuantity) {
      rtn = objPopulation.SCOUT;
    } else if (allMice[objPopulation.ARCHER] > minMouseQuantity) {
      rtn = objPopulation.ARCHER;
    } else if (allMice[objPopulation.WARRIOR] > minMouseQuantity) {
      rtn = objPopulation.WARRIOR;
    } else if (
      allMice[objPopulation.MAGE] > minMouseQuantity &&
      (!isCharmRequired || isCharmOk(objPopulation.MAGE))
    ) {
      rtn = objPopulation.MAGE;
    } else if (
      allMice[objPopulation.CAVALRY] > minMouseQuantity &&
      (!isCharmRequired || isCharmOk(objPopulation.CAVALRY))
    ) {
      rtn = objPopulation.CAVALRY;
    }
    logging(`right mouse index found: ${rtn}, set streak to 0`);
    objFW.streak = 0;
    return rtn;
  };
  /** clear mouse one type by one type */
  const clearOneByOne = () => {
    logging(`clearOneByOne`);
    const index = findTargetMouseIndex(0, false, true);
    const baitName = parseTrapName(objFW.cheese[objFW.streak]);
    const weaponName = getWeaponName(index);
    const baseName = baseSetup;
    const charmName = getCharmName(objFW.streak, index);
    checkThenArm('best', 'weapon', weaponName);
    checkThenArm('best', 'base', baseName);
    checkThenArm('any', 'trinket', charmName);
    checkThenArm(null, 'bait', baitName);
  };
  // support already retreated
  const isSupportRetreated =
    sumData(objFW.population.all) -
      mousesCaughtAtStreak[5] +
      (streakMouseIndex > -1 ? mousesCaughtAtStreak[objFW.streak] : 0) <=
    FWSupportRetreatAt[wave];
  logging(
    `Is support retreated/ing? ${isSupportRetreated}. ${sumData(
      objFW.population.all
    )} - ${mousesCaughtAtStreak[5]} + ${
      streakMouseIndex > -1 ? mousesCaughtAtStreak[objFW.streak] : 0
    } <= ${FWSupportRetreatAt[wave]}`
  );
  if (isSupportRetreated) {
    clearOneByOne();
    return;
  }
  /* 剩下多種老鼠,但:數量都不到 ignoreMouseLessThan或到的沒 charm
    這時可能剩下的老鼠數量還不少,
    例如 ignoreMouseLessThan = 13(7連 commander)或 12(6連 commander).
    所以先嘗試 5連勝 commander把老鼠數量進一步降低再逐一清掉.
    嘗試 5連勝要注意達到 5連勝時會不會導致 supportRetreat */
  const allMiceCopy = objFW.population.all.slice();
  // let totalQuantity = tmpArr.reduce((a, b) => a + b, 0);
  // 找 max時,連勝中已捕捉的老鼠要加回去
  if (streakMouseIndex > -1)
    allMiceCopy[streakMouseIndex] =
      allMiceCopy[streakMouseIndex] + mousesCaughtAtStreak[objFW.streak];
  // 用已捕捉的老鼠已經加回去的 copy來切
  const normalCopy = allMiceCopy.slice();
  normalCopy.splice(objPopulation.CAVALRY);
  const cavalryCopy = allMiceCopy.slice();
  cavalryCopy.splice(objPopulation.MAGE);
  const mageCopy = allMiceCopy.slice();
  mageCopy.splice(objPopulation.ARTILLERY);
  let qtyLimit = mousesCaughtAtStreak[5];
  const isSomeFews =
    Math.max(...normalCopy) < qtyLimit &&
    (!objFW.hasCavalryCharm ||
      (objFW.hasCavalryCharm && Math.max(...cavalryCopy) < qtyLimit)) &&
    (!objFW.hasMageCharm ||
      (objFW.hasMageCharm && Math.max(...mageCopy) < qtyLimit));
  const isEnoughStreak5 =
    sumData(allMiceCopy) - mousesCaughtAtStreak[5] > FWSupportRetreatAt[wave];
  // 全部無法達成 5連 commander或總數不夠達成 5連 commander,逐一清掉
  if (isSomeFews || !isEnoughStreak5) {
    clearOneByOne();
    return;
  }
  qtyLimit = objFW.ignoreMouseLessThan;
  const isAllIgnored =
    Math.max(...normalCopy) < qtyLimit &&
    (!objFW.hasCavalryCharm ||
      (objFW.hasCavalryCharm && Math.max(...cavalryCopy) < qtyLimit)) &&
    (!objFW.hasMageCharm ||
      (objFW.hasMageCharm && Math.max(...mageCopy) < qtyLimit));
  // 全部無法達成 6/7連 commander,但還能達成 5連 commander以上
  if (isAllIgnored) {
    weaponName = physicalWeaponSetup;
    baitName = 'Gouda';
    // 跑這邊的話應該還沒 support retreat,但以防萬一
    // objFW.population.all[streakMouseIndex] < 1是設法取得最高連勝 commander
    const sum = sumData(objFW.population.all);
    if (
      (objFW.streak > 5 ||
        (objFW.streak == 5 &&
          (sum - 1 == FWSupportRetreatAt[wave] ||
            objFW.population.all[streakMouseIndex] < 1))) &&
      !isSupportRetreated
    ) {
      logging(
        '奉送了 6連勝以上或 5連勝且老鼠清光了(無法取得更高連勝了)且 support還沒撤退就用 commander'
      );
      // 設定一定是針對更高連勝 commander,所以 5連只能強制或另開設定
      weaponName = parseTrapName(objFW.Commander);
      charmName = CommanderCharm;
      baitName = 'SUPER';
    } else {
      logging('isAllIgnored, building streak.');
      // 先看 streak是否在足夠 5連的老鼠,不是的話要切換
      // 老鼠剩不多,不要 streak在不夠的老鼠上
      let index = streakMouseIndex;
      qtyLimit = mousesCaughtAtStreak[5];
      // 先無視 hasXxxCharm設定.這裡用量不多,目前所有人 charm應該都夠用
      const targetIndex = findTargetMouseIndex(qtyLimit, true);
      logging(
        `streak mouse index: ${index}, target mouse index: ${targetIndex}`
      );
      charmName = getCharmName(objFW.streak, targetIndex);
      weaponName = getWeaponName(targetIndex);
    }
    checkThenArm('best', 'weapon', weaponName);
    checkThenArm('best', 'base', baseName);
    checkThenArm('any', 'trinket', charmName);
    checkThenArm(null, 'bait', baitName);
    return;
  }
  /* 判斷要使用哪種 charm.
    根據各種條件決定(且可能中途覆蓋) charmName(String|String[])後,
    最後 checkThenArm('best', 'trinket', charmName) */
  /* 處理 Streak:那一列最後那個選項(special),
    None是根據設定 arm (Super) Warpath XXX Charm.
    COMMANDER是 Commander's Charm.
    GARGANTUA是武器換成 draconic.
    GARGANTUA_GGC除了武器換成 draconic,還 arm Gargantua Charm. */
  const commanderCharmQty =
    parseInt(items.super_flame_march_general_trinket.quantity || 0) +
    parseInt(items.flame_march_general_trinket.quantity || 0);
  if (Number.isNaN(commanderCharmQty)) commanderCharmQty = 0;
  if (objFW.special[objFW.streak].indexOf('COMMANDER') === 0) {
    /* special為 COMMANDER:武器換成 Physical Trap Setup中的武器. */
    // 有 CDSC後如果連勝大於 7武器用 draconic可以兼顧 commander跟 gargantua
    weaponName = parseTrapName(objFW.Commander);
    if (isSupportRetreated || commanderCharmQty < 1) {
      /* support撤退後只用 soldier charm不用 commander charm.
      => commander charm好像會自動 disarm */
      const streak = objFW.streak > 0 ? objFW.streak - 1 : objFW.streak;
      charmName = getCharmName(streak, findTargetMouseIndex(0));
    } else {
      // 倒數第二個選項(Warpath/Super Warpath)
      if (objFW.charmType[objFW.streak].indexOf('Super') > -1)
        charmName = CommanderCharm;
      else charmName = CommanderCharm[1];
    }
  } else if (objFW.special[objFW.streak].indexOf('GARGANTUA') === 0) {
    /* special為 GARGANTUA:武器換成 draconic.
      special為GARGANTUA_GGC加碼 arm Gargantua Charm(7場以上連勝).
      否則如果當下 arm的是 Warpath Charm則 disarm charm. */
    weaponName = objBestTrap.weapon.draconic;
    baseName = objBestTrap.base.combo;
    if (objFW.special[objFW.streak] == 'GARGANTUA_GGC' && objFW.streak >= 7)
      charmName = 'Gargantua Charm';
    else if (
      objFW.special[objFW.streak] == 'GARGANTUA_COMM' &&
      objFW.streak >= 7 &&
      commanderCharmQty > 0 &&
      !isSupportRetreated
    )
      charmName = CommanderCharm;
    // gargantua區段武器已經是 draconic,不該再用 warpath xxx charm
    else charmName = charmArmed.indexOf('Warpath') > -1 ? '202' : undefined;
  } else {
    // 這段是special為 None時
    let isCurrentStreakCleared = false;
    let isWrongStreakMouse = false;
    let indexMinMax;
    objFW.focusType = objFW.focusType.toLowerCase();
    // 按數量多的或少的優先決定優先類別的集火目標index
    if (objFW.priorities == 'HIGHEST')
      indexMinMax = maxIndex(objFW.population[objFW.focusType]);
    else {
      for (let i = 0; i < objFW.population[objFW.focusType].length; i++) {
        /* 已經清完的老鼠種類(數量為0)
          設定成最大整數避免被選到.
          因為0最少但是不該被選到 */
        if (objFW.population[objFW.focusType][i] < objFW.ignoreMouseLessThan)
          objFW.population[objFW.focusType][i] = Number.MAX_SAFE_INTEGER;
      }
      indexMinMax = minIndex(objFW.population[objFW.focusType]);
    }
    logging(`focus type: ${objFW.focusType}, focus index: ${indexMinMax}`);
    // TODO 連勝中老鼠的index.<=不就是 streakMouseIndex?
    index = objPopulation.name.indexOf(objFW.streakMouse);
    /* 1.判斷連勝中老鼠是否已歸零
      2.判斷連勝中老鼠是否為亂入.
      normal優先時抓到 special或
      special優先時抓到 normal. */
    if (index > -1) {
      isCurrentStreakCleared = objFW.population.all[index] < 1;
      if (
        objFW.focusType.toUpperCase() == 'NORMAL' &&
        objFW.soldierActive &&
        // not enough high streak is wrong too
        (objFW.population.ignore[index] == 1 || index > objPopulation.ARCHER)
      ) {
        isWrongStreakMouse = !(objFW.streak == 2 || objFW.streak > 3);
      } else if (
        objFW.focusType.toUpperCase() == 'SPECIAL' &&
        !objFW.soldierActive
      ) {
        const isSpecialStreak = index != indexMinMax + 3;
        const isCavalry = index == objPopulation.CAVALRY;
        const isMage = index == objPopulation.MAGE;
        isWrongStreakMouse =
          (isSpecialStreak && objFW.streak < 2) ||
          (isCavalry && !objFW.hasCavalryCharm) ||
          (isMage && !objFW.hasMageCharm) ||
          index == objPopulation.ARTILLERY; // artillery is always wrongSoldierType because of no charm.
      }
    }

    /* 決定 1-3波使用的武器及 charm.
      區分有正常的選擇到集火目標及集火目標異常.
      目前集火目標只是按照數量多寡優先設定找出,
      如果有目標異常狀況要做調整. */
    if (objFW.streak === 0 || isCurrentStreakCleared || isWrongStreakMouse) {
      /* 沒有連勝
        或連勝中老鼠數量為0了
        或連勝中老鼠與優先類別(normal/special)不符 */
      objFW.streak = 0;
      temp = objFW.population[objFW.focusType][indexMinMax];
      if (objFW.focusType.toUpperCase() == 'NORMAL') {
        // NORMAL優先
        weaponName = physicalWeaponSetup;
        /* 優先數量(多優先或少優先)index
          只不過是第一個滿足優先數量條件的index.
          可能有多種老鼠都滿足優先數量,
          所以這邊再用滿足優先數量的老鼠剩餘數量,
          按 Scout>Archer>Warrior的優先度重選集火目標. */
        let count = countArrayElement(temp, objFW.population[objFW.focusType]);
        let tmpIndex = -1;
        if (count > 1) {
          if (objFW.population[objFW.focusType][objPopulation.SCOUT] == temp)
            tmpIndex = objPopulation.SCOUT;
          else if (
            objFW.population[objFW.focusType][objPopulation.ARCHER] == temp
          )
            tmpIndex = objPopulation.ARCHER;
          else if (
            objFW.population[objFW.focusType][objPopulation.WARRIOR] == temp
          )
            tmpIndex = objPopulation.WARRIOR;
        } else {
          tmpIndex = indexMinMax;
        }
        charmName = getCharmName(0, tmpIndex);
      } else {
        // SPECIAL優先
        /* SPECIAL優先時 indexMinMax是從 population.special[]找出來的,
          跟 population.all[] index差3. */
        if (indexMinMax + 3 == objPopulation.ARTILLERY && nSum != 1) {
          /* 數量最多/最少的如果是 artillery且還有其他 special,
            排除 artillery取最多/最少 */
          temp = objFW.population.special.slice();
          temp.splice(indexMinMax, 1);
          if (objFW.priorities == 'HIGHEST') indexMinMax = maxIndex(temp);
          else indexMinMax = minIndex(temp);
        }
        // hasMageCharm時如果挑出 mage,cavalry還沒歸零的話就強制 cavalry.
        /* if (
          indexMinMax + 3 == objPopulation.MAGE &&
          objFW.population.all[objPopulation.CAVALRY] > 0
        ) {
          indexMinMax = 0;
        } */

        indexMinMax += 3; // special的index,+3後才能跟all的index比對
        weaponName = getWeaponName(indexMinMax);
        charmName = getCharmName(0, indexMinMax);
      }
    } else {
      // streak 1 and above
      // artillery不裝備 Warpath charm(因為沒用)
      if (
        index == objPopulation.ARTILLERY &&
        charmArmed.indexOf('Warpath') > -1
      ) {
        charmName = 'None';
      } else {
        // 設定 Super Warpath時也加入非 super選 best
        if (objFW.charmType[objFW.streak].indexOf('Super') > -1)
          charmName = [
            objFW.charmType[objFW.streak] + ' ' + objPopulation.name[index],
            'Warpath ' + objPopulation.name[index]
          ];
        else
          charmName =
            objFW.charmType[objFW.streak] + ' ' + objPopulation.name[index];
      }
      weaponName = getWeaponName(index);
    }
  }
  if (objFW.disarmAfterSupportRetreat && isSupportRetreated) {
    if (charmArmed.indexOf('Warpath') > -1) charmName = 'none';
    else charmName = '';
  }
  baitName = objFW.cheese[objFW.streak];
  logging(
    `FW usual hunting: bait: ${baitName}, weapon: ${weaponName}, base: ${baseName}, charm: ${charmName}`
  );
  checkThenArm(null, 'bait', baitName);
  checkThenArm('best', 'weapon', weaponName);
  checkThenArm('best', 'base', baseName);
  checkThenArm('best', 'trinket', charmName);
}
function fieryWarpath2() {
  const version = '1.0.0';
  logging(`fieryWarpath2_${version}`);
  if (getEnvironmentType() != 'desert_warpath') return;
  const warpathViewAtts = user.viewing_atts.desert_warpath;
  const wave = warpathViewAtts.wave;
  const mice = warpathViewAtts.mice;
  const items = warpathViewAtts.items;
  let weaponName = '';
  let baseName = '';
  let charmName = '';
  let baitName = '';
  /** 雖然第4波邏輯不同,但是並沒有讓第4波與其他3波設定方式不一樣.
    1-4波的設定物件欄位都一樣,
    所以程式會先處理掉邏輯不同的第 4波,取 warden[before/after]進行處理.
    後面 1-3波再用一致的方式(不會用到warden[before/after])處理. */
  const objDefaultFWAll = {
    stopAtWardenLessThan: 0,
    travelTo: '',
    wave1: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
    wave2: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
    wave3: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
    wave4: JSON.parse(JSON.stringify(DefaultFwWaveSettings))
  };
  const objFWAll = getStorageToObject('FW', objDefaultFWAll);
  /** 當前 wave的設定值. portal用 wave4 */
  const objFW = wave === 'portal' ? objFWAll['wave4'] : objFWAll['wave' + wave];
  const physicalWeaponSetup = parseTrapName(objFW.weapon);
  const baseSetup = parseTrapName(objFW.base);
  /* 第4/portal波與其他不同,所以先處理第4/portal波.
    判斷 warden清光沒.清光前跟清光後各自可設定不同的 trap. */
  if (wave == 4 || wave == 'portal') {
    // 目前的經驗通常都是 user沒同步,但也發生過 HUD沒同步
    const wardenLeft = parseInt(
      document
        .getElementsByClassName('warpathHUD-wave wave_' + wave)[0]
        .getElementsByClassName('warpathHUD-wave-mouse-population')[0]
        .textContent
    );
    const wardenNumUser = parseInt(mice.desert_elite_gaurd.quantity);
    if (wardenLeft != wardenNumUser) {
      reloadUserData('Warden number not sync.');
      return;
    }
    console.plog(`Wave: ${wave}, Warden Left: ${wardenLeft}`);
    if (Number.isNaN(wardenLeft)) wardenLeft = 12;
    const travelTo = objFWAll.travelTo;
    if (
      !isNullOrUndefined(travelTo) &&
      travelTo != '' &&
      travelTo != getEnvironmentType()
    ) {
      if (wardenLeft < objFWAll.stopAtWardenLessThan) {
        pauseByTraveling(travelTo);
        return;
      }
    }
    const wardenCleared = wardenLeft > 0 ? 'before' : 'after';
    weaponName = parseTrapName(objFW.warden[wardenCleared].weapon);
    baseName = parseTrapName(objFW.warden[wardenCleared].base);
    checkThenArm(armPriority.best, TrapType.weapon, weaponName);
    checkThenArm(armPriority.best, TrapType.base, baseName);
    checkThenArm(
      armPriority.best,
      TrapType.trinket,
      wave == 'portal'
        ? parseTrapName(objFW.charmArtilleryCommander)
        : parseTrapName(objFW.warden[wardenCleared].trinket)
    );
    checkThenArm(null, TrapType.bait, objFW.warden[wardenCleared].bait);
    if (wardenCleared == 'after') {
      litCandle(candleTypes.red);
      doubleEgg(true);
    }
    return;
  }
  /**
   * plog(msg) and then reload.
   *
   * @param {*} msg
   */
  const reloadUserData = (msg) => {
    console.plog(msg);
    reloadWithMessage(msg, false);
  };
  /* litCandle('none');
  doubleEgg(false); */
  weaponName = physicalWeaponSetup;
  // 特殊情況下(如 LNY), base還是要判斷的
  baseName = baseSetup;
  // 取得目前的連勝數
  objFW.streak = parseInt(
    document.getElementsByClassName('warpathHUD-streak-quantity')[0].innerText
  );
  const streakUser = MyUtils.parseQuantity(warpathViewAtts.streak_quantity);
  if (objFW.streak != streakUser) {
    reloadUserData('Streak not sync.');
    return;
  }
  console.plog('Wave:', wave, 'Streak:', objFW.streak);
  // 如果連勝數不正常,停止執行.
  if (
    Number.isNaN(objFW.streak) ||
    objFW.streak < 0 ||
    objFW.streak >= FwHighestStreak
  )
    return;
  // 如果連勝的設定沒設給預設值: Gouda/Warpath/None
  if (isNullOrUndefined(objFW.cheese[objFW.streak]))
    objFW.cheese[objFW.streak] = 'Gouda';
  if (isNullOrUndefined(objFW.charmType[objFW.streak]))
    objFW.charmType[objFW.streak] = 'Warpath';
  if (isNullOrUndefined(objFW.special[objFW.streak]))
    objFW.special[objFW.streak] = 'None';
  /* 當前連勝中的老鼠.一般類別老鼠都是 desert_起頭的.
    沒連勝時,這個欄位的資料為 null(so != targetMouse),要預防. */
  objFW.streakMouse = trimToEmpty(warpathViewAtts.streak_type);
  if (objFW.streakMouse.indexOf('desert_') > -1)
    objFW.streakMouse = capitalizeFirstLetter(objFW.streakMouse.split('_')[1]);
  console.plog('Current streak mouse type:', objFW.streakMouse);
  const streakMouseIndex = objPopulation.name.indexOf(objFW.streakMouse);
  // 這波當下有哪些老鼠及其數量
  /* 有抓到老鼠後, HUD的老鼠數量有減少,但是 view_atts卻沒有的情形 */
  const population = document
    .getElementsByClassName('warpathHUD-wave wave_' + wave.toString())[0]
    .getElementsByClassName('warpathHUD-wave-mouse-population');
  const populationUser = getFwPopulation();
  const populationArray = [];
  for (let i = 0; i < population.length; i++) {
    const qtyDiv = population[i];
    const qty = parseInt(qtyDiv.innerText);
    populationArray.push(Number.isNaN(qty) ? 0 : qty);
  }
  if (populationArray.join(',') != populationUser.join(',')) {
    reloadUserData('Mouse population not sync.');
    return;
  }
  /* all: 全部老鼠各別的數量
  normal: warrior, scout, archer各別的數量
  special: 非 normal老鼠各別的數量
  active: 全部老鼠各別是否歸零:1未歸零, 0已歸零
  ignore: 沒有 charm的老鼠:1:不使用, 0:使用 */
  objFW.population = {
    all: [],
    normal: [],
    special: [],
    active: [],
    ignore: []
  };
  /* 將畫面上抓到的各種老鼠的數量,
  填入 all/normal/special/active/ignore中.
  active: 是否已清光.用老鼠數量是否為0判斷.
  ignore: 能否集火.用 ignoreMouseLessThan設定判斷.
  soldierActive用來判斷 normal夠不夠 6連勝,
  以自動切換到 special.
  specialActive用來判斷 special夠不夠 6連勝,
  以自動切換到 normal. */
  objFW.soldierActive = false;
  objFW.specialActive = false;
  /* 原本只用>0判斷 soldierActive,
  這樣容易造成優先類別不夠 6連勝時,
  還傻傻一直抓而不切到可以 6連勝的 focusType. */
  for (let i = 0; i < populationArray.length; i++) {
    const qty = populationArray[i];
    objFW.population.all.push(qty);
    /* objFW.population.active只用在判斷是否只剩一種老鼠,
    應該判斷大於0而非夠不夠 6連勝. */
    if (qty > 0) objFW.population.active.push(1);
    else objFW.population.active.push(0);
    /* objFW.population.ignore用來判斷各種老鼠是否集火.
    數量夠且有 charm才集火 */
    if (qty < objFW.ignoreMouseLessThan) objFW.population.ignore.push(1);
    else objFW.population.ignore.push(0);
    // 不使用 >0判斷避免一直抓不夠 6連勝的老鼠
    const caughtQtyAtNowStreak =
      i == streakMouseIndex ? mousesCaughtAtStreak[objFW.streak] : 0;
    if (i < objPopulation.CAVALRY) {
      objFW.population.normal.push(qty);
      objFW.soldierActive ||=
        qty + caughtQtyAtNowStreak >= objFW.ignoreMouseLessThan; // mousesCaughtAtStreak[6];
    } else {
      objFW.population.special.push(qty);
      if (i == objPopulation.CAVALRY)
        objFW.specialActive ||=
          qty + caughtQtyAtNowStreak >= objFW.ignoreMouseLessThan &&
          objFW.hasCavalryCharm;
      if (i == objPopulation.MAGE)
        objFW.specialActive ||=
          qty + caughtQtyAtNowStreak >= objFW.ignoreMouseLessThan &&
          objFW.hasMageCharm;
      // Artillery無法集火,不影響 specialActive
    }
  }
  // 沒 charm的也不能集火
  if (!objFW.hasCavalryCharm)
    objFW.population.ignore[objPopulation.CAVALRY] = 1;
  if (!objFW.hasMageCharm) objFW.population.ignore[objPopulation.MAGE] = 1;
  // 如果只有一邊可集火另一邊不可,無視原本的 focusType,強制設定.
  if (!objFW.soldierActive && objFW.specialActive) objFW.focusType = 'SPECIAL';
  else if (!objFW.specialActive && objFW.soldierActive)
    objFW.focusType = 'NORMAL';
  console.plog('settings of wave', wave, objFW);
  /** get charm array for only 1 type of mouse left by target mouse index */
  const getCharmOnlyType = (index) => {
    logging(`getCharmOnlyType(${index})`);
    const targetMouse =
      index < objPopulation.CAVALRY ? 'Soldier' : objPopulation.name[index];
    return parseTrapName(objFW['charmOnly' + targetMouse]);
  };
  /** get charm array by current streak and target mouse index */
  const getCharmName = (streak, index) => {
    logging(`getCharmName(${streak}, ${index})`);
    if (index < 0) return parseTrapName(objFW.charmSomeFews);
    if (index === objPopulation.ARTILLERY)
      return parseTrapName(objFW.charmOnlyArtillery);
    const targetMouse = objPopulation.name[index];
    const rtn = objFW.charmType[streak] + ' ' + targetMouse;
    return rtn;
  };
  /** get weapon array by target mouse index */
  const getWeaponName = (index) => {
    const targetMouse = index < 0 ? 'someFews' : objPopulation.name[index];
    return index > -1 && index < objPopulation.CAVALRY
      ? physicalWeaponSetup
      : parseTrapName(objFW[targetMouse]);
  };
  /* 處理只剩一種老鼠相關設定.
    計算還有多少種老鼠 active(數量不為0).
    includeArtillery這個設定,
    用來判斷<只剩一種老鼠>包不包括 artillery.
    只剩一種老鼠時可以設定不使用 charm,
    而 artillery沒有對應的 charm,
    這時候可以設定為不包括 */
  let index = -1;
  let charmArmed = getCharmName();
  let nSum;
  if (wave == 3 && !objFW.includeArtillery) {
    const arrTemp = objFW.population.active.slice();
    arrTemp[objPopulation.ARTILLERY] = 0;
    nSum = sumData(arrTemp);
    if (nSum < 1) nSum = 1;
  } else nSum = sumData(objFW.population.active);
  // 只剩一種老鼠
  if (nSum == 1) {
    /* 如果只有 13隻,抓到第 13隻也進下個 wave了
      所以要有 14隻才夠抓 Gargantua.
      只剩一種老鼠時才需要特別處理抓 Gargantua,
      還有多種老鼠時跟著設定走就好. */
    // 只剩一種老鼠,maxIndex就是那種老鼠的index.
    const indexMax = maxIndex(objFW.population.all);
    const lastMouseQty = objFW.population.all[indexMax];
    logging(
      `enough for gargantua? max population(${indexMax}, ${lastMouseQty}), streaking(${streakMouseIndex}, ${
        mousesCaughtAtStreak[objFW.streak]
      })`
    );
    const lastMouseQtyPlusCaught =
      lastMouseQty +
      (indexMax == streakMouseIndex ? mousesCaughtAtStreak[objFW.streak] : 0);
    // 老鼠數量要夠 8連勝才能 hunt Gargantua
    const notEnoughGargantua = lastMouseQtyPlusCaught < mousesCaughtAtStreak[8];
    // only one soldier type left
    if (objFW.lastSoldierConfig == 'CONFIG_STREAK')
      objFW.priorities = 'HIGHEST';
    else if (objFW.lastSoldierConfig == 'CONFIG_UNCHANGED') return;
    else if (
      objFW.lastSoldierConfig == 'CONFIG_GOUDA' ||
      objFW.lastSoldierConfig == 'NO_WARPATH' ||
      objFW.lastSoldierConfig.indexOf('HUNT_GARGANTUA') > -1
    ) {
      // 不裝 warpath charm
      if (charmArmed.indexOf('Warpath') > -1) charmName = 'None';
      index = objFW.population.active.indexOf(1);
      weaponName = getWeaponName(index);
      charmName = getCharmOnlyType(index);
      if (objFW.lastSoldierConfig == 'CONFIG_GOUDA') baitName = 'Gouda';
      if (objFW.lastSoldierConfig.indexOf('HUNT_GARGANTUA') > -1) {
        baitName = 'Gouda';
        // 不足 7連勝都不裝備 Gargantua Charm.
        if (charmArmed.indexOf('Gargantua') > -1) charmName = 'None';
        if (notEnoughGargantua) {
          // 剩餘老鼠數量不足 7連勝,不適合抓 gargantua
          logging('not enough mouse for Gargantua');
        } else {
          logging('enough mouse for Gargantua');
          if (objFW.streak > 6) {
            logging(`streak > 6? ${objFW.streak}`);
            if (objFW.special[objFW.streak].indexOf('GARGANTUA') > -1) {
              weaponName = objBestTrap.weapon.draconic;
              baseName = objBestTrap.base.combo;
              baitName = objFW.cheese[objFW.streak]; // 'SUPER';
              if (objFW.special[objFW.streak].indexOf('_GGC') > -1)
                charmName = 'Gargantua Charm';
              else charmName = '202';
            }
          } else if (objFW.streak > 3) {
            logging(
              'streak > 3 and < 7, hunt gargantua streak 4 and up with sb+ ?'
            );
            if (objFW.lastSoldierConfig.indexOf('_SB') > -1) baitName = 'SUPER';
          } else {
            logging('streak < 4, hunt gargantua always with sb+ ?');
            if (objFW.lastSoldierConfig == 'HUNT_GARGANTUA_ALL_SB')
              baitName = 'SUPER';
          }
        }
      }
      logging('HUNT_GARGANTUA', weaponName, baseName, charmName, baitName);
      checkThenArm('best', 'weapon', weaponName);
      checkThenArm('best', 'base', baseName);
      checkThenArm('any', 'trinket', charmName);
      checkThenArm(null, 'bait', baitName);
      return;
    }
  }
}
/**
 * Get mice population array order by ui mice order.
 * @returns {Array<Number>} mice population array order by ui mice order
 */
function getFwPopulation() {
  const warpathViewAtts = user.viewing_atts.desert_warpath;
  const wave = warpathViewAtts.wave;
  if (wave == 4 || wave === 'portal') return [];
  const mice = warpathViewAtts.mice;
  const miceKeys = [
    [],
    ['desert_warrior_weak', 'desert_scout_weak', 'desert_archer_weak'],
    [
      'desert_warrior',
      'desert_scout',
      'desert_archer',
      'desert_cavalry',
      'desert_mage'
    ],
    [
      'desert_warrior_epic',
      'desert_scout_epic',
      'desert_archer_epic',
      'desert_cavalry_strong',
      'desert_mage_strong',
      'desert_artillery'
    ]
  ];
  const miceKeysOfWave = miceKeys[wave];
  const rtn = [];
  for (let i = 0; i < miceKeysOfWave.length; i++) {
    const key = miceKeysOfWave[i];
    rtn.push(mice[key]['quantity']);
  }
  return rtn;
}
/*
 * Find the index of first element of array
 * which it's greater then given value.
 * @param {Array<BigInt>} array
 * @param {BigInt} value
 * @return
 *  -1 if no element greater then given value.
function minIndexOfAmountGreaterThen(array, value) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element > value) return i;
  }
  return -1;
}
 */
/**
 * Retuen any + '', but alt if any is null or undefined.
 * @param {*} any
 * @param {*} def
 * @returns
 */
function toDefaultString(any, def) {
  return any ? any + '' : def;
}
/**
 * Furoma Rift Automation.
 */
function fRift() {
  const targetEnvironmentType = 'rift_furoma';
  if (getEnvironmentType() !== targetEnvironmentType) return;
  // 根據 location修改 defaultBait,且僅作用於 javascript,不修改 localStorage.
  defaultBait = 'Brie String';
  const defaultSettings = {
    enter: 0,
    enterAfterTime: '',
    enterBeforeTime: '',
    autoFix: 'false',
    leave: 0,
    travelTo: '',
    retreat: 0,
    preservedCheeseQty: [1, 1, 1, 1, 1, 1, 1],
    weapon: new Array(11).fill('best.weapon.rift'),
    base: new Array(11).fill('best.base.rift'),
    trinket: new Array(11).fill('Rift Vacuum Charm'),
    bait: new Array(11).fill('Brie String'),
    masterOrder: new Array(11).fill('Glutter=>Combat=>Susheese')
  };
  const settings = MyUtils.getStorageToObject(
    targetEnvironmentType,
    defaultSettings
  );
  const quest = user.quests.QuestRiftFuroma;
  const questBatteries = quest.batteries;
  // battery status are locked/unlocked
  const allBatteryRepaired =
    questBatteries.charge_level_ten.status.indexOf('unlocked') > -1;
  /**
   * Find lack of battery fragment for repairing.
   * Return Number.MAX_SAFE_INTEGER if all repaired.
   * @return {BigInt}
   * Lack of battery fragment for repairing.
   * Number.MAX_SAFE_INTEGER if all repaired.
   */
  function batteryFragmentLack() {
    let fragLack = Number.MAX_SAFE_INTEGER;
    if (allBatteryRepaired) return fragLack;
    const batteries = [];
    batteries.push(questBatteries.charge_level_one);
    batteries.push(questBatteries.charge_level_two);
    batteries.push(questBatteries.charge_level_three);
    batteries.push(questBatteries.charge_level_four);
    batteries.push(questBatteries.charge_level_five);
    batteries.push(questBatteries.charge_level_six);
    batteries.push(questBatteries.charge_level_seven);
    batteries.push(questBatteries.charge_level_eight);
    batteries.push(questBatteries.charge_level_nine);
    batteries.push(questBatteries.charge_level_ten);
    const fragmentRequirement = [-1, 2, 8, 18, 30, 90, 200, 400, 700, 1000];
    for (let i = 0; i < batteries.length; i++) {
      const battery = batteries[i];
      if (battery.status.indexOf('cannot_unlock') > -1) {
        console.log('Repairing battery', i + 1);
        fragLack =
          fragmentRequirement[i] -
          MyUtils.parseQuantity(
            quest.items.rift_battery_piece_crafting_item.quantity
          );
        console.log(fragLack);
        break;
      }
    }
    return fragLack;
  }
  // auto fix
  if (settings.autoFix == 'true' && !allBatteryRepaired) {
    console.log('There are locked batteries.');
    const canUnlock = document.querySelector(
      '.riftFuromaHUD-battery.can_unlock'
    );
    if (canUnlock) {
      console.log('There is battery which can unlock.');
      canUnlock.click();
      setTimeout(() => {
        console.log('After click fix for 2 seconds, try to click confirm.');
        const obj = document.getElementsByClassName(
          'mousehuntActionButton confirm'
        )[2];
        if (obj.offsetWidth > 0 && obj.offsetHeight > 0) obj.click();
        console.log('After confirmed, re-execute fRift().');
        setTimeout(() => {
          fRift();
        }, 1000);
      }, 2000);
      return;
    }
  }
  settings.enter = parseInt(settings.enter);
  settings.retreat = parseInt(settings.retreat);
  settings.leave = parseInt(settings.leave);
  const travelTo = MyUtils.trimToEmpty(settings.travelTo);
  console.plog(quest.view_state);
  const isInPagoda =
    quest.view_state == 'pagoda' || quest.view_state == 'pagoda knows_all';
  let i;
  if (isInPagoda) {
    let nowBatteryLevel = 0;
    const remainingEnergy = MyUtils.parseQuantity(quest.droid.remaining_energy);
    if (remainingEnergy === 0) {
      console.plog('In pagoda, remaining energy cannot be zero!!!');
      return;
    }
    for (i = objFRBattery.cumulative.length - 1; i >= 0; i--) {
      const cumulative = objFRBattery.cumulative[i];
      if (remainingEnergy <= cumulative) nowBatteryLevel = i + 1;
      else break;
    }
    console.plog(
      `In Pagoda, Current Battery Level: ${nowBatteryLevel}, Remaining Energy: ${remainingEnergy}`
    );
    if (travelTo !== '' && nowBatteryLevel <= settings.leave) {
      pauseByTraveling(travelTo);
      return;
    }
    // auto isStaggerHornCheck
    if (nowBatteryLevel < 7) MhUtils.isStaggerHornCheck = false;
    else MhUtils.isStaggerHornCheck = true;
    if (nowBatteryLevel <= settings.retreat) {
      // battery 1-3有機會拿到 11個 fragment(AEIB double),值得拚一把
      if (settings.retreat == 3 && batteryFragmentLack() < 23) {
        fRiftArmTrap(settings, nowBatteryLevel);
        return;
      }
      fRiftArmTrap(settings, 0);
      if (nowBatteryLevel !== 0) {
        // retreat
        fireEvent(
          document.getElementsByClassName('riftFuromaHUD-leavePagoda')[0],
          'click'
        );
        window.setTimeout(function () {
          MhUtils.updateGPWStats();
          fireEvent(
            document.getElementsByClassName('mousehuntActionButton confirm')[0],
            'click'
          );
        }, 1500);
      }
      return;
    }
    fRiftArmTrap(settings, nowBatteryLevel);
    return;
  }
  console.log('In Training Ground');
  // auto isStaggerHornCheck
  MhUtils.isStaggerHornCheck = false;
  const unlockedBattery = document.getElementsByClassName(
    'riftFuromaHUD-battery unlocked'
  );
  const unlockedBatteryLevel = unlockedBattery.length;
  if (unlockedBatteryLevel < 1) {
    logging('No battery unlocked!! There is one by default!!');
    return;
  }
  let fullBatteryLevel = 0;
  const storedEnerchi = parseInt(
    document
      .getElementsByClassName('total_energy')[0]
      .children[1].innerText.replace(/,/g, '')
  );
  if (Number.isNaN(storedEnerchi)) {
    console.plog('Stored Enerchi:', storedEnerchi);
    return;
  }
  for (i = 0; i < objFRBattery.cumulative.length; i++) {
    const cumulative = objFRBattery.cumulative[i];
    if (storedEnerchi >= cumulative) fullBatteryLevel = i + 1;
    else break;
  }
  console.plog(
    `Fully Charged Battery Level: ${fullBatteryLevel}, Stored Enerchi: ${storedEnerchi}`
  );
  console.log(`塔外 leave battery level只處理負數: ${settings.leave}`);
  if (
    travelTo !== '' &&
    settings.leave <= 0 &&
    -fullBatteryLevel <= settings.leave
  ) {
    pauseByTraveling(travelTo);
    return;
  }
  const enterLevel =
    settings.enter > unlockedBatteryLevel
      ? unlockedBatteryLevel
      : settings.enter;
  const enterAfter = MyUtils.parseDateTime(settings.enterAfterTime);
  const enterBefore = MyUtils.parseDateTime(settings.enterBeforeTime);
  const now = Date.now();
  console.log(
    `now: ${now}, enterAfter: ${enterAfter}, enterBefore: ${enterBefore}`
  );
  if (
    Number.isInteger(settings.enter) &&
    fullBatteryLevel >= enterLevel &&
    (!enterAfter || now > enterAfter) &&
    (!enterBefore || now < enterBefore)
  ) {
    fRiftArmTrap(settings, enterLevel);
    // enter
    fireEvent(unlockedBattery[enterLevel - 1], 'click');
    window.setTimeout(function () {
      MhUtils.updateGPWStats();
      fireEvent(
        document.getElementsByClassName('mousehuntActionButton confirm')[0],
        'click'
      );
    }, 1500);
    return;
  }
  fRiftArmTrap(settings, 0);
}
/**
 * Firstly arm weapon/base/trinket
 * and then handle bait arming.
 * When bait setup is BALANCE_MASTER,
 * it have to invoke self and at this moment
 * weapon/base/trinket should not be armed again.
 * @param {*} settings FRift setup
 * @param {BigInt} nIndex Current battery level
 * @param {Boolean} isArmBaitOnly
 *   If arm bait only. fRiftArmTrap is self-invoking function
 *   and should not always arm weapon/base/trinket
 * @param {Boolean} isReadJournal
 *   If read journal and save to localStorage as LastRecordedJournalFRift
 */
function fRiftArmTrap(settings, nIndex, isArmBaitOnly, isReadJournal) {
  const quest = user.quests.QuestRiftFuroma;
  const items = quest.items;
  const cheeseQty = [
    MyUtils.parseQuantity(items.rift_master_cheese.quantity),
    MyUtils.parseQuantity(items.rift_glutter_cheese.quantity),
    MyUtils.parseQuantity(items.rift_combat_cheese.quantity),
    MyUtils.parseQuantity(items.rift_susheese.quantity),
    MyUtils.parseQuantity(items.rift_rumble_cheese.quantity),
    MyUtils.parseQuantity(items.rift_onyx_cheese.quantity),
    MyUtils.parseQuantity(items.rift_hapless_cheese.quantity)
  ];
  const cheeseNames = [
    'Master Fusion',
    'Rift Glutter',
    'Rift Combat',
    'Rift Susheese',
    'Rift Rumble',
    'Null Onyx Gorgonzola',
    'Ascended Cheese'
  ];
  let weaponName = settings.weapon[nIndex];
  let baseName = settings.base[nIndex];
  let charmName = settings.trinket[nIndex];
  if (isNullOrUndefined(isReadJournal)) isReadJournal = true;
  const removeLowQtyCheese = (cheeseNameArray) => {
    // 任何 cheese當數量不足時,把設定中的該 cheese全部移除
    for (let i = 0; i < cheeseQty.length; i++) {
      if (cheeseQty[i] <= settings.preservedCheeseQty[i]) {
        const cheeseName = cheeseNames[i];
        while (cheeseNameArray.indexOf(cheeseName) > -1)
          cheeseNameArray.splice(cheeseNameArray.indexOf(cheeseName), 1);
      }
    }
    // if (arr.length == 0) arr.push('Brie String');
  };
  // if (isNullOrUndefined(isArmBaitOnly)) isArmBaitOnly = false;
  if (settings.bait[nIndex] == 'ANY_MASTER')
    checkThenArm('any', 'bait', 'ANY_MASTER');
  else if (settings.bait[nIndex] == 'ORDER_MASTER') {
    let arr = settings.masterOrder[nIndex].split('=>');
    arr = arr.map(function (e) {
      return 'Rift ' + e;
    });
    checkThenArm('best', 'bait', arr);
  } else if (settings.bait[nIndex] == 'CYCLIC_MASTER') {
    let s = localStorage.getItem('cyclingMaster');
    let arr = [cheeseNames[1], cheeseNames[2], cheeseNames[3]];
    if (s && s != '') arr = JSON.parse(s);
    if (arr.indexOf(cheeseNames[0]) > -1)
      while (arr.indexOf(cheeseNames[0]) > -1)
        arr.splice(arr.indexOf(cheeseNames[0]), 1);
    if (arr.indexOf(cheeseNames[4]) > -1)
      while (arr.indexOf(cheeseNames[4]) > -1)
        arr.splice(arr.indexOf(cheeseNames[4]), 1);
    // 初始還原成 3種 Master Cheese
    if (
      !(
        arr.length == 3 &&
        arr.indexOf(cheeseNames[1]) > -1 &&
        arr.indexOf(cheeseNames[2]) > -1 &&
        arr.indexOf(cheeseNames[3]) > -1
      )
    ) {
      const first = arr[0];
      arr = [cheeseNames[1], cheeseNames[2], cheeseNames[3]];
      if (arr.indexOf(first) > -1)
        while (arr.indexOf(first) != 0) {
          arr.push(arr.shift());
        }
    }
    // arr只做 cyclingMaster的循環紀錄用.增減操作跟 arm用 copy進行
    // 這樣就不會破壞 localStorage.cyclingMaster的 3 Master循環特徵
    const copy = arr.slice();
    // removeLowQtyCheese最後會是空陣列,寫入 cyclingMaster的話會沒有任何 Master cheese
    removeLowQtyCheese(copy);
    // 所有 cheese都小於等於保留數量時是空陣列,改用 Brie String
    if (copy.length == 0) {
      copy.push('Brie String');
      // 如果改用 Brie String,用 battery 6的 charm
      charmName = settings.trinket[6];
    } else {
      copy.push(copy.shift());
      if (arr.indexOf(copy[0]) > -1)
        while (arr.indexOf(copy[0]) != 0) {
          arr.push(arr.shift());
        }
      setStorage('cyclingMaster', JSON.stringify(arr));
    }
    checkThenArm('best', 'bait', copy);
  } else if (settings.bait[nIndex] == 'CYCLIC_MASTER_ALL') {
    let s = localStorage.getItem('cyclingMaster');
    let arr = [cheeseNames[0], cheeseNames[1], cheeseNames[2], cheeseNames[3]];
    if (s && s != '') arr = JSON.parse(s);
    if (arr.indexOf(cheeseNames[4]) > -1)
      while (arr.indexOf(cheeseNames[4]) > -1)
        arr.splice(arr.indexOf(cheeseNames[4]), 1);
    // 初始還原成 4種 Master Cheese
    if (
      !(
        arr.length == 4 &&
        arr.indexOf(cheeseNames[0]) > -1 &&
        arr.indexOf(cheeseNames[1]) > -1 &&
        arr.indexOf(cheeseNames[2]) > -1 &&
        arr.indexOf(cheeseNames[3]) > -1
      )
    ) {
      const first = arr[0];
      arr = [cheeseNames[0], cheeseNames[1], cheeseNames[2], cheeseNames[3]];
      if (arr.indexOf(first) > -1)
        while (arr.indexOf(first) != 0) {
          arr.push(arr.shift());
        }
    }
    // arr只做 cyclingMaster的循環紀錄用.增減操作跟 arm用 copy進行
    // 這樣就不會破壞 localStorage.cyclingMaster的 3 Master循環特徵
    const copy = arr.slice();
    // removeLowQtyCheese最後會是空陣列,寫入 cyclingMaster的話會沒有任何 Master cheese
    removeLowQtyCheese(copy);
    // 所有 cheese都小於等於保留數量時是空陣列,改用 Brie String
    if (copy.length == 0) {
      copy.push('Brie String');
      // 如果改用 Brie String,用 battery 6的 charm
      charmName = settings.trinket[6];
    } else {
      copy.push(copy.shift());
      if (arr.indexOf(copy[0]) > -1)
        while (arr.indexOf(copy[0]) != 0) {
          arr.push(arr.shift());
        }
      setStorage('cyclingMaster', JSON.stringify(arr));
    }
    checkThenArm('best', 'bait', copy);
  } else if (settings.bait[nIndex] == 'RUMBLE_MASTER') {
    let s = localStorage.getItem('cyclingMaster');
    const defaultArr = [
      cheeseNames[4],
      cheeseNames[1],
      cheeseNames[4],
      cheeseNames[2],
      cheeseNames[4],
      cheeseNames[3]
    ];
    let arr = defaultArr;
    if (s && s != '') arr = JSON.parse(s);
    // Rumble數量夠時一定要用標準形式
    if (
      !(
        arr.length == 6 &&
        arr.indexOf(cheeseNames[1]) > -1 &&
        arr.indexOf(cheeseNames[2]) > -1 &&
        arr.indexOf(cheeseNames[3]) > -1 &&
        countArrayElement(cheeseNames[4], arr) === 3
      )
    ) {
      if (cheeseQty[4] > settings.preservedCheeseQty[4]) {
        const first = arr[0];
        arr = defaultArr;
        if (arr.indexOf(first) > -1)
          while (arr.indexOf(first) != 0) {
            arr.push(arr.shift());
          }
      }
    }
    removeLowQtyCheese(arr);
    // 所有 cheese都小於等於保留數量時是空陣列,改用 Brie String
    // 只是以防萬一,RUMBLE_MASTER不應該發生這種情形, cheese事先要準備夠
    if (arr.length == 0) {
      arr.push('Brie String');
      // 如果改用 Brie String,用 battery 6的 charm
      charmName = settings.trinket[6];
    } else {
      arr.push(arr.shift());
      setStorage('cyclingMaster', JSON.stringify(arr));
    }
    checkThenArm('best', 'bait', arr);
    // cycle後才判斷是否當前裝備 Rumble
    if (arr[0].indexOf(cheeseNames[4]) == 0) charmName = settings.trinket[9];
  } else if (settings.bait[nIndex] == 'BALANCE_MASTER') {
    if (g_arrHeirloom.length === 0) {
      let nRetry = 4;
      // let bFirst = true;
      let intervalFRAT = setInterval(function () {
        if (
          document.getElementsByClassName(
            'riftFuromaHUD-craftingPopup-tabContent pinnacle'
          ).length > 0
        ) {
          fireEvent(
            document.getElementsByClassName(
              'riftFuromaHUD-craftingPopup-tabHeader'
            )[3],
            'click'
          ); // close rift rumble crafting tab
          let classPinnacle = document.getElementsByClassName(
            'riftFuromaHUD-craftingPopup-tabContent pinnacle'
          );
          let i, temp;
          for (i = 0; i < 3; i++) {
            temp = classPinnacle[0].getElementsByClassName(
              'riftFuromaHUD-craftingPopup-recipe-part'
            )[i];
            g_arrHeirloom.push(parseInt(temp.getAttribute('data-part-owned')));
            if (Number.isNaN(g_arrHeirloom[i])) {
              console.plog('Invalid Heirloom:', g_arrHeirloom);
              checkThenArm('any', 'bait', 'ANY_MASTER');
              clearInterval(intervalFRAT);
              intervalFRAT = null;
              return;
            }
          }
          if (g_arrHeirloom.length != 3) {
            console.plog('Invalid length:', g_arrHeirloom);
            checkThenArm('any', 'bait', 'ANY_MASTER');
            clearInterval(intervalFRAT);
            intervalFRAT = null;
            return;
          }
          setStorage(
            'LastRecordedJournalFRift',
            document.getElementsByClassName('journaltext')[0].parentNode
              .textContent
          );
          fRiftArmTrap(settings, nIndex, true, false);
          clearInterval(intervalFRAT);
          intervalFRAT = null;
        } else {
          // open rift rumble crafting tab to get quantities of heirlooms
          fireEvent(
            document.getElementsByClassName(
              'riftFuromaHUD-itemGroup-craftButton'
            )[3],
            'click'
          );
          --nRetry;
          if (nRetry <= 0) {
            console.plog('Max Retry, arm any Rift Master Cheese');
            checkThenArm('any', 'bait', 'ANY_MASTER');
            clearInterval(intervalFRAT);
            intervalFRAT = null;
          }
        }
      }, 1000);
    } else {
      if (isReadJournal === true) getJournalDetailFRift();
      console.plog('Heirloom:', g_arrHeirloom);
      let arrBait = g_objConstTrap.bait.ANY_MASTER.name;
      let nMin = min(g_arrHeirloom);
      let fAvg = average(g_arrHeirloom);
      if (fAvg == nMin) {
        checkThenArm('any', 'bait', 'ANY_MASTER');
      } else {
        temp = minIndex(g_arrHeirloom);
        if (temp > -1) {
          let arrBaitNew = [];
          let objSort = sortWithIndices(g_arrHeirloom);
          for (i = 0; i < objSort.index.length; i++) {
            arrBaitNew[i] = arrBait[objSort.index[i]];
          }
          console.plog('New Bait List:', arrBaitNew);
          checkThenArm('best', 'bait', arrBaitNew);
        } else {
          console.plog('Invalid index:', temp);
          checkThenArm('any', 'bait', 'ANY_MASTER');
        }
      }
    }
  } else {
    let baitName = settings.bait[nIndex];
    const index = cheeseNames.indexOf(baitName);
    if (index > -1)
      if (cheeseQty[index] <= settings.preservedCheeseQty[index])
        baitName = 'Brie String';
    checkThenArm(null, 'bait', baitName);
  }
  if (!isArmBaitOnly) {
    checkThenArm(null, 'weapon', parseTrapName(weaponName));
    checkThenArm(null, 'base', parseTrapName(baseName));
    checkThenArm(null, 'trinket', parseTrapName(charmName));
  }
}
/**
 * 這個功能應該是在 camp點 trap effectiveness後,
 * 擷取 popup中的 mouses.
 */
function retrieveMouseList() {
  fireEvent(document.getElementById('effectiveness'), 'click');
  let sec = secWait;
  const intervalRML = setInterval(function () {
    if (document.getElementsByClassName('thumb').length > 0) {
      mouseList = [];
      const y = document.getElementsByClassName('thumb');
      for (let i = 0; i < y.length; ++i) {
        mouseList.push(y[i].getAttribute('title'));
      }
      fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
      clearInterval(intervalRML);
      intervalRML = null;
      return;
    } else {
      --sec;
      if (sec <= 0) {
        fireEvent(document.getElementById('effectiveness'), 'click');
        sec = secWait;
      }
    }
  }, 1000);
  return;
}
/**
 * 檢查 mouseList(透過 retrieveMouseList更新)中是否存在指定的 mouseName
 * @param {string} mouseName
 * @returns
 */
function checkMouse(mouseName) {
  for (let i = 0; i < mouseList.length; ++i) {
    if (mouseList[i].indexOf(mouseName) > -1) {
      return true;
    }
    return false;
  }
}
// GWH
function Winter2015() {
  let currentLocation = getPageVariable('user.environment_name');
  logging(currentLocation);
  if (currentLocation.indexOf('Extreme Toboggan Challenge') > -1) {
    let inRun =
      document
        .getElementById('hudLocationContent')
        .firstChild.className.indexOf('on_course') > -1;
    if (inRun) {
      checkThenArm('best', 'bait', ['Arctic Asiago', 'Gingerbread']);
    } else {
      checkThenArm(null, 'bait', 'Gouda', 'disarm');
    }
  }
}

function gwh2016() {
  if (getCurrentLocation().indexOf('Great Winter Hunt') < 0) return;

  let userVariable = JSON.parse(
    getPageVariable('JSON.stringify(user.quests.QuestWinterHunt2016)')
  );
  let objDefaultGWH2016 = {
    zone: [
      'ORDER1',
      'ORDER2',
      'NONORDER1',
      'NONORDER2',
      'WINTER_WASTELAND',
      'SNOWBALL_STORM',
      'FLYING',
      "NEW_YEAR'S_PARTY"
    ],
    weapon: new Array(8).fill(''),
    base: new Array(8).fill(''),
    trinket: new Array(8).fill(''),
    bait: new Array(8).fill(''),
    boost: new Array(8).fill(false),
    turbo: false,
    minAAToFly: 20,
    minFireworkToFly: 20,
    landAfterFireworkRunOut: false
  };
  let objGWH = getStorageToObject('GWH2016R', objDefaultGWH2016);
  let i, j, nLimit, strTemp, nIndex, nIndexTemp;
  let bCanFly = false;
  let nAAQuantity = parseInt(
    document.getElementsByClassName(
      'winterHunt2016HUD-featuredItem-quantity'
    )[0].textContent
  );
  let nFireworkQuantity = parseInt(
    document.getElementsByClassName('winterHunt2016HUD-fireworks-quantity')[0]
      .textContent
  );
  if (userVariable.order_progress >= 10) {
    // can fly
    bCanFly = true;
    console.plog(
      'Order Progress:',
      userVariable.order_progress,
      'AA Quantity:',
      nAAQuantity,
      'Firework Quantity:',
      nFireworkQuantity
    );
    if (
      nAAQuantity >= objGWH.minAAToFly &&
      nFireworkQuantity >= objGWH.minFireworkToFly
    ) {
      fireEvent(
        document.getElementsByClassName('winterHunt2016HUD-flightButton')[0],
        'click'
      );
      userVariable.status = 'flying';
    }
  }
  if (userVariable.status == 'flying') {
    if (nFireworkQuantity < 1 && objGWH.landAfterFireworkRunOut === true) {
      console.plog('Landing');
      fireEvent(
        document.getElementsByClassName(
          'winterHunt2016HUD-landButton mousehuntTooltipParent mousehuntActionButton tiny'
        )[0],
        'click'
      );
      window.setTimeout(function () {
        fireEvent(
          document.getElementsByClassName(
            'mousehuntActionButton small winterHunt2016HUD-help-action-land active'
          )[0],
          'click'
        );
      }, 1500);
      window.setTimeout(function () {
        eventLocationCheck('gwh');
      }, 5000);
      return;
    }
    console.plog('Flying');
    nIndex = objGWH.zone.indexOf('FLYING');
    checkThenArm(null, 'weapon', objGWH.weapon[nIndex]);
    checkThenArm(null, 'base', objGWH.base[nIndex]);
    checkThenArm(null, 'trinket', objGWH.trinket[nIndex]);
    if (objGWH.bait[nIndex].indexOf('ANY') > -1 && nAAQuantity > 0)
      checkThenArm(null, 'bait', 'Arctic Asiago');
    else checkThenArm(null, 'bait', objGWH.bait[nIndex]);
    if (objGWH.boost[nIndex] === true) {
      let nNitroQuantity = parseInt(
        document.getElementsByClassName('winterHunt2016HUD-sledDetail')[2]
          .textContent
      );
      console.plog('Nitro Quantity:', nNitroQuantity);
      if (Number.isNaN(nNitroQuantity) || nNitroQuantity < 1) return;
      if (objGWH.turbo && nNitroQuantity >= 3)
        fireEvent(
          document.getElementsByClassName(
            'winterHunt2016HUD-nitroButton-boundingBox'
          )[3],
          'click'
        );
      else
        fireEvent(
          document.getElementsByClassName(
            'winterHunt2016HUD-nitroButton-boundingBox'
          )[2],
          'click'
        );
    } else {
      if (userVariable.speed > 800) {
        // disable nitro when flying
        console.plog('Disable nitro, Current Speed:', userVariable.speed);
        fireEvent(
          document.getElementsByClassName(
            'winterHunt2016HUD-nitroButton-boundingBox'
          )[1],
          'click'
        );
      }
    }
    return;
  }
  let objOrderTemplate = {
    type: 'none',
    tier: 1,
    progress: 0
  };
  let arrOrder = [];
  let arrType = ['decoration', 'ski', 'toy'];
  for (i = 0; i < userVariable.orders.length; i++) {
    arrOrder.push(JSON.parse(JSON.stringify(objOrderTemplate)));
    for (j = 0; j < arrType.length; j++) {
      if (userVariable.orders[i].item_type.indexOf(arrType[j]) > -1) {
        arrOrder[i].type = arrType[j];
        break;
      }
    }
    if (userVariable.orders[i].item_type.indexOf('_one_') > -1)
      arrOrder[i].tier = 1;
    else arrOrder[i].tier = 2;
    arrOrder[i].progress = userVariable.orders[i].progress;
    if (arrOrder[i].progress >= 100 && !bCanFly) {
      console.plog(
        'Order No:',
        i,
        'Type:',
        arrOrder[i].type,
        'Tier:',
        arrOrder[i].tier,
        'Progress:',
        arrOrder[i].progress
      );
      fireEvent(
        document.getElementsByClassName('winterHunt2016HUD-order-action')[i],
        'click'
      );
      window.setTimeout(function () {
        eventLocationCheck('gwh');
      }, 5000);
      return;
    }
  }
  console.plog(arrOrder);

  let objZoneTemplate = {
    name: '',
    depth: 0,
    isOrderZone: false,
    type: 'none',
    tier: 1,
    codename: ''
  };
  let arrZone = [];
  let nIndexActive = -1;
  for (i = userVariable.sprites.length - 1; i >= 0; i--) {
    if (userVariable.sprites[i].css_class.indexOf('active') > -1) {
      // current zone
      nIndexActive = i;
      break;
    }
  }
  if (nIndexActive < 0) return;
  nLimit = nIndexActive + 2;
  if (nLimit >= userVariable.sprites.length)
    nLimit = userVariable.sprites.length - 1;
  for (i = nIndexActive; i <= nLimit; i++) {
    nIndex = i - nIndexActive;
    arrZone.push(JSON.parse(JSON.stringify(objZoneTemplate)));
    nIndexTemp = userVariable.sprites[i].name.indexOf('(');
    arrZone[nIndex].name = userVariable.sprites[i].name.substr(
      0,
      nIndexTemp - 1
    );
    if (
      arrZone[nIndex].name == 'Toy Lot' ||
      arrZone[nIndex].name == 'Toy Emporium'
    )
      arrZone[nIndex].type = 'toy';
    else if (
      arrZone[nIndex].name == 'Decorative Oasis' ||
      arrZone[nIndex].name == 'Tinsel Forest'
    )
      arrZone[nIndex].type = 'decoration';
    else if (
      arrZone[nIndex].name == 'Bunny Hills' ||
      arrZone[nIndex].name == 'Frosty Mountains'
    )
      arrZone[nIndex].type = 'ski';
    arrZone[nIndex].tier =
      userVariable.sprites[i].css_class.indexOf('tier_two') > -1 ? 2 : 1;
    for (j = 0; j < arrOrder.length; j++) {
      if (
        arrOrder[j].type == arrZone[nIndex].type &&
        arrOrder[j].tier <= arrZone[nIndex].tier
      ) {
        arrZone[nIndex].isOrderZone = true;
        break;
      }
    }
    if (arrZone[nIndex].type == 'none') {
      arrZone[nIndex].codename = arrZone[nIndex].name
        .toUpperCase()
        .replace(/ /g, '_');
    } else {
      if (arrZone[nIndex].isOrderZone)
        arrZone[nIndex].codename = 'ORDER' + arrZone[nIndex].tier;
      else arrZone[nIndex].codename = 'NONORDER' + arrZone[nIndex].tier;
    }
    arrZone[nIndex].depth = parseInt(
      userVariable.sprites[i].name.substr(nIndexTemp + 1, 5)
    );
  }
  console.plog(arrZone);

  let nIndexZone = objGWH.zone.indexOf(arrZone[0].codename);
  if (nIndexZone < 0) return;
  checkThenArm(null, 'weapon', objGWH.weapon[nIndexZone]);
  checkThenArm(null, 'base', objGWH.base[nIndexZone]);
  checkThenArm(null, 'trinket', objGWH.trinket[nIndexZone]);
  if (objGWH.bait[nIndexZone].indexOf('ANY') > -1 && nAAQuantity > 0)
    checkThenArm(null, 'bait', 'Arctic Asiago');
  else checkThenArm(null, 'bait', objGWH.bait[nIndexZone]);
  if (objGWH.boost[nIndexZone] === true) {
    let nNitroQuantity = parseInt(
      document.getElementsByClassName('winterHunt2016HUD-sledDetail')[2]
        .textContent
    );
    console.plog('Nitro Quantity:', nNitroQuantity);
    if (Number.isNaN(nNitroQuantity) || nNitroQuantity < 1) return;
    let nTotalMetersRemaining = parseInt(userVariable.meters_remaining);
    for (i = 1; i < arrZone.length; i++) {
      nIndexZone = objGWH.zone.indexOf(arrZone[i].codename);
      if (nIndexZone < 0) continue;
      if (objGWH.boost[nIndexZone] === true)
        nTotalMetersRemaining += arrZone[i].depth;
      else break;
    }
    console.plog(
      'Boost Distance:',
      nTotalMetersRemaining,
      'Turbo:',
      objGWH.turbo
    );
    let fTemp = nTotalMetersRemaining / 250;
    let nLevel = Math.floor(fTemp);
    if (nLevel - fTemp >= 0.92)
      // because 230/250 = 0.92
      nLevel++;
    if (nLevel == 1) {
      // normal boost
      fireEvent(
        document.getElementsByClassName(
          'winterHunt2016HUD-nitroButton-boundingBox'
        )[2],
        'click'
      );
    } else if (nLevel > 1) {
      if (objGWH.turbo && nNitroQuantity >= 3)
        fireEvent(
          document.getElementsByClassName(
            'winterHunt2016HUD-nitroButton-boundingBox'
          )[3],
          'click'
        );
      else
        fireEvent(
          document.getElementsByClassName(
            'winterHunt2016HUD-nitroButton-boundingBox'
          )[2],
          'click'
        );
    } else if (nLevel < 1 && userVariable.speed > 30) {
      console.plog('Disable nitro, Current Speed:', userVariable.speed);
      fireEvent(
        document.getElementsByClassName(
          'winterHunt2016HUD-nitroButton-boundingBox'
        )[1],
        'click'
      );
    }
  } else {
    if (userVariable.speed > 30) {
      // disable nitro in order zone
      console.plog('Disable nitro, Current Speed:', userVariable.speed);
      fireEvent(
        document.getElementsByClassName(
          'winterHunt2016HUD-nitroButton-boundingBox'
        )[1],
        'click'
      );
    }
  }
}

// For easter event
function checkCharge2016(stopDischargeAt) {
  try {
    let charge = parseInt(
      document.getElementsByClassName('springHuntHUD-charge-quantity')[0]
        .innerText
    );
    let isDischarge = getStorage('discharge') == 'true';
    console.plog(
      'Current Charge:',
      charge,
      'Discharging:',
      isDischarge,
      'Stop Discharge At:',
      stopDischargeAt
    );
    let charmContainer = document.getElementsByClassName(
      'springHuntHUD-charmContainer'
    )[0];
    let eggstra = {};
    eggstra.quantity = parseInt(
      charmContainer.children[0].children[0].innerText
    );
    eggstra.link = charmContainer.children[0].children[1];
    eggstra.isArmed = eggstra.link.getAttribute('class').indexOf('active') > 0;
    eggstra.canArm = eggstra.quantity > 0 && !eggstra.isArmed;
    let eggstraCharge = {};
    eggstraCharge.quantity = parseInt(
      charmContainer.children[1].children[0].innerText
    );
    eggstraCharge.link = charmContainer.children[1].children[1];
    eggstraCharge.isArmed =
      eggstraCharge.link.getAttribute('class').indexOf('active') > 0;
    eggstraCharge.canArm = eggstraCharge.quantity > 0 && !eggstraCharge.isArmed;
    let eggscavator = {};
    eggscavator.quantity = parseInt(
      charmContainer.children[2].children[0].innerText
    );
    eggscavator.link = charmContainer.children[2].children[1];
    eggscavator.isArmed =
      eggscavator.link.getAttribute('class').indexOf('active') > 0;
    eggscavator.canArm = eggscavator.quantity > 0 && !eggscavator.isArmed;

    if (charge == 20) {
      checkThenArm(['eggstra', 'disarm'], 'best', 'trinket');
      if (eggstra.canArm) fireEvent(eggstra.link, 'click');
    } else if (charge < 20 && charge > stopDischargeAt) {
      if (isDischarge) {
        if (eggstra.canArm) fireEvent(eggstra.link, 'click');
      } else {
        if (charge >= chargeHigh) {
          if (eggstraCharge.quantity > 0) {
            if (!eggstraCharge.isArmed) fireEvent(eggstraCharge.link, 'click');
          } else {
            if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
          }
        } else {
          if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
        }
      }
    } else if (charge <= stopDischargeAt) {
      if (charge >= chargeHigh) {
        if (eggstraCharge.quantity > 0) {
          if (!eggstraCharge.isArmed) fireEvent(eggstraCharge.link, 'click');
        } else {
          if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
        }
      } else {
        if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
      }
      setStorage('discharge', 'false');
    }
  } catch (e) {
    console.perror('checkCharge2016', e.message);
  }
}

function checkCharge(stopDischargeAt) {
  try {
    let charge = parseInt(
      document.getElementsByClassName('chargeQuantity')[0].innerText
    );
    console.plog('Current Charge:', charge);
    if (charge == 20) {
      setStorage('discharge', true.toString());
      checkThenArm(null, 'trinket', 'Eggstra Charm');
    } else if (charge < 20 && charge > stopDischargeAt) {
      if (getStorage('discharge') == 'true') {
        checkThenArm(null, 'trinket', 'Eggstra Charm');
      } else {
        if (stopDischargeAt == 17) {
          checkThenArm('best', 'trinket', chargeCharm);
        } else {
          checkThenArm(null, 'trinket', 'Eggscavator');
        }
      }
    } else if (charge == stopDischargeAt) {
      if (stopDischargeAt == 17) {
        checkThenArm('best', 'trinket', chargeCharm);
      } else {
        checkThenArm(null, 'trinket', 'Eggscavator');
      }
      setStorage('discharge', false.toString());
    } else if (charge < stopDischargeAt) {
      setStorage('discharge', false.toString());
      checkThenArm(null, 'trinket', 'Eggscavator');
    }
    return;
  } catch (e) {
    console.perror('checkCharge', e.message);
  }
}

/* function buildTrapList(afterBuilding, failedBuilding) {
  logging('running buildTrapList()');
  let returning;
  //clickTrapSelector(category);
  try {
    let userHash = getPageVariable('user.unique_hash');

    nobAjaxPost(
      '/managers/ajax/users/gettrapcomponents.php',
      {
        uh: userHash
      },
      function (data) {
        NOBtraps = data.components;
        logging(NOBtraps);
        nobStore(NOBtraps, 'traps');
        returning = true;
        afterBuilding();
      },
      function (error) {
        logging('BuildTrapList ajax error: ' + error);
        returning = false;
        failedBuilding();
      }
    );
  } catch (e) {
    logging('BuildTrapList try error: ' + e);
  } finally {
    //clickTrapSelector(category);
    return returning;
  }
} */

/**
 * 將儲存在 localStorage的現有裝備清單(
 * TrapListCategory,
 * Category=Weapon/Base/Bait/Trinket)
 * 載入到 objTrapList物件.
 * @param {String} category
 */
function getTrapList(category) {
  let temp = '';
  let arrObjList;
  if (category === null || category === undefined)
    arrObjList = Object.keys(objTrapList);
  else arrObjList = [category];

  for (let i = 0; i < arrObjList.length; i++) {
    temp = getStorageToVariableStr(
      'TrapList' + capitalizeFirstLetter(arrObjList[i]),
      ''
    );
    if (temp === '') {
      objTrapList[arrObjList[i]] = [];
    } else {
      try {
        objTrapList[arrObjList[i]] = temp.split(',');
      } catch (e) {
        objTrapList[arrObjList[i]] = [];
      }
    }
  }
}

/*
const testopen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  this.addEventListener('load', async function () {
    if (
      this.responseURL ==
      `https://www.mousehuntgame.com/managers/ajax/users/marketplace.php`
    ) {
      // logging('detected');
    }
  });
  testopen.apply(this, arguments);
};
*/

function clearTrapList(category) {
  let arrObjList;
  if (category === null || category === undefined)
    arrObjList = Object.keys(objTrapList);
  else arrObjList = [category];

  for (let i = 0; i < arrObjList.length; i++) {
    removeStorage('TrapList' + capitalizeFirstLetter(arrObjList[i]));
    objTrapList[arrObjList[i]] = [];
  }
}

/**
 * Capitalize first letter.
 * @param {String} strIn
 * @return new string equalsIgnoreCase to argument
 *  but first letter capitalized.
 */
function capitalizeFirstLetter(strIn) {
  return strIn.charAt(0).toUpperCase() + strIn.slice(1);
}

/* duplicated function
function getTrapListFromTrapSelector(sort, category, name, isForcedRetry) {
  clickTrapSelector(category);
  objTrapList[category] = [];
  let sec = secWait;
  let retry = armTrapRetry;
  let i, j, tagGroupElement, tagElement, nameElement, itemEle;
  let intervalGTLFTS = setInterval(function () {
    if (isNewUI)
      itemEle = document.getElementsByClassName(
        'campPage-trap-itemBrowser-item'
      );
    else tagGroupElement = document.getElementsByClassName('tagGroup');

    if (isNewUI && itemEle.length > 0) {
      for (i = 0; i < itemEle.length; i++) {
        nameElement = itemEle[i].getElementsByClassName(
          'campPage-trap-itemBrowser-item-name'
        )[0].textContent;
        objTrapList[category].push(nameElement);
      }
      setStorage(
        'TrapList' + capitalizeFirstLetter(category),
        objTrapList[category].join(',')
      );
      clearInterval(intervalGTLFTS);
      arming = false;
      intervalGTLFTS = null;
      checkThenArm(sort, category, name, isForcedRetry);
      return;
    } else if (!isNewUI && tagGroupElement.length > 0) {
      for (i = 0; i < tagGroupElement.length; ++i) {
        tagElement = tagGroupElement[i].getElementsByTagName('a');
        for (j = 0; j < tagElement.length; ++j) {
          nameElement =
            tagElement[j].getElementsByClassName('name')[0].innerText;
          objTrapList[category].push(nameElement);
        }
      }
      setStorage(
        'TrapList' + capitalizeFirstLetter(category),
        objTrapList[category].join(',')
      );
      clearInterval(intervalGTLFTS);
      arming = false;
      intervalGTLFTS = null;
      checkThenArm(sort, category, name, isForcedRetry);
      return;
    } else {
      --sec;
      if (sec <= 0) {
        clickTrapSelector(category);
        sec = secWait;
        --retry;
        if (retry <= 0) {
          clearInterval(intervalGTLFTS);
          arming = false;
          intervalGTLFTS = null;
          return;
        }
      }
    }
  }, 1000);
  return;
} */

/**
 * For weapon/base/charm/trinket/bait
 * Check if <name> is alreay armed,
 * and then arm it if not armed.
 *
 * 如果 name為空、長度為0的陣列或空字串,
 * 不予處理.
 *
 * Charm的 category是 trinket,有防呆.
 *
 * 如果 name不是陣列,先檢查是不是
 * 在g_objConstTrap這個 enum裡,
 * 如果是,取出實際的 item名稱.
 *
 * 如果 name是陣列,sort只支援 best跟 any,
 * 所以如果 sort未給定,用 best.
 * best是在 category現有全部 items去比對出
 * name中最靠前的 item,再看是否已裝備該 item.
 * any是只要已經裝備 name中任一就算已裝備.
 *
 * 如果 name是字串, sort只支援 null.
 * 所以如果 name是長度 1的陣列,
 * sort改用 null, name改用 name中那個
 * 唯一的元素.
 *
 * name如果是 none(不分大小寫),做 disarm.
 *
 * @param {String} sort null when name is String.
 * 'best' or 'any' when name is array.
 * @param {String} category weapon/base/charm/trinket/bait
 * @param {Array<String> | String} name name of weapon/base/charm/trinket/bait
 * @param {Boolean} isForcedRetry retry when failed to arm. default true.
 */
function checkThenArm(sort, category, name, isForcedRetry) {
  // category = weapon/base/charm/trinket/bait
  if (isNullOrUndefined(name) || name === '') return;

  if (category == 'charm') category = 'trinket';

  if (!Array.isArray(name)) {
    let obj = getConstToRealValue(sort, category, name);
    if (obj.changed) {
      sort = obj.sort;
      name = obj.name;
    }
  }

  if (Array.isArray(name)) {
    if (!(sort == 'best' || sort == 'any')) sort = 'best';
    if (name.length == 1) {
      sort = null;
      name = name[0];
      if (name.toUpperCase().indexOf('NONE') === 0) {
        disarmTrap(category);
        return;
      } else if (isNullOrUndefined(name) || name === '') return;
    }
  } else {
    if (name.toUpperCase().indexOf('NONE') === 0) {
      disarmTrap(category);
      return;
    }
    sort = null;
  }

  if (isNullOrUndefined(isForcedRetry)) isForcedRetry = true;

  let trapArmed = undefined;
  // let userVariable = getPageVariable('user.' + category + '_name');
  let userVariable = trimToEmpty(user[category + '_name']);
  if (sort == 'best') {
    getTrapList(category);
    if (objTrapList[category].length === 0) {
      let intervalCTA1 = setInterval(function () {
        console.log('intervalCTA1');
        if (!arming) {
          console.log('intervalCTA1, not arming');
          getTrapListFromTrapSelector(sort, category, name, isForcedRetry);
          clearInterval(intervalCTA1);
          intervalCTA1 = null;
          return;
        }
      }, 1000);
      closeTrapSelector(category);
      return;
    } else {
      let nIndex = -1;
      for (let i = 0; i < name.length; i++) {
        if (name[i].toUpperCase().indexOf('NONE') === 0) {
          // clearTrapList(category);
          /* 如果都沒找到,清除 trapList[category]
          然後跑 is not force retry的 checkThenArm */
          checkThenArm(sort, category, 'None', false);
          return;
        }
        for (let j = 0; j < objTrapList[category].length; j++) {
          nIndex = objTrapList[category][j].indexOf('...');
          if (nIndex > -1) name[i] = name[i].substr(0, nIndex);
          if (objTrapList[category][j].indexOf(name[i]) === 0) {
            console.plog(
              'Best',
              category,
              'found:',
              name[i],
              'Currently Armed:',
              userVariable
            );
            if (userVariable.indexOf(name[i]) === 0) {
              trapArmed = true;
              arming = false;
              closeTrapSelector(category);
              return;
            } else {
              trapArmed = false;
              break;
            }
          }
        }
        if (trapArmed === false) break;
      }
    }
  } else if (sort == 'any') {
    trapArmed = false;
    for (let i = 0; i < name.length; i++) {
      if (userVariable.indexOf(name[i]) === 0) {
        trapArmed = true;
        break;
      }
    }
  } else {
    trapArmed = userVariable.indexOf(name) === 0;
  }

  if (trapArmed === undefined && isForcedRetry) {
    /* 如果都沒找到,清除 trapList[category]
    然後跑 is not force retry的 checkThenArm */
    console.plog(
      name.join('/'),
      'not found in TrapList' + capitalizeFirstLetter(category)
    );
    clearTrapList(category);
    // 重建 trapList[category]後會再嘗試 arm,所以 isForceRetry要丟 false,不然無窮迴圈
    checkThenArm(sort, category, name, false);
  } else if (trapArmed === false) {
    addArmingIntoList(category);
    let intervalCTA = setInterval(function () {
      if (arming === false) {
        clickThenArmTrapInterval(sort, category, name);
        clearInterval(intervalCTA);
        intervalCTA = null;
        return;
      }
    }, 1000);
  }
  logging('Nothing executed in CheckThenArm');
}

function getConstToRealValue(sort, category, name) {
  let objRet = {
    changed: false,
    sort: sort,
    name: name
  };

  if (g_objConstTrap.hasOwnProperty(category)) {
    let arrKeys = Object.keys(g_objConstTrap[category]);
    let nIndex = arrKeys.indexOf(name);
    if (nIndex > -1) {
      let keyName = arrKeys[nIndex];
      objRet.sort = g_objConstTrap[category][keyName].sort;
      objRet.name = g_objConstTrap[category][keyName].name.slice();
      objRet.changed = true;
    }
  }
  return objRet;
}

function addArmingIntoList(category) {
  g_arrArmingList.push(category);
}

function deleteArmingFromList(category) {
  let nIndex = g_arrArmingList.indexOf(category);
  if (nIndex > -1) g_arrArmingList.splice(nIndex, 1);
}

function isArmingInList() {
  return g_arrArmingList.length > 0;
}

/**
 * setInterval to arm trap.
 * Handled arming status, network delay and retry.
 * @param {String} sort null(if name is String)
 * /best/any(if name is Array<String>).
 * @param {String} category weapon/base/trinket/bait.
 * @param {String | Array<String>} name name(s) of item.
 * @return
 */
function clickThenArmTrapInterval(sort, category, name) {
  clickTrapSelector(category);
  let sec = secWait;
  let armStatus = LOADING;
  let retry = armTrapRetry;
  let intervalCTATI = setInterval(function () {
    armStatus = armTrap(sort, category, name);
    if (armStatus != LOADING) {
      deleteArmingFromList(category);
      if (isNewUI && !isArmingInList()) closeTrapSelector(category);
      clearInterval(intervalCTATI);
      arming = false;
      intervalCTATI = null;
      if (armStatus == NOT_FOUND) {
        //clearTrapList(trap);
        if (category == 'trinket') {
          disarmTrap('trinket');
          closeTrapSelector(category);
        } else {
          closeTrapSelector(category);
        }
      }
      return;
    } else {
      --sec;
      if (sec <= 0) {
        if (isNewUI) closeTrapSelector(category);
        clickTrapSelector(category, true);
        sec = secWait;
        --retry;
        if (retry <= 0) {
          deleteArmingFromList(category);
          if (isNewUI && !isArmingInList()) closeTrapSelector(category);
          clearInterval(intervalCTATI);
          arming = false;
          intervalCTATI = null;
          return;
        }
      }
    }
  }, 1000);
  return;
}

/**
 * name = Brie/Gouda/Swiss (brie = wrong)
 * @param {String} sort null when name is String,
 * 'best' or 'any' when name is Array.
 * @param {String} category weapon/base/trinket/bait.
 * @param {String | Array<String>} name name of item to be armed.
 * @return {Number} arming status.
 */
function armTrap(sort, category, name) {
  return isNewUI
    ? armTrapNewUI(sort, category, name)
    : armTrapClassicUI(sort, category, name);
}

function armTrapClassicUI(sort, category, name) {
  const tagGroupElement = document.getElementsByClassName('tagGroup');
  let tagElement;
  let nameElement;
  let nIndex = -1;
  let arrName = Array.isArray(name) ? name.slice() : [name];

  if (sort == 'best' || sort == 'any') name = name[0];

  if (tagGroupElement.length > 0) {
    console.plog('Try to arm', name);
    for (let i = 0; i < tagGroupElement.length; ++i) {
      tagElement = tagGroupElement[i].getElementsByTagName('a');
      for (let j = 0; j < tagElement.length; ++j) {
        nameElement = tagElement[j].getElementsByClassName('name')[0].innerText;
        nIndex = nameElement.indexOf('...');
        if (nIndex > -1) name = name.substr(0, nIndex);
        if (nameElement.indexOf(name) === 0) {
          if (tagElement[j].getAttribute('class').indexOf('selected') < 0)
            // only click when not arming
            fireEvent(tagElement[j], 'click');
          else closeTrapSelector(category);

          if (objTrapList[category].indexOf(nameElement) < 0) {
            objTrapList[category].unshift(nameElement);
            setStorage(
              'TrapList' + capitalizeFirstLetter(category),
              objTrapList[category].join(',')
            );
          }
          console.plog(name, 'armed');
          return ARMED;
        }
      }
    }
    console.plog(name, 'not found');
    for (let i = 0; i < objTrapList[category].length; i++) {
      if (objTrapList[category][i].indexOf(name) === 0) {
        objTrapList[category].splice(i, 1);
        setStorage(
          'TrapList' + capitalizeFirstLetter(category),
          objTrapList[category].join(',')
        );
        break;
      }
    }
    if (sort == 'best' || sort == 'any') {
      arrName.shift();
      if (arrName.length > 0) {
        return armTrapClassicUI(sort, category, arrName);
      } else {
        return NOT_FOUND;
      }
    } else {
      return NOT_FOUND;
    }
  } else {
    return LOADING;
  }
}

function armTrapNewUI(sort, category, name) {
  const itemEle = document.getElementsByClassName(
    'campPage-trap-itemBrowser-item'
  );
  let nameElement;
  let arrName = Array.isArray(name) ? name.slice() : [name];

  if (sort == 'best' || sort == 'any') name = name[0];

  if (itemEle.length > 0) {
    console.plog('Trying to arm ' + name);
    for (let i = 0; i < itemEle.length; i++) {
      nameElement = itemEle[i].getElementsByClassName(
        'campPage-trap-itemBrowser-item-name'
      )[0].textContent;
      if (nameElement.indexOf(name) === 0) {
        if (itemEle[i].getAttribute('class').indexOf('canArm') > -1) {
          fireEvent(
            itemEle[i].getElementsByClassName(
              'campPage-trap-itemBrowser-item-armButton'
            )[0],
            'click'
          );
        } else {
          closeTrapSelector(category);
        }
        if (objTrapList[category].indexOf(nameElement) < 0) {
          objTrapList[category].unshift(nameElement);
          setStorage(
            'TrapList' + capitalizeFirstLetter(category),
            objTrapList[category].join(',')
          );
        }
        console.plog(name + ' armed');
        return ARMED;
      }
    }

    console.plog(name, 'not found');
    for (let i = 0; i < objTrapList[category].length; i++) {
      if (objTrapList[category][i].indexOf(name) === 0) {
        objTrapList[category].splice(i, 1);
        setStorage(
          'TrapList' + capitalizeFirstLetter(category),
          objTrapList[category].join(',')
        );
        break;
      }
    }
    if (sort == 'best' || sort == 'any') {
      arrName.shift();
      if (arrName.length > 0) return armTrapNewUI(sort, category, arrName);
      else return NOT_FOUND;
    } else return NOT_FOUND;
  } else return LOADING;
}

/**
 * Click trap selector.
 * @param {String} category weapon/base/trinket/bait.
 * @param {Boolean} isForceClick Not really used.
 * @return
 */
function clickTrapSelector(category, isForceClick) {
  if (isNullOrUndefined(isForceClick)) isForceClick = false;
  if (isNewUI) {
    const armedItem = $('.mousehuntHud-userStat.' + category)[0];
    // HUD,尤其是 event,也會有 data-item-classification=bait/trinket/weapon/base等
    /* let armedItem = $('.trapSelectorView__summary').find(
      'button[data-item-classification=' + category + ']'
    )[0]; */
    // let armedItem = $("button[data-item-classification='" + category + "']")[0];
    /* let armedItem = document.getElementsByClassName(
      'campPage-trap-armedItem ' + category
    )[0]; */
    let arrTemp = armedItem.getAttribute('class').split(' ');
    if (isForceClick !== true && arrTemp[arrTemp.length - 1] == 'active') {
      // trap selector opened
      arming = true;
      return console.plog('Trap selector', category, 'opened');
    }
    fireEvent(armedItem, 'click');
  } else {
    if (
      isForceClick !== true &&
      document.getElementsByClassName('showComponents ' + category).length > 0
    ) {
      // trap selector opened
      arming = true;
      return console.plog('Trap selector', category, 'opened');
    }
    if (category == 'base')
      fireEvent(
        document.getElementsByClassName('trapControlThumb')[0],
        'click'
      );
    else if (category == 'weapon')
      fireEvent(
        document.getElementsByClassName('trapControlThumb')[1],
        'click'
      );
    else if (category == 'charm' || category == 'trinket')
      fireEvent(
        document.getElementsByClassName('trapControlThumb')[2],
        'click'
      );
    else if (category == 'bait')
      fireEvent(
        document.getElementsByClassName('trapControlThumb')[3],
        'click'
      );
    else return console.plog('Invalid trapSelector');
  }
  arming = true;
  console.plog('Trap selector', category, 'clicked');
}

/**
 * Close trap selector.
 * @param {String} category weapon/base/trinket/bait
 */
function closeTrapSelector(category) {
  if (isNewUI) {
    const armedItem = $('.mousehuntHud-userStat.' + category)[0];
    // let armedItem = $("button[data-item-classification='" + category + "']")[0];
    /* let armedItem = document.getElementsByClassName(
      'campPage-trap-armedItem ' + category
    )[0]; */
    if (
      !isNullOrUndefined(armedItem) &&
      armedItem.getAttribute('class').indexOf('active') > -1
    ) {
      // trap selector opened
      fireEvent(armedItem, 'click');
      console.plog('Trap selector', category, 'closed');
    }
  } else {
    if (
      document.getElementsByClassName('showComponents ' + category).length > 0
    ) {
      fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
      console.plog('Trap selector', category, 'closed');
    }
  }
}

//// END EMBED

function retrieveDataFirst() {
  logging('RUN retrieveDataFirst()');

  try {
    let gotHornTime = false;
    let gotPuzzle = false;
    let gotBaitQuantity = false;
    let retrieveSuccess = false;

    let scriptElementList = document.getElementsByTagName('script');

    if (scriptElementList) {
      let i;
      for (i = 0; i < scriptElementList.length; ++i) {
        let scriptString = scriptElementList[i].innerHTML;

        // get next horn time
        let hornTimeStartIndex = scriptString.indexOf(
          'next_activeturn_seconds'
        );
        if (hornTimeStartIndex >= 0) {
          hornTimeStartIndex += 25;
          let hornTimeEndIndex = scriptString.indexOf(',', hornTimeStartIndex);
          let hornTimerString = scriptString.substring(
            hornTimeStartIndex,
            hornTimeEndIndex
          );
          nextActiveTime = parseInt(hornTimerString);
          logging(
            'From substr: ' +
              nextActiveTime +
              ', from page var: ' +
              getPageVariable('user.next_activeturn_seconds')
          );

          hornTimeDelay =
            hornTimeDelayMin +
            Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

          if (!aggressiveMode) {
            // calculation base on the js in Mousehunt
            let additionalDelayTime = Math.ceil(nextActiveTime * 0.1);
            // Safety switch
            //hornTimeDelay += additionalDelayTime + 5;
            hornTimeDelay += 5;

            hornTime = nextActiveTime + hornTimeDelay;

            // TODO 一進遊戲就有KR或有horn時會出錯?
            // if (nextActiveTime <= 0) eventLocationCheck();

            lastDateRecorded = undefined;
            lastDateRecorded = new Date();

            additionalDelayTime = undefined;
          } else {
            // aggressive mode, no extra delay like time in horn image appear
            hornTime = nextActiveTime;
            lastDateRecorded = undefined;
            lastDateRecorded = new Date();
          }

          gotHornTime = true;

          hornTimeStartIndex = undefined;
          hornTimeEndIndex = undefined;
          hornTimerString = undefined;
        }

        // get is king's reward or not
        let hasPuzzleStartIndex = scriptString.indexOf('has_puzzle');
        if (hasPuzzleStartIndex >= 0) {
          hasPuzzleStartIndex += 12;
          let hasPuzzleEndIndex = scriptString.indexOf(
            ',',
            hasPuzzleStartIndex
          );
          let hasPuzzleString = scriptString.substring(
            hasPuzzleStartIndex,
            hasPuzzleEndIndex
          );
          isKingReward = hasPuzzleString != 'false';

          logging('Fetched isKingReward: ' + isKingReward);

          gotPuzzle = true;

          hasPuzzleStartIndex = undefined;
          hasPuzzleEndIndex = undefined;
          hasPuzzleString = undefined;
        }

        // get cheese quantity
        let baitQuantityStartIndex = scriptString.indexOf('bait_quantity');
        if (baitQuantityStartIndex >= 0) {
          baitQuantityStartIndex += 15;
          let baitQuantityEndIndex = scriptString.indexOf(
            ',',
            baitQuantityStartIndex
          );
          let baitQuantityString = scriptString.substring(
            baitQuantityStartIndex,
            baitQuantityEndIndex
          );
          baitQuantity = parseInt(baitQuantityString);

          logging('Fetched baitQuantity: ' + baitQuantity);

          gotBaitQuantity = true;

          baitQuantityStartIndex = undefined;
          baitQuantityEndIndex = undefined;
          baitQuantityString = undefined;
        }

        let locationStartIndex;
        let locationEndIndex;
        locationStartIndex = scriptString.indexOf('environment_name":"');
        // logging("Fetched locationString: " + scriptString);
        if (locationStartIndex >= 0) {
          locationStartIndex += 19;
          locationEndIndex = scriptString.indexOf('"', locationStartIndex);
          let locationString = scriptString.substring(
            locationStartIndex,
            locationEndIndex
          );
          currentLocation = locationString;

          logging('Fetched currentLocation: ' + currentLocation);

          locationStartIndex = undefined;
          locationEndIndex = undefined;
          locationString = undefined;
        }

        scriptString = undefined;
      }
      i = undefined;
    }
    scriptElementList = undefined;

    if (gotHornTime && gotPuzzle && gotBaitQuantity) {
      // get trap check time
      CalculateNextTrapCheckInMinute();

      // get last location
      let huntLocationCookie = getStorage('huntLocation');
      if (isNullOrUndefined(huntLocationCookie)) {
        huntLocation = currentLocation;
        setStorage('huntLocation', currentLocation);
      } else {
        huntLocation = huntLocationCookie;
        setStorage('huntLocation', huntLocation);
      }
      huntLocationCookie = undefined;

      // get last king reward time
      let lastKingRewardDate = getStorage('lastKingRewardDate');
      if (isNullOrUndefined(lastKingRewardDate)) {
        lastKingRewardSumTime = -1;
      } else {
        let lastDate = new Date(lastKingRewardDate);
        lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
        lastDate = undefined;
      }
      lastKingRewardDate = undefined;

      /*
      原本在 nextActiveTime檢查時就執行.
      但一進遊戲就有KR時,跑 eventLocationCheck()
      可能會與KR互相干擾,因為 eventLocationCheck()
      通常會有實際的遊戲操作.
      移到檢查完KR後,如果沒有KR才執行.
      if (nextActiveTime <= 0 && !isKingReward) eventLocationCheck();
       */

      retrieveSuccess = true;
    } else {
      retrieveSuccess = false;
    }

    // clean up
    gotHornTime = undefined;
    gotPuzzle = undefined;
    gotBaitQuantity = undefined;

    logging('END retrieveDataFirst with ' + retrieveSuccess);

    return retrieveSuccess;
  } catch (e) {
    console.perror('retrieveDataFirst', e.message);
  }
}

function GetHornTime() {
  const horn_element = document.querySelector('.huntersHornView__horn');
  const hunt_timer = document.querySelector('.huntersHornView__countdown');
  let message;
  if (hunt_timer) {
    message = hunt_timer.innerText;
  }
  let huntTimerElement = hunt_timer;
  let totalSec = 900;
  if (huntTimerElement !== null) {
    huntTimerElement = message;
    if (huntTimerElement.toLowerCase().indexOf('ready') > -1) totalSec = 0;
    else if (isNewUI) {
      let arrTime = huntTimerElement.split(':');
      if (arrTime.length == 2) {
        for (let i = 0; i < arrTime.length; i++)
          arrTime[i] = parseInt(arrTime[i]);
        totalSec = arrTime[0] * 60 + arrTime[1];
      }
    } else {
      let temp = parseInt(huntTimerElement);
      if (Number.isInteger(temp)) totalSec = temp * 60;
    }
  }
  logging(totalSec);
  return totalSec;
}

function getKingRewardStatus() {
  let strValue = getPageVariable('user.has_puzzle');
  console.plog('user.has_puzzle:', strValue);
  return strValue == 'true';

  // Does the following bits even matter lol
  /* let headerOrHud = document.getElementById(header);

  if (headerOrHud !== null) {
    let textContentLowerCase = headerOrHud.textContent.toLowerCase();
    if (
      textContentLowerCase.indexOf('king reward') > -1 ||
      textContentLowerCase.indexOf("king's reward") > -1 ||
      textContentLowerCase.indexOf('kings reward') > -1
    ) {
      return true;
    } else return strValue == 'true';
  } else return false; */
}
/* function getCurrentLocation() {
  let tempLocation;
  if (isNewUI) {
    tempLocation = document.getElementsByClassName(
      'mousehuntHud-environmentName'
    );
    if (tempLocation.length > 0) return tempLocation[0].textContent;
    else return '';
  } else {
    tempLocation = document.getElementById('hud_location');
    if (!isNullOrUndefined(tempLocation)) return tempLocation.textContent;
    else return '';
  }
} */

function retrieveData() {
  logging('Run retrieveData()');
  try {
    let browser = browserDetection();
    // get next horn time
    if (browser == 'firefox' || browser == 'opera' || browser == 'chrome') {
      currentLocation = getCurrentLocation();
      isKingReward = getKingRewardStatus();
      baitQuantity = getBaitQuantity();
      nextActiveTime = GetHornTime();
    } else {
      window.setTimeout(function () {
        reloadWithMessage('Browser not supported. Reloading...', false);
      }, 60000);
    }

    /**
     * Check latest journal time.
     * If current timestamp is 900 seconds more then latest journal time,
     * return true and reload page.
     *
     * It means journal not refresh after sound horn.
     *
     * This function can only be executed
     * after horn successfully sounded, i.e., retrieveData().
     * Because retrieveDate() is only executed
     * in afterSoundingHorn() and cheeseRearmedAction.
     *
     * If executed before sounding horn,
     * it's normal to be more then 900 seconds(because of hornTimeDelay)
     * and should not reload.
     *
     * Warning: this function should never be executed after page reload,
     * which might cause reload-loop.
     * @return {Boolean} true if error( will reload too)
     */
    function checkJournalDate() {
      let reload = false;
      let msg = '';
      // 目前有觀察到timestamp error, 需要進一步紀錄分析.
      // TODO 目前為止 timestamp error reload都能解決
      const nowSecond = Math.ceil(Date.now() / 1000);
      if (nowSecond - user.last_active_turn_timestamp > 900) {
        let phaseSecondsLeft = -1;
        const q = user.quests.QuestTrainStation;
        if (q) phaseSecondsLeft = q.phase_seconds_remaining;
        console.plog(
          'last active turn timestamp error!!',
          nowSecond,
          user.last_active_turn_timestamp,
          nowSecond - user.last_active_turn_timestamp,
          'user.last_active:',
          user.last_active,
          'horn_time_left:',
          hornTime,
          'check_time_left:',
          checkTime,
          'phaseSecondsLeft:',
          phaseSecondsLeft,
          'quest:',
          q
        );
        // displayTimer('last active turn timestamp error!!', hornTime, checkTime);
        // storeError('last active turn timestamp error!!');
        reload = true;
        msg += 'last active turn timestamp error!!';
      }
      // 處理 journal未更新
      const journalDateDiv = document.getElementsByClassName('journaldate');
      if (journalDateDiv) {
        const journalDateStr = journalDateDiv[0].innerHTML.toString().trim();
        const midIndex = journalDateStr.indexOf(':', 0);
        const spaceIndex = journalDateStr.indexOf(' ', midIndex);

        if (midIndex >= 1) {
          const hrStr = journalDateStr.substring(0, midIndex);
          const minStr = journalDateStr.substring(midIndex + 1, midIndex + 3);
          const hourSysStr = journalDateStr.substring(
            spaceIndex + 1,
            spaceIndex + 3
          );

          const nowDate = new Date();
          const lastHuntDate = new Date();
          if (hourSysStr == 'am') {
            lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
          } else {
            lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
          }
          logging('checkJournalDate', nowDate, lastHuntDate);
          if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
            reload = true;
            msg += 'Journal time error!!';
          }
        } else {
          reload = true;
          msg += 'Journal time parse error!!';
        }
      }

      if (reload) {
        reloadWithMessage(msg, false);
      }

      return reload;
    }

    if (checkJournalDate()) return;

    if (nextActiveTime === '' || isNaN(nextActiveTime)) {
      // fail to retrieve data, might be due to slow network

      // reload the page to see it fix the problem
      window.setTimeout(function () {
        reloadWithMessage('Invalid nextActiveTime. Reloading...', false);
      }, 5000);
    } else {
      // got the timer right!
      if (nextActiveTime === 0) hornTimeDelay = 0;
      else {
        // calculate the delay
        hornTimeDelay =
          hornTimeDelayMin +
          Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));
      }
      console.plog('Horn Time:', nextActiveTime, 'Delay:', hornTimeDelay);

      if (!aggressiveMode) {
        // calculation base on the js in Mousehunt
        let additionalDelayTime = Math.ceil(nextActiveTime * 0.1);
        if (
          timerInterval != '' &&
          !isNaN(timerInterval) &&
          timerInterval == 1
        ) {
          additionalDelayTime = 2;
        }

        // safety mode, include extra delay like time in horn image appear
        //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
        hornTime = nextActiveTime + hornTimeDelay;
        lastDateRecorded = undefined;
        lastDateRecorded = new Date();

        additionalDelayTime = undefined;
      } else {
        // aggressive mode, no extra delay like time in horn image appear
        hornTime = nextActiveTime;
        lastDateRecorded = undefined;
        lastDateRecorded = new Date();
      }
    }
    afterHornChecking();
    /* // check lucky golden shield
    // setTimeout(() => {
      useSbSupplyPack();
    // }, 0);
    CalculateNextTrapCheckInMinute();
    getJournalDetail();
    eventLocationCheck('retrieveData()');
    mapHunting();
    setTimeout(() => {
      displayError();
    }, 3000);
    // runAddonCode()應該不能 async執行,因為要等 eventLocationCheck執行完
    setTimeout(() => {
    runAddonCode();
    }, 7000); */
  } catch (e) {
    logging('retrieveData() ERROR - ' + e);
  }
}

/**
 * Handle using sb_supply_pack
 *
 * @param {Boolean} isUseSupplyPack
 */
function useSbSupplyPack() {
  // 還沒有 KC
  /* const noKC = [
    '100000636731698',
    'hg_d783ff747d3b60073ef541d335ff901d',
    'hg_62a01c775dd2fe8670b6cb46b31c1318'
  ]; */
  const noKC = [];
  if (noKC.indexOf(user.sn_user_id + '') > -1) {
    console.plog(`${user.sn_user_id}還沒有 KC`);
    return;
  }
  const shieldSeconds = parseInt(user.shield_seconds);
  const isUseSupplyPack =
    user && !Number.isNaN(shieldSeconds) && shieldSeconds < minLgsSeconds;
  console.plog('Use sb_supply_pack?', isUseSupplyPack);
  if (isUseSupplyPack) {
    console.plog('Use sb_supply_pack!!');
    try {
      hg.utils.UserInventory.useConvertible('sb_supply_pack', 1);
      storeError('sb_supply_pack used!!');
    } catch (error) {
      console.plog('Use sb_supply_pack error!!', error);
      storeError('Use sb_supply_pack error!!');
    }
  }
}

function action() {
  logging('Run %caction()', 'color: #00ff00');

  try {
    if (isKingReward) {
      kingRewardAction();
      notifyMe(
        'KR NOW - ' + getPageVariable('user.username'),
        'http://3.bp.blogspot.com/_O2yZIhpq9E8/TBoAMw0fMNI/AAAAAAAAAxo/1ytaIxQQz4o/s1600/Subliminal+Message.JPG',
        'Kings Reward NOW'
      );
    } else if (pauseAtInvalidLocation && huntLocation != currentLocation) {
      // update timer
      displayTimer(
        'Out of pre-defined hunting location...',
        'Out of pre-defined hunting location...',
        'Out of pre-defined hunting location...'
      );

      if (fbPlatform) {
        if (secureConnection) {
          displayLocation(
            "<span style='color: red; '>" +
              currentLocation +
              "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
          );
        } else {
          displayLocation(
            "<span style='color: red; '>" +
              currentLocation +
              "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
          );
        }
      } else if (hiFivePlatform) {
        if (secureConnection) {
          displayLocation(
            "<span style='color: red; '>" +
              currentLocation +
              "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
          );
        } else {
          displayLocation(
            "<span style='color: red; '>" +
              currentLocation +
              "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
          );
        }
      } else if (mhPlatform) {
        if (secureConnection) {
          displayLocation(
            "<span style='color: red; '>" +
              currentLocation +
              "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
          );
        } else {
          displayLocation(
            "<span style='color: red; '>" +
              currentLocation +
              "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
          );
        }
      }

      displayKingRewardSumTime(null);

      // pause script
    } else if (baitQuantity == 0) {
      // this is initailly no bait(maybe consumed during sleep)
      // update timer
      displayTimer(
        'No more cheese!',
        'Cannot hunt without the cheese...',
        'Cannot hunt without the cheese...'
      );
      displayLocation(huntLocation);
      displayKingRewardSumTime(null);

      // Notify no more cheese
      noCheeseAction();

      // pause the script
    } else {
      // update location
      displayLocation(huntLocation);

      let isHornSounding = false;

      // check if the horn image is visible
      nobTestBetaUI();
      let headerElement = document.querySelector('.huntersHornView');
      if (headerElement) {
        let headerStatus = headerElement.querySelector(
          '.huntersHornView__timerState.huntersHornView__timerState--type-ready'
        );
        if (isvisible(headerStatus)) {
          // if the horn image is visible, why do we need to wait any more, sound the horn!
          soundHorn();

          // make sure the timer don't run twice!
          isHornSounding = true;
        } else {
          if (!isKingReward) {
            // delay 1秒以上是必要的
            window.setTimeout(function () {
              afterHornChecking();
              /* // check lucky golden shield
              // setTimeout(() => {
                useSbSupplyPack();
              // }, 0);
              CalculateNextTrapCheckInMinute();
              getJournalDetail();
              eventLocationCheck('action()');
              //specialFeature('action()');
              mapHunting();
              setTimeout(() => {
                displayError();
              }, 3000);
              // runAddonCode()應該不能 async執行,因為要等 eventLocationCheck執行完
              setTimeout(() => {
              runAddonCode();
              }, 7000); */
            }, 1000);
          }
        }
        headerStatus = undefined;
      }
      headerElement = undefined;

      if (isHornSounding === false) {
        // start timer
        window.setTimeout(function () {
          countdownTimer();
        }, timerRefreshInterval * 1000);
      }

      isHornSounding = undefined;
    }
    // 下面的動作, soundHorn之後都會做,所以必須跟 soundHorn() if...else...
    /* if (!isKingReward) {
      window.setTimeout(function () {
        // check lucky golden shield
        setTimeout(() => {
          useSbSupplyPack();
        }, 0);
        getJournalDetail();
        eventLocationCheck('action()');
        //specialFeature('action()');
        mapHunting();
        // runAddonCode()應該不能 async執行,因為要等 eventLocationCheck執行完
        // setTimeout(() => {
        runAddonCode();
        // }, 0);
        // setTimeout(() => {
        displayError();
        // }, 0);
      }, 1000);
    } */
  } catch (e) {
    logging('action() ERROR - ' + e);
  }
}

/**
 * check完 horn後要執行的動作.
 * 在 action()跟 retrieveData()中 check完 horn後用到
 */
function afterHornChecking() {
  // check lucky golden shield
  // setTimeout(() => {
  useSbSupplyPack();
  // }, 0);
  CalculateNextTrapCheckInMinute();
  getJournalDetail();
  eventLocationCheck('action()');
  //specialFeature('action()');
  mapHunting();
  setTimeout(() => {
    displayError();
  }, 3000);
  // runAddonCode()應該不能 async執行,因為要等 eventLocationCheck執行完
  setTimeout(() => {
    runAddonCode();
  }, 5000);
  if (isEnableScheduledJobs)
    setTimeout(() => {
      scheduledJobs();
    }, getRandomInteger(40000, 70000));
  if (isEnableScheduledJobs)
    setTimeout(() => {
      autoBuyItem();
    }, getRandomInteger(70000, 120000));
}

function isvisible(obj) {
  return obj.offsetWidth > 0 && obj.offsetHeight > 0;
}

function countdownTimer() {
  if (isKingReward) {
    // update timer
    displayTimer("King's Reward!", "King's Reward!", "King's Reward");
    displayKingRewardSumTime('Now');

    // record last king's reward time
    let nowDate = new Date();
    setStorage('lastKingRewardDate', nowDate.toString());
    nowDate = undefined;
    lastKingRewardSumTime = 0;

    // reload the page so that the sound can be play
    // simulate mouse click on the camp button
    fireEvent(document.getElementsByClassName(campButton)[0], 'click');

    // TODO reload the page if click on camp button fail
    window.setTimeout(function () {
      reloadWithMessage('Fail to click on camp button. Reloading...', false);
    }, 5000);
  } else if (pauseAtInvalidLocation && huntLocation != currentLocation) {
    // update timer
    displayTimer(
      'Out of pre-defined hunting location...',
      'Out of pre-defined hunting location...',
      'Out of pre-defined hunting location...'
    );
    if (fbPlatform) {
      if (secureConnection) {
        displayLocation(
          "<font color='red'>" +
            currentLocation +
            "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
        );
      } else {
        displayLocation(
          "<font color='red'>" +
            currentLocation +
            "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
        );
      }
    } else if (hiFivePlatform) {
      if (secureConnection) {
        displayLocation(
          "<font color='red'>" +
            currentLocation +
            "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
        );
      } else {
        displayLocation(
          "<font color='red'>" +
            currentLocation +
            "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
        );
      }
    } else if (mhPlatform) {
      if (secureConnection) {
        displayLocation(
          "<font color='red'>" +
            currentLocation +
            "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
        );
      } else {
        displayLocation(
          "<font color='red'>" +
            currentLocation +
            "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>"
        );
      }
    }
    displayKingRewardSumTime(null);

    // pause script
  } else if (baitQuantity == 0) {
    // this is no bait before horn sounded.
    // update timer
    displayTimer(
      'No more cheese!',
      'Cannot hunt without the cheese...',
      'Cannot hunt without the cheese...'
    );
    displayLocation(huntLocation);
    displayKingRewardSumTime(null);

    noCheeseAction();

    // pause the script
  } else {
    let dateNow = new Date();
    let intervalTime = timeElapsed(lastDateRecorded, dateNow);
    lastDateRecorded = undefined;
    lastDateRecorded = dateNow;
    dateNow = undefined;

    // Update time
    hornTime -= intervalTime;
    if (lastKingRewardSumTime != -1) {
      lastKingRewardSumTime += intervalTime;
    }
    if (enableTrapCheck) checkTime -= intervalTime;

    intervalTime = undefined;

    // Check event location 60s before trap check
    /*if (enableTrapCheck && checkTime == 60)
            eventLocationCheck();*/

    if (hornTime <= 0) {
      // blow the horn!
      hornTime = 0;
      soundHorn();
    } else if (enableTrapCheck && checkTime <= 0) {
      // trap check!
      checkTime = 0;
      trapCheck();
    } else {
      if (enableTrapCheck) {
        // update timer
        if (!aggressiveMode) {
          displayTimer(
            'Horn: ' +
              timeFormat(hornTime) +
              ' | Check: ' +
              timeFormat(checkTime),
            timeFormat(hornTime) +
              '  <i>(included extra ' +
              timeFormat(hornTimeDelay) +
              ' delay & +/- 5 seconds different from MouseHunt timer)</i>',
            timeFormat(checkTime) +
              '  <i>(included extra ' +
              timeFormat(checkTimeDelay) +
              ' delay)</i>'
          );

          // check if user manaually sounded the horn
          let scriptNode = document.getElementById('scriptNode');
          if (scriptNode) {
            let isHornSounded = scriptNode.getAttribute('soundedHornAtt');
            if (isHornSounded == 'true') {
              // sound horn function do the rest
              soundHorn();

              // stop loopping
              return;
            }
            isHornSounded = undefined;
          }
          scriptNode = undefined;

          /*if (hornTime - hornTimeDelay == 0)
                        eventLocationCheck();*/
        } else {
          displayTimer(
            'Horn: ' +
              timeFormat(hornTime) +
              ' | Check: ' +
              timeFormat(checkTime),
            timeFormat(hornTime) + '  <i>(lot faster than MouseHunt timer)</i>',
            timeFormat(checkTime) +
              '  <i>(included extra ' +
              timeFormat(checkTimeDelay) +
              ' delay)</i>'
          );
        }
      } else {
        // update timer
        if (!aggressiveMode) {
          displayTimer(
            'Horn: ' + timeFormat(hornTime),
            timeFormat(hornTime) +
              '  <i>(included extra ' +
              timeFormat(hornTimeDelay) +
              ' delay & +/- 5 seconds different from MouseHunt timer)</i>',
            '-'
          );

          // check if user manaually sounded the horn
          let scriptNode = document.getElementById('scriptNode');
          if (scriptNode) {
            let isHornSounded = scriptNode.getAttribute('soundedHornAtt');
            if (isHornSounded == 'true') {
              // sound horn function do the rest
              soundHorn();

              // stop loopping
              return;
            }
            isHornSounded = undefined;
          }
          scriptNode = undefined;

          /*if (hornTime - hornTimeDelay == 0)
                        eventLocationCheck();*/
        } else {
          displayTimer(
            'Horn: ' + timeFormat(hornTime),
            timeFormat(hornTime) + '  <i>(lot faster than MouseHunt timer)</i>',
            '-'
          );

          // if the horn image is visible, why do we need to wait any more, sound the horn!
          soundHorn();

          // agressive mode should sound the horn whenever it is possible to do so.
          let headerElement = document.querySelector('.huntersHornView');
          if (headerElement) {
            let headerStatus = headerElement.querySelector(
              '.huntersHornView__timerState.huntersHornView__timerState--type-ready'
            );

            // the horn image appear before the timer end
            if (isvisible(headerStatus)) {
              // who care, blow the horn first!
              soundHorn();

              headerElement = undefined;

              // skip all the code below
              return;
            }
          }
          headerElement = undefined;
        }
      }
      // pause script
      // this is no bait after horn sounded
      if (baitQuantity == 0) {
        // update timer
        displayTimer(
          'No more cheese!',
          'Cannot hunt without the cheese...',
          'Cannot hunt without the cheese...'
        );
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        noCheeseAction();
        return;
      }
      // pause the script

      // set king reward sum time
      displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

      window.setTimeout(function () {
        countdownTimer();
      }, timerRefreshInterval * 1000);
    }
  }
}
/** hooker to MhUtils.reloadPage */
function reloadPage(soundHorn) {
  MhUtils.reloadPage(soundHorn);
}
/** hooker to MhUtils.reloadWithMessage */
function reloadWithMessage(msg, soundHorn) {
  MhUtils.reloadWithMessage(msg, soundHorn);
}
/**
 * 處理訊息顯示並延遲 1秒後執行 location.reload(true)
 * @param {String} msg msg displayed on title.
 */
function reloadWithMessageNoHistory(msg) {
  console.plog('reloadWithMessageNoHistory: ', msg);
  // display the message
  displayTimer(msg, msg, msg);

  // reload the page
  setTimeout(function () {
    location.reload(true);
  }, 1000);
}

// ################################################################################################
//   Timer Function - Start
// ################################################################################################

function embedTimer(targetPage) {
  try {
    if (showTimerInPage) {
      let headerElement;
      if (fbPlatform || hiFivePlatform || mhPlatform) {
        headerElement = document.getElementById('overlayContainer');
      } else if (mhMobilePlatform) {
        headerElement = document.getElementById('mobileHorn');
      }

      if (headerElement) {
        let timerDivElement = document.createElement('div');

        // show bot title and version
        let titleElement = document.createElement('div');
        titleElement.setAttribute('id', 'titleElement');
        if (targetPage && aggressiveMode) {
          titleElement.innerHTML =
            '<b><a href="https://greasyfork.org/en/scripts/395928-mousehunt-autobot-updated" target="_blank">MouseHunt AutoBot UPDATED (version ' +
            scriptVersion +
            ')</a>' +
            (isNewUI ? ' ~ Beta UI' : '') +
            "</b> - <font color='red'>Aggressive Mode</font>";
        } else {
          titleElement.innerHTML =
            '<b><a href="https://greasyfork.org/en/scripts/395928-mousehunt-autobot-updated" target="_blank">MouseHunt AutoBot UPDATED (version ' +
            scriptVersion +
            ')</a>' +
            (isNewUI ? ' ~ Beta UI' : '') +
            '</b>';
        }
        timerDivElement.appendChild(titleElement);
        titleElement = null;

        if (targetPage) {
          let updateElement = document.createElement('div');
          updateElement.setAttribute('id', 'updateElement');
          timerDivElement.appendChild(updateElement);
          updateElement = null;

          nextHornTimeElement = document.createElement('div');
          nextHornTimeElement.setAttribute('id', 'nextHornTimeElement');
          nextHornTimeElement.innerHTML =
            '<b>Next Hunter Horn Time:</b> Loading...';
          timerDivElement.appendChild(nextHornTimeElement);

          checkTimeElement = document.createElement('div');
          checkTimeElement.setAttribute('id', 'checkTimeElement');
          checkTimeElement.innerHTML =
            '<b>Next Trap Check Time:</b> Loading...';
          timerDivElement.appendChild(checkTimeElement);

          if (pauseAtInvalidLocation) {
            // location information only display when enable this feature
            travelElement = document.createElement('div');
            travelElement.setAttribute('id', 'travelElement');
            travelElement.innerHTML = '<b>Target Hunt Location:</b> Loading...';
            timerDivElement.appendChild(travelElement);
          }

          let lastKingRewardDate = getStorage('lastKingRewardDate');
          let lastDateStr;
          if (lastKingRewardDate == undefined || lastKingRewardDate == null) {
            lastDateStr = '-';
          } else {
            let lastDate = new Date(lastKingRewardDate);
            lastDateStr =
              lastDate.toDateString() +
              ' ' +
              lastDate.toTimeString().substring(0, 8);
            lastDate = null;
          }

          kingTimeElement = document.createElement('div');
          kingTimeElement.setAttribute('id', 'kingTimeElement');
          kingTimeElement.innerHTML =
            "<b>Last King's Reward:</b> " + lastDateStr + ' ';
          timerDivElement.appendChild(kingTimeElement);

          lastKingRewardSumTimeElement = document.createElement('font');
          lastKingRewardSumTimeElement.setAttribute(
            'id',
            'lastKingRewardSumTimeElement'
          );
          lastKingRewardSumTimeElement.innerHTML = '(Loading...)';
          kingTimeElement.appendChild(lastKingRewardSumTimeElement);

          lastKingRewardDate = null;
          lastDateStr = null;

          /*if (showLastPageLoadTime) {
                        let nowDate = new Date();

                        // last page load time
                        //let loadTimeElement = document.createElement('div');
                        //loadTimeElement.setAttribute('id', 'loadTimeElement');
                        //loadTimeElement.innerHTML = "<b>Last Page Load: </b>" + nowDate.toDateString() + " " + nowDate.toTimeString().substring(0, 8);
                        //timerDivElement.appendChild(loadTimeElement);

                        //loadTimeElement = null;
                        nowDate = null;
                    }*/

          let timersElementToggle = document.createElement('a');
          let text = document.createTextNode('Toggle timers');
          timersElementToggle.href = '#';
          timersElementToggle.setAttribute('id', 'timersElementToggle');
          timersElementToggle.appendChild(text);
          timersElementToggle.onclick = function (e) {
            let timersElementStyle =
              document.getElementById('loadTimersElement');
            if (
              timersElementStyle.style.display == 'block' ||
              timersElementStyle.style.display == ''
            ) {
              timersElementStyle.style.display = 'none';
            } else {
              timersElementStyle.style.display = 'block';
              nobCalculateOfflineTimers();
            }
            timersElementStyle = null;
            return false;
          };
          let holder = document.createElement('div');
          holder.setAttribute('style', 'float: left;');
          let temp = document.createElement('span');
          temp.innerHTML = '&#160;&#126;&#160;';
          holder.appendChild(timersElementToggle);
          holder.appendChild(temp);
          timerDivElement.appendChild(holder);
          holder = null;
          text = null;
          temp = null;

          let loadTimersElement = document.createElement('div');
          loadTimersElement.setAttribute('id', 'loadTimersElement');
          loadTimersElement.setAttribute('style', 'display: none;');
          timerDivElement.appendChild(loadTimersElement);

          //timerDivElement.appendChild(/*document.createElement('br')*/document.createTextNode(' &#126; '));

          let loadLinkToUpdateDiv = document.createElement('div');
          loadLinkToUpdateDiv.setAttribute('id', 'ReturnArea');
          loadLinkToUpdateDiv.setAttribute('style', 'float: left;');
          text = null;
          timerDivElement.appendChild(loadLinkToUpdateDiv);

          let tempDiv = document.createElement('span');
          tempDiv.innerHTML = text;
          text =
            '<a id="nobRaffle" href="#" title="Sends back the raffle ticket in inventory.">Return raffle tickets</a>';
          tempSpan2 = document.createElement('span');
          tempSpan2.innerHTML = text;
          let tempSpan3 = document.createElement('span');
          tempSpan3.innerHTML =
            ' &#126; <a id="nobPresent" href="#" title="Sends back the presents in inventory.">Return presents</a>';
          let tempSpan = document.createElement('span');
          //loadLinkToUpdateDiv.appendChild(tempDiv);
          loadLinkToUpdateDiv.appendChild(tempSpan2);
          loadLinkToUpdateDiv.appendChild(tempSpan3);
          loadLinkToUpdateDiv.appendChild(tempSpan);

          text = null;
          tempDiv = null;
          tempSpan = null;
          tempSpan2 = null;
          tempSpan3 = null;
          loadLinkToUpdateDiv = null;
          timersElementToggle = null;
          loadTimersElement = null;
          loadLinkToUpdate = null;
        } else {
          if (isNewUI || nobTestBetaUI()) {
            // try check if ajax was called
            if (doubleCheckLocation()) {
              document.getElementById('titleElement').parentNode.remove();
              embedTimer(true);
              embedScript();
              action();
              nobInit();
              return;
            } else {
              // Add ajax listener for when user is back onto camp page
              let campButtonDiv =
                document.getElementsByClassName(campButton)[0];
              campButtonDiv.addEventListener('click', function (event) {
                // Use timeout to make sure ajax finished
                window.setTimeout(function () {
                  if (doubleCheckLocation()) {
                    exeScript();
                    return;
                  }
                }, 1000);
              });
            }
          }

          // player currently navigating other page instead of hunter camp
          let helpTextElement = document.createElement('div');
          helpTextElement.setAttribute('id', 'helpTextElement');
          if (fbPlatform) {
            if (secureConnection) {
              helpTextElement.innerHTML =
                "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
            } else {
              helpTextElement.innerHTML =
                "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
            }
          } else if (mhPlatform) {
            if (secureConnection) {
              helpTextElement.innerHTML =
                "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
            } else {
              helpTextElement.innerHTML =
                "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
            }
          } else if (mhMobilePlatform) {
            if (secureConnection) {
              helpTextElement.innerHTML =
                "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='https://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
            } else {
              helpTextElement.innerHTML =
                "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='http://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
            }
          }
          timerDivElement.appendChild(helpTextElement);

          helpTextElement = null;
        }

        let showPreference = getStorage('showPreference');
        if (showPreference == undefined || showPreference == null) {
          showPreference = false;
          setStorage('showPreference', showPreference);
        }

        let showPreferenceLinkDiv = document.createElement('div');
        showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
        showPreferenceLinkDiv.setAttribute('style', 'text-align:right');
        timerDivElement.appendChild(showPreferenceLinkDiv);

        let showPreferenceSpan = document.createElement('span');
        let showPreferenceLinkStr =
          '<a id="showPreferenceLink" name="showPreferenceLink" onclick="' +
          "if (document.getElementById('showPreferenceLink').innerHTML == '<b>[Hide Preference]</b>') {" +
          "document.getElementById('preferenceDiv').style.display='none';" +
          "document.getElementById('showPreferenceLink').innerHTML='<b>[Show Preference]</b>';" +
          '} else {' +
          "document.getElementById('preferenceDiv').style.display='block';" +
          "document.getElementById('showPreferenceLink').innerHTML='<b>[Hide Preference]</b>';" +
          'initEventAlgo();' +
          '}' +
          '">';

        if (showPreference === true)
          showPreferenceLinkStr += '<b>[Hide Preference]</b>';
        else showPreferenceLinkStr += '<b>[Show Preference]</b>';
        showPreferenceLinkStr += '</a>';
        showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';
        showPreferenceSpan.innerHTML = showPreferenceLinkStr;
        showPreferenceLinkDiv.appendChild(showPreferenceSpan);
        showPreferenceLinkStr = null;
        showPreferenceSpan = null;
        showPreferenceLinkDiv = null;

        /**
         * preferenceHTMLStr如果有加新欄位,
         * 要去 bodyJS().savePreference()及 loadPreferenceSettingFromStorage()處理
         */
        let temp;
        // prettier-ignore
        let preferenceHTMLStr = `
          <table border="0" width="100%">
            <tr><td colspan="2" style="padding: 2px 0; border-bottom: 1px solid orange;"></td></tr>
            <tr><td colspan="2" style="height: 5px;"></td></tr>
            <tr>
              <td style="height:24px; text-align:right;">
                <a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it"><b>Aggressive Mode</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              </td>
              <td style="height:24px">
                <select id="AggressiveModeInput" onchange="let isDisable = (value == 'true') ? 'disabled' : ''; document.getElementById('HornTimeDelayMinInput').disabled=isDisable; document.getElementById('HornTimeDelayMaxInput').disabled=isDisable;">
                  <option value="false"${aggressiveMode ? '' : ' selected'}>No</option>
                  <option value="true"${aggressiveMode ? ' selected' : ''}>Yes</option>
                </select>&nbsp;&nbsp;<a title="Extra delay time before sounding the horn (in seconds)"><b>Delay:</b></a>&emsp;
                <input type="number" id="HornTimeDelayMinInput" min="0" max="600" size="5" value="${hornTimeDelayMin.toString()}"${aggressiveMode ? ' disabled' : ''}> seconds ~ 
                <input type="number" id="HornTimeDelayMaxInput" min="1" max="601" size="5" value="${hornTimeDelayMax.toString()}"${aggressiveMode ? ' disabled' : ''}> seconds
              </td>
            </tr>
            <tr>
              <td style="height:24px; text-align:right;">
                <a title="Extra delay time before sounding the horn (in seconds)"><b>Horn Time Delay</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              </td>
              <td style="height:24px">
                <input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" disabled="disabled" value="${hornTimeDelayMin.toString()}"/> seconds ~ 
                <input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" disabled="disabled" value="${hornTimeDelayMax.toString()}"/> seconds
              </td>
            </tr>
            <tr>
              <td style="height:24px; text-align:right;">
                <a title="Enable trap check once an hour"><b>Trap Check</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              </td>
              <td style="height:24px">
                <select id="TrapCheckInput" onchange="let isDisable = (value == 'false') ? 'disabled' : ''; document.getElementById('TrapCheckTimeDelayMinInput').disabled=isDisable; document.getElementById('TrapCheckTimeDelayMaxInput').disabled=isDisable;">
                  <option value="false"${enableTrapCheck ? '' : ' selected'}>No</option>
                  <option value="true"${enableTrapCheck ? ' selected' : ''}>Yes</option>
                </select>&nbsp;&nbsp;<a title="Extra delay time to trap check (in seconds)"><b>Delay:</b></a>&emsp;
                <input type="number" id="TrapCheckTimeDelayMinInput" min="0" max="360" size="5" value="${checkTimeDelayMin.toString()}"${enableTrapCheck ? '' : ' disabled'}> seconds ~ 
                <input type="number" id="TrapCheckTimeDelayMaxInput" min="1" max="361" size="5" value="${checkTimeDelayMax.toString()}"${enableTrapCheck ? '' : ' disabled'}> seconds
              </td>
            </tr>
            <tr>
              <td style="height:24px; text-align:right;">
                <a title="Play sound when encounter king\'s reward"><b>Play KR Sound</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              </td>
              <td style="height:24px">
                <select id="PlayKingRewardSoundInput">
                  <option value="false"${isKingWarningSound ? '' : ' selected'}>No</option>
                  <option value="true"${isKingWarningSound ? ' selected' : ''}>Yes</option>
                </select>&nbsp;&nbsp;
                <a title="Link to MP3 sound to play, defaults NobodyRandom\'s awesome song if left blank"><b>Sound Link:</b></a>&emsp;
                <input type="text" id="kingWarningSoundInput" value="${kingWarningSound}">
              </td>
            </tr>
            <tr>
              <td style="height:24px; text-align:right;">
                <a title="Countdown every how many seconds."><b>Timer Refresh</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              </td>
              <td style="height: 24px">
                <select id="selectTimerRefreshInterval">
                  <option value="1"${1 == timerRefreshInterval ? ' selected' : ''}>1</option>
                  <option value="2"${2 == timerRefreshInterval ? ' selected' : ''}>2</option>
                  <option value="3"${3 == timerRefreshInterval ? ' selected' : ''}>3</option>
                  <option value="4"${4 == timerRefreshInterval ? ' selected' : ''}>4</option>
                  <option value="5"${5 == timerRefreshInterval ? ' selected' : ''}>5</option>
                  <option value="6"${6 == timerRefreshInterval ? ' selected' : ''}>6</option>
                  <option value="7"${7 == timerRefreshInterval ? ' selected' : ''}>7</option>
                  <option value="8"${8 == timerRefreshInterval ? ' selected' : ''}>8</option>
                  <option value="9"${9 == timerRefreshInterval ? ' selected' : ''}>9</option>
                  <option value="10"${10 == timerRefreshInterval ? ' selected' : ''}>10</option>
                </select> seconds.
                <a title="Auto Popup on KR"><b>Auto KR Popup</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
                <select id="selectAutoPopupKR">
                  <option value="false"${autoPopupKR ? '' : ' selected'}>No</option>
                  <option value="true"${autoPopupKR ? ' selected' : ''}>Yes</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="height:24px; text-align:right;">
                <a title="Solve King Reward automatically"><b>Auto Solve KR</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              </td>
              <td style="height:24px">
                <select id="AutoSolveKRInput" onchange="let isDisable = (value == 'false') ? 'disabled' : ''; document.getElementById('AutoSolveKRDelayMinInput').disabled=isDisable; document.getElementById('AutoSolveKRDelayMaxInput').disabled=isDisable;">
                  <option value="false"${isAutoSolve ? '' : ' selected'}>No</option>
                  <option value="true"${isAutoSolve ? ' selected' : ''}>Yes</option>
                </select>&nbsp;&nbsp;<a title="Extra delay time to solve King Reward (in seconds)"><b>Delay:</b></a>&emsp;
                <input type="number" id="AutoSolveKRDelayMinInput" min="0" max="360" size="5" value="${krDelayMin.toString()}"${isAutoSolve ? '' : ' disabled'}> seconds ~ 
                <input type="number" id="AutoSolveKRDelayMaxInput" min="1" max="361" size="5" value="${krDelayMax.toString()}"${isAutoSolve ? '' : ' disabled'}> seconds
              </td>
            </tr>
        `;
        /*
                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Save King Reward image into localStorage"><b>Save King Reward Image</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                preferenceHTMLStr += '<select id="SaveKRImageInput" >';
                if (saveKRImage) {
                    preferenceHTMLStr += '<option value="false">No</option>';
                    preferenceHTMLStr += '<option value="true" selected>Yes</option>';
                }
                else {
                    preferenceHTMLStr += '<option value="false" selected>No</option>';
                    preferenceHTMLStr += '<option value="true">Yes</option>';
                }
                preferenceHTMLStr += '</select>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';
                */
        /*
                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="View Saved King Reward Image from localStorage"><b>View King Reward Image</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                preferenceHTMLStr += '<select id="viewKR">';
                preferenceHTMLStr += '</select>';
                preferenceHTMLStr += '<input type="button" id="buttonViewKR" value="View" onclick="let keyValue = document.getElementById(\'viewKR\').value;let value = window.localStorage.getItem(keyValue);if(value.indexOf(\'data:image/png;base64,\') > -1){let pom = document.createElement(\'a\');pom.setAttribute(\'href\', value);pom.setAttribute(\'download\', keyValue.split(\'~\')[2]+\'.png\');if(document.createEvent){let event = document.createEvent(\'MouseEvents\');event.initEvent(\'click\', true, true);pom.dispatchEvent(event);}else pom.click();}else if(value.indexOf(\'i.imgur.com\') > -1){let win = window.open(value, \'_blank\');if(win)win.focus();else alert(\'Please allow popups for this site\');}">';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';
                */
        // prettier-ignore
        preferenceHTMLStr += `
          <tr>
            <td style="height:24px; text-align:right;">
              <a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
              <select id="PauseLocationInput">
                <option value="false"${pauseAtInvalidLocation ? '' : ' selected'}>No</option>
                <option value="true"${pauseAtInvalidLocation ? ' selected' : ''}>Yes</option>
              </select>
            </td>
          </tr>
          <tr>
            <td style="height:24px; text-align:right;"><a><b>Best Weapon for </b></a>
              <select id="selectBestTrapPowerType" style="width:75px;" onchange="initControlsBestTrap();">
                <option value="arcane">Arcane</option>
                <option value="draconic">Draconic</option>
                <option value="forgotten">Forgotten</option>
                <option value="hydro">Hydro</option>
                <option value="law">Law</option>
                <option value="physical">Physical</option>
                <option value="rift">Rift</option>
                <option value="shadow">Shadow</option>
                <option value="tactical">Tactical</option>
              </select>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
              <select id="selectBestTrapWeapon" style="width: 300px" onchange="saveBestTrap();">
                <option value=""></option>
              </select>
            </td>
          </tr>
          <tr>
            <td style="height:24px; text-align:right;">
              <a><b>Best Base for </b></a>
              <select id="selectBestTrapBaseType" style="width:75px;" onchange="initControlsBestTrap();">
                <option value="combo">Combo</option>
                <option value="luck">Luck</option>
                <option value="power">Power</option>
                <option value="rift">Rift</option>
                <option value="labyrinth">Labyrinth</option>
              </select>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
              <select id="selectBestTrapBase" onchange="saveBestTrap();">
                <option value=""></option>
              </select>
            </td>
          </tr>
          <tr>
            <td style="height:24px; text-align:right;">
              <a title="When no bait, auto arm what bait(make sure u have enough that bait)"><b>Default Bait</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
              <select id="selectDefaultBait">
                <option value=""${defaultBait == '' ? ' selected' : ''}></option>
                <option value="Gouda Cheese"${defaultBait == 'Gouda Cheese' ? ' selected' : ''}>Gouda Cheese</option>
                <option value="Brie Cheese"${defaultBait == 'Brie Cheese' ? ' selected' : ''}>Brie Cheese</option>
                <option value="Swiss Cheese"${defaultBait == 'Swiss Cheese' ? ' selected' : ''}>Swiss Cheese</option>
                <option value="Marble Cheese"${defaultBait == 'Marble Cheese' ? ' selected' : ''}>Marble Cheese</option>
                <option value="Cheddar Cheese"${defaultBait == 'Cheddar Cheese' ? ' selected' : ''}>Cheddar Cheese</option>
                <option value="White Cheddar Cheese"${defaultBait == 'White Cheddar Cheese' ? ' selected' : ''}>White Cheddar Cheese</option>
              </select>
              &nbsp;OR&nbsp;type&nbspby&nbspyourself&nbsp
              <input type="text" id="inputDefaultBait" value="${defaultBait}" size="12" onchange="if (this.value.trim()!='') document.getElementById('selectDefaultBait').value='';">
            </td>
          </tr>
          <tr>
            <td style="height:24px; text-align:right;">
              <a title="Leave game at what o\'clock and for how many hours back to game"><b>Rest Time(hr)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
        `;
        for (let i = 0; i < restTimes.length; i++) {
          preferenceHTMLStr +=
            '<a title="Start to rest at what o\'clock. If zero, the at-for pair will be ignored"><b>Rest at</b></a> <input type="number" name="restAt" value="' +
            restTimes[i][0] +
            '" min="0" max="24" step="0.25" style="width: 3em;">';
          preferenceHTMLStr +=
            ' <a title="Take rest for how many hours."><b>for</b></a> <input type="number" name="restFor" value="' +
            restTimes[i][1] +
            '" min="0" max="24" step="0.5" style="width: 3em;">.';
          if ((i + 1) % 3 == 0) {
            preferenceHTMLStr += '<br>';
          }
        }
        // prettier-ignore
        preferenceHTMLStr += `
              <a title="Which location to take rest"><b>Sleep in</b></a>&nbsp;
              <select id="selectSleepIn">
                <option value=""${sleepIn == '' ? ' selected' : ''}>Unchange</option>
              </select>&nbsp;
              <a title="Which localtion going to after take rest"><b>Work in</b></a>&nbsp;
              <select id="selectWorkIn">
                <option value=""${workIn == '' ? ' selected' : ''}>Unchange</option>
              </select>
              <br>
              <select id="selectEnableScheduledJobs">
                <option value="true"${isEnableScheduledJobs ? ' selected' : ''}>Enable Jobs</option>
                <option value="false"${isEnableScheduledJobs ? '' : ' selected'}>Disable Jobs</option>
              </select>
              <a title="Min LGS seconds to auto use SB supply pack"><b>Auto LGS seconds :</b></a>&nbsp;
              <input type="number" id="inputMinLgsSeconds" value="${minLgsSeconds}">
            </td>
          </tr>
        `;
        // prettier-ignore
        preferenceHTMLStr += `
          <tr>
            <td style="height:24px; text-align:right;">
              <a title="On loaded, scroll to element specified by this class name."><b>Onload Anchor</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
              <select id="onloadAnchorSelect">
                <option value="ById"${onloadAnchor[0] == 'ById' ? ' selected' : ''}>Id</option>
                <option value="ByName"${onloadAnchor[0] == 'ByName' ? ' selected' : ''}>Name</option>
                <option value="ByClassName"${onloadAnchor[0] == 'ByClassName' ? ' selected' : ''}>Class Name</option>
              </select>
              <input type="text" id="onloadAnchorInput" value="${onloadAnchor[1]}" style="width: 15em;" title="On page load scroll to if found" placeholder="Attribute value"/>
              <input type="text" id="onloadAnchorInputOr" value="${onloadAnchor[2]}" style="width: 15em;" title="Or on page load scroll to if found" placeholder="Attribute value"/>
            </td>
          </tr>
          <tr>
            <td style="height:24px; text-align:right;">
              <a title="Anchor points for quick scroll and on load scroll."><b>Anchor Points</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            </td>
            <td style="height:24px">
        `;
        // anchor points
        for (let i = 0; i < anchorPoints.length; i++) {
          preferenceHTMLStr +=
            '<input type="text" name="whatAttributeLabel" value="' +
            anchorPoints[i][0] +
            '" style="width: 3.5em;">';
          preferenceHTMLStr += '<select name="whatAttribute">';
          // preferenceHTMLStr += '<option value="">None</option>';
          preferenceHTMLStr +=
            '<option value="ById"' +
            (anchorPoints[i][1] == 'ById' ? ' selected' : '') +
            '>Id</option>';
          preferenceHTMLStr +=
            '<option value="ByName"' +
            (anchorPoints[i][1] == 'ByName' ? ' selected' : '') +
            '>Name</option>';
          preferenceHTMLStr +=
            '<option value="ByClassName"' +
            (anchorPoints[i][1] == 'ByClassName' ? ' selected' : '') +
            '>Class Name</option>';
          preferenceHTMLStr += '</select>';
          preferenceHTMLStr +=
            '<input type="text" name="whatAttributeValue" value="' +
            anchorPoints[i][2] +
            '" style="width: 14em;" title="Attribute value to look for element" placeholder="Attribute value"/>';
          preferenceHTMLStr +=
            '<input type="text" name="whatAttributeValueOr" value="' +
            anchorPoints[i][3] +
            '" style="width: 14em;" title="Or by this Attribute value, choose found one." placeholder="or this attribute value"/><br/>';
        }
        preferenceHTMLStr += `
            </td>
          </tr>
        `;
        // new row sample
        /*
        preferenceHTMLStr += '<tr>';
        preferenceHTMLStr +=
          '<td style="height:24px; text-align:right;"><a title="tooltip"><b>SOMETEXT</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '<td style="height:24px">';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '</tr>';
        */
        if (fbPlatform)
          temp = `window.location.href='${g_strHTTP}://www.mousehuntgame.com/canvas/';`;
        else if (hiFivePlatform)
          temp = `window.location.href='${g_strHTTP}://www.mousehunt.hi5.hitgrab.com/';`;
        else if (mhPlatform)
          temp = `window.location.href='${g_strHTTP}://www.mousehuntgame.com/';`;
        // savePreference() is injected to game page by bodyJS()
        preferenceHTMLStr += `
          <tr>
            <td style="height:24px; text-align:right;" colspan="2">
              (Changes above this line only take place after user save the preference)
              &nbsp;<input type="button" id="preferenceSaveInput" value="Save" onclick="savePreference();"/>&nbsp;&nbsp;&nbsp;
              <input type="button" id="preferenceSaveInput" value="Save & Reload" onclick="savePreference();${temp}"/>&nbsp;&nbsp;&nbsp;
            </td>
          </tr>
        `;
        /*preferenceHTMLStr +=
          "<input type=\"button\" id=\"PreferenceSaveInput\" value=\"Save\" onclick=\"\
try {\
window.localStorage.setItem('AggressiveMode', 		document.getElementById('AggressiveModeInput').value);\
window.localStorage.setItem('HornTimeDelayMin', 		document.getElementById('HornTimeDelayMinInput').value);\
window.localStorage.setItem('HornTimeDelayMax', 		document.getElementById('HornTimeDelayMaxInput').value);\
window.localStorage.setItem('TrapCheck', 				document.getElementById('TrapCheckInput').value);\
window.localStorage.setItem('TrapCheckTimeDelayMin',	document.getElementById('TrapCheckTimeDelayMinInput').value);\
window.localStorage.setItem('TrapCheckTimeDelayMax', 	document.getElementById('TrapCheckTimeDelayMaxInput').value);\
window.localStorage.setItem('AutoSolveKR',            document.getElementById('AutoSolveKRInput').value);\
window.localStorage.setItem('AutoSolveKR', 			document.getElementById('AutoSolveKRInput').value);\
window.localStorage.setItem('AutoSolveKR', 			document.getElementById('AutoSolveKRInput').value);\
window.localStorage.setItem('AutoSolveKRDelayMin', 	document.getElementById('AutoSolveKRDelayMinInput').value);\
window.localStorage.setItem('AutoSolveKRDelayMax', 	document.getElementById('AutoSolveKRDelayMaxInput').value);\
window.localStorage.setItem('PauseLocation', 			document.getElementById('PauseLocationInput').value);\
window.localStorage.setItem('autoPopupKR',            document.getElementById('selectAutoPopupKR').value);\
if (document.getElementById('selectDefaultBait').value!='') {window.localStorage.setItem('defaultBait', document.getElementById('selectDefaultBait').value);}\
else {window.localStorage.setItem('defaultBait', document.getElementById('inputDefaultBait').value.trim());}\
setSessionToLocal();\
} catch(e) {logging(e);}\
";

        //window.localStorage.setItem('PlayKingRewardSound', 	document.getElementById('PlayKingRewardSoundInput').value);
        //window.localStorage.setItem('SaveKRImage', 			document.getElementById('SaveKRImageInput').value);

        if (fbPlatform)
          temp =
            "window.location.href='" +
            g_strHTTP +
            "://www.mousehuntgame.com/canvas/';";
        else if (hiFivePlatform)
          temp =
            "window.location.href='" +
            g_strHTTP +
            "://www.mousehunt.hi5.hitgrab.com/';";
        else if (mhPlatform)
          temp =
            "window.location.href='" +
            g_strHTTP +
            "://www.mousehuntgame.com/';";

        preferenceHTMLStr += temp + '"/>&nbsp;&nbsp;&nbsp;</td>';*/
        // separation line
        preferenceHTMLStr += `
        <tr>
          <td style="height:24px" colspan="2">
            <div style="width: 100%; height: 1px; background: #000000; overflow: hidden;">
          </td>
        </tr>
        <tr>
          <td style="height:24px; text-align:right;">
            <a title="Turn on/off Map Hunting feature"><b>Season 4 Map Hunting</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectMapHunting" onChange="onSelectMapHuntingChanged();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </td>
        </tr>
        <tr id="trUncaughtMouse" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Click button Get to retrieve all uncaught mouse"><b>Uncaught Mouse</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectMouseList"></select>
            <input type="button" id="inputSelectMouse" title="Click to select the mouse from the left dropdown list" value="Select This Mouse" onclick="onInputSelectMouse();" disabled>&nbsp;&nbsp;
            <input type="button" id="inputGetMouse" title="Click to Get all uncaught mouse from treasure map" value="Refresh Uncaught Mouse List" onclick="onInputGetMouse();">
          </td>
        </tr>
        <tr id="trSelectedUncaughtMouse" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select desired uncaught mouse"><b>Selected Mouse</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <input type="text" id="inputUncaughtMouse" value="" disabled>&nbsp;&nbsp;
            <input type="button" id="inputClearUncaughtMouse" title="Click to clear the selected mouse" value="Clear" onclick="onInputClearUncaughtMouse();">
          </td>
        </tr>
        <tr id="trCatchLogic" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select desired catch logic"><b>Catch Logic</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectCatchLogic" onchange="saveMapHunting();">
              <option value="OR">When either one of the Selected Mouse was caught</option>
              <option value="AND">When all of the Selected Mouse were caught</option>
            </select>
          </td>
        </tr>
        <tr id="trMapHuntingTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup after catch logic is fulfilled"><b>After Caught</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectWeapon" style="width: 75px" onchange="saveMapHunting();">
              <option value="Remain">Remain</option>
            </select>
            <select id="selectBase" style="width: 75px" onchange="saveMapHunting();">
              <option value="Remain">Remain</option>
            </select>
            <select id="selectTrinket" style="width: 75px" onchange="saveMapHunting();">
              <option value="Remain">Remain</option>
              <option value="None">None</option>
            </select>
            <select id="selectBait" style="width: 75px" onchange="saveMapHunting();">
              <option value="Remain">Remain</option>
              <option value="None">None</option>
            </select>
          </td>
        </tr>
        <tr id="trMapHuntingLeave" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to leave map after catch logic is fulfilled"><b>Leave Map After Caught</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLeaveMap" onchange="saveMapHunting();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </td>
        </tr>
        `;

        preferenceHTMLStr += `
        <tr>
          <td style="height:24px; text-align:right;">
            <a title="Select the script algorithm based on certain event / location"><b>Event or Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="eventAlgo" style="width:150px" onChange="window.sessionStorage.setItem(\'eventLocation\', value); showOrHideTr(value);">
              <option value="None">None</option>
              <option value="library_assignment">get Library Assignment</option>
              <option value="All LG Area">All LG Area</option>
              <option value="BC/JOD">BC => JOD</option>
              <option value="Bristle Woods Rift">Bristle Woods Rift</option>
              <option value="Burroughs Rift(Red)">Burroughs Rift(Red)</option>
              <option value="Burroughs Rift(Green)">Burroughs Rift(Green)</option>
              <option value="Burroughs Rift(Yellow)">Burroughs Rift(Yellow)</option>
              <option value="Burroughs Rift Custom">Burroughs Rift Custom</option>
              <option value="Burroughs Rift Auto">Burroughs Rift Auto</option>
              <option value="Charge Egg 2016 Medium + High">Charge Egg 2016 Medium + High</option>
              <option value="Charge Egg 2016 High">Charge Egg 2016 High</option>
              <option value="FG/AR">FG => AR</option>
              <option value="Fiery Warpath">Fiery Warpath</option>
              <option value="Fort Rox">Fort Rox</option>
              <option value="Furoma Rift">Furoma Rift</option>
              <option value="GES">Gnawnian Express Station</option>
              <!--<option value="GWH2016R">GWH 2016</option>-->
              <option value="Iceberg">Iceberg</option>
              <option value="Labyrinth">Labyrinth</option>
              <option value="SG">Seasonal Garden</option>
              <option value="Sunken City">Sunken City</option>
              <option value="Sunken City Custom">Sunken City Custom</option>
              <option value="Test">Test</option>
              <option value="WWRift">WWRift</option>
              <option value="Zokor">Zokor</option>
              <option value="ZT">Zugzwang\'s Tower</option>
            </select>
            <input type="button" id="inputResetReload" title="Reset setting of current selected algo" value="Reset & Reload" onclick="onInputResetReload();${temp}">
          </td>
        </tr>
        `;
        // BC_JOD HTML
        preferenceHTMLStr += `
        <tr id="trBCJODSubLocation" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Sub-Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBCJODSublocation" onchange="initControlsBCJOD();">
              <option value="JOD">Jungle of Dread</option>
              <option value="LOW">BC Low Tide</option>
              <option value="MID">BC Mid Tide</option>
              <option value="HIGH">BC High Tide</option>
            </select>
          </td>
        </tr>
        <tr id="trBCJODTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup based on current sub-location"><b>Trap Setup </b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBCJODWeapon" style="width: 75px;" onchange="saveBCJOD();">
              <option value="best.weapon.forgotten">Best Forgotten</option>
              <option value="best.weapon.shadow">Best Shadow</option>
            </select>
            <select id="selectBCJODBase" style="width: 75px;" onchange="saveBCJOD();">
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectBCJODTrinket" style="width: 75px;" onchange="saveBCJOD();">
              <option value="None">None</option>
            </select>
            <select id="selectBCJODBait" style="width: 75px;" onchange="saveBCJOD();">
              <option value="None">None</option>
              <option value="Vanilla Stilton Cheese">Vanilla Stilton Cheese</option>
              <option value="Vengeful Vanilla Stilton Cheese">Vengeful Vanilla Stilton Cheese</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
          </td>
        </tr>
        `;
        // FG_AR HTML
        preferenceHTMLStr += `
        <tr id="trFGARSubLocation" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Sub-Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFGARSublocation" onchange="initControlsFGAR();">
              <option value="FG">Forbidden Grove</option>
              <option value="AR">Acolyte Realm</option>
            </select>
          </td>
        </tr>

        <tr id="trFGARTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup based on current sub-location"><b>Trap Setup </b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFGARWeapon" style="width: 75px;" onchange="saveFGAR();">
              <option value="best.weapon.arcane">Best Arcane</option>
              <option value="best.weapon.forgotten">Best Forgotten</option>
              <option value="best.weapon.shadow">Best Shadow</option>
            </select>
            <select id="selectFGARBase" style="width: 75px;" onchange="saveFGAR();">
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectFGARTrinket" style="width: 75px;" onchange="saveFGAR();">
              <option value="None">None</option>
            </select>
            <select id="selectFGARBait" style="width: 75px;" onchange="saveFGAR();">
              <option value="None">None</option>
              <option value="Runic Cheese">Runic Cheese</option>
              <option value="Ancient Cheese">Ancient Cheese</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
          </td>
        </tr>
        `;
        // BWRift HTML
        preferenceHTMLStr += `
        <tr id="trBWRiftAutoChoosePortal" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Choose portal automatically"><b>Auto Choose Portal</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftChoosePortal" style="width: 75px;" onchange="onSelectBWRiftChoosePortal();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;
            <a title="Pause when timesand drained by travel"><b>Travel to</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectBWRiftTravelTo" onchange="onSelectBWRiftChoosePortal();">
              <option value=""></option>
            </select>&nbsp;
            when timesand drained
          </td>
        </tr>

        <tr id="trBWRiftChoosePortalAfterCC" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Choose portal after Chamber Cleaver has been caught"><b>Choose Portal</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftChoosePortalAfterCC" style="width: 75px;" onchange="saveBWRift();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;&nbsp;After Chamber Cleaver Caught
          </td>
        </tr>

        <tr id="trBWRiftPortalPriority" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select portal priority"><b>Portal Priority </b></a>
            <select id="selectBWRiftPriority" style="width: 75px;" onchange="initControlsBWRift();">`;
        preferenceHTMLStr += '<option value="1">1 (Highest)</option>';
        for (i = 2; i < 13; i++) {
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        }
        preferenceHTMLStr += '<option value="13">13 (Lowest)</option>';
        preferenceHTMLStr += `
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftPortal" onchange="saveBWRift();">
              <option value="GEARWORKS">Gearworks</option>
              <option value="ANCIENT">Ancient Lab</option>
              <option value="RUNIC">Runic Laboratory</option>
              <option value="AL/RL_MSC">AL/RL (MSC)</option>
              <option value="AL/RL_BSC">AL/RL (BSC)</option>
              <option value="TIMEWARP">Timewarp Chamber</option>
              <option value="LUCKY">Lucky Tower</option>
              <option value="HIDDEN">Hidden Treasury</option>
              <option value="GUARD">Guard Barracks</option>
              <option value="SECURITY">Security Chamber</option>
              <option value="FROZEN">Frozen Alcove</option>
              <option value="FURNACE">Furnace Room</option>
              <option value="INGRESS">Ingress Chamber</option>
              <option value="PURSUER">Pursuer Mousoleum</option>
              <option value="ACOLYTE">Acolyte Chamber</option>
            </select>
          </td>
        </tr>

        <tr id="trBWRiftPortalPriorityCursed" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select portal priority when get cursed"><b>Portal Priority - Cursed </b></a>
            <select id="selectBWRiftPriorityCursed" style="width: 75px;" onchange="initControlsBWRift();">`;
        preferenceHTMLStr += '<option value="1">1 (Highest)</option>';
        for (i = 2; i < 13; i++) {
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        }
        preferenceHTMLStr += '<option value="13">13 (Lowest)</option>';
        preferenceHTMLStr += `
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftPortalCursed" onchange="saveBWRift();">
              <option value="GEARWORKS">Gearworks</option>
              <option value="ANCIENT">Ancient Lab</option>
              <option value="RUNIC">Runic Laboratory</option>
              <option value="AL/RL_MSC">AL/RL (MSC)</option>
              <option value="AL/RL_BSC">AL/RL (BSC)</option>
              <option value="TIMEWARP">Timewarp Chamber</option>
              <option value="LUCKY">Lucky Tower</option>
              <option value="HIDDEN">Hidden Treasury</option>
              <option value="GUARD">Guard Barracks</option>
              <option value="SECURITY">Security Chamber</option>
              <option value="FROZEN">Frozen Alcove</option>
              <option value="FURNACE">Furnace Room</option>
              <option value="INGRESS">Ingress Chamber</option>
              <option value="PURSUER">Pursuer Mousoleum</option>
              <option value="ACOLYTE">Acolyte Chamber</option>
            </select>
          </td>
        </tr>

        <tr id="trBWRiftMinTimeSand" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select minimum time sand before entering Acolyte Chamber (AC)"><b>Min Time Sand </b></a>
            <select id="selectBWRiftBuffCurse" style="width: 75px;" onchange="initControlsBWRift();">
            <option value="0">No Buff & No Curse</option>
            <option value="1">Fourth Portal & No Curse</option>
            <option value="2">Acolyte Influence & No Curse</option>
            <option value="3">Acolyte Influence + Fourth Portal & No Curse</option>
            <option value="4">Paladin\'s Bane & No Curse</option>
            <option value="5">Paladin\'s Bane + Fourth Portal & No Curse</option>
            <option value="6">Paladin\'s Bane + Acolyte Influence & No Curse</option>
            <option value="7">All Buffs & No Curse</option>
            <option value="8">Buff(s) & Curse(s)</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <input type="number" id="inputMinTimeSand" min="0" max="99999" style="width:75px" value="50" onchange="onInputMinTimeSandChanged(this);">&nbsp;&nbsp;Before Enter AC
          </td>
        </tr>

        <tr id="trBWRiftMinRSC" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select minimum Runic String Cheese before entering Acolyte Chamber (AC)&#13;Note 1: Total RSC = 2*RSC Pot + RSC"><b>Min Runic String Cheese</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftMinRSCType" style="width: 75px;" onchange="onSelectBWRiftMinRSCType();">
              <option value="NUMBER">Number</option>
              <option value="GEQ">Greater or Equal to Min Time Sand</option>
            </select>
            <input type="number" id="inputMinRSC" min="0" max="99999" style="width:75px" value="50" onchange="onInputMinRSCChanged(this);">&nbsp;&nbsp;Before Enter AC
          </td>
        </tr>

        <tr id="trBWRiftEnterMinigame" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to enter minigame with curse(s)"><b>Enter Minigame with Curse(s)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftEnterWCurse" style="width: 75px;" onchange="saveBWRift();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </td>
        </tr>

        <tr id="trBWRiftSubLocation" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Chamber in Bristle Woods Rift"><b>Sub-Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftChamber" onchange="initControlsBWRift();">
              <option value="NONE">Non-Chamber</option>
              <option value="GEARWORKS">Gearworks</option>
              <option value="ANCIENT">Ancient Lab</option>
              <option value="RUNIC">Runic Laboratory</option>
              <option value="TIMEWARP">Timewarp Chamber</option>
              <option value="LUCKY">Lucky Tower</option>
              <option value="HIDDEN">Hidden Treasury</option>
              <option value="GUARD">Guard Barracks</option>
              <option value="SECURITY">Security Chamber</option>
              <option value="FROZEN">Frozen Alcove</option>
              <option value="FURNACE">Furnace Room</option>
              <option value="INGRESS">Ingress Chamber</option>
              <option value="PURSUER">Pursuer Mousoleum</option>
              <option value="ACOLYTE_CHARGING">Acolyte Chamber Charging</option>
              <option value="ACOLYTE_DRAINING">Acolyte Chamber Draining</option>
              <option value="ACOLYTE_DRAINED">Acolyte Chamber Drained</option>
              <option value="SEPARATOR" disabled>========= Separator =========</option>
              <option value="NONE_CURSED">Non-Chamber Cursed</option>
              <option value="GEARWORKS_CURSED">Gearworks Cursed</option>
              <option value="ANCIENT_CURSED">Ancient Lab Cursed</option>
              <option value="RUNIC_CURSED">Runic Laboratory Cursed</option>
              <option value="TIMEWARP_CURSED">Timewarp Chamber Cursed</option>
              <option value="LUCKY_CURSED">Lucky Tower Cursed</option>
              <option value="HIDDEN_CURSED">Hidden Treasury Cursed</option>
              <option value="GUARD_CURSED">Guard Barracks Cursed</option>
              <option value="SECURITY_CURSED">Security Chamber Cursed</option>
              <option value="FROZEN_CURSED">Frozen Alcove Cursed</option>
              <option value="FURNACE_CURSED">Furnace Room Cursed</option>
              <option value="INGRESS_CURSED">Ingress Chamber Cursed</option>
              <option value="PURSUER_CURSED">Pursuer Mousoleum Cursed</option>
              <option value="ACOLYTE_CHARGING_CURSED">Acolyte Chamber Charging Cursed</option>
              <option value="ACOLYTE_DRAINING_CURSED">Acolyte Chamber Draining Cursed</option>
              <option value="ACOLYTE_DRAINED_CURSED">Acolyte Chamber Drained Cursed</option>
            </select>
          </td>
        </tr>

        <tr id="trBWRiftMasterTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup based on current chamber"><b>Master Trap Setup</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftWeapon" style="width: 75px;" onchange="saveBWRift();">
              <option value="best.weapon.rift">Best Rift</option>
              <option value="Chrome Celestial Dissonance">Chrome CD</option>
              <option value="Celestial Dissonance">CDT</option>
              <option value="Timesplit Dissonance Weapon">TDW</option>
              <option value="Mysteriously unYielding">MYNORCA</option>
              <option value="Focused Crystal Laser">FCL</option>
              <option value="Multi-Crystal Laser">MCL</option>
              <option value="Biomolecular Re-atomizer">BRT</option>
              <option value="Christmas Crystalabra">Christmas Crystalabra</option>
              <option value="Crystal Tower">CT</option>
            </select>
            <select id="selectBWRiftBase" style="width: 75px;" onchange="saveBWRift();">
              <option value="best.base.rift">Best Rift</option>
              <option value="Prestige Base">Prestige</option>
              <option value="Clockwork Base">Clockwork</option>
              <option value="Fissure Base">Fissure</option>
              <option value="Rift Base">Rift</option>
              <option value="Fracture Base">Fracture</option>
              <option value="Attuned Enerchi Induction Base">A. Enerchi</option>
              <option value="Enerchi Induction Base">Enerchi</option>
              <option value="Minotaur Base">Minotaur</option>
            </select>
            <select id="selectBWRiftTrinket" style="width: 75px;" onchange="saveBWRift();">
              <option value="None">None</option>
              <option value="Rift Vacuum Charm,Rift Super Vacuum Charm">Rift Vacuum Series</option>
              <option value="Rift Antiskele,Rift Tarnished,Rift Charm,Rift Luck Charm,Rift 2025,Rift 2024">Antiskele>NoExtra</option>
              <option value="Rift Tarnished,Rift Charm,Rift Luck Charm,Rift 2025,Rift 2024">NoExtra</option>
              <option value="Rift Antiskele,Rift Vacuum Charm,Rift Super Vacuum Charm">Antiskele>Vacuum</option>
            </select>
            <select id="selectBWRiftBait" style="width: 75px;" onchange="saveBWRift();">
              <option value="None">None</option>
              <option value="Runic String">RSC</option>
              <option value="Ancient String">ASC</option>
              <option value="Runic/Ancient">RSC/ASC</option>
              <option value="Runic=>Ancient">RSC=>ASC</option>
              <option value="Ancient String,Runic String">ASC=>RSC</option>
              <option value="Ancient String,Brie String">ASC=>BSC</option>
              <option value="Brie String,Ancient String">BSC=>ASC</option>
              <option value="Runic String,Brie String">RSC=>BSC</option>
              <option value="Brie String,Runic String">BSC=>RSC</option>
              <option value="Magical String">Magical</option>
              <option value="Brie String">Brie</option>
              <option value="Swiss String">Swiss</option>
              <option value="Marble String">Marble</option>
            </select>
            <select id="selectBWRiftActivatePocketWatch" style="width: 75px;" onchange="saveBWRift();">
              <option value="false">Deactivate Quantum Pocketwatch</option>
              <option value="true">Activate Quantum Pocketwatch</option>
            </select>
          </td>
        </tr>

        <tr id="trBWRiftTrapSetupSpecial" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup based on current chamber"><b>Conditional Trap Setup </b></a>
            <select id="selectBWRiftCleaverStatus" style="width:75px;display:none" onchange="initControlsBWRift();">
              <option value="0">Cleaver Not Available</option>
              <option value="1">Cleaver Available</option>
            </select>
            <select id="selectBWRiftAlertLvl" style="width:75px;display:none" onchange="initControlsBWRift();">`;
        for (let i = 0; i < 7; i++)
          preferenceHTMLStr += `<option value="${i}">Alert Lvl ${i}</option>`;
        preferenceHTMLStr += `
            </select>
            <select id="selectBWRiftFTC" style="width:75px;display:none" onchange="initControlsBWRift();">`;
        for (let i = 0; i < 4; i++)
          preferenceHTMLStr += `<option value="${i}">FTC ${i}</option>`;
        preferenceHTMLStr += `
            </select>
            <select id="selectBWRiftHunt" style="width:75px;display:none" onchange="initControlsBWRift();">`;
        for (let i = 0; i <= 15; i++)
          preferenceHTMLStr += `<option value="${i}">Hunt ${i}</option>`;
        preferenceHTMLStr += `
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftWeaponSpecial" style="width: 75px;" onchange="saveBWRift();">
              <option value="MASTER">Master</option>
              <option value="Chrome Celestial Dissonance">Chrome CD</option>
              <option value="Celestial Dissonance">CDT</option>
              <option value="Timesplit Dissonance Weapon">TDW</option>
              <option value="Mysteriously unYielding">MYNORCA</option>
              <option value="Focused Crystal Laser">FCL</option>
              <option value="Multi-Crystal Laser">MCL</option>
              <option value="Biomolecular Re-atomizer">BRT</option>
              <option value="Christmas Crystalabra">Christmas Crystalabra</option>
              <option value="Crystal Tower">CT</option>
            </select>
            <select id="selectBWRiftBaseSpecial" style="width: 75px;" onchange="saveBWRift();">
              <option value="MASTER">Master</option>
              <option value="Prestige Base">Prestige</option>
              <option value="Clockwork Base">Clockwork</option>
              <option value="Fissure Base">Fissure</option>
              <option value="Rift Base">Rift</option>
              <option value="Fracture Base">Fracture</option>
              <option value="Enerchi Induction Base">Enerchi</option>
              <option value="Attuned Enerchi Induction Base">A. Enerchi</option>
              <option value="Minotaur Base">Minotaur</option>
            </select>
            <select id="selectBWRiftTrinketSpecial" style="width: 75px;" onchange="saveBWRift();">
              <option value="MASTER">Master</option>
              <option value="None">None</option>
            </select>
            <select id="selectBWRiftBaitSpecial" style="width: 75px;" onchange="saveBWRift();">
              <option value="MASTER">Master</option>
              <option value="None">None</option>
              <option value="Runic String">RSC</option>
              <option value="Ancient String">ASC</option>
              <option value="Runic/Ancient">RSC/ASC</option>
              <option value="Runic=>Ancient">RSC=>ASC</option>
              <option value="Ancient String,Runic String">ASC=>RSC</option>
              <option value="Ancient String,Brie String">ASC=>BSC</option>
              <option value="Brie String,Ancient String">BSC=>ASC</option>
              <option value="Runic String,Brie String">RSC=>BSC</option>
              <option value="Brie String,Runic String">BSC=>RSC</option>
              <option value="Magical String">Magical</option>
              <option value="Brie String">Brie</option>
              <option value="Swiss String">Swiss</option>
              <option value="Marble String">Marble</option>
            </select>
            <select id="selectBWRiftActivatePocketWatchSpecial" style="width: 75px;" onchange="saveBWRift();">
              <option value="MASTER">Master</option>
              <option value="false">Deactivate Quantum Pocketwatch</option>
              <option value="true">Activate Quantum Pocketwatch</option>
            </select>
          </td>
        </tr>

        <tr id="trBWRiftActivatePocketWatch" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Activate Quantum Pocketwatch forcibly"><b>Force Activate Quantum</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftForceActiveQuantum" style="width: 75px;" onchange="onSelectBWRiftForceActiveQuantum();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;&nbsp;If Remaining Loot/Obelisk Charge &le;&nbsp;&nbsp;:&nbsp;&nbsp;
            <input type="number" id="inputRemainingLootA" min="1" max="100" size="5" value="1" onchange="onInputRemaininigLootAChanged(this);">
          </td>
        </tr>

        <tr id="trBWRiftDeactivatePocketWatch" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Deactivate Quantum Pocketwatch forcibly"><b>Force Deactivate Quantum</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectBWRiftForceDeactiveQuantum" style="width: 75px;" onchange="onSelectBWRiftForceDeactiveQuantum();">
            <option value="false">No</option>
            <option value="true">Yes</option>
            </select>&nbsp;&nbsp;If Remaining Loot/Obelisk Charge &le;&nbsp;&nbsp;:&nbsp;&nbsp;
            <input type="number" id="inputRemainingLootD" min="1" max="100" size="5" value="1" onchange="onInputRemaininigLootDChanged(this);">
          </td>
        </tr>
        `;
        /* FRox HTML
        相關的function為 initControlsFRox()、saveFRox()及 fortRox(). */
        preferenceHTMLStr += `
        <tr id="trFRoxTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup based on current stage"><b>Trap Setup for </b></a>
            <select id="selectFRoxStage" onchange="initControlsFRox();">
              <option value="day">Day</option>
              <option value="twilight">Twilight</option>
              <option value="midnight">Midnight</option>
              <option value="pitch">Pitch</option>
              <option value="utter">Utter Darkness</option>
              <option value="first">First Light</option>
              <option value="dawn">Dawn</option>
              <option value="lair">HotM</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFRoxWeapon" style="width: 75px;" onchange="saveFRox();">
              <option value=""></option>
              <option value="best.weapon.law">Best Law</option>
              <option value="best.weapon.arcane">Best Arcane</option>
              <option value="best.weapon.shadow">Best Shadow</option>
            </select>
            <select id="selectFRoxBase" style="width: 75px;" onchange="saveFRox();">
              <option value=""></option>
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectFRoxTrinket" style="width: 75px;" onchange="saveFRox();">
              <option value="None">None</option>
            </select>
            <select id="selectFRoxBait" style="width: 75px;" onchange="saveFRox();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Crescent">Crescent</option>
              <option value="Moon">Moon</option>
              <option value="ANY_LUNAR">Moon/Crescent</option>
              <option value="Moon=>Crescent">Moon=>Crescent</option>
              <option value="Crescent=>Moon">Crescent=>Moon</option>
              <option value="Sunrise Cheese">Sunrise</option>
            </select>
            <select id="selectFRoxActivateTower" style="width: 75px;" onchange="saveFRox();">
              <option value="false">Deactivate Tower</option>
              <option value="true">Activate Tower</option>
            </select>
          </td>
        </tr>

        <tr id="trFRoxDeactiveTower" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to deactivate tower when full HP"><b>Deactivate Tower When HP Full</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFRoxFullHPDeactivate" onchange="saveFRox();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            &nbsp;&nbsp;Use&nbsp;
            <select id="selectFRoxCharmOnHighDamage" style="width: 75px;" onchange="saveFRox();">
              <option value=""></option>
            </select>
            &nbsp;at Rate&nbsp;
            <input id="inputHighDamageRate" type="number" value="99" min="0" style="width: 2.5em" onchange="saveFRox();">00%.
            <input id="inputStopAtHunts" type="number" value="1" min="0" style="width: 2.5em" onchange="saveFRox();">
            <a title="Leave when less then hunts to Dawn. 0 means not leave. 1 means stop asap at dawn."><b>hunts to Dawn</b></a>,travel to&nbsp;
            <select id="selectFRoxTravelTo" onchange="saveFRox();">
              <option value=""></option>
            </select>
          </td>
        </tr>
        `;
        // GES HTML
        preferenceHTMLStr += `
        <tr id="trGESTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;"><a><b>Trap Setup at </b></a>
            <select id="selectGESStage" style="width: 75px;" onchange="initControlsGES();">
              <option value="SD_BEFORE">Supply Depot (No Supply Rush)</option>
              <option value="SD_AFTER">Supply Depot (Supply Rush)</option>
              <option value="RR">Raider River</option>
              <option value="DC">Daredevil Canyon</option>
              <option value="WAITING">Waiting</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectGESTrapWeapon" style="width: 75px;" onchange="saveGES();">
              <option value="best.weapon.law">Best Law</option>
              <option value="Supply Grabber">Supply Grabber</option>
              <option value="Bandit Deflector">Bandit Deflector</option>
              <option value="Engine Doubler">Engine Doubler</option>
            </select>
            <select id="selectGESTrapBase" style="width: 75px" onchange="saveGES();">
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectGESTrapTrinket" style="width: 75px;" onchange="saveGES();">
              <option value=""></option>
              <option value="None">None</option>
              <option value="Supply Schedule Charm">Supply Schedule Charm</option>
            </select>
            <select id="selectGESRRTrapTrinket" style="width: 75px;display:none" onchange="saveGES();">
              <option value=""></option>
              <option value="None">None</option>
              <option value="AUTO">Roof Rack/Door Guard/Greasy Glob</option>
            </select>
            <select id="selectGESDCTrapTrinket" style="width: 75px;display:none" onchange="saveGES();">
              <option value=""></option>
              <option value="None">None</option>
              <option value="Magmatic Crystal,Black Powder,Dusty Coal">Magmatic Crystal/Black Powder/Dusty Coal</option>
              <option value="Dusty Coal,Black Powder,Magmatic Crystal">Dusty Coal/Black Powder/Magmatic Crystal</option>
              <option value="Dusty Coal Charm">Dusty Coal Charm</option>
              <option value="Black Powder Charm">Black Powder Charm</option>
              <option value="Magmatic Crystal Charm">Magmatic Crystal Charm</option>
            </select>
            <select id="selectGESTrapBait" style="width: 75px" onchange="saveGES();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
            <br/>
            <select id="selectGESAutoBoard" style="width: 55px" onchange="saveGES();">
              <option value="true">Auto</option>
              <option value="false">Not</option>
            </select>
            &nbsp;<a title="Auto board nearest train of specified hours long"><b>board</b></a>&nbsp;
            <select id="selectGESTrainDuration" style="width: 55px" onchange="saveGES();">
              <option value="any">Any</option>
              <option value="9">9</option>
              <option value="16">16</option>
              <option value="36">36</option>
              <option value="72">72</option>
            </select>&nbsp;
            <b>hours train.</b>&nbsp;&nbsp;
            <select id="selectGESAutoResttimes" style="width: 55px" onchange="saveGES();">
              <option value="true">Auto</option>
              <option value="false">Not</option>
            </select>&nbsp;
            <a title="Auto change resttimes for max gold:16 hours SD, 24 hours RR, 8 hours DC"><b>resttimes.</b></a>&nbsp;
            <a title="Sleep for how many hours before and after RR on 72 hours train."><b>Sleep</b></a>&nbsp;
            <input type="number" value="11.75" step="0.25" min="9" max="15.25" id="inputGESSleepHours" onchange="saveGES();">
            <b>Hours</b><br/>
            <a title=""><b>Not Use Repellent when RR</b></a>&nbsp;
            <input type="number" id="inputHoursNoMinigame" min="1" max="24" size="5" value="9" onchange="saveGES(this);">&nbsp;
            <a title=""><b>hours left.</b></a>&nbsp;
          </td>
        </tr>

        <tr id="trGESSDLoadCrate" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Load Crate</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectGESSDLoadCrate" onchange="onSelectGESSDLoadCrate();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;&nbsp;<a><b>When Crate &ge; :</b></a>&nbsp;
            <input type="number" id="inputMinCrate" min="1" max="50" size="5" value="11" onchange="saveGES(this);">&nbsp;&nbsp;
            <a><b>before</b></a>&nbsp;
            <input type="number" id="inputGoalRateStopLoadCrate" min="0" max="1" size="5" step="0.01" value="0.4" onchange="saveGES(this);">&nbsp;&nbsp;
            <a><b>Team Goal</b></a>&nbsp;
          </td>
        </tr>

        <tr id="trGESRRRepellent" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Use Repellent</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectGESRRRepellent" onchange="onSelectGESRRRepellent();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;&nbsp;<a><b>When Repellent &ge; :</b></a>&nbsp;
            <input type="number" id="inputMinRepellent" min="1" max="50" size="5" value="11" onchange="saveGES(this);">
          </td>
        </tr>

        <tr id="trGESDCStokeEngine" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Stoke Engine</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectGESDCStokeEngine" onchange="onSelectGESDCStokeEngine();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;&nbsp;<a><b>When Fuel Nuggests &ge;:</b></a>&nbsp;
            <input type="number" id="inputMinFuelNugget" min="1" max="20" size="5" value="20" onchange="saveGES(this);">
          </td>
        </tr>
        `;
        // WWRift HTML
        preferenceHTMLStr += `
        <tr id="trWWRiftAutomation" style="display:none;">
          <td colspan="2" style="height:24px; text-align:right;">
            <a title="Auto start MBW hunting when one faction rage 25 and sum of total rage greater then"><b>Start MBW</b></a>&nbsp;:&nbsp;
            <input type="number" id="inputWWRiftStartMBW" min="1" max="73" size="5" onchange="saveWWRift();">
            <a title="Start using funnel charm in auto faction when charm quantity greater than or equal to"><b>Start</b></a>&nbsp;:&nbsp;
            <input type="number" id="inputWWRiftStartFunnel" min="1" max="50" size="5" onchange="saveWWRift();">
            <a title="Stop using funnel charm in auto faction when charm quantity less than or equal to"><b>Stop</b></a>&nbsp;:&nbsp;
            <input type="number" id="inputWWRiftStopFunnel" min="0" max="50" size="5" onchange="saveWWRift();">
            <a title="Try use less funnel charm with higher risk of unexpected mini boss"><b>Stint</b></a>&nbsp;:&nbsp;
            <select id="selectWWRiftSaveFunnelCharm" onchange="saveWWRift();">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <a title="Leave WWRift in MBW auto hunting when any faction rage 50"><b>Travel to</b></a>&nbsp;:&nbsp;
            <select id="selectWWRiftTravelTo" onchange="saveWWRift();">
              <option value=""></option>
            </select>
          </td>
        </tr>

        <tr id="trWWRiftFactionFocus" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select a faction to focus on"><b>Faction to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectWWRiftFaction" onchange="onSelectWWRiftFaction();">
              <option value="CC">Auto Faction</option>
              <!-- <option value="CC">Crazed Clearing</option>-->
              <!--  <option value="GGT">Gigantic Gnarled Tree</option>-->
              <!--  <option value="DL">Deep Lagoon</option>-->
              <option value="MBW_40_44">MBW 40 &le; Rage &le; 44</option>
              <option value="MBW_45_48">MBW 45 &le; Rage &le; 48</option>
            </select>
          </td>
        </tr>

        <tr id="trWWRiftFactionFocusNext" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select next faction to focus on"><b>Next Faction to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectWWRiftFactionNext" onchange="saveWWRift();">
              <option value="Remain">Auto</option>
              <!-- <option value="Remain">Remain</option>-->
              <!-- <option value="CC">Crazed Clearing</option>-->
              <!-- <option value="GGT">Gigantic Gnarled Tree</option>-->
              <!-- <option value="DL">Deep Lagoon</option>-->
            </select>
          </td>
        </tr>

        <tr id="trWWRiftTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to trap setup based on certain range of rage"><b>Trap for Rage</b></a>&nbsp;
            <select id="selectWWRiftRage" onchange="initControlsWWRift();">
              <option value="0">0-24</option>
              <option value="25">25-49</option>
              <option value="50">50</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectWWRiftTrapWeapon" onchange="saveWWRift();">
              <option value="best.weapon.rift">Best Rift</option>
              <option value="MASTER">Master</option>
              <option value="Chrome Celestial Dissonance">Chrome CD</option>
              <option value="Celestial Dissonance">CDT</option>
              <option value="Timesplit Dissonance Weapon">TDW</option>
              <option value="Mysteriously unYielding">MYNORCA</option>
              <option value="Derelict Airship">DA</option>
              <option value="Focused Crystal Laser">FCL</option>
              <option value="Multi-Crystal Laser">MCL</option>
              <option value="Biomolecular Re-atomizer">BRT</option>
              <option value="Christmas Crystalabra">Christmas Crystalabra</option>
              <option value="Crystal Tower">CT</option>
            </select>
            <select id="selectWWRiftTrapBase" style="width: 75px" onchange="saveWWRift();">
              <option value="best.base.rift">Best Rift</option>
            </select>
            <select id="selectWWRiftTrapTrinket" style="width: 75px" onchange="saveWWRift();">
              <option value="None">None</option>
              <option value="FSC">Faction Specific Charm</option>
              <option value="Enerchi Charm,Rift Vacuum Charm">Enerchi Charm>Rift Vacuum Charm</option>
            </select>
            <select id="selectWWRiftTrapBait" onchange="saveWWRift();">
              <option value="None">None</option>
              <option value="Magical String">Magical</option>
              <option value="Brie String">Brie</option>
              <option value="Swiss String">Swiss</option>
              <option value="Marble String">Marble</option>
            </select>
          </td>
        </tr>

        <tr id="trWWRiftMBWMinRage" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select minimum rage to hunt MBW"><b>Min Rage to Hunt MBW</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <input type="number" id="inputMinRage" min="40" max="48" size="5" value="40" onchange="onInputMinRageChanged(this);">
          </td>
        </tr>

        <tr id="trWWRiftMBWTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Trap Setup When </b></a>
            <select id="selectWWRiftMBWBar4044" style="width: 75px; display:none" onchange="initControlsWWRift();">
              <option value="25_0">0 Bar &ge; 25 Rage</option>
              <option value="25_1">1 Bar &ge; 25 Rage</option>
              <option value="25_2">2 Bars &ge; 25 Rage</option>
              <option value="MIN_RAGE_0">3 Bars &ge; 25 Rage / 0 Bar &ge; Min Rage to Hunt MBW</option>
              <option value="MIN_RAGE_1">1 Bar &ge; Min Rage to Hunt MBW</option>
              <option value="MIN_RAGE_2">2 Bars &ge; Min Rage to Hunt MBW</option>
              <option value="MIN_RAGE_3">3 Bars &ge; Min Rage to Hunt MBW</option>
            </select>
            <select id="selectWWRiftMBWBar4548" style="width: 75px; display:none" onchange="initControlsWWRift();">
              <option value="25_0">0 Bar &ge; 25 Rage</option>
              <option value="25_1">1 Bar &ge; 25 Rage</option>
              <option value="25_2">2 Bars &ge; 25 Rage</option>
              <option value="44_0">3 Bars &ge; 25 Rage / 0 Bar &ge; 43 Rage</option>
              <option value="44_1">1 Bar &ge; 43 Rage</option>
              <option value="44_2">2 Bars &ge; 43 Rage</option>
              <option value="44_3">3 Bars &ge; 43 Rage / 0 Bar &ge; Min Rage to Hunt MBW</option>
              <option value="MIN_RAGE_1">1 Bar &ge; Min Rage to Hunt MBW</option>
              <option value="MIN_RAGE_2">2 Bars &ge; Min Rage to Hunt MBW</option>
              <option value="MIN_RAGE_3">3 Bars &ge; Min Rage / 0 Bar &ge; 50 Rage to Hunt MBW</option>
              <option value="50_1">1 Bar 50 Rage to Hunt MBW</option>
              <option value="50_2">2 Bars 50 Rage to Hunt MBW</option>
              <option value="50_3">3 Bars 50 Rage to Hunt MBW</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectWWRiftMBWTrapWeapon" onchange="saveWWRift();">
              <option value="best.weapon.rift">Best Rift</option>
              <option value="Jacked Rabbot">Jacked Rabbot</option>
              <option value="The Forgotten Art of Dance">The Forgotten Art of Dance</option>
              <option value="MASTER">Master</option>
              <option value="Chrome Celestial Dissonance">Chrome CD</option>
              <option value="Celestial Dissonance">CDT</option>
              <option value="Timesplit Dissonance Weapon">TDW</option>
              <option value="Mysteriously unYielding">MYNORCA</option>
              <option value="Derelict Airship">DA</option>
              <option value="Focused Crystal Laser">FCL</option>
              <option value="Multi-Crystal Laser">MCL</option>
              <option value="Biomolecular Re-atomizer">BRT</option>
              <option value="Christmas Crystalabra">Christmas Crystalabra</option>
              <option value="Crystal Tower">CT</option>
            </select>
            <select id="selectWWRiftMBWTrapBase" style="width: 75px" onchange="saveWWRift();">
              <option value="best.base.rift">Best Rift</option>
              <option value="Wooden Base with Target">Wooden Base with Target</option>
              <option value="Cheesecake Base">Cheesecake Base</option>
            </select>
            <select id="selectWWRiftMBWTrapTrinket" style="width: 75px" onchange="saveWWRift();">
              <option value="None">None</option>
              <option value="FSCLR">Faction Specific Charm (Lowest Rage)</option>
              <option value="Enerchi Charm,Rift Vacuum Charm">Enerchi Charm>Rift Vacuum Charm</option>
            </select>
            <select id="selectWWRiftMBWTrapBait" onchange="saveWWRift();">
              <option value="None">None</option>
              <option value="Lactrodectus Lancashire">LLC</option>
              <option value="Magical String">Magical</option>
              <option value="Brie String">Brie</option>
              <option value="Swiss String">Swiss</option>
              <option value="Marble String">Marble</option>
            </select>
          </td>
        </tr>
        `;
        // FRift HTML
        preferenceHTMLStr += `
        <tr id="trFREnterBattery" style="display:none;">
          <!-- Enter pagoda battery level-->
          <td style="height:24px; text-align:right;">
            <a title="Select which battery level to enter Pagoda"><b>Enter at Battery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
          <select id="selectEnterAtBattery" onchange="saveFR();">
            <option value="None">None</option>`;
        for (let i = 1; i < 11; i++)
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        preferenceHTMLStr += `
          </select>&nbsp;<b>and after</b>&nbsp;
          <input title="Auto enter pagoda after this time" type="text" value="" style="width: 10em;" id="inputFREnterAfterTime" onchange="saveFR();">&nbsp;<b>and before</b>&nbsp;
          <input title="Auto enter pagoda before this time" type="text" value="" style="width: 10em;" id="inputFREnterBeforeTime" onchange="saveFR();"><br/>
          <!-- auto fix or not-->
          <select id="selectFRAutoFix" onchange="saveFR();">
            <option value="true">Auto fix</option>
            <option value="false">Manual fix</option>
          </select>&nbsp;<b>battery(37 Pla, 15 Cir!!). Leave at </b>
          <select id="selectLeaveAtBattery" onchange="saveFR();">
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
            <option value="0">0</option>
            <option value="-1">-1</option>
            <option value="-2">-2</option>
            <option value="-3">-3</option>
            <option value="-4">-4</option>
            <option value="-5">-5</option>
            <option value="-6">-6</option>
            <option value="-7">-7</option>
            <option value="-8">-8</option>
            <option value="-9">-9</option>
            <option value="-10">-10</option>
          </select>&nbsp;<b>to</b>&nbsp;
          <select id="selectFRiftTravelTo" onchange="saveFR();">
            <option value=""></option>
          </select>
          </td>
        </tr>
        <tr id="trFRRetreatBattery" style="display:none;">
          <!-- Retreat battery level-->
          <td style="height:24px; text-align:right;">
            <a title="Select which battery level to retreat from  Pagoda"><b>Retreat at Battery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectRetreatAtBattery" onchange="saveFR();">`;
        for (i = 0; i < 11; i++)
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        preferenceHTMLStr += `
            </select>&nbsp;&nbsp;
            <a title="Comma seperated reserved Fusion,Glutter,Combat,Susheese,Rumble,Gorgonzola,Ascend Cheese Quantity"><b>Reserved Cheese Qty:</b></a>&nbsp;
            <input type="text" id="inputReservedCheeseQty" value="1,1,1,1,1,1,1" onchange="saveFR();">
          </td>
        </tr>
        <tr id="trFRTrapSetupAtBattery" style="display:none;">
          <!-- trap setup-->
          <td style="height:24px; text-align:right;"><a title="Select trap setup for each battery"><b>Trap Setup at Battery</b></a>&nbsp;&nbsp;
            <!-- battery level-->
            <select id="selectTrapSetupAtBattery" onchange="initControlsFR();">`;
        for (let i = 0; i < 11; i++)
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        preferenceHTMLStr += `
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <!-- weapon-->
            <select id="selectFRTrapWeapon" onchange="saveFR();">
              <option value="best.weapon.rift">Best Rift</option>
              <option value="MASTER">Master</option>
              <option value="Chrome Celestial Dissonance">Chrome CD</option>
              <option value="Celestial Dissonance">CDT</option>
              <option value="Timesplit Dissonance Weapon">TDW</option>
              <option value="Mysteriously unYielding">MYNORCA</option>
              <option value="Focused Crystal Laser">FCL</option>
              <option value="Multi-Crystal Laser">MCL</option>
              <option value="Biomolecular Re-atomizer">BRT</option>
              <option value="Christmas Crystalabra">Christmas Crystalabra</option>
              <option value="Crystal Tower">CT</option>
            </select>
            <!-- base-->
            <select id="selectFRTrapBase" onchange="saveFR();">
              <option value="best.base.rift">Best Rift</option>
              <option value="Prestige Base">Prestige</option>
              <option value="Clockwork Base">Clockwork</option>
              <option value="Fissure Base">Fissure</option>
              <option value="Rift Base">Rift</option>
              <option value="Fracture Base">Fracture</option>
              <option value="Enerchi Induction Base">Enerchi</option>
              <option value="Attuned Enerchi Induction Base">A. Enerchi</option>
              <option value="Minotaur Base">Minotaur</option>
            </select>
            <!-- charm-->
            <select id="selectFRTrapTrinket" style="width: 75px" onchange="saveFR();">
              <option value="None">None</option>
            </select>
            <!-- bait-->
            <select id="selectFRTrapBait" style="width: 75px" onchange="onSelectFRTrapBait();">
              <option value="None">None</option>
              <option value="Ascended">Ascended</option>
              <option value="Null Onyx Gorgonzola">Null Onyx Gorgonzola</option>
              <option value="Rift Rumble">Rift Rumble</option>
              <option value="Rift Glutter">Rift Glutter</option>
              <option value="Rift Susheese">Rift Susheese</option>
              <option value="Rift Combat">Rift Combat</option>
              <option value="CYCLIC_MASTER">Glutter&gt;Combat&gt;Susheese&lt;</option>
              <option value="CYCLIC_MASTER_ALL">Fusion&gt;Glutter&gt;Combat&gt;Susheese&lt;</option>
              <option value="RUMBLE_MASTER">Rumble Master</option>
              <option value="ANY_MASTER">Glutter/Combat/Susheese</option>
              <option value="BALANCE_MASTER">Balance Heirloom</option>
              <option value="ORDER_MASTER">Master Cheese in Order</option>
              <option value="Master Fusion">Master Fusion</option>
              <option value="Maki String">Maki</option>
              <option value="Magical String">Magical</option>
              <option value="Brie String">Brie</option>
              <option value="Swiss String">Swiss</option>
              <option value="Marble String">Marble</option>
            </select>
            <select id="selectFRTrapBaitMasterOrder" style="width: 75px;display:none" onchange="saveFR();">
              <option value="Glutter=>Combat=>Susheese">Glutter=>Combat=>Susheese</option>
              <option value="Glutter=>Susheese=>Combat">Glutter=>Susheese=>Combat</option>
              <option value="Combat=>Glutter=>Susheese">Combat=>Glutter=>Susheese</option>
              <option value="Combat=>Susheese=>Glutter">Combat=>Susheese=>Glutter</option>
              <option value="Susheese=>Glutter=>Combat">Susheese=>Glutter=>Combat</option>
              <option value="Susheese=>Combat=>Glutter">Susheese=>Combat=>Glutter</option>
            </select>
          </td>
        </tr>
        `;
        // Iceberg HTML
        preferenceHTMLStr += `
        <tr id="trIceberg" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select to trap setup based on current phase"><b>Trap Setup for</b></a>
            <select id="selectIcebergPhase" style="width: 75px" onchange="initControlsIceberg();">
              <option value="GENERAL">Iceberg General</option>
              <option value="TREACHEROUS">Treacherous Tunnels</option>
              <option value="BRUTAL">Brutal Bulwark</option>
              <option value="BOMBING">Bombing Run</option>
              <option value="MAD">Mad Depths</option>
              <option value="ICEWING">Icewing\'s Lair</option>
              <option value="HIDDEN">Hidden Depths</option>
              <option value="DEEP">The Deep Lair</option>
              <option value="SLUSHY">Slushy Shoreline</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectIcebergBase" style="width: 75px" onchange="saveIceberg();">
            </select>
            <select id="selectIcebergTrinket" style="width: 75px" onchange="saveIceberg();">
              <option value="None">None</option>
            </select>
            <select id="selectIcebergBait" style="width: 75px" onchange="saveIceberg();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
          </td>
        </tr>
        `;
        // ZTower HTML
        preferenceHTMLStr += `
        <tr id="trZTFocus" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to chesspiece side to focus"><b>Side to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectZTFocus" onchange="saveZT();">
              <option value="MYSTIC">Mystic Only</option>
              <option value="TECHNIC">Technic Only</option>
              <option value="MYSTIC=>TECHNIC">Mystic First Technic Second</option>
              <option value="TECHNIC=>MYSTIC">Technic First Mystic Second</option>
            </select>
          </td>
        </tr>
        <tr id="trZTTrapSetup1st" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select trap setup based on first focus-side chesspiece order"><b>First Side Trap Setup for </b></a>
            <select id="selectZTMouseOrder1st" onchange="initControlsZT();">
              <option value="PAWN">Pawn</option>
              <option value="KNIGHT">Knight</option>
              <option value="BISHOP">Bishop</option>
              <option value="ROOK">Rook</option>
              <option value="QUEEN">Queen</option>
              <option value="KING">King</option>
              <option value="CHESSMASTER">Chessmaster</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectZTWeapon1st" style="width: 75px" onchange="saveZT();">
              <option value="MPP/TPP">Focused-Side Pawn Pincher</option>
              <option value="BPT/OAT">Focused-Side Trap BPT/OAT</option>
              <option value="best.weapon.tactical">Best Tactical</option>
            </select>
            <select id="selectZTBase1st" style="width: 75px" onchange="saveZT();">
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectZTTrinket1st" style="width: 75px" onchange="saveZT();">
              <option value="None">None</option>
            </select>
            <select id="selectZTBait1st" style="width: 75px" onchange="saveZT();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
              <option value="Checkmate">Checkmate</option>
            </select>
          </td>
        </tr>
        <tr id="trZTTrapSetup2nd" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup based on second focus-side chesspiece order"><b>Second Side Trap Setup for </b></a>
            <select id="selectZTMouseOrder2nd" onchange="initControlsZT();">
              <option value="PAWN">Pawn</option>
              <option value="KNIGHT">Knight</option>
              <option value="BISHOP">Bishop</option>
              <option value="ROOK">Rook</option>
              <option value="QUEEN">Queen</option>
              <option value="KING">King</option>
              <option value="CHESSMASTER">Chessmaster</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectZTWeapon2nd" style="width: 75px" onchange="saveZT();">
              <option value="MPP/TPP">Focused-Side Pawn Pincher</option>
              <option value="BPT/OAT">Focused-Side Trap BPT/OAT</option>
              <option value="best.weapon.tactical">Best Tactical</option>
            </select>
            <select id="selectZTBase2nd" style="width: 75px" onchange="saveZT();">
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectZTTrinket2nd" style="width: 75px" onchange="saveZT();">
              <option value="None">None</option>
            </select>
            <select id="selectZTBait2nd" style="width: 75px" onchange="saveZT();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
              <option value="Checkmate">Checkmate</option>
            </select>
          </td>
        </tr>
        `;
        // SGarden HTML
        preferenceHTMLStr += `
        <tr id="trSGTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select to trap setup based on certain season"><b>Trap Setup For </b></a>
            <select id="selectSGSeason" onchange="initControlsSG();">
              <option value="SPRING">Spring</option>
              <option value="SUMMER">Summer</option>
              <option value="FALL">Fall</option>
              <option value="WINTER">Winter</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectSGTrapWeapon" style="width: 75px" onchange="saveSG();">
              <option value="best.weapon.physical">Best Physical</option>
              <option value="best.weapon.tactical">Best Tactical</option>
              <option value="best.weapon.shadow">Best Shadow</option>
              <option value="best.weapon.hydro">Best Hydro</option>
            </select>
            <select id="selectSGTrapBase" style="width: 75px" onchange="saveSG();">
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectSGTrapTrinket" style="width: 75px" onchange="saveSG();">
              <option value="None">None</option>
            </select>
            <select id="selectSGTrapBait" style="width: 75px" onchange="saveSG();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
          </td>
        </tr>

        <tr id="trSGDisarmBait" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to disarm bait when amplifier is fully charged"><b>Disarm Bait</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectSGDisarmBait" onchange="saveSG();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;
            <b>as Amp. full. Travel to</b>&nbsp;
            <select id="selectSGTravelTo" onchange="saveSG();">
              <option value=""></option>
            </select>&nbsp;
            <b>as Amp. close to</b>&nbsp;
            <input type="number" id="inputSGRequiredAmplifier" value="0" max="175" onchange="saveSG();" style="width: 3em;">
          </td>
        </tr>
        `;
        // LGArea HTML
        preferenceHTMLStr += `
        <tr id="trLGTGAutoFill" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Auto Fill in </b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLGTGAutoFillSide" onchange="initControlsLG();">
            <option value="LG">Living Garden</option>
            <option value="TG">Twisted Garden</option>
            </select>
            <select id="selectLGTGAutoFillState" onchange="saveLG();">
            <option value="false">No</option>
            <option value="true">Yes</option>
            </select>
          </td>
        </tr>
        <tr id="trLGTGAutoPour" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Auto Pour in </b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLGTGAutoPourSide" onchange="initControlsLG();">
              <option value="LG">Living Garden</option>
              <option value="TG">Twisted Garden</option>
            </select>
            <select id="selectLGTGAutoPourState" onchange="saveLG();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </td>
        </tr>
        <tr id="trPourTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <select id="selectLGTGStatus" onchange="initControlsLG();">
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="tc">TC</option>
              <option value="boss">Boss</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <a><b>Poured in </b></a>
            <select id="selectLGTGSide" onchange="initControlsLG();">
              <option value="LG">Living Garden</option>
              <option value="TG">Twisted Garden</option>
            </select>
            <select id="selectLGTGBase" style="width: 75px" onchange="saveLG();">
              <option value="">Best LG Base</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectLGTGTrinket" style="width: 75px" onchange="saveLG();">
              <option value="None">None</option>
            </select>
            <select id="selectLGTGBait" style="width: 75px" onchange="saveLG();">
              <option value="">Auto</option>
              <option value="None">None</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Duskshade Camembert">Duskshade Camembert</option>
              <option value="Lunaria Camembert">Lunaria Camembert</option>
            </select>
          </td>
        </tr>
        <tr id="trCurseLiftedTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <select id="selectLCCCStatus" onchange="initControlsLG();">
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="boss">Boss</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <a><b>Curse Lifted in </b></a>
            <select id="selectLCCCSide" onchange="initControlsLG();">
              <option value="LC">Lost City</option>
              <option value="CC">Cursed City</option>
            </select>
            <select id="selectLCCCBase" style="width: 75px" onchange="saveLG();">
              <option value="">Best LG Base</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectLCCCTrinket" style="width: 75px" onchange="saveLG();">
              <option value="">Auto</option>
              <option value="None">None</option>
            </select>
          </td>
        </tr>
        <tr id="trStampedeTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <select id="selectSDStatus" onchange="initControlsLG();">
              <option value="before">Before</option>
              <option value="after">During</option>
              <option value="boss">Boss</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <a><b>Grubling Stampede in Sand Dunes </b></a>
            <select id="selectSDBase" style="width: 75px" onchange="saveLG();">
              <option value="">Best LG Base</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectSDTrinket" style="width: 75px" onchange="saveLG();">
              <option value="">Auto</option>
              <option value="None">None</option>
            </select>
          </td>
        </tr>
        <tr id="trSaltedTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <select id="selectSaltedStatus" onchange="initControlsLG();">
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="boss">Boss</option>
            </select>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <a><b> Salt Charging</b></a>
            <select id="selectSCBase" style="width: 75px" onchange="saveLG();">
              <option value="">Best LG Base</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectSCTrinket" style="width: 75px" onchange="saveLG();">
              <option value="">Auto</option>
              <option value="None">None</option>
            </select>&nbsp;&nbsp;<a title="Max number of salt before hunting King Grub"><b>Salt Charge : </b></a>
            <input type="number" id="inputKGSalt" min="1" max="50" size="5" value="25" onchange="saveLG();">
          </td>
        </tr>
        `;
        // GWH- old
        preferenceHTMLStr += '<tr id="trGWHTrapSetup" style="display:none;">';
        preferenceHTMLStr +=
          '<td style="height:24px; text-align:right;"><a title="Select trap setup based on anchor/boost status"><b>Trap Setup When </b></a>';
        preferenceHTMLStr +=
          '<select id="selectGWHZone" style="width: 75px" onchange="initControlsGWH2016();">';
        preferenceHTMLStr +=
          '<option value="ORDER1">Simple Zone With Order</option>';
        preferenceHTMLStr +=
          '<option value="ORDER2">Deluxe Zone With Order</option>';
        preferenceHTMLStr +=
          '<option value="NONORDER1">Simple Zone W/O Order</option>';
        preferenceHTMLStr +=
          '<option value="NONORDER2">Deluxe Zone W/O Order</option>';
        preferenceHTMLStr +=
          '<option value="WINTER_WASTELAND">Winter Wasteland</option>';
        preferenceHTMLStr +=
          '<option value="SNOWBALL_STORM">Snowball Storm</option>';
        preferenceHTMLStr += '<option value="FLYING">Flying</option>';
        preferenceHTMLStr +=
          '<option value="NEW_YEAR\'S_PARTY">New Year\'s Party</option>';
        preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '<td style="height:24px">';
        preferenceHTMLStr +=
          '<select id="selectGWHWeapon" style="width: 75px" onchange="saveGWH2016();">';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr +=
          '<select id="selectGWHBase" style="width: 75px" onchange="saveGWH2016();">';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr +=
          '<select id="selectGWHTrinket" style="width: 75px;" onchange="onSelectGWHTrinketChanged();">';
        preferenceHTMLStr += '<option value="None">None</option>';
        preferenceHTMLStr += '<option value="ANCHOR_FAC/EAC">FAC/EAC</option>';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr +=
          '<select id="selectGWHBait" style="width: 75px" onchange="saveGWH2016();">';
        preferenceHTMLStr += '<option value="None">None</option>';
        preferenceHTMLStr +=
          '<option value="ANY_FESTIVE_BRIE">AA/Festive Cheese/Brie</option>';
        preferenceHTMLStr +=
          '<option value="ANY_FESTIVE_GOUDA">AA/Festive Cheese/Gouda</option>';
        preferenceHTMLStr +=
          '<option value="ANY_FESTIVE_SB">AA/Festive Cheese/SUPER|brie+</option>';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr +=
          '<select id="selectGWHBoost" style="width: 75px" onchange="saveGWH2016();">';
        preferenceHTMLStr += '<option value="false">Not Boost</option>';
        preferenceHTMLStr += '<option value="true">Boost</option>';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '</tr>';
        preferenceHTMLStr += '<tr id="trGWHTurboBoost" style="display:none;">';
        preferenceHTMLStr +=
          '<td style="height:24px; text-align:right;"><a title="Select to always Turbo boost (500m)"><b>Always Turbo Boost</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
        preferenceHTMLStr += '<td style="height:24px">';
        preferenceHTMLStr +=
          '<select id="selectGWHUseTurboBoost" onchange="saveGWH2016();">';
        preferenceHTMLStr += '<option value="false">No</option>';
        preferenceHTMLStr += '<option value="true">Yes</option>';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '</tr>';
        preferenceHTMLStr += '<tr id="trGWHFlying" style="display:none;">';
        preferenceHTMLStr +=
          '<td style="height:24px; text-align:right;"><a title="Select minimum AA to take flight"><b>Min AA to Fly (&ge;)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
        preferenceHTMLStr += '<td style="height:24px">';
        preferenceHTMLStr +=
          '<input type="number" id="inputMinAA" min="0" max="9007199254740991" style="width:50px" value="20" onchange="onInputMinAAChanged(this);">';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '</tr>';
        preferenceHTMLStr +=
          '<tr id="trGWHFlyingFirework" style="display:none;">';
        preferenceHTMLStr +=
          '<td style="height:24px; text-align:right;"><a title="Select minimum firework to take flight"><b>Min Firework to Fly (&ge;)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
        preferenceHTMLStr += '<td style="height:24px">';
        preferenceHTMLStr +=
          '<input type="number" id="inputMinFirework" min="0" max="9007199254740991" style="width:50px" value="20" onchange="onInputMinWorkChanged(this);">';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '</tr>';
        preferenceHTMLStr += '<tr id="trGWHFlyingLand" style="display:none;">';
        preferenceHTMLStr +=
          '<td style="height:24px; text-align:right;"><a title="Select whether land after firework run out"><b>Land after Firework Run Out</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
        preferenceHTMLStr += '<td style="height:24px">';
        preferenceHTMLStr +=
          '<select id="selectGWHLandAfterRunOutFirework" onchange="saveGWH2016();">';
        preferenceHTMLStr += '<option value="false">No</option>';
        preferenceHTMLStr += '<option value="true">Yes</option>';
        preferenceHTMLStr += '</select>';
        preferenceHTMLStr += '</td>';
        preferenceHTMLStr += '</tr>';

        // SCCustom HTML
        preferenceHTMLStr += `
        <tr id="trSCCustom" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select custom algorithm"><b>SC Custom Algorithm</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectSCHuntZone" style="width:75px" onChange="initControlsSCCustom();">
              <option value="ZONE_NOT_DIVE">Surface</option>
              <option value="ZONE_DEFAULT">Default</option>
              <option value="ZONE_CORAL">Coral</option>
              <option value="ZONE_SCALE">Scale</option>
              <option value="ZONE_BARNACLE">Barnacle</option>
              <option value="ZONE_TREASURE">Treasure</option>
              <option value="ZONE_DANGER">Danger</option>
              <option value="ZONE_DANGER_PP">Danger PP MT</option>
              <option value="ZONE_DANGER_PP_LOTA">Danger PP LOTA</option>
              <option value="ZONE_OXYGEN">Oxygen</option>
              <option value="ZONE_BONUS">Bonus</option>
            </select>
            <select id="selectSCHuntZoneEnable" style="width:75px;display:none" onChange="saveSCCustomAlgo();">
              <option value="true">Hunt</option>
              <option value="false">Jet Through</option>
            </select>
            <select id="selectSCHuntBait" style="width: 75px" onchange="saveSCCustomAlgo();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
              <option value="Fishy Fromage">Fishy Fromage</option>
            </select>
            <select id="selectSCHuntTrinket" style="width: 75px" onchange="saveSCCustomAlgo();">
              <option value="None">None</option>
              <option value="Empowered Anchor">EAC</option>
              <option value="GAC_EAC">GAC, EAC</option>
              <option value="SAC_EAC">SAC, EAC</option>
              <option value="UAC_EAC">UAC, EAC</option>
            </select>
          </td>
        </tr>
        <tr id="trSCCustomUseSmartJet" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to always use Smart Water Jet Charm"><b>Use Smart Jet</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
          <td style="height:24px">
            <select id="selectSCUseSmartJet" onchange="saveSCCustomAlgo();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </td>
        </tr>
        `;
        // Labyrinth HTML
        preferenceHTMLStr += `
        <tr id="trLabyrinth" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select a hunting plan to focus on"><b>District to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLabyrinthDistrict" onChange="onSelectLabyrinthDistrict();">
              <option value="None">None</option>
              <option value="FEALTY">Fealty</option>
              <option value="TECH">Tech</option>
              <option value="SCHOLAR">Scholar</option>
              <option value="TREASURY">Treasury</option>
              <option value="FARMING">Farming</option>
              <option value="MINOTAUR">Minotaur</option>
              <option value="HIGHEST">Highest Clue</option>
              <option value="BALANCE">Balance Item</option>
            </select>
            <a title="Select a minor district to focus on"><b>Minor Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectLabyrinthMinorDistrict" onChange="onSelectLabyrinthDistrict();">
              <option value="None">None</option>
              <option value="FEALTY">Fealty</option>
              <option value="TECH">Tech</option>
              <option value="SCHOLAR">Scholar</option>
              <option value="TREASURY">Treasury</option>
              <option value="FARMING">Farming</option>
            </select>
          </td>
        </tr>
        `;
        // Focus types queue
        preferenceHTMLStr += `
        <tr id="trLabyrinthFocusTypesQueue" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Use focus types queue"><b>Use focus types queue</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <input type="text" id="inputLabyrinthFocusTypesQueue" value="TREASURY,FARMING,FEALTY,SCHOLAR,TECH" onchange="saveLaby();">
            &nbsp;<b>except</b>&nbsp;
            <input type="text" id="inputLabyrinthPlansIgnoreQueue" value="MINOTAUR,HIGHEST,BALANCE" onchange="saveLaby();">
          </td>
        </tr>
        // Stop hunting when total clues near 100
        <tr id="trLabyrinthDisarm" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to travel to specified location at X last hunt in hallway when total clues near 100"><b>Travel to</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLabyrinthTravelTo" onchange="saveLaby();">
              <option value=""></option>
            </select>
            &nbsp;&nbsp;At Last&nbsp;
            <input type="number" id="inputLabyrinthLastHunt" min="2" max="10" style="width:40px" value="2" onchange="onInputLabyrinthLastHuntChanged(this);">
            &nbsp;Hunt(s) in Hallway Near 100 Total Clues
          </td>
        </tr>
        `;
        // Arm other base
        preferenceHTMLStr += `
        <tr id="trLabyrinthArmOtherBase" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select to arm other base"><b>Arm Other Base</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLabyrinthOtherBase" style="width: 75px" onchange="saveLaby();">
              <option value="false">No</option>
              <option value="Treasure Seeker Base">Treasure Seeker</option>
              <option value="Compass Magnet Base">Compass Magnet</option>
              <option value="Prestige Base">Prestige</option>
            </select>&nbsp;&nbsp;Select Treasure Seeker Base/Compass Magnet Base/Any other base
          </td>
        </tr>
        `;
        // Compass Magnet Charm
        preferenceHTMLStr += `
        <tr id="trLabyrinthDisarmCompass" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a><b>Disarm Compass Magnet</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLabyrinthDisarmCompass" onchange="onSelectLabyrinthDisarmCompass();">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            &nbsp;&nbsp;If Dead End Clue &le; :&nbsp;
            <input type="number" id="inputLabyrinthDEC" min="0" max="20" style="width:40px" value="0" onchange="onInputLabyrinthDECChanged(this);">
          </td>
        </tr>
        `;
        // hallway priorities when focus-district clues less than 15
        preferenceHTMLStr += `
        <tr id="trPriorities15" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select hallway priorities when focus-district clues less than 15"><b>Priorities (Focus-District Clues < 15)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectHallway15Plain" onChange="saveLaby();">
              <option value="lp">Long Plain Hallway First</option>
              <option value="sp">Short Plain Hallway First</option>
            </select>
          </td>
        </tr>
        `;
        // hallway priorities when focus-district clues within 15 and 60
        preferenceHTMLStr += `
        <tr id="trPriorities1560" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select hallway priorities when focus-district clues within 15 and 60"><b>Priorities (15 < Focus-District Clues < 60)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
          <td style="height:24px">
            <select id="selectHallway1560Superior" onchange="saveLaby();">
              <option value="ls">Long Superior Hallway First</option>
              <option value="ss">Short Superior Hallway First</option>
            </select>
            <select id="selectHallway1560Plain" onchange="saveLaby();">
              <option value="lp">Long Plain Hallway First</option>
              <option value="sp">Short Plain Hallway First</option>
            </select>
          </td>
        </tr>
        `;
        // hallway priorities when focus-district clues more than 60
        preferenceHTMLStr += `
        <tr id="trPriorities60" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select hallway priorities when focus-district clues more than 60"><b>Priorities (Focus-District Clues > 60)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
          <td style="height:24px">
            <select id="selectHallway60Epic" onchange="saveLaby();">
              <option value="le">Long Epic Hallway First</option>
              <option value="se">Short Epic Hallway First</option>
            </select>
            <select id="selectHallway60Superior" onchange="saveLaby();">
              <option value="ls">Long Superior Hallway First</option>
              <option value="ss">Short Superior Hallway First</option>
            </select>
            <select id="selectHallway60Plain" onchange="saveLaby();">
              <option value="lp">Long Plain Hallway First</option>
              <option value="sp">Short Plain Hallway First</option>
            </select>
          </td>
        </tr>
        `;
        // Auto open exit/door
        preferenceHTMLStr += `
        <tr id="trLabyrinthAutoOpenExit" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Auto open exit"><b>Auto Open Exit</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLabyrinthAutoOpenExit" onchange="saveLaby();">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>&nbsp;&nbsp;
            <a title="Auto open focus-type door"><b>Open Focus Door</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectLabyrinthOpenFocusDoor" onchange="saveLaby();">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </td>
        </tr>
        `;
        // Auto lantern
        preferenceHTMLStr += `
        <tr id="trLabyrinthAutoLantern" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Lit lantern when focus clues less than and turn off when more than"><b>Auto Lit Lantern</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectLabyrinthAutoLantern" onchange="saveLaby();">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>&nbsp;&nbsp;
            <b>when focus clues &lt;</b>&nbsp;
            <input type="number" id="inputLabyrinthFocusClues" min="0" style="width:40px" value="0" onchange="saveLaby();">
          </td>
        </tr>
        `;
        // Choose non-focus door
        preferenceHTMLStr += `
        <tr id="trLabyrinthOtherHallway" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Choose doors other than focused door when there is no available focused door to be choosen"><b>Open Non-Focus Door</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="chooseOtherDoors" onChange="saveLaby(); document.getElementById('typeOtherDoors').disabled = (value == 'false') ? 'disabled' : ''; ">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>&nbsp;&nbsp;
            <a title="Never open other doors when focusing on specified districts"><b>Always No when Focus on:</b></a>&nbsp;
            <input type="text" id="inputLabyrinthFocusTypesManualDoor" value="FEALTY,SCHOLAR,TECH" onchange="saveLaby();">
            <br/>
            <a title="Select a choosing type for non-focused doors"><b>Choosing Type:</b></a>&nbsp;
            <select id="typeOtherDoors" onChange="saveLaby();">
              <option value="SHORTEST_ONLY">Shortest Length Only</option>
              <option value="FEWEST_ONLY">Fewest Clue Only</option>
              <option value="SHORTEST_FEWEST">Shortest Length => Fewest Clue</option>
              <option value="FEWEST_SHORTEST">Fewest Clue => Shortest Length </option>
            </select>
          </td>
        </tr>
        `;
        // Trap setup
        preferenceHTMLStr += `
        <tr id="trLabyrinthWeaponFarming" style="display:none;">
          <td style="text-align:right;">
            <table width="100%">
              <tr><td style="height:24px; text-align:right;"><a title="Select trap in farming hallways"><b>Trap in Farming</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td></tr>
              <tr><td style="height:24px; text-align:right;"><a title="Select trap in treasury hallways"><b>Trap in Treasury</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td></tr>
              <tr><td style="height:24px; text-align:right;"><a title="Select trap in focus hallways"><b>Trap in Focus District</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td></tr>
              <tr><td style="height:24px; text-align:right;"><a title="Select trap in non-focus hallways"><b>Trap in Non-Focus District</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td></tr>
              <tr><td style="height:24px; text-align:right;"><a title="Select trap in entrance/intersection/exit"><b>Trap in Intersection</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td></tr>
            </table>
          </td>
          <td>
            <table width="100%">
              <!--Trap for farming-->
              <tr><td style="height:24px">
                <select id="selectLabyrinthWeaponType" style="width: 120px" onchange="saveLaby();">
                  <option value="best.weapon.forgotten">Forgotten</option>
                  <option value="best.weapon.arcane">Arcane</option>
                  <option value="best.weapon.physical">Physical</option>
                  <option value="Tacky Glue">Tacky Glue</option>
                </select>
                <select id="selectLabyrinthFarmingBait" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="Brie Cheese">Brie</option>
                  <option value="Empowered Brie">Empowered Brie</option>
                  <option value="Gouda">Gouda</option>
                  <option value="SUPER">SB+</option>
                  <option value="Empowered SUPER">Empowered SB+</option>
                  <option value="Ghoulgonzola">Ghoulgonzola</option>
                  <option value="Candy Corn">Candy Corn</option>
                  <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
                  <option value="Glowing Gruyere">GG</option>
                </select>
                <select id="selectLabyrinthFarmingCharm" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="None">None</option>
                </select>
              </td></tr>
              <!--Trap for treasury-->
              <tr><td style="height:24px">
                <select id="selectLabyrinthTreasuryWeaponType" style="width: 120px" onchange="saveLaby();">
                  <option value="best.weapon.forgotten">Forgotten</option>
                  <option value="best.weapon.arcane">Arcane</option>
                  <option value="best.weapon.physical">Physical</option>
                  <option value="Tacky Glue">Tacky Glue</option>
                </select>
                <select id="selectLabyrinthTreasuryBait" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="Brie Cheese">Brie</option>
                  <option value="Empowered Brie">Empowered Brie</option>
                  <option value="Gouda">Gouda</option>
                  <option value="SUPER">SB+</option>
                  <option value="Empowered SUPER">Empowered SB+</option>
                  <option value="Ghoulgonzola">Ghoulgonzola</option>
                  <option value="Candy Corn">Candy Corn</option>
                  <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
                  <option value="Glowing Gruyere">GG</option>
                </select>
                <select id="selectLabyrinthTreasuryCharm" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="None">None</option>
                </select>
              </td></tr>
              <!--Trap for focus-->
              <tr><td style="height:24px">
                <select id="selectLabyrinthFocusBait" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="Brie Cheese">Brie</option>
                  <option value="Empowered Brie">Empowered Brie</option>
                  <option value="Gouda">Gouda</option>
                  <option value="SUPER">SB+</option>
                  <option value="Empowered SUPER">Empowered SB+</option>
                  <option value="Ghoulgonzola">Ghoulgonzola</option>
                  <option value="Candy Corn">Candy Corn</option>
                  <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
                  <option value="Glowing Gruyere">GG</option>
                </select>
                <select id="selectLabyrinthFocusCharm" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="None">None</option>
                </select>
              </td></tr>
              <!-- Trap for non-focus-->
              <tr><td style="height:24px">
                <select id="selectLabyrinthNonFocusWeaponType" style="width: 120px" onchange="saveLaby();">
                  <option value="best.weapon.forgotten">Forgotten</option>
                  <option value="best.weapon.arcane">Arcane</option>
                  <option value="best.weapon.physical">Physical</option>
                  <option value="Tacky Glue">Tacky Glue</option>
                </select>
                <select id="selectLabyrinthNonFocusBase" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="Labyrinth Base,Cheesecake Base">Laby=>Attraction</option>
                </select>
                <select id="selectLabyrinthNonFocusBait" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="Brie Cheese">Brie</option>
                  <option value="Empowered Brie">Empowered Brie</option>
                  <option value="Gouda">Gouda</option>
                  <option value="SUPER">SB+</option>
                  <option value="Empowered SUPER">Empowered SB+</option>
                  <option value="Ghoulgonzola">Ghoulgonzola</option>
                  <option value="Candy Corn">Candy Corn</option>
                  <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
                  <option value="Glowing Gruyere">GG</option>
                </select>
                <select id="selectLabyrinthNonFocusCharm" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="None">None</option>
                </select>
              </td></tr>
              <!-- Trap for entrance/exit/intersection-->
              <tr><td style="height:24px">
                <select id="selectLabyrinthIntersectionBait" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="Brie Cheese">Brie</option>
                  <option value="Empowered Brie">Empowered Brie</option>
                  <option value="Gouda">Gouda</option>
                  <option value="SUPER">SB+</option>
                  <option value="Empowered SUPER">Empowered SB+</option>
                  <option value="Ghoulgonzola">Ghoulgonzola</option>
                  <option value="Candy Corn">Candy Corn</option>
                  <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
                  <option value="Glowing Gruyere">GG</option>
                </select>
                <select id="selectLabyrinthIntersectionCharm" style="width: 120px" onchange="saveLaby();">
                  <option value=""></option>
                  <option value="None">None</option>
                </select>
              </td></tr>
            </table>
          </td>
        </tr>
        `;

        // Zokor HTML
        preferenceHTMLStr += `
        <tr id="trZokorTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup under different boss status"><b>Trap Setup When</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <!-- District type-->
            <select id="selectZokorDistrictType" onChange="initControlsZokor();">
              <option value="FEALTY">Fealty</option>
              <option value="TECH">Tech</option>
              <option value="SCHOLAR">Scholar</option>
              <option value="TREASURY">Treasury</option>
              <option value="FARMING">Farming</option>
            </select>&nbsp;&nbsp;
            <!-- Boss status-->
            <select id="selectZokorBossStatus" onChange="initControlsZokor();">
              <option value="UNAVAILABLE">UNAVAILABLE</option>
              <option value="INCOMING">Boss Incoming</option>
              <option value="ACTIVE">Boss Active</option>
              <option value="DEFEATED">Boss Defeated</option>
            </select>&nbsp;&nbsp;
            <!-- Bait-->
            <select id="selectZokorBait" style="width: 75px" onChange="saveZokor();">
              <option value=""></option>
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
              <option value="Glowing Gruyere">GG</option>
            </select>&nbsp;&nbsp;
            <!-- Weapon-->
            <select id="selectZokorWeapon" style="width: 75px" onChange="saveZokor();">
              <option value=""></option>
              <option value="None">None</option>
              <option value="best.weapon.forgotten">Forgotten</option>
              <option value="best.weapon.arcane">Arcane</option>
            </select>&nbsp;&nbsp;
            <!-- Base-->
            <select id="selectZokorBase" style="width: 75px" onChange="saveZokor();">
              <option value=""></option>
              <option value="None">None</option>
              <option value="best.base.combo">Best Combo</option>
            </select>&nbsp;&nbsp;
            <!-- Charm-->
            <select id="selectZokorTrinket" style="width: 75px" onChange="saveZokor();">
              <option value=""></option>
              <option value="None">None</option>
            </select>
          </td>
        </tr>
        `;
        // FW HTML
        preferenceHTMLStr += `
        <tr id="trFWAll" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="0 if not leave. 1 at risk of hunt plus trap check may beat Warmonger."><b>When Warden less then</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFWStopAtWardenLessThan" onchange="saveFW();">
        `;
        for (let i = 1; i < 14; i++) {
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        }
        preferenceHTMLStr += '</select>, ';
        preferenceHTMLStr += `
            travel to
            <select id="selectFWTravelTo" onchange="saveFW();">
              <option value=""></option>
            </select>.
          </td>
        </tr>
        `;
        // wave
        preferenceHTMLStr += `
        <tr id="trFWWave" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select FW wave"><b>Wave</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFWWave" onChange="initControlsFW();">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <a title="Use Cavalry/Mage Charm or not"><b>Use&nbsp;&nbsp;</b></a>
            <select id="selectHasCavalryCharm" onchange="saveFW();">
              <option value="true">Cavalry</option>
              <option value="false">No</option>
            </select>&nbsp;&nbsp;
            <select id="selectHasMageCharm" onchange="saveFW();">
              <option value="true">Mage</option>
              <option value="false">No</option>
            </select>
          </td>
        </tr>
        `;
        // Special Charms
        preferenceHTMLStr += `
        <tr id="trFWSpecialCharms" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Charm for only one of Soldiers/Cavalry/Mage/Artillery left"><b>Last type Charm</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <a title="Paste charm name for only one kind of Soldier left"><b>Soldier</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
                <input id="inputCharmOnlySoldier" type="text" onChange="saveFW();">&nbsp;
            <a title="Paste charm name for only Cavalry left"><b>Cavalry</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              <input id="inputCharmOnlyCavalry" type="text" onChange="saveFW();"><br/>
            <a title="Paste charm name for only Mage left"><b>Mage</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              <input id="inputCharmOnlyMage" type="text" onChange="saveFW();">
            <a title="Paste charm name for only Flame Ordnance left"><b>Artillery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              <input id="inputCharmOnlyArtillery" type="text" onChange="saveFW();"><br/>
            <a title="Paste charm name for some fews"><b>Somefews</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
              <input id="inputCharmSomeFews" type="text" onChange="saveFW();">
          </td>
        </tr>
        `;
        // Artillery Commander Trap
        preferenceHTMLStr += `
        <tr id="trFWArtilleryCommanderTrap" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Charm for Artillery Commander Trap"><b>Artillery Commander</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
              <input title="Paste charm name for Artillery Commander" placeholder="Charm Name" id="inputCharmArtilleryCommander" type="text" onChange="saveFW();">
          </td>
        </tr>
        `;
        // physical trap
        preferenceHTMLStr += `
        <tr id="trFWTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select trap setup based on certain FW wave"><b>Trap Setup</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
          <td style="height:24px">
            <a title="Base"><b>Base</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupBase" style="width: 75px" onchange="saveFW();">
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>&nbsp;&nbsp;
            <a title="Physical Weapon"><b>Physical</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupWeapon" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.physical">Best Physical</option>
            </select>&nbsp;&nbsp;
            <a title="Cavalry Weapon"><b>Cavalry</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupCavalry" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.tactical">Best Tactical</option>
              <option value="best.weapon.physical">Best Physical</option>
            </select><br/>
            <a title="Mage Weapon"><b>Mage</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupMage" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.hydro">Best Hydro</option>
              <option value="best.weapon.physical">Best Physical</option>
            </select>&nbsp;&nbsp;
            <a title="Artillery Weapon"><b>Artillery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupArtillery" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.arcane">Best Arcane</option>
              <option value="best.weapon.physical">Best Physical</option>
            </select>&nbsp;&nbsp;
            <a title="Commander Weapon"><b>Commander</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupCommander" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.physical">Best Physical</option>
              <option value="best.weapon.tactical">Best Tactical</option>
              <option value="best.weapon.draconic">Best Draconic</option>
              <option value="best.weapon.arcane">Best Arcane</option>
            </select>&nbsp;&nbsp;<br/>
            <a title="Weapon For Some Fews"><b>Some Fews</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWTrapSetupSomeFews" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.physical">Best Physical</option>
              <option value="best.weapon.tactical">Best Tactical</option>
              <option value="best.weapon.hydro">Best Hydro</option>
              <option value="best.weapon.arcane">Best Arcane</option>
            </select>
          </td>
        </tr>
        `;
        // wave 4 trap
        preferenceHTMLStr += `
        <tr id="trFW4TrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;"><a title="Select trap setup based on warden status"><b>Trap Setup </b></a>
            <select id="selectFW4WardenStatus" onchange="initControlsFW();">
              <option value="before">Before</option>
              <option value="after">After</option>
            </select><a><b> Clear Warden</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFW4TrapSetupWeapon" style="width: 75px" onchange="saveFW();">
              <option value="best.weapon.physical">Best Physical</option>
            </select>
            <select id="selectFW4TrapSetupBase" style="width: 75px" onchange="saveFW();">
              <option value="best.base.power">Best Power</option>
              <option value="best.base.luck">Best Luck</option>
              <option value="best.base.combo">Best Combo</option>
            </select>
            <select id="selectFW4TrapSetupTrinket" style="width: 75px" onchange="saveFW();">
              <option value="None">None</option>
            </select>
            <select id="selectFW4TrapSetupBait" style="width: 75px" onchange="saveFW();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
          </td>
        </tr>
        `;
        // focus type
        preferenceHTMLStr += `
        <tr id="trFWFocusType" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select either Normal (Warrior, Scout, Archer) or Special (Cavalry, Mage)"><b>Soldier Type to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFWFocusType" onChange="saveFW();">
              <option value="NORMAL">Normal</option>
              <option value="SPECIAL">Special</option>
            </select>&nbsp;&nbsp;<a title="Select which soldier type comes first based on population"><b>Priorities:</b></a>&emsp;
            <select id="selectFWPriorities" onChange="saveFW();">
              <option value="HIGHEST">Highest Population First</option>
              <option value="LOWEST">Lowest Population First</option>
            </select>
          </td>
        </tr>
        `;
        //
        preferenceHTMLStr += `
        <tr id="trFWStreak" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select streak"><b>Streak</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectFWStreak" onChange="initControlsFW();">`;
        for (let i = 0; i < 16; i++) {
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        }
        preferenceHTMLStr += `
            </select>
            <select id="selectFWCheese" style="width: 75px" onChange="saveFW();">
              <option value="None">None</option>
              <option value="Brie Cheese">Brie</option>
              <option value="Empowered Brie">Empowered Brie</option>
              <option value="Gouda">Gouda</option>
              <option value="SUPER">SB+</option>
              <option value="Empowered SUPER">Empowered SB+</option>
              <option value="Ghoulgonzola">Ghoulgonzola</option>
              <option value="Candy Corn">Candy Corn</option>
              <option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>
            </select>
            <select id="selectFWCharmType" style="width: 75px" onChange="saveFW();">
              <option value="None">None</option>
              <option value="Warpath">Warpath</option>
              <option value="Super Warpath">Super Warpath</option>
            </select>
            <select id="selectFWSpecial" style="width: 75px" onChange="saveFW();">
              <option value="None">None</option>
              <option value="COMMANDER">Commander</option>
              <option value="GARGANTUA">Gargantua</option>
              <option value="GARGANTUA_GGC" disabled="disabled">Gargantua GGC</option>
              <option value="GARGANTUA_COMM">Gargantua Commander</option>
            </select>
          </td>
        </tr>
        `;
        // last mouse type
        preferenceHTMLStr += `
        <tr id="trFWLastType" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select config when there is only one soldier type left"><b>Last Soldier Type</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px;">
            <select id="selectFWLastTypeConfig" onChange="saveFW();">
              <option value="CONFIG_STREAK">Follow Streak Config</option>
              <option value="CONFIG_GOUDA">Gouda & No Warpath Charm</option>
              <option value="HUNT_GARGANTUA">Hunt Gargantua</option>
              <option value="HUNT_GARGANTUA_SB">Hunt Gargantua 4up SB+</option>
              <option value="HUNT_GARGANTUA_ALL_SB">Hunt Gargantua all SB+</option>
              <option value="NO_WARPATH">No Warpath Charm Only</option>
              <option value="CONFIG_UNCHANGED">Trap Setup Unchanged</option>
            </select>&nbsp;&nbsp;<a title="Select whether to include Artillery in checking of Last Soldier"><b>Include Artillery:</b></a>&emsp;
            <select id="selectFWLastTypeConfigIncludeArtillery" onchange="saveFW();">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </td>
        </tr>
        `;
        // ignore mouse less than
        preferenceHTMLStr += `
        <tr id="trFWSupportConfig" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Ignore mouse whose quantity less than"><b>Ignore mouse less than</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px">
            <select id="selectIgnoreLessThan" onchange="saveFW();">`;
        for (let i = 1; i < 22; i++) {
          preferenceHTMLStr += `<option value="${i}">${i}</option>`;
        }
        preferenceHTMLStr += `
            </select>&nbsp;&nbsp;
            <a title="Select whether to disarm any Warpath Charm when supports are gone"><b>Disarm warpath charm when support retreated</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
            <select id="selectFWSupportConfig" onchange="saveFW();">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </td>
        </tr>
        `;
        // BRCustom HTML/burroughsRift HTML/BRift HTML
        preferenceHTMLStr += `
        <tr id="trBRConfig" style="display:none;">
          <td colspan="2">
            <table>
              <tr>
                <td style="height:24px; text-align:right;">
                  <a title="Select the mist tier to hunt"><b>Hunt At</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
                </td>
                <td style="height:24px;">
                  <select id="selectBRHuntMistTier" onChange="onSelectBRHuntMistTierChanged();">
                    <option value="Red">Red</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="None">None</option>
                  </select>&nbsp;&nbsp;Mist Tier
                </td>
              </tr>
              <tr>
                <td style="height:24px; text-align:right;">
                  <a title="Auto start misting at mist tier0 when canister more then"><b>Auto Start misting when has more then</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
                </td>
                <td style="height:24px;">
                  <input type="number" id="inputBREnoughCanister" min="1" max="999" value="100" onchange="onInputToggleCanisterChanged(this);">&nbsp;&nbsp;canisters
                </td>
                </tr>
              <tr>
                <td style="height:24px; text-align:right;">
                  <select id="selectBRAutoTerreRicotta">
                    <option value="true">Auto</option>
                    <option value="false">Manual</option>
                  </select>&nbsp;&nbsp;:&nbsp;&nbsp;
                </td>
                <td style="height:24px;">
                  <a title="Arm Terre Ricotta when have more then"><b>Arm Terre Ricotta when have more then&nbsp;&nbsp;</b></a>
                  <input type="number" id="inputBRAutoTerreRicottaAtQuantity" min="1" max="999" value="10" onchange="onInputToggleCanisterChanged(this);">&nbsp;&nbsp;pieces
                </td>
              </tr>
              <tr>
                <td style="height:24px; text-align:right;">
                  <a title="Change to charm when arming Terre Ricotta"><b>Arm</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
                </td>
                <td style="height:24px;">
                  <select id="selectBRCharmPairedWithTerreRicotta" style="width: 75px" onchange="saveBR();">
                    <option value="None">None</option>
                  </select>&nbsp;&nbsp;when arming Terre Ricotta
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr id="trBRToggle" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select the amount of hunt to toggle canister"><b>Toggle Canister Every</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px;">
            <input type="number" id="inputToggleCanister" min="1" max="999" value="1" onchange="onInputToggleCanisterChanged(this);">&nbsp;&nbsp;Hunt(s)
          </td>
        </tr>

        <tr id="trBRTrapSetup" style="display:none;">
          <td style="height:24px; text-align:right;">
            <a title="Select trap setup combination for respective mist tier"><b>Trap Setup</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;
          </td>
          <td style="height:24px;">
            <select id="selectBRTrapWeapon" onchange="saveBR();">
              <option value="best.weapon.rift">Best Rift</option>
              <option value="Chrome Celestial Dissonance">Chrome CD</option>
              <option value="Celestial Dissonance">CDT</option>
              <option value="Timesplit Dissonance Weapon">TDW</option>
              <option value="Mysteriously unYielding">MYNORCA</option>
              <option value="Focused Crystal Laser">FCL</option>
              <option value="Multi-Crystal Laser">MCL</option>
              <option value="Biomolecular Re-atomizer">BRT</option>
              <option value="Christmas Crystalabra">Christmas Crystalabra</option>
              <option value="Crystal Tower">CT</option>
            </select>
            <select id="selectBRTrapBase" style="width: 75px" onchange="saveBR();">
              <option value="best.base.rift">Best Rift</option>
            </select>
            <select id="selectBRTrapTrinket" style="width: 75px" onchange="saveBR();">
              <option value="None">None</option>
            </select>
            <select id="selectBRTrapBait" onchange="saveBR();">
              <option value="None">None</option>
              <option value="Polluted Parmesan">PP</option>
              <option value="Terre Ricotta">Terre</option>
              <option value="Magical String">Magical</option>
              <option value="Brie String">Brie</option>
              <option value="Swiss String">Swiss</option>
              <option value="Marble String">Marble</option>
              <option value="Undead String Emmental">USE</option>
            </select>
          </td>
        </tr>

        <tr>
          <td style="height:24px; text-align:right;" colspan="2">
            <input type="button" id="AlgoConfigSaveInput" title="Save changes of Event or Location without reload, take effect after current hunt"
              value="Apply" onclick="setSessionToLocal();">&nbsp;&nbsp;&nbsp;
            <input type="button" id="AlgoConfigSaveReloadInput" title="Save changes of Event or Location with reload, take effect immediately"
              value="Apply & Reload" onclick="setSessionToLocal();${temp}">&nbsp;&nbsp;&nbsp;
          </td>
        </tr>
        `;

        if (eventLocation == 'Hunt For') {
          preferenceHTMLStr += '<tr>';
          preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
          preferenceHTMLStr +=
            '<a title="Type in how many hunts you want to hunt for"><b>How many hunts?</b></a>';
          preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
          preferenceHTMLStr += '</td>';
          preferenceHTMLStr += '<td style="height:24px">';
          preferenceHTMLStr +=
            '<input type="number" id="nobHuntsLeftInput" name="nobHuntsLeftInput" value="' +
            NOBhuntsLeft +
            '" />';
          preferenceHTMLStr += '</td>';
          preferenceHTMLStr += '</tr>';
        }

        preferenceHTMLStr += `
        <tr>
          <td style="height:24px; text-align:right;">
            <a title="FOR DEVS ONLY" onclick="if(confirm('Are you sure you want to inject code?')) $('#addonCode').toggle();">
              <b>Click here if you would like to inject code.</b>
            </a>
          </td>
          <td>
            <textarea id="addonCode" rows="7" name="addonCode" style="width:100%;display:none;">${addonCode}</textarea>
          </td>
        </tr>

        </table>
        `;

        let NOBspecialMessageDiv = document.createElement('div');
        NOBspecialMessageDiv.setAttribute('id', 'nobSpecialMessage');
        NOBspecialMessageDiv.setAttribute(
          'style',
          'display: block; position: fixed; bottom: 0; z-index: 999; text-align: center; width: 760px;'
        );

        //let nobWhatsNewDiv = document.createElement('div');
        //nobWhatsNewDiv.setAttribute('id', 'nobWhatsNew');
        //nobWhatsNewDiv.setAttribute('style', 'display: block; position: fixed; bottom: 0; left: 0; z-index: 999; text-align: left; width: 200px; height: 100px; padding: 10px 0 10px 10px;');

        let nobWhatsNewDiv = document.createElement('div');
        nobWhatsNewDiv.innerHTML =
          '<style>' +
          '@-webkit-keyframes colorRotate {' +
          'from {color: rgb(255, 0, 0);}' +
          '16.6% {color: rgb(255, 0, 255);}' +
          '33.3% {color: rgb(0, 0, 255);}' +
          '50% {color: rgb(0, 255, 255);}' +
          '66.6% {color: rgb(0, 255, 0);}' +
          '83.3% {color: rgb(255, 255, 0);}' +
          'to {color: rgb(255, 0, 0);}' +
          '@-moz-keyframes colorRotate {' +
          'from {color: rgb(255, 0, 0);}' +
          '16.6% {color: rgb(255, 0, 255);}' +
          '33.3% {color: rgb(0, 0, 255);}' +
          '50% {color: rgb(0, 255, 255);}' +
          '66.6% {color: rgb(0, 255, 0);}' +
          '83.3% {color: rgb(255, 255, 0);}' +
          'to {color: rgb(255, 0, 0);}' +
          '@-o-keyframes colorRotate {' +
          'from {color: rgb(255, 0, 0);}' +
          '16.6% {color: rgb(255, 0, 255);}' +
          '33.3% {color: rgb(0, 0, 255);}' +
          '50% {color: rgb(0, 255, 255);}' +
          '66.6% {color: rgb(0, 255, 0);}' +
          '83.3% {color: rgb(255, 255, 0);}' +
          'to {color: rgb(255, 0, 0);}' +
          '@keyframes colorRotate {' +
          'from {color: rgb(255, 0, 0);}' +
          '16.6% {color: rgb(255, 0, 255);}' +
          '33.3% {color: rgb(0, 0, 255);}' +
          '50% {color: rgb(0, 255, 255);}' +
          '66.6% {color: rgb(0, 255, 0);}' +
          '83.3% {color: rgb(255, 255, 0);}' +
          'to {color: rgb(255, 0, 0);}' +
          '</style>';

        let preferenceDiv = document.createElement('div');
        preferenceDiv.setAttribute('id', 'preferenceDiv');
        if (showPreference === true)
          preferenceDiv.setAttribute('style', 'display: block');
        else preferenceDiv.setAttribute('style', 'display: none');
        preferenceDiv.innerHTML = preferenceHTMLStr;
        timerDivElement.appendChild(preferenceDiv);
        timerDivElement.appendChild(NOBspecialMessageDiv);
        timerDivElement.appendChild(nobWhatsNewDiv);
        preferenceHTMLStr = null;
        showPreference = null;

        let hr3Element = document.createElement('hr');
        preferenceDiv.appendChild(hr3Element);
        hr3Element = null;
        preferenceDiv = null;
        NOBspecialMessageDiv = null;
        nobWhatsNewDiv = null;

        // embed all msg to the page
        headerElement.parentNode.insertBefore(timerDivElement, headerElement);
        timerDivElement = null;

        let scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.setAttribute('id', 'scriptUIFunction');
        scriptElement.innerHTML = functionToHTMLString(bodyJS);
        headerElement.parentNode.insertBefore(scriptElement, headerElement);
        scriptElement = null;

        //addKREntries();
        //setKREntriesColor();

        // insert trap ddl
        let objSelectStr = {
          weapon: [
            'selectWeapon',
            'selectZTWeapon1st',
            'selectZTWeapon2nd',
            'selectBestTrapWeapon',
            'selectFWTrapSetupWeapon',
            'selectFW4TrapSetupWeapon',
            'selectSGTrapWeapon',
            'selectFRoxWeapon',
            'selectGWHWeapon',
            'selectBCJODWeapon',
            'selectFGARWeapon'
          ],
          base: [
            'selectBase',
            'selectLabyrinthOtherBase',
            'selectZTBase1st',
            'selectZTBase2nd',
            'selectBestTrapBase',
            'selectFWTrapSetupBase',
            'selectFW4TrapSetupBase',
            'selectLGTGBase',
            'selectLCCCBase',
            'selectSDBase',
            'selectSCBase',
            'selectIcebergBase',
            'selectGESTrapBase',
            'selectSGTrapBase',
            'selectFRoxBase',
            'selectGWHBase',
            'selectBRTrapBase',
            'selectWWRiftTrapBase',
            'selectWWRiftMBWTrapBase',
            'selectBCJODBase',
            'selectFGARBase',
            'selectLabyrinthNonFocusBase',
            'selectZokorBase'
          ],
          trinket: [
            'selectTrinket',
            'selectZTTrinket1st',
            'selectZTTrinket2nd',
            'selectFRTrapTrinket',
            'selectBRCharmPairedWithTerreRicotta',
            'selectBRTrapTrinket',
            'selectLGTGTrinket',
            'selectLCCCTrinket',
            'selectSDTrinket',
            'selectSCTrinket',
            'selectIcebergTrinket',
            'selectWWRiftTrapTrinket',
            'selectWWRiftMBWTrapTrinket',
            'selectGESTrapTrinket',
            'selectGESRRTrapTrinket',
            'selectGESDCTrapTrinket',
            'selectFW4TrapSetupTrinket',
            'selectSGTrapTrinket',
            'selectSCHuntTrinket',
            'selectFRoxTrinket',
            'selectFRoxCharmOnHighDamage',
            'selectGWHTrinket',
            'selectBWRiftTrinket',
            'selectBWRiftTrinketSpecial',
            'selectBCJODTrinket',
            'selectFGARTrinket',
            'selectLabyrinthFarmingCharm',
            'selectLabyrinthTreasuryCharm',
            'selectLabyrinthFocusCharm',
            'selectLabyrinthNonFocusCharm',
            'selectLabyrinthIntersectionCharm',
            'selectZokorTrinket'
          ],
          bait: ['selectBait', 'selectGWHBait']
        };
        let optionEle;
        for (let prop in objTrapCollection) {
          if (objTrapCollection.hasOwnProperty(prop)) {
            objTrapCollection[prop] = objTrapCollection[prop].sort();
            for (let i = 0; i < objTrapCollection[prop].length; i++) {
              optionEle = document.createElement('option');
              optionEle.setAttribute('value', objTrapCollection[prop][i]);
              optionEle.innerText = objTrapCollection[prop][i];
              if (objSelectStr.hasOwnProperty(prop)) {
                for (let j = 0; j < objSelectStr[prop].length; j++) {
                  temp = document.getElementById(objSelectStr[prop][j]);
                  if (!isNullOrUndefined(temp))
                    temp.appendChild(optionEle.cloneNode(true));
                }
              }
            }
          }
        }
        // customize ddl
        let toBeAppend = [['selectGESTrapWeapon', objBestTrap.weapon.law]];
        for (let i = 0; i < toBeAppend.length; i++) {
          const arr = toBeAppend[i];
          temp = document.getElementById(arr[0]);
          if (!isNullOrUndefined(temp)) {
            for (let j = 0; j < arr[1].length; j++) {
              const str = arr[1][j];
              optionEle = document.createElement('option');
              optionEle.setAttribute('value', str);
              optionEle.innerText = str;
              temp.appendChild(optionEle.cloneNode(true));
            }
          }
        }
        // insert location ddl
        let toBeAppendLocations = [
          ['selectSleepIn', sleepIn],
          ['selectWorkIn', workIn],
          ['selectFRoxTravelTo', null],
          ['selectFWTravelTo', null],
          ['selectFRiftTravelTo', null],
          ['selectSGTravelTo', null],
          ['selectWWRiftTravelTo', null],
          ['selectBWRiftTravelTo', null],
          ['selectLabyrinthTravelTo', null]
        ];
        locations.sort((a, b) => {
          return a[1].localeCompare(b[1]);
        });
        for (let i = 0; i < toBeAppendLocations.length; i++) {
          const arr = toBeAppendLocations[i];
          temp = document.getElementById(arr[0]);
          if (!isNullOrUndefined(temp)) {
            for (let j = 0; j < locations.length; j++) {
              const elmt = locations[j];
              optionEle = document.createElement('option');
              optionEle.setAttribute('value', elmt[0]);
              optionEle.innerText = elmt[1];
              temp.appendChild(optionEle.cloneNode(true));
            }
            if (arr[1]) temp.value = arr[1];
          }
        }
        //document.getElementById('idRestore').style.display = (targetPage) ? 'table-row' : 'none';
        //document.getElementById('idGetLogAndPreference').style.display = (targetPage) ? 'table-row' : 'none';
        //document.getElementById('clearTrapList').style.display = (targetPage) ? 'table-row' : 'none';
        document.getElementById('showPreferenceLink').style.display = targetPage
          ? 'table-row'
          : 'none';
      }
      headerElement = null;
    }

    targetPage = null;
  } catch (e) {
    for (let prop in e) {
      logging(
        'embedTimer error stack: ' + prop + ' value: [' + e[prop] + ']\n'
      );
    }

    logging('embedTimer error - ' + e);
    logging(e);
  }
}

function loadPreferenceSettingFromStorage() {
  /*
    let aggressiveModeTemp = getStorage("AggressiveMode");
    if (aggressiveModeTemp == undefined || aggressiveModeTemp == null) {
        setStorage("AggressiveMode", aggressiveMode.toString());
    } else if (aggressiveModeTemp == true || aggressiveModeTemp.toLowerCase() == "true") {
        aggressiveMode = true;
    } else {
        aggressiveMode = false;
    }
    aggressiveModeTemp = undefined;

    let hornTimeDelayMinTemp = getStorage("HornTimeDelayMin");
    let hornTimeDelayMaxTemp = getStorage("HornTimeDelayMax");
    if (hornTimeDelayMinTemp == undefined || hornTimeDelayMinTemp == null || hornTimeDelayMaxTemp == undefined || hornTimeDelayMaxTemp == null) {
        setStorage("HornTimeDelayMin", hornTimeDelayMin);
        setStorage("HornTimeDelayMax", hornTimeDelayMax);
    } else {
        hornTimeDelayMin = parseInt(hornTimeDelayMinTemp);
        hornTimeDelayMax = parseInt(hornTimeDelayMaxTemp);
    }
    hornTimeDelayMinTemp = undefined;
    hornTimeDelayMaxTemp = undefined;

    let trapCheckTemp = getStorage("TrapCheck");
    if (trapCheckTemp == undefined || trapCheckTemp == null) {
        setStorage("TrapCheck", enableTrapCheck.toString());
    } else if (trapCheckTemp == true || trapCheckTemp.toLowerCase() == "true") {
        enableTrapCheck = true;
    } else {
        enableTrapCheck = false;
    }
    trapCheckTemp = undefined;

    let trapCheckTimeOffsetTemp = getStorage("TrapCheckTimeOffset");
    if (trapCheckTimeOffsetTemp == undefined || trapCheckTimeOffsetTemp == null) {
        setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
    } else {
        trapCheckTimeDiff = parseInt(trapCheckTimeOffsetTemp);
    }
    trapCheckTimeOffsetTemp = undefined;

    let trapCheckTimeDelayMinTemp = getStorage("TrapCheckTimeDelayMin");
    let trapCheckTimeDelayMaxTemp = getStorage("TrapCheckTimeDelayMax");
    if (trapCheckTimeDelayMinTemp == undefined || trapCheckTimeDelayMinTemp == null || trapCheckTimeDelayMaxTemp == undefined || trapCheckTimeDelayMaxTemp == null) {
        setStorage("TrapCheckTimeDelayMin", checkTimeDelayMin);
        setStorage("TrapCheckTimeDelayMax", checkTimeDelayMax);
    } else {
        checkTimeDelayMin = parseInt(trapCheckTimeDelayMinTemp);
        checkTimeDelayMax = parseInt(trapCheckTimeDelayMaxTemp);
    }
    trapCheckTimeDelayMinTemp = undefined;
    trapCheckTimeDelayMaxTemp = undefined;

    let playKingRewardSoundTemp = getStorage("PlayKingRewardSound");
    if (playKingRewardSoundTemp == undefined || playKingRewardSoundTemp == null) {
        setStorage("PlayKingRewardSound", isKingWarningSound.toString());
    } else if (playKingRewardSoundTemp == true || playKingRewardSoundTemp.toLowerCase() == "true") {
        isKingWarningSound = true;
    } else {
        isKingWarningSound = false;
    }
    playKingRewardSoundTemp = undefined;

    let kingRewardSoundTemp = getStorage('KingRewardSoundInput');
    if (kingRewardSoundTemp == undefined || kingRewardSoundTemp == null || kingRewardSoundTemp == "") {
        kingRewardSoundTemp = 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/horn.mp3';
        setStorage('KingRewardSoundInput', kingWarningSound);
    } else {
        kingWarningSound = kingRewardSoundTemp;
    }
    kingRewardSoundTemp = undefined;

    let kingRewardEmailTemp = getStorage('KingRewardEmail');
    if (kingRewardEmailTemp == undefined || kingRewardEmailTemp == null || kingRewardEmailTemp == "") {
        kingRewardEmailTemp = '';
        setStorage('KingRewardEmail', '');
    } else {
        kingRewardEmail = kingRewardEmailTemp;
    }
    kingRewardEmailTemp = undefined;

    let kingRewardResumeTemp = getStorage("KingRewardResume");
    if (kingRewardResumeTemp == undefined || kingRewardResumeTemp == null) {
        setStorage("KingRewardResume", reloadKingReward.toString());
    } else if (kingRewardResumeTemp == true || kingRewardResumeTemp.toLowerCase() == "true") {
        reloadKingReward = true;
    } else {
        reloadKingReward = false;
    }
    kingRewardResumeTemp = undefined;

    let kingRewardResumeTimeTemp = getStorage("KingRewardResumeTime");
    if (kingRewardResumeTimeTemp == undefined || kingRewardResumeTimeTemp == null) {
        setStorage("KingRewardResumeTime", kingPauseTimeMax);
    } else {
        kingPauseTimeMax = parseInt(kingRewardResumeTimeTemp);
    }
    kingRewardResumeTimeTemp = undefined;

    let pauseLocationTemp = getStorage("PauseLocation");
    if (pauseLocationTemp == undefined || pauseLocationTemp == null) {
        setStorage("PauseLocation", pauseAtInvalidLocation.toString());
    } else if (pauseLocationTemp == true || pauseLocationTemp.toLowerCase() == "true") {
        pauseAtInvalidLocation = true;
    } else {
        pauseAtInvalidLocation = false;
    }
    pauseLocationTemp = undefined;

    let autopopkrTemp = getStorage("autoPopupKR");
    if (autopopkrTemp == undefined || autopopkrTemp == null) {
        setStorage("autoPopupKR", autoPopupKR.toString());
    } else if (autopopkrTemp == true || autopopkrTemp.toLowerCase() == "true") {
        autoPopupKR = true;
    } else {
        autoPopupKR = false;
    }
    autopopkrTemp = undefined;

    let addonCodeTemp = getStorage("addonCode");
    if (addonCodeTemp == undefined || addonCodeTemp === null || addonCodeTemp == "" || addonCodeTemp == "null") {
        setStorage('addonCode', "");
    }
    addonCode = addonCodeTemp;

    addonCodeTemp = undefined;

    // nobTrapCounter to only refetch all traps when counter hits 0
    let nobTrapsTemp = nobGet('traps');
    let nobTrapsTempCounter = getStorage('nobTrapsCounter');
    if (nobTrapsTempCounter == undefined || nobTrapsTempCounter === null) {
        nobTrapsTempCounter = 1000;
    }
    if (nobTrapsTempCounter > 0 && nobTrapsTempCounter < 501) {
        if (!(nobTrapsTemp == undefined || nobTrapsTemp === null)) {
            NOBtraps = JSON.parse(nobTrapsTemp);
        }

        setStorage('nobTrapsCounter', nobTrapsTempCounter - 1);
    } else {
        NOBtraps = [];
        setStorage('nobTrapsCounter', 500);
    }
    nobTrapsTemp = undefined;
    nobTrapsTempCounter = undefined;

    let nobHuntsLeft = parseInt(nobGet('huntsLeft'));
    if (nobHuntsLeft > NOBhuntsLeft)
        NOBhuntsLeft = nobHuntsLeft;
    nobHuntsLeft = undefined;

    let dischargeTemp = getStorage("discharge");
    if (dischargeTemp == undefined || dischargeTemp == null) {
        setStorage("discharge", true.toString());
    } else if (dischargeTemp == true || dischargeTemp.toLowerCase() == "true") {
        discharge = true;
    } else {
        discharge = false;
    }
    dischargeTemp = undefined;

    let eventTemp = getStorage('eventLocation');
    if (eventTemp == undefined || eventTemp == null) {
        setStorage('eventLocation', 'None');
        eventTemp = getStorage('eventLocation');
    }
    eventLocation = eventTemp;
    eventTemp = undefined;

    isAutoSolve = getStorageToVariableBool("AutoSolveKR", isAutoSolve);
    krDelayMin = getStorageToVariableInt("AutoSolveKRDelayMin", krDelayMin);
    krDelayMax = getStorageToVariableInt("AutoSolveKRDelayMax", krDelayMax);
    kingsRewardRetry = getStorageToVariableInt("KingsRewardRetry", kingsRewardRetry);
    */
  aggressiveMode = getStorageToVariableBool('AggressiveMode', aggressiveMode);
  hornTimeDelayMin = getStorageToVariableInt(
    'HornTimeDelayMin',
    hornTimeDelayMin
  );
  hornTimeDelayMax = getStorageToVariableInt(
    'HornTimeDelayMax',
    hornTimeDelayMax
  );
  enableTrapCheck = getStorageToVariableBool('TrapCheck', enableTrapCheck);
  checkTimeDelayMin = getStorageToVariableInt(
    'TrapCheckTimeDelayMin',
    checkTimeDelayMin
  );
  checkTimeDelayMax = getStorageToVariableInt(
    'TrapCheckTimeDelayMax',
    checkTimeDelayMax
  );
  isKingWarningSound = getStorageToVariableBool(
    'PlayKingRewardSound',
    isKingWarningSound
  );
  isAutoSolve = getStorageToVariableBool('AutoSolveKR', isAutoSolve);
  autoPopupKR = getStorageToVariableBool('autoPopupKR', autoPopupKR);
  krDelayMin = getStorageToVariableInt('AutoSolveKRDelayMin', krDelayMin);
  krDelayMax = getStorageToVariableInt('AutoSolveKRDelayMax', krDelayMax);
  kingsRewardRetry = getStorageToVariableInt(
    'KingsRewardRetry',
    kingsRewardRetry
  );
  pauseAtInvalidLocation = getStorageToVariableBool(
    'PauseLocation',
    pauseAtInvalidLocation
  );
  saveKRImage = getStorageToVariableBool('SaveKRImage', saveKRImage);
  g_nTimeOffset = getStorageToVariableInt('TimeOffset', g_nTimeOffset);
  discharge = getStorageToVariableBool('discharge', discharge);
  // timer refresh interval
  timerRefreshInterval = getStorageToVariableInt(
    'timerRefreshInterval',
    timerRefreshInterval
  );
  // default bait
  defaultBait = getStorageToVariableStr('defaultBait', defaultBait);
  // rest time
  restTimes = getStorageToObject('restTimes', restTimes);
  // sleep in location
  sleepIn = getStorageToVariableStr('sleepIn', sleepIn);
  // work in location
  workIn = getStorageToVariableStr('workIn', workIn);
  // isEnableScheduledJobs
  isEnableScheduledJobs = getStorageToVariableBool(
    'isEnableScheduledJobs',
    isEnableScheduledJobs
  );
  // minLgsSeconds
  minLgsSeconds = getStorageToVariableInt('minLgsSeconds', minLgsSeconds);
  // anchor points
  anchorPoints = getStorageToObject('anchorPoints', anchorPoints);
  // onload anchor
  onloadAnchor = getStorageToObject('onloadAnchor', onloadAnchor);
  // addonCode
  addonCode = getStorageToVariableStr('addonCode', addonCode);
  try {
    keyKR = [];
    let keyName = '';
    let keyRemove = [];
    let i, j, value, objTest;
    for (i = 0; i < window.localStorage.length; i++) {
      keyName = window.localStorage.key(i);
      if (keyName.indexOf('KR-') > -1) {
        // remove old KR entries
        keyRemove.push(keyName);
      } else if (keyName.indexOf('KR' + separator) > -1) {
        keyKR.push(keyName);
      }
      /* value = getStorage(keyName); // remove entries of duplicate JSON.stringify
      if (value.indexOf('{') > -1) {
        try {
          objTest = JSON.parse(value);
          if (typeof objTest == 'string') {
            setStorage(keyName, objTest);
            setSessionStorage(keyName, objTest);
          }
        } catch (e) {
          console.perror(keyName, e.message);
        }
      } */
    }

    for (i = 0; i < keyRemove.length; i++) {
      removeStorage(keyRemove[i]);
    }

    if (keyKR.length > maxSaveKRImage) {
      keyKR = keyKR.sort();
      let count = Math.floor(maxSaveKRImage / 2);
      for (i = 0; i < count; i++) removeStorage(keyKR[i]);
    }

    // Backward compatibility of SCCustom
    let temp = '';
    let keyValue = '';
    let obj = {};
    let bResave = false;
    let objSCCustomBackward = {
      zone: ['ZONE_NOT_DIVE'],
      zoneID: [0],
      isHunt: [true],
      bait: ['Gouda'],
      trinket: ['None'],
      useSmartJet: false
    };
    for (let prop in objSCZone) {
      if (objSCZone.hasOwnProperty(prop)) {
        keyName = 'SCCustom_' + prop;
        keyValue = window.localStorage.getItem(keyName);
        if (!isNullOrUndefined(keyValue)) {
          keyValue = keyValue.split(',');
          objSCCustomBackward.zone[objSCZone[prop]] = prop;
          objSCCustomBackward.zoneID[objSCZone[prop]] = objSCZone[prop];
          objSCCustomBackward.isHunt[objSCZone[prop]] =
            keyValue[0] === 'true' || keyValue[0] === true;
          objSCCustomBackward.bait[objSCZone[prop]] = keyValue[1];
          objSCCustomBackward.trinket[objSCZone[prop]] = keyValue[2];
          removeStorage(keyName);
        }
      }
    }
    if (objSCCustomBackward.zone.length > 1) {
      setStorage('SCCustom', JSON.stringify(objSCCustomBackward));
      setSessionStorage('SCCustom', JSON.stringify(objSCCustomBackward));
    }

    keyValue = getStorage('SCCustom');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      let arrTempOri = [
        'NoSC',
        'TT',
        'EAC',
        'scAnchorTreasure',
        'scAnchorDanger',
        'scAnchorUlti'
      ];
      let arrTempNew = [
        'None',
        'Treasure Trawling Charm',
        'Empowered Anchor Charm',
        'GAC_EAC',
        'SAC_EAC',
        'UAC_EAC'
      ];
      let nIndex = -1;
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop) && prop == 'trinket') {
          for (i = 0; i < obj[prop].length; i++) {
            nIndex = arrTempOri.indexOf(obj[prop][i]);
            if (nIndex > -1) {
              obj[prop][i] = arrTempNew[nIndex];
              bResave = true;
            }
          }
        }
      }
      if (obj.zone.indexOf('ZONE_DANGER_PP_LOTA') < 0) {
        obj.zone = [
          'ZONE_NOT_DIVE',
          'ZONE_DEFAULT',
          'ZONE_CORAL',
          'ZONE_SCALE',
          'ZONE_BARNACLE',
          'ZONE_TREASURE',
          'ZONE_DANGER',
          'ZONE_DANGER_PP',
          'ZONE_OXYGEN',
          'ZONE_BONUS',
          'ZONE_DANGER_PP_LOTA'
        ];
        obj.zoneID = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        nIndex = obj.zone.indexOf('ZONE_DANGER_PP');
        obj.isHunt[10] = obj.isHunt[nIndex];
        obj.bait[10] = obj.bait[nIndex];
        obj.trinket[10] = obj.trinket[nIndex];
        bResave = true;
      }
      if (bResave) {
        setStorage('SCCustom', JSON.stringify(obj));
        setSessionStorage('SCCustom', JSON.stringify(obj));
      }
    }

    // Backward compatibility of SGZT
    keyValue = getStorage('SGZT');
    if (!isNullOrUndefined(keyValue)) {
      setStorage('SGarden', keyValue);
      setSessionStorage('SGarden', keyValue);
      removeStorage('SGZT');
      removeSessionStorage('SGZT');
    }

    // Backward compatibility of ZTower
    keyValue = getStorage('ZTower');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      let arrTemp = new Array(7).fill('');
      for (let prop in obj) {
        if (
          obj.hasOwnProperty(prop) &&
          (prop == 'weapon' ||
            prop == 'base' ||
            prop == 'trinket' ||
            prop == 'bait')
        ) {
          if (obj[prop].length == 7) {
            obj[prop] = obj[prop].concat(arrTemp);
            bResave = true;
          }
          if (prop == 'bait') {
            for (i = 0; i < obj[prop].length; i++) {
              if (obj[prop][i] == 'Brie') {
                obj[prop][i] = 'Brie Cheese';
                bResave = true;
              }
            }
          }
        }
      }
      if (bResave) {
        setStorage('ZTower', JSON.stringify(obj));
        setSessionStorage('ZTower', JSON.stringify(obj));
      }
    }

    // Backward compatibility of BRCustom
    keyValue = getStorage('BRCustom');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      for (i = 0; i < obj.trinket.length; i++) {
        if (
          obj.trinket[i] == 'None' ||
          obj.trinket[i] == 'NoAbove' ||
          obj.trinket[i] === '' ||
          isNullOrUndefined(obj.trinket[i])
        )
          continue;
        if (obj.trinket[i].indexOf('Charm') < 0) {
          obj.trinket[i] += ' Charm';
          bResave = true;
        }
      }
      if (bResave) {
        setStorage('BRCustom', JSON.stringify(obj));
        setSessionStorage('BRCustom', JSON.stringify(obj));
      }
    }

    // Backward compatibility of FRift
    keyValue = getStorage('FRift');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      for (i = 0; i < obj.trinket.length; i++) {
        if (
          obj.trinket[i] == 'None' ||
          obj.trinket[i] == 'NoAbove' ||
          obj.trinket[i] === '' ||
          isNullOrUndefined(obj.trinket[i])
        )
          continue;
        if (obj.trinket[i].indexOf('Charm') < 0) {
          obj.trinket[i] += ' Charm';
          bResave = true;
        }
      }
      if (bResave) {
        setStorage('FRift', JSON.stringify(obj));
        setSessionStorage('FRift', JSON.stringify(obj));
      }
    }

    // Remove old LG
    keyValue = getStorage('LGArea');
    if (!isNullOrUndefined(keyValue) && keyValue.split(',').length == 2) {
      removeStorage('LGArea');
      removeSessionStorage('LGArea');
    }

    // Backward compatibility of FW
    keyValue = getStorage('FW');
    if (isNullOrUndefined(keyValue)) {
      obj = {};
      for (i = 1; i <= 4; i++) {
        temp = 'FW_Wave' + i;
        keyValue = getStorage(temp);
        if (!isNullOrUndefined(keyValue)) {
          obj['wave' + i] = JSON.parse(keyValue);
          removeStorage(temp);
          removeSessionStorage(temp);
        } else {
          obj['wave' + i] = JSON.parse(JSON.stringify(DefaultFwWaveSettings));
        }
      }
      setStorage('FW', JSON.stringify(obj));
    } else {
      obj = JSON.parse(keyValue);
      bResave = false;
      for (i = 1; i <= 4; i++) {
        temp = 'wave' + i;
        for (j = 0; j < obj[temp].cheese.length; j++) {
          if (obj[temp].cheese[j] == 'Brie') {
            obj[temp].cheese[j] = 'Brie Cheese';
            bResave = true;
          }
        }
      }
      if (bResave) {
        setStorage('FW', JSON.stringify(obj));
        setSessionStorage('FW', JSON.stringify(obj));
      }
    }

    // Backward compatibility of Labyrinth
    keyValue = getStorage('Labyrinth');
    if (isNullOrUndefined(keyValue)) {
      obj = {};
      temp = getStorage('Labyrinth_DistrictFocus');
      keyValue = getStorage('Labyrinth_HallwayPriorities');
      if (isNullOrUndefined(keyValue)) {
        obj = JSON.parse(JSON.stringify(objDefaultLaby));
      } else {
        obj = JSON.parse(keyValue);
        if (isNullOrUndefined(temp)) temp = 'None';
        obj.districtFocus = temp;
      }
      setStorage('Labyrinth', JSON.stringify(obj));
      temp = ['Labyrinth_DistrictFocus', 'Labyrinth_HallwayPriorities'];
      for (i = 0; i < temp.length; i++) {
        removeStorage(temp[i]);
        removeSessionStorage(temp[i]);
      }
    }

    // Backward compatibility of Zokor
    keyValue = getStorage('Zokor');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      for (i = 0; i < obj.bait.length; i++) {
        if (obj.bait[i] == 'Brie') {
          obj.bait[i] = 'Brie Cheese';
          bResave = true;
        }
      }
      if (bResave) {
        setStorage('Zokor', JSON.stringify(obj));
        setSessionStorage('Zokor', JSON.stringify(obj));
      }
    }

    // Backward compatibility of GWH2016R
    keyValue = getStorage('GWH2016R');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      if (obj.zone.indexOf("NEW_YEAR'S_PARTY") < 0) {
        obj.zone.push("NEW_YEAR'S_PARTY");
        obj.weapon.push('');
        obj.base.push('');
        obj.trinket.push('');
        obj.bait.push('');
        obj.boost.push(false);
        bResave = true;
      }
      if (bResave) {
        setStorage('GWH2016R', JSON.stringify(obj));
        setSessionStorage('GWH2016R', JSON.stringify(obj));
      }
    }

    // Disable GWH2016
    if (
      getStorageToVariableStr('eventLocation', 'None').indexOf('GWH2016') > -1
    )
      setStorage('eventLocation', 'None');

    // Backward compatibility of GES
    keyValue = getStorage('GES');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      if (isNullOrUndefined(obj.SD_BEFORE)) {
        let objNew = {
          bLoadCrate: obj.SD.bLoadCrate,
          nMinCrate: obj.SD.nMinCrate,
          bUseRepellent: obj.RR.bUseRepellent,
          nMinRepellent: obj.RR.nMinRepellent,
          bStokeEngine: obj.DC.bStokeEngine,
          nMinFuelNugget: obj.DC.nMinFuelNugget,
          SD_BEFORE: {
            weapon: obj.SD.weapon,
            base: obj.SD.base,
            trinket: obj.SD.trinket.before,
            bait: obj.SD.bait
          },
          SD_AFTER: {
            weapon: obj.SD.weapon,
            base: obj.SD.base,
            trinket: obj.SD.trinket.after,
            bait: obj.SD.bait
          },
          RR: {
            weapon: obj.RR.weapon,
            base: obj.RR.base,
            trinket: obj.RR.trinket,
            bait: obj.RR.bait
          },
          DC: {
            weapon: obj.DC.weapon,
            base: obj.DC.base,
            trinket: obj.DC.trinket,
            bait: obj.DC.bait
          },
          WAITING: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
          }
        };
        setStorage('GES', JSON.stringify(objNew));
        setSessionStorage('GES', JSON.stringify(objNew));
      }
    }

    // Backward compatibility of BWRift
    keyValue = getStorage('BWRift');
    if (!isNullOrUndefined(keyValue)) {
      obj = JSON.parse(keyValue);
      bResave = false;
      if (obj.order.length != 16) {
        obj.order = [
          'NONE',
          'GEARWORKS',
          'ANCIENT',
          'RUNIC',
          'TIMEWARP',
          'GUARD',
          'SECURITY',
          'FROZEN',
          'FURNACE',
          'INGRESS',
          'PURSUER',
          'ACOLYTE_CHARGING',
          'ACOLYTE_DRAINING',
          'ACOLYTE_DRAINED',
          'LUCKY',
          'HIDDEN'
        ];
        bResave = true;
      }
      if (obj.priorities.length != 13) {
        if (obj.priorities.length == 11) {
          obj.priorities.push('LUCKY');
          obj.priorities.push('HIDDEN');
        } else
          obj.priorities = [
            'SECURITY',
            'FURNACE',
            'PURSUER',
            'ACOLYTE',
            'LUCKY',
            'HIDDEN',
            'TIMEWARP',
            'RUNIC',
            'ANCIENT',
            'GEARWORKS',
            'GEARWORKS',
            'GEARWORKS',
            'GEARWORKS'
          ];
        bResave = true;
      }
      if (isNullOrUndefined(obj.specialActivate)) {
        obj.specialActivate = {
          forceActivate: new Array(16).fill(false),
          remainingLootActivate: new Array(16).fill(1),
          forceDeactivate: new Array(16).fill(obj.forceDeactivate),
          remainingLootDeactivate: new Array(16).fill(
            obj.remainingLootDeactivate
          )
        };
        delete obj.forceDeactivate;
        delete obj.remainingLootDeactivate;
        bResave = true;
      }
      if (obj.minTimeSand.length != 9) {
        let arrTemp = new Array(9);
        arrTemp[0] = obj.minTimeSand[0];
        arrTemp[8] = obj.minTimeSand[2];
        for (i = 1; i <= 7; i++) arrTemp[i] = obj.minTimeSand[1];
        obj.minTimeSand = arrTemp;
        bResave = true;
      }
      let objTemp = {
        arrTemp: [
          'master',
          'specialActivate',
          'gw',
          'al',
          'rl',
          'gb',
          'ic',
          'fa'
        ],
        arrLength: [16, 16, 2, 2, 2, 7, 4, 16]
      };
      for (i = 0; i < objTemp.arrTemp.length; i++) {
        if (obj.hasOwnProperty(objTemp.arrTemp[i])) {
          for (let prop in obj[objTemp.arrTemp[i]]) {
            if (obj[objTemp.arrTemp[i]].hasOwnProperty(prop)) {
              while (
                obj[objTemp.arrTemp[i]][prop].length < objTemp.arrLength[i]
              ) {
                obj[objTemp.arrTemp[i]][prop].push(
                  obj[objTemp.arrTemp[i]][prop][0]
                );
                bResave = true;
              }
              if (
                obj[objTemp.arrTemp[i]][prop].length <
                objTemp.arrLength[i] * 2
              ) {
                obj[objTemp.arrTemp[i]][prop] = obj[objTemp.arrTemp[i]][
                  prop
                ].concat(obj[objTemp.arrTemp[i]][prop]);
                bResave = true;
              }
            }
          }
        }
      }
      if (bResave) {
        setStorage('BWRift', JSON.stringify(obj));
        setSessionStorage('BWRift', JSON.stringify(obj));
      }
    }
  } catch (e) {
    console.perror('loadPreferenceSettingFromStorage', e.message);
  }
  getTrapList();
  getBestTrap();
  bestLGBase = arrayConcatUnique(bestLGBase, objBestTrap.base.luck);
  bestSCBase = arrayConcatUnique(bestSCBase, objBestTrap.base.luck);
}

function isActiveTime() {
  // TODO 是否直接開發成 routineJob?
  activeTimes = getStorageToObject('activeTimes', activeTimes);
  /* if (isActiveTime()) {
    hornTimeDelayMax = 40;
  } */
  let timeSectionMatched = false;
  for (let i = 0; i < restTimes.length; i++) {
    // 設定值為 0時不處理
    if (restTimes[i][0] < 1 || restTimes[i][1] < 1) continue;
  }
  return timeSectionMatched;
}

function getTrapList(category) {
  let temp = '';
  let arrObjList;
  if (category === null || category === undefined)
    arrObjList = Object.keys(objTrapList);
  else arrObjList = [category];

  for (let i = 0; i < arrObjList.length; i++) {
    temp = getStorageToVariableStr(
      'TrapList' + capitalizeFirstLetter(arrObjList[i]),
      ''
    );
    if (temp === '') {
      objTrapList[arrObjList[i]] = [];
    } else {
      try {
        objTrapList[arrObjList[i]] = temp.split(',');
      } catch (e) {
        objTrapList[arrObjList[i]] = [];
      }
    }
  }
}

function clearTrapList(category) {
  let arrObjList;
  if (category === null || category === undefined)
    arrObjList = Object.keys(objTrapList);
  else arrObjList = [category];

  for (let i = 0; i < arrObjList.length; i++) {
    removeStorage('TrapList' + capitalizeFirstLetter(arrObjList[i]));
    objTrapList[arrObjList[i]] = [];
  }
}

function capitalizeFirstLetter(strIn) {
  return strIn.charAt(0).toUpperCase() + strIn.slice(1);
}
/**
 * This function will chanage arming to false to prevent from infinite-loop
 *
 * @param {string} sort
 * @param {string} category
 * @param {Array<string> | string} name
 * @param {boolean} isForcedRetry
 * @returns
 */
function getTrapListFromTrapSelector(sort, category, name, isForcedRetry) {
  clickTrapSelector(category);
  objTrapList[category] = [];
  let sec = secWait;
  let retry = armTrapRetry;
  let i, j, tagGroupElement, tagElement, nameElement, itemEle;
  let intervalGTLFTS = setInterval(function () {
    if (isNewUI)
      itemEle = document.getElementsByClassName(
        'campPage-trap-itemBrowser-item'
      );
    else tagGroupElement = document.getElementsByClassName('tagGroup');

    if (isNewUI && itemEle.length > 0) {
      for (i = 0; i < itemEle.length; i++) {
        nameElement = itemEle[i].getElementsByClassName(
          'campPage-trap-itemBrowser-item-name'
        )[0].textContent;
        objTrapList[category].push(nameElement);
      }
      setStorage(
        'TrapList' + capitalizeFirstLetter(category),
        objTrapList[category].join(',')
      );
      clearInterval(intervalGTLFTS);
      arming = false;
      intervalGTLFTS = null;
      checkThenArm(sort, category, name, isForcedRetry);
      return;
    } else if (!isNewUI && tagGroupElement.length > 0) {
      for (i = 0; i < tagGroupElement.length; ++i) {
        tagElement = tagGroupElement[i].getElementsByTagName('a');
        for (j = 0; j < tagElement.length; ++j) {
          nameElement =
            tagElement[j].getElementsByClassName('name')[0].innerText;
          objTrapList[category].push(nameElement);
        }
      }
      setStorage(
        'TrapList' + capitalizeFirstLetter(category),
        objTrapList[category].join(',')
      );
      clearInterval(intervalGTLFTS);
      arming = false;
      intervalGTLFTS = null;
      checkThenArm(sort, category, name, isForcedRetry);
      return;
    } else {
      --sec;
      if (sec <= 0) {
        clickTrapSelector(category);
        sec = secWait;
        --retry;
        if (retry <= 0) {
          clearInterval(intervalGTLFTS);
          arming = false;
          intervalGTLFTS = null;
          return;
        }
      }
    }
  }, 1000);
  return;
}

/**
 * 從 localStorage取得 BestTrap設定,
 * 將 objBestTrap相同 power type的 array
 * 不重複地 append到設定值成為新的 array後
 * assign回 objBestTrap.
 */
function getBestTrap() {
  let obj = getStorage('BestTrap');
  if (isNullOrUndefined(obj)) return;
  obj = JSON.parse(obj);
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop) && objBestTrap.hasOwnProperty(prop)) {
      for (let prop1 in obj[prop]) {
        if (
          obj[prop].hasOwnProperty(prop1) &&
          objBestTrap[prop].hasOwnProperty(prop1)
        ) {
          if (obj[prop][prop1] !== '')
            objBestTrap[prop][prop1] = arrayConcatUnique(
              [obj[prop][prop1]],
              objBestTrap[prop][prop1]
            );
        }
      }
    }
  }
}

function getStorageToVariableInt(storageName, defaultInt) {
  let temp = getStorage(storageName);
  let tempInt = defaultInt;
  if (temp == undefined || temp == null) {
    setStorage(storageName, defaultInt);
  } else {
    tempInt = parseInt(temp);
    if (Number.isNaN(tempInt)) tempInt = defaultInt;
  }
  return tempInt;
}

function getStorageToVariableStr(storageName, defaultStr) {
  let temp = getStorage(storageName);
  if (isNullOrUndefined(temp)) {
    setStorage(storageName, defaultStr);
    temp = defaultStr;
  }
  return temp;
}

function getStorageToVariableBool(storageName, defaultBool) {
  let temp = getStorage(storageName);
  if (temp == undefined || temp == null) {
    setStorage(storageName, defaultBool.toString());
    return defaultBool;
  } else if (temp == true || temp.toLowerCase() == 'true') {
    return true;
  } else {
    return false;
  }
}
/** hooker to MyUtils.getStorageToObject */
function getStorageToObject(keyName, objDefault) {
  return MyUtils.getStorageToObject(keyName, objDefault);
}
/** hooker to MyUtils.assignMissingDefault */
function assignMissingDefault(obj, defaultObj) {
  return MyUtils.assignMissingDefault(obj, defaultObj);
}
/** hooker to MhUtils.displayTimer */
function displayTimer(title, nextHornTime, checkTime) {
  MhUtils.displayTimer(title, nextHornTime, checkTime);
}
function displayLocation(locStr) {
  if (showTimerInPage && pauseAtInvalidLocation) {
    travelElement.innerHTML = '<b>Hunt Location:</b> ' + locStr;
  }
}
function displayKingRewardSumTime(timeStr) {
  if (showTimerInPage) {
    if (timeStr) {
      lastKingRewardSumTimeElement.innerHTML = '(' + timeStr + ')';
    } else {
      lastKingRewardSumTimeElement.innerHTML = '';
    }
  }
}
function doubleCheckLocation() {
  //return true if location is camp page (this is to combat ajax loads)
  if (!isNewUI) {
    return true;
  }
  const thePage = document.getElementById('mousehuntContainer');
  if (thePage) {
    return thePage.className.indexOf('PageCamp') > -1;
  } else {
    return false;
  }
}

// ################################################################################################
//   Timer Function - End
// ################################################################################################

// ################################################################################################
//   Horn Function - Start
// ################################################################################################

function soundHorn() {
  logging('RUN %csoundHorn()', 'color: #FF7700');
  logging('Time now is ' + new Date());
  logging(document.getElementById('mousehuntHud').cloneNode(true));
  logging('huntTimer:');
  // logging(document.getElementById("huntTimer").cloneNode(true));

  if (doubleCheckLocation()) {
    // update timer
    displayTimer(
      'Ready to Blow The Horn...',
      'Ready to Blow The Horn...',
      'Ready to Blow The Horn...'
    );

    let hornElement;

    // lol what is this even for
    let scriptNode = document.getElementById('scriptNode');
    logging('What is this: ');
    logging(scriptNode);
    if (scriptNode) {
      scriptNode.setAttribute('soundedHornAtt', 'false');
    }
    scriptNode = null;

    if (!aggressiveMode) {
      // safety mode, check the horn image is there or not before sound the horn
      let headerElement = document.querySelector('.huntersHornView');

      if (headerElement) {
        // headerElement = headerElement.firstChild;
        let headerStatus = headerElement.querySelector(
          '.huntersHornView__timerState.huntersHornView__timerState--type-ready'
        );
        if (isvisible(headerStatus)) {
          // found the horn image, let's sound the horn!
          logging(
            'Header status prior to sounding horn: ' + headerStatus.textContent
          );

          // update timer
          displayTimer(
            'Blowing The Horn...',
            'Blowing The Horn...',
            'Blowing The Horn...'
          );

          // simulate mouse click on the horn
          // hornElement = headerStatus;
          // fireEvent(hornElement, 'click');
          // hornElement = null;
          sound_horn();

          // NOB hunt until
          NOBhuntsLeft--;
          nobStore(NOBhuntsLeft, 'huntsLeft');

          // clean up
          headerElement = null;
          headerStatus = null;

          // double check if the horn was already sounded
          window.setTimeout(function () {
            afterSoundingHorn();
          }, 5000);
          //                 } else if (headerStatus.indexOf("hornsounding") != -1 || headerStatus.indexOf("hornsounded") != -1) {
          //                     // some one just sound the horn...

          //                     // update timer
          //                     displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");

          //                     // NOB hunt until
          //                     NOBhuntsLeft--;
          //                     nobStore(NOBhuntsLeft, 'huntsLeft');

          //                     // clean up
          //                     headerElement = null;
          //                     headerStatus = null;

          //                     // load the new data
          //                     window.setTimeout(function () {
          //                         afterSoundingHorn()
          //                     }, 5000);
          //                 } else if (headerStatus.indexOf("hornwaiting") != -1) {
          //                     // the horn is not appearing, let check the time again

          //                     // update timer
          //                     displayTimer("Synchronizing Data...", "Hunter horn is not ready yet. Synchronizing data...", "Hunter horn is not ready yet. Synchronizing data...");

          //                     // sync the time again, maybe user already click the horn
          //                     retrieveData();

          //                     checkJournalDate();

          //                     // clean up
          //                     headerElement = null;
          //                     headerStatus = null;

          //                     // loop again
          //                     window.setTimeout(function () {
          //                         countdownTimer()
          //                     }, timerRefreshInterval * 1000);
        } else {
          // some one steal the horn!

          // update timer
          /* displayTimer(
            'Synchronizing Data...',
            'Hunter horn is missing. Synchronizing data...',
            'Hunter horn is missing. Synchronizing data...'
          );

          // try to click on the horn
          // hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
          // fireEvent(hornElement, 'click');
          // hornElement = null;
          sound_horn(); */

          // clean up
          headerElement = null;
          headerStatus = null;

          // double check if the horn was already sounded
          window.setTimeout(function () {
            afterSoundingHorn();
          }, 5000);
        }
      } else {
        // something wrong, can't even found the header...

        // clean up
        headerElement = null;

        // reload the page see if thing get fixed
        reloadWithMessage('Horn header not found. Reloading...', false);
      }
    } else {
      // aggressive mode, ignore whatever horn image is there or not, just sound the horn!

      // simulate mouse click on the horn
      // fireEvent(document.getElementsByClassName(hornButton)[0].firstChild, 'click');
      sound_horn();

      // double check if the horn was already sounded
      window.setTimeout(function () {
        afterSoundingHorn();
      }, 3000);
    }
  } else {
    document.getElementById('titleElement').parentNode.remove();
    embedTimer(false);
  }
}

/**
 * 真正點 horn的 function.
 */
function sound_horn() {
  const horn = document.querySelector('.huntersHornView__horn');
  if (horn) {
    try {
      const clickEvent = new MouseEvent('mousedown', {
        bubbles: true, // Bubble up the dom.
        cancelable: true
      });

      horn.dispatchEvent(clickEvent);

      // Wait for the animation to finish.
      setTimeout(() => {
        const clickEvent = new MouseEvent('mouseup', {
          bubbles: true, // Bubble up the dom.
          cancelable: true
        });
        horn.dispatchEvent(clickEvent);
      }, 250);
    } catch (error) {
      console.plog(error);
      throw error;
    }
  }
}

const currentRoutineKey = 'currentRoutine';
/**
 * 在下列地點不做 workIn檢查(不可能用這些地方當 sleepIn)
 */
const IgnoreWorkInLocations = [
  'ancient_city',
  'labyrinth',
  'acolyte_realm',
  'desert_warpath'
];
/**
 * Treatment after horn sounded.
 */
function afterSoundingHorn() {
  // interact with MyMHRoutine
  let workIn = getStorage('workIn');
  const currentEnvironmentType = getEnvironmentType();
  const currentRoutine = getStorage(currentRoutineKey);
  if (
    !isNullOrUndefined(workIn) &&
    workIn != '' &&
    !isNullOrUndefined(currentEnvironmentType) &&
    currentEnvironmentType != '' &&
    IgnoreWorkInLocations.indexOf(currentEnvironmentType) < 0 &&
    currentEnvironmentType != workIn &&
    currentRoutine != 'toRest'
  ) {
    travel(workIn);
    return;
  }

  logging('RUN %cafterSoundingHorn()', 'color: #bada55');
  let scriptNode = document.getElementById('scriptNode');
  if (scriptNode) {
    scriptNode.setAttribute('soundedHornAtt', 'false');
  }
  scriptNode = null;

  let headerElement = document.querySelector('.huntersHornView');
  if (headerElement) {
    //if (isNewUI)
    // headerElement = headerElement.firstChild;
    // double check if the horn image is still visible after the script already sound it
    let headerStatus = headerElement.querySelector(
      '.huntersHornView__timerState.huntersHornView__timerState--type-ready'
    );
    if (isvisible(headerStatus)) {
      // seem like the horn is not functioning well

      // check if king's reward
      if (user.has_puzzle) {
        console.plog(
          'after sound horn, horn is visible.has puzzle? ',
          user.has_puzzle
        );
        reloadWithMessage('Has puzzle after sound horn!!', false);
        return;
      }

      // update timer
      displayTimer(
        'Blowing The Horn Again...',
        'Blowing The Horn Again...',
        'Blowing The Horn Again...'
      );

      // simulate mouse click on the horn
      // let hornElement = headerStatus;
      // fireEvent(hornElement, 'click');
      // hornElement = null;
      sound_horn();

      // clean up
      headerElement = null;
      headerStatus = null;

      // increase the horn retry counter and check if the script is caught in loop
      ++hornRetry;
      if (hornRetry > hornRetryMax) {
        // TODO 給 true應該不會reload the page see if thing get fixed
        reloadWithMessage('Max horn retry. Reloading...', true);

        // reset the horn retry counter
        hornRetry = 0;
      } else {
        // check again later
        window.setTimeout(function () {
          afterSoundingHorn();
        }, 3000);
        // }, 1000);
      }
      //         } else if (headerStatus.indexOf("hornsounding") != -1) {
      //             // the horn is already sound, but the network seen to slow on fetching the data

      //             // update timer
      //             displayTimer("The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...");

      //             // clean up
      //             headerElement = null;
      //             headerStatus = null;

      //             // increase the horn retry counter and check if the script is caugh in loop
      //             ++hornRetry;
      //             if (hornRetry > hornRetryMax) {
      //                 // reload the page see if thing get fixed
      //                 reloadWithMessage("Detected script caught in loop. Reloading...", true);

      //                 // reset the horn retry counter
      //                 hornRetry = 0;
      //             } else {
      //                 // check again later
      //                 window.setTimeout(function () {
      //                     afterSoundingHorn()
      //                 }, 3000);
      //             }
    } else {
      // everything look ok

      // update timer
      displayTimer(
        'Horn sounded. Synchronizing Data...',
        'Horn sounded. Synchronizing data...',
        'Horn sounded. Synchronizing data...'
      );

      // refresh camp after horn sounded.
      /* if (currentEnvironmentType == 'desert_warpath') {
        //setTimeout(() => {
        document
          .getElementsByClassName('mousehuntHud-menu-item root')[0]
          .click();
        //}, 2000);
      } */

      // replaced by checkJournalDate() in retrieveData(). check completely rendered
      //   const newestEntryId = document
      //     .querySelector('div[data-entry-id]')
      //     .getAttribute('data-entry-id');
      //   const latestEntryId = window.localStorage.getItem('latestEntryId') || 0;
      //   if (newestEntryId > latestEntryId) {
      //     window.localStorage.setItem('latestEntryId', newestEntryId);
      //   } else {
      //     reloadWithMessage('not completely rendered, reloading...');
      //   }

      // reload data
      setTimeout(() => {
        retrieveData();

        // script continue as normal
        window.setTimeout(function () {
          countdownTimer();
        }, timerRefreshInterval * 1000);
      }, 5000);

      // reload data
      //retrieveData();

      // clean up
      headerElement = null;
      headerStatus = null;

      // script continue as normal
      /* window.setTimeout(function () {
        countdownTimer();
      }, timerRefreshInterval * 1000); */

      // reset the horn retry counter
      hornRetry = 0;
    }
  }

  // Too many event location checks .-.
  //eventLocationCheck();
}

function embedScript() {
  // create a javascript to detect if user click on the horn manually
  let scriptNode = document.createElement('script');
  scriptNode.setAttribute('id', 'scriptNode');
  scriptNode.setAttribute('type', 'text/javascript');
  scriptNode.setAttribute('soundedHornAtt', 'false');
  scriptNode.innerHTML =
    'function soundedHorn() {\
let scriptNode = document.getElementById("scriptNode");\
if (scriptNode) {\
scriptNode.setAttribute("soundedHornAtt", "true");\
}\
scriptNode = null;\
}';

  // find the head node and insert the script into it
  let headerElement;
  if (fbPlatform || hiFivePlatform || mhPlatform) {
    headerElement = document.getElementById('noscript');
  } else if (mhMobilePlatform) {
    headerElement = document.getElementById('mobileHorn');
  }
  headerElement.parentNode.insertBefore(scriptNode, headerElement);
  scriptNode = null;
  headerElement = null;

  nobTestBetaUI();

  // change the function call of horn
  let hornButtonLink = document.querySelector('.huntersHornView__horn');
  // let oriStr = hornButtonLink.getAttribute('onclick').toString();
  // let index = oriStr.indexOf('return false;');
  let modStr = 'soundedHorn();';
  hornButtonLink.setAttribute('onclick', modStr);

  hornButtonLink = null;
  // oriStr = null;
  // index = null;
  modStr = null;
}

function nobTestBetaUI() {
  // Return true if beta UI
  campButton = 'mousehuntHud-campButton';
  const oldUI = document.getElementsByClassName(campButton);
  if (oldUI.length > 0) {
    logging('OLD UI DETECTED');
    // old UI
    hornButton = 'mousehuntHud-huntersHorn-container';
    //campButton = 'campbutton';
    campButton = 'mousehuntHud-campButton';
    header = 'mousehuntHud';
    hornReady = 'hornready';
    isNewUI = false;
    return false;
  } else {
    logging('NEW UI DETECTED');
    // new UI
    hornButton = 'mousehuntHud-huntersHorn-container';
    campButton = 'camp';
    header = 'mousehuntHud';
    hornReady = 'hornReady';
    isNewUI = true;
    return true;
  }
  // testNewUI = null;
}

// ################################################################################################
//   Horn Function - End
// ################################################################################################

// ################################################################################################
//   No Cheese Function - Start
// ################################################################################################
function noCheeseAction() {
  logging('noCheeseAction()');
  /*notifyMe(
    "No more cheese!!!",
    "https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/cheese.png",
    getPageVariable("user.username") + " has no more cheese."
  );*/

  // Run when isNoCheeseSound == true, default false
  playNoCheeseSound();

  // TODO if default bait quantity == 0?
  // null, undefined, empty string are all false
  if (defaultBait && defaultBait != '') {
    checkThenArm(null, TrapType.bait, defaultBait);
    hg.utils.TrapControl.disarmTrinket().go(() => {});
  } else {
    // There could be other way to arm bait.
    // return;
  }

  // Start rearm detector, set for every 10s to make sure not to interupt user
  let checkRearmInterval = setInterval(function () {
    logging('noCheeseAction: start detecting if cheese rearmed.');
    try {
      if (getBaitQuantity() > 0) {
        // Detected rearm
        logging('Detected cheese has been rearmed.');
        cheeseRearmedAction();

        clearInterval(checkRearmInterval);
        checkRearmInterval = null;
      }
    } catch (e) {
      logging('noCheeseAction ERROR: ' + e);
      logging('Cancelling check rearm, just in case.');

      clearInterval(checkRearmInterval);
      checkRearmInterval = null;
    }
  }, 10000);
}

function cheeseRearmedAction() {
  try {
    displayTimer(
      'Cheese rearmed!',
      'Detected cheese armed, rearming bot now.',
      'Detected cheese armed, rearming bot now.'
    );

    // sync the time again, maybe user already click the horn
    retrieveData();

    // checkJournalDate();

    // clean up
    headerElement = null;
    headerStatus = null;

    // loop again
    window.setTimeout(function () {
      countdownTimer();
    }, timerRefreshInterval * 1000);
  } catch (e) {
    logging(e);
  }
}

function playNoCheeseSound() {
  if (isNoCheeseSound) {
    unsafeWindow.hornAudio = new Audio(kingWarningSound);
    unsafeWindow.hornAudio.loop = true;
    unsafeWindow.hornAudio.play();
    let targetArea = document.getElementsByTagName('body');
    let child = document.createElement('button');
    child.setAttribute('id', 'stopAudio');
    child.setAttribute('style', 'position: fixed; bottom: 0;');
    child.setAttribute('onclick', 'hornAudio.pause();');
    child.innerHTML = 'CLICK ME TO STOP THIS ANNOYING MUSIC';
    targetArea[0].appendChild(child);
    targetArea = null;
    child = null;
    snippet = null;
  }
}

// ################################################################################################
//   No Cheese Function - End
// ################################################################################################

// ################################################################################################
//   King's Reward Function - Start
// ################################################################################################

function kingRewardAction() {
  logging('RUN %ckingRewardAction()', 'color: #bada55');

  // update timer
  displayTimer("King's Reward!", "King's Reward", "King's Reward!");
  displayLocation('-');

  // play music if needed
  playKingRewardSound();

  window.setTimeout(function () {
    // Autopop KR if needed
    if (autoPopupKR) {
      alert("King's Reward NOW");
    }

    // email the captcha away if needed
    emailCaptcha();
  }, 2000);

  // focus on the answer input
  let inputKingsReward = document.getElementsByClassName('puzzleView__code')[0];
  inputKingsReward.focus();

  // record last king's reward time
  let nowDate = new Date();
  setStorage('lastKingRewardDate', nowDate.toString());

  if (!isAutoSolve) return;

  console.plog('START AUTOSOLVE COUNTDOWN in kingRewardAction()');

  let krDelaySec =
    krDelayMin + Math.floor(Math.random() * (krDelayMax - krDelayMin));
  let krStopHourNormalized = krStopHour;
  let krStartHourNormalized = krStartHour;
  if (krStopHour > krStartHour) {
    // e.g. Stop to Start => 22 to 06
    let offset = 24 - krStopHour;
    krStartHourNormalized = krStartHour + offset;
    krStopHourNormalized = 0;
    nowDate.setHours(nowDate.getHours() + offset);
  }

  if (
    nowDate.getHours() >= krStopHourNormalized &&
    nowDate.getHours() < krStartHourNormalized
  ) {
    let krDelayMinute =
      krStartHourDelayMin +
      Math.floor(Math.random() * (krStartHourDelayMax - krStartHourDelayMin));
    krDelaySec +=
      krStartHour * 3600 -
      (nowDate.getHours() * 3600 +
        nowDate.getMinutes() * 60 +
        nowDate.getSeconds());
    krDelaySec += krDelayMinute * 60;
    let timeNow = new Date();
    setStorage('Time to start delay', timeNow.toString());
    setStorage('Delay time', timeFormat(krDelaySec));
    kingRewardCountdownTimer(krDelaySec, true);
  } else {
    if (kingsRewardRetry > kingsRewardRetryMax)
      krDelaySec /= kingsRewardRetry * 2;
    kingRewardCountdownTimer(krDelaySec, false);
  }
}

function emailCaptcha() {
  if (
    kingRewardEmail != null &&
    kingRewardEmail != undefined &&
    kingRewardEmail != ''
  ) {
    logging('Attempting to email captcha via Parse now.');
    let un = getPageVariable('user.username');
    if (un == undefined) un = '';

    Parse.initialize('mh-autobot', 'unused');
    Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';

    Parse.Cloud.run(
      'sendKRemail',
      {
        theEmail: kingRewardEmail,
        user: un
      },
      {
        success: function (data) {
          logging(data);
        },
        error: function (error) {
          logging(error);
        }
      }
    );
  }
}

function notifyMe(notice, icon, body) {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    let notification = new Notification(notice, { icon: icon, body: body });

    notification.onclick = function () {
      window.open('https://www.mousehuntgame.com/');
      notification.close();
    };

    notification.onshow = function () {
      setTimeout(function () {
        notification.close();
      }, 5000);
    };
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Whatever the user answers, we make sure we store the information
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === 'granted') {
        let notification = new Notification(notice, { icon: icon, body: body });

        notification.onclick = function () {
          window.open('https://www.mousehuntgame.com/');
          notification.close();
        };

        notification.onshow = function () {
          setTimeout(function () {
            notification.close();
          }, 5000);
        };
      }
    });
  }
}

function playKingRewardSound() {
  if (isKingWarningSound) {
    unsafeWindow.hornAudio = new Audio(kingWarningSound);
    unsafeWindow.hornAudio.loop = true;
    unsafeWindow.hornAudio.play();
    let targetArea = document.getElementsByTagName('body');
    let child = document.createElement('button');
    child.setAttribute('id', 'stopAudio');
    child.setAttribute('style', 'position: fixed; bottom: 0;');
    child.setAttribute('onclick', 'hornAudio.pause();');
    child.innerHTML = 'CLICK ME TO STOP THIS ANNOYING MUSIC';
    targetArea[0].appendChild(child);
    targetArea = null;
    child = null;
    snippet = null;
  }
}

function kingRewardCountdownTimer(interval, isReloadToSolve) {
  let strTemp = isReloadToSolve
    ? 'Reload to solve KR in '
    : 'Solve KR in (extra few sec delay) ';
  strTemp = strTemp + timeFormat(interval);
  displayTimer(strTemp, strTemp, strTemp);
  strTemp = null;
  interval -= timerRefreshInterval;
  if (interval < 0) {
    console.plog('START AUTOSOLVE NOW in kingRewardCountdownTimer()');

    if (isReloadToSolve) {
      logging('Reloading to solve KR, clicking on campElement now');

      // simulate mouse click on the camp button
      let campElement = document.getElementsByClassName(campButton)[0];
      fireEvent(campElement, 'click');
      campElement = null;

      // reload the page if click on the camp button fail
      window.setTimeout(function () {
        reloadWithMessage('Fail to click on camp button. Reloading...', false);
      }, 5000);
    } else {
      let intervalCRB = setInterval(function () {
        if (checkResumeButton()) {
          clearInterval(intervalCRB);
          intervalCRB = null;
          return;
        }
      }, 1000);
      CallKRSolver();
    }
  } else {
    if (!checkResumeButton()) {
      window.setTimeout(function () {
        kingRewardCountdownTimer(interval, isReloadToSolve);
      }, timerRefreshInterval * 1000);
    }
  }
}

function checkResumeButton() {
  let found = false;
  let resumeElement;

  if (isNewUI) {
    let krFormClass = document.getElementsByTagName('form')[0].className;
    if (krFormClass.indexOf('noPuzzle') > -1) {
      // found resume button

      // simulate mouse click on the resume button
      resumeElement = document.getElementsByClassName(
        'puzzleView__resumeButton'
      )[0];
      fireEvent(resumeElement, 'click');
      resumeElement = null;

      // reload url if click fail
      window.setTimeout(function () {
        reloadWithMessage(
          'Fail to click on resume button. Reloading...',
          false
        );
      }, 6000);

      // recheck if the resume button is click because some time even the url reload also fail
      window.setTimeout(function () {
        checkResumeButton();
      }, 10000);

      found = true;
    }
    krFormClass = null;
  } else {
    let linkElementList = document.getElementsByTagName('img');
    if (linkElementList) {
      let i;
      for (i = 0; i < linkElementList.length; ++i) {
        // check if it is a resume button
        if (
          linkElementList[i]
            .getAttribute('src')
            .indexOf('resume_hunting_blue.gif') != -1
        ) {
          // found resume button

          // simulate mouse click on the horn
          resumeElement = linkElementList[i].parentNode;
          fireEvent(resumeElement, 'click');
          resumeElement = null;

          // reload url if click fail
          window.setTimeout(function () {
            reloadWithMessage(
              'Fail to click on resume button. Reloading...',
              false
            );
          }, 6000);

          // recheck if the resume button is click because some time even the url reload also fail
          window.setTimeout(function () {
            checkResumeButton();
          }, 10000);

          found = true;
          break;
        }
      }
      i = null;
    }
  }

  linkElementList = null;

  try {
    return found;
  } finally {
    found = null;
  }
}

// ################################################################################################
//   King's Reward Function - End
// ################################################################################################

// ################################################################################################
//   Trap Check Function - Start
// ################################################################################################

function trapCheck() {
  // update timer
  displayTimer(
    'Checking The Trap...',
    'Checking trap now...',
    'Checking trap now...'
  );

  reloadWithMessage('Trap check, Reloading...', false);
  // reloadWithMessageNoHistory('Trap check, Reloading...', false);
}

/**
 * Calculate seconds left for next trap check.
 * hornTime was ready when this function invoked.
 * use this function to stagger horn sound and trap check.
 */
function CalculateNextTrapCheckInMinute() {
  if (enableTrapCheck) {
    let now =
      g_nTimeOffset === 0
        ? new Date()
        : new Date(Date.now() + g_nTimeOffset * 1000);
    let temp =
      trapCheckTimeDiff * 60 - (now.getMinutes() * 60 + now.getSeconds());
    checkTimeDelay = getRandomInteger(checkTimeDelayMin, checkTimeDelayMax);
    checkTime = now.getMinutes() >= trapCheckTimeDiff ? 3600 + temp : temp;
    checkTime += checkTimeDelay;
    logging('CalcNextTrapCheck: ' + checkTime);
    // eager sounding schedule
    scheduledEager();
  }
}
function scheduledEager() {
  const version = '1.0.1.0.0';
  console.log(`scheduledEager_${version}`);
  const defaultSetting = {
    isEagerCheck: true,
    schedule: []
  };
  const storageKey = 'scheduledEager';
  const setting = getStorageToObject(storageKey, defaultSetting);
  const isEagerCheck = setting.isEagerCheck;
  const schedule = setting.schedule ? setting.schedule : [];
  const now = new Date(Date.now() + (Math.random() - 0.5) * 3000000);
  const hm = now.getHours() + now.getMinutes() / 100;
  let isEager = false;
  for (let i = 0; i < schedule.length; i++) {
    const atHm = schedule[i];
    if (hm > atHm) {
      isEager = i % 2 == 1;
      break;
    }
  }
  if (isEager) eagerPlay(isEagerCheck);
  // 即使 eager play,如果需要 stagger還是得 stagger
  if (MhUtils.isStaggerHornCheck) staggerHornCheck();
}
function eagerPlay(isEagerCheck) {
  const hornDeviation = Math.round(Math.random() * 10) + 2;
  hornTime -= hornTimeDelay - hornDeviation;
  hornTimeDelay = hornDeviation;
  if (isEagerCheck) {
    const checkDeviation = Math.round(Math.random() * 5) + 4;
    checkTime -= checkTimeDelay - checkDeviation;
    checkTimeDelay = checkDeviation;
  }
  console.log(`hornTime: ${hornTime}, checkTime: ${checkTime}`);
}
function staggerHornCheck() {
  const originalCheckTime = checkTime - checkTimeDelay;
  let diff = nextActiveTime - originalCheckTime;
  console.plog(
    `hornTime: ${hornTime}, nextActiveTime: ${nextActiveTime}, checkTime: ${originalCheckTime}, diff: ${diff}`
  );
  let dangerInterval = 60;
  // 只要是互撞不管是否 eager期間都要 eager也只能 eager.要調整必須提前調整.
  if (Math.abs(diff) < dangerInterval) {
    console.plog('Horn and Check collide, eager play!!');
    eagerPlay(true);
    return;
  }
  // diff(餘數差)用來估計最後會否互撞,會的話提前調整,互撞的那 15分鐘只能 eager.
  diff = (originalCheckTime - nextActiveTime) % 900;
  console.plog('staggerHornCheck, diff: ', diff);
  dangerInterval = 60;
  if (diff < 0) {
    console.plog('diff < 0, check first, not stagger');
    return;
  }
  if (diff > dangerInterval) {
    console.plog('diff > dangerInterval, not collide, not stagger');
    return;
  }
  console.plog(
    `Need to stagger nextActiveTime ${nextActiveTime} and checkTime ${originalCheckTime}`
  );
  hornTime += 80;
  hornTimeDelay += 80;
}
// ################################################################################################
//   Trap Check Function - End
// ################################################################################################

// ################################################################################################
//   General Function - Start
// ################################################################################################
/**
 * Key to save message to localStorage.
 */
const storingMessageKey = 'displayedMessage';

/**
 * Save message to localStorage.
 *
 * @param {String} msg
 */
function storeError(msg, isOverwrite) {
  console.plog(msg);
  const now = new Date().toLocaleString();
  const mssg = now + '-' + msg;
  if (isOverwrite) localStorage[storingMessageKey] = mssg;
  else localStorage[storingMessageKey] += mssg;
}

/**
 * Display localStorage.errorMessage to mypanel.
 */
function displayError(msg) {
  const mssg = msg ? msg : localStorage.getItem(storingMessageKey);
  const style = 'background-color: red;font-weight: bold;font-size: 1.4em;';
  showMessage(mssg, style);
  /* if (msg && msg !== '') {
    $('<div style="background-color: red;"><b>' + msg + '</b></div>').appendTo(
      $('#mypanel')
    );
  } */
}
/** Show message in mypanel */
function showMessage(msg, style) {
  if (trimToEmpty(msg) === '') return;
  let msgDiv = document.querySelector('div#displayedMessageDiv');
  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.setAttribute('id', 'displayedMessageDiv');
    const defaultStyle =
      'background-color: white;font-weight: bold;font-size: 1.4em;';
    msgDiv.setAttribute('style', style ? style : defaultStyle);
    document.querySelector('div#mypanel').append(msgDiv);
  }
  if (msgDiv) msgDiv.innerHTML = msg;
}
function ajaxPost(postURL, objData, callback, throwerror) {
  try {
    jQuery.ajax({
      type: 'POST',
      url: postURL,
      data: objData,
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      xhrFields: {
        withCredentials: false
      },
      success: callback,
      error: throwerror
    });
  } catch (e) {
    throwerror(e);
  }
}

function versionCompare(v1, v2, options) {
  let lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push('0');
    while (v2parts.length < v1parts.length) v2parts.push('0');
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}
/** hooker to MyUtils.isNullOrUndefined */
function isNullOrUndefined(obj) {
  return MyUtils.isNullOrUndefined(obj);
}
/**
 * Collect indices of elements in given arr
 * that the elements are exactly equal to given val.
 *
 * @param {Array} arr
 * @param {*} val
 * @return {Array} The Collection
 */
function getAllIndices(arr, val) {
  let indices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) indices.push(i);
  }
  return indices;
}
function range(value, min, max) {
  if (value > max) value = max;
  else if (value < min) value = min;
  else if (Number.isNaN(value))
    value = min + Math.floor(Math.random() * (max - min));

  return value;
}

function min(data) {
  let value = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < data.length; i++) {
    if (data[i] < value) value = data[i];
  }
  return value;
}

function minIndex(data) {
  let value = Number.MAX_SAFE_INTEGER;
  let index = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] < value) {
      value = data[i];
      index = i;
    }
  }
  return index;
}

/**
 * Find the max number in Array.
 * Use Number.MIN_SAFE_INTEGER as initail
 * comparing value, so must be Number[].
 * @param {Number[]} data
 * @return
 */
function max(data) {
  let value = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > value) value = data[i];
  }
  return value;
}

/**
 * Find the first index which has max number in Array.
 * Use Number.MIN_SAFE_INTEGER as initail
 * comparing value, so must be Number[].
 * @param {Number[]} data
 * @return
 */
function maxIndex(data) {
  let value = Number.MIN_SAFE_INTEGER;
  let index = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > value) {
      value = data[i];
      index = i;
    }
  }
  return index;
}

/**
 * 將 arrConcat的 copy中,
 * 與 arrOriginal相同的元素剔除後,
 * append到 arrOriginal.
 * @param {* | Arrasy} arrOriginal
 * @param {* | Array} arrConcat
 * @return
 */
function arrayConcatUnique(arrOriginal, arrConcat) {
  if (!Array.isArray(arrOriginal)) arrOriginal = [arrOriginal];
  if (!Array.isArray(arrConcat)) arrConcat = [arrConcat];

  let nIndex = -1;
  let arrTemp = arrConcat.slice();
  for (let i = 0; i < arrOriginal.length; i++) {
    nIndex = arrTemp.indexOf(arrOriginal[i]);
    if (nIndex > -1) arrTemp.splice(nIndex, 1);
  }
  arrTemp = arrOriginal.concat(arrTemp);
  return arrTemp;
}

function countUnique(arrIn) {
  let objCount = {
    value: [],
    count: []
  };

  arrIn.forEach(function (i) {
    let index = objCount.value.indexOf(i);
    if (index < 0) {
      objCount.value.push(i);
      objCount.count.push(1);
    } else {
      objCount.count[index]++;
    }
  });

  return objCount;
}

function hasDuplicate(arrIn) {
  let obj = countUnique(arrIn);
  for (let i = 0; i < obj.count.length; i++) {
    if (obj.count[i] > 1) return true;
  }
  return false;
}

/**
 * 計算陣列 arrIn中有多少與 value相等.
 * @param {*} value
 * @param {Array} arrIn
 * @return
 */
function countArrayElement(value, arrIn) {
  let count = 0;
  for (let i = 0; i < arrIn.length; i++) {
    if (arrIn[i] == value) count++;
  }
  return count;
}

function sortWithIndices(toSort, sortType) {
  let arr = toSort.slice();
  let objSorted = {
    value: [],
    index: []
  };
  for (let i = 0; i < arr.length; i++) {
    arr[i] = [arr[i], i];
  }

  if (sortType == 'descend') {
    arr.sort(function (left, right) {
      return left[0] > right[0] ? -1 : 1;
    });
  } else {
    arr.sort(function (left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
  }

  for (let j = 0; j < arr.length; j++) {
    objSorted.value.push(arr[j][0]);
    objSorted.index.push(arr[j][1]);
  }
  return objSorted;
}

function standardDeviation(values) {
  let avg = average(values);
  let squareDiffs = values.map(function (value) {
    let diff = value - avg;
    let sqrDiff = diff * diff;
    return sqrDiff;
  });

  let avgSquareDiff = average(squareDiffs);
  let stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function sumData(data) {
  let sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  return sum;
}

function average(data) {
  let avg = sumData(data) / data.length;
  return avg;
}

function moveArrayElement(arr, fromIndex, toIndex) {
  arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
}
/**
 * function to string to be injected into page.
 * replace " with '
 * @param {Function} func
 * @returns
 */
function functionToHTMLString(func) {
  let str = func.toString();
  str = str.substring(str.indexOf('{') + 1, str.lastIndexOf('}'));
  str = replaceAll(str, '"', "'");
  return str;
}
/**
 * replace find in str with replace
 * @param {String} str
 * @param {RegExp} find
 * @param {String} replace
 * @returns
 */
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function browserDetection() {
  let browserName = 'unknown';
  let userAgentStr = navigator.userAgent.toString().toLowerCase();
  if (userAgentStr.indexOf('firefox') >= 0) browserName = 'firefox';
  else if (
    userAgentStr.indexOf('opera') >= 0 ||
    userAgentStr.indexOf('opr/') >= 0
  )
    browserName = 'opera';
  else if (userAgentStr.indexOf('chrome') >= 0) browserName = 'chrome';
  setStorage('Browser', browserName);
  //setStorage('UserAgent', userAgentStr);
  return browserName;
}

function setSessionStorage(name, value) {
  // check if the web browser support HTML5 storage
  if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
    window.sessionStorage.setItem(name, value);
  }
}
function removeSessionStorage(name) {
  // check if the web browser support HTML5 storage
  if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
    window.sessionStorage.removeItem(name);
  }
}
function getSessionStorage(name) {
  // check if the web browser support HTML5 storage
  if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
    return window.sessionStorage.getItem(name);
  }
}
function clearSessionStorage() {
  // check if the web browser support HTML5 storage
  if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage))
    window.sessionStorage.clear();
}
/** hooker to MyUtils.setStorage */
function setStorage(name, value) {
  MyUtils.setStorage(name, value);
}
function removeStorage(name) {
  // check if the web browser support HTML5 storage
  if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
    window.localStorage.removeItem(name);
  }
}
/** hooker to MyUtils.getStorage */
function getStorage(name) {
  return MyUtils.getStorage(name);
}
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }

      let cookieString = unescape(document.cookie.substring(c_start, c_end));

      // clean up
      c_name = null;
      c_start = null;
      c_end = null;

      try {
        return cookieString;
      } finally {
        cookieString = null;
      }
    }
    c_start = null;
  }
  c_name = null;
  return null;
}

function getStorageToVariableInt(storageName, defaultInt) {
  let temp = getStorage(storageName);
  let tempInt = defaultInt;
  if (isNullOrUndefined(temp)) {
    setStorage(storageName, defaultInt);
  } else {
    tempInt = parseInt(temp);
    if (Number.isNaN(tempInt)) tempInt = defaultInt;
  }
  return tempInt;
}

function getStorageToVariableStr(storageName, defaultStr) {
  let temp = getStorage(storageName);
  if (isNullOrUndefined(temp)) {
    setStorage(storageName, defaultStr);
    temp = defaultStr;
  }
  return temp;
}

function getStorageToVariableBool(storageName, defaultBool) {
  let temp = getStorage(storageName);
  if (isNullOrUndefined(temp)) {
    setStorage(storageName, defaultBool.toString());
    return defaultBool;
  } else if (temp === true || temp.toLowerCase() == 'true') {
    return true;
  } else {
    return false;
  }
}

function disarmTrap(trapSelector) {
  if (trapSelector == 'weapon' || trapSelector == 'base') return;

  let nQuantity = parseInt(
    getPageVariable('user.' + trapSelector + '_quantity')
  );
  if (nQuantity === 0) {
    deleteArmingFromList(trapSelector);
    if (isNewUI && !isArmingInList()) closeTrapSelector(trapSelector);
    arming = false;
    return;
  }
  let x;
  let strTemp = '';
  let intervalDisarm = setInterval(function () {
    if (arming === false) {
      addArmingIntoList(trapSelector);
      clickTrapSelector(trapSelector);
      let intervalDT = setInterval(function () {
        if (isNewUI) {
          x = document.getElementsByClassName(
            'campPage-trap-itemBrowser-item-disarmButton'
          );
          if (x.length > 0) {
            fireEvent(x[0], 'click');
            console.plog(trapSelector, 'Disarmed');
            deleteArmingFromList(trapSelector);
            if (isNewUI && !isArmingInList()) closeTrapSelector(trapSelector);
            arming = false;
            //window.setTimeout(function () { closeTrapSelector(trapSelector); }, 1000);
            clearInterval(intervalDT);
            intervalDT = null;
            return;
          }
        } else {
          x = document.getElementsByClassName(trapSelector + ' canDisarm');
          if (x.length > 0) {
            for (let i = 0; i < x.length; ++i) {
              strTemp = x[i].getAttribute('title');
              if (strTemp.indexOf('Click to disarm') > -1) {
                fireEvent(x[i], 'click');
                console.plog(trapSelector, 'Disarmed');
                deleteArmingFromList(trapSelector);
                arming = false;
                clearInterval(intervalDT);
                intervalDT = null;
                return;
              }
            }
          }
        }
      }, 1000);
      clearInterval(intervalDisarm);
      intervalDisarm = null;
    }
  }, 1000);
  return;
}

/**
 * Init and then dispatch 'on'+event
 *
 * @param {HTMLElement} element
 * @param {String} event
 * @return {Boolean} !cancelled(not invoked preventDault)
 */
function fireEvent(element, event) {
  logging('RUN %cfireEvent() ON:', 'color: #bada55');
  logging(event);
  logging(element);

  let evt;
  if (document.createEventObject) {
    // dispatch for IE
    evt = document.createEventObject();

    try {
      return element.fireEvent('on' + event, evt);
    } finally {
      element = null;
      event = null;
      evt = null;
    }
  } else {
    // dispatch for firefox + others
    /* evt = document.createEvent('HTMLEvents');
    evt.initEvent(event, true, true); // event type,bubbling,cancelable

    try {
      return !element.dispatchEvent(evt);
    } finally {
      element = null;
      event = null;
      evt = null;
    } */
    evt = new Event(event);
    try {
      return !element.dispatchEvent(evt);
    } catch (error) {
      console.plog('fireEvent: ', e);
    }
  }
}

/**
 * Mousehunt put a user object in page.
 * Get property value of this object for
 *  different browser.
 * Firefox可以直接用 unsafeWindow取值,
 * 所以直接傳 property name.
 * Chrome是用 create script element的方式取得
 * 遊戲頁面的 javascript資料,所以傳進來的 name
 * 是 javascript程式碼而非單純的 property name.
 * @param {String} name Property name of user object in the page
 * @return {*} Value of specified property
 */
function getPageVariable(name) {
  //logging('RUN GPV(' + name + ')');
  try {
    const browser = browserDetection();

    if (browser == 'chrome') {
      if (name == 'user.unique_hash') {
        return user.unique_hash;
      } else {
        return getPageVariableForChrome(name);
      }
    } else if (browser == 'firefox') {
      if (name == 'user.next_activeturn_seconds') {
        return unsafeWindow.user.next_activeturn_seconds;
      } else if (name == 'user.unique_hash') {
        return unsafeWindow.user.unique_hash;
      } else if (name == 'user.has_puzzle') {
        return unsafeWindow.user.has_puzzle;
      } else if (name == 'user.bait_quantity') {
        return unsafeWindow.user.bait_quantity;
      } else if (name == 'user.environment_name') {
        return unsafeWindow.user.environment_name;
      } else if (name == 'user.trinket_name') {
        return unsafeWindow.user.trinket_name;
      } else if (name == 'user.weapon_name') {
        return unsafeWindow.user.weapon_name;
      } else if (name == 'user.quests.QuestTrainStation.on_train') {
        return unsafeWindow.user.quests.QuestTrainStation.on_train;
      } else {
        logging('GPV firefox: ' + name + ' not found.');
      }
    } else {
      logging('GPV other: ' + name + 'not found.');
    }

    return 'ERROR';
  } catch (e) {
    logging('GPV ALL try block error: ' + e);
  } finally {
    name = undefined;
  }
}

/**
 * Chrome version of getPageVariable.
 * 用 create script element的方式取得
 * 遊戲頁面的 javascript資料,所以傳進來的 name
 * 是 javascript程式碼而非單純的 property name.
 * @param {String} variableName Property name of user object in the page
 * @return {*} Value of specified property
 */
function getPageVariableForChrome(variableName) {
  // logging('RUN GPVchrome(' + variableName + ')');
  // google chrome only
  let scriptElement = document.createElement('script');
  scriptElement.setAttribute('id', 'scriptElement');
  scriptElement.setAttribute('type', 'text/javascript');
  scriptElement.innerHTML =
    "document.getElementById('scriptElement').innerText=" + variableName + ';';
  document.body.appendChild(scriptElement);

  let value = scriptElement.innerHTML;
  document.body.removeChild(scriptElement);
  scriptElement = null;
  variableName = null;

  try {
    return value;
  } finally {
    value = null;
  }
}

/**
 * return getElementById(idName).innerText
 * @param {String} idName String of id
 * @return {String}
 */
function getPageText(idName) {
  try {
    return document.getElementById(idName).innerText;
  } catch (e) {
    logging('getPageText(' + idName + ') ERROR: ' + e);
    logging(e);
  }
}

function timeElapsed(dateA, dateB) {
  let elapsed = 0;

  let secondA = Date.UTC(
    dateA.getFullYear(),
    dateA.getMonth(),
    dateA.getDate(),
    dateA.getHours(),
    dateA.getMinutes(),
    dateA.getSeconds()
  );
  let secondB = Date.UTC(
    dateB.getFullYear(),
    dateB.getMonth(),
    dateB.getDate(),
    dateB.getHours(),
    dateB.getMinutes(),
    dateB.getSeconds()
  );
  elapsed = (secondB - secondA) / 1000;

  secondA = null;
  secondB = null;
  dateA = null;
  dateB = null;

  try {
    return elapsed;
  } finally {
    elapsed = null;
  }
}

function timeFormat(time) {
  let timeString;
  let hr = Math.floor(time / 3600);
  let min = Math.floor((time % 3600) / 60);
  let sec = ((time % 3600) % 60) % 60;

  if (hr > 0) {
    timeString = hr.toString() + ':' + min.toString() + ':' + sec.toString();
  } else if (min > 0) {
    timeString = min.toString() + ':' + sec.toString();
  } else {
    timeString = sec.toString() + ' sec';
  }

  time = null;
  hr = null;
  min = null;
  sec = null;

  try {
    return timeString;
  } finally {
    timeString = null;
  }
}

function timeFormatLong(time) {
  let timeString;

  if (time != -1) {
    let day = Math.floor(time / 86400);
    let hr = Math.floor((time % 86400) / 3600);
    let min = Math.floor((time % 3600) / 60);

    if (day > 0) {
      timeString =
        day.toString() +
        ' day ' +
        hr.toString() +
        ' hr ' +
        min.toString() +
        ' min ago';
    } else if (hr > 0) {
      timeString = hr.toString() + ' hr ' + min.toString() + ' min ago';
    } else if (min > 0) {
      timeString = min.toString() + ' min ago';
    }

    day = null;
    hr = null;
    min = null;
  } else {
    timeString = null;
  }

  time = null;

  try {
    return timeString;
  } finally {
    timeString = null;
  }
}
/**
 * Generate random KR answer.
 * @param {int} length
 * @return {String} random KR answer.
 */
function makeId(length) {
  let result = '';
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
// ################################################################################################
//   General Function - End
// ################################################################################################

// ################################################################################################
//   NOB Additional thing - Start
// ################################################################################################

function nobInit() {
  logging('RUN %cnobInit()', 'color: #00ff00');
  try {
    if (!isKingReward) {
      if (
        window.location.href == 'http://www.mousehuntgame.com/' ||
        window.location.href == 'http://www.mousehuntgame.com/#' ||
        window.location.href ==
          'http://www.mousehuntgame.com/?switch_to=standard' ||
        window.location.href == 'https://www.mousehuntgame.com/' ||
        window.location.href == 'https://www.mousehuntgame.com/#' ||
        window.location.href ==
          'https://www.mousehuntgame.com/?switch_to=standard' ||
        window.location.href.indexOf('mousehuntgame.com/turn.php') != -1 ||
        window.location.href.indexOf('mousehuntgame.com/index.php') != -1 ||
        window.location.href.indexOf('mousehuntgame.com/camp.php') != -1 ||
        window.location.href == 'http://www.mousehuntgame.com/canvas/' ||
        window.location.href == 'http://www.mousehuntgame.com/canvas/#' ||
        window.location.href == 'https://www.mousehuntgame.com/canvas/' ||
        window.location.href == 'https://www.mousehuntgame.com/canvas/#' ||
        window.location.href.indexOf('mousehuntgame.com/canvas/index.php') !=
          -1 ||
        window.location.href.indexOf('mousehuntgame.com/canvas/turn.php') !=
          -1 ||
        window.location.href.indexOf('mousehuntgame.com/canvas/?') != -1
      ) {
        NOBpage = true;
      }

      if (NOBpage) {
        nobHTMLFetch();
        createClockArea();
        clockTick();
        setTimeout(function () {
          nobInjectFFfunctions();
        }, 1000);
        setTimeout(function () {
          pingServer();
        }, 30000);
        // Hide message after 2H :)
        hideNOBMessage(7200000);
      }
    }
  } catch (e) {
    logging('nobInit() ERROR - ' + e);
  }
}

function nobAjaxGet(url, callback, throwError) {
  if (!isKingReward) {
    jQuery.ajax({
      url: url,
      type: 'GET',
      timeout: 5000,
      statusCode: {
        200: function () {
          logging('Success get - ' + url);
          //Success Message
        }
      },
      success: callback,
      error: throwError
    });
  }
}

function nobAjaxPost(url, data, callback, throwError, dataType) {
  if (!isKingReward) {
    if (dataType == null || dataType == undefined) dataType = 'json';

    jQuery.ajax({
      type: 'POST',
      url: url,
      data: data,
      contentType: 'text/plain',
      dataType: dataType,
      xhrFields: {
        withCredentials: false
      },
      timeout: 10000,
      statusCode: {
        200: function () {
          logging('Success post - ' + url);
          //Success Message
        }
      },
      success: callback,
      error: throwError
    });
  }
}

/**
 * Transform seconds to hh:mm
 *
 * @param {BigInt} timeleft seconds
 * @param {Boolean} inhours
 * @return {*}
 */
function updateTimer(timeleft, inhours) {
  // logging('updateTimer(' + timeleft + ')');
  let ReturnValue = '';

  let FirstPart;
  let SecondPart;
  let Size;

  if (timeleft > 0) {
    if (inhours != null && inhours == true && timeleft > 3600) {
      FirstPart = Math.floor(timeleft / (60 * 60));
      SecondPart = Math.floor(timeleft / 60) % 60;
      Size = 'hrs';
    } else {
      FirstPart = Math.floor(timeleft / 60);
      SecondPart = timeleft % 60;
      Size = 'mins';
    }

    if (SecondPart < 10) {
      SecondPart = '0' + SecondPart;
    }

    ReturnValue = FirstPart + ':' + SecondPart + ' ' + Size;
  } else {
    ReturnValue = 'Soon...';
  }

  return ReturnValue;
}

function nobGDoc(items, type) {
  let dataSend = JSON.parse(items);
  dataSend.type = type;
  let dataSendString = JSON.stringify(dataSend);
  let sheet =
    'https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec';

  nobAjaxPost(
    sheet,
    dataSendString,
    function (data) {
      logging(data);
    },
    function (a, b, c) {
      logging('nobGDoc error (' + b + '): ' + c);
    }
  );
}

function nobHTMLFetch() {
  let value = document.documentElement.innerHTML;
  if (value != null) {
    if (typeof value == 'string') {
      let StartPos = value.indexOf('user = ');
      let EndPos = value.indexOf('};', StartPos);

      if (StartPos != -1) {
        let FullObjectText = value.substring(StartPos + 7, EndPos + 1);
        nobStore(JSON.parse(FullObjectText), 'data');
      }
    } else if (typeof value == 'object') {
      nobStore(value, 'data');
    }
  }
  value = undefined;
}

function nobStore(data, type) {
  data = JSON.stringify(data);
  let name = 'NOB-' + type;
  localStorage.setItem(name, data);
}

function nobGet(type) {
  return localStorage.getItem('NOB-' + type);
}

function nobMapRequest(handleData) {
  /* let url = 'https://www.mousehuntgame.com/managers/ajax/users/relichunter.php';
  let dataSend = {
    action: 'info',
    uh: getPageVariable('user.unique_hash'),
    viewas: null
  };
  jQuery.ajax({
    url: url,
    data: dataSend,
    type: 'POST',
    dataType: 'json',
    timeout: 5000,
    success: function (data) {
      // logging(data);
      handleData(data);
    },
    error: function (error) {
      logging('Map Request Failed');
      handleData(error);
    }
  });

  url = null;
  dataSend = null; */
}

function nobLoading(location, name) {
  let element = document.getElementById(location);
  element.innerHTML =
    '<style type="text/css">' +
    /* Universal styling */
    '    [class^="shaft-load"] {' +
    '    margin: 5px auto;' +
    '    width: 60px;' +
    '    height: 15px;' +
    '}' +
    '[class^="shaft-load"] > div {' +
    '    float: left;' +
    '    background: #B96CFF;' +
    '    height: 100%;' +
    '    width: 5px;' +
    '    margin-right: 1px;' +
    '    display: inline-block;' +
    '}' +
    '[class^="shaft-load"] .shaft1 {' +
    '    -webkit-animation-delay: 0.05s;' +
    '    -moz-animation-delay: 0.05s;' +
    '    -o-animation-delay: 0.05s;' +
    '    animation-delay: 0.05s;' +
    '}' +
    '[class^="shaft-load"] .shaft2 {' +
    '    -webkit-animation-delay: 0.1s;' +
    '    -moz-animation-delay: 0.1s;' +
    '    -o-animation-delay: 0.1s;' +
    '    animation-delay: 0.1s;' +
    '}' +
    '[class^="shaft-load"] .shaft3 {' +
    '    -webkit-animation-delay: 0.15s;' +
    '    -moz-animation-delay: 0.15s;' +
    '    -o-animation-delay: 0.15s;' +
    '    animation-delay: 0.15s;' +
    '}' +
    '[class^="shaft-load"] .shaft4 {' +
    '    -webkit-animation-delay: 0.2s;' +
    '    -moz-animation-delay: 0.2s;' +
    '    -o-animation-delay: 0.2s;' +
    '    animation-delay: 0.2s;' +
    '}' +
    '[class^="shaft-load"] .shaft5 {' +
    '    -webkit-animation-delay: 0.25s;' +
    '    -moz-animation-delay: 0.25s;' +
    '    -o-animation-delay: 0.25s;' +
    '    animation-delay: 0.25s;' +
    '}' +
    '[class^="shaft-load"] .shaft6 {' +
    '    -webkit-animation-delay: 0.3s;' +
    '    -moz-animation-delay: 0.3s;' +
    '    -o-animation-delay: 0.3s;' +
    '    animation-delay: 0.3s;' +
    '}' +
    '[class^="shaft-load"] .shaft7 {' +
    '    -webkit-animation-delay: 0.35s;' +
    '    -moz-animation-delay: 0.35s;' +
    '    -o-animation-delay: 0.35s;' +
    '    animation-delay: 0.35s;' +
    '}' +
    '[class^="shaft-load"] .shaft8 {' +
    '    -webkit-animation-delay: 0.4s;' +
    '    -moz-animation-delay: 0.4s;' +
    '    -o-animation-delay: 0.4s;' +
    '    animation-delay: 0.4s;' +
    '}' +
    '[class^="shaft-load"] .shaft9 {' +
    '    -webkit-animation-delay: 0.45s;' +
    '    -moz-animation-delay: 0.45s;' +
    '    -o-animation-delay: 0.45s;' +
    '    animation-delay: 0.45s;' +
    '}' +
    '[class^="shaft-load"] .shaft10 {' +
    '    -webkit-animation-delay: 0.5s;' +
    '    -moz-animation-delay: 0.5s;' +
    '    -o-animation-delay: 0.5s;' +
    '    animation-delay: 0.5s;' +
    '}' +
    /* Shaft 1 */
    '.shaft-load > div {' +
    '    -webkit-animation: loading 1.5s infinite ease-in-out;' +
    '    -moz-animation: loading 1.5s infinite ease-in-out;' +
    '    -o-animation: loading 1.5s infinite ease-in-out;' +
    '    animation: loading 1.5s infinite ease-in-out;' +
    '    -webkit-transform: scaleY(0.05) translateX(-10px);' +
    '    -moz-transform: scaleY(0.05) translateX(-10px);' +
    '    -ms-transform: scaleY(0.05) translateX(-10px);' +
    '    -o-transform: scaleY(0.05) translateX(-10px);' +
    '    transform: scaleY(0.05) translateX(-10px);' +
    '}' +
    '@-webkit-keyframes loading {' +
    '    50% {' +
    '    -webkit-transform: scaleY(1.2) translateX(10px);' +
    '    -moz-transform: scaleY(1.2) translateX(10px);' +
    '    -ms-transform: scaleY(1.2) translateX(10px);' +
    '    -o-transform: scaleY(1.2) translateX(10px);' +
    '    transform: scaleY(1.2) translateX(10px);' +
    '    background: #56D7C6;' +
    '}' +
    '}' +
    '@-moz-keyframes loading {' +
    '50% {' +
    '-webkit-transform: scaleY(1.2) translateX(10px);' +
    '-moz-transform: scaleY(1.2) translateX(10px);' +
    '-ms-transform: scaleY(1.2) translateX(10px);' +
    '-o-transform: scaleY(1.2) translateX(10px);' +
    'transform: scaleY(1.2) translateX(10px);' +
    'background: #56D7C6;' +
    '}' +
    '}' +
    '@-o-keyframes loading {' +
    '50% {' +
    '-webkit-transform: scaleY(1.2) translateX(10px);' +
    '-moz-transform: scaleY(1.2) translateX(10px);' +
    '-ms-transform: scaleY(1.2) translateX(10px);' +
    '-o-transform: scaleY(1.2) translateX(10px);' +
    'transform: scaleY(1.2) translateX(10px);' +
    'background: #56D7C6;' +
    '}' +
    '}' +
    '@keyframes loading {' +
    '50% {' +
    '-webkit-transform: scaleY(1.2) translateX(10px);' +
    '-moz-transform: scaleY(1.2) translateX(10px);' +
    '-ms-transform: scaleY(1.2) translateX(10px);' +
    '-o-transform: scaleY(1.2) translateX(10px);' +
    'transform: scaleY(1.2) translateX(10px);' +
    'background: #56D7C6;' +
    '}' +
    '}' +
    '</style>' +
    '<div class="shaft-load">' +
    '<div class="shaft1"></div>' +
    '<div class="shaft2"></div>' +
    '<div class="shaft3"></div>' +
    '<div class="shaft4"></div>' +
    '<div class="shaft5"></div>' +
    '<div class="shaft6"></div>' +
    '<div class="shaft7"></div>' +
    '<div class="shaft8"></div>' +
    '<div class="shaft9"></div>' +
    '<div class="shaft10"></div>' +
    '</div>';

  element = null;
}

function nobStopLoading(location) {
  let element = document.getElementById(location);
  //element.innerHTML = null;
  element = null;
}

// VARS DONE ******************************* COMMENCE CODE
function nobScript(qqEvent) {
  if (NOBpage) {
    logging('RUN nobScript()');
    let mapThere;
    try {
      let NOBdata = nobGet('data');
      mapThere = document.getElementsByClassName('treasureMap')[0];
      if (mapThere.textContent.indexOf('remaining') == -1) {
        mapThere = false;
        logging('No map, using HTML data now');
      } else {
        mapThere = true;
      }

      if (NOBdata != null || NOBdata != undefined) {
        if (!mapRequestFailed && mapThere) {
          nobMapRequest(function (output) {
            logging('RUN nobMapRequest()');
            logging(output);
            if (output.status == 200 || output.status == undefined) {
              nobStore(output, 'data');
              nobGDoc(JSON.stringify(output), 'map');
            } else {
              logging('Map request failed: ' + output);
              mapRequestFailed = true;
              nobHTMLFetch();
              output = nobGet('data');
              nobGDoc(output, 'user');
            }
          });
        } else {
          logging(
            'Map fetch failed, using USER data from html (' +
              mapRequestFailed +
              ', ' +
              mapThere +
              ')'
          );
          nobHTMLFetch();
          let output = nobGet('data');
          nobGDoc(output, 'user');
        }
      } else {
        logging('Data is not found, doing HTML fetch now.');
        nobHTMLFetch();
      }
    } catch (e) {
      logging('nobScript error: ' + e);
    } finally {
      mapThere = null;
    }
  }
}

/* function nobTravel(location) {
  if (NOBpage) {
    let url =
      'https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php';
    let data = {
      origin: self.getCurrentUserEnvironmentType(),
      destination: location,
      uh: getPageVariable('user.unique_hash')
    };
    nobAjaxPost(
      url,
      data,
      function (r) {
        logging(r);
      },
      function (a, b, c) {
        logging(b, c);
      }
    );
  }
} */

// Update + message fetch

function pingServer() {
  /*if (NOBpage) {
        logging("Running pingServer()");
        let theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        let theUsername = theData.username;
        let thePassword = theData.sn_user_id;

        Parse.initialize("mh-autobot", "unused");
        Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';
        Parse.User.logIn(theUsername, thePassword).then(function (user) {
            // logging("Success parse login");
            return Parse.Promise.as("Login success");
        }, function (user, error) {
            logging("Parse login failed, attempting to create new user now.");

            let createUser = new Parse.User();
            createUser.set("username", theUsername);
            createUser.set("password", thePassword);
            createUser.set("email", thePassword + "@mh.com");

            let usrACL = new Parse.ACL();
            usrACL.setPublicReadAccess(false);
            usrACL.setPublicWriteAccess(false);
            usrACL.setRoleReadAccess("Administrator", true);
            usrACL.setRoleWriteAccess("Administrator", true);
            createUser.setACL(usrACL);

            createUser.signUp(null, {
                success: function (newUser) {
                    logging(newUser);
                    pingServer();
                    return Parse.Promise.error("Creating new user, trying to login now.");
                },
                error: function (newUser, signupError) {
                    // Show the error message somewhere and let the user try again.
                    logging("Parse Error: " + signupError.code + " " + signupError.message);
                    return Parse.Promise.error("Error in signup, giving up serverPing now.");
                }
            });
            return Parse.Promise.error("Failed login, attempted signup, rerunning code");
        }).then(function (success) {
            let UserData = Parse.Object.extend("UserData");

            let findOld = new Parse.Query(UserData);
            findOld.containedIn("user_id", [theData.sn_user_id, JSON.stringify(theData.sn_user_id)]);
            return findOld.find();
        }).then(function (returnObj) {
            let results = returnObj;
            let promises = [];
            for (let i = 0; i < results.length; i++) {
                promises.push(results[i].destroy());
            }
            // logging("Done parse delete");
            return Parse.Promise.when(promises);
        }).then(function (UserData) {
            UserData = Parse.Object.extend("UserData");
            let userData = new UserData();

            userData.set("user_id", theData.sn_user_id);
            userData.set("name", theData.username);
            userData.set("script_ver", scriptVersion);
            userData.set("browser", browserDetection());
            userData.set("betaUI", isNewUI);
            userData.set("data", JSON.stringify(theData));
            userData.set("addonCode", addonCode);
            let dataACL = new Parse.ACL(Parse.User.current());
            dataACL.setRoleReadAccess("Administrator", true);
            dataACL.setRoleWriteAccess("Administrator", true);
            userData.setACL(dataACL);

            return userData.save();
        }).then(function (results) {
            logging("Success Parse");
        }).then(function (message) {
            if (message != undefined || message != null)
                logging("Parse message: " + message);
            if (Parse.User.current() != null) {
                Parse.User.logOut();
                // logging("Parse logout");
            }
        }, function (error) {
            if (error != undefined || error != null) {
                logging("Parse error: " + error);
            }
        });
    }*/
}

function hideNOBMessage(time) {
  window.setTimeout(function () {
    let element = document.getElementById('NOBmessage');
    element.style.display = 'none';
  }, time);
}

function showNOBMessage() {
  document.getElementById('NOBmessage').style.display = 'block';
}

function nobInjectFFfunctions() {
  let browser = browserDetection();
  let raffleDiv = document.getElementById('nobRaffle');
  let presentDiv = document.getElementById('nobPresent');
  let addAdDiv = document.getElementById('addAdLink');
  let removeAdDiv = document.getElementById('removeAdLink');

  if (browser == 'firefox') {
    unsafeWindow.nobRaffle = exportFunction(nobRaffle, unsafeWindow);
    unsafeWindow.nobPresent = exportFunction(nobPresent, unsafeWindow);

    raffleDiv.addEventListener('click', function () {
      unsafeWindow.nobRaffle();
      return false;
    });
    presentDiv.addEventListener('click', function () {
      unsafeWindow.nobPresent();
      return false;
    });
    if (addAdDiv) {
      addAdDiv.addEventListener('click', function () {
        localStorage.setItem('allowAds', 'true');
      });
    }
    if (removeAdDiv) {
      removeAdDiv.addEventListener('click', function () {
        localStorage.setItem('allowAds', 'false');
      });
    }
  } else {
    // chrome and all other
    raffleDiv.addEventListener('click', function () {
      nobRaffle();
      return false;
    });
    presentDiv.addEventListener('click', function () {
      nobPresent();
      return false;
    });
    if (addAdDiv) {
      addAdDiv.addEventListener('click', function () {
        localStorage.setItem('allowAds', 'true');
      });
    }
    if (removeAdDiv) {
      removeAdDiv.addEventListener('click', function () {
        localStorage.setItem('allowAds', 'false');
      });
    }
  }
  raffleDiv = undefined;
  presentDiv = undefined;
  addAdDiv = undefined;
  removeAdDiv = undefined;
}

function sendGift() {
  let stage = 0;
  let menuClicked = false;
  let sended = 0;
  let toSendIndex = 0;
  let sendJob = window.setInterval(function () {
    logging('stage at: ' + stage);
    try {
      if (stage == 0) {
        if (!menuClicked) {
          $('.friend_list > a')[0].click();
          menuClicked = true;
        }
        const sendButtons = $('.userInteractionButtonsView-button.sendGift');
        if (sendButtons && sendButtons.length >= 20) {
          stage = 1;
        }
      } else if (stage == 1) {
        logging(
          'clicking: ' +
            toSendIndex +
            ':' +
            $(
              '.userInteractionButtonsView-button.sendGift.mousehuntTooltipParent'
            ).length
        );
        $(
          '.userInteractionButtonsView-button.sendTicket.mousehuntTooltipParent'
        )[toSendIndex].click();
        $('.userInteractionButtonsView-button.sendGift.mousehuntTooltipParent')[
          toSendIndex
        ].click();
        if (
          ++toSendIndex ==
          $(
            '.userInteractionButtonsView-button.sendGift.mousehuntTooltipParent'
          ).length
        ) {
          stage = 2;
        }
      } else if (stage == 2) {
        window.clearInterval(sendJob);
        location.href = 'https://www.mousehuntgame.com/';
        // $('.mousehuntHud-menu-item.root')[0].click();
      }
    } catch (e) {
      logging(e);
      window.clearInterval(sendJob);
      location.href = 'https://www.mousehuntgame.com/';
    } finally {
      //
    }
  }, 1000);
}

function nobRaffle() {
  sendGift();
  /* return;
  let i;
  let intState = 0;
  let nobRafGiveUp = 10;
  let nobRafInt = window.setInterval(function () {
    try {
      if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
        $('#hgbar_messages').click();
        intState = 1;
        return;
      } else if ($('a.active.tab')[0].dataset.tab != 'daily_draw') {
        let tabs = $('a.tab');
        let theTab = '';
        for (i = 0; i < tabs.length; i++) {
          if (tabs[i].dataset.tab == 'daily_draw') {
            tabs[i].click();
            return;
          }
        }

        // If there are no raffles
        intState = 0;
        $('a.messengerUINotificationClose')[0].click();
        logging('No raffles found.');
        window.clearInterval(nobRafInt);

        nobRafInt = null;
        intState = null;
        i = null;
        return;
      } else if (
        intState != 2 &&
        $('a.active.tab')[0].dataset.tab == 'daily_draw'
      ) {
        let ballot = $('.notificationMessageList input.sendBallot');
        for (i = ballot.length - 1; i >= 0; i--) {
          ballot[i].click();
        }
        intState = 2;
        return;
      } else if ($('a.active.tab')[0].dataset.tab == 'daily_draw') {
        intState = 3;
      } else {
        intState = -1;
      }
    } catch (e) {
      logging(
        'Raffle interval error: ' +
          e +
          ', retrying in 2 seconds. Giving up in ' +
          nobRafGiveUp * 2 +
          ' seconds.'
      );
      if (nobRafGiveUp < 1) {
        intState = -1;
      } else {
        nobRafGiveUp--;
      }
    } finally {
      if (intState == 3) {
        $('a.messengerUINotificationClose')[0].click();
        window.clearInterval(nobRafInt);

        nobRafInt = null;
        intState = null;
        i = null;
        return;
      } else if (intState == -1) {
        logging('Present error, user pls resolve yourself');
        window.clearInterval(nobRafInt);

        nobRafInt = null;
        intState = null;
        i = null;
        return;
      }
    }
  }, 2000); */
}

function nobPresent() {
  let intState = 0;
  let i;
  let nobPresGiveUp = 10;
  let presents;
  let nobPresInt = window.setInterval(function () {
    try {
      if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
        $('#hgbar_freegifts').click();
        intState = 1;
        return;
      } else if (intState != 2) {
        presents = $('a[class~="return"]');
        for (i = presents.length - 1; i >= 0; i--) {
          presents[i].click();
        }
        presents = $('a[class~="claim"]');
        for (i = presents.length - 1; i >= 0; i--) {
          presents[i].click();
        }
        intState = 2;
        return;
      } else if (intState == 2) {
        intState = 3;
      } else {
        intState = -1;
      }
    } catch (e) {
      logging(
        'Present interval error: ' +
          e +
          ', retrying in 2 seconds. Giving up in ' +
          nobPresGiveUp * 2 +
          ' seconds.'
      );
      if (nobPresGiveUp < 1) {
        intState = -1;
      } else {
        nobPresGiveUp--;
      }
    } finally {
      if (intState == 3) {
        $('a.giftSelectorView-inboxHeader-closeButton')[0].click();
        window.clearInterval(nobPresInt);
        nobPresInt = null;
        intState = null;
        i = null;
        return;
      } else if (intState == -1) {
        logging('Present error, user pls resolve yourself');
        window.clearInterval(nobPresInt);
        nobPresInt = null;
        intState = null;
        i = null;
        return;
      }
    }
  }, 2000);
}

// CALCULATE TIMER *******************************
/**
 * Get Date.now() in seconds.
 *
 * @return {BigInt} Date.now() in seconds
 */
function currentTimeStamp() {
  return parseInt(Date.now() / 1000, 10);
}

function createClockArea() {
  try {
    let parent = document.getElementById('loadTimersElement');
    let child = [];
    let text;

    for (i = 0; i < LOCATION_TIMERS.length; i++) {
      child[i] = document.createElement('div');
      child[i].setAttribute('id', 'NOB' + LOCATION_TIMERS[i][0]);
      text = '<span id="text_' + LOCATION_TIMERS[i][0] + '">';
      child[i].innerHTML = text;
    }

    for (i = 0; i < LOCATION_TIMERS.length; i++)
      parent.insertBefore(child[i], parent.firstChild);

    parent.insertBefore(document.createElement('br'), parent.firstChild);
  } catch (e) {
    logging('createClockArea() ERROR: ' + e);
  }
}

function clockTick() {
  logging('RUN %cclockTick()', 'color: #9cffbd');
  let temp = document.getElementById('NOBrelic');
  if (clockNeedOn && !clockTicking && temp) {
    // Clock needs to be on, but is not ticking
    updateTime();
  } else if (clockTicking && clockNeedOn && temp) {
    // Clock needs to be on and is already ticking
  } else {
    // Clock does not need to be on
    nobCalculateTime();
  }
  NOBtickerInterval = window.setTimeout(function () {
    clockTick();
  }, 15 * 60 * 1000);
}

function updateTime() {
  logging('RUN updateTime()');
  try {
    let timeLeft = JSON.parse(nobGet('relic'));
    if (timeLeft > 0) {
      timeLeft--;
      let element = document.getElementById('NOBrelic');
      element.innerHTML = updateTimer(timeLeft, true);
      nobStore(timeLeft, 'relic');
      nobCalculateOfflineTimers();
      clockTicking = true;

      NOBtickerTimout = window.setTimeout(function () {
        updateTime();
      }, 1000);
    } else {
      clockTicking = false;
      clockNeedOn = false;
    }
  } catch (e) {
    logging('UpdateTime error: ' + e);
    clearTimeout(NOBtickerTimout);
    clearTimeout(NOBtickerInterval);
  }
}

function nobCalculateTime(runOnly) {
  logging('Running nobCalculateTime(' + runOnly + ')');
  // let child;
  if (runOnly != 'relic' && runOnly != 'toxic' && runOnly != 'none')
    runOnly = 'all';

  try {
    /* Parse.initialize('mh-autobot', 'unused');
    Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';
    if (
      (runOnly == 'relic' || runOnly == 'all') &&
      (typeof LOCATION_TIMERS[3][1].url != 'undefined' ||
        LOCATION_TIMERS[3][1].url != 'undefined')
    ) {
      Parse.Cloud.run('nobRelic', {}, {
                success: function (data) {
                    data = JSON.parse(data);

                    if (data.result == "error") {
                        child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                        child.innerHTML = "<font color='red'>" + data.error + "</font>";
                    } else {
                        child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                        child.innerHTML = "Relic hunter now in: <font color='green'>" + data.location + "</font> \~ Next move time: <span id='NOBrelic'>" + updateTimer(data.next_move, true);
                        if (data.next_move > 0) {
                            clockTicking = true;
                            nobStore(data.next_move, 'relic');
                            updateTime();
                            clockNeedOn = true;
                        } else {
                            clockTicking = false;
                            clockNeedOn = false;
                        }
                    }
                }, error: function (error) {
                    error = JSON.parse(error);

                    let child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                    child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
                }
            });
      logging('relic hunter will be back :)');
    } */

    /*if ((runOnly == 'toxic' || runOnly == 'all') && (typeof LOCATION_TIMERS[4][1].url != 'undefined' || LOCATION_TIMERS[4][1].url != 'undefined')) {
            Parse.Cloud.run('nobToxic', {}, {
                success: function (data) {
                    data = JSON.parse(data);

                        if (data.result == "error") {
                            child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                            child.innerHTML = "<font color='red'>" + data.error + "</font>";
                        } else {
                            child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                            if (data.level == 'Closed') {
                                data.level = {
                                    color: 'red',
                                    state: data.level
                                };
                            } else {
                                data.level = {
                                    color: 'green',
                                    state: data.level
                                };
                            }
                            if (data.percent < 0) {
                                data.percent = '';
                            } else {
                                data.percent = ' &#126; ' + (100 - data.percent) + '% left';
                            }
                            child.innerHTML = 'Toxic spill is now - <font color="' + data.level.color + '">' + data.level.state + '</font>' + data.percent;
                        }
                    }, error: function (error) {
                        error = JSON.parse(error);

                        child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                        child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
                    }
                });
            }*/

    if (runOnly == 'all') nobCalculateOfflineTimers();
  } catch (e) {
    logging('updateTime ERR - ' + e);
  }
}

/**
 * Calculate timers like Forbidden Grove etc.
 *
 * @param {String} runOnly
 * @return {*}
 */
function nobCalculateOfflineTimers(runOnly) {
  // logging('nobCalculateOfflineTimers(' + runOnly + ')');
  if (runOnly != 'seasonal' && runOnly != 'balack' && runOnly != 'fg')
    runOnly = 'all';

  let CurrentTime = currentTimeStamp();
  let CurrentName = -1;
  let CurrentBreakdown = 0;
  let TotalBreakdown = 0;
  let iCount2;

  if (runOnly == 'seasonal') {
    for (
      iCount2 = 0;
      iCount2 < LOCATION_TIMERS[0][1].breakdown.length;
      iCount2++
    )
      TotalBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

    const CurrentValue =
      Math.floor(
        (CurrentTime - LOCATION_TIMERS[0][1].first) /
          LOCATION_TIMERS[0][1].length
      ) % TotalBreakdown;

    for (
      iCount2 = 0;
      iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentName == -1;
      iCount2++
    ) {
      CurrentBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

      if (CurrentValue < CurrentBreakdown) {
        CurrentName = iCount2;
      }
    }

    /* const SeasonLength =
      LOCATION_TIMERS[0][1].length *
      LOCATION_TIMERS[0][1].breakdown[CurrentName]; */
    let CurrentTimer = CurrentTime - LOCATION_TIMERS[0][1].first;
    // let SeasonRemaining = 0;

    while (CurrentTimer > 0) {
      for (
        iCount2 = 0;
        iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentTimer > 0;
        iCount2++
      ) {
        // SeasonRemaining = CurrentTimer;
        CurrentTimer -=
          LOCATION_TIMERS[0][1].length *
          LOCATION_TIMERS[0][1].breakdown[iCount2];
      }
    }

    // SeasonRemaining = SeasonLength - SeasonRemaining;

    return LOCATION_TIMERS[0][1].name[CurrentName];
  } else if (runOnly == 'all') {
    for (let i = 0; i < 4; i++) {
      // Reset var
      CurrentTime = currentTimeStamp();
      CurrentName = -1;
      CurrentBreakdown = 0;
      TotalBreakdown = 0;

      for (
        iCount2 = 0;
        iCount2 < LOCATION_TIMERS[i][1].breakdown.length;
        iCount2++
      )
        TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

      const CurrentValue =
        Math.floor(
          (CurrentTime - LOCATION_TIMERS[i][1].first) /
            LOCATION_TIMERS[i][1].length
        ) % TotalBreakdown;

      for (
        iCount2 = 0;
        iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1;
        iCount2++
      ) {
        CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

        if (CurrentValue < CurrentBreakdown) {
          CurrentName = iCount2;
        }
      }

      const SeasonLength =
        LOCATION_TIMERS[i][1].length *
        LOCATION_TIMERS[i][1].breakdown[CurrentName];
      let CurrentTimer = CurrentTime - LOCATION_TIMERS[i][1].first;
      let SeasonRemaining = 0;

      while (CurrentTimer > 0) {
        for (
          iCount2 = 0;
          iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentTimer > 0;
          iCount2++
        ) {
          SeasonRemaining = CurrentTimer;
          CurrentTimer -=
            LOCATION_TIMERS[i][1].length *
            LOCATION_TIMERS[i][1].breakdown[iCount2];
        }
      }

      SeasonRemaining = SeasonLength - SeasonRemaining;

      const seasonalDiv = document.getElementById(
        'NOB' + LOCATION_TIMERS[i][0]
      );
      let content = '';
      content +=
        LOCATION_TIMERS[i][0] +
        ': <font color="' +
        LOCATION_TIMERS[i][1].color[CurrentName] +
        '">' +
        LOCATION_TIMERS[i][1].name[CurrentName] +
        '</font>';
      if (LOCATION_TIMERS[i][1].effective != null) {
        content += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
      }

      content += ' &#126; For ' + updateTimer(SeasonRemaining, true);
      seasonalDiv.innerHTML = content;
    }
    return;
  }
}

/** Attempt to inject addonCode made by user */
function runAddonCode() {
  if (!isKingReward && addonCode != '') {
    logging(
      '%cRUNNING ADDON CODE, SCRIPT IS NOW NOT SAFE DEPENDING ON WHAT YOU DID.',
      'color: yellow; background: red; font-size: 50pt;'
    );
    eval(addonCode);
  }
}
/** Check and execute scheduled jobs */
function scheduledJobs() {
  logging('scheduledJobs_1.0.0');
  const isoDate = new Date().toLocaleDateString('en-CA');
  const defaultJobs = [
    { begin: '02:33:00', end: '02:58:00', job: 'dailyJob' },
    { begin: '08:03:00', end: '08:28:00', job: 'claimGiftJob' }
  ];
  const scheduledJobsKey = 'scheduledJobs';
  const scheduledJobs = getStorageToObject(scheduledJobsKey, defaultJobs);
  for (let i = 0; i < scheduledJobs.length; i++) {
    const element = scheduledJobs[i];
    // logging(element);
    let beginTime = element['begin'];
    let endTime = element['end'];
    if (beginTime.indexOf('T') < 0) beginTime = isoDate + 'T' + beginTime;
    if (endTime.indexOf('T') < 0) endTime = isoDate + 'T' + endTime;
    const job = element['job'];
    const now = new Date();
    console.log(
      `Should I run ${job} ${typeof window[
        job
      ]} between ${beginTime} and ${endTime} at ${now.toISOString()}?`
    );
    if (now < Date.parse(beginTime)) continue;
    if (now > Date.parse(endTime)) continue;
    console.log(
      `run ${job} ${typeof window[
        job
      ]} between ${beginTime} and ${endTime} at ${now.toISOString()}`
    );
    if (typeof window[job] === 'function')
      setTimeout(() => {
        window[job]();
      }, getRandomInteger(90000, 180000));
  }
}
window.dailyJob = dailyJob;
/** send daily gift and draw tickets */
function dailyJob() {
  logging('dailyJob_2.0.0.0.0');
  let isSendGiftOfToday = true;
  let isSendRaffle = true;
  let isClaimGift = false;
  let isIncrementClaiming = false;
  let claimBeginIndex = null;
  let gotd = null; // '19c3591519e8f103a744b225e475bc85';
  let miniaccountsGift = null; // '19c3591519e8f103a744b225e475bc85';
  const lastGotDDateKey = 'lastGotDDate';
  const lastGotDDate = localStorage.getItem(lastGotDDateKey);
  const today = new Date().toLocaleDateString('en-CA');
  if (lastGotDDate && lastGotDDate == today) {
    console.log('Have sent GotD!!');
    return;
  }
  const AllAccounts = [
    'hg_d783ff747d3b60073ef541d335ff901d', // riemann
    'hg_62a01c775dd2fe8670b6cb46b31c1318', // furtwangler
    'hg_5eeb1174c05069baa7fa40bd82897130', // haruhi
    'hg_1602095c6c0a2376b3bbb12e417df9a4', // kazenomachie
    'hg_2d25dd402e32439c658e10b62d1d64bf', // feynmann
    'hg_52952f2bb5ff36565d7936529f156349', // Omr
    'hg_3207d1fd7e0a8bca4bdef74c378a6a32', // sky
    'hg_3aee6d83ca43348e580141870193b531', // rebecca
    'hg_219f8417793705b8bfe8c4a01ecce1fc', // scent
    'hg_81538b33309a53ae077d5f01f53f6c06', // shallow
    'hg_91cbc542b246f2f8b4f0f3b446915199', // renee
    'hg_9ab9014e7b20bd60ce4a31485651e008' // steins
  ];
  const NoGiftAccounts = [
    '100000656351135', // angel
    '100000556925297', // angela
    '100000724831315', // angelie
    '100000612521913', // anthony
    '100000578963305', // elice levine
    '1842354617', // elie
    '100000122134338', // hsilung
    '100001064572224', // kelly
    '100000636731698', // kevin
    '100000541126764', // kitty
    // 'hg_62a01c775dd2fe8670b6cb46b31c1318', // kreisler
    '1142000722517150', // levi
    'hg_8222e273c0d07aa036e56ed17a8f7884', // lydia
    '100000520204559', // mary
    '100000669404954', // mina
    '100000633987931', // monica
    '100000473806593', // nina
    '100000062975901', // pola
    '468834843316798', // raphael
    // 'hg_d783ff747d3b60073ef541d335ff901d', // riemann
    '100000533948473', // rose
    '100000096968840', // van
    'hg_7b359afdc278e154c3c6f5c6a2f1ba31', // vera
    '100000638927202', // vivienne
    '1794714531', // weyl
    '100000438303274' // vanne
  ];
  const miniaccounts = [
    'hg_d783ff747d3b60073ef541d335ff901d', // riemann
    'hg_62a01c775dd2fe8670b6cb46b31c1318', // furtwangler
    'hg_5eeb1174c05069baa7fa40bd82897130', // haruhi
    'hg_1602095c6c0a2376b3bbb12e417df9a4', // kazenomachie
    'hg_2d25dd402e32439c658e10b62d1d64bf', // feynmann
    'hg_52952f2bb5ff36565d7936529f156349', // Omr
    'hg_3207d1fd7e0a8bca4bdef74c378a6a32', // sky
    'hg_3aee6d83ca43348e580141870193b531', // rebecca
    'hg_219f8417793705b8bfe8c4a01ecce1fc', // scent
    'hg_81538b33309a53ae077d5f01f53f6c06', // shallow
    'hg_91cbc542b246f2f8b4f0f3b446915199', // renee
    'hg_9ab9014e7b20bd60ce4a31485651e008' // steins
  ];
  const snuid = trimToEmpty(user.sn_user_id);
  /** Daily job. */
  const daily = () => {
    if (NoGiftAccounts.indexOf(snuid) > -1) isSendGiftOfToday = false;
    if (!isSendGiftOfToday) {
      if (isSendRaffle) {
        sendDrawTicket();
      }
      return;
    }
    hg.views.GiftSelectorView.show();
    const sendJob = setInterval(() => {
      const acceptBtn = document.getElementsByClassName(
        'giftSelectorView-gift sendable gift gift_of_the_day'
      );
      /* const acceptBtn = document.getElementsByClassName(
        'giftSelectorView-friendRow-action claim'
      ); */
      console.log('Popup loaded?', acceptBtn);
      if (acceptBtn.length == 0) return;
      clearInterval(sendJob);
      sendGiftOfToday(sendDrawTicket);
    }, 1000);
  };
  /**
   *
   * @param {Function} successCallback
   */
  const sendGiftOfToday = (successCallback) => {
    const accounts = [...AllAccounts];
    // 只能送 20個禮物
    const accounts20 = [];
    // 只能送 15個禮物
    const accounts15 = [
      'hg_d783ff747d3b60073ef541d335ff901d', // riemann
      'hg_62a01c775dd2fe8670b6cb46b31c1318', // furtwangler
      'hg_5eeb1174c05069baa7fa40bd82897130', // haruhi
      'hg_1602095c6c0a2376b3bbb12e417df9a4', // kazenomachie
      'hg_2d25dd402e32439c658e10b62d1d64bf', // feynmann
      'hg_52952f2bb5ff36565d7936529f156349', // Omr
      'hg_3207d1fd7e0a8bca4bdef74c378a6a32', // sky
      'hg_3aee6d83ca43348e580141870193b531', // rebecca
      'hg_219f8417793705b8bfe8c4a01ecce1fc', // scent
      'hg_81538b33309a53ae077d5f01f53f6c06', // shallow
      'hg_91cbc542b246f2f8b4f0f3b446915199', // renee
      'hg_9ab9014e7b20bd60ce4a31485651e008' // steins
    ];
    if (!gotd)
      gotd = document
        .querySelector('a.giftSelectorView-gift.sendable.gift.gift_of_the_day')
        .getAttribute('data-gift-index');
    const lastReadJournalEntryId = parseInt(
      document.querySelector('div[data-entry-id]').getAttribute('data-entry-id')
    );
    let parentGiftId;
    let index = accounts.indexOf(snuid);
    if (index > -1) {
      // 不能送 25個禮物
      let removeCount = 1;
      if (accounts20.indexOf(snuid) > -1) removeCount = accounts.length - 20;
      else if (accounts15.indexOf(snuid) > -1)
        removeCount = accounts.length - 15;
      if (removeCount < 1) removeCount = 1;
      if (removeCount > 1) {
        while (index > 0) {
          accounts.push(accounts.shift());
          index = accounts.indexOf(snuid);
        }
      }
      accounts.splice(index, removeCount);
    }
    const giftActions = {
      send: [],
      claim: [],
      ignore: []
    };
    let giftIndex;
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      giftIndex =
        miniaccountsGift && miniaccounts.indexOf(account) > -1
          ? miniaccountsGift
          : gotd;
      giftActions['send'].push({
        snuid: account,
        gift_index: giftIndex,
        quantity: 1,
        parent_gift_id: parentGiftId
      });
    }
    const params = {
      action: 'claim_and_send',
      send_actions: [
        // { snuid: 100000724831315, gift_index: '41e44b41dd7891ddd43b41fb5f9009a5', quantity: 1 }
      ],
      // "uh": "K3FQb2rA",
      last_read_journal_entry_id: lastReadJournalEntryId
    };
    params['send_actions'] = giftActions['send'];
    params['claim_ids'] = giftActions['claim'];
    params['ignore_ids'] = giftActions['ignore'];
    console.log(params['send_actions'].length, params);
    giftAjax(params, successCallback);
  };
  /**
   *
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} errorCallback
   */
  const giftAjax = (params, successCallback, errorCallback) => {
    params['uh'] = user.unique_hash;
    $.ajax({
      data: params,
      dataType: 'json',
      type: 'post',
      url: MOUSEHUNT_BASE_URL + 'managers/ajax/users/socialGift.php',
      success: function (data) {
        console.log(
          parseInt(data.success) == 1 ? 'success' : 'failure',
          data.success
        );
        if (parseInt(data.success) == 1 && successCallback) {
          successCallback(data);
        }
      },
      error: function () {
        localStorage.displayedMessage += 'gift ajax error';
      }
    });
  };
  /**
   * Send draw ticket
   */
  const sendDrawTicket = () => {
    const accounts =
      AllAccounts.indexOf(snuid) > -1 ? [...AllAccounts] : [...NoGiftAccounts];
    if (!isSendRaffle) {
      sendAll(accounts, 0);
      return;
    }
    let index = accounts.indexOf(snuid);
    while (index > 19) {
      accounts.push(accounts.shift());
      index = accounts.indexOf(snuid);
    }
    const removeCount = accounts.length > 20 ? accounts.length - 20 : 1;
    accounts.splice(index, removeCount);
    sendAll(accounts, Math.min(accounts.length, 20));
  };
  /**
   *
   * @param {Array} accounts
   * @param {BigInt} limit
   * @param {BigInt} index
   */
  const sendAll = (accounts, limit, index) => {
    console.log(index);
    let i = index ? index : 0;
    if (i == limit) {
      localStorage.setItem(lastGotDDateKey, today);
      if (isClaimGift) claimGift(isIncrementClaiming, claimBeginIndex);
      else location.href = MOUSEHUNT_BASE_URL;
      return;
    }
    console.log(i, accounts[i]);
    hg.utils.User.sendDrawTicket(accounts[i], () => {
      sendAll(accounts, limit, ++i);
    });
    /* hg.utils.User.sendDrawTicket(accounts[i]);
    setTimeout(() => {
      sendAll(accounts, limit, ++i);
    }, 500); */
  };

  const lastClaimGiftDateKey = 'lastClaimGiftDate';
  /**
   * claim gift increasingly or decreasingly
   * @param {boolean} isIncrement
   * @param {BigInt} beginIndex
   */
  const claimGift = (isIncrement, beginIndex) => {
    let stage = 0;
    let menuClicked = false;
    let choosen = false;
    const sendJob = window.setInterval(function () {
      console.log('stage at: ' + stage);
      try {
        if (stage == 0) {
          if (!menuClicked) {
            $('.free_gifts > a')[0].click();
            menuClicked = true;
            setTimeout(function () {
              if (
                document.getElementsByClassName(
                  'giftSelectorView-tabHeader active'
                )
              ) {
                stage = 1;
              }
            }, 5000);
          }
        } else if (stage == 1) {
          const acceptBtn = document.getElementsByClassName(
            'giftSelectorView-friendRow-action claim'
          );
          if (!choosen && acceptBtn) {
            let startIndex;
            if (isIncrement) {
              startIndex = beginIndex ? beginIndex : 0;
              for (let i = startIndex; i < acceptBtn.length; i++) {
                acceptBtn[i].click();
              }
            } else {
              startIndex = beginIndex ? beginIndex : acceptBtn.length - 1;
              for (let i = startIndex; i > -1; i--) {
                acceptBtn[i].click();
              }
            }
            if (
              document.getElementsByClassName(
                'giftSelectorView-friendRow-action claim selected'
              )[0]
            )
              choosen = true;
          }
          const claimGiftBtn = document.getElementsByClassName(
            'mousehuntActionButton giftSelectorView-action-confirm small'
          );
          if (
            claimGiftBtn &&
            claimGiftBtn[0] &&
            claimGiftBtn[0].innerHTML.indexOf('Claim') > -1
          ) {
            claimGiftBtn[0].click();
            stage = 2;
          }
        } else if (stage == 2) {
          if (
            !document.getElementsByClassName(
              'mousehuntActionButton small giftSelectorView-confirmPopup-submitConfirmButton'
            ).offsetParent
          )
            stage = 3;
        } else if (stage == 3) {
          window.clearInterval(sendJob);
          // Done
          setTimeout(() => {
            document
              .getElementsByClassName(
                'mousehuntActionButton small giftSelectorView-confirmPopup-submitConfirmButton'
              )[0]
              .click();
            // X
            setTimeout(() => {
              document.getElementById('jsDialogClose').click();
              setTimeout(() => {
                document.querySelector('#hgbar_messages').click();
                setTimeout(() => {
                  localStorage.setItem(lastClaimGiftDateKey, today);
                  location.href = MOUSEHUNT_BASE_URL;
                }, 2000);
              }, 1000);
            }, 2000);
          }, 1000);
        }
      } catch (e) {
        console.log(e);
        window.clearInterval(sendJob);
        location.href = MOUSEHUNT_BASE_URL;
      } finally {
        //
      }
    }, 1000);
  };
  $.get('https://elie2201.github.io/mh/dailySettings.html', (data) => {
    const d = JSON.parse(data);
    isSendGiftOfToday = d.isSendGiftOfToday;
    isSendRaffle = d.isSendRaffle;
    isClaimGift = d.isClaimGift;
    isIncrementClaiming = d.isIncrementClaiming;
    claimBeginIndex = d.claimBeginIndex;
    gotd = d.gotd; // '19c3591519e8f103a744b225e475bc85';
    miniaccountsGift = d.miniaccountsGift;
    daily();
  }).fail(() => {
    localStorage.displayedMessage += `failed getting dailySettings`;
    dailyJob();
  });
}
window.claimGiftJob = claimGiftJob;
/** claim daily gift */
function claimGiftJob() {
  logging(`claimGiftJob`);
  const lastClaimGiftDateKey = 'lastClaimGiftDate';
  const lastClaimGiftDate = localStorage.getItem(lastClaimGiftDateKey);
  const today = new Date().toLocaleDateString('en-CA');
  if (lastClaimGiftDate && lastClaimGiftDate == today) {
    console.log('Have claimed gift today!!');
    return;
  }
  logging('running claimGiftJob');
  let isIncrementClaiming = false;
  let claimBeginIndex = null;
  /**
   * claim gift increasingly or decreasingly
   * @param {boolean} isIncrement
   * @param {BigInt} beginIndex
   */
  const claimGift = (isIncrement, beginIndex) => {
    let stage = 0;
    let menuClicked = false;
    let choosen = false;
    const sendJob = window.setInterval(function () {
      console.log('stage at: ' + stage);
      try {
        if (stage == 0) {
          if (!menuClicked) {
            // $('.free_gifts > a')[0].click();
            document.querySelector('.free_gifts > a').click();
            menuClicked = true;
            setTimeout(function () {
              if (
                document.getElementsByClassName(
                  'giftSelectorView-tabHeader active'
                )
              ) {
                stage = 1;
              }
            }, 5000);
          }
        } else if (stage == 1) {
          const acceptBtn = document.getElementsByClassName(
            'giftSelectorView-friendRow-action claim'
          );
          if (!choosen && acceptBtn) {
            let startIndex;
            if (isIncrement) {
              startIndex = beginIndex ? beginIndex : 0;
              for (let i = startIndex; i < acceptBtn.length; i++) {
                acceptBtn[i].click();
              }
            } else {
              startIndex = beginIndex ? beginIndex : acceptBtn.length - 1;
              for (let i = startIndex; i > -1; i--) {
                acceptBtn[i].click();
              }
            }
            if (
              document.getElementsByClassName(
                'giftSelectorView-friendRow-action claim selected'
              )[0]
            )
              choosen = true;
          }
          const claimGiftBtn = document.getElementsByClassName(
            'mousehuntActionButton giftSelectorView-action-confirm small'
          );
          if (
            claimGiftBtn &&
            claimGiftBtn[0] &&
            claimGiftBtn[0].innerHTML.indexOf('Claim') > -1
          ) {
            // mousehuntActionButton giftSelectorView-action-confirm small disabled
            claimGiftBtn[0].click();
            stage = 2;
          }
        } else if (stage == 2) {
          if (
            !document.getElementsByClassName(
              'mousehuntActionButton small giftSelectorView-confirmPopup-submitConfirmButton'
            ).offsetParent
          )
            stage = 3;
        } else if (stage == 3) {
          window.clearInterval(sendJob);
          // location.href = MOUSEHUNT_BASE_URL;
          // Done
          setTimeout(() => {
            document
              .getElementsByClassName(
                'mousehuntActionButton small giftSelectorView-confirmPopup-submitConfirmButton'
              )[0]
              .click();
            // X
            setTimeout(() => {
              document
                .querySelector('a.jsDialogClose, a#jsDialogClose')
                .click();
              setTimeout(() => {
                document.querySelector('#hgbar_messages').click();
                setTimeout(() => {
                  localStorage.setItem(lastClaimGiftDateKey, today);
                  location.href = MOUSEHUNT_BASE_URL;
                }, 2000);
              }, 1000);
            }, 2000);
          }, 1000);
        }
      } catch (e) {
        console.log(e);
        window.clearInterval(sendJob);
        location.href = MOUSEHUNT_BASE_URL;
        /* setTimeout(() => {
            $('#jsDialogClose').click();
            $('#hgbar_messages').click();
            setTimeout(() => {
              location.href = MOUSEHUNT_BASE_URL;
            }, 2000);
          }, 1000); */
      } finally {
        //
      }
    }, 1000);
  };
  $.get('https://elie2201.github.io/mh/dailySettings.html', (data) => {
    console.log(data);
    const d = JSON.parse(data);
    isIncrementClaiming = d.isIncrement;
    claimBeginIndex = d.beginIndex;
    console.log(`claimGift(${isIncrementClaiming}, ${claimBeginIndex});`);
    claimGift(isIncrementClaiming, claimBeginIndex);
  }).fail(() => {
    localStorage.displayedMessage += `failed getting dailySettings when claimGift`;
    claimGiftJob();
  });
}
/** Auto buy bait or charm by setting when low quantity */
function autoBuyItem() {
  logging('autoBuyItem_1.0.0.1.0');
  const autoBuyItems = {
    80: 'brie_cheese',
    98: 'gouda_cheese',
    351: 'power_trinket',
    400: 'luck_trinket',
    1424: 'brie_string_cheese',
    1553: 'rift_vacuum_trinket',
    2226: 'crescent_cheese',
    2906: 'gauntlet_string_cheese',
    3089: 'sky_cheese'
  };
  // const autoBuyItemIds = Object.keys(autoBuyItems);
  const rifts = [
    'rift_gnawnia',
    'rift_burroughs',
    'rift_whisker_woods',
    'rift_furoma',
    'rift_bristle_woods',
    'rift_valour'
  ];
  const noGouda = [
    'meadow',
    'town_of_gnawnia',
    'windmill',
    'harbour',
    'mountain',
    'kings_arms',
    'tournament_hall',
    'kings_gauntlet',
    'calm_clearing',
    'great_gnarled_tree',
    'lagoon',
    'laboratory',
    'mousoleum',
    'town_of_digby',
    'bazaar',
    'pollution_outbreak',
    'training_grounds',
    'dojo',
    'meditation_room',
    'pinnacle_chamber',
    'catacombs',
    'forbidden_grove',
    'acolyte_realm',
    'ss_huntington_ii'
  ].concat(rifts);
  const settings = {
    80: {
      includes: ['harbour'],
      excludeds: rifts,
      lowerLimit: 40,
      buyQuantity() {
        return Math.min(111, parseInt(user.gold / 200));
      }
    },
    98: {
      includes: ['cape_clawed'],
      excludeds: noGouda,
      lowerLimit: 40,
      buyQuantity() {
        return Math.min(111, parseInt(user.gold / 600));
      }
    },
    351: {
      includes: ['mountain', 'derr_dunes', 'elub_shore', 'nerg_plains'],
      excludeds: ['allOther'],
      lowerLimit: 40,
      buyQuantity() {
        return Math.min(111, parseInt(user.gold / 600));
      }
    },
    400: {
      includes: ['dojo', 'elub_shore', 'nerg_plains', 'mountain'],
      excludeds: ['allOther'],
      lowerLimit: 40,
      buyQuantity() {
        return Math.min(111, parseInt(user.gold / 600));
      }
    },
    1424: {
      includes: rifts,
      excludeds: ['allOther'],
      lowerLimit: 120,
      buyQuantity() {
        return Math.min(111, parseInt(user.gold / 1600));
      }
    },
    1553: {
      includes: rifts,
      excludeds: ['allOther'],
      lowerLimit: 40,
      buyQuantity() {
        return Math.min(111, parseInt(user.gold / 1000));
      }
    },
    2226: {
      includes: ['fort_rox'],
      excludeds: ['allOther'],
      lowerLimit: 10,
      buyQuantity() {
        return Math.min(
          30,
          parseInt(
            MyUtils.parseQuantity(
              user.quests.QuestFortRox.items.meteorite_piece_craft_item.quantity
            ) / 3
          )
        );
      }
    }
  };
  const baitItemId = getBaitItemId();
  const trinketItemId = getCharmItemId();
  if (!autoBuyItems[baitItemId] && !autoBuyItems[trinketItemId]) return;
  const environmentType = getEnvironmentType();
  const isEnvironmentOk = (item) => {
    return (
      item.includes.indexOf(environmentType) > -1 ||
      (item.excludeds.indexOf('allOther') < 0 &&
        item.excludeds.indexOf(environmentType) < 0)
    );
  };
  const checkBuyTrinket = () => {
    console.log('Check buy trinket');
    const nextAction = () => {
      console.log('Finish check buy trinket');
    };
    const item = settings[trinketItemId];
    if (!item) {
      console.log('Not auto buy this item:', trinketItemId);
      if (nextAction) nextAction();
      return;
    }
    if (!isEnvironmentOk(item)) {
      console.log(
        `Not auto buy ${autoBuyItems[trinketItemId]} in ${environmentType}`
      );
      if (nextAction) nextAction();
      return;
    }
    const charmQuantity = getCharmQuantity();
    if (
      charmQuantity < getRandomInteger(item.lowerLimit - 5, item.lowerLimit + 5)
    ) {
      const buyQuantity = item.buyQuantity();
      if (buyQuantity < 1) {
        console.log(`to buy less than 1 ${autoBuyItems[trinketItemId]}, skip`);
        if (nextAction) nextAction();
        return;
      }
      completeTransaction(
        true,
        autoBuyItems[trinketItemId],
        buyQuantity,
        false,
        () => {
          console.log('bought', buyQuantity, autoBuyItems[trinketItemId]);
          if (nextAction) nextAction();
        }
      );
      return;
    }
    if (nextAction) nextAction();
  };
  const checkBuyBait = () => {
    console.log('Check buy bait');
    const nextAction = () => {
      console.log('Finish check buy bait');
      checkBuyTrinket();
    };
    const item = settings[baitItemId];
    if (!item) {
      console.log('Not auto buy this item:', baitItemId);
      if (nextAction) nextAction();
      return;
    }
    if (!isEnvironmentOk(item)) {
      console.log(
        `Not auto buy ${autoBuyItems[baitItemId]} in ${environmentType}`
      );
      if (nextAction) nextAction();
      return;
    }
    const baitQuantity = getBaitQuantity();
    if (
      baitQuantity < getRandomInteger(item.lowerLimit - 5, item.lowerLimit + 5)
    ) {
      const buyQuantity = item.buyQuantity();
      if (buyQuantity < 1) {
        console.log(`to buy less than 1 ${autoBuyItems[baitItemId]}, skip`);
        if (nextAction) nextAction();
        return;
      }
      completeTransaction(
        true,
        autoBuyItems[baitItemId],
        buyQuantity,
        false,
        () => {
          console.log('bought', buyQuantity, autoBuyItems[baitItemId]);
          if (nextAction) nextAction();
        }
      );
      return;
    }
    if (nextAction) nextAction();
  };
  checkBuyBait();
}
// Utilities
// ================ General ==================
/** hooker to MyUtils.logging */
function logging(...any) {
  MyUtils.logging(...any);
}
/** hooker to MyUtils.toISODateString */
function toISODateString(date) {
  return MyUtils.toISODateString(date);
}
/** hooker to MyUtils.parseQuantity */
function parseQuantity(qty) {
  return MyUtils.parseQuantity(qty);
}
/** hooker to MyUtils.trimToEmpty */
function trimToEmpty(str) {
  return MyUtils.trimToEmpty(str);
}
/** hooker to MyUtils.trimToDefault */
function trimToDefault(str, deflt) {
  return MyUtils.trimToDefault(str, deflt);
}
/** hooker to MyUtils.getRandomInteger */
function getRandomInteger(min, max) {
  return MyUtils.getRandomInteger(min, max);
}
/** hooker to MyUtils.distinctArray */
function distinctArray(array) {
  return MyUtils.distinctArray(array);
}
// ================ Game API Related ==================
/**
 * Enable/disable eggstra fondue(double egg).
 * Only handle enable/disable eggstra fondue when:
 * During spring hunt.
 * Spring hunt is not shutdown.
 * To enable/disable is not the same with current status.
 * fondue_fuel_stat_item.quantity > 0
 * @param {Boolean} isToEnable
 * @returns
 */
function doubleEgg(isToEnable, successCallback) {
  const quest = user.quests.QuestSpringHunt;
  const isToTreat =
    quest && !quest.is_shutdown_enabled && isToEnable !== quest.is_fuel_enabled;
  console.plog(`Should I treat this double egg action? ${isToTreat}`);
  if (!isToTreat) return;
  const toggleFuel = (successCallback) => {
    const target = null;
    const params = {
      action: 'toggle_fuel'
    };
    const uri = 'managers/ajax/events/spring_hunt.php';
    ajax(target, params, uri, successCallback);
  };
  if (quest.items.fondue_fuel_stat_item.quantity > 0) {
    document
      .getElementsByClassName('springEggHuntCampHUD-fuelButton')[0]
      .click();
    window.setTimeout(() => {
      doubleEgg(isToEnable, successCallback);
    }, 5000);
  }
}
/**
 * nothing: do nothing
 * none: turn off
 * white: lit white
 * red: lit red
 */
const candleTypes = { nothing: '', none: 'none', white: 'white', red: 'red' };
/**
 * Change LNY candle status.
 * @param {String} candleStatus
 * @return
 */
function litCandle(candleStatus) {
  const quest = user.quests.QuestLunarNewYearLantern;
  if (!quest || quest.is_shutdown) {
    logging('Not during LNY!!');
    return;
  }
  logging('handle LNY candle lit!!');
  if (!candleStatus) candleStatus = candleTypes.none;
  const items = quest.items;
  switch (candleStatus) {
    case '':
      // As it is
      break;

    case 'none':
      if (items.lny_unlit_lantern_stat_item.status == 'active') {
        const div = $(
          '<div class="mousehuntItem-boundingBox" data-item-type="lny_unlit_lantern_stat_item"></div>'
        );
        hg.views.CampHudLunarNewYear.toggleLantern(div);
      } else if (items.lny_unlit_lantern_2018_stat_item.status == 'active') {
        const div = $(
          '<div class="mousehuntItem-boundingBox" data-item-type="lny_unlit_lantern_2018_stat_item"></div>'
        );
        hg.views.CampHudLunarNewYear.toggleLantern(div);
      }
      break;

    case 'white':
      if (items.lny_unlit_lantern_stat_item.status != 'active') {
        const div = $(
          '<div class="mousehuntItem-boundingBox" data-item-type="lny_unlit_lantern_stat_item"></div>'
        );
        hg.views.CampHudLunarNewYear.toggleLantern(div);
      }
      break;

    case 'red':
      if (items.lny_unlit_lantern_2018_stat_item.status != 'active') {
        const div = $(
          '<div class="mousehuntItem-boundingBox" data-item-type="lny_unlit_lantern_2018_stat_item"></div>'
        );
        hg.views.CampHudLunarNewYear.toggleLantern(div);
      }
      break;

    default:
      break;
  }
}
/**
 * Extract power type from
 * user.quests.QuestFloatingIslands.hunting_site_atts.island_type
 * @param {*} quest
 * @returns
 */
function floatingIslandsPowerType(quest) {
  const q = quest ? quest : user.quests.QuestFloatingIslands;
  if (!q) return;
  const atts = q.hunting_site_atts;
  const islandType = trimToEmpty(atts.island_type);
  const powerType = islandType.split('_')[0];
  return trimToEmpty(powerType);
}
/**
 * popup message with jsDialog object
 * @param {String} message
 */
function popupMessage(message) {
  const popup = new jsDialog();
  popup.setTemplate('error');
  popup.addToken('{*title*}', 'An error has occurred.');
  popup.addToken('{*content*}', message);
  popup.show();
}
/**
 * Check if data-mouse-type attribute of any catchsuccess journal
 * contains all given keywords.
 * @param {String} keywords
 * @return {Boolean}
 * true if any catchsuccess journal contains all keywords.
 */
function hasCaughtTargetByDataMouseType(...keywords) {
  const successEntries = getSuccessJournalEntry();
  for (let i = 0; i < successEntries.length; i++) {
    const successEntry = successEntries[i];
    let isMatched = true;
    const dataMouseType = successEntry.getAttribute('data-mouse-type');
    for (let j = 0; j < keywords.length; j++) {
      const target = keywords[j];
      isMatched &&= dataMouseType.indexOf(target) > -1;
    }
    if (isMatched) return isMatched;
  }
  return false;
}
/**
 * Check if any catchsuccess journal contains given keyword.
 * keyword can be part of/full mouse name, part of/full loot name
 * @param {String} keyword
 * @return {Boolean} true if any catchsuccess journal contains keyword.
 */
function hasCaughtTargetByMouseName(keyword) {
  const successEntries = getSuccessJournalEntry();
  for (let i = 0; i < successEntries.length; i++) {
    const successEntry = successEntries[i];
    const entryText = successEntry.textContent;
    // const entryText = successEntry.innerText
    // const entryText = successEntry.innerHTML
    const isMatched = entryText.indexOf(keyword) > -1;
    if (isMatched) return isMatched;
  }
  return false;
}
/**
 * Check if any catchsuccess journal text contains specified item name.
 * @param {String} itemName item name
 * @returns {Boolean} true if any catchsuccess journal contains itemName.
 */
function hasLootByItemName(itemName, isCheckLatestOnly) {
  /* const nodes = document.querySelectorAll(
    'div[data-entry-id] > div.journalbody > div.journaltext'
  ); */
  const latestEntryId = $('#journallatestentry').data('entry-id');
  const nodes = isCheckLatestOnly
    ? $(`div[data-entry-id=${latestEntryId}]`)
    : getSuccessJournalEntry();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const text = node.innerText;
    if (text && text.indexOf(itemName) > -1) {
      console.log(text);
      return true;
    }
  }
  return false;
}
/**
 * Get journal entries have class name with 'catchsuccess'. *
 * @return {Array<HTMLElement>} successEntries
 */
function getSuccessJournalEntry() {
  const successEntries = [];
  const mouseEntries = document
    .querySelector('div#journalContainer')
    .querySelectorAll('div[data-mouse-type]');
  // const mouseEntries = $('div[data-mouse-type]');
  for (let i = 0; i < mouseEntries.length; i++) {
    const mouseEntry = mouseEntries[i];
    if (mouseEntry.className.indexOf('catchsuccess') > -1) {
      successEntries.push(mouseEntry);
    }
  }
  return successEntries;
}
/** hooker to MhUtils.getSnUserId() */
function getSnUserId() {
  return MhUtils.getSnUserId();
}
/** hooker to MhUtils.getBaitName() */
function getBaitName() {
  return MhUtils.getBaitName();
}
/** hooker to MhUtils.getBaitItemId() */
function getBaitItemId() {
  return MhUtils.getBaitItemId();
}
/** hooker to MhUtils.getBaitQuantity() */
function getBaitQuantity() {
  return MhUtils.getBaitQuantity();
}
/** hooker to MhUtils.getCharmName() */
function getCharmName() {
  return MhUtils.getCharmName();
}
/** hooker to MhUtils.getCharmItemId() */
function getCharmItemId() {
  return MhUtils.getCharmItemId();
}
/** hooker to MhUtils.getCharmQuantity() */
function getCharmQuantity() {
  return MhUtils.getCharmQuantity();
}
/** hooker to MhUtils.closeAnyJsDialog() */
function closeAnyJsDialog() {
  MhUtils.closeAnyJsDialog();
}
// ================ Game API Related ==================
/** hooker to MhUtils.getQuantityByUrlThen */
function getQuantityByUrlThen(itemType, callback, isAlwaysCallback) {
  MhUtils.getQuantityByUrlThen(itemType, callback, isAlwaysCallback);
}
/** hooker to MhUtils.getMapByClass */
function getMapByClass(mapClass) {
  return MhUtils.getMapByClass(mapClass);
}
/** hooker to MhUtils.completeTransaction */
function completeTransaction(isBuy, itemType, itemQty, isKCItem, success) {
  MhUtils.completeTransaction(isBuy, itemType, itemQty, isKCItem, success);
}
/** hooker to MhUtils.completeTransactionPromise */
function completeTransactionPromise(isBuy, itemType, itemQty, isKCItem) {
  MhUtils.completeTransactionPromise(isBuy, itemType, itemQty, isKCItem);
}
/**
 * Reduced and enhanced ajax.
 * Make sure first that target uri using general format params.
 * @param {DOM} element
 * @param {Object} params
 * @param {String} uri like
 *
 *   'managers/ajax/events/spring_hunt.php'
 *
 *   'managers/ajax/purchases/itempurchase.php'
 * @param {Function} successCallback
 */
function ajax(element, params, uri, successCallback) {
  params['last_read_journal_entry_id'] = document
    .querySelector('#journallatestentry')
    .getAttribute('data-entry-id');
  params['uh'] = user.unique_hash;
  $.ajax({
    data: params,
    dataType: 'json',
    type: 'post',
    url: MOUSEHUNT_BASE_URL + uri,
    success: function (data) {
      eventRegistry.doEvent('ajax_response', data);
      if (successCallback) {
        successCallback(data);
      }
    },
    error: function () {
      const message = `ajax to ${uri} error`;
      popupMessage(message);
      localStorage.setItem(storingMessageKey, message);
      console.plog(data);
    }
  });
}
// End Utilities
/**
 * Inject CnN Functions.
 * Will be toString and then append to game page.
 */
function bodyJS() {
  // prettier-ignore
  const LOCATION_TIMERS = [
    [
      'Seasonal Garden',
      {
        first: 1283616000,
        length: 288000,
        breakdown: [1, 1, 1, 1],
        name: ['Summer', 'Fall', 'Winter', 'Spring'],
        color: ['Red', 'Orange', 'Blue', 'Green'],
        effective: ['tactical', 'shadow', 'hydro', 'physical']
      }
    ],
    [
      "Balack\'s Cove",
      {
        first: 1294680060,
        length: 1200,
        breakdown: [48, 3, 2, 3],
        name: ['Low', 'Medium (in)', 'High', 'Medium (out)'],
        color: ['Green', 'Orange', 'Red', 'Orange']
      }
    ],
    [
      'Forbidden Grove',
      {
        first: 1285704000,
        length: 14400,
        breakdown: [4, 1],
        name: ['Open', 'Closed'],
        color: ['Green', 'Red']
      }
    ],
    [
      'Toxic Spill',
      {
        first: 1503597600,
        length: 3600,
        breakdown: [
          15, 16, 18, 18, 24, 24, 24, 12, 12, 24, 24, 24, 18, 18, 16, 15
        ],
        name: [
          'Hero',
          'Knight',
          'Lord',
          'Baron',
          'Count',
          'Duke',
          'Grand Duke',
          'Archduke',
          'Archduke',
          'Grand Duke',
          'Duke',
          'Count',
          'Baron',
          'Lord',
          'Knight',
          'Hero'
        ],
        color: [
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green',
          'Green'
        ],
        effective: [
          'Rising',
          'Rising',
          'Rising',
          'Rising',
          'Rising',
          'Rising',
          'Rising',
          'Rising',
          'Falling',
          'Falling',
          'Falling',
          'Falling',
          'Falling',
          'Falling',
          'Falling',
          'Falling'
        ]
      }
    ],
    [
      'Relic Hunter',
      {
        url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt'
      }
    ]
  ];

  /**
   * Calculate timers like Forbidden Grove etc.
   *
   * @param {String} runOnly
   * @return {*}
   */
  function nobCalculateOfflineTimers(runOnly) {
    // logging('nobCalculateOfflineTimers(' + runOnly + ')');
    if (runOnly != 'seasonal' && runOnly != 'balack' && runOnly != 'fg')
      runOnly = 'all';

    let CurrentTime = currentTimeStamp();
    let CurrentName = -1;
    let CurrentBreakdown = 0;
    let TotalBreakdown = 0;
    let iCount2;

    if (runOnly == 'seasonal') {
      for (
        iCount2 = 0;
        iCount2 < LOCATION_TIMERS[0][1].breakdown.length;
        iCount2++
      )
        TotalBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

      const CurrentValue =
        Math.floor(
          (CurrentTime - LOCATION_TIMERS[0][1].first) /
            LOCATION_TIMERS[0][1].length
        ) % TotalBreakdown;

      for (
        iCount2 = 0;
        iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentName == -1;
        iCount2++
      ) {
        CurrentBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

        if (CurrentValue < CurrentBreakdown) {
          CurrentName = iCount2;
        }
      }

      /* const SeasonLength =
        LOCATION_TIMERS[0][1].length *
        LOCATION_TIMERS[0][1].breakdown[CurrentName]; */
      let CurrentTimer = CurrentTime - LOCATION_TIMERS[0][1].first;
      // let SeasonRemaining = 0;

      while (CurrentTimer > 0) {
        for (
          iCount2 = 0;
          iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentTimer > 0;
          iCount2++
        ) {
          // SeasonRemaining = CurrentTimer;
          CurrentTimer -=
            LOCATION_TIMERS[0][1].length *
            LOCATION_TIMERS[0][1].breakdown[iCount2];
        }
      }

      // SeasonRemaining = SeasonLength - SeasonRemaining;

      return LOCATION_TIMERS[0][1].name[CurrentName];
    } else if (runOnly == 'all') {
      for (let i = 0; i < 4; i++) {
        // Reset var
        CurrentTime = currentTimeStamp();
        CurrentName = -1;
        CurrentBreakdown = 0;
        TotalBreakdown = 0;

        for (
          iCount2 = 0;
          iCount2 < LOCATION_TIMERS[i][1].breakdown.length;
          iCount2++
        )
          TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

        const CurrentValue =
          Math.floor(
            (CurrentTime - LOCATION_TIMERS[i][1].first) /
              LOCATION_TIMERS[i][1].length
          ) % TotalBreakdown;

        for (
          iCount2 = 0;
          iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1;
          iCount2++
        ) {
          CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

          if (CurrentValue < CurrentBreakdown) {
            CurrentName = iCount2;
          }
        }

        const SeasonLength =
          LOCATION_TIMERS[i][1].length *
          LOCATION_TIMERS[i][1].breakdown[CurrentName];
        let CurrentTimer = CurrentTime - LOCATION_TIMERS[i][1].first;
        let SeasonRemaining = 0;

        while (CurrentTimer > 0) {
          for (
            iCount2 = 0;
            iCount2 < LOCATION_TIMERS[i][1].breakdown.length &&
            CurrentTimer > 0;
            iCount2++
          ) {
            SeasonRemaining = CurrentTimer;
            CurrentTimer -=
              LOCATION_TIMERS[i][1].length *
              LOCATION_TIMERS[i][1].breakdown[iCount2];
          }
        }

        SeasonRemaining = SeasonLength - SeasonRemaining;

        const seasonalDiv = document.getElementById(
          'NOB' + LOCATION_TIMERS[i][0]
        );
        let content = '';
        // prettier-ignore
        content +=
          LOCATION_TIMERS[i][0] +
          ': <font color=\"' +
          LOCATION_TIMERS[i][1].color[CurrentName] +
          '\">' +
          LOCATION_TIMERS[i][1].name[CurrentName] +
          '</font>';
        if (LOCATION_TIMERS[i][1].effective != null) {
          content += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
        }

        content += ' &#126; For ' + updateTimer(SeasonRemaining, true);
        seasonalDiv.innerHTML = content;
      }
      return;
    }
  }

  /**
   * Get Date.now() in seconds.
   *
   * @return {BigInt} Date.now() in seconds
   */
  function currentTimeStamp() {
    return parseInt(new Date().getTime() / 1000, 10);
  }

  /**
   * Transform seconds to hh:mm
   *
   * @param {*} timeleft
   * @param {*} inhours
   * @return {*}
   */
  function updateTimer(timeleft, inhours) {
    // logging('updateTimer(' + timeleft + ')');
    let ReturnValue = '';

    let FirstPart;
    let SecondPart;
    let Size;

    if (timeleft > 0) {
      if (inhours != null && inhours == true && timeleft > 3600) {
        FirstPart = Math.floor(timeleft / (60 * 60));
        SecondPart = Math.floor(timeleft / 60) % 60;
        Size = 'hrs';
      } else {
        FirstPart = Math.floor(timeleft / 60);
        SecondPart = timeleft % 60;
        Size = 'mins';
      }

      if (SecondPart < 10) {
        SecondPart = '0' + SecondPart;
      }

      ReturnValue = FirstPart + ':' + SecondPart + ' ' + Size;
    } else {
      ReturnValue = 'Soon...';
    }

    return ReturnValue;
  }

  /**
   * Save preference to localStorage
   */
  function savePreference() {
    try {
      window.localStorage.setItem(
        'AggressiveMode',
        document.getElementById('AggressiveModeInput').value
      );
      window.localStorage.setItem(
        'HornTimeDelayMin',
        document.getElementById('HornTimeDelayMinInput').value
      );
      window.localStorage.setItem(
        'HornTimeDelayMax',
        document.getElementById('HornTimeDelayMaxInput').value
      );
      window.localStorage.setItem(
        'TrapCheck',
        document.getElementById('TrapCheckInput').value
      );
      window.localStorage.setItem(
        'TrapCheckTimeDelayMin',
        document.getElementById('TrapCheckTimeDelayMinInput').value
      );
      window.localStorage.setItem(
        'TrapCheckTimeDelayMax',
        document.getElementById('TrapCheckTimeDelayMaxInput').value
      );
      window.localStorage.setItem(
        'AutoSolveKR',
        document.getElementById('AutoSolveKRInput').value
      );
      window.localStorage.setItem(
        'AutoSolveKRDelayMin',
        document.getElementById('AutoSolveKRDelayMinInput').value
      );
      window.localStorage.setItem(
        'AutoSolveKRDelayMax',
        document.getElementById('AutoSolveKRDelayMaxInput').value
      );
      window.localStorage.setItem(
        'PauseLocation',
        document.getElementById('PauseLocationInput').value
      );
      window.localStorage.setItem(
        'autoPopupKR',
        document.getElementById('selectAutoPopupKR').value
      );
      window.localStorage.setItem(
        'timerRefreshInterval',
        document.getElementById('selectTimerRefreshInterval').value
      );
      // default bait
      if (document.getElementById('selectDefaultBait').value != '') {
        window.localStorage.setItem(
          'defaultBait',
          document.getElementById('selectDefaultBait').value
        );
      } else {
        window.localStorage.setItem(
          'defaultBait',
          document.getElementById('inputDefaultBait').value.trim()
        );
      }
      // rest time
      try {
        const restAt = document.getElementsByName('restAt');
        const restFor = document.getElementsByName('restFor');
        let reg = /^-?\d+\.?\d*$/;
        let isAllNumber = true;
        if (!restAt || restAt.length < 1) isAllNumber = false;
        for (let i = 0; i < restAt.length; i++) {
          isAllNumber =
            isAllNumber &&
            reg.test(restAt[i].value) &&
            reg.test(restFor[i].value);
        }
        if (isAllNumber) {
          console.log('All are numbers!!');
          let toBeStored = [];
          let tempArr = null;
          for (let i = 0; i < restAt.length; i++) {
            tempArr = new Array(2);
            tempArr[0] = parseFloat(restAt[i].value);
            tempArr[1] = parseFloat(restFor[i].value);
            toBeStored.push(tempArr);
          }
          window.localStorage.setItem(
            'restTimes',
            JSON.stringify(toBeStored.sort((a, b) => b[0] - a[0]))
          );
        } else {
          window.localStorage.setItem('restTimes', JSON.stringify(null));
        }
      } catch (e) {
        console.log(e);
      }
      // sleep in location
      window.localStorage.setItem(
        'sleepIn',
        document.getElementById('selectSleepIn').value
      );
      // work in location
      window.localStorage.setItem(
        'workIn',
        document.getElementById('selectWorkIn').value
      );
      // isEnableScheduledJobs
      window.localStorage.setItem(
        'isEnableScheduledJobs',
        document.getElementById('selectEnableScheduledJobs').value
      );
      // minLgsSeconds
      window.localStorage.setItem(
        'minLgsSeconds',
        document.getElementById('inputMinLgsSeconds').value
      );
      // onload anchor
      window.localStorage.setItem(
        'onloadAnchor',
        JSON.stringify([
          document.getElementById('onloadAnchorSelect').value,
          document.getElementById('onloadAnchorInput').value.trim(),
          document.getElementById('onloadAnchorInputOr').value.trim()
        ])
      );
      // anchor points
      const input1 = document.getElementsByName('whatAttributeLabel');
      const select = document.getElementsByName('whatAttribute');
      const input2 = document.getElementsByName('whatAttributeValue');
      const input3 = document.getElementsByName('whatAttributeValueOr');
      // whatAttributeLabel and whatAttributeValue are required
      /*不用檢查,空的就不 generate button
      let isOk = true;
      if (!input1 || input1.length < 1) isOk = false;
      for (let i = 0; i < input1.length; i++) {
        isOk = isOk && input1[i].value && input2[i].value;
      }
      if (isOk) {
        console.log('All necessary field inputed!!');*/
      try {
        let toBeStored = [];
        let tempArr = null;
        for (let i = 0; i < input1.length; i++) {
          tempArr = new Array(4);
          tempArr[0] = input1[i].value.trim();
          tempArr[1] = select[i].value;
          tempArr[2] = input2[i].value.trim();
          tempArr[3] = input3[i].value.trim();
          toBeStored.push(tempArr);
        }
        console.log(toBeStored);
        window.localStorage.setItem('anchorPoints', JSON.stringify(toBeStored));
      } catch (e) {
        console.log(e);
      }
      /*} else {
        window.localStorage.setItem('anchorPoints', JSON.stringify(null));
      }*/
      window.localStorage.setItem(
        'addonCode',
        document.getElementById('addonCode').value
      );
      setSessionToLocal();
    } catch (e) {
      console.log(e);
    }
  }
  let objDefaultFGAR = {
    order: ['FG', 'AR'],
    weapon: new Array(2).fill(''),
    base: new Array(2).fill(''),
    trinket: new Array(2).fill(''),
    bait: new Array(2).fill('')
  };
  let objDefaultBCJOD = {
    order: ['JOD', 'LOW', 'MID', 'HIGH'],
    weapon: new Array(4).fill(''),
    base: new Array(4).fill(''),
    trinket: new Array(4).fill(''),
    bait: new Array(4).fill('')
  };
  const objDefaultBWRift = {
    order: [
      'NONE',
      'GEARWORKS',
      'ANCIENT',
      'RUNIC',
      'TIMEWARP',
      'GUARD',
      'SECURITY',
      'FROZEN',
      'FURNACE',
      'INGRESS',
      'PURSUER',
      'ACOLYTE_CHARGING',
      'ACOLYTE_DRAINING',
      'ACOLYTE_DRAINED',
      'LUCKY',
      'HIDDEN'
    ],
    master: {
      weapon: new Array(32).fill('best.weapon.rift'),
      base: new Array(32).fill('best.base.rift'),
      trinket: new Array(32).fill('Rift Vacuum Charm,Rift Super Vacuum Charm'),
      bait: new Array(32).fill('Brie String'),
      activate: new Array(32).fill(false)
    },
    specialActivate: {
      forceActivate: new Array(32).fill(false),
      remainingLootActivate: new Array(32).fill(1),
      forceDeactivate: new Array(32).fill(false),
      remainingLootDeactivate: new Array(32).fill(1)
    },
    gw: {
      weapon: new Array(4).fill('MASTER'),
      base: new Array(4).fill('MASTER'),
      trinket: new Array(4).fill('MASTER'),
      bait: new Array(4).fill('MASTER'),
      activate: new Array(4).fill('MASTER')
    },
    al: {
      weapon: new Array(4).fill('MASTER'),
      base: new Array(4).fill('MASTER'),
      trinket: new Array(4).fill('MASTER'),
      bait: new Array(4).fill('MASTER'),
      activate: new Array(4).fill('MASTER')
    },
    rl: {
      weapon: new Array(4).fill('MASTER'),
      base: new Array(4).fill('MASTER'),
      trinket: new Array(4).fill('MASTER'),
      bait: new Array(4).fill('MASTER'),
      activate: new Array(4).fill('MASTER')
    },
    gb: {
      weapon: new Array(14).fill('MASTER'),
      base: new Array(14).fill('MASTER'),
      trinket: new Array(14).fill('MASTER'),
      bait: new Array(14).fill('MASTER'),
      activate: new Array(14).fill('MASTER')
    },
    ic: {
      weapon: new Array(8).fill('MASTER'),
      base: new Array(8).fill('MASTER'),
      trinket: new Array(8).fill('MASTER'),
      bait: new Array(8).fill('MASTER'),
      activate: new Array(8).fill('MASTER')
    },
    fa: {
      weapon: new Array(32).fill('MASTER'),
      base: new Array(32).fill('MASTER'),
      trinket: new Array(32).fill('MASTER'),
      bait: new Array(32).fill('MASTER'),
      activate: new Array(32).fill('MASTER')
    },
    choosePortal: false,
    choosePortalAfterCC: false,
    priorities: [
      'SECURITY',
      'FURNACE',
      'PURSUER',
      'ACOLYTE',
      'LUCKY',
      'HIDDEN',
      'TIMEWARP',
      'RUNIC',
      'ANCIENT',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS'
    ],
    prioritiesCursed: [
      'SECURITY',
      'FURNACE',
      'PURSUER',
      'ANCIENT',
      'GEARWORKS',
      'RUNIC',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS',
      'GEARWORKS'
    ],
    minTimeSand: [70, 70, 50, 50, 50, 50, 40, 40, 999],
    minRSCType: 'NUMBER',
    minRSC: 0,
    enterMinigameWCurse: false
  };

  /**
   * Parse the 3 arguments as Int.
   * Return value if between min and max.
   * Return min if value less then min.
   * Return max if value greater then max.
   * @param {*} value
   * @param {*} min
   * @param {*} max
   * @return {Number} value
   */
  function limitMinMax(value, min, max) {
    value = parseInt(value);
    min = parseInt(min);
    max = parseInt(max);
    if (value < min) value = min;
    else if (value > max) value = max;
    return value;
  }

  /**
   * Return true if obj === null or obj === undefined
   * or obj === string of null
   * or obj === string of undefined
   * or obj is array and length === 0.
   * @param {*} obj
   * @return {Boolean} true if as description
   */
  function isNullOrUndefined(obj) {
    return (
      obj === null ||
      obj === undefined ||
      obj === 'null' ||
      obj === 'undefined' ||
      (Array.isArray(obj) && obj.length === 0)
    );
  }

  function onIdRestoreClicked() {
    let idRestore = document.getElementById('idRestore');
    let inputFiles = document.getElementById('inputFiles');
    if (window.FileReader) {
      if (inputFiles && window.sessionStorage.getItem('bRestart') != 'true') {
        inputFiles.click();
      }
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  }

  function handleFiles(files) {
    if (files.length < 1) return;
    let reader = new FileReader();
    reader.onloadend = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        // DONE == 2
        let arr = evt.target.result.split('\r\n');
        let arrSplit = [];
        let bRestart = false;
        let nIndex = -1;
        let temp = '';
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].indexOf('|') > -1) {
            arrSplit = arr[i].split('|');
            if (arrSplit.length == 2) {
              nIndex = arrSplit[0].indexOf('Z');
              temp =
                nIndex > -1 ? arrSplit[0].substr(0, nIndex + 1) : arrSplit[0];
              if (Number.isNaN(Date.parse(temp))) {
                console.log(arrSplit);
                window.localStorage.setItem(arrSplit[0], arrSplit[1]);
                window.sessionStorage.setItem(arrSplit[0], arrSplit[1]);
                bRestart = true;
              }
            }
          }
        }
        if (bRestart) {
          alert('Please restart browser to take effect!');
          window.sessionStorage.setItem('bRestart', 'true');
          document.getElementById('idRestore').firstChild.textContent =
            'Restart browser is required!';
          document.getElementById('idRestore').style = 'color:red';
        } else {
          alert('Invalid preference file!');
        }
      }
    };
    let blob = files[0].slice(0, files[0].size);
    reader.readAsText(blob);
  }

  function onIdGetLogPreferenceClicked() {
    let i;
    let str = '';
    let strKeyName = '';
    let arrTimestamp = [];
    let arrValue = [];
    for (i = 0; i < window.localStorage.length; i++) {
      strKeyName = window.localStorage.key(i);
      if (strKeyName.indexOf('KR') === 0) continue;
      str += strKeyName + '|' + window.localStorage.getItem(strKeyName);
      str += '\r\n';
    }
    for (i = 0; i < window.sessionStorage.length; i++) {
      strKeyName = window.sessionStorage.key(i);
      if (strKeyName.indexOf('Log_') > -1) {
        arrTimestamp.push(parseFloat(strKeyName.split('_')[1]));
        arrValue.push(window.sessionStorage.getItem(strKeyName));
      }
    }
    arrTimestamp = arrTimestamp.sort();
    let nTimezoneOffset = -new Date().getTimezoneOffset() * 60000;
    for (i = 0; i < arrTimestamp.length; i++) {
      if (Number.isNaN(arrTimestamp[i])) strKeyName = arrTimestamp[i];
      else {
        arrTimestamp[i] += nTimezoneOffset;
        strKeyName = new Date(arrTimestamp[i]).toISOString();
        strKeyName += '.' + arrTimestamp[i].toFixed(3).split('.')[1];
      }
      str += strKeyName + '|' + arrValue[i];
      str += '\r\n';
    }
    saveFile(str, 'log_preference.txt');
  }

  function saveFile(content, filename) {
    let pom = document.createElement('a');
    pom.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  /*function onSelectSpecialFeature() {
        saveSpecialFeature();
    }

    function saveSpecialFeature() {
        let selectSpecialFeature = document.getElementById('selectSpecialFeature');
        window.sessionStorage.setItem('SpecialFeature', selectSpecialFeature.value);
    }

    function initControlsSpecialFeature() {
        let selectSpecialFeature = document.getElementById('selectSpecialFeature');
        let storageValue = window.sessionStorage.getItem('SpecialFeature');
        if (storageValue === null || storageValue === undefined) {
            storageValue = 'None';
        }
        selectSpecialFeature.value = storageValue;
    }*/

  function onSelectMapHuntingChanged() {
    saveMapHunting();
    initControlsMapHunting();
  }

  function saveMapHunting() {
    let selectMapHunting = document.getElementById('selectMapHunting');
    let selectMouseList = document.getElementById('selectMouseList');
    let selectWeapon = document.getElementById('selectWeapon');
    let selectBase = document.getElementById('selectBase');
    let selectTrinket = document.getElementById('selectTrinket');
    let selectBait = document.getElementById('selectBait');
    let selectLeaveMap = document.getElementById('selectLeaveMap');
    let inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
    let selectCatchLogic = document.getElementById('selectCatchLogic');
    let objDefaultMapHunting = {
      status: false,
      selectedMouse: [],
      logic: 'OR',
      weapon: 'Remain',
      base: 'Remain',
      trinket: 'Remain',
      bait: 'Remain',
      leave: false
    };
    let storageValue = JSON.parse(window.sessionStorage.getItem('MapHunting'));
    if (isNullOrUndefined(storageValue)) storageValue = objDefaultMapHunting;
    storageValue.status = selectMapHunting.value == 'true';
    if (inputUncaughtMouse.value === '') storageValue.selectedMouse = [];
    else storageValue.selectedMouse = inputUncaughtMouse.value.split(',');
    storageValue.logic = selectCatchLogic.value;
    storageValue.weapon = selectWeapon.value;
    storageValue.base = selectBase.value;
    storageValue.trinket = selectTrinket.value;
    storageValue.bait = selectBait.value;
    storageValue.leave = selectLeaveMap.value == 'true';
    window.sessionStorage.setItem('MapHunting', JSON.stringify(storageValue));
  }

  function initControlsMapHunting() {
    let trUncaughtMouse = document.getElementById('trUncaughtMouse');
    let trSelectedUncaughtMouse = document.getElementById(
      'trSelectedUncaughtMouse'
    );
    let trCatchLogic = document.getElementById('trCatchLogic');
    let selectMapHunting = document.getElementById('selectMapHunting');
    let selectMouseList = document.getElementById('selectMouseList');
    let trMapHuntingTrapSetup = document.getElementById(
      'trMapHuntingTrapSetup'
    );
    let trMapHuntingLeave = document.getElementById('trMapHuntingLeave');
    let inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
    let selectCatchLogic = document.getElementById('selectCatchLogic');
    let selectWeapon = document.getElementById('selectWeapon');
    let selectBase = document.getElementById('selectBase');
    let selectTrinket = document.getElementById('selectTrinket');
    let selectBait = document.getElementById('selectBait');
    let selectLeaveMap = document.getElementById('selectLeaveMap');
    let storageValue = window.sessionStorage.getItem('MapHunting');
    if (isNullOrUndefined(storageValue)) {
      selectMapHunting.selectedIndex = 0;
      trUncaughtMouse.style.display = 'none';
      trMapHuntingTrapSetup.style.display = 'none';
      trMapHuntingLeave.style.display = 'none';
      inputUncaughtMouse.value = '';
      selectCatchLogic.selectedIndex = -1;
      selectWeapon.selectedIndex = -1;
      selectBase.selectedIndex = -1;
      selectTrinket.selectedIndex = -1;
      selectBait.selectedIndex = -1;
      selectLeaveMap.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      selectMapHunting.value = storageValue.status;
      trUncaughtMouse.style.display = storageValue.status
        ? 'table-row'
        : 'none';
      trSelectedUncaughtMouse.style.display = storageValue.status
        ? 'table-row'
        : 'none';
      trCatchLogic.style.display = storageValue.status ? 'table-row' : 'none';
      trMapHuntingTrapSetup.style.display = storageValue.status
        ? 'table-row'
        : 'none';
      trMapHuntingLeave.style.display = storageValue.status
        ? 'table-row'
        : 'none';
      inputUncaughtMouse.value = storageValue.selectedMouse.join(',');
      selectCatchLogic.value = storageValue.logic;
      selectWeapon.value = storageValue.weapon;
      selectBase.value = storageValue.base;
      selectTrinket.value = storageValue.trinket;
      selectBait.value = storageValue.bait;
      selectLeaveMap.value = storageValue.leave;
    }
    storageValue = window.localStorage.getItem('Last Record Uncaught');
    if (!isNullOrUndefined(storageValue)) {
      storageValue = storageValue.split(',');
      let i;
      for (i = selectMouseList.options.length - 1; i >= 0; i--) {
        selectMouseList.remove(i);
      }
      let optionEle;
      for (i = 0; i < storageValue.length; i++) {
        optionEle = document.createElement('option');
        optionEle.setAttribute('value', storageValue[i]);
        optionEle.textContent = storageValue[i];
        selectMouseList.appendChild(optionEle);
      }
    }
    document.getElementById('inputSelectMouse').disabled =
      selectMouseList.options.length > 0 ? '' : 'disabled';
  }

  function onInputSelectMouse() {
    let inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
    let selectMouseList = document.getElementById('selectMouseList');
    if (inputUncaughtMouse.value.indexOf(selectMouseList.value) < 0) {
      if (inputUncaughtMouse.value.length !== 0)
        inputUncaughtMouse.value =
          selectMouseList.value + ',' + inputUncaughtMouse.value;
      else inputUncaughtMouse.value = selectMouseList.value;
    }
    saveMapHunting();
  }

  function onInputGetMouse() {
    let classTreasureMap = document.getElementsByClassName(
      'mousehuntHud-userStat treasureMap'
    )[0];
    if (
      classTreasureMap.children[2].textContent
        .toLowerCase()
        .indexOf('remaining') < 0
    )
      return;

    document.getElementById('inputGetMouse').value = 'Processing...';
    document.getElementById('inputGetMouse').disabled = 'disabled';
    try {
      let objData = {
        sn: 'Hitgrab',
        hg_is_ajax: 1,
        action: 'info',
        uh: user.unique_hash
      };

      jQuery.ajax({
        type: 'POST',
        url: '/managers/ajax/users/relichunter.php',
        data: objData,
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        xhrFields: {
          withCredentials: false
        },
        success: function (data) {
          document.getElementById('inputGetMouse').value =
            'Refresh Uncaught Mouse List';
          document.getElementById('inputGetMouse').disabled = '';
          console.log(data.treasure_map);
          if (
            data.treasure_map.groups !== null &&
            data.treasure_map.groups !== undefined
          ) {
            let arrUncaught = [];
            for (let i = 0; i < data.treasure_map.groups.length; i++) {
              if (data.treasure_map.groups[i].is_uncaught === true) {
                for (
                  let j = 0;
                  j < data.treasure_map.groups[i].mice.length;
                  j++
                ) {
                  arrUncaught.push(data.treasure_map.groups[i].mice[j].name);
                }
              }
            }
            window.localStorage.setItem(
              'Last Record Uncaught',
              arrUncaught.join(',')
            );
            initControlsMapHunting();
          }
        },
        error: function (error) {
          document.getElementById('inputGetMouse').value =
            'Refresh Uncaught Mouse List';
          document.getElementById('inputGetMouse').disabled = '';
          console.error('onInputGetMouse ajax:', error);
        }
      });
    } catch (e) {
      document.getElementById('inputGetMouse').value =
        'Refresh Uncaught Mouse List';
      document.getElementById('inputGetMouse').disabled = '';
      console.error('onInputGetMouse', e.message);
    }
  }

  function onInputClearUncaughtMouse() {
    document.getElementById('inputUncaughtMouse').value = '';
    saveMapHunting();
  }

  let arrKey = [
    'SCCustom',
    'Labyrinth',
    'LGArea',
    'eventLocation',
    'FW',
    'BRCustom',
    'SGarden',
    'Zokor',
    'FRift',
    'MapHunting',
    'ZTower',
    'BestTrap',
    'Iceberg',
    'WWRift',
    'GES',
    'FRox',
    'GWH2016R',
    'SpecialFeature',
    'BWRift',
    'BC_JOD',
    'FG_AR'
  ];

  /**
   * Copy localStorage data to sessionStorage.
   * Unused but maybe should be used.
   */
  function setLocalToSession() {
    let i, j, key;
    for (i = 0; i < window.localStorage.length; i++) {
      key = window.localStorage.key(i);
      for (j = 0; j < arrKey.length; j++) {
        if (key.indexOf(arrKey[j]) > -1) {
          window.sessionStorage.setItem(key, window.localStorage.getItem(key));
          break;
        }
      }
    }
  }

  /**
   * Copy sessionStorage data to LocalStorage.
   * Invoked by savePreference
   */
  function setSessionToLocal() {
    if (window.sessionStorage.length === 0) return;

    let i, j, key;
    for (i = 0; i < window.sessionStorage.length; i++) {
      key = window.sessionStorage.key(i);
      for (j = 0; j < arrKey.length; j++) {
        if (key.indexOf(arrKey[j]) > -1) {
          window.localStorage.setItem(key, window.sessionStorage.getItem(key));
          break;
        }
      }
    }
  }

  function initEventAlgo() {
    /* let algorithm = window.localStorage.getItem('eventLocation');
    let eventAlgoSelect = document.getElementById('eventAlgo');
    let eventAlgoSelectOpt = eventAlgoSelect.options;
    for (let opt, j = 0; (opt = eventAlgoSelectOpt[j]); j++) {
      if (opt.value == algorithm) {
        eventAlgoSelect.selectedIndex = j;
        showOrHideTr(algorithm);
        return;
      }
    }

    console.log('Algo not found: ' + algorithm); */
    let algoOnLocal = window.localStorage.getItem('eventLocation');
    let algoOnSession = window.sessionStorage.getItem('eventLocation');
    try {
      if (algoOnSession === undefined || algoOnSession === null)
        algoOnSession = algoOnLocal;
    } catch (e) {
      algoOnSession = algoOnLocal;
    }

    if (algoOnSession != algoOnLocal) {
      console.log(
        'initEventAlgo() WARNING: Session algo is different from local storage.' +
          algoOnSession +
          ' | ' +
          algoOnLocal
      );
    }

    let eventAlgoSelect = document.getElementById('eventAlgo');
    let eventAlgoSelectOpt = eventAlgoSelect.options;
    for (let opt, j = 0; (opt = eventAlgoSelectOpt[j]); j++) {
      if (opt.value == algoOnSession) {
        eventAlgoSelect.selectedIndex = j;
        showOrHideTr(algoOnSession);
        return;
      }
    }

    console.log('Algo not found: ' + algoOnSession);
  }

  function onInputResetReload() {
    let strValue = document.getElementById('eventAlgo').value;
    let keyName;
    if (strValue == 'Burroughs Rift Custom') keyName = 'BRCustom';
    else if (strValue == 'Burroughs Rift Auto') keyName = 'BRCustom';
    else if (strValue == 'All LG Area') keyName = 'LGArea';
    else if (strValue == 'SG') keyName = 'SGarden';
    else if (strValue == 'ZT') keyName = 'ZTower';
    else if (strValue == 'Sunken City Custom') keyName = 'SCCustom';
    else if (strValue == 'Labyrinth') keyName = 'Labyrinth';
    else if (strValue == 'Zokor') keyName = 'Zokor';
    else if (strValue == 'Fiery Warpath') keyName = 'FW';
    else if (strValue == 'Furoma Rift') keyName = 'FRift';
    else if (strValue == 'Iceberg') keyName = 'Iceberg';
    else if (strValue == 'WWRift') keyName = 'WWRift';
    else if (strValue == 'GES') keyName = 'GES';
    else if (strValue == 'Fort Rox') keyName = 'FRox';
    else if (strValue == 'GWH2016R') keyName = 'GWH2016R';
    else if (strValue == 'Bristle Woods Rift') keyName = 'BWRift';
    else if (strValue == 'BC/JOD') keyName = 'BC_JOD';
    else if (strValue == 'FG/AR') keyName = 'FG_AR';
    else if (strValue == 'Test') keyName = 'Test';

    if (!isNullOrUndefined(keyName)) {
      window.sessionStorage.removeItem(keyName);
      window.localStorage.removeItem(keyName);
    }
  }

  function initControlsBestTrap() {
    let selectBestTrapPowerType = document.getElementById(
      'selectBestTrapPowerType'
    );
    let selectBestTrapWeapon = document.getElementById('selectBestTrapWeapon');
    let selectBestTrapBaseType = document.getElementById(
      'selectBestTrapBaseType'
    );
    let selectBestTrapBase = document.getElementById('selectBestTrapBase');
    let storageValue = window.localStorage.getItem('BestTrap');
    if (isNullOrUndefined(storageValue)) {
      selectBestTrapWeapon.selectedIndex = -1;
      selectBestTrapBase.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      selectBestTrapWeapon.value =
        storageValue.weapon[selectBestTrapPowerType.value];
      selectBestTrapBase.value =
        storageValue.base[selectBestTrapBaseType.value];
    }
  }

  function saveBestTrap() {
    let selectBestTrapPowerType = document.getElementById(
      'selectBestTrapPowerType'
    );
    let selectBestTrapWeapon = document.getElementById('selectBestTrapWeapon');
    let selectBestTrapBaseType = document.getElementById(
      'selectBestTrapBaseType'
    );
    let selectBestTrapBase = document.getElementById('selectBestTrapBase');
    let storageValue = window.localStorage.getItem('BestTrap');
    if (isNullOrUndefined(storageValue)) {
      let objBestTrapDefault = {
        weapon: {
          arcane: '',
          draconic: '',
          forgotten: '',
          hydro: '',
          law: '',
          physical: '',
          rift: '',
          shadow: '',
          tactical: ''
        },
        base: {
          combo: '',
          luck: '',
          power: '',
          rift: '',
          labyrinth: ''
        }
      };
      storageValue = JSON.stringify(objBestTrapDefault);
    }

    storageValue = JSON.parse(storageValue);
    storageValue.weapon[selectBestTrapPowerType.value] =
      selectBestTrapWeapon.value;
    storageValue.base[selectBestTrapBaseType.value] = selectBestTrapBase.value;
    window.localStorage.setItem('BestTrap', JSON.stringify(storageValue));
  }

  function onInputMinAAChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveGWH2016();
  }

  function onInputMinWorkChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveGWH2016();
  }

  function onSelectGWHTrinketChanged() {
    saveGWH2016();
    initControlsGWH2016();
  }

  function initControlsGWH2016(bAutoChangeZone) {
    if (isNullOrUndefined(bAutoChangeZone)) bAutoChangeZone = false;
    let selectGWHZone = document.getElementById('selectGWHZone');
    let selectGWHWeapon = document.getElementById('selectGWHWeapon');
    let selectGWHBase = document.getElementById('selectGWHBase');
    let selectGWHTrinket = document.getElementById('selectGWHTrinket');
    let selectGWHBait = document.getElementById('selectGWHBait');
    let selectGWHBoost = document.getElementById('selectGWHBoost');
    let selectGWHUseTurboBoost = document.getElementById(
      'selectGWHUseTurboBoost'
    );
    let inputMinAA = document.getElementById('inputMinAA');
    let inputMinFirework = document.getElementById('inputMinFirework');
    let selectGWHLandAfterRunOutFirework = document.getElementById(
      'selectGWHLandAfterRunOutFirework'
    );
    let storageValue = window.sessionStorage.getItem('GWH2016R');
    if (isNullOrUndefined(storageValue)) {
      selectGWHWeapon.selectedIndex = -1;
      selectGWHBase.selectedIndex = -1;
      selectGWHTrinket.selectedIndex = -1;
      selectGWHBait.selectedIndex = -1;
      selectGWHBoost.selectedIndex = -1;
      selectGWHUseTurboBoost.selectedIndex = 0;
      inputMinAA.value = 20;
      inputMinFirework.value = 20;
      selectGWHLandAfterRunOutFirework.selectedIndex = 0;
    } else {
      storageValue = JSON.parse(storageValue);
      let nIndex = storageValue.zone.indexOf(selectGWHZone.value);
      selectGWHWeapon.value = storageValue.weapon[nIndex];
      selectGWHBase.value = storageValue.base[nIndex];
      selectGWHTrinket.value = storageValue.trinket[nIndex];
      selectGWHBait.value = storageValue.bait[nIndex];
      selectGWHBoost.value =
        storageValue.boost[nIndex] === true ? 'true' : 'false';
      selectGWHBoost.disabled =
        selectGWHTrinket.value.toUpperCase().indexOf('ANCHOR') > -1
          ? 'disabled'
          : '';
      selectGWHUseTurboBoost.value =
        storageValue.turbo === true ? 'true' : 'false';
      inputMinAA.value = storageValue.minAAToFly;
      inputMinFirework.value = storageValue.minFireworkToFly;
      selectGWHLandAfterRunOutFirework.value =
        storageValue.landAfterFireworkRunOut === true ? 'true' : 'false';
    }
  }

  function saveGWH2016() {
    let selectGWHZone = document.getElementById('selectGWHZone');
    let selectGWHWeapon = document.getElementById('selectGWHWeapon');
    let selectGWHBase = document.getElementById('selectGWHBase');
    let selectGWHTrinket = document.getElementById('selectGWHTrinket');
    let selectGWHBait = document.getElementById('selectGWHBait');
    let selectGWHBoost = document.getElementById('selectGWHBoost');
    let selectGWHUseTurboBoost = document.getElementById(
      'selectGWHUseTurboBoost'
    );
    let inputMinAA = document.getElementById('inputMinAA');
    let inputMinFirework = document.getElementById('inputMinFirework');
    let selectGWHLandAfterRunOutFirework = document.getElementById(
      'selectGWHLandAfterRunOutFirework'
    );
    let storageValue = window.sessionStorage.getItem('GWH2016R');
    if (isNullOrUndefined(storageValue)) {
      // prettier-ignore
      let objDefaultGWH2016 = {
        zone: [
          "ORDER1",
          "ORDER2",
          "NONORDER1",
          "NONORDER2",
          "WINTER_WASTELAND",
          "SNOWBALL_STORM",
          "FLYING",
          "NEW_YEAR\'S_PARTY",
        ],
        weapon: new Array(8).fill(""),
        base: new Array(8).fill(""),
        trinket: new Array(8).fill(""),
        bait: new Array(8).fill(""),
        boost: new Array(8).fill(false),
        turbo: false,
        minAAToFly: 20,
        minFireworkToFly: 20,
        landAfterFireworkRunOut: false,
      };
      storageValue = JSON.stringify(objDefaultGWH2016);
    }
    storageValue = JSON.parse(storageValue);
    let nIndex = storageValue.zone.indexOf(selectGWHZone.value);
    storageValue.weapon[nIndex] = selectGWHWeapon.value;
    storageValue.base[nIndex] = selectGWHBase.value;
    storageValue.trinket[nIndex] = selectGWHTrinket.value;
    storageValue.bait[nIndex] = selectGWHBait.value;
    storageValue.boost[nIndex] =
      selectGWHTrinket.value.toUpperCase().indexOf('ANCHOR') > -1
        ? false
        : selectGWHBoost.value == 'true';
    storageValue.turbo = selectGWHUseTurboBoost.value == 'true';
    storageValue.minAAToFly = parseInt(inputMinAA.value);
    storageValue.minFireworkToFly = parseInt(inputMinFirework.value);
    storageValue.landAfterFireworkRunOut =
      selectGWHLandAfterRunOutFirework.value == 'true';
    window.sessionStorage.setItem('GWH2016R', JSON.stringify(storageValue));
  }

  function initControlsSCCustom(bAutoChangeZone) {
    if (isNullOrUndefined(bAutoChangeZone)) bAutoChangeZone = false;
    let selectSCHuntZone = document.getElementById('selectSCHuntZone');
    let selectSCHuntZoneEnable = document.getElementById(
      'selectSCHuntZoneEnable'
    );
    let selectSCHuntBait = document.getElementById('selectSCHuntBait');
    let selectSCHuntTrinket = document.getElementById('selectSCHuntTrinket');
    let selectSCUseSmartJet = document.getElementById('selectSCUseSmartJet');
    let storageValue = window.localStorage.getItem('SCCustom');
    if (isNullOrUndefined(storageValue)) {
      let objDefaultSCCustom = {
        zone: [
          'ZONE_NOT_DIVE',
          'ZONE_DEFAULT',
          'ZONE_CORAL',
          'ZONE_SCALE',
          'ZONE_BARNACLE',
          'ZONE_TREASURE',
          'ZONE_DANGER',
          'ZONE_DANGER_PP',
          'ZONE_OXYGEN',
          'ZONE_BONUS',
          'ZONE_DANGER_PP_LOTA'
        ],
        zoneID: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        isHunt: new Array(11).fill(true),
        bait: new Array(11).fill('Gouda'),
        trinket: new Array(11).fill('None'),
        useSmartJet: false
      };
      storageValue = JSON.stringify(objDefaultSCCustom);
    }

    storageValue = JSON.parse(storageValue);
    if (
      bAutoChangeZone &&
      !isNullOrUndefined(user) &&
      user.environment_name.indexOf('Sunken City') > -1
    ) {
      let zone = document.getElementsByClassName('zoneName')[0].innerText;
      let objZone = {
        ZONE_TREASURE: [
          'Sand Dollar Sea Bar',
          'Pearl Patch',
          'Sunken Treasure'
        ],
        ZONE_DANGER: ['Feeding Grounds', 'Carnivore Cove'],
        ZONE_DANGER_PP: ['Monster Trench'],
        ZONE_DANGER_PP_LOTA: ['Lair of the Ancients'],
        ZONE_OXYGEN: ['Deep Oxygen Stream', 'Oxygen Stream'],
        ZONE_BONUS: ['Magma Flow'],
        ZONE_CORAL: ['Coral Reef', 'Coral Garden', 'Coral Castle'],
        ZONE_SCALE: ['School of Mice', 'Mermouse Den', 'Lost Ruins'],
        ZONE_BARNACLE: ['Rocky Outcrop', 'Shipwreck', 'Haunted Shipwreck'],
        ZONE_DEFAULT: ['Shallow Shoals', 'Sea Floor', 'Murky Depths']
      };
      selectSCHuntZone.selectedIndex = 0;
      for (let prop in objZone) {
        if (objZone.hasOwnProperty(prop)) {
          if (objZone[prop].indexOf(zone) > -1) {
            selectSCHuntZone.value = prop;
            break;
          }
        }
      }
    }
    let nIndex = storageValue.zone.indexOf(selectSCHuntZone.value);
    if (nIndex < 0) nIndex = 0;
    selectSCHuntZoneEnable.value = storageValue.isHunt[nIndex];
    selectSCHuntBait.value = storageValue.bait[nIndex];
    selectSCHuntTrinket.value = storageValue.trinket[nIndex];
    selectSCUseSmartJet.value = storageValue.useSmartJet;
    selectSCHuntZoneEnable.style.display =
      selectSCHuntZone.value == 'ZONE_NOT_DIVE' ? 'none' : '';
  }

  function saveSCCustomAlgo() {
    let selectSCHuntZone = document.getElementById('selectSCHuntZone');
    let selectSCHuntZoneEnable = document.getElementById(
      'selectSCHuntZoneEnable'
    );
    let selectSCHuntBait = document.getElementById('selectSCHuntBait');
    let selectSCHuntTrinket = document.getElementById('selectSCHuntTrinket');
    let selectSCUseSmartJet = document.getElementById('selectSCUseSmartJet');
    let storageValue = window.localStorage.getItem('SCCustom');
    if (isNullOrUndefined(storageValue)) {
      let objDefaultSCCustom = {
        zone: [
          'ZONE_NOT_DIVE',
          'ZONE_DEFAULT',
          'ZONE_CORAL',
          'ZONE_SCALE',
          'ZONE_BARNACLE',
          'ZONE_TREASURE',
          'ZONE_DANGER',
          'ZONE_DANGER_PP',
          'ZONE_OXYGEN',
          'ZONE_BONUS',
          'ZONE_DANGER_PP_LOTA'
        ],
        zoneID: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        isHunt: new Array(11).fill(true),
        bait: new Array(11).fill('Gouda'),
        trinket: new Array(11).fill('None'),
        useSmartJet: false
      };
      storageValue = JSON.stringify(objDefaultSCCustom);
    }

    storageValue = JSON.parse(storageValue);
    let nIndex = storageValue.zone.indexOf(selectSCHuntZone.value);
    if (nIndex < 0) nIndex = 0;
    storageValue.isHunt[nIndex] = selectSCHuntZoneEnable.value === 'true';
    storageValue.bait[nIndex] = selectSCHuntBait.value;
    storageValue.trinket[nIndex] = selectSCHuntTrinket.value;
    storageValue.useSmartJet = selectSCUseSmartJet.value === 'true';
    window.localStorage.setItem('SCCustom', JSON.stringify(storageValue));
  }

  function onSelectLabyrinthDistrict() {
    saveLaby();
    initControlsLaby();
  }

  function onSelectLabyrinthDisarm() {
    let inputLabyrinthLastHunt = document.getElementById(
      'inputLabyrinthLastHunt'
    );
    let selectLabyrinthDisarm = document.getElementById(
      'selectLabyrinthDisarm'
    );
    inputLabyrinthLastHunt.disabled =
      selectLabyrinthDisarm.value == 'true' ? '' : 'disabled';
    saveLaby();
  }

  function onInputLabyrinthLastHuntChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveLaby();
  }

  function onSelectLabyrinthDisarmCompass() {
    saveLaby();
    initControlsLaby();
  }

  function onInputLabyrinthDECChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveLaby();
  }

  function saveLaby() {
    const selectLabyrinthDistrict = document.getElementById(
      'selectLabyrinthDistrict'
    );
    const selectLabyrinthMinorDistrict = document.getElementById(
      'selectLabyrinthMinorDistrict'
    );
    const inputLabyrinthFocusTypesQueue = document.getElementById(
      'inputLabyrinthFocusTypesQueue'
    );
    const inputLabyrinthPlansIgnoreQueue = document.getElementById(
      'inputLabyrinthPlansIgnoreQueue'
    );
    const selectLabyrinthTravelTo = document.getElementById(
      'selectLabyrinthTravelTo'
    );
    const selectLabyrinthOtherBase = document.getElementById(
      'selectLabyrinthOtherBase'
    );
    const selectLabyrinthDisarmCompass = document.getElementById(
      'selectLabyrinthDisarmCompass'
    );
    const inputLabyrinthDEC = document.getElementById('inputLabyrinthDEC');
    const selectHallway15Plain = document.getElementById(
      'selectHallway15Plain'
    );
    const selectHallway1560Plain = document.getElementById(
      'selectHallway1560Plain'
    );
    const selectHallway1560Superior = document.getElementById(
      'selectHallway1560Superior'
    );
    const selectHallway60Plain = document.getElementById(
      'selectHallway60Plain'
    );
    const selectHallway60Superior = document.getElementById(
      'selectHallway60Superior'
    );
    const selectHallway60Epic = document.getElementById('selectHallway60Epic');
    const selectLabyrinthAutoOpenExit = document.getElementById(
      'selectLabyrinthAutoOpenExit'
    );
    const selectLabyrinthOpenFocusDoor = document.getElementById(
      'selectLabyrinthOpenFocusDoor'
    );
    const selectLabyrinthAutoLantern = document.getElementById(
      'selectLabyrinthAutoLantern'
    );
    const inputLabyrinthFocusClues = document.getElementById(
      'inputLabyrinthFocusClues'
    );
    const inputLabyrinthFocusTypesManualDoor = document.getElementById(
      'inputLabyrinthFocusTypesManualDoor'
    );
    const selectLabyrinthWeaponType = document.getElementById(
      'selectLabyrinthWeaponType'
    );
    const selectLabyrinthFarmingCharm = document.getElementById(
      'selectLabyrinthFarmingCharm'
    );
    const selectLabyrinthFarmingBait = document.getElementById(
      'selectLabyrinthFarmingBait'
    );
    const selectLabyrinthTreasuryWeaponType = document.getElementById(
      'selectLabyrinthTreasuryWeaponType'
    );
    const selectLabyrinthTreasuryCharm = document.getElementById(
      'selectLabyrinthTreasuryCharm'
    );
    const selectLabyrinthTreasuryBait = document.getElementById(
      'selectLabyrinthTreasuryBait'
    );
    const selectLabyrinthFocusCharm = document.getElementById(
      'selectLabyrinthFocusCharm'
    );
    const selectLabyrinthFocusBait = document.getElementById(
      'selectLabyrinthFocusBait'
    );
    const selectLabyrinthNonFocusWeaponType = document.getElementById(
      'selectLabyrinthNonFocusWeaponType'
    );
    const selectLabyrinthNonFocusBase = document.getElementById(
      'selectLabyrinthNonFocusBase'
    );
    const selectLabyrinthNonFocusCharm = document.getElementById(
      'selectLabyrinthNonFocusCharm'
    );
    const selectLabyrinthNonFocusBait = document.getElementById(
      'selectLabyrinthNonFocusBait'
    );
    const selectLabyrinthIntersectionCharm = document.getElementById(
      'selectLabyrinthIntersectionCharm'
    );
    const selectLabyrinthIntersectionBait = document.getElementById(
      'selectLabyrinthIntersectionBait'
    );
    let storageValue = window.localStorage.getItem('Labyrinth');
    if (isNullOrUndefined(storageValue)) {
      const objDefaultLaby = {
        districtFocus: 'None',
        minorFocus: 'None',
        focusTypesQueue: ['TREASURY', 'FARMING', 'FEALTY', 'SCHOLAR', 'TECH'],
        plansIgnoreQueue: ['MINOTAUR', 'HIGHEST', 'BALANCE'],
        securityDisarm: false,
        travelTo: '',
        lastHunt: 0,
        armOtherBase: 'false',
        disarmCompass: true,
        nDeadEndClue: 0,
        between0and14: ['lp'],
        between15and59: ['sp', 'ls'],
        between60and100: ['sp', 'ss', 'le'],
        autoOpenExit: true,
        openFocusDoor: true,
        autoLantern: true,
        focusClues: 15,
        chooseOtherDoors: true,
        focusTypesManualDoor: ['FEALTY', 'SCHOLAR', 'TECH'],
        typeOtherDoors: 'SHORTEST_FEWEST',
        baitFarming: 'Gouda Cheese',
        weaponFarming: 'best.weapon.forgotten',
        charmFarming: 'None',
        baitTreasury: 'Gouda Cheese',
        weaponTreasury: 'best.weapon.forgotten',
        charmTreasury: 'None',
        baitFocus: 'Glowing Gruyere',
        charmFocus: 'None',
        baitNonFocus: 'Brie Cheese',
        weaponNonFocus: 'best.weapon.physical',
        baseNonFocus: 'Cheesecake Base',
        charmNonFocus: 'None',
        baitIntersection: 'Brie Cheese',
        charmIntersection: 'None'
      };
      storageValue = JSON.stringify(objDefaultLaby);
    }

    storageValue = JSON.parse(storageValue);
    storageValue.districtFocus = selectLabyrinthDistrict.value;
    storageValue.minorFocus = selectLabyrinthMinorDistrict.value;
    inputLabyrinthFocusTypesQueue.value = inputLabyrinthFocusTypesQueue.value
      .trim()
      .toUpperCase()
      .replaceAll(' ', '');
    storageValue.focusTypesQueue =
      inputLabyrinthFocusTypesQueue.value == ''
        ? []
        : inputLabyrinthFocusTypesQueue.value.split(',');
    inputLabyrinthPlansIgnoreQueue.value = inputLabyrinthPlansIgnoreQueue.value
      .trim()
      .toUpperCase()
      .replaceAll(' ', '');
    storageValue.plansIgnoreQueue =
      inputLabyrinthPlansIgnoreQueue.value == ''
        ? []
        : inputLabyrinthPlansIgnoreQueue.value.split(',');
    // storageValue.securityDisarm =
    //   document.getElementById('selectLabyrinthDisarm').value == 'true';
    storageValue.travelTo = selectLabyrinthTravelTo.value;
    storageValue.lastHunt = parseInt(
      document.getElementById('inputLabyrinthLastHunt').value
    );
    storageValue.armOtherBase = selectLabyrinthOtherBase.value;
    storageValue.disarmCompass = selectLabyrinthDisarmCompass.value == 'true';
    storageValue.nDeadEndClue = parseInt(inputLabyrinthDEC.value);
    storageValue.between0and14 = [selectHallway15Plain.value];
    storageValue.between15and59 = [
      selectHallway1560Plain.value,
      selectHallway1560Superior.value
    ];
    storageValue.between60and100 = [
      selectHallway60Plain.value,
      selectHallway60Superior.value,
      selectHallway60Epic.value
    ];
    storageValue.autoOpenExit = selectLabyrinthAutoOpenExit.value == 'true';
    storageValue.openFocusDoor = selectLabyrinthOpenFocusDoor.value == 'true';
    storageValue.autoLantern = selectLabyrinthAutoLantern.value == 'true';
    storageValue.focusClues = parseInt(inputLabyrinthFocusClues.value);
    storageValue.chooseOtherDoors =
      document.getElementById('chooseOtherDoors').value == 'true';
    inputLabyrinthFocusTypesManualDoor.value =
      inputLabyrinthFocusTypesManualDoor.value
        .trim()
        .toUpperCase()
        .replaceAll(' ', '');
    storageValue.focusTypesManualDoor =
      inputLabyrinthFocusTypesManualDoor.value == ''
        ? []
        : inputLabyrinthFocusTypesManualDoor.value.split(',');
    storageValue.typeOtherDoors =
      document.getElementById('typeOtherDoors').value;
    storageValue.weaponFarming = selectLabyrinthWeaponType.value;
    storageValue.charmFarming = selectLabyrinthFarmingCharm.value;
    storageValue.baitFarming = selectLabyrinthFarmingBait.value;
    storageValue.weaponTreasury = selectLabyrinthTreasuryWeaponType.value;
    storageValue.charmTreasury = selectLabyrinthTreasuryCharm.value;
    storageValue.baitTreasury = selectLabyrinthTreasuryBait.value;
    storageValue.charmFocus = selectLabyrinthFocusCharm.value;
    storageValue.baitFocus = selectLabyrinthFocusBait.value;
    storageValue.weaponNonFocus = selectLabyrinthNonFocusWeaponType.value;
    storageValue.baseNonFocus = selectLabyrinthNonFocusBase.value;
    storageValue.charmNonFocus = selectLabyrinthNonFocusCharm.value;
    storageValue.baitNonFocus = selectLabyrinthNonFocusBait.value;
    storageValue.charmIntersection = selectLabyrinthIntersectionCharm.value;
    storageValue.baitIntersection = selectLabyrinthIntersectionBait.value;
    window.localStorage.setItem('Labyrinth', JSON.stringify(storageValue));
  }

  function initControlsLaby() {
    const selectLabyrinthDistrict = document.getElementById(
      'selectLabyrinthDistrict'
    );
    const selectLabyrinthMinorDistrict = document.getElementById(
      'selectLabyrinthMinorDistrict'
    );
    const inputLabyrinthFocusTypesQueue = document.getElementById(
      'inputLabyrinthFocusTypesQueue'
    );
    const inputLabyrinthPlansIgnoreQueue = document.getElementById(
      'inputLabyrinthPlansIgnoreQueue'
    );
    const selectLabyrinthDisarm = document.getElementById(
      'selectLabyrinthDisarm'
    );
    const selectLabyrinthTravelTo = document.getElementById(
      'selectLabyrinthTravelTo'
    );
    const inputLabyrinthLastHunt = document.getElementById(
      'inputLabyrinthLastHunt'
    );
    const selectLabyrinthOtherBase = document.getElementById(
      'selectLabyrinthOtherBase'
    );
    const selectLabyrinthDisarmCompass = document.getElementById(
      'selectLabyrinthDisarmCompass'
    );
    const inputLabyrinthDEC = document.getElementById('inputLabyrinthDEC');
    const selectHallway15Plain = document.getElementById(
      'selectHallway15Plain'
    );
    const selectHallway1560Plain = document.getElementById(
      'selectHallway1560Plain'
    );
    const selectHallway1560Superior = document.getElementById(
      'selectHallway1560Superior'
    );
    const selectHallway60Plain = document.getElementById(
      'selectHallway60Plain'
    );
    const selectHallway60Superior = document.getElementById(
      'selectHallway60Superior'
    );
    const selectHallway60Epic = document.getElementById('selectHallway60Epic');
    const selectLabyrinthAutoOpenExit = document.getElementById(
      'selectLabyrinthAutoOpenExit'
    );
    const selectLabyrinthOpenFocusDoor = document.getElementById(
      'selectLabyrinthOpenFocusDoor'
    );
    const selectLabyrinthAutoLantern = document.getElementById(
      'selectLabyrinthAutoLantern'
    );
    const inputLabyrinthFocusClues = document.getElementById(
      'inputLabyrinthFocusClues'
    );
    const selectChooseOtherDoors = document.getElementById('chooseOtherDoors');
    const inputLabyrinthFocusTypesManualDoor = document.getElementById(
      'inputLabyrinthFocusTypesManualDoor'
    );
    const typeOtherDoors = document.getElementById('typeOtherDoors');
    const selectLabyrinthWeaponType = document.getElementById(
      'selectLabyrinthWeaponType'
    );
    const selectLabyrinthFarmingCharm = document.getElementById(
      'selectLabyrinthFarmingCharm'
    );
    const selectLabyrinthFarmingBait = document.getElementById(
      'selectLabyrinthFarmingBait'
    );
    const selectLabyrinthTreasuryWeaponType = document.getElementById(
      'selectLabyrinthTreasuryWeaponType'
    );
    const selectLabyrinthTreasuryCharm = document.getElementById(
      'selectLabyrinthTreasuryCharm'
    );
    const selectLabyrinthTreasuryBait = document.getElementById(
      'selectLabyrinthTreasuryBait'
    );
    const selectLabyrinthFocusCharm = document.getElementById(
      'selectLabyrinthFocusCharm'
    );
    const selectLabyrinthFocusBait = document.getElementById(
      'selectLabyrinthFocusBait'
    );
    const selectLabyrinthNonFocusWeaponType = document.getElementById(
      'selectLabyrinthNonFocusWeaponType'
    );
    const selectLabyrinthNonFocusBase = document.getElementById(
      'selectLabyrinthNonFocusBase'
    );
    const selectLabyrinthNonFocusCharm = document.getElementById(
      'selectLabyrinthNonFocusCharm'
    );
    const selectLabyrinthNonFocusBait = document.getElementById(
      'selectLabyrinthNonFocusBait'
    );
    const selectLabyrinthIntersectionCharm = document.getElementById(
      'selectLabyrinthIntersectionCharm'
    );
    const selectLabyrinthIntersectionBait = document.getElementById(
      'selectLabyrinthIntersectionBait'
    );
    let storageValue = window.localStorage.getItem('Labyrinth');
    if (isNullOrUndefined(storageValue)) {
      selectLabyrinthDistrict.selectedIndex = -1;
      selectLabyrinthMinorDistrict.selectedIndex = -1;
      inputLabyrinthFocusTypesQueue = 'TREASURY,FARMING,FEALTY,SCHOLAR,TECH';
      inputLabyrinthPlansIgnoreQueue = 'MINOTAUR,HIGHEST,BALANCE';
      // selectLabyrinthDisarm.selectedIndex = -1;
      selectLabyrinthTravelTo.selectedIndex = 0;
      inputLabyrinthLastHunt.value = 2;
      selectLabyrinthOtherBase.selectedIndex = -1;
      selectLabyrinthDisarmCompass.selectedIndex = -1;
      inputLabyrinthDEC.value = 0;
      selectHallway15Plain.selectedIndex = -1;
      selectHallway1560Plain.selectedIndex = -1;
      selectHallway1560Superior.selectedIndex = -1;
      selectHallway60Plain.selectedIndex = -1;
      selectHallway60Superior.selectedIndex = -1;
      selectHallway60Epic.selectedIndex = -1;
      selectLabyrinthAutoOpenExit.selectedIndex = -1;
      selectLabyrinthOpenFocusDoor.selectedIndex = -1;
      selectLabyrinthAutoLantern.selectedIndex = -1;
      inputLabyrinthFocusClues.value = 15;
      selectChooseOtherDoors.selectedIndex = -1;
      inputLabyrinthFocusTypesManualDoor = 'FEALTY,SCHOLAR,TECH';
      typeOtherDoors.selectedIndex = -1;
      selectLabyrinthWeaponType.selectedIndex = 0;
      selectLabyrinthFarmingCharm.selectedIndex = 0;
      selectLabyrinthFarmingBait.selectedIndex = 0;
      selectLabyrinthTreasuryWeaponType.selectedIndex = 0;
      selectLabyrinthTreasuryCharm.selectedIndex = 0;
      selectLabyrinthTreasuryBait.selectedIndex = 0;
      selectLabyrinthFocusCharm.selectedIndex = 0;
      selectLabyrinthFocusBait.selectedIndex = 0;
      selectLabyrinthNonFocusWeaponType.selectedIndex = 0;
      selectLabyrinthNonFocusBase.selectedIndex = 0;
      selectLabyrinthNonFocusCharm.selectedIndex = 0;
      selectLabyrinthNonFocusBait.selectedIndex = 0;
      selectLabyrinthIntersectionCharm.selectedIndex = 0;
      selectLabyrinthIntersectionBait.selectedIndex = 0;
    } else {
      storageValue = JSON.parse(storageValue);
      selectLabyrinthDistrict.value = storageValue.districtFocus;
      selectLabyrinthMinorDistrict.value = storageValue.minorFocus;
      inputLabyrinthFocusTypesQueue.value = storageValue.focusTypesQueue
        .join(',')
        .toUpperCase();
      inputLabyrinthPlansIgnoreQueue.value = storageValue.plansIgnoreQueue
        .join(',')
        .toUpperCase();
      //   selectLabyrinthDisarm.value = storageValue.securityDisarm
      //     ? 'true'
      //     : 'false';
      selectLabyrinthTravelTo.value = storageValue.travelTo;
      inputLabyrinthLastHunt.value = storageValue.lastHunt;
      selectLabyrinthOtherBase.value = storageValue.armOtherBase;
      selectLabyrinthDisarmCompass.value = storageValue.disarmCompass
        ? 'true'
        : 'false';
      inputLabyrinthDEC.value = storageValue.nDeadEndClue;
      selectHallway15Plain.value = storageValue.between0and14[0];
      selectHallway1560Plain.value = storageValue.between15and59[0];
      selectHallway1560Superior.value = storageValue.between15and59[1];
      selectHallway60Plain.value = storageValue.between60and100[0];
      selectHallway60Superior.value = storageValue.between60and100[1];
      selectHallway60Epic.value = storageValue.between60and100[2];
      selectLabyrinthAutoOpenExit.value = storageValue.autoOpenExit
        ? 'true'
        : 'false';
      selectLabyrinthOpenFocusDoor.value = storageValue.openFocusDoor
        ? 'true'
        : 'false';
      selectLabyrinthAutoLantern.value = storageValue.autoLantern
        ? 'true'
        : 'false';
      inputLabyrinthFocusClues.value = storageValue.focusClues;
      inputLabyrinthFocusTypesManualDoor.value =
        storageValue.focusTypesManualDoor.join(',').toUpperCase();
      selectChooseOtherDoors.value = storageValue.chooseOtherDoors
        ? 'true'
        : 'false';
      typeOtherDoors.value = storageValue.typeOtherDoors;
      selectLabyrinthWeaponType.value = storageValue.weaponFarming;
      selectLabyrinthFarmingCharm.value = storageValue.charmFarming;
      selectLabyrinthFarmingBait.value = storageValue.baitFarming;
      selectLabyrinthTreasuryWeaponType.value = storageValue.weaponTreasury;
      selectLabyrinthTreasuryCharm.value = storageValue.charmTreasury;
      selectLabyrinthTreasuryBait.value = storageValue.baitTreasury;
      selectLabyrinthFocusCharm.value = storageValue.charmFocus;
      selectLabyrinthFocusBait.value = storageValue.baitFocus;
      selectLabyrinthNonFocusWeaponType.value = storageValue.weaponNonFocus;
      selectLabyrinthNonFocusBase.value = storageValue.baseNonFocus;
      selectLabyrinthNonFocusCharm.value = storageValue.charmNonFocus;
      selectLabyrinthNonFocusBait.value = storageValue.baitNonFocus;
      selectLabyrinthIntersectionCharm.value = storageValue.charmIntersection;
      selectLabyrinthIntersectionBait.value = storageValue.baitIntersection;
    }
    // inputLabyrinthLastHunt.disabled = storageValue.securityDisarm
    //   ? ''
    //   : 'disabled';
    document.getElementById('trPriorities15').style.display =
      selectLabyrinthDistrict.value == 'None' ? 'none' : 'table-row';
    document.getElementById('trPriorities1560').style.display =
      selectLabyrinthDistrict.value == 'None' ? 'none' : 'table-row';
    document.getElementById('trPriorities60').style.display =
      selectLabyrinthDistrict.value == 'None' ? 'none' : 'table-row';
    document.getElementById('trLabyrinthOtherHallway').style.display =
      selectLabyrinthDistrict.value == 'None' ? 'none' : 'table-row';
    inputLabyrinthDEC.disabled = storageValue.disarmCompass ? '' : 'disabled';
    selectHallway60Epic.style =
      selectLabyrinthDistrict.value == 'TREASURY' ||
      selectLabyrinthDistrict.value == 'FARMING'
        ? 'display:none'
        : 'display:inline';
    document.getElementById('typeOtherDoors').disabled =
      storageValue.chooseOtherDoors ? '' : 'disabled';
  }

  function saveLG() {
    const selectLGTGAutoFillSide = document.getElementById(
      'selectLGTGAutoFillSide'
    );
    const selectLGTGAutoFillState = document.getElementById(
      'selectLGTGAutoFillState'
    );
    const selectLGTGAutoPourSide = document.getElementById(
      'selectLGTGAutoPourSide'
    );
    const selectLGTGAutoPourState = document.getElementById(
      'selectLGTGAutoPourState'
    );
    const selectLGTGStatus = document.getElementById('selectLGTGStatus');
    const selectLGTGSide = document.getElementById('selectLGTGSide');
    const selectLGTGBase = document.getElementById('selectLGTGBase');
    const selectLGTGTrinket = document.getElementById('selectLGTGTrinket');
    const selectLGTGBait = document.getElementById('selectLGTGBait');
    const selectLCCCStatus = document.getElementById('selectLCCCStatus');
    const selectLCCCSide = document.getElementById('selectLCCCSide');
    const selectLCCCBase = document.getElementById('selectLCCCBase');
    const selectLCCCTrinket = document.getElementById('selectLCCCTrinket');
    const selectSDStatus = document.getElementById('selectSDStatus');
    const selectSDBase = document.getElementById('selectSDBase');
    const selectSDTrinket = document.getElementById('selectSDTrinket');
    const selectSaltedStatus = document.getElementById('selectSaltedStatus');
    const selectSCBase = document.getElementById('selectSCBase');
    const selectSCTrinket = document.getElementById('selectSCTrinket');
    const inputKGSalt = document.getElementById('inputKGSalt');
    let storageValue = window.localStorage.getItem('LGArea');
    if (isNullOrUndefined(storageValue)) {
      let objLGTemplate = {
        isAutoFill: false,
        isAutoPour: false,
        maxSaltCharged: 25,
        base: {
          before: '',
          after: '',
          tc: '',
          boss: ''
        },
        trinket: {
          before: '',
          after: '',
          tc: '',
          boss: ''
        },
        bait: {
          before: '',
          after: '',
          tc: '',
          boss: ''
        }
      };
      let objAllLG = {
        isCheckDuskshade: false,
        isCheckLunaria: false,
        dewthief: 30,
        duskshade: 300,
        graveblossom: 30,
        lunaria: 70,
        LG: JSON.parse(JSON.stringify(objLGTemplate)),
        TG: JSON.parse(JSON.stringify(objLGTemplate)),
        LC: JSON.parse(JSON.stringify(objLGTemplate)),
        CC: JSON.parse(JSON.stringify(objLGTemplate)),
        SD: JSON.parse(JSON.stringify(objLGTemplate)),
        SC: JSON.parse(JSON.stringify(objLGTemplate))
      };
      storageValue = JSON.stringify(objAllLG);
    }
    storageValue = JSON.parse(storageValue);
    storageValue[selectLGTGAutoFillSide.value].isAutoFill =
      selectLGTGAutoFillState.value == 'true';
    storageValue[selectLGTGAutoPourSide.value].isAutoPour =
      selectLGTGAutoPourState.value == 'true';
    storageValue[selectLGTGSide.value]['base'][selectLGTGStatus.value] =
      selectLGTGBase.value;
    storageValue[selectLGTGSide.value]['trinket'][selectLGTGStatus.value] =
      selectLGTGTrinket.value;
    storageValue[selectLGTGSide.value]['bait'][selectLGTGStatus.value] =
      selectLGTGBait.value;
    storageValue[selectLCCCSide.value]['base'][selectLCCCStatus.value] =
      selectLCCCBase.value;
    storageValue[selectLCCCSide.value]['trinket'][selectLCCCStatus.value] =
      selectLCCCTrinket.value;
    storageValue['SD']['base'][selectSDStatus.value] = selectSDBase.value;
    storageValue['SD']['trinket'][selectSDStatus.value] = selectSDTrinket.value;
    storageValue['SC']['base'][selectSaltedStatus.value] = selectSCBase.value;
    storageValue['SC']['trinket'][selectSaltedStatus.value] =
      selectSCTrinket.value;
    storageValue['SC']['maxSaltCharged'] = inputKGSalt.value;
    window.localStorage.setItem('LGArea', JSON.stringify(storageValue));
  }

  function initControlsLG(bAutoChangeLocation) {
    if (isNullOrUndefined(bAutoChangeLocation)) bAutoChangeLocation = false;
    const selectLGTGAutoFillSide = document.getElementById(
      'selectLGTGAutoFillSide'
    );
    const selectLGTGAutoFillState = document.getElementById(
      'selectLGTGAutoFillState'
    );
    const selectLGTGAutoPourSide = document.getElementById(
      'selectLGTGAutoPourSide'
    );
    const selectLGTGAutoPourState = document.getElementById(
      'selectLGTGAutoPourState'
    );
    const selectLGTGStatus = document.getElementById('selectLGTGStatus');
    const selectLGTGSide = document.getElementById('selectLGTGSide');
    const selectLGTGBase = document.getElementById('selectLGTGBase');
    const selectLGTGTrinket = document.getElementById('selectLGTGTrinket');
    const selectLGTGBait = document.getElementById('selectLGTGBait');
    const selectLCCCStatus = document.getElementById('selectLCCCStatus');
    const selectLCCCSide = document.getElementById('selectLCCCSide');
    const selectLCCCBase = document.getElementById('selectLCCCBase');
    const selectLCCCTrinket = document.getElementById('selectLCCCTrinket');
    const selectSDStatus = document.getElementById('selectSDStatus');
    const selectSDBase = document.getElementById('selectSDBase');
    const selectSDTrinket = document.getElementById('selectSDTrinket');
    const selectSaltedStatus = document.getElementById('selectSaltedStatus');
    const selectSCBase = document.getElementById('selectSCBase');
    const selectSCTrinket = document.getElementById('selectSCTrinket');
    const inputKGSalt = document.getElementById('inputKGSalt');
    let storageValue = window.localStorage.getItem('LGArea');
    if (isNullOrUndefined(storageValue)) {
      selectLGTGAutoFillState.selectedIndex = -1;
      selectLGTGAutoPourState.selectedIndex = -1;
      selectLGTGStatus.selectedIndex = -1;
      selectLGTGBase.selectedIndex = -1;
      selectLGTGTrinket.selectedIndex = -1;
      selectLGTGBait.selectedIndex = -1;
      selectLCCCStatus.selectedIndex = -1;
      selectLCCCBase.selectedIndex = -1;
      selectLCCCTrinket.selectedIndex = -1;
      selectSDStatus.selectedIndex = -1;
      selectSDBase.selectedIndex = -1;
      selectSDTrinket.selectedIndex = -1;
      selectSCBase.selectedIndex = -1;
      selectSCTrinket.selectedIndex = -1;
      inputKGSalt.value = 25;
    } else {
      storageValue = JSON.parse(storageValue);
      if (bAutoChangeLocation && !isNullOrUndefined(user)) {
        if (user.environment_name.indexOf('Living Garden') > -1) {
          selectLGTGAutoFillSide.value = 'LG';
          selectLGTGAutoPourSide.value = 'LG';
          selectLGTGSide.value = 'LG';
        } else if (user.environment_name.indexOf('Twisted Garden') > -1) {
          selectLGTGAutoFillSide.value = 'TG';
          selectLGTGAutoPourSide.value = 'TG';
          selectLGTGSide.value = 'TG';
        } else if (user.environment_name.indexOf('Lost City') > -1) {
          selectLCCCSide.value = 'LC';
        } else if (user.environment_name.indexOf('Cursed City') > -1) {
          selectLCCCSide.value = 'CC';
        }
      }
      selectLGTGAutoFillState.value =
        storageValue[selectLGTGAutoFillSide.value].isAutoFill;
      selectLGTGAutoPourState.value =
        storageValue[selectLGTGAutoPourSide.value].isAutoPour;
      selectLGTGBase.value =
        storageValue[selectLGTGSide.value]['base'][selectLGTGStatus.value];
      selectLGTGTrinket.value =
        storageValue[selectLGTGSide.value]['trinket'][selectLGTGStatus.value];
      selectLGTGBait.value =
        storageValue[selectLGTGSide.value]['bait'][selectLGTGStatus.value];
      selectLCCCBase.value =
        storageValue[selectLCCCSide.value]['base'][selectLCCCStatus.value];
      selectLCCCTrinket.value =
        storageValue[selectLCCCSide.value]['trinket'][selectLCCCStatus.value];
      selectSDBase.value = storageValue['SD']['base'][selectSDStatus.value];
      selectSDTrinket.value =
        storageValue['SD']['trinket'][selectSDStatus.value];
      selectSCBase.value = storageValue['SC']['base'][selectSaltedStatus.value];
      selectSCTrinket.value =
        storageValue['SC']['trinket'][selectSaltedStatus.value];
      inputKGSalt.value = storageValue['SC']['maxSaltCharged'];
    }
  }

  function initControlsFW(bAutoChangeWave) {
    if (isNullOrUndefined(bAutoChangeWave)) bAutoChangeWave = false;
    const selectFWStopAtWardenLessThan = document.getElementById(
      'selectFWStopAtWardenLessThan'
    );
    const selectFWTravelTo = document.getElementById('selectFWTravelTo');
    const selectFWWave = document.getElementById('selectFWWave');
    const selectHasCavalryCharm = document.getElementById(
      'selectHasCavalryCharm'
    );
    const selectHasMageCharm = document.getElementById('selectHasMageCharm');
    const inputCharmOnlySoldier = document.getElementById(
      'inputCharmOnlySoldier'
    );
    const inputCharmOnlyCavalry = document.getElementById(
      'inputCharmOnlyCavalry'
    );
    const inputCharmOnlyMage = document.getElementById('inputCharmOnlyMage');
    const inputCharmOnlyArtillery = document.getElementById(
      'inputCharmOnlyArtillery'
    );
    const inputCharmSomeFews = document.getElementById('inputCharmSomeFews');
    const inputCharmArtilleryCommander = document.getElementById(
      'inputCharmArtilleryCommander'
    );
    const selectFWTrapSetupBase = document.getElementById(
      'selectFWTrapSetupBase'
    );
    const selectFWTrapSetupWeapon = document.getElementById(
      'selectFWTrapSetupWeapon'
    );
    const selectFWTrapSetupCavalry = document.getElementById(
      'selectFWTrapSetupCavalry'
    );
    const selectFWTrapSetupMage = document.getElementById(
      'selectFWTrapSetupMage'
    );
    const selectFWTrapSetupArtillery = document.getElementById(
      'selectFWTrapSetupArtillery'
    );
    const selectFWTrapSetupCommander = document.getElementById(
      'selectFWTrapSetupCommander'
    );
    const selectFWTrapSetupSomeFews = document.getElementById(
      'selectFWTrapSetupSomeFews'
    );
    const selectFWStreak = document.getElementById('selectFWStreak');
    const selectFWFocusType = document.getElementById('selectFWFocusType');
    const selectFWPriorities = document.getElementById('selectFWPriorities');
    const selectFWCheese = document.getElementById('selectFWCheese');
    const selectFWCharmType = document.getElementById('selectFWCharmType');
    const selectFWSpecial = document.getElementById('selectFWSpecial');
    const selectFWLastTypeConfig = document.getElementById(
      'selectFWLastTypeConfig'
    );
    const selectFWLastTypeConfigIncludeArtillery = document.getElementById(
      'selectFWLastTypeConfigIncludeArtillery'
    );
    const selectIgnoreLessThan = document.getElementById(
      'selectIgnoreLessThan'
    );
    const selectFWSupportConfig = document.getElementById(
      'selectFWSupportConfig'
    );
    const selectFW4WardenStatus = document.getElementById(
      'selectFW4WardenStatus'
    );
    const selectFW4TrapSetupWeapon = document.getElementById(
      'selectFW4TrapSetupWeapon'
    );
    const selectFW4TrapSetupBase = document.getElementById(
      'selectFW4TrapSetupBase'
    );
    const selectFW4TrapSetupTrinket = document.getElementById(
      'selectFW4TrapSetupTrinket'
    );
    const selectFW4TrapSetupBait = document.getElementById(
      'selectFW4TrapSetupBait'
    );
    let storageValue = window.localStorage.getItem('FW');
    if (isNullOrUndefined(storageValue)) {
      selectFWStopAtWardenLessThan.selectedIndex = -1;
      selectFWTravelTo.selectedIndex = -1;
      selectFWTrapSetupBase.selectedIndex = -1;
      selectFWTrapSetupWeapon.selectedIndex = -1;
      selectFWTrapSetupCavalry.selectedIndex = -1;
      selectFWTrapSetupMage.selectedIndex = -1;
      selectFWTrapSetupArtillery.selectedIndex = -1;
      selectFWTrapSetupCommander.selectedIndex = -1;
      selectFWTrapSetupSomeFews.selectedIndex = -1;
      selectFW4TrapSetupWeapon.selectedIndex = -1;
      selectFW4TrapSetupBase.selectedIndex = -1;
      selectFW4TrapSetupTrinket.selectedIndex = -1;
      selectFW4TrapSetupBait.selectedIndex = -1;
      selectFWFocusType.selectedIndex = -1;
      selectFWPriorities.selectedIndex = -1;
      selectFWCheese.selectedIndex = -1;
      selectFWCharmType.selectedIndex = -1;
      selectFWSpecial.selectedIndex = -1;
      selectFWLastTypeConfig.selectedIndex = -1;
      selectFWLastTypeConfigIncludeArtillery.selectedIndex = 0;
      selectIgnoreLessThan.selectedIndex = 0;
      selectFWSupportConfig.selectedIndex = 0;
    } else {
      storageValue = JSON.parse(storageValue);
      if (
        bAutoChangeWave &&
        !isNullOrUndefined(user) &&
        user.environment_name.indexOf('Fiery Warpath') > -1
      ) {
        // handle wave
        if (user.viewing_atts.desert_warpath.wave < 1) selectFWWave.value = 1;
        else if (user.viewing_atts.desert_warpath.wave > 4)
          selectFWWave.value = 4;
        else selectFWWave.value = user.viewing_atts.desert_warpath.wave;
        // streak
        let nStreak = parseInt(
          user.viewing_atts.desert_warpath.streak_quantity
        );
        if (Number.isInteger(nStreak)) {
          if (nStreak !== 0) selectFWStreak.value = nStreak + 1;
        }
      }
      selectFWStopAtWardenLessThan.value = storageValue.stopAtWardenLessThan;
      selectFWTravelTo.value = storageValue.travelTo;
      let strWave = 'wave' + selectFWWave.value;
      selectHasCavalryCharm.value = storageValue[strWave].hasCavalryCharm;
      selectHasMageCharm.value = storageValue[strWave].hasMageCharm;
      inputCharmOnlySoldier.value = storageValue[strWave].charmOnlySoldier;
      inputCharmOnlyCavalry.value = storageValue[strWave].charmOnlyCavalry;
      inputCharmOnlyMage.value = storageValue[strWave].charmOnlyMage;
      inputCharmOnlyArtillery.value = storageValue[strWave].charmOnlyArtillery;
      inputCharmSomeFews.value = storageValue[strWave].charmSomeFews;
      inputCharmArtilleryCommander.value =
        storageValue[strWave].charmArtilleryCommander;
      if (isNullOrUndefined(storageValue[strWave].weapon))
        storageValue[strWave].weapon = 'Sandtail Sentinel';
      if (isNullOrUndefined(storageValue[strWave].base))
        storageValue[strWave].base = 'Physical Brace Base';
      if (selectFWWave.value == 4) {
        selectFW4TrapSetupWeapon.value =
          storageValue[strWave].warden[selectFW4WardenStatus.value].weapon;
        selectFW4TrapSetupBase.value =
          storageValue[strWave].warden[selectFW4WardenStatus.value].base;
        selectFW4TrapSetupTrinket.value =
          storageValue[strWave].warden[selectFW4WardenStatus.value].trinket;
        selectFW4TrapSetupBait.value =
          storageValue[strWave].warden[selectFW4WardenStatus.value].bait;
      } else {
        selectFWTrapSetupBase.value = storageValue[strWave].base;
        selectFWTrapSetupWeapon.value = storageValue[strWave].weapon;
        selectFWTrapSetupCavalry.value = storageValue[strWave].Cavalry;
        selectFWTrapSetupMage.value = storageValue[strWave].Mage;
        selectFWTrapSetupArtillery.value = storageValue[strWave].Artillery;
        selectFWTrapSetupCommander.value = storageValue[strWave].Commander;
        selectFWTrapSetupSomeFews.value = storageValue[strWave].someFews;
      }
      selectFWFocusType.value = storageValue[strWave].focusType;
      selectFWPriorities.value = storageValue[strWave].priorities;
      selectFWCheese.value =
        storageValue[strWave].cheese[selectFWStreak.selectedIndex];
      selectFWCharmType.value =
        storageValue[strWave].charmType[selectFWStreak.selectedIndex];
      selectFWSpecial.value =
        storageValue[strWave].special[selectFWStreak.selectedIndex];
      selectFWLastTypeConfig.value = storageValue[strWave].lastSoldierConfig;
      selectFWLastTypeConfigIncludeArtillery.value = storageValue[strWave]
        .includeArtillery
        ? 'true'
        : 'false';
      selectIgnoreLessThan.value = storageValue[strWave].ignoreMouseLessThan;
      selectFWSupportConfig.value = storageValue[strWave]
        .disarmAfterSupportRetreat
        ? 'true'
        : 'false';
    }
    for (let i = 0; i < selectFWSpecial.options.length; i++) {
      if (selectFWSpecial.options[i].value == 'GARGANTUA_GGC') {
        if (selectFWStreak.selectedIndex >= 7)
          selectFWSpecial.options[i].removeAttribute('disabled');
        else selectFWSpecial.options[i].setAttribute('disabled', 'disabled');
        break;
      }
    }
    let nWave = parseInt(selectFWWave.value);
    let option = selectFWFocusType.children;
    for (let i = 0; i < option.length; i++) {
      if (option[i].innerText.indexOf('Special') > -1)
        option[i].style = nWave == 1 ? 'display:none' : '';
    }
    if (selectFWWave.value == 4) {
      document.getElementById('trFWStreak').style.display = 'none';
      document.getElementById('trFWFocusType').style.display = 'none';
      document.getElementById('trFWLastType').style.display = 'none';
      document.getElementById('trFWSupportConfig').style.display = 'none';
      document.getElementById('trFWTrapSetup').style.display = 'none';
      document.getElementById('trFW4TrapSetup').style.display = 'table-row';
    } else {
      document.getElementById('trFWStreak').style.display = 'table-row';
      document.getElementById('trFWFocusType').style.display = 'table-row';
      document.getElementById('trFWLastType').style.display = 'table-row';
      document.getElementById('trFWSupportConfig').style.display = 'table-row';
      document.getElementById('trFWTrapSetup').style.display = 'table-row';
      document.getElementById('trFW4TrapSetup').style.display = 'none';
      if (selectFWWave.value == 3)
        selectFWLastTypeConfigIncludeArtillery.disabled = '';
      else selectFWLastTypeConfigIncludeArtillery.disabled = 'disabled';
    }
  }

  function saveFW() {
    const FwHighestStreak = 15;
    const DefaultFwWaveSettings = {
      weapon: 'best.weapon.physical',
      base: 'Physical Brace',
      Cavalry: 'best.weapon.tactical',
      Mage: 'best.weapon.hydro',
      Artillery: 'best.weapon.arcane',
      someFews: 'best.weapon.physical',
      focusType: 'NORMAL',
      priorities: 'HIGHEST',
      cheese: new Array(FwHighestStreak).fill('Gouda'),
      charmType: new Array(FwHighestStreak).fill('Warpath'),
      special: new Array(FwHighestStreak).fill('None'),
      ignoreMouseLessThan: 1,
      hasCavalryCharm: false,
      hasMageCharm: false,
      charmOnlySoldier: 'None',
      charmOnlyCavalry: 'None',
      charmOnlyMage: 'None',
      charmOnlyArtillery: 'None',
      charmSomeFews: 'None',
      charmArtilleryCommander: 'None',
      lastSoldierConfig: 'CONFIG_GOUDA',
      includeArtillery: true,
      disarmAfterSupportRetreat: false,
      warden: {
        before: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        },
        after: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        }
      }
    };
    const selectFWStopAtWardenLessThan = document.getElementById(
      'selectFWStopAtWardenLessThan'
    );
    const selectFWTravelTo = document.getElementById('selectFWTravelTo');
    const selectHasCavalryCharm = document.getElementById(
      'selectHasCavalryCharm'
    );
    const selectHasMageCharm = document.getElementById('selectHasMageCharm');
    const inputCharmOnlySoldier = document.getElementById(
      'inputCharmOnlySoldier'
    );
    const inputCharmOnlyCavalry = document.getElementById(
      'inputCharmOnlyCavalry'
    );
    const inputCharmOnlyMage = document.getElementById('inputCharmOnlyMage');
    const inputCharmOnlyArtillery = document.getElementById(
      'inputCharmOnlyArtillery'
    );
    const inputCharmSomeFews = document.getElementById('inputCharmSomeFews');
    const inputCharmArtilleryCommander = document.getElementById(
      'inputCharmArtilleryCommander'
    );
    const selectFWWave = document.getElementById('selectFWWave');
    const selectFWTrapSetupWeapon = document.getElementById(
      'selectFWTrapSetupWeapon'
    );
    const selectFWTrapSetupBase = document.getElementById(
      'selectFWTrapSetupBase'
    );
    const selectFWTrapSetupCavalry = document.getElementById(
      'selectFWTrapSetupCavalry'
    );
    const selectFWTrapSetupMage = document.getElementById(
      'selectFWTrapSetupMage'
    );
    const selectFWTrapSetupArtillery = document.getElementById(
      'selectFWTrapSetupArtillery'
    );
    const selectFWTrapSetupCommander = document.getElementById(
      'selectFWTrapSetupCommander'
    );
    const selectFWTrapSetupSomeFews = document.getElementById(
      'selectFWTrapSetupSomeFews'
    );
    const nWave = selectFWWave.value;
    const selectFWStreak = document.getElementById('selectFWStreak');
    const nStreak = parseInt(selectFWStreak.value);
    const nStreakLength = selectFWStreak.children.length;
    const selectFWFocusType = document.getElementById('selectFWFocusType');
    const selectFWPriorities = document.getElementById('selectFWPriorities');
    const selectFWCheese = document.getElementById('selectFWCheese');
    const selectFWCharmType = document.getElementById('selectFWCharmType');
    const selectFWSpecial = document.getElementById('selectFWSpecial');
    const selectFWLastTypeConfig = document.getElementById(
      'selectFWLastTypeConfig'
    );
    const selectFWLastTypeConfigIncludeArtillery = document.getElementById(
      'selectFWLastTypeConfigIncludeArtillery'
    );
    const selectIgnoreLessThan = document.getElementById(
      'selectIgnoreLessThan'
    );
    const selectFWSupportConfig = document.getElementById(
      'selectFWSupportConfig'
    );
    const selectFW4WardenStatus = document.getElementById(
      'selectFW4WardenStatus'
    );
    const selectFW4TrapSetupWeapon = document.getElementById(
      'selectFW4TrapSetupWeapon'
    );
    const selectFW4TrapSetupBase = document.getElementById(
      'selectFW4TrapSetupBase'
    );
    const selectFW4TrapSetupTrinket = document.getElementById(
      'selectFW4TrapSetupTrinket'
    );
    const selectFW4TrapSetupBait = document.getElementById(
      'selectFW4TrapSetupBait'
    );
    let storageValue = window.localStorage.getItem('FW');
    if (isNullOrUndefined(storageValue)) {
      let objAll = {
        stopAtWardenLessThan: 0,
        travelTo: '',
        wave1: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
        wave2: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
        wave3: JSON.parse(JSON.stringify(DefaultFwWaveSettings)),
        wave4: JSON.parse(JSON.stringify(DefaultFwWaveSettings))
      };
      storageValue = JSON.stringify(objAll);
    }
    storageValue = JSON.parse(storageValue);
    storageValue.stopAtWardenLessThan = parseInt(
      selectFWStopAtWardenLessThan.value
    );
    storageValue.travelTo = selectFWTravelTo.value;
    let strWave = 'wave' + selectFWWave.value;
    storageValue[strWave].hasCavalryCharm =
      selectHasCavalryCharm.value == 'true';
    storageValue[strWave].hasMageCharm = selectHasMageCharm.value == 'true';
    storageValue[strWave].charmOnlySoldier = inputCharmOnlySoldier.value;
    storageValue[strWave].charmOnlyCavalry = inputCharmOnlyCavalry.value;
    storageValue[strWave].charmOnlyMage = inputCharmOnlyMage.value;
    storageValue[strWave].charmOnlyArtillery = inputCharmOnlyArtillery.value;
    storageValue[strWave].charmSomeFews = inputCharmSomeFews.value;
    storageValue[strWave].charmArtilleryCommander =
      inputCharmArtilleryCommander.value;
    if (isNullOrUndefined(storageValue[strWave].weapon))
      storageValue[strWave].weapon = 'Sandtail Sentinel';
    if (isNullOrUndefined(storageValue[strWave].base))
      storageValue[strWave].base = 'Physical Brace Base';
    if (nWave == 4) {
      storageValue[strWave].warden[selectFW4WardenStatus.value].weapon =
        selectFW4TrapSetupWeapon.value;
      storageValue[strWave].warden[selectFW4WardenStatus.value].base =
        selectFW4TrapSetupBase.value;
      storageValue[strWave].warden[selectFW4WardenStatus.value].trinket =
        selectFW4TrapSetupTrinket.value;
      storageValue[strWave].warden[selectFW4WardenStatus.value].bait =
        selectFW4TrapSetupBait.value;
    } else {
      storageValue[strWave].base = selectFWTrapSetupBase.value;
      storageValue[strWave].weapon = selectFWTrapSetupWeapon.value;
      storageValue[strWave].Cavalry = selectFWTrapSetupCavalry.value;
      storageValue[strWave].Mage = selectFWTrapSetupMage.value;
      storageValue[strWave].Artillery = selectFWTrapSetupArtillery.value;
      storageValue[strWave].Commander = selectFWTrapSetupCommander.value;
      storageValue[strWave].someFews = selectFWTrapSetupSomeFews.value;
    }
    storageValue[strWave].focusType = selectFWFocusType.value;
    storageValue[strWave].priorities = selectFWPriorities.value;
    storageValue[strWave].cheese[nStreak] = selectFWCheese.value;
    storageValue[strWave].charmType[nStreak] = selectFWCharmType.value;
    storageValue[strWave].special[nStreak] = selectFWSpecial.value;
    storageValue[strWave].lastSoldierConfig = selectFWLastTypeConfig.value;
    storageValue[strWave].includeArtillery =
      selectFWLastTypeConfigIncludeArtillery.value == 'true';
    storageValue[strWave].ignoreMouseLessThan = selectIgnoreLessThan.value;
    storageValue[strWave].disarmAfterSupportRetreat =
      selectFWSupportConfig.value == 'true';
    window.localStorage.setItem('FW', JSON.stringify(storageValue));
  }

  function onSelectBRHuntMistTierChanged() {
    let hunt = document.getElementById('selectBRHuntMistTier').value;
    let storageValue = window.localStorage.getItem('BRCustom');
    if (isNullOrUndefined(storageValue)) {
      storageValue = JSON.stringify(defaultBRSetting);
    }
    storageValue = JSON.parse(storageValue);
    storageValue.hunt = hunt;
    window.localStorage.setItem('BRCustom', JSON.stringify(storageValue));
    initControlsBR();
  }

  function onInputToggleCanisterChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveBR();
  }

  function initControlsBR() {
    const hunt = document.getElementById('selectBRHuntMistTier');
    const enoughCanister = document.getElementById('inputBREnoughCanister');
    const isAutoTerreRicotta = document.getElementById(
      'selectBRAutoTerreRicotta'
    );
    const autoTerreRicottaAtQuantity = document.getElementById(
      'inputBRAutoTerreRicottaAtQuantity'
    );
    const charmPairedWithTerreRicotta = document.getElementById(
      'selectBRCharmPairedWithTerreRicotta'
    );
    const toggle = document.getElementById('inputToggleCanister');
    const weapon = document.getElementById('selectBRTrapWeapon');
    const base = document.getElementById('selectBRTrapBase');
    const trinket = document.getElementById('selectBRTrapTrinket');
    const bait = document.getElementById('selectBRTrapBait');
    let storageValue = window.localStorage.getItem('BRCustom');
    if (isNullOrUndefined(storageValue)) {
      hunt.selectedIndex = 0;
      enoughCanister.value = 100;
      isAutoTerreRicotta.selectedIndex = -1;
      autoTerreRicottaAtQuantity.value = 10;
      charmPairedWithTerreRicotta.selectedIndex = -1;
      toggle.value = 1;
      weapon.selectedIndex = -1;
      base.selectedIndex = -1;
      trinket.selectedIndex = -1;
      bait.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      hunt.value = storageValue.hunt;
      enoughCanister.value = storageValue.enoughCanister;
      isAutoTerreRicotta.value = storageValue.isAutoTerreRicotta;
      autoTerreRicottaAtQuantity.value =
        storageValue.autoTerreRicottaAtQuantity;
      charmPairedWithTerreRicotta.value =
        storageValue.charmPairedWithTerreRicotta;
      toggle.value = storageValue.toggle;
      const nIndex = storageValue.name.indexOf(hunt.value);
      weapon.value = storageValue.weapon[nIndex];
      base.value = storageValue.base[nIndex];
      trinket.value = storageValue.trinket[nIndex];
      bait.value = storageValue.bait[nIndex];
    }
    document.getElementById('trBRToggle').style.display =
      hunt.value == 'Red' ? 'table-row' : 'none';
  }

  /**
   * Default BRift setting.
   */
  const defaultBRSetting = {
    hunt: '',
    enoughCanister: 100,
    isAutoTerreRicotta: true,
    autoTerreRicottaAtQuantity: 10,
    charmPairedWithTerreRicotta: '',
    toggle: 1,
    name: ['Red', 'Green', 'Yellow', 'None'],
    weapon: new Array(4),
    base: new Array(4),
    trinket: new Array(4),
    bait: new Array(4)
  };

  function saveBR() {
    const hunt = document.getElementById('selectBRHuntMistTier').value;
    const enoughCanister = parseInt(
      document.getElementById('inputBREnoughCanister').value
    );
    const isAutoTerreRicotta = document.getElementById(
      'selectBRAutoTerreRicotta'
    ).value;
    const autoTerreRicottaAtQuantity = parseInt(
      document.getElementById('inputBRAutoTerreRicottaAtQuantity').value
    );
    const charmPairedWithTerreRicotta = document.getElementById(
      'selectBRCharmPairedWithTerreRicotta'
    ).value;
    const nToggle = parseInt(
      document.getElementById('inputToggleCanister').value
    );
    const weapon = document.getElementById('selectBRTrapWeapon').value;
    const base = document.getElementById('selectBRTrapBase').value;
    const trinket = document.getElementById('selectBRTrapTrinket').value;
    const bait = document.getElementById('selectBRTrapBait').value;
    let storageValue = window.localStorage.getItem('BRCustom');
    if (isNullOrUndefined(storageValue)) {
      storageValue = JSON.stringify(defaultBRSetting);
    }
    storageValue = JSON.parse(storageValue);
    let nIndex = storageValue.name.indexOf(hunt);
    if (nIndex < 0) nIndex = 0;
    storageValue.hunt = hunt;
    storageValue.enoughCanister = enoughCanister;
    storageValue.isAutoTerreRicotta = isAutoTerreRicotta;
    storageValue.autoTerreRicottaAtQuantity = autoTerreRicottaAtQuantity;
    storageValue.charmPairedWithTerreRicotta = charmPairedWithTerreRicotta;
    storageValue.toggle = nToggle;
    storageValue.weapon[nIndex] = weapon;
    storageValue.base[nIndex] = base;
    storageValue.trinket[nIndex] = trinket;
    storageValue.bait[nIndex] = bait;
    window.localStorage.setItem('BRCustom', JSON.stringify(storageValue));
  }

  function saveSG() {
    let selectSGSeason = document.getElementById('selectSGSeason');
    let selectSGTrapWeapon = document.getElementById('selectSGTrapWeapon');
    let selectSGTrapBase = document.getElementById('selectSGTrapBase');
    let selectSGTrapTrinket = document.getElementById('selectSGTrapTrinket');
    let selectSGTrapBait = document.getElementById('selectSGTrapBait');
    let selectSGDisarmBait = document.getElementById('selectSGDisarmBait');
    let selectSGTravelTo = document.getElementById('selectSGTravelTo');
    let inputSGRequiredAmplifier = document.getElementById(
      'inputSGRequiredAmplifier'
    );
    let storageValue = window.localStorage.getItem('SGarden');
    if (isNullOrUndefined(storageValue)) {
      let objSG = {
        weapon: new Array(4).fill(''),
        base: new Array(4).fill(''),
        trinket: new Array(4).fill(''),
        bait: new Array(4).fill(''),
        disarmBaitAfterCharged: false
      };
      storageValue = JSON.stringify(objSG);
    }
    storageValue = JSON.parse(storageValue);
    let nIndex =
      selectSGSeason.selectedIndex < 0 ? 0 : selectSGSeason.selectedIndex;
    storageValue.weapon[nIndex] = selectSGTrapWeapon.value;
    storageValue.base[nIndex] = selectSGTrapBase.value;
    storageValue.trinket[nIndex] = selectSGTrapTrinket.value;
    storageValue.bait[nIndex] = selectSGTrapBait.value;
    storageValue.disarmBaitAfterCharged = selectSGDisarmBait.value == 'true';
    storageValue.travelTo = selectSGTravelTo.value;
    storageValue.requiredAmplifier = parseInt(inputSGRequiredAmplifier.value);
    window.localStorage.setItem('SGarden', JSON.stringify(storageValue));
  }

  function initControlsSG(bAutoChangeSeason) {
    if (isNullOrUndefined(bAutoChangeSeason)) bAutoChangeSeason = false;
    let selectSGSeason = document.getElementById('selectSGSeason');
    let selectSGTrapWeapon = document.getElementById('selectSGTrapWeapon');
    let selectSGTrapBase = document.getElementById('selectSGTrapBase');
    let selectSGTrapTrinket = document.getElementById('selectSGTrapTrinket');
    let selectSGTrapBait = document.getElementById('selectSGTrapBait');
    let selectSGDisarmBait = document.getElementById('selectSGDisarmBait');
    let selectSGTravelTo = document.getElementById('selectSGTravelTo');
    let inputSGRequiredAmplifier = document.getElementById(
      'inputSGRequiredAmplifier'
    );
    let storageValue = window.localStorage.getItem('SGarden');
    if (isNullOrUndefined(storageValue)) {
      selectSGTrapWeapon.selectedIndex = -1;
      selectSGTrapBase.selectedIndex = -1;
      selectSGTrapTrinket.selectedIndex = -1;
      selectSGTrapBait.selectedIndex = -1;
      selectSGDisarmBait.selectedIndex = -1;
      inputSGRequiredAmplifier.value = 150;
      selectSGTravelTo.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      if (
        bAutoChangeSeason &&
        !isNullOrUndefined(user) &&
        user.environment_name.indexOf('Seasonal Garden') > -1
      ) {
        let arrSeason = ['Spring', 'Summer', 'Fall', 'Winter'];
        let nTimeStamp = Date.parse(new Date()) / 1000;
        let nFirstSeasonTimeStamp = 1283328000;
        let nSeasonLength = 288000; // 80hr
        let nSeason =
          Math.floor((nTimeStamp - nFirstSeasonTimeStamp) / nSeasonLength) %
          arrSeason.length;
        selectSGSeason.value = arrSeason[nSeason].toUpperCase();
      }
      let nIndex =
        selectSGSeason.selectedIndex < 0 ? 0 : selectSGSeason.selectedIndex;
      selectSGTrapWeapon.value = storageValue.weapon[nIndex];
      selectSGTrapBase.value = storageValue.base[nIndex];
      selectSGTrapTrinket.value = storageValue.trinket[nIndex];
      selectSGTrapBait.value = storageValue.bait[nIndex];
      selectSGDisarmBait.value = storageValue.disarmBaitAfterCharged
        ? 'true'
        : 'false';
      selectSGTravelTo.value = storageValue.travelTo;
      inputSGRequiredAmplifier.value = storageValue.requiredAmplifier;
    }
  }

  function initControlsZT(bAutoChangeMouseOrder) {
    if (isNullOrUndefined(bAutoChangeMouseOrder)) bAutoChangeMouseOrder = false;
    let selectZTFocus = document.getElementById('selectZTFocus');
    let arrSelectZTMouseOrder = [
      document.getElementById('selectZTMouseOrder1st'),
      document.getElementById('selectZTMouseOrder2nd')
    ];
    let arrSelectZTWeapon = [
      document.getElementById('selectZTWeapon1st'),
      document.getElementById('selectZTWeapon2nd')
    ];
    let arrSelectZTBase = [
      document.getElementById('selectZTBase1st'),
      document.getElementById('selectZTBase2nd')
    ];
    let arrSelectZTTrinket = [
      document.getElementById('selectZTTrinket1st'),
      document.getElementById('selectZTTrinket2nd')
    ];
    let arrSelectZTBait = [
      document.getElementById('selectZTBait1st'),
      document.getElementById('selectZTBait2nd')
    ];
    let storageValue = window.localStorage.getItem('ZTower');
    let i;
    if (isNullOrUndefined(storageValue)) {
      for (i = 0; i < 2; i++) {
        arrSelectZTMouseOrder[i].selectedIndex = 0;
        arrSelectZTWeapon[i].selectedIndex = -1;
        arrSelectZTBase[i].selectedIndex = -1;
        arrSelectZTTrinket[i].selectedIndex = -1;
        arrSelectZTBait[i].selectedIndex = -1;
      }
    } else {
      storageValue = JSON.parse(storageValue);
      selectZTFocus.value = storageValue.focus.toUpperCase();
      if (
        // prettier-ignore
        /* bodyJS是被 inject的javascript,
        不能讓 prettier把單引號前面的escape拿掉 */
        bAutoChangeMouseOrder &&
        !isNullOrUndefined(user) &&
        user.environment_name.indexOf("Zugzwang\'s Tower") > -1
      ) {
        let nProgressMystic = parseInt(user.viewing_atts.zzt_mage_progress);
        let nProgressTechnic = parseInt(user.viewing_atts.zzt_tech_progress);
        if (Number.isNaN(nProgressMystic) || Number.isNaN(nProgressTechnic)) {
          for (i = 0; i < 2; i++) {
            arrSelectZTMouseOrder[i].selectedIndex = 0;
          }
        } else {
          let arrProgress = [];
          if (selectZTFocus.value.indexOf('MYSTIC') === 0)
            arrProgress = [nProgressMystic, nProgressTechnic];
          else arrProgress = [nProgressTechnic, nProgressMystic];
          for (i = 0; i < 2; i++) {
            if (arrProgress[i] <= 7) arrSelectZTMouseOrder[i].value = 'PAWN';
            else if (arrProgress[i] <= 9)
              arrSelectZTMouseOrder[i].value = 'KNIGHT';
            else if (arrProgress[i] <= 11)
              arrSelectZTMouseOrder[i].value = 'BISHOP';
            else if (arrProgress[i] <= 13)
              arrSelectZTMouseOrder[i].value = 'ROOK';
            else if (arrProgress[i] <= 14)
              arrSelectZTMouseOrder[i].value = 'QUEEN';
            else if (arrProgress[i] <= 15)
              arrSelectZTMouseOrder[i].value = 'KING';
            else if (arrProgress[i] <= 16)
              arrSelectZTMouseOrder[i].value = 'CHESSMASTER';
          }
        }
      }
      for (i = 0; i < 2; i++) {
        if (arrSelectZTMouseOrder[i].selectedIndex < 0)
          arrSelectZTMouseOrder[i].selectedIndex = 0;
      }
      let nIndex = -1;
      for (i = 0; i < 2; i++) {
        nIndex = storageValue.order.indexOf(arrSelectZTMouseOrder[i].value);
        if (nIndex < 0) nIndex = 0;
        nIndex += i * 7;
        arrSelectZTWeapon[i].value = storageValue.weapon[nIndex];
        arrSelectZTBase[i].value = storageValue.base[nIndex];
        arrSelectZTTrinket[i].value = storageValue.trinket[nIndex];
        arrSelectZTBait[i].value = storageValue.bait[nIndex];
      }
    }
  }

  function saveZT() {
    let selectZTFocus = document.getElementById('selectZTFocus');
    let arrSelectZTMouseOrder = [
      document.getElementById('selectZTMouseOrder1st'),
      document.getElementById('selectZTMouseOrder2nd')
    ];
    let arrSelectZTWeapon = [
      document.getElementById('selectZTWeapon1st'),
      document.getElementById('selectZTWeapon2nd')
    ];
    let arrSelectZTBase = [
      document.getElementById('selectZTBase1st'),
      document.getElementById('selectZTBase2nd')
    ];
    let arrSelectZTTrinket = [
      document.getElementById('selectZTTrinket1st'),
      document.getElementById('selectZTTrinket2nd')
    ];
    let arrSelectZTBait = [
      document.getElementById('selectZTBait1st'),
      document.getElementById('selectZTBait2nd')
    ];
    let storageValue = window.localStorage.getItem('ZTower');
    if (isNullOrUndefined(storageValue)) {
      let objZT = {
        focus: 'MYSTIC',
        order: [
          'PAWN',
          'KNIGHT',
          'BISHOP',
          'ROOK',
          'QUEEN',
          'KING',
          'CHESSMASTER'
        ],
        weapon: new Array(14).fill(''),
        base: new Array(14).fill(''),
        trinket: new Array(14).fill('None'),
        bait: new Array(14).fill('Gouda')
      };
      storageValue = JSON.stringify(objZT);
    }
    storageValue = JSON.parse(storageValue);
    let nIndex = -1;
    for (let i = 0; i < 2; i++) {
      nIndex = storageValue.order.indexOf(arrSelectZTMouseOrder[i].value);
      if (nIndex < 0) nIndex = 0;
      nIndex += i * 7;
      storageValue.focus = selectZTFocus.value;
      storageValue.weapon[nIndex] = arrSelectZTWeapon[i].value;
      storageValue.base[nIndex] = arrSelectZTBase[i].value;
      storageValue.trinket[nIndex] = arrSelectZTTrinket[i].value;
      storageValue.bait[nIndex] = arrSelectZTBait[i].value;
    }
    window.localStorage.setItem('ZTower', JSON.stringify(storageValue));
  }

  function saveZokor() {
    const selectZokorBossStatus = document.getElementById(
      'selectZokorBossStatus'
    );
    const selectZokorDistrictType = document.getElementById(
      'selectZokorDistrictType'
    );
    const selectZokorBait = document.getElementById('selectZokorBait');
    const selectZokorWeapon = document.getElementById('selectZokorWeapon');
    const selectZokorBase = document.getElementById('selectZokorBase');
    const selectZokorTrinket = document.getElementById('selectZokorTrinket');
    let storageValue = window.localStorage.getItem('Zokor');
    if (isNullOrUndefined(storageValue)) {
      const objDefaultZokor = {
        bossStatus: ['UNAVAILABLE', 'INCOMING', 'ACTIVE', 'DEFEATED'],
        districtType: ['FEALTY', 'TECH', 'SCHOLAR', 'TREASURY', 'FARMING'],
        trap: {
          FEALTY: new Array(4).fill([
            'Glowing Gruyere',
            'best.weapon.forgotten',
            'best.base.combo',
            'None'
          ]),
          TECH: new Array(4).fill([
            'Glowing Gruyere',
            'best.weapon.forgotten',
            'best.base.combo',
            'None'
          ]),
          SCHOLAR: new Array(4).fill([
            'Glowing Gruyere',
            'best.weapon.forgotten',
            'best.base.combo',
            'None'
          ]),
          TREASURY: new Array(4).fill([
            'Glowing Gruyere',
            'best.weapon.forgotten',
            'best.base.combo',
            'None'
          ]),
          FARMING: new Array(4).fill([
            'Glowing Gruyere',
            'best.weapon.forgotten',
            'best.base.combo',
            'None'
          ])
        }
      };
      storageValue = JSON.stringify(objDefaultZokor);
    }
    storageValue = JSON.parse(storageValue);
    let statusIndex = selectZokorBossStatus.selectedIndex;
    if (statusIndex < 0) statusIndex = 0;
    const districtType = selectZokorDistrictType.value;
    storageValue.trap[districtType][statusIndex][0] = selectZokorBait.value;
    storageValue.trap[districtType][statusIndex][1] = selectZokorWeapon.value;
    storageValue.trap[districtType][statusIndex][2] = selectZokorBase.value;
    storageValue.trap[districtType][statusIndex][3] = selectZokorTrinket.value;
    window.localStorage.setItem('Zokor', JSON.stringify(storageValue));
  }

  function initControlsZokor(isAutoBossStatus) {
    // isAutoBossStatus is passed true when init by showOrHideTr
    // if (isNullOrUndefined(isAutoBossStatus)) isAutoBossStatus = false;
    const selectZokorBossStatus = document.getElementById(
      'selectZokorBossStatus'
    );
    const selectZokorDistrictType = document.getElementById(
      'selectZokorDistrictType'
    );
    const selectZokorBait = document.getElementById('selectZokorBait');
    const selectZokorWeapon = document.getElementById('selectZokorWeapon');
    const selectZokorBase = document.getElementById('selectZokorBase');
    const selectZokorTrinket = document.getElementById('selectZokorTrinket');
    if (isAutoBossStatus) {
      const quest = user.quests.QuestAncientCity;
      if (quest) {
        const bossStatus = trimToEmpty(quest.boss).toUpperCase();
        const clueName = trimToEmpty(quest.clue_name).toUpperCase();
        selectZokorBossStatus.value = bossStatus;
        selectZokorDistrictType.value = clueName;
      }
    }
    let storageValue = window.localStorage.getItem('Zokor');
    if (isNullOrUndefined(storageValue)) {
      selectZokorBait.selectedIndex = 0;
      selectZokorWeapon.selectedIndex = 0;
      selectZokorBase.selectedIndex = 0;
      selectZokorTrinket.selectedIndex = 0;
      return;
    }
    storageValue = JSON.parse(storageValue);
    /* let statusIndex = storageValue.bossStatus.indexOf(
        selectZokorBossStatus.value
      ); */
    let statusIndex = selectZokorBossStatus.selectedIndex;
    if (statusIndex < 0) statusIndex = 0;
    const districtType = selectZokorDistrictType.value;
    selectZokorBait.value = storageValue.trap[districtType][statusIndex][0];
    selectZokorWeapon.value = storageValue.trap[districtType][statusIndex][1];
    selectZokorBase.value = storageValue.trap[districtType][statusIndex][2];
    selectZokorTrinket.value = storageValue.trap[districtType][statusIndex][3];
  }

  function onSelectFRTrapBait() {
    saveFR();
    initControlsFR();
  }

  function saveFR() {
    const selectEnterAtBattery = document.getElementById(
      'selectEnterAtBattery'
    );
    const inputFREnterAfterTime = document.getElementById(
      'inputFREnterAfterTime'
    );
    const inputFREnterBeforeTime = document.getElementById(
      'inputFREnterBeforeTime'
    );
    const selectFRAutoFix = document.getElementById('selectFRAutoFix');
    const selectLeaveAtBattery = document.getElementById(
      'selectLeaveAtBattery'
    );
    const selectFRiftTravelTo = document.getElementById('selectFRiftTravelTo');
    const selectRetreatAtBattery = document.getElementById(
      'selectRetreatAtBattery'
    );
    const inputReservedCheeseQty = document.getElementById(
      'inputReservedCheeseQty'
    );
    const nIndex = document.getElementById(
      'selectTrapSetupAtBattery'
    ).selectedIndex;
    const weapon = document.getElementById('selectFRTrapWeapon').value;
    const base = document.getElementById('selectFRTrapBase').value;
    const trinket = document.getElementById('selectFRTrapTrinket').value;
    const bait = document.getElementById('selectFRTrapBait').value;
    const selectFRTrapBaitMasterOrder = document.getElementById(
      'selectFRTrapBaitMasterOrder'
    );
    const storageKey = 'rift_furoma';
    let storageValue = window.localStorage.getItem(storageKey);
    if (isNullOrUndefined(storageValue)) {
      const defaultSettings = {
        enter: 0,
        enterAfterTime: '',
        enterBeforeTime: '',
        autoFix: 'false',
        leave: 0,
        travelTo: '',
        retreat: 0,
        preservedCheeseQty: [1, 1, 1, 1, 1, 1, 1],
        weapon: new Array(11).fill('best.weapon.rift'),
        base: new Array(11).fill('best.base.rift'),
        trinket: new Array(11).fill('Rift Vacuum Charm'),
        bait: new Array(11).fill('Brie String'),
        masterOrder: new Array(11).fill('Glutter=>Combat=>Susheese')
      };
      storageValue = JSON.stringify(defaultSettings);
    }
    storageValue = JSON.parse(storageValue);
    storageValue.enter = parseInt(selectEnterAtBattery.value);
    storageValue.enterAfterTime = inputFREnterAfterTime.value.trim();
    storageValue.enterBeforeTime = inputFREnterBeforeTime.value.trim();
    storageValue.autoFix = selectFRAutoFix.value;
    storageValue.leave = parseInt(selectLeaveAtBattery.value);
    storageValue.travelTo = selectFRiftTravelTo.value;
    storageValue.retreat = parseInt(selectRetreatAtBattery.value);
    storageValue.preservedCheeseQty = inputReservedCheeseQty.value.split(',');
    storageValue.weapon[nIndex] = weapon;
    storageValue.base[nIndex] = base;
    storageValue.trinket[nIndex] = trinket;
    storageValue.bait[nIndex] = bait;
    storageValue.masterOrder[nIndex] = selectFRTrapBaitMasterOrder.value;
    window.localStorage.setItem(storageKey, JSON.stringify(storageValue));
  }

  function initControlsFR(bAutoChangeBatteryLevel) {
    if (isNullOrUndefined(bAutoChangeBatteryLevel))
      bAutoChangeBatteryLevel = false;
    const selectEnterAtBattery = document.getElementById(
      'selectEnterAtBattery'
    );
    const inputFREnterAfterTime = document.getElementById(
      'inputFREnterAfterTime'
    );
    const inputFREnterBeforeTime = document.getElementById(
      'inputFREnterBeforeTime'
    );
    const selectFRAutoFix = document.getElementById('selectFRAutoFix');
    const selectLeaveAtBattery = document.getElementById(
      'selectLeaveAtBattery'
    );
    const selectFRiftTravelTo = document.getElementById('selectFRiftTravelTo');
    const selectRetreatAtBattery = document.getElementById(
      'selectRetreatAtBattery'
    );
    const inputReservedCheeseQty = document.getElementById(
      'inputReservedCheeseQty'
    );
    const selectTrapSetupAtBattery = document.getElementById(
      'selectTrapSetupAtBattery'
    );
    const selectFRTrapWeapon = document.getElementById('selectFRTrapWeapon');
    const selectFRTrapBase = document.getElementById('selectFRTrapBase');
    const selectFRTrapTrinket = document.getElementById('selectFRTrapTrinket');
    const selectFRTrapBait = document.getElementById('selectFRTrapBait');
    const selectFRTrapBaitMasterOrder = document.getElementById(
      'selectFRTrapBaitMasterOrder'
    );
    const storageKey = 'rift_furoma';
    let storageValue = window.localStorage.getItem(storageKey);
    if (isNullOrUndefined(storageValue)) {
      selectEnterAtBattery.selectedIndex = -1;
      inputFREnterAfterTime.value = '';
      inputFREnterBeforeTime.value = '';
      selectFRAutoFix.selectedIndex = -1;
      selectLeaveAtBattery.selectedIndex = -1;
      selectFRiftTravelTo.value = '';
      selectRetreatAtBattery.selectedIndex = -1;
      inputReservedCheeseQty = '1,1,1,1,1,1,1';
      selectFRTrapWeapon.selectedIndex = -1;
      selectFRTrapBase.selectedIndex = -1;
      selectFRTrapTrinket.selectedIndex = -1;
      selectFRTrapBait.selectedIndex = -1;
      selectFRTrapBaitMasterOrder.selectedIndex = 0;
      selectTrapSetupAtBattery.selectedIndex = 0;
    } else {
      storageValue = JSON.parse(storageValue);
      let nIndex = 0;
      if (
        bAutoChangeBatteryLevel &&
        !isNullOrUndefined(user) &&
        user.environment_name.indexOf('Furoma Rift') > -1 &&
        (user.quests.QuestRiftFuroma.view_state == 'pagoda' ||
          user.quests.QuestRiftFuroma.view_state == 'pagoda knows_all')
      ) {
        const classCharge = document.getElementsByClassName(
          'riftFuromaHUD-droid-charge'
        );
        if (classCharge.length > 0) {
          const nRemainingEnergy = parseInt(
            classCharge[0].innerText.replace(/,/g, '')
          );
          if (Number.isInteger(nRemainingEnergy)) {
            const arrCumulative = [
              20, 65, 140, 260, 460, 770, 1220, 1835, 2625, 3600
            ];
            for (let i = arrCumulative.length - 1; i >= 0; i--) {
              if (nRemainingEnergy <= arrCumulative[i]) nIndex = i + 1;
              else break;
            }
            selectTrapSetupAtBattery.selectedIndex = nIndex;
          }
        }
      } else {
        nIndex = selectTrapSetupAtBattery.selectedIndex;
      }
      selectEnterAtBattery.value = Number.isInteger(storageValue.enter)
        ? storageValue.enter
        : 'None';
      inputFREnterAfterTime.value = storageValue.enterAfterTime;
      inputFREnterBeforeTime.value = storageValue.enterBeforeTime;
      selectFRAutoFix.value = storageValue.autoFix;
      selectLeaveAtBattery.value = storageValue.leave;
      selectFRiftTravelTo.value = storageValue.travelTo;
      selectRetreatAtBattery.value = storageValue.retreat;
      inputReservedCheeseQty.value = storageValue.preservedCheeseQty.join(',');
      selectFRTrapWeapon.value = storageValue.weapon[nIndex];
      selectFRTrapBase.value = storageValue.base[nIndex];
      selectFRTrapTrinket.value = storageValue.trinket[nIndex];
      selectFRTrapBait.value = storageValue.bait[nIndex];
      selectFRTrapBaitMasterOrder.value = storageValue.masterOrder[nIndex];
    }
    selectFRTrapBaitMasterOrder.style.display =
      selectFRTrapBait.value == 'ORDER_MASTER' ? '' : 'none';
  }

  function saveIceberg() {
    let selectIcebergPhase = document.getElementById('selectIcebergPhase');
    let selectIcebergBase = document.getElementById('selectIcebergBase');
    let selectIcebergBait = document.getElementById('selectIcebergBait');
    let selectIcebergTrinket = document.getElementById('selectIcebergTrinket');
    let storageValue = window.localStorage.getItem('Iceberg');
    let arrOrder = [
      'GENERAL',
      'TREACHEROUS',
      'BRUTAL',
      'BOMBING',
      'MAD',
      'ICEWING',
      'HIDDEN',
      'DEEP',
      'SLUSHY'
    ];
    if (isNullOrUndefined(storageValue)) {
      let objDefaultIceberg = {
        base: new Array(9).fill(''),
        trinket: new Array(9).fill('None'),
        bait: new Array(9).fill('Gouda')
      };
      storageValue = JSON.stringify(objDefaultIceberg);
    }
    storageValue = JSON.parse(storageValue);
    let nIndex = arrOrder.indexOf(selectIcebergPhase.value);
    if (nIndex < 0) nIndex = 0;
    storageValue.base[nIndex] = selectIcebergBase.value;
    storageValue.bait[nIndex] = selectIcebergBait.value;
    storageValue.trinket[nIndex] = selectIcebergTrinket.value;
    window.localStorage.setItem('Iceberg', JSON.stringify(storageValue));
  }

  function initControlsIceberg(bAutoChangePhase) {
    if (isNullOrUndefined(bAutoChangePhase)) bAutoChangePhase = false;
    let selectIcebergPhase = document.getElementById('selectIcebergPhase');
    let selectIcebergBase = document.getElementById('selectIcebergBase');
    let selectIcebergBait = document.getElementById('selectIcebergBait');
    let selectIcebergTrinket = document.getElementById('selectIcebergTrinket');
    let storageValue = window.localStorage.getItem('Iceberg');
    if (isNullOrUndefined(storageValue)) {
      selectIcebergBase.selectedIndex = -1;
      selectIcebergBait.selectedIndex = -1;
      selectIcebergTrinket.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      let nIndex = -1;
      let arrOrder = [
        'GENERAL',
        'TREACHEROUS',
        'BRUTAL',
        'BOMBING',
        'MAD',
        'ICEWING',
        'HIDDEN',
        'DEEP',
        'SLUSHY'
      ];
      if (bAutoChangePhase && !isNullOrUndefined(user)) {
        if (user.environment_name.indexOf('Iceberg') > -1) {
          let classCurrentPhase =
            document.getElementsByClassName('currentPhase');
          let phase =
            classCurrentPhase.length > 0
              ? classCurrentPhase[0].textContent
              : user.quests.QuestIceberg.current_phase;
          let classProgress = document.getElementsByClassName('user_progress');
          let nProgress =
            classProgress.length > 0
              ? parseInt(classProgress[0].textContent.replace(',', ''))
              : parseInt(user.quests.QuestIceberg.user_progress);
          if (
            nProgress == 300 ||
            nProgress == 600 ||
            nProgress == 1600 ||
            nProgress == 1800
          )
            nIndex = 0;
          else {
            phase = phase.toUpperCase();
            for (let i = 1; i < arrOrder.length; i++) {
              if (phase.indexOf(arrOrder[i]) > -1) {
                selectIcebergPhase.value = arrOrder[i];
                break;
              }
            }
          }
        } else if (user.environment_name.indexOf('Slushy Shoreline') > -1)
          selectIcebergPhase.value = 'SLUSHY';
      }
      nIndex = arrOrder.indexOf(selectIcebergPhase.value);
      selectIcebergBase.value = storageValue.base[nIndex];
      selectIcebergTrinket.value = storageValue.trinket[nIndex];
      selectIcebergBait.value = storageValue.bait[nIndex];
    }
  }

  function saveFGAR() {
    let selectFGARSublocation = document.getElementById(
      'selectFGARSublocation'
    );
    let selectFGARWeapon = document.getElementById('selectFGARWeapon');
    let selectFGARBase = document.getElementById('selectFGARBase');
    let selectFGARTrinket = document.getElementById('selectFGARTrinket');
    let selectFGARBait = document.getElementById('selectFGARBait');
    let storageValue = window.localStorage.getItem('FG_AR');
    if (isNullOrUndefined(storageValue))
      storageValue = JSON.stringify(objDefaultFGAR);
    storageValue = JSON.parse(storageValue);
    let nIndex = storageValue.order.indexOf(selectFGARSublocation.value);
    storageValue.weapon[nIndex] = selectFGARWeapon.value;
    storageValue.base[nIndex] = selectFGARBase.value;
    storageValue.trinket[nIndex] = selectFGARTrinket.value;
    storageValue.bait[nIndex] = selectFGARBait.value;
    window.localStorage.setItem('FG_AR', JSON.stringify(storageValue));
  }

  function initControlsFGAR(bAutoChangeSublocation) {
    if (isNullOrUndefined(bAutoChangeSublocation))
      bAutoChangeSublocation = false;
    let selectFGARSublocation = document.getElementById(
      'selectFGARSublocation'
    );
    let selectFGARWeapon = document.getElementById('selectFGARWeapon');
    let selectFGARBase = document.getElementById('selectFGARBase');
    let selectFGARTrinket = document.getElementById('selectFGARTrinket');
    let selectFGARBait = document.getElementById('selectFGARBait');
    let storageValue = window.localStorage.getItem('FG_AR');
    if (isNullOrUndefined(storageValue))
      storageValue = JSON.stringify(objDefaultFGAR);
    storageValue = JSON.parse(storageValue);
    let nIndex = -1;
    if (bAutoChangeSublocation && !isNullOrUndefined(user))
      selectFGARSublocation.value =
        user.environment_name.indexOf('Acolyte Realm') > -1 ? 'AR' : 'FG';
    nIndex = storageValue.order.indexOf(selectFGARSublocation.value);
    selectFGARWeapon.value = storageValue.weapon[nIndex];
    selectFGARBase.value = storageValue.base[nIndex];
    selectFGARTrinket.value = storageValue.trinket[nIndex];
    selectFGARBait.value = storageValue.bait[nIndex];
  }

  function saveBCJOD() {
    let selectBCJODSublocation = document.getElementById(
      'selectBCJODSublocation'
    );
    let selectBCJODWeapon = document.getElementById('selectBCJODWeapon');
    let selectBCJODBase = document.getElementById('selectBCJODBase');
    let selectBCJODTrinket = document.getElementById('selectBCJODTrinket');
    let selectBCJODBait = document.getElementById('selectBCJODBait');
    let storageValue = window.localStorage.getItem('BC_JOD');
    if (isNullOrUndefined(storageValue))
      storageValue = JSON.stringify(objDefaultBCJOD);
    storageValue = JSON.parse(storageValue);
    let nIndex = storageValue.order.indexOf(selectBCJODSublocation.value);
    storageValue.weapon[nIndex] = selectBCJODWeapon.value;
    storageValue.base[nIndex] = selectBCJODBase.value;
    storageValue.trinket[nIndex] = selectBCJODTrinket.value;
    storageValue.bait[nIndex] = selectBCJODBait.value;
    window.localStorage.setItem('BC_JOD', JSON.stringify(storageValue));
  }

  function initControlsBCJOD(bAutoChangeSublocation) {
    if (isNullOrUndefined(bAutoChangeSublocation))
      bAutoChangeSublocation = false;
    let selectBCJODSublocation = document.getElementById(
      'selectBCJODSublocation'
    );
    let selectBCJODWeapon = document.getElementById('selectBCJODWeapon');
    let selectBCJODBase = document.getElementById('selectBCJODBase');
    let selectBCJODTrinket = document.getElementById('selectBCJODTrinket');
    let selectBCJODBait = document.getElementById('selectBCJODBait');
    let storageValue = window.localStorage.getItem('BC_JOD');
    if (isNullOrUndefined(storageValue))
      storageValue = JSON.stringify(objDefaultBCJOD);
    storageValue = JSON.parse(storageValue);
    let nIndex = -1;
    if (bAutoChangeSublocation && !isNullOrUndefined(user))
      // prettier-ignore
      selectBCJODSublocation.value =
        user.environment_name.indexOf("Balack\'s Cove") > -1 ? "LOW" : "JOD";
    nIndex = storageValue.order.indexOf(selectBCJODSublocation.value);
    selectBCJODWeapon.value = storageValue.weapon[nIndex];
    selectBCJODBase.value = storageValue.base[nIndex];
    selectBCJODTrinket.value = storageValue.trinket[nIndex];
    selectBCJODBait.value = storageValue.bait[nIndex];
  }

  function onSelectBWRiftForceActiveQuantum() {
    saveBWRift();
    initControlsBWRift();
  }

  function onSelectBWRiftForceDeactiveQuantum() {
    saveBWRift();
    initControlsBWRift();
  }

  function onInputRemaininigLootAChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveBWRift();
  }

  function onInputRemaininigLootDChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveBWRift();
  }

  function onSelectBWRiftChoosePortal() {
    saveBWRift();
    initControlsBWRift();
  }

  function onInputMinTimeSandChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveBWRift();
  }

  function onSelectBWRiftMinRSCType() {
    saveBWRift();
    initControlsBWRift();
  }

  function onInputMinRSCChanged(input) {
    input.value = limitMinMax(input.value, input.min, input.max);
    saveBWRift();
  }

  function saveBWRift() {
    const selectBWRiftChamber = document.getElementById('selectBWRiftChamber');
    const selectBWRiftWeapon = document.getElementById('selectBWRiftWeapon');
    const selectBWRiftBase = document.getElementById('selectBWRiftBase');
    const selectBWRiftBait = document.getElementById('selectBWRiftBait');
    const selectBWRiftTrinket = document.getElementById('selectBWRiftTrinket');
    const selectBWRiftActivatePocketWatch = document.getElementById(
      'selectBWRiftActivatePocketWatch'
    );
    const selectBWRiftCleaverStatus = document.getElementById(
      'selectBWRiftCleaverStatus'
    );
    const selectBWRiftAlertLvl = document.getElementById(
      'selectBWRiftAlertLvl'
    );
    const selectBWRiftWeaponSpecial = document.getElementById(
      'selectBWRiftWeaponSpecial'
    );
    const selectBWRiftBaseSpecial = document.getElementById(
      'selectBWRiftBaseSpecial'
    );
    const selectBWRiftBaitSpecial = document.getElementById(
      'selectBWRiftBaitSpecial'
    );
    const selectBWRiftTrinketSpecial = document.getElementById(
      'selectBWRiftTrinketSpecial'
    );
    const selectBWRiftActivatePocketWatchSpecial = document.getElementById(
      'selectBWRiftActivatePocketWatchSpecial'
    );
    const selectBWRiftForceActiveQuantum = document.getElementById(
      'selectBWRiftForceActiveQuantum'
    );
    const inputRemainingLootA = document.getElementById('inputRemainingLootA');
    const selectBWRiftForceDeactiveQuantum = document.getElementById(
      'selectBWRiftForceDeactiveQuantum'
    );
    const inputRemainingLootD = document.getElementById('inputRemainingLootD');
    const selectBWRiftChoosePortal = document.getElementById(
      'selectBWRiftChoosePortal'
    );
    const selectBWRiftTravelTo = document.getElementById(
      'selectBWRiftTravelTo'
    );
    const selectBWRiftChoosePortalAfterCC = document.getElementById(
      'selectBWRiftChoosePortalAfterCC'
    );
    const selectBWRiftPriority = document.getElementById(
      'selectBWRiftPriority'
    );
    const selectBWRiftPortal = document.getElementById('selectBWRiftPortal');
    const selectBWRiftPriorityCursed = document.getElementById(
      'selectBWRiftPriorityCursed'
    );
    const selectBWRiftPortalCursed = document.getElementById(
      'selectBWRiftPortalCursed'
    );
    const selectBWRiftBuffCurse = document.getElementById(
      'selectBWRiftBuffCurse'
    );
    const inputMinTimeSand = document.getElementById('inputMinTimeSand');
    const selectBWRiftMinRSCType = document.getElementById(
      'selectBWRiftMinRSCType'
    );
    const inputMinRSC = document.getElementById('inputMinRSC');
    const selectBWRiftEnterWCurse = document.getElementById(
      'selectBWRiftEnterWCurse'
    );
    let storageValue = window.localStorage.getItem('BWRift');
    if (isNullOrUndefined(storageValue))
      storageValue = JSON.stringify(objDefaultBWRift);
    storageValue = JSON.parse(storageValue);
    let nIndexCursed = selectBWRiftChamber.value.indexOf('_CURSED');
    let bCursed = nIndexCursed > -1;
    let strChamberName = bCursed
      ? selectBWRiftChamber.value.substr(0, nIndexCursed)
      : selectBWRiftChamber.value;
    let nIndex = storageValue.order.indexOf(strChamberName);
    if (nIndex < 0) nIndex = 0;
    if (bCursed) nIndex += 16;
    storageValue.master.weapon[nIndex] = selectBWRiftWeapon.value;
    storageValue.master.base[nIndex] = selectBWRiftBase.value;
    storageValue.master.bait[nIndex] = selectBWRiftBait.value;
    storageValue.master.trinket[nIndex] = selectBWRiftTrinket.value;
    storageValue.master.activate[nIndex] =
      selectBWRiftActivatePocketWatch.value == 'true';
    storageValue.specialActivate.forceActivate[nIndex] =
      selectBWRiftForceActiveQuantum.value == 'true';
    storageValue.specialActivate.remainingLootActivate[nIndex] = parseInt(
      inputRemainingLootA.value
    );
    storageValue.specialActivate.forceDeactivate[nIndex] =
      selectBWRiftForceDeactiveQuantum.value == 'true';
    storageValue.specialActivate.remainingLootDeactivate[nIndex] = parseInt(
      inputRemainingLootD.value
    );
    let strTemp = '';
    if (
      strChamberName == 'GEARWORKS' ||
      strChamberName == 'ANCIENT' ||
      strChamberName == 'RUNIC'
    ) {
      nIndex = selectBWRiftCleaverStatus.selectedIndex;
      if (bCursed) nIndex += 2;
      if (strChamberName == 'GEARWORKS') strTemp = 'gw';
      else if (strChamberName == 'ANCIENT') strTemp = 'al';
      else strTemp = 'rl';
    } else if (strChamberName == 'GUARD') {
      nIndex = selectBWRiftAlertLvl.selectedIndex;
      if (bCursed) nIndex += 7;
      strTemp = 'gb';
    } else strTemp = 'master';
    /*else if(strChamberName == 'INGRESS'){
            nIndex = selectBWRiftFTC.selectedIndex;
            if(bCursed)
                nIndex += 4;
            strTemp = 'ic';
        }
        else if(strChamberName == 'FROZEN'){
            nIndex = selectBWRiftHunt.selectedIndex;
            if(bCursed)
                nIndex += 16;
            strTemp = 'fa';
        }*/
    if (strTemp !== 'master') {
      storageValue[strTemp].weapon[nIndex] = selectBWRiftWeaponSpecial.value;
      storageValue[strTemp].base[nIndex] = selectBWRiftBaseSpecial.value;
      storageValue[strTemp].bait[nIndex] = selectBWRiftBaitSpecial.value;
      storageValue[strTemp].trinket[nIndex] = selectBWRiftTrinketSpecial.value;
      if (selectBWRiftActivatePocketWatchSpecial.value == 'MASTER')
        storageValue[strTemp].activate[nIndex] =
          selectBWRiftActivatePocketWatchSpecial.value;
      else
        storageValue[strTemp].activate[nIndex] =
          selectBWRiftActivatePocketWatchSpecial.value == 'true';
    }
    storageValue.minRSCType = selectBWRiftMinRSCType.value;
    storageValue.minRSC = parseInt(inputMinRSC.value);
    storageValue.travelTo = selectBWRiftTravelTo.value;
    storageValue.choosePortal = selectBWRiftChoosePortal.value == 'true';
    if (storageValue.choosePortal) {
      storageValue.choosePortalAfterCC =
        selectBWRiftChoosePortalAfterCC.value == 'true';
      storageValue.priorities[selectBWRiftPriority.selectedIndex] =
        selectBWRiftPortal.value;
      storageValue.prioritiesCursed[selectBWRiftPriorityCursed.selectedIndex] =
        selectBWRiftPortalCursed.value;
      nIndex = parseInt(selectBWRiftBuffCurse.value);
      storageValue.minTimeSand[nIndex] = parseInt(inputMinTimeSand.value);
      storageValue.enterMinigameWCurse =
        selectBWRiftEnterWCurse.value == 'true';
    }
    window.localStorage.setItem('BWRift', JSON.stringify(storageValue));
  }

  function initControlsBWRift(bAutoChangeChamber) {
    if (isNullOrUndefined(bAutoChangeChamber)) bAutoChangeChamber = false;
    const selectBWRiftChamber = document.getElementById('selectBWRiftChamber');
    const selectBWRiftWeapon = document.getElementById('selectBWRiftWeapon');
    const selectBWRiftBase = document.getElementById('selectBWRiftBase');
    const selectBWRiftBait = document.getElementById('selectBWRiftBait');
    const selectBWRiftTrinket = document.getElementById('selectBWRiftTrinket');
    const selectBWRiftActivatePocketWatch = document.getElementById(
      'selectBWRiftActivatePocketWatch'
    );
    const selectBWRiftCleaverStatus = document.getElementById(
      'selectBWRiftCleaverStatus'
    );
    const selectBWRiftAlertLvl = document.getElementById(
      'selectBWRiftAlertLvl'
    );
    const selectBWRiftFTC = document.getElementById('selectBWRiftFTC');
    const selectBWRiftHunt = document.getElementById('selectBWRiftHunt');
    const selectBWRiftWeaponSpecial = document.getElementById(
      'selectBWRiftWeaponSpecial'
    );
    const selectBWRiftBaseSpecial = document.getElementById(
      'selectBWRiftBaseSpecial'
    );
    const selectBWRiftBaitSpecial = document.getElementById(
      'selectBWRiftBaitSpecial'
    );
    const selectBWRiftTrinketSpecial = document.getElementById(
      'selectBWRiftTrinketSpecial'
    );
    const selectBWRiftActivatePocketWatchSpecial = document.getElementById(
      'selectBWRiftActivatePocketWatchSpecial'
    );
    const selectBWRiftForceActiveQuantum = document.getElementById(
      'selectBWRiftForceActiveQuantum'
    );
    const inputRemainingLootA = document.getElementById('inputRemainingLootA');
    const selectBWRiftForceDeactiveQuantum = document.getElementById(
      'selectBWRiftForceDeactiveQuantum'
    );
    const inputRemainingLootD = document.getElementById('inputRemainingLootD');
    const selectBWRiftChoosePortal = document.getElementById(
      'selectBWRiftChoosePortal'
    );
    const selectBWRiftTravelTo = document.getElementById(
      'selectBWRiftTravelTo'
    );
    const selectBWRiftChoosePortalAfterCC = document.getElementById(
      'selectBWRiftChoosePortalAfterCC'
    );
    const selectBWRiftPriority = document.getElementById(
      'selectBWRiftPriority'
    );
    const selectBWRiftPriorityCursed = document.getElementById(
      'selectBWRiftPriorityCursed'
    );
    const selectBWRiftPortal = document.getElementById('selectBWRiftPortal');
    const selectBWRiftBuffCurse = document.getElementById(
      'selectBWRiftBuffCurse'
    );
    const inputMinTimeSand = document.getElementById('inputMinTimeSand');
    const selectBWRiftMinRSCType = document.getElementById(
      'selectBWRiftMinRSCType'
    );
    const inputMinRSC = document.getElementById('inputMinRSC');
    const selectBWRiftEnterWCurse = document.getElementById(
      'selectBWRiftEnterWCurse'
    );
    let storageValue = window.localStorage.getItem('BWRift');
    if (isNullOrUndefined(storageValue))
      storageValue = JSON.stringify(objDefaultBWRift);
    storageValue = JSON.parse(storageValue);
    let nIndex = -1;
    let bCursed = false;
    if (
      bAutoChangeChamber &&
      !isNullOrUndefined(user) &&
      user.environment_name.indexOf('Bristle Woods Rift') > -1
    ) {
      if (
        !(
          user.quests.QuestRiftBristleWoods.status_effects.un.indexOf(
            'default'
          ) > -1 ||
          user.quests.QuestRiftBristleWoods.status_effects.un.indexOf(
            'remove'
          ) > -1
        ) ||
        !(
          user.quests.QuestRiftBristleWoods.status_effects.fr.indexOf(
            'default'
          ) > -1 ||
          user.quests.QuestRiftBristleWoods.status_effects.fr.indexOf(
            'remove'
          ) > -1
        ) ||
        !(
          user.quests.QuestRiftBristleWoods.status_effects.st.indexOf(
            'default'
          ) > -1 ||
          user.quests.QuestRiftBristleWoods.status_effects.st.indexOf(
            'remove'
          ) > -1
        )
      )
        bCursed = true;
      let nRemaining = user.quests.QuestRiftBristleWoods.progress_remaining;
      if (nRemaining > 0) {
        let strName = user.quests.QuestRiftBristleWoods.chamber_name
          .split(' ')[0]
          .toUpperCase();
        if (strName == 'ACOLYTE') {
          if (
            user.quests.QuestRiftBristleWoods.minigame.acolyte_chamber
              .obelisk_charge < 100
          )
            nIndex = storageValue.order.indexOf('ACOLYTE_CHARGING');
          else if (
            user.quests.QuestRiftBristleWoods.minigame.acolyte_chamber
              .acolyte_sand > 0
          )
            nIndex = storageValue.order.indexOf('ACOLYTE_DRAINING');
          else nIndex = storageValue.order.indexOf('ACOLYTE_DRAINED');
        } else nIndex = storageValue.order.indexOf(strName);
        if (nIndex > -1) selectBWRiftChamber.value = storageValue.order[nIndex];
      } else selectBWRiftChamber.value = 'NONE';
      if (bCursed) selectBWRiftChamber.value += '_CURSED';
    }
    let nIndexCursed = selectBWRiftChamber.value.indexOf('_CURSED');
    bCursed = nIndexCursed > -1;
    let strChamberName = bCursed
      ? selectBWRiftChamber.value.substr(0, nIndexCursed)
      : selectBWRiftChamber.value;
    nIndex = storageValue.order.indexOf(strChamberName);
    if (nIndex < 0) nIndex = 0;
    if (bCursed) nIndex += 16;
    selectBWRiftWeapon.value = storageValue.master.weapon[nIndex];
    selectBWRiftBase.value = storageValue.master.base[nIndex];
    selectBWRiftTrinket.value = storageValue.master.trinket[nIndex];
    selectBWRiftBait.value = storageValue.master.bait[nIndex];
    selectBWRiftActivatePocketWatch.value =
      storageValue.master.activate[nIndex] === true ? 'true' : 'false';
    selectBWRiftForceActiveQuantum.value =
      storageValue.specialActivate.forceActivate[nIndex] === true
        ? 'true'
        : 'false';
    inputRemainingLootA.value =
      storageValue.specialActivate.remainingLootActivate[nIndex];
    inputRemainingLootA.disabled =
      selectBWRiftForceActiveQuantum.value == 'true' ? '' : 'disabled';
    selectBWRiftForceDeactiveQuantum.value =
      storageValue.specialActivate.forceDeactivate[nIndex] === true
        ? 'true'
        : 'false';
    inputRemainingLootD.value =
      storageValue.specialActivate.remainingLootDeactivate[nIndex];
    inputRemainingLootD.disabled =
      selectBWRiftForceDeactiveQuantum.value == 'true' ? '' : 'disabled';
    let strTemp = '';
    if (
      strChamberName == 'GEARWORKS' ||
      strChamberName == 'ANCIENT' ||
      strChamberName == 'RUNIC'
    ) {
      nIndex = selectBWRiftCleaverStatus.selectedIndex;
      if (bCursed) nIndex += 2;
      if (strChamberName == 'GEARWORKS') strTemp = 'gw';
      else if (strChamberName == 'ANCIENT') strTemp = 'al';
      else strTemp = 'rl';
      selectBWRiftCleaverStatus.style.display = '';
      selectBWRiftAlertLvl.style.display = 'none';
      selectBWRiftFTC.style.display = 'none';
      selectBWRiftHunt.style.display = 'none';
    } else if (strChamberName == 'GUARD') {
      nIndex = selectBWRiftAlertLvl.selectedIndex;
      if (bCursed) nIndex += 7;
      strTemp = 'gb';
      selectBWRiftCleaverStatus.style.display = 'none';
      selectBWRiftAlertLvl.style.display = '';
      selectBWRiftFTC.style.display = 'none';
      selectBWRiftHunt.style.display = 'none';
    } else {
      /*else if(strChamberName == 'INGRESS'){
            nIndex = selectBWRiftFTC.selectedIndex;
            if(bCursed)
                nIndex += 4;
            strTemp = 'ic';
            selectBWRiftAlertLvl.style.display = 'none';
            selectBWRiftFTC.style.display = '';
            selectBWRiftHunt.style.display = 'none';
        }
        else if(strChamberName == 'FROZEN'){
            nIndex = selectBWRiftHunt.selectedIndex;
            if(bCursed)
                nIndex += 16;
            strTemp = 'fa';
            selectBWRiftAlertLvl.style.display = 'none';
            selectBWRiftFTC.style.display = 'none';
            selectBWRiftHunt.style.display = '';
        }*/
      strTemp = 'master';
      selectBWRiftAlertLvl.style.display = 'none';
      selectBWRiftFTC.style.display = 'none';
      selectBWRiftHunt.style.display = 'none';
    }
    if (strTemp == 'master')
      document.getElementById('trBWRiftTrapSetupSpecial').style.display =
        'none';
    else {
      selectBWRiftWeaponSpecial.value = storageValue[strTemp].weapon[nIndex];
      selectBWRiftBaseSpecial.value = storageValue[strTemp].base[nIndex];
      selectBWRiftTrinketSpecial.value = storageValue[strTemp].trinket[nIndex];
      selectBWRiftBaitSpecial.value = storageValue[strTemp].bait[nIndex];
      if (storageValue[strTemp].activate[nIndex] == 'MASTER')
        selectBWRiftActivatePocketWatchSpecial.value =
          storageValue[strTemp].activate[nIndex];
      else
        selectBWRiftActivatePocketWatchSpecial.value =
          storageValue[strTemp].activate[nIndex] === true ? 'true' : 'false';
      document.getElementById('trBWRiftTrapSetupSpecial').style.display = '';
    }
    selectBWRiftTravelTo.value = storageValue.travelTo;
    selectBWRiftChoosePortal.value =
      storageValue.choosePortal === true ? 'true' : 'false';
    selectBWRiftChoosePortalAfterCC.value =
      storageValue.choosePortalAfterCC === true ? 'true' : 'false';
    selectBWRiftPortal.value =
      storageValue.priorities[selectBWRiftPriority.selectedIndex];
    selectBWRiftPortalCursed.value =
      storageValue.prioritiesCursed[selectBWRiftPriorityCursed.selectedIndex];
    nIndex = parseInt(selectBWRiftBuffCurse.value);
    inputMinTimeSand.value = storageValue.minTimeSand[nIndex];
    selectBWRiftMinRSCType.value = storageValue.minRSCType;
    inputMinRSC.value = storageValue.minRSC;
    selectBWRiftEnterWCurse.value =
      storageValue.enterMinigameWCurse === true ? 'true' : 'false';
    if (selectBWRiftChoosePortal.value == 'true') {
      document.getElementById('trBWRiftChoosePortalAfterCC').style.display = '';
      document.getElementById('trBWRiftPortalPriority').style.display = '';
      document.getElementById('trBWRiftPortalPriorityCursed').style.display =
        '';
      document.getElementById('trBWRiftMinTimeSand').style.display = '';
      document.getElementById('trBWRiftEnterMinigame').style.display = '';
      document.getElementById('trBWRiftMinRSC').style.display = '';
    } else {
      document.getElementById('trBWRiftChoosePortalAfterCC').style.display =
        'none';
      document.getElementById('trBWRiftPortalPriority').style.display = 'none';
      document.getElementById('trBWRiftPortalPriorityCursed').style.display =
        'none';
      document.getElementById('trBWRiftMinTimeSand').style.display = 'none';
      document.getElementById('trBWRiftEnterMinigame').style.display = 'none';
      document.getElementById('trBWRiftMinRSC').style.display = 'none';
    }
    inputMinRSC.style.display =
      selectBWRiftMinRSCType.value == 'NUMBER' ? '' : 'none';
  }

  /**
   * 從localStorage用key 'fort_rox'取儲存的設定.
   * 如果取得的設定isNullOrUndefined,
   * 則使用預設值(轉json):weapon、base皆為空,
   * charm為'None',bait為Gouda,
   * 啟用mage tower為false,
   * 滿血時停用mage tower為true.
   * 設定值中每個屬性都是長度7的陣列.
   * parse 設定值(json)後
   * 用畫面上的phase下拉選單的值
   * 比對設定值物件的order找出被選中phase的index,
   * 將畫面其他下拉選單同樣index的值
   * assign給設定值中對應屬性(陣列)相同index的位置.
   * 將設定值轉json後用 key 'fort_rox'存入localStorage
   */
  function saveFRox() {
    const selectFRoxStage = document.getElementById('selectFRoxStage');
    const selectFRoxWeapon = document.getElementById('selectFRoxWeapon');
    const selectFRoxBase = document.getElementById('selectFRoxBase');
    const selectFRoxBait = document.getElementById('selectFRoxBait');
    const selectFRoxTrinket = document.getElementById('selectFRoxTrinket');
    const selectFRoxActivateTower = document.getElementById(
      'selectFRoxActivateTower'
    );
    const selectFRoxFullHPDeactivate = document.getElementById(
      'selectFRoxFullHPDeactivate'
    );
    const selectFRoxCharmOnHighDamage = document.getElementById(
      'selectFRoxCharmOnHighDamage'
    );
    const inputHighDamageRate = document.getElementById('inputHighDamageRate');
    const inputStopAtHunts = document.getElementById('inputStopAtHunts');
    const selectFRoxTravelTo = document.getElementById('selectFRoxTravelTo');
    let storageValue = window.localStorage.getItem('fort_rox');
    if (isNullOrUndefined(storageValue)) {
      // Fort Rox的預設設定.在 fortRox()那邊也有同樣的宣告.
      const objDefaultFRox = {
        meteoriteMoreThan: 540,
        howliteLessThan: 9999,
        bloodStoneLessThan: 9999,
        enterAfterTime: '',
        maxHpUse: 120,
        fullHPDeactivate: true,
        charmOnHighDamage: '',
        highDamageRate: 99,
        stopAtHunts: 1,
        travelTo: '',
        stage: [
          'day',
          'stage_one',
          'stage_two',
          'stage_three',
          'stage_four',
          'stage_five',
          'dawn',
          'lair'
        ],
        order: [
          'day',
          'twilight',
          'midnight',
          'pitch',
          'utter',
          'first',
          'dawn',
          'lair'
        ],
        weapon: new Array(8).fill(''),
        base: new Array(8).fill(''),
        trinket: new Array(8).fill('None'),
        bait: [
          'Gouda Cheese',
          'Crescent Cheese',
          'Crescent Cheese',
          'Crescent Cheese',
          'Crescent Cheese',
          'Crescent Cheese',
          'Crescent Cheese',
          'Sunrise Cheese'
        ],
        activate: new Array(8).fill(false)
      };
      storageValue = JSON.stringify(objDefaultFRox);
    }
    storageValue = JSON.parse(storageValue);
    let nIndex = storageValue.order.indexOf(selectFRoxStage.value);
    if (nIndex < 0) nIndex = 0;
    storageValue.weapon[nIndex] = selectFRoxWeapon.value;
    storageValue.base[nIndex] = selectFRoxBase.value;
    storageValue.bait[nIndex] = selectFRoxBait.value;
    storageValue.trinket[nIndex] = selectFRoxTrinket.value;
    storageValue.activate[nIndex] = selectFRoxActivateTower.value == 'true';
    storageValue.fullHPDeactivate = selectFRoxFullHPDeactivate.value == 'true';
    storageValue.charmOnHighDamage = selectFRoxCharmOnHighDamage.value;
    storageValue.highDamageRate = parseInt(inputHighDamageRate.value);
    storageValue.stopAtHunts = parseInt(inputStopAtHunts.value);
    storageValue.travelTo = selectFRoxTravelTo.value;
    window.localStorage.setItem('fort_rox', JSON.stringify(storageValue));
  }

  /**
   * 如果 bAutoChangeStage isNullOrUndefined
   * 則將 bAutoChangeStage設為 false.
   * 用 id取得stage、weapon、base、charm、
   * 是否啟用 mage tower及滿血停用 mage tower
   * 的 HTML elements.
   * 用 key 'fort_rox'從localStorage取出設定值字串.
   * 如果設定值字串 isNullOrUndefined,
   * 將HTML elements的值設為未設定(下拉選單是將
   * selectedIndex設為-1).
   * 如果設定值字串不是 isNullOrUndefined,
   * json parse出設定值.
   * 如果 bAutoChangeStage為 true且所在區域為
   * Fort Rox,判斷目前進度(DAWN,night all phase
   *  or DAY).
   * 找出目前進度在設定值 object的 order屬性(array)
   * 的 index,再用這個 index把其他設定同 index的值
   * 帶到相對應的 HTML element顯示出來
   * @param {Boolean} bAutoChangeStage
   */
  function initControlsFRox(bAutoChangeStage) {
    if (isNullOrUndefined(bAutoChangeStage)) bAutoChangeStage = false;
    const selectFRoxStage = document.getElementById('selectFRoxStage');
    const selectFRoxWeapon = document.getElementById('selectFRoxWeapon');
    const selectFRoxBase = document.getElementById('selectFRoxBase');
    const selectFRoxBait = document.getElementById('selectFRoxBait');
    const selectFRoxTrinket = document.getElementById('selectFRoxTrinket');
    const selectFRoxActivateTower = document.getElementById(
      'selectFRoxActivateTower'
    );
    const selectFRoxFullHPDeactivate = document.getElementById(
      'selectFRoxFullHPDeactivate'
    );
    const selectFRoxCharmOnHighDamage = document.getElementById(
      'selectFRoxCharmOnHighDamage'
    );
    const inputHighDamageRate = document.getElementById('inputHighDamageRate');
    const inputStopAtHunts = document.getElementById('inputStopAtHunts');
    const selectFRoxTravelTo = document.getElementById('selectFRoxTravelTo');
    let storageValue = window.localStorage.getItem('fort_rox');
    if (isNullOrUndefined(storageValue)) {
      selectFRoxWeapon.selectedIndex = -1;
      selectFRoxBase.selectedIndex = -1;
      selectFRoxBait.selectedIndex = -1;
      selectFRoxTrinket.selectedIndex = -1;
      selectFRoxActivateTower.selectedIndex = -1;
      selectFRoxFullHPDeactivate.selectedIndex = -1;
      selectFRoxCharmOnHighDamage.selectedIndex = -1;
      inputHighDamageRate.value = 4;
      inputStopAtHunts.value = 0;
      selectFRoxTravelTo.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      let nIndex = -1;
      if (
        bAutoChangeStage &&
        !isNullOrUndefined(user) &&
        user.environment_name.indexOf('Fort Rox') > -1
      ) {
        if (user.quests.QuestFortRox.is_dawn === true)
          selectFRoxStage.value = 'dawn';
        else if (user.quests.QuestFortRox.current_phase == 'night') {
          nIndex = storageValue.stage.indexOf(
            user.quests.QuestFortRox.current_stage
          );
          if (nIndex > -1) selectFRoxStage.value = storageValue.order[nIndex];
        } else if (user.quests.QuestFortRox.is_day === true) {
          selectFRoxStage.value = 'day';
        } else if (user.quests.QuestFortRox.is_lair === true) {
          selectFRoxStage.value = 'lair';
        }
      }
      nIndex = storageValue.order.indexOf(selectFRoxStage.value);
      if (nIndex < 0) nIndex = 0;
      selectFRoxWeapon.value = storageValue.weapon[nIndex];
      selectFRoxBase.value = storageValue.base[nIndex];
      selectFRoxTrinket.value = storageValue.trinket[nIndex];
      selectFRoxBait.value = storageValue.bait[nIndex];
      selectFRoxActivateTower.value =
        storageValue.activate[nIndex] === true ? 'true' : 'false';
      selectFRoxFullHPDeactivate.value =
        storageValue.fullHPDeactivate === true ? 'true' : 'false';
      selectFRoxCharmOnHighDamage.value = storageValue.charmOnHighDamage;
      inputHighDamageRate.value = storageValue.highDamageRate;
      inputStopAtHunts.value = storageValue.stopAtHunts;
      selectFRoxTravelTo.value = storageValue.travelTo;
    }
  }

  function onSelectWWRiftFaction() {
    onInputMinRageChanged(document.getElementById('inputMinRage'));
  }

  function onInputMinRageChanged(input) {
    let selectWWRiftFaction = document.getElementById('selectWWRiftFaction');
    let nMin = selectWWRiftFaction.value == 'MBW_45_48' ? 45 : input.min;
    let nMax = selectWWRiftFaction.value == 'MBW_40_44' ? 44 : input.max;
    input.value = limitMinMax(input.value, nMin, nMax);
    saveWWRift();
    initControlsWWRift();
  }

  function saveWWRift() {
    const inputWWRiftStartMBW = document.getElementById('inputWWRiftStartMBW');
    const inputWWRiftStartFunnel = document.getElementById(
      'inputWWRiftStartFunnel'
    );
    const inputWWRiftStopFunnel = document.getElementById(
      'inputWWRiftStopFunnel'
    );
    const selectWWRiftSaveFunnelCharm = document.getElementById(
      'selectWWRiftSaveFunnelCharm'
    );
    const selectWWRiftTravelTo = document.getElementById(
      'selectWWRiftTravelTo'
    );
    const selectWWRiftFaction = document.getElementById('selectWWRiftFaction');
    const selectWWRiftFactionNext = document.getElementById(
      'selectWWRiftFactionNext'
    );
    const selectWWRiftRage = document.getElementById('selectWWRiftRage');
    const selectWWRiftTrapWeapon = document.getElementById(
      'selectWWRiftTrapWeapon'
    );
    const selectWWRiftTrapBase = document.getElementById(
      'selectWWRiftTrapBase'
    );
    const selectWWRiftTrapTrinket = document.getElementById(
      'selectWWRiftTrapTrinket'
    );
    const selectWWRiftTrapBait = document.getElementById(
      'selectWWRiftTrapBait'
    );
    const selectWWRiftMBWBar4044 = document.getElementById(
      'selectWWRiftMBWBar4044'
    );
    const selectWWRiftMBWBar4548 = document.getElementById(
      'selectWWRiftMBWBar4548'
    );
    const selectWWRiftMBWTrapWeapon = document.getElementById(
      'selectWWRiftMBWTrapWeapon'
    );
    const selectWWRiftMBWTrapBase = document.getElementById(
      'selectWWRiftMBWTrapBase'
    );
    const selectWWRiftMBWTrapTrinket = document.getElementById(
      'selectWWRiftMBWTrapTrinket'
    );
    const selectWWRiftMBWTrapBait = document.getElementById(
      'selectWWRiftMBWTrapBait'
    );
    let inputMinRage = document.getElementById('inputMinRage');
    let storageValue = window.localStorage.getItem('WWRift');
    if (isNullOrUndefined(storageValue)) {
      const objDefaultWWRift = {
        factionFocus: 'CC',
        startMBW: 25,
        startFunnel: 20,
        stopFunnel: 0,
        saveFunnelCharm: 'true',
        travelTo: '',
        factionFocusNext: 'Remain',
        faction: {
          weapon: new Array(3).fill('best.weapon.rift'),
          base: new Array(3).fill('best.base.rift'),
          trinket: new Array(3).fill('None'),
          bait: new Array(3).fill('Brie String')
        },
        MBW: {
          minRageLLC: 40,
          rage4044: {
            weapon: new Array(7).fill('best.weapon.rift'),
            base: new Array(7).fill('best.base.rift'),
            trinket: new Array(7).fill('None'),
            bait: new Array(7).fill('Brie String')
          },
          rage4548: {
            weapon: new Array(13).fill('best.weapon.rift'),
            base: new Array(13).fill('best.base.rift'),
            trinket: new Array(13).fill('None'),
            bait: new Array(13).fill('Brie String')
          }
        }
      };
      storageValue = JSON.stringify(objDefaultWWRift);
    }
    storageValue = JSON.parse(storageValue);
    storageValue.startMBW = parseInt(inputWWRiftStartMBW.value);
    storageValue.startFunnel = parseInt(inputWWRiftStartFunnel.value);
    storageValue.stopFunnel = parseInt(inputWWRiftStopFunnel.value);
    storageValue.saveFunnelCharm = selectWWRiftSaveFunnelCharm.value;
    storageValue.travelTo = selectWWRiftTravelTo.value;
    storageValue.factionFocus = selectWWRiftFaction.value;
    storageValue.factionFocusNext = selectWWRiftFactionNext.value;
    let nIndex = selectWWRiftRage.selectedIndex;
    if (nIndex < 0) nIndex = 0;
    storageValue.faction.weapon[nIndex] = selectWWRiftTrapWeapon.value;
    storageValue.faction.base[nIndex] = selectWWRiftTrapBase.value;
    storageValue.faction.trinket[nIndex] = selectWWRiftTrapTrinket.value;
    storageValue.faction.bait[nIndex] = selectWWRiftTrapBait.value;
    storageValue.MBW.minRageLLC = parseInt(inputMinRage.value);
    if (selectWWRiftFaction.value == 'MBW_40_44') {
      nIndex = selectWWRiftMBWBar4044.selectedIndex;
      if (nIndex < 0) nIndex = 0;
      storageValue.MBW.rage4044.weapon[nIndex] =
        selectWWRiftMBWTrapWeapon.value;
      storageValue.MBW.rage4044.base[nIndex] = selectWWRiftMBWTrapBase.value;
      storageValue.MBW.rage4044.trinket[nIndex] =
        selectWWRiftMBWTrapTrinket.value;
      storageValue.MBW.rage4044.bait[nIndex] = selectWWRiftMBWTrapBait.value;
    } else if (selectWWRiftFaction.value == 'MBW_45_48') {
      nIndex = selectWWRiftMBWBar4548.selectedIndex;
      if (nIndex < 0) nIndex = 0;
      storageValue.MBW.rage4548.weapon[nIndex] =
        selectWWRiftMBWTrapWeapon.value;
      storageValue.MBW.rage4548.base[nIndex] = selectWWRiftMBWTrapBase.value;
      storageValue.MBW.rage4548.trinket[nIndex] =
        selectWWRiftMBWTrapTrinket.value;
      storageValue.MBW.rage4548.bait[nIndex] = selectWWRiftMBWTrapBait.value;
    }
    window.localStorage.setItem('WWRift', JSON.stringify(storageValue));
  }

  function initControlsWWRift(bAutoChangeRageLevel) {
    if (isNullOrUndefined(bAutoChangeRageLevel)) bAutoChangeRageLevel = false;
    const inputWWRiftStartMBW = document.getElementById('inputWWRiftStartMBW');
    const inputWWRiftStartFunnel = document.getElementById(
      'inputWWRiftStartFunnel'
    );
    const inputWWRiftStopFunnel = document.getElementById(
      'inputWWRiftStopFunnel'
    );
    const selectWWRiftSaveFunnelCharm = document.getElementById(
      'selectWWRiftSaveFunnelCharm'
    );
    const selectWWRiftTravelTo = document.getElementById(
      'selectWWRiftTravelTo'
    );
    const selectWWRiftFaction = document.getElementById('selectWWRiftFaction');
    const selectWWRiftFactionNext = document.getElementById(
      'selectWWRiftFactionNext'
    );
    const selectWWRiftRage = document.getElementById('selectWWRiftRage');
    const selectWWRiftTrapWeapon = document.getElementById(
      'selectWWRiftTrapWeapon'
    );
    const selectWWRiftTrapBase = document.getElementById(
      'selectWWRiftTrapBase'
    );
    const selectWWRiftTrapTrinket = document.getElementById(
      'selectWWRiftTrapTrinket'
    );
    const selectWWRiftTrapBait = document.getElementById(
      'selectWWRiftTrapBait'
    );
    const selectWWRiftMBWBar4044 = document.getElementById(
      'selectWWRiftMBWBar4044'
    );
    const selectWWRiftMBWBar4548 = document.getElementById(
      'selectWWRiftMBWBar4548'
    );
    const selectWWRiftMBWTrapWeapon = document.getElementById(
      'selectWWRiftMBWTrapWeapon'
    );
    const selectWWRiftMBWTrapBase = document.getElementById(
      'selectWWRiftMBWTrapBase'
    );
    const selectWWRiftMBWTrapTrinket = document.getElementById(
      'selectWWRiftMBWTrapTrinket'
    );
    const selectWWRiftMBWTrapBait = document.getElementById(
      'selectWWRiftMBWTrapBait'
    );
    let inputMinRage = document.getElementById('inputMinRage');
    let storageValue = window.localStorage.getItem('WWRift');
    if (isNullOrUndefined(storageValue)) {
      inputWWRiftStartMBW.value = 25;
      inputWWRiftStartFunnel.value = 20;
      inputWWRiftStopFunnel.value = 0;
      selectWWRiftSaveFunnelCharm.selectedIndex = 0;
      selectWWRiftTravelTo.selectedIndex = 0;
      selectWWRiftFaction.selectedIndex = -1;
      selectWWRiftFactionNext.selectedIndex = 0;
      selectWWRiftRage.selectedIndex = 0;
      selectWWRiftTrapWeapon.selectedIndex = -1;
      selectWWRiftTrapBase.selectedIndex = -1;
      selectWWRiftTrapTrinket.selectedIndex = -1;
      selectWWRiftTrapBait.selectedIndex = -1;
      inputMinRage.value = 40;
      selectWWRiftMBWBar4044.selectedIndex = 0;
      selectWWRiftMBWBar4548.selectedIndex = 0;
      selectWWRiftMBWTrapWeapon.selectedIndex = -1;
      selectWWRiftMBWTrapBase.selectedIndex = -1;
      selectWWRiftMBWTrapTrinket.selectedIndex = -1;
      selectWWRiftMBWTrapBait.selectedIndex = -1;
    } else {
      storageValue = JSON.parse(storageValue);
      inputWWRiftStartMBW.value = storageValue.startMBW;
      inputWWRiftStartFunnel.value = storageValue.startFunnel;
      inputWWRiftStopFunnel.value = storageValue.stopFunnel;
      selectWWRiftSaveFunnelCharm.value = storageValue.saveFunnelCharm;
      selectWWRiftTravelTo.value = storageValue.travelTo;
      selectWWRiftFaction.value = storageValue.factionFocus;
      selectWWRiftFactionNext.value = storageValue.factionFocusNext;
      if (
        bAutoChangeRageLevel &&
        !isNullOrUndefined(user) &&
        user.environment_name.indexOf('Whisker Woods Rift') > -1
      ) {
        let arrOrder = ['CC', 'GGT', 'DL'];
        let arrRage = new Array(3);
        let classRage = document.getElementsByClassName(
          'riftWhiskerWoodsHUD-zone-rageLevel'
        );
        for (let i = 0; i < classRage.length; i++)
          arrRage[i] = parseInt(classRage[i].textContent);
        let temp = arrOrder.indexOf(storageValue.factionFocus);
        if (temp != -1 && Number.isInteger(arrRage[temp]))
          selectWWRiftRage.selectedIndex = Math.floor(arrRage[temp] / 25);
      }
      let nIndex =
        selectWWRiftRage.selectedIndex < 0 ? 0 : selectWWRiftRage.selectedIndex;
      selectWWRiftTrapWeapon.value = storageValue.faction.weapon[nIndex];
      selectWWRiftTrapBase.value = storageValue.faction.base[nIndex];
      selectWWRiftTrapTrinket.value = storageValue.faction.trinket[nIndex];
      selectWWRiftTrapBait.value = storageValue.faction.bait[nIndex];
      inputMinRage.value = storageValue.MBW.minRageLLC;
      let temp = '';
      if (selectWWRiftFaction.value == 'MBW_40_44') {
        nIndex =
          selectWWRiftMBWBar4044.selectedIndex < 0
            ? 0
            : selectWWRiftMBWBar4044.selectedIndex;
        temp = 'rage4044';
      } else if (selectWWRiftFaction.value == 'MBW_45_48') {
        nIndex =
          selectWWRiftMBWBar4548.selectedIndex < 0
            ? 0
            : selectWWRiftMBWBar4548.selectedIndex;
        temp = 'rage4548';
      }
      if (temp !== '') {
        selectWWRiftMBWTrapWeapon.value = storageValue.MBW[temp].weapon[nIndex];
        selectWWRiftMBWTrapBase.value = storageValue.MBW[temp].base[nIndex];
        selectWWRiftMBWTrapTrinket.value =
          storageValue.MBW[temp].trinket[nIndex];
        selectWWRiftMBWTrapBait.value = storageValue.MBW[temp].bait[nIndex];
      }
    }
    if (selectWWRiftFaction.value.indexOf('MBW') > -1) {
      selectWWRiftMBWBar4044.style.display =
        selectWWRiftFaction.value == 'MBW_40_44' ? '' : 'none';
      selectWWRiftMBWBar4548.style.display =
        selectWWRiftFaction.value == 'MBW_40_44' ? 'none' : '';
      document.getElementById('trWWRiftFactionFocusNext').style.display =
        'none';
      document.getElementById('trWWRiftMBWMinRage').style.display = 'table-row';
      document.getElementById('trWWRiftMBWTrapSetup').style.display =
        'table-row';
      document.getElementById('trWWRiftTrapSetup').style.display = 'none';
    } else {
      document.getElementById('trWWRiftFactionFocusNext').style.display =
        'table-row';
      document.getElementById('trWWRiftMBWMinRage').style.display = 'none';
      document.getElementById('trWWRiftMBWTrapSetup').style.display = 'none';
      document.getElementById('trWWRiftTrapSetup').style.display = 'table-row';
    }
  }

  function onSelectGESSDLoadCrate() {
    saveGES();
    initControlsGES();
  }

  function onSelectGESRRRepellent() {
    saveGES();
    initControlsGES();
  }

  function onSelectGESDCStokeEngine() {
    saveGES();
    initControlsGES();
  }

  function saveGES() {
    const selectGESStage = document.getElementById('selectGESStage');
    const selectGESTrapWeapon = document.getElementById('selectGESTrapWeapon');
    const selectGESTrapBase = document.getElementById('selectGESTrapBase');
    const selectGESTrapTrinket = document.getElementById(
      'selectGESTrapTrinket'
    );
    const selectGESRRTrapTrinket = document.getElementById(
      'selectGESRRTrapTrinket'
    );
    const selectGESDCTrapTrinket = document.getElementById(
      'selectGESDCTrapTrinket'
    );
    const selectGESTrapBait = document.getElementById('selectGESTrapBait');
    const selectGESAutoBoard = document.getElementById('selectGESAutoBoard');
    const selectGESTrainDuration = document.getElementById(
      'selectGESTrainDuration'
    );
    const selectGESAutoResttimes = document.getElementById(
      'selectGESAutoResttimes'
    );
    const inputGESSleepHours = document.getElementById('inputGESSleepHours');
    const inputHoursNoMinigame = document.getElementById(
      'inputHoursNoMinigame'
    );
    const selectGESSDLoadCrate = document.getElementById(
      'selectGESSDLoadCrate'
    );
    const inputMinCrate = document.getElementById('inputMinCrate');
    const inputGoalRateStopLoadCrate = document.getElementById(
      'inputGoalRateStopLoadCrate'
    );
    const selectGESRRRepellent = document.getElementById(
      'selectGESRRRepellent'
    );
    const inputMinRepellent = document.getElementById('inputMinRepellent');
    const selectGESDCStokeEngine = document.getElementById(
      'selectGESDCStokeEngine'
    );
    const inputMinFuelNugget = document.getElementById('inputMinFuelNugget');
    let storageValue = window.localStorage.getItem('GES');
    if (isNullOrUndefined(storageValue)) {
      const objDefaultGES = {
        autoBoard: false,
        isAutoResttimes: false,
        trainDuration: 72,
        sleepHours: 11.5,
        hoursNoMinigame: 9,
        bLoadCrate: false,
        nMinCrate: 11,
        goalRateStopLoadCrate: 0.4,
        bUseRepellent: false,
        nMinRepellent: 11,
        bStokeEngine: false,
        nMinFuelNugget: 20,
        SD_BEFORE: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        },
        SD_AFTER: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        },
        RR: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        },
        DC: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        },
        WAITING: {
          weapon: '',
          base: '',
          trinket: '',
          bait: ''
        }
      };
      storageValue = JSON.stringify(objDefaultGES);
    }
    storageValue = JSON.parse(storageValue);
    const strStage = selectGESStage.value;
    storageValue[strStage].weapon = selectGESTrapWeapon.value;
    storageValue[strStage].base = selectGESTrapBase.value;
    storageValue[strStage].bait = selectGESTrapBait.value;
    if (strStage == 'RR')
      storageValue[strStage].trinket = selectGESRRTrapTrinket.value;
    else if (strStage == 'DC')
      storageValue[strStage].trinket = selectGESDCTrapTrinket.value;
    else storageValue[strStage].trinket = selectGESTrapTrinket.value;
    storageValue.autoBoard = selectGESAutoBoard.value == 'true';
    storageValue.trainDuration =
      selectGESTrainDuration.value == 'any'
        ? 'any'
        : parseInt(selectGESTrainDuration.value);
    storageValue.isAutoResttimes = selectGESAutoResttimes.value == 'true';
    storageValue.sleepHours = parseFloat(inputGESSleepHours.value);
    storageValue.hoursNoMinigame = parseInt(inputHoursNoMinigame.value);
    storageValue.bLoadCrate = selectGESSDLoadCrate.value == 'true';
    storageValue.nMinCrate = parseInt(inputMinCrate.value);
    storageValue.goalRateStopLoadCrate = parseFloat(
      inputGoalRateStopLoadCrate.value
    );
    storageValue.bUseRepellent = selectGESRRRepellent.value == 'true';
    storageValue.nMinRepellent = parseInt(inputMinRepellent.value);
    storageValue.bStokeEngine = selectGESDCStokeEngine.value == 'true';
    storageValue.nMinFuelNugget = parseInt(inputMinFuelNugget.value);
    window.localStorage.setItem('GES', JSON.stringify(storageValue));
  }

  function initControlsGES(bAutoChangePhase) {
    if (isNullOrUndefined(bAutoChangePhase)) bAutoChangePhase = false;
    const selectGESStage = document.getElementById('selectGESStage');
    const selectGESTrapWeapon = document.getElementById('selectGESTrapWeapon');
    const selectGESTrapBase = document.getElementById('selectGESTrapBase');
    const selectGESTrapTrinket = document.getElementById(
      'selectGESTrapTrinket'
    );
    const selectGESRRTrapTrinket = document.getElementById(
      'selectGESRRTrapTrinket'
    );
    const selectGESDCTrapTrinket = document.getElementById(
      'selectGESDCTrapTrinket'
    );
    const selectGESTrapBait = document.getElementById('selectGESTrapBait');
    const selectGESAutoBoard = document.getElementById('selectGESAutoBoard');
    const selectGESTrainDuration = document.getElementById(
      'selectGESTrainDuration'
    );
    const selectGESAutoResttimes = document.getElementById(
      'selectGESAutoResttimes'
    );
    const inputGESSleepHours = document.getElementById('inputGESSleepHours');
    const inputHoursNoMinigame = document.getElementById(
      'inputHoursNoMinigame'
    );
    const selectGESSDLoadCrate = document.getElementById(
      'selectGESSDLoadCrate'
    );
    const inputMinCrate = document.getElementById('inputMinCrate');
    const inputGoalRateStopLoadCrate = document.getElementById(
      'inputGoalRateStopLoadCrate'
    );
    const selectGESRRRepellent = document.getElementById(
      'selectGESRRRepellent'
    );
    const inputMinRepellent = document.getElementById('inputMinRepellent');
    const selectGESDCStokeEngine = document.getElementById(
      'selectGESDCStokeEngine'
    );
    const inputMinFuelNugget = document.getElementById('inputMinFuelNugget');
    let storageValue = window.localStorage.getItem('GES');
    if (
      bAutoChangePhase &&
      !isNullOrUndefined(user) &&
      user.environment_name.indexOf('Gnawnian Express Station') > -1
    ) {
      if (user.quests.QuestTrainStation.on_train) {
        let strCurrentPhase = '';
        const classPhase = document.getElementsByClassName('box phaseName');
        if (classPhase.length > 0 && classPhase[0].children.length > 1)
          strCurrentPhase = classPhase[0].children[1].textContent;
        if (strCurrentPhase == 'Supply Depot') {
          selectGESStage.value = 'SD';
          const nTurn = parseInt(
            document
              .getElementsByClassName('supplyHoarderTab')[0]
              .textContent.substr(0, 1)
          );
          selectGESStage.value = nTurn <= 0 ? 'SD_BEFORE' : 'SD_AFTER';
        } else if (strCurrentPhase == 'Raider River')
          selectGESStage.value = 'RR';
        else if (strCurrentPhase == 'Daredevil Canyon')
          selectGESStage.value = 'DC';
      } else selectGESStage.value = 'WAITING';
    }
    const strStage = selectGESStage.value;
    if (isNullOrUndefined(storageValue)) {
      selectGESTrapWeapon.selectedIndex = -1;
      selectGESTrapBase.selectedIndex = -1;
      selectGESTrapTrinket.selectedIndex = -1;
      selectGESRRTrapTrinket.selectedIndex = -1;
      selectGESDCTrapTrinket.selectedIndex = -1;
      selectGESTrapBait.selectedIndex = -1;
      selectGESAutoBoard.selectedIndex = -1;
      selectGESTrainDuration.selectedIndex = -1;
      selectGESAutoResttimes.selectedIndex = -1;
      inputGESSleepHours.value = 11.75;
      inputHoursNoMinigame.value = 9;
      selectGESSDLoadCrate.selectedIndex = 0;
      inputMinCrate.value = 11;
      inputGoalRateStopLoadCrate = 0.4;
      selectGESRRRepellent.selectedIndex = 0;
      inputMinRepellent.value = 11;
      selectGESDCStokeEngine.selectedIndex = 0;
      inputMinFuelNugget.value = 20;
    } else {
      storageValue = JSON.parse(storageValue);
      selectGESTrapWeapon.value = storageValue[strStage].weapon;
      selectGESTrapBase.value = storageValue[strStage].base;
      selectGESTrapBait.value = storageValue[strStage].bait;
      if (strStage == 'RR')
        selectGESRRTrapTrinket.value = storageValue.RR.trinket;
      else if (strStage == 'DC')
        selectGESDCTrapTrinket.value = storageValue.DC.trinket;
      else selectGESTrapTrinket.value = storageValue[strStage].trinket;
      selectGESAutoBoard.value =
        storageValue.autoBoard === true ? 'true' : 'false';
      selectGESTrainDuration.value = storageValue.trainDuration;
      selectGESAutoResttimes.value =
        storageValue.isAutoResttimes === true ? 'true' : 'false';
      inputGESSleepHours.value = storageValue.sleepHours;
      inputHoursNoMinigame.value = storageValue.hoursNoMinigame;
      selectGESSDLoadCrate.value =
        storageValue.bLoadCrate === true ? 'true' : 'false';
      inputMinCrate.value = storageValue.nMinCrate;
      inputGoalRateStopLoadCrate.value = storageValue.goalRateStopLoadCrate;
      selectGESRRRepellent.value =
        storageValue.bUseRepellent === true ? 'true' : 'false';
      inputMinRepellent.value = storageValue.nMinRepellent;
      selectGESDCStokeEngine.value =
        storageValue.bStokeEngine === true ? 'true' : 'false';
      inputMinFuelNugget.value = storageValue.nMinFuelNugget;
    }
    if (strStage == 'RR') {
      selectGESTrapTrinket.style.display = 'none';
      selectGESRRTrapTrinket.style.display = '';
      selectGESDCTrapTrinket.style.display = 'none';
    } else if (strStage == 'DC') {
      selectGESTrapTrinket.style.display = 'none';
      selectGESRRTrapTrinket.style.display = 'none';
      selectGESDCTrapTrinket.style.display = '';
    } else {
      selectGESTrapTrinket.style.display = '';
      selectGESRRTrapTrinket.style.display = 'none';
      selectGESDCTrapTrinket.style.display = 'none';
    }
    inputMinCrate.disabled =
      selectGESSDLoadCrate.value == 'true' ? '' : 'disabled';
    inputMinRepellent.disabled =
      selectGESRRRepellent.value == 'true' ? '' : 'disabled';
    inputMinFuelNugget.disabled =
      selectGESDCStokeEngine.value == 'true' ? '' : 'disabled';
  }

  /**
   * 所有eventLocation設定都已經寫好在table中,
   * 每個row預設hidden且都有id.
   * 用 json儲存各個eventLocation如何啟用設定.
   * 啟用設定的相關資料用 eventLocation下拉選單的
   * value作property name,其中有 arr屬性用 array
   * 儲存哪些 table rows的 id屬於該 eventLocation,
   * init屬性儲存控制及處理設定細節的方法
   * (傳入參數 signature雖然叫data, 但實際是傳boolean)
   * @param {String} algo Selected eventLocation value
   */
  function showOrHideTr(algo) {
    const objTableRow = {
      'All LG Area': {
        arr: [
          'trLGTGAutoFill',
          'trLGTGAutoPour',
          'trPourTrapSetup',
          'trCurseLiftedTrapSetup',
          'trStampedeTrapSetup',
          'trSaltedTrapSetup'
        ],
        init: function (data) {
          initControlsLG(data);
        }
      },
      'Sunken City Custom': {
        arr: ['trSCCustom', 'trSCCustomUseSmartJet'],
        init: function (data) {
          initControlsSCCustom(data);
        }
      },
      Labyrinth: {
        arr: [
          'trLabyrinth',
          'trPriorities15',
          'trPriorities1560',
          'trPriorities60',
          'trLabyrinthOtherHallway',
          'trLabyrinthFocusTypesQueue',
          'trLabyrinthDisarm',
          'trLabyrinthArmOtherBase',
          'trLabyrinthDisarmCompass',
          'trLabyrinthAutoOpenExit',
          'trLabyrinthAutoLantern',
          'trLabyrinthWeaponFarming'
        ],
        init: function (data) {
          initControlsLaby(data);
        }
      },
      'Fiery Warpath': {
        arr: [
          'trFWAll',
          'trFWSpecialCharms',
          'trFWArtilleryCommanderTrap',
          'trFWWave',
          'trFWTrapSetup',
          'trFW4TrapSetup',
          'trFWStreak',
          'trFWFocusType',
          'trFWLastType',
          'trFWSupportConfig'
        ],
        init: function (data) {
          initControlsFW(data);
        }
      },
      'Burroughs Rift Custom=Burroughs Rift Auto': {
        arr: ['trBRConfig', 'trBRToggle', 'trBRTrapSetup'],
        init: function (data) {
          initControlsBR(data);
        }
      },
      SG: {
        arr: ['trSGTrapSetup', 'trSGDisarmBait'],
        init: function (data) {
          initControlsSG(data);
        }
      },
      Zokor: {
        arr: ['trZokorTrapSetup'],
        init: function (data) {
          initControlsZokor(data);
        }
      },
      'Furoma Rift': {
        arr: [
          'trFREnterBattery',
          'trFRRetreatBattery',
          'trFRTrapSetupAtBattery'
        ],
        init: function (data) {
          initControlsFR(data);
        }
      },
      ZT: {
        arr: ['trZTFocus', 'trZTTrapSetup1st', 'trZTTrapSetup2nd'],
        init: function (data) {
          initControlsZT(data);
        }
      },
      Iceberg: {
        arr: ['trIceberg'],
        init: function (data) {
          initControlsIceberg(data);
        }
      },
      WWRift: {
        arr: [
          'trWWRiftFactionFocus',
          'trWWRiftAutomation',
          'trWWRiftFactionFocusNext',
          'trWWRiftTrapSetup',
          'trWWRiftMBWTrapSetup',
          'trWWRiftMBWMinRage'
        ],
        init: function (data) {
          initControlsWWRift(data);
        }
      },
      GES: {
        arr: [
          'trGESTrapSetup',
          'trGESSDLoadCrate',
          'trGESRRRepellent',
          'trGESDCStokeEngine'
        ],
        init: function (data) {
          initControlsGES(data);
        }
      },
      'Fort Rox': {
        arr: ['trFRoxTrapSetup', 'trFRoxDeactiveTower'],
        init: function (data) {
          initControlsFRox(data);
        }
      },
      GWH2016R: {
        arr: [
          'trGWHTrapSetup',
          'trGWHTurboBoost',
          'trGWHFlying',
          'trGWHFlyingFirework',
          'trGWHFlyingLand'
        ],
        init: function (data) {
          initControlsGWH2016(data);
        }
      },
      'Bristle Woods Rift': {
        arr: [
          'trBWRiftSubLocation',
          'trBWRiftMasterTrapSetup',
          'trBWRiftAutoChoosePortal',
          'trBWRiftPortalPriority',
          'trBWRiftPortalPriorityCursed',
          'trBWRiftMinTimeSand',
          'trBWRiftMinRSC',
          'trBWRiftDeactivatePocketWatch',
          'trBWRiftChoosePortalAfterCC',
          'trBWRiftTrapSetupSpecial',
          'trBWRiftEnterMinigame',
          'trBWRiftActivatePocketWatch'
        ],
        init: function (data) {
          initControlsBWRift(data);
        }
      },
      'BC/JOD': {
        arr: ['trBCJODSubLocation', 'trBCJODTrapSetup'],
        init: function (data) {
          initControlsBCJOD(data);
        }
      },
      'FG/AR': {
        arr: ['trFGARSubLocation', 'trFGARTrapSetup'],
        init: function (data) {
          initControlsFGAR(data);
        }
      }
    };
    let i, props, isAlgo, temp, init;
    for (let prop in objTableRow) {
      if (objTableRow.hasOwnProperty(prop)) {
        props = prop.split('=');
        isAlgo = false;
        for (i = 0; i < props.length; i++) isAlgo ||= props[i] == algo;
        if (isAlgo) init = objTableRow[prop].init;
        temp = isAlgo ? 'table-row' : 'none';
        // temp = prop == algo ? 'table-row' : 'none';
        for (i = 0; i < objTableRow[prop].arr.length; i++)
          document.getElementById(objTableRow[prop].arr[i]).style.display =
            temp;
      }
    }
    if (!isNullOrUndefined(init)) init(true);

    initControlsMapHunting();
    //initControlsSpecialFeature();
  }
}
