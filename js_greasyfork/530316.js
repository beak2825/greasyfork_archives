// ==UserScript==
// @name         mooket
// @namespace    http://tampermonkey.net/
// @version      20251106.1.1
// @description  银河奶牛历史价格（包含强化物品）history(enhancement included) price for milkywayidle
// @author       IOMisaka
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530316/mooket.user.js
// @updateURL https://update.greasyfork.org/scripts/530316/mooket.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let injectSpace = "mwi";//use window.mwi to access the injected object
  if (window[injectSpace]) return;//已经注入
  //优先注册ob
  const observer = new MutationObserver(() => {
      const el = document.querySelector('[class^="GamePage"]');
      if (el) {
          observer.disconnect();
          patchScript();
      }
  });
  observer.observe(document, { childList: true, subtree: true });
  let mwi = {//供外部调用的接口
    //由于脚本加载问题，注入有可能失败
    //修改了hookCallback，添加了回调前和回调后处理
    version: "0.7.0",//版本号，未改动原有接口只更新最后一个版本号，更改了接口会更改次版本号，主版本暂时不更新，等稳定之后再考虑主版本号更新
    MWICoreInitialized: false,//是否初始化完成，完成会还会通过window发送一个自定义事件 MWICoreInitialized
    game: null,//注入游戏对象，可以直接访问游戏中的大量数据和方法以及消息事件等
    lang: null,//语言翻译, 例如中文物品lang.zh.translation.itemNames['/items/coin']

    //////非注入接口，保证可以使用的功能//////
    ///需要等待加载完成才能使用

    coreMarket: null,//coreMarket.marketData 格式{"/items/apple_yogurt:0":{ask,bid,time}}
    initCharacterData: null,
    initClientData: null,
    get character() { return this.game?.state?.character || this.initCharacterData?.character },

    ///不需要等待加载的

    isZh: true,//是否中文
    /* marketJson兼容接口 */
    get marketJsonOld() {
      return this.coreMarket && new Proxy(this.coreMarket, {
        get(coreMarket, prop) {
          if (prop === "market") {
            return new Proxy(coreMarket, {
              get(coreMarket, itemHridOrName) {
                return coreMarket.getItemPrice(itemHridOrName);
              }
            });
          }
          return null;
        }

      });
    },
    get marketJson() {
      return mwi.coreMarket && new Proxy({}, {
        get(_, marketData) {
          if (marketData === "marketData")
            return new Proxy({}, {
              get(_, itemHridOrName) {
                return new Proxy({}, {
                  get(_, itemLevel) {
                    return new Proxy({}, {
                      get(_, objProp) {
                        switch (objProp) {
                          case "a": {
                            return mwi.coreMarket?.getItemPrice(itemHridOrName, itemLevel)?.ask;
                          }
                          case "b": {
                            return mwi.coreMarket?.getItemPrice(itemHridOrName, itemLevel)?.bid;
                          }
                          case "time": {
                            return mwi.coreMarket?.getItemPrice(itemHridOrName, itemLevel)?.time;
                          }
                        }
                        return -1;
                      }
                    })
                  }
                })
              }
            })
        }
      })
    },

    itemNameToHridDict: null,//物品名称反查表


    ensureItemHrid: function (itemHridOrName) {
      let itemHrid = this.itemNameToHridDict[itemHridOrName];
      if (itemHrid) return itemHrid;
      if (itemHridOrName?.startsWith("/items/")) return itemHridOrName;
      return null;
    },//各种名字转itemHrid，找不到返回原itemHrid或者null
    getItemDetail: function (itemHrid) {
      return this.initClientData?.itemDetailMap && this.initClientData.itemDetailMap[itemHrid];
    },
    hookMessage: hookMessage,//hook 游戏websocket消息 例如聊天消息mwi.hookMessage("chat_message_received",obj=>{console.log(obj)})
    hookCallback: hookCallback,//hook回调，可以hook游戏处理事件调用前后，方便做统计处理？ 例如聊天消息mwi.hookCallback("handleMessageChatMessageReceived",obj=>{console.log("before")}，obj=>{console.log("after")})
    fetchWithTimeout: fetchWithTimeout,//带超时的fetch
  };
  window[injectSpace] = mwi;
  try{
    let decData = LZString.decompressFromUTF16(localStorage.getItem("initClientData"));
    mwi.initClientData = JSON.parse( decData);
  }catch{
    mwi.initClientData = JSON.parse("{}");
  }
  mwi.isZh = localStorage.getItem("i18nextLng")?.startsWith("zh");

  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    const event = new Event('localStorageChanged');
    event.key = key;
    event.newValue = value;
    event.oldValue = localStorage.getItem(key);
    originalSetItem.apply(this, arguments);
    dispatchEvent(event);

  };

  addEventListener('localStorageChanged', function (event) {
    if (event.key === "i18nextLng") {
      console.log(`i18nextLng changed: ${event.key} = ${event.newValue}`);
      mwi.isZh = event.newValue?.startsWith("zh");
      dispatchEvent(new Event("MWILangChanged"));
    }
  });
  async function patchScript() {
    try {
      window[injectSpace].game = (e => e?.[Object.keys(e).find(k => k.startsWith('__reactFiber$'))]?.return?.stateNode)(document.querySelector('[class^="GamePage"]'));
      window[injectSpace].lang = window[injectSpace].game.props.i18n.options.resources;
      console.info('MWICore patched successfully.')
    } catch (error) {
      console.error('MWICore patching failed:', error);
    }
  }


  function hookWS() {
    const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const oriGet = dataProperty.get;
    dataProperty.get = hookedGet;
    Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

    function hookedGet() {
      const socket = this.currentTarget;
      if (!(socket instanceof WebSocket)) {
        return oriGet.call(this);
      }
      if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1) {
        return oriGet.call(this);
      }
      const message = oriGet.call(this);
      Object.defineProperty(this, "data", { value: message }); // Anti-loop

      try {
        let obj = JSON.parse(message);
        if (obj?.type) {
          if (obj.type === "init_character_data") {
            mwi.initCharacterData = obj;
          } else if (obj.type === "init_client_data") {
            mwi.initClientData = obj;
          }

          dispatchEvent(new CustomEvent("MWI_" + obj.type, { detail: obj }));
        }
      } catch { console.error("dispatch error."); }

      return message;
    }
  }
  hookWS();
  /**
   * Hook游戏消息在处理之前，随时可用
   * @param {string} message.type 消息类型，ws钩子，必定可用，仅在游戏处理之前调用beforeFunc
   * @param {Function} beforeFunc 前处理函数
   */
  function hookMessage(messageType, beforeFunc) {
    if (messageType && beforeFunc) {
      //游戏websocket消息hook
      addEventListener("MWI_" + messageType, (e) => beforeFunc(e.detail));
    } else {
      console.warn("messageType or beforeFunc is missing");
    }
  }
  /**
   * Hook游戏回调函数，仅在游戏注入成功时可用，会调用beforeFunc和afterFunc
   * @param {string} callbackProp 游戏处理回调函数名mwi.game.handleMessage*，仅当注入成功时可用，会调用beforeFunc和afterFunc
   * @param {Function} beforeFunc 前处理函数
   * @param {Function} afterFunc 后处理函数
   */
  function hookCallback(callbackProp, beforeFunc, afterFunc) {
    if (callbackProp && mwi?.game) {//优先使用游戏回调hook
      const targetObj = mwi.game;
      const originalCallback = targetObj[callbackProp];

      if (!originalCallback || !targetObj) {
        throw new Error(`Callback ${callbackProp} does not exist`);
      }

      targetObj[callbackProp] = function (...args) {
        // 前处理
        try {
          if (beforeFunc) beforeFunc(...args);
        } catch { }
        // 原始回调函数调用
        const result = originalCallback.apply(this, args);
        // 后处理
        try {
          if (afterFunc) afterFunc(result, ...args);
        } catch { }
        return result;
      };

      // 返回取消Hook的方法
      return () => {
        targetObj[callbackProp] = originalCallback;
      };
    } else {
      console.warn("hookCallback error");
    }
  }
  /**
   * 带超时功能的fetch封装
   * @param {string} url - 请求URL
   * @param {object} options - fetch选项
   * @param {number} timeout - 超时时间(毫秒)，默认10秒
   * @returns {Promise} - 返回fetch的Promise
   */
  function fetchWithTimeout(url, options = {}, timeout = 10000) {
    // 创建AbortController实例
    const controller = new AbortController();
    const { signal } = controller;

    // 设置超时计时器
    const timeoutId = setTimeout(() => {
      controller.abort(new Error(`请求超时: ${timeout}ms`));
    }, timeout);

    // 合并选项，添加signal
    const fetchOptions = {
      ...options,
      signal
    };

    // 发起fetch请求
    return fetch(url, fetchOptions)
      .then(response => {
        // 清除超时计时器
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        return response;
      })
      .catch(error => {
        // 清除超时计时器
        clearTimeout(timeoutId);

        // 如果是中止错误，重新抛出超时错误
        if (error.name === 'AbortError') {
          throw new Error(`请求超时: ${timeout}ms`);
        }
        throw error;
      });
  }
  function staticInit() {
    /*静态初始化，手动提取的游戏数据*/
    mwi.lang = {
      en: {
        translation: {
          ...{
            itemNames: {
              "/items/coin": "Coin",
              "/items/task_token": "Task Token",
              "/items/chimerical_token": "Chimerical Token",
              "/items/sinister_token": "Sinister Token",
              "/items/enchanted_token": "Enchanted Token",
              "/items/pirate_token": "Pirate Token",
              "/items/cowbell": "Cowbell",
              "/items/bag_of_10_cowbells": "Bag Of 10 Cowbells",
              "/items/purples_gift": "Purple's Gift",
              "/items/small_meteorite_cache": "Small Meteorite Cache",
              "/items/medium_meteorite_cache": "Medium Meteorite Cache",
              "/items/large_meteorite_cache": "Large Meteorite Cache",
              "/items/small_artisans_crate": "Small Artisan's Crate",
              "/items/medium_artisans_crate": "Medium Artisan's Crate",
              "/items/large_artisans_crate": "Large Artisan's Crate",
              "/items/small_treasure_chest": "Small Treasure Chest",
              "/items/medium_treasure_chest": "Medium Treasure Chest",
              "/items/large_treasure_chest": "Large Treasure Chest",
              "/items/chimerical_chest": "Chimerical Chest",
              "/items/chimerical_refinement_chest": "Chimerical Refinement Chest",
              "/items/sinister_chest": "Sinister Chest",
              "/items/sinister_refinement_chest": "Sinister Refinement Chest",
              "/items/enchanted_chest": "Enchanted Chest",
              "/items/enchanted_refinement_chest": "Enchanted Refinement Chest",
              "/items/pirate_chest": "Pirate Chest",
              "/items/pirate_refinement_chest": "Pirate Refinement Chest",
              "/items/blue_key_fragment": "Blue Key Fragment",
              "/items/green_key_fragment": "Green Key Fragment",
              "/items/purple_key_fragment": "Purple Key Fragment",
              "/items/white_key_fragment": "White Key Fragment",
              "/items/orange_key_fragment": "Orange Key Fragment",
              "/items/brown_key_fragment": "Brown Key Fragment",
              "/items/stone_key_fragment": "Stone Key Fragment",
              "/items/dark_key_fragment": "Dark Key Fragment",
              "/items/burning_key_fragment": "Burning Key Fragment",
              "/items/chimerical_entry_key": "Chimerical Entry Key",
              "/items/chimerical_chest_key": "Chimerical Chest Key",
              "/items/sinister_entry_key": "Sinister Entry Key",
              "/items/sinister_chest_key": "Sinister Chest Key",
              "/items/enchanted_entry_key": "Enchanted Entry Key",
              "/items/enchanted_chest_key": "Enchanted Chest Key",
              "/items/pirate_entry_key": "Pirate Entry Key",
              "/items/pirate_chest_key": "Pirate Chest Key",
              "/items/donut": "Donut",
              "/items/blueberry_donut": "Blueberry Donut",
              "/items/blackberry_donut": "Blackberry Donut",
              "/items/strawberry_donut": "Strawberry Donut",
              "/items/mooberry_donut": "Mooberry Donut",
              "/items/marsberry_donut": "Marsberry Donut",
              "/items/spaceberry_donut": "Spaceberry Donut",
              "/items/cupcake": "Cupcake",
              "/items/blueberry_cake": "Blueberry Cake",
              "/items/blackberry_cake": "Blackberry Cake",
              "/items/strawberry_cake": "Strawberry Cake",
              "/items/mooberry_cake": "Mooberry Cake",
              "/items/marsberry_cake": "Marsberry Cake",
              "/items/spaceberry_cake": "Spaceberry Cake",
              "/items/gummy": "Gummy",
              "/items/apple_gummy": "Apple Gummy",
              "/items/orange_gummy": "Orange Gummy",
              "/items/plum_gummy": "Plum Gummy",
              "/items/peach_gummy": "Peach Gummy",
              "/items/dragon_fruit_gummy": "Dragon Fruit Gummy",
              "/items/star_fruit_gummy": "Star Fruit Gummy",
              "/items/yogurt": "Yogurt",
              "/items/apple_yogurt": "Apple Yogurt",
              "/items/orange_yogurt": "Orange Yogurt",
              "/items/plum_yogurt": "Plum Yogurt",
              "/items/peach_yogurt": "Peach Yogurt",
              "/items/dragon_fruit_yogurt": "Dragon Fruit Yogurt",
              "/items/star_fruit_yogurt": "Star Fruit Yogurt",
              "/items/milking_tea": "Milking Tea",
              "/items/foraging_tea": "Foraging Tea",
              "/items/woodcutting_tea": "Woodcutting Tea",
              "/items/cooking_tea": "Cooking Tea",
              "/items/brewing_tea": "Brewing Tea",
              "/items/alchemy_tea": "Alchemy Tea",
              "/items/enhancing_tea": "Enhancing Tea",
              "/items/cheesesmithing_tea": "Cheesesmithing Tea",
              "/items/crafting_tea": "Crafting Tea",
              "/items/tailoring_tea": "Tailoring Tea",
              "/items/super_milking_tea": "Super Milking Tea",
              "/items/super_foraging_tea": "Super Foraging Tea",
              "/items/super_woodcutting_tea": "Super Woodcutting Tea",
              "/items/super_cooking_tea": "Super Cooking Tea",
              "/items/super_brewing_tea": "Super Brewing Tea",
              "/items/super_alchemy_tea": "Super Alchemy Tea",
              "/items/super_enhancing_tea": "Super Enhancing Tea",
              "/items/super_cheesesmithing_tea": "Super Cheesesmithing Tea",
              "/items/super_crafting_tea": "Super Crafting Tea",
              "/items/super_tailoring_tea": "Super Tailoring Tea",
              "/items/ultra_milking_tea": "Ultra Milking Tea",
              "/items/ultra_foraging_tea": "Ultra Foraging Tea",
              "/items/ultra_woodcutting_tea": "Ultra Woodcutting Tea",
              "/items/ultra_cooking_tea": "Ultra Cooking Tea",
              "/items/ultra_brewing_tea": "Ultra Brewing Tea",
              "/items/ultra_alchemy_tea": "Ultra Alchemy Tea",
              "/items/ultra_enhancing_tea": "Ultra Enhancing Tea",
              "/items/ultra_cheesesmithing_tea": "Ultra Cheesesmithing Tea",
              "/items/ultra_crafting_tea": "Ultra Crafting Tea",
              "/items/ultra_tailoring_tea": "Ultra Tailoring Tea",
              "/items/gathering_tea": "Gathering Tea",
              "/items/gourmet_tea": "Gourmet Tea",
              "/items/wisdom_tea": "Wisdom Tea",
              "/items/processing_tea": "Processing Tea",
              "/items/efficiency_tea": "Efficiency Tea",
              "/items/artisan_tea": "Artisan Tea",
              "/items/catalytic_tea": "Catalytic Tea",
              "/items/blessed_tea": "Blessed Tea",
              "/items/stamina_coffee": "Stamina Coffee",
              "/items/intelligence_coffee": "Intelligence Coffee",
              "/items/defense_coffee": "Defense Coffee",
              "/items/attack_coffee": "Attack Coffee",
              "/items/melee_coffee": "Melee Coffee",
              "/items/ranged_coffee": "Ranged Coffee",
              "/items/magic_coffee": "Magic Coffee",
              "/items/super_stamina_coffee": "Super Stamina Coffee",
              "/items/super_intelligence_coffee": "Super Intelligence Coffee",
              "/items/super_defense_coffee": "Super Defense Coffee",
              "/items/super_attack_coffee": "Super Attack Coffee",
              "/items/super_melee_coffee": "Super Melee Coffee",
              "/items/super_ranged_coffee": "Super Ranged Coffee",
              "/items/super_magic_coffee": "Super Magic Coffee",
              "/items/ultra_stamina_coffee": "Ultra Stamina Coffee",
              "/items/ultra_intelligence_coffee": "Ultra Intelligence Coffee",
              "/items/ultra_defense_coffee": "Ultra Defense Coffee",
              "/items/ultra_attack_coffee": "Ultra Attack Coffee",
              "/items/ultra_melee_coffee": "Ultra Melee Coffee",
              "/items/ultra_ranged_coffee": "Ultra Ranged Coffee",
              "/items/ultra_magic_coffee": "Ultra Magic Coffee",
              "/items/wisdom_coffee": "Wisdom Coffee",
              "/items/lucky_coffee": "Lucky Coffee",
              "/items/swiftness_coffee": "Swiftness Coffee",
              "/items/channeling_coffee": "Channeling Coffee",
              "/items/critical_coffee": "Critical Coffee",
              "/items/poke": "Poke",
              "/items/impale": "Impale",
              "/items/puncture": "Puncture",
              "/items/penetrating_strike": "Penetrating Strike",
              "/items/scratch": "Scratch",
              "/items/cleave": "Cleave",
              "/items/maim": "Maim",
              "/items/crippling_slash": "Crippling Slash",
              "/items/smack": "Smack",
              "/items/sweep": "Sweep",
              "/items/stunning_blow": "Stunning Blow",
              "/items/fracturing_impact": "Fracturing Impact",
              "/items/shield_bash": "Shield Bash",
              "/items/quick_shot": "Quick Shot",
              "/items/aqua_arrow": "Aqua Arrow",
              "/items/flame_arrow": "Flame Arrow",
              "/items/rain_of_arrows": "Rain Of Arrows",
              "/items/silencing_shot": "Silencing Shot",
              "/items/steady_shot": "Steady Shot",
              "/items/pestilent_shot": "Pestilent Shot",
              "/items/penetrating_shot": "Penetrating Shot",
              "/items/water_strike": "Water Strike",
              "/items/ice_spear": "Ice Spear",
              "/items/frost_surge": "Frost Surge",
              "/items/mana_spring": "Mana Spring",
              "/items/entangle": "Entangle",
              "/items/toxic_pollen": "Toxic Pollen",
              "/items/natures_veil": "Nature's Veil",
              "/items/life_drain": "Life Drain",
              "/items/fireball": "Fireball",
              "/items/flame_blast": "Flame Blast",
              "/items/firestorm": "Firestorm",
              "/items/smoke_burst": "Smoke Burst",
              "/items/minor_heal": "Minor Heal",
              "/items/heal": "Heal",
              "/items/quick_aid": "Quick Aid",
              "/items/rejuvenate": "Rejuvenate",
              "/items/taunt": "Taunt",
              "/items/provoke": "Provoke",
              "/items/toughness": "Toughness",
              "/items/elusiveness": "Elusiveness",
              "/items/precision": "Precision",
              "/items/berserk": "Berserk",
              "/items/elemental_affinity": "Elemental Affinity",
              "/items/frenzy": "Frenzy",
              "/items/spike_shell": "Spike Shell",
              "/items/retribution": "Retribution",
              "/items/vampirism": "Vampirism",
              "/items/revive": "Revive",
              "/items/insanity": "Insanity",
              "/items/invincible": "Invincible",
              "/items/speed_aura": "Speed Aura",
              "/items/guardian_aura": "Guardian Aura",
              "/items/fierce_aura": "Fierce Aura",
              "/items/critical_aura": "Critical Aura",
              "/items/mystic_aura": "Mystic Aura",
              "/items/gobo_stabber": "Gobo Stabber",
              "/items/gobo_slasher": "Gobo Slasher",
              "/items/gobo_smasher": "Gobo Smasher",
              "/items/spiked_bulwark": "Spiked Bulwark",
              "/items/werewolf_slasher": "Werewolf Slasher",
              "/items/griffin_bulwark": "Griffin Bulwark",
              "/items/griffin_bulwark_refined": "Griffin Bulwark (R)",
              "/items/gobo_shooter": "Gobo Shooter",
              "/items/vampiric_bow": "Vampiric Bow",
              "/items/cursed_bow": "Cursed Bow",
              "/items/cursed_bow_refined": "Cursed Bow (R)",
              "/items/gobo_boomstick": "Gobo Boomstick",
              "/items/cheese_bulwark": "Cheese Bulwark",
              "/items/verdant_bulwark": "Verdant Bulwark",
              "/items/azure_bulwark": "Azure Bulwark",
              "/items/burble_bulwark": "Burble Bulwark",
              "/items/crimson_bulwark": "Crimson Bulwark",
              "/items/rainbow_bulwark": "Rainbow Bulwark",
              "/items/holy_bulwark": "Holy Bulwark",
              "/items/wooden_bow": "Wooden Bow",
              "/items/birch_bow": "Birch Bow",
              "/items/cedar_bow": "Cedar Bow",
              "/items/purpleheart_bow": "Purpleheart Bow",
              "/items/ginkgo_bow": "Ginkgo Bow",
              "/items/redwood_bow": "Redwood Bow",
              "/items/arcane_bow": "Arcane Bow",
              "/items/stalactite_spear": "Stalactite Spear",
              "/items/granite_bludgeon": "Granite Bludgeon",
              "/items/furious_spear": "Furious Spear",
              "/items/furious_spear_refined": "Furious Spear (R)",
              "/items/regal_sword": "Regal Sword",
              "/items/regal_sword_refined": "Regal Sword (R)",
              "/items/chaotic_flail": "Chaotic Flail",
              "/items/chaotic_flail_refined": "Chaotic Flail (R)",
              "/items/soul_hunter_crossbow": "Soul Hunter Crossbow",
              "/items/sundering_crossbow": "Sundering Crossbow",
              "/items/sundering_crossbow_refined": "Sundering Crossbow (R)",
              "/items/frost_staff": "Frost Staff",
              "/items/infernal_battlestaff": "Infernal Battlestaff",
              "/items/jackalope_staff": "Jackalope Staff",
              "/items/rippling_trident": "Rippling Trident",
              "/items/rippling_trident_refined": "Rippling Trident (R)",
              "/items/blooming_trident": "Blooming Trident",
              "/items/blooming_trident_refined": "Blooming Trident (R)",
              "/items/blazing_trident": "Blazing Trident",
              "/items/blazing_trident_refined": "Blazing Trident (R)",
              "/items/cheese_sword": "Cheese Sword",
              "/items/verdant_sword": "Verdant Sword",
              "/items/azure_sword": "Azure Sword",
              "/items/burble_sword": "Burble Sword",
              "/items/crimson_sword": "Crimson Sword",
              "/items/rainbow_sword": "Rainbow Sword",
              "/items/holy_sword": "Holy Sword",
              "/items/cheese_spear": "Cheese Spear",
              "/items/verdant_spear": "Verdant Spear",
              "/items/azure_spear": "Azure Spear",
              "/items/burble_spear": "Burble Spear",
              "/items/crimson_spear": "Crimson Spear",
              "/items/rainbow_spear": "Rainbow Spear",
              "/items/holy_spear": "Holy Spear",
              "/items/cheese_mace": "Cheese Mace",
              "/items/verdant_mace": "Verdant Mace",
              "/items/azure_mace": "Azure Mace",
              "/items/burble_mace": "Burble Mace",
              "/items/crimson_mace": "Crimson Mace",
              "/items/rainbow_mace": "Rainbow Mace",
              "/items/holy_mace": "Holy Mace",
              "/items/wooden_crossbow": "Wooden Crossbow",
              "/items/birch_crossbow": "Birch Crossbow",
              "/items/cedar_crossbow": "Cedar Crossbow",
              "/items/purpleheart_crossbow": "Purpleheart Crossbow",
              "/items/ginkgo_crossbow": "Ginkgo Crossbow",
              "/items/redwood_crossbow": "Redwood Crossbow",
              "/items/arcane_crossbow": "Arcane Crossbow",
              "/items/wooden_water_staff": "Wooden Water Staff",
              "/items/birch_water_staff": "Birch Water Staff",
              "/items/cedar_water_staff": "Cedar Water Staff",
              "/items/purpleheart_water_staff": "Purpleheart Water Staff",
              "/items/ginkgo_water_staff": "Ginkgo Water Staff",
              "/items/redwood_water_staff": "Redwood Water Staff",
              "/items/arcane_water_staff": "Arcane Water Staff",
              "/items/wooden_nature_staff": "Wooden Nature Staff",
              "/items/birch_nature_staff": "Birch Nature Staff",
              "/items/cedar_nature_staff": "Cedar Nature Staff",
              "/items/purpleheart_nature_staff": "Purpleheart Nature Staff",
              "/items/ginkgo_nature_staff": "Ginkgo Nature Staff",
              "/items/redwood_nature_staff": "Redwood Nature Staff",
              "/items/arcane_nature_staff": "Arcane Nature Staff",
              "/items/wooden_fire_staff": "Wooden Fire Staff",
              "/items/birch_fire_staff": "Birch Fire Staff",
              "/items/cedar_fire_staff": "Cedar Fire Staff",
              "/items/purpleheart_fire_staff": "Purpleheart Fire Staff",
              "/items/ginkgo_fire_staff": "Ginkgo Fire Staff",
              "/items/redwood_fire_staff": "Redwood Fire Staff",
              "/items/arcane_fire_staff": "Arcane Fire Staff",
              "/items/eye_watch": "Eye Watch",
              "/items/snake_fang_dirk": "Snake Fang Dirk",
              "/items/vision_shield": "Vision Shield",
              "/items/gobo_defender": "Gobo Defender",
              "/items/vampire_fang_dirk": "Vampire Fang Dirk",
              "/items/knights_aegis": "Knight's Aegis",
              "/items/knights_aegis_refined": "Knight's Aegis (R)",
              "/items/treant_shield": "Treant Shield",
              "/items/manticore_shield": "Manticore Shield",
              "/items/tome_of_healing": "Tome Of Healing",
              "/items/tome_of_the_elements": "Tome Of The Elements",
              "/items/watchful_relic": "Watchful Relic",
              "/items/bishops_codex": "Bishop's Codex",
              "/items/bishops_codex_refined": "Bishop's Codex (R)",
              "/items/cheese_buckler": "Cheese Buckler",
              "/items/verdant_buckler": "Verdant Buckler",
              "/items/azure_buckler": "Azure Buckler",
              "/items/burble_buckler": "Burble Buckler",
              "/items/crimson_buckler": "Crimson Buckler",
              "/items/rainbow_buckler": "Rainbow Buckler",
              "/items/holy_buckler": "Holy Buckler",
              "/items/wooden_shield": "Wooden Shield",
              "/items/birch_shield": "Birch Shield",
              "/items/cedar_shield": "Cedar Shield",
              "/items/purpleheart_shield": "Purpleheart Shield",
              "/items/ginkgo_shield": "Ginkgo Shield",
              "/items/redwood_shield": "Redwood Shield",
              "/items/arcane_shield": "Arcane Shield",
              "/items/sinister_cape": "Sinister Cape",
              "/items/sinister_cape_refined": "Sinister Cape (R)",
              "/items/chimerical_quiver": "Chimerical Quiver",
              "/items/chimerical_quiver_refined": "Chimerical Quiver (R)",
              "/items/enchanted_cloak": "Enchanted Cloak",
              "/items/enchanted_cloak_refined": "Enchanted Cloak (R)",
              "/items/red_culinary_hat": "Red Culinary Hat",
              "/items/snail_shell_helmet": "Snail Shell Helmet",
              "/items/vision_helmet": "Vision Helmet",
              "/items/fluffy_red_hat": "Fluffy Red Hat",
              "/items/corsair_helmet": "Corsair Helmet",
              "/items/corsair_helmet_refined": "Corsair Helmet (R)",
              "/items/acrobatic_hood": "Acrobatic Hood",
              "/items/acrobatic_hood_refined": "Acrobatic Hood (R)",
              "/items/magicians_hat": "Magician's Hat",
              "/items/magicians_hat_refined": "Magician's Hat (R)",
              "/items/cheese_helmet": "Cheese Helmet",
              "/items/verdant_helmet": "Verdant Helmet",
              "/items/azure_helmet": "Azure Helmet",
              "/items/burble_helmet": "Burble Helmet",
              "/items/crimson_helmet": "Crimson Helmet",
              "/items/rainbow_helmet": "Rainbow Helmet",
              "/items/holy_helmet": "Holy Helmet",
              "/items/rough_hood": "Rough Hood",
              "/items/reptile_hood": "Reptile Hood",
              "/items/gobo_hood": "Gobo Hood",
              "/items/beast_hood": "Beast Hood",
              "/items/umbral_hood": "Umbral Hood",
              "/items/cotton_hat": "Cotton Hat",
              "/items/linen_hat": "Linen Hat",
              "/items/bamboo_hat": "Bamboo Hat",
              "/items/silk_hat": "Silk Hat",
              "/items/radiant_hat": "Radiant Hat",
              "/items/dairyhands_top": "Dairyhand's Top",
              "/items/foragers_top": "Forager's Top",
              "/items/lumberjacks_top": "Lumberjack's Top",
              "/items/cheesemakers_top": "Cheesemaker's Top",
              "/items/crafters_top": "Crafter's Top",
              "/items/tailors_top": "Tailor's Top",
              "/items/chefs_top": "Chef's Top",
              "/items/brewers_top": "Brewer's Top",
              "/items/alchemists_top": "Alchemist's Top",
              "/items/enhancers_top": "Enhancer's Top",
              "/items/gator_vest": "Gator Vest",
              "/items/turtle_shell_body": "Turtle Shell Body",
              "/items/colossus_plate_body": "Colossus Plate Body",
              "/items/demonic_plate_body": "Demonic Plate Body",
              "/items/anchorbound_plate_body": "Anchorbound Plate Body",
              "/items/anchorbound_plate_body_refined": "Anchorbound Plate Body (R)",
              "/items/maelstrom_plate_body": "Maelstrom Plate Body",
              "/items/maelstrom_plate_body_refined": "Maelstrom Plate Body (R)",
              "/items/marine_tunic": "Marine Tunic",
              "/items/revenant_tunic": "Revenant Tunic",
              "/items/griffin_tunic": "Griffin Tunic",
              "/items/kraken_tunic": "Kraken Tunic",
              "/items/kraken_tunic_refined": "Kraken Tunic (R)",
              "/items/icy_robe_top": "Icy Robe Top",
              "/items/flaming_robe_top": "Flaming Robe Top",
              "/items/luna_robe_top": "Luna Robe Top",
              "/items/royal_water_robe_top": "Royal Water Robe Top",
              "/items/royal_water_robe_top_refined": "Royal Water Robe Top (R)",
              "/items/royal_nature_robe_top": "Royal Nature Robe Top",
              "/items/royal_nature_robe_top_refined": "Royal Nature Robe Top (R)",
              "/items/royal_fire_robe_top": "Royal Fire Robe Top",
              "/items/royal_fire_robe_top_refined": "Royal Fire Robe Top (R)",
              "/items/cheese_plate_body": "Cheese Plate Body",
              "/items/verdant_plate_body": "Verdant Plate Body",
              "/items/azure_plate_body": "Azure Plate Body",
              "/items/burble_plate_body": "Burble Plate Body",
              "/items/crimson_plate_body": "Crimson Plate Body",
              "/items/rainbow_plate_body": "Rainbow Plate Body",
              "/items/holy_plate_body": "Holy Plate Body",
              "/items/rough_tunic": "Rough Tunic",
              "/items/reptile_tunic": "Reptile Tunic",
              "/items/gobo_tunic": "Gobo Tunic",
              "/items/beast_tunic": "Beast Tunic",
              "/items/umbral_tunic": "Umbral Tunic",
              "/items/cotton_robe_top": "Cotton Robe Top",
              "/items/linen_robe_top": "Linen Robe Top",
              "/items/bamboo_robe_top": "Bamboo Robe Top",
              "/items/silk_robe_top": "Silk Robe Top",
              "/items/radiant_robe_top": "Radiant Robe Top",
              "/items/dairyhands_bottoms": "Dairyhand's Bottoms",
              "/items/foragers_bottoms": "Forager's Bottoms",
              "/items/lumberjacks_bottoms": "Lumberjack's Bottoms",
              "/items/cheesemakers_bottoms": "Cheesemaker's Bottoms",
              "/items/crafters_bottoms": "Crafter's Bottoms",
              "/items/tailors_bottoms": "Tailor's Bottoms",
              "/items/chefs_bottoms": "Chef's Bottoms",
              "/items/brewers_bottoms": "Brewer's Bottoms",
              "/items/alchemists_bottoms": "Alchemist's Bottoms",
              "/items/enhancers_bottoms": "Enhancer's Bottoms",
              "/items/turtle_shell_legs": "Turtle Shell Legs",
              "/items/colossus_plate_legs": "Colossus Plate Legs",
              "/items/demonic_plate_legs": "Demonic Plate Legs",
              "/items/anchorbound_plate_legs": "Anchorbound Plate Legs",
              "/items/anchorbound_plate_legs_refined": "Anchorbound Plate Legs (R)",
              "/items/maelstrom_plate_legs": "Maelstrom Plate Legs",
              "/items/maelstrom_plate_legs_refined": "Maelstrom Plate Legs (R)",
              "/items/marine_chaps": "Marine Chaps",
              "/items/revenant_chaps": "Revenant Chaps",
              "/items/griffin_chaps": "Griffin Chaps",
              "/items/kraken_chaps": "Kraken Chaps",
              "/items/kraken_chaps_refined": "Kraken Chaps (R)",
              "/items/icy_robe_bottoms": "Icy Robe Bottoms",
              "/items/flaming_robe_bottoms": "Flaming Robe Bottoms",
              "/items/luna_robe_bottoms": "Luna Robe Bottoms",
              "/items/royal_water_robe_bottoms": "Royal Water Robe Bottoms",
              "/items/royal_water_robe_bottoms_refined": "Royal Water Robe Bottoms (R)",
              "/items/royal_nature_robe_bottoms": "Royal Nature Robe Bottoms",
              "/items/royal_nature_robe_bottoms_refined": "Royal Nature Robe Bottoms (R)",
              "/items/royal_fire_robe_bottoms": "Royal Fire Robe Bottoms",
              "/items/royal_fire_robe_bottoms_refined": "Royal Fire Robe Bottoms (R)",
              "/items/cheese_plate_legs": "Cheese Plate Legs",
              "/items/verdant_plate_legs": "Verdant Plate Legs",
              "/items/azure_plate_legs": "Azure Plate Legs",
              "/items/burble_plate_legs": "Burble Plate Legs",
              "/items/crimson_plate_legs": "Crimson Plate Legs",
              "/items/rainbow_plate_legs": "Rainbow Plate Legs",
              "/items/holy_plate_legs": "Holy Plate Legs",
              "/items/rough_chaps": "Rough Chaps",
              "/items/reptile_chaps": "Reptile Chaps",
              "/items/gobo_chaps": "Gobo Chaps",
              "/items/beast_chaps": "Beast Chaps",
              "/items/umbral_chaps": "Umbral Chaps",
              "/items/cotton_robe_bottoms": "Cotton Robe Bottoms",
              "/items/linen_robe_bottoms": "Linen Robe Bottoms",
              "/items/bamboo_robe_bottoms": "Bamboo Robe Bottoms",
              "/items/silk_robe_bottoms": "Silk Robe Bottoms",
              "/items/radiant_robe_bottoms": "Radiant Robe Bottoms",
              "/items/enchanted_gloves": "Enchanted Gloves",
              "/items/pincer_gloves": "Pincer Gloves",
              "/items/panda_gloves": "Panda Gloves",
              "/items/magnetic_gloves": "Magnetic Gloves",
              "/items/dodocamel_gauntlets": "Dodocamel Gauntlets",
              "/items/dodocamel_gauntlets_refined": "Dodocamel Gauntlets (R)",
              "/items/sighted_bracers": "Sighted Bracers",
              "/items/marksman_bracers": "Marksman Bracers",
              "/items/marksman_bracers_refined": "Marksman Bracers (R)",
              "/items/chrono_gloves": "Chrono Gloves",
              "/items/cheese_gauntlets": "Cheese Gauntlets",
              "/items/verdant_gauntlets": "Verdant Gauntlets",
              "/items/azure_gauntlets": "Azure Gauntlets",
              "/items/burble_gauntlets": "Burble Gauntlets",
              "/items/crimson_gauntlets": "Crimson Gauntlets",
              "/items/rainbow_gauntlets": "Rainbow Gauntlets",
              "/items/holy_gauntlets": "Holy Gauntlets",
              "/items/rough_bracers": "Rough Bracers",
              "/items/reptile_bracers": "Reptile Bracers",
              "/items/gobo_bracers": "Gobo Bracers",
              "/items/beast_bracers": "Beast Bracers",
              "/items/umbral_bracers": "Umbral Bracers",
              "/items/cotton_gloves": "Cotton Gloves",
              "/items/linen_gloves": "Linen Gloves",
              "/items/bamboo_gloves": "Bamboo Gloves",
              "/items/silk_gloves": "Silk Gloves",
              "/items/radiant_gloves": "Radiant Gloves",
              "/items/collectors_boots": "Collector's Boots",
              "/items/shoebill_shoes": "Shoebill Shoes",
              "/items/black_bear_shoes": "Black Bear Shoes",
              "/items/grizzly_bear_shoes": "Grizzly Bear Shoes",
              "/items/polar_bear_shoes": "Polar Bear Shoes",
              "/items/centaur_boots": "Centaur Boots",
              "/items/sorcerer_boots": "Sorcerer Boots",
              "/items/cheese_boots": "Cheese Boots",
              "/items/verdant_boots": "Verdant Boots",
              "/items/azure_boots": "Azure Boots",
              "/items/burble_boots": "Burble Boots",
              "/items/crimson_boots": "Crimson Boots",
              "/items/rainbow_boots": "Rainbow Boots",
              "/items/holy_boots": "Holy Boots",
              "/items/rough_boots": "Rough Boots",
              "/items/reptile_boots": "Reptile Boots",
              "/items/gobo_boots": "Gobo Boots",
              "/items/beast_boots": "Beast Boots",
              "/items/umbral_boots": "Umbral Boots",
              "/items/cotton_boots": "Cotton Boots",
              "/items/linen_boots": "Linen Boots",
              "/items/bamboo_boots": "Bamboo Boots",
              "/items/silk_boots": "Silk Boots",
              "/items/radiant_boots": "Radiant Boots",
              "/items/small_pouch": "Small Pouch",
              "/items/medium_pouch": "Medium Pouch",
              "/items/large_pouch": "Large Pouch",
              "/items/giant_pouch": "Giant Pouch",
              "/items/gluttonous_pouch": "Gluttonous Pouch",
              "/items/guzzling_pouch": "Guzzling Pouch",
              "/items/necklace_of_efficiency": "Necklace Of Efficiency",
              "/items/fighter_necklace": "Fighter Necklace",
              "/items/ranger_necklace": "Ranger Necklace",
              "/items/wizard_necklace": "Wizard Necklace",
              "/items/necklace_of_wisdom": "Necklace Of Wisdom",
              "/items/necklace_of_speed": "Necklace Of Speed",
              "/items/philosophers_necklace": "Philosopher's Necklace",
              "/items/earrings_of_gathering": "Earrings Of Gathering",
              "/items/earrings_of_essence_find": "Earrings Of Essence Find",
              "/items/earrings_of_armor": "Earrings Of Armor",
              "/items/earrings_of_regeneration": "Earrings Of Regeneration",
              "/items/earrings_of_resistance": "Earrings Of Resistance",
              "/items/earrings_of_rare_find": "Earrings Of Rare Find",
              "/items/earrings_of_critical_strike": "Earrings Of Critical Strike",
              "/items/philosophers_earrings": "Philosopher's Earrings",
              "/items/ring_of_gathering": "Ring Of Gathering",
              "/items/ring_of_essence_find": "Ring Of Essence Find",
              "/items/ring_of_armor": "Ring Of Armor",
              "/items/ring_of_regeneration": "Ring Of Regeneration",
              "/items/ring_of_resistance": "Ring Of Resistance",
              "/items/ring_of_rare_find": "Ring Of Rare Find",
              "/items/ring_of_critical_strike": "Ring Of Critical Strike",
              "/items/philosophers_ring": "Philosopher's Ring",
              "/items/trainee_milking_charm": "Trainee Milking Charm",
              "/items/basic_milking_charm": "Basic Milking Charm",
              "/items/advanced_milking_charm": "Advanced Milking Charm",
              "/items/expert_milking_charm": "Expert Milking Charm",
              "/items/master_milking_charm": "Master Milking Charm",
              "/items/grandmaster_milking_charm": "Grandmaster Milking Charm",
              "/items/trainee_foraging_charm": "Trainee Foraging Charm",
              "/items/basic_foraging_charm": "Basic Foraging Charm",
              "/items/advanced_foraging_charm": "Advanced Foraging Charm",
              "/items/expert_foraging_charm": "Expert Foraging Charm",
              "/items/master_foraging_charm": "Master Foraging Charm",
              "/items/grandmaster_foraging_charm": "Grandmaster Foraging Charm",
              "/items/trainee_woodcutting_charm": "Trainee Woodcutting Charm",
              "/items/basic_woodcutting_charm": "Basic Woodcutting Charm",
              "/items/advanced_woodcutting_charm": "Advanced Woodcutting Charm",
              "/items/expert_woodcutting_charm": "Expert Woodcutting Charm",
              "/items/master_woodcutting_charm": "Master Woodcutting Charm",
              "/items/grandmaster_woodcutting_charm": "Grandmaster Woodcutting Charm",
              "/items/trainee_cheesesmithing_charm": "Trainee Cheesesmithing Charm",
              "/items/basic_cheesesmithing_charm": "Basic Cheesesmithing Charm",
              "/items/advanced_cheesesmithing_charm": "Advanced Cheesesmithing Charm",
              "/items/expert_cheesesmithing_charm": "Expert Cheesesmithing Charm",
              "/items/master_cheesesmithing_charm": "Master Cheesesmithing Charm",
              "/items/grandmaster_cheesesmithing_charm": "Grandmaster Cheesesmithing Charm",
              "/items/trainee_crafting_charm": "Trainee Crafting Charm",
              "/items/basic_crafting_charm": "Basic Crafting Charm",
              "/items/advanced_crafting_charm": "Advanced Crafting Charm",
              "/items/expert_crafting_charm": "Expert Crafting Charm",
              "/items/master_crafting_charm": "Master Crafting Charm",
              "/items/grandmaster_crafting_charm": "Grandmaster Crafting Charm",
              "/items/trainee_tailoring_charm": "Trainee Tailoring Charm",
              "/items/basic_tailoring_charm": "Basic Tailoring Charm",
              "/items/advanced_tailoring_charm": "Advanced Tailoring Charm",
              "/items/expert_tailoring_charm": "Expert Tailoring Charm",
              "/items/master_tailoring_charm": "Master Tailoring Charm",
              "/items/grandmaster_tailoring_charm": "Grandmaster Tailoring Charm",
              "/items/trainee_cooking_charm": "Trainee Cooking Charm",
              "/items/basic_cooking_charm": "Basic Cooking Charm",
              "/items/advanced_cooking_charm": "Advanced Cooking Charm",
              "/items/expert_cooking_charm": "Expert Cooking Charm",
              "/items/master_cooking_charm": "Master Cooking Charm",
              "/items/grandmaster_cooking_charm": "Grandmaster Cooking Charm",
              "/items/trainee_brewing_charm": "Trainee Brewing Charm",
              "/items/basic_brewing_charm": "Basic Brewing Charm",
              "/items/advanced_brewing_charm": "Advanced Brewing Charm",
              "/items/expert_brewing_charm": "Expert Brewing Charm",
              "/items/master_brewing_charm": "Master Brewing Charm",
              "/items/grandmaster_brewing_charm": "Grandmaster Brewing Charm",
              "/items/trainee_alchemy_charm": "Trainee Alchemy Charm",
              "/items/basic_alchemy_charm": "Basic Alchemy Charm",
              "/items/advanced_alchemy_charm": "Advanced Alchemy Charm",
              "/items/expert_alchemy_charm": "Expert Alchemy Charm",
              "/items/master_alchemy_charm": "Master Alchemy Charm",
              "/items/grandmaster_alchemy_charm": "Grandmaster Alchemy Charm",
              "/items/trainee_enhancing_charm": "Trainee Enhancing Charm",
              "/items/basic_enhancing_charm": "Basic Enhancing Charm",
              "/items/advanced_enhancing_charm": "Advanced Enhancing Charm",
              "/items/expert_enhancing_charm": "Expert Enhancing Charm",
              "/items/master_enhancing_charm": "Master Enhancing Charm",
              "/items/grandmaster_enhancing_charm": "Grandmaster Enhancing Charm",
              "/items/trainee_stamina_charm": "Trainee Stamina Charm",
              "/items/basic_stamina_charm": "Basic Stamina Charm",
              "/items/advanced_stamina_charm": "Advanced Stamina Charm",
              "/items/expert_stamina_charm": "Expert Stamina Charm",
              "/items/master_stamina_charm": "Master Stamina Charm",
              "/items/grandmaster_stamina_charm": "Grandmaster Stamina Charm",
              "/items/trainee_intelligence_charm": "Trainee Intelligence Charm",
              "/items/basic_intelligence_charm": "Basic Intelligence Charm",
              "/items/advanced_intelligence_charm": "Advanced Intelligence Charm",
              "/items/expert_intelligence_charm": "Expert Intelligence Charm",
              "/items/master_intelligence_charm": "Master Intelligence Charm",
              "/items/grandmaster_intelligence_charm": "Grandmaster Intelligence Charm",
              "/items/trainee_attack_charm": "Trainee Attack Charm",
              "/items/basic_attack_charm": "Basic Attack Charm",
              "/items/advanced_attack_charm": "Advanced Attack Charm",
              "/items/expert_attack_charm": "Expert Attack Charm",
              "/items/master_attack_charm": "Master Attack Charm",
              "/items/grandmaster_attack_charm": "Grandmaster Attack Charm",
              "/items/trainee_defense_charm": "Trainee Defense Charm",
              "/items/basic_defense_charm": "Basic Defense Charm",
              "/items/advanced_defense_charm": "Advanced Defense Charm",
              "/items/expert_defense_charm": "Expert Defense Charm",
              "/items/master_defense_charm": "Master Defense Charm",
              "/items/grandmaster_defense_charm": "Grandmaster Defense Charm",
              "/items/trainee_melee_charm": "Trainee Melee Charm",
              "/items/basic_melee_charm": "Basic Melee Charm",
              "/items/advanced_melee_charm": "Advanced Melee Charm",
              "/items/expert_melee_charm": "Expert Melee Charm",
              "/items/master_melee_charm": "Master Melee Charm",
              "/items/grandmaster_melee_charm": "Grandmaster Melee Charm",
              "/items/trainee_ranged_charm": "Trainee Ranged Charm",
              "/items/basic_ranged_charm": "Basic Ranged Charm",
              "/items/advanced_ranged_charm": "Advanced Ranged Charm",
              "/items/expert_ranged_charm": "Expert Ranged Charm",
              "/items/master_ranged_charm": "Master Ranged Charm",
              "/items/grandmaster_ranged_charm": "Grandmaster Ranged Charm",
              "/items/trainee_magic_charm": "Trainee Magic Charm",
              "/items/basic_magic_charm": "Basic Magic Charm",
              "/items/advanced_magic_charm": "Advanced Magic Charm",
              "/items/expert_magic_charm": "Expert Magic Charm",
              "/items/master_magic_charm": "Master Magic Charm",
              "/items/grandmaster_magic_charm": "Grandmaster Magic Charm",
              "/items/basic_task_badge": "Basic Task Badge",
              "/items/advanced_task_badge": "Advanced Task Badge",
              "/items/expert_task_badge": "Expert Task Badge",
              "/items/celestial_brush": "Celestial Brush",
              "/items/cheese_brush": "Cheese Brush",
              "/items/verdant_brush": "Verdant Brush",
              "/items/azure_brush": "Azure Brush",
              "/items/burble_brush": "Burble Brush",
              "/items/crimson_brush": "Crimson Brush",
              "/items/rainbow_brush": "Rainbow Brush",
              "/items/holy_brush": "Holy Brush",
              "/items/celestial_shears": "Celestial Shears",
              "/items/cheese_shears": "Cheese Shears",
              "/items/verdant_shears": "Verdant Shears",
              "/items/azure_shears": "Azure Shears",
              "/items/burble_shears": "Burble Shears",
              "/items/crimson_shears": "Crimson Shears",
              "/items/rainbow_shears": "Rainbow Shears",
              "/items/holy_shears": "Holy Shears",
              "/items/celestial_hatchet": "Celestial Hatchet",
              "/items/cheese_hatchet": "Cheese Hatchet",
              "/items/verdant_hatchet": "Verdant Hatchet",
              "/items/azure_hatchet": "Azure Hatchet",
              "/items/burble_hatchet": "Burble Hatchet",
              "/items/crimson_hatchet": "Crimson Hatchet",
              "/items/rainbow_hatchet": "Rainbow Hatchet",
              "/items/holy_hatchet": "Holy Hatchet",
              "/items/celestial_hammer": "Celestial Hammer",
              "/items/cheese_hammer": "Cheese Hammer",
              "/items/verdant_hammer": "Verdant Hammer",
              "/items/azure_hammer": "Azure Hammer",
              "/items/burble_hammer": "Burble Hammer",
              "/items/crimson_hammer": "Crimson Hammer",
              "/items/rainbow_hammer": "Rainbow Hammer",
              "/items/holy_hammer": "Holy Hammer",
              "/items/celestial_chisel": "Celestial Chisel",
              "/items/cheese_chisel": "Cheese Chisel",
              "/items/verdant_chisel": "Verdant Chisel",
              "/items/azure_chisel": "Azure Chisel",
              "/items/burble_chisel": "Burble Chisel",
              "/items/crimson_chisel": "Crimson Chisel",
              "/items/rainbow_chisel": "Rainbow Chisel",
              "/items/holy_chisel": "Holy Chisel",
              "/items/celestial_needle": "Celestial Needle",
              "/items/cheese_needle": "Cheese Needle",
              "/items/verdant_needle": "Verdant Needle",
              "/items/azure_needle": "Azure Needle",
              "/items/burble_needle": "Burble Needle",
              "/items/crimson_needle": "Crimson Needle",
              "/items/rainbow_needle": "Rainbow Needle",
              "/items/holy_needle": "Holy Needle",
              "/items/celestial_spatula": "Celestial Spatula",
              "/items/cheese_spatula": "Cheese Spatula",
              "/items/verdant_spatula": "Verdant Spatula",
              "/items/azure_spatula": "Azure Spatula",
              "/items/burble_spatula": "Burble Spatula",
              "/items/crimson_spatula": "Crimson Spatula",
              "/items/rainbow_spatula": "Rainbow Spatula",
              "/items/holy_spatula": "Holy Spatula",
              "/items/celestial_pot": "Celestial Pot",
              "/items/cheese_pot": "Cheese Pot",
              "/items/verdant_pot": "Verdant Pot",
              "/items/azure_pot": "Azure Pot",
              "/items/burble_pot": "Burble Pot",
              "/items/crimson_pot": "Crimson Pot",
              "/items/rainbow_pot": "Rainbow Pot",
              "/items/holy_pot": "Holy Pot",
              "/items/celestial_alembic": "Celestial Alembic",
              "/items/cheese_alembic": "Cheese Alembic",
              "/items/verdant_alembic": "Verdant Alembic",
              "/items/azure_alembic": "Azure Alembic",
              "/items/burble_alembic": "Burble Alembic",
              "/items/crimson_alembic": "Crimson Alembic",
              "/items/rainbow_alembic": "Rainbow Alembic",
              "/items/holy_alembic": "Holy Alembic",
              "/items/celestial_enhancer": "Celestial Enhancer",
              "/items/cheese_enhancer": "Cheese Enhancer",
              "/items/verdant_enhancer": "Verdant Enhancer",
              "/items/azure_enhancer": "Azure Enhancer",
              "/items/burble_enhancer": "Burble Enhancer",
              "/items/crimson_enhancer": "Crimson Enhancer",
              "/items/rainbow_enhancer": "Rainbow Enhancer",
              "/items/holy_enhancer": "Holy Enhancer",
              "/items/milk": "Milk",
              "/items/verdant_milk": "Verdant Milk",
              "/items/azure_milk": "Azure Milk",
              "/items/burble_milk": "Burble Milk",
              "/items/crimson_milk": "Crimson Milk",
              "/items/rainbow_milk": "Rainbow Milk",
              "/items/holy_milk": "Holy Milk",
              "/items/cheese": "Cheese",
              "/items/verdant_cheese": "Verdant Cheese",
              "/items/azure_cheese": "Azure Cheese",
              "/items/burble_cheese": "Burble Cheese",
              "/items/crimson_cheese": "Crimson Cheese",
              "/items/rainbow_cheese": "Rainbow Cheese",
              "/items/holy_cheese": "Holy Cheese",
              "/items/log": "Log",
              "/items/birch_log": "Birch Log",
              "/items/cedar_log": "Cedar Log",
              "/items/purpleheart_log": "Purpleheart Log",
              "/items/ginkgo_log": "Ginkgo Log",
              "/items/redwood_log": "Redwood Log",
              "/items/arcane_log": "Arcane Log",
              "/items/lumber": "Lumber",
              "/items/birch_lumber": "Birch Lumber",
              "/items/cedar_lumber": "Cedar Lumber",
              "/items/purpleheart_lumber": "Purpleheart Lumber",
              "/items/ginkgo_lumber": "Ginkgo Lumber",
              "/items/redwood_lumber": "Redwood Lumber",
              "/items/arcane_lumber": "Arcane Lumber",
              "/items/rough_hide": "Rough Hide",
              "/items/reptile_hide": "Reptile Hide",
              "/items/gobo_hide": "Gobo Hide",
              "/items/beast_hide": "Beast Hide",
              "/items/umbral_hide": "Umbral Hide",
              "/items/rough_leather": "Rough Leather",
              "/items/reptile_leather": "Reptile Leather",
              "/items/gobo_leather": "Gobo Leather",
              "/items/beast_leather": "Beast Leather",
              "/items/umbral_leather": "Umbral Leather",
              "/items/cotton": "Cotton",
              "/items/flax": "Flax",
              "/items/bamboo_branch": "Bamboo Branch",
              "/items/cocoon": "Cocoon",
              "/items/radiant_fiber": "Radiant Fiber",
              "/items/cotton_fabric": "Cotton Fabric",
              "/items/linen_fabric": "Linen Fabric",
              "/items/bamboo_fabric": "Bamboo Fabric",
              "/items/silk_fabric": "Silk Fabric",
              "/items/radiant_fabric": "Radiant Fabric",
              "/items/egg": "Egg",
              "/items/wheat": "Wheat",
              "/items/sugar": "Sugar",
              "/items/blueberry": "Blueberry",
              "/items/blackberry": "Blackberry",
              "/items/strawberry": "Strawberry",
              "/items/mooberry": "Mooberry",
              "/items/marsberry": "Marsberry",
              "/items/spaceberry": "Spaceberry",
              "/items/apple": "Apple",
              "/items/orange": "Orange",
              "/items/plum": "Plum",
              "/items/peach": "Peach",
              "/items/dragon_fruit": "Dragon Fruit",
              "/items/star_fruit": "Star Fruit",
              "/items/arabica_coffee_bean": "Arabica Coffee Bean",
              "/items/robusta_coffee_bean": "Robusta Coffee Bean",
              "/items/liberica_coffee_bean": "Liberica Coffee Bean",
              "/items/excelsa_coffee_bean": "Excelsa Coffee Bean",
              "/items/fieriosa_coffee_bean": "Fieriosa Coffee Bean",
              "/items/spacia_coffee_bean": "Spacia Coffee Bean",
              "/items/green_tea_leaf": "Green Tea Leaf",
              "/items/black_tea_leaf": "Black Tea Leaf",
              "/items/burble_tea_leaf": "Burble Tea Leaf",
              "/items/moolong_tea_leaf": "Moolong Tea Leaf",
              "/items/red_tea_leaf": "Red Tea Leaf",
              "/items/emp_tea_leaf": "Emp Tea Leaf",
              "/items/catalyst_of_coinification": "Catalyst Of Coinification",
              "/items/catalyst_of_decomposition": "Catalyst Of Decomposition",
              "/items/catalyst_of_transmutation": "Catalyst Of Transmutation",
              "/items/prime_catalyst": "Prime Catalyst",
              "/items/snake_fang": "Snake Fang",
              "/items/shoebill_feather": "Shoebill Feather",
              "/items/snail_shell": "Snail Shell",
              "/items/crab_pincer": "Crab Pincer",
              "/items/turtle_shell": "Turtle Shell",
              "/items/marine_scale": "Marine Scale",
              "/items/treant_bark": "Treant Bark",
              "/items/centaur_hoof": "Centaur Hoof",
              "/items/luna_wing": "Luna Wing",
              "/items/gobo_rag": "Gobo Rag",
              "/items/goggles": "Goggles",
              "/items/magnifying_glass": "Magnifying Glass",
              "/items/eye_of_the_watcher": "Eye Of The Watcher",
              "/items/icy_cloth": "Icy Cloth",
              "/items/flaming_cloth": "Flaming Cloth",
              "/items/sorcerers_sole": "Sorcerer's Sole",
              "/items/chrono_sphere": "Chrono Sphere",
              "/items/frost_sphere": "Frost Sphere",
              "/items/panda_fluff": "Panda Fluff",
              "/items/black_bear_fluff": "Black Bear Fluff",
              "/items/grizzly_bear_fluff": "Grizzly Bear Fluff",
              "/items/polar_bear_fluff": "Polar Bear Fluff",
              "/items/red_panda_fluff": "Red Panda Fluff",
              "/items/magnet": "Magnet",
              "/items/stalactite_shard": "Stalactite Shard",
              "/items/living_granite": "Living Granite",
              "/items/colossus_core": "Colossus Core",
              "/items/vampire_fang": "Vampire Fang",
              "/items/werewolf_claw": "Werewolf Claw",
              "/items/revenant_anima": "Revenant Anima",
              "/items/soul_fragment": "Soul Fragment",
              "/items/infernal_ember": "Infernal Ember",
              "/items/demonic_core": "Demonic Core",
              "/items/griffin_leather": "Griffin Leather",
              "/items/manticore_sting": "Manticore Sting",
              "/items/jackalope_antler": "Jackalope Antler",
              "/items/dodocamel_plume": "Dodocamel Plume",
              "/items/griffin_talon": "Griffin Talon",
              "/items/chimerical_refinement_shard": "Chimerical Refinement Shard",
              "/items/acrobats_ribbon": "Acrobat's Ribbon",
              "/items/magicians_cloth": "Magician's Cloth",
              "/items/chaotic_chain": "Chaotic Chain",
              "/items/cursed_ball": "Cursed Ball",
              "/items/sinister_refinement_shard": "Sinister Refinement Shard",
              "/items/royal_cloth": "Royal Cloth",
              "/items/knights_ingot": "Knight's Ingot",
              "/items/bishops_scroll": "Bishop's Scroll",
              "/items/regal_jewel": "Regal Jewel",
              "/items/sundering_jewel": "Sundering Jewel",
              "/items/enchanted_refinement_shard": "Enchanted Refinement Shard",
              "/items/marksman_brooch": "Marksman Brooch",
              "/items/corsair_crest": "Corsair Crest",
              "/items/damaged_anchor": "Damaged Anchor",
              "/items/maelstrom_plating": "Maelstrom Plating",
              "/items/kraken_leather": "Kraken Leather",
              "/items/kraken_fang": "Kraken Fang",
              "/items/pirate_refinement_shard": "Pirate Refinement Shard",
              "/items/butter_of_proficiency": "Butter Of Proficiency",
              "/items/thread_of_expertise": "Thread Of Expertise",
              "/items/branch_of_insight": "Branch Of Insight",
              "/items/gluttonous_energy": "Gluttonous Energy",
              "/items/guzzling_energy": "Guzzling Energy",
              "/items/milking_essence": "Milking Essence",
              "/items/foraging_essence": "Foraging Essence",
              "/items/woodcutting_essence": "Woodcutting Essence",
              "/items/cheesesmithing_essence": "Cheesesmithing Essence",
              "/items/crafting_essence": "Crafting Essence",
              "/items/tailoring_essence": "Tailoring Essence",
              "/items/cooking_essence": "Cooking Essence",
              "/items/brewing_essence": "Brewing Essence",
              "/items/alchemy_essence": "Alchemy Essence",
              "/items/enhancing_essence": "Enhancing Essence",
              "/items/swamp_essence": "Swamp Essence",
              "/items/aqua_essence": "Aqua Essence",
              "/items/jungle_essence": "Jungle Essence",
              "/items/gobo_essence": "Gobo Essence",
              "/items/eyessence": "Eyessence",
              "/items/sorcerer_essence": "Sorcerer Essence",
              "/items/bear_essence": "Bear Essence",
              "/items/golem_essence": "Golem Essence",
              "/items/twilight_essence": "Twilight Essence",
              "/items/abyssal_essence": "Abyssal Essence",
              "/items/chimerical_essence": "Chimerical Essence",
              "/items/sinister_essence": "Sinister Essence",
              "/items/enchanted_essence": "Enchanted Essence",
              "/items/pirate_essence": "Pirate Essence",
              "/items/task_crystal": "Task Crystal",
              "/items/star_fragment": "Star Fragment",
              "/items/pearl": "Pearl",
              "/items/amber": "Amber",
              "/items/garnet": "Garnet",
              "/items/jade": "Jade",
              "/items/amethyst": "Amethyst",
              "/items/moonstone": "Moonstone",
              "/items/sunstone": "Sunstone",
              "/items/philosophers_stone": "Philosopher's Stone",
              "/items/crushed_pearl": "Crushed Pearl",
              "/items/crushed_amber": "Crushed Amber",
              "/items/crushed_garnet": "Crushed Garnet",
              "/items/crushed_jade": "Crushed Jade",
              "/items/crushed_amethyst": "Crushed Amethyst",
              "/items/crushed_moonstone": "Crushed Moonstone",
              "/items/crushed_sunstone": "Crushed Sunstone",
              "/items/crushed_philosophers_stone": "Crushed Philosopher's Stone",
              "/items/shard_of_protection": "Shard Of Protection",
              "/items/mirror_of_protection": "Mirror Of Protection"
            }
          }
        }
      },
      zh: {
        translation: {
          ...{
            itemNames: {
              "/items/coin": "金币",
              "/items/task_token": "任务代币",
              "/items/chimerical_token": "奇幻代币",
              "/items/sinister_token": "阴森代币",
              "/items/enchanted_token": "秘法代币",
              "/items/pirate_token": "海盗代币",
              "/items/cowbell": "牛铃",
              "/items/bag_of_10_cowbells": "牛铃袋 (10个)",
              "/items/purples_gift": "小紫牛的礼物",
              "/items/small_meteorite_cache": "小陨石舱",
              "/items/medium_meteorite_cache": "中陨石舱",
              "/items/large_meteorite_cache": "大陨石舱",
              "/items/small_artisans_crate": "小工匠匣",
              "/items/medium_artisans_crate": "中工匠匣",
              "/items/large_artisans_crate": "大工匠匣",
              "/items/small_treasure_chest": "小宝箱",
              "/items/medium_treasure_chest": "中宝箱",
              "/items/large_treasure_chest": "大宝箱",
              "/items/chimerical_chest": "奇幻宝箱",
              "/items/chimerical_refinement_chest": "奇幻精炼宝箱",
              "/items/sinister_chest": "阴森宝箱",
              "/items/sinister_refinement_chest": "阴森精炼宝箱",
              "/items/enchanted_chest": "秘法宝箱",
              "/items/enchanted_refinement_chest": "秘法精炼宝箱",
              "/items/pirate_chest": "海盗宝箱",
              "/items/pirate_refinement_chest": "海盗精炼宝箱",
              "/items/blue_key_fragment": "蓝色钥匙碎片",
              "/items/green_key_fragment": "绿色钥匙碎片",
              "/items/purple_key_fragment": "紫色钥匙碎片",
              "/items/white_key_fragment": "白色钥匙碎片",
              "/items/orange_key_fragment": "橙色钥匙碎片",
              "/items/brown_key_fragment": "棕色钥匙碎片",
              "/items/stone_key_fragment": "石头钥匙碎片",
              "/items/dark_key_fragment": "黑暗钥匙碎片",
              "/items/burning_key_fragment": "燃烧钥匙碎片",
              "/items/chimerical_entry_key": "奇幻钥匙",
              "/items/chimerical_chest_key": "奇幻宝箱钥匙",
              "/items/sinister_entry_key": "阴森钥匙",
              "/items/sinister_chest_key": "阴森宝箱钥匙",
              "/items/enchanted_entry_key": "秘法钥匙",
              "/items/enchanted_chest_key": "秘法宝箱钥匙",
              "/items/pirate_entry_key": "海盗钥匙",
              "/items/pirate_chest_key": "海盗宝箱钥匙",
              "/items/donut": "甜甜圈",
              "/items/blueberry_donut": "蓝莓甜甜圈",
              "/items/blackberry_donut": "黑莓甜甜圈",
              "/items/strawberry_donut": "草莓甜甜圈",
              "/items/mooberry_donut": "哞莓甜甜圈",
              "/items/marsberry_donut": "火星莓甜甜圈",
              "/items/spaceberry_donut": "太空莓甜甜圈",
              "/items/cupcake": "纸杯蛋糕",
              "/items/blueberry_cake": "蓝莓蛋糕",
              "/items/blackberry_cake": "黑莓蛋糕",
              "/items/strawberry_cake": "草莓蛋糕",
              "/items/mooberry_cake": "哞莓蛋糕",
              "/items/marsberry_cake": "火星莓蛋糕",
              "/items/spaceberry_cake": "太空莓蛋糕",
              "/items/gummy": "软糖",
              "/items/apple_gummy": "苹果软糖",
              "/items/orange_gummy": "橙子软糖",
              "/items/plum_gummy": "李子软糖",
              "/items/peach_gummy": "桃子软糖",
              "/items/dragon_fruit_gummy": "火龙果软糖",
              "/items/star_fruit_gummy": "杨桃软糖",
              "/items/yogurt": "酸奶",
              "/items/apple_yogurt": "苹果酸奶",
              "/items/orange_yogurt": "橙子酸奶",
              "/items/plum_yogurt": "李子酸奶",
              "/items/peach_yogurt": "桃子酸奶",
              "/items/dragon_fruit_yogurt": "火龙果酸奶",
              "/items/star_fruit_yogurt": "杨桃酸奶",
              "/items/milking_tea": "挤奶茶",
              "/items/foraging_tea": "采摘茶",
              "/items/woodcutting_tea": "伐木茶",
              "/items/cooking_tea": "烹饪茶",
              "/items/brewing_tea": "冲泡茶",
              "/items/alchemy_tea": "炼金茶",
              "/items/enhancing_tea": "强化茶",
              "/items/cheesesmithing_tea": "奶酪锻造茶",
              "/items/crafting_tea": "制作茶",
              "/items/tailoring_tea": "缝纫茶",
              "/items/super_milking_tea": "超级挤奶茶",
              "/items/super_foraging_tea": "超级采摘茶",
              "/items/super_woodcutting_tea": "超级伐木茶",
              "/items/super_cooking_tea": "超级烹饪茶",
              "/items/super_brewing_tea": "超级冲泡茶",
              "/items/super_alchemy_tea": "超级炼金茶",
              "/items/super_enhancing_tea": "超级强化茶",
              "/items/super_cheesesmithing_tea": "超级奶酪锻造茶",
              "/items/super_crafting_tea": "超级制作茶",
              "/items/super_tailoring_tea": "超级缝纫茶",
              "/items/ultra_milking_tea": "究极挤奶茶",
              "/items/ultra_foraging_tea": "究极采摘茶",
              "/items/ultra_woodcutting_tea": "究极伐木茶",
              "/items/ultra_cooking_tea": "究极烹饪茶",
              "/items/ultra_brewing_tea": "究极冲泡茶",
              "/items/ultra_alchemy_tea": "究极炼金茶",
              "/items/ultra_enhancing_tea": "究极强化茶",
              "/items/ultra_cheesesmithing_tea": "究极奶酪锻造茶",
              "/items/ultra_crafting_tea": "究极制作茶",
              "/items/ultra_tailoring_tea": "究极缝纫茶",
              "/items/gathering_tea": "采集茶",
              "/items/gourmet_tea": "美食茶",
              "/items/wisdom_tea": "经验茶",
              "/items/processing_tea": "加工茶",
              "/items/efficiency_tea": "效率茶",
              "/items/artisan_tea": "工匠茶",
              "/items/catalytic_tea": "催化茶",
              "/items/blessed_tea": "福气茶",
              "/items/stamina_coffee": "耐力咖啡",
              "/items/intelligence_coffee": "智力咖啡",
              "/items/defense_coffee": "防御咖啡",
              "/items/attack_coffee": "攻击咖啡",
              "/items/melee_coffee": "近战咖啡",
              "/items/ranged_coffee": "远程咖啡",
              "/items/magic_coffee": "魔法咖啡",
              "/items/super_stamina_coffee": "超级耐力咖啡",
              "/items/super_intelligence_coffee": "超级智力咖啡",
              "/items/super_defense_coffee": "超级防御咖啡",
              "/items/super_attack_coffee": "超级攻击咖啡",
              "/items/super_melee_coffee": "超级近战咖啡",
              "/items/super_ranged_coffee": "超级远程咖啡",
              "/items/super_magic_coffee": "超级魔法咖啡",
              "/items/ultra_stamina_coffee": "究极耐力咖啡",
              "/items/ultra_intelligence_coffee": "究极智力咖啡",
              "/items/ultra_defense_coffee": "究极防御咖啡",
              "/items/ultra_attack_coffee": "究极攻击咖啡",
              "/items/ultra_melee_coffee": "究极近战咖啡",
              "/items/ultra_ranged_coffee": "究极远程咖啡",
              "/items/ultra_magic_coffee": "究极魔法咖啡",
              "/items/wisdom_coffee": "经验咖啡",
              "/items/lucky_coffee": "幸运咖啡",
              "/items/swiftness_coffee": "迅捷咖啡",
              "/items/channeling_coffee": "吟唱咖啡",
              "/items/critical_coffee": "暴击咖啡",
              "/items/poke": "破胆之刺",
              "/items/impale": "透骨之刺",
              "/items/puncture": "破甲之刺",
              "/items/penetrating_strike": "贯心之刺",
              "/items/scratch": "爪影斩",
              "/items/cleave": "分裂斩",
              "/items/maim": "血刃斩",
              "/items/crippling_slash": "致残斩",
              "/items/smack": "重碾",
              "/items/sweep": "重扫",
              "/items/stunning_blow": "重锤",
              "/items/fracturing_impact": "碎裂冲击",
              "/items/shield_bash": "盾击",
              "/items/quick_shot": "快速射击",
              "/items/aqua_arrow": "流水箭",
              "/items/flame_arrow": "烈焰箭",
              "/items/rain_of_arrows": "箭雨",
              "/items/silencing_shot": "沉默之箭",
              "/items/steady_shot": "稳定射击",
              "/items/pestilent_shot": "疫病射击",
              "/items/penetrating_shot": "贯穿射击",
              "/items/water_strike": "流水冲击",
              "/items/ice_spear": "冰枪术",
              "/items/frost_surge": "冰霜爆裂",
              "/items/mana_spring": "法力喷泉",
              "/items/entangle": "缠绕",
              "/items/toxic_pollen": "剧毒粉尘",
              "/items/natures_veil": "自然菌幕",
              "/items/life_drain": "生命吸取",
              "/items/fireball": "火球",
              "/items/flame_blast": "熔岩爆裂",
              "/items/firestorm": "火焰风暴",
              "/items/smoke_burst": "烟爆灭影",
              "/items/minor_heal": "初级自愈术",
              "/items/heal": "自愈术",
              "/items/quick_aid": "快速治疗术",
              "/items/rejuvenate": "群体治疗术",
              "/items/taunt": "嘲讽",
              "/items/provoke": "挑衅",
              "/items/toughness": "坚韧",
              "/items/elusiveness": "闪避",
              "/items/precision": "精确",
              "/items/berserk": "狂暴",
              "/items/elemental_affinity": "元素增幅",
              "/items/frenzy": "狂速",
              "/items/spike_shell": "尖刺防护",
              "/items/retribution": "报应",
              "/items/vampirism": "吸血",
              "/items/revive": "复活",
              "/items/insanity": "疯狂",
              "/items/invincible": "无敌",
              "/items/speed_aura": "速度光环",
              "/items/guardian_aura": "守护光环",
              "/items/fierce_aura": "物理光环",
              "/items/critical_aura": "暴击光环",
              "/items/mystic_aura": "元素光环",
              "/items/gobo_stabber": "哥布林长剑",
              "/items/gobo_slasher": "哥布林关刀",
              "/items/gobo_smasher": "哥布林狼牙棒",
              "/items/spiked_bulwark": "尖刺重盾",
              "/items/werewolf_slasher": "狼人关刀",
              "/items/griffin_bulwark": "狮鹫重盾",
              "/items/griffin_bulwark_refined": "狮鹫重盾（精）",
              "/items/gobo_shooter": "哥布林弹弓",
              "/items/vampiric_bow": "吸血弓",
              "/items/cursed_bow": "咒怨之弓",
              "/items/cursed_bow_refined": "咒怨之弓（精）",
              "/items/gobo_boomstick": "哥布林火棍",
              "/items/cheese_bulwark": "奶酪重盾",
              "/items/verdant_bulwark": "翠绿重盾",
              "/items/azure_bulwark": "蔚蓝重盾",
              "/items/burble_bulwark": "深紫重盾",
              "/items/crimson_bulwark": "绛红重盾",
              "/items/rainbow_bulwark": "彩虹重盾",
              "/items/holy_bulwark": "神圣重盾",
              "/items/wooden_bow": "木弓",
              "/items/birch_bow": "桦木弓",
              "/items/cedar_bow": "雪松弓",
              "/items/purpleheart_bow": "紫心弓",
              "/items/ginkgo_bow": "银杏弓",
              "/items/redwood_bow": "红杉弓",
              "/items/arcane_bow": "神秘弓",
              "/items/stalactite_spear": "石钟长枪",
              "/items/granite_bludgeon": "花岗岩大棒",
              "/items/furious_spear": "狂怒长枪",
              "/items/furious_spear_refined": "狂怒长枪（精）",
              "/items/regal_sword": "君王之剑",
              "/items/regal_sword_refined": "君王之剑（精）",
              "/items/chaotic_flail": "混沌连枷",
              "/items/chaotic_flail_refined": "混沌连枷（精）",
              "/items/soul_hunter_crossbow": "灵魂猎手弩",
              "/items/sundering_crossbow": "裂空之弩",
              "/items/sundering_crossbow_refined": "裂空之弩（精）",
              "/items/frost_staff": "冰霜法杖",
              "/items/infernal_battlestaff": "炼狱法杖",
              "/items/jackalope_staff": "鹿角兔之杖",
              "/items/rippling_trident": "涟漪三叉戟",
              "/items/rippling_trident_refined": "涟漪三叉戟（精）",
              "/items/blooming_trident": "绽放三叉戟",
              "/items/blooming_trident_refined": "绽放三叉戟（精）",
              "/items/blazing_trident": "炽焰三叉戟",
              "/items/blazing_trident_refined": "炽焰三叉戟（精）",
              "/items/cheese_sword": "奶酪剑",
              "/items/verdant_sword": "翠绿剑",
              "/items/azure_sword": "蔚蓝剑",
              "/items/burble_sword": "深紫剑",
              "/items/crimson_sword": "绛红剑",
              "/items/rainbow_sword": "彩虹剑",
              "/items/holy_sword": "神圣剑",
              "/items/cheese_spear": "奶酪长枪",
              "/items/verdant_spear": "翠绿长枪",
              "/items/azure_spear": "蔚蓝长枪",
              "/items/burble_spear": "深紫长枪",
              "/items/crimson_spear": "绛红长枪",
              "/items/rainbow_spear": "彩虹长枪",
              "/items/holy_spear": "神圣长枪",
              "/items/cheese_mace": "奶酪钉头锤",
              "/items/verdant_mace": "翠绿钉头锤",
              "/items/azure_mace": "蔚蓝钉头锤",
              "/items/burble_mace": "深紫钉头锤",
              "/items/crimson_mace": "绛红钉头锤",
              "/items/rainbow_mace": "彩虹钉头锤",
              "/items/holy_mace": "神圣钉头锤",
              "/items/wooden_crossbow": "木弩",
              "/items/birch_crossbow": "桦木弩",
              "/items/cedar_crossbow": "雪松弩",
              "/items/purpleheart_crossbow": "紫心弩",
              "/items/ginkgo_crossbow": "银杏弩",
              "/items/redwood_crossbow": "红杉弩",
              "/items/arcane_crossbow": "神秘弩",
              "/items/wooden_water_staff": "木制水法杖",
              "/items/birch_water_staff": "桦木水法杖",
              "/items/cedar_water_staff": "雪松水法杖",
              "/items/purpleheart_water_staff": "紫心水法杖",
              "/items/ginkgo_water_staff": "银杏水法杖",
              "/items/redwood_water_staff": "红杉水法杖",
              "/items/arcane_water_staff": "神秘水法杖",
              "/items/wooden_nature_staff": "木制自然法杖",
              "/items/birch_nature_staff": "桦木自然法杖",
              "/items/cedar_nature_staff": "雪松自然法杖",
              "/items/purpleheart_nature_staff": "紫心自然法杖",
              "/items/ginkgo_nature_staff": "银杏自然法杖",
              "/items/redwood_nature_staff": "红杉自然法杖",
              "/items/arcane_nature_staff": "神秘自然法杖",
              "/items/wooden_fire_staff": "木制火法杖",
              "/items/birch_fire_staff": "桦木火法杖",
              "/items/cedar_fire_staff": "雪松火法杖",
              "/items/purpleheart_fire_staff": "紫心火法杖",
              "/items/ginkgo_fire_staff": "银杏火法杖",
              "/items/redwood_fire_staff": "红杉火法杖",
              "/items/arcane_fire_staff": "神秘火法杖",
              "/items/eye_watch": "掌上监工",
              "/items/snake_fang_dirk": "蛇牙短剑",
              "/items/vision_shield": "视觉盾",
              "/items/gobo_defender": "哥布林防御者",
              "/items/vampire_fang_dirk": "吸血鬼短剑",
              "/items/knights_aegis": "骑士盾",
              "/items/knights_aegis_refined": "骑士盾（精）",
              "/items/treant_shield": "树人盾",
              "/items/manticore_shield": "蝎狮盾",
              "/items/tome_of_healing": "治疗之书",
              "/items/tome_of_the_elements": "元素之书",
              "/items/watchful_relic": "警戒遗物",
              "/items/bishops_codex": "主教法典",
              "/items/bishops_codex_refined": "主教法典（精）",
              "/items/cheese_buckler": "奶酪圆盾",
              "/items/verdant_buckler": "翠绿圆盾",
              "/items/azure_buckler": "蔚蓝圆盾",
              "/items/burble_buckler": "深紫圆盾",
              "/items/crimson_buckler": "绛红圆盾",
              "/items/rainbow_buckler": "彩虹圆盾",
              "/items/holy_buckler": "神圣圆盾",
              "/items/wooden_shield": "木盾",
              "/items/birch_shield": "桦木盾",
              "/items/cedar_shield": "雪松盾",
              "/items/purpleheart_shield": "紫心盾",
              "/items/ginkgo_shield": "银杏盾",
              "/items/redwood_shield": "红杉盾",
              "/items/arcane_shield": "神秘盾",
              "/items/sinister_cape": "阴森斗篷",
              "/items/sinister_cape_refined": "阴森斗篷（精）",
              "/items/chimerical_quiver": "奇幻箭袋",
              "/items/chimerical_quiver_refined": "奇幻箭袋（精）",
              "/items/enchanted_cloak": "秘法披风",
              "/items/enchanted_cloak_refined": "秘法披风（精）",
              "/items/red_culinary_hat": "红色厨师帽",
              "/items/snail_shell_helmet": "蜗牛壳头盔",
              "/items/vision_helmet": "视觉头盔",
              "/items/fluffy_red_hat": "蓬松红帽子",
              "/items/corsair_helmet": "掠夺者头盔",
              "/items/corsair_helmet_refined": "掠夺者头盔（精）",
              "/items/acrobatic_hood": "杂技师兜帽",
              "/items/acrobatic_hood_refined": "杂技师兜帽（精）",
              "/items/magicians_hat": "魔术师帽",
              "/items/magicians_hat_refined": "魔术师帽（精）",
              "/items/cheese_helmet": "奶酪头盔",
              "/items/verdant_helmet": "翠绿头盔",
              "/items/azure_helmet": "蔚蓝头盔",
              "/items/burble_helmet": "深紫头盔",
              "/items/crimson_helmet": "绛红头盔",
              "/items/rainbow_helmet": "彩虹头盔",
              "/items/holy_helmet": "神圣头盔",
              "/items/rough_hood": "粗糙兜帽",
              "/items/reptile_hood": "爬行动物兜帽",
              "/items/gobo_hood": "哥布林兜帽",
              "/items/beast_hood": "野兽兜帽",
              "/items/umbral_hood": "暗影兜帽",
              "/items/cotton_hat": "棉帽",
              "/items/linen_hat": "亚麻帽",
              "/items/bamboo_hat": "竹帽",
              "/items/silk_hat": "丝帽",
              "/items/radiant_hat": "光辉帽",
              "/items/dairyhands_top": "挤奶工上衣",
              "/items/foragers_top": "采摘者上衣",
              "/items/lumberjacks_top": "伐木工上衣",
              "/items/cheesemakers_top": "奶酪师上衣",
              "/items/crafters_top": "工匠上衣",
              "/items/tailors_top": "裁缝上衣",
              "/items/chefs_top": "厨师上衣",
              "/items/brewers_top": "饮品师上衣",
              "/items/alchemists_top": "炼金师上衣",
              "/items/enhancers_top": "强化师上衣",
              "/items/gator_vest": "鳄鱼马甲",
              "/items/turtle_shell_body": "龟壳胸甲",
              "/items/colossus_plate_body": "巨像胸甲",
              "/items/demonic_plate_body": "恶魔胸甲",
              "/items/anchorbound_plate_body": "锚定胸甲",
              "/items/anchorbound_plate_body_refined": "锚定胸甲（精）",
              "/items/maelstrom_plate_body": "怒涛胸甲",
              "/items/maelstrom_plate_body_refined": "怒涛胸甲（精）",
              "/items/marine_tunic": "海洋皮衣",
              "/items/revenant_tunic": "亡灵皮衣",
              "/items/griffin_tunic": "狮鹫皮衣",
              "/items/kraken_tunic": "克拉肯皮衣",
              "/items/kraken_tunic_refined": "克拉肯皮衣（精）",
              "/items/icy_robe_top": "冰霜袍服",
              "/items/flaming_robe_top": "烈焰袍服",
              "/items/luna_robe_top": "月神袍服",
              "/items/royal_water_robe_top": "皇家水系袍服",
              "/items/royal_water_robe_top_refined": "皇家水系袍服（精）",
              "/items/royal_nature_robe_top": "皇家自然系袍服",
              "/items/royal_nature_robe_top_refined": "皇家自然系袍服（精）",
              "/items/royal_fire_robe_top": "皇家火系袍服",
              "/items/royal_fire_robe_top_refined": "皇家火系袍服（精）",
              "/items/cheese_plate_body": "奶酪胸甲",
              "/items/verdant_plate_body": "翠绿胸甲",
              "/items/azure_plate_body": "蔚蓝胸甲",
              "/items/burble_plate_body": "深紫胸甲",
              "/items/crimson_plate_body": "绛红胸甲",
              "/items/rainbow_plate_body": "彩虹胸甲",
              "/items/holy_plate_body": "神圣胸甲",
              "/items/rough_tunic": "粗糙皮衣",
              "/items/reptile_tunic": "爬行动物皮衣",
              "/items/gobo_tunic": "哥布林皮衣",
              "/items/beast_tunic": "野兽皮衣",
              "/items/umbral_tunic": "暗影皮衣",
              "/items/cotton_robe_top": "棉袍服",
              "/items/linen_robe_top": "亚麻袍服",
              "/items/bamboo_robe_top": "竹袍服",
              "/items/silk_robe_top": "丝绸袍服",
              "/items/radiant_robe_top": "光辉袍服",
              "/items/dairyhands_bottoms": "挤奶工下装",
              "/items/foragers_bottoms": "采摘者下装",
              "/items/lumberjacks_bottoms": "伐木工下装",
              "/items/cheesemakers_bottoms": "奶酪师下装",
              "/items/crafters_bottoms": "工匠下装",
              "/items/tailors_bottoms": "裁缝下装",
              "/items/chefs_bottoms": "厨师下装",
              "/items/brewers_bottoms": "饮品师下装",
              "/items/alchemists_bottoms": "炼金师下装",
              "/items/enhancers_bottoms": "强化师下装",
              "/items/turtle_shell_legs": "龟壳腿甲",
              "/items/colossus_plate_legs": "巨像腿甲",
              "/items/demonic_plate_legs": "恶魔腿甲",
              "/items/anchorbound_plate_legs": "锚定腿甲",
              "/items/anchorbound_plate_legs_refined": "锚定腿甲（精）",
              "/items/maelstrom_plate_legs": "怒涛腿甲",
              "/items/maelstrom_plate_legs_refined": "怒涛腿甲（精）",
              "/items/marine_chaps": "航海皮裤",
              "/items/revenant_chaps": "亡灵皮裤",
              "/items/griffin_chaps": "狮鹫皮裤",
              "/items/kraken_chaps": "克拉肯皮裤",
              "/items/kraken_chaps_refined": "克拉肯皮裤（精）",
              "/items/icy_robe_bottoms": "冰霜袍裙",
              "/items/flaming_robe_bottoms": "烈焰袍裙",
              "/items/luna_robe_bottoms": "月神袍裙",
              "/items/royal_water_robe_bottoms": "皇家水系袍裙",
              "/items/royal_water_robe_bottoms_refined": "皇家水系袍裙（精）",
              "/items/royal_nature_robe_bottoms": "皇家自然系袍裙",
              "/items/royal_nature_robe_bottoms_refined": "皇家自然系袍裙（精）",
              "/items/royal_fire_robe_bottoms": "皇家火系袍裙",
              "/items/royal_fire_robe_bottoms_refined": "皇家火系袍裙（精）",
              "/items/cheese_plate_legs": "奶酪腿甲",
              "/items/verdant_plate_legs": "翠绿腿甲",
              "/items/azure_plate_legs": "蔚蓝腿甲",
              "/items/burble_plate_legs": "深紫腿甲",
              "/items/crimson_plate_legs": "绛红腿甲",
              "/items/rainbow_plate_legs": "彩虹腿甲",
              "/items/holy_plate_legs": "神圣腿甲",
              "/items/rough_chaps": "粗糙皮裤",
              "/items/reptile_chaps": "爬行动物皮裤",
              "/items/gobo_chaps": "哥布林皮裤",
              "/items/beast_chaps": "野兽皮裤",
              "/items/umbral_chaps": "暗影皮裤",
              "/items/cotton_robe_bottoms": "棉袍裙",
              "/items/linen_robe_bottoms": "亚麻袍裙",
              "/items/bamboo_robe_bottoms": "竹袍裙",
              "/items/silk_robe_bottoms": "丝绸袍裙",
              "/items/radiant_robe_bottoms": "光辉袍裙",
              "/items/enchanted_gloves": "附魔手套",
              "/items/pincer_gloves": "蟹钳手套",
              "/items/panda_gloves": "熊猫手套",
              "/items/magnetic_gloves": "磁力手套",
              "/items/dodocamel_gauntlets": "渡渡驼护手",
              "/items/dodocamel_gauntlets_refined": "渡渡驼护手（精）",
              "/items/sighted_bracers": "瞄准护腕",
              "/items/marksman_bracers": "神射护腕",
              "/items/marksman_bracers_refined": "神射护腕（精）",
              "/items/chrono_gloves": "时空手套",
              "/items/cheese_gauntlets": "奶酪护手",
              "/items/verdant_gauntlets": "翠绿护手",
              "/items/azure_gauntlets": "蔚蓝护手",
              "/items/burble_gauntlets": "深紫护手",
              "/items/crimson_gauntlets": "绛红护手",
              "/items/rainbow_gauntlets": "彩虹护手",
              "/items/holy_gauntlets": "神圣护手",
              "/items/rough_bracers": "粗糙护腕",
              "/items/reptile_bracers": "爬行动物护腕",
              "/items/gobo_bracers": "哥布林护腕",
              "/items/beast_bracers": "野兽护腕",
              "/items/umbral_bracers": "暗影护腕",
              "/items/cotton_gloves": "棉手套",
              "/items/linen_gloves": "亚麻手套",
              "/items/bamboo_gloves": "竹手套",
              "/items/silk_gloves": "丝手套",
              "/items/radiant_gloves": "光辉手套",
              "/items/collectors_boots": "收藏家靴",
              "/items/shoebill_shoes": "鲸头鹳鞋",
              "/items/black_bear_shoes": "黑熊鞋",
              "/items/grizzly_bear_shoes": "棕熊鞋",
              "/items/polar_bear_shoes": "北极熊鞋",
              "/items/centaur_boots": "半人马靴",
              "/items/sorcerer_boots": "巫师靴",
              "/items/cheese_boots": "奶酪靴",
              "/items/verdant_boots": "翠绿靴",
              "/items/azure_boots": "蔚蓝靴",
              "/items/burble_boots": "深紫靴",
              "/items/crimson_boots": "绛红靴",
              "/items/rainbow_boots": "彩虹靴",
              "/items/holy_boots": "神圣靴",
              "/items/rough_boots": "粗糙靴",
              "/items/reptile_boots": "爬行动物靴",
              "/items/gobo_boots": "哥布林靴",
              "/items/beast_boots": "野兽靴",
              "/items/umbral_boots": "暗影靴",
              "/items/cotton_boots": "棉靴",
              "/items/linen_boots": "亚麻靴",
              "/items/bamboo_boots": "竹靴",
              "/items/silk_boots": "丝靴",
              "/items/radiant_boots": "光辉靴",
              "/items/small_pouch": "小袋子",
              "/items/medium_pouch": "中袋子",
              "/items/large_pouch": "大袋子",
              "/items/giant_pouch": "巨大袋子",
              "/items/gluttonous_pouch": "贪食之袋",
              "/items/guzzling_pouch": "暴饮之囊",
              "/items/necklace_of_efficiency": "效率项链",
              "/items/fighter_necklace": "战士项链",
              "/items/ranger_necklace": "射手项链",
              "/items/wizard_necklace": "巫师项链",
              "/items/necklace_of_wisdom": "经验项链",
              "/items/necklace_of_speed": "速度项链",
              "/items/philosophers_necklace": "贤者项链",
              "/items/earrings_of_gathering": "采集耳环",
              "/items/earrings_of_essence_find": "精华发现耳环",
              "/items/earrings_of_armor": "护甲耳环",
              "/items/earrings_of_regeneration": "恢复耳环",
              "/items/earrings_of_resistance": "抗性耳环",
              "/items/earrings_of_rare_find": "稀有发现耳环",
              "/items/earrings_of_critical_strike": "暴击耳环",
              "/items/philosophers_earrings": "贤者耳环",
              "/items/ring_of_gathering": "采集戒指",
              "/items/ring_of_essence_find": "精华发现戒指",
              "/items/ring_of_armor": "护甲戒指",
              "/items/ring_of_regeneration": "恢复戒指",
              "/items/ring_of_resistance": "抗性戒指",
              "/items/ring_of_rare_find": "稀有发现戒指",
              "/items/ring_of_critical_strike": "暴击戒指",
              "/items/philosophers_ring": "贤者戒指",
              "/items/trainee_milking_charm": "实习挤奶护符",
              "/items/basic_milking_charm": "基础挤奶护符",
              "/items/advanced_milking_charm": "高级挤奶护符",
              "/items/expert_milking_charm": "专家挤奶护符",
              "/items/master_milking_charm": "大师挤奶护符",
              "/items/grandmaster_milking_charm": "宗师挤奶护符",
              "/items/trainee_foraging_charm": "实习采摘护符",
              "/items/basic_foraging_charm": "基础采摘护符",
              "/items/advanced_foraging_charm": "高级采摘护符",
              "/items/expert_foraging_charm": "专家采摘护符",
              "/items/master_foraging_charm": "大师采摘护符",
              "/items/grandmaster_foraging_charm": "宗师采摘护符",
              "/items/trainee_woodcutting_charm": "实习伐木护符",
              "/items/basic_woodcutting_charm": "基础伐木护符",
              "/items/advanced_woodcutting_charm": "高级伐木护符",
              "/items/expert_woodcutting_charm": "专家伐木护符",
              "/items/master_woodcutting_charm": "大师伐木护符",
              "/items/grandmaster_woodcutting_charm": "宗师伐木护符",
              "/items/trainee_cheesesmithing_charm": "实习奶酪锻造护符",
              "/items/basic_cheesesmithing_charm": "基础奶酪锻造护符",
              "/items/advanced_cheesesmithing_charm": "高级奶酪锻造护符",
              "/items/expert_cheesesmithing_charm": "专家奶酪锻造护符",
              "/items/master_cheesesmithing_charm": "大师奶酪锻造护符",
              "/items/grandmaster_cheesesmithing_charm": "宗师奶酪锻造护符",
              "/items/trainee_crafting_charm": "实习制作护符",
              "/items/basic_crafting_charm": "基础制作护符",
              "/items/advanced_crafting_charm": "高级制作护符",
              "/items/expert_crafting_charm": "专家制作护符",
              "/items/master_crafting_charm": "大师制作护符",
              "/items/grandmaster_crafting_charm": "宗师制作护符",
              "/items/trainee_tailoring_charm": "实习缝纫护符",
              "/items/basic_tailoring_charm": "基础缝纫护符",
              "/items/advanced_tailoring_charm": "高级缝纫护符",
              "/items/expert_tailoring_charm": "专家缝纫护符",
              "/items/master_tailoring_charm": "大师缝纫护符",
              "/items/grandmaster_tailoring_charm": "宗师缝纫护符",
              "/items/trainee_cooking_charm": "实习烹饪护符",
              "/items/basic_cooking_charm": "基础烹饪护符",
              "/items/advanced_cooking_charm": "高级烹饪护符",
              "/items/expert_cooking_charm": "专家烹饪护符",
              "/items/master_cooking_charm": "大师烹饪护符",
              "/items/grandmaster_cooking_charm": "宗师烹饪护符",
              "/items/trainee_brewing_charm": "实习冲泡护符",
              "/items/basic_brewing_charm": "基础冲泡护符",
              "/items/advanced_brewing_charm": "高级冲泡护符",
              "/items/expert_brewing_charm": "专家冲泡护符",
              "/items/master_brewing_charm": "大师冲泡护符",
              "/items/grandmaster_brewing_charm": "宗师冲泡护符",
              "/items/trainee_alchemy_charm": "实习炼金护符",
              "/items/basic_alchemy_charm": "基础炼金护符",
              "/items/advanced_alchemy_charm": "高级炼金护符",
              "/items/expert_alchemy_charm": "专家炼金护符",
              "/items/master_alchemy_charm": "大师炼金护符",
              "/items/grandmaster_alchemy_charm": "宗师炼金护符",
              "/items/trainee_enhancing_charm": "实习强化护符",
              "/items/basic_enhancing_charm": "基础强化护符",
              "/items/advanced_enhancing_charm": "高级强化护符",
              "/items/expert_enhancing_charm": "专家强化护符",
              "/items/master_enhancing_charm": "大师强化护符",
              "/items/grandmaster_enhancing_charm": "宗师强化护符",
              "/items/trainee_stamina_charm": "实习耐力护符",
              "/items/basic_stamina_charm": "基础耐力护符",
              "/items/advanced_stamina_charm": "高级耐力护符",
              "/items/expert_stamina_charm": "专家耐力护符",
              "/items/master_stamina_charm": "大师耐力护符",
              "/items/grandmaster_stamina_charm": "宗师耐力护符",
              "/items/trainee_intelligence_charm": "实习智力护符",
              "/items/basic_intelligence_charm": "基础智力护符",
              "/items/advanced_intelligence_charm": "高级智力护符",
              "/items/expert_intelligence_charm": "专家智力护符",
              "/items/master_intelligence_charm": "大师智力护符",
              "/items/grandmaster_intelligence_charm": "宗师智力护符",
              "/items/trainee_attack_charm": "实习攻击护符",
              "/items/basic_attack_charm": "基础攻击护符",
              "/items/advanced_attack_charm": "高级攻击护符",
              "/items/expert_attack_charm": "专家攻击护符",
              "/items/master_attack_charm": "大师攻击护符",
              "/items/grandmaster_attack_charm": "宗师攻击护符",
              "/items/trainee_defense_charm": "实习防御护符",
              "/items/basic_defense_charm": "基础防御护符",
              "/items/advanced_defense_charm": "高级防御护符",
              "/items/expert_defense_charm": "专家防御护符",
              "/items/master_defense_charm": "大师防御护符",
              "/items/grandmaster_defense_charm": "宗师防御护符",
              "/items/trainee_melee_charm": "实习近战护符",
              "/items/basic_melee_charm": "基础近战护符",
              "/items/advanced_melee_charm": "高级近战护符",
              "/items/expert_melee_charm": "专家近战护符",
              "/items/master_melee_charm": "大师近战护符",
              "/items/grandmaster_melee_charm": "宗师近战护符",
              "/items/trainee_ranged_charm": "实习远程护符",
              "/items/basic_ranged_charm": "基础远程护符",
              "/items/advanced_ranged_charm": "高级远程护符",
              "/items/expert_ranged_charm": "专家远程护符",
              "/items/master_ranged_charm": "大师远程护符",
              "/items/grandmaster_ranged_charm": "宗师远程护符",
              "/items/trainee_magic_charm": "实习魔法护符",
              "/items/basic_magic_charm": "基础魔法护符",
              "/items/advanced_magic_charm": "高级魔法护符",
              "/items/expert_magic_charm": "专家魔法护符",
              "/items/master_magic_charm": "大师魔法护符",
              "/items/grandmaster_magic_charm": "宗师魔法护符",
              "/items/basic_task_badge": "基础任务徽章",
              "/items/advanced_task_badge": "高级任务徽章",
              "/items/expert_task_badge": "专家任务徽章",
              "/items/celestial_brush": "星空刷子",
              "/items/cheese_brush": "奶酪刷子",
              "/items/verdant_brush": "翠绿刷子",
              "/items/azure_brush": "蔚蓝刷子",
              "/items/burble_brush": "深紫刷子",
              "/items/crimson_brush": "绛红刷子",
              "/items/rainbow_brush": "彩虹刷子",
              "/items/holy_brush": "神圣刷子",
              "/items/celestial_shears": "星空剪刀",
              "/items/cheese_shears": "奶酪剪刀",
              "/items/verdant_shears": "翠绿剪刀",
              "/items/azure_shears": "蔚蓝剪刀",
              "/items/burble_shears": "深紫剪刀",
              "/items/crimson_shears": "绛红剪刀",
              "/items/rainbow_shears": "彩虹剪刀",
              "/items/holy_shears": "神圣剪刀",
              "/items/celestial_hatchet": "星空斧头",
              "/items/cheese_hatchet": "奶酪斧头",
              "/items/verdant_hatchet": "翠绿斧头",
              "/items/azure_hatchet": "蔚蓝斧头",
              "/items/burble_hatchet": "深紫斧头",
              "/items/crimson_hatchet": "绛红斧头",
              "/items/rainbow_hatchet": "彩虹斧头",
              "/items/holy_hatchet": "神圣斧头",
              "/items/celestial_hammer": "星空锤子",
              "/items/cheese_hammer": "奶酪锤子",
              "/items/verdant_hammer": "翠绿锤子",
              "/items/azure_hammer": "蔚蓝锤子",
              "/items/burble_hammer": "深紫锤子",
              "/items/crimson_hammer": "绛红锤子",
              "/items/rainbow_hammer": "彩虹锤子",
              "/items/holy_hammer": "神圣锤子",
              "/items/celestial_chisel": "星空凿子",
              "/items/cheese_chisel": "奶酪凿子",
              "/items/verdant_chisel": "翠绿凿子",
              "/items/azure_chisel": "蔚蓝凿子",
              "/items/burble_chisel": "深紫凿子",
              "/items/crimson_chisel": "绛红凿子",
              "/items/rainbow_chisel": "彩虹凿子",
              "/items/holy_chisel": "神圣凿子",
              "/items/celestial_needle": "星空针",
              "/items/cheese_needle": "奶酪针",
              "/items/verdant_needle": "翠绿针",
              "/items/azure_needle": "蔚蓝针",
              "/items/burble_needle": "深紫针",
              "/items/crimson_needle": "绛红针",
              "/items/rainbow_needle": "彩虹针",
              "/items/holy_needle": "神圣针",
              "/items/celestial_spatula": "星空锅铲",
              "/items/cheese_spatula": "奶酪锅铲",
              "/items/verdant_spatula": "翠绿锅铲",
              "/items/azure_spatula": "蔚蓝锅铲",
              "/items/burble_spatula": "深紫锅铲",
              "/items/crimson_spatula": "绛红锅铲",
              "/items/rainbow_spatula": "彩虹锅铲",
              "/items/holy_spatula": "神圣锅铲",
              "/items/celestial_pot": "星空壶",
              "/items/cheese_pot": "奶酪壶",
              "/items/verdant_pot": "翠绿壶",
              "/items/azure_pot": "蔚蓝壶",
              "/items/burble_pot": "深紫壶",
              "/items/crimson_pot": "绛红壶",
              "/items/rainbow_pot": "彩虹壶",
              "/items/holy_pot": "神圣壶",
              "/items/celestial_alembic": "星空蒸馏器",
              "/items/cheese_alembic": "奶酪蒸馏器",
              "/items/verdant_alembic": "翠绿蒸馏器",
              "/items/azure_alembic": "蔚蓝蒸馏器",
              "/items/burble_alembic": "深紫蒸馏器",
              "/items/crimson_alembic": "绛红蒸馏器",
              "/items/rainbow_alembic": "彩虹蒸馏器",
              "/items/holy_alembic": "神圣蒸馏器",
              "/items/celestial_enhancer": "星空强化器",
              "/items/cheese_enhancer": "奶酪强化器",
              "/items/verdant_enhancer": "翠绿强化器",
              "/items/azure_enhancer": "蔚蓝强化器",
              "/items/burble_enhancer": "深紫强化器",
              "/items/crimson_enhancer": "绛红强化器",
              "/items/rainbow_enhancer": "彩虹强化器",
              "/items/holy_enhancer": "神圣强化器",
              "/items/milk": "牛奶",
              "/items/verdant_milk": "翠绿牛奶",
              "/items/azure_milk": "蔚蓝牛奶",
              "/items/burble_milk": "深紫牛奶",
              "/items/crimson_milk": "绛红牛奶",
              "/items/rainbow_milk": "彩虹牛奶",
              "/items/holy_milk": "神圣牛奶",
              "/items/cheese": "奶酪",
              "/items/verdant_cheese": "翠绿奶酪",
              "/items/azure_cheese": "蔚蓝奶酪",
              "/items/burble_cheese": "深紫奶酪",
              "/items/crimson_cheese": "绛红奶酪",
              "/items/rainbow_cheese": "彩虹奶酪",
              "/items/holy_cheese": "神圣奶酪",
              "/items/log": "原木",
              "/items/birch_log": "白桦原木",
              "/items/cedar_log": "雪松原木",
              "/items/purpleheart_log": "紫心原木",
              "/items/ginkgo_log": "银杏原木",
              "/items/redwood_log": "红杉原木",
              "/items/arcane_log": "神秘原木",
              "/items/lumber": "木板",
              "/items/birch_lumber": "白桦木板",
              "/items/cedar_lumber": "雪松木板",
              "/items/purpleheart_lumber": "紫心木板",
              "/items/ginkgo_lumber": "银杏木板",
              "/items/redwood_lumber": "红杉木板",
              "/items/arcane_lumber": "神秘木板",
              "/items/rough_hide": "粗糙兽皮",
              "/items/reptile_hide": "爬行动物皮",
              "/items/gobo_hide": "哥布林皮",
              "/items/beast_hide": "野兽皮",
              "/items/umbral_hide": "暗影皮",
              "/items/rough_leather": "粗糙皮革",
              "/items/reptile_leather": "爬行动物皮革",
              "/items/gobo_leather": "哥布林皮革",
              "/items/beast_leather": "野兽皮革",
              "/items/umbral_leather": "暗影皮革",
              "/items/cotton": "棉花",
              "/items/flax": "亚麻",
              "/items/bamboo_branch": "竹子",
              "/items/cocoon": "蚕茧",
              "/items/radiant_fiber": "光辉纤维",
              "/items/cotton_fabric": "棉花布料",
              "/items/linen_fabric": "亚麻布料",
              "/items/bamboo_fabric": "竹子布料",
              "/items/silk_fabric": "丝绸",
              "/items/radiant_fabric": "光辉布料",
              "/items/egg": "鸡蛋",
              "/items/wheat": "小麦",
              "/items/sugar": "糖",
              "/items/blueberry": "蓝莓",
              "/items/blackberry": "黑莓",
              "/items/strawberry": "草莓",
              "/items/mooberry": "哞莓",
              "/items/marsberry": "火星莓",
              "/items/spaceberry": "太空莓",
              "/items/apple": "苹果",
              "/items/orange": "橙子",
              "/items/plum": "李子",
              "/items/peach": "桃子",
              "/items/dragon_fruit": "火龙果",
              "/items/star_fruit": "杨桃",
              "/items/arabica_coffee_bean": "低级咖啡豆",
              "/items/robusta_coffee_bean": "中级咖啡豆",
              "/items/liberica_coffee_bean": "高级咖啡豆",
              "/items/excelsa_coffee_bean": "特级咖啡豆",
              "/items/fieriosa_coffee_bean": "火山咖啡豆",
              "/items/spacia_coffee_bean": "太空咖啡豆",
              "/items/green_tea_leaf": "绿茶叶",
              "/items/black_tea_leaf": "黑茶叶",
              "/items/burble_tea_leaf": "紫茶叶",
              "/items/moolong_tea_leaf": "哞龙茶叶",
              "/items/red_tea_leaf": "红茶叶",
              "/items/emp_tea_leaf": "虚空茶叶",
              "/items/catalyst_of_coinification": "点金催化剂",
              "/items/catalyst_of_decomposition": "分解催化剂",
              "/items/catalyst_of_transmutation": "转化催化剂",
              "/items/prime_catalyst": "至高催化剂",
              "/items/snake_fang": "蛇牙",
              "/items/shoebill_feather": "鲸头鹳羽毛",
              "/items/snail_shell": "蜗牛壳",
              "/items/crab_pincer": "蟹钳",
              "/items/turtle_shell": "乌龟壳",
              "/items/marine_scale": "海洋鳞片",
              "/items/treant_bark": "树皮",
              "/items/centaur_hoof": "半人马蹄",
              "/items/luna_wing": "月神翼",
              "/items/gobo_rag": "哥布林抹布",
              "/items/goggles": "护目镜",
              "/items/magnifying_glass": "放大镜",
              "/items/eye_of_the_watcher": "观察者之眼",
              "/items/icy_cloth": "冰霜织物",
              "/items/flaming_cloth": "烈焰织物",
              "/items/sorcerers_sole": "魔法师鞋底",
              "/items/chrono_sphere": "时空球",
              "/items/frost_sphere": "冰霜球",
              "/items/panda_fluff": "熊猫绒",
              "/items/black_bear_fluff": "黑熊绒",
              "/items/grizzly_bear_fluff": "棕熊绒",
              "/items/polar_bear_fluff": "北极熊绒",
              "/items/red_panda_fluff": "小熊猫绒",
              "/items/magnet": "磁铁",
              "/items/stalactite_shard": "钟乳石碎片",
              "/items/living_granite": "花岗岩",
              "/items/colossus_core": "巨像核心",
              "/items/vampire_fang": "吸血鬼之牙",
              "/items/werewolf_claw": "狼人之爪",
              "/items/revenant_anima": "亡者之魂",
              "/items/soul_fragment": "灵魂碎片",
              "/items/infernal_ember": "地狱余烬",
              "/items/demonic_core": "恶魔核心",
              "/items/griffin_leather": "狮鹫之皮",
              "/items/manticore_sting": "蝎狮之刺",
              "/items/jackalope_antler": "鹿角兔之角",
              "/items/dodocamel_plume": "渡渡驼之翎",
              "/items/griffin_talon": "狮鹫之爪",
              "/items/chimerical_refinement_shard": "奇幻精炼碎片",
              "/items/acrobats_ribbon": "杂技师彩带",
              "/items/magicians_cloth": "魔术师织物",
              "/items/chaotic_chain": "混沌锁链",
              "/items/cursed_ball": "诅咒之球",
              "/items/sinister_refinement_shard": "阴森精炼碎片",
              "/items/royal_cloth": "皇家织物",
              "/items/knights_ingot": "骑士之锭",
              "/items/bishops_scroll": "主教卷轴",
              "/items/regal_jewel": "君王宝石",
              "/items/sundering_jewel": "裂空宝石",
              "/items/enchanted_refinement_shard": "秘法精炼碎片",
              "/items/marksman_brooch": "神射胸针",
              "/items/corsair_crest": "掠夺者徽章",
              "/items/damaged_anchor": "破损船锚",
              "/items/maelstrom_plating": "怒涛甲片",
              "/items/kraken_leather": "克拉肯皮革",
              "/items/kraken_fang": "克拉肯之牙",
              "/items/pirate_refinement_shard": "海盗精炼碎片",
              "/items/butter_of_proficiency": "精通之油",
              "/items/thread_of_expertise": "专精之线",
              "/items/branch_of_insight": "洞察之枝",
              "/items/gluttonous_energy": "贪食能量",
              "/items/guzzling_energy": "暴饮能量",
              "/items/milking_essence": "挤奶精华",
              "/items/foraging_essence": "采摘精华",
              "/items/woodcutting_essence": "伐木精华",
              "/items/cheesesmithing_essence": "奶酪锻造精华",
              "/items/crafting_essence": "制作精华",
              "/items/tailoring_essence": "缝纫精华",
              "/items/cooking_essence": "烹饪精华",
              "/items/brewing_essence": "冲泡精华",
              "/items/alchemy_essence": "炼金精华",
              "/items/enhancing_essence": "强化精华",
              "/items/swamp_essence": "沼泽精华",
              "/items/aqua_essence": "海洋精华",
              "/items/jungle_essence": "丛林精华",
              "/items/gobo_essence": "哥布林精华",
              "/items/eyessence": "眼精华",
              "/items/sorcerer_essence": "法师精华",
              "/items/bear_essence": "熊熊精华",
              "/items/golem_essence": "魔像精华",
              "/items/twilight_essence": "暮光精华",
              "/items/abyssal_essence": "地狱精华",
              "/items/chimerical_essence": "奇幻精华",
              "/items/sinister_essence": "阴森精华",
              "/items/enchanted_essence": "秘法精华",
              "/items/pirate_essence": "海盗精华",
              "/items/task_crystal": "任务水晶",
              "/items/star_fragment": "星光碎片",
              "/items/pearl": "珍珠",
              "/items/amber": "琥珀",
              "/items/garnet": "石榴石",
              "/items/jade": "翡翠",
              "/items/amethyst": "紫水晶",
              "/items/moonstone": "月亮石",
              "/items/sunstone": "太阳石",
              "/items/philosophers_stone": "贤者之石",
              "/items/crushed_pearl": "珍珠碎片",
              "/items/crushed_amber": "琥珀碎片",
              "/items/crushed_garnet": "石榴石碎片",
              "/items/crushed_jade": "翡翠碎片",
              "/items/crushed_amethyst": "紫水晶碎片",
              "/items/crushed_moonstone": "月亮石碎片",
              "/items/crushed_sunstone": "太阳石碎片",
              "/items/crushed_philosophers_stone": "贤者之石碎片",
              "/items/shard_of_protection": "保护碎片",
              "/items/mirror_of_protection": "保护之镜"
            }
          }
        }
      }
    };
    mwi.itemNameToHridDict = {};
    Object.entries(mwi.lang.en.translation.itemNames).forEach(([k, v]) => { mwi.itemNameToHridDict[v] = k });
    Object.entries(mwi.lang.zh.translation.itemNames).forEach(([k, v]) => { mwi.itemNameToHridDict[v] = k });
  }
  function injectedInit() {
    /*注入成功，使用游戏数据*/
    mwi.itemNameToHridDict = {};
    Object.entries(mwi.lang.en.translation.itemNames).forEach(([k, v]) => { mwi.itemNameToHridDict[v] = k });
    Object.entries(mwi.lang.zh.translation.itemNames).forEach(([k, v]) => { mwi.itemNameToHridDict[v] = k });

    mwi.MWICoreInitialized = true;
    mwi.game.updateNotifications("info", mwi.isZh ? "mooket加载成功" : "mooket ready");
    window.dispatchEvent(new CustomEvent("MWICoreInitialized"));
    console.info("MWICoreInitialized");
  }
  staticInit();
  new Promise(resolve => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 30) {
        console.warn("injecting failed，部分功能可能受到影响，可以尝试刷新页面或者关闭网页重开(Steam用户请忽略)");
        clearInterval(interval)
      }//最多等待30秒
      if (mwi.game && mwi.lang && mwi?.game?.state?.character?.gameMode) {//等待必须组件加载完毕后再初始化
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  }).then(() => {
    injectedInit();
  });

  class ReconnectWebSocket {
    constructor(url, options = {}) {
      this.url = url; // WebSocket 服务器地址
      this.reconnectInterval = options.reconnectInterval || 10000; // 重连间隔（默认 5 秒）
      this.heartbeatInterval = options.heartbeatInterval || 60000; // 心跳间隔（默认 60 秒）
      this.maxReconnectAttempts = options.maxReconnectAttempts || 9999999; // 最大重连次数
      this.reconnectAttempts = 0; // 当前重连次数
      this.ws = null; // WebSocket 实例
      this.heartbeatTimer = null; // 心跳定时器
      this.isManualClose = false; // 是否手动关闭连接

      // 绑定事件处理器
      this.onOpen = options.onOpen || (() => { });
      this.onMessage = options.onMessage || (() => { });
      this.onClose = options.onClose || (() => { });
      this.onError = options.onError || (() => { });

      this.connect();
    }

    // 连接 WebSocket
    connect() {
      this.ws = new WebSocket(this.url);

      // WebSocket 打开事件
      this.ws.onopen = () => {
        console.info('WebMooket connected');
        this.reconnectAttempts = 0; // 重置重连次数
        this.startHeartbeat(); // 启动心跳
        this.onOpen();
      };

      // WebSocket 消息事件
      this.ws.onmessage = (event) => {
        this.onMessage(event.data);
      };

      // WebSocket 关闭事件
      this.ws.onclose = () => {
        console.warn('WebMooket disconnected');
        this.stopHeartbeat(); // 停止心跳
        this.onClose();

        if (!this.isManualClose) {
          this.reconnect();
        }
      };

      // WebSocket 错误事件
      this.ws.onerror = (error) => {
        console.error('WebMooket error:', error);
        this.onError(error);
      };
    }

    // 启动心跳
    startHeartbeat() {
      this.heartbeatTimer = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          //this.ws.send("ping");
        }
      }, this.heartbeatInterval);
    }

    // 停止心跳
    stopHeartbeat() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }

    // 自动重连
    reconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.info(`Reconnecting in ${this.reconnectInterval / 1000} seconds...`);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectInterval);
      } else {
        console.error('Max reconnection attempts reached');
      }
    }
    warnTimer = null; // 警告定时器


    // 发送消息
    send(data) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(data);
      } else {
        clearTimeout(this.warnTimer);
        this.warnTimer = setTimeout(() => {
          console.warn('WebMooket is not open');
        }, 1000);
      }
    }

    // 手动关闭连接
    close() {
      this.isManualClose = true;
      this.ws.close();
    }
  }
  /*实时市场模块*/
  const HOST = "https://mooket.qi-e.top";
  const MWIAPI_URL = "https://mooket.qi-e.top/market/api.json";

  class CoreMarket {
    marketData = {};//市场数据，带强化等级，存储格式{"/items/apple_yogurt:0":{ask,bid,time}}
    fetchTimeDict = {};//记录上次API请求时间，防止频繁请求
    ttl = 300;//缓存时间，单位秒
    trade_ws = null;
    subItems = [];
    constructor() {
      //core data
      let marketDataStr = localStorage.getItem("MWICore_marketData") || "{}";
      this.marketData = JSON.parse(marketDataStr);

      //mwiapi data
      let mwiapiJsonStr = localStorage.getItem("MWIAPI_JSON_NEW");
      let mwiapiObj = null;
      if (mwiapiJsonStr) {
        mwiapiObj = JSON.parse(mwiapiJsonStr);
        this.mergeMWIData(mwiapiObj);
      }
      if (!mwiapiObj || Date.now() / 1000 - mwiapiObj.timestamp > 600) {//超过10分才更新
        fetch(MWIAPI_URL).then(res => {
          res.text().then(mwiapiJsonStr => {
            mwiapiObj = JSON.parse(mwiapiJsonStr);
            this.mergeMWIData(mwiapiObj);
            //更新本地缓存数据
            localStorage.setItem("MWIAPI_JSON_NEW", mwiapiJsonStr);//更新本地缓存数据
            console.info("MWIAPI_JSON updated:", new Date(mwiapiObj.timestamp * 1000).toLocaleString());
          })
        }).catch(err => { console.warn("MWIAPI_JSON update failed,using localdata"); });
      }
      //市场数据更新
      hookMessage("market_item_order_books_updated", obj => this.handleMessageMarketItemOrderBooksUpdated(obj, true));
      hookMessage("init_character_data", (msg) => {
        if (msg.character.gameMode === "standard") {//标准模式才连接ws服务器，铁牛模式不连接ws服务器)
          if (!this.trade_ws) {
            this.trade_ws = new ReconnectWebSocket(`${HOST}/market/ws`);
            this.trade_ws.onOpen = () => this.onWebsocketConnected();
            this.trade_ws.onMessage = (data) => {
              if (data === "ping") { return; }//心跳包，忽略
              let obj = JSON.parse(data);
              if (obj && obj.type === "market_item_order_books_updated") {
                this.handleMessageMarketItemOrderBooksUpdated(obj, false);//收到市场服务器数据，不上传
              } else if (obj && obj.type === "ItemPrice") {
                this.processItemPrice(obj);
              } else {
                console.warn("unknown message:", data);
              }
            }
          }
        } else {
          this.trade_ws?.disconnect();//断开连接
          this.trade_ws = null;
        }
      });
      setInterval(() => { this.save(); }, 1000 * 600);//十分钟保存一次
    }
    handleMessageMarketItemOrderBooksUpdated(obj, upload = false) {
      //更新本地,游戏数据不带时间戳，市场服务器数据带时间戳
      let timestamp = obj.time || parseInt(Date.now() / 1000);
      let itemHrid = obj.marketItemOrderBooks.itemHrid;
      obj.marketItemOrderBooks?.orderBooks?.forEach((item, enhancementLevel) => {
        let bid = item.bids?.length > 0 ? item.bids[0].price : -1;
        let ask = item.asks?.length > 0 ? item.asks[0].price : -1;
        this.updateItem(itemHrid + ":" + enhancementLevel, { bid: bid, ask: ask, time: timestamp });
      });
      obj.time = timestamp;//添加时间戳
      //上报数据
      if (!upload) return;//不走上报逻辑，只在收到游戏服务器数据时上报

      if (this.trade_ws) {//标准模式走ws
        this.trade_ws.send(JSON.stringify(obj));//ws上报
      } else {//铁牛上报
        fetchWithTimeout(`${HOST}/market/upload/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(obj)
        });
      }
    }
    onWebsocketConnected() {
      if (this.subItems?.length > 0) {//订阅物品列表
        this.trade_ws?.send(JSON.stringify({ type: "SubscribeItems", items: this.subItems }));
      }
    }
    subscribeItems(itemHridList) {//订阅物品列表，只在游戏服务器上报
      this.subItems = itemHridList;
      this.trade_ws?.send(JSON.stringify({ type: "SubscribeItems", items: itemHridList }));
    }
    /**
     * 合并MWIAPI数据，只包含0级物品
     *
     * @param obj 包含市场数据的对象
     */
    mergeMWIData(obj) {
      Object.entries(obj.marketData).forEach(([itemName, priceDict]) => {
        let itemHrid = mwi.ensureItemHrid(itemName);
        if (itemHrid) {
          Object.entries(priceDict).forEach(([enhancementLevel, price]) => {
            this.updateItem(itemHrid + ":" + enhancementLevel, { bid: price.b, ask: price.a, time: obj.timestamp }, false);//本地更新
          });
        }
      });
      this.save();
    }
    mergeCoreDataBeforeSave() {
      let obj = JSON.parse(localStorage.getItem("MWICore_marketData") || "{}");
      Object.entries(obj).forEach(([itemHridLevel, priceObj]) => {
        this.updateItem(itemHridLevel, priceObj, false);//本地更新
      });
      //不保存，只合并
    }
    save() {//保存到localStorage
      if (mwi.character?.gameMode !== "standard") return;//非标准模式不保存
      this.mergeCoreDataBeforeSave();//从其他角色合并保存的数据
      localStorage.setItem("MWICore_marketData", JSON.stringify(this.marketData));
    }

    /**
     * 部分特殊物品的价格
     * 例如金币固定1，牛铃固定为牛铃袋/10的价格
     * @param {string} itemHrid - 物品hrid
     * @returns {Price|null} - 返回对应商品的价格对象，如果没有则null
     */
    getSpecialPrice(itemHrid) {
      switch (itemHrid) {
        case "/items/coin":
          return { bid: 1, ask: 1, time: Date.now() / 1000 };
        case "/items/cowbell": {
          let cowbells = this.getItemPrice("/items/bag_of_10_cowbells");
          return cowbells && { bid: cowbells.bid / 10, ask: cowbells.ask / 10, time: cowbells.time };
        }
        case "/items/bag_of_10_cowbells": return null;//走普通get,这里返回空
        case "/items/task_crystal": {//固定点金收益5000，这里计算可能有bug
          return { bid: 5000, ask: 5000, time: Date.now() / 1000 }
        }
        default: {
          let itemDetail = mwi.getItemDetail(itemHrid);
          if (itemDetail?.categoryHrid === "/item_categories/loot") {//宝箱陨石
            let totalAsk = 0;
            let totalBid = 0;
            let minTime = Date.now() / 1000;
            this.getOpenableItems(itemHrid)?.forEach(openItem => {
              let price = this.getItemPrice(openItem.itemHrid);
              if (price) minTime = Math.min(minTime, price.time);
              totalAsk += (price?.ask || 0) * openItem.count;//可以算平均价格
              totalBid += (price?.bid || 0) * openItem.count;
            });
            return { bid: totalBid, ask: totalAsk, time: minTime };
          }

          if (mwi.character?.gameMode !== "standard") {//其他物品都按点金分解价值
            return { ask: itemDetail.sellPrice * 5 * 0.7, bid: itemDetail.sellPrice * 5 * 0.7, time: Date.now() / 1000 };//铁牛模式显示物品价值使用点金价格*几率
          }

          return null;
        }
      }
    }
    getOpenableItems(itemHrid) {
      let items = [];
      for (let openItem of mwi.initClientData.openableLootDropMap[itemHrid]) {
        if (openItem.itemHrid === "/items/purples_gift") continue;//防止循环
        items.push({
          itemHrid: openItem.itemHrid,
          count: (openItem.minCount + openItem.maxCount) / 2 * openItem.dropRate
        });
      }
      return items;
    }
    /**
     * 获取商品的价格
     *
     * @param {string} itemHridOrName 商品HRID或名称
     * @param {number} [enhancementLevel=0] 装备强化等级，普通商品默认为0
     * @param {boolean} [peek=false] 是否只查看本地数据，不请求服务器数据
     * @returns {number|null} 返回商品的价格，如果商品不存在或无法获取价格则返回null
     */
    getItemPrice(itemHridOrName, enhancementLevel = 0, peek = false) {
      if (itemHridOrName?.includes(":")) {//兼容单名称，例如"itemHrid:enhancementLevel"
        let arr = itemHridOrName.split(":");
        itemHridOrName = arr[0];
        enhancementLevel = parseInt(arr[1]);
      }
      let itemHrid = mwi.ensureItemHrid(itemHridOrName);
      if (!itemHrid) return null;
      let specialPrice = this.getSpecialPrice(itemHrid);
      if (specialPrice) return specialPrice;
      let itemHridLevel = itemHrid + ":" + enhancementLevel;

      let priceObj = this.marketData[itemHridLevel];
      if (peek) return priceObj;

      if (Date.now() / 1000 - this.fetchTimeDict[itemHridLevel] < this.ttl) return priceObj;//1分钟内直接返回本地数据，防止频繁请求服务器
      this.fetchTimeDict[itemHridLevel] = Date.now() / 1000;
      this.trade_ws?.send(JSON.stringify({ type: "GetItemPrice", name: itemHrid, level: enhancementLevel }));
      return priceObj;
    }
    processItemPrice(resObj) {
      let itemHridLevel = resObj.name + ":" + resObj.level;
      let priceObj = { bid: resObj.bid, ask: resObj.ask, time: resObj.time };
      if (resObj.ttl) this.ttl = resObj.ttl;//更新ttl
      this.updateItem(itemHridLevel, priceObj);
    }
    updateItem(itemHridLevel, priceObj, isFetch = true) {
      let localItem = this.marketData[itemHridLevel];
      if (isFetch) this.fetchTimeDict[itemHridLevel] = Date.now() / 1000;//fetch时间戳
      if (!localItem || localItem.time < priceObj.time || localItem.time > Date.now() / 1000) {//服务器数据更新则更新本地数据

        let risePercent = 0;
        if (localItem) {
          let oriPrice = (localItem.ask + localItem.bid);
          let newPrice = (priceObj.ask + priceObj.bid);
          if (oriPrice != 0) risePercent = newPrice / oriPrice - 1;
        }
        this.marketData[itemHridLevel] = { rise: risePercent, ask: priceObj.ask, bid: priceObj.bid, time: priceObj.time };//更新本地数据
        dispatchEvent(new CustomEvent("MWICoreItemPriceUpdated", { detail: { priceObj: priceObj, itemHridLevel: itemHridLevel } }));//触发事件
      }
    }
    resetRise() {
      Object.entries(this.marketData).forEach(([k, v]) => {
        v.rise = 0;
      });
    }
    save() {
      localStorage.setItem("MWICore_marketData", JSON.stringify(this.marketData));
    }
  }
  mwi.coreMarket = new CoreMarket();
  /*历史数据模块*/
  function mooket() {

    mwi.hookMessage("market_listings_updated", obj => {
      obj.endMarketListings.forEach(order => {
        if (order.filledQuantity == 0) return;//没有成交的订单不记录
        let key = order.itemHrid + ":" + order.enhancementLevel;

        let tradeItem = trade_history[key] || {}
        if (order.isSell) {
          tradeItem.sell = order.price;
        } else {
          tradeItem.buy = order.price;
        }
        trade_history[key] = tradeItem;
      });
      if (mwi.character?.gameMode === "standard") {//只记录标准模式的数据，因为铁牛不能交易
        localStorage.setItem("mooket_trade_history", JSON.stringify(trade_history));//保存挂单数据
      }
    });



    let curDay = 1;
    let curHridName = null;
    let curLevel = 0;
    let curShowItemName = null;

    let delayItemHridName = null;
    let delayItemLevel = 0;

    let chartWidth = 500;
    let chartHeight = 280

    let configStr = localStorage.getItem("mooket_config");
    let config = configStr ? JSON.parse(configStr) : { "dayIndex": 0, "visible": true, "filter": { "bid": true, "ask": true, "mean": true }, "favo": {} };
    config.favo = config.favo || {};
    curDay = config.day;//读取设置

    let trade_history = JSON.parse(localStorage.getItem("mooket_trade_history") || "{}");
    function trade_history_migrate() {
      if (config?.version > 1) return;
      //把trade_history的key从itemHrid_enhancementLevel改为itemHrid:enhancementLevel
      let new_trade_history = {};
      for (let oldKey in trade_history) {
        if (/_(\d+)/.test(oldKey)) {
          let newKey = oldKey.replace(/_(\d+)/, ":$1");
          new_trade_history[newKey] = trade_history[oldKey];
        } else {

        }
      }
      localStorage.setItem("mooket_trade_history", JSON.stringify(new_trade_history));//保存挂单数据
      trade_history = new_trade_history;
      config.version = 1.1;
    }
    trade_history_migrate();

    window.onresize = function () {
      checkSize();
    };
    function checkSize() {
      if (window.innerWidth < window.innerHeight) {//竖屏，强制设置
        config.w = chartWidth = window.innerWidth * 0.8;
        config.h = chartHeight = chartWidth * 0.6;
      } else {
        chartWidth = 400;
        chartHeight = 250;
      }
    }
    checkSize();

    // 创建容器元素并设置样式和位置
    const container = document.createElement('div');
    //container.style.border = "1px solid #ccc"; //边框样式
    container.style.border = "1px solid #90a6eb"; //边框样式
    container.style.backgroundColor = "#282844";
    container.style.position = "fixed";
    container.style.zIndex = 10000;
    container.style.top = `${Math.max(0, Math.min(config.y || 0, window.innerHeight - 50))}px`; //距离顶部位置
    container.style.left = `${Math.max(0, Math.min(config.x || 0, window.innerWidth - 50))}px`; //距离左侧位置
    container.style.width = `${Math.max(0, Math.min(config.w || chartWidth, window.innerWidth))}px`; //容器宽度
    container.style.height = `${Math.max(0, Math.min(config.h || chartHeight, window.innerHeight))}px`; //容器高度
    container.style.resize = "both";
    container.style.overflow = "auto";
    container.style.display = "none";
    container.style.flexDirection = "column";
    container.style.flex = "1";
    container.style.minHeight = "35px";
    container.style.minWidth = "112px";
    container.style.maxWidth = window.clientWidth;
    container.style.userSelect = "none";

    let mouseDragging = false;
    let touchDragging = false;
    let offsetX, offsetY;

    let resizeEndTimer = null;
    container.addEventListener("resize", () => {
      if (resizeEndTimer) clearTimeout(resizeEndTimer);
      resizeEndTimer = setTimeout(save_config, 1000);
    });
    container.addEventListener("mousedown", function (e) {
      if (mouseDragging || touchDragging) return;
      const rect = container.getBoundingClientRect();
      if (container.style.resize === "both" && (e.clientX > rect.right - 10 && e.clientY > rect.bottom - 10)) return;
      mouseDragging = true;
      offsetX = e.clientX - container.offsetLeft;
      offsetY = e.clientY - container.offsetTop;
    });

    document.addEventListener("mousemove", function (e) {
      if (mouseDragging) {
        var newX = e.clientX - offsetX;
        var newY = e.clientY - offsetY;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > window.innerWidth - container.offsetWidth) newX = window.innerWidth - container.offsetWidth;
        if (newY > window.innerHeight - container.offsetHeight) newY = window.innerHeight - container.offsetHeight;

        container.style.left = newX + "px";
        container.style.top = newY + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      if (mouseDragging) {
        mouseDragging = false;
        save_config();
      }
    });

    container.addEventListener("touchstart", function (e) {
      if (mouseDragging || touchDragging) return;
      const rect = container.getBoundingClientRect();
      let touch = e.touches[0];
      if (container.style.resize === "both" && (e.clientX > rect.right - 10 && e.clientY > rect.bottom - 10)) return;
      touchDragging = true;
      offsetX = touch.clientX - container.offsetLeft;
      offsetY = touch.clientY - container.offsetTop;
    });

    document.addEventListener("touchmove", function (e) {
      if (touchDragging) {
        let touch = e.touches[0];
        var newX = touch.clientX - offsetX;
        var newY = touch.clientY - offsetY;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > window.innerWidth - container.offsetWidth) newX = window.innerWidth - container.offsetWidth;
        if (newY > window.innerHeight - container.offsetHeight) newY = window.innerHeight - container.offsetHeight;

        container.style.left = newX + "px";
        container.style.top = newY + "px";
      }
    });

    document.addEventListener("touchend", function () {
      if (touchDragging) {
        touchDragging = false;
        save_config();
      }
    });
    document.body.appendChild(container);

    const ctx = document.createElement('canvas');
    ctx.id = "mooket_chart";
    container.appendChild(ctx);



    // 创建下拉菜单并设置样式和位置
    let uiContainer = document.createElement('div');
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '5px';
    uiContainer.style.right = '16px';
    uiContainer.style.fontSize = '14px';

    //wrapper.style.backgroundColor = '#fff';
    uiContainer.style.flexShrink = 0;
    container.appendChild(uiContainer);

    const days = [1, 3, 7, 14, 30, 90, 180];
    curDay = days[config.dayIndex];

    let select = document.createElement('select');
    select.style.cursor = 'pointer';
    select.style.verticalAlign = 'middle';
    select.onchange = function () {
      config.dayIndex = this.selectedIndex;
      if (curHridName) requestItemPrice(curHridName, this.value, curLevel);
      save_config();
    };

    for (let i = 0; i < days.length; i++) {
      let option = document.createElement('option');
      option.value = days[i];
      if (i === config.dayIndex) option.selected = true;
      select.appendChild(option);
    }
    updateMoodays();
    function updateMoodays() {
      for (let i = 0; i < select.options.length; i++) {
        select.options[i].text = days[i] + (mwi.isZh ? "天" : "d");
      }
    }

    uiContainer.appendChild(select);

    //添加一个radio用于设置自动隐藏显示
    let btn_auto = document.createElement('input');
    btn_auto.type = 'checkbox';
    btn_auto.style.cursor = 'pointer';
    btn_auto.style.verticalAlign = 'middle';
    btn_auto.title = mwi.isZh ? "在市场外隐藏" : "hide when out of marketplace";
    btn_auto.checked = config.autoHide;
    btn_auto.id = "mooket_autoHide";

    btn_auto.onchange = function () {
      config.autoHide = this.checked;
      save_config();
    }
    uiContainer.appendChild(btn_auto);
    let label_auto = document.createElement('label');
    label_auto.htmlFor = btn_auto.id;
    label_auto.style.cursor = 'pointer';
    label_auto.style.color = 'white';
    label_auto.style.marginLeft = '5px';
    label_auto.textContent = mwi.isZh ? "自动隐藏" : "Auto Hide";
    uiContainer.appendChild(label_auto);

    // 创建一个容器元素并设置样式和位置
    const leftContainer = document.createElement('div');
    leftContainer.style.padding = '2px'
    leftContainer.style.display = 'flex';
    leftContainer.style.flexDirection = 'row';
    leftContainer.style.alignItems = 'center'
    container.appendChild(leftContainer);

    //添加一个btn隐藏canvas和wrapper
    let btn_close = document.createElement('input');
    btn_close.type = 'button';
    btn_close.classList.add('Button_button__1Fe9z')
    btn_close.value = '📈隐藏';
    btn_close.style.margin = 0;
    btn_close.style.cursor = 'pointer';

    leftContainer.appendChild(btn_close);

    //添加一个按钮切换simpleInfo和fullInfo

    let btn_switch = document.createElement('input');
    btn_switch.type = 'button';
    btn_switch.value = "👁";
    btn_switch.title = mwi.isZh ? "切换显示模式" : "Detail level";
    btn_switch.style.cursor = 'pointer';
    btn_switch.style.padding = "0 3px";
    btn_switch.style.fontSize = "16px";

    btn_switch.onclick = function () {
      const modeCycle = {
        icon: "iconPercent",
        iconPercent: "iconPrice",
        iconPrice: "iconFull",
        iconFull: "normalPercent",
        normalPercent: "normalPrice",
        normalPrice: "normalFull",
        normalFull: "full",
        full: "none",
        none: "icon",
      };

      const target = uiContainer.style.display === "none" ? "favoModeOff" : "favoModeOn";
      config[target] = modeCycle[config[target]] || "icon";
      updateFavo();
      container.style.width = "min-content";
      container.style.height = "min-content";
      save_config();
    };
    leftContainer.appendChild(btn_switch);


    let btn_relayout = document.createElement('input');
    btn_relayout.type = 'checkbox';
    btn_relayout.title = mwi.isZh ? "固定精简面板大小" : "Keep minibox size";
    btn_relayout.checked = config.keepsize;
    btn_relayout.onchange = function () {
      config.keepsize = this.checked;
      save_config();
    };
    leftContainer.appendChild(btn_relayout);
    //自选
    let favoContainer = document.createElement('div');
    favoContainer.style.fontSize = '15px';
    favoContainer.style.maxWidth = "100%";
    favoContainer.style.display = 'flex';
    favoContainer.style.flexWrap = 'wrap'
    favoContainer.style.position = 'absolute';
    favoContainer.style.top = '35px';
    favoContainer.style.lineHeight = "15px";
    favoContainer.style.overflow = 'auto';
    favoContainer.title = "📈🖱❌";

    container.appendChild(favoContainer);

    function sendFavo() {
      if (mwi.character?.gameMode !== "standard") return;
      let items = new Set();
      Object.entries(config.favo || {}).forEach(([itemHridLevel, data]) => {
        items.add(itemHridLevel.split(":")[0]);
      });
      //if(items.size > 10)mwi.game?.updateNotifications("info",mwi.isZh?"当前的自选物品种类已超过10个，服务器仅会自动推送前10个物品的最新价格":"");
      mwi.coreMarket.subscribeItems(Array.from(items));
      updateFavo();
    }
    function addFavo(itemHridLevel) {
      if (mwi.character?.gameMode !== "standard") return;
      let priceObj = mwi.coreMarket.getItemPrice(itemHridLevel);
      config.favo[itemHridLevel] = { ask: priceObj.ask, bid: priceObj.bid, time: priceObj.time };
      save_config();
      sendFavo();
    }
    function removeFavo(itemHridLevel) {
      if (mwi.character?.gameMode !== "standard") return;
      delete config.favo[itemHridLevel];
      save_config();
      sendFavo();
    }
    function updateFavo() {
      if (mwi.character?.gameMode !== "standard") {
        favoContainer.style.display = 'none';
        return;
      }
      favoContainer.style.display = 'flex';
      //在favoContainer中添加config.favo dict中 key对应的元素，或者删除不存在的
      let items = Object.keys(config.favo);
      for (let i = 0; i < favoContainer.children.length; i++) {
        if (!items.includes(favoContainer.children[i].id)) {
          favoContainer.removeChild(favoContainer.children[i]);
        }
      }
      for (let itemHridLevel of items) {
        let favoItemDiv = document.getElementById(itemHridLevel);

        let oldPrice = config.favo[itemHridLevel];
        let newPrice = mwi.coreMarket.getItemPrice(itemHridLevel);

        oldPrice.ask = oldPrice?.ask > 0 ? oldPrice.ask : newPrice?.ask;//如果旧价格没有ask，就用新价格的ask代替
        oldPrice.bid = oldPrice?.bid > 0 ? oldPrice.bid : newPrice?.bid;//如果旧价格没有bid，就用新价格的bid代替


        let priceDelta = {
          ask: newPrice?.ask > 0 ? showNumber(newPrice.ask) : "-",
          bid: newPrice?.bid > 0 ? showNumber(newPrice.bid) : "-",
          askRise: (oldPrice?.ask > 0 && newPrice?.ask > 0) ? (100 * (newPrice.ask - oldPrice.ask) / oldPrice.ask).toFixed(1) : 0,
          bidRise: (oldPrice?.bid > 0 && newPrice?.bid > 0) ? (100 * (newPrice.bid - oldPrice.bid) / oldPrice.bid).toFixed(1) : 0,
        };
        let [itemHrid, level] = itemHridLevel.split(":");
        let iconName = itemHrid.split("/")[2];
        let itemName = mwi.isZh ? mwi.lang.zh.translation.itemNames[itemHrid] : mwi.lang.en.translation.itemNames[itemHrid];


        if (!favoItemDiv) {
          favoItemDiv = document.createElement('div');
          //div.style.border = '1px solid #90a6eb';
          favoItemDiv.style.color = 'white';
          favoItemDiv.style.whiteSpace = 'nowrap';
          favoItemDiv.style.cursor = 'pointer';
          favoItemDiv.onclick = function () {
            let [itemHrid, level] = itemHridLevel.split(":")
            if (uiContainer.style.display === 'none') {
              delayItemHridName = itemHrid;
              delayItemLevel = parseInt(level);
            } else {
              requestItemPrice(itemHrid, curDay, level);
            }
            mwi.game?.handleGoToMarketplace(itemHrid, parseInt(level));//打开市场
            //toggleShow(true);
          };
          favoItemDiv.oncontextmenu = (event) => { event.preventDefault(); removeFavo(itemHridLevel); };
          favoItemDiv.id = itemHridLevel;
          favoContainer.appendChild(favoItemDiv);
        }
        //鼠标如果在div范围内就显示fullinfo
        let favoMode = uiContainer.style.display === 'none' ? config.favoModeOff : config.favoModeOn;
        let title = `${itemName}${level > 0 ? `(+${level})` : ""} ${priceDelta.ask} ${priceDelta.askRise > 0 ? "+" : ""}${priceDelta.askRise}% ${new Date((newPrice?.time || 0) * 1000).toLocaleString()}`;
        switch (favoMode) {
          case "none":
            favoItemDiv.innerHTML = "";
            break;
          case "full":
            favoItemDiv.innerHTML = `
            <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
            <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
            <span>${itemName}${level > 0 ? `(+${level})` : ""}</span>
            <span style="color:${priceDelta.askRise == 0 ? "white" : priceDelta.askRise > 0 ? "red" : "lime"}">${priceDelta.ask}</span>
            <span style="color:white;background-color:${priceDelta.askRise == 0 ? "black" : priceDelta.askRise > 0 ? "brown" : "green"}">${priceDelta.askRise > 0 ? "+" : ""}${priceDelta.askRise}%</span>
            <span style="color:${priceDelta.bidRise == 0 ? "white" : priceDelta.bidRise > 0 ? "red" : "lime"}">${priceDelta.bid}</span>
            <span style="color:white;background-color:${priceDelta.bidRise == 0 ? "black" : priceDelta.bidRise > 0 ? "brown" : "green"}">${priceDelta.bidRise > 0 ? "+" : ""}${priceDelta.bidRise}%</span>
            </div>
            `;
            break;
          case "iconPercent":
            favoItemDiv.innerHTML = `
            <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
            <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
            <span style="color:white;background-color:${priceDelta.askRise == 0 ? "transparent" : priceDelta.askRise > 0 ? "brown" : "green"}">${priceDelta.askRise == 0 ? "" : priceDelta.askRise > 0 ? "+" + priceDelta.askRise + "%" : priceDelta.askRise + "%"}</span>
            </div>
            `;
            break;
          case "iconPrice":
            favoItemDiv.innerHTML = `
            <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
            <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
            <span style="color:${priceDelta.askRise == 0 ? "white" : priceDelta.askRise > 0 ? "red" : "lime"}">${priceDelta.ask}</span>
            </div>
            `;
            break;
          case "iconFull":
            favoItemDiv.innerHTML = `
            <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
            <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
            <span style="color:${priceDelta.askRise == 0 ? "white" : priceDelta.askRise > 0 ? "red" : "lime"}">${priceDelta.ask}</span>
            <span style="color:white;background-color:${priceDelta.askRise == 0 ? "black" : priceDelta.askRise > 0 ? "brown" : "green"}">${priceDelta.askRise > 0 ? "+" : ""}${priceDelta.askRise}%</span>
            </div>
            `;
            break;
          case "normalPercent":
            favoItemDiv.innerHTML = `
            <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
            <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
            <span>${itemName}${level > 0 ? `(+${level})` : ""}</span>
            <span style="color:white;background-color:${priceDelta.askRise == 0 ? "transparent" : priceDelta.askRise > 0 ? "brown" : "green"}">${priceDelta.askRise == 0 ? "" : priceDelta.askRise > 0 ? "+" + priceDelta.askRise + "%" : priceDelta.askRise + "%"}</span>
            </div>
            `;
            break;
          case "normalPrice":
            favoItemDiv.innerHTML = `
              <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
              <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
              <span>${itemName}${level > 0 ? `(+${level})` : ""}</span>
              <span style="color:${priceDelta.askRise == 0 ? "white" : priceDelta.askRise > 0 ? "red" : "lime"}">${priceDelta.ask}</span>
              </div>
              `;
            break;
          case "normalFull":
            favoItemDiv.innerHTML = `
            <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
            <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
            <span>${itemName}${level > 0 ? `(+${level})` : ""}</span>
            <span style="color:${priceDelta.askRise == 0 ? "white" : priceDelta.askRise > 0 ? "red" : "lime"}">${priceDelta.ask}</span>
            <span style="color:white;background-color:${priceDelta.askRise == 0 ? "black" : priceDelta.askRise > 0 ? "brown" : "green"}">${priceDelta.askRise > 0 ? "+" : ""}${priceDelta.askRise}%</span>
            </div>
            `;
            break;
          default://icon
            favoItemDiv.innerHTML = `
          <div title="${title}" style="display:inline-block;border:1px solid #98a7e9;">
          <svg width="20px" height="20px" style="display:inline-block"><use href="/static/media/items_sprite.d4d08849.svg#${iconName}"></use></svg>
          </div>
          `;
        }
      }
    }

    sendFavo();//初始化自选
    addEventListener('MWICoreItemPriceUpdated', updateFavo);
    addEventListener("MWILangChanged", () => {
      updateMoodays();
      updateFavo();
      btn_switch.title = mwi.isZh ? "显示模式" : "Detail Level";
      btn_auto.title = mwi.isZh ? "在市场外隐藏" : "Hide out of marketplace";
      label_auto.textContent = mwi.isZh ? "自动隐藏" : "AutoHide";
      if (uiContainer.style.display === 'none') {
        btn_close.value = mwi.isZh ? "📈显示" : "Show";
      } else {
        btn_close.value = mwi.isZh ? "📈隐藏" : "Hide";
      }

    });
    btn_close.onclick = toggle;
    function toggle() {

      if (uiContainer.style.display === 'none') {//展开
        uiContainer.style.display = ctx.style.display = 'block';

        btn_close.value = '📈' + (mwi.isZh ? "隐藏" : "Hide");
        leftContainer.style.position = 'absolute'
        leftContainer.style.top = '1px';
        leftContainer.style.left = '1px';
        container.style.width = config.w + "px";
        container.style.height = config.h + "px";
        container.style.minHeight = "150px";
        container.style.minWidth = "200px";

        config.visible = true;
        favoContainer.style.top = "35px";
        favoContainer.style.right = 0;
        favoContainer.style.left = null;
        favoContainer.style.position = 'absolute';

        requestItemPrice(delayItemHridName, curDay, delayItemLevel);
        updateFavo();
        save_config();
      } else {//隐藏
        uiContainer.style.display = ctx.style.display = 'none';

        container.style.width = config.minWidth + "px";
        container.style.height = config.minHeight + "px";
        container.style.minHeight = "min-content";
        container.style.minWidth = "112px";

        if (!config.keepsize) {
          container.style.width = "min-content";
          container.style.height = "min-content";
        }

        btn_close.value = '📈' + (mwi.isZh ? "显示" : "Show");
        leftContainer.style.position = 'relative'
        leftContainer.style.top = 0;
        leftContainer.style.left = 0;
        favoContainer.style.top = 0;
        favoContainer.style.left = 0;
        favoContainer.style.right = null;
        favoContainer.style.position = 'relative';
        config.visible = false;

        updateFavo();
        save_config();
      }
    };
    function toggleShow(show = true) {
      if ((uiContainer.style.display !== 'none') !== show) {
        toggle()
      }
    }
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        onClick: save_config,
        responsive: true,
        maintainAspectRatio: false,
        pointRadius: 0,
        pointHitRadius: 20,
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'HH:mm',
                day: 'MM/dd'
              }
            },
            title: {
              display: false
            },
            grid: {
              color: "rgba(255,255,255,0.2)"
            },
            ticks: {
              color: "#e7e7e7"
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: false,
              color: "white",
            },
            grid: {
              color: "rgba(255,255,255,0.2)",
            },
            ticks: {
              color: "#e7e7e7",
              // 自定义刻度标签格式化
              callback: showNumber
            }
          }
        },
        plugins: {
          tooltip: { mode: 'index', intersect: false, bodyColor: "#e7e7e7", titleColor: "#e7e7e7" },
          crosshair: {
            line: { color: '#AAAAAA', width: 1 },
            zoom: { enabled: false }
          },
          title: {
            display: true,
            text: "",
            color: "#e7e7e7",
            font: {
              size: 15,
              weight: 'bold',
            }
          },
          legend: {
            display: true,
            labels: {
              color: "#e7e7e7"
            }
          },
        }
      }
    });

    function requestItemPrice(itemHridName, day = 1, level = 0) {
      if (!itemHridName) return;
      if (curHridName === itemHridName && curLevel == level && curDay == day) return;//防止重复请求

      delayItemHridName = curHridName = itemHridName;
      delayItemLevel = curLevel = level;
      curDay = day;

      curShowItemName = mwi.isZh ? mwi.lang.zh.translation.itemNames[itemHridName] : mwi.lang.en.translation.itemNames[itemHridName];
      curShowItemName += curLevel > 0 ? `(+${curLevel})` : "";

      let time = day * 3600 * 24;

      const params = new URLSearchParams();
      params.append("name", curHridName);
      params.append("level", curLevel);
      params.append("time", time);
      fetch(`${HOST}/market/item/history?${params}`).then(res => {
        res.json().then(data => updateChart(data, curDay));
      }).catch(err => console.error("请求历史价格失败", err));

    }

    function formatTime(timestamp, range) {
      const date = new Date(timestamp * 1000);
      const pad = n => n.toString().padStart(2, '0');

      // 获取各时间组件
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const day = pad(date.getDate());
      const month = pad(date.getMonth() + 1);
      const shortYear = date.getFullYear().toString().slice(-2);

      // 根据时间范围选择格式
      switch (parseInt(range)) {
        case 1: // 1天：只显示时间
          return `${hours}:${minutes}`;

        case 3: // 3天：日+时段
          return `${hours}:${minutes}`;

        case 7: // 7天：月/日 + 时段
          return `${day}.${hours}`;
        case 14: // 14天：月/日 + 时段
          return `${day}.${hours}`;
        case 30: // 30天：月/日
          return `${month}/${day}`;

        default: // 180天：年/月
          return `${shortYear}/${month}`;
      }
    }

    function showNumber(num) {
      if (isNaN(num)) return num;
      if (num === 0) return "0"; // 单独处理0的情况

      const absNum = Math.abs(num);

      //num保留一位小数
      if (num < 1) return num.toFixed(2);

      return absNum >= 1e10 ? `${(num / 1e9).toFixed(1)}B` :
        absNum >= 1e7 ? `${(num / 1e6).toFixed(1)}M` :
          absNum >= 1e5 ? `${Math.floor(num / 1e3)}K` :
            `${Math.floor(num)}`;
    }
    //data={'bid':[{time:1,price:1}],'ask':[{time:1,price:1}]}
    function updateChart(data, day) {
      //字段名差异
      data.bid = data.bid || data.bids
      data.ask = data.ask || data.asks;
      //过滤异常元素
      for (let i = data.bid.length - 1; i >= 0; i--) {
        if (data.bid[i].price < 0 && data.ask[i].price < 0) {//都小于0，认为是异常数据，直接删除
          data.bid.splice(i, 1);
          data.ask.splice(i, 1);
        } else {//小于0则设置为0
          data.bid[i].price = Math.max(0, data.bid[i].price);
          data.ask[i].price = Math.max(0, data.ask[i].price);
        }
      }

      //timestamp转日期时间
      //根据day输出不同的时间表示，<3天显示时分，<=7天显示日时，<=30天显示月日，>30天显示年月

      const labels = data.bid.map(x => new Date(x.time * 1000));
      chart.data.labels = labels;

      let sma = [];
      let sma_size = 6;
      let sma_window = [];
      for (let i = 0; i < data.bid.length; i++) {
        sma_window.push((data.bid[i].price + data.ask[i].price) / 2);
        if (sma_window.length > sma_size) sma_window.shift();
        sma.push(sma_window.reduce((a, b) => a + b, 0) / sma_window.length);
      }
      chart.options.plugins.title.text = curShowItemName;
      chart.data.datasets = [
        {
          label: mwi.isZh ? '卖一' : "ask1",
          data: data.ask.map(x => x.price),
          borderColor: '#00cc00',
          backgroundColor: '#00cc00',
          borderWidth: 1.5
        },
        {
          label: mwi.isZh ? '买一' : "bid1",
          data: data.bid.map(x => x.price),
          borderColor: '#ff3300',
          backgroundColor: '#ff3300',
          borderWidth: 1.5
        },
        {
          label: mwi.isZh ? '均线' : "mean",
          data: sma,
          borderColor: '#ff9900',
          borderWidth: 3,
          tension: 0.5,
          fill: true
        },

      ];
      let timeUnit, timeFormat;
      if (day <= 3) {
        timeUnit = 'hour';
        timeFormat = 'HH:mm';
      } else {
        timeUnit = 'day';
        timeFormat = 'MM/dd';
      }
      chart.options.scales.x.time.unit = timeUnit;
      chart.options.scales.x.time.tooltipFormat = timeFormat;


      chart.setDatasetVisibility(0, config.filter.ask);
      chart.setDatasetVisibility(1, config.filter.bid);
      chart.setDatasetVisibility(2, config.filter.mean);

      chart.update()
    }
    function save_config() {
      if (mwi.character?.gameMode !== "standard") {
        btn_switch.style.display = "none";
        return;//铁牛不保存
      }
      btn_switch.style.display = "inline-block";

      if (chart && chart.data && chart.data.datasets && chart.data.datasets.length == 3) {
        config.filter.ask = chart.getDatasetMeta(0).visible;
        config.filter.bid = chart.getDatasetMeta(1).visible;
        config.filter.mean = chart.getDatasetMeta(2).visible;
      }
      if (container.checkVisibility()) {
        config.x = Math.max(0, Math.min(container.getBoundingClientRect().x, window.innerWidth - 50));
        config.y = Math.max(0, Math.min(container.getBoundingClientRect().y, window.innerHeight - 50));

        if (uiContainer.style.display === 'none') {
          config.minWidth = container.offsetWidth;
          config.minHeight = container.offsetHeight;
        }
        else {
          config.w = container.offsetWidth;
          config.h = container.offsetHeight;
        }
      }

      localStorage.setItem("mooket_config", JSON.stringify(config));
    }
    let lastItemHridLevel = null;
    setInterval(() => {
      let inMarketplace = document.querySelector(".MarketplacePanel_marketplacePanel__21b7o")?.checkVisibility();
      let hasFavo = Object.entries(config.favo || {}).length > 0;
      if ((inMarketplace || (!inMarketplace && !config.autoHide))) {
        container.style.display = "block"
        try {
          let currentItem = document.querySelector(".MarketplacePanel_currentItem__3ercC");
          let levelStr = currentItem?.querySelector(".Item_enhancementLevel__19g-e");
          let enhancementLevel = parseInt(levelStr?.textContent.replace("+", "") || "0");
          let itemHrid = mwi.ensureItemHrid(currentItem?.querySelector(".Icon_icon__2LtL_")?.ariaLabel);
          let itemHridLevel = itemHrid + ":" + enhancementLevel;
          if (itemHrid) {
            if (lastItemHridLevel !== itemHridLevel) {//防止重复请求
              //显示历史价格

              let tradeHistoryDiv = document.querySelector("#mooket_tradeHistory");
              if (!tradeHistoryDiv) {
                tradeHistoryDiv = document.createElement("div");
                tradeHistoryDiv.id = "mooket_tradeHistory";
                tradeHistoryDiv.style.position = "absolute";
                tradeHistoryDiv.style.marginTop = "-24px";
                tradeHistoryDiv.style.left = "50%";
                tradeHistoryDiv.style.transform = "translateX(-50%)";
                tradeHistoryDiv.title = mwi.isZh ? "我的最近买/卖价格" : "My recently buy/sell price";
                currentItem.prepend(tradeHistoryDiv);
              }
              if (trade_history[itemHridLevel]) {
                let buy = trade_history[itemHridLevel].buy || "--";
                let sell = trade_history[itemHridLevel].sell || "--";

                tradeHistoryDiv.innerHTML = `
        <span style="color:red">${showNumber(buy)}</span>
        <span style="color:#AAAAAA">/</span>
        <span style="color:lime">${showNumber(sell)}</span>`;
                tradeHistoryDiv.style.display = "block";
              } else {
                tradeHistoryDiv.style.display = "none";
              }
              //添加订阅button
              if (mwi.character?.gameMode === "standard") {
                let btn_favo = document.querySelector("#mooket_addFavo");
                if (!btn_favo) {
                  btn_favo = document.createElement('button');
                  btn_favo.type = 'button';
                  btn_favo.id = "mooket_addFavo";
                  btn_favo.innerText = '📌';
                  btn_favo.style.position = "absolute";
                  btn_favo.style.padding = "0";
                  btn_favo.style.fontSize = "18px";
                  btn_favo.style.marginLeft = "32px";
                  btn_favo.title = mwi.isZh ? "添加到自选" : "Add favorite";
                  btn_favo.onclick = () => { if (btn_favo.itemHridLevel) addFavo(btn_favo.itemHridLevel) };
                  currentItem.prepend(btn_favo);
                }
                btn_favo.itemHridLevel = itemHridLevel;
              }
              //记录当前
              lastItemHridLevel = itemHridLevel;
              if (uiContainer.style.display === 'none') {//延迟到打开的时候请求
                delayItemHridName = itemHrid;
                delayItemLevel = enhancementLevel;
              } else {
                requestItemPrice(itemHrid, curDay, enhancementLevel);
              }
            }
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        container.style.display = "none"
      }
    }, 500);
    //setInterval(updateInventoryStatus, 60000);
    toggle();
    console.info("mooket 初始化完成");
  }
  new Promise(resolve => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 30) {
        if (document.querySelector(".GamePage_gamePanel__3uNKN")) {
          clearInterval(interval);
          console.info("mooket 初始化超时，部分功能受限");
          resolve();
        } else {
          //异常
          clearInterval(interval);
          console.info("mooket 初始化失败");
        }
      }//最多等待10秒
      if (document.body && mwi.character?.gameMode) {//等待必须组件加载完毕后再初始化
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  }).then(() => {
    mooket();
  });

})();
