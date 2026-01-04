// ==UserScript==
// @name         IQRPG Trinket Companion
// @namespace    https://www.iqrpg.com/
// @version      0.1.0
// @author       Tempest
// @description  QoL enhancement for IQRPG Tinket
// @homepage     https://slyboots.studio/iqrpg-trinket-companion/
// @source       https://github.com/SlybootsStudio/iqrpg-trinket-companion
// @match        https://*.iqrpg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @license      unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498994/IQRPG%20Trinket%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/498994/IQRPG%20Trinket%20Companion.meta.js
// ==/UserScript==

/* global $ */

//-----------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------

const RENDER_DELAY = 100; // Delay for modifying the page.

/**
 * Used to debounce DOM modifications
 */
let loadTrinketsOnce = false;


function addTrinketHeader(ele) {
  $("<td class='text-rarity-1' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>TRINKET</td>").insertBefore(ele);
  $("<td class='text-rarity-6' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Base</td>").insertBefore(ele);
  $("<td class='text-rarity-5' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Boost</td>").insertBefore(ele);
  $("<td class='text-rarity-4' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Drop</td>").insertBefore(ele);
  $("<td class='text-rarity-3' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Shards</td>").insertBefore(ele);
  $("<td class='text-rarity-3' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Exp</td>").insertBefore(ele);
  $("<td class='text-rarity-2' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Double</td>").insertBefore(ele);
  $("<td class='text-rarity-2' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Mastery</td>").insertBefore(ele);
  $("<td class='text-rarity-1' style='border-bottom:1px solid #999;margin-bottom:3px; padding-bottom: 3px;'>Rarity</td>").insertBefore(ele);
}

const meta = {
  BASE_RESOURCE : {
    key : 16,
    modifier : 10,
    min: 1.5,
    max: 2.5,
  },
  RESOURCE_BOOST : {
    key : 12,
    modifier : 10,
      suffix : "%",
    min: 0.4,
    max: 0.9,
  },
  DROP_BOOST : {
    key : 14,
    modifier : 10,
      suffix : "%",
    min: 0.4,
    max: 0.9,
  },
  EXPERIENCE : {
    key : 11,
    modifier : 10,
      suffix : "%",
    min: 0.9,
    max: 1.8,
  },
  RARITY : {
    key : 17,//14,
    modifier : 10,
      suffix : "%",
    min: 0.2,
    max: 0.4,
  },
  DOUBLE : {
    key : 18, //13,
    modifier : 10,
      suffix : "%",
    min: 1.5,
    max: 2.5,
  },
  MASTERY : {
    key : 13, //5,
    modifier : 10,
      suffix : "%",
    min: 1.5,
    max: 2.5,
  },
  SHARDS : {
    key : 15,//8,
    modifier : 10,
      suffix : "%",
    min: 1.5,
    max: 2.5
  }

    /*SHARDS : {
    key : 16
    modifier : 10,
      suffix : "%"

      */

};


function getMetaValue( meta, trinket) {

  let mods = trinket.mods.filter( e => e[0] == meta.key);

  if(mods.length) {
      let value = mods[0][1];
      if(meta.modifier) {
          value = value / meta.modifier;
      }
    return value;
  }



  return "";
}

function getRarityMultiplier(rarity) {
     switch(rarity) {
          case 7: // red
          case 6: // orange
              multiplier = 1.6;
              break;

          case 5: // orange
              multiplier = 1.35;
              break;

          case 4: // yellow
              multiplier = 1.15;
              break;

          default:
              multiplier = 1;
              break;
      }

    return multiplier;
}

function addTrinketMeta(ele, trinket) {
  console.log(trinket);

  let stats = [meta.RARITY,
               meta.MASTERY,
               meta.DOUBLE,
               meta.EXPERIENCE,
               meta.SHARDS,meta.DROP_BOOST, meta.RESOURCE_BOOST, meta.BASE_RESOURCE];

  stats.forEach(stat => {

      const baseAmount = getMetaValue(stat, trinket );

      let multiplier = getRarityMultiplier(trinket.rarity);



      if(baseAmount) {
          // 0% (roll Min) to 100% (rollMax) of what the baseAmount is
          const normalAmount = ((baseAmount - stat.min) / (stat.max - stat.min) * 100).toPrecision(3);
          const rarityAmount = (baseAmount * multiplier).toPrecision(3);
          // Red        MAX
          // Orange     90
          // Yellow     80
          // Blue       70
          // Green      60
          // White      50 or below.
          const range = Math.round((normalAmount - 50)/ 10) + 1;

          let value = rarityAmount;

          $(`<td class='text-rarity-${range}'>${rarityAmount}${stat?.suffix || ''}</td>`).insertAfter(ele);
      } else {
          $(`<td class=''></td>`).insertAfter(ele);
      }

  });
}



function onReadyStateChangeReplacement(e) {
    //
    // This is called anytime there is an action complete, or a view (page) loads.
    setTimeout( () => {
        /**
         * Personnel page.
         */
        if(e.responseURL.includes("php/equipment.php?mod=loadTrinkets")) {
            if(e.response && !loadTrinketsOnce) {

                loadTrinketsOnce = true;


                const trinkets = JSON.parse(e.response).trinkets;
                let t = $('.table-invisible', '.main-section__body')[2];

                if(!t) {
                    return;
                }

                let trs = $('tr', t);

                addTrinketHeader(trs[0]);

                for( let x = 0; x < trs.length; x += 1 ) {
                    let tr = trs[x];
                    let tds = $('td', tr);
                    let td = tds[0];

                    if(trinkets[x].equipped || 1) {
                    addTrinketMeta(td, trinkets[x]);
                    }

                    let html = $('p', td).html();
                    $(tds).not(':first').hide();

                    //if(response[x].rarity < 4) {
                    //    $('p', td).html(html.replace('Gathering Trinket', 'Nice Frags'));
                    //} else {

                    if(html.includes('Battling')) {
                        $(tr).hide();
                    } else {
                    $('p', td).html(html.replace('Trinket', ''));
                    // Give guidance to the user when to upgrade, reroll, or destroy.
                    }
                    // TODO - Get more data on what is important for battling
                }

            }
        } else {
            loadTrinketsOnce = false;
        }

    }, RENDER_DELAY );
}




//-----------------------------------------------------------------------
// HTTP Request Override -- DO NOT EDIT
//-----------------------------------------------------------------------

let send = window.XMLHttpRequest.prototype.send;

function sendReplacement() {
    let old = this.onreadystatechange;

    this.onreadystatechange = () => {
        onReadyStateChangeReplacement(this);
        if(old) {
            old();
        }
    }

    return send.apply(this, arguments);
}

window.XMLHttpRequest.prototype.send = sendReplacement;