// ==UserScript==
// @name         Item Stats Collector
// @namespace    namespace
// @version      0.4
// @description  description
// @author       tos
// @match       *.torn.com/item.php*
// @match       *.torn.com/bazaar.php*
// @match       *.torn.com/displaycase.php*
// @match       *.torn.com/imarket.php*
// @match       *.torn.com/amarket.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/387771/Item%20Stats%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/387771/Item%20Stats%20Collector.meta.js
// ==/UserScript==

const item_RE = new RegExp('armouryID=([0-9]{1,})')

$( document ).ajaxSend(function(event, jqXHR, ajaxObj) {
  if (ajaxObj.url.includes('inventory.php')) {
    const has_armouryID = ajaxObj.data.match(item_RE)
    if (has_armouryID && has_armouryID[1]) {
      const armouryID = parseInt(has_armouryID[1])
      jqXHR.then((r) => {
        const rjson = JSON.parse(r)
        on_item(armouryID, rjson)
      })
    }
  }
})

function on_item(armouryID, res) {
  const t = parseInt(Date.now()/1000)
  let modded = false
  let item = {
    armoury_id: armouryID,
    item_id: res.itemID,
    damage: null,
    accuracy: null,
    defense: null,
    last_seen: t
  }
  res.extras.forEach((extra) => {
    //console.log(extra)
    if (extra.title.toUpperCase() === 'DAMAGE') {
      item.damage = round(extra.value, 2)
    }
    else if (extra.title.toUpperCase() === 'ACCURACY') {
      item.accuracy = round(extra.value, 2)
    }
    else if (extra.title.toUpperCase() === 'ARMOR' || extra.title.toUpperCase() === 'ARMOUR') {
      item.defense = round(extra.value, 2)
    }
    else if (extra.title.toUpperCase() === 'MOD') {
      modded = true
    }
  })
  //console.log(!modded, (item.damage !== null || item.accuracy !== null || item.defense !== null), item)
  if (!modded && (item.damage !== null || item.accuracy !== null || item.defense !== null)) submit_stats(item).then((r) => {
    //console.log(r.responseText)
  })
}

async function submit_stats(item_stats) {
  //console.log(item_stats)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://39th.xyz/torn/armoury/submit.php',
      headers:{
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(item_stats),
      onabort: (err) => { reject(err) },
      onerror: (err) => { reject(err) },
      onload: (res) => { resolve(res) }
    })
  })
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}





