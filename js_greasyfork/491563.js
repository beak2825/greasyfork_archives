// ==UserScript==
// @name             April Fools Ads - grundos.cafe
// @namespace        Firestix
// @match            https://www.grundos.cafe/*
// @grant            GM_log
// @grant            GM_addStyle
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_registerMenuCommand
// @grant            GM_unregisterMenuCommand
// @version          1.0.1
// @author           Firestix
// @license          MIT
// @run-at document-start
// @description Restores the ads from the 2024 april fools prank
// @downloadURL https://update.greasyfork.org/scripts/491563/April%20Fools%20Ads%20-%20grundoscafe.user.js
// @updateURL https://update.greasyfork.org/scripts/491563/April%20Fools%20Ads%20-%20grundoscafe.meta.js
// ==/UserScript==

GM_addStyle(`
#advert-header{
  height: 93px;
}
`);

function registerAutoRefreshCommand(enabled) {
  GM_unregisterMenuCommand(`${enabled ? "Enable" : "Disable"} Ads`);
  GM_registerMenuCommand(`${enabled ? "Disable" : "Enable"} Ads`,()=>{
    GM_setValue("GCAdEnable", !enabled);
    registerAutoRefreshCommand(!enabled);
  });
}

registerAutoRefreshCommand(GM_getValue("GCAdEnable", true));

GM_registerMenuCommand("Force Refresh Ad Database",()=>{
  if (confirm("Are you sure you want to refresh the label database?")) {
    GM_setValue("GCAdListForceRefresh",true);
  }
});
(async function () {
  if (!GM_getValue("GCAdEnable", true)) return;
  let databaseList = GM_getValue("GCAdDatabaseList", false);
  if (!databaseList) {
    databaseList = "https://pastebin.com/raw/5egym4tE";
    GM_setValue("GCAdDatabaseList",databaseList);
  }
  let json = GM_getValue("GCAdList", false);
  if (!json || GM_getValue("GCAdListForceRefresh", true)) {
    if(!json) {
      json = [];
      GM_log("Initializing ad list database (this should only happen once)");
    }
    GM_log(`Fetching data from ${databaseList}`);
    json = await fetch(databaseList,{cache: "no-store"}).then(res=>res.json());
    GM_log(`Found ${json.length} items(s)`);
    GM_setValue("GCAdList",json);
    GM_setValue("GCAdListForceRefresh",false);
  }
  let adData = json[Math.floor(Math.random()*json.length)];

  let adHeader = document.createElement("div");
  adHeader.id = "advert-header";
  let adImg = document.createElement("img");
  adImg.src = `https://grundoscafe.b-cdn.net/bannerads${adData.advert.img}`;
  let adLink = document.createElement("a");
  adLink.href = `http://www.grundos.cafe${adData.advert.url}`;
  adLink.appendChild(adImg);
  adHeader.appendChild(adLink);
  new MutationObserver(function() {
    let elem = document.getElementsByTagName('div')[0];
    if (elem && elem.id == "container") {
      elem.appendChild(adHeader);
      this.disconnect();
    }
  }).observe(document, {childList: true, subtree: true});
})();