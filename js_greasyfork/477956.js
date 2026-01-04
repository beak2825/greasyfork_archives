// ==UserScript==
// @name         easy-market
// @namespace    nodelore.torn.easy-market
// @version      1.8.1
// @description  Display quality of weapon directly. Notice your API usage limit and use it on item search page.
// @author       nodelore[2786679]
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477956/easy-market.user.js
// @updateURL https://update.greasyfork.org/scripts/477956/easy-market.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if(window.EASYMARKET) return;
  window.EASYMARKET = true;

  console.log(
    "%cEasy%cMarket %cStarts.",
    "font-size: 30px; font-weight: 600; color: #00A9F9;",
    "font-size: 30px; font-weight: 600; color: #000;",
    "font-size: 30px;"
  );
  // Fetch localstorage configuration
  const EASY_MARKET_CONFIG_STORAGE_KEY = "easy_market_storage"; // You can customize the storage key of local storage
  let configuration = localStorage.getItem(EASY_MARKET_CONFIG_STORAGE_KEY);
  if(!configuration){
    configuration = {};
  }
  else{
    configuration = JSON.parse(configuration);
  }

  //================ Easy-market Configuration =======================
  const ENFORCE_UPDATE = false; // If you want to reload configuration cache anyway, set this flag to true. It will enforce the script use setting here instead of cache and reset the localStorage of configuration.

  let API = localStorage.getItem("APIKey") || ""; // Insert your API here (PUBLIC level is fine)
  let inPDA = false;
  // local API from PDA
  const PDAKey = "###PDA-APIKEY###";
  if(PDAKey.charAt(0) !== "#"){
      inPDA = true;
      if(!API){
          API = PDAKey;
      }
  }

  if(API && !localStorage.getItem("APIKey")){
      localStorage.setItem("APIKey", API);
  }

  let ENABLE_BAZAAR_UPDATE = true; // The bazaar feature will introduce some performance issue. You can set the flag to false to disable it.

  let LIMIT_PER_REFRESH = 20; // To reduce the frequency of request in item list, we limit the count of requests. You can refresh to load more information

  let STORAGE_KEY = "easy_market_cache"; // You can customize the storage key of local storage

  // customize color here
  let COLOR_SET = {
    defaultBlue: "#00A9F9",
    defaultRed: "#E54C19",
    defaultGreen: "#82c91e",
    defaultPurple: "#b072ef",
    defaultYellow: '#CA9800',
    defaultOrange: '#E67700',

    normal: {
      bonusBg: "#FFF",
      bonusFont: "#333"
    },
    dark: {
      bonusBg: "#444",
      bonusFont: "#ddd"
    }
  }
  //==================================================================
  
  let storage;
  if (GM) {
    window.GM_getValue = GM.getValue;
    window.GM_setValue = GM.setValue;

    window.GM_deleteValue = GM.deleteValue;
  }
  const weaponList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,63,76,98,99,100,108,109,110,111,146,147,170,173,174,175,177,189,217,218,219,223,224,225,227,228,230,231,232,233,234,235,236,237,238,240,241,243,244,245,247,248,249,250,251,252,253,254,255,289,290,291,292,346,359,360,382,387,388,391,393,395,397,398,399,400,401,402,438,439,440,483,484,485,486,487,488,489,490,539,545,546,547,548,549,599,600,604,605,612,613,614,615,632,790,792,805,830,831,832,837,838,839,844,845,846,850,871,874,1053,1055,1056,1152,1153,1154,1155,1156,1157,1158,1159,1231,1255,1257,1296];
  const armorList = [32,33,34,49,50,176,178,332,333,334,348,538,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,848,1307,1308,1309,1310,1311,1355,1356,1357,1358,1359];
  const itemMap = {"Hammer":1,"Baseball Bat":2,"Crowbar":3,"Knuckle Dusters":4,"Pen Knife":5,"Kitchen Knife":6,"Dagger":7,"Axe":8,"Scimitar":9,"Chainsaw":10,"Samurai Sword":11,"Glock 17":12,"Raven MP25":13,"Ruger 57":14,"Beretta M9":15,"USP":16,"Beretta 92FS":17,"Fiveseven":18,"Magnum":19,"Desert Eagle":20,"Dual 92G Berettas":21,"Sawed-Off Shotgun":22,"Benelli M1 Tactical":23,"MP5 Navy":24,"P90":25,"AK-47":26,"M4A1 Colt Carbine":27,"Benelli M4 Super":28,"M16 A2 Rifle":29,"Steyr AUG":30,"M249 SAW":31,"Leather Vest":32,"Police Vest":33,"Bulletproof Vest":34,"Full Body Armor":49,"Outer Tactical Vest":50,"Minigun":63,"Snow Cannon":76,"Neutrilux 2000":98,"Springfield 1911":99,"Egg Propelled Launcher":100,"9mm Uzi":108,"RPG Launcher":109,"Leather Bullwhip":110,"Ninja Claws":111,"Yasukuni Sword":146,"Rusty Sword":147,"Wand of Destruction":170,"Butterfly Knife":173,"XM8 Rifle":174,"Taser":175,"Chain Mail":176,"Cobra Derringer":177,"Flak Jacket":178,"S&W Revolver":189,"Claymore Sword":217,"Crossbow":218,"Enfield SA-80":219,"Jackhammer":223,"Swiss Army Knife":224,"Mag 7":225,"Spear":227,"Vektor CR-21":228,"Flare Gun":230,"Heckler & Koch SL8":231,"SIG 550":232,"BT MP9":233,"Chain Whip":234,"Wooden Nunchaku":235,"Kama":236,"Kodachi":237,"Sai":238,"Type 98 Anti Tank":240,"Bushmaster Carbon 15":241,"Taurus":243,"Blowgun":244,"Bo Staff":245,"Katana":247,"Qsz-92":248,"SKS Carbine":249,"Twin Tiger Hooks":250,"Wushu Double Axes":251,"Ithaca 37":252,"Lorcin 380":253,"S&W M29":254,"Flamethrower":255,"Dual Axes":289,"Dual Hammers":290,"Dual Scimitars":291,"Dual Samurai Swords":292,"Combat Vest":332,"Liquid Body Armor":333,"Flexible Body Armor":334,"Pair of High Heels":346,"Hazmat Suit":348,"Fine Chisel":359,"Ivory Walking Cane":360,"Gold Plated AK-47":382,"Handbag":387,"Pink Mac-10":388,"Macana":391,"Slingshot":393,"Metal Nunchaku":395,"Flail":397,"SIG 552":398,"ArmaLite M-15A4":399,"Guandao":400,"Lead Pipe":401,"Ice Pick":402,"Cricket Bat":438,"Frying Pan":439,"Pillow":440,"MP5k":483,"AK74U":484,"Skorpion":485,"TMP":486,"Thompson":487,"MP 40":488,"Luger":489,"Blunderbuss":490,"Medieval Helmet":538,"Blood Spattered Sickle":539,"Dual TMPs":545,"Dual Bushmasters":546,"Dual MP5s":547,"Dual P90s":548,"Dual Uzis":549,"Golden Broomstick":599,"Devil's Pitchfork":600,"Pair of Ice Skates":604,"Diamond Icicle":605,"Tavor TAR-21":612,"Harpoon":613,"Diamond Bladed Knife":614,"Naval Cutlass":615,"Petrified Humerus":632,"Kevlar Gloves":640,"WWII Helmet":641,"Motorcycle Helmet":642,"Construction Helmet":643,"Welding Helmet":644,"Safety Boots":645,"Hiking Boots":646,"Leather Helmet":647,"Leather Pants":648,"Leather Boots":649,"Leather Gloves":650,"Combat Helmet":651,"Combat Pants":652,"Combat Boots":653,"Combat Gloves":654,"Riot Helmet":655,"Riot Body":656,"Riot Pants":657,"Riot Boots":658,"Riot Gloves":659,"Dune Helmet":660,"Dune Vest":661,"Dune Pants":662,"Dune Boots":663,"Dune Gloves":664,"Assault Helmet":665,"Assault Body":666,"Assault Pants":667,"Assault Boots":668,"Assault Gloves":669,"Delta Gas Mask":670,"Delta Body":671,"Delta Pants":672,"Delta Boots":673,"Delta Gloves":674,"Marauder Face Mask":675,"Marauder Body":676,"Marauder Pants":677,"Marauder Boots":678,"Marauder Gloves":679,"EOD Helmet":680,"EOD Apron":681,"EOD Pants":682,"EOD Boots":683,"EOD Gloves":684,"Plastic Sword":790,"Penelope":792,"Duke's Hammer":805,"Nock Gun":830,"Beretta Pico":831,"Riding Crop":832,"Rheinmetall MG 3":837,"Homemade Pocket Shotgun":838,"Madball":839,"Tranquilizer Gun":844,"Bolt Gun":845,"Scalpel":846,"Kevlar Lab Coat":848,"Sledgehammer":850,"Bug Swatter":871,"Prototype":874,"Bread Knife":1053,"Poison Umbrella":1055,"Millwall Brick":1056,"SMAW Launcher":1152,"China Lake":1153,"Milkor MGL":1154,"PKM":1155,"Negev NG-5":1156,"Stoner 96":1157,"Meat Hook":1158,"Cleaver":1159,"Golf Club":1231,"Bone Saw":1255,"Cattle Prod":1257,"Ban Hammer":1296,"Sentinel Helmet":1307,"Sentinel Apron":1308,"Sentinel Pants":1309,"Sentinel Boots":1310,"Sentinel Gloves":1311,"Vanguard Respirator":1355,"Vanguard Body":1356,"Vanguard Pants":1357,"Vanguard Boots":1358,"Vanguard Gloves":1359};
  const exceptClassMap = {
    "poison": "poisoned", 
    "demoralize": "demoralized", 
    "freeze": "frozen", 
    "hazardous": "hazarfouse", 
    "impassable": "full-block",
    "radiation protection": "item-radiation-bonus",
    "immutable": "sentinel",
    "invulnerable": "negative-status_mitigation",
    "imperviable": "life-bonus",
    "impenetrable" : "bullets-protection",
    "insurmountable" : "quarter-life-damage-mitigation",
    "impregnable": "melee-protection",
    "burn": "burning",
    "proficience": "experience",
    "eviscerate": "evicerate",
    "double-edged": "doubleedged",
  }

  const filterType = ["Melee", "Secondary", "Primary", "Armor"]

  const prefix = "[Easy-market]"
  const requestHistory = [];
  let inItemList = false;
  let inFactionArmoury = false;
  let inCabinet = false;
  const log = (msg) => {
    console.log(`${prefix} ${msg}`);
  }

  let cacheRecord = {};

  // when player redirects to another url, refresh the record to reduce performance overhead
  window.onhashchange = ()=>{
    cacheRecord = {};
  }

  const updateCacheRecord = (armouryID, item, updateFunc)=>{
    cacheRecord[armouryID] = {
      item,
      updateFunc
    }
  }

  const invokeCacheUpdate = (armouryID)=>{
    const record = cacheRecord[armouryID];
    if(record){
      record.updateFunc(record.item);
    }
  }


  // Cache configuration
  // ============================= Default configuration value, DONT'T modify unless you know what you want
  const API_DEFAULT = ""; 
  const ENABLE_BAZAAR_UPDATE_DEFAULT = true; 
  const LIMIT_PER_REFRESH_DEFAULT = 20; 
  const STORAGE_KEY_DEFAULT = "easy_market_cache"; 
  const COLOR_SET_DEFAULT = {
    defaultBlue: "#00A9F9",
    defaultRed: "#E54C19",
    defaultGreen: "#82c91e",
    defaultPurple: "#b072ef",
    defaultYellow: '#CA9800',
    defaultOrange: '#E67700',

    normal: {
      bonusBg: "#FFF",
      bonusFont: "#333"
    },
    dark: {
      bonusBg: "#444",
      bonusFont: "#ddd"
    }
  }
  // ============================================================
  const current_config = {
    API,
    ENABLE_BAZAAR_UPDATE,
    LIMIT_PER_REFRESH,
    STORAGE_KEY,
    COLOR_SET
  };

  const default_config = {
    API: API_DEFAULT,
    ENABLE_BAZAAR_UPDATE: ENABLE_BAZAAR_UPDATE_DEFAULT,
    LIMIT_PER_REFRESH: LIMIT_PER_REFRESH_DEFAULT,
    STORAGE_KEY: STORAGE_KEY_DEFAULT,
    COLOR_SET: COLOR_SET_DEFAULT
  };

  let update_config_flag = false;
  if(ENFORCE_UPDATE){
    update_config_flag = true;
    configuration = {};
  }
  for(let key in default_config){
    if(!configuration[key] || JSON.stringify(current_config[key]) !== JSON.stringify(default_config[key])){
      update_config_flag = true;
      configuration[key] = current_config[key];
    }
  }
  
  if(update_config_flag){
    log("Need to update configuration in localStroage")
    localStorage.setItem(EASY_MARKET_CONFIG_STORAGE_KEY, JSON.stringify(configuration));
  }
  API = configuration.API;
  ENABLE_BAZAAR_UPDATE = configuration.ENABLE_BAZAAR_UPDATE;
  LIMIT_PER_REFRESH = configuration.LIMIT_PER_REFRESH;
  STORAGE_KEY = configuration.STORAGE_KEY;
  COLOR_SET = configuration.COLOR_SET;

  if(!API){
    log("No valid API, please insert a public API");
  }

  if(!storage){
    GM.getValue(STORAGE_KEY, {}).then((res)=>{
      storage = res;
    })
  }

  const getWeaponInfo = async (armouryID) => {
    if(storage[armouryID]){
      return storage[armouryID];
    }
    else{
      if(requestHistory.indexOf(armouryID) !== -1){
        return;
      }
      if(requestHistory.length > LIMIT_PER_REFRESH && inItemList){
        return;
      }
      if(!API){
        return;
      }
      requestHistory.push(armouryID);
      const response = await $.ajax({
        url: `https://api.torn.com/torn/${armouryID}?selections=itemdetails&key=${API}`,
      });
      
      const info = response.itemdetails;
      storage[armouryID] = info;
      await GM.setValue(STORAGE_KEY, storage);
      return info;
    }
  };
  // const isDark = ()=>{
  //   return $("body").hasClass("dark-mode");
  // }

  const isMobile = () => {
    return window.innerWidth <= 768;
  }

  const handlePercentage = (desc, value) => {
    const index = desc.indexOf(value);
    if(desc[index + value.toString().length] === '%'){
      return `${value}%`
    }
    return value;
  }

  const handleBonusClass = (bonus) =>{
    bonus = bonus.toLowerCase();
    const prefix = 'bonus-attachment-';
    if(exceptClassMap[bonus]){
      return `${prefix}${exceptClassMap[bonus]}`;
    }
    return `${prefix}${bonus}`;
  }

  const extractBonus = (bonuses) => {
    if(bonuses){
      const result = [];
      for(let key in bonuses){
        const bonus_0 = bonuses[key];
        const {bonus, value, description, icon} = bonus_0;
        if(description.indexOf(value) !== -1){
          result.push([bonus, description, handlePercentage(description, value), `<i class="${icon ? icon : handleBonusClass(bonus)}" title="${description}"></i>
                    <font color="${COLOR_SET.defaultPurple}" style="margin-left:5px;">${handlePercentage(description, value)}</font>`]);
        }  
      }
      return result;
    }
    return;
  }

  const getQualityColor = (quality, rarity=0)=>{
    let qualityColor;
    if(rarity == 1 || rarity == "Yellow"){
      qualityColor = COLOR_SET.defaultYellow;
    }
    else if(rarity == 3 || rarity == "Red"){
      qualityColor = COLOR_SET.defaultRed;
    }
    else if(rarity == 2 || rarity == "Orange"){
      qualityColor = COLOR_SET.defaultOrange;
    }
    else if(quality < 20){
      qualityColor = COLOR_SET.defaultRed;
    }
    else if(quality < 50){
      qualityColor = COLOR_SET.defaultYellow;
    }
    else{
      qualityColor = COLOR_SET.defaultGreen;
    }
    return qualityColor;
  }

  const updateItemDetails = (itemDetails, isBazaar=false) => {
    const { damage, accuracy, quality, armor, bonuses, rarity} = itemDetails;
    const qualityVal = parseFloat(quality);
    const qualityColor = getQualityColor(qualityVal, rarity);

    const qualityHtml = `<font color="${qualityColor}" style="margin-left:5px;" title="Quality: ${qualityVal}%">Q:${qualityVal.toFixed(2)}%</font>`
    const bonusDetails = extractBonus(bonuses);
    if(bonusDetails){
      if(inFactionArmoury || inItemList || inCabinet){
        const itemDetail = $(`<div class="item-detail" style="display: flex;align-items: center;"></div>`);
        for(let bonusDetail of bonusDetails){
          const bonusItem = $(`<div class='message icon-text border-round' title='${bonusDetail[1]}'>${bonusDetail[0]} ${bonusDetail[2]}</div>`);
          bonusItem.css({
            'display': 'flex',
            'height': '20px',
            'line-height': '20px',
            'padding': '0 4px',
            'margin-left': '5px',
            'font-weight': 'bold',
            'text-align': 'center',
            'background-color': qualityColor,
            'color': '#eee',
          });
          itemDetail.append(bonusItem);
        }

        return itemDetail;
      }
      else{
        if(isMobile() || isBazaar){
          return $(`<div class="item-detail" style="display: flex;align-items: center;">
                    ${bonusDetails[0][3]}
                  </div>`);
        }
        else{
          return $(`<div class="item-detail" style="display: flex;align-items: center;">
                    ${bonusDetails[0][3]}
                    ${qualityHtml}
                  </div>`);
        }
      }
    }
    if((isMobile() && !inFactionArmoury) || isBazaar || inCabinet){
        return $(`<div class="item-detail" style="display: flex;align-items: center;">
                  ${qualityHtml}
                </div>`);
    }

    if(armor){
      return $(`<div class="item-detail" style="display: flex;align-items: center;">
                <i class="bonus-attachment-item-defence-bonus"></i>
                <font color="${COLOR_SET.defaultGreen}">${armor.toFixed(2)}</font>
                ${qualityHtml}
              </div>`);
    }
    else{
      return $(`<div class="item-detail" style="display: flex;align-items: center;">
                <i class="bonus-attachment-item-damage-bonus"></i>
                <font color="${COLOR_SET.defaultRed}">${damage.toFixed(2)}</font>
                <i class="bonus-attachment-item-accuracy-bonus" style="margin-left:5px;"></i>
                <font color="${COLOR_SET.defaultBlue}">${accuracy.toFixed(2)}</font>
                ${qualityHtml}
              </div>`);
    }
    
  };

  const updateImarketWhenSearching = async (item) => {
    if(!storage){
      storage = await GM.getValue(STORAGE_KEY, {});
    }
    if(item.find("div.item-detail").length > 0) {
      return;
    }

    let detail, itemID, armouryID;

    detail = item.find('li.item-t');

    if(!detail.attr('itemid')){
      return
    }
    itemID = parseInt(detail.attr('itemid'));

    if(-1 !== weaponList.indexOf(itemID) || -1 !== armorList.indexOf(itemID)){
      if(!armouryID){
        armouryID = detail.attr('data-armoury'); 
      }

      updateCacheRecord(armouryID, item, updateImarketWhenSearching);

      const itemdetail = await getWeaponInfo(armouryID);
      if(itemdetail){
        if(item.find("div.item-detail").length > 0) {
          return;
        }

        let appendTarget;

        const appendDetailHtml = updateItemDetails(itemdetail);
        if(isMobile()){
          appendTarget = item.find('li.cost');
          appendDetailHtml.css({
            'margin-left': '30px',
          })
        }
        else{
          appendTarget = item.find('li.item-t span.t-hide');
          appendDetailHtml.css({
            'margin-left': '60px',
            'position': 'absolute',
            'left': `${item.offset().left + item.width() - 60}px`,
            'background': '#F2F2F2',
            'width': '180px',
          });

          window.addEventListener('resize', ()=>{
            appendDetailHtml.css({
              'left': `${item.offset().left + item.width() - 60}px`,
            });
          })
        }

        appendTarget.css({
          'display': 'flex',
          'align-items': 'center',
        });
        appendTarget.append(appendDetailHtml);
      }
    }
    else{
      log(`Not weapon or armor, itemid: ${itemID}`)
    }
  }

  let globalHistory = [];

  const clearHistoryItems = ()=>{
    for(let item of globalHistory){
      if(item){
        item.remove();
      }
    }
    globalHistory = [];
  }

  window.onhashchange = ()=>{
    clearHistoryItems();
  }

  const updateImarketDirectly = async (item) => {
    if(!storage){
      storage = await GM.getValue(STORAGE_KEY, {});
    }

    if(item.find("div.item-detail").length > 0) {
      return;
    }

    let detail, itemID, armouryID;

    detail = item.find('a.view-link');

    if(!detail.attr('itemid')){
      return
    }
    itemID = parseInt(detail.attr('itemid'));

    if(-1 !== weaponList.indexOf(itemID) || -1 !== armorList.indexOf(itemID)){
      if(!armouryID){
        armouryID = detail.attr('data-armoury'); 
      }
      
      updateCacheRecord(armouryID, item, updateImarketDirectly);

      const itemdetail = await getWeaponInfo(armouryID);
      if(item.find("div.item-detail").length > 0) {
        return;
      }

      if(itemdetail){
        let appendTarget;
        let isBazaar = false;
        if(item.parent().attr('class') === 'private-bazaar' && isMobile()){
          isBazaar = true;
        }
        const appendDetailHtml = updateItemDetails(itemdetail, isBazaar);

        if(isMobile()){
          appendTarget = item.find('li.cost');
          appendDetailHtml.css({
            'margin-left': '3px',
          })

          appendTarget.css({
            'display': 'flex',
            'align-items': 'center'
          });
          appendTarget.append(appendDetailHtml);
        }
        else{
          const offsetLeft = item.offset().left + item.width();
          if(offsetLeft > 0){
            appendTarget = item.find('div.item-t');
            appendDetailHtml.css({
              'margin-left': '10px',
              'position': 'absolute',
              'left': `${offsetLeft-5}px`,
              'background': '#FFF',
              'width': '180px',
              'z-index': 100001,
              'height': `${item.height()}px`,
              'top': `${item.offset().top}px`,
              'font-size': '12px',
              'box-sizing': 'border-box',
              'padding-left': '15px',
            });
  
            window.addEventListener('resize', ()=>{
              appendDetailHtml.css({
                'left': `${offsetLeft-5}px`,
              });
            });
  
            globalHistory.push(appendDetailHtml);
  
            $(body).append(appendDetailHtml);
          }
        }
      }
    }
    else{
      log(`Not weapon or armor, itemid: ${itemID}`)
    }
  };

  const updateItemList = async (item) => {
    if(!storage){
      storage = await GM.getValue(STORAGE_KEY, {});
    }
    if(item.find("div.item-detail").length > 0) {
      return;
    }

    let itemID, armouryID;
    itemID = parseInt(item.attr('data-item'));
    armouryID = item.attr('data-armoryid') || item.attr('data-id');
    inItemList = true;

    if(!itemID){
      return;
    }

    if(-1 !== weaponList.indexOf(itemID) || -1 !== armorList.indexOf(itemID)){

      updateCacheRecord(armouryID, item, updateItemList);

      const itemdetail = await getWeaponInfo(armouryID);
      if(item.find("div.item-detail").length > 0) {
        return;
      }

      if(itemdetail){
        let appendTarget = item.find('span.name-wrap span.name');
        if(appendTarget.length < 1){
          appendTarget = item.find('li.desc');
        } 

        const appendDetailHtml = updateItemDetails(itemdetail);

        appendTarget.css({
          'display': 'flex',
          'align-items': 'center'
        });
        appendTarget.append(appendDetailHtml);
      }

    }
    else{
      log(`Not weapon or armor, itemid: ${itemID}`)
    }
  };

  const updateFactionArmoury = async (item) => {
    if(!storage){
      storage = await GM.getValue(STORAGE_KEY, {});
    }
    if(item.find("div.item-detail").length > 0) {
      return;
    }

    let itemID, armouryID;
    itemID = parseInt(item.find("div.img-wrap").attr('data-itemid'));
    armouryID = item.find("div.img-wrap").attr('data-armoryid');
    inFactionArmoury = true;

    if(!itemID){
      return;
    }

    if(-1 !== weaponList.indexOf(itemID) || -1 !== armorList.indexOf(itemID)){

      updateCacheRecord(armouryID, item, updateFactionArmoury);

      const itemdetail = await getWeaponInfo(armouryID);
      if(item.find("div.item-detail").length > 0) {
        return;
      }

      if(itemdetail){
        let appendTarget = item.find('div.name');

        const appendDetailHtml = updateItemDetails(itemdetail);
        //itemdetail.bonuses
        appendTarget.css({
          'display': 'flex',
          'align-items': 'center',
        });

        if(!isMobile()){
          appendDetailHtml.css({
            'position': 'absolute',
            'margin-left': '200px',
            'z-index': '999',
          })
          if(!itemdetail.bonuses){
            appendDetailHtml.addClass("armory-bg");
          } 
        }
        appendTarget.append(appendDetailHtml);
      }

    }
    else{
      log(`Not weapon or armor, itemid: ${itemID}`)
    }
  };

  const updateBazaarManage = async (item) => {
    if(!storage){
      storage = await GM.getValue(STORAGE_KEY, {});
    }
    if(item.find("div.item-detail").length > 0) {
      return;
    }

    const itemName = item.find('span.t-overflow').text();
    if(itemMap[itemName]){
      const reactID = item.attr('data-reactid');
      const match = /(\$[\d]+)/.exec(reactID);
      if(match){
        const armouryID = match[0].replace('$', '');
        inItemList = true;

        if(item.find("div.item-detail").length > 0) {
          return;
        }

        updateCacheRecord(armouryID, item, updateBazaarManage);

        const itemdetail = await getWeaponInfo(armouryID);

        if(itemdetail){
          let appendTarget = item.find('div.name-wrap');
  
          const appendDetailHtml = updateItemDetails(itemdetail);
  
          appendTarget.css({
            'display': 'flex',
            'align-items': 'center'
          });
          appendTarget.append(appendDetailHtml);
        }

      }
    }
  };

  const itemType = (itemID)=>{
    if(weaponList.indexOf(itemID) !== -1){
        return 1;
    }
    else if(armorList.indexOf(itemID !== -1)){
        return 2;
    }
    return -1;
  }

  const updateCabinet = async (item)=>{
    if(!storage){
        storage = await GM.getValue(STORAGE_KEY, {});
    }
    if(item.find('top-bonuses').length > 0){
        return;
    }
    const itemHover = item.find('div.item-hover');
    let itemID = itemHover.attr('itemid');
    if(!itemID){
        return;
    }
    itemID = parseInt(itemID);
    const iType = itemType(itemID);
    if(iType !== -1){
        const armouryID = itemHover.attr('armouryid');
        if(armouryID === "0"){
            return;
        }
        inCabinet = true;

        updateCacheRecord(armouryID, item, updateCabinet);

        const itemdetail = await getWeaponInfo(armouryID);
        if(itemdetail){
            if(item.find('top-bonuses').length > 0){
                return;
            }

            const appendDetailHtml = updateItemDetails(itemdetail);

            appendDetailHtml.css({
                position: 'absolute',
                left: '0',
                top: '35px',
            });
            appendDetailHtml.addClass("armory-bg");
            appendDetailHtml.find('div.message').css({
              height: '15px',
              'line-height': '15px',
              padding: '0 5px'
            })
            item.append(appendDetailHtml);
        }

    }
  }

  const handleBazaarBonus = (bonusTitle)=>{
    const match = /<b>(.*?)<\/b>.*?(\d+)(%)?/.exec(bonusTitle);
    if(match){
      return [match[1], `${match[2]}${match[3] ? match[3] : ''}`];
    }
    return 
  }

  let lastOrder = 'default';
  let lastSearch = '';
  let bazaarCache = {};

  function updateBazaarItem(targetBazaarItem, itemIdx){
    // Avoid null value problem
    // const targetBazaarItem = $("[class^='rowItems___']").children().eq(bazaarIdx);
    if(targetBazaarItem.length === 0){
      return;
    }
    const item = bazaarCache[itemIdx.toString()];
    if(!item){
      return;
    } 
    const targetBazaar = targetBazaarItem.find(`div[class^="imgBar"]`);
    if(targetBazaar.length === 0){
      return;
    }
    // Avoid duplicated update
    if(targetBazaarItem.find('div.top-bonuses').length > 0){
      return;
    }

    const { damage, accuracy, quality, arm, coverage, bonuses, category, rarity } = item;
    if(filterType.indexOf(category) !== -1){
        const topDisplay = $(`<div class="top-bonuses"></div>`);
        const bottomDisplay = $(`<div class="bottom-bonuses"></div>`);

        if(bonuses && bonuses[0].title){
          for(let bonus of bonuses){
            if(bonus.title){
              const qualityBonus = $(`<div class="bonus-attachment"></div>`);
              const bonusInfo = handleBazaarBonus(bonus.title);
              const bonusItem = $(`<div class='message icon-text border-round' title='${bonus.title}'><i class="${bonus.class}" title="${bonus.title ? bonus.title : ''}"></i> ${bonusInfo[1]}</div>`);
              bonusItem.css({
                color: getQualityColor(quality, rarity)
              });
              qualityBonus.append(bonusItem);
              topDisplay.append(qualityBonus);
            }
          }
        }
        else{
          const qualityBonus = $(`<div class="bonus-attachment"></div>`);
          const qualityValue = $(`<font class="label-value t-overflow">Q:${quality}%</font>`);
          qualityValue.css({
            color: getQualityColor(quality, rarity)
          })
          qualityBonus.append(qualityValue);
          
          topDisplay.append(qualityBonus);
        }

        if(arm != "0"){
            const armorBonus = $(`<div class="bonus-attachment"></div>`);
            const armorIcon = $(`<i class="bonus-attachment-item-defence-bonus"></i>`);
            const armorValue = $(`<span class="label-value t-overflow">${arm}</span>`);
            armorBonus.append(armorIcon, armorValue);
            bottomDisplay.append(armorBonus);

            const coverageBonus = $(`<div class="bonus-attachment"></div>`);
            const coverageIcon = $(`<i class="bonus-attachment-item-coverage-bonus"></i>`);

            const coverageData = JSON.parse(coverage);
            let coverageHtml = '';
            for(let bodyPart in coverageData){
              const cov = coverageData[bodyPart];
              coverageHtml += `<b>${bodyPart}:</b> ${cov}%`;
              if(cov !== "Head Coverage"){
                coverageHtml += "</br>"
              }
            }
            const coverageValue = $(`<span class="label-value t-overflow" title='${coverageHtml}'>${coverageData["Full Body Coverage"]}%</span>`);
            coverageBonus.append(coverageIcon, coverageValue);
            bottomDisplay.append(coverageBonus);
        }
        else{
            const damageBonus = $(`<div class="bonus-attachment"></div>`);
            const damageIcon = $(`<i class="bonus-attachment-item-damage-bonus"></i>`);
            const damageValue = $(`<span class="label-value t-overflow">${damage}</span>`);
            damageBonus.append(damageIcon, damageValue);

            const accuracyBonus = $(`<div class="bonus-attachment"></div>`);
            const accuracyIcon = $(`<i class="bonus-attachment-item-accuracy-bonus"></i>`);
            const accuracyValue = $(`<span class="label-value t-overflow">${accuracy}</span>`);
            accuracyBonus.append(accuracyIcon, accuracyValue);

            bottomDisplay.append(damageBonus, accuracyBonus);
        }

        targetBazaar.append(topDisplay, bottomDisplay);
        targetBazaarItem.attr("data-idx", itemIdx);
      }
  }

  let isUpdating = false;
  const updateBazaarInfo = ()=>{
    if(isUpdating){
      return;
    }
    isUpdating = true;

    // 检索起点，然后向前、向后遍历更新
    const children = $("[class^='rowItems___']").children();
    if(children.length === 0){
      return;
    }
    
    const firstUpdated = children.filter("[data-idx]:eq(0)");
    let first = firstUpdated.attr("data-idx");
    const lastUpdated = children.filter("[data-idx]").last();
    let last = lastUpdated.attr("data-idx");
    let current;
    let current_idx = 0;
    
    if(!first && !last){
      // 遍历匹配
      let COUNT_LIMIT = 6;
      // Try to match...
      while(true){
        let item = bazaarCache[current_idx.toString()];
        let notFound = false;

        for(let i = 0; i < COUNT_LIMIT; i++){
          item = bazaarCache[(current_idx+i).toString()];
          current = children.eq(i);
          if(current.length === 0){
            break;
          }
          const current_price = current.find("p[class*=price]").text().split("  ")[0].replaceAll(",", "").replace("$", "");
          const current_name = current.find("p[class*=name]").text().trim();
          if(current_price !== item.price || current_name !== item.name){
            notFound = true;
            break;
          }
        }

        if(notFound){
          current_idx += 1;
        } else{
          break;
        }
      }

      children.each(function(){
        updateBazaarItem($(this), current_idx++);
      })
    } else{
      if(first){
        current_idx = children.index(firstUpdated);
        first = parseInt(first);

        while(first && --first >=0 && --current_idx >= 0){
          current = children.eq(current_idx);
          updateBazaarItem(current, first);
        }
      }

      if(last){
        current_idx = children.index(lastUpdated);
        last = parseInt(last);
        
        while(last && ++last < Object.keys(bazaarCache).length && ++current_idx < children.length){
          current = children.eq(current_idx);
          updateBazaarItem(current, last);
        }
      }
      
    }
    isUpdating = false;
}

const handleBazaar = function(params, resp){
    if(resp && resp.list){
      let start = params.get('start');
      if(!start){
        start = 0;
      } else{
        start = parseInt(start);
      }

      const bazaarList = resp.list;
      for(let i = 0; i < bazaarList.length; i++){
        bazaarCache[start + i] = bazaarList[i];
      }

      let bazaarInterval = setInterval(()=>{
        if($(`div[class^="imgBar"]`).length > 0){
          clearInterval(bazaarInterval);
          bazaarInterval = null;
          setTimeout(()=>{
            updateBazaarInfo();
          });
        }
      }, 500)
    }
}

function addStyle(){
    GM_addStyle(`
        .top-bonuses, .bottom-bonuses{
            position: absolute;
            left: 3px;
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            width: 100px;
        }
        .top-bonuses{
            top: -5px;
        }
        .bottom-bonuses{
            bottom: -5px;
        }
        body.dark-mode .bonus-attachment, body.dark-mode .armory-bg{
          background: ${COLOR_SET.dark.bonusBg} !important;
          color: ${COLOR_SET.dark.bonusFont} !important;
        }
        .armory-bg{
            background: ${COLOR_SET.normal.bonusBg};
            color: ${COLOR_SET.normal.bonusFont};
        }
        .bonus-attachment{
            background: ${COLOR_SET.normal.bonusBg};
            color: ${COLOR_SET.normal.bonusFont};
            box-shadow: 0 1px 0 #00000003;
            border-radius: 7px;
            padding: 2px;
            margin-right: 1px;
            display: flex;
            align-items: center;
            float: left;
        }
        .icon-attachment{
            float: left;
        }
    `)
}

const cacheRespInfo = async (resp) => {
  if(!storage){
    storage = await GM.getValue(STORAGE_KEY, {});
  }

  const {itemName, itemID, armoryID, extras} = resp;
  if(!armoryID){
    return;
  }
  let quality, accuracy, damage, armor, bonuses;
  for(let extra_key in extras){
    const extra_item = extras[extra_key];
    const extra_title = extra_item.title;
    const extra_value = extra_item.value;
    if(extra_title === 'Quality'){
      quality = extra_value.replace('%', '');
    }
    else if(extra_title === 'Armor'){
      armor = extra_value;
    }
    else if(extra_title === 'Damage'){
      damage = extra_value;
    }
    else if(extra_title === 'Accuracy'){
      accuracy = extra_value;
    }
    else if(extra_title === 'Bonus'){
      if(!bonuses){
        bonuses = {};
      }
      const {descTitle, rawValue, icon} = extra_item;
      const description = descTitle.split('<br/>')[1];
      const bonusVal = rawValue.replace('%', '');
      bonuses[extra_value] = {
        icon,
        description,
        bonus: extra_value,
        value: parseInt(bonusVal)
      };
    }
  }

  const info = {
    ID: itemID,
    UID: armoryID,
    name:itemName,
    quality
  };
  if(armor){
    info['armor'] = parseFloat(armor);
  }
  if(damage){
    info['damage'] = parseFloat(damage);
  }
  if(accuracy){
    info['accuracy'] = parseFloat(accuracy);
  }
  if(bonuses){
    info['bonuses'] = bonuses;
  }

  storage[armoryID] = info;
  await GM.setValue(STORAGE_KEY, storage);
  return armoryID;
}

// Intercept fetch operation to capture the response
function interceptFetch() {
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const origFetch = targetWindow.fetch;
    targetWindow.fetch = async (...args) => {
      const rsp = await origFetch(...args);
      const url = new URL(args[0], location.origin);
      const params = new URLSearchParams(url.search);
      // If a request is sent to get bazaarData, we capture and clone it to update the page
      if (url.pathname === '/bazaar.php' && params.get('sid') === 'bazaarData') {
        const order = params.get('order');
        const searchName = params.get('searchname');
        if(order !== lastOrder){
          lastOrder = order;
          bazaarCache = {};
        }
        if(searchName != lastSearch){
          lastSearch = searchName;
          bazaarCache = {};
        }

        const clonedRsp = rsp.clone();
        const resp = await clonedRsp.json();
        handleBazaar(params, resp);
      }
      return rsp;
    };
}

function interceptXML(){
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
          const resp = this.response;
          const url = new URL(this.responseURL);
          const params = new URLSearchParams(url.search);
          const pathname = url.pathname;
          const sid = params.get('sid');

          if(pathname === '/page.php' && sid === 'inventory'){
            try{
              cacheRespInfo(JSON.parse(resp)).then((armoryID)=>{
                log("Update cache");
                invokeCacheUpdate(armoryID);
              });
            }
            catch{
              log("[Warning]Fail to parse item detail");
            }
          }
      }
    }, false);
    origOpen.call(this, method, url, async, user, password);
  };
}

  // GM.deleteValue(STORAGE_KEY);
  let observer;
  let interceptXMLFlag = false;

  if(location.href === "https://www.torn.com/bazaar.php#/add" || location.href === "https://www.torn.com/imarket.php#/p=addl"){
    interceptXMLFlag = true;
    observer = new MutationObserver(async (mutationList)=>{
      for(let mut of mutationList){
        for(let node of mut.addedNodes){
          if(node.tagName === "LI" && $(node).hasClass('clearfix') && $(node).attr('data-reactid')){
            updateBazaarManage($(node));
          }
        }
      }
    });
    if(location.href === "https://www.torn.com/bazaar.php#/add"){
      observer.observe($("div#bazaarRoot")[0], {subtree: true, childList: true});
    } else{
      observer.observe($("div#item-market-main-wrap")[0], {subtree: true, childList: true});
    }
  }
  else if(location.href.indexOf('imarket.php') !== -1){
    interceptXMLFlag = true;
    observer = new MutationObserver(async (mutationList)=>{
      for(let mut of mutationList){
        for(let node of mut.addedNodes){
          if(node.tagName === "UL" && $(node).hasClass("items")){
            const targets = $(node).find('ul.item');
            clearHistoryItems();
            for(let i = 0; i < targets.length; i++){
              const item = $(targets[i]);
              updateImarketDirectly(item);
            }
          }
          else if($(node).hasClass("shop-market-page")){
            const targets = $(node).find('.show-item-info');
            for(let i = 0; i < targets.length; i++){
              const item = $(targets[i]);
              updateImarketWhenSearching(item);
            }
          }
        }
      }
    });
    observer.observe($("div#item-market-main-wrap")[0], {subtree: true, childList: true});
  }
  else if(location.href.indexOf("item.php") !== -1){
    interceptXMLFlag = true;
    observer = new MutationObserver(async (mutationList)=>{
      for(let mut of mutationList){
        for(let node of mut.addedNodes){
          if(node.tagName === "LI" && $(node).attr("data-armoryid")){
            updateItemList($(node));
          }
        }
      }
    });
    observer.observe($("div.items-wrap")[0], {subtree: true, childList: true});
  }
  else if(location.href.startsWith("https://www.torn.com/factions.php?step=your#/tab=armoury")  || location.href.startsWith("https://www.torn.com/factions.php?step=your&type=1#/tab=armoury")){
    interceptXMLFlag = true;
    addStyle();
    observer = new MutationObserver(async (mutationList)=>{
      for(let mut of mutationList){
        for(let node of mut.addedNodes){
          if(node.tagName === "UL" && $(node).hasClass('item-list')){
            const targets = $(node).find('li');
            for(let i = 0; i < targets.length; i++){
              const item = $(targets[i]);
              updateFactionArmoury(item);
            }
          }
        }
      }
    });
    observer.observe($("div#faction-armoury")[0], {subtree: true, childList: true});
  }
  else if(location.href.indexOf("bigalgunshop.php") !== -1){
    interceptXMLFlag = true;
    observer = new MutationObserver(async (mutationList)=>{
      for(let mut of mutationList){
        for(let node of mut.addedNodes){
          if(node.tagName === "LI" && $(node).attr("data-id")){
            updateItemList($(node));
          }
        }
      }
    });
    observer.observe($("div.sell-list-wrap")[0], {subtree: true, childList: true});
    
    $("div.sell-list-wrap li[data-item]:not([data-id=''])").each(function(){
      updateItemList($(this));
    })
  }
  else if(location.href.indexOf("displaycase.php") !== -1){
    interceptXMLFlag = true;
    addStyle();
    observer = new MutationObserver(async (mutationList)=>{
      for(let mut of mutationList){
        for(let node of mut.addedNodes){
          if($(node).hasClass("display-main-page")){
            const targets = $(node).find('ul.display-cabinet li');
            for(let i = 0; i < targets.length; i++){
              const item = $(targets[i]);
              updateCabinet(item);
            }
          }
        }
      }
    });
    observer.observe($("div.content-wrapper")[0], {subtree: true, childList: true});
  }
  else if(location.href.startsWith("https://www.torn.com/bazaar.php?userId=") && ENABLE_BAZAAR_UPDATE){
    interceptXMLFlag = true;
    interceptFetch();
    addStyle();
    let bazaarUpdateInterval = setInterval(()=>{
      if($(`div[class^="imgBar"]`).length > 0){
        clearInterval(bazaarUpdateInterval);
        bazaarUpdateInterval = null;

        observer = new MutationObserver(async (mutationList)=>{
          for(let mut of mutationList){
            for(let node of mut.addedNodes){
              if(node.classList && node.classList.contains("row___LkdFI")){
                updateBazaarInfo();
              }
            }
          }
        });
        observer.observe($("div.ReactVirtualized__Grid__innerScrollContainer")[0], {subtree: true, childList: true});
      }
    }, 500);
  }
  if(interceptXMLFlag){
    interceptXML();
  }
})();