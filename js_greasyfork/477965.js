// ==UserScript==
// @name         easy-market-export-helper
// @namespace    nodelore.torn.easy-market
// @version      1.1
// @description  Export display cabinet and bazaar weapon/armor information by clicking button.
// @author       nodelore[2786679]
// @match        https://www.torn.com/displaycase.php*
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477965/easy-market-export-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/477965/easy-market-export-helper.meta.js
// ==/UserScript==

(function(){
    'use strict';
    //================ Easy-market Configuration =======================
    const API = ""; // Insert your API here (PUBLIC level is fine)

    const STORAGE_KEY = "export_helper_cache"; // You can customize the storage key of local storage
    //==================================================================

    const exportMap = {};
    let storage;
    if (GM) {
      window.GM_getValue = GM.getValue;
      window.GM_setValue = GM.setValue;
  
      window.GM_deleteValue = GM.deleteValue;
    }

    const weaponList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,63,76,98,99,100,108,109,110,111,146,147,170,173,174,175,177,189,217,218,219,223,224,225,227,228,230,231,232,233,234,235,236,237,238,240,241,243,244,245,247,248,249,250,251,252,253,254,255,289,290,291,292,346,359,360,382,387,388,391,393,395,397,398,399,400,401,402,438,439,440,483,484,485,486,487,488,489,490,539,545,546,547,548,549,599,600,604,605,612,613,614,615,632,790,792,805,830,831,832,837,838,839,844,845,846,850,871,874,1053,1055,1056,1152,1153,1154,1155,1156,1157,1158,1159,1231,1255,1257,1296];
    const armorList = [32,33,34,49,50,176,178,332,333,334,348,538,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,848,1307,1308,1309,1310,1311,1355,1356,1357,1358,1359];
    const filterType = ["Melee", "Secondary", "Primary", "Armor"]
    
    const getWeaponInfo = async (armouryID) => {
        if(storage[armouryID]){
            return storage[armouryID];
        }
        else{
            const response = await $.ajax({
                url: `https://api.torn.com/torn/${armouryID}?selections=itemdetails&key=${API}`,
            });
            
            const info = response.itemdetails;
            storage[armouryID] = info;
            await GM.setValue(STORAGE_KEY, storage);
            return info;
        }
    };

    function saveToLocal(result){
        const match = /(\d+)/.exec(location.href);
        if(match){
            const uid = match[1];
            const blob = new Blob([result], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
          
            const a = document.createElement("a");
            a.href = url;
            a.download = `${uid}_display.txt`; 
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        }

    }

    function resortExportMap(){
        const bonusMap = {};
        for(let armouryID in exportMap){
            const item = exportMap[armouryID];
            let defaultBonus = 'None';
            if(item.bonus){
                defaultBonus = item.bonus[0].name;
            }
            if(!bonusMap[defaultBonus]){
                bonusMap[defaultBonus] = [];
            }
            bonusMap[defaultBonus].push(item);
        }
        return bonusMap;
    }

    function exportMapDownload(){
        let output = "";
        let index = 1;

        // sort information by bonus
        const bonusMap = resortExportMap();
        for(let bonus in bonusMap){
            const bonusList = bonusMap[bonus];
            for(let item of bonusList){
                const {name, damage, accuracy, armor, quality, bonus, rarity, price} = item;
                output += `${index}.${name} (`;
                if(damage){
                    output += `D: ${damage} A: ${accuracy}`;
                }
                else{
                    output += `A: ${armor}`;
                }
                output += `) - `;
                if(bonus){
                    for(let b of bonus){
                        output += `${b.name} ${b.value}|`
                    }
                }
                output += `${quality}%`
                if(rarity != 'None'){
                    output += ` ${rarity}`
                }
    
                if(price){
                    output += ` ${parseInt(price).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                    })}`;
                }
                output += `\n`
                index++;
            }
        }
        if(output.length > 0){
            saveToLocal(output);
        }
        else{
            alert("Detect no weapons or armors!")
        }
    }

    function interceptButton(){
        let target = $(".info-msg");
        if(target.length < 1){
            target = $('div.msg');
        }
        if(target.length < 1) return;
        if(target.find("div.torn-btn").length > 0) {
            return;
        }
        const button = $(`
        <div class="torn-btn"
            style="z-index: 1; margin-right: 5px;">
                Export Weapon/Armor
        </div>`);
        button.click(exportMapDownload);
        target.append(button);
    }

    const handlePercentage = (desc, value) => {
        const index = desc.indexOf(value);
        if(desc[index + value.toString().length] === '%'){
          return `${value}%`
        }
        return value;
    }
    
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
            return;
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
            if(armouryID === "0" || exportMap[armouryID]){
                return;
            }
            const itemdetail = await getWeaponInfo(armouryID);
            if(itemdetail){
                const { name, damage, accuracy, quality, armor, bonuses, rarity } = itemdetail;
                if(item.find('top-bonuses').length > 0){
                    return;
                }
                const qualityItem = $(`<div class='top-bonuses'>Q:${quality}%</div>`);
                qualityItem.css({
                    position: 'absolute',
                    left: '15px',
                    top: '35px',
                    'z-index': 2,
                    background: '#FFF',
                    'border-radius': '7px'
                });
                item.append(qualityItem);

                const exportItem = {};
                exportItem['name'] = name;
                exportItem['quality'] = quality;
                exportItem['rarity'] = rarity;
                if(bonuses){
                    if(!exportItem['bonus']){
                        exportItem['bonus'] = [];
                    }
                    for(let bonus_id in bonuses){
                        const bonus_item = bonuses[bonus_id];
                        const {bonus, value, description} = bonus_item; 
                        const valueStr = handlePercentage(description, value);
                        exportItem['bonus'].push({
                            name: bonus,
                            value: valueStr
                        });
                    }
                }
                
                // weapon
                if(iType === 1){
                    exportItem['damage'] = damage;
                    exportItem['accuracy'] = accuracy;
                }
                // armor
                else if(iType === 2){
                    exportItem['armor'] = armor;
                }
    
                exportMap[armouryID] = exportItem;
    
                interceptButton();
            }

        }
    }

    const handleBazaar = (resp)=>{
        const bazaarList = resp.list;
        if(bazaarList){
            for(let item of bazaarList){
                let {name, armoryID, itemID, accuracy, damage, arm, currentBonuses, quality, rarity, category, price} = item;
                if(!itemID) continue;
                itemID = parseInt(itemID);
                const iType = itemType(itemID);
                if(filterType.indexOf(category) === -1) continue;
                if(exportMap[armoryID]) continue;

                const exportItem = {};

                exportItem['name'] = name;
                exportItem['quality'] = quality;
                exportItem['price'] = price;
                rarity = parseInt(rarity);
                switch(rarity){
                    case 0:
                        exportItem['rarity'] = 'None';
                        break;
                    case 1:
                        exportItem['rarity'] = 'Yellow';
                        break;
                    case 2:
                        exportItem['rarity'] = 'Orange';
                        break;
                    case 3:
                        exportItem['rarity'] = 'Red';
                        break;
                }


                if(currentBonuses){
                    if(!exportItem['bonus']){
                        exportItem['bonus'] = [];
                    }
                    for(let bonus_id in currentBonuses){
                        const bonus_item = currentBonuses[bonus_id];
                        const {title, value, desc} = bonus_item; 
                        const valueStr = handlePercentage(desc, value);
                        exportItem['bonus'].push({
                            name: title,
                            value: valueStr
                        });
                    }
                }

                if(iType === 1){
                    exportItem['damage'] = damage;
                    exportItem['accuracy'] = accuracy;
                }
                else if(iType === 2){
                    exportItem['armor'] = arm;
                }

                exportMap[armoryID] = exportItem;

                interceptButton();
            }
        }
    }

    function interceptFetch() {
        const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const origFetch = targetWindow.fetch;
        targetWindow.fetch = async (...args) => {
          const rsp = await origFetch(...args);
          const url = new URL(args[0], location.origin);
          const params = new URLSearchParams(url.search);
          // If a request is sent to get bazaarData, we capture and clone it to update the page
          
          if (url.pathname === '/bazaar.php' && params.get('sid') === 'bazaarData') {
            const clonedRsp = rsp.clone();
            const resp = await clonedRsp.json();
            handleBazaar(resp);
          }
    
          return rsp;
        };
    }

    waitForKeyElements('ul.display-cabinet li', updateCabinet);
    if(location.href.startsWith("https://www.torn.com/bazaar.php?userId=")){
        interceptFetch();
      }
})();

function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
  ) {
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents().find(selectorTxt);
  
    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      /*--- Found target node(s).  Go through each and act if they
            are new.
        */
      targetNodes.each(function () {
        var jThis = $(this);
        var alreadyFound = jThis.data("alreadyFound") || false;
  
        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound) btargetsFound = false;
          else jThis.data("alreadyFound", true);
        }
      });
    } else {
      btargetsFound = false;
    }
  
    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];
  
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey];
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function () {
          waitForKeyElements(
            selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        }, 500);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }