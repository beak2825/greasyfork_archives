// ==UserScript==
// @name             Trading Post Auto Select - grundos.cafe
// @namespace Firestix
// @match            https://www.grundos.cafe/island/tradingpost/createoffer/*
// @match            https://www.grundos.cafe/island/tradingpost/createtrade/
// @grant            GM_addStyle
// @version          1.0
// @author           Firestix
// @license          MIT
// @description Adds autoselection for tradingpost offers.
// @downloadURL https://update.greasyfork.org/scripts/479033/Trading%20Post%20Auto%20Select%20-%20grundoscafe.user.js
// @updateURL https://update.greasyfork.org/scripts/479033/Trading%20Post%20Auto%20Select%20-%20grundoscafe.meta.js
// ==/UserScript==

GM_addStyle(`
.tpSelector {
  padding:10px;
  border:3px solid rgba(127,127,127,0.5);
  margin:5px
}
.tpSelector input {
  width:3em;
}
.tpSelector button:first-child {
  margin-left:0px
}
.tpSelector button {
  margin-left:10px
}
.tpSelector button:last-child {
  margin-left:50px
}
`)

let div = document.querySelector("main form");
let selectorDiv = document.createElement("div");
selectorDiv.appendChild(document.createTextNode("Select: "))
selectorDiv.className = "tpSelector";

let quickAllSelect = document.createElement("button");
quickAllSelect.innerHTML = "All";
quickAllSelect.addEventListener("click",()=>{
  selectItems(true);
});
selectorDiv.appendChild(quickAllSelect);

let quickNSelect = document.createElement("button");
quickNSelect.innerHTML = "This Many:";
let nInp = document.createElement("input");
nInp.type="number";
nInp.value=20;
quickNSelect.addEventListener("click",()=>{
  selectItems(true,nInp.value);
});
selectorDiv.appendChild(quickNSelect);
selectorDiv.appendChild(nInp);

let quickDeselect = document.createElement("button");
quickDeselect.innerHTML = "Deselect All";
quickDeselect.addEventListener("click",()=>{
  selectItems(false);
});
selectorDiv.appendChild(quickDeselect);

div.parentElement.insertBefore(selectorDiv,div)

function selectItems(checked,n) {
  let checks = document.querySelectorAll(".trading_post input[type=checkbox]");
  if (!n) n = checks.length;
  for (let x = 0; x < Math.min(n,checks.length); x++) {
    checks[x].checked = checked;
  }
}