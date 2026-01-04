// ==UserScript==
// @name             Inventory Tracker - grundos.cafe
// @namespace        Firestix
// @match            https://www.grundos.cafe/*
// @exclude          https://www.grundos.cafe/~*
// @exclude          https://www.grundos.cafe/itemview/*
// @grant            GM_log
// @grant            GM_addStyle
// @grant            GM_getValue
// @grant            GM_setValue
// @require https://greasyfork.org/scripts/477480-floatingwindow/code/FloatingWindow.js?version=1270124
// @version          0.0.2
// @author           Firestix
// @license          MIT
// @description Displays the items in your inventory.
// @downloadURL https://update.greasyfork.org/scripts/477722/Inventory%20Tracker%20-%20grundoscafe.user.js
// @updateURL https://update.greasyfork.org/scripts/477722/Inventory%20Tracker%20-%20grundoscafe.meta.js
// ==/UserScript==

GM_addStyle(`
.floatingWindowTitleBar {
  background-color:var(--grid_head);
  padding:2px;
  line-height:20px;
}
#inventory .invItem{
  box-sizing: border-box;
  width:20%;
  opacity:0.5;
  border:1px solid black;
  border-radius:100%
}
#inventory .invItem.hasItem {
  opacity:1;
  border:1px solid green;
}
`);

let invWindow = new FloatingWindow("Inventory");

let url = new URL(document.location.href);

console.log(url);

let isQuestPage = false;
let isCompletePage = false;

switch (url.pathname.toLowerCase()) {
  case "/inventory/":
    refreshInventory();
    break;
  case "/halloween/witchtower/complete/":
  case "/halloween/braintree/complete/":
  case "/halloween/esophagor/complete/":
  case "/winter/snowfaerie/complete/":
  case "/winter/grundo/complete/":
  case "/island/kitchen/complete/":
    isCompletePage = true;
  case "/halloween/witchtower/accept/":
  case "/halloween/witchtower/":
  case "/halloween/esophagor/accept/":
  case "/halloween/esophagor/":
  case "/winter/snowfaerie/accept/":
  case "/winter/snowfaerie/":
  case "/winter/grundo/accept/":
  case "/winter/grundo/":
  case "/island/kitchen/accept/":
  case "/island/kitchen/":
    isQuestPage = true;
    break;
}

if (isCompletePage) {
  let usedItems = document.querySelectorAll("#quest_grid img.border-1:not(img.med-image)");
  console.log(usedItems)
  let inv = GM_getValue("GCInventory",[]);
  for (let item of usedItems) {
    let usedItem = item.src.split("/").at(-1);
    for (let i = 0, ilen = inv.length; i < ilen; i++) {
      console.log(inv[i], usedItem)
      if (inv[i] === usedItem) {
        inv[i] = null;
        break;
      }
    }
  }
  let rewardItems = document.querySelectorAll(".itemList img.med-image");
  for (let item of rewardItems) {
    inv.push(item.src.split("/").at(-1));
  }
  console.log(inv)
  inv = inv.filter(e=>e !== null);
  GM_setValue("GCInventory",inv);
}

populateInventoryList(invWindow);

function populateInventoryList(window){
  let inv = GM_getValue("GCInventory",[]);
  for (let i of inv) {
    let elem = document.createElement("img");
    elem.className = "invItem";
    elem.src = GM_getValue("GCCDNSrc","https://grundoscafe.b-cdn.net/items/") + i;
    if (isQuestPage) {
      let questItemsElems = Array.from(document.querySelectorAll(".itemList img.med-image, #quest_grid img.med-image, .taelia_ingredients input.med-image, .itemList input.med-image, #quest_grid input.med-image, .taelia_ingredients input.med-image")).filter(e=>e.src == elem.src);
      console.log(questItemsElems)
      elem.classList.toggle("hasItem",questItemsElems.length > 0)
    }
    window.body.appendChild(elem);
  }
}

function refreshInventory() {
  let newInv = [];
  let items = document.querySelectorAll(".inventory img.med-image");
  for (let img of items) {
    let imgsrc = img.src.split("/").at(-1);
    newInv.push(imgsrc);
  }
  GM_setValue("GCInventory",newInv);
}